const db = require("../../../database");
const checkQuery = require("./query");
const simpleSingInQuery =
  "INSERT INTO users (username , email , password , role , jwt) VALUES($1 , $2 , $3 , $4 , $5) RETURNING *;";
const oAuthQuery =
  "INSERT INTO users (username , email ,avatar , role , jwt) VALUES($1 , $2 , $3 , $4 , $5) RETURNING *;";
const jwt = require("jsonwebtoken");
const signIn = (req, res) => {
  const { username, email, password, role, jwt_user } = req.body;
  let userToken;
  if (req.body.length) {
    return res.status(401).json({ errorText: "fields are empty" });
  }
  if ((username && email && password && role) || jwt_user) {
    if (!jwt_user) {
      userToken = jwt.sign(
        { username: username, email: email, role: role },
        process.env.JWT_PASSWORD
      );
    } else {
      userToken = jwt.decode(jwt_user, process.env.JWT_PASSWORD);
    }
    console.log(userToken);
    db.query(
      checkQuery,
      [jwt_user ? userToken.email : email],
      (err, tableRes) => {
        if (tableRes.rows.length) {
          return res
            .status(401)
            .json({ errorText: "User with this email already autorized" });
        } else {
          db.query(
            jwt_user ? oAuthQuery : simpleSingInQuery,
            jwt_user
              ? [
                  userToken.name,
                  userToken.email,
                  userToken.picture,
                  role,
                  jwt_user,
                ]
              : [username, email, password, role, userToken],
            (err, insertRes) => {
              if (err) {
                res.status(500).json({
                  errorText: "Something went wrong whit inserting new user",
                });
              } else {
                db.query(
                  checkQuery,
                  [jwt_user ? userToken.email : email],
                  (err, dbRes) => {
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
                          img: user.avatar ? user.avatar : null,
                          email: user.email,
                          role: user.role,
                        },
                      });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } else {
    return res
      .status(401)
      .json({ errorText: "couldnt authorize information from request" });
  }
};
module.exports = signIn;
