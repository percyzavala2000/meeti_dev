
import {Router} from 'express'
import { inicioPagina, panelAdministracion, resultadoBusqueda } from '../controllers/controller.paginas.js';
import verificarUsuario from '../middlewares/verificarUsuario.js';



const rutas= Router();

const rutasPaginas=()=>{
    rutas.get("/", inicioPagina);
    rutas.get( "/administracion",[verificarUsuario], panelAdministracion );
    //añade busqueda
    rutas.get('/busqueda',resultadoBusqueda);

    return rutas;
}

export default rutasPaginas;