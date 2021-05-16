import { v4 as uuidv4 } from "uuid";
import moment from 'moment';
import cargaArchivo from "../helpers/help-subirArchivos.js";
import Categorias from "../models/Categorias.js";
import Grupos from "../models/Grupos.js";
import flash from "connect-flash";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Meetis from "../models/Meeti.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const formNuevoGrupo = async (req, res) => {
  const categorias = await Categorias.findAll();

  res.render("nuevo-grupo", {
    nombrePagina: "Crea un nuevo grupo",
    categorias,
  });
};

const crearGrupo = async (req, res) => {
  console.log(req.files);
  //funcion para subir archivos
  const imagenes = await cargaArchivo(req.files, undefined, "grupos");
  console.log("crear grupo", req.user);

  const grupo = req.body;
  //almacena el usuario autenticado
  grupo.UsuarioId = req.user.id;
  grupo.CategoriumId = req.body.categoria;
  grupo.imagen = imagenes;
  grupo.id=uuidv4();

  try {
    //almacenar en la bd
    await Grupos.create(grupo);
    //flash mensje y redireccionar
    req.flash("success", "Se ha Creado el grupo correctamente");
    res.redirect("/administracion");
  } catch (error) {
    console.log(error);
    req.flash("error", "Error al crearse");
    res.redirect("/nuevo-grupo");
  }
};

const formEditarGrupo = async (req, res) => {
  const grupo = await Grupos.findByPk(req.params.grupoId);
  const categorias = await Categorias.findAll();

  res.render("editar-grupo", {
    nombrePagina: `Editar Grupo : ${grupo.nombre}`,
    grupo,
    categorias,
  });
};

const editarGrupo = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: {
      id: req.params.grupoId,
      UsuarioId: req.user.id,
    },
  });
  if (!grupo) {
    req.flash("error", "operacion no valida"), res.redirect("/administracion");
    return next();
  }
  //todo bien leer los valores
  const { nombre, descripcion, categoria, url } = req.body;
  //asignar valores
  grupo.nombre = nombre;
  grupo.descripcion = descripcion;
  grupo.CategoriumId = categoria;
  grupo.url = url;
  //guardar en la base de datos
  await grupo.save();
  req.flash("success", "Cambios almacenados correctamente");
  res.redirect("/administracion");
};
// muestra el forrmulario para editar imagende grupo
const formEditarImagen = async (req, res) => {
  const grupo = await Grupos.findOne({
    where: {
      id: req.params.grupoId,
      UsuarioId: req.user.id,
    },
  });
  console.log(grupo.imagen);

  res.render("imagen-grupo", {
    nombrePagina: `Editar Imagen Grupo: ${grupo.nombre}`,
    grupo,
  });
};
// modifica la imagen en la bd y elimina el anterior
const editarImagen = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: {
      id: req.params.grupoId,
      UsuarioId: req.user.id,
    },
  });

  if (!grupo) {
    req.flash("error", "operacion no valida");
    res.redirect("/iniciar-sesion");
    return next();
  }
  //verificar que el archiivo anterior
  if (req.files && grupo.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
    console.log(imagenAnteriorPath);
    //eliminar archivo cn file system
    if (fs.existsSync(imagenAnteriorPath)) {
      fs.unlinkSync(imagenAnteriorPath);
    }
  }

  const imagenes = await cargaArchivo(req.files, undefined, "grupos");
  //si hay imagen nueva la guardamos
  if (imagenes) {
    grupo.imagen = imagenes;
  }
  //guardar en la BD
  await grupo.save();

  req.flash("success", "cambios almacenados Correctamente");
  res.redirect("/administracion");
};

const formEliminarGrupo = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: {
      id: req.params.grupoId,
      UsuarioId: req.user.id,
    },
  });

  if (!grupo) {
    req.flash("error", "operacion no valida");
    res.redirect("/iniciar-sesion");
    return next();
  }
  //todo bien ejecutar la vista
  res.render("eliminar-grupo", {
    nombrePagina: `Eliminar Grupo: ${grupo.nombre}`,
  });
};

//eliminar el grupo e imagen
const eliminarGrupo = async (req, res, next) => {
  const grupo = await Grupos.findOne({
    where: {
      id: req.params.grupoId,
      UsuarioId: req.user.id,
    },
  });

  if (!grupo) {
    req.flash("error", "operacion no valida");
    res.redirect("/iniciar-sesion");
    return next();
  }
  //si hay una imagen elimina
  if (grupo.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/grupos/${grupo.imagen}`;
    //eliminar archivo cn file system
    if (fs.existsSync(imagenAnteriorPath)) {
      fs.unlinkSync(imagenAnteriorPath);
    }
  }
  //eliminar grupo
  await Grupos.destroy({
    where: {
      id: req.params.grupoId,
    },
  });

  //redireccionar al admin
  req.flash("success", "Grupo Eliminado");
  res.redirect("/administracion");
};

const mostrarGrupo= async (req, res, next)=>{
  const grupo = await Grupos.findOne({where:{id:req.params.id}});
  const meetis= await Meetis.findAll({where:{GrupoId:req.params.id},order:[['fecha','ASC']]});

  if (!grupo) {
    req.flash("error", "operacion no valida");
    res.redirect("/");
    return next();
  }
  //mostrar la vista
  res.render("mostrar-grupo",{
    nombrePagina:`Informacion Grupo: ${grupo.nombre}`,
    grupo,
    meetis,
    moment

  })


}

export {
  formNuevoGrupo,
  crearGrupo,
  formEditarGrupo,
  editarGrupo,
  formEditarImagen,
  editarImagen,
  formEliminarGrupo,
  eliminarGrupo,
  mostrarGrupo
};
