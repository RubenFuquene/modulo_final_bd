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

  const formulario = document.getElementById('formularioPersonas');

  // Escucha el evento submit del formulario
  formulario.addEventListener('submit', async function (event) {
    // Evita que el formulario se envíe de manera predeterminada
    event.preventDefault();

    // Obtiene los datos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const tipoPersona = document.getElementById('tipoPersona').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;

    // Obtiene los datos de los contactos
    const contactos = [];
    const contactosDivs = document.querySelectorAll('#contactos > div');
    contactosDivs.forEach(div => {
        const tipoContacto = div.querySelector('[name="tipoContacto"]').value;
        const descContacto = div.querySelector('[name="descContacto"]').value;
        contactos.push({ tipoContacto, descContacto });
    });

    // Obtiene los datos de las direcciones
    const direcciones = [];
    const direccionesDivs = document.querySelectorAll('#direcciones > div');
    direccionesDivs.forEach(div => {
        const direccion = div.querySelector('[name="direccion"]').value;
        direcciones.push({ direccion });
    });

    // Realiza la solicitud al servidor utilizando fetch
    const response = await fetch('/personas/crear-persona', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          tipoPersona,
          tipoDocumento,
          numeroDocumento
        }),
    });
    
    // Verifica si la solicitud al servidor fue exitosa
    if (!response.ok) {
      console.error('Error al crear persona:', response.statusText);
      return;
    }

    // Obtiene la respuesta como JSON
    const respuestaJSON = await response.json();

    // Itera sobre cada contacto y realiza una solicitud fetch
    const contactosPromises = contactos.map(async contacto => {
      try {
        // Hacer la solicitud para obtener el tipo de contacto
        const responseTC = await fetch(`/api/tipo-contacto-por-id/${contacto.tipoContacto}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!responseTC.ok) {
          console.error('Error al obtener tipo de contacto:', responseTC.statusText);
          return null;
        }

        const tipoContacto = await responseTC.json();

        // Realiza la solicitud fetch para crear un contacto
        const responseCrearContacto = await fetch('/contactos/crear-contacto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tipoContacto: contacto.tipoContacto,
            descTipoContacto: tipoContacto[1],
            numeroDocumento: numeroDocumento,
            idTipoDoc: tipoDocumento,
            idTipoPersona: tipoPersona,
            descContacto: contacto.descContacto,
          })
        });

        // Maneja la respuesta de la API
        if (responseCrearContacto.ok) {
          const data = await responseCrearContacto.json();
          console.log('Contacto creado:', data);
        } else {
          console.error('Error al crear contacto:', responseCrearContacto.statusText);
        }
      } catch (error) {
        console.error('Error en la solicitud fetch:', error.message);
      }
    });

    // Espera a que todas las solicitudes de contactos se completen
    await Promise.all(contactosPromises);

    // Obtener el contenedor del mensaje
    const mensajeContainer = document.getElementById('mensajeContainer');

    // Verifica si hay un mensaje en la respuesta
    if (respuestaJSON && respuestaJSON.mensaje) {
        // Muestra el mensaje en el contenedor
        mensajeContainer.textContent = respuestaJSON.mensaje;

        // Restablece los campos del formulario
        formulario.reset();
    }
  });
});