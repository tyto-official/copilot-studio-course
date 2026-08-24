from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Iterable

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[2]
DATA_PATH = ROOT / "data" / "nextgen" / "catalog.json"
OUTPUT_PATH = ROOT / "docs" / "downloads" / "nextgen" / "lunaro-lighting-collection-2026.pdf"

PAGE_W, PAGE_H = A4
MARGIN = 38

INK = colors.HexColor("#171A18")
GREEN = colors.HexColor("#173F35")
GREEN_LIGHT = colors.HexColor("#DDE7E1")
WARM = colors.HexColor("#F4F0E8")
SAND = colors.HexColor("#D8CAB5")
RED = colors.HexColor("#B94B39")
BLUE = colors.HexColor("#667F8E")
MID = colors.HexColor("#6C706D")
LIGHT = colors.HexColor("#E7E4DE")
WHITE = colors.white


def load_catalog() -> dict:
    with DATA_PATH.open("r", encoding="utf-8") as stream:
        return json.load(stream)


def absolute_image(relative_path: str) -> Path:
    path = (ROOT / relative_path).resolve()
    if not path.exists():
        raise FileNotFoundError(path)
    return path


def wrap_text(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    if not words:
        return []
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        candidate = f"{current} {word}"
        if pdfmetrics.stringWidth(candidate, font, size) <= max_width:
            current = candidate
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def draw_wrapped(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font: str = "Helvetica",
    size: float = 9,
    leading: float | None = None,
    color=INK,
    max_lines: int | None = None,
) -> float:
    leading = leading or size * 1.35
    lines = wrap_text(text, font, size, max_width)
    if max_lines is not None:
        lines = lines[:max_lines]
    c.setFont(font, size)
    c.setFillColor(color)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_cover_image(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float) -> None:
    image = ImageReader(str(path))
    iw, ih = image.getSize()
    scale = max(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
    c.saveState()
    clip = c.beginPath()
    clip.rect(x, y, w, h)
    c.clipPath(clip, stroke=0, fill=0)
    c.drawImage(image, dx, dy, width=dw, height=dh, mask="auto")
    c.restoreState()


def draw_contain_image(c: canvas.Canvas, path: Path, x: float, y: float, w: float, h: float) -> None:
    image = ImageReader(str(path))
    iw, ih = image.getSize()
    scale = min(w / iw, h / ih)
    dw, dh = iw * scale, ih * scale
    dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
    c.drawImage(image, dx, dy, width=dw, height=dh, mask="auto")


def footer(c: canvas.Canvas, page_number: int, label: str = "LUNARO LIGHTING") -> None:
    c.setStrokeColor(LIGHT)
    c.setLineWidth(0.5)
    c.line(MARGIN, 24, PAGE_W - MARGIN, 24)
    c.setFont("Helvetica", 6.5)
    c.setFillColor(MID)
    c.drawString(MARGIN, 12, label)
    c.drawRightString(PAGE_W - MARGIN, 12, str(page_number))


def start_page(c: canvas.Canvas, page_number: int, label: str = "LUNARO LIGHTING") -> None:
    c.setFillColor(WHITE)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    if page_number not in (1, 34):
        footer(c, page_number, label)


def add_bookmark(c: canvas.Canvas, key: str, title: str, level: int = 0) -> None:
    c.bookmarkPage(key)
    c.addOutlineEntry(title, key, level=level, closed=False)


def cover_page(c: canvas.Canvas, data: dict) -> None:
    image = absolute_image("source-assets/nextgen/lighting-catalog/environment/catalog-cover-environment-clean.png")
    draw_cover_image(c, image, 0, 0, PAGE_W, PAGE_H)
    c.saveState()
    c.setFillColorRGB(0.04, 0.06, 0.05, alpha=0.58)
    c.rect(0, 0, PAGE_W * 0.58, PAGE_H, stroke=0, fill=1)
    c.restoreState()
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 34)
    c.drawString(MARGIN, PAGE_H - 92, data["brand"])
    c.setFont("Helvetica", 15)
    c.drawString(MARGIN, PAGE_H - 120, "LIGHTING COLLECTION")
    c.setFont("Helvetica-Bold", 15)
    c.drawString(MARGIN, PAGE_H - 143, "2026")
    c.setStrokeColor(WHITE)
    c.setLineWidth(1.2)
    c.line(MARGIN, PAGE_H - 166, MARGIN + 72, PAGE_H - 166)
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN, 42, "PRODUKTKATALOG | SVERIGE")
    add_bookmark(c, "cover", "Omslag")
    c.showPage()


