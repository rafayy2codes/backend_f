// src/models/Project.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    levelRequired: { type: Number, required: true, min: 1, max: 8 }, // Level required to bid
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the client
    freelancersBids: [{
        freelancer: { type: Schema.Types.ObjectId, ref: 'User' },
        bidAmount: { type: Number },
        message: { type: String }
    }],
    status: { type: String, enum: ['open', 'in-progress', 'completed', 'closed'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

export default Project;