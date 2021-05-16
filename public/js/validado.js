console.log('entra admin');
  let url = `${location.origin}${location.pathname}`;
  console.log(url);




//validar el token del localstorage
//let usuario=null;
const validatJWTdeLocalStorege =async () => {
  const token = await localStorage.getItem("token");
  console.log("desde valido js", token);

  if (token.length <= 10) {
  //  window.location = location.pathname;
    throw new Error(" no hay token en local storage");
  }
 

  const respuesta = await fetch(url, {
    headers: { "api-token": token },

  });
  console.log('desde respuesta:',respuesta);
 console.log("desde frontend:",respuesta.headers);
 
 //  const user = await respuesta.json();
 // console.log(user);
  /*
  localStorage.setItem("token", tokenDB);
  usuario = usuarioDB;
  document.title = usuario.nombre; */

};
const inicio= async()=>{
await validatJWTdeLocalStorege();

};
 inicio(); 





