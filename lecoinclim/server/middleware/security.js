"use strict";

const crypto = require("crypto");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

/**
 * Generates a fresh CSP nonce per request and exposes it as res.locals.cspNonce
 * so the HTML template can attach it to <script>/<style> tags. This lets us
 * drop 'unsafe-inline' from the Content-Security-Policy entirely.
 */
function nonceMiddleware(req, res, next) {
  res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
  next();
}

/**
 * Helmet configuration. Built as a factory so it can read SITE_URL from env
 * at boot time (after dotenv has loaded).
 */
function buildHelmet() {
  return helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:"],
        styleSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
        scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
        fontSrc: ["'self'"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: process.env.NODE_ENV === "production" ? [] : null
      }
    },
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "no-referrer" },
    hsts: process.env.NODE_ENV === "production"
      ? { maxAge: 15552000, includeSubDomains: true, preload: false }
      : false
  });
}

/* ===================== RATE LIMITERS ===================== */

// Generous default for read-only browsing of the API/catalog.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes, merci de réessayer dans quelques minutes." }
});

// Tight limiter for endpoints that write data or could be abused for spam/enumeration.
const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Merci de réessayer plus tard ou de nous écrire directement." }
});

// Very tight limiter for the admin surface.
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de requêtes administrateur." }
});

/**
 * Simple API-key auth for the admin routes. Because the credential travels
 * as a custom request header (never as an ambient cookie), it is not
 * exploitable via CSRF: a third-party page cannot make the browser attach
 * this header on the attacker's behalf.
 */
function requireAdmin(req, res, next) {
  const provided = req.get("x-admin-key") || "";
  const expected = process.env.ADMIN_API_KEY || "";

  if (!expected || expected === "change-moi-avec-une-longue-cle-aleatoire") {
    return res.status(503).json({ error: "Administration désactivée : ADMIN_API_KEY non configurée sur le serveur." });
  }

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  const same = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!same) {
    return res.status(401).json({ error: "Non autorisé." });
  }
  next();
}

module.exports = {
  nonceMiddleware,
  buildHelmet,
  apiLimiter,
  writeLimiter,
  adminLimiter,
  requireAdmin
};
