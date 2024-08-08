
import mongoose from 'mongoose';
const { Schema } = mongoose;


const BidSchema = new Schema({
    freelancer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    bidAmount: { type: Number, required: true },
    message: { type: String },
    status: { type: String, enum: ['submitted', 'accepted', 'rejected'], default: 'submitted' },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Bid = mongoose.model('Bid', BidSchema);

export default Bid;