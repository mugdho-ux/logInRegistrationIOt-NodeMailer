from flask import Flask, jsonify
import requests
import os
import time

app = Flask(__name__)

SAVE_DIR = "images"
os.makedirs(SAVE_DIR, exist_ok=True)

@app.route("/capture", methods=["GET"])
def capture():
    try:
        url = "http://192.168.88.42:8080/photo.jpg"
        response = requests.get(url, timeout=5)
        filename = f"snapshot_{int(time.time())}.jpg"
        filepath = os.path.join(SAVE_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(response.content)
        print(f"✅ Saved: {filename}")
        return jsonify({"success": True, "file": filename})
    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
