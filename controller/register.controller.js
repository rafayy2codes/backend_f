import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const saltRounds = 10;

export const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;


    if (!username || !email || !password || !role) {
        return res.status(400).json({
            message: "Username, email, password, and role are required",
            success: false
        });
    }


    if (role !== 'freelancer' && role !== 'client') {
        return res.status(400).json({
            message: "Invalid role. Must be 'freelancer' or 'client'",
            success: false
        });
    }

    try {

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use",
                success: false
            });
        }


        const hashedPassword = await bcrypt.hash(password, saltRounds);


        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });


        await newUser.save();


        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                freelancerDetails: newUser.freelancerDetails,
                clientDetails: newUser.clientDetails
            }
        });

    } catch (error) {
        console.error("Error registering user:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};




export const login = async (req, res) => {
    try {
        const { username, password } = req.body;


        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required",
                success: false
            });
        }


        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect username or password",
                success: false
            });
        }


        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect username or password",
                success: false
            });
        }


        const tokenData = {
            userId: user._id,
            username: user.username,
            role: user.role
        };


        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });


        return res.status(200)
            .cookie("token", token, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict"
            })
            .json({
                message: "Login successful",
                success: true,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token
                }
            });

    } catch (error) {
        console.error("Error logging in user:", error.message);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logout successful",
            success: true,
        })
    } catch (error) {

    };
};






export const updateFreelancerDetails = async (req, res) => {
    const userId = req.user.id;
    const { skills, bio, hourlyRate } = req.body;


    if (!skills, !bio, !hourlyRate) {
        return res.status(400).json({
            message: "All freelancer details are required",
            success: false
        });
    }

    try {

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'freelancerDetails.skills': skills,
                    'freelancerDetails.bio': bio,
                    'freelancerDetails.hourlyRate': hourlyRate
                }
            },
            { new: true }
        );


        return res.status(200).json({
            message: "Freelancer details updated successfully",
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating freelancer details:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
export const updateClientDetails = async (req, res) => {
    const userId = req.user.userId;
    const { companyName, contactPerson, picture, idCard } = req.body;


    if (!companyName || !contactPerson || !picture || !idCard) {
        return res.status(400).json({
            message: "All client details are required",
            success: false
        });
    }

    try {

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'clientDetails.companyName': companyName,
                    'clientDetails.contactPerson': contactPerson,
                    'clientDetails.picture': picture,
                    'clientDetails.idCard': idCard
                }
            },
            { new: true }
        );


        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }


        return res.status(200).json({
            message: "Client details updated successfully",
            success: true,
            user: updatedUser
        });

    } catch (error) {
        console.error("Error updating client details:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


export const completeProject = async (req, res) => {
    const { projectId } = req.params;
    const freelancerId = req.user.userId; // Assume userId is from authentication middleware

    try {
        // Find the project and ensure it's the freelancer who is completing it
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found", success: false });
        }

        if (project.status !== 'in-progress') {
            return res.status(400).json({ message: "Project is not in progress", success: false });
        }

        // Update project status to 'completed'
        project.status = 'completed';
        await project.save();

        // Find freelancer and update their completed projects count
        const freelancer = await User.findById(freelancerId);
        if (!freelancer || freelancer.role !== 'freelancer') {
            return res.status(403).json({ message: "Only freelancers can complete projects", success: false });
        }

        freelancer.freelancerDetails.projectsCompleted += 1;
        await freelancer.updateLevel(); // Update level based on completed projects
        await freelancer.save();

        return res.status(200).json({
            message: "Project marked as completed and freelancer level updated",
            success: true,
            freelancer
        });
    } catch (error) {
        console.error("Error completing project:", error.message);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};