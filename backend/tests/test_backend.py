"""Backend API tests for Buland Bharat Party MVP."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://bharat-converter-hub.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@bulandbharat.in"
ADMIN_PASSWORD = "BulandBharat@2025"


@pytest.fixture(scope="session")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=20)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    data = r.json()
    assert "token" in data and data["token"]
    assert data["email"] == ADMIN_EMAIL
    assert data["role"] == "admin"
    return data["token"]


@pytest.fixture(scope="session")
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


# ----------- Auth -----------
class TestAuth:
    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrongpass!"}, timeout=15)
        assert r.status_code == 401

    def test_login_wrong_email(self):
        r = requests.post(f"{API}/auth/login", json={"email": "nope@bb.in", "password": ADMIN_PASSWORD}, timeout=15)
        assert r.status_code == 401

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me", timeout=15)
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        assert "_id" not in data
        assert "password_hash" not in data

    def test_me_invalid_token(self):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer invalid.token.xx"}, timeout=15)
        assert r.status_code == 401


# ----------- Membership -----------
class TestMembership:
    created_ids = []

    def test_create_membership_full(self):
        payload = {
            "name": "TEST_राहुल कुमार",
            "phone": "9876543210",
            "email": "TEST_rahul@example.com",
            "state": "उत्तर प्रदेश",
            "city": "Lucknow",
            "address": "Test address line",
            "age": 28,
            "occupation": "Engineer",
            "message": "जय हिंद!",
        }
        r = requests.post(f"{API}/membership", json=payload, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == payload["name"]
        assert data["phone"] == payload["phone"]
        assert data["state"] == payload["state"]
        assert data["city"] == payload["city"]
        assert data["age"] == 28
        assert "id" in data and data["id"]
        assert "created_at" in data
        assert "_id" not in data
        TestMembership.created_ids.append(data["id"])

    def test_create_membership_minimal(self):
        payload = {"name": "TEST_Minimal", "phone": "9000000001", "state": "Delhi", "city": "Delhi"}
        r = requests.post(f"{API}/membership", json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["email"] is None
        assert d["age"] is None
        TestMembership.created_ids.append(d["id"])

    def test_create_membership_invalid(self):
        r = requests.post(f"{API}/membership", json={"name": "X", "phone": "9", "state": "D", "city": "D"}, timeout=15)
        assert r.status_code == 422

    def test_list_without_auth(self):
        r = requests.get(f"{API}/membership", timeout=15)
        assert r.status_code == 401

    def test_list_with_auth(self, auth_headers):
        r = requests.get(f"{API}/membership", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        # The two we just inserted should be present
        ids = {i["id"] for i in items}
        for cid in TestMembership.created_ids:
            assert cid in ids
        # No _id leakage
        for item in items:
            assert "_id" not in item

    def test_count_public(self):
        r = requests.get(f"{API}/membership/count", timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert "count" in d
        assert isinstance(d["count"], int)
        assert d["count"] >= len(TestMembership.created_ids)


# ----------- News -----------
class TestNews:
    created_news_id = None

    def test_list_news_public(self):
        r = requests.get(f"{API}/news", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 3, "Expected at least 3 seeded news articles"
        for item in items:
            assert "_id" not in item
            assert "title_hi" in item and "title_en" in item
            assert item["published"] is True

    def test_get_news_by_id(self):
        r = requests.get(f"{API}/news", timeout=15)
        items = r.json()
        nid = items[0]["id"]
        r2 = requests.get(f"{API}/news/{nid}", timeout=15)
        assert r2.status_code == 200
        assert r2.json()["id"] == nid

    def test_get_news_404(self):
        r = requests.get(f"{API}/news/{uuid.uuid4()}", timeout=15)
        assert r.status_code == 404

    def test_create_news_requires_auth(self):
        r = requests.post(f"{API}/news", json={
            "title_hi": "X", "title_en": "X", "excerpt_hi": "X", "excerpt_en": "X",
            "content_hi": "X", "content_en": "X"
        }, timeout=15)
        assert r.status_code == 401

    def test_create_news_admin(self, auth_headers):
        payload = {
            "title_hi": "TEST_परीक्षण समाचार",
            "title_en": "TEST_Sample News",
            "excerpt_hi": "परीक्षण के लिए",
            "excerpt_en": "For testing",
            "content_hi": "विस्तृत सामग्री",
            "content_en": "Detailed content here",
            "category": "टेस्ट",
            "image_url": "https://example.com/img.png",
            "published": True,
        }
        r = requests.post(f"{API}/news", json=payload, headers=auth_headers, timeout=15)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["title_hi"] == payload["title_hi"]
        assert "id" in d
        assert "_id" not in d
        TestNews.created_news_id = d["id"]

    def test_update_news_admin(self, auth_headers):
        assert TestNews.created_news_id
        r = requests.put(f"{API}/news/{TestNews.created_news_id}",
                         json={"title_en": "TEST_Updated"}, headers=auth_headers, timeout=15)
        assert r.status_code == 200
        assert r.json()["title_en"] == "TEST_Updated"
        # Verify persisted via GET
        g = requests.get(f"{API}/news/{TestNews.created_news_id}", timeout=15)
        assert g.json()["title_en"] == "TEST_Updated"

    def test_update_news_requires_auth(self):
        r = requests.put(f"{API}/news/{TestNews.created_news_id or 'x'}",
                         json={"title_en": "x"}, timeout=15)
        assert r.status_code == 401

    def test_delete_news_admin(self, auth_headers):
        assert TestNews.created_news_id
        r = requests.delete(f"{API}/news/{TestNews.created_news_id}", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        # Verify removed
        g = requests.get(f"{API}/news/{TestNews.created_news_id}", timeout=15)
        assert g.status_code == 404

    def test_delete_news_requires_auth(self):
        r = requests.delete(f"{API}/news/{uuid.uuid4()}", timeout=15)
        assert r.status_code == 401


# ----------- Leaders -----------
class TestLeaders:
    def test_list_leaders(self):
        r = requests.get(f"{API}/leaders", timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        assert len(items) >= 4
        for it in items:
            assert "_id" not in it
            assert "name_hi" in it and "role_hi" in it


# ----------- Contact -----------
class TestContact:
    def test_create_contact_public(self):
        payload = {
            "name": "TEST_Contact",
            "email": "TEST_contact@example.com",
            "phone": "9000000099",
            "subject": "Test subject",
            "message": "Hello, this is a test message.",
        }
        r = requests.post(f"{API}/contact", json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d.get("ok") is True
        assert "id" in d

    def test_list_contact_requires_auth(self):
        r = requests.get(f"{API}/contact", timeout=15)
        assert r.status_code == 401

    def test_list_contact_admin(self, auth_headers):
        r = requests.get(f"{API}/contact", headers=auth_headers, timeout=15)
        assert r.status_code == 200
        items = r.json()
        assert isinstance(items, list)
        for it in items:
            assert "_id" not in it
