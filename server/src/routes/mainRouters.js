const express = require("express");
const router = express.Router();
const db = require("../../database");
const checkAuth = (req, res, next) => {
  next();
};

router.get("/infoAboutEvents", checkAuth, (req, res) => {
  try {
    db.query("SELECT * FROM events", (err, dbRes) => {
      if (err) {
        return res.status(500).json({ errorText: "Failed with getting data" });
      }
      res.status(200).json({ events: dbRes?.rows || [] });
    });
  } catch (error) {
    res.status(500).json({ errorText: `${error} err` });
  }
});

// router.get("/createEvent", checkAuth, (req, res) => {
//   try {
//     db.query("SELECT * FROM events", (err, dbRes) => {
//       if (err) {
//         res.status(500).json({ errorText: "Failed with getting data" });
//       }
//       res.status(200).json({ events: dbRes.rows });
//     });
//   } catch (error) {
//     res.status(500).json({ errorText: `${error} err` });
//   }
// });

module.exports = router;
