const getCookie = async (req, res) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    if (cookie) {
      return res.status(200).json({ cookie });
    }
  } catch (error) {
    return res.status(401).json({ errorText: "failed with getting cookie" });
  }
};
module.exports = getCookie;
