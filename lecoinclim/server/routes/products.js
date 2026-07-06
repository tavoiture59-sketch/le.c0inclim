"use strict";

const express = require("express");
const { param } = require("express-validator");
const validate = require("../middleware/validate");

module.exports = function productsRouter(productCatalog) {
  const router = express.Router();

  // GET /api/products — full catalog (used to render the product grid)
  router.get("/", (req, res) => {
    res.json({ products: productCatalog.list() });
  });

  // GET /api/products/:id — single product (used by the product modal)
  router.get(
    "/:id",
    [param("id").isString().trim().isLength({ min: 1, max: 80 }).matches(/^[a-z0-9-]+$/)],
    validate,
    (req, res) => {
      const product = productCatalog.get(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Produit introuvable." });
      }
      res.json({ product });
    }
  );

  return router;
};
