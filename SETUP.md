# 🎬 CineMood Genre Model Integration

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Verify Model Files

Make sure `genre_model/` folder contains:
```
genre_model/
├── config.json
├── pytorch_model.bin (or model.safetensors)
├── tokenizer.json
├── special_tokens_map.json
└── tokenizer_config.json
```

### 3. Start Flask API Server

```bash
python app.py
```

Server will start at: `http://localhost:5001` (port 5001 avoids conflict with macOS AirPlay Receiver)

### 4. Test API Health

Open browser: `http://localhost:5001/health`

Expected response:
```json
{
  "status": "ok",
  "model": "distilbert-base-uncased",
  "genres": ["action", "adventure", "comedy", "drama", "horror", "romance", "sci-fi"]
}
```

### 5. Open CineMood Frontend

Open `home.html` in browser and test:

**Example inputs:**
- "I want something intense and explosive" → **Action**
- "I need a good laugh" → **Comedy**
- "Something that scares me" → **Horror**
- "I'm feeling romantic" → **Romance**

---

## API Endpoint

### POST `/predict-genre`

**Request:**
```json
{
  "mood": "I want something thrilling and suspenseful"
}
```

**Response:**
```json
{
  "genre": "horror",
  "confidence": 0.8742
}
```

---

## Troubleshooting

**Error: "Model not loaded"**
- Check if `genre_model/` folder exists
- Verify all model files are present

**Error: "Failed to connect"**
- Make sure Flask server is running (`python app.py`)
- Check terminal for error messages

**Error: "Genre not found"**
- Model predicted genre (e.g., "sci-fi") but `data/sci-fi.json` missing
- Add missing genre JSON files to `data/` folder

---

## Genre → Data Mapping

Model outputs → Data files needed:

| Model Output | Data File Required |
|--------------|-------------------|
| action | `data/action.json` |
| adventure | `data/adventure.json` |
| comedy | `data/comedy.json` |
| drama | `data/drama.json` |
| horror | `data/horror.json` |
| romance | `data/romance.json` |
| sci-fi | `data/sci-fi.json` |

---

## Next Steps

1. ✅ Model integrated
2. ✅ API working
3. ⏳ Build results UI (movie cards display)
4. ⏳ Add filtering/sorting
5. ⏳ Implement movie detail modal

---

**Questions?** Check Flask terminal for logs!