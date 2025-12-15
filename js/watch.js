const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

const video = videos.find(v => v.id === id);

const iframe = document.getElementById("player");
const overlay = document.getElementById("playerOverlay");

if (video) {
  document.getElementById("title").textContent = video.title;

  overlay.onclick = () => {
    iframe.src = video.embed;
    overlay.style.display = "none";
  };
}
