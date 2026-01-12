const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    status: { type: String, enum: ['open', 'assigned'], default: 'open' },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
}, { collection: 'gig'}, { timestamps: true });

module.exports = mongoose.model('Gig', gigSchema);