"""Quick API smoke test — run while Flask is running on port 5000."""
import urllib.request, json, io, base64
from PIL import Image, ImageDraw

# --- Test 1: Green image (expect wet_waste) ---
img = Image.new("RGB", (200, 200), (40, 180, 60))
draw = ImageDraw.Draw(img)
draw.ellipse([50, 50, 150, 150], fill=(20, 140, 30))
buf = io.BytesIO()
img.save(buf, format="PNG")
b64 = base64.b64encode(buf.getvalue()).decode()

payload = json.dumps({"image_base64": "data:image/png;base64," + b64}).encode()
req = urllib.request.Request(
    "http://localhost:5000/api/classify-waste",
    data=payload,
    headers={"Content-Type": "application/json"},
)
resp = urllib.request.urlopen(req)
data = json.loads(resp.read())
print(f"[Green image]")
print(f"  Category   : {data['category']}")
print(f"  Label      : {data['label']}")
print(f"  Confidence : {data['confidence']}%")
print(f"  Engine     : {data['engine']}")
print(f"  Top cues   : {data['matched_labels']}")
print()

# --- Test 2: Grey metallic image (expect recyclable) ---
img2 = Image.new("RGB", (200, 200), (190, 190, 195))
buf2 = io.BytesIO()
img2.save(buf2, format="PNG")
b64_2 = base64.b64encode(buf2.getvalue()).decode()

payload2 = json.dumps({"image_base64": "data:image/png;base64," + b64_2}).encode()
req2 = urllib.request.Request(
    "http://localhost:5000/api/classify-waste",
    data=payload2,
    headers={"Content-Type": "application/json"},
)
resp2 = urllib.request.urlopen(req2)
data2 = json.loads(resp2.read())
print(f"[Grey metallic image]")
print(f"  Category   : {data2['category']}")
print(f"  Label      : {data2['label']}")
print(f"  Confidence : {data2['confidence']}%")
print(f"  Top cues   : {data2['matched_labels']}")
print()
print("✅ API test complete!")
