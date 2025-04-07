const express = require('express');
const router = express.Router();
const carritoDao = require('../dao/CartManager');
const productosDao = require('../dao/ProductManager');

router.post('/', async (req, res) => {
  try {
    const nuevoCarrito = await carritoDao.createCarrito();
    res.status(201).json(nuevoCarrito);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const carrito = await carritoDao.getCarritoById(cid);
    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(carrito.products);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const producto = await productosDao.getProductoById(pid);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const carrito = await carritoDao.addProductToCarrito(cid, pid);

    if (!carrito) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.status(200).json(carrito.products);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
});

module.exports = router;