def intro_page(c: canvas.Canvas, data: dict, page_number: int) -> None:
    start_page(c, page_number)
    add_bookmark(c, "intro", "Om kollektionen")
    c.setFillColor(GREEN)
    c.rect(0, 0, PAGE_W * 0.37, PAGE_H, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 23)
    c.drawString(MARGIN, PAGE_H - 82, "LJUS FÖR")
    c.drawString(MARGIN, PAGE_H - 112, "ARBETE OCH")
    c.drawString(MARGIN, PAGE_H - 142, "SAMVARO")
    c.setFont("Helvetica", 8)
    c.drawString(MARGIN, 54, "LUNARO STUDIO")
    x = PAGE_W * 0.43
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(x, PAGE_H - 76, "EN SAMMANHÅLLEN KOLLEKTION")
    y = PAGE_H - 106
    paragraphs = [
        "Lunaro är ett fiktivt belysningsvarumärke skapat för utbildning. Kollektionen visar hur stabil produktkunskap kan beskrivas i en omfattande katalog medan aktuella uppgifter om pris, lager och leverans hanteras separat.",
        "De tretton modellfamiljerna är utvecklade för kontor, mötesplatser, hotell och gemensamma miljöer. Sortimentet omfattar bordslampor, golvlampor, vägglampor och en pendel.",
        "Katalogen beskriver egenskaper som mått, material, ljusflöde, färgtemperatur, dimring, IP-klass och installation. Alla uppgifter är fiktiva och ska inte användas som verklig produkt- eller säkerhetsdokumentation.",
    ]
    for paragraph in paragraphs:
        y = draw_wrapped(c, paragraph, x, y, PAGE_W - x - MARGIN, size=9.2, leading=14)
        y -= 18
    c.setFillColor(WARM)
    c.roundRect(x, 120, PAGE_W - x - MARGIN, 112, 3, stroke=0, fill=1)
    c.setFillColor(GREEN)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(x + 16, 208, "DATAUPPDELNING I KURSSCENARIOT")
    notes = [
        "PDF: stabila produktegenskaper och användningsområden",
        "SharePoint: aktuellt pris, lagersaldo och leveranstid",
        "Styrdokument: försäljnings- och leveransregler",
    ]
    yy = 184
    c.setFont("Helvetica", 8)
    for note in notes:
        c.drawString(x + 16, yy, f"- {note}")
        yy -= 19
    c.showPage()


def contents_page(c: canvas.Canvas, page_number: int) -> None:
    start_page(c, page_number)
    add_bookmark(c, "contents", "Innehåll")
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(MARGIN, PAGE_H - 74, "INNEHÅLL")
    entries = [
        ("Så läser du katalogen", 4),
        ("Bordslampor", 5),
        ("Jämförelse - bordslampor", 13),
        ("Golvlampor", 14),
        ("Jämförelse - golvlampor", 18),
        ("Vägglampor", 19),
        ("Jämförelse - vägglampor", 22),
        ("Taklampor", 23),
        ("Användningsmatris", 25),
        ("Ljus, placering och material", 26),
        ("Installation, garanti och emballage", 29),
        ("Produkt- och teknikindex", 32),
    ]
    y = PAGE_H - 126
    for title, page in entries:
        c.setFont("Helvetica", 10)
        c.setFillColor(INK)
        c.drawString(MARGIN, y, title)
        c.setStrokeColor(LIGHT)
        c.setDash(1, 2)
        c.line(MARGIN + 190, y + 2, PAGE_W - MARGIN - 30, y + 2)
        c.setDash()
        c.setFont("Helvetica-Bold", 10)
        c.drawRightString(PAGE_W - MARGIN, y, str(page))
        y -= 40
    c.showPage()


