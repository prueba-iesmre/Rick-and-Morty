
function ficha(){
const contenedor = document.getElementById("contenedor");

for(let i = 0; i < 12; i++){
contenedor.innerHTML += `
<div class="fichas">
    <div class="imagen">
        <img src="rick-sanchez-7426878_1280.jpg">
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
