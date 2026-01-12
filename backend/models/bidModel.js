const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gigId: { type: mongooseSchema.Types.ObjectId, ref: 'Gig' },
    message: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'hired', 'rejected'], default: 'pending' },
}, { collection: 'bid'}, { timestamps: true });

module.exports = mongoose.model('Bid', bidSchema);