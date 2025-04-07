const fs = require("fs").promises;
const path = require("path");

const productosPath = path.join(__dirname, "../data", "productos.json");

const getProductos = async () => {
  try {
    const data = await fs.readFile(productosPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    throw new Error("Error al leer el archivo de productos");
  }
};

const getProductoById = async (id) => {
  const productos = await getProductos();
  return productos.find((producto) => producto.id === id);
};

const saveProductos = async (productos) => {
  try {
    await fs.writeFile(
      productosPath,
      JSON.stringify(productos, null, 2),
      "utf-8"
    );
  } catch (err) {
    throw new Error("Error al escribir en el archivo de productos");
  }
};

const addProducto = async (nuevoProducto) => {
  const productos = await getProductos();
  const newId = Date.now().toString();
  nuevoProducto.id = newId;
  productos.push(nuevoProducto);
  await saveProductos(productos);
  return nuevoProducto;
};

const updateProducto = async (id, updatedProducto) => {
  const productos = await getProductos();
  const index = productos.findIndex((producto) => producto.id === id);
  if (index !== -1) {
    productos[index] = { ...productos[index], ...updatedProducto };
    await saveProductos(productos);
    return productos[index];
  }
  return null;
};

const deleteProducto = async (id) => {
  const productos = await getProductos();
  const newProductos = productos.filter((producto) => producto.id !== id);
  await saveProductos(newProductos);
  return newProductos;
};

module.exports = {
  getProductos,
  getProductoById,
  addProducto,
  updateProducto,
  deleteProducto,
};
