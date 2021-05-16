import flash from "connect-flash";

const conectarFlash = (req, res, next) => {
  
  res.locals.usuario={...req.user} ||null;
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();
  next();
};

export default conectarFlash;
