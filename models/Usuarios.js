import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../database/config.js";
const { DataTypes } = Sequelize;

const Usuarios = sequelize.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      trim: true,
      required: true,
    },
    imagen: DataTypes.STRING,
    descripcion: {
      type: DataTypes.TEXT,
    },

    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      required: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    activo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    token: DataTypes.STRING,
    expiracion: DataTypes.DATE,
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(10),
          null
        );
      },
    },
  }
);
//comparar password
Usuarios.prototype.validarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

(async () => {
  await sequelize.sync();
})();

export default Usuarios;
