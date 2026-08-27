const form = document.querySelector("#contact-form");
const statusLine = document.querySelector("#form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  const payload = {
    source: "signal-contact-example",
    ...Object.fromEntries(new FormData(form).entries()),
  };

  button.disabled = true;
  statusLine.className = "form-status";
  statusLine.textContent = "Sending your signal...";

  try {
    const isLocalServer = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const response = await fetch(isLocalServer ? "/submit" : "/", {
      method: "POST",
      headers: isLocalServer
        ? { "Content-Type": "application/json", Accept: "application/json" }
        : { "Content-Type": "application/x-www-form-urlencoded" },
      body: isLocalServer
        ? JSON.stringify(payload)
        : new URLSearchParams(new FormData(form)).toString(),
    });
    if (!response.ok) throw new Error("The server did not accept the submission.");
    const result = isLocalServer ? await response.json() : null;
    statusLine.textContent = result
      ? `Saved at ${result.timestamp}. Thanks for reaching out.`
      : "Thanks for reaching out. Your signal is on its way.";
    form.reset();
  } catch (error) {
    statusLine.className = "form-status error";
    statusLine.textContent = error.message || "Something went wrong. Try again.";
  } finally {
    button.disabled = false;
  }
});
