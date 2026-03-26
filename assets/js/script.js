//const API_URL = "https://getmy.name/get/DogWaterDev/data";
const API_URL = "https://getmy.name/api/v1/profile/DogWaterDev/";
const CACHE_KEY = "dogwaterdev_profile";
//const CACHE_DURATION = 3600000; // 1 hour
const CACHE_DURATION = 3600;

const DEFAULT_SETTINGS = { theme: "dark" };

const FALLBACK_DATA = {
  name: "Ramsay Brewer",
  username: "DogWaterDev",
  bio: "I like programming in C and Java, machine learning, game engines / physics coding and making useless projects. Arch btw ;)",
  location: "Germany",
  avatar_url: "https://github.com/DogWaterDev.png",
  email: null,
  skills: [
    "C",
    "Java",
    "GLSL",
    "PHP",
    "Git",
    "Bash",
    "MySQL",
    "Python",
    "Laravel",
    "Linux",
    "BSD",
    "JS/HTML/CSS",
  ],
  projects: [
    {
      title: "Custom Compiler",
      description: "Building a compiler for my own programming language in C.",
      url: null,
      tags: ["C", "Systems", "Compilers"],
    },
    {
      title: "keklist",
      description:
        "checklist system, gui and cli options, can have cloud based (my server) or locally based db.",
      url: "https://github.com/DogWaterDev/keklist",
      tags: ["C", "MySQL"],
    },
    {
      title: "Orchestra SkyBlock",
      description:
        "SkyBlock-System Plugin for Minecraft which uses dependencies like KomodoPerms and WorldFramework.",
      url: "https://github.com/DogWaterDev/Orchestra-SkyBlock",
      tags: ["Java", "Bukkit-API", "Spigot-API"],
    },
  ],
  socials: {
    github: "DogWaterDev",
    personal_website: "https://dogwaterdev.de",
  },
};

const themeSelect = document.getElementById("themeSelect");
const toggleBtn = document.querySelector(".mobile-toggle");
const navLinks = document.querySelector(".nav-links");
const body = document.body;

function obfuscateEmail(email) {
  return email
    .replace(/@/, " AT ")
    .replace(/\./g, " DOT ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("user-theme", theme);
  if (themeSelect) themeSelect.value = theme;
  const mobile = document.getElementById("themeSelectMobile");
  if (mobile) mobile.value = theme;
  const addr = document.querySelector(".ep-address");
  if (addr) { addr.innerHTML = ""; addr.appendChild(buildEmailCanvas()); }
}

function buildEmailCanvas() {
  const canvas = document.createElement("canvas");
  canvas.className = "ep-canvas";
  canvas.setAttribute("aria-label", "email address");
  canvas.setAttribute("role", "img");

  const style  = getComputedStyle(document.documentElement);
  const accent = style.getPropertyValue("--accent").trim() || "#569cd6";
  const font   = style.getPropertyValue("--code-font").trim() || "monospace";

  const u1 = "r", sep1 = ".", u2 = "brewer", at = "@", dom = "xpsystems", sep2 = ".", tld = "eu";
  const text = u1 + sep1 + u2 + at + dom + sep2 + tld;

  const fontSize = 18;
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext("2d");
  ctx.font = `700 ${fontSize}px ${font}`;
  const w = ctx.measureText(text).width + 24;
  const h = fontSize + 16;

  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width  = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);

  ctx.font = `700 ${fontSize}px ${font}`;
  ctx.fillStyle = accent;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 12, h / 2);

  return canvas;
}

if (themeSelect) {
  themeSelect.addEventListener("change", (e) => applyTheme(e.target.value));
}

const themeSelectMobile = document.getElementById("themeSelectMobile");
if (themeSelectMobile) {
  themeSelectMobile.addEventListener("change", (e) => applyTheme(e.target.value));
}

const savedTheme =
  localStorage.getItem("user-theme") || DEFAULT_SETTINGS.theme;
applyTheme(savedTheme);

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    body.classList.add("scrolled");
  } else {
    body.classList.remove("scrolled");
  }
});

if (toggleBtn && navLinks) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("active");
    navLinks.classList.toggle("active");
    toggleBtn.classList.toggle("active");
    body.style.overflow = isOpen ? "" : "hidden";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggleBtn.classList.remove("active");
      body.style.overflow = "";
    });
  });
}

function showToast(message, type = "info") {
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  const icon = type === "info" ? "🚧" : "✨";
  toast.innerHTML = `<span>${icon}</span> ${message}`;

  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

async function fetchProfileData() {
  const cached = localStorage.getItem(CACHE_KEY);
  const now = Date.now();

  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (now - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API fetch failed");

    const data = await response.json();
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: now })
    );
    return data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return cached ? JSON.parse(cached).data : FALLBACK_DATA;
  }
}

