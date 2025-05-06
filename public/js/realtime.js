const socket = io();

const productList = document.getElementById("product-list");
const productForm = document.getElementById("product-form");
const deleteForm = document.getElementById("delete-form");

function renderProducts(products) {
  productList.innerHTML = "";
  products.forEach((currentProduct) => {
    const li = document.createElement("li");
    li.textContent = `id: ${currentProduct.id} - ${currentProduct.title} -  ${currentProduct.description} -$${currentProduct.price}`;
    productList.appendChild(li);
  });
}

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(productForm));
  socket.emit("nuevoProducto", data);
  productForm.reset();
});

deleteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = new FormData(deleteForm).get("id");
  socket.emit("eliminarProducto", id);
  deleteForm.reset();
});

socket.on("productosActualizados", renderProducts);
