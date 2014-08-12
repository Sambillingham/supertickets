var Ticket = require("../models/ticket"),
    config = require("../config"),
    passport = require('passport'),
    htmlToText = require('nodemailer-html-to-text').htmlToText;
    util = require('../modules/util'),
    mailer = require('../modules/mailer');


var applicationController = {

    index: function (req, res) {

        res.render('index', {
            title: 'Home',
            user : req.user,
            messages: req.flash('success')
        });
    },

    addTicket: function(req, res) {

        var ticketDetails = [
            {   description: req.body.details,
                admin: false
            }];

        var newTicket = new Ticket({
            id: util.randomString(64),
            title: req.body.title,
            details: ticketDetails,
            userEmail: req.body.email,
            status: 'pending'
        });

        newTicket.save(function (err, newTicket) {
            if (err) throw error;

            console.log('EMAIL: %s', newTicket.userEmail);

            mailer.transporter.use('compile', htmlToText());
            mailer.transporter.sendMail({
                from: config.email.from,
                to: newTicket.userEmail,
                subject: 'Your ticket on ' + config.name,
                html: '<h2>Supertickets</h2><p>You new ticket can be viewed at http://localhost:3000/ticket/'+ newTicket.id + '</p>'
            });

            req.flash('success', 'You added a ticket to the database');
            res.render("index", {
                title: "Home",
                user : req.user,
                messages: req.flash('success')
            });
        });
    },

    viewTicket: function(req, res){

        var ticketID = req.params.id;

        Ticket.findOne({id : ticketID }, function (err, ticket) {

            if (err) throw error;

            console.log(ticket);
            res.render("ticket", {
                title: ticket.title,
                ticket: ticket
            });
        });

    },

    updateTicket: function(req, res){

        var isAdmin = false;

        if (req.isAuthenticated()){
            isAdmin = true;
        }

        var ticketID = req.params.id;

        var extraDetails = {
                description: req.body.details,
                admin: isAdmin
            };

        Ticket.findOne({id : ticketID }, function (err, ticket) {

            if (err) throw error;

            var currentDetails = ticket.details;

            currentDetails = currentDetails.push(extraDetails);

            ticket.save(function (err, ticket) {

                res.render("ticket", {
                    title: ticket.title,
                    ticket: ticket
                });

            });
        });
    },

    dashboard: function (req, res) {

        Ticket.find(function (err, allTickets) {
            if (err) throw error;

            console.log(allTickets);

            res.render("dashboard", {
                title: "Dashboard",
                tickets: allTickets
            });
        });
    },

    remove: function (req, res){

        Ticket.find().remove().exec();

    }
};

module.exports = applicationController;