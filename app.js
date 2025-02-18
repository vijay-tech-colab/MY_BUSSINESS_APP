const express = require("express");
var compression = require('compression')
require("dotenv").config({ path: "./config/config.env" });
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const hetmet = require("helmet");
const cookieParser = require('cookie-parser');
const { errorMiddleware } = require("./Middlewares/error");
const messageRouter = require('./Routers/messageRouter');
const userRouter = require("./Routers/userRouter");
const timeLineRouter = require("./Routers/timelineRouter");
const softwareApplicationRouter = require("./Routers/softwareApplication");
const skillRouter = require("./Routers/skillRouter");
const projectRouter = require("./Routers/projectRouter");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

app.use(morgan("dev"));
app.use(hetmet());
app.use(cookieParser());
app.use(compression());
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN_CLIENT_URL,
      process.env.CORS_ORIGIN_DASHBOARD_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use("/api/v1/message", messageRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/timeline', timeLineRouter);
app.use('/api/v1/softwareapplication', softwareApplicationRouter);
app.use('/api/v1/skill', skillRouter);
app.use('/api/v1/project', projectRouter);
app.use(errorMiddleware);
module.exports = app;