function updateDOM(data) {
  const heroName = document.getElementById("heroName");
  const heroBio = document.getElementById("heroBio");
  const heroLocation = document.getElementById("heroLocation");
  const avatarImage = document.getElementById("avatarImage");
  const emailLink = document.getElementById("emailLink");
  const githubLink = document.getElementById("githubLink");
  const footerEmail = document.getElementById("footerEmail");
  const footerGithub = document.getElementById("footerGithub");
  const techStack = document.getElementById("techStack");
  const projectGrid = document.getElementById("projectGrid");
  const apiRequestCount = document.getElementById("apiRequestCount");

  if (heroName)
    heroName.textContent = data.username || data.name || "DogWaterDev";

  if (heroBio && data.bio) {
    const locationSpan = `<span class="hero-highlight" id="heroLocation">${data.location || "Germany"}</span>`;
    heroBio.innerHTML = data.bio.replace(
      data.location || "Germany",
      locationSpan
    );
  }

  if (avatarImage && data.avatar_url) {
    avatarImage.src = data.avatar_url;
    avatarImage.alt = `${data.username || "DogWaterDev"} avatar`;
  }

  if (emailLink) {
    // email display is handled purely via CSS-split spans, no JS needed
  }

  if (githubLink && data.socials?.github) {
    githubLink.href = `https://github.com/${data.socials.github}`;
  }

  if (footerEmail) {
    // email display is handled purely via CSS-split spans, no JS needed
  }

  if (footerGithub && data.socials?.github) {
    footerGithub.href = `https://github.com/${data.socials.github}`;
    const usernameSpan = footerGithub.querySelector("span");
    if (usernameSpan)
      usernameSpan.textContent = `@${data.socials.github}`;
  }

  if (techStack && data.skills?.length > 0) {
    techStack.innerHTML = data.skills
      .map((skill) => `<div class="tech-badge">${skill}</div>`)
      .join("");
  }

  if (projectGrid && data.projects?.length > 0) {
    projectGrid.innerHTML = data.projects
      .map((project) => {
        const tags =
          project.tags ||
          (project.description?.match(/\b[A-Z][a-zA-Z]*\b/g) || []).slice(
            0,
            3
          );
        const linkHTML = project.url
          ? `<a href="${project.url}" class="link">GitHub</a>`
          : "";

        return `
        <article class="project-card">
          <div class="project-content">
            <h3 class="project-title">${project.title || project.name}</h3>
            <p class="project-description">${project.description || ""}</p>
            ${linkHTML}
            <div class="tag-group">
              ${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
        </article>
      `;
      })
      .join("");
  }

  if (apiRequestCount && data.api_request_count !== undefined) {
    apiRequestCount.textContent =
      data.api_request_count.toLocaleString();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  // Fade in page
  document.body.classList.add("loaded");

  const profileData = await fetchProfileData();
  updateDOM(profileData);

  document.getElementById("yearDisplay").textContent =
    new Date().getFullYear();

  // Only show welcome toast once per session
  if (!sessionStorage.getItem("welcomed")) {
    showToast("Welcome! Portfolio data loaded.");
    sessionStorage.setItem("welcomed", "1");
  }

  // Scroll-spy: highlight active nav link
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links li a[href^='#']");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => {
          a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach((s) => observer.observe(s));

  // Shared email popover — content injected by CSS only, never by JS
  // Email rendered onto a <canvas> — zero text nodes, zero scrape surface.
  // Parts assembled at runtime from separate variables; no complete address string exists.
  emailPopover.innerHTML =
    '<button class="ep-close" aria-label="Close">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>' +
    '<p class="ep-label">Contact via E-Mail</p>' +
    '<div class="ep-address"></div>' +
    '<p class="ep-note">Displayed as image — protected against bots and crawlers.</p>';

  emailPopover.querySelector(".ep-address").appendChild(buildEmailCanvas());

  function openPopover() {
    emailPopover.classList.add("visible");
    emailPopover.setAttribute("aria-hidden", "false");
  }

  function closePopover() {
    emailPopover.classList.remove("visible");
    emailPopover.setAttribute("aria-hidden", "true");
  }

  function togglePopover() {
    emailPopover.classList.contains("visible") ? closePopover() : openPopover();
  }

  emailPopover.querySelector(".ep-close").addEventListener("click", (e) => {
    e.stopPropagation();
    closePopover();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopover();
  });

  document.addEventListener("click", (e) => {
    const sidebar = document.getElementById("emailLink");
    const footer  = document.getElementById("footerEmail");
    if (!emailPopover.contains(e.target) && !sidebar.contains(e.target) && !footer.contains(e.target)) {
      closePopover();
    }
  });

  document.getElementById("emailLink").addEventListener("click", (e) => {
    e.stopPropagation();
    togglePopover();
  });

  document.getElementById("footerEmail").addEventListener("click", (e) => {
    e.stopPropagation();
    togglePopover();
  });
});
