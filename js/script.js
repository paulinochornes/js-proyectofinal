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
let modalBmaletin = document.getElementById("modal-b-maletin")
let maletinBTN = document.getElementById("maletinBTN")
let finalizarprescripBTN = document.getElementById("botonFinalizarPrescripcion")


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
                <button id="agregarBtn_${APImedicamento.nregistro}" class="btn btn-outline-success">Prescribir</button>
                </div>
            </div>`;
                divDataMedicament.appendChild(newAPImedicamento);

                let agregarBtn = newAPImedicamento.querySelector(`#agregarBtn_${APImedicamento.nregistro}`);
                agregarBtn.addEventListener("click", () => {
                    agregarAlmaletin(APImedicamento);
                });
            }
        })
});

// Cargando la informacion al local storage 
async function cargarLocalStorage() {
    const res = await fetch("https://cima.aemps.es/cima/rest/medicamentos?all");
    const data = await res.json();

    vademecum = [];

    for (let APImedicamento of data.resultados) {
        let APInuevoMedicamento = new Medicamento(APImedicamento.nregistro, APImedicamento.nombre, APImedicamento.labtitular, APImedicamento.cpresc, APImedicamento.dosis);
        vademecum.push(APInuevoMedicamento);
    }
    localStorage.setItem("vademecum", JSON.stringify(vademecum));
    localStorage.setItem("maletin", JSON.stringify(productosEnMaletin));
}

let vademecum = [];

if (localStorage.getItem("vademecum")) {
    vademecum = JSON.parse(localStorage.getItem("vademecum"));
} else {
    cargarLocalStorage()
}

//Maletin
let productosEnMaletin
if (localStorage.getItem("maletin")) {
    productosEnMaletin = JSON.parse(localStorage.getItem("maletin"))
} else {
    productosEnMaletin = []
    localStorage.setItem("maletin", productosEnMaletin)
}

//        FUNCIONES     //

//MOSTRAR MALETIN
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
        <button id="agregarBtn${medicamento.nombre}" class="btn btn-outline-success">Prescribir</button>
        </div>
        </div>`;
        medicamentos.appendChild(nuevoMedicamentoDiv);

        let agregarBtn = document.getElementById(`agregarBtn${medicamento.nombre}`);
        agregarBtn.addEventListener("click", () => {
            agregarAlmaletin(medicamento);
        })
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

//AGREGAR AL MALETIN 
function agregarAlmaletin(medicamento) {
    let medsAgregado = productosEnMaletin.find((meds) => meds.nregistro === medicamento.nregistro);
    if (medsAgregado === undefined) {
        productosEnMaletin.push(medicamento);
        localStorage.setItem("maletin", JSON.stringify(productosEnMaletin));

        Swal.fire({
            title: `Ha prescripto un medicamento`,
            text: `El medicamento ${medicamento.nombre} de ${medicamento.labtitular} ha sido agregado`,
            confirmButtonColor: "green",
            confirmButtonText: "Continuar",
        });
    } else {
        Swal.fire({
            title: `El medicamento ya ha sido prescripto`,
            icon: "info",
            timer: 2000,
            showConfirmButton: false,
        });
    }
}

//CARGAR MALETIN 
function cargarMaletin(array) {
    modalBmaletin.innerHTML = ``;
    array.forEach((medicamentoEnMaletin) => {
        modalBmaletin.innerHTML += `
            <div class="card border-primary mb-3" id="medsin-bot${medicamentoEnMaletin.nregistro}" style="max-width: 540px;">
                <div class="card-body">
                    <h4 class="card-title">${medicamentoEnMaletin.nombre}</h4>
                    <p class="card-text">${medicamentoEnMaletin.labIng}</p>
                    <p class="card-text">${medicamentoEnMaletin.dosis} mg</p> 
                    <button class="btn btn-danger" id="botonEliminar${medicamentoEnMaletin.nregistro}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>    
            </div>
        `;
    });
    //BORRAR MEDS DEL MALETIN
    array.forEach((medicamentoEnMaletin) => {
        document.getElementById(`botonEliminar${medicamentoEnMaletin.nregistro}`).addEventListener("click", () => {
            console.log(`Eliminar medicamento`);
            let cardProducto = document.getElementById(`medsin-bot${medicamentoEnMaletin.nregistro}`);
            cardProducto.remove();
            let productoEliminar = array.find((medicamento) => medicamento.nregistro == medicamentoEnMaletin.nregistro);
            console.log(productoEliminar);
            let posicion = array.indexOf(productoEliminar);
            console.log(posicion);
            array.splice(posicion, 1);
            console.log(array);
            localStorage.setItem("maletin", JSON.stringify(array));
        });
    });
}


//OBTENER IMAGEN DEL MEDICAMENTO 
function obtenerIMG(medicamento) {
    if (medicamento.fotos && medicamento.fotos.length > 0) {
        return medicamento.fotos[0].url;
    } else {
        return "../images/generico.jpg";
    }
}

//FINALIZAR PRESCRIPCION
function finalizarPrescripcion() {
    Swal.fire({
        title: '¿Está seguro de realizar la prepscripcion?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, seguro',
        cancelButtonText: 'No, no quiero',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Prescripción realizada',
                icon: 'success',
                confirmButtonColor: 'green',
                text: `Se ha preescripto el medicamento al paciente. `,
            })

            productosEnMaletin = []
            localStorage.removeItem("maletin")
        } else {
            Swal.fire({
                title: 'Prescripción no realizada',
                icon: 'info',
                text: `La prescripción no ha sido realizada!`,
                confirmButtonColor: 'green',
                timer: 3500
            })
        }
    })
}

//EVENTOS
agregarMedicamentoBTN.addEventListener("click", function (event) {
    event.preventDefault();
    agregarMedicamento();
})
maletinBTN.addEventListener("click", () => {
    cargarMaletin(productosEnMaletin)
})

finalizarprescripBTN.addEventListener("click", () => {
    finalizarPrescripcion(productosEnMaletin)
})