from fastapi import APIRouter
import os, glob

router = APIRouter()

@router.get("/list")
async def list_recordings():
    path = "./tmp/recordings"
    os.makedirs(path, exist_ok=True)
    files = glob.glob(os.path.join(path, "*.webm")) + glob.glob(os.path.join(path, "*.mp4"))
    return {"recordings": [os.path.basename(f) for f in files]}
