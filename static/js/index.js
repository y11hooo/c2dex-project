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

document.querySelectorAll(".vslot.blank").forEach((slot) => {
  const label = slot.dataset.label || "";
  if (label) slot.insertAdjacentHTML("beforeend", '<span class="tag">' + label + "</span>");
});
document.querySelectorAll(".vslot:not(.blank)").forEach((slot) => watch(fillSlot(slot)));

// 首页动态帧墙：每个任务的人类行和机器人行上下配对，同速无缝向右滚动。
const heroWall = document.querySelector(".hero-wall");
if (heroWall) {
  const heroTasks = [
    "sweep", "put-cap", "drop", "wipe",
    "nest-cups", "pour", "place", "stack-cups"
  ];
  const framesPerVideo = 8;
  const repeatsPerSequence = 5;

  function addHeroSequence(strip, task, source) {
    const sequence = document.createElement("div");
    sequence.className = "hero-sequence";
    for (let repeat = 0; repeat < repeatsPerSequence; repeat += 1) {
      for (let frame = 1; frame <= framesPerVideo; frame += 1) {
        const tile = document.createElement("div");
        tile.className = "hero-tile";
        const image = document.createElement("img");
        image.src = `static/images/hero-frames/${task}-${source}-${String(frame).padStart(2, "0")}.jpg`;
        image.alt = "";
        image.decoding = "async";
        tile.appendChild(image);
        sequence.appendChild(tile);
      }
    }
    strip.appendChild(sequence);
  }

  heroTasks.forEach((task, index) => {
    ["human", "robot"].forEach((source) => {
      const row = document.createElement("div");
      row.className = `hero-row hero-row-${source}`;
      const strip = document.createElement("div");
      strip.className = "hero-strip";
      const duration = 76 + index * 3;
      strip.style.setProperty("--row-duration", `${duration}s`);
      strip.style.setProperty("--row-delay", `-${index * 7}s`);
      addHeroSequence(strip, task, source);
      addHeroSequence(strip, task, source);
      row.appendChild(strip);
      heroWall.appendChild(row);
    });
  });
}

// 图片轮播: 箭头 / 圆点 / 左右方向键
document.querySelectorAll(".carousel").forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".slide")];
  const dots = carousel.querySelector(".dots");
  let cur = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.addEventListener("click", () => show(i));
    dots.appendChild(dot);
  });

  function show(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("on", k === cur));
    [...dots.children].forEach((d, k) => d.classList.toggle("on", k === cur));
  }

  carousel.querySelector(".prev").addEventListener("click", () => show(cur - 1));
  carousel.querySelector(".next").addEventListener("click", () => show(cur + 1));
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(cur - 1);
    if (e.key === "ArrowRight") show(cur + 1);
  });

  show(0);
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
