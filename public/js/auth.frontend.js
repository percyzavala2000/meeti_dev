let url1 = `${location.origin}${location.pathname}`;

//variables
const formulario = document.querySelector("#formulario");

formulario.addEventListener("submit",async (e) => {
  e.preventDefault();
  const data = {};

  for (let elemen of formulario.elements) {
    if (elemen.name.length > 0) {
      data[elemen.name] = elemen.value;
    }
  }

  const resultado=await fetch(url1, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(resultado);
  
  const datos= await resultado.json();
      console.log(datos);
      if (data.mensaje) {
        return console.log(datos.mensaje);
      }
      localStorage.setItem("token", datos.token);
      console.log("hasta aqui llega para guaradar en local storage");
      console.log("termina local storage");
      window.location = "/administracion";
    
});

//////////////////////////////////////////////////////////////////
