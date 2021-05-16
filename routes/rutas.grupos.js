import { Router } from "express";
import { check } from "express-validator";
import {
  formNuevoGrupo,
  crearGrupo,
  formEditarGrupo,
  editarGrupo,
  formEditarImagen,
  editarImagen,
  formEliminarGrupo,
  eliminarGrupo,
  mostrarGrupo,
} from "../controllers/controller.grupos.js";
import validarArchivoSubir from "../middlewares/midd-validar-archivo.js";
import validarCampo from "../middlewares/midd-validar-campo.js";
import verificarUsuario from "../middlewares/verificarUsuario.js";

const rutas = Router();

const rutasGrupos = () => {
  rutas.get("/nuevo-grupo",[verificarUsuario], formNuevoGrupo);
  rutas.post(
    "/nuevo-grupo",
    [
      verificarUsuario,
      check("nombre", "El nombre es obligarorio").notEmpty().escape(),
      check("descripcion", "La descripcion es necesario").notEmpty(),
      check("categoria", "La categoria es necesario").notEmpty(),
      validarArchivoSubir,
      validarCampo,
    ],
    crearGrupo
  );
  rutas.get("/editar-grupo/:grupoId", [verificarUsuario], formEditarGrupo);
  rutas.post("/editar-grupo/:grupoId", [verificarUsuario], editarGrupo);
  rutas.get("/imagen-grupo/:grupoId", [verificarUsuario], formEditarImagen);
  rutas.post(
    "/imagen-grupo/:grupoId",
    [verificarUsuario, validarArchivoSubir],
    editarImagen
  );
  rutas.get("/eliminar-grupo/:grupoId", [verificarUsuario], formEliminarGrupo);
  rutas.post("/eliminar-grupo/:grupoId", [verificarUsuario], eliminarGrupo);
  //mostrar los grupos en formtend
  rutas.get("/grupos/:id",mostrarGrupo);


  return rutas;
};

export default rutasGrupos;
