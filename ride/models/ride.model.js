const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    captain: {
        type: mongoose.Schema.Types.ObjectId, // Fixed typo in Type
        ref: 'Captain', // Reference to the Captain collection (optional, based on your design)
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Fixed typo in Type
        ref: 'User', // Reference to the User collection
        required: true,
    },
    pickup: {
        type: String,
        required: true,
    },
    destination: { // Fixed typo in destination
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['requested', 'accepted', 'started', 'completed'],
        default: 'requested',
    },
});

module.exports = mongoose.model('Ride', rideSchema);
