class Medicamento {
    constructor(nregistro, nombre, laboratorio, indicaciones, dosis) {
        this.nregistro = nregistro;
        this.nombre = nombre;
        this.labIng = laboratorio;
        this.indicacionesIng = indicaciones;
        this.dosis = dosis;
    }
}

//CAPTURANDO EL DOM
let medicamentos = document.getElementById("medicamentos")
let agregarMedicamentoBTN = document.getElementById("agregarMedicamentoBTN")


// Cargando la informacion al local storage 
const cargarLocalStorage = async () => {
    const res = await fetch("https://cima.aemps.es/cima/rest/medicamentos?all");
    const data = await res.json();

    vademecum = [];

    for (let APImedicamento of data.resultados) {
        let APInuevoMedicamento = new Medicamento(APImedicamento.nregistro, APImedicamento.nombre, APImedicamento.labtitular, APImedicamento.cpresc, APImedicamento.dosis)
        vademecum.push(APInuevoMedicamento);
    }
    localStorage.setItem("vademecum", JSON.stringify(vademecum));
}

let vademecum = [];

if (localStorage.getItem("vademecum")) {
    vademecum = JSON.parse(localStorage.getItem("vademecum"));
} else {
    cargarLocalStorage()
}


//        FUNCIONES     //
function mostrarVademecum(array) {
    for (let medicamento of array) {
        let nuevoMedicamentoDiv = document.createElement("div");
        nuevoMedicamentoDiv.className = "col-6 col-md-4 col-lg-3 my-2";
        nuevoMedicamentoDiv.innerHTML = `<div id="" class="card" style="width: 18rem;">
        <img class="card-img-top" src="../images/generico.jpg" alt="Imagen del medicamento">
                                  <div class="card-body">
                                     <h4 class="card-title">${medicamento.nombre}</h4>
                                     <p>Laboratorio: ${medicamento.labIng}</p>
                                     <p>Indicaciones: ${medicamento.indicacionesIng}</p>
                                     <p>Dosis: ${medicamento.dosis}</p>
                                  </div>
                               </div>`;
        medicamentos.appendChild(nuevoMedicamentoDiv);
    }
}

//AGREGAR MEDICAMENTOS 
function agregarMedicamento() {
    let codigoIngr = document.getElementById("codigoInput").value;
    let nombreIngr = document.getElementById("nombreInput").value;
    let labIng = document.getElementById("labInput").value;
    let indicacionesIng = document.getElementById("indicacionesInput").value;
    let dosisIng = document.getElementById("dosisInput").value;

    const medicamentoNuevo = new Medicamento(codigoIngr, nombreIngr, labIng, indicacionesIng, dosisIng);
    vademecum.push(medicamentoNuevo);
    localStorage.setItem("vademecum", JSON.stringify(vademecum));
    mostrarVademecum([medicamentoNuevo]);
    codigoIngr.value = ""
    nombreIngr.value = ""
    labIng.value = ""
    indicacionesIng.value = ""
    dosisIng.value = ""

    Swal.fire({
        icon: 'success',
        title: 'Hecho',
        text: `Se ha agreado el medicamento ${medicamentoNuevo.nombre} `,
      })

}



//OBTENER IMAGEN DEL MEDICAMENTO 
function obtenerIMG(medicamento) {
    if (medicamento.fotos && medicamento.fotos.length > 0) {
        return medicamento.fotos[0].url;
    } else {
        return "../images/generico.jpg";
    }
}

// OBTENIENDO LA INFORMACION DE LA API
document.addEventListener("DOMContentLoaded", function () {
    let divDataMedicament = document.getElementById("medicamentoOfAPI");
    fetch('https://cima.aemps.es/cima/rest/medicamentos?all')
        .then((response) => response.json())
        .then(data => {
            const resultados = data.resultados;
            for (let APImedicamento of resultados) {
                let newAPImedicamento = document.createElement("div");
                newAPImedicamento.className = "col-12 col-md-6 col-lg-4 my-2"
                newAPImedicamento.innerHTML = `
            <div id="${APImedicamento.nregistro}" class="card" style="width: 18rem;">
            <img class="card-img-top" src="${obtenerIMG(APImedicamento)}" alt="Imagen del medicamento">
              <div class="card-body">
                <h5 class="card-title">${APImedicamento.nombre}</h5>
                <p>Laboratorio: ${APImedicamento.labtitular}</p>
                <p>Requerimientos: ${APImedicamento.cpresc}</p> 
                <p>Dosis: ${APImedicamento.dosis}</p> 
              </div>
            </div>`;
                divDataMedicament.appendChild(newAPImedicamento);
            }
        })
});


//EVENTOS
agregarMedicamentoBTN.addEventListener("click", function (event) {
    event.preventDefault();
    agregarMedicamento();
})
