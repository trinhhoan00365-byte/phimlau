const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

const iframe = document.getElementById("player");
const overlay = document.getElementById("playerOverlay");
const related = document.getElementById("related");

const video = videos.find(v => v.id === id);

if (video) {
  document.getElementById("title").textContent = video.title;

  overlay.onclick = () => {
    iframe.src = video.embed;
    overlay.style.display = "none";
  };
}

// VIDEO KHÁC
videos.filter(v => v.id !== id).slice(0, 6).forEach(v => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img class="thumb" src="${v.thumb}">
    <h3>${v.title}</h3>
  `;
  card.onclick = () => location.href = `watch.html?id=${v.id}`;
  related.appendChild(card);
});
