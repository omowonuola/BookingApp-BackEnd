const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const path = require('path');



// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Route Files
const auth = require('./routes/auth');
const admin = require('./routes/admin');
const rooms = require('./routes/rooms');
const bookRoom = require('./routes/bookRoom');

const app = express();

// Body Parser
app.use(express.json());
app.use(cors());

// Cookie parser
app.use(cookieParser());
app.get('/', (req, res) => 
  res.send({ msg: "Welcome here" })
);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/auth/admin', admin);
app.use('/api/rooms', rooms);
app.use('/api/bookroom', bookRoom);

// ErrorHandler
app.use(errorHandler);

// Serve static assests if in production
// if(process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 4000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
