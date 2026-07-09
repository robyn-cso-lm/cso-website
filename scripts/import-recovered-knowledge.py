from __future__ import annotations

import csv
import hashlib
import re
from pathlib import Path
from urllib.parse import urlparse


REPO_ROOT = Path(__file__).resolve().parents[1]
RECOVERY_ROOT = REPO_ROOT.parent / "knowledge-centre-recovery" / "outputs" / "2026-07-09-attached-pass2"
AUDIT_CSV = RECOVERY_ROOT / "data" / "audit.csv"
RECOVERED_TEXT_DIR = RECOVERY_ROOT / "recovered-text"
OUTPUT_DIR = REPO_ROOT / "content" / "knowledge" / "articles"


def safe_name(url: str) -> str:
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:10]
    parsed = urlparse(url)
    stem = re.sub(r"[^a-z0-9]+", "-", (parsed.netloc + parsed.path).lower()).strip("-")
    stem = stem[:80] if stem else "url"
    return f"{stem}-{digest}"


def slug_from_url(url: str) -> str:
    parsed = urlparse(url)
    parts = [part for part in parsed.path.strip("/").split("/") if part]
    if not parts:
        return "recovered-home"

    if parts[-1].isdigit() and len(parts) >= 2:
        tail = "-".join(parts[-2:])
    else:
        tail = parts[-1]

    slug = re.sub(r"[^a-z0-9]+", "-", tail.lower()).strip("-")
    return slug or "recovered-resource"


def yaml_string(value: str) -> str:
    value = (value or "").replace("\\", "\\\\").replace('"', '\\"')
    return f'"{value}"'


def yaml_array(values: list[str]) -> str:
    clean = [value.strip() for value in values if value and value.strip()]
    return "[" + ", ".join(yaml_string(value) for value in clean) + "]"


def normalize_priority(value: str) -> str:
    if not value:
        return ""
    return value


def read_recovered_body(url: str) -> str:
    text_path = RECOVERED_TEXT_DIR / f"{safe_name(url)}.md"
    if not text_path.exists():
        return "Recovered content body is pending manual review.\n"

    text = text_path.read_text(encoding="utf-8", errors="ignore")
    marker = "## Body"
    if marker in text:
        text = text.split(marker, 1)[1].strip()
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text or "Recovered content body is pending manual review.\n"


def description_from_body(title: str, body: str) -> str:
    plain = re.sub(r"[*_`#>\[\]()]", " ", body)
    plain = re.sub(r"\s+", " ", plain).strip()
    if not plain or plain.startswith("[No text recovered]"):
        return f"Recovered draft for {title}."
    return plain[:220].rstrip()


def tags_from_row(row: dict[str, str]) -> list[str]:
    tags = []
    notes = row.get("Notes", "")
    tag_match = re.search(r"Tags: ([^.]+)", notes)
    if tag_match:
        tags.extend(tag.strip() for tag in tag_match.group(1).split(","))

    for candidate in [
        row.get("Topic", ""),
        row.get("Knowledge Centre Category", ""),
        row.get("Primary Topic", ""),
        row.get("Secondary Topic", ""),
    ]:
        if candidate and candidate not in tags:
            tags.append(candidate)
    return tags[:8]


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    rows = list(csv.DictReader(AUDIT_CSV.open(encoding="utf-8")))
    recovered = [row for row in rows if row.get("Recovered?") in {"Yes", "Partial"}]

    used_slugs: dict[str, int] = {}
    created = 0
    for row in recovered:
        original_url = row["Original URL"]
        base_slug = slug_from_url(original_url)
        count = used_slugs.get(base_slug, 0)
        used_slugs[base_slug] = count + 1
        slug = base_slug if count == 0 else f"{base_slug}-{count + 1}"

        title = row.get("Title") or slug.replace("-", " ").title()
        body = read_recovered_body(original_url)
        author = row.get("Author") or "Canadian Surrogacy Options"
        author_slug = "robyn-price" if "robyn" in author.lower() else "canadian-surrogacy-options"
        category = row.get("Knowledge Centre Category") or "Getting Started"
        topic = row.get("Topic") or row.get("Primary Topic") or category
        tags = tags_from_row(row)
        keywords = list(dict.fromkeys([slug.replace("-", " "), topic, category] + tags))
        published = row.get("Publication Date") or row.get("Last Reviewed") or "2026-07-09"
        reviewed = row.get("Last Reviewed") or ""

        frontmatter = [
            "---",
            f"title: {yaml_string(title)}",
            f"slug: {yaml_string(slug)}",
            'type: "article"',
            'status: "draft"',
            f"date: {yaml_string(published)}",
            f"description: {yaml_string(description_from_body(title, body))}",
            f"author: {yaml_string(author)}",
            f"authorSlug: {yaml_string(author_slug)}",
            f"category: {yaml_string(category)}",
            f"knowledgeCategory: {yaml_string(category)}",
            f"tags: {yaml_array(tags)}",
            f"keywords: {yaml_array(keywords)}",
            f"originallyPublished: {yaml_string(published)}",
            f"lastReviewed: {yaml_string(reviewed)}",
            'reviewStatus: ""',
            f"primaryTopic: {yaml_string(topic)}",
            'secondaryTopic: ""',
            f"rewritePriority: {yaml_string(normalize_priority(row.get('Rewrite Priority', '')))}",
            f"seoScore: {yaml_string(row.get('SEO Quality', ''))}",
            'internalLinksNeeded: ""',
            f"sourceUrl: {yaml_string(original_url)}",
            f"archivedUrl: {yaml_string(row.get('Archived URL', ''))}",
            f"sourceContentType: {yaml_string(row.get('Content Type', ''))}",
            f"recoveryStatus: {yaml_string(row.get('Recovered?', ''))}",
            "---",
            "",
        ]

        output_path = OUTPUT_DIR / f"{slug}.mdx"
        output_path.write_text("\n".join(frontmatter) + body.strip() + "\n", encoding="utf-8")
        created += 1

    print(f"Imported {created} recovered draft resources into {OUTPUT_DIR}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
