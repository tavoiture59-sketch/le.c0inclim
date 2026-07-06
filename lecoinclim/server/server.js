"use strict";

require("dotenv").config();

const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const { nonceMiddleware, buildHelmet, apiLimiter, writeLimiter } = require("./middleware/security");
const JsonStore = require("./utils/jsonStore");
const productCatalog = require("./utils/productCatalog");

const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const contactRouter = require("./routes/contact");
const adminRouter = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const INDEX_TEMPLATE_PATH = path.join(PUBLIC_DIR, "index.html");

// Behind a reverse proxy (Nginx/Render/Heroku...) in production, trust the
// first proxy hop so req.ip / req.secure and rate limiting behave correctly.
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const ordersStore = new JsonStore(path.join(__dirname, "data", "orders.json"), []);
const messagesStore = new JsonStore(path.join(__dirname, "data", "messages.json"), []);

/* ===================== CORE SECURITY MIDDLEWARE ===================== */
app.use(nonceMiddleware);
app.use(buildHelmet());
app.disable("x-powered-by");

app.use(
  cors({
    origin: process.env.SITE_URL || true,
    methods: ["GET", "POST", "PATCH"],
    credentials: false
  })
);

app.use(compression());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Keep request bodies small — this is a catalog/order form, not a file upload endpoint.
app.use(express.json({ limit: "15kb" }));
app.use(express.urlencoded({ extended: false, limit: "15kb" }));

/* ===================== STATIC ASSETS ===================== */
// Serve everything except index.html directly (images, /js/app.js, favicon...).
// index.html itself is templated below so we can inject a per-request CSP nonce.
app.use(
  express.static(PUBLIC_DIR, {
    index: false,
    dotfiles: "deny",
    setHeaders: (res, filePath) => {
      if (/\.(jpg|jpeg|png|webp|svg|ico)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=604800, immutable");
      }
    }
  })
);

/* ===================== API ROUTES ===================== */
app.use("/api/products", apiLimiter, productsRouter(productCatalog));
app.use("/api/orders", writeLimiter, ordersRouter(productCatalog, ordersStore));
app.use("/api/contact", writeLimiter, contactRouter(messagesStore));
app.use("/api/admin", adminRouter(ordersStore, messagesStore));

app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

/* ===================== HTML (nonce injection) ===================== */
let indexTemplate = null;
function getIndexTemplate() {
  // Cache in production, always re-read in dev so edits show up without a restart.
  if (indexTemplate && process.env.NODE_ENV === "production") return indexTemplate;
  indexTemplate = fs.readFileSync(INDEX_TEMPLATE_PATH, "utf8");
  return indexTemplate;
}

function renderIndex(nonce) {
  return getIndexTemplate()
    .replace(/<script(?![^>]*\bsrc=)/g, `<script nonce="${nonce}"`)
    .replace(/<style(?!\snonce)/g, `<style nonce="${nonce}"`)
    .replace(/<script (?=src=)/g, `<script nonce="${nonce}" `);
}

app.get(["/", "/index.html"], (req, res) => {
  res.type("html").send(renderIndex(res.locals.cspNonce));
});

/* ===================== 404 + ERROR HANDLING ===================== */
app.use((req, res) => {
  if (req.path.startsWith("/api/")) return res.status(404).json({ error: "Route API introuvable." });
  res.status(404).type("html").send(renderIndex(res.locals.cspNonce));
});

// Centralized error handler — never leak stack traces to the client.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[error]", err);
  if (err.type === "entity.too.large") {
    return res.status(413).json({ error: "Requête trop volumineuse." });
  }
  res.status(err.status || 500).json({ error: "Une erreur est survenue. Merci de réessayer." });
});

app.listen(PORT, () => {
  console.log(`Le CoinClim server listening on http://localhost:${PORT} (${process.env.NODE_ENV || "development"})`);
});

module.exports = app;
