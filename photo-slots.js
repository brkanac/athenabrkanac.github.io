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
