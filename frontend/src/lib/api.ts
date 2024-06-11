export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://jeff-app-backend.vercel.app"
    : "http://192.168.1.152:8000";
