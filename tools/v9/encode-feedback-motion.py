#!/usr/bin/env python3
"""Encode the captured Section 03 browser frames as an animated PNG."""
from pathlib import Path
import struct
import zlib

ROOT = Path(__file__).resolve().parents[2]
FRAMES = sorted((ROOT / "review/v9/feedback-frames").glob("*.png"))
OUTPUT = ROOT / "review/v9/feedback-loop-motion.png"
SIGNATURE = b"\x89PNG\r\n\x1a\n"


def chunks(path):
    data = path.read_bytes()
    if not data.startswith(SIGNATURE):
        raise ValueError(f"Not a PNG: {path}")
    offset = len(SIGNATURE)
    while offset < len(data):
        size = struct.unpack(">I", data[offset:offset + 4])[0]
        kind = data[offset + 4:offset + 8]
        payload = data[offset + 8:offset + 8 + size]
        yield kind, payload
        offset += size + 12


def chunk(kind, payload):
    checksum = zlib.crc32(kind + payload) & 0xffffffff
    return struct.pack(">I", len(payload)) + kind + payload + struct.pack(">I", checksum)


if len(FRAMES) < 2:
    raise SystemExit("Capture at least two frames first.")

parsed = []
size = None
image_header = None
for frame in FRAMES:
    image_chunks = list(chunks(frame))
    header = next(payload for kind, payload in image_chunks if kind == b"IHDR")
    dimensions = struct.unpack(">II", header[:8])
    size = size or dimensions
    image_header = image_header or header
    if dimensions != size:
        raise SystemExit(f"Frame dimensions differ: {frame}")
    parsed.append(b"".join(payload for kind, payload in image_chunks if kind == b"IDAT"))

width, height = size
output = bytearray(SIGNATURE)
output += chunk(b"IHDR", image_header)
output += chunk(b"acTL", struct.pack(">II", len(parsed), 0))
sequence = 0
for index, compressed in enumerate(parsed):
    control = struct.pack(">IIIIIHHBB", sequence, width, height, 0, 0, 1, 4, 0, 0)
    output += chunk(b"fcTL", control)
    sequence += 1
    if index == 0:
        output += chunk(b"IDAT", compressed)
    else:
        output += chunk(b"fdAT", struct.pack(">I", sequence) + compressed)
        sequence += 1
output += chunk(b"IEND", b"")
OUTPUT.write_bytes(output)
print(f"Wrote {OUTPUT.relative_to(ROOT)} ({len(parsed)} frames, {width}×{height}, {len(output):,} bytes)")
