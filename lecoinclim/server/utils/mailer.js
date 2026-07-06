"use strict";

const nodemailer = require("nodemailer");

let transporter = null;
let configured = false;

function init() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
    configured = true;
  }
}
init();

/**
 * Sends an email if SMTP is configured; otherwise resolves to {sent:false}
 * so callers can fall back to "we recorded your request" messaging instead
 * of throwing. Never throws on missing config — only on real send failures
 * when SMTP *is* configured (so misconfiguration is visible in logs).
 */
async function sendMail({ to, subject, text }) {
  if (!configured) return { sent: false, reason: "smtp-not-configured" };
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Le CoinClim <no-reply@lecoinclim.fr>",
    to,
    subject,
    text
  });
  return { sent: true };
}

module.exports = { sendMail, isConfigured: () => configured };
