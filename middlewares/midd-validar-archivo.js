import flash from 'connect-flash';
const validarArchivoSubir = (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.imagen) {
    req.flash("error", 'no hay imagen en files');
    return res.redirect(`${req._parsedOriginalUrl.path}`);
  }
  next();
};

export default validarArchivoSubir;
