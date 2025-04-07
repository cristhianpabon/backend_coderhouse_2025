const express = require("express");
const router = express.Router();
const dao = require("../dao/ProductManager");

router.get("/", async (req, res) => {
  try {
    const productos = await dao.getProductos();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const producto = await dao.getProductoById(pid);
    if (!producto) {
      res.status(404).json({ error: "Producto no encontrado" });
    } else {
      res.json(producto);
    }
  } catch (err) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  const nuevoProducto = req.body;
  try {
    if (
      !nuevoProducto.title ||
      !nuevoProducto.description ||
      !nuevoProducto.code ||
      !nuevoProducto.price ||
      !nuevoProducto.status ||
      !nuevoProducto.stock ||
      !nuevoProducto.category
    ) {
      return res.status(400).json({ error: "Faltan datos del producto" });
    }
    await dao.addProducto(nuevoProducto);
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const updatedProducto = req.body;
  try {
    const producto = await dao.updateProducto(pid, updatedProducto);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updatedProducto);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    await dao.deleteProducto(pid);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Error al borrar el producto" });
  }
});

module.exports = router;
