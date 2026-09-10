// Opens an Instagram post in a popup over the page, instead of sending
// the visitor off to instagram.com.
//
// Each tile in the .ig-grid is a link. Paste a post's own URL into its
// href and this turns it into a popup:
//
//     <a class="ig-post" href="https://www.instagram.com/p/ABC123/">
//
// Instagram serves an embeddable version of any public post at that same
// URL with "embed" on the end, which is what the popup loads. Links that
// are not a post or a reel — the plain @axocolumbia profile link a tile
// starts with — are left alone and simply open Instagram as usual.

document.addEventListener("DOMContentLoaded", () => {

    const POST_PATTERN =
        /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[^/?#]+/i;

    const tiles = Array.from(document.querySelectorAll(".ig-post"));

    if (tiles.length === 0) return;

    // Turns a post link into its embeddable form.
    function embedUrl(href) {
        const base = POST_PATTERN.exec(href)[0].replace(/\/+$/, "");
        return base + "/embed";
    }

    const linked = [];

    tiles.forEach((tile) => {
        if (POST_PATTERN.test(tile.href)) linked.push(tile);
        else tile.classList.add("is-unlinked");
    });

    if (linked.length === 0) return;


    /* ---------- the popup itself ---------- */

    const popup = document.createElement("div");
    popup.className = "ig-popup";
    popup.setAttribute("aria-hidden", "true");

    const closeButton = document.createElement("button");
    closeButton.className = "ig-popup-close";
    closeButton.setAttribute("aria-label", "Close post");
    closeButton.innerHTML = "&times;";

    const frame = document.createElement("div");
    frame.className = "ig-popup-frame";

    const embed = document.createElement("iframe");
    embed.setAttribute("title", "Instagram post");
    embed.setAttribute("allowtransparency", "true");
    embed.setAttribute("frameborder", "0");
    embed.setAttribute("scrolling", "no");

    // Instagram will not always allow the embed to load — a private
    // account, a deleted post, or a browser blocking third-party
    // content. This line is always there as the way out.
    const fallback = document.createElement("p");
    fallback.className = "ig-popup-fallback";

    const fallbackLink = document.createElement("a");
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener";
    fallbackLink.textContent = "Open this post on Instagram ↗";

    fallback.appendChild(fallbackLink);

    frame.appendChild(embed);
    frame.appendChild(fallback);

    popup.appendChild(closeButton);
    popup.appendChild(frame);
    document.body.appendChild(popup);

    let lastFocused = null;

    function openPopup(href) {
        lastFocused = document.activeElement;

        embed.src = embedUrl(href);
        fallbackLink.href = href;

        popup.classList.add("is-open");
        popup.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-locked");

        closeButton.focus();
    }

    function closePopup() {
        popup.classList.remove("is-open");
        popup.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-locked");

        // Stops the post from playing on in the background.
        embed.src = "";

        if (lastFocused) lastFocused.focus();
    }

    linked.forEach((tile) => {
        tile.addEventListener("click", (event) => {
            // Let people still command-click through to Instagram.
            if (event.metaKey || event.ctrlKey || event.shiftKey) return;

            event.preventDefault();
            openPopup(tile.href);
        });
    });

    closeButton.addEventListener("click", closePopup);

    popup.addEventListener("click", (event) => {
        if (event.target === popup) closePopup();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && popup.classList.contains("is-open")) {
            closePopup();
        }
    });

});
