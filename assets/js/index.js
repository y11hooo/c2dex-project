/* 视频槽位: static/videos/ 里有对应文件就播, 没有就显示占位块。
   把文件按 data-src 里的名字丢进去即可生效, 不需要改 HTML。 */

function fillSlot(slot) {
  const src = slot.dataset.src;
  const label = slot.dataset.label || "";

  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.controls = false;
  video.src = src;

  video.addEventListener("error", () => {
    video.remove();
    slot.classList.add("empty");
    slot.insertAdjacentHTML("afterbegin",
      '<div class="ph"><div class="ph-title">VIDEO PENDING</div>' +
      '<div class="ph-file">' + src.split("/").pop() + "</div></div>");
  });

  slot.appendChild(video);
  if (label) {
    slot.insertAdjacentHTML("beforeend", '<span class="tag">' + label + "</span>");
  }
  return video;
}

// 进入视口才播放, 离开就暂停, 避免几十个视频同时解码
function watch(video) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        video.play().catch(() => {});   // 浏览器拦截自动播放时静默失败
      } else {
        video.pause();
      }
    }
  }, { threshold: 0.25 });
  io.observe(video);
}

document.querySelectorAll(".vslot").forEach((slot) => watch(fillSlot(slot)));

// Hero 静态密铺帧墙：人类演示与对应机器人执行上下交替，不做横向滚动。
const heroWall = document.querySelector(".hero-wall");
if (heroWall) {
  const heroPairs = [
    ["Human_Sweep", "Robot_Sweep"],
    ["Human_cap_3", "Robot_Cap"],
    ["Human_Pour", "Robot_pour"],
    ["Human_eraser_15", "Robot_eraser"],
    ["Human_drop_litter", "Robot_Drop_Litter"],
    ["Human_brush_5", "Robot_Brush_5"]
  ];
  const frameNumbers = ["0000", "0014", "0028", "0042", "0056", "0070", "0084", "0098", "0112", "0126", "0140", "0154"];

  heroPairs.flat().forEach((source, rowIndex) => {
    const row = document.createElement("div");
    row.className = "hero-row";
    frameNumbers.forEach((frameNumber, tileIndex) => {
      const tile = document.createElement("div");
      tile.className = "hero-tile";
      const image = document.createElement("img");
      image.src = `assets/Frame/${source}/frame_${frameNumbers[(tileIndex + rowIndex) % frameNumbers.length]}.png`;
      image.alt = "";
      image.decoding = "async";
      image.addEventListener("error", () => {
        if (!image.dataset.fallback) {
          image.dataset.fallback = "true";
          image.src = `assets/Frame/${source}/frame_0000.png`;
        }
      });
      tile.appendChild(image);
      row.appendChild(tile);
    });
    heroWall.appendChild(row);
  });
}

// 轮播(图片 / 视频任务通用): 箭头 / 圆点 / 左右方向键
const carousels = [...document.querySelectorAll(".carousel")].map((carousel) => {
  const slides = [...carousel.querySelectorAll(".slide")];
  const dots = carousel.querySelector(".dots");
  let cur = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Go to item " + (i + 1));
    dot.addEventListener("click", () => show(i));
    dots.appendChild(dot);
  });

  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => {
      const on = k === cur;
      s.classList.toggle("on", on);
      // 藏起来的那一页把视频停掉, 只有当前页在解码
      s.querySelectorAll("video").forEach((v) => {
        if (on) { v.play().catch(() => {}); } else { v.pause(); }
      });
    });
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === cur));
  }

  carousel.querySelector(".prev").addEventListener("click", () => show(cur - 1));
  carousel.querySelector(".next").addEventListener("click", () => show(cur + 1));

  show(0);
  return { el: carousel, step: (d) => show(cur + d) };
});

// 方向键只作用于当前离视口中心最近的那个轮播, 否则几个轮播会一起翻页
document.addEventListener("keydown", (e) => {
  const d = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
  if (!d || !carousels.length) return;

  const mid = window.innerHeight / 2;
  let best = null, bestDist = Infinity;
  for (const c of carousels) {
    const r = c.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) continue;   // 完全在视口外的跳过
    const dist = Math.abs((r.top + r.bottom) / 2 - mid);
    if (dist < bestDist) { bestDist = dist; best = c; }
  }
  if (best) { e.preventDefault(); best.step(d); }
});

// BibTeX 复制
const copyBtn = document.querySelector(".bibtex .copy");
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    const text = document.querySelector(".bibtex pre").innerText;
    navigator.clipboard.writeText(text).then(() => {
      copyBtn.textContent = "Copied";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
    });
  });
}
