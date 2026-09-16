# Freelance project photos

Drop your photos into this folder using the exact file names below and they
appear on `freelance.html` automatically. You do not need to edit any
HTML — until a file exists, the site shows a labelled placeholder in its
place.

## Stars4Ever

    stars4ever-01.jpg
    stars4ever-02.jpg
    stars4ever-03.jpg
    stars4ever-04.jpg

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
