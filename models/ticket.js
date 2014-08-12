var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ticketSchema = new Schema({
    id: String,
    title: String,
    details: Array,
    userEmail: String,
    status: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);