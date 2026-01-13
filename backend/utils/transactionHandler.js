const mongoose = require('mongoose');

/**
 * Execute a transaction with automatic session management
 * @param {Function} callback - Async function that receives the session
 * @returns {Promise} - Result of the callback
 */
const executeTransaction = async (callback) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const result = await callback(session);
        await session.commitTransaction();
        return result;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        await session.endSession();
    }
};

module.exports = { executeTransaction };