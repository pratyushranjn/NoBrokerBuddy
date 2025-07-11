require('dotenv').config();
const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require("./config/db");
const listingRoutes = require("./routes/listingRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const http = require('http');
const chatSocket = require('./sockets/chatSocket'); 

const app = express();
const server = http.createServer(app);

connectDB();

const allowedOrigins = [
  'http://localhost:5173',
  'https://no-broker-buddy.vercel.app'
];

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/listings', listingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);

// Setup Socket.IO (chatSocket will create and attach socket.io to the server)
chatSocket(server);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

app.get("/", (req, res) => {
  res.json("Working")
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

