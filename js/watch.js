const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

const iframe = document.getElementById("player");
const overlay = document.getElementById("playerOverlay");
const related = document.getElementById("related");
const wrapper = document.querySelector(".player-wrapper");

const video = videos.find(v => v.id === id);

if (video) {
  document.getElementById("title").textContent = video.title;

  // HIỂN THỊ THUMBNAIL LÀM POSTER
  wrapper.style.backgroundImage = `url(${video.thumb})`;

  overlay.onclick = () => {
    iframe.src = video.embed;
    overlay.style.display = "none";
    wrapper.style.backgroundImage = "none"; // bỏ poster khi chạy
  };
}

// VIDEO KHÁC
videos
  .filter(v => v.id !== id)
  .forEach(v => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb-wrap">
        <img class="thumb" src="${v.thumb}">
        <span class="duration">${v.duration}</span>
      </div>
      <h3>${v.title}</h3>
    `;
    card.onclick = () => location.href = `watch.html?id=${v.id}`;
    related.appendChild(card);
  });
