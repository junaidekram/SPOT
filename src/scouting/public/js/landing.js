const spinner = document.querySelector("#landing .spinner-container");

const clientId =
  "800684505201-pfg5ddut06emg4l4ch4b8u0jco05vluh.apps.googleusercontent.com";
let currentUser;

if (typeof google !== "undefined" && google.accounts) {
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: false,
  });

  google.accounts.id.prompt((notification) => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      spinner.classList.remove("visible");
    }
  });

  document
    .querySelector(".auth-buttons .google")
    .addEventListener("click", () => {
      google.accounts.id.prompt();
    });
} else {
  document
    .querySelector(".auth-buttons .google")
    .classList.remove("active");
  spinner.classList.remove("visible");
}

setTimeout(() => {
  document.querySelector(".auth-buttons .google").classList.remove("active");
  spinner.classList.remove("visible");
}, 5000);

async function handleCredentialResponse(response) {
  const verification = await verify(response.credential);
  console.log(verification);
  if (verification.status) {
    currentUser = verification.user;
    //TODO: update ScoutingSync.scouterId
    switchPage("waiting");
    spinner.classList.remove("visible");
  }
}

function signOut() {
  if (typeof google !== "undefined" && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
  switchPage("landing");
  spinner.classList.remove("visible");
}

/**
 * The function of the isDemo method is so that whenever SPOT is in demo mode,
 *  it updates some text so that SPOT makes it very clear that it is in demo mode.
 */
async function isDemo() {
  const isDemo = await fetch("./auth/isDemo").then((res) => res.json()); // Check if in demo mode
  const demoEnabled = isDemo === true || isDemo === "true";

  demoLabel = document.querySelector(".demo-label");

  if (demoEnabled) {
    // Basically makes the demo text appear.
    demoLabel.textContent = "DEMO";
    demoLabel.style.fontSize = "3em";
    demoLabel.style.lineHeight = "1em";
    demoLabel.style.marginBottom = "12px";
  } else {
    // Basically makes the demo text disappear.
    demoLabel.textContent = "";
    demoLabel.style.fontSize = "0em";
    demoLabel.style.lineHeight = "0em";
    demoLabel.style.marginBottom = "0px";
  }
}
isDemo(); // Probably somewhere better to put this, but it works so I do not care to find it.

async function verify(idToken) {
  const res = await fetch("/auth/verify", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: idToken,
    },
  }).then((res) => res.json());
  return res;
}

document
  .querySelector("#landing > div.auth.landing-screen > div > div.manual")
  .addEventListener("click", () => {
    updateForm();
    switchPage("form");
  });

// signOutBtn.addEventListener("click", signOut)
