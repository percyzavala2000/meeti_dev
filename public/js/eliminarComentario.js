import axios from "axios";
import Swal from "sweetalert2";
document.addEventListener("DOMContentLoaded", () => {
  const formEliminar = document.querySelectorAll(".eliminar-comentario");
  //revisar si existe los formularios
  if (formEliminar.length > 0) {
    formEliminar.forEach((form) => {
      form.addEventListener("submit", eliminaComentario);
    });
  }
});

function eliminaComentario(e){
    e.preventDefault();

    Swal.fire({
      title: "Eliminar Comentario?",
      text: "Un Comentario eliminado no se puede recuperar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Borrar!",
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        //tomar el id del Comentario
        console.log(this.children);

      
        
        const comentarioId=this.children[0].value;

        //crear el objeto
        const datos={
          comentarioId
        }

        //ejecutar axios y pasar los datos
         axios.post(this.action,datos).then((respuesta) => {
           Swal.fire("Eliminado!", respuesta.data, "success");

           //Eliminar del DOM
           this.parentElement.parentElement.remove();


         }).catch(error=>{

         });
        
      }
    });
   
}
