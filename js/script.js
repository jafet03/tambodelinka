// =============================================
// CLASES Y ESTRUCTURAS DE DATOS
// =============================================

// Clase Producto con encapsulamiento
class Producto {
    #id;
    #nombre;
    #precio;
    #categoria;
    #imagen;
    #descripcion;
    #enOferta;

    constructor(id, nombre, precio, categoria, imagen, descripcion = '', enOferta = false) {
        this.#id = id;
        this.#nombre = nombre;
        this.#precio = precio;
        this.#categoria = categoria;
        this.#imagen = imagen;
        this.#descripcion = descripcion;
        this.#enOferta = enOferta;
    }

    // Getters para acceso controlado
    get id() { return this.#id; }
    get nombre() { return this.#nombre; }
    get precio() { return this.#precio; }
    get categoria() { return this.#categoria; }
    get imagen() { return this.#imagen; }
    get descripcion() { return this.#descripcion; }
    get enOferta() { return this.#enOferta; }

    // Método para calcular precio con descuento
    calcularPrecioConDescuento(porcentaje = 15) {
        return this.#enOferta ? this.#precio * (1 - porcentaje / 100) : this.#precio;
    }

    // Método para mostrar información del producto
    mostrarInfo() {
        return `${this.#nombre} - $${this.#precio}`;
    }
}

// Clase Carrito que maneja los items
class Carrito {
    #items;
    #descuentoAplicado;

    constructor() {
        this.#items = new Map(); // Usando Map para almacenar items
        this.#descuentoAplicado = false;
    }

    // Agregar producto al carrito
    agregarProducto(producto, cantidad = 1) {
        if (this.#items.has(producto.id)) {
            const item = this.#items.get(producto.id);
            item.cantidad += cantidad;
        } else {
            this.#items.set(producto.id, {
                producto: producto,
                cantidad: cantidad
            });
        }
        this.actualizarVista();
        this.mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'exito');
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        if (this.#items.has(id)) {
            const producto = this.#items.get(id).producto;
            this.#items.delete(id);
            this.actualizarVista();
            this.mostrarNotificacion(`${producto.nombre} eliminado del carrito`, 'error');
        }
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(id, nuevaCantidad) {
        if (nuevaCantidad <= 0) {
            this.eliminarProducto(id);
            return;
        }

        if (this.#items.has(id)) {
            this.#items.get(id).cantidad = nuevaCantidad;
            this.actualizarVista();
        }
    }

    // Calcular subtotal
    calcularSubtotal() {
        let subtotal = 0;
        for (const [id, item] of this.#items) {
            subtotal += item.producto.calcularPrecioConDescuento() * item.cantidad;
        }
        return subtotal;
    }

    // Calcular descuento
    calcularDescuento() {
        if (!this.#descuentoAplicado) return 0;
        const subtotal = this.calcularSubtotal();
        return subtotal * 0.15; // 15% de descuento
    }

    // Calcular total
    calcularTotal() {
        const subtotal = this.calcularSubtotal();
        const descuento = this.calcularDescuento();
        const envio = subtotal > 50 ? 0 : 5; // Envío gratis para compras mayores a $50
        return subtotal - descuento + envio;
    }

    // Obtener costo de envío
    obtenerCostoEnvio() {
        const subtotal = this.calcularSubtotal();
        return subtotal > 50 ? 0 : 5;
    }

    // Vaciar carrito
    vaciar() {
        this.#items.clear();
        this.#descuentoAplicado = false;
        this.actualizarVista();
        this.mostrarNotificacion('Carrito vaciado', 'error');
    }

    // Aplicar descuento
    aplicarDescuento() {
        this.#descuentoAplicado = true;
        this.actualizarVista();
        this.mostrarNotificacion('¡Descuento aplicado! 15% off en tu compra', 'exito');
    }

    // Actualizar vista del carrito
    actualizarVista() {
        this.actualizarContador();
        this.renderizarItemsCarrito();
        this.actualizarTotales();
    }

    // Actualizar contador del carrito
    actualizarContador() {
        const contador = document.getElementById('contador-carrito');
        let totalItems = 0;
        
        for (const [id, item] of this.#items) {
            totalItems += item.cantidad;
        }
        
        contador.textContent = totalItems;
    }

    // Renderizar items del carrito
    renderizarItemsCarrito() {
        const listaCarrito = document.getElementById('lista-carrito');
        
        if (this.#items.size === 0) {
            listaCarrito.innerHTML = '<div class="carrito-vacio"><p>Tu carrito está vacío</p><p>¡Descubre nuestros cafés especiales!</p></div>';
            return;
        }

        listaCarrito.innerHTML = '';
        
        // Usando for...of con Map
        for (const [id, item] of this.#items) {
            const elementoItem = document.createElement('div');
            elementoItem.className = 'carrito-item';
            elementoItem.innerHTML = `
                <div class="item-info">
                    <div class="item-imagen">
                        <img src="${item.producto.imagen}" alt="${item.producto.nombre}">
                    </div>
                    <div class="item-detalles">
                        <h4>${item.producto.nombre}</h4>
                        <p class="item-precio">$${item.producto.calcularPrecioConDescuento().toFixed(2)} c/u</p>
                    </div>
                </div>
                <div class="item-controles">
                    <button class="btn-cantidad" onclick="carrito.actualizarCantidad('${id}', ${item.cantidad - 1})">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="carrito.actualizarCantidad('${id}', ${item.cantidad + 1})">+</button>
                    <button class="btn-eliminar" onclick="carrito.eliminarProducto('${id}')">Eliminar</button>
                </div>
            `;
            listaCarrito.appendChild(elementoItem);
        }
    }

    // Actualizar totales
    actualizarTotales() {
        document.getElementById('subtotal').textContent = this.calcularSubtotal().toFixed(2);
        document.getElementById('descuento').textContent = this.calcularDescuento().toFixed(2);
        document.getElementById('envio').textContent = this.obtenerCostoEnvio().toFixed(2);
        document.getElementById('total').textContent = this.calcularTotal().toFixed(2);
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje, tipo) {
        const notificacion = document.getElementById('notificacion');
        notificacion.textContent = mensaje;
        notificacion.className = `notificacion ${tipo} mostrar`;
        
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
        }, 3000);
    }
}

// =============================================
// DATOS Y CONFIGURACIÓN INICIAL
// =============================================

// Array de productos de café con rutas de imágenes
const productos = [
    new Producto('1', 'Café Andino Premium', 24.99, 'grano', 'images/productos/cafe-andino-premium.jpg', 'Café en grano de altura, notas a chocolate y nueces', true),
    new Producto('2', 'Blend Machu Picchu', 19.99, 'grano', 'images/productos/blend-machu-picchu.jpg', 'Mezcla especial con notas frutales y especiadas'),
    new Producto('3', 'Café Orgánico Cusqueño', 22.50, 'grano', 'images/productos/cafe-organico-cusqueno.jpg', 'Cultivado de forma orgánica en las alturas del Cusco'),
    new Producto('4', 'Café Molido Tradicional', 18.99, 'molido', 'images/productos/cafe-molido-tradicional.jpg', 'Molido medio, ideal para prensa francesa'),
    new Producto('5', 'Expresso Inca Gold', 21.75, 'molido', 'images/productos/expresso-inca-gold.jpg', 'Molido fino para espresso, con cuerpo cremoso'),
    new Producto('6', 'Cápsulas Andinas', 12.99, 'capsulas', 'images/productos/capsulas-andinas.jpg', 'Compatibles con Nespresso, pack de 10 unidades'),
    new Producto('7', 'Prensa Francesa Artesanal', 34.99, 'accesorios', 'images/productos/prensa-francesa.jpg', 'Prensa de acero inoxidable de 1 litro'),
    new Producto('8', 'Molino de Café Manual', 29.99, 'accesorios', 'images/productos/molino-cafe-manual.jpg', 'Ajustable para diferentes tipos de molido'),
    new Producto('9', 'Taza Cerámica Tambo', 15.50, 'accesorios', 'images/productos/taza-ceramica.jpg', 'Taza de cerámica artesanal con diseño inca'),
    new Producto('10', 'Kit Catación Profesional', 45.00, 'accesorios', 'images/productos/kit-catacion.jpg', 'Incluye copas, cucharas y termómetro')
];

// Mapa para búsqueda rápida de productos
const mapaProductos = new Map();
productos.forEach(producto => {
    mapaProductos.set(producto.id, producto);
});

// Instancia del carrito
const carrito = new Carrito();

// =============================================
// FUNCIONES PRINCIPALES
// =============================================

// Función para renderizar productos
function renderizarProductos(productosMostrar = productos) {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    if (productosMostrar.length === 0) {
        listaProductos.innerHTML = '<p class="carrito-vacio">No se encontraron productos</p>';
        return;
    }

    productosMostrar.forEach(producto => {
        const precioFinal = producto.enOferta ? 
            producto.calcularPrecioConDescuento() : 
            producto.precio;

        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.innerHTML = `
            <div class="producto-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="producto-info">
                <p class="producto-categoria">${producto.categoria}</p>
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                <div class="producto-precio">
                    <div>
                        ${producto.enOferta ? 
                            `<span class="precio-oferta">$${producto.precio.toFixed(2)}</span>` : 
                            ''
                        }
                        <span class="precio">$${precioFinal.toFixed(2)}</span>
                    </div>
                    <button class="btn-agregar" onclick="agregarAlCarrito('${producto.id}')">
                        Agregar
                    </button>
                </div>
            </div>
        `;
        listaProductos.appendChild(productoElement);
    });
}

// Función de flecha para agregar al carrito
const agregarAlCarrito = (idProducto) => {
    const producto = mapaProductos.get(idProducto);
    if (producto) {
        carrito.agregarProducto(producto);
    }
};

// Función para filtrar productos
function filtrarProductos(categoria) {
    if (categoria === 'todos') {
        renderizarProductos();
    } else {
        const productosFiltrados = productos.filter(producto => producto.categoria === categoria);
        renderizarProductos(productosFiltrados);
    }
}

// Función recursiva para buscar producto por ID
function buscarProductoRecursivo(id, productosArray = productos) {
    if (productosArray.length === 0) return null;
    
    const [primerProducto, ...restoProductos] = productosArray;
    
    if (primerProducto.id === id) {
        return primerProducto;
    }
    
    return buscarProductoRecursivo(id, restoProductos);
}

// Función creciente para calcular total con impuestos
function crearCalculadoraImpuestos(tasaImpuesto) {
    return function(subtotal) {
        return subtotal * (1 + tasaImpuesto / 100);
    };
}

// =============================================
// MANEJO DE EVENTOS
// =============================================

// Eventos de navegación
document.querySelectorAll('.nav-link').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        const seccion = e.target.getAttribute('data-seccion');
        
        // Actualizar navegación activa
        document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
        
        // Mostrar/ocultar secciones
        if (seccion === 'productos') {
            document.getElementById('seccion-productos').style.display = 'block';
            document.getElementById('seccion-carrito').classList.remove('activa');
        } else if (seccion === 'nosotros' || seccion === 'contacto') {
            // En una implementación completa, aquí se mostrarían otras secciones
            document.getElementById('seccion-productos').style.display = 'block';
            document.getElementById('seccion-carrito').classList.remove('activa');
            carrito.mostrarNotificacion('Sección en desarrollo', 'error');
        }
    });
});

