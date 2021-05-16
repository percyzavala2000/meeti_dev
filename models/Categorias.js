
import Sequelize from 'sequelize';
import sequelize from '../database/config.js';
const {DataTypes} =Sequelize;

const Categorias=sequelize.define('Categoria',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    nombre:DataTypes.TEXT,
    slug:DataTypes.TEXT
},{
  timestamps:false
}
);

(async () => {
  await sequelize.sync();
})();
export default Categorias;