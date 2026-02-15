import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__, static_folder='.')
CORS(app)

# Genre mapping
ID2LABEL = {
    0: "action",
    1: "adventure",
    2: "comedy",
    3: "drama",
    4: "horror",
    5: "romance",
    6: "sci-fi"
}

# ---------------------------
# LOAD MODEL AND TOKENIZER
# ---------------------------
print("Loading CineMood Genre Classifier...")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "genre_model")

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model.eval()
    print("✓ Model loaded successfully!")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None
    tokenizer = None


# ---------------------------
# SERVE FRONTEND FILES
# ---------------------------
@app.route('/')
def serve_home():
    return send_from_directory('.', 'home.html')


@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)


# ---------------------------
# API ROUTES
# ---------------------------
@app.route('/predict-genre', methods=['POST'])
def predict_genre():
    if model is None or tokenizer is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.json
        mood = data.get('mood', '').strip()

        if not mood:
            return jsonify({'error': 'No mood text provided'}), 400

        inputs = tokenizer(
            mood,
            return_tensors="pt",
            truncation=True,
            max_length=128,
            padding=True,
            return_token_type_ids=False
        )

        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            probs = torch.softmax(logits, dim=-1)

            predicted_class = torch.argmax(probs, dim=-1).item()
            confidence = probs[0][predicted_class].item()

        genre = ID2LABEL.get(predicted_class, "unknown")

        return jsonify({
            'genre': genre,
            'confidence': round(confidence, 4)
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/health', methods=['GET'])
def health():
    status = 'ok' if (model is not None and tokenizer is not None) else 'model_not_loaded'
    return jsonify({
        'status': status,
        'model': 'local-genre-model',
        'genres': list(ID2LABEL.values())
    })


if __name__ == '__main__':
    print("\n🎬 CineMood Genre API Server")
    print("=" * 50)
    app.run(debug=True, port=5001, host='0.0.0.0')
