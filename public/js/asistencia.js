import axios from 'axios';

document.addEventListener('DOMContentLoaded',()=>{
    const asistencia=document.querySelector('#confirmar-asistencia');
    if(asistencia){
        asistencia.addEventListener('submit',confirmaAsistencia)
    }
});


function confirmaAsistencia (e){
    e.preventDefault();
    const btn = document.querySelector(
      '#confirmar-asistencia input[type="submit"]'
    );
    let accion=document.querySelector('#accion').value;
    const mensaje=document.querySelector('#mensaje');
    //limpia la respuesta previa

    while(mensaje.firstChild){
        mensaje.removeChild(mensaje.firstChild);
    }
    //OBTENER EL VALOR CANCELAR O CONFIRMAR en el hidden
    const datos={
        accion
    }
    axios.post(this.action,datos)
    .then(respuesta=>{
        if(accion==='confirmar'){
            //modifica los elementos del boton
            document.querySelector('#accion').value='cancelar';
            btn.value='Cancelar';
            btn.classList.remove('btn-azul');
            btn.classList.add('btn-rojo')
        }else{
          //modifica los elementos del boton
          document.querySelector("#accion").value = "confirmar";
          btn.value = "Si";
          btn.classList.remove("btn-rojo");
          btn.classList.add("btn-azul");
        }
        //mostrar un mensaje
        mensaje.appendChild(document.createTextNode(respuesta.data))


    })


}