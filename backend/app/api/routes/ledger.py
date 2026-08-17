from fastapi import APIRouter, HTTPException
from app.schemas.ledger import LedgerLogRequest, LedgerChainResponse, LedgerListResponse
from app.services.blockchain_ledger import log_event, get_chain, verify_chain, list_all_blocks

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


@router.get("/list/{entity_type}", response_model=LedgerListResponse)
async def list_entries(entity_type: str, limit: int = 100):
    blocks = list_all_blocks(entity_type, limit=limit)
    return LedgerListResponse(entity_type=entity_type, blocks=blocks)
