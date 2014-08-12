var Ticket = require("../models/ticket"),
    passport = require('passport'),
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
            status: 'pending'
        });

        newTicket.save(function (err, newTicket) {
            if (err) throw error;

            mailer.transporter.sendMail({
                from: 'lolcat@gmail.com',
                to: 'lolcat@gmail.com',
                subject: 'hello',
                text: 'hello world!'
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

    list: function (req, res) {

        Ticket.find(function (err, allTickets) {
            if (err) throw error;

            console.log(allTickets);

            res.render("dashboard", {
                title: "Dashboard",
                tickets: allTickets
            });
        });
    }
};

module.exports = applicationController;