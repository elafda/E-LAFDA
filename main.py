from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
from datetime import datetime, timedelta, timezone
import uuid

app = FastAPI()

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firestore
db = firestore.Client.from_service_account_json("firebase_credentials.json")

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Homepage Route
@app.get("/")
async def serve_homepage():
    return {"message": "Welcome to E-Lafda! Use the frontend to create/join a debate."}

# Create a new Lafda (Debate Room)
@app.post("/create-lafda/")
async def create_lafda(topic: str):
    lafda_id = uuid.uuid4().hex[:8]  # Generate an 8-character unique ID
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)  # Set 24-hour expiration

    lafda_data = {
        "topic": topic,
        "lafda_id": lafda_id,
        "expires_at": expires_at.isoformat(),  # Store in ISO format
    }

    db.collection("lafda").document(lafda_id).set(lafda_data)
    return {"lafda_id": lafda_id, "link": f"http://127.0.0.1:8000/join/{lafda_id}"}

# Join an existing Lafda
@app.get("/join/{lafda_id}")
async def join_lafda(lafda_id: str):
    doc = db.collection("lafda").document(lafda_id).get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Lafda not found!")

    return doc.to_dict()

# Cleanup expired Lafdas
@app.on_event("startup")
async def delete_expired_lafdas():
    docs = db.collection("lafda").stream()
    utc_now = datetime.now(timezone.utc)  # Convert current time to UTC

    for doc in docs:
        lafda_data = doc.to_dict()
        expires_at = lafda_data.get("expires_at")

        if isinstance(expires_at, str):
            expires_at = datetime.fromisoformat(expires_at).replace(tzinfo=timezone.utc)
        elif isinstance(expires_at, datetime):
            expires_at = expires_at.astimezone(timezone.utc)

        if utc_now > expires_at:
            db.collection("lafda").document(doc.id).delete()
            print(f"Deleted expired Lafda: {doc.id}")