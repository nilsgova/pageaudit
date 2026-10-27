#!/usr/bin/env python3
"""Zet data/posts.json als statische HTML in index.html, tussen de markeringen
<!-- POSTS:START ... --> en <!-- POSTS:END -->. Geen afhankelijkheden.

Gebruik: python3 tools/posts.py
"""
import html, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
START = "<!-- POSTS:START Gegenereerd uit data/posts.json. Bewerk dat bestand en draai: python3 tools/posts.py -->"
END = "<!-- POSTS:END -->"


def render(posts):
    cards = []
    for p in posts:
        title = html.escape(p["title"], quote=False)
        label = html.escape(f"Lees op LinkedIn: {p['title']} (opent in een nieuw tabblad)")
        cards.append(
            '<article class="post"><h3>%s</h3><p>%s</p>'
            '<a href="%s" target="_blank" rel="noopener" aria-label="%s">Lees op LinkedIn</a></article>'
            % (title, html.escape(p["summary"], quote=False), html.escape(p["url"]), label)
        )
    return START + '\n<div class="posts">\n' + "\n".join(cards) + "\n</div>\n" + END


def load():
    return json.loads((ROOT / "data" / "posts.json").read_text(encoding="utf-8"))


def update(path=ROOT / "index.html"):
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(re.escape(START[:START.index(" Gegenereerd")]) + r".*?" + re.escape(END), re.S)
    new, n = pattern.subn(lambda m: render(load()), text)
    if n != 1:
        raise SystemExit("Markeringen POSTS:START en POSTS:END niet gevonden in index.html")
    path.write_text(new, encoding="utf-8")


if __name__ == "__main__":
    update()
    print("index.html bijgewerkt uit data/posts.json")
