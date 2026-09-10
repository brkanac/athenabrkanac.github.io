# Updating the Instagram grid

The marketing page shows a grid of @axocolumbia posts. It is yours — your
images, served from this repository — so nothing expires, nothing charges
you, and no other company sits between your site and your visitors. The
trade is that it does not refresh itself: when you want the grid to show
newer posts, you update it here.

Each tile is two things: a picture and a link.

## 1. The picture

Put it in `images/marketing/` named `instagram-01.jpg` through
`instagram-09.jpg`, matching the label printed on the tile you want to
fill. Square crops look best — the grid crops to squares either way, from
the middle.

Until a file exists, its tile shows that label instead of a broken image,
so a half-finished grid still looks deliberate.

## 2. The link

In `marketing.html`, each tile starts out pointing at the profile:

    <a
        class="feed-tile"
        href="https://www.instagram.com/axocolumbia"
        ...

Paste the post's own link over that one. On Instagram: open the post, tap
the three dots, then *Copy link*. It should look like
`https://www.instagram.com/p/ABC123/`.

A tile still pointing at the profile is not broken — it just opens the
profile instead of that post.

## Swapping a post out

Replace its picture in `images/marketing/` with a new one under the same
name, and change that tile's `href` to the new post. The grid is three
across, so nine, six, or three tiles fill it neatly — copy or delete a
whole `<a class="feed-tile">` block to change how many there are.

## Why not a feed that updates itself

Those exist — LightWidget, SnapWidget and the like — and they do keep
themselves current by reading the account through Instagram's API. They
also charge for it, and the free tiers stamp their own name on your page.
This grid trades that automation for costing nothing and being entirely
under your control. If you ever change your mind, the section is a single
block in `marketing.html` and can be swapped for one of their embeds.