def reading_guide_page(c: canvas.Canvas, page_number: int) -> None:
    start_page(c, page_number)
    add_bookmark(c, "reading-guide", "Så läser du katalogen")
    c.setFont("Helvetica-Bold", 25)
    c.setFillColor(INK)
    c.drawString(MARGIN, PAGE_H - 72, "SÅ LÄSER DU KATALOGEN")
    c.setFont("Helvetica", 10)
    c.setFillColor(MID)
    c.drawString(MARGIN, PAGE_H - 94, "Stabil produktkunskap i PDF - dynamisk affärsdata i SharePoint")
    cards = [
        ("MODELL", "En designfamilj med gemensamma tekniska egenskaper, till exempel Arcus T1."),
        ("SKU", "En beställningsbar färg- eller materialvariant. Varje SKU får ett unikt artikelnummer."),
        ("LJUSKÄLLA", "Integrerad LED ingår i armaturen. Utbytbar ljuskälla anges med sockel och rekommenderad effekt."),
        ("DIMRING", "Anger om armaturen kan dimras och om styrningen sitter på produkt, sladd eller extern installation."),
        ("IP-KLASS", "Katalogens modeller är IP20 och avsedda för torra inomhusmiljöer."),
        ("DYNAMISK DATA", "Aktuellt pris, lagersaldo, reserverat antal, produktstatus och leveranstid hör hemma i SharePoint."),
    ]
    y = PAGE_H - 150
    for idx, (title, body) in enumerate(cards):
        col = idx % 2
        row = idx // 2
        x = MARGIN + col * 260
        yy = y - row * 175
        c.setFillColor(WARM if col == 0 else GREEN_LIGHT)
        c.roundRect(x, yy - 126, 236, 138, 4, stroke=0, fill=1)
        c.setFillColor(GREEN)
        c.setFont("Helvetica-Bold", 11)
        c.drawString(x + 16, yy - 16, title)
        draw_wrapped(c, body, x + 16, yy - 42, 204, size=8.5, leading=13)
    c.showPage()


def section_page(
    c: canvas.Canvas,
    page_number: int,
    title: str,
    subtitle: str,
    bookmark: str,
    environment_image: str | None,
    product_images: Iterable[str] | None = None,
    accent=GREEN,
) -> None:
    start_page(c, page_number)
    add_bookmark(c, bookmark, title)
    if environment_image:
        draw_cover_image(c, absolute_image(environment_image), 0, 0, PAGE_W, PAGE_H)
        c.saveState()
        c.setFillColorRGB(0.02, 0.03, 0.02, alpha=0.46)
        c.rect(0, PAGE_H - 210, PAGE_W, 210, stroke=0, fill=1)
        c.restoreState()
        title_color = WHITE
    else:
        c.setFillColor(WARM)
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        c.setFillColor(accent)
        c.rect(0, 0, 17, PAGE_H, stroke=0, fill=1)
        title_color = INK
        if product_images:
            images = list(product_images)
            width = (PAGE_W - 2 * MARGIN - 18 * (len(images) - 1)) / len(images)
            for idx, relative in enumerate(images):
                draw_contain_image(c, absolute_image(relative), MARGIN + idx * (width + 18), 150, width, 430)
    c.setFillColor(title_color)
    c.setFont("Helvetica-Bold", 31)
    c.drawString(MARGIN, PAGE_H - 82, title.upper())
    draw_wrapped(c, subtitle, MARGIN, PAGE_H - 112, 310, font="Helvetica", size=10, leading=14, color=title_color)
    c.showPage()


