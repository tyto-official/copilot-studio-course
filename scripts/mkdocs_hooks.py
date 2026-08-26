"""Small post-build adjustments for static pages outside MkDocs navigation."""

from datetime import date
import os
from pathlib import Path
import xml.etree.ElementTree as ET


SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
XHTML_NS = "http://www.w3.org/1999/xhtml"
LYSERNO_URL = "https://tyto-official.github.io/copilot-studio-course/lyserno/"
DEPLOYMENT_MARKER = "deployment-version.txt"


def on_post_build(config, **kwargs):
    """Ensure the standalone Lyserno page is discoverable in sitemap.xml."""
    site_dir = Path(config["site_dir"])
    commit_sha = os.environ.get("GITHUB_SHA")
    if commit_sha:
        (site_dir / DEPLOYMENT_MARKER).write_text(
            f"{commit_sha}\n", encoding="utf-8"
        )

    sitemap_path = site_dir / "sitemap.xml"
    if not sitemap_path.exists():
        return

    ET.register_namespace("", SITEMAP_NS)
    ET.register_namespace("xhtml", XHTML_NS)

    tree = ET.parse(sitemap_path)
    root = tree.getroot()
    locations = {
        element.text
        for element in root.findall(f"{{{SITEMAP_NS}}}url/{{{SITEMAP_NS}}}loc")
    }
    if LYSERNO_URL in locations:
        return

    url = ET.SubElement(root, f"{{{SITEMAP_NS}}}url")
    ET.SubElement(url, f"{{{SITEMAP_NS}}}loc").text = LYSERNO_URL
    ET.SubElement(url, f"{{{SITEMAP_NS}}}lastmod").text = date.today().isoformat()
    ET.SubElement(url, f"{{{SITEMAP_NS}}}changefreq").text = "weekly"
    ET.SubElement(
        url,
        f"{{{XHTML_NS}}}link",
        {
            "rel": "alternate",
            "hreflang": "sv",
            "href": LYSERNO_URL,
        },
    )

    ET.indent(tree, space="    ")
    tree.write(sitemap_path, encoding="UTF-8", xml_declaration=True)
