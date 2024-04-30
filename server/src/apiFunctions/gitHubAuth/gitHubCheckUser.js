const db = require("../../../database");
const parseCookies = require("../../services/parseCookie");
const checkQuery = require("../autorisation/query");
const jwt = require("jsonwebtoken");
const oAuthQuery =
  "INSERT INTO users (username , email  , role , jwt) VALUES($1 , $2  , $3 , $4) RETURNING *;";
const checkGitHubUser = (req, res) => {
  console.log(req.cookies["gitHubToken"]);
  const jwt_user = req.cookies["gitHubToken"];
  try {
    const sss = jwt.verify(jwt_user, process.env.JWT_PASSWORD);

    return res.send(sss);
  } catch (error) {
    res.send(null);
  }

  // try {
  //   if (jwt_user) {
  //     const userToken = jwt.decode(jwt_user, process.env.JWT_PASSWORD);
  //     const role = "user";
  //     db.query(checkQuery, [userToken.email], (err, tableRes) => {
  //       if (tableRes.rows.length) {
  //         const user = tableRes.rows[0];
  //         if (user.email.toString() === userToken.email.toString()) {
  //           return res.status(200).json({
  //             jwtToken: user.jwt,
  //             user: {
  //               username: user.username,
  //               email: user.email,
  //               role: user.role,
  //             },
  //           });
  //         } else {
  //           return res.status(401).json({ errorText: "wrong email" });
  //         }
  //       } else {
  //         db.query(
  //           oAuthQuery,
  //           [userToken.name, userToken.email, role, jwt_user],
  //           (err, insertRes) => {
  //             if (err) {
  //               console.log(err, "error");
  //               return res.status(500).json({
  //                 errorText: "Something went wrong with inserting new user",
  //               });
  //             } else {
  //               db.query(checkQuery, [userToken.email], (err, dbRes) => {
  //                 if (err) {
  //                   return res
  //                     .status(401)
  //                     .json({ errorText: "couldnt autorize user" });
  //                 } else {
  //                   const user = dbRes.rows[0];

  //                   return res.status(200).json({
  //                     jwtToken: user.jwt,
  //                     user: {
  //                       username: user.username,
  //                       email: user.email,
  //                       role: user.role,
  //                     },
  //                   });
  //                 }
  //               });
  //             }
  //           }
  //         );
  //       }
  //     });
  //   } else {
  //     return res.status(401).json({ errorText: "fuck niggers" });
  //   }
  // } catch (error) {
  //   return res.status(401).json({ errorText: "could find cookie" });
  // }
};
module.exports = checkGitHubUser;
