const express = require("express");
const router = express.Router();
const db = require("../../database");
const jwt = require("jsonwebtoken");

const parsToken = (token) => token?.replace("Bearer", "")?.replace(" ", "");

const checkAuth = (req, res, next) => {
  if (parsToken(req.headers?.authorization)) {
    next();
  } else {
    return res.status(401).json({ errorText: "user unautorized yet" });
  }
};

const checkRole = (req, res, next) => {
  const checkUserRoleQuery = "SELECT * FROM users WHERE jwt = $1";
  if (req.headers?.authorization) {
    db.query(
      checkUserRoleQuery,
      [parsToken(req.headers.authorization)],
      (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "failed with checking role in users data" });
        }
        if (dbRes.rows[0].role === "admin") {
          next();
        } else {
          return res.status(401).json({ errorText: "this user is not admin" });
        }
      }
    );
  } else {
    return res.status(401).json({ errorText: "user unautorized yet" });
  }
};
// Work with events

router.get("/infoAboutEvents", (req, res) => {
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

router.post("/createNewEvent", checkRole, (req, res) => {
  const { eventName, eventDisc, eventDate, eventAge, eventImg } = req.body;
  console.log(req.body);
  try {
    if (!eventName || !eventDisc || !eventDate || !eventAge || !eventImg) {
      return res
        .status(401)
        .json({ errorText: "not enough info to create event" });
    }
    db.query(
      "INSERT INTO events (name , disc , startingtime , age , imgUrl) VALUES($1 , $2 , $3 , $4 , $5) RETURNING *;",
      [eventName, eventDisc, eventDate, eventAge, eventImg],
      (err, dbRes) => {
        if (err) {
          console.log(err, "error");
          res
            .status(401)
            .json({ errorText: "failed with inserting new event into table" });
        } else {
          return res.status(200).json({
            succesfull: `event "${dbRes.rows[0].name}" succesfully created`,
          });
        }
      }
    );
  } catch (error) {
    return res
      .status(401)
      .json({ errorText: "failed with creating new event" });
  }
});

router.post("/infoAboutEventById", (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      db.query("SELECT * FROM events WHERE id=$1", [id], (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "failed with searching for event" });
        }
        return res.status(200).json({ eventInfo: dbRes.rows[0] });
      });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ errorText: "failed with getting data by id" });
  }
});
// Work with autorisation
const checkQuery = "SELECT * FROM users WHERE email = $1";
router.post("/signInNewUser", (req, res) => {
  const { username, email, password, role } = req.body;
  if (req.body.length) {
    return res.status(401).json({ errorText: "fields are empty" });
  }
  if (username && email && password && role) {
    db.query(checkQuery, [email], (err, tableRes) => {
      if (tableRes.rows.length) {
        return res
          .status(401)
          .json({ errorText: "User with this email already autorized" });
      } else {
        const userToken = jwt.sign(
          { username: username, email: email, role: role },
          process.env.JWT_PASSWORD
        );
        db.query(
          "INSERT INTO users (username , email , password , role , jwt) VALUES($1 , $2 , $3 , $4 , $5) RETURNING *;",
          [username, email, password, role, userToken],
          (err, insertRes) => {
            if (err) {
              res.status(500).json({
                errorText: "Something went wrong whit inserting new user",
              });
            } else {
              db.query(checkQuery, [email], (err, dbRes) => {
                if (err) {
                  return res
                    .status(401)
                    .json({ errorText: "couldnt autorize user" });
                } else {
                  const user = dbRes.rows[0];
                  return res.status(200).json({
                    jwtToken: user.jwt,
                    user: {
                      username: user.username,
                      email: user.email,
                      role: user.role,
                    },
                  });
                }
              });
            }
          }
        );
      }
    });
  }
});
router.post("/logInUser", (req, res) => {
  const { email, password } = req.body;
  console.log(password, "pass");
  if (email && password) {
    db.query(checkQuery, [email], (err, dbRes) => {
      if (!dbRes.rows[0] || err) {
        res.status(401).json({ errorText: "this user is not registered yet" });
      } else {
        const user = dbRes.rows[0];
        if (user.password.toString() === password.toString()) {
          return res.status(200).json({
            jwtToken: user.jwt,
            user: {
              username: user.username,
              email: user.email,
              role: user.role,
            },
          });
        } else {
          return res.status(401).json({ errorText: "wrong password" });
        }
      }
    });
  } else {
    return res.status(401).json({ errorText: "fields are empty" });
  }
});
// Check user with jwt token
router.post("/checkUserLoginned", checkAuth, (req, res) => {
  try {
    const jwt = parsToken(req.headers?.authorization);
    const findUserWithJwtToken = "SELECT * FROM users where jwt = $1";

    db.query(findUserWithJwtToken, [jwt], (err, dbRes) => {
      console.log(dbRes.rows, "token");
      if (err || !dbRes.rows.length) {
        return res
          .status(401)
          .json({ errorText: "Could find user or error from db side" });
      } else {
        res.status(200).json({
          user: {
            username: dbRes.rows[0].username,
            email: dbRes.rows[0].email,
            role: dbRes.rows[0].role,
          },
        });
      }
    });
  } catch (error) {
    console.log(error, " error");
    return res.status(401).json({ errorText: "user unautorized yet" });
  }
});

module.exports = router;
