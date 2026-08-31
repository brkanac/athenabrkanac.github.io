// Fullscreen scrollable photo lightbox.
// Click any gallery photo to open it fullscreen, then scroll to browse the rest.

document.addEventListener("DOMContentLoaded", () => {

    const triggers = Array.from(
        document.querySelectorAll(".gallery-photo img, .photo-card img")
    );

    if (triggers.length === 0) return;

    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("aria-hidden", "true");

    const closeButton = document.createElement("button");
    closeButton.className = "lightbox-close";
    closeButton.setAttribute("aria-label", "Close photo viewer");
    closeButton.innerHTML = "&times;";

    const track = document.createElement("div");
    track.className = "lightbox-track";

    triggers.forEach((img) => {
        const slide = document.createElement("div");
        slide.className = "lightbox-slide";

        const slideImg = document.createElement("img");
        slideImg.src = img.src;
        slideImg.alt = img.alt;

        slide.appendChild(slideImg);
        track.appendChild(slide);
    });

    overlay.appendChild(closeButton);
    overlay.appendChild(track);
    document.body.appendChild(overlay);

    const slides = Array.from(track.children);
    let lastFocused = null;

    function openLightbox(index) {
        lastFocused = document.activeElement;

        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-locked");

        slides[index].scrollIntoView({ block: "start", behavior: "instant" });

        closeButton.focus();
    }

    function closeLightbox() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-locked");

        if (lastFocused) lastFocused.focus();
    }

    triggers.forEach((img, index) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => openLightbox(index));
    });

    closeButton.addEventListener("click", closeLightbox);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && overlay.classList.contains("is-open")) {
            closeLightbox();
        }
    });

});
