/* 视频槽位: static/videos/ 里有对应文件就播, 没有就显示占位块。
   把文件按 data-src 里的名字丢进去即可生效, 不需要改 HTML。 */

/* 同一行(human / rollout)两个框取同一个比例, 不然左右高度对不齐。
   取两者里最“高”的那个(比例数值最小), 另一个用 object-fit: cover 裁掉左右两侧 ——
   宁可切边也不切上下, 因为上下更容易把手和物体切出画面。 */
function syncPairAspect(pair) {
  const slots = [...pair.querySelectorAll(".vslot")];
  const ratios = slots.map((s) => parseFloat(s.dataset.ar)).filter((v) => v > 0);
  if (!ratios.length) return;
  const ar = Math.min(...ratios);
  slots.forEach((s) => s.style.setProperty("--ar", ar));
}

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

  // 仿真那节: 框的比例跟着素材走, 免得 16:9 的框把画面裁掉或者留出黑边。
  // 真机轮播不参与, 那边有竖屏素材, 统一 16:9 更整齐。
  const pair = slot.closest(".tasks .vpair");
  if (pair) {
    video.addEventListener("loadedmetadata", () => {
      if (video.videoWidth && video.videoHeight) {
        slot.dataset.ar = video.videoWidth / video.videoHeight;
        syncPairAspect(pair);
      }
    });
  }

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