// Evento del botón del carrito
document.getElementById('btn-carrito').addEventListener('click', () => {
    document.getElementById('seccion-productos').style.display = 'none';
    document.getElementById('seccion-carrito').classList.add('activa');
    
    // Actualizar navegación
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
});

// Evento del botón explorar
document.getElementById('btn-explorar').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('seccion-productos').scrollIntoView({ behavior: 'smooth' });
});

// Eventos de filtros
document.querySelectorAll('.filtro-btn').forEach(boton => {
    boton.addEventListener('click', (e) => {
        // Actualizar botones activos
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Filtrar productos
        const categoria = e.target.getAttribute('data-categoria');
        filtrarProductos(categoria);
    });
});

// Eventos del carrito
document.getElementById('vaciar-carrito').addEventListener('click', () => {
    carrito.vaciar();
});

document.getElementById('realizar-pedido').addEventListener('click', () => {
    if (carrito.calcularTotal() > 0) {
        carrito.mostrarNotificacion('¡Pedido realizado con éxito! Te contactaremos pronto.', 'exito');
        
        // Temporizador para mostrar mensaje de seguimiento
        setTimeout(() => {
            carrito.mostrarNotificacion('Tu pedido está siendo procesado...', 'exito');
        }, 2000);
        
        // Vaciar carrito después del pedido
        setTimeout(() => {
            carrito.vaciar();
            document.getElementById('seccion-productos').style.display = 'block';
            document.getElementById('seccion-carrito').classList.remove('activa');
        }, 4000);
    } else {
        carrito.mostrarNotificacion('El carrito está vacío', 'error');
    }
});

// Eventos de teclado
document.addEventListener('keydown', (e) => {
    // Escape regresa a productos
    if (e.key === 'Escape') {
        document.getElementById('seccion-productos').style.display = 'block';
        document.getElementById('seccion-carrito').classList.remove('activa');
    }
});

// Aplicar descuento automático después de 10 segundos
setTimeout(() => {
    carrito.aplicarDescuento();
}, 10000);

// =============================================
// INICIALIZACIÓN
// =============================================

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada - Inicializando Tambo del Inka...');
    renderizarProductos();
});
