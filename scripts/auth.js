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
