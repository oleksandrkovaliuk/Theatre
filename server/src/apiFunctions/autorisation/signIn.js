const db = require("../../../database");
const checkQuery = require("./query");
const jwt = require("jsonwebtoken");
const signIn = (req, res) => {
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
};
module.exports = signIn;
