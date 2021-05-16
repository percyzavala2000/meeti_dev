import passport from "passport";
import { Strategy } from "passport-local";
//referencia al modelo donde vamos autenticar
import Usuarios from "../models/Usuarios.js";

//local strategy -Logn con credenciales propios(usuario y contraseña)
passport.use(
  new Strategy(
    //por default passport espera un usuario y password
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: { email, activo: 1 },
        });
        //el usuario existe,password incorrecto
        if (!usuario.validarPassword(password)) {
          return done(null, false, {
            message: "Password Incorrecto",
          });
        }
        //el imael existe y el password es correcto
        return done(null, usuario);
      } catch (error) {
        //ese usuario no existe
        return done(null, false, { message: "Esta cuenta no existe" });
      }
    }
  )
);
// Serializar el Usuario
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

//deserializar el usuario
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

export default passport;
