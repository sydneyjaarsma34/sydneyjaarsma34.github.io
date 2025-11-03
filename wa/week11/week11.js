const API_BASE = "https://www.omdbapi.com/";
const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const errorMsg = document.getElementById("error-msg");
const flist = document.getElementById("flist");

function getKey() { return localStorage.getItem("omdbKey") || ""; }
function saveKey() {
  const key = document.getElementById("apiKey").value.trim();
  if (key) {
    localStorage.setItem("omdbKey", key);
    alert("your api key was saved locally on your computer");
  } else alert("your key is not valid. Please try again.");
}
function clearKey() {
  localStorage.removeItem("omdbKey");
  document.getElementById("apiKey").value = "";
  alert("your api key has been cleared");
}

// to make the list of favorites
function getFavs() { return JSON.parse(localStorage.getItem("favorites") || "[]"); }
function setFavs(favs) { localStorage.setItem("favorites", JSON.stringify(favs)); renderFavs(); }
function addFav(movie) {
  const favs = getFavs();
  if (favs.some(f => f.imdbID === movie.imdbID)) return alert("This item is already in your favorites");
  favs.push(movie);
  setFavs(favs);
}
function removeFav(id) {
  const favs = getFavs().filter(f => f.imdbID !== id);
  setFavs(favs);
}
function clearFavs() {
  if (confirm("Are you sure you want to clear?")) {
    localStorage.removeItem("favorites");
    renderFavs();
  }
}

function renderFavs() {
  const favs = getFavs();
  flist.innerHTML = favs.length ? "" : "<p class='small'>No favorites yet.</p>";
  favs.forEach(m => {
    const div = document.createElement("div");
    div.className = "fav-item";
    div.innerHTML = `<span>${m.Title} (${m.Year})</span>
                     <button onclick="removeFav('${m.imdbID}')">Delete</button>`;
    flist.appendChild(div);
  });
}

// the search function - this was soooo annoying
async function searchMovies() {
  const key = getKey();
  if (!key) return alert("Please enter and save your OMDb API key first!");
  const query = searchInput.value.trim();
  if (!query) return alert("Enter a movie title!");
  errorMsg.style.display = "none";
  results.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(`${API_BASE}?apikey=${key}&s=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.Response === "False") throw new Error(data.Error || "No results found.");
    renderResults(data.Search.slice(0, 10));
  } catch (err) {
    results.innerHTML = "";
    errorMsg.textContent = "⚠️ " + err.message;
    errorMsg.style.display = "block";
  }
}


//something is broken and i don't know how to fix it (crying emoji)
async function renderResults(list) {
  results.innerHTML = "";
  const key = getKey();
  for (const movie of list) {
    const detailRes = await fetch(`${API_BASE}?apikey=${key}&i=${movie.imdbID}&plot=short`);
    const detail = await detailRes.json();

    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${detail.Poster !== "N/A" ? detail.Poster : "https://via.placeholder.com/200x300?text=No+Image"}" alt="${detail.Title}">
      <h3>${detail.Title}</h3>
      <p class="small">${detail.Year} • ${detail.Director || "Unknown Director"}</p>
      <p class="small">${detail.Plot || ""}</p>
    `;

    const btn = document.createElement("button");
    btn.className = "btn-fav";
    btn.textContent = "Save";
    btn.onclick = () => addFav(detail);

    div.appendChild(btn);
    results.appendChild(div);
  }
}


// variables and shit, idk javascript is hard
document.getElementById("searchBtn").onclick = searchMovies;
document.getElementById("saveKey").onclick = saveKey;
document.getElementById("clearKey").onclick = clearKey;
document.getElementById("clearFavs").onclick = clearFavs;
document.getElementById("apiKey").value = getKey();
renderFavs();