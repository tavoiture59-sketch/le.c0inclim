"use strict";

const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "products.json");

function loadRaw() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const items = JSON.parse(raw);
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("products.json est vide ou invalide.");
  }
  return items;
}

function decorate(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  const stock =
    p.stockQty <= 0 ? "Rupture de stock" : p.stockQty >= 5 ? "5+ in stock" : `${p.stockQty} en stock`;
  return { ...p, discount, stock };
}

class ProductCatalog {
  constructor() {
    this._byId = new Map();
    this.reload();
  }

  reload() {
    const items = loadRaw().map(decorate);
    this._byId = new Map(items.map((p) => [p.id, p]));
  }

  list() {
    return Array.from(this._byId.values());
  }

  get(id) {
    return this._byId.get(id) || null;
  }

  /** Returns true and decrements stock if enough is available; false otherwise. */
  reserveStock(id, qty) {
    const p = this._byId.get(id);
    if (!p || p.stockQty < qty) return false;
    p.stockQty -= qty;
    p.stock = p.stockQty <= 0 ? "Rupture de stock" : p.stockQty >= 5 ? "5+ in stock" : `${p.stockQty} en stock`;
    return true;
  }
}

module.exports = new ProductCatalog();
