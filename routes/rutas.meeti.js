import { Router } from "express";
import { check } from "express-validator";
import { formNuevoMeeti, crearMeeti,formEditarMeeti, editarMeeti, formEliminarMeeti, eliminarMeeti, mostrarMetti, confirmarAsistencia, mostrarAsistentes, mostrarCategorias, agregarComentario, eliminarComentario } from "../controllers/controller.meeti.js";
import conectarFlash from "../middlewares/midd-connect-flash.js";
import validarCampo from "../middlewares/midd-validar-campo.js";
import verificarUsuario from "../middlewares/verificarUsuario.js";
const rutas = Router();

const rutasMetti = () => {
  rutas.get("/nuevo-meeti", [verificarUsuario], formNuevoMeeti);
  rutas.post(
    "/nuevo-meeti",
    [
      verificarUsuario,
      check("titulo", "Agrega un Titulo").notEmpty().escape(),
      check("descripcion", "Agrega una descripcion").notEmpty(),
      check("fecha", "Agrega una Fecha para metti").notEmpty().escape(),
      check("hora", "Agrega una hora para metti").notEmpty().escape(),
      check("ciudad", "Agrega una ciudad para metti").notEmpty().escape(),
      check("estado", "Agrega una estado para metti").notEmpty().escape(),
      check("pais", "Agrega una pais para metti").notEmpty().escape(),
      validarCampo
    ],
    crearMeeti
  );
  rutas.get('/editar-meeti/:id',[verificarUsuario],formEditarMeeti);
  rutas.post(
    "/editar-meeti/:id",
    [
      verificarUsuario,
      check("titulo", "Agrega un Titulo").notEmpty().escape(),
      check("descripcion", "Agrega una descripcion").notEmpty(),
      check("fecha", "Agrega una Fecha para metti").notEmpty().escape(),
      check("hora", "Agrega una hora para metti").notEmpty().escape(),
      check("ciudad", "Agrega una ciudad para metti").notEmpty().escape(),
      check("estado", "Agrega una estado para metti").notEmpty().escape(),
      check("pais", "Agrega una pais para metti").notEmpty().escape(),
      validarCampo,
    ],
    editarMeeti
    
  );
  rutas.get('/eliminar-meeti/:id',[verificarUsuario],formEliminarMeeti);
  rutas.post("/eliminar-meeti/:id", [verificarUsuario],eliminarMeeti);
  rutas.get('/meeti/:slug',mostrarMetti);
  rutas.post('/confirmar-asistencia/:slug',[verificarUsuario],confirmarAsistencia);
  rutas.get("/asistentes/:slug",mostrarAsistentes);
  //mostrar meetis agrupados por categoria
  rutas.get('/categorias/:categoria',mostrarCategorias);
  //commentarios en el meetis
  rutas.post('/meeti/:id',agregarComentario);
  //elimina comentarios en el meet
  rutas.post("/eliminar-comentario",eliminarComentario);


  
  
  return rutas;
};

export default rutasMetti;
