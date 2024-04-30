const cors = require("cors");

const defaultCorsOptions = (cors.CorsOptions = {
  origin: process.env.UI_MAIN_PAGE,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
});

module.exports = defaultCorsOptions;
