// Puts the @axocolumbia posts on the page.
//
// Each post is embedded straight from Instagram, so it always shows the
// real thing — current caption, current like count — rather than a copy
// saved into this site.
//
// Which posts appear is set in marketing.html, in the .feed-posts list:
//
//     <li><a href="https://www.instagram.com/p/ABC123/">Post 1</a></li>
//
// Instagram serves an embeddable version of any public post at that same
// URL with "embed" on the end, which is what gets loaded here. It does
// not allow a whole profile to be embedded this way, which is why the
// feed is built from posts.
//
// Anything in the list that is not a real post link is skipped. If none
// of them are, nothing is added and the section is just the profile box
// — so the page never shows a row of empty frames.

document.addEventListener("DOMContentLoaded", () => {

    const POST_PATTERN =
        /^https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/[^/?#]+/i;

    // The list ships with placeholder links in it. Those are not posts,
    // so they are ignored until they are replaced with real ones.
    const PLACEHOLDER = "PASTE-A-POST-LINK-HERE";

    const list = document.querySelector(".feed-posts");

    if (!list) return;

    const posts = Array.from(list.querySelectorAll("a[href]"))
        .map((link) => link.href)
        .filter((href) => POST_PATTERN.test(href))
        .filter((href) => !href.includes(PLACEHOLDER));

    if (posts.length === 0) return;

    // Turns a post link into its embeddable form.
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

        // Only the first row is worth fetching up front — the rest load
        // as the visitor scrolls down to them.
        embed.loading = index < 3 ? "eager" : "lazy";

        embed.setAttribute("scrolling", "no");
        embed.setAttribute("allowtransparency", "true");

        feed.appendChild(embed);
    });

    list.insertAdjacentElement("afterend", feed);

});
