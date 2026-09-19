#!/usr/bin/env python3
"""
tools/optimize_screens.py - Converts any PNG in web/assets/screens/ to WebP (quality 85).
"""
import os
import sys
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if os.path.basename(SCRIPT_DIR) == "tools" and os.path.exists(os.path.join(SCRIPT_DIR, "..", "web")):
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
elif os.path.exists(os.path.join(SCRIPT_DIR, "..", "assets", "screens")):
    BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
else:
    BASE_DIR = "/home/life/Documents/CNDPT"

SCREENS_DIR = os.path.join(BASE_DIR, "web", "assets", "screens")

def optimize_screens():
    if not os.path.exists(SCREENS_DIR):
        print(f"Directory not found: {SCREENS_DIR}")
        return

    png_files = [f for f in os.listdir(SCREENS_DIR) if f.lower().endswith(".png")]
    if not png_files:
        print(f"No PNG files found in {SCREENS_DIR}")
        return

    print(f"Found {len(png_files)} PNG screenshot(s) to optimize into WebP (quality 85):")
    total_orig = 0
    total_opt = 0

    for fname in sorted(png_files):
        png_path = os.path.join(SCREENS_DIR, fname)
        base_name = os.path.splitext(fname)[0]
        webp_path = os.path.join(SCREENS_DIR, f"{base_name}.webp")

        orig_size = os.path.getsize(png_path)
        total_orig += orig_size

        try:
            with Image.open(png_path) as img:
                img.save(webp_path, "WEBP", quality=85)
            opt_size = os.path.getsize(webp_path)
            total_opt += opt_size
            savings = ((orig_size - opt_size) / orig_size) * 100
            print(f"  ✓ {fname} -> {base_name}.webp: {orig_size/1024:.1f}KB -> {opt_size/1024:.1f}KB ({savings:.1f}% saved)")
        except Exception as ex:
            print(f"  ✗ Error converting {fname}: {ex}")

    total_savings = ((total_orig - total_opt) / total_orig) * 100 if total_orig > 0 else 0
    print("-" * 60)
    print(f"Total: {total_orig/1024/1024:.2f}MB -> {total_opt/1024/1024:.2f}MB ({total_savings:.1f}% total savings)")

if __name__ == "__main__":
    optimize_screens()
