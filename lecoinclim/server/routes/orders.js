"use strict";

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const { genOrderRef } = require("../utils/orderRef");
const mailer = require("../utils/mailer");

const DELIVERY_FLAT = 35;

module.exports = function ordersRouter(productCatalog, ordersStore) {
  const router = express.Router();

  router.post(
    "/",
    [
      body("name").isString().trim().isLength({ min: 2, max: 100 }).escape(),
      body("email").isString().trim().isEmail().normalizeEmail().isLength({ max: 200 }),
      body("address").isString().trim().isLength({ min: 5, max: 300 }).escape(),
      body("phone").optional({ checkFalsy: true }).isString().trim().isLength({ max: 30 }).escape(),
      body("items").isArray({ min: 1, max: 20 }),
      body("items.*.id").isString().trim().isLength({ min: 1, max: 80 }).matches(/^[a-z0-9-]+$/),
      body("items.*.qty").isInt({ min: 1, max: 20 }).toInt(),
      // Honeypot: a real visitor never fills this hidden field. Any value here means a bot.
      body("website").optional({ checkFalsy: true }).isString()
    ],
    validate,
    async (req, res) => {
      const { name, email, address, phone, items, website } = req.body;

      if (website) {
        // Silently pretend success to the bot without creating an order or leaking info.
        return res.status(201).json({ ref: genOrderRef(), total: 0, honeypot: true });
      }

      // Never trust client-submitted prices/names: resolve every line against the catalog.
      const resolvedItems = [];
      for (const line of items) {
        const product = productCatalog.get(line.id);
        if (!product) {
          return res.status(400).json({ error: `Produit inconnu : ${line.id}` });
        }
        if (product.stockQty < line.qty) {
          return res.status(409).json({ error: `Stock insuffisant pour "${product.name}".` });
        }
        resolvedItems.push({ id: product.id, name: product.name, price: product.price, qty: line.qty });
      }

      // Reserve stock now that we know every line is valid.
      for (const line of resolvedItems) {
        productCatalog.reserveStock(line.id, line.qty);
      }

      const subtotal = resolvedItems.reduce((sum, l) => sum + l.price * l.qty, 0);
      const total = subtotal + DELIVERY_FLAT;
      const ref = genOrderRef();

      const order = {
        ref,
        name,
        email,
        address,
        phone: phone || null,
        items: resolvedItems,
        subtotal,
        delivery: DELIVERY_FLAT,
        total,
        status: "En attente de virement",
        createdAt: new Date().toISOString()
      };

      await ordersStore.update((list) => {
        list.push(order);
        return list;
      });

      const bank = {
        iban: process.env.BANK_IBAN || "FR76 0000 0000 0000 0000 0000 000",
        bic: process.env.BANK_BIC || "EXAMPLEXXX",
        holder: process.env.BANK_HOLDER || "LE COINCLIM SAS"
      };

      mailer
        .sendMail({
          to: process.env.NOTIFY_TO || process.env.CONTACT_EMAIL_FALLBACK,
          subject: `Nouvelle commande — ${ref}`,
          text: `Commande ${ref}\nClient: ${name} <${email}>\nAdresse: ${address}\nArticles: ${resolvedItems
            .map((l) => `${l.name} x${l.qty}`)
            .join(", ")}\nTotal: ${total.toFixed(2)} €`
        })
        .catch(() => {
          /* Non-blocking: order is already saved even if notification email fails. */
        });

      res.status(201).json({ ref, subtotal, delivery: DELIVERY_FLAT, total, bank });
    }
  );

  return router;
};
