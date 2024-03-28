const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

// Iniciar servidor HTTP
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto: ${PUERTO}`);
});

// Configuración de Socket.io
const io = socket(httpServer);
const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager("./src/models/productos.json");

// Manejo de eventos de Socket.io
io.on("connection", async (socket) => {
  console.log("Un cliente se ha conectado");

  // Enviar array de productos al cliente cuando se conecta
  socket.emit("productos", await productManager.getProducts());

  // Manejar evento "eliminarProducto"
  socket.on("eliminarProducto", async (id) => {
    await productManager.deleteProduct(id);
    // Enviar array de productos actualizado a todos los clientes
    io.sockets.emit("productos", await productManager.getProducts());
  });

  // Manejar evento "agregarProducto"
  socket.on("agregarProducto", async (producto) => {
    await productManager.addProduct(producto);
    // Enviar array de productos actualizado a todos los clientes
    io.sockets.emit("productos", await productManager.getProducts());
  });
});
