"""Rebuild every served photograph from its original.

Two things happen here:

  1. Colour management. Most originals are Display P3. A browser shown
     untagged pixels assumes sRGB, and P3 numbers read as sRGB come out
     duller than they were shot — the grey Athena noticed. Each photo is
     converted properly and tagged sRGB.

  2. A little warmth on top, at Athena's asking: reds lifted and blues
     eased by 3%, saturation by 5%. Gentle enough to read as sunlight
     rather than a filter. Change WARM and SAT to taste and re-run.
"""
from PIL import Image, ImageCms, ImageOps, ImageEnhance
import io, os, sys

WARM = 0.03   # how far red is lifted and blue eased
SAT  = 1.05   # saturation multiplier

srgb = ImageCms.createProfile("sRGB")
srgb_bytes = ImageCms.ImageCmsProfile(srgb).tobytes()

def warm(img):
    r, g, b = img.split()
    r = r.point(lambda v: min(255, int(v * (1 + WARM))))
    b = b.point(lambda v: int(v * (1 - WARM)))
    out = Image.merge("RGB", (r, g, b))
    return ImageEnhance.Color(out).enhance(SAT)

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
    im = warm(im)
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
    print(f"  {os.path.basename(dst):22} {build(src, dst, crop)}KB")
