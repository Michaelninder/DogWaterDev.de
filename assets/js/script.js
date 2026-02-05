/**
 * DogWaterDev Portfolio Script
 * 28/01/2026
 */

const DEFAULT_SETTINGS = {
  theme: "dark",
};

const themeSelect = document.getElementById("themeSelect");
const toggleBtn = document.querySelector(".mobile-toggle");
const navLinks = document.querySelector(".nav-links");
const body = document.body;

// --- Theme Management ---
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("user-theme", theme);
  if (themeSelect) themeSelect.value = theme;
}

if (themeSelect) {
  themeSelect.addEventListener("change", (e) => {
    applyTheme(e.target.value);
  });
}

const savedTheme = localStorage.getItem("user-theme") || DEFAULT_SETTINGS.theme;
applyTheme(savedTheme);

// --- Scroll Behavior ---
// Using 50px threshold for better responsiveness than 360
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    body.classList.add("scrolled");
  } else {
    body.classList.remove("scrolled");
  }
});

// --- Mobile Navigation ---
if (toggleBtn && navLinks) {
  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("active");

    if (isOpen) {
      // Close
      navLinks.classList.remove("active");
      toggleBtn.classList.remove("active");
      body.style.overflow = ""; // Restore scroll
    } else {
      // Open
      navLinks.classList.add("active");
      toggleBtn.classList.add("active");
      body.style.overflow = "hidden"; // Lock scroll
    }
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      toggleBtn.classList.remove("active");
      body.style.overflow = "";
    });
  });
}

// --- Toast Notification System ---
function showToast(message, type = "info") {
  // Remove existing toast if present
  const existingToast = document.querySelector(".toast-notification");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";

  // Simple icon based on context
  const icon = type === "info" ? "🚧" : "✨";

  toast.innerHTML = `<span>${icon}</span> ${message}`;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  // Remove after 3.5 seconds
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, 3500);
}

// Replaces the old alert
document.addEventListener("DOMContentLoaded", () => {
  showToast("Welcome! This site is currently W.I.P.");
});





document.getElementById('yearDisplay').textContent = new Date().getFullYear();