import path from "path";
import { v4 as uuidv4 } from "uuid";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const cargaArchivo = (
  files,
  extensionesPermitidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { imagen } = files;
    const nombreCortado = imagen.name.split(".");

    const extension = nombreCortado[nombreCortado.length - 1];
    //validar extensiones permitidas
    //const extensionesPermitidas = ["png", "jpg", "jpeg", "gif"];
    if (!extensionesPermitidas.includes(extension)) {
      return reject(
        `La extensio ${extension} no esta permitido ${extensionesPermitidas}`
      );
    }

    const nombreTemp = uuidv4() + "." + extension; // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

    const uploadPath = path.join(__dirname, "../public/uploads/", carpeta, nombreTemp);

    imagen.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve(nombreTemp);
    });
  });
};

export default cargaArchivo;
