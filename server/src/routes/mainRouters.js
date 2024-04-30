const express = require("express");
const router = express.Router();
const db = require("../../database");
const events = require("../apiFunctions/events/events");
const createEvent = require("../apiFunctions/events/createEvent");
const changeSingleEvent = require("../apiFunctions/events/changeSingleEvent");
const changeMultipleEvent = require("../apiFunctions/events/changeMultipleEvent");
const deleteEvent = require("../apiFunctions/events/deleteEvent");
const signIn = require("../apiFunctions/autorisation/signIn");
const loginIn = require("../apiFunctions/autorisation/loginIn");
const checkLoginned = require("../apiFunctions/autorisation/checkLoginned");
const stripeConfig = require("../apiFunctions/stripe/stripe_config");
const createPaymentIntent = require("../apiFunctions/stripe/create_payment_intent");
const checkRole = require("../middleWare/checkRole");
const checkAuth = require("../middleWare/checkAuth");
const sendTicket = require("../apiFunctions/ticket/sendTicket");
const updatedAndSetBookedEvent = require("../apiFunctions/events/updatedAndSetBookedEvent");
const bookedEventsByUser = require("../apiFunctions/events/bookedEventsByUser");
const cancelBookedSeats = require("../apiFunctions/events/cancelBookedSeat");
const deleteExpiredSeats = require("../apiFunctions/events/deleteExpiredSeats");
const gitHubAuth = require("../apiFunctions/gitHubAuth/gitHubAuth");
const checkGitHubUser = require("../apiFunctions/gitHubAuth/gitHubCheckUser");
// Work with events
router.route("/events").get(events);
router.route("/createEvent").post(checkRole, createEvent);
router.route("/changeSingleEvent").post(checkRole, changeSingleEvent);
router.route("/changeMultipleEvents").post(checkRole, changeMultipleEvent);
router.route("/deleteEvent").post(checkRole, deleteEvent);
router.route("/updatedAndSetBookedEvent").post(updatedAndSetBookedEvent);
router.route("/bookedEventsByUser").post(bookedEventsByUser);
router.route("/cancelSeat").post(cancelBookedSeats);
router.route("/deleteExpiredSeat").post(deleteExpiredSeats);
// Work with autorisation
router.route("/signIn").post(signIn);
router.route("/logIn").post(loginIn);
router.route("/checkLoginned").post(checkAuth, checkLoginned);

// Work with payment
router.route("/stripe_config").get(stripeConfig);
router.route("/create_payment_intent").post(createPaymentIntent);

// ticket
router.route("/sendUserTicket").post(sendTicket);

// gitHub Auth
router.route("/auth/github").get(gitHubAuth);

// services
router.route("/checkGitHubUser").get(checkGitHubUser);
module.exports = router;
