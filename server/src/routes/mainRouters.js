const express = require("express");
const router = express.Router();
const db = require("../../database");
const jwt = require("jsonwebtoken");
const checkAuth = (req, res, next) => {
  next();
};
// Work with events

router.get("/infoAboutEvents", checkAuth, (req, res) => {
  try {
    db.query("SELECT * FROM events", (err, dbRes) => {
      if (err) {
        res.status(500).json({ errorText: "Failed with getting data" });
      }
      res.status(200).json({ events: dbRes.rows });
    });
  } catch (error) {
    res.status(500).json({ errorText: `${error} err` });
  }
});

// Work with autorisation
const checkQuery = "SELECT * FROM users WHERE email = $1";
router.post("/signInNewUser", checkAuth, (req, res) => {
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
        console.log(userToken, "token");
        db.query(
          "INSERT INTO users (username , email , password , role , jwt) VALUES($1 , $2 , $3 , $4 , $5) RETURNING *;",
          [username, email, password, role, userToken],
          (err, insertRes) => {
            if (err) {
              res.status(500).json({
                errorText: "Something went wrong whit inserting new user",
              });
            } else {
              res.status(200).json({ errorText: "user succefully registered" });
            }
          }
        );
      }
    });
  }
});
router.post("/logInUser", checkAuth, (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    db.query(checkQuery, [email], (err, dbRes) => {
      if (err) {
        return res
          .status(401)
          .json({ errorText: "this user is no registered yet" });
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
router.post("/checkUserWithJwtToken", checkAuth, (req, res) => {
  const { jwt_token } = req.body;
  if (jwt_token) {
    const findUserWithJwtToken = "SELECT * FROM users where jwt = $1";
    db.query(findUserWithJwtToken, [jwt_token], (err, dbRes) => {
      console.log(dbRes.rows, "token");
      if (err || !dbRes.rows.length) {
        return res
          .status(401)
          .json({ errorText: "Could find user or error from db side" });
      } else {
        const verifyToken = jwt.verify(jwt_token, process.env.JWT_PASSWORD);
        res
          .status(200)
          .json({
            user: {
              username: dbRes.rows[0].username,
              email: dbRes.rows[0].email,
              role: dbRes.rows[0].role,
            },
          });
      }
    });
  } else {
    return res.status(401).json({ errorText: "user unautorized yet" });
  }
});
module.exports = router;