def product_page(c: canvas.Canvas, model: dict, page_number: int) -> None:
    start_page(c, page_number, f"LUNARO | {model['category'].upper()}")
    key = f"model-{model['code'].lower()}"
    add_bookmark(c, key, f"{model['name']} {model['code']}", level=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 19)
    c.drawString(MARGIN, PAGE_H - 58, f"{model['name'].upper()} | {model['code']}")
    c.setFont("Helvetica", 8)
    c.setFillColor(MID)
    c.drawString(MARGIN, PAGE_H - 76, "DESIGN: LUNARO STUDIO")
    c.setFont("Helvetica-Bold", 8.5)
    c.setFillColor(GREEN)
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 60, model["category"].upper())

    strip_y = PAGE_H - 126
    strip_specs = ["Ljuskälla", "Ljusflöde", "Färgtemperatur", "Dimring", "IP-klass"]
    cell_w = (PAGE_W - 2 * MARGIN) / len(strip_specs)
    c.setStrokeColor(LIGHT)
    c.line(MARGIN, strip_y + 18, PAGE_W - MARGIN, strip_y + 18)
    c.line(MARGIN, strip_y - 34, PAGE_W - MARGIN, strip_y - 34)
    for idx, key_name in enumerate(strip_specs):
        x = MARGIN + idx * cell_w
        if idx:
            c.line(x, strip_y + 18, x, strip_y - 34)
        c.setFont("Helvetica-Bold", 6.2)
        c.setFillColor(INK)
        c.drawString(x + 7, strip_y + 4, key_name.upper())
        value = model["specs"].get(key_name, "-")
        draw_wrapped(c, value, x + 7, strip_y - 10, cell_w - 13, size=6.5, leading=8, max_lines=2)

    main_variant = model["variants"][0]
    draw_contain_image(c, absolute_image(main_variant["image"]), MARGIN, 285, 285, 330)

    right_x = 338
    text_width = PAGE_W - right_x - MARGIN
    headline_bottom = draw_wrapped(
        c,
        model["tagline"].upper(),
        right_x,
        595,
        text_width,
        font="Helvetica-Bold",
        size=12,
        leading=15,
        color=GREEN,
        max_lines=3,
    )
    y = draw_wrapped(
        c,
        model["description"],
        right_x,
        headline_bottom - 8,
        text_width,
        size=8.6,
        leading=13,
    )
    y -= 16
    c.setFont("Helvetica-Bold", 7)
    c.setFillColor(INK)
    c.drawString(right_x, y, "PASSAR FÖR")
    y -= 15
    c.setFont("Helvetica", 7.5)
    for item in model["best_for"]:
        c.drawString(right_x, y, f"- {item}")
        y -= 13
    y -= 10
    c.setFont("Helvetica-Bold", 7)
    c.drawString(right_x, y, "TEKNISKA DATA")
    y -= 16
    remaining = [
        "Färgåtergivning",
        "Ström",
        "Brytare",
        "Storlek",
        "Material",
        "Vikt",
        "Sladd",
        "Installation",
        "Garanti",
        "Förpackning",
    ]
    for spec_name in remaining:
        if spec_name not in model["specs"]:
            continue
        c.setFont("Helvetica-Bold", 6.5)
        c.setFillColor(MID)
        c.drawString(right_x, y, spec_name.upper())
        c.setFont("Helvetica", 7)
        c.setFillColor(INK)
        c.drawString(right_x + 80, y, model["specs"][spec_name])
        y -= 13

    c.setFillColor(WARM)
    c.roundRect(MARGIN, 54, PAGE_W - 2 * MARGIN, 196, 4, stroke=0, fill=1)
    c.setFillColor(INK)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(MARGIN + 14, 232, "VARIANTER")
    variants = model["variants"]
    card_gap = 14
    card_w = (PAGE_W - 2 * MARGIN - 28 - card_gap * (len(variants) - 1)) / len(variants)
    for idx, variant in enumerate(variants):
        x = MARGIN + 14 + idx * (card_w + card_gap)
        draw_contain_image(c, absolute_image(variant["image"]), x, 92, card_w, 112)
        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(INK)
        c.drawString(x, 78, variant["sku"])
        c.setFont("Helvetica", 7)
        c.setFillColor(MID)
        c.drawString(x, 66, variant["color"])
    c.showPage()


