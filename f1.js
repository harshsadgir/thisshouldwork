// ======= CONFIG =======
window.nextRaceDateIso = "2026-03-08T09:30:00"; // YYYY-MM-DDTHH:MM:SS (interpreted as local time)
window.nextRaceLabel = "Australian Grand Prix";
window.nextRaceLabelDateText = "08 March 2026 • 15:00 (Local Time)"; // visible text only

// ======= DOM LOOKUPS (robust) =======
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

// NOTE: your HTML uses classes for race name/date, not ids.
// Use querySelector to find them by class (fallback to id if you later change HTML).
const raceNameEl = document.querySelector(".race-name") || document.getElementById("raceName");
const raceDateEl = document.querySelector(".race-date") || document.getElementById("raceDate");

// basic presence check
if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
  console.error("Countdown elements missing. Ensure IDs 'days','hours','minutes','seconds' exist in HTML.");
} else {
  // update visible labels (if present)
  if (raceNameEl) raceNameEl.textContent = window.nextRaceLabel;
  if (raceDateEl) raceDateEl.textContent = window.nextRaceLabelDateText;

  // parse base date
  let base = new Date(window.nextRaceDateIso);
  if (isNaN(base.getTime())) {
    console.error("Invalid date in window.nextRaceDateIso:", window.nextRaceDateIso);
  } else {
    // bump year forward until it's in the future (handy for demo reuse)
    const now = () => new Date();
    let nextDate = new Date(base);
    let loops = 0;
    while (nextDate <= now() && loops < 10) {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      loops++;
    }
    if (nextDate <= now()) {
      console.warn("Could not find a future date from base. Countdown will show 00:00.");
    } else {
      console.info("Next race countdown set to:", nextDate.toString());
    }

    // update function
    function update() {
      const diff = nextDate - new Date();
      if (diff <= 0) {
        daysEl.textContent = hoursEl.textContent = minutesEl.textContent = secondsEl.textContent = "00";
        return;
      }
      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    update();
    setInterval(update, 1000);
  }

  // ======= video fade-out on scroll (robust) =======
  // only attach if .hero and .bg-video exist
  const heroEl = document.querySelector(".hero");
  const bgVideo = document.querySelector(".bg-video");

  if (heroEl && bgVideo) {
    window.addEventListener("scroll", () => {
      const heroHeight = heroEl.offsetHeight || 0;
      if (window.scrollY > heroHeight - 50) {
        bgVideo.classList.add("stop-video");
      } else {
        bgVideo.classList.remove("stop-video");
      }
    }, { passive: true });
  } else {
    // won't try to control video if elements not found
    if (!heroEl) console.warn(".hero element not found — video scroll hiding disabled.");
    if (!bgVideo) console.warn(".bg-video element not found — video scroll hiding disabled.");
  }
}



