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
                "name_hi": "श्री राजेंद्र सिंह यादव",
                "name_en": "Shri Rajendra Singh Yadav",
                "role_hi": "राष्ट्रीय अध्यक्ष",
                "role_en": "National President",
                "bio_hi": "तीन दशकों से जन सेवा में समर्पित, बुलंद भारत के स्वप्नदृष्टा।",
                "bio_en": "Three decades of public service. Visionary of a stronger India.",
                "image": "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/mqpq57l9_image.png",
                "order": 1,
            },
            {
                "id": str(uuid.uuid4()),
                "name_hi": "श्रीमती अनिता शर्मा",
                "name_en": "Smt. Anita Sharma",
                "role_hi": "राष्ट्रीय महासचिव",
                "role_en": "National General Secretary",
                "bio_hi": "महिला सशक्तिकरण और शिक्षा सुधार की प्रबल पक्षधर।",
                "bio_en": "Strong advocate of women empowerment and education reform.",
                "image": "https://static.prod-images.emergentagent.com/jobs/922ef7bd-57eb-4f7e-b6bd-dba4d1fc641a/images/4b59e1adacff8c9c82bbf7968ce3c4238ad3f7dd9ed13c2df5262d4e68a078bc.png",
                "order": 2,
            },
            {
                "id": str(uuid.uuid4()),
                "name_hi": "डॉ. विकास कुमार",
                "name_en": "Dr. Vikas Kumar",
                "role_hi": "राष्ट्रीय प्रवक्ता",
                "role_en": "National Spokesperson",
                "bio_hi": "अर्थशास्त्री और नीति विश्लेषक। ग्रामीण विकास के अग्रदूत।",
                "bio_en": "Economist and policy analyst. Champion of rural development.",
                "image": "https://static.prod-images.emergentagent.com/jobs/922ef7bd-57eb-4f7e-b6bd-dba4d1fc641a/images/4b59e1adacff8c9c82bbf7968ce3c4238ad3f7dd9ed13c2df5262d4e68a078bc.png",
                "order": 3,
            },
            {
                "id": str(uuid.uuid4()),
                "name_hi": "श्री अरविंद पटेल",
                "name_en": "Shri Arvind Patel",
                "role_hi": "कोषाध्यक्ष",
                "role_en": "Treasurer",
                "bio_hi": "वित्तीय पारदर्शिता और सुशासन के पक्षधर।",
                "bio_en": "Advocate of financial transparency and good governance.",
                "image": "https://static.prod-images.emergentagent.com/jobs/922ef7bd-57eb-4f7e-b6bd-dba4d1fc641a/images/4b59e1adacff8c9c82bbf7968ce3c4238ad3f7dd9ed13c2df5262d4e68a078bc.png",
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
                "title_hi": "बुलंद भारत पार्टी का राष्ट्रीय अधिवेशन सम्पन्न",
                "title_en": "Buland Bharat Party National Convention Concludes",
                "excerpt_hi": "देशभर से हज़ारों कार्यकर्ताओं ने राष्ट्रीय अधिवेशन में भाग लिया और एक नए भारत के निर्माण का संकल्प लिया।",
                "excerpt_en": "Thousands of workers from across the nation attended the convention and pledged to build a new India.",
                "content_hi": "बुलंद भारत पार्टी का तीन दिवसीय राष्ट्रीय अधिवेशन दिल्ली में सफलतापूर्वक सम्पन्न हुआ। राष्ट्रीय अध्यक्ष ने अपने सम्बोधन में कहा कि पार्टी आम जनता की आवाज़ बनकर सत्ता के गलियारों तक उनकी समस्याओं को पहुँचाएगी।",
                "content_en": "The three-day national convention of Buland Bharat Party concluded successfully in Delhi. The National President in his address said the party will be the voice of the common people.",
                "category": "अधिवेशन",
                "image_url": "https://static.prod-images.emergentagent.com/jobs/922ef7bd-57eb-4f7e-b6bd-dba4d1fc641a/images/3e1f14e5d9f11b46627bb82763c40e76e3d931ab2bea546f2e36295a7806b80f.png",
                "published": True,
                "created_at": now_iso,
                "updated_at": now_iso,
            },
            {
                "id": str(uuid.uuid4()),
                "title_hi": "किसानों के अधिकारों के लिए विशाल रैली",
                "title_en": "Massive Rally for Farmers' Rights",
                "excerpt_hi": "लखनऊ में किसानों के हक़ में आयोजित रैली में लाखों किसानों ने भाग लिया।",
                "excerpt_en": "Lakhs of farmers participated in the rally organised in Lucknow for farmers' rights.",
                "content_hi": "बुलंद भारत पार्टी ने लखनऊ में किसानों के अधिकारों के लिए एक विशाल रैली का आयोजन किया। पार्टी ने न्यूनतम समर्थन मूल्य की कानूनी गारंटी की माँग की।",
                "content_en": "Buland Bharat Party organised a massive rally in Lucknow for farmers' rights. The party demanded legal guarantee of Minimum Support Price.",
                "category": "रैली",
                "image_url": "https://images.unsplash.com/photo-1709545900940-f86b833d5704?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmbGFnJTIwd2F2aW5nfGVufDB8fHx8MTc3OTQ1MjE2N3ww&ixlib=rb-4.1.0&q=85",
                "published": True,
                "created_at": now_iso,
                "updated_at": now_iso,
            },
            {
                "id": str(uuid.uuid4()),
                "title_hi": "युवाओं के लिए रोज़गार अभियान शुरू",
                "title_en": "Employment Campaign for Youth Launched",
                "excerpt_hi": "पार्टी ने 'भारत के युवा, भारत का भविष्य' अभियान का शुभारंभ किया।",
                "excerpt_en": "The party launched 'Youth of India, Future of India' campaign.",
                "content_hi": "बेरोज़गारी के विरुद्ध बुलंद भारत पार्टी ने एक राष्ट्रव्यापी अभियान की शुरुआत की है जिसमें कौशल विकास, स्टार्टअप सहायता और सरकारी भर्ती में पारदर्शिता की माँग शामिल है।",
                "content_en": "Buland Bharat Party has started a nationwide campaign against unemployment which includes skill development, startup assistance and transparency in government recruitment.",
                "category": "अभियान",
                "image_url": "https://images.unsplash.com/photo-1760872645959-98d5fdb49287?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBwYXJsaWFtZW50JTIwYnVpbGRpbmd8ZW58MHx8fHwxNzc5NDUyMTY3fDA&ixlib=rb-4.1.0&q=85",
                "published": True,
                "created_at": now_iso,
                "updated_at": now_iso,
            },
        ])
        logger.info("Seeded 3 initial news articles")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
