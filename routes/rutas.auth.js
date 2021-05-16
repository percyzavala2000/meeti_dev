import {Router} from 'express';
import {check} from 'express-validator';
import {
  formIniciarSesion,
  autenticarUsuario,
  cerrarSesion
} from "../controllers/controller.auth.js";
import validarCampo from '../middlewares/midd-validar-campo.js';
import verificarUsuario from '../middlewares/verificarUsuario.js';

const rutas=Router();

const rutasAuth=()=>{
    rutas.get("/iniciar-sesion", formIniciarSesion);
    rutas.post(
      "/iniciar-sesion",
      [
        check("email", "El correo no es valido").isEmail(),
        check("password", "el password no es valido").not().isEmpty(),
        validarCampo,
      ],
      autenticarUsuario
    );
    rutas.get("/cerrar-sesion", [verificarUsuario], cerrarSesion);
    return rutas;
}

export default rutasAuth;