const cors = require("cors");

const defaultCorsOptions = (cors.CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
});

module.exports = defaultCorsOptions;
