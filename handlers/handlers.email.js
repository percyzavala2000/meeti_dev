import nodemailer from "nodemailer";
import fs from "fs";
import util from "util";
import emailConfig from "../database/config.email.js";
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

const enviar = async (opciones) => {
  //leer el archivo para el email
  const archivo = __dirname + `/../views/emails/${opciones.archivo}.ejs`;
  //compilarlo
  const compilado = ejs.compile(fs.readFileSync(archivo, "utf8"));
  //crear el html
  const html = compilado({ url: opciones.url });
  //configurar las opciones de email
  const opcionesEmail = {
    from: "Metti <no-reply@MEETI.com",
    to: opciones.usuario.email,
    subject: opciones.subject,
    html: html,
  };

  //enviar email
  const sendMail = util.promisify(transport.sendMail, transport);
  return sendMail.call(transport, opcionesEmail);
};

export default enviar;
