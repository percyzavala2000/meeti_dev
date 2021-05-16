
import Sequelize from 'sequelize';
import sequelize from '../database/config.js';
import Categorias from './Categorias.js';
import Usuarios from './Usuarios.js';
const {DataTypes,UUID}=Sequelize;

const Grupos = sequelize.define("Grupo", {
  id: {
    type: UUID,
    primaryKey:true,
    allowNull:false,
    
  },
  nombre:{
      type:DataTypes.TEXT(100),
      allowNull:false
  },
  descripcion:{
      type:DataTypes.TEXT,
      allowNull:false

  },
  url:DataTypes.TEXT,
  imagen:DataTypes.TEXT

});
Grupos.belongsTo(Categorias);
Grupos.belongsTo(Usuarios);

(async () => {
  await sequelize.sync();
})();

export default Grupos;