def table_page(
    c: canvas.Canvas,
    page_number: int,
    title: str,
    subtitle: str,
    columns: list[tuple[str, float]],
    rows: list[list[str]],
    bookmark: str,
) -> None:
    start_page(c, page_number)
    add_bookmark(c, bookmark, title)
    c.setFont("Helvetica-Bold", 23)
    c.setFillColor(INK)
    c.drawString(MARGIN, PAGE_H - 70, title.upper())
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MID)
    c.drawString(MARGIN, PAGE_H - 90, subtitle)
    table_x = MARGIN
    table_y = PAGE_H - 132
    total_width = PAGE_W - 2 * MARGIN
    widths = [total_width * fraction for _, fraction in columns]
    row_h = min(38, 570 / max(1, len(rows)))
    c.setFillColor(GREEN)
    c.rect(table_x, table_y - 26, total_width, 26, stroke=0, fill=1)
    x = table_x
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 6.7)
    for (label, _), width in zip(columns, widths):
        c.drawString(x + 6, table_y - 17, label.upper())
        x += width
    y = table_y - 26
    for row_idx, row in enumerate(rows):
        c.setFillColor(WHITE if row_idx % 2 == 0 else WARM)
        c.rect(table_x, y - row_h, total_width, row_h, stroke=0, fill=1)
        x = table_x
        c.setStrokeColor(LIGHT)
        c.line(table_x, y - row_h, table_x + total_width, y - row_h)
        for value, width in zip(row, widths):
            draw_wrapped(c, str(value), x + 6, y - 14, width - 10, size=6.6, leading=8, max_lines=3)
            x += width
        y -= row_h
    c.showPage()


def application_matrix_page(c: canvas.Canvas, models: list[dict], page_number: int) -> None:
    start_page(c, page_number)
    add_bookmark(c, "application-matrix", "Användningsmatris")
    c.setFont("Helvetica-Bold", 23)
    c.setFillColor(INK)
    c.drawString(MARGIN, PAGE_H - 70, "ANVÄNDNINGSMATRIS")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MID)
    c.drawString(MARGIN, PAGE_H - 90, "En första vägledning. Kontrollera alltid fullständiga specifikationer på produktsidan.")
    uses = ["Arbete", "Möte", "Lounge", "Hotell", "Korridor", "Restaurang"]
    x0, y0 = MARGIN, PAGE_H - 130
    name_w = 155
    cell_w = (PAGE_W - 2 * MARGIN - name_w) / len(uses)
    c.setFillColor(GREEN)
    c.rect(x0, y0 - 26, PAGE_W - 2 * MARGIN, 26, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 6.5)
    c.drawString(x0 + 6, y0 - 17, "MODELL")
    for idx, use in enumerate(uses):
        c.drawCentredString(x0 + name_w + idx * cell_w + cell_w / 2, y0 - 17, use.upper())
    y = y0 - 26
    mappings = {
        "T1": [1, 1, 0, 0, 0, 0],
        "T2": [1, 0, 0, 0, 0, 0],
        "T3": [0, 0, 1, 1, 0, 0],
        "T4": [0, 0, 1, 1, 0, 1],
        "T5": [1, 0, 1, 1, 0, 0],
        "T6": [1, 0, 0, 0, 0, 0],
        "T7": [1, 1, 0, 1, 0, 0],
        "F1": [1, 1, 1, 0, 0, 0],
        "F2": [0, 0, 1, 1, 0, 0],
        "F3": [0, 1, 1, 1, 0, 0],
        "W1": [0, 0, 0, 1, 1, 0],
        "W2": [0, 0, 1, 1, 1, 1],
        "P1": [0, 1, 0, 0, 0, 1],
    }
    row_h = 42
    for row_idx, model in enumerate(models):
        c.setFillColor(WHITE if row_idx % 2 == 0 else WARM)
        c.rect(x0, y - row_h, PAGE_W - 2 * MARGIN, row_h, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 7.4)
        c.drawString(x0 + 6, y - 16, f"{model['name']} {model['code']}")
        c.setFont("Helvetica", 6.2)
        c.setFillColor(MID)
        c.drawString(x0 + 6, y - 29, model["category"])
        for idx, enabled in enumerate(mappings[model["code"]]):
            cx = x0 + name_w + idx * cell_w + cell_w / 2
            cy = y - row_h / 2
            c.setFillColor(GREEN if enabled else LIGHT)
            c.circle(cx, cy, 4.2, stroke=0, fill=1)
        y -= row_h
    c.showPage()


