
import Usuarios from "../models/Usuarios.js";

const verificaEmail = async (email) => {
  //const {correo}=req.body
  const existeEmail = await Usuarios.findOne({where:{email}});
  if (existeEmail) {
    throw new Error(`El correo ${email}  ya esta registrado`);
  }
};

//verificar si la contraseña si es igual
const verificaConfirmar = async (repetir,{req}) => {
  if (repetir!== req.body.password) {
    throw new Error(`El reconfirmar Password ${repetir} No coincide con el pasword`);
  }
};

/* const verificarExisteEmail = async (email) => {
  const existeEmail = await Usuarios.findOne({ where: { email} });
  if (!existeEmail) {
    throw new Error(`Este correo ${email} no existe, registrarte`);
  }
}; */

export { verificaEmail, verificaConfirmar };