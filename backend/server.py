from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr


# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGO = "HS256"
JWT_EXPIRY_HOURS = 24

ADMIN_EMAIL = os.environ['ADMIN_EMAIL']
ADMIN_PASSWORD = os.environ['ADMIN_PASSWORD']

app = FastAPI(title="Buland Bharat Party API")
api_router = APIRouter(prefix="/api")
bearer_scheme = HTTPBearer(auto_error=False)


# ---------- Helpers ----------
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(email: str, role: str) -> str:
    payload = {
        "sub": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRY_HOURS),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def get_current_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)) -> dict:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="प्रमाणीकरण आवश्यक है / Authentication required")
    token = creds.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="टोकन समाप्त हो गया / Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="अमान्य टोकन / Invalid token")
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="अनुमति नहीं है / Forbidden")
    user = await db.users.find_one({"email": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="उपयोगकर्ता नहीं मिला / User not found")
    return user


# ---------- Models ----------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    token: str
    email: str
    role: str


class MembershipCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    phone: str = Field(..., min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    state: str = Field(..., min_length=2, max_length=80)
    city: str = Field(..., min_length=2, max_length=80)
    address: Optional[str] = Field(None, max_length=500)
    age: Optional[int] = Field(None, ge=18, le=120)
    occupation: Optional[str] = Field(None, max_length=120)
    message: Optional[str] = Field(None, max_length=1000)


class Membership(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    phone: str
    email: Optional[str] = None
    state: str
    city: str
    address: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    message: Optional[str] = None
    created_at: str


class NewsCreate(BaseModel):
    title_hi: str = Field(..., min_length=2, max_length=300)
    title_en: str = Field(..., min_length=2, max_length=300)
    excerpt_hi: str = Field(..., min_length=2, max_length=500)
    excerpt_en: str = Field(..., min_length=2, max_length=500)
    content_hi: str = Field(..., min_length=2)
    content_en: str = Field(..., min_length=2)
    category: str = Field(default="समाचार", max_length=80)
    image_url: Optional[str] = None
    published: bool = True


class NewsUpdate(BaseModel):
    title_hi: Optional[str] = None
    title_en: Optional[str] = None
    excerpt_hi: Optional[str] = None
    excerpt_en: Optional[str] = None
    content_hi: Optional[str] = None
    content_en: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    published: Optional[bool] = None


class NewsArticle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title_hi: str
    title_en: str
    excerpt_hi: str
    excerpt_en: str
    content_hi: str
    content_en: str
    category: str
    image_url: Optional[str] = None
    published: bool
    created_at: str
    updated_at: str


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = None
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=2, max_length=2000)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "बुलंद भारत पार्टी API", "status": "ok"}


@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="गलत ईमेल या पासवर्ड / Invalid email or password")
    token = create_token(email, user.get("role", "admin"))
    return LoginResponse(token=token, email=email, role=user.get("role", "admin"))


@api_router.get("/auth/me")
async def me(current: dict = Depends(get_current_admin)):
    return current


# Membership
@api_router.post("/membership", response_model=Membership)
async def create_membership(payload: MembershipCreate):
    now = datetime.now(timezone.utc).isoformat()
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now
    await db.memberships.insert_one(doc.copy())
    doc.pop("_id", None)
    return Membership(**doc)


@api_router.get("/membership", response_model=List[Membership])
async def list_memberships(current: dict = Depends(get_current_admin)):
    items = await db.memberships.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Membership(**i) for i in items]


@api_router.get("/membership/count")
async def membership_count():
    count = await db.memberships.count_documents({})
    return {"count": count}


# News
@api_router.get("/news", response_model=List[NewsArticle])
async def list_news(published_only: bool = True):
    query = {"published": True} if published_only else {}
    items = await db.news.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [NewsArticle(**i) for i in items]


@api_router.get("/news/{news_id}", response_model=NewsArticle)
async def get_news(news_id: str):
    item = await db.news.find_one({"id": news_id}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="समाचार नहीं मिला / News not found")
    return NewsArticle(**item)


@api_router.post("/news", response_model=NewsArticle)
async def create_news(payload: NewsCreate, current: dict = Depends(get_current_admin)):
    now = datetime.now(timezone.utc).isoformat()
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now
    doc["updated_at"] = now
    await db.news.insert_one(doc.copy())
    doc.pop("_id", None)
    return NewsArticle(**doc)


@api_router.put("/news/{news_id}", response_model=NewsArticle)
async def update_news(news_id: str, payload: NewsUpdate, current: dict = Depends(get_current_admin)):
    updates = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="कुछ भी अपडेट करने के लिए नहीं / Nothing to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.news.update_one({"id": news_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="समाचार नहीं मिला / News not found")
    item = await db.news.find_one({"id": news_id}, {"_id": 0})
    return NewsArticle(**item)


