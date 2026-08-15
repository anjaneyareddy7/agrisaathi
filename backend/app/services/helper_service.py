import json
from groq import Groq
from app.core.config import settings
from app.data.feature_registry import FEATURES
from app.schemas.helper import HelperChatRequest, HelperChatResponse

client = Groq(api_key=settings.groq_api_key)

SYSTEM_PROMPT = """You are Agri Helper, a voice-friendly assistant inside the AgriSaathi farming app.
The user may be an illiterate farmer speaking aloud, so keep replies short, simple, and spoken-language natural.
You MUST respond only in the requested language (given as a language code).

You have a registry of app features (name, route, description, keywords). Decide the intent:
- "navigate": user wants to GO to a feature/page. Pick the best matching route from the registry.
- "data_query": user is asking about THEIR OWN data (loan eligibility, farm details, tasks, etc.) that may be present in context_data.
- "chat": general farming question or anything else.

If intent is "navigate", ALSO set confirm_navigation=true and phrase reply_text as a short question
asking whether they want to open that page.

CONFIRMATION HANDLING: if "Pending route awaiting confirmation" below is not "none", the user's PREVIOUS
turn already proposed that route and is now waiting for a yes/no answer. If this message is an affirmative
reply (yes/haan/avunu/open it/etc.), respond with intent="navigate", route=<the pending route>,
confirm_navigation=false. If it's a negative reply, respond intent="chat" acknowledging cancellation with
route=null. If the message is unrelated to confirming, treat it as a fresh message instead.

Respond ONLY with strict JSON matching this shape, no markdown, no preamble:
{"intent": "navigate|data_query|chat", "reply_text": "...", "route": "/path-or-null", "confirm_navigation": true|false}
"""

def _feature_registry_text():
    lines = []
    for f in FEATURES:
        lines.append(f'- {f["name"]} ({f["route"]}): {f["description"]} [keywords: {", ".join(f["keywords"])}]')
    return "\n".join(lines)


async def handle_chat(req: HelperChatRequest) -> HelperChatResponse:
    context_snippet = json.dumps(req.context_data)[:4000] if req.context_data else "none"
    pending = f'{req.pending_route_name} ({req.pending_route})' if req.pending_route else "none"

    user_prompt = f"""Language code for reply: {req.language}

Feature registry:
{_feature_registry_text()}

Pending route awaiting confirmation: {pending}

User's own data (may be relevant for data_query intent):
{context_snippet}

User message: "{req.message}"
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
        max_tokens=400,
        response_format={"type": "json_object"},
    )

    raw = completion.choices[0].message.content
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError:
        parsed = {"intent": "chat", "reply_text": raw, "route": None, "confirm_navigation": False}

    return HelperChatResponse(
        intent=parsed.get("intent", "chat"),
        reply_text=parsed.get("reply_text", ""),
        route=parsed.get("route"),
        confirm_navigation=parsed.get("confirm_navigation", False),
    )
