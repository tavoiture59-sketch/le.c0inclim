"use strict";

const express = require("express");
const { body } = require("express-validator");
const validate = require("../middleware/validate");
const mailer = require("../utils/mailer");

module.exports = function contactRouter(messagesStore) {
  const router = express.Router();

  router.post(
    "/",
    [
      body("name").isString().trim().isLength({ min: 2, max: 100 }).escape(),
      body("email").isString().trim().isEmail().normalizeEmail().isLength({ max: 200 }),
      body("message").isString().trim().isLength({ min: 5, max: 2000 }).escape(),
      body("website").optional({ checkFalsy: true }).isString()
    ],
    validate,
    async (req, res) => {
      const { name, email, message, website } = req.body;

      if (website) {
        // Bot trap: acknowledge without storing or emailing anything.
        return res.status(200).json({ ok: true });
      }

      const entry = { name, email, message, createdAt: new Date().toISOString() };
      await messagesStore.update((list) => {
        list.push(entry);
        return list;
      });

      mailer
        .sendMail({
          to: process.env.NOTIFY_TO || process.env.CONTACT_EMAIL_FALLBACK,
          subject: `Message du site — ${name}`,
          text: `De: ${name} <${email}>\n\n${message}`
        })
        .catch(() => {});

      res.status(200).json({ ok: true });
    }
  );

  return router;
};
