// Opens the @axocolumbia feed in a popup over the page, instead of
// sending the visitor off to instagram.com.
//
// The posts inside the popup are loaded live from Instagram, so they
// always show the real thing — current caption, current like count —
// rather than a copy saved into this site.
//
// Which posts appear is set in marketing.html, in the .feed-posts list:
//
//     <li><a href="https://www.instagram.com/p/ABC123/">Post 1</a></li>
//
// Instagram serves an embeddable version of any public post at that same
// URL with "embed" on the end, which is what the popup loads. It does
// not allow a whole profile to be embedded this way, which is why the
// popup is built from posts. Anything in the list that is not a real
// post link is skipped, and if none of them are, the feed box just
// opens Instagram in a new tab as an ordinary link would.

document.addEventListener("DOMContentLoaded", () => {

    const POST_PATTERN =
        /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[^/?#]+/i;

    const box = document.querySelector(".feed-box");

    if (!box) return;

    // The list ships with placeholder links in it. Those are not posts,
    // so they are ignored until they are replaced with real ones.
    const PLACEHOLDER = "PASTE-A-POST-LINK-HERE";

    const posts = Array.from(
        document.querySelectorAll(".feed-posts a[href]")
    )
        .map((link) => link.href)
        .filter((href) => POST_PATTERN.test(href))
        .filter((href) => !href.includes(PLACEHOLDER));

    if (posts.length === 0) return;

    // Turns a post link into its embeddable form.
    function embedUrl(href) {
        return POST_PATTERN.exec(href)[0].replace(/\/+$/, "") + "/embed";
    }


    /* ---------- the popup itself ---------- */

    const popup = document.createElement("div");
    popup.className = "ig-popup";
    popup.setAttribute("aria-hidden", "true");

    const closeButton = document.createElement("button");
    closeButton.className = "ig-popup-close";
    closeButton.setAttribute("aria-label", "Close the feed");
    closeButton.innerHTML = "&times;";

    const frame = document.createElement("div");
    frame.className = "ig-popup-frame";

    const feed = document.createElement("div");
    feed.className = "ig-popup-feed";

    // Instagram will not always allow an embed to load — a private
    // account, a deleted post, or a browser blocking third-party
    // content. This line is always there as the way out.
    const fallback = document.createElement("p");
    fallback.className = "ig-popup-fallback";

    const fallbackLink = document.createElement("a");
    fallbackLink.href = box.href;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener";
    fallbackLink.textContent = "See the whole feed on Instagram ↗";

    fallback.appendChild(fallbackLink);

    frame.appendChild(feed);
    frame.appendChild(fallback);

    popup.appendChild(closeButton);
    popup.appendChild(frame);
    document.body.appendChild(popup);

    let lastFocused = null;

    function openPopup() {
        lastFocused = document.activeElement;

        // Built fresh each time, so closing the popup really does stop
        // anything that was playing inside it.
        feed.replaceChildren();

        posts.forEach((href, index) => {
            const embed = document.createElement("iframe");

            embed.src = embedUrl(href);
            embed.title = "Instagram post " + (index + 1);
            embed.loading = index === 0 ? "eager" : "lazy";
            embed.setAttribute("scrolling", "no");
            embed.setAttribute("allowtransparency", "true");

            feed.appendChild(embed);
        });

        popup.classList.add("is-open");
        popup.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-locked");

        closeButton.focus();
    }

    function closePopup() {
        popup.classList.remove("is-open");
        popup.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-locked");

        feed.replaceChildren();

        if (lastFocused) lastFocused.focus();
    }

    box.addEventListener("click", (event) => {
        // Let people still command-click through to Instagram.
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;

        event.preventDefault();
        openPopup();
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
