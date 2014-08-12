var nodemailer = require('nodemailer'),
    config = require('../config');

module.exports.transporter = nodemailer.createTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
});