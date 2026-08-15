from fastapi import APIRouter, HTTPException
from app.schemas.ledger import LedgerLogRequest, LedgerChainResponse
from app.services.blockchain_ledger import log_event, get_chain, verify_chain

router = APIRouter(prefix="/api/ledger", tags=["ledger"])


@router.post("/log")
async def log(req: LedgerLogRequest):
    try:
        block = log_event(req)
        return block
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ledger write failed: {e}")


@router.get("/chain/{entity_type}/{entity_id}", response_model=LedgerChainResponse)
async def chain(entity_type: str, entity_id: str):
    blocks = get_chain(entity_type, entity_id)
    valid = verify_chain(entity_type, entity_id)
    return LedgerChainResponse(entity_type=entity_type, entity_id=entity_id, blocks=blocks, valid=valid)
