alert("This Site is still a W.I.P.");

const DEFAULT_SETTINGS = {
    theme: "dark",
};

const themeSelect = document.getElementById("themeSelect");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("user-theme", theme);
    themeSelect.value = theme;
}

themeSelect.addEventListener("change", (e) => {
    applyTheme(e.target.value);
});

const savedTheme = localStorage.getItem("user-theme") || DEFAULT_SETTINGS.theme;
applyTheme(savedTheme);


window.addEventListener("scroll", function (event) {
    let scroll = this.scrollY;
    if (scroll > 360) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }
});