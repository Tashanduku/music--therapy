import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()
HF_TOKEN = os.getenv("HF_TOKEN")

app = Flask(__name__)
CORS(app)

client = InferenceClient(token=HF_TOKEN)

FALLBACK_SONGS = {
    "sad": ("The Night We Met", "Lord Huron", "A melancholic yet beautiful song about loss and memory"),
    "happy": ("Good Life", "OneRepublic", "An uplifting anthem celebrating life's best moments"),
    "angry": ("Lose Yourself", "Eminem", "Channel your energy with this powerful motivational track"),
    "anxious": ("Weightless", "Marconi Union", "Scientifically designed to reduce anxiety"),
    "lonely": ("Someone Like You", "Adele", "A heartfelt ballad that makes you feel understood"),
    "energetic": ("Can't Hold Us", "Macklemore & Ryan Lewis", "High-energy track to match your vibe"),
    "calm": ("Clair de Lune", "Claude Debussy", "Peaceful piano piece for relaxation"),
    "nostalgic": ("The Night We Met", "Lord Huron", "Takes you back to cherished memories")
}

@app.route("/api/get-song", methods=["POST"])
def get_song():
    mood = (request.json.get("mood") or "").strip()
    if not mood:
        return jsonify({"error": "Mood is required"}), 400

    try:
        response = client.chat_completion(
            messages=[
                {"role": "system", "content": "You are a music therapist. Respond ONLY with a JSON object."},
                {"role": "user", "content": f'A person is feeling: "{mood}"\nReturn JSON with keys: song, artist, reason.'}
            ],
            model="mistralai/Mistral-7B-Instruct-v0.2",
            max_tokens=200,
            temperature=0.7
        )
        text = response.choices[0].message.content

        # Attempt direct JSON parsing
        text = text.strip().replace("```json", "").replace("```", "")
        data = json.loads(text)
        if all(k in data for k in ("song", "artist", "reason")):
            return jsonify(data)
    except:
        pass

    # Fallback based on mood
    for key, (song, artist, reason) in FALLBACK_SONGS.items():
        if key in mood.lower():
            return jsonify({"song": song, "artist": artist, "reason": reason})

    # Default fallback
    return jsonify({
        "song": "Here Comes the Sun",
        "artist": "The Beatles",
        "reason": "A timeless song that brings comfort and warmth to any moment"
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
