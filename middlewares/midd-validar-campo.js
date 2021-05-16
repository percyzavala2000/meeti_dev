import { validationResult } from "express-validator";
import flash from "connect-flash";

const validarCampo = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const erroresSequelize = errores.errors.map((err) => err.msg);
    console.log(erroresSequelize);
    req.flash("error", erroresSequelize);
    return res.redirect(`${req._parsedOriginalUrl.path}`);
  }
  next();
  
};

export default validarCampo;
