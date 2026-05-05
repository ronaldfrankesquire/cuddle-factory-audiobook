const pages = [
  { number: 1, title: "The Tiny Noise in the Toy Box" },
  { number: 2, title: "Huggy Wuggy Pops Out" },
  { number: 3, title: "CatNap Is Too Sleepy" },
  { number: 4, title: "Cat-Bee Buzzes In" },
  { number: 5, title: "Kissy Missy Knows the Way" },
  { number: 6, title: "The Rainbow Button Puzzle" },
  { number: 7, title: "Huggy's Big Silly Hug" },
  { number: 8, title: "CatNap's Sleepy Cloud" },
  { number: 9, title: "Cat-Bee Finds the Sparkle Trail" },
  { number: 10, title: "Kathleen Saves the Bedtime Sparkle" },
  { number: 11, title: "The Cuddle Factory Glows Again" },
  { number: 12, title: "Back in Kathleen's Bedroom" },
].map((page) => ({
  ...page,
  image: `assets/pages/${page.number}.png`,
  audio: `assets/audio/${page.number}.m4a`,
}));

const pageMotion = [
  { color: "#c779ff", focusX: "46%", focusY: "58%", tx: "1.5%", ty: "-1.2%" },
  { color: "#22b6ff", focusX: "67%", focusY: "44%", tx: "-1.7%", ty: "0.7%" },
  { color: "#a96cff", focusX: "64%", focusY: "54%", tx: "-1.1%", ty: "-1.1%" },
  { color: "#ffd84c", focusX: "62%", focusY: "45%", tx: "1.3%", ty: "1.2%" },
  { color: "#ff74ac", focusX: "66%", focusY: "49%", tx: "-1.4%", ty: "0.9%" },
  { color: "#79e76e", focusX: "54%", focusY: "43%", tx: "1.5%", ty: "-0.9%" },
  { color: "#31a8ff", focusX: "66%", focusY: "56%", tx: "-1.5%", ty: "0.8%" },
  { color: "#a66cff", focusX: "62%", focusY: "47%", tx: "1.2%", ty: "-1%" },
  { color: "#ffd24a", focusX: "48%", focusY: "58%", tx: "1.8%", ty: "-0.7%" },
  { color: "#ff6fa8", focusX: "48%", focusY: "52%", tx: "-1.1%", ty: "0.9%" },
  { color: "#ffd96b", focusX: "54%", focusY: "47%", tx: "1.4%", ty: "-0.8%" },
  { color: "#ff7aa8", focusX: "57%", focusY: "49%", tx: "-1.4%", ty: "0.7%" },
];

const coverSpread = document.querySelector("#coverSpread");
const storyPage = document.querySelector("#storyPage");
const pageImage = document.querySelector("#pageImage");
const pageKicker = document.querySelector("#pageKicker");
const pageTitle = document.querySelector("#pageTitle");
const pageCounter = document.querySelector("#pageCounter");
const prevPage = document.querySelector("#prevPage");
const nextPage = document.querySelector("#nextPage");
const playPause = document.querySelector("#playPause");
const playIcon = document.querySelector("#playIcon");
const seek = document.querySelector("#seek");
const currentTime = document.querySelector("#currentTime");
const duration = document.querySelector("#duration");
const narration = document.querySelector("#narration");
const autoTurn = document.querySelector("#autoTurn");
const thumbStrip = document.querySelector("#thumbStrip");
const fxLayer = document.querySelector("#fxLayer");

let currentIndex = -1;
let isSeeking = false;
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateAudioButton() {
  playIcon.textContent = narration.paused ? "Play" : "Pause";
}

function syncMotionState() {
  storyPage.classList.toggle("is-playing", !narration.paused && currentIndex >= 0);
  storyPage.classList.toggle("motion-on", currentIndex >= 0 && !reducedMotionQuery.matches);
}

function updateRange() {
  if (!isSeeking) {
    seek.value = narration.duration ? (narration.currentTime / narration.duration) * 100 : 0;
  }

  currentTime.textContent = formatTime(narration.currentTime);
  duration.textContent = formatTime(narration.duration);
}

function setThumbState() {
  thumbStrip.querySelectorAll(".thumb-button").forEach((button) => {
    const pageIndex = Number(button.dataset.index);
    button.setAttribute("aria-current", pageIndex === currentIndex ? "page" : "false");
  });
}

async function playCurrentAudio() {
  try {
    await narration.play();
  } catch {
    updateAudioButton();
    syncMotionState();
  }
}

function buildSparkles(effect) {
  fxLayer.replaceChildren();

  for (let index = 0; index < 18; index += 1) {
    const spark = document.createElement("span");
    const x = 8 + Math.random() * 84;
    const y = 8 + Math.random() * 78;
    const size = 7 + Math.random() * 18;
    const floatX = -32 + Math.random() * 64;
    const floatY = -56 + Math.random() * 24;

    spark.className = "spark";
    spark.style.setProperty("--x", `${x}%`);
    spark.style.setProperty("--y", `${y}%`);
    spark.style.setProperty("--size", `${size}px`);
    spark.style.setProperty("--delay", `${-Math.random() * 5.5}s`);
    spark.style.setProperty("--float-x", `${floatX}px`);
    spark.style.setProperty("--float-y", `${floatY}px`);
    spark.style.setProperty("--spark-speed", `${4.2 + Math.random() * 3.6}s`);
    spark.style.setProperty("--spark-opacity", `${0.45 + Math.random() * 0.5}`);
    spark.style.setProperty("--spark-color", effect.color);
    fxLayer.append(spark);
  }
}

