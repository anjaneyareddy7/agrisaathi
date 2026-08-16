"""
Agri Helper backend brain — data_query (RAG-grounded) and open chat only.
Navigation is handled entirely client-side (useHelperRouter.js /
pageRouter.js) — this file does NOT guess routes anymore, it only answers
questions using retrieved passages, and suggests a route when nothing
relevant was found.
"""
import json
from groq import Groq
from app.core.config import settings
from app.schemas.helper import HelperChatRequest, HelperChatResponse
from app.services.rag_service import retrieve
from app.services.advisory_ledger import append_record

client = Groq(api_key=settings.groq_api_key)

SYSTEM_PROMPT = """You are Agri Helper, a voice-friendly assistant inside the AgriSaathi farming app.
The user may be an illiterate farmer speaking aloud — keep replies short (2-4 sentences), simple,
and natural to say out loud. Reply ONLY in the requested language (given as a language code).

You are given RETRIEVED PASSAGES from AgriSaathi's own crop encyclopedia, animal encyclopedia,
feature descriptions, and the user's own farm/soil/crop records. Base your answer ONLY on these
passages plus general, well-established agronomic/veterinary knowledge for context. Do NOT invent
specific numbers, prices, schedules, or eligibility figures that are not in the passages.

If the passages don't actually answer the question, say plainly that you don't have that exact
detail on record, in ONE short sentence — do not pad or apologize repeatedly.

Respond ONLY with strict JSON, no markdown, no preamble:
{"reply_text": "..."}
"""


def _read_offer_needed(reply_text: str) -> bool:
    """Offer read-aloud for any substantive reply (not tiny acknowledgements)."""
    return len(reply_text.strip()) > 40


async def handle_chat(req: HelperChatRequest) -> HelperChatResponse:
    # --- Turn 2 of the read-aloud flow: user is answering yes/no to
    # "do you want me to read this aloud?" ---
    if req.awaiting_read_confirmation:
        text = req.message.strip().lower()
        yes_words = ["yes", "yeah", "yep", "ok", "okay", "avunu", "\u0905\u0935\u0941\u0928\u0941", "haan", "\u0939\u093e\u0902"]
        if any(text == w or text.startswith(w + " ") for w in yes_words):
            return HelperChatResponse(
                intent="read_confirmed",
                reply_text=req.pending_read_text or "",
                offer_read_aloud=False,
            )
        return HelperChatResponse(
            intent="read_declined",
            reply_text="Thank you! If you need help, just ask me anytime.",
            offer_read_aloud=False,
        )

    # --- Normal turn: RAG retrieval first ---
    found, passages, suggested_feature = retrieve(req.message, req.context_data)

    if not found:
        route = suggested_feature["route"] if suggested_feature else None
        label = suggested_feature["title"] if suggested_feature else None
        reply = (
            f"I don't have that exact detail on record. "
            f"{'I can take you to ' + label + ' for more.' if label else 'Could you try rephrasing?'}"
        )
        proof = append_record(
            request_type="data_query",
            user_input_text=req.message,
            advice_output=reply,
            sources=[],
        )
        return HelperChatResponse(
            intent="chat",
            reply_text=reply,
            found_in_rag=False,
            sources=[],
            route_suggested=route,
            route_suggested_label=label,
            offer_read_aloud=False,
            proof_hash=proof,
        )

    passages_text = "\n\n".join(f"[{p['source']}: {p['title']}] {p['text']}" for p in passages)
    user_prompt = f"""Language code for reply: {req.language}

RETRIEVED PASSAGES:
{passages_text}

User message: "{req.message}"
"""

    completion = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=350,
        response_format={"type": "json_object"},
    )

    raw = completion.choices[0].message.content
    try:
        parsed = json.loads(raw)
        reply_text = parsed.get("reply_text", "").strip()
    except json.JSONDecodeError:
        reply_text = raw.strip()

    sources = sorted({p["title"] for p in passages})
    proof = append_record(
        request_type="data_query",
        user_input_text=req.message,
        advice_output=reply_text,
        sources=sources,
    )

    return HelperChatResponse(
        intent="data_query",
        reply_text=reply_text,
        found_in_rag=True,
        sources=sources,
        offer_read_aloud=_read_offer_needed(reply_text),
        proof_hash=proof,
    )
