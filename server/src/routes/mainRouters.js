const express = require("express");
const router = express.Router();
const db = require("../../database");
const jwt = require("jsonwebtoken");
const { USER_ROLE } = require("../enums");

const updatingEventsQuery =
  "UPDATE events SET name = $1 ,  disc = $2 , startingtime = $4 , age = $5 , imgurl = $6 WHERE id = $3";
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
        if (dbRes.rows[0].role === USER_ROLE.ADMIN) {
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
  const {
    eventName,
    eventDisc,
    eventDate,
    eventAge,
    eventImg,
    hall,
    eventseats,
  } = req.body;
  console.log(req.body);
  try {
    if (!eventName || !eventDisc || !eventDate || !eventAge || !eventImg) {
      return res
        .status(401)
        .json({ errorText: "not enough info to create event" });
    }
    db.query(
      "INSERT INTO events (name , disc , startingtime , age , imgUrl , hall , eventseats) VALUES($1 , $2 , $3 , $4 , $5 , $6 , $7) RETURNING *;",
      [eventName, eventDisc, eventDate, eventAge, eventImg, hall, eventseats],
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

router.post("/callForChangeSingleEvent", checkRole, (req, res) => {
  const { id, currentDate, currentAge, currentName, currentDisc, currentImg } =
    req.body;
  console.log(currentImg);
  if (
    id &&
    currentDate &&
    currentAge &&
    currentName &&
    currentDisc &&
    currentImg
  ) {
    console.log(id, currentDate, currentAge, currentName, currentDisc, "info");
    db.query(
      updatingEventsQuery,
      [currentName, currentDisc, id, currentDate, currentAge, currentImg],
      (err, dbRes) => {
        if (err) {
          return res
            .status(401)
            .json({ errorText: "Failed with updating data into events db" });
        } else {
          return res.status(200).json({
            text: "your events succesfully changed",
          });
        }
      }
    );
  } else {
    return res
      .status(401)
      .json({ errorText: "wrong upcoming info about event" });
  }
});

router.post("/callForChangeMultipleEvents", checkRole, async (req, res) => {
  const { dataWithChangedEvents } = req.body;
  try {
    if (dataWithChangedEvents.length) {
      await dataWithChangedEvents.forEach((item) => {
        db.query(
          updatingEventsQuery,
          [
            item.currentName,
            item.currentDisc,
            item.id,
            item.currentDate,
            item.currentAge,
          ],
          (err) => {
            if (err) {
              console.log(err, "error");
            } else {
              console.log("succesfully changed");
            }
          }
        );
      });
      Promise.all([dataWithChangedEvents]).then(() => {
        return res.status(200).json({ text: "your events succesfully aded" });
      });
    }
  } catch (error) {
    return res.status(401).json({ errorText: "failed with getting data" });
  }
});

router.post("/callToDeleteEvent", checkRole, (req, res) => {
  const { id } = req.body;
  if (id) {
    db.query("DELETE FROM events WHERE id = $1", [id], (err, dbRes) => {
      if (err) {
        res.status(401).json({ errorText: "Failed with deliting event" });
      } else {
        return res.status(200);
      }
    });
  } else {
    return res
      .status(401)
      .json({ errorText: "failed with getting info about event to delete" });
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
