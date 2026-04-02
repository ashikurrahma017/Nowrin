const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection (FROM ENV VARIABLE)
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Models
const User = mongoose.model("User", {
  username: String,
  password: String
});

const Post = mongoose.model("Post", {
  username: String,
  content: String,
  createdAt: { type: Date, default: Date.now }
});

// Routes

// Register
app.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.send("User not found");
  res.send(user);
});

// Create Post
app.post("/post", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.send(post);
});

// Get Posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.send(posts);
});

// Socket Chat
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });
});

// ✅ Serve frontend (VERY IMPORTANT for Render)
app.use(express.static(path.join(__dirname, "../client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Use Render port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
