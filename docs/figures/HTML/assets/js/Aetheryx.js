function enterAetheryxMode() {
    const canvas = document.getElementById("rrCanvas");
    canvas.classList.add("fullscreen");

    // renderer goes full-window
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function exitAetheryxMode() {
    const canvas = document.getElementById("rrCanvas");
    canvas.classList.remove("fullscreen");

    const layout = document.querySelector(".layout");
    const rect = layout.getBoundingClientRect();

    renderer.setSize(rect.width, rect.height);
}
