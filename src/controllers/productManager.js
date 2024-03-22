const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.path = path;
  }

  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const arrayProductos = await this.leerArchivo();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      if (arrayProductos.some((item) => item.code === code)) {
        console.log("El código debe ser único");
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
        category,
        status: true,
        thumbnails: thumbnails || [],
      };

      arrayProductos.push(newProduct);
      await this.guardarArchivo(arrayProductos);
      console.log("Producto agregado");
    } catch (error) {
      console.log("Error al agregar producto", error);
    }
  }

  async getProducts() {
    try {
      return await this.leerArchivo();
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProductos = await this.leerArchivo();
      const buscado = arrayProductos.find((item) => item.id === id);
      if (!buscado) {
        console.log("Producto no encontrado");
        return null;
      }
      console.log("Producto encontrado");
      return buscado;
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      return JSON.parse(respuesta);
    } catch (error) {
      console.log("Error al leer un archivo", error);
    }
  }

  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("Error al guardar el archivo", error);
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      let arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProductos[index] = {
          ...arrayProductos[index],
          ...productoActualizado,
        };
        await this.guardarArchivo(arrayProductos);
        console.log("Producto actualizado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }

  async deleteProduct(id) {
    try {
      let arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((item) => item.id === id);
      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
        console.log("Producto eliminado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;
