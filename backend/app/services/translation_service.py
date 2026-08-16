"""
Real translation layer for Agri Helper.
Every assistant-facing string (navigation replies, greetings, RAG answers)
is passed through here before being shown/spoken, so language switching
actually translates instead of just relabeling.
"""
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.groq_api_key)

LANGUAGE_NAMES = {
    "en": "English", "hi": "Hindi", "te": "Telugu", "ta": "Tamil",
    "kn": "Kannada", "ml": "Malayalam", "mr": "Marathi", "gu": "Gujarati",
    "pa": "Punjabi", "bn": "Bengali", "or": "Odia", "as": "Assamese",
    "ur": "Urdu", "sa": "Sanskrit", "ks": "Kashmiri", "sd": "Sindhi",
    "ne": "Nepali", "kok": "Konkani", "mni": "Manipuri", "doi": "Dogri",
    "brx": "Bodo", "sat": "Santali", "mai": "Maithili",
}

SYSTEM_PROMPT = """You are a precise translator for a farming assistant app.
Translate the given English text into the requested Indian language.
Rules:
- Keep the meaning exact. Do not add, drop, or explain anything.
- Keep it natural and simple enough to read aloud to a farmer.
- Keep numbers, page/feature names in Latin script as-is if there is no
  natural local equivalent (e.g. keep "Soil Passport" recognizable).
- Respond with ONLY the translated text. No quotes, no notes, no preamble.
"""


def translate_text(text: str, target_language: str) -> str:
    text = (text or "").strip()
    if not text or target_language == "en":
        return text

    lang_name = LANGUAGE_NAMES.get(target_language)
    if not lang_name:
        # Unknown/unsupported code — return original rather than guessing.
        return text

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Translate to {lang_name}:\n\n{text}"},
        ],
        temperature=0.1,
        max_tokens=400,
    )
    translated = completion.choices[0].message.content.strip()
    return translated or text
