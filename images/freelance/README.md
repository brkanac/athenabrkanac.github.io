# Freelance project photos

Drop your photos into this folder using the exact file names below and they
appear on `freelance.html` automatically. You do not need to edit any
HTML — until a file exists, the site shows a labelled placeholder in its
place.

## Stars4Ever — done

The files are named `stars-`, the project is called Stars4Ever — the two
do not have to match.

    stars-01.jpg
    stars-02.jpg
    stars-03.jpg
    stars-04.jpg

Photos straight off a phone or camera are several megabytes each, which is
slow to load. Aim for under about 800KB — 2000px on the long edge at good
quality gets there. Keep the full-size file in `images/originals/`.

## The film — done

Embedded from YouTube, so there is no file in here for it. To point it at
a different video, change the id in the address in `freelance.html` — the
part after `/embed/` — to the one from the video's own link, the bit
after `v=`.

## Adding another project

Copy a `<div class="shot-group">` block in `freelance.html`. Give it a
heading, a line or two about what the work was, and its own photo slots —
then list their file names here.

## About the colour of these files

They are not straight copies of the originals. `images/build-photos.py`
rebuilds each one: it converts from Display P3 — which is what a phone
shoots — into sRGB, which is what browsers assume, and adds a little
warmth on top.

Without that conversion the photographs come out looking grey, because
P3 numbers read as sRGB are duller than they were shot.

To change how warm they are, edit `WARM` and `SAT` at the top of that
script and run it again.

Stars4Ever is warmer than the rest of the site — it has its own figures
under `EXTRA_WARMTH`, also at the top of the script.
