let veterans = [];

fetch("veterans.json")
  .then(r => r.json())
  .then(data => {
    veterans = data.veterans;
    renderList(veterans);
  });

function renderList(arr) {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  arr.forEach(v => {
    const li = document.createElement("li");
    li.innerText = v.rank + " " + v.name + " - " + v.address;
    ul.appendChild(li);
  });
}

function filterList(q = null) {
  const query = q || document.getElementById("search").value;
  const filtered = veterans.filter(v =>
    (v.rank + " " + v.name + " " + v.address).toLowerCase()
      .includes(query.toLowerCase())
  );
  renderList(filtered);
}

function startVoice() {
  const rec = new webkitSpeechRecognition();
  rec.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    document.getElementById("heard").innerText = "Heard: " + spoken;
    filterList(spoken);
  };
  rec.start();
}
