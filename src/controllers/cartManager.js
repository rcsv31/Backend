const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.ultId = 0;
    this.cargarCarritos();
  }

  async cargarCarritos() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
      this.ultId = this.carts.reduce(
        (maxId, cart) => Math.max(maxId, cart.id),
        0
      );
    } catch (error) {
      console.log("Error al cargar los carritos: ", error);
      await this.guardarCarritos();
    }
  }

  async guardarCarritos() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.log("Error al guardar los carritos: ", error);
    }
  }

  async crearCarrito() {
    const nuevoCarrito = {
      id: ++this.ultId,
      products: [],
    };
    this.carts.push(nuevoCarrito);
    await this.guardarCarritos();
    return nuevoCarrito;
  }

  async getCarritoById(carritoId) {
    return this.carts.find((c) => c.id === carritoId);
  }

  async agregarProductoAlCarrito(carritoId, productoId, quantity = 1) {
    const carrito = await this.getCarritoById(carritoId);
    const existeProducto = carrito.products.find(
      (p) => p.product === productoId
    );
    if (existeProducto) {
      existeProducto.quantity += quantity;
    } else {
      carrito.products.push({ product: productoId, quantity });
    }
    await this.guardarCarritos();
    return carrito;
  }
}

module.exports = CartManager;
