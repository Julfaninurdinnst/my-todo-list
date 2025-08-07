import axios from "axios";

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
