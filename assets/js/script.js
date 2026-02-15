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
  email: "r.brewer@xpsystems.eu",
  skills: ["C", "Java", "GLSL", "PHP", "Git", "Bash", "MySQL", "Python", "Laravel", "Linux", "BSD", "JS/HTML/CSS"],
  projects: [
    {
      title: "Custom Compiler",
      description: "Building a compiler for my own programming language in C.",
      url: null,
      tags: ["C", "Systems", "Compilers"]
    },
    {
      title: "keklist",
      description: "checklist system, gui and cli options, can have cloud based (my server) or locally based db.",
      url: "https://github.com/DogWaterDev/keklist",
      tags: ["C", "MySQL"]
    },
    {
      title: "Orchestra SkyBlock",
      description: "SkyBlock-System Plugin for Minecraft which uses dependencies like KomodoPerms and WorldFramework.",
      url: "https://github.com/DogWaterDev/Orchestra-SkyBlock",
      tags: ["Java", "Bukkit-API", "Spigot-API"]
    }
  ],
  socials: {
    github: "DogWaterDev",
    personal_website: "https://dogwaterdev.de"
  }
};

const themeSelect = document.getElementById("themeSelect");
const toggleBtn = document.querySelector(".mobile-toggle");
const navLinks = document.querySelector(".nav-links");
const body = document.body;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("user-theme", theme);
  if (themeSelect) themeSelect.value = theme;
}

if (themeSelect) {
  themeSelect.addEventListener("change", (e) => applyTheme(e.target.value));
}

const savedTheme = localStorage.getItem("user-theme") || DEFAULT_SETTINGS.theme;
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
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: now }));
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

  if (heroName) heroName.textContent = data.username || data.name || "DogWaterDev";

  if (heroBio && data.bio) {
    const locationSpan = `<span class="hero-highlight" id="heroLocation">${data.location || "Germany"}</span>`;
    heroBio.innerHTML = data.bio.replace(data.location || "Germany", locationSpan);
  }

  if (avatarImage && data.avatar_url) {
    avatarImage.src = data.avatar_url;
    avatarImage.alt = `${data.username || "DogWaterDev"} avatar`;
  }

  if (emailLink && data.email) {
    emailLink.href = `mailto:${data.email}`;
  }

  if (githubLink && data.socials?.github) {
    githubLink.href = `https://github.com/${data.socials.github}`;
  }

  if (footerEmail && data.email) {
    footerEmail.href = `mailto:${data.email}`;
    footerEmail.textContent = data.email;
  }

  if (footerGithub && data.socials?.github) {
    footerGithub.href = `https://github.com/${data.socials.github}`;
    const usernameSpan = footerGithub.querySelector("span");
    if (usernameSpan) usernameSpan.textContent = `@${data.socials.github}`;
  }

  if (techStack && data.skills?.length > 0) {
    techStack.innerHTML = data.skills.map(skill =>
      `<div class="tech-badge">${skill}</div>`
    ).join("");
  }

  if (projectGrid && data.projects?.length > 0) {
    projectGrid.innerHTML = data.projects.map(project => {
      const tags = project.tags || (project.description?.match(/\b[A-Z][a-zA-Z]*\b/g) || []).slice(0, 3);
      const linkHTML = project.url ? `<a href="${project.url}" class="link">GitHub</a>` : "";

      return `
        <article class="project-card">
          <div class="project-content">
            <h3 class="project-title">${project.title || project.name}</h3>
            <p class="project-description">${project.description || ""}</p>
            ${linkHTML}
            <div class="tag-group">
              ${tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  if (apiRequestCount && data.api_request_count !== undefined) {
    apiRequestCount.textContent = data.api_request_count.toLocaleString();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const profileData = await fetchProfileData();
  updateDOM(profileData);

  document.getElementById("yearDisplay").textContent = new Date().getFullYear();
  showToast("Welcome! Portfolio data loaded.");
});