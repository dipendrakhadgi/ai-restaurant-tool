let mode = "menu";

function setMode(selected) {
  mode = selected;
}

async function send() {
  const input = document.getElementById("input").value;

  const res = await fetch("http://localhost:3000/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ input, mode })
  });

  const data = await res.json();

  document.getElementById("output").innerText = data.reply;
}