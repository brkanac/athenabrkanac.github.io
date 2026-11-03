"""Rebuild every served photograph from its original.

Two things happen here:

  1. Colour management. Most originals are Display P3. A browser shown
     untagged pixels assumes sRGB, and P3 numbers read as sRGB come out
     duller than they were shot — the grey Athena noticed. Each photo is
     converted properly and tagged sRGB.

  2. A little warmth on top, at Athena's asking: reds lifted and blues
     eased by 3%, saturation by 5%. Gentle enough to read as sunlight
     rather than a filter. Change WARM and SAT to taste and re-run.

     A project can ask for more than the house setting — Stars4Ever's
     film set does — by naming its own figures in EXTRA_WARMTH below,
     or for none at all, like Stars4Ever's digital set. See STARS_FILM_SET.
"""
from PIL import Image, ImageCms, ImageOps, ImageEnhance
import io, os, sys, glob, re

WARM = 0.03   # how far red is lifted and blue eased
SAT  = 1.05   # saturation multiplier

# Projects that want a warmer hand than the rest of the site.
# Keyed on the start of the file name.
EXTRA_WARMTH = {
    "stars-": (0.055, 1.10),
    # Wyclef Jean: the digital set is black and white, which any warmth
    # would tint, and the film set keeps the colour of its scans. Both
    # are left as shot.
    "wyclef-": (0.0, 1.0),
}

# Some photographs are left exactly as they were shot, with only the
# colour conversion above and no warming at all.
NO_WARMTH = (0.0, 1.0)

# Photographs in the Places and People galleries are left as shot too,
# to match the rest of those galleries. Keyed on the served file name.
GALLERY_AS_SHOT = {
    "america.jpg", "cassie.jpg", "berry-picking.jpg",
    "market.jpg", "kyoto.jpg", "firework.jpg",
}

# Stars4Ever comes in two sets. stars-01 to stars-04 are the film ones,
# and they are the warm ones; everything from stars-05 on is the digital
# set, which Athena wants untouched. The film set has since grown, by
# stars-film-05 onwards: those are named apart so the numbers above stay
# put, and they are warmed like the first four.
STARS_FILM_SET = 4

srgb = ImageCms.createProfile("sRGB")

# A fresh profile stamps itself with the current time, which would make
# every run produce new bytes for pictures that have not actually
# changed. Blanking that stamp keeps a rebuild honest: only the photos
# whose settings moved come out different.
_raw = bytearray(ImageCms.ImageCmsProfile(srgb).tobytes())
_raw[24:36] = b"\x00" * 12
srgb_bytes = bytes(_raw)

def warmth_for(dst):
    name = os.path.basename(dst)

    if name in GALLERY_AS_SHOT:
        return NO_WARMTH

    stars = re.match(r"stars-(\d+)", name)
    if stars and int(stars.group(1)) > STARS_FILM_SET:
        return NO_WARMTH

    for prefix, setting in EXTRA_WARMTH.items():
        if name.startswith(prefix):
            return setting

    return WARM, SAT


def warm(img, amount, saturation):
    r, g, b = img.split()
    r = r.point(lambda v: min(255, int(v * (1 + amount))))
    b = b.point(lambda v: int(v * (1 - amount)))
    out = Image.merge("RGB", (r, g, b))
    return ImageEnhance.Color(out).enhance(saturation)

def build(src, dst, crop=False, quality=82, cap=2000):
    im = Image.open(src)
    icc = im.info.get("icc_profile")
    im = ImageOps.exif_transpose(im)
    if icc:
        im = ImageCms.profileToProfile(im, ImageCms.ImageCmsProfile(io.BytesIO(icc)), srgb, outputMode="RGB")
    else:
        im = im.convert("RGB")
    if crop:
        w, h = Image.open(src).size
        x0, y0, side = int(w*0.44), int(w*0.10), int(w*0.52)
        im = im.crop((x0, y0, x0+side, y0+side))
        cap, quality = 1400, 84
    im.thumbnail((cap, cap), Image.LANCZOS)
    amount, saturation = warmth_for(dst)
    if (amount, saturation) != NO_WARMTH:
        im = warm(im, amount, saturation)
    im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True, icc_profile=srgb_bytes)
    return os.path.getsize(dst)//1024

