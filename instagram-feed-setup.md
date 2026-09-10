# Updating the selected posts

The marketing page shows a grid of @axocolumbia posts you made. It is not
a live feed — it is a selection, chosen by hand — which is the point: a
feed that stops moving looks abandoned, while a selection is finished the
day you make it and only changes when you have something better to show.

It is also yours: your images, served from this repository, so nothing
expires, nothing charges you, and no other company sits between your site
and your visitors.

Each tile is three things: a picture, a link, and a note.

## 1. The picture

Put it in `images/marketing/` named `instagram-01.jpg` through
`instagram-09.jpg`, matching the label printed on the tile you want to
fill. Instagram's own grid is 3:4 portrait and this one matches it, so
portrait crops sit best — anything else is cropped to 3:4 from the middle.

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

## 3. The note

Between that tile's `<figcaption>` tags, write what you did on the post:

    <figcaption class="feed-note">Shot + edited</figcaption>

A few words is plenty — *Shot + edited*, *Concept, styling, and shot*,
*Graphic design*, *Concept + copy*.

This is the part that makes the grid worth having. Without it the grid
shows that an account exists; with it, it shows which of the work was
yours. Leave it empty and no caption appears, so a tile you have not got
to yet still looks finished.

## Swapping a post out

Replace its picture in `images/marketing/` with a new one under the same
name, change that tile's `href` to the new post, and rewrite its note. The grid is three
across, so nine, six, or three tiles fill it neatly — copy or delete a
whole `<figure class="feed-item">` block to change how many there are.

## Why not a feed that updates itself

Those exist — LightWidget, SnapWidget and the like — and they do keep
themselves current by reading the account through Instagram's API. They
also charge for it, and the free tiers stamp their own name on your page.
This grid trades that automation for costing nothing, being entirely
under your control, and — because it is chosen rather than mirrored —
saying what your part in each post was. If you ever change your mind, the section is a single
block in `marketing.html` and can be swapped for one of their embeds.
