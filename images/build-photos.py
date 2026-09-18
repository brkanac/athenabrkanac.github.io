"""Rebuild every served photograph from its original.

Two things happen here:

  1. Colour management. Most originals are Display P3. A browser shown
     untagged pixels assumes sRGB, and P3 numbers read as sRGB come out
     duller than they were shot — the grey Athena noticed. Each photo is
     converted properly and tagged sRGB.

  2. A little warmth on top, at Athena's asking: reds lifted and blues
     eased by 3%, saturation by 5%. Gentle enough to read as sunlight
     rather than a filter. Change WARM and SAT to taste and re-run.

     A project can ask for more than the house setting — Stars4Ever
     does — by naming its own figures in EXTRA_WARMTH below.
"""
from PIL import Image, ImageCms, ImageOps, ImageEnhance
import io, os, sys

WARM = 0.03   # how far red is lifted and blue eased
SAT  = 1.05   # saturation multiplier

# Projects that want a warmer hand than the rest of the site.
# Keyed on the start of the file name.
EXTRA_WARMTH = {
    "stars-": (0.055, 1.10),
}

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
    im = warm(im, amount, saturation)
    im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True, icc_profile=srgb_bytes)
    return os.path.getsize(dst)//1024

jobs = [
    ("images/originals/stars-01.jpg", "images/freelance/stars-01.jpg", False),
    ("images/originals/stars-02.JPG", "images/freelance/stars-02.jpg", False),
    ("images/originals/stars-03.JPG", "images/freelance/stars-03.jpg", False),
    ("images/originals/stars-04.JPG", "images/freelance/stars-04.jpg", False),
    ("images/originals/grad-01.jpg",  "images/marketing/grad-01.jpg",  False),
    ("images/originals/grad-02.jpg",  "images/marketing/grad-02.jpg",  False),
    ("images/originals/grad-03.jpg",  "images/marketing/grad-03.jpg",  False),
    ("images/originals/grad-04.jpg",  "images/marketing/grad-04.jpg",  False),
    ("images/originals/merch-01.JPG", "images/marketing/merch-01.jpg", False),
    ("images/originals/merch-02.JPG", "images/marketing/merch-02.jpg", True),
    ("images/originals/merch-3.JPG",  "images/marketing/merch-03.jpg", False),
    ("images/originals/cocojune-3.jpeg", "images/marketing/cocojune-03.jpg", False),
    ("images/originals/cocojune-4.jpeg", "images/marketing/cocojune-04.jpg", False),
    ("images/originals/ttyogapose.jpeg", "images/ttyogapose.jpeg", False),
]
for src, dst, crop in jobs:
    amount, saturation = warmth_for(dst)
    note = "" if (amount, saturation) == (WARM, SAT) else f"  (warmer: {amount:.3f} / {saturation:.2f})"
    print(f"  {os.path.basename(dst):22} {build(src, dst, crop)}KB{note}")
