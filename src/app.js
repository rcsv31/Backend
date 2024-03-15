const express = require("express");
const fs = require("fs").promises; // Importar fs con promesas

const fileProducts = "./products.json";
const PUERTO = 8080;

class ProductManager {
  static ultId = 0;

  constructor() {
    this.path = fileProducts;
    this.products = [];
    this.loadProducts(); // Llamar a la carga de productos en el constructor
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf8"); // Utilizar await para la lectura del archivo
      this.products = JSON.parse(data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2)); // Utilizar await para la escritura del archivo
      console.log("Productos guardados correctamente.");
    } catch (error) {
      console.error("Error al guardar los productos:", error);
    }
  }

  getProducts() {
    return this.products;
  }

  addProduct(title, description, price, img, code, stock) {
    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios.");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("El código debe ser único.");
      return;
    }

    const newProduct = {
      id: ++ProductManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    this.products.push(newProduct);
    this.saveProducts(); // Guardar productos después de agregar uno nuevo
  }

  getProductById(id) {
    const product = this.products.find((item) => item.id === id);

    if (product) {
      return product; // Retornar el producto encontrado
    } else {
      return null; // Retornar null si el producto no se encuentra
    }
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts(); // Guardar productos después de actualizar
      console.log("Producto actualizado correctamente.");
    } else {
      console.log("Producto no encontrado.");
    }
  }

  deleteProduct(id) {
    const updatedProducts = this.products.filter(
      (product) => product.id !== id
    );

    if (updatedProducts.length < this.products.length) {
      this.products = updatedProducts;
      this.saveProducts(); // Guardar productos después de eliminar
      console.log("Producto eliminado correctamente.");
    } else {
      console.log("Producto no existe.");
    }
  }
}

const app = express();

const productManager = new ProductManager();

app.get("/products/", (req, res) => {
  let limit = req.query.limit;
  console.log(typeof limit);
  if (limit) {
    limit = parseInt(limit);
    res.send(productManager.getProducts().slice(0, limit));
  } else {
    res.send(productManager.getProducts());
  }
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const producto = productManager.getProductById(parseInt(id));
  if (producto) {
    res.send(producto);
  } else {
    res.send("No se encontró el producto");
  }
});

app.listen(PUERTO, () => {
  console.log(`Servidor Express funcionando en el http://localhost:${PUERTO}`);
});

//Testing

//•Se instalarán las dependencias a partir del comando npm install
//•Se echará a andar el servidor
//*Se revisará que el archivo YA CUENTE CON AL MENOS DIEZ PRODUCTOS CREADOS al momento de su entrega, es importante para que los tutores no tengan que crear los productos por sí mismos, y así agilizar el proceso de tu evaluación.
//*Se corroborará que el servidor esté corriendo en el puerto 8080.
console.log(`Servidor Express funcionando en el puerto ${PUERTO}`);
//•Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.
//•Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos.
//•Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.
//•Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.
