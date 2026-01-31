#!/usr/bin/env python3
import sys
from pathlib import Path
from PIL import Image

input_dir = Path(sys.argv[1])
output_dir = Path(sys.argv[2])
output_dir.mkdir(exist_ok=True)

target_width = 400
target_height = 526

for img_path in input_dir.glob("*.[jp][pn]g"):
    with Image.open(img_path) as im:
        # Resize keeping aspect ratio, but ensure it covers target size
        im_ratio = im.width / im.height
        target_ratio = target_width / target_height

        if im_ratio > target_ratio:
            # image too wide → scale height to target
            new_height = target_height
            new_width = int(new_height * im_ratio)
        else:
            # image too tall → scale width to target
            new_width = target_width
            new_height = int(new_width / im_ratio)

        im_resized = im.resize((new_width, new_height), Image.LANCZOS)

        # Crop center
        left = (new_width - target_width) / 2
        top = (new_height - target_height) / 2
        right = left + target_width
        bottom = top + target_height
        im_cropped = im_resized.crop((left, top, right, bottom))

        out_file = output_dir / img_path.name
        im_cropped.save(out_file, optimize=True, quality=75)
        print(f"Saved {out_file}")

