const db = require("../../../database");
const checkQuery = require("./query");
const loginIn = (req, res) => {
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
};
module.exports = loginIn;
