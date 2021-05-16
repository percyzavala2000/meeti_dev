
import { Router} from 'express';
import {check} from 'express-validator';
import {
  formCrearCuenta,
  crearCuenta,
  confirmarCuenta,
  formEditarPerfilUsuario,
  editarPerfil,
  formCambiarPassword,
  cambiarPassword,
  formImagenPerfil,
  agregarImagenPerfil,
  mostrarUsuarios,
} from "../controllers/controller.usuario.js";
import {
  verificaEmail,
  verificaConfirmar,
} from "../helpers/help-validar-campos.js";
import validarArchivoSubir from '../middlewares/midd-validar-archivo.js';
import validarCampo from '../middlewares/midd-validar-campo.js';
import verificarUsuario from '../middlewares/verificarUsuario.js';
const rutas=Router();

const rutasUsuario=()=>{
  rutas.get("/crear-cuenta", formCrearCuenta);
  rutas.post(
    "/crear-cuenta",
    [
      check("nombre", "El nombre es Obligatorio").not().isEmpty().escape(),
      check("email", "El correo no es valido").isEmail(),
      check("email").custom(verificaEmail),
      check(
        "password",
        "La contraseña debe tener mas de 3 caracteres"
      ).isLength({ min: 3 }),
      check("repetir", "No debe ir vacio confirmar contraseña")
        .custom(verificaConfirmar)
        .notEmpty(),
      validarCampo,
    ],
    crearCuenta
  );
  rutas.get("/confirmar-cuenta/:correo", confirmarCuenta);
  rutas.get("/editar-perfil", [verificarUsuario], formEditarPerfilUsuario);
  rutas.post(
    "/editar-perfil",
    [
      verificarUsuario,
      check("nombre", "El nombre es Obligatorio").not().isEmpty().escape(),
      check("email", "El correo no es valido").isEmail(),
      check("descripcion").escape(),
      validarCampo,
    ],
    editarPerfil
  );
  rutas.get("/cambiar-password", [verificarUsuario], formCambiarPassword);
  rutas.post("/cambiar-password", [verificarUsuario], cambiarPassword);
  rutas.get("/imagen-perfil", [verificarUsuario], formImagenPerfil);
  rutas.post(
    "/imagen-perfil",
    [verificarUsuario, validarArchivoSubir],
    agregarImagenPerfil
  );
  //mustra perfiles en el frontend
  rutas.get("/usuarios/:id",mostrarUsuarios);

  return rutas;
};

export default rutasUsuario;