function applyMotionStyle(index) {
  const effect = pageMotion[index];

  storyPage.style.setProperty("--focus-x", effect.focusX);
  storyPage.style.setProperty("--focus-y", effect.focusY);
  storyPage.style.setProperty("--tx", effect.tx);
  storyPage.style.setProperty("--ty", effect.ty);
  storyPage.style.setProperty("--scale-mid", "1.04");
  storyPage.style.setProperty("--scale-end", "1.065");
  storyPage.style.setProperty("--motion-speed", `${18 + (index % 4) * 3}s`);
  buildSparkles(effect);
}

function loadPage(index, shouldPlay = true) {
  currentIndex = index;
  const page = pages[currentIndex];

  storyPage.classList.remove("is-playing", "is-turning");
  coverSpread.classList.add("is-hidden");
  storyPage.classList.remove("is-hidden");
  requestAnimationFrame(() => storyPage.classList.add("is-turning"));
  pageImage.src = page.image;
  pageImage.alt = `Story page ${page.number}: ${page.title}`;
  pageKicker.textContent = `Page ${page.number}`;
  pageTitle.textContent = page.title;
  pageCounter.textContent = `${page.number} of ${pages.length}`;
  prevPage.disabled = currentIndex <= 0;
  nextPage.textContent = currentIndex === pages.length - 1 ? "Back to Cover" : "Next Page";
  playPause.disabled = false;
  seek.disabled = false;
  applyMotionStyle(currentIndex);

  narration.pause();
  narration.currentTime = 0;
  narration.src = page.audio;
  narration.load();
  updateRange();
  updateAudioButton();
  setThumbState();
  syncMotionState();

  if (shouldPlay) {
    playCurrentAudio();
  }
}

function showCover() {
  currentIndex = -1;
  narration.pause();
  narration.removeAttribute("src");
  narration.load();
  storyPage.classList.remove("is-playing", "is-turning");
  fxLayer.replaceChildren();

  coverSpread.classList.remove("is-hidden");
  storyPage.classList.add("is-hidden");
  pageKicker.textContent = "Cover";
  pageTitle.textContent = "Cuddle Factory";
  pageCounter.textContent = "Press Play to begin";
  prevPage.disabled = true;
  nextPage.textContent = "Next Page";
  playPause.disabled = false;
  seek.disabled = true;
  seek.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  updateAudioButton();
  setThumbState();
  syncMotionState();
}

function goNext() {
  if (currentIndex === -1) {
    loadPage(0, true);
    return;
  }

  if (currentIndex >= pages.length - 1) {
    showCover();
    return;
  }

  loadPage(currentIndex + 1, true);
}

function goPrevious() {
  if (currentIndex > 0) {
    loadPage(currentIndex - 1, true);
  }
}

function buildThumbs() {
  const fragment = document.createDocumentFragment();

  pages.forEach((page, index) => {
    const button = document.createElement("button");
    button.className = "thumb-button";
    button.type = "button";
    button.dataset.index = String(index);
    button.setAttribute("aria-label", `Go to page ${page.number}: ${page.title}`);

    const image = document.createElement("img");
    image.src = page.image;
    image.alt = "";

    const label = document.createElement("span");
    label.textContent = page.number;

    button.append(image, label);
    button.addEventListener("click", () => loadPage(index, true));
    fragment.append(button);
  });

  thumbStrip.append(fragment);
}

nextPage.addEventListener("click", goNext);
prevPage.addEventListener("click", goPrevious);
storyPage.addEventListener("animationend", (event) => {
  if (event.animationName === "page-settle") {
    storyPage.classList.remove("is-turning");
  }
});

playPause.addEventListener("click", () => {
  if (currentIndex === -1) {
    loadPage(0, true);
    return;
  }

  if (narration.paused) {
    playCurrentAudio();
  } else {
    narration.pause();
  }
});

seek.addEventListener("input", () => {
  isSeeking = true;
  currentTime.textContent = formatTime((Number(seek.value) / 100) * narration.duration);
});

seek.addEventListener("change", () => {
  narration.currentTime = (Number(seek.value) / 100) * narration.duration;
  isSeeking = false;
  updateRange();
});

narration.addEventListener("play", () => {
  updateAudioButton();
  syncMotionState();
});
narration.addEventListener("pause", () => {
  updateAudioButton();
  syncMotionState();
});
narration.addEventListener("loadedmetadata", updateRange);
narration.addEventListener("timeupdate", updateRange);
narration.addEventListener("ended", () => {
  updateAudioButton();
  syncMotionState();
  if (autoTurn.checked && currentIndex < pages.length - 1) {
    loadPage(currentIndex + 1, true);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") goNext();
  if (event.key === "ArrowLeft") goPrevious();
  if (event.key === " " && currentIndex >= 0) {
    event.preventDefault();
    playPause.click();
  }
});

autoTurn.checked = true;
buildThumbs();
showCover();
