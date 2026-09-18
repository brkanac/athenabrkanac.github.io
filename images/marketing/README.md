# Marketing photos

Drop your photos into this folder using the exact file names below and they
will appear on `marketing.html` automatically. You do not need to edit any
HTML — until a file exists, the site shows a labelled placeholder in its
place.

If your file is a `.jpeg`, `.png`, or `.JPG`, either rename it to match the
name here, or change the `src` on that slot in `marketing.html`.

Photos straight off a phone are 2–7MB, which is slow to load. Aim for under
about 800KB — 2000px on the long edge at good quality gets there. Keep the
full-size file in `images/originals/` if you want it.

For video, `.mp4` is the format every browser plays; `.mov` is not. Keep
clips short and well under 2MB.

## Merch photoshoot — done

    merch-01.jpg
    merch-02.jpg
    merch-03.jpg

Three photographs rather than four, and this project's grid is three
across and square — its shots were not all taken upright, and the tall
crop the other projects use would have cut the wide ones in half.

The full-size files these came from are in `images/originals/`.

## Senior photoshoot — done

    grad-01.jpg
    grad-02.jpg
    grad-03.jpg
    grad-04.jpg

The full-size files these came from are in `images/originals/`.

## Cocojune collaboration — done

    cocojune-02.mp4   a clip
    cocojune-02.webm  the same clip, for browsers that cannot play mp4
    cocojune-02.jpg   the frame shown until that clip gets going
    cocojune-03.jpg
    cocojune-05.mp4   a clip
    cocojune-05.webm
    cocojune-05.jpg
    cocojune-04.jpg

Shown in that order: clip, photograph, clip, photograph.

The full-size files these came from are in `images/originals/`.

## Adding more photos to a project

Copy one of the `<figure class="shot">` blocks in `marketing.html`, change
the `src`, the `alt`, and the placeholder label inside it.

## Adding a whole new project

Copy a `<div class="shot-group">` block in `marketing.html`. Give it a
heading, a short description of what the work was, and its own set of
photo slots — then list their file names here so they are easy to find.