# Stars4Ever is still being added to, so its photographs are found rather
# than listed. Drop stars-05, -06 and so on into images/originals/ — any
# extension — and they are picked up on the next run with no edit here.
jobs = []
for src in sorted(glob.glob("images/originals/stars-*")):
    match = re.match(r"stars-(\d+)", os.path.basename(src))
    if match:
        jobs.append((src, f"images/freelance/stars-{int(match.group(1)):02d}.jpg", False))

jobs += [
    ("images/originals/stars-film-05.jpg", "images/freelance/stars-film-05.jpg", False),
    ("images/originals/stars-film-06.jpg", "images/freelance/stars-film-06.jpg", False),
    ("images/originals/stars-film-07.jpg", "images/freelance/stars-film-07.jpg", False),
    ("images/originals/stars-film-08.jpg", "images/freelance/stars-film-08.jpg", False),
    ("images/originals/stars-film-09.jpg", "images/freelance/stars-film-09.jpg", False),
    ("images/originals/stars-film-10.jpg", "images/freelance/stars-film-10.jpg", False),
    ("images/originals/america.JPG", "images/america.jpg", False),
    ("images/originals/cassie.JPG", "images/cassie.jpg", False),
    ("images/originals/berry-picking.JPG", "images/berry-picking.jpg", False),
    ("images/originals/market.JPG", "images/market.jpg", False),
    ("images/originals/kyoto.JPG", "images/kyoto.jpg", False),
    ("images/originals/firework.JPG", "images/firework.jpg", False),
    ("images/originals/wyclef-film-01.jpg", "images/freelance/wyclef-film-01.jpg", False),
    ("images/originals/wyclef-film-02.jpg", "images/freelance/wyclef-film-02.jpg", False),
    ("images/originals/wyclef-film-03.jpg", "images/freelance/wyclef-film-03.jpg", False),
    ("images/originals/wyclef-film-04.jpg", "images/freelance/wyclef-film-04.jpg", False),
    ("images/originals/wyclef-film-05.jpg", "images/freelance/wyclef-film-05.jpg", False),
    ("images/originals/wyclef-film-06.jpg", "images/freelance/wyclef-film-06.jpg", False),
    ("images/originals/wyclef-01.jpg", "images/freelance/wyclef-01.jpg", False),
    ("images/originals/wyclef-02.jpg", "images/freelance/wyclef-02.jpg", False),
    ("images/originals/wyclef-03.jpg", "images/freelance/wyclef-03.jpg", False),
    ("images/originals/wyclef-04.jpg", "images/freelance/wyclef-04.jpg", False),
    ("images/originals/wyclef-05.jpg", "images/freelance/wyclef-05.jpg", False),
    ("images/originals/wyclef-06.jpg", "images/freelance/wyclef-06.jpg", False),
    ("images/originals/wyclef-07.jpg", "images/freelance/wyclef-07.jpg", False),
    ("images/originals/wyclef-08.jpg", "images/freelance/wyclef-08.jpg", False),
    ("images/originals/grad-01.jpg",  "images/marketing/grad-01.jpg",  False),
    ("images/originals/grad-02.jpg",  "images/marketing/grad-02.jpg",  False),
    ("images/originals/grad-03.jpg",  "images/marketing/grad-03.jpg",  False),
    ("images/originals/grad-04.jpg",  "images/marketing/grad-04.jpg",  False),
    ("images/originals/merch-01.JPG", "images/marketing/merch-01.jpg", False),
    ("images/originals/merch-02.JPG", "images/marketing/merch-02.jpg", False),
    ("images/originals/merch-03.JPG", "images/marketing/merch-03.jpg", False),
    ("images/originals/merch-04.JPG", "images/marketing/merch-04.jpg", False),
    ("images/originals/merch-05.JPG", "images/marketing/merch-05.jpg", False),
    ("images/originals/merch-06.JPG", "images/marketing/merch-06.jpg", False),
    ("images/originals/cocojune-3.jpeg", "images/marketing/cocojune-03.jpg", False),
    ("images/originals/cocojune-4.jpeg", "images/marketing/cocojune-04.jpg", False),
    ("images/originals/ttyogapose.jpeg", "images/ttyogapose.jpeg", False),
]
for src, dst, crop in jobs:
    amount, saturation = warmth_for(dst)
    if (amount, saturation) == (WARM, SAT):
        note = ""
    elif (amount, saturation) == NO_WARMTH:
        note = "  (as shot)"
    else:
        note = f"  (warmer: {amount:.3f} / {saturation:.2f})"
    print(f"  {os.path.basename(dst):22} {build(src, dst, crop)}KB{note}")
