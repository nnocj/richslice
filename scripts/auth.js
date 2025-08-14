const manualRegisterationUri = "https://runvos-bm-app.onrender.com/auth/register";
const manualLoginUri = "https://runvos-bm-app.onrender.com/auth/login";
const logoutUri = "https://runvos-bm-app.onrender.com/auth/logout";
const authWithGoogle = "https://runvos-bm-app.onrender.com/auth/google";

// Elements
const accountLink = document.getElementById("account-link");
const accountText = document.getElementById("account-text");
const accountDialog = document.getElementById("account-dialog");
const accountForm = document.getElementById("account-form");
const switchModeBtn = document.getElementById("switch-mode");
const closeDialogBtn = document.getElementById("close-dialog");

let isLoginMode = true; // Toggle between login and register

// Decode JWT helper
function decodeJWT(token) {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}

// Check if a user is already signed in
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        const user = decodeJWT(token);
        if (user) {
            displayUser(user);
        }
    }
});

// Open dialog on Account click
accountLink.addEventListener("click", (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (token) {
        const user = decodeJWT(token);
        if (user && confirm(`Sign out ${user.firstName || user.email}?`)) {
            logoutUser();
        }
    } else {
        accountDialog.showModal();
    }
});

// Switch login/register mode
switchModeBtn.addEventListener("click", () => {
    isLoginMode = !isLoginMode;
    document.getElementById("account-title").textContent = isLoginMode ? "Sign In" : "Register";
    document.getElementById("account-submit").textContent = isLoginMode ? "Login" : "Register";
    switchModeBtn.textContent = isLoginMode ? "Need an account?" : "Already have an account?";
});

// Close dialog
closeDialogBtn.addEventListener("click", () => accountDialog.close());

// Handle login/register submit
accountForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("account-email").value.trim();
    const password = document.getElementById("account-password").value.trim();

    const endpoint = isLoginMode ? manualLoginUri : manualRegisterationUri;

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) throw new Error("Authentication failed");

        const data = await res.json();

        // Save tokens
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Decode and store minimal user info
        const user = decodeJWT(data.accessToken);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            displayUser(user);
        }

        accountDialog.close();
    } catch (err) {
        alert(err.message);
    }
});

// Google Sign In
document.getElementById("googleSignInDiv").addEventListener("click", () => {
    window.location.href = authWithGoogle; // Redirect to Google login
});

// Display user name/email
function displayUser(user) {
    accountText.textContent = `${user.firstName} ${user.lastName}` || `${user.email}`;
}

// Logout
async function logoutUser() {
    try {
        await fetch(logoutUri, { method: "POST", credentials: "include" });
    } catch (err) {
        console.warn("Logout request failed, clearing local data anyway.");
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    accountText.textContent = "Account";
}
