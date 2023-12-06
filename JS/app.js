const header = document.querySelector("#header");
const contenedor = document.querySelector("#contenedor");
const body = document.querySelector("body");
window.addEventListener("scroll", function(){
    if(contenedor.getBoundingClientRect().top<10){
        header.classList.add("scroll")
    }
    else{
        header.classList.remove("scroll")
    }
})

const abrirCarrito = document.getElementById("botonCarrito");
const modal = document.getElementById("modal");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const cuentaCarrito = document.getElementById("cuentacarrito");

abrirCarrito.addEventListener("click", abrirModal);

function abrirModal() {
    modal.style.display = "block";
    calcularTotal();
}

function cerrarModal() {
    modal.style.display = "none";
}

function agregarAlCarrito(nombreProducto, precioProducto) {
    const productosEnCarrito = listaCarrito.children;

    for (let i = 0; i < productosEnCarrito.length; i++) {
        const producto = productosEnCarrito[i];
        if (producto.dataset.nombre === nombreProducto) {
            const cantidadActual = parseInt(producto.querySelector(".cantidad").textContent);
            const nuevaCantidad = cantidadActual + 1;
            producto.querySelector(".cantidad").textContent = nuevaCantidad;
            producto.querySelector(".subtotal").textContent = `$${(precioProducto * nuevaCantidad).toFixed(2)}`;
            calcularTotal();
            actualizarContadorCarrito();
            return;
        }
    }

    const nuevoProducto = document.createElement("li");
    nuevoProducto.dataset.nombre = nombreProducto;
    nuevoProducto.innerHTML = `
        <span class="cantidad">1</span> 
        ${nombreProducto} - 
        Subtotal: <span class="subtotal">$${precioProducto.toFixed(2)}</span>
    `;
    listaCarrito.appendChild(nuevoProducto);
    calcularTotal();
    actualizarContadorCarrito();
}


function limpiarCarrito() {
    listaCarrito.innerHTML = "";
    totalCarrito.textContent = "$0.00";
    actualizarContadorCarrito();
}

function calcularTotal() {
    let total = 0;
    const productosEnCarrito = listaCarrito.children;

    for (let i = 0; i < productosEnCarrito.length; i++) {
        const producto = productosEnCarrito[i];
        const precioProducto = parseFloat(producto.querySelector(".subtotal").textContent.replace("$", ""));
        total += precioProducto;
    }

    totalCarrito.textContent = `$${total.toFixed(2)}`;
}

function actualizarContadorCarrito() {
    const productosEnCarrito = listaCarrito.children;
    let cantidadTotal = 0;

    for (let i = 0; i < productosEnCarrito.length; i++) {
        const producto = productosEnCarrito[i];
        const cantidadProducto = parseInt(producto.querySelector(".cantidad").textContent);
        cantidadTotal += cantidadProducto;
    }

    cuentaCarrito.textContent = cantidadTotal.toString();
}

const botonesComprar = document.querySelectorAll(".card button");

botonesComprar.forEach((boton) => {
    boton.addEventListener("click", function () {
        const producto = this.parentNode;
        const nombreProducto = producto.querySelector("p").textContent;
        const precioProducto = parseFloat(producto.querySelector(".precio").textContent.replace("$", ""));

        agregarAlCarrito(nombreProducto, precioProducto);
    });
});

