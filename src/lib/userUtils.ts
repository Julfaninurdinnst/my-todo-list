import axios from "axios";

// Get user name (dummy, bisa ambil dari auth nanti)
export function getUserName(): string {
  return "julfani nurdin";
}

// Get location (pakai ipinfo)
export async function getLocation(): Promise<string> {
  try {
    const res = await axios.get(
      `https://ipinfo.io/json?token=${import.meta.env.VITE_IPINFO_TOKEN}`
    );
    const data = res.data;
    if (data.city && data.region && data.country) {
      return `${data.city}, ${data.region}, ${data.country}`;
    }
    return "Unknown Location";
  } catch {
    return "Unknown Location";
  }
}

// Get current time
export function getCurrentTime(): string {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Get current date
export function getCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
