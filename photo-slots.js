// Photo slots, and the clips that sit among them.
//
// Every photo on marketing.html points at a file in images/marketing/
// that may not exist yet. Rather than showing a broken image, each slot
// starts hidden (see "EMPTY PHOTO SLOTS" in style.css) and is revealed
// here only once its file actually loads. The dashed label next to it
// disappears at the same moment.
//
// So adding a photo is just: drop the file into images/marketing/ with
// the name printed on the label. No HTML to edit.

document.addEventListener("DOMContentLoaded", () => {

    const slots = document.querySelectorAll("img[data-slot]");

    slots.forEach((img) => {

        const label = img.parentElement.querySelector(".slot-label");

        function fill() {
            img.style.display = "block";
            delete img.dataset.slotEmpty;

            if (label) label.hidden = true;
        }

        function leaveEmpty() {
            // Marks the slot so the lightbox knows to skip past it.
            img.dataset.slotEmpty = "true";
        }

        if (img.complete) {
            if (img.naturalWidth > 0) fill();
            else leaveEmpty();
            return;
        }

        img.addEventListener("load", fill);
        img.addEventListener("error", leaveEmpty);

    });

});


// Clips in the project grids play on their own, silently and on a loop.
// Anyone who has asked their system to reduce motion gets them stopped
// with controls instead, so a moving picture is never forced on them.

document.addEventListener("DOMContentLoaded", () => {

    if (!window.matchMedia) return;

    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");

    function settle() {
        document.querySelectorAll(".shot video").forEach((clip) => {

            if (!stillness.matches) return;

            clip.autoplay = false;
            clip.controls = true;
            clip.pause();

        });
    }

    settle();
    stillness.addEventListener("change", settle);

});


// Grids that hold more than they show.
//
// A grid marked data-reveal="4" shows its first four tiles and keeps the
// rest back behind a button. The button is built here rather than
// written into the page, so it only exists when there is something for
// it to reveal — a project with four photographs and a "View all" that
// reveals nothing would just be a lie.

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".shot-grid[data-reveal]").forEach((grid) => {

        const shown = parseInt(grid.dataset.reveal, 10);
        const tiles = Array.from(grid.children);

        if (!shown || tiles.length <= shown) return;

        const hidden = tiles.slice(shown);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "pill-button reveal-button";

        function settle(open) {
            hidden.forEach((tile) => { tile.hidden = !open; });
            button.textContent = open
                ? "Show fewer ↑"
                : `View all ${tiles.length} photos ↓`;
            button.setAttribute("aria-expanded", String(open));
        }

        settle(false);

        button.addEventListener("click", () => {
            settle(button.getAttribute("aria-expanded") !== "true");
        });

        grid.insertAdjacentElement("afterend", button);

    });

});
