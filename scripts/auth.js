window.onload = function () {
    google.accounts.id.initialize({
        client_id: "561740110276-uojmbodgp2vq25a79qaufdatp9ua4d9g.apps.googleusercontent.com", //my runvos-bm-app real Google client ID
        callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
    );
};

// Send Google token to my external backend
async function handleGoogleLogin(response) {
    try {
        const res = await fetch("https://runvos-bm-app.onrender.com/auth/google/callback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ credential: response.credential })
        });

        const data = await res.json();
        //Here is where i apply local storage setting items
        if (data?.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("userEmail", data.email || "");
            accountLink.textContent = "Logout";
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

//using this function i get local storage items
function updateAccountDisplay() {
    const accountText = document.getElementById("account-text");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (firstName && lastName) {
        const initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
        accountText.textContent = initials;
    } else {
        accountText.textContent = "Account";
    }
}

// Run on page load
document.addEventListener("DOMContentLoaded", updateAccountDisplay);

// After login or Google login
function handleLoginSuccess(userData) {
    localStorage.setItem("firstName", userData.firstName || "");
    localStorage.setItem("lastName", userData.lastName || "");
    localStorage.setItem("userEmail", userData.email || "");
    updateAccountDisplay();
}

// On logout
function handleLogout() {
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    localStorage.removeItem("userEmail");
    updateAccountDisplay();
}
