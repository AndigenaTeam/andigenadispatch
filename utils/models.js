const mongoose = require('mongoose')

module.exports = {
    /**
     * Construct the roles collection schema.
     */
    roleSchema() {
        return new mongoose.Schema({
            role_id: { type: String, index: true, unique: true },
            name: { type: String, min: 5, max: 30, index: true, unique: true },
            prefix: { type: String },
            created_by: { type: String },
            permissions: {type: Array, default: []}
        });
    },
}