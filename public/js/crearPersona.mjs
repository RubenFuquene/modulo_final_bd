document.addEventListener('DOMContentLoaded', async function () {
  // Obtener el contenedor de contactos y el botón "Agregar Contacto"
  const contactosContainer = document.getElementById('contactos');
  const agregarContactoBtn = document.getElementById('agregarContacto');

  // Manejar el clic en el botón "Agregar Contacto"
  agregarContactoBtn.addEventListener('click', async function () {
      // Hacer la solicitud para obtener los tipos de contacto
      const response = await fetch('/api/tipos-contacto', {
          headers: {
          'Accept': 'application/json'
          }
      });
      const tiposContacto = await response.json();

      // Crear un nuevo elemento div para el nuevo contacto
      const nuevoContactoDiv = document.createElement('div');

      // Crear el select para el tipo de contacto
      const nuevoTipoContactoSelect = document.createElement('select');
      nuevoTipoContactoSelect.name = 'tipoContacto';
      nuevoTipoContactoSelect.required = true;

      // Agregar opciones al select      
      tiposContacto.forEach(tipo => {
          const opcion = document.createElement('option');
          opcion.value = tipo.id;
          opcion.textContent = tipo.descripcion;
          nuevoTipoContactoSelect.appendChild(opcion);
      });

      // Crear la etiqueta y el input para la descripción del contacto
      const nuevoLabel = document.createElement('label');
      nuevoLabel.for = 'descContacto';
      nuevoLabel.textContent = 'Descripción:';

      const nuevoInput = document.createElement('input');
      nuevoInput.type = 'text';
      nuevoInput.name = 'descContacto';
      nuevoInput.required = true;

      // Agregar los elementos al nuevo contacto
      nuevoContactoDiv.appendChild(nuevoTipoContactoSelect);
      nuevoContactoDiv.appendChild(nuevoLabel);
      nuevoContactoDiv.appendChild(nuevoInput);

      // Agregar el nuevo contacto al contenedor de contactos
      contactosContainer.appendChild(nuevoContactoDiv);
  });

  // Obtener el contenedor de direcciones y el botón "Agregar Dirección"
  const direccionesContainer = document.getElementById('direcciones');
  const agregarDireccionBtn = document.getElementById('agregarDireccion');

  // Manejar el clic en el botón "Agregar Dirección"
  agregarDireccionBtn.addEventListener('click', function () {
    // Crear un nuevo elemento div para la nueva dirección
    const nuevaDireccionDiv = document.createElement('div');

    // Crear la etiqueta y el input para la dirección
    const nuevaLabel = document.createElement('label');
    nuevaLabel.for = 'direccion';
    nuevaLabel.textContent = 'Dirección:';

    const nuevoInput = document.createElement('input');
    nuevoInput.type = 'text';
    nuevoInput.name = 'direccion';
    nuevoInput.required = true;

    // Agregar los elementos a la nueva dirección
    nuevaDireccionDiv.appendChild(nuevaLabel);
    nuevaDireccionDiv.appendChild(nuevoInput);

    // Agregar la nueva dirección al contenedor de direcciones
    direccionesContainer.appendChild(nuevaDireccionDiv);
  });
});