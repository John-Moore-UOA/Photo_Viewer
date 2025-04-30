from flask import Flask, jsonify, send_file, abort, send_from_directory  
import os
import io
from PIL import Image
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)
BASE_FOLDER = os.getenv("BASE_FOLDER")
print(f"BASE_FOLDER: {BASE_FOLDER}")
if not BASE_FOLDER:
    raise ValueError("BASE_FOLDER environment variable is not set.")

@app.route('/api/collections', methods=['GET'])
def get_collections():
    try:
        collections = [
            folder for folder in os.listdir(BASE_FOLDER)
            if os.path.isdir(os.path.join(BASE_FOLDER, folder))
        ]
        return jsonify(collections)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/collections/<collection_name>/images', methods=['GET'])
def get_collection_images(collection_name):
    collection_path = os.path.join(BASE_FOLDER, collection_name)
    if not os.path.isdir(collection_path):
        abort(404, description="Collection not found")
    try:
        images = []
        for root, _, files in os.walk(collection_path):  # Recursively walk through directories
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png', '.heic')):
                    relative_path = os.path.relpath(root, BASE_FOLDER)
                    images.append(f"/images/{relative_path.replace(os.sep, '/')}/{file}")
        return jsonify(images)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/images/<collection_name>/<path:filename>', methods=['GET'])
def serve_collection_image(collection_name, filename):
    collection_path = os.path.join(BASE_FOLDER, collection_name)
    file_path = os.path.join(collection_path, filename)
    if not os.path.isfile(file_path):
        app.logger.error(f"File not found: {file_path}")
        abort(404, description="File not found")

    try:
        ext = os.path.splitext(filename)[1].lower()
        if ext in ['.heic']:
            # Convert HEIC to JPEG
            from pillow_heif import register_heif_opener
            register_heif_opener()
            image = Image.open(file_path)
            img_io = io.BytesIO()
            image.save(img_io, format="JPEG")
            img_io.seek(0)
            return send_file(img_io, mimetype='image/jpeg')
        else:
            return send_from_directory(collection_path, filename)
    except Exception as e:
        app.logger.error(f"Error processing file {file_path}: {e}")
        abort(500, description="Error processing file")

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
