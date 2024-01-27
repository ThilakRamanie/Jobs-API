require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//DB connect
const connectDB = require("./db/connect");
const authenticatedUser = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

app.set('trust proxy',1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
// extra packages

// routes
// app.get("/", (req, res) => {
//   res.send("jobs api");
// });

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticatedUser, jobsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.URL);
    app.listen(port, () =>
      console.log(`Jobs server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
