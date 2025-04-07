const express = require("express");
const bodyParser = require("body-parser");
const productsRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");
const app = express();

app.use(bodyParser.json());

app.get("/health", (req, res) => {
  res.status(200).send("todo ok!");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
