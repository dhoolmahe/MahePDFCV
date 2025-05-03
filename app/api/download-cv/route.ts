import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import https from "https";

async function sendPushNotification() {
  const params = new URLSearchParams({
    token: process.env.PUSHOVER_APP_TOKEN!,
    user: process.env.PUSHOVER_USER_KEY!,
    title: "Mahe CV Downloaded",
    message: "Your CV was just downloaded from the Vercel website.",
  });

  return fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.CV_DOWNLOAD_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Trigger push
  await sendPushNotification();

  // Serve PDF
  const filePath = path.join(process.cwd(), "public", "cv.pdf");
  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=MahendranVisvanathan-CV.pdf",
    },
  });
}
