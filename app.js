let veterans = [];
let dataLoaded = false;

fetch("veterans.json")
  .then(r => r.json())
  .then(data => {
    veterans = data.veterans;
    dataLoaded = true;
    renderList(veterans);
  })
  .catch(err => {
    console.error("Error loading veterans data:", err);
    document.getElementById("list").innerHTML = "<li>Error loading data. Please refresh the page.</li>";
  });

function renderList(arr) {
  const ul = document.getElementById("list");
  ul.innerHTML = "";
  
  if (arr.length === 0) {
    ul.innerHTML = "<li>No results found.</li>";
    return;
  }
  
  arr.forEach(v => {
    const li = document.createElement("li");
    
    // Format phone numbers
    const phones = v.phones && v.phones.length > 0 
      ? v.phones.join(", ") 
      : "No phone available";
    
    // Create structured display
    li.innerHTML = `
      <div class="veteran-item">
        <div class="veteran-name"><strong>${v.name}</strong></div>
        <div class="veteran-address">📍 ${v.address}</div>
        <div class="veteran-phones">📞 ${phones}</div>
      </div>
    `;
    ul.appendChild(li);
  });
}

// Helper function to normalize strings by removing spaces and converting to lowercase
function normalizeString(str) {
  return (str || "").toLowerCase().replace(/\s+/g, "");
}

  

function startVoice() {
  if (!dataLoaded) {
    alert("Please wait for data to load...");
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    alert("Speech recognition is not supported in your browser.");
    return;
  }
  
  const rec = new SpeechRecognition();
  rec.continuous = false;
  rec.interimResults = false;
  
  rec.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    document.getElementById("heard").innerText = "Heard: " + spoken;
    filterList(spoken);
  };
  
  rec.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    document.getElementById("heard").innerText = "Error: " + event.error;
  };
  
  rec.onend = () => {
    // Recognition ended
  };
  
  rec.start();
}
