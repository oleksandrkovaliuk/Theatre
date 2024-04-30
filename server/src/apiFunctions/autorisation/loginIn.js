const db = require("../../../database");
const checkQuery = require("./query");
const jwt = require("jsonwebtoken");
const loginIn = (req, res) => {
  const { email, password, jwt_user } = req.body;
  if ((email && password) || jwt_user) {
    let userToken;
    if (jwt_user) {
      userToken = jwt.decode(jwt_user, process.env.JWT_PASSWORD);
    }
    db.query(checkQuery, [jwt_user ? userToken.email : email], (err, dbRes) => {
      if (!dbRes.rows.length || err) {
        return res
          .status(401)
          .json({ errorText: "this user is not registered yet" });
      } else {
        const user = dbRes.rows[0];
        if (
          jwt_user
            ? user.email.toString() === userToken.email.toString()
            : user.password?.toString() === password.toString()
        ) {
          return res.status(200).json({
            jwtToken: user.jwt,
            user: {
              username: user.username,
              email: user.email,
              role: user.role,
            },
          });
        } else {
          return res
            .status(401)
            .json({
              errorText:
                "this user cannot be authorize please use github or google auth",
            });
        }
      }
    });
  } else {
    return res.status(401).json({ errorText: "fields are empty" });
  }
};
module.exports = loginIn;
