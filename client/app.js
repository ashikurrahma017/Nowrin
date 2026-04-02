const API = "";
const socket = io();

let currentUser = "";

// Register
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  alert("Registered! Now login.");
}

// Login
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!data.username) {
    alert("Login failed");
    return;
  }

  currentUser = data.username;

  // Hide auth, show dashboard
  document.getElementById("authPage").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  loadPosts();
}

// Create Post
async function createPost() {
  const content = document.getElementById("postInput").value;

  await fetch("/post", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username: currentUser, content })
  });

  loadPosts();
}

// Load Posts
async function loadPosts() {
  const res = await fetch("/posts");
  const posts = await res.json();

  const list = document.getElementById("posts");
  list.innerHTML = "";

  posts.forEach(p => {
    const li = document.createElement("li");
    li.innerText = `${p.username}: ${p.content}`;
    list.appendChild(li);
  });
}

// Chat
function sendMessage() {
  const msg = document.getElementById("message").value;

  socket.emit("send_message", {
    user: currentUser,
    msg
  });
}

socket.on("receive_message", (data) => {
  const li = document.createElement("li");
  li.innerText = `${data.user}: ${data.msg}`;
  document.getElementById("chat").appendChild(li);
});
