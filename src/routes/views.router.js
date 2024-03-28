const express = require("express");
const ProductManager = require("../controllers/productManager.js");
const router = express.Router();
const productManager = new ProductManager("./src/models/productos.json");
router.get("/", async (req, res) => {
  try {
    const productos = await productManager.getProducts();

    res.render("home", { productos });
  } catch (error) {
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});
module.exports = router;
