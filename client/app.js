const API = "http://localhost:5000";
const socket = io(API);

let currentUser = "";

// Register
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  alert("Registered!");
}

// Login
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  currentUser = data.username;
  loadPosts();
}

// Create Post
async function createPost() {
  const content = document.getElementById("postInput").value;

  await fetch(API + "/post", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser, content })
  });

  loadPosts();
}

// Load Posts
async function loadPosts() {
  const res = await fetch(API + "/posts");
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
  socket.emit("send_message", { user: currentUser, msg });
}

socket.on("receive_message", (data) => {
  const li = document.createElement("li");
  li.innerText = `${data.user}: ${data.msg}`;
  document.getElementById("chat").appendChild(li);
});
