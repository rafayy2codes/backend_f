import Project from '../models/project.model.js';
import User from '../models/user.model.js';
import Bid from '../models/Bid.model.js'
import checkFreelancerEligibility from '../utils/EligibilityValidation.js';

export const postProject = async (req, res) => {
    const { title, description, levelRequired, skillsRequired } = req.body;
    const clientId = req.user.userId;


    if (!title || !description || levelRequired === undefined || !skillsRequired) {
        return res.status(400).json({
            message: "Title, description, level required, and skills required are required",
            success: false
        });
    }


    const validLevels = [1, 2, 3, 4, 5, 6, 7, 8];
    if (!validLevels.includes(levelRequired)) {
        return res.status(400).json({
            message: "Invalid level required. Must be between 1 and 8",
            success: false
        });
    }

    try {

        const client = await User.findById(clientId);
        if (!client) {
            return res.status(404).json({
                message: "Client not found",
                success: false
            });
        }

        if (client.role !== 'client') {
            return res.status(403).json({
                message: "Only clients can post projects",
                success: false
            });
        }


        const newProject = new Project({
            title,
            description,
            levelRequired,
            client: clientId,
            skillsRequired,
        });


        await newProject.save();


        return res.status(201).json({
            message: "Project posted successfully",
            success: true,
            project: newProject
        });

    } catch (error) {
        console.error("Error posting project:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const postBid = async (req, res) => {
    const { projectId, bidAmount, message } = req.body;
    const freelancerId = req.user.userId;


    if (!projectId || !bidAmount) {
        return res.status(400).json({
            message: "Project ID and bid amount are required",
            success: false
        });
    }

    try {

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }


        const isEligible = await checkFreelancerEligibility(freelancerId, projectId);
        if (!isEligible) {
            return res.status(403).json({
                message: "Freelancer is not eligible to bid on this project",
                success: false
            });
        }


        const existingBid = await Bid.findOne({ freelancer: freelancerId, project: projectId });
        if (existingBid) {
            return res.status(400).json({
                message: "Freelancer has already placed a bid on this project",
                success: false
            });
        }


        const newBid = new Bid({
            freelancer: freelancerId,
            project: projectId,
            bidAmount,
            message
        });


        await newBid.save();


        project.freelancersBids.push({
            freelancer: freelancerId,
            bidAmount,
            message
        });
        await project.save();


        return res.status(201).json({
            message: "Bid posted successfully",
            success: true,
            bid: newBid
        });

    } catch (error) {
        console.error("Error posting bid:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const completeProject = async (req, res) => {
    const { projectId } = req.params;
    const freelancerId = req.user.userId;

    try {

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Project not found",
                success: false
            });
        }


        const bid = project.freelancersBids.find(bid => bid.freelancer.toString() === freelancerId.toString());
        if (!bid) {
            return res.status(403).json({
                message: "Freelancer did not bid on this project",
                success: false
            });
        }


        project.status = 'completed';
        await project.save();


        const freelancer = await User.findById(freelancerId);
        if (freelancer) {
            freelancer.freelancerDetails.projectsCompleted += 1;
            await freelancer.save();


            await updateFreelancerLevel(freelancerId);
        }

        return res.status(200).json({
            message: "Project marked as completed and freelancer level updated",
            success: true
        });

    } catch (error) {
        console.error("Error completing project:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};