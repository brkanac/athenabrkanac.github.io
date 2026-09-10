// Photo slots for the marketing page.
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
