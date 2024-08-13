require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require("./middleware/logger.js");
const errorhandler = require("./middleware/errorHandler.js");
const cookieparser = require("cookie-parser");
const cors = require("cors");
const corsOpition = require("./config/corsOptions.js");
const connectDB = require("./config/dbConn.js");
const mongoose = require("mongoose");
const { logEvent } = require("./middleware/logger.js");
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOpition));

app.use(express.json());
 
app.use(cookieparser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root.js"));
app.use("/auth", require("./routes/authRoutes.js"))
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes.js"))

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorhandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongodb");
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