def guide_page(
    c: canvas.Canvas,
    page_number: int,
    title: str,
    intro: str,
    blocks: list[tuple[str, str]],
    bookmark: str,
    accent=GREEN,
) -> None:
    start_page(c, page_number)
    add_bookmark(c, bookmark, title)
    c.setFillColor(accent)
    c.rect(0, PAGE_H - 186, PAGE_W, 186, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(MARGIN, PAGE_H - 72, title.upper())
    draw_wrapped(c, intro, MARGIN, PAGE_H - 102, 390, size=9, leading=13, color=WHITE)
    y = PAGE_H - 230
    for idx, (heading, body) in enumerate(blocks):
        col = idx % 2
        row = idx // 2
        x = MARGIN + col * 260
        yy = y - row * 178
        c.setFillColor(WARM if (idx + row) % 2 == 0 else GREEN_LIGHT)
        c.roundRect(x, yy - 128, 236, 142, 4, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont("Helvetica-Bold", 10)
        c.drawString(x + 15, yy - 18, heading.upper())
        draw_wrapped(c, body, x + 15, yy - 44, 204, size=8.2, leading=12)
    c.showPage()


def packaging_page(c: canvas.Canvas, models: list[dict], page_number: int) -> None:
    columns = [("Modell", 0.16), ("Storlek", 0.23), ("Produktvikt", 0.16), ("Förpackning", 0.45)]
    rows = [
        [f"{m['name']} {m['code']}", m["specs"]["Storlek"], m["specs"]["Vikt"], m["specs"]["Förpackning"]]
        for m in models
    ]
    table_page(c, page_number, "Emballage och produktmått", "Mått och vikter är fiktiva men konsekventa med kursens produktdata.", columns, rows, "packaging")


def sku_index_page(c: canvas.Canvas, models: list[dict], page_number: int) -> None:
    start_page(c, page_number)
    add_bookmark(c, "sku-index", "Produktindex")
    c.setFont("Helvetica-Bold", 23)
    c.setFillColor(INK)
    c.drawString(MARGIN, PAGE_H - 70, "PRODUKTINDEX")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MID)
    c.drawString(MARGIN, PAGE_H - 90, "25 SKU:er fördelade över 13 modellfamiljer.")
    variants = [(m, v) for m in models for v in m["variants"]]
    half = (len(variants) + 1) // 2
    for column_idx, group in enumerate((variants[:half], variants[half:])):
        x = MARGIN + column_idx * 265
        y = PAGE_H - 132
        c.setFillColor(GREEN)
        c.rect(x, y - 24, 242, 24, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 6.6)
        c.drawString(x + 7, y - 16, "ARTIKELNUMMER")
        c.drawString(x + 93, y - 16, "MODELL / FÄRG")
        y -= 24
        for idx, (model, variant) in enumerate(group):
            c.setFillColor(WHITE if idx % 2 == 0 else WARM)
            c.rect(x, y - 42, 242, 42, stroke=0, fill=1)
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 7)
            c.drawString(x + 7, y - 16, variant["sku"])
            c.setFont("Helvetica", 7)
            c.drawString(x + 93, y - 16, f"{model['name']} {model['code']}")
            c.setFillColor(MID)
            c.drawString(x + 93, y - 30, variant["color"])
            y -= 42
    c.showPage()


def technical_index_page(c: canvas.Canvas, models: list[dict], page_number: int) -> None:
    columns = [("Modell", 0.16), ("Ljuskälla", 0.27), ("Ljusflöde", 0.22), ("Kelvin", 0.18), ("IP", 0.09), ("Garanti", 0.08)]
    rows = [
        [
            f"{m['name']} {m['code']}",
            m["specs"]["Ljuskälla"],
            m["specs"]["Ljusflöde"],
            m["specs"]["Färgtemperatur"],
            m["specs"]["IP-klass"],
            m["specs"]["Garanti"],
        ]
        for m in models
    ]
    table_page(c, page_number, "Tekniskt index", "Snabböversikt över de stabila produktegenskaper som finns i katalogen.", columns, rows, "technical-index")


def back_cover(c: canvas.Canvas, data: dict, page_number: int) -> None:
    c.setFillColor(GREEN)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 30)
    c.drawString(MARGIN, PAGE_H - 86, data["brand"])
    c.setFont("Helvetica", 10)
    c.drawString(MARGIN, PAGE_H - 112, "LIGHTING COLLECTION 2026")
    c.setStrokeColor(WHITE)
    c.line(MARGIN, PAGE_H - 136, MARGIN + 80, PAGE_H - 136)
    draw_wrapped(c, data["disclaimer"], MARGIN, 102, 310, size=8, leading=12, color=WHITE)
    c.setFont("Helvetica", 7)
    c.drawString(MARGIN, 54, "Skapad som kunskapskälla för en utbildning i Microsoft Copilot Studio.")
    c.showPage()


