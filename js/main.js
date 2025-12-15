const grid = document.getElementById("video-grid");
const pagination = document.getElementById("pagination");

const perPage = 10;
let currentPage = 1;

function render() {
  grid.innerHTML = "";
  const start = (currentPage - 1) * perPage;
  const pageVideos = videos.slice(start, start + perPage);

  pageVideos.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img class="thumb" src="${v.thumb}">
      <h3>${v.title}</h3>
    `;
    card.onclick = () => location.href = `watch.html?id=${v.id}`;
    grid.appendChild(card);
  });

  renderPagination();
}

function renderPagination() {
  pagination.innerHTML = "";
  const total = Math.ceil(videos.length / perPage);

  for (let i = 1; i <= total; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      render();
    };
    pagination.appendChild(btn);
  }
}

render();
