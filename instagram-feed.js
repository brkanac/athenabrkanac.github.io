// Puts the @axocolumbia posts on the page.
//
// There are two ways this section can be filled, and it uses whichever
// one is set up:
//
//   1. A LIVE FEED that keeps itself current. Set data-widget-url on the
//      .feed-widget div in marketing.html to the address an Instagram
//      feed service gives you, and that service's feed is shown. New
//      posts then appear on their own. If the service hands you a block
//      of code rather than an address, pasting it inside that div works
//      too — anything already in there is left exactly as it is.
//
//   2. HAND-PICKED POSTS, used only when no live feed is set up. Each
//      link in the .feed-posts list is embedded straight from Instagram:
//
//          <li><a href="https://www.instagram.com/p/ABC123/">Post 1</a></li>
//
//      These show the real posts, but the list only ever holds the ones
//      chosen by hand.
//
// Either way the posts come from Instagram itself, so a caption or like
// count is always current — nothing is copied into this site.

document.addEventListener("DOMContentLoaded", () => {

    const widget = document.querySelector(".feed-widget");
    const list = document.querySelector(".feed-posts");

    if (buildLiveFeed()) return;

    buildPickedPosts();


    // ---------- 1. the live feed ----------

    function buildLiveFeed() {
        if (!widget) return false;

        // A service that gave a block of code to paste has already put
        // its own markup in here. Nothing left to do.
        if (widget.children.length > 0) {
            widget.classList.add("is-live");
            return true;
        }

        const url = (widget.dataset.widgetUrl || "").trim();

        if (url === "") return false;

        const embed = document.createElement("iframe");

        embed.className = "feed-widget-frame";
        embed.src = url;
        embed.title = "Instagram feed for @axocolumbia";

        embed.setAttribute("scrolling", "no");
        embed.setAttribute("allowtransparency", "true");

        widget.appendChild(embed);
        widget.classList.add("is-live");

        return true;
    }


    // ---------- 2. the hand-picked posts ----------

    function buildPickedPosts() {
        if (!list) return;

        const POST_PATTERN =
            /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[^/?#]+/i;

        // The list ships with placeholder links in it. Those are not
        // posts, so they are ignored until they are replaced.
        const PLACEHOLDER = "PASTE-A-POST-LINK-HERE";

        const posts = Array.from(list.querySelectorAll("a[href]"))
            .map((link) => link.href)
            .filter((href) => POST_PATTERN.test(href))
            .filter((href) => !href.includes(PLACEHOLDER));

        // Nothing set up either way — better an empty section than a row
        // of empty frames.
        if (posts.length === 0) return;

        // Instagram serves an embeddable version of any public post at
        // its own URL with "embed" on the end.
        function embedUrl(href) {
            return POST_PATTERN.exec(href)[0].replace(/\/+$/, "") + "/embed";
        }

        const feed = document.createElement("div");
        feed.className = "feed-embeds";

        posts.forEach((href, index) => {
            const embed = document.createElement("iframe");

            embed.className = "feed-embed";
            embed.src = embedUrl(href);
            embed.title = "Instagram post " + (index + 1);

            // Only the first row is worth fetching up front — the rest
            // load as the visitor scrolls down to them.
            embed.loading = index < 3 ? "eager" : "lazy";

            embed.setAttribute("scrolling", "no");
            embed.setAttribute("allowtransparency", "true");

            feed.appendChild(embed);
        });

        list.insertAdjacentElement("afterend", feed);
    }

});
