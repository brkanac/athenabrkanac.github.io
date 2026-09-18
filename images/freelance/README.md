# Freelance project photos

Drop your photos into this folder using the exact file names below and they
appear on `freelance.html` automatically. You do not need to edit any
HTML — until a file exists, the site shows a labelled placeholder in its
place.

## Stars by Anna — done

    stars-01.jpg
    stars-02.jpg
    stars-03.jpg
    stars-04.jpg

Photos straight off a phone or camera are several megabytes each, which is
slow to load. Aim for under about 800KB — 2000px on the long edge at good
quality gets there. Keep the full-size file in `images/originals/`.

## The film

The video is not a file in here by default — it is embedded from YouTube
or Vimeo, which handle the playing, the quality, and the phone-sized
version for you. See the note above `<div class="video-frame">` in
`freelance.html` for where to paste the embed code.

If you would rather serve the file yourself, put the `.mp4` in this folder
and use `<video src="images/freelance/film.mp4" controls></video>` in that
same spot. Worth it only for a short, small file — GitHub will not take
anything over 100MB.

## Adding another project

Copy a `<div class="shot-group">` block in `freelance.html`. Give it a
heading, a line or two about what the work was, and its own photo slots —
then list their file names here.
