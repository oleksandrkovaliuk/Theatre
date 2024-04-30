const getTokenGitHub = require("./getAccesToken");
const jwt = require("jsonwebtoken");
const gitHubAuth = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(401).json({ errorText: "failed with getting code" });
  }
  try {
    const userData = await getTokenGitHub(code);
    const createJwt = jwt.sign(userData, process.env.JWT_PASSWORD);
    res.redirect(`${process.env.UI_MAIN_PAGE}?github=${createJwt}`);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ errorText: "Internal server error" });
  }
};
module.exports = gitHubAuth;
