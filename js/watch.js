const AFF_LINK = "https://go.natzus.click";
const params = new URLSearchParams(location.search);
const id = Number(params.get("id"));

const iframe = document.getElementById("player");
const overlay = document.getElementById("playerOverlay");
const related = document.getElementById("related");
const wrapper = document.querySelector(".player-wrapper");
const titleEl = document.getElementById("title");
const downloadBtn = document.getElementById("downloadBtn");

// LINK AFF (nếu có)
const AFF_LINK = "https://link-affiliate-cua-ban.com";

const video = videos.find(v => v.id === id);

if (!video) {
  titleEl.textContent = "Video không tồn tại";
  if (downloadBtn) downloadBtn.style.display = "none";
} else {
  // ===== TIÊU ĐỀ =====
  titleEl.textContent = video.title;

  // ===== POSTER THUMBNAIL =====
  iframe.src = "";
  wrapper.style.backgroundImage = `url(${video.thumb})`;

  // ===== DOWNLOAD =====
  if (video.download && downloadBtn) {
    downloadBtn.href = video.download;
    downloadBtn.setAttribute("download", "");
  } else if (downloadBtn) {
    downloadBtn.style.display = "none";
  }

  // ===== PLAY VIDEO =====
  overlay.onclick = () => {
    // mở aff trước (nếu dùng)
    if (AFF_LINK) {
      window.open(AFF_LINK, "_blank");
    }

    iframe.src = video.embed;
    overlay.style.display = "none";
    wrapper.style.backgroundImage = "none";
  };
}

// ===== VIDEO KHÁC =====
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
    card.onclick = () => {
      location.href = "watch.html?id=" + v.id;
    };
    related.appendChild(card);
  });
