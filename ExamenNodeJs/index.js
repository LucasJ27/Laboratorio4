const fs = require("fs");
const readline = require("readline");
const yargs = require("yargs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const argv = yargs.option("file", {
  alias: "f",
  describe: "Nombre del archivo JSON donde se guardaran los datos",
  type: "string",
  default: "productos.json",
}).argv;

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer));
  });
};

(async () => {
  try {
    const producto = await question("Ingrese el nombre del producto: ");
    const precio = await question("Ingrese el precio del producto: ");
    const cantidad = await question("Ingrese la cantidad de unidades: ");

    const nuevoProducto = {
      nombre: producto,
      precio: parseFloat(precio),
      cantidad: parseInt(cantidad),
    };

    let productos;

    if (fs.existsSync(argv.file)) {
      const data = fs.readFileSync(argv.file, "utf-8");
      productos = JSON.parse(data);
    } else {
      console.log(
        `El archivo "${argv.file}" no existe. Se creo uno nuevo.`
      );
      productos = [];

      fs.writeFileSync(
        argv.file,
        JSON.stringify(productos, null, 2),
        "utf-8"
      );
      console.log(`Archivo "${argv.file}" creado correctamente.`);
    }

    productos.push(nuevoProducto);

    fs.writeFileSync(argv.file, JSON.stringify(productos, null, 2), "utf-8");

    console.log(`\nProducto agregado correctamente a "${argv.file}"`);
  } catch (error) {
    console.error("Ocurrió un error:", error);
  } finally {
    rl.close();
  }
})();
