import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// Reverse-geocode using Nominatim (OpenStreetMap)
async function getAddress(lat: string, lng: string) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          // Nominatim requires a proper User-Agent
          "User-Agent": "Mahendran-CV-App/1.0 (your_email@example.com)",
        },
      }
    );

    if (!res.ok) {
      console.error("Nominatim request failed:", res.status, res.statusText);
      return "Unknown address";
    }

    const data = await res.json();
    console.log("Nominatim response:", data); // Debug: check returned address

    const address = data.address || {};
    const road = address.road || address.pedestrian || "";
    const city = address.city || address.town || address.village || "";
    const country = address.country || "";

    // If nothing found, fallback
    if (!road && !city && !country) return "Unknown address";

    return `${road ? road + ", " : ""}${city ? city + ", " : ""}${country}`;
  } catch (err) {
    console.error("Failed to get address:", err);
    return "Unknown address";
  }
}

async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });

  if (!res.ok) {
    console.error("Telegram notification failed", await res.text());
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.CV_DOWNLOAD_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get coordinates from query params
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  let location = "Unknown location";

  if (lat && lng) {
    location = await getAddress(lat, lng);
  }

  console.log(`CV downloaded - Location: ${location}`); // Debug

  // Send Telegram notification
  await sendTelegramNotification(`📥 Hey Mahe ,Your CV was Downloaded!\nLocation: ${location}`);

  // Serve PDF
  const filePath = path.join(process.cwd(), "public", "cv.pdf");
  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(new Uint8Array(fileBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=MahendranVisvanathan-CV.pdf",
    },
  });
}
