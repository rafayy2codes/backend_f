import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['freelancer', 'client'], required: true },
    freelancerDetails: {
        level: {
            type: String,
            default: 'Beginner',
            enum: [
                'Beginner', 'Advanced', 'Expert', 'Master', 'Grandmaster',
                'Immortal', 'Ancestral', 'Legend', 'Arcana'
            ]
        },
        levelNumber: {
            type: Number,
            default: 1,
            min: 1,
            max: 8
        },
        projectsCompleted: { type: Number, default: 0 },
        skills: [String],
        bio: { type: String, maxlength: 300 },
        hourlyRate: { type: Number },
        picture: { type: String },
        idCard: { type: String }
    },
    clientDetails: {
        companyName: { type: String },
        contactPerson: { type: String },
        picture: { type: String },
        idCard: { type: String }
    },
}, { timestamps: true });

// Method to update the freelancer level
UserSchema.methods.updateLevel = async function () {
    const completedProjects = this.freelancerDetails.projectsCompleted;

    if (completedProjects >= 800) {
        this.freelancerDetails.level = 'Arcana'; // 800+ projects
        this.freelancerDetails.levelNumber = 8;
    } else if (completedProjects >= 600) {
        this.freelancerDetails.level = 'Immortal'; // 600+ projects
        this.freelancerDetails.levelNumber = 7;
    } else if (completedProjects >= 500) {
        this.freelancerDetails.level = 'Ancestral'; // 500+ projects
        this.freelancerDetails.levelNumber = 6;
    } else if (completedProjects >= 400) {
        this.freelancerDetails.level = 'Legend'; // 400+ projects
        this.freelancerDetails.levelNumber = 5;
    } else if (completedProjects >= 300) {
        this.freelancerDetails.level = 'Elite'; // 300+ projects
        this.freelancerDetails.levelNumber = 4;
    } else if (completedProjects >= 200) {
        this.freelancerDetails.level = 'Grandmaster'; // 200+ projects
        this.freelancerDetails.levelNumber = 3;
    } else if (completedProjects >= 100) {
        this.freelancerDetails.level = 'Master'; // 100+ projects
        this.freelancerDetails.levelNumber = 2;
    } else if (completedProjects >= 75) {
        this.freelancerDetails.level = 'Expert'; // 75+ projects
        this.freelancerDetails.levelNumber = 1;
    } else if (completedProjects >= 35) {
        this.freelancerDetails.level = 'Advanced'; // 35+ projects
        this.freelancerDetails.levelNumber = 0; // Can be adjusted if needed
    } else {
        this.freelancerDetails.level = 'Beginner'; // 0 projects
        this.freelancerDetails.levelNumber = 0;
    }

    await this.save();
};

const User = mongoose.model('User', UserSchema);

export default User;