def build() -> None:
    data = load_catalog()
    models = data["models"]
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT_PATH), pagesize=A4, pageCompression=1)
    c.setTitle("Lunaro Lighting Collection 2026")
    c.setAuthor("Tyto - fiktivt utbildningsmaterial")
    c.setSubject("Produktkatalog för Copilot Studio-utbildning")
    c.setCreator("ReportLab")

    cover_page(c, data)  # 1
    intro_page(c, data, 2)
    contents_page(c, 3)
    reading_guide_page(c, 4)

    section_page(
        c,
        5,
        "Bordslampor",
        "Sju modellfamiljer för fokuserat arbete, lounge och representativa miljöer.",
        "table-lamps",
        "source-assets/nextgen/lighting-catalog/environment/table-lamps-environment-clean.png",
    )
    page = 6
    table_models = [m for m in models if m["category"] == "Bordslampor"]
    for model in table_models:
        product_page(c, model, page)
        page += 1
    table_rows = [
        [m["name"] + " " + m["code"], m["specs"]["Ljuskälla"], m["specs"]["Ljusflöde"], m["specs"]["Dimring"], m["specs"]["Storlek"]]
        for m in table_models
    ]
    table_page(c, 13, "Jämförelse - bordslampor", "Jämför ljuskälla, ljusflöde, dimring och storlek.", [("Modell", 0.16), ("Ljuskälla", 0.25), ("Ljusflöde", 0.20), ("Dimring", 0.19), ("Storlek", 0.20)], table_rows, "table-comparison")

    section_page(
        c,
        14,
        "Golvlampor",
        "Tre tydliga uttryck för läsning, möten och mjukt omgivningsljus.",
        "floor-lamps",
        "source-assets/nextgen/lighting-catalog/environment/floor-lamps-environment-clean.png",
    )
    floor_models = [m for m in models if m["category"] == "Golvlampor"]
    for idx, model in enumerate(floor_models, start=15):
        product_page(c, model, idx)
    floor_rows = [
        [m["name"] + " " + m["code"], m["specs"]["Ljuskälla"], m["specs"]["Ljusflöde"], m["specs"]["Vikt"], m["specs"]["Storlek"]]
        for m in floor_models
    ]
    table_page(c, 18, "Jämförelse - golvlampor", "Jämför ljuskälla, ljusflöde, vikt och fysisk storlek.", [("Modell", 0.16), ("Ljuskälla", 0.26), ("Ljusflöde", 0.22), ("Vikt", 0.13), ("Storlek", 0.23)], floor_rows, "floor-comparison")

    wall_models = [m for m in models if m["category"] == "Vägglampor"]
    section_page(
        c,
        19,
        "Vägglampor",
        "Kompakta lösningar för riktat ljus och mjuk orientering.",
        "wall-lamps",
        None,
        [v["image"] for m in wall_models for v in m["variants"][:1]],
        accent=BLUE,
    )
    for idx, model in enumerate(wall_models, start=20):
        product_page(c, model, idx)
    wall_rows = [
        [m["name"] + " " + m["code"], m["specs"]["Ljuskälla"], m["specs"]["Ljusflöde"], m["specs"]["Dimring"], m["specs"]["Storlek"]]
        for m in wall_models
    ]
    table_page(c, 22, "Jämförelse - vägglampor", "Två kompakta modeller med olika ljuskaraktär.", [("Modell", 0.18), ("Ljuskälla", 0.27), ("Ljusflöde", 0.22), ("Dimring", 0.18), ("Storlek", 0.15)], wall_rows, "wall-comparison")

    pendant_models = [m for m in models if m["category"] == "Taklampor"]
    section_page(
        c,
        23,
        "Taklampor",
        "En generös pendel för mötesbord, restaurang och gemensamma ytor.",
        "pendant-lamps",
        None,
        [v["image"] for v in pendant_models[0]["variants"]],
        accent=RED,
    )
    product_page(c, pendant_models[0], 24)

    application_matrix_page(c, models, 25)
    guide_page(c, 26, "Ljusets kvalitet", "Ljusflöde, färgtemperatur och färgåtergivning påverkar hur en miljö upplevs och fungerar.", [
        ("Ljusflöde", "Lumen beskriver hur mycket synligt ljus en ljuskälla avger. Ett högre värde betyder mer ljus, men placering och avskärmning påverkar resultatet."),
        ("Färgtemperatur", "2700 K upplevs varmt och avslappnat. 3000 K ger ett neutralt varmt arbetsljus. 4000 K upplevs svalare och mer koncentrerat."),
        ("CRI", "CRI beskriver hur naturligt färger återges. Integrerade LED-modeller i kollektionen har CRI 90 eller högre."),
        ("Bländning", "Kupoler, opalglas och textilskärmar reducerar direkt insyn i ljuskällan. Riktbara modeller behöver justeras efter arbetsplatsen."),
    ], "light-quality")
    guide_page(c, 27, "IP-klass och placering", "Samtliga produkter i den här fiktiva kollektionen är IP20 och avsedda för torra inomhusmiljöer.", [
        ("IP20", "Skydd mot fasta föremål större än 12,5 mm men inget särskilt skydd mot vatten. Använd inte produkterna i våtrum eller utomhus."),
        ("Arbetsplats", "Placera arbetsljus så att skärm och hand inte skapar störande reflexer eller skuggor över arbetsytan."),
        ("Mötesbord", "Pendel och kupollampor bör placeras så att de belyser bordet utan att blockera siktlinjer mellan deltagare."),
        ("Lounge", "Kombinera omgivningsljus med riktat läsljus. Låg färgtemperatur ger en lugnare karaktär."),
    ], "ip-placement", accent=BLUE)
    guide_page(c, 28, "Material och färger", "Materialen är valda för ett sammanhållet uttryck och tydliga varianter mellan SKU:er.", [
        ("Pulverlackerad metall", "Används i kupoler, armar och baser. Ytan är matt och finns bland annat i varmvit, skogsgrön, dämpad blå och tegelröd."),
        ("Opalglas", "Sprider ljuset jämnt och minskar hårda kontraster. Opalglaset ska hanteras varsamt och rengöras med mjuk trasa."),
        ("Keramik", "Terra använder glaserad keramik i beige eller skogsgrön. Naturliga variationer i glans är en del av uttrycket."),
        ("Textil och ek", "Textilskärmar ger mjukt ljus. Ekdetaljer används i Tripod och bör skyddas från stark fukt och lösningsmedel."),
    ], "materials", accent=RED)
    guide_page(c, 29, "Installation och ström", "Kontrollera alltid produktens anslutningstyp före beställning och installation.", [
        ("Stickkontakt", "Bords- och golvlampor levereras för anslutning till vanligt vägguttag. Sladdlängd anges på respektive produktsida."),
        ("Fast installation", "Vägglampor och pendel kräver fast anslutning. Installation ska utföras enligt organisationens krav och lokala bestämmelser."),
        ("Integrerad LED", "Den integrerade ljuskällan ingår och är dimensionerad för armaturen. Kontakta service vid fel i LED-modul eller drivdon."),
        ("Utbytbar ljuskälla", "Kontrollera sockel, maximal effekt, rekommenderat ljusflöde och dimringskompatibilitet innan ljuskälla väljs."),
    ], "installation")
    guide_page(c, 30, "Garanti och skötsel", "Rätt rengöring och hantering hjälper armaturen att behålla funktion och yta.", [
        ("Garanti", "Integrerade LED-modeller har fem års fiktiv garanti. Övriga produkter har tre år. Slitage och felaktig installation omfattas inte."),
        ("Metallytor", "Torka med mjuk, lätt fuktad trasa. Undvik slipmedel, starka lösningsmedel och grova svampar."),
        ("Glas och keramik", "Låt produkten svalna. Använd mjuk trasa och milt rengöringsmedel. Lyft aldrig produkten i glasskärmen."),
        ("Textil", "Dammsug försiktigt med låg effekt eller använd en ren mjuk borste. Fukta inte textilskärmen."),
    ], "warranty-care", accent=BLUE)
    packaging_page(c, models, 31)
    sku_index_page(c, models, 32)
    technical_index_page(c, models, 33)
    back_cover(c, data, 34)

    c.save()
    print(OUTPUT_PATH)


if __name__ == "__main__":
    build()
