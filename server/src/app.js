require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const mainRouters = require("./routes/mainRouters");
const defaultCorsOptions = require("./configs/corsSettings");
const dbConfig = require("../database");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT;
const http_server = require("http").createServer(app);
const io = new Server(http_server, {
  cors: {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  },
});

const setupRoutes = () => {
  app.use(cors(defaultCorsOptions));
  app.use(cookieParser());
  app.use(
    "/api",
    // serverReadyMiddleware,
    mainRouters
    // responseErrHandler,
    // responseHandler
  );

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404));
  });
  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
};
const setupMiddlewares = () => {
  app.use(logger("dev"));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));

  // parse application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false })); // default true

  // parse application/json
  // default '100kb' | Heavier request will trigger dataTooLargeMW
  app.use(express.json({ limit: "10mb" }));
  // X-Frame-Options header to all responses
  // app.use((req, res, next) => {
  //   const develHeader =
  //     process.env.NODE_ENV === ENVIRONMENT.Development
  //       ? process.env.UI_URL
  //       : "";
  //   res.setHeader(
  //     "Content-Security-Policy",
  //     `frame-ancestors 'self' *.structshare.io ${develHeader}`
  //   );
  //   next();
  // });

  // Strict-Transport-Security header to all responses
  // app.use((req, res, next) => {
  //   res.setHeader(
  //     "Strict-Transport-Security",
  //     "max-age=31536000; includeSubDomains"
  //   );
  //   next();
  // });

  // X-Content-Type-Options header to all responses
  // app.use((req, res, next) => {
  //   res.setHeader("X-Content-Type-Options", "nosniff");
  //   next();
  // });
};

const setupDB = async () => await dbConfig.connect();

async function init() {
  try {
    setupMiddlewares();
    await setupDB();
    setupRoutes();
    io.on("connection", (socket) => {
      console.log("hello", socket.id);
      socket.on("updatedEvent", (data) => {
        console.log(data, "check data");
        return io.emit("newSeats", data);
      });
    });
    http_server.listen(PORT, () => {
      console.log(`socket listening on ${PORT}`);
      return console.log(`Express is listening on PORT:${PORT}`);
    });
  } catch (error) {
    throw new Error(`Could not init application: ${error}`);
  }
}

init();

module.exports = app;
