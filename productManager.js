const fs = require("fs");
const fileProducts = "./fileProducts.json";

class ProductManager {
  static ultId = 0;

  constructor() {
    this.path = fileProducts;
    this.products = this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts() {
    fs.writeFile(this.path, JSON.stringify(this.products, null, 2), (err) => {
      if (err) {
        console.error("Error al guardar los productos:", err);
      }
    });
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
    this.saveProducts();
  }

  getProductById(id) {
    const product = this.products.find((item) => item.id === id);

    if (product) {
      console.log(product);
    } else {
      console.log("Producto encontrado.");
    }
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedFields };
      this.saveProducts();
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
      this.saveProducts();
    } else {
      console.log("Producto no existe.");
    }
  }
}

//Testing:
//1) Se creará una instancia de la clase “ProductManager”

const manager = new ProductManager();

//2) Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

console.log(manager.getProducts());

//3) Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25

manager.addProduct(
  "producto prueba",
  "este es un producto prueba",
  200,
  "sin imagen",
  "123456",
  25
);

//El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

//4)Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log(manager.getProducts());

//Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
manager.getProductById(1);
manager.getProductById(5);

//Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
manager.updateProduct(1, { title: "producto prueba 2" });
console.log(manager.getProducts());

//Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
manager.deleteProduct(5);
manager.deleteProduct(1);
console.log(manager.getProducts());
