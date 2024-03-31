const db = require("../../database");
const { USER_ROLE } = require("../enums");
const parsToken = (token) => token?.replace("Bearer", "")?.replace(" ", "");
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
module.exports = checkRole;
