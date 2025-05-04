import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

// async function sendPushNotification() {
//   const params = new URLSearchParams({
//     token: process.env.PUSHOVER_APP_TOKEN!,
//     user: process.env.PUSHOVER_USER_KEY!,
//     title: "Mahe CV Downloaded",
//     message: "Your CV was just downloaded from the Vercel website.",
//   });

//   return fetch("https://api.pushover.net/1/messages.json", {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: params,
//   });
// }

async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    }
  );

  if (!res.ok) {
    console.error("Telegram notification failed", await res.text());
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== process.env.CV_DOWNLOAD_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Trigger push
  //await sendPushNotification();
  await sendTelegramNotification("Your CV was downloaded!");

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
