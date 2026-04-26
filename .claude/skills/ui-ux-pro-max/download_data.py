#!/usr/bin/env python3
"""
UI/UX Pro Max - Data Downloader
Downloads full CSV data files from the official GitHub repository.

Usage:
  python3 .claude/skills/ui-ux-pro-max/download_data.py

This will download all CSV data files and stack files needed for
the search engine and design system generator to work properly.
"""

import os
import urllib.request
import sys

BASE_URL = "https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max"
SKILL_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SKILL_DIR, "data")
STACKS_DIR = os.path.join(DATA_DIR, "stacks")

DATA_FILES = [
    "app-interface.csv",
    "charts.csv",
    "colors.csv",
    "design.csv",
    "draft.csv",
    "google-fonts.csv",
    "icons.csv",
    "landing.csv",
    "products.csv",
    "react-performance.csv",
    "styles.csv",
    "typography.csv",
    "ui-reasoning.csv",
    "ux-guidelines.csv",
    "_sync_all.py",
]

STACK_FILES = [
    "angular.csv",
    "astro.csv",
    "flutter.csv",
    "html-tailwind.csv",
    "jetpack-compose.csv",
    "laravel.csv",
    "nextjs.csv",
    "nuxt-ui.csv",
    "nuxtjs.csv",
    "react-native.csv",
    "react.csv",
    "shadcn.csv",
    "svelte.csv",
    "swiftui.csv",
    "threejs.csv",
    "vue.csv",
]

SCRIPT_FILES = [
    "scripts/search.py",
    "scripts/core.py",
    "scripts/design_system.py",
]


def download_file(url, dest):
    """Download a file from URL to destination path."""
    try:
        urllib.request.urlretrieve(url, dest)
        size = os.path.getsize(dest)
        return True, size
    except Exception as e:
        return False, str(e)


def main():
    print("=" * 60)
    print("UI/UX Pro Max - Data Downloader")
    print("=" * 60)
    print()

    # Create directories
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(STACKS_DIR, exist_ok=True)
    os.makedirs(os.path.join(SKILL_DIR, "scripts"), exist_ok=True)

    total = 0
    errors = 0

    # Download data files
    print("Downloading data files...")
    for f in DATA_FILES:
        url = f"{BASE_URL}/data/{f}"
        dest = os.path.join(DATA_DIR, f)
        ok, info = download_file(url, dest)
        if ok:
            print(f"  OK  {f} ({info:,} bytes)")
            total += 1
        else:
            print(f"  FAIL {f}: {info}")
            errors += 1

    # Download stack files
    print("\nDownloading stack files...")
    for f in STACK_FILES:
        url = f"{BASE_URL}/data/stacks/{f}"
        dest = os.path.join(STACKS_DIR, f)
        ok, info = download_file(url, dest)
        if ok:
            print(f"  OK  stacks/{f} ({info:,} bytes)")
            total += 1
        else:
            print(f"  FAIL stacks/{f}: {info}")
            errors += 1

    # Download script files
    print("\nDownloading script files...")
    for f in SCRIPT_FILES:
        url = f"{BASE_URL}/{f}"
        dest = os.path.join(SKILL_DIR, f)
        ok, info = download_file(url, dest)
        if ok:
            print(f"  OK  {f} ({info:,} bytes)")
            total += 1
        else:
            print(f"  FAIL {f}: {info}")
            errors += 1

    print()
    print("=" * 60)
    if errors == 0:
        print(f"SUCCESS: Downloaded {total} files")
    else:
        print(f"Done: {total} OK, {errors} failed")
    print("=" * 60)

    # Quick test
    print("\nRunning quick test...")
    try:
        sys.path.insert(0, os.path.join(SKILL_DIR, "scripts"))
        from core import search
        result = search("minimalism", "style", 1)
        if result.get("count", 0) > 0:
            print("Search engine: WORKING")
        else:
            print("Search engine: Data loaded but no results found")
    except Exception as e:
        print(f"Search engine: {e}")

    return 0 if errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
