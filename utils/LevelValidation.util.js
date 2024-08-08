// src/utils/updateFreelancerLevel.js
const User = require('../models/user.model.js');

async function updateFreelancerLevel(userId) {
    try {
        const user = await User.findById(userId);

        if (user.role !== 'freelancer') {
            throw new Error('User is not a freelancer');
        }

        const levels = [1, 2, 3, 4, 5, 6, 7, 8];
        const maxLevel = levels.length;


        let newLevel = Math.min(Math.floor(user.freelancerDetails.projectsCompleted / 25) + 1, maxLevel);


        user.freelancerDetails.level = newLevel;
        await user.save();
    } catch (error) {
        console.error('Error updating freelancer level:', error);
    }
}

module.exports = updateFreelancerLevel;
