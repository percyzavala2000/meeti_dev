import flash from "connect-flash";
import Sequelize from "sequelize";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Grupos from "../models/Grupos.js";
import Meetis from "../models/Meeti.js";
import Usuarios from "../models/Usuarios.js";
import Categorias from "../models/Categorias.js";
import Comentarios from "../models/Comentarios.js";
const { fn, col, literal,Op } = Sequelize;

const formNuevoMeeti = async (req, res) => {
  const grupos = await Grupos.findAll({ where: { UsuarioId: req.user.id } });

  res.render("nuevo-meeti", {
    nombrePagina: "Crear Nuevo Meeti",
    grupos,
  });
};

const crearMeeti = async (req, res) => {
  //obtener los datos
  const meeti = req.body;
  //asignar el usuario
  meeti.UsuarioId = req.user.id;
  meeti.GrupoId = meeti.grupoId;
  //almacena la ubicacion con un point
  const point = {
    type: "Point",
    coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)],
  };
  meeti.ubicacion = point;
  //cupo adicional
  if (meeti.cupo === "") {
    meeti.cupo = 0;
  }
  meeti.id = uuidv4();

  //almacenar BD
  try {
    await Meetis.create(meeti);
    req.flash("success", "Se a creado el metti correctamente");
    res.redirect("/administracion");
  } catch (error) {
    console.log(error);
    req.flash("error", error);
    res.redirect("/nuevo-meeti");
  }
};

const formEditarMeeti = async (req, res, next) => {
  const consultas = [];
  consultas.push(Grupos.findAll({ where: { UsuarioId: req.user.id } }));
  consultas.push(Meetis.findByPk(req.params.id));
  const [grupos, meetis] = await Promise.all(consultas);

  if (!grupos || !meetis) {
    req.flash("error", "Operacion no valida");
    res.redirect("/administracion");
    return next();
  }

  res.render("editar-meeti", {
    nombrePagina: `Editar Meeti: ${meetis.titulo}`,
    grupos,
    meetis,
  });
};
//guardar cambios de meeti
const editarMeeti = async (req, res) => {
  const meetis = await Meetis.findOne({ where: { id: req.params.id } });
  if (!meetis) {
    req.flash("error", "Operacion no valida");
    res.redirect("/administracion");
    return next();
  }
  const {
    grupoId,
    titulo,
    invitado,
    fecha,
    hora,
    cupo,
    descripcion,
    direccion,
    ciudad,
    estado,
    pais,
    lat,
    lng,
  } = req.body;
  meetis.grupoId = grupoId;
  meetis.titulo = titulo;
  meetis.invitado = invitado;
  meetis.fecha = fecha;
  meetis.hora = hora;
  meetis.cupo = cupo;
  meetis.descripcion = descripcion;
  meetis.direccion = direccion;
  meetis.ciudad = ciudad;
  meetis.estado = estado;
  meetis.pais = pais;
  //asignar point (Ubicacion)

  const point = {
    type: "Point",
    coordinates: [parseFloat(lat), parseFloat(lng)],
  };
  meetis.ubicacion = point;
  //almacenar en la base de datos

  await meetis.save();

  req.flash("success", "Cambios guardado correctamente");
  res.redirect("/administracion");
};

const formEliminarMeeti = async (req, res, next) => {
  const meetis = await Meetis.findOne({
    where: { id: req.params.id, UsuarioId: req.user.id },
  });
  if (!meetis) {
    req.flash("error", "Operacion no valida");
    res.redirect("/administracion");
    return next();
  }
  //mostrar la vista
  res.render("eliminar-meeti", {
    nombrePagina: `Eliminar Meeti: ${meetis.titulo}`,
  });
};

const eliminarMeeti = async (req, res) => {
  await Meetis.destroy({
    where: { id: req.params.id },
  });

  req.flash("success", "Meeti Eliminado");
  res.redirect("/administracion");
};

