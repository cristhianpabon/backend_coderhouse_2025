const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");

const productsRouter = require("./routes/product.router");
const cartRouter = require("./routes/cart.router");

const {
  getProductos,
  addProducto,
  deleteProducto,
} = require("./dao/ProductManager");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", handlebars.engine({
  defaultLayout: "main", 
  layoutsDir: path.join(__dirname, "views", "layouts")
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.get("/health", (req, res) => {
  res.status(200).send("todo ok!");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.get("/home", async (req, res) => {
  try {
    const productos = await getProductos();
    res.render("home", { productos });
  } catch (error) {
    res.status(500).send("Error al obtener los productos");
  }
});

app.get("/realtimeproducts", async (req, res) => {
  try {
    const productos = await getProductos();
    res.render("realTimeProducts", { productos });
  } catch (error) {
    res.status(500).send("Error al obtener los productos");
  }
});

io.on("connection", async (socket) => {
  console.log("Socket conectado");

  socket.emit("productosActualizados", await getProductos());

  socket.on("nuevoProducto", async (producto) => {
    await addProducto(producto);
    io.emit("productosActualizados", await getProductos());
  });

  socket.on("eliminarProducto", async (id) => {
    await deleteProducto(id);
    io.emit("productosActualizados", await getProductos());
  });

  socket.on("disconnect", () => {
    console.log("Socket desconectado");
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});