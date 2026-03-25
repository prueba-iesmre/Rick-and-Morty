// Guardamos todos los personajes
let datosOriginales = [];

// Cargar personajes desde la API
function cargarPersonajes() {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "https://rickandmortyapi.com/api/character");

    xhr.onload = function () {
        if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);

        datosOriginales = data.results;
        mostrarResultados(datosOriginales);
        }
    };

    xhr.send();
}

// Mostrar resultados en pantalla
function mostrarResultados(lista) {
  const contenedor = document.getElementById("resultados");
  contenedor.innerHTML = "";

  lista.forEach(p => {
    contenedor.innerHTML += `
      <div class="card">
        <h3>${p.name}</h3>
        <img src="${p.image}" width="150">
        <p>${p.species}</p>
      </div>
    `;
  });
}

// Buscador en tiempo real
document.addEventListener("DOMContentLoaded", () => {
  cargarPersonajes();

  document.getElementById("searchInput").addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();

    const filtrados = datosOriginales.filter(p => {
        const textoCompleto = `
            ${p.name} 
            ${p.species} 
            ${p.status} 
            ${p.gender}
        `   .toLowerCase();

        return textoCompleto.includes(texto);
    });
    mostrarResultados(filtrados);
  });
});