const mostrarMetti = async (req, res) => {
  const meeti = await Meetis.findOne({
    where: {
      slug: req.params.slug,
    },
    include: [
      {
        model: Grupos,
      },
      {
        model: Usuarios,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });
  if (!meeti) {
    res.redirect("/");
  }
  //consultar Meetis cercanos
  const ubicacion = literal(
    `ST_GeomFromText('POINT(${meeti.ubicacion.coordinates[0]} ${meeti.ubicacion.coordinates[1]})')`
  );
  //ST_DISTANCE_Sphere= retorna una linea en metros
  const distancia = fn("ST_DistanceSphere", col("ubicacion"), ubicacion);

  //encontrar meetis cercanos
  const cercanos = await Meetis.findAll({
    order: distancia, //los ordena del mas cerca al lejano
    where: Sequelize.where(distancia, { [Op.lte]: 2000 }), //2 mil metros 2km
    limit: 3, //maximo 3
    offset: 1, //el primero donde estoy yo no lo traigas trae del segundo mas cercano
    include: [
      {
        model: Grupos,
      },
      {
        model: Usuarios,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });

  const comentarios = await Comentarios.findAll({
    where: { MeetiId: meeti.id },
    include: [{ model: Usuarios, attributes: ["id", "nombre", "imagen"] }],
  });

  //pasar resultado hacia la vista
  res.render("mostrar-meeti", {
    nombrePagina: meeti.titulo,
    meeti,
    comentarios,
    cercanos,
    moment,
  });
};
//confirma o cancela si el usuario asistira al meeti
const confirmarAsistencia = async (req, res) => {
  const { accion } = req.body;

  if (accion === "confirmar") {
    //agregar el usuario
    Meetis.update(
      { interesados: fn("array_append", col("interesados"), req.user.id) },
      { where: { slug: req.params.slug } }
    );
    //mensaje
    res.send("Has confirmado tu asistencia");
  } else {
    //cancelar la asistencia
    Meetis.update(
      { interesados: fn("array_remove", col("interesados"), req.user.id) },
      { where: { slug: req.params.slug } }
    );
    //mensaje
    res.send("Has Cancelado tu asistencia tu asistencia");
  }
};
//muestra el listado de asistentes
const mostrarAsistentes = async (req, res) => {
  const meetis = await Meetis.findOne({
    where: { slug: req.params.slug },
    attributes: ["interesados"],
  });
  //extraer interesados
  const { interesados } = meetis;
  const asistentes = await Usuarios.findAll({
    attributes: ["nombre", "imagen"],
    where: { id: interesados },
  });

  //crear la vista y pasar datos
  res.render("asistentes-meeti", {
    nombrePagina: "Listado de Asistentes Meeti",
    asistentes,
  });
};
//mostrar Meetis por Categoria

const mostrarCategorias = async (req, res) => {
  const categoria = await Categorias.findOne({
    attributes: ["id", "nombre"],
    where: { slug: req.params.categoria },
  });
  const meetis = await Meetis.findAll({
    order: [
      ["fecha", "ASC"],
      ["hora", "ASC"],
    ],
    include: [
      { model: Grupos, where: { CategoriumId: categoria.id } },
      { model: Usuarios },
    ],
  });

  res.render("categoria", {
    nombrePagina: `Categoria: ${categoria.nombre}`,
    meetis,
    moment,
  });
};

const agregarComentario = async (req, res, next) => {
  //obtener ccomentario
  const { comentario } = req.body;
  //crear comentario en la base de datos
  await Comentarios.create({
    mensaje: comentario,
    UsuarioId: req.user.id,
    MeetiId: req.params.id,
  });
  //resireccionar a la misma Pagina
  res.redirect("back");
  next();
};
//eliminar comentario del meeti
const eliminarComentario = async (req, res, next) => {
  //tomar el ID del comentarios
  const { comentarioId } = req.body;
  console.log(comentarioId);

  //Consultar el comentarios
  const comentario = await Comentarios.findOne({ where: { id: comentarioId } });

  //verificar si existe el comentarios
  if (!comentario) {
    res.status(404).send("Accion no valida");
    return next();
  }
  const meeti = await Meetis.findOne({ where: { id: comentario.MeetiId } });
  //verificar que quien lo borra sea el creador
  if (comentario.UsuarioId === req.user.id || meeti.UsuarioId === req.user.id) {
    await Comentarios.destroy({ where: { id: comentario.id } });
    res.status(200).send("Eliminado Correctamente");
    return next();
  } else {
    res.status(403).send("Accion no valida");
    return next();
  }
};

export {
  formNuevoMeeti,
  crearMeeti,
  formEditarMeeti,
  editarMeeti,
  formEliminarMeeti,
  eliminarMeeti,
  mostrarMetti,
  confirmarAsistencia,
  mostrarAsistentes,
  mostrarCategorias,
  agregarComentario,
  eliminarComentario,
};
