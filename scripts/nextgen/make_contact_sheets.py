from pathlib import Path
import sys

from PIL import Image, ImageDraw


source = Path(sys.argv[1])
files = sorted(source.glob("page-*.png"))
thumb_w, thumb_h = 248, 351
cols, rows = 3, 3

for group_index in range((len(files) + 8) // 9):
    sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + 22)), "#dddddd")
    draw = ImageDraw.Draw(sheet)
    for slot, image_path in enumerate(files[group_index * 9 : (group_index + 1) * 9]):
        image = Image.open(image_path).convert("RGB")
        image.thumbnail((thumb_w, thumb_h))
        x = (slot % cols) * thumb_w + (thumb_w - image.width) // 2
        y = (slot // cols) * (thumb_h + 22)
        sheet.paste(image, (x, y))
        draw.text((x + 5, y + thumb_h + 4), image_path.stem, fill="#111111")
    sheet.save(source / f"contact-{group_index + 1}.png")
