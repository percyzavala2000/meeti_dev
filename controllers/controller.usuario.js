import Usuarios from "../models/Usuarios.js";
import enviar from "../handlers/handlers.email.js";
import flash from "connect-flash";
import bcrypt from "bcrypt";
import fs from 'fs';
import cargaArchivo from "../helpers/help-subirArchivos.js";
import Grupos from "../models/Grupos.js";

const formCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    nombrePagina: "Crear cuenta",
  });
};

const crearCuenta = async (req, res, next) => {
  const usuario = req.body;

  const usuarios = await Usuarios.create(usuario);
  if (!usuarios) return next();
  //enviar email de confirmacion
  const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

  await enviar({
    usuario,
    url,
    subject: "Confirma tu cuenta de Metti",
    archivo: "confirmar-cuenta",
  });

  //flash mensje y redireccionar
  req.flash("success", "Hemos enviado un Email Comfirma tu cuenta");
  res.redirect("auth/iniciar-sesion");
};

const confirmarCuenta = async (req, res, next) => {
  //verificar que el usuario existe
  const usuario = await Usuarios.findOne({
    where: { email: req.params.correo },
  });
  console.log(usuario);

  //si no existe redireccionar
  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/crear-cuenta");
    return next();
  }
  //si existe confirmar
  usuario.activo = 1;
  await usuario.save();
  req.flash("success", "La cuenta se ha confirmado, ya puedes iniciar sesion");
  res.redirect("/auth/iniciar-sesion");
};

const formEditarPerfilUsuario = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  res.render("editar-perfil", {
    nombrePagina: `Editar Perfil`,
    usuario,
  });
};

const editarPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  //leer datos del formulario
  const { nombre, descripcion, email } = req.body;
  usuario.nombre = nombre;
  usuario.descripcion = descripcion;
  usuario.email = email;
  await usuario.save();
  req.flash("success", "Campos guardados Correctamente");
  res.redirect("/administracion");
};

const formCambiarPassword = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  res.render("cambiar-password", {
    nombrePagina: `Cambiar Password de :${usuario.nombre}`,
    usuario,
  });
};

const cambiarPassword = async (req, res, next) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  //verifica el password
  const { anterior, password } = req.body;
  const validarPass = bcrypt.compareSync(anterior, usuario.password);

  if (!validarPass) {
    req.flash("error", "No es valido el password actual");
    res.redirect("/cambiar-password");
    return next();
  }
  //Encripta la contraseña
  const saltoRondas = 10;
  const pass = password;
  const salt = bcrypt.genSaltSync(saltoRondas);
  const hash = bcrypt.hashSync(pass, salt);
  usuario.password = hash;
  await usuario.save();
  req.logout();
  req.flash(
    "success",
    "Se cambio Correctamente el Password, Vuelve a iniciar Sesion"
  );
  res.redirect("/auth/iniciar-sesion");
};

const formImagenPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  res.render("imagen-perfil", {
    nombrePagina: `Subir Imagen en perfil de: :${usuario.nombre}`,
    usuario,
  });
};

const agregarImagenPerfil = async (req, res, next) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/auth/iniciar-sesion");
    return next();
  }

  //verificar que el archiivo anterior
  if (req.files && usuario.imagen) {
    const imagenAnteriorPath =
      __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;
    console.log(imagenAnteriorPath);
    //eliminar archivo cn file system
    if (fs.existsSync(imagenAnteriorPath)) {
      fs.unlinkSync(imagenAnteriorPath);
    }
  }

  const imagenes = await cargaArchivo(req.files, undefined, "perfiles");
  //si hay imagen nueva la guardamos
  if (imagenes) {
    usuario.imagen = imagenes;
  }
  //guardar en la BD
  await usuario.save();

  req.flash("success", "cambios almacenados Correctamente");
  res.redirect("/administracion");
};

const mostrarUsuarios=async (req,res,next)=>{

  const usuario=await Usuarios.findOne({where:{id:req.params.id}});
  const grupos=await Grupos.findAll({where:{UsuarioId:req.params.id}});

  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.redirect("/auth/iniciar-sesion");
    return next();
  };
  //mostar la vista
  res.render('mostrar-perfil',{
    nombrePagina:`Perfil Usuarui : ${usuario.nombre}`,
    usuario,
    grupos
  })

}

export {
  formCrearCuenta,
  crearCuenta,
  confirmarCuenta,
  formEditarPerfilUsuario,
  editarPerfil,
  formCambiarPassword,
  cambiarPassword,
  formImagenPerfil,
  agregarImagenPerfil,
  mostrarUsuarios,
};
