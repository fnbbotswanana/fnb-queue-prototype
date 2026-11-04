// Cloudflare Worker: relays booking confirmations to Twilio (SMS + WhatsApp).
// Secrets (Settings > Variables): TWILIO_SID, TWILIO_TOKEN
// Variables: SMS_FROM (your Twilio number, e.g. +1555...), WA_FROM (Twilio WhatsApp sender, sandbox: +14155238886), ALLOWED_ORIGIN (https://<username>.github.io)
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("POST only", { status: 405, headers: cors });
    if (env.ALLOWED_ORIGIN && req.headers.get("Origin") !== env.ALLOWED_ORIGIN)
      return new Response("Forbidden", { status: 403, headers: cors });
    let b;
    try { b = await req.json(); } catch { return new Response("Bad JSON", { status: 400, headers: cors }); }
    const to = String(b.to || ""), body = String(b.body || "").slice(0, 320), ch = String(b.channel || "SMS");
    if (!/^\+\d{8,15}$/.test(to) || !body.includes("FNB Botswana"))
      return new Response("Invalid request", { status: 400, headers: cors });
    const send = (from, dest) => fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(env.TWILIO_SID + ":" + env.TWILIO_TOKEN),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: from, To: dest, Body: body }),
      });
    const jobs = [];
    if (ch.includes("SMS")) jobs.push(send(env.SMS_FROM, to));
    if (ch.includes("WhatsApp")) jobs.push(send("whatsapp:" + env.WA_FROM, "whatsapp:" + to));
    const res = await Promise.all(jobs);
    return new Response(JSON.stringify({ ok: res.every(r => r.ok) }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  },
};
