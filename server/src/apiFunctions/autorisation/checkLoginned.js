const db = require("../../../database");
const parsToken = (token) => token?.replace("Bearer", "")?.replace(" ", "");
const checkLoginned = async (req, res) => {
  try {
    const jwt = parsToken(req.headers?.authorization);
    console.log(jwt, "jwt");
    const findUserWithJwtToken = "SELECT * FROM users where jwt = $1";

    db.query(findUserWithJwtToken, [jwt], (err, dbRes) => {
      console.log(dbRes.rows, "token");
      if (err || !dbRes.rows.length) {
        return res
          .status(401)
          .json({ errorText: "Could find user or error from db side" });
      } else {
        return res.status(200).json({
          username: dbRes.rows[0].username,
          email: dbRes.rows[0].email,
          role: dbRes.rows[0].role,
        });
      }
    });
  } catch (error) {
    console.log(error, " error");
    return res.status(401).json({ errorText: "user unautorized yet" });
  }
};
module.exports = checkLoginned;
