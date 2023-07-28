class Medicamento {
    constructor(SN, principioActivo, nombreComercial, dosis, presentacion, categoria) {
        this.sn = SN,
            this.pactivo = principioActivo,
            this.nombre = nombreComercial,
            this.dosis = dosis,
            this.presentacion = presentacion
        this.categoria = categoria
    }
}

//CAPTURANDO EL DOM
let medicamentos = document.getElementById("medicamentos")
let verVademecum = document.getElementById("verVademecum")
let ocultarVademecum = document.getElementById("ocultarVademecum")
let selectOrden = document.getElementById("selectOrden")
let agregarMedicamentoBTN = document.getElementById("agregarMedicamentoBTN")
let agregarMedicamentoMenu = document.getElementById("agregarNuevoMedicamento")
let buscador = document.getElementById("buscador")

// Cargando la informacion al local storage 
const cargarLocalStorage = async () => {
    const res = await fetch("https://cima.aemps.es/cima/rest/medicamentos?all");
    const data = await res.json();

    let vademecum = [];

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
    cargarLocalStorage()}


//        FUNCIONES     //
function mostrarVademecum(array) {
    medicamentos.innerHTML = ``
    for (let medicamento of array) {
        let nuevoMedicamentoDiv = document.createElement("div")
        nuevoMedicamentoDiv.className = "col-12 col-md-6 col-lg-4 my-2"
        nuevoMedicamentoDiv.innerHTML = `<div id="${medicamento.sn}" class="card" style="width: 18rem;">
        <img class="card-img-top" src="../images/generico.jpg" alt="Imagen del medicamento">
                                  <div class="card-body">
                                     <h4 class="card-title">${medicamento.nombre}</h4>
                                     <p>Principio activo: ${medicamento.pactivo}</p>
                                     <p>Dosis: ${medicamento.dosis}</p>
                                  </div>
                               </div>`
        medicamentos.appendChild(nuevoMedicamentoDiv)
    }
}

//AGREGAR MEDICAMENTOS 
function agregarMedicamento(array) {
    let SNIng = document.getElementById("snInput")
    let pactivoIng = document.getElementById("pactivoInput")
    let nombreIngr = document.getElementById("nombreInput")
    let dosisIng = document.getElementById("dosisInput")
    let presentacionIng = document.getElementById("presentacionInput")
    let categoriaIng = document.getElementById("categoriaInput")

    const medicamentoNuevo = new Medicamento(SNIng.value, pactivoIng.value, nombreIngr.value, dosisIng.value, presentacionIng.value, categoriaIng.value)
    array.push(medicamentoNuevo)
    localStorage.setItem("vademecum 2", JSON.stringify(array))
    mostrarVademecum(array)
    SNIng.value = ""
    pactivoIng.value = ""
    nombreIngr.value = ""
    dosisIng.value = ""
    presentacionIng.value = ""
    categoriaIng.value = ""
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
    event.preventDefault()
     agregarMedicamento(vademecum)
})

verVademecum.addEventListener("click", () => {
    mostrarVademecum(vademecum)
})

ocultarVademecum.ondblclick = () => {
    medicamentos.innerHTML = ``
}

