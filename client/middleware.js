const BOT =
  /googlebot|google-inspectiontool|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|whatsapp|pinterest|discordbot|applebot/i;

export const config = {
  matcher: ["/", "/index.html"],
};

export default function middleware(request) {
  const ua = request.headers.get("user-agent") || "";
  if (!BOT.test(ua)) return;
  return fetch("https://retro-store.onrender.com/", {
    headers: {
      "user-agent": ua,
      accept: request.headers.get("accept") || "text/html",
    },
  });
}
