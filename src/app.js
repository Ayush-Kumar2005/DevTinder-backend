const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const app = express();

// ✅ Use cors() instead of manual res.set
app.use(
  cors({
    origin: "http://localhost:5173",  // must match your frontend
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Connect DB & Start server
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server started at port number 7777...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected", err);
  });
