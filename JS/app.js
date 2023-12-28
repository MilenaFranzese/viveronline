
const header = document.querySelector("#header");
const contenedor = document.querySelector("#contenedor");
const body = document.querySelector("body");

window.addEventListener("scroll", function () {
    if (contenedor.getBoundingClientRect().top < 10) {
        header.classList.add("scroll");
    } else {
        header.classList.remove("scroll");
    }
});

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
            guardarCarritoEnLocalStorage();
            return;
        }
    }

    const nuevoProducto = document.createElement("li");
    nuevoProducto.dataset.nombre = nombreProducto;
    nuevoProducto.innerHTML = `
        <span class="cantidad">1</span> 
        ${nombreProducto} - 
        Subtotal: <span class="subtotal">$${precioProducto.toFixed(2)}</span>
        <i class="fa-solid fa-trash-can" onclick="eliminarProducto('${nombreProducto}')"></i>
    `;
    listaCarrito.appendChild(nuevoProducto);
    calcularTotal();
    actualizarContadorCarrito();
    guardarCarritoEnLocalStorage();
}

function eliminarProducto(nombreProducto) {
    const productosEnCarrito = listaCarrito.children;

    for (let i = 0; i < productosEnCarrito.length; i++) {
        const producto = productosEnCarrito[i];
        if (producto.dataset.nombre === nombreProducto) {
            producto.remove();
            calcularTotal();
            actualizarContadorCarrito();
            guardarCarritoEnLocalStorage();
            return;
        }
    }
}

function limpiarCarrito() {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, vaciar carrito"
    }).then((result) => {
        if (result.isConfirmed) {
            listaCarrito.innerHTML = "";
            totalCarrito.textContent = "$0.00";
            actualizarContadorCarrito();
            guardarCarritoEnLocalStorage();

            Swal.fire({
                title: "¡Vacío!",
                text: "Tu carrito ha sido vaciado.",
                icon: "success"
            });
        }
    });
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

function guardarCarritoEnLocalStorage() {
    const productosEnCarrito = [];
    const productosEnCarritoHTML = listaCarrito.innerHTML;

    localStorage.setItem("carritoHTML", productosEnCarritoHTML);
}

function recuperarCarritoDesdeLocalStorage() {
    const productosEnCarritoHTML = localStorage.getItem("carritoHTML");
    if (productosEnCarritoHTML) {
        listaCarrito.innerHTML = productosEnCarritoHTML;
        actualizarContadorCarrito();
        calcularTotal();
    }
}

recuperarCarritoDesdeLocalStorage();

const botonesComprar = document.querySelectorAll(".card button");

botonesComprar.forEach((boton) => {
    boton.addEventListener("click", function () {
        const producto = this.parentNode;
        const nombreProducto = producto.querySelector("p").textContent;
        const precioProducto = parseFloat(producto.querySelector(".precio").textContent.replace("$", ""));

        agregarAlCarrito(nombreProducto, precioProducto);
    });
});

document.querySelector(".boton-comprar").addEventListener("click", async function () {
    console.log("Botón comprar clickeado");
    
    try {
        const email = await obtenerEmail();
        
        if (!email) {
            console.log("Email no proporcionado");
            return;
        }

        console.log("Email proporcionado:", email);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "¡Compra finalizada!",
            text: `Enviaremos la factura a tu mail (${email}) junto a los datos para que puedas abonar y los medios de retiro o envío.`,
            showConfirmButton: false,
            timer: 5000
        });
    } catch (error) {
        console.error("Error en el proceso de compra:", error);
    }
});

async function obtenerEmail() {
    const resultado = await Swal.fire({
        title: "Submit your email",
        input: "email",
        inputAttributes: {
            autocapitalize: "off",
            required: "true"
        },
        showCancelButton: true,
        confirmButtonText: "Complete purchase",
        cancelButtonText: "Cancel",
        showLoaderOnConfirm: true,
        preConfirm: async (email) => {
            if (!email) {
                Swal.showValidationMessage("Email is required");
            } else {
                return email;
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });

    if (resultado.isConfirmed) {
        return resultado.value;
    }

    return null;
}


const listaComentarios = async () => {
    try {
        const respuesta = await fetch("https://jsonplaceholder.typicode.com/comments");
        const comentarios = await respuesta.json();

        const comentariosLimitados = comentarios.slice(0, 5);

        let tableBody = ``;
        comentariosLimitados.forEach((comentario, index) => {
            tableBody += `<tr>
                <td>${comentario.email}</td>
                <td>${comentario.body}</td>
            </tr>`;
        });

        document.getElementById("tableBody_comentarios").innerHTML = tableBody;
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
    }
};

window.addEventListener("load", function () {
    listaComentarios();
});
