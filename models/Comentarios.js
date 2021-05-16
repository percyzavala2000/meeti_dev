import Sequelize from 'sequelize';
import sequelize from '../database/config.js';
import Meetis from './Meeti.js';
import Usuarios from './Usuarios.js';
const {DataTypes}=Sequelize;

const Comentarios=sequelize.define('Comentario',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    mensaje:DataTypes.TEXT
},{
    timestamps:false
});

Comentarios.belongsTo(Usuarios);
Comentarios.belongsTo(Meetis);
(async () => {
  await sequelize.sync();
})();

export default Comentarios;
