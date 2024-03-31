const express = require("express");
const router = express.Router();
const db = require("../../database");
const events = require("../apiFunctions/events/events");
const createEvent = require("../apiFunctions/events/createEvent");
const changeSingleEvent = require("../apiFunctions/events/changeSingleEvent");
const changeMultipleEvent = require("../apiFunctions/events/changeMultipleEvent");
const deleteEvent = require("../apiFunctions/events/deleteEvent");
const updateSeats = require("../apiFunctions/events/updateSeats");
const signIn = require("../apiFunctions/autorisation/signIn");
const loginIn = require("../apiFunctions/autorisation/loginIn");
const checkLoginned = require("../apiFunctions/autorisation/checkLoginned");
const stripeConfig = require("../apiFunctions/stripe/stripe_config");
const createPaymentIntent = require("../apiFunctions/stripe/create_payment_intent");
const checkRole = require("../middleWare/checkRole");
const checkAuth = require("../middleWare/checkAuth");

// Work with events
router.route("/events").get(events);
router.route("/createEvent").post(checkRole, createEvent);
router.route("/changeSingleEvent").post(checkRole, changeSingleEvent);
router.route("/changeMultipleEvents").post(checkRole, changeMultipleEvent);
router.route("/deleteEvent").post(checkRole, deleteEvent);
router.route("/updateSeats").post(updateSeats);

// Work with autorisation
router.route("/signIn").post(signIn);
router.route("/logIn").post(loginIn);
router.route("/checkLoginned").post(checkAuth, checkLoginned);

// Work with payment
router.route("/stripe_config").get(stripeConfig);
router.route("/create_payment_intent").post(createPaymentIntent);
module.exports = router;
