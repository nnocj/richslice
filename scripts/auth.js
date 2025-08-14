// === Google One-Tap Login Setup ===
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "561740110276-uojmbodgp2vq25a79qaufdatp9ua4d9g.apps.googleusercontent.com", // My runvos-bm-appp real Google Client ID
        callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
    );
};

// === Handle Google Login Response ===
async function handleGoogleLogin(response) {
    try {
        const res = await fetch("https://runvos-bm-app.onrender.com/auth/google/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential })
        });

        const data = await res.json();

        if (data?.accessToken) {
            // Store tokens
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            // Store user info for initials display
            handleLoginSuccess({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email
            });

            alert("Logged in with Google!");
            accountDialog.close();
        } else {
            alert(data?.error || "Google login failed");
        }
    } catch (err) {
        console.error(err);
        alert("Error during Google login");
    }
}

// === Update Nav Display with Initials ===
function updateAccountDisplay() {
    const accountText = document.getElementById("account-text");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName && lastName) {
        const initials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
        accountText.textContent = initials;
    } else {
        accountText.textContent = "Account";
    }
}

// === Store User Info After Login ===
function handleLoginSuccess(userData) {
    localStorage.setItem("firstName", userData.firstName || "");
    localStorage.setItem("lastName", userData.lastName || "");
    localStorage.setItem("userEmail", userData.email || "");
    updateAccountDisplay();
}

// === Clear User Info on Logout ===
function handleLogout() {
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    updateAccountDisplay();
}

// Run on page load
document.addEventListener("DOMContentLoaded", function () {
    updateAccountDisplay();

    const accountLink = document.getElementById("account-link");
    const accountDialog = document.getElementById("account-dialog");

    accountLink.addEventListener("click", function (e) {
        e.preventDefault();
        // Check if logged in
        const token = localStorage.getItem("accessToken");
        if (token) {
            // later you can show a dropdown for logout/profile
            alert("Already logged in");
        } else {
            accountDialog.showModal();
        }
    });
});
