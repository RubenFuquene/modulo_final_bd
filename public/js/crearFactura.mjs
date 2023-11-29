document.addEventListener('DOMContentLoaded', async function () {
    // Manejar la adición de productos
    const productosContainer = document.getElementById('productosContainer');
    const agregarProductoBtn = document.getElementById('agregarProducto');
    const totalizarBtn = document.getElementById('totalizar');

    // Manejar clic en "Agregar Producto"
    agregarProductoBtn.addEventListener('click', () => {
        const nuevoProducto = document.createElement('div');
        nuevoProducto.className = 'producto';

        const nuevoLabelCodigo = document.createElement('label');
        nuevoLabelCodigo.for = 'codigoProducto';
        nuevoLabelCodigo.textContent = 'Código del Producto:';

        const nuevoInputCodigo = document.createElement('input');
        nuevoInputCodigo.type = 'text';
        nuevoInputCodigo.classList.add('codigoProducto');
        nuevoInputCodigo.name = 'codigoProducto';
        nuevoInputCodigo.required = true;

        const nuevoLabelNombre = document.createElement('label');
        nuevoLabelNombre.for = 'nombreProducto';
        nuevoLabelNombre.textContent = 'Nombre del Producto:';

        const nuevoInputNombre = document.createElement('input');
        nuevoInputNombre.type = 'text';
        nuevoInputNombre.classList.add('nombreProducto');
        nuevoInputNombre.name = 'nombreProducto';
        nuevoInputNombre.readOnly = true;

        const nuevoLabelCantidad = document.createElement('label');
        nuevoLabelCantidad.for = 'cantidadProductos';
        nuevoLabelCantidad.textContent = 'Cantidad de Productos:';

        const nuevoInputCantidad = document.createElement('input');
        nuevoInputCantidad.type = 'number';
        nuevoInputCantidad.classList.add('cantidadProductos');
        nuevoInputCantidad.name = 'cantidadProductos';
        nuevoInputCantidad.required = true;

        const nuevoLabelPrecio = document.createElement('label');
        nuevoLabelPrecio.for = 'precioProducto';
        nuevoLabelPrecio.textContent = 'Precio del Producto:';

        const nuevoInputPrecio = document.createElement('input');
        nuevoInputPrecio.type = 'text';
        nuevoInputPrecio.classList.add('precioProducto');
        nuevoInputPrecio.name = 'precioProducto';
        nuevoInputPrecio.readOnly = true;

        // Agregar los eventos blur
        nuevoInputCodigo.addEventListener('blur', () => {
            agnadirListenerBotón(nuevoInputCodigo, nuevoInputNombre, nuevoInputPrecio);
        });

        nuevoInputCantidad.addEventListener('blur', async () =>{
            multiplicarPrecioPorCantidadProductos(nuevoInputCantidad, nuevoInputPrecio)
        })

        // Agregar los elementos creados al nuevo producto
        nuevoProducto.appendChild(nuevoLabelCodigo);
        nuevoProducto.appendChild(nuevoInputCodigo);

        nuevoProducto.appendChild(nuevoLabelNombre);
        nuevoProducto.appendChild(nuevoInputNombre);

        nuevoProducto.appendChild(nuevoLabelCantidad);
        nuevoProducto.appendChild(nuevoInputCantidad);

        nuevoProducto.appendChild(nuevoLabelPrecio);
        nuevoProducto.appendChild(nuevoInputPrecio);

        productosContainer.appendChild(nuevoProducto);
    });

    const codigoProductoInput = document.querySelector('.codigoProducto');
    const nombreProductoInput = document.querySelector('.nombreProducto');
    const cantidadProductoInput = document.querySelector('.cantidadProductos');
    const precioProductoInput = document.querySelector('.precioProducto');

    codigoProductoInput.addEventListener('blur', async () =>{
        agnadirListenerBotón(codigoProductoInput, nombreProductoInput, precioProductoInput)
    });

    cantidadProductoInput.addEventListener('blur', async () =>{
        multiplicarPrecioPorCantidadProductos(cantidadProductoInput, precioProductoInput)
    })

    // Manejar clic en "Totalizar Factura"
    totalizarBtn.addEventListener('click', () => {
        const campoTotalizador = this.getElementById('total');
        const precioProductos = document.querySelectorAll('.precioProducto');

        let total = 0;

        precioProductos.forEach((precioProducto) => {
            const precio = parseFloat(precioProducto.value) || 0; // Convertir a número, o 0 si no se puede
            total += precio;
        });

        campoTotalizador.value = total;
    });

    //---------------------------------------------------------------------------------------------------------------------------------//
    //-------------------------------------------------      Control del formulario      ----------------------------------------------//

    // Obtener el valor del atributo de datos
    const scriptElement = document.getElementById('realizarVentaScript');
    const valorCampo = scriptElement.dataset.valorcampo;
    
    const formulario = document.getElementById('formularioFactura');

    // Escucha el evento submit del formulario
    formulario.addEventListener('submit', async function (event) {
        // Evita que el formulario se envíe de manera predeterminada
        event.preventDefault();

        // Obtiene los datos del formulario
        const persona = document.getElementById('persona').value;
        const total = document.getElementById('total').value;

        // Obtiene los datos de los productos
        const productos = [];
        const productosDiv = document.querySelectorAll('.producto');
        productosDiv.forEach((producto, index) => {
            const codigoProducto = producto.querySelector('.codigoProducto').value;
            const nombreProducto = producto.querySelector('.nombreProducto').value;
            const cantidadProductos = producto.querySelector('.cantidadProductos').value;
            const precioProducto = producto.querySelector('.precioProducto').value;
        
            productos.push({codigoProducto, nombreProducto, cantidadProductos, precioProducto})
        });

        // Realiza la solicitud al servidor utilizando fetch
        const response = await fetch('/facturas/crear-factura', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                persona,
                total,
                productos,
                tipoFactura: valorCampo == 'VALOR' ? 1 : 2
            }),
        });
    });
});

async function agnadirListenerBotón(codigoInput, nombreInput, precioInput) {
    // Obtener el valor del código del producto
    const codigoProducto = codigoInput.value.trim();

    // Obtener el valor del atributo de datos
    const scriptElement = document.getElementById('realizarVentaScript');
    const valorCampo = scriptElement.dataset.valorcampo;

    // Realizar la solicitud al endpoint para obtener información del producto
    const response = await fetch(`/productos/obtener-producto-por-ref/${codigoProducto}`, {
        headers: {
            'Accept': 'application/json'
        }
    });

    const productoData = await response.json();

    // Actualizar los campos de nombre y precio con los datos obtenidos
    if (productoData) {
        nombreInput.value = productoData.nombre;
        precioInput.value = valorCampo == 'VALOR' ? productoData.ultimoPrecio : productoData.precioCompra;
    } else {
        // Limpiar los campos si no se encuentra el producto
        nombreInput.value = '';
        precioInput.value = '';
    }
}

function multiplicarPrecioPorCantidadProductos(cantidadInput, precioInput) {
    // Obtener el valor del campo cantidadProductos
    const cantidad = parseInt(cantidadInput.value) || 0;

    // Obtener el valor del campo precioProducto
    const precio = parseFloat(precioInput.value) || 0;

    // Calcular el total multiplicando cantidad por precio
    const total = cantidad * precio;

    precioInput.value = total;
}