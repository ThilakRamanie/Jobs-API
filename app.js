require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

//DB connect
const connectDB = require("./db/connect");
const authenticatedUser = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

app.use(express.json());
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
