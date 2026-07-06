"use strict";

const express = require("express");
const { param, body } = require("express-validator");
const validate = require("../middleware/validate");
const { requireAdmin, adminLimiter } = require("../middleware/security");

const ALLOWED_STATUSES = ["En attente de virement", "Paiement reçu", "Expédiée", "Annulée"];

module.exports = function adminRouter(ordersStore, messagesStore) {
  const router = express.Router();

  router.use(adminLimiter, requireAdmin);

  router.get("/orders", async (req, res) => {
    const orders = await ordersStore.read();
    res.json({ orders });
  });

  router.get("/messages", async (req, res) => {
    const messages = await messagesStore.read();
    res.json({ messages });
  });

  router.patch(
    "/orders/:ref/status",
    [
      param("ref").isString().trim().matches(/^CC-[A-Z0-9]{8}$/),
      body("status").isString().trim().isIn(ALLOWED_STATUSES)
    ],
    validate,
    async (req, res) => {
      let found = false;
      const updated = await ordersStore.update((list) => {
        return list.map((o) => {
          if (o.ref === req.params.ref) {
            found = true;
            return { ...o, status: req.body.status };
          }
          return o;
        });
      });
      if (!found) return res.status(404).json({ error: "Commande introuvable." });
      const order = updated.find((o) => o.ref === req.params.ref);
      res.json({ order });
    }
  );

  return router;
};
