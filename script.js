const SITE = {
  timezone: "America/Toronto",
};

const PRELOADER_MAX_MS = 5000;
const PRELOADER_EXIT_MS = 700;

function setupHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggleClass = () => {
    if (window.scrollY > 8) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  toggleClass();
  window.addEventListener("scroll", toggleClass, { passive: true });
}

function setupMobileNav() {
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");
  if (!navToggle || !primaryNav) return;

  navToggle.addEventListener("click", () => {
    const isOpen = primaryNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupRevealAnimations() {
  const revealNodes = document.querySelectorAll(".reveal");
  if (!revealNodes.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealNodes.forEach((node) => observer.observe(node));

  // Prevent hidden content for users that do not scroll immediately.
  window.setTimeout(() => {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }, 1800);
}

function hidePreloader(preloader) {
  preloader.classList.add("is-exiting");
  document.body.classList.add("is-revealing");
  window.setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.body.classList.add("is-loaded");
  }, Math.round(PRELOADER_EXIT_MS * 0.55));
  window.setTimeout(() => preloader.remove(), PRELOADER_EXIT_MS + 120);
}

function setupPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) {
    document.body.classList.add("is-loaded");
    return;
  }

  const introVideo = document.getElementById("preloaderVideo");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let hasClosed = false;
  const closePreloader = () => {
    if (hasClosed) return;
    hasClosed = true;
    hidePreloader(preloader);
  };

  if (reduceMotion) {
    closePreloader();
    return;
  }

  const fallbackTimer = window.setTimeout(
    closePreloader,
    Math.max(0, PRELOADER_MAX_MS - PRELOADER_EXIT_MS)
  );
  introVideo?.addEventListener("ended", closePreloader, { once: true });
  introVideo?.addEventListener("error", closePreloader, { once: true });

  if (introVideo && typeof introVideo.play === "function") {
    introVideo.play().catch(closePreloader);
  }

  window.addEventListener(
    "pagehide",
    () => {
      window.clearTimeout(fallbackTimer);
    },
    { once: true }
  );
}

function toDayIndex(weekdayShort) {
  const map = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[weekdayShort] ?? 0;
}

function formatHour(hour24) {
  const period = hour24 >= 12 ? "p.m." : "a.m.";
  const normalized = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${normalized}:00 ${period}`;
}

function setupOpenStatus() {
  const statusNodes = Array.from(document.querySelectorAll(".open-status"));
  if (!statusNodes.length) return;

  const schedule = {
    0: { open: 11, close: 21, label: "Sunday" },
    1: null,
    2: { open: 11, close: 21, label: "Tuesday" },
    3: { open: 11, close: 21, label: "Wednesday" },
    4: { open: 11, close: 21, label: "Thursday" },
    5: { open: 11, close: 23, label: "Friday" },
    6: { open: 11, close: 23, label: "Saturday" },
  };

  const formatter = new Intl.DateTimeFormat("en-CA", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: SITE.timezone,
  });

  const parts = formatter.formatToParts(new Date());
  const values = parts.reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  const day = toDayIndex(values.weekday);
  const hour = Number(values.hour);
  const minute = Number(values.minute);
  const now = hour + minute / 60;
  const today = schedule[day];

  const setStatus = (fullMessage, heroMessage, state) => {
    statusNodes.forEach((node) => {
      const message = node.classList.contains("open-status--hero")
        ? heroMessage
        : fullMessage;
      node.textContent = message;
      node.setAttribute("data-open-state", state);
    });
  };

  if (today && now >= today.open && now < today.close) {
    const closes = formatHour(today.close).replace(":00 ", " ");
    setStatus(
      `Open now • Closes at ${formatHour(today.close)}`,
      `Open now • Closes ${closes}`,
      "open"
    );
    return;
  }

  if (today && now < today.open) {
    setStatus(
      `Closed now • Opens today at ${formatHour(today.open)}`,
      `Closed • Opens today at ${formatHour(today.open)}`,
      "closed"
    );
    return;
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const nextDay = (day + offset) % 7;
    const slot = schedule[nextDay];
    if (!slot) continue;
    const when = offset === 1 ? "tomorrow" : slot.label;
    setStatus(
      `Closed now • Opens ${when} at ${formatHour(slot.open)}`,
      `Closed • Opens ${when} at ${formatHour(slot.open)}`,
      "closed"
    );
    return;
  }

  setStatus("Hours unavailable", "Hours unavailable", "closed");
}

function setupYear() {
  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
}

setupHeaderScroll();
setupMobileNav();
setupRevealAnimations();
setupPreloader();
setupOpenStatus();
setupYear();
