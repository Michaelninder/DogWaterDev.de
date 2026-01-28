const DEFAULT_SETTINGS = {
    theme: "dark",
};

const themeSelect = document.getElementById("themeSelect");
const navContainer = document.querySelector(".nav-container");
const navLinks = document.querySelector(".nav-links");

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

window.addEventListener("scroll", function () {
    const scroll = window.scrollY;
    if (scroll > 50) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }
});

function initMobileMenu() {
    if (!navContainer || document.querySelector(".mobile-toggle")) return;

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "mobile-toggle";
    toggleBtn.ariaLabel = "Toggle Menu";
    toggleBtn.innerHTML = `
        <svg class="icon-menu" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg class="icon-close" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="display:none;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    `;

    const logo = navContainer.querySelector(".nav-logo");
    logo.after(toggleBtn);

    toggleBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        toggleBtn.querySelector(".icon-menu").style.display = isOpen
            ? "none"
            : "block";
        toggleBtn.querySelector(".icon-close").style.display = isOpen
            ? "block"
            : "none";
        document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            toggleBtn.querySelector(".icon-menu").style.display = "block";
            toggleBtn.querySelector(".icon-close").style.display = "none";
            document.body.style.overflow = "";
        });
    });
}

document.addEventListener("DOMContentLoaded", initMobileMenu);