const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  d.addEventListener('click', async e => {
    if (e.target.matches('#aplicar_filtro') || e.target.matches('#aplicar_filtro *')) {
      Swal.fire({
        title: 'Informe',
        text: '¿Está seguro de continuar?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#9FA6B2',
        confirmButtonColor: '#14A44D',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        customClass: {
          popup: 'swal2-custom-font',
        },
      }).then(async result => {
        if (result.isConfirmed) {
          $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
          /* Definir las variables para los filtros */
          let formdata = new FormData();

          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value);

          try {
            const response = await fetch($('#id_url_ajax').val() + 'informe/Informes_estudios_seguridad', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });

            const data = await response.json();

            // Verificar si los datos están vacíos o son todos cero
            if (!data || (data.Aprobados === null && data.Pendientes === null && data.Rechazados === null)) {
              Swal.fire({
                title: 'Información',
                text: 'No hay información para generar el informe.',
                icon: 'info',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            } else {
              d.getElementById('estudios_aprobados').innerHTML = data.Aprobados;
              d.getElementById('estudios_pendientes').innerHTML = data.Pendientes;
              d.getElementById('estudios_rechazados').innerHTML = data.Rechazados;
              d.getElementById('estudios_gestionados').innerHTML = data.Total_Parcial;
            }
          } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          }
        }
      });
    }

    // if (e.target.matches('#btn_aprobados') || e.target.matches('#btn_aprobados *')) {
    //   if (d.getElementById('estudios_aprobados').textContent === '0') {
    //     Swal.fire({
    //       title: 'Advertencia!',
    //       text: 'No hay información para generar el informe.',
    //       icon: 'warning',
    //       customClass: {
    //         popup: 'swal2-custom-font',
    //       },
    //     });
    //   } else {
    //     $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
    //     /* Definir las variables para los filtros */
    //     let formdata = new FormData();
    //     formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
    //     formdata.append('fecha_final', d.getElementById('fecha_final').value);
    //     formdata.append('estado', 'Aprobado');
    //     try {
    //       const response = await fetch($('#id_url_ajax').val() + 'informe/Informes_estudios_estados', {
    //         method: 'POST',
    //         body: formdata,
    //         cache: 'no-cache',
    //       });
    //       const data = await response.json();
    //       // Verificar si los datos están vacíos o son todos cero
    //       if (!data || (data.Aprobados === null && data.Pendientes === null && data.Rechazados === null)) {
    //         Swal.fire({
    //           title: 'Información',
    //           text: 'No hay información para generar el informe.',
    //           icon: 'info',
    //           customClass: {
    //             popup: 'swal2-custom-font',
    //           },
    //         });
    //       } else {
    //         // Crear la tabla
    //         let tbody = d.getElementById('tbl_informe_estudios_seguridad');
    //         tbody.innerHTML = '';
    //         data.respuesta.forEach(element => {
    //           const fila = d.createElement('tr');

    //           const columnaNudocEstudio = document.createElement('td');
    //           columnaNudocEstudio.innerHTML = element.id_estudio;
    //           columnaNudocEstudio.style.textAlign = 'center';
    //           columnaNudocEstudio.style.borderBottom = '1px solid black';
    //           columnaNudocEstudio.style.width = 'auto';
    //           columnaNudocEstudio.style.whiteSpace = 'nowrap';

    //           const columnaFechaSsolicitudEstudio = document.createElement('td');
    //           columnaFechaSsolicitudEstudio.innerHTML = element.fecha_solicitud;
    //           columnaFechaSsolicitudEstudio.style.textAlign = 'center';
    //           columnaFechaSsolicitudEstudio.style.borderBottom = '1px solid black';
    //           columnaFechaSsolicitudEstudio.style.width = 'auto';
    //           columnaFechaSsolicitudEstudio.style.whiteSpace = 'nowrap';

    //           const columnaPlaca = document.createElement('td');
    //           columnaPlaca.innerHTML = element.placa;
    //           columnaPlaca.style.textAlign = 'center';
    //           columnaPlaca.style.borderBottom = '1px solid black';
    //           columnaPlaca.style.width = 'auto';
    //           columnaPlaca.style.whiteSpace = 'nowrap';

    //           const columnaOperacion = document.createElement('td');
    //           columnaOperacion.innerHTML = element.operacion;
    //           columnaOperacion.style.textAlign = 'center';
    //           columnaOperacion.style.borderBottom = '1px solid black';
    //           columnaOperacion.style.width = 'auto';
    //           columnaOperacion.style.whiteSpace = 'nowrap';

    //           const columnaCliente = document.createElement('td');
    //           columnaCliente.innerHTML = element.Cliente;
    //           columnaCliente.style.textAlign = 'center';
    //           columnaCliente.style.borderBottom = '1px solid black';
    //           columnaCliente.style.width = 'auto';
    //           columnaCliente.style.whiteSpace = 'nowrap';

    //           const columnaUsuarioSolicitante = document.createElement('td');
    //           columnaUsuarioSolicitante.innerHTML = element.usuario;
    //           columnaUsuarioSolicitante.style.textAlign = 'center';
    //           columnaUsuarioSolicitante.style.borderBottom = '1px solid black';
    //           columnaUsuarioSolicitante.style.width = 'auto';
    //           columnaUsuarioSolicitante.style.whiteSpace = 'nowrap';

    //           const columnaEstado = document.createElement('td');
    //           columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
    //           columnaEstado.style.textAlign = 'center';
    //           columnaEstado.style.borderBottom = '1px solid black';
    //           columnaEstado.style.width = 'auto';
    //           columnaEstado.style.whiteSpace = 'nowrap';

    //           const columnaAcciones = d.createElement('td');
    //           // columnaAcciones.innerHTML = `<a class="icon btn-detalle-estudios" data-id="${element.id_estudio}" href="#" title="Listar Manifiestos"><i class="far fa-plus-square fa-2x"></i></a>`;
    //           columnaAcciones.innerHTML = `<button class="btn btn-space btn-primary btn-xs"> <i class="far fa-plus-square"></i> Interacciones</button>`;
    //           columnaAcciones.setAttribute('class', 'actions');
    //           columnaAcciones.style.textAlign = 'center';
    //           columnaAcciones.style.borderBottom = '1px solid black';
    //           columnaAcciones.style.width = 'auto';
    //           columnaAcciones.style.whiteSpace = 'nowrap';

    //           fila.appendChild(columnaNudocEstudio);
    //           fila.appendChild(columnaPlaca);
    //           fila.appendChild(columnaFechaSsolicitudEstudio);
    //           fila.appendChild(columnaOperacion);
    //           fila.appendChild(columnaCliente);
    //           fila.appendChild(columnaUsuarioSolicitante);
    //           fila.appendChild(columnaEstado);
    //           fila.appendChild(columnaAcciones);
    //           // fila.appendChild(columnaFechaManifiestoServicioEspecial);
    //           // fila.appendChild(columnaValorServicioEspecial);

    //           tbody.appendChild(fila);
    //         });
    //       }
    //     } catch (error) {
    //       console.error('Error en la solicitud:', error);
    //       throw error;
    //     } finally {
    //       $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    //     }
    //   }
    // }
  });

  document.querySelectorAll('.btn_estados').forEach(function(button) {
    // Obtiene el valor de data-id de cada botón
    const estadoId = button.getAttribute('data-id');
    // console.log('Estado ID:', estadoId);

    // Agrega una acción para cuando se haga clic en el botón
    button.addEventListener('click', async function() {
      // console.log('Se ha hecho clic en el botón con estado:', estadoId);
      // Aquí puedes añadir el código para realizar una acción con el estadoId
      if (d.getElementById('estudios_aprobados').textContent === '0' || d.getElementById('estudios_pendientes').textContent === '0' || d.getElementById('estudios_rechazados').textContent === '0') {
        Swal.fire({
          title: 'Advertencia!',
          text: 'No hay información para generar el informe.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
        $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
        /* Definir las variables para los filtros */
        let formdata = new FormData();
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value);
        formdata.append('estado', estadoId);
        try {
          const response = await fetch($('#id_url_ajax').val() + 'informe/Informes_estudios_estados', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });
          const data = await response.json();
          // Verificar si los datos están vacíos o son todos cero
          if (!data || (data.Aprobados === null && data.Pendientes === null && data.Rechazados === null)) {
            Swal.fire({
              title: 'Información',
              text: 'No hay información para generar el informe.',
              icon: 'info',
              customClass: {
                popup: 'swal2-custom-font',
              },
            });
          } else {
            // Crear la tabla
            let tbody = d.getElementById('tbl_informe_estudios_seguridad');
            tbody.innerHTML = '';
            data.respuesta.forEach(element => {
              const fila = d.createElement('tr');

              const columnaNudocEstudio = document.createElement('td');
              columnaNudocEstudio.innerHTML = element.id_estudio;
              columnaNudocEstudio.style.textAlign = 'center';
              columnaNudocEstudio.style.borderBottom = '1px solid black';
              columnaNudocEstudio.style.width = 'auto';
              columnaNudocEstudio.style.whiteSpace = 'nowrap';

              const columnaFechaSsolicitudEstudio = document.createElement('td');
              columnaFechaSsolicitudEstudio.innerHTML = element.fecha_solicitud;
              columnaFechaSsolicitudEstudio.style.textAlign = 'center';
              columnaFechaSsolicitudEstudio.style.borderBottom = '1px solid black';
              columnaFechaSsolicitudEstudio.style.width = 'auto';
              columnaFechaSsolicitudEstudio.style.whiteSpace = 'nowrap';

              const columnaPlaca = document.createElement('td');
              columnaPlaca.innerHTML = element.placa;
              columnaPlaca.style.textAlign = 'center';
              columnaPlaca.style.borderBottom = '1px solid black';
              columnaPlaca.style.width = 'auto';
              columnaPlaca.style.whiteSpace = 'nowrap';

              const columnaOperacion = document.createElement('td');
              columnaOperacion.innerHTML = element.operacion;
              columnaOperacion.style.textAlign = 'center';
              columnaOperacion.style.borderBottom = '1px solid black';
              columnaOperacion.style.width = 'auto';
              columnaOperacion.style.whiteSpace = 'nowrap';

              const columnaCliente = document.createElement('td');
              columnaCliente.innerHTML = element.Cliente;
              columnaCliente.style.textAlign = 'center';
              columnaCliente.style.borderBottom = '1px solid black';
              columnaCliente.style.width = 'auto';
              columnaCliente.style.whiteSpace = 'nowrap';

              const columnaUsuarioSolicitante = document.createElement('td');
              columnaUsuarioSolicitante.innerHTML = element.usuario;
              columnaUsuarioSolicitante.style.textAlign = 'center';
              columnaUsuarioSolicitante.style.borderBottom = '1px solid black';
              columnaUsuarioSolicitante.style.width = 'auto';
              columnaUsuarioSolicitante.style.whiteSpace = 'nowrap';

              const columnaEstado = document.createElement('td');
              if (element.estado == 'Aprobado') {
                columnaEstado.innerHTML = `<span class="label label-success">${element.estado}</span>`;
              } else if (element.estado === 'Pendiente') {
                columnaEstado.innerHTML = `<span class="label label-warning">${element.estado}</span>`;
              } else {
                columnaEstado.innerHTML = `<span class="label label-danger">${element.estado}</span>`;
              }
              columnaEstado.style.textAlign = 'center';
              columnaEstado.style.borderBottom = '1px solid black';
              columnaEstado.style.width = 'auto';
              columnaEstado.style.whiteSpace = 'nowrap';

              const columnaAcciones = d.createElement('td');
              // columnaAcciones.innerHTML = `<a class="icon btn-detalle-estudios" data-id="${element.id_estudio}" href="#" title="Listar Manifiestos"><i class="far fa-plus-square fa-2x"></i></a>`;
              columnaAcciones.innerHTML = `<button class="btn btn-space btn-primary btn-xs"> <i class="far fa-plus-square"></i> Interacciones</button>`;
              columnaAcciones.setAttribute('class', 'actions');
              columnaAcciones.style.textAlign = 'center';
              columnaAcciones.style.borderBottom = '1px solid black';
              columnaAcciones.style.width = 'auto';
              columnaAcciones.style.whiteSpace = 'nowrap';

              fila.appendChild(columnaNudocEstudio);
              fila.appendChild(columnaPlaca);
              fila.appendChild(columnaFechaSsolicitudEstudio);
              fila.appendChild(columnaOperacion);
              fila.appendChild(columnaCliente);
              fila.appendChild(columnaUsuarioSolicitante);
              fila.appendChild(columnaEstado);
              fila.appendChild(columnaAcciones);
              // fila.appendChild(columnaFechaManifiestoServicioEspecial);
              // fila.appendChild(columnaValorServicioEspecial);

              tbody.appendChild(fila);
            });
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
          throw error;
        } finally {
          $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
      }
    });
  });

  // Botones para exportar las remesas
  d.getElementById('exportar_excel').addEventListener('click', function() {
    var table = d.getElementById('informe_de_servicios_especiales');

    // Preprocesar la tabla para asegurar que los valores con formato de moneda sean tratados como texto
    Array.from(table.getElementsByTagName('td')).forEach(function(td) {
      if (td.innerText.includes('$') || td.innerText.includes(',')) {
        td.setAttribute('data-t', 's'); // Marcar como texto
      }
    });

    // Crear el libro de Excel a partir de la tabla
    var wb = XLSX.utils.table_to_book(table);

    // Aplicar estilo al thead (color de fondo y otros)
    var ws = wb.Sheets[wb.SheetNames[0]];

    // Definir estilo para el thead
    var rangoEncabezado = XLSX.utils.decode_range(ws['!ref']); // Obtener el rango de la tabla
    for (let C = rangoEncabezado.s.c; C <= rangoEncabezado.e.c; ++C) {
      var cell = ws[XLSX.utils.encode_cell({r: 0, c: C})]; // Fila 0 es el thead
      if (!cell.s) cell.s = {};
      cell.s.fill = {
        patternType: 'solid',
        fgColor: {rgb: '3B71CA'}, // Color de fondo amarillo
      };
    }

    // Añadir filtros al thead
    ws['!autofilter'] = {
      ref: XLSX.utils.encode_range(rangoEncabezado),
    };

    // Ajustar ancho de las columnas
    ws['!cols'] = [
      {wpx: 120}, // Columna 1 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 320}, // Ajusta el tamaño de las columnas según el contenido
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
      {wpx: 120}, // Columna 2 ancho en píxeles
    ];

    // Crear contenido de archivo con fecha
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe_de_servicios_especiales - ${fechaActual}.xlsx`;
    XLSX.writeFile(wb, nombreArchivo);
  });
});
