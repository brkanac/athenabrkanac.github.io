// Measures each photo in the homepage preview rows and records its
// aspect ratio on the card, so a row of photos with different shapes
// renders at one shared height. Nothing is cropped — only the width
// each photo is given changes.

document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(
        ".landscape-preview .photo-card, .portrait-preview .photo-card"
    );

    cards.forEach((card) => {

        const img = card.querySelector("img");
        if (!img) return;

        function applyRatio() {
            if (!img.naturalHeight) return;

            card.style.setProperty(
                "--photo-ratio",
                img.naturalWidth / img.naturalHeight
            );
        }

        if (img.complete) applyRatio();
        else img.addEventListener("load", applyRatio);

    });

});
