const cors = require('cors');

const defaultCorsOptions = cors.CorsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

module.exports = defaultCorsOptions;