#!/usr/bin/env python3
"""
srt2vtt.py: Chuyển đổi tệp phụ đề SRT sang định dạng WebVTT (VTT) chuẩn web.
Sử dụng thư viện chuẩn của Python, không cần cài thêm package.

Cách dùng:
    python3 srt2vtt.py input.srt output.vtt
Hoặc tự động lưu cùng tên đuôi .vtt:
    python3 srt2vtt.py input.srt
"""

import sys
import re
from pathlib import Path


def convert_srt_to_vtt(srt_text: str) -> str:
    """Chuyển đổi nội dung SRT sang WebVTT."""
    # Chuẩn hóa xuống dòng
    lines = srt_text.replace("\r\n", "\n").replace("\r", "\n").split("\n")
    vtt_output = ["WEBVTT\n"]

    time_pattern = re.compile(
        r"(\d{2}:\d{2}:\d{2}),(\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}),(\d{3})"
    )

    for line in lines:
        match = time_pattern.search(line)
        if match:
            # Thay thế dấu phẩy mili giây bằng dấu chấm theo chuẩn VTT
            vtt_time = f"{match.group(1)}.{match.group(2)} --> {match.group(3)}.{match.group(4)}"
            vtt_output.append(vtt_time)
        else:
            vtt_output.append(line)

    return "\n".join(vtt_output).strip() + "\n"


def main():
    if len(sys.argv) < 2:
        print("Sử dụng: python3 srt2vtt.py <file.srt> [output.vtt]")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.is_file():
        print(f"Lỗi: Không tìm thấy tệp {input_path}")
        sys.exit(1)

    if len(sys.argv) >= 3:
        output_path = Path(sys.argv[2])
    else:
        output_path = input_path.with_suffix(".vtt")

    try:
        content = input_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        content = input_path.read_text(encoding="utf-8-sig")

    vtt_content = convert_srt_to_vtt(content)
    output_path.write_text(vtt_content, encoding="utf-8")
    print(f"Đã chuyển đổi thành công: {input_path} -> {output_path}")


if __name__ == "__main__":
    main()
