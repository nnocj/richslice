/**** Endpoints ****/
const manualRegisterationUri = "https://runvos-bm-app.onrender.com/auth/register";
const manualLoginUri        = "https://runvos-bm-app.onrender.com/auth/login";
const logoutUri             = "https://runvos-bm-app.onrender.com/auth/logout";
const googleAuthURL         = "https://runvos-bm-app.onrender.com/auth/google";          // popup target
const googleCallbackURL     = "https://runvos-bm-app.onrender.com/auth/google/callback"; // server returns tokens (JSON or HTML that postMessages)

/**** Elements ****/
const accountLink       = document.getElementById("account-link");
const accountText       = document.getElementById("account-text");
const accountDialog     = document.getElementById("account-dialog");
const accountForm       = document.getElementById("account-form");
const switchModeBtn     = document.getElementById("switch-mode");
const closeDialogBtn    = document.getElementById("close-dialog");
const googleBtn         = document.getElementById("googleSignInDiv");
const titleEl           = document.getElementById("account-title");
const submitBtn         = document.getElementById("account-submit");
const firstNameLabel    = document.getElementById("label-first-name");
const lastNameLabel     = document.getElementById("label-last-name");
const firstNameInput    = document.getElementById("account-firstName");
const lastNameInput     = document.getElementById("account-lastName");
const emailInput        = document.getElementById("account-email");
const passwordInput     = document.getElementById("account-password");

let isLoginMode = true;

/**** Security: which origins are allowed to postMessage tokens to this page ****/
const ALLOWED_TOKEN_ORIGINS = new Set([
  new URL(googleCallbackURL).origin, // your API origin
  window.location.origin             // (optional) same-origin front-end pages
]);

/**** Popup handle (so we can close when tokens arrive) ****/
let googlePopup = null;

/**** Utils ****/
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch (e) {
    console.error("Invalid JWT", e);
    return null;
  }
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  const user = accessToken ? decodeJWT(accessToken) : null;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    displayUser(user);
  }
}

function displayUser(user) {
  const fullName = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ");
  accountText.textContent = [fullName || ""].filter(Boolean).join("  ");
}

function clearAuthUI() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  accountText.textContent = "Account";
}

async function safeErrorText(res) {
  try { return await res.text(); } catch { return ""; }
}

function openCenteredPopup(url, name, width = 500, height = 620) {
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top  = window.screenY + Math.max(0, (window.outerHeight - height) / 2);
  return window.open(
    url,
    name,
    `width=${width},height=${height},left=${left},top=${top},resizable,scrollbars`
  );
}

/**** Receive tokens from popup via postMessage ****/
window.addEventListener("message", (event) => {
  try {
    if (!ALLOWED_TOKEN_ORIGINS.has(event.origin)) return;

    const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    if (!data || data.type !== "oauthTokens") return;

    const { accessToken, refreshToken } = data;
    if (!accessToken && !refreshToken) return;

    setTokens({ accessToken, refreshToken });
    if (googlePopup && !googlePopup.closed) googlePopup.close();
    accountDialog.close();
  } catch (err) {
    console.error("Failed to handle postMessage:", err);
  }
});

/**** Init on load ****/
document.addEventListener("DOMContentLoaded", () => {
  // If tokens are present in URL (rare), consume & clean
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get("accessToken");
  const refreshToken = urlParams.get("refreshToken");
  if (accessToken || refreshToken) {
    setTokens({ accessToken, refreshToken });
    window.history.replaceState({}, document.title, window.location.pathname);
    return;
  }

  // Restore existing session
  const saved = localStorage.getItem("accessToken");
  if (saved) {
    const user = decodeJWT(saved);
    if (user) displayUser(user);
  }
});

/**** Account link ****/
accountLink.addEventListener("click", (e) => {
  e.preventDefault();
  const token = localStorage.getItem("accessToken");
  if (token) {
    const user = decodeJWT(token) || {};
    const who = user.name || user.firstName || user.email || "this account";
    if (confirm(`Sign out ${who}?`)) logoutUser();
  } else {
    accountDialog.showModal();
  }
});

/**** Mode switch ****/
switchModeBtn.addEventListener("click", () => {
  isLoginMode = !isLoginMode;

  titleEl.textContent = isLoginMode ? "Sign In" : "Register";
  submitBtn.textContent = isLoginMode ? "Login" : "Register";
  switchModeBtn.textContent = isLoginMode ? "Need an account?" : "Already have an account?";

  firstNameLabel.style.display = isLoginMode ? "none" : "block";
  lastNameLabel.style.display  = isLoginMode ? "none" : "block";

  firstNameInput.required = !isLoginMode;
  lastNameInput.required  = !isLoginMode;
});

/**** Close dialog ****/
closeDialogBtn.addEventListener("click", () => accountDialog.close());

/**** Manual Login/Register ****/
accountForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim(),
  };

  if (!isLoginMode) {
    payload.firstName = firstNameInput.value.trim();
    payload.lastName  = lastNameInput.value.trim();
  }

  const endpoint = isLoginMode ? manualLoginUri : manualRegisterationUri;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include"
    });

    if (!res.ok) throw new Error(await safeErrorText(res) || "Authentication failed");

    const data = await res.json();
    setTokens(data);
    accountDialog.close();
  } catch (err) {
    alert(err.message || "Authentication failed");
  }
});

/**** Google Sign-In: popup + instant token handoff via postMessage (with polling fallback) ****/
googleBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  // First attempt: fetch callback to see if tokens already available
  try {
    const res = await fetch(googleCallbackURL, {
      method: "GET",
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.accessToken || data?.refreshToken) {
        setTokens(data);
        accountDialog.close();
        return; // Done, no popup needed
      }
    }
  } catch (err) {
    console.warn("Silent callback fetch failed:", err);
  }

  // Second attempt: open popup for Google OAuth
  googlePopup = openCenteredPopup(googleAuthURL, "googleSignInPopup");

  if (!googlePopup) {
    // Popup blocked — do full redirect
    window.location.href = googleAuthURL;
    return;
  }

  // Listen for tokens via postMessage
  const listener = (event) => {
    if (!ALLOWED_TOKEN_ORIGINS.has(event.origin)) return;
    try {
      const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      if (data?.type === "oauthTokens" && (data.accessToken || data.refreshToken)) {
        setTokens(data);
        if (googlePopup && !googlePopup.closed) googlePopup.close();
        accountDialog.close();
        window.removeEventListener("message", listener);
      }
    } catch {}
  };
  window.addEventListener("message", listener);

  // Polling fallback in case postMessage doesn't fire
  const poll = setInterval(async () => {
    if (!googlePopup || googlePopup.closed) {
      clearInterval(poll);
      window.removeEventListener("message", listener);
      return;
    }
    try {
      const res = await fetch(googleCallbackURL, { method: "GET", credentials: "include" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.accessToken || data?.refreshToken) {
          setTokens(data);
          clearInterval(poll);
          googlePopup.close();
          accountDialog.close();
        }
      }
    } catch {}
  }, 800);
});

/**** Logout ****/
async function logoutUser() {
  try {
    // Pass refreshToken if your API expects it in body for invalidation
    const refreshToken = localStorage.getItem("refreshToken");
    await fetch(logoutUri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ refreshToken })
    });
  } catch {
    // ignore
  }
  clearAuthUI();
}
