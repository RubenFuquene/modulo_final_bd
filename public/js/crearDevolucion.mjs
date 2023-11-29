document.addEventListener('DOMContentLoaded', async function () {
  const formulario = document.getElementById('formularioBusqueda');
  const inputNumeroFactura = document.getElementById('numeroFactura');
  const campoTotal = document.getElementById('total');
  const botonIniciarDevolucion = document.getElementById('iniciarDevolución');
  const tablaProductos = document.querySelector('table tbody');

  // Escucha el evento submit del formulario
  formulario.addEventListener('submit', async function (event) {
    // Evita que el formulario se envíe de manera predeterminada
    event.preventDefault();

    // Obtiene el número de factura del formulario
    const numeroFactura = inputNumeroFactura.value;

    // Realiza una solicitud AJAX para obtener la información de la factura
    try {
      // Hacer la solicitud para obtener los productos de la factura
      const response = await fetch(`/facturas/get-factura/${numeroFactura}`, {
          headers: {
          'Accept': 'application/json'
          }
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Error al obtener la factura');
      }

      console.log(data);

      // Llena la tabla con los productos de la factura
      llenarTabla(data.productos);

      // Llena el campo "total" con el valor de la factura
      campoTotal.value = data.totalFactura;
    } catch (error) {
      console.error('Error al cargar la factura:', error);
      // Puedes manejar errores de la solicitud AJAX, por ejemplo, mostrando un mensaje de error
    }
  });

  // Función para llenar la tabla con los productos de la factura
  function llenarTabla(productos) {
    // Limpia la tabla antes de llenarla
    tablaProductos.innerHTML = '';

    // Verifica si hay productos para mostrar
    if (productos && productos.length > 0) {
      // Recorre los productos y agrega filas a la tabla
      productos.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${producto.refProducto}</td>
          <td>${producto.nombre}</td>
          <td>${producto.cantidad}</td>
          <td>${producto.precio}</td>
        `;
        tablaProductos.appendChild(fila);
      });
    } else {
      // Si no hay productos, puedes mostrar un mensaje en la tabla o tomar otra acción
      const mensaje = document.createElement('tr');
      mensaje.innerHTML = '<td colspan="4">No hay productos para mostrar.</td>';
      tablaProductos.appendChild(mensaje);
    }
  }

  // Obtener el valor del atributo de datos
  const scriptElement = document.getElementById('realizarVentaScript');
  const valorCampo = scriptElement.dataset.valorcampo;

  botonIniciarDevolucion.addEventListener('click', async () => {

    // Hacer la solicitud para obtener los productos de la factura para hacer la devolución
    const responseGet = await fetch(`/facturas/get-factura/${inputNumeroFactura.value}`, {
      headers: {
      'Accept': 'application/json'
      }
    });
    const data = await responseGet.json();

    // Obtiene los datos de los productos
    const productos = [];
    const productosDiv = document.querySelectorAll('.producto');
    data.productos.forEach((producto, index) => {
        const codigoProducto = producto.refProducto;
        const nombreProducto = producto.nombre;
        const cantidadProductos = producto.cantidad;
        const precioProducto = producto.precio;
    
        productos.push({codigoProducto, nombreProducto, cantidadProductos, precioProducto})
    });

    // Realiza la solicitud al servidor utilizando fetch
    const response = await fetch('/facturas/crear-factura', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        persona: data.documentoPersona,
        total: data.totalFactura,
        productos,
        tipoFactura: valorCampo == 'VENTA' ? 3 : 4,
        tipoFacturaAnterior: data.tipoFactura,
        numeroFacturaAnterior: data.numeroFactura,
      }),
    });
  })
});
