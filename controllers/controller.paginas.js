import Sequelize from "sequelize";
import moment from "moment";
import Categorias from "../models/Categorias.js";
import Grupos from "../models/Grupos.js";
import Meetis from "../models/Meeti.js";
import Usuarios from "../models/Usuarios.js";
const { Op } = Sequelize;

const inicioPagina = async (req, res) => {
  const categorias = await Categorias.findAll({});
  const meetis = await Meetis.findAll({
    attributes: ["titulo", "slug", "fecha", "hora"],
    where: {
      fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") },
    },
    limit: 3,
    order: [["fecha", "ASC"]],
    include: [
      {
        model: Grupos,
        attributes: ["imagen"],
      },
      {
        model: Usuarios,
        attributes: ["nombre", "imagen"],
      },
    ],
  });

  console.log("cuantoas hay", meetis.length);
  console.log(meetis);

  res.render("inicio", {
    nombrePagina: "Inicio",
    categorias,
    meetis,
    moment,
  });
};

const panelAdministracion = async (req, res, next) => {
  //const grupos = await Grupos.findAll({ where: { UsuarioId: req.user.id } });
  //const meetis = await Meetis.findAll({ where: { UsuarioId: req.user.id } });
  const [grupos, meetis, anteriores] = await Promise.all([
    Grupos.findAll({ where: { UsuarioId: req.user.id } }),
    Meetis.findAll({
      where: {
        UsuarioId: req.user.id,
        fecha: { [Op.gte]: moment(new Date()).format("YYYY-MM-DD") },
      },
      order: [["fecha", "ASC"]],
    }),
    Meetis.findAll({
      where: {
        UsuarioId: req.user.id,
        fecha: { [Op.lt]: moment(new Date()).format("YYYY-MM-DD") },
      },
    }),
  ]);

  res.render("administracion", {
    nombrePagina: "Panel de Administracion",
    grupos,
    meetis,
    anteriores,
    moment,
  });
};
//buscar Mettis
const resultadoBusqueda = async (req, res) => {

  const { categoria, titulo, ciudad, pais } = req.query;
  let query;
  if (categoria === "") {
    query = "";
  } else {
    query = ` where: {
          CategoriumId: { [Op.eq]: ${categoria} },
        }`;
  }
  //filtrar los meetis por los terminos de busqueda
  // filtrar los meetis por los terminos de busqueda
  const meetis = await Meetis.findAll({
    where: {
      titulo: { [Op.iLike]: `%${titulo}%` },
      ciudad: { [Op.iLike]: `%${ciudad}%` },
      pais: { [Op.iLike]: `%${pais}%` },
    },
    include: [
      {
        model: Grupos,
        query,
      },
      {
        model: Usuarios,
        attributes: ["id", "nombre", "imagen"],
      },
    ],
  });
  console.log(meetis);
  console.log(req.query);

  //pasar los resultados de la busqueda
  res.render("busqueda", {
    nombrePagina: "Resultado de Busqueda",
    meetis,
    moment,
  });
};

export { inicioPagina, panelAdministracion, resultadoBusqueda };
