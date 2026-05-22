import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const PARTY_LOGO = "https://customer-assets.emergentagent.com/job_bharat-converter-hub/artifacts/mqpq57l9_image.png";

export const HERO_CROWD_IMG = "https://static.prod-images.emergentagent.com/jobs/922ef7bd-57eb-4f7e-b6bd-dba4d1fc641a/images/3e1f14e5d9f11b46627bb82763c40e76e3d931ab2bea546f2e36295a7806b80f.png";
export const ASHOKA_TEXTURE = "https://static.prod-images.emergentagent.com/jobs/922ef7bd-57eb-4f7e-b6bd-dba4d1fc641a/images/31d76fdea4b4b55d50d783ca9cfde9c7df152d55ad43aaa53f66a2ef9f92f178.png";
export const LEADER_PLACEHOLDER = "https://static.prod-images.emergentagent.com/jobs/922ef7bd-57eb-4f7e-b6bd-dba4d1fc641a/images/4b59e1adacff8c9c82bbf7968ce3c4238ad3f7dd9ed13c2df5262d4e68a078bc.png";
export const FLAG_IMG = "https://images.unsplash.com/photo-1709545900940-f86b833d5704?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBmbGFnJTIwd2F2aW5nfGVufDB8fHx8MTc3OTQ1MjE2N3ww&ixlib=rb-4.1.0&q=85";
export const PARLIAMENT_IMG = "https://images.unsplash.com/photo-1760872645959-98d5fdb49287?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBwYXJsaWFtZW50JTIwYnVpbGRpbmd8ZW58MHx8fHwxNzc5NDUyMTY3fDA&ixlib=rb-4.1.0&q=85";

export const formatApiError = (err) => {
  const detail = err?.response?.data?.detail;
  if (!detail) return err?.message || "Network error";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e?.msg ? e.msg : JSON.stringify(e))).join(" ");
  return String(detail);
};
