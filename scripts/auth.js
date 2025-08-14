const registerUri = "https://runvos-bm-app.onrender.com/auth/register";
const loginUri = "https://runvos-bm-app.onrender.com/auth/login";
const logoutUri = "https://runvos-bm-app.onrender.com/auth/logout";

async function registerUser(email, password) {
    const response = await fetch(registerUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    return response.json();
}

async function loginUser(email, password) {
    const response = await fetch(loginUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });
    return response.json();
}

async function logoutUser() {
    const response = await fetch(logoutUri, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.json();
}