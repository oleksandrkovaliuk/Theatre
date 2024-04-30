const cors = require("cors");

const allowCredential = (cors.CorsOptions = {
  origin: process.env.UI_MAIN_PAGE,
  credentials: true,
});

module.exports = allowCredential;
