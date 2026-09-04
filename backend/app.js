const express = require("express");
const multer = require("multer");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/error");
const { xss } = require("express-xss-sanitizer");
const ratelimiting = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
require("dotenv").config();
const cors = require('cors')

//connection to db
connectDB();

//init app
const app = express();

//MiddleWares
app.use(express.json());

// Security Headers (helmet)
app.use(helmet());

// Prevent http param pollution
app.use(hpp());

// Prevent xss (cross site scripting) attacks
app.use(xss());

// Rate Limiting
app.use(
  ratelimiting({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
  })
);

// cors policy
app.use(
  cors({
    origin: "http://localhost:3000",     //we use cors to allow other ports to take services fromthis backend
  }),
);

// Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/posts", require("./routes/postRoute"));
app.use("/api/comments", require("./routes/commentRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));
app.use('/api/password', require('./routes/passwordRoute'))


// Eror Handler MiddleWare
app.use(notFound)
app.use(errorHandler)


// Return API errors as JSON instead of Express's default HTML response.
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image must be 1 MB or smaller" });
  }

  res.status(error.statusCode || error.status || 400).json({
    message: error.message || "Internal server error",
  });
});

//Running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port : ${PORT}`,
  );
});
