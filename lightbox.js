// Fullscreen photo lightbox with left/right arrow navigation.
// Click any gallery photo to open it fullscreen, then use the arrow
// buttons to move through the other photos in that same section only.
//
// To caption a photo, fill in its data-caption in the HTML:
//     <img src="images/example.jpg" alt="..." data-caption="Rome, 2025">
// The caption shows under the photo when it is enlarged. Photos with an
// empty data-caption (or none at all) simply show no caption.

document.addEventListener("DOMContentLoaded", () => {

    const GROUP_SELECTOR =
        ".landscape-preview, .portrait-preview, .full-landscape-grid, .full-portrait-grid";

    const triggers = Array.from(
        document.querySelectorAll(".gallery-photo img, .photo-card img")
    );

    if (triggers.length === 0) return;

    // Group photos by their section so browsing stays within e.g. Landscape.
    const groups = [];
    const groupByContainer = new Map();

    triggers.forEach((img) => {
        const container = img.closest(GROUP_SELECTOR) || document.body;

        let group = groupByContainer.get(container);
        if (!group) {
            group = [];
            groupByContainer.set(container, group);
            groups.push(group);
        }

        group.push({
            src: img.src,
            alt: img.alt,
            caption: (img.dataset.caption || "").trim(),
        });
    });

    const overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("aria-hidden", "true");

    const closeButton = document.createElement("button");
    closeButton.className = "lightbox-close";
    closeButton.setAttribute("aria-label", "Close photo viewer");
    closeButton.innerHTML = "&times;";

    const prevButton = document.createElement("button");
    prevButton.className = "lightbox-arrow lightbox-arrow-prev";
    prevButton.setAttribute("aria-label", "Previous photo");
    prevButton.innerHTML = "&#8249;";

    const nextButton = document.createElement("button");
    nextButton.className = "lightbox-arrow lightbox-arrow-next";
    nextButton.setAttribute("aria-label", "Next photo");
    nextButton.innerHTML = "&#8250;";

    const stage = document.createElement("figure");
    stage.className = "lightbox-stage";

    const stageImg = document.createElement("img");

    const caption = document.createElement("figcaption");
    caption.className = "lightbox-caption";

    stage.appendChild(stageImg);
    stage.appendChild(caption);

    overlay.appendChild(closeButton);
    overlay.appendChild(prevButton);
    overlay.appendChild(stage);
    overlay.appendChild(nextButton);
    document.body.appendChild(overlay);

    let currentGroup = null;
    let currentIndex = 0;
    let lastFocused = null;

    function render() {
        const photo = currentGroup[currentIndex];
        stageImg.src = photo.src;
        stageImg.alt = photo.alt;

        caption.textContent = photo.caption;
        caption.hidden = photo.caption === "";

        const hasMultiple = currentGroup.length > 1;
        prevButton.hidden = !hasMultiple;
        nextButton.hidden = !hasMultiple;
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
        render();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % currentGroup.length;
        render();
    }

    function openLightbox(group, index) {
        lastFocused = document.activeElement;

        currentGroup = group;
        currentIndex = index;
        render();

        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-locked");

        closeButton.focus();
    }

    function closeLightbox() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-locked");

        if (lastFocused) lastFocused.focus();
    }

    let triggerIndex = 0;
    groups.forEach((group) => {
        group.forEach((photo, indexInGroup) => {
            const img = triggers[triggerIndex];
            triggerIndex += 1;

            img.style.cursor = "zoom-in";
            img.addEventListener("click", () => openLightbox(group, indexInGroup));
        });
    });

    prevButton.addEventListener("click", showPrev);
    nextButton.addEventListener("click", showNext);
    closeButton.addEventListener("click", closeLightbox);

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) closeLightbox();
    });

    document.addEventListener("keydown", (event) => {
        if (!overlay.classList.contains("is-open")) return;

        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowLeft") showPrev();
        if (event.key === "ArrowRight") showNext();
    });

});
