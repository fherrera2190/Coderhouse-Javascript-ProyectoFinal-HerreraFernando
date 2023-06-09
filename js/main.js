// Declarcion de let y const
let productos;
const contenedorProductos = document.querySelector("#contenedor-productos");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
let productosEnCarrito;

///cuando recien se carga el documento
document.addEventListener('DOMContentLoaded', () => {
    traerProductos();
    const productosEnCarritoLS = JSON.parse(localStorage.getItem("productos-en-carrito"));
    if (productosEnCarritoLS != null) {
        productosEnCarrito = productosEnCarritoLS;
    }
    else {
        productosEnCarrito = [];
    }
    calcularCantidadProductosCarrito();
});
//Trae mis productos de mi Json
async function traerProductos() {
    productos = await fetch('../data/productos.json').then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Hubo un problema en el servidor, intente nuevamente' + response.statusText);
        }
    }).catch((error) => {
        console.log('Errooooor')
    });
    cargarProductos(productos);
}

//funciones encargadas del dom
function crearTarjeta(producto) {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="producto m-3 card text-center bg-card p-2">
          <img
            src="${producto.imagen}"
            class="card-img-top"
            alt="${producto.nombre}"
          />
          <div class="card-body">
            <h3 class="card-title">$${producto.precio}</h3>
            <h4>${producto.nombre}</h4> 
            <p class="card-text">
            ${producto.descripcion}
            </p>
            <a id="${producto.id}" class="btn btn-primary producto-agregar">Agregar Carrito</a>
          </div>            
        </div>
    `;
    return div
}
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";
    const div = document.createElement("div");
    div.classList.add("row", "row-cols-1", "row-cols-md-2", "row-cols-lg-3");
    div.innerHTML = '';
    productosElegidos.forEach(producto => {
        div.append(crearTarjeta(producto));
    }
    )
    contenedorProductos.append(div);
    actualizarBotonesAgregar();
}
function mostrarPedido() {
    contenedorProductos.innerHTML = ""
    const divP = document.createElement('div')
    divP.classList.add('pedido');
    productosEnCarrito.forEach(producto => {
        let div = document.createElement('div');
        div.classList.add("d-flex", "justify-content-around", 'align-items-center', 'm-3');
        div.innerHTML = `
        <img src="${producto.imagen}" class="img-pedido" alt="" />
        <p class="fs-4">${producto.nombre}</p>
        <div class="">
             <input type="number" id="cantidad${producto.id}" class="w-50 pedido-cantidad-modificar" min="1" value="${producto.cantidad}">
        </div>
        <div class="border border-1 border-dark bg-white fs-5 m-0 pedido-cantidad text-center">$${producto.precio}</div>
        <div class="botones-pedido">
            <a id="${producto.id}" class="text-decoration-none producto-eliminar" href="#">Eliminar</a>
        </div> 
        `
        divP.append(div);
    })
    divP.innerHTML += `
    <hr>
    <div class='d-flex align-items-center justify-content-between m-4'>
        <button type="button" id="btnVaciar" class="btn btn-primary">Vaciar Carrito</button>
    <div>
    <div class='d-flex align-items-center'>
        <p class="m-2">Total con Envio</p>
        <div class="border border-1 border-dark bg-white fs-4 m-2 total text-center">${calcularTotalCarrito()}</div>
             <button type="button" id="btnCompra" class="btn btn-primary m-2">Comprar</button>
        </div>
    </div>
    `;
    contenedorProductos.append(divP);
    actualizarBotonesEliminar()
    actualizarBotonesModificar();
    agregarEvent();
}

//Seccion Eventos
function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

function actualizarBotonesEliminar() {
    botonesAgregar = document.querySelectorAll(".producto-eliminar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", eliminarProducto);
    });
}

function actualizarBotonesModificar() {
    document.querySelectorAll(".pedido-cantidad-modificar").forEach(boton => {
        boton.addEventListener("change", modificarCantidadCarrito);
    });
}

function agregarEvent() {
    document.querySelector("#btnVaciar").addEventListener("click", vaciarCarrito);
    document.querySelector("#btnCompra").addEventListener("click", compraRealizada);
}


// LINKS ASIDE
const comidayBebidas = document.getElementById('todos');
comidayBebidas.addEventListener('click', (e) => {
    tituloPrincipal.innerHTML = "Comidas y Bebidas";
    contenedorProductos.innerHTML = "";
    cargarProductos(productos);
});

const botonSandwich = document.getElementById('hamburguesa');
botonSandwich.addEventListener('click', (e) => {
    contenedorProductos.innerHTML = "";
    const cargarProductosSanwdich = productos.filter(producto => producto.categoria === e.currentTarget.id);
    tituloPrincipal.innerHTML = e.currentTarget.id;
    cargarProductos(cargarProductosSanwdich);
});

const botonEmpanadas = document.getElementById('lomo');
botonEmpanadas.addEventListener('click', (e) => {
    const cargarProductosEmpanads = productos.filter(producto => producto.categoria === e.currentTarget.id);
    tituloPrincipal.innerHTML = e.currentTarget.id;
    cargarProductos(cargarProductosEmpanads);
});

const botonMilansesa = document.getElementById('milanesa');
botonMilansesa.addEventListener('click', (e) => {
    const cargarProductosMilanesa = productos.filter(producto => producto.categoria === e.currentTarget.id);
    tituloPrincipal.innerHTML = e.currentTarget.id;
    cargarProductos(cargarProductosMilanesa);
});

const botonBebidas = document.getElementById('bebidas');
botonBebidas.addEventListener('click', (e) => {
    const cargarProductosBebidas = productos.filter(producto => producto.categoria === e.currentTarget.id);
    tituloPrincipal.innerHTML = e.currentTarget.id;
    cargarProductos(cargarProductosBebidas);
});

const botonPedido = document.getElementById('pedido');
botonPedido.addEventListener('click', (e) => {
    tituloPrincipal.innerHTML = "Tu Pedido";
    contenedorProductos.innerHTML = "";
    mostrarPedido();
});

// FUNCIONES DEL CARRITO
function agregarAlCarrito(e) {
    const idBoton = e.currentTarget.id;
    let productoAgregado = productos.find(producto => producto.id === +idBoton);
    if (productosEnCarrito.some(producto => producto.id === +idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === +idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }
    Swal.fire({
        title: 'Se agrego tu producto al pedido',
        icon: 'success',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
        , timer: 1500
    })
    guardarCarrito();
    calcularCantidadProductosCarrito();
}
function eliminarProducto(e) {
    const idBoton = e.currentTarget.id;
    Swal.fire({
        title: 'Quieres eliminar el producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, eliminarlo'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Se elimino tu producto satisfactoriamente.',
                timer: 1000,
            })
            productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== +idBoton);
            guardarCarrito();
            mostrarPedido();
            calcularCantidadProductosCarrito();
        }
    })
}
function vaciarCarrito() {
    Swal.fire({
        title: 'Quieres eliminar el pedido?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Si, eliminarlo'
    }).then((result) => {
        if (result.isConfirmed && productosEnCarrito.length > 0) {
            Swal.fire({
                title: 'Se elimino tu pedido satisfactoriamente.',
                timer: 1000,
            })
            productosEnCarrito = [];
            guardarCarrito();
            mostrarPedido();
            calcularCantidadProductosCarrito();
        } else {
            Swal.fire({
                title: 'No hay productos para eliminar',
                timer: 1000,
            })
        }
    })
}
function modificarCantidadCarrito(e) {
    const total = document.querySelector('.total');
    const idBoton = e.currentTarget.id;
    let index = productosEnCarrito.findIndex(producto => ('cantidad' + producto.id) === idBoton);
    if (e.target.value < 1) {
        productosEnCarrito[index].cantidad = 1
        e.target.value = 1;
    } else {
        productosEnCarrito[index].cantidad = e.target.value;
        total.innerHTML = '' + calcularTotalCarrito();
        guardarCarrito();
        calcularCantidadProductosCarrito()
    }
}
function compraRealizada() {

    if (productosEnCarrito.length > 0) {
        Swal.fire({
            title: 'Gracias por su Compra, te avisaremos cuando tu pedido se encuentre en camino!',
            icon: 'success',
            timer: 1300
        })
        setTimeout(() => {
            location.href = '../secciones/menu.html';
            productosEnCarrito = [];
            guardarCarrito();
        }, 2000);
    } else {
        Swal.fire({
            title: 'No tiene productos en tu pedido',
            timer: 1000,
        })
    }
}
function guardarCarrito() {
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}
function calcularTotalCarrito() {
    return productosEnCarrito.reduce((a, producto) => {
        return (a += +producto.precio * +producto.cantidad);
    }, 0);;
}
function calcularCantidadProductosCarrito() {
    const pedidoCantidad = document.querySelector("#pedido-cantidad");
    pedidoCantidad.innerHTML = "" + productosEnCarrito.reduce((a, producto) => {
        return (a += +producto.cantidad);
    }, 0);
}