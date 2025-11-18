const API_BASE = "https://www.omdbapi.com/";
const API_KEY = "f88ac6fa"; // 🔒 built-in OMDb API key

const searchInput = document.getElementById("search");
const results = document.getElementById("results");
const errorMsg = document.getElementById("error-msg");
const favList = document.getElementById("favList");

// the favorites bar
function getFavs() {
  return JSON.parse(localStorage.getItem("favorites") || "[]");
}

function setFavs(favs) {
  localStorage.setItem("favorites", JSON.stringify(favs));
  renderFavs();
}

function addFav(movie) {
  const favs = getFavs();
  if (favs.some(f => f.imdbID === movie.imdbID))
    return alert("Already in favorites!");
  favs.push(movie);
  setFavs(favs);
}

function removeFav(id) {
  const favs = getFavs().filter(f => f.imdbID !== id);
  setFavs(favs);
}

function clearFavs() {
  if (confirm("Clear all favorites?")) {
    localStorage.removeItem("favorites");
    renderFavs();
  }
}

function exportFavs() {
  const blob = new Blob([JSON.stringify(getFavs(), null, 2)], {
    type: "application/json"
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "favorites.json";
  a.click();
}

function renderFavs() {
  const favs = getFavs();
  favList.innerHTML = favs.length ? "" : "<p class='small'>No favorites yet.</p>";
  favs.forEach(m => {
    //add a space for each element
    const div = document.createElement("div");
    div.className = "fav-item";
    div.innerHTML = `
      <span>${m.Title} (${m.Year})</span>
      <button onclick="removeFav('${m.imdbID}')">Delete</button>`;
    favList.appendChild(div);
  });
}

// search function stuff
async function searchMovies() {
  const query = searchInput.value.trim();
  if (!query) return alert("Enter a movie title!");
  errorMsg.style.display = "none";
  results.innerHTML = "<p>Loading...</p>";
  try {
    const res = await fetch(
      `${API_BASE}?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    if (data.Response === "False")
      throw new Error(data.Error || "No results found.");
    renderResults(data.Search.slice(0, 10));
  } catch (err) {
    results.innerHTML = "";
    errorMsg.textContent = "⚠️ " + err.message;
    errorMsg.style.display = "block";
  }
}

async function renderResults(list) {
  results.innerHTML = "";
  for (const movie of list) {
    const detailRes = await fetch(
      `${API_BASE}?apikey=${API_KEY}&i=${movie.imdbID}&plot=short`
    );
    const detail = await detailRes.json();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${
        detail.Poster !== "N/A"
          ? detail.Poster
          : "https://via.placeholder.com/200x300?text=No+Image"
      }" alt="${detail.Title}">
      <h3>${detail.Title}</h3>
      <p class="small">${detail.Year} • ${detail.Director || "Unknown Director"}</p>
      <p class="small">${detail.Plot || ""}</p>
      <button class="btn-fav" onclick='addFav(${JSON.stringify(detail)})'>Save</button>`;
    results.appendChild(div);
  }
}

//make the buttons work and stuff
document.getElementById("searchBtn").onclick = searchMovies;
document.getElementById("clearFavs").onclick = clearFavs;
document.getElementById("exportFavs").onclick = exportFavs;

// start with the favorites loaded
renderFavs();
