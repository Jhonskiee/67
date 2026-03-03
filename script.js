let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

document.addEventListener("DOMContentLoaded", () => {
    if (currentUser) {
        showHome();
    } else {
        showLogin();
    }
});

/* AUTH SWITCH */
function showRegister() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("authPage").style.display = "flex";
    document.getElementById("homePage").style.display = "none";
}

/* REGISTER */
function register() {
    const name = regName.value;
    const email = regEmail.value;
    const password = regPassword.value;

    if (!name || !email || !password) return alert("Fill all fields.");

    if (users.find(u => u.email === email))
        return alert("Email already exists.");

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        friends: []
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Account created!");
    showLogin();
}

/* LOGIN */
function login() {
    const email = loginEmail.value;
    const password = loginPassword.value;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) return alert("Invalid credentials");

    currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    showHome();
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("currentUser");
    currentUser = null;
    showLogin();
}

/* HOME */
function showHome() {
    authPage.style.display = "none";
    homePage.style.display = "block";
    welcomeUser.innerText = "Welcome, " + currentUser.name;
    renderPosts();
    renderUsers();
}

/* POSTS */
function createPost() {
    const content = postContent.value;
    if (!content) return;

    const newPost = {
        id: Date.now(),
        userId: currentUser.id,
        content,
        likes: []
    };

    posts.unshift(newPost);
    localStorage.setItem("posts", JSON.stringify(posts));
    postContent.value = "";
    renderPosts();
}

function renderPosts() {
    feed.innerHTML = "";

    posts.forEach(post => {
        const user = users.find(u => u.id === post.userId);
        const liked = post.likes.includes(currentUser.id);

        const div = document.createElement("div");
        div.className = "post";
        div.innerHTML = `
            <h4>${user.name}</h4>
            <p>${post.content}</p>
            <button onclick="likePost(${post.id})">
                ${liked ? "❤️ Liked" : "👍 Like"} (${post.likes.length})
            </button>
        `;
        feed.appendChild(div);
    });
}

function likePost(id) {
    const post = posts.find(p => p.id === id);

    if (post.likes.includes(currentUser.id)) {
        post.likes = post.likes.filter(x => x !== currentUser.id);
    } else {
        post.likes.push(currentUser.id);
    }

    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
}

/* FRIEND SYSTEM */
function renderUsers() {
    usersList.innerHTML = "";

    users.forEach(user => {
        if (user.id === currentUser.id) return;

        const isFriend = currentUser.friends.includes(user.id);

        const div = document.createElement("div");
        div.innerHTML = `
            <span>${user.name}</span>
            <button onclick="toggleFriend(${user.id})">
                ${isFriend ? "Unfriend" : "Add Friend"}
            </button>
        `;
        usersList.appendChild(div);
    });
}

function toggleFriend(id) {
    if (currentUser.friends.includes(id)) {
        currentUser.friends =
            currentUser.friends.filter(f => f !== id);
    } else {
        currentUser.friends.push(id);
    }

    const index = users.findIndex(u => u.id === currentUser.id);
    users[index] = currentUser;

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    renderUsers();
}