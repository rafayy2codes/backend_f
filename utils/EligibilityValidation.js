import User from "../models/user.model.js";
import Project from "../models/project.model.js";

async function checkFreelancerEligibility(freelancerId, projectId) {
    try {
        const freelancer = await User.findById(freelancerId);
        const project = await Project.findById(projectId);

        if (!freelancer) {
            throw new Error('Freelancer not found');
        }

        if (!project) {
            throw new Error('Project not found');
        }

        if (freelancer.role !== 'freelancer') {
            throw new Error('User is not a freelancer');
        }

        if (freelancer.freelancerDetails.levelNumber < project.levelRequired) {
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error checking freelancer eligibility:', error);
        return false;
    }
}

export default checkFreelancerEligibility;
