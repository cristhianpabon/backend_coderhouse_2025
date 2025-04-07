const fs = require('fs').promises;
const path = require('path');

const carritoPath = path.join(__dirname, '../data', 'carrito.json');

const getCarritos = async () => {
  try {
    const data = await fs.readFile(carritoPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error('Error al leer el archivo de carritos');
  }
};

const saveCarritos = async (carritos) => {
  try {
    await fs.writeFile(carritoPath, JSON.stringify(carritos, null, 2), 'utf-8');
  } catch (err) {
    throw new Error('Error al escribir en el archivo de carritos');
  }
};

const createCarrito = async () => {
  const carritos = await getCarritos();
  const newId = Date.now().toString();
  const nuevoCarrito = { id: newId, products: [] };
  carritos.push(nuevoCarrito);
  await saveCarritos(carritos);
  return nuevoCarrito;
};

const getCarritoById = async (id) => {
  const carritos = await getCarritos();
  return carritos.find(carrito => carrito.id === id);
};

const addProductToCarrito = async (cid, pid) => {
  const carritos = await getCarritos();
  const carrito = carritos.find(c => c.id === cid);
  if (!carrito) return null;
  const productIndex = carrito.products.findIndex(p => p.product === pid);
  if (productIndex !== -1) {
    carrito.products[productIndex].quantity += 1;
  } else {
    carrito.products.push({ product: pid, quantity: 1 });
  }

  await saveCarritos(carritos);
  return carrito;
};

module.exports = {
  createCarrito,
  getCarritoById,
  addProductToCarrito
};