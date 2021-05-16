import {Sequelize} from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.NOMBRE_DB, process.env.USER_NOMBRE,process.env.PASS,{
    host:process.env.HOST,
    dialect:'postgres',
    //logging:false,
   /*  define:{
        timestamps:false
    } */
});



export default sequelize;