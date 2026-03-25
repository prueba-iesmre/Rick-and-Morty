/* SCRIPT PARA CREAR FICHAS DINAMICAMENTE */
function ficha(){
const contenedor = document.getElementById("contenedor");

for(let i = 0; i < 12; i++){
contenedor.innerHTML += `
<div class="fichas">
    <div class="imagen">
        <img src="img/rick-sanchez-7426878_1280.jpg">
    </div>
        <div class="info_fichas">
        <p>Nombre:</p>
        <p>Genero:</p>
        <p>Especie:</p>
        <p>Estado:</p>
        <p>Origen:</p>
    </div>
</div>
`;
}
}
/* FIN SCRIPT PARA CREAR FICHAS DINAMICAMENTE */


/* SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */
function usarAPI() {
    document.getElementById("bienvenida").style.display = "none";
}

function usarBBDD() {
    document.getElementById("bienvenida").style.display = "none";
}
/* FIN SCRIPT PARA SELECCIONAR TIPO DE BUSQUEDA  */


/*FILTROS*/
const dropdown = document.querySelector(".dropdown");
const btn = document.getElementById("dropdownBtn");
const items = document.querySelectorAll(".item");
const search = document.getElementById("search");
const results = document.getElementById("results");

let tipoActual = "characters";

// Datos de prueba
const data = {
  characters: ["Rick", "Morty", "Summer", "Beth", "Jerry"],
  locations: ["Earth", "Citadel of Ricks", "Gazorpazorp"],
  episodes: ["Pilot", "Lawnmower Dog", "Pickle Rick"]
};

// Abrir/cerrar dropdown
btn.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

// Seleccionar tipo
items.forEach(item => {
  item.addEventListener("click", () => {
    tipoActual = item.dataset.type;
    btn.innerHTML = item.textContent + " ▼";
    dropdown.classList.remove("active");
    mostrarResultados();
  });
});

// Buscar
search.addEventListener("input", mostrarResultados);

// Mostrar resultados
function mostrarResultados() {
  const texto = search.value.toLowerCase();
  results.innerHTML = "";

  const filtrados = data[tipoActual].filter(item =>
    item.toLowerCase().includes(texto)
  );

  filtrados.forEach(item => {
    results.innerHTML += `<div class="card">${item}</div>`;
  });
}

// Inicial
mostrarResultados();
/*FIN FILTROS*/
