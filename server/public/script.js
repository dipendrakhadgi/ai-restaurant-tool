let mode = "menu";

function setMode(selected, button) {
  mode = selected;
    // remove active from all buttons
  const buttons = document.querySelectorAll(".mode-btn");
  buttons.forEach(btn => btn.classList.remove("active"));

  // add active to clicked button
  button.classList.add("active");
}

async function send() {
  const input = document.getElementById("input").value;
  const output = document.getElementById("output");
  const loading = document.getElementById("loading");

  output.innerText = "";
  loading.style.display = "block";

  try {
    const res = await fetch("/api", { // relative path works now
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ input, mode })
    });

    const data = await res.json();

    output.innerText = data.reply;
  } catch (error) {
    output.innerText = "Error: something went wrong";
  }

  loading.style.display = "none";
}