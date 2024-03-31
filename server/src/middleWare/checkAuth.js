const parsToken = (token) => token?.replace("Bearer", "")?.replace(" ", "");
const checkAuth = (req, res, next) => {
  if (parsToken(req.headers?.authorization)) {
    next();
  } else {
    return res.status(401).json({ errorText: "user unautorized yet" });
  }
};
module.exports = checkAuth;
