var Ticket = require("../models/ticket"),
    config = require("../config"),
    passport = require('passport'),
    htmlToText = require('nodemailer-html-to-text').htmlToText;
    util = require('../modules/util'),
    mailer = require('../modules/mailer'),
    marked = require('marked');


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
            {   description: marked(req.body.details),
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

        var isAdmin = false,
            status = 'open-admin',
            ticketID = req.params.id;

        if (req.isAuthenticated()){
            isAdmin = true;
            status = 'open-user';
        }

        var extraDetails = {
                description: marked(req.body.details),
                admin: isAdmin,
            };

        Ticket.findOne({id : ticketID }, function (err, ticket) {

            if (err) throw error;

            ticket.details.push(extraDetails);
            ticket.status = status;

            ticket.save(function (err, ticket) {

                res.render("ticket", {
                    title: ticket.title,
                    ticket: ticket
                });

            });
        });
    },

    closeTicket: function (req, res) {

        var query = {id : req.params.id },
            updateValue = { status: 'closed' }

        Ticket.update( query, updateValue, function (err, updated) {

            if (err) throw error;

            res.redirect('/ticket/' + req.params.id);
        });
    },

    dashboard: function (req, res) {

        Ticket.find(function (err, allTickets) {
            if (err) throw error;

            console.log(allTickets);

            res.render("dashboard", {
                title: "Dashboard",
                tickets: allTickets,
                messages: req.flash('success')
            });
        });
    },

    remove: function (req, res){

        Ticket.find().remove().exec();

    }
};

module.exports = applicationController;