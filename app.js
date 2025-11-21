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

function filterList(q = null) {
  if (!dataLoaded) {
    document.getElementById("list").innerHTML = "<li>Loading data...</li>";
    return;
  }
  
  const query = (q || document.getElementById("search").value).trim();
  
  if (!query) {
    renderList(veterans);
    return;
  }
  
  const queryLower = query.toLowerCase();
  const words = queryLower.split(/\s+/);
  
  // First word should be ServiceType, rest should be name
  let filtered;
  
  if (words.length >= 2) {
    // Parse ServiceType (first word) and name (remaining words)
    const serviceType = words[0];
    const nameParts = words.slice(1).join(" ");
    
    filtered = veterans.filter(v => {
      const matchesServiceType = v.serviceType && 
        v.serviceType.toLowerCase().includes(serviceType);
      const matchesName = v.name && 
        v.name.toLowerCase().includes(nameParts);
      
      return matchesServiceType && matchesName;
    });
  } else {
    // Fallback: search in all fields if only one word provided
    filtered = veterans.filter(v => {
      const searchText = (
        (v.serviceType || "") + " " +
        (v.name || "") + " " +
        (v.address || "")
      ).toLowerCase();
      return searchText.includes(queryLower);
    });
  }
  
  renderList(filtered);
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
