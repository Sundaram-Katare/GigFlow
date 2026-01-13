const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: { type: String, enum: ['open', 'assigned'], default: 'open' },
    hiredFreelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Track who is hired
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
    version: { type: Number, default: 0 }, // Optimistic locking
}, { collection: 'gig'}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);