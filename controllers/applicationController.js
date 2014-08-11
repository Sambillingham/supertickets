var Ticket = require("../models/ticket"),
    passport = require('passport');


var applicationController = {

    index: function (req, res) {
        res.render('index', {
            title: 'Home',
            user : req.user,
            messages: req.flash('success')
        });
    },

    addTicket: function(req, res) {

        var ticketDetails = [{
                description: req.body.details,
                admin: false
            }];

        var newTicket = new Ticket({
            id: 'ABCDEF' + Math.floor(Math.random(10, 1000)*100), //temp for random alphanumeric unique id
            title: req.body.title,
            details: ticketDetails,
            status: 'pending'
        });

        newTicket.save(function (err, newTicket) {
            if (err) throw error;

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

    list: function (req, res) {

        Ticket.find(function (err, allTickets) {
            if (err) throw error;

            console.log(allTickets);

            res.render("Items", {
                title: "Tickets",
                items: allTickets
            });
        });
    }
};

module.exports = applicationController;