@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str, current: dict = Depends(get_current_admin)):
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="समाचार नहीं मिला / News not found")
    return {"ok": True, "id": news_id}


# Contact
@api_router.post("/contact")
async def create_contact(payload: ContactCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one(doc.copy())
    doc.pop("_id", None)
    return {"ok": True, "id": doc["id"]}


@api_router.get("/contact")
async def list_contacts(current: dict = Depends(get_current_admin)):
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return items


# Leaders (static seed data exposed via API)
@api_router.get("/leaders")
async def list_leaders():
    items = await db.leaders.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return items


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def startup():
    # Seed admin idempotently
    existing = await db.users.find_one({"email": ADMIN_EMAIL.lower()})
    if not existing:
        await db.users.insert_one({
            "email": ADMIN_EMAIL.lower(),
            "password_hash": hash_password(ADMIN_PASSWORD),
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info("Seeded admin user: %s", ADMIN_EMAIL)
    else:
        # Update password if changed
        if not verify_password(ADMIN_PASSWORD, existing["password_hash"]):
            await db.users.update_one(
                {"email": ADMIN_EMAIL.lower()},
                {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
            )
            logger.info("Updated admin password for: %s", ADMIN_EMAIL)

    # Indexes
    await db.users.create_index("email", unique=True)
    await db.memberships.create_index([("created_at", -1)])
    await db.news.create_index([("created_at", -1)])
    await db.news.create_index("id", unique=True)

    # Seed leaders if empty
    if await db.leaders.count_documents({}) == 0:
        await db.leaders.insert_many([
            {
                "id": str(uuid.uuid4()),
                "name_hi": "एडवोकेट कुणाल कांत शर्मा",
                "name_en": "Advocate Kunal Kant Sharma",
                "role_hi": "राष्ट्रीय अध्यक्ष",
                "role_en": "National President",
                "bio_hi": "बुलंद भारत पार्टी के संस्थापक एवं राष्ट्रीय अध्यक्ष। पेशे से अधिवक्ता। एकता, सौहार्द, और भ्रष्टाचार-मुक्त भारत के प्रबल पैरोकार। 'न खाऊँगा, न खाने दूँगा' को ज़मीनी हकीकत बनाने का संकल्प।",
                "bio_en": "Founder and National President of Buland Bharat Party. Advocate by profession. Strong proponent of unity, harmony and a corruption-free India.",
                "image": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/g6re1v5k_image.png",
                "order": 1,
            },
            {
                "id": str(uuid.uuid4()),
                "name_hi": "एडवोकेट ज्ञानेंद्र त्यागी",
                "name_en": "Advocate Gyanendra Tyagi",
                "role_hi": "राष्ट्रीय उपाध्यक्ष",
                "role_en": "National Vice President",
                "bio_hi": "बुलंद भारत पार्टी के राष्ट्रीय उपाध्यक्ष। पेशे से अधिवक्ता, जनसेवा और संगठन-निर्माण में दीर्घ अनुभव।",
                "bio_en": "National Vice President of Buland Bharat Party. Advocate by profession with long experience in public service and organisational work.",
                "image": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/g463vvmg_image.png",
                "order": 2,
            },
            {
                "id": str(uuid.uuid4()),
                "name_hi": "श्री अशोक चौहान",
                "name_en": "Shri Ashok Chauhan",
                "role_hi": "राष्ट्रीय कोषाध्यक्ष",
                "role_en": "National Treasurer",
                "bio_hi": "बुलंद भारत पार्टी के राष्ट्रीय कोषाध्यक्ष। वित्तीय पारदर्शिता और सुशासन के प्रबल पैरोकार।",
                "bio_en": "National Treasurer of Buland Bharat Party. Strong advocate of financial transparency and good governance.",
                "image": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/ztv00z6p_image.png",
                "order": 3,
            },
            {
                "id": str(uuid.uuid4()),
                "name_hi": "श्री सत्य देव यादव",
                "name_en": "Shri Satya Dev Yadav",
                "role_hi": "फरीदाबाद लोकसभा उम्मीदवार",
                "role_en": "Faridabad Lok Sabha Candidate",
                "bio_hi": "फरीदाबाद लोकसभा क्षेत्र से बुलंद भारत पार्टी के उम्मीदवार। पूर्व सैनिक एवं समाज सेवक। चुनाव चिन्ह — गैस सिलेंडर।",
                "bio_en": "Buland Bharat Party candidate from Faridabad Lok Sabha. Veteran and social worker. Election symbol — Gas Cylinder.",
                "image": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/p1itt04j_image.png",
                "order": 4,
            },
        ])
        logger.info("Seeded 4 leaders")

    # Seed initial news if empty
    if await db.news.count_documents({}) == 0:
        now_iso = datetime.now(timezone.utc).isoformat()
        await db.news.insert_many([
            {
                "id": str(uuid.uuid4()),
                "title_hi": "फरीदाबाद लोकसभा में बुलंद भारत पार्टी का नामांकन",
                "title_en": "Buland Bharat Party Files Nomination from Faridabad Lok Sabha",
                "excerpt_hi": "पार्टी प्रत्याशी श्री सत्य देव यादव ने फरीदाबाद लोकसभा क्षेत्र से चुनाव आयोग में अपना नामांकन दाखिल किया। चुनाव चिन्ह — गैस सिलेंडर।",
                "excerpt_en": "Party candidate Shri Satya Dev Yadav filed his nomination from Faridabad Lok Sabha constituency. Election symbol — Gas Cylinder.",
                "content_hi": "बुलंद भारत पार्टी के फरीदाबाद लोकसभा प्रत्याशी श्री सत्य देव यादव ने पार्टी के राष्ट्रीय अध्यक्ष एडवोकेट कुणाल कांत शर्मा और अनेक पदाधिकारियों की उपस्थिति में चुनाव आयोग में अपना नामांकन दाखिल किया। नामांकन के समय बड़ी संख्या में कार्यकर्ता उपस्थित रहे। पार्टी का चुनाव चिन्ह 'गैस सिलेंडर' है।",
                "content_en": "Buland Bharat Party's Faridabad Lok Sabha candidate Shri Satya Dev Yadav filed his nomination at the Election Commission in the presence of National President Advocate Kunal Kant Sharma and several office bearers. A large number of workers were present. The party's election symbol is 'Gas Cylinder'.",
                "category": "नामांकन",
                "image_url": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/p1itt04j_image.png",
                "published": True,
                "created_at": now_iso,
                "updated_at": now_iso,
            },
            {
                "id": str(uuid.uuid4()),
                "title_hi": "एकता और सौहार्द — पार्टी का जन-संवाद",
                "title_en": "Unity and Harmony — Party's Public Dialogue",
                "excerpt_hi": "राष्ट्रीय अध्यक्ष एडवोकेट कुणाल कांत शर्मा ने कार्यकर्ता बैठक में 'पहले भारतीय' की भावना को आगे बढ़ाने पर ज़ोर दिया।",
                "excerpt_en": "National President Advocate Kunal Kant Sharma emphasized the spirit of 'Indian First' at the workers' meeting.",
                "content_hi": "बुलंद भारत पार्टी की कार्यकर्ता बैठक में राष्ट्रीय अध्यक्ष ने कहा कि धर्म, जाति, भाषा या क्षेत्र के नाम पर बंटवारा देश को कमजोर करता है। मोहल्ला स्तर पर सामुदायिक संवाद, अंतर-धार्मिक सम्मेलन और युवाओं के लिए राष्ट्रीय एकता शिविरों के माध्यम से भाईचारे का माहौल बनाया जाएगा।",
                "content_en": "At the workers' meeting, the National President said that division in the name of religion, caste, language or region weakens the country. A spirit of brotherhood will be built through community dialogue at the neighbourhood level, inter-faith conferences and national unity camps for youth.",
                "category": "कार्यकर्ता बैठक",
                "image_url": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/feeng9zq_image.png",
                "published": True,
                "created_at": now_iso,
                "updated_at": now_iso,
            },
            {
                "id": str(uuid.uuid4()),
                "title_hi": "जन-जन तक पार्टी का संदेश",
                "title_en": "Party's Message Reaches the People",
                "excerpt_hi": "गाँव-गाँव, शहर-शहर — पार्टी कार्यकर्ता विकास और भ्रष्टाचार-मुक्त भारत का संदेश ले जा रहे हैं।",
                "excerpt_en": "Village to village, city to city — party workers are taking the message of development and corruption-free India.",
                "content_hi": "बुलंद भारत पार्टी के कार्यकर्ता गाँवों, बाज़ारों और मोहल्लों में जाकर लोगों से सीधा संवाद कर रहे हैं। पार्टी का संकल्प है — किसान समृद्ध हों, महिलाएं सशक्त हों, युवा आत्मनिर्भर हों और सैनिक सम्मानित हों।",
                "content_en": "Buland Bharat Party workers are directly engaging with people in villages, markets and neighbourhoods. The party's pledge — prosperous farmers, empowered women, self-reliant youth and honoured soldiers.",
                "category": "जन संपर्क",
                "image_url": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/aut5bwop_image.png",
                "published": True,
                "created_at": now_iso,
                "updated_at": now_iso,
            },
        ])
        logger.info("Seeded 3 initial news articles")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
