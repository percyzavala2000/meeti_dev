import Sequelize from "sequelize";
import sequelize from "../database/config.js";
import slug from "slug";
import shortid from "shortid";
import Usuarios from "./Usuarios.js";
import Grupos from "./Grupos.js";

const { DataTypes, UUID,DATEONLY,GEOMETRY,ARRAY } = Sequelize;

const Meetis = sequelize.define(
  "Meeti",
  {
    id: {
      type: UUID,
      primaryKey: true,
      allowNull: false,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
    },
    invitado: DataTypes.STRING,
    cupo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fecha: {
      type: DATEONLY, // desifra solo el año 01-12-2021
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ubicacion: {
      type: GEOMETRY("POINT"),
    },
    interesados: {
      type: ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
  },
  {
    hooks: {
      async beforeCreate(meeti) {
        const url = slug(meeti.titulo).toLowerCase();
        meeti.slug = `${url}-${shortid.generate()}`;
      },
    },
  }
);

Meetis.belongsTo(Usuarios);
Meetis.belongsTo(Grupos);
(async () => {
  await sequelize.sync();
})();

export default Meetis;
