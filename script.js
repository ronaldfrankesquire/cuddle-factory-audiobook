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

let currentIndex = -1;
let isSeeking = false;

function formatTime(value) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateAudioButton() {
  playIcon.textContent = narration.paused ? "Play" : "Pause";
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
  }
}

function loadPage(index, shouldPlay = true) {
  currentIndex = index;
  const page = pages[currentIndex];

  coverSpread.classList.add("is-hidden");
  storyPage.classList.remove("is-hidden");
  pageImage.src = page.image;
  pageImage.alt = `Story page ${page.number}: ${page.title}`;
  pageKicker.textContent = `Page ${page.number}`;
  pageTitle.textContent = page.title;
  pageCounter.textContent = `${page.number} of ${pages.length}`;
  prevPage.disabled = currentIndex <= 0;
  nextPage.textContent = currentIndex === pages.length - 1 ? "Back to Cover" : "Next Page";
  playPause.disabled = false;
  seek.disabled = false;

  narration.pause();
  narration.currentTime = 0;
  narration.src = page.audio;
  narration.load();
  updateRange();
  updateAudioButton();
  setThumbState();

  if (shouldPlay) {
    playCurrentAudio();
  }
}

function showCover() {
  currentIndex = -1;
  narration.pause();
  narration.removeAttribute("src");
  narration.load();

  coverSpread.classList.remove("is-hidden");
  storyPage.classList.add("is-hidden");
  pageKicker.textContent = "Cover";
  pageTitle.textContent = "Cuddle Factory";
  pageCounter.textContent = "Ready to begin";
  prevPage.disabled = true;
  nextPage.textContent = "Next Page";
  playPause.disabled = true;
  seek.disabled = true;
  seek.value = 0;
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";
  updateAudioButton();
  setThumbState();
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

playPause.addEventListener("click", () => {
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

narration.addEventListener("play", updateAudioButton);
narration.addEventListener("pause", updateAudioButton);
narration.addEventListener("loadedmetadata", updateRange);
narration.addEventListener("timeupdate", updateRange);
narration.addEventListener("ended", () => {
  updateAudioButton();
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

buildThumbs();
showCover();
