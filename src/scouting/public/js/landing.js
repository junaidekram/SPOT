const spinner = document.querySelector("#landing .spinner-container");

const clientId =
  "800684505201-pfg5ddut06emg4l4ch4b8u0jco05vluh.apps.googleusercontent.com";

google.accounts.id.initialize({
  client_id: clientId,
  callback: handleCredentialResponse,
});

document.querySelector(".auth-buttons .google").addEventListener("click", () => {
  google.accounts.id.prompt();
});

document.querySelector(".auth-buttons .google").classList.remove("active");
spinner.classList.remove("visible");

async function handleCredentialResponse(response) {
  const verification = await verify(response.credential);
  console.log(verification);
  if (verification.status) {
    //TODO: update ScoutingSync.scouterId
    switchPage("waiting");
  }
  spinner.classList.remove("visible");
}

function signOut() {
  google.accounts.id.disableAutoSelect();
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

async function verify(credential) {
  const res = await fetch("/auth/verify", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      token: credential,
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
