import express from 'express';
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from 'cors';
import fileUpload from 'express-fileupload';
import flash from 'connect-flash';
import rutasUsuario from '../routes/rutas.usuario.js';
import expressLayouts from 'express-ejs-layouts';
import sequelize from '../database/config.js';
import rutasAuth from '../routes/rutas.auth.js';
import rutasPaginas from '../routes/rutas.paginas.js';
import rutasGrupos from '../routes/rutas.grupos.js';
import passport from '../database/passport.js';
import conectarFlash from '../middlewares/midd-connect-flash.js';
import path from 'path';
import { dirname } from "path";
import { fileURLToPath } from "url";
import rutasMetti from '../routes/rutas.meeti.js';
const __dirname = dirname(fileURLToPath(import.meta.url));

class Servidor {
  constructor() {
    this.app = express();
    this.host=process.env.HOST ||'0.0.0.0';
    this.port = process.env.PORT || 4000;
    this.conectarBD();
    this.middlewares();
    this.vistasEjs();
    this.configure();
    this.app.use(conectarFlash);
    this.routers();
    this.listen();
  }
  async conectarBD() {
    try {
      await sequelize.authenticate();
      console.log("La canexion exitosa base de datos");
    } catch (error) {
      console.log("Fallo en conectar base de datos", error);
    }
  }
  middlewares() {
    this.app.use(cors());
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    //FileUpload -Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }
  configure() {
    this.app.use(flash());
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: process.env.SECRETO,
        resave: true,
        saveUninitialized: true,
      })
    );
    this.passportInicio();
  }
  passportInicio() {
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }
  vistasEjs() {
    this.app.use(expressLayouts);
    this.app.set("view engine", "ejs");
    this.app.set("views", path.join( __dirname, "../views"));
  }
  routers() {
    this.app.use("/auth", rutasAuth());
    this.app.use("/", rutasPaginas());
    this.app.use("/", rutasUsuario());
    this.app.use('/',rutasMetti());
    this.app.use("/", rutasGrupos());
  }

  listen() {
    this.app.listen(this.port,this.host, () => {
      console.log("Se Conecto el Servidor al puerto", this.port);
    });
  }
};

export default Servidor;