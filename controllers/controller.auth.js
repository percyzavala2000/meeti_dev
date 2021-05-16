import passport from "passport";

const formIniciarSesion = (req, res) => {
  res.render("iniciar-sesion", {
    nombrePagina: "Iniciar Sesion",
  });
};

const autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/auth/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

const cerrarSesion=(req,res,next)=>{
  console.log(req);
  
  req.logout();
  req.flash('success','Cerraste Sesion Correctamnete');
  res.redirect("/auth/iniciar-sesion");
  next();

}

export { formIniciarSesion, autenticarUsuario,cerrarSesion };
