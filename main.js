class ProductManager {
  constructor() {
    this.products = [];
    this.ultId = 0;
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("El código ya existe");
      return;
    }

    const newProduct = {
      id: ++this.ultId,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
  }

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    const product = this.products.find((item) => item.id === id);

    if (product) {
      console.log(product);
    } else {
      console.log("Producto no encontrado");
    }
  }
}
//Testing
//• Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager();
//• Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(manager.getProducts());
//• Se llamará al método “addProduct” con los campos:
//title:producto prueba”
//description:”Este es un producto prueba”
//price:200,
//thumbnail:”Sin imagen”
//code:”abc123”,
//stock:25
manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
//• El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

// • Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
manager.addProduct(
  "Sello de Lacre",
  "Descripcion de sello de lacre",
  35.7,
  "Sin imagen",
  "lac25",
  13
);

manager.addProduct(
  "Sello Automático 4912",
  "Descripcion de sello automático 4912",
  28.5,
  "Sin imagen",
  "sa4912",
  1
);

manager.addProduct(
  "Sello Automático 4913",
  "Descripcion de sello automático 4913",
  32,
  "Sin imagen",
  "sa4913"
);

console.log(manager.getProducts());

//• Se llamará al método “addProduct” con los mismos campos de arriba, debe arrojar un error porque el código estará repetido.
manager.addProduct(
  "Sello Automático 4912",
  "Descripcion de sello automático 4912",
  28.5,
  "Sin imagen",
  "sa4912",
  13
);
console.log(manager.getProducts());

//• Se evaluará que getProductById devuelva error si no encuentra el producto o el producto en caso de encontrarlo
manager.getProductsById(1);
manager.getProductsById(8);
