const USERS_KEY = "loginAuthUsers";
const SESSION_KEY = "loginAuthSession";

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}


/* Registration */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document
            .getElementById("registerUsername")
            .value
            .trim();

        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const errorMessage =
            document.getElementById("registerError");

        const successMessage =
            document.getElementById("registerSuccess");

        errorMessage.style.display = "none";
        successMessage.style.display = "none";

        /* Basic validation */

        if (!username || !password || !confirmPassword) {
            errorMessage.textContent =
                "Please fill in all fields.";
            errorMessage.style.display = "block";
            return;
        }

        /* Password validation */

        const passwordPattern =
            /^(?=.*\d).{8,}$/;

        if (!passwordPattern.test(password)) {
            errorMessage.textContent =
                "Password must contain at least 8 characters and 1 number.";
            errorMessage.style.display = "block";
            return;
        }

        /* Confirm password */

        if (password !== confirmPassword) {
            errorMessage.textContent =
                "Passwords do not match.";
            errorMessage.style.display = "block";
            return;
        }

        /* Duplicate username/email */

        const users = getUsers();

        const existingUser = users.find(
            user => user.username.toLowerCase() === username.toLowerCase()
        );

        if (existingUser) {
            errorMessage.textContent =
                "Username or email already exists.";
            errorMessage.style.display = "block";
            return;
        }

        /* Hash password */

        const hashedPassword = await hashPassword(password);

        const newUser = {
            username: username,
            password: hashedPassword
        };

        users.push(newUser);

        saveUsers(users);

        successMessage.textContent =
            "Registration successful! Redirecting to login...";

        successMessage.style.display = "block";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    });
}


/* Login */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document
            .getElementById("loginEmail")
            .value
            .trim();

        const password =
            document.getElementById("loginPassword").value;

        const errorMessage =
            document.getElementById("loginError");

        const successMessage =
            document.getElementById("loginSuccess");

        errorMessage.style.display = "none";
        successMessage.style.display = "none";

        /* Empty field validation */

        if (!username || !password) {
            errorMessage.textContent =
                "Please enter username/email and password.";
            errorMessage.style.display = "block";
            return;
        }

        const users = getUsers();

        const user = users.find(
            user =>
                user.username.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            errorMessage.textContent =
                "Invalid username/email or password.";
            errorMessage.style.display = "block";
            return;
        }

        /* Hash entered password */

        const hashedPassword = await hashPassword(password);

        if (hashedPassword !== user.password) {
            errorMessage.textContent =
                "Invalid username/email or password.";
            errorMessage.style.display = "block";
            return;
        }

        /* Create login session */

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
                username: user.username,
                loginTime: new Date().toISOString()
            })
        );

        successMessage.textContent =
            "Login successful! Redirecting...";

        successMessage.style.display = "block";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    });
}


/* Dashboard Protection */

const loggedInUser =
    document.getElementById("loggedInUser");

if (loggedInUser) {

    const session =
        JSON.parse(localStorage.getItem(SESSION_KEY));

    if (!session) {
        window.location.href = "index.html";
    } else {
        loggedInUser.textContent = session.username;
    }
}


/* Logout */

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        localStorage.removeItem(SESSION_KEY);

        window.location.href = "index.html";
    });
}