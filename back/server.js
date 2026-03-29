const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const jammatRoutes = require("./routes/jammatRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/jammat", jammatRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Jammat Management API Running");
});

// ✅ KEEP-ALIVE: Ping self every 10 minutes to prevent Render sleep
const BACKEND_URL = process.env.BACKEND_URL || "https://your-backend.onrender.com";

function keepAlive() {
  const https = require("https");
  const http = require("http");
  const url = new URL(BACKEND_URL);
  const requester = url.protocol === "https:" ? https : http;

  requester.get(BACKEND_URL, (res) => {
    console.log(`[Keep-Alive] Pinged self — status: ${res.statusCode}`);
  }).on("error", (err) => {
    console.error("[Keep-Alive] Ping failed:", err.message);
  });
}

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Start keep-alive pings every 10 minutes
    setInterval(keepAlive, 10 * 60 * 1000);
    console.log("[Keep-Alive] Self-ping scheduled every 10 minutes");
  });
})
.catch(err => console.log(err));
