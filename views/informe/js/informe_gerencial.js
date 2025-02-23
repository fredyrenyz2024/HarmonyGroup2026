const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();

  let originalTableHTML = document.getElementById('cantidad_progreso').innerHTML;

  d.addEventListener('click', async e => {
    if (e.target.matches('#filtrar') || e.target.matches('#filtrar *')) {
      var filtro = d.getElementById('filtro').value;
      if (filtro === '') {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Debe seleccionar una opción del filtro.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
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

            if (filtro === 'Mes') {
              formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_mes').value : d.getElementById('fecha_inicial').value);
              formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_mes').value : d.getElementById('fecha_final').value);
              formdata.append('cliente', '');
              formdata.append('filtro', d.getElementById('filtro').value);
            } else {
              formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_fc').value : d.getElementById('fecha_inicial').value);
              formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_fc').value : d.getElementById('fecha_final').value);
              formdata.append('cliente', d.getElementById('cliente_id').value === '' ? d.getElementById('fecha_cliente_id').value : d.getElementById('cliente_id').value);
              formdata.append('filtro', d.getElementById('filtro').value);
            }

            try {
              const response = await fetch($('#id_url_ajax').val() + 'informe/generar_informe_totales', {
                method: 'POST',
                body: formdata,
                cache: 'no-cache',
              });

              const data = await response.json();
              if (data.Remesas.status === 204 && data.Manifiestos.status === 204 && data.Anticipos.status === 204) {
                Swal.fire({
                  title: 'Información',
                  text: 'No hay información para generar el informe.',
                  icon: 'info',
                  customClass: {
                    popup: 'swal2-custom-font',
                  },
                });
                d.getElementById('cantidad_remesas').innerHTML = '0';
                d.getElementById('total_remesas').innerHTML = '$0.00';
                d.getElementById('cantidad_progreso').innerHTML = '0%';
                reiniciarBarraDeProgresoRemesas();
                // MAnifiestos
                d.getElementById('cantidad_manifiestos').innerHTML = '0';
                d.getElementById('total_manifiestos').innerHTML = '$0.00';
                d.getElementById('cantidad_manifiesto_progreso').innerHTML = '0%';
                reiniciarBarraDeProgresoManifiestos();
                //Anticipos
                d.getElementById('cantidad_anticipos').innerHTML = '0';
                d.getElementById('total_anticipos').innerHTML = '$0.00';

                //Objetos de detalles de informacion
                // d.getElementById('title_inicial').style.display = 'none';
                // d.getElementById('titulo_cliente_seleccionado').style.display = 'none';
                // d.getElementById('cliente_list_remesas').style.display = 'none';
                // d.getElementById('cliente_list_remesas').innerHTML = '';
                // d.querySelector('.form-inline').style.display = 'none';
              } else {
                if (data.Remesas.status === 200) {
                  animateValueCantidad('cantidad_remesas', 0, data.Remesas.data.Cantidad_remesas, 3000, true);
                  animateValue('total_remesas', 0, data.Remesas.data.Total_valor_remesa, 8000, true);

                  //Barra de las cantidad de remesas
                  let ancho_cantidad = 100 * data.Remesas.data.Cantidad_remesas / d.getElementById('remesa_meta').value; // Porcentaje de ejemplo

                  // Redondear el ancho_cantidad a dos decimales
                  ancho_cantidad = Math.round(ancho_cantidad * 100) / 100;

                  // Actualizar la barra de progreso
                  $('#cantidad_progreso').css('width', ancho_cantidad + '%');
                  $('#cantidad_progreso').attr('aria-valuenow', ancho_cantidad); // Para accesibilidad
                  $('#cantidad_progreso').html(ancho_cantidad + '%'); // Mostrar el porcentaje redondeado

                  // Cambiar el color según el valor de la barra
                  if (ancho_cantidad < 50) {
                    $(document).ready(function() {
                      $('#cantidad_progreso')
                        .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                        .addClass('progress-bar-danger')
                        .css('color', '#FFFFFF')
                        .attr('data-toggle', 'tooltip')
                        .attr('data-placement', 'bottom')
                        .attr('title', 'KPI: ' + d.getElementById('remesa_meta').value) // Definir el contenido del tooltip
                        .tooltip(); // Inicializar el tooltip
                    });
                  } else if (ancho_cantidad >= 50 && ancho_cantidad < 75) {
                    $('#cantidad_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-warning')
                      .css('color', '#FFFFFF')
                      .attr('data-toggle', 'tooltip')
                      .attr('data-placement', 'bottom')
                      .attr('title', 'KPI: ' + d.getElementById('remesa_meta').value) // Definir el contenido del tooltip
                      .tooltip(); // Inicializar el tooltip
                  } else {
                    $('#cantidad_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-success')
                      .css('color', '#FFFFFF')
                      .attr('data-toggle', 'tooltip')
                      .attr('data-placement', 'bottom')
                      .attr('title', 'KPI: ' + d.getElementById('remesa_meta').value) // Definir el contenido del tooltip
                      .tooltip(); // Inicializar el tooltip
                  }

                  //Barra de las monto de remesas
                  let ancho_total = 100 * data.Remesas.data.Total_valor_remesa / d.getElementById('total_remesa_meta').value; // Porcentaje de la barra de progrerso

                  // Redondear el ancho_total a dos decimales
                  ancho_total = Math.round(ancho_total * 100) / 100;

                  // Actualizar la barra de progreso
                  $('#total_progreso').css('width', ancho_total + '%');
                  $('#total_progreso').attr('aria-valuenow', ancho_total); // Para accesibilidad
                  $('#total_progreso').html(ancho_total + '%'); // Mostrar el porcentaje redondeado

                  // Cambiar el color según el valor de la barra
                  if (ancho_total < 50) {
                    $('#total_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-danger')
                      .css('color', '#FFFFFF')
                      .attr('data-toggle', 'tooltip')
                      .attr('data-placement', 'bottom')
                      .attr(
                        'title',
                        'KPI: ' +
                          d.getElementById('total_remesa_meta').value.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                          }),
                      ) // Definir el contenido del tooltip
                      .tooltip(); // Inicializar el tooltip
                  } else if (ancho_total >= 50 && ancho_total < 75) {
                    $('#total_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-warning')
                      .css('color', '#FFFFFF')
                      .attr('data-toggle', 'tooltip')
                      .attr('data-placement', 'bottom')
                      .attr(
                        'title',
                        'KPI: ' +
                          d.getElementById('total_remesa_meta').value.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                          }),
                      ) // Definir el contenido del tooltip
                      .tooltip(); // Inicializar el tooltip
                  } else {
                    $('#total_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-success')
                      .css('color', '#FFFFFF')
                      .attr('data-toggle', 'tooltip')
                      .attr('data-placement', 'bottom')
                      .attr(
                        'title',
                        'KPI: ' +
                          d.getElementById('total_remesa_meta').value.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                          }),
                      ) // Definir el contenido del tooltip
                      .tooltip(); // Inicializar el tooltip
                  }
                } else {
                  d.getElementById('cantidad_remesas').innerHTML = '0';
                  d.getElementById('total_remesas').innerHTML = '$0.00';
                  d.getElementById('cantidad_progreso').innerHTML = '0%';
                  reiniciarBarraDeProgresoRemesas();
                }

                if (data.Manifiestos.status === 200) {
                  animateValueCantidad('cantidad_manifiestos', 0, data.Manifiestos.data.Cantidad_manifiestos, 3000, true);
                  animateValue('total_manifiestos', 0, data.Manifiestos.data.Total_valor_manifiestos, 8000, true);

                  //Barra de las cantidad de remesas
                  let ancho_cantidad = 100 * data.Manifiestos.data.Cantidad_manifiestos / d.getElementById('manifiesto_meta').value; // Porcentaje de ejemplo

                  // Redondear el ancho_cantidad a dos decimales
                  ancho_cantidad = Math.round(ancho_cantidad * 100) / 100;

                  // Actualizar la barra de progreso
                  $('#cantidad_manifiesto_progreso').css('width', ancho_cantidad + '%');
                  $('#cantidad_manifiesto_progreso').attr('aria-valuenow', ancho_cantidad); // Para accesibilidad
                  $('#cantidad_manifiesto_progreso').html(ancho_cantidad + '%'); // Mostrar el porcentaje redondeado

                  // Cambiar el color según el valor de la barra
                  if (ancho_cantidad < 50) {
                    $('#cantidad_manifiesto_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-danger')
                      .css('color', '#FFFFFF')
                      .attr('title', 'KPI: ' + d.getElementById('manifiesto_meta').value) // Añadir el tooltip
                      .tooltip();
                  } else if (ancho_cantidad >= 50 && ancho_cantidad < 75) {
                    $('#cantidad_manifiesto_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-warning')
                      .css('color', '#FFFFFF')
                      .attr('title', 'KPI: ' + d.getElementById('manifiesto_meta').value) // Añadir el tooltip
                      .tooltip();
                  } else {
                    $('#cantidad_manifiesto_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-success')
                      .css('color', '#FFFFFF')
                      .attr('title', 'KPI: ' + d.getElementById('manifiesto_meta').value) // Añadir el tooltip
                      .tooltip();
                  }

                  //Barra de las monto de remesas
                  let ancho_total = 100 * data.Manifiestos.data.Total_valor_manifiestos / d.getElementById('total_manifiesto_meta').value; // Porcentaje de la barra de progrerso

                  // Redondear el ancho_total a dos decimales
                  ancho_total = Math.round(ancho_total * 100) / 100;

                  // Actualizar la barra de progreso
                  $('#total_manifiesto_progreso').css('width', ancho_total + '%');
                  $('#total_manifiesto_progreso').attr('aria-valuenow', ancho_total); // Para accesibilidad
                  $('#total_manifiesto_progreso').html(ancho_total + '%'); // Mostrar el porcentaje redondeado

                  // Cambiar el color según el valor de la barra
                  if (ancho_total < 50) {
                    $('#total_manifiesto_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-danger')
                      .css('color', '#FFFFFF')
                      .attr('title', 'KPI: ' + d.getElementById('total_manifiesto_meta').value) // Añadir el tooltip
                      .tooltip();
                  } else if (ancho_total >= 50 && ancho_total < 75) {
                    $('#total_manifiesto_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-warning')
                      .css('color', '#FFFFFF')
                      .attr('title', 'KPI: ' + d.getElementById('total_manifiesto_meta').value) // Añadir el tooltip
                      .tooltip();
                  } else {
                    $('#total_manifiesto_progreso')
                      .removeClass('progress-bar-success progress-bar-warning progress-bar-danger')
                      .addClass('progress-bar-success')
                      .css('color', '#FFFFFF')
                      .attr('title', 'KPI: ' + d.getElementById('total_manifiesto_meta').value) // Añadir el tooltip
                      .tooltip();
                  }
                } else {
                  d.getElementById('cantidad_manifiestos').innerHTML = '0';
                  d.getElementById('total_manifiestos').innerHTML = '$0.00';
                  d.getElementById('cantidad_manifiesto_progreso').innerHTML = '0%';
                  reiniciarBarraDeProgresoManifiestos();
                }

                if (data.Anticipos.status === 200) {
                  animateValueCantidad('cantidad_anticipos', 0, data.Anticipos.data.Cantidad_anticipos, 3000, true);
                  animateValue('total_anticipos', 0, parseFloat(data.Anticipos.data.Total_valor_anticipos), 8000, true);
                } else {
                  d.getElementById('cantidad_anticipos').innerHTML = '0';
                  d.getElementById('total_anticipos').innerHTML = '$0.00';
                }
              }
            } catch (error) {
              console.error('Error en la primera solicitud:', error);
              throw error;
            } finally {
              $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
            }
          }
        });
      }
    }

    //Boton para las tabla de la remesas
    if (e.target.matches('#btn_list_remesas') || e.target.matches('#btn_list_remesas *')) {
      //Validar que si halla informacion en las tarjetas para mostrar las tablas
      if (d.getElementById('filtro').value === '') {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Debe seleccionar una opción del filtro.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else if (d.getElementById('total_remesas').textContent === '$0.00') {
        Swal.fire({
          title: 'Información',
          text: 'No hay información para mostrar en la tabla de remesas.',
          icon: 'info',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
        d.getElementById('tbl_remesas_general').style.display = 'block';
        d.getElementById('tbl-remesas-lista').style.display = 'block';
        d.getElementById('tbl-anticipos-lista').style.display = 'none';
        d.getElementById('tbl-manifiestos-lista').style.display = 'none';
        const table = d.getElementById('miTabla');
        table.classList.add('table-animated');

        let formdata = new FormData();
        // formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        // formdata.append('fecha_final', d.getElementById('fecha_final').value);
        if (d.getElementById('filtro').value === 'Mes') {
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_mes').value : d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_mes').value : d.getElementById('fecha_final').value);
          formdata.append('cliente', '');
        } else {
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_fc').value : d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_fc').value : d.getElementById('fecha_final').value);
          formdata.append('cliente', d.getElementById('cliente_id').value === '' ? d.getElementById('fecha_cliente_id').value : d.getElementById('cliente_id').value);
        }

        try {
          const response = await fetch($('#id_url_ajax').val() + 'informe/listar_remesas_informe', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });

          const data = await response.json();
          if (data) {
            const arrayData = Object.values(data);
            let tbody = d.getElementById('tbody_cliente_remesas');
            tbody.innerHTML = '';

            let template = '<option value="">Filtrar por cliente</option>';
            var array_remesas = [];

            // Arrays para Chart.js
            let clientes = [];
            let totales = [];

            for (let key in arrayData) {
              if (arrayData.hasOwnProperty(key)) {
                let element = arrayData[key];

                for (let b = 0; b < element.remesas.length; b++) {
                  array_remesas.push(element.remesas[b].id_remesa);
                }

                var remesas_acumuladas = array_remesas.join(', ');

                const fila = d.createElement('tr');

                const columnaCliente = d.createElement('td');
                columnaCliente.innerHTML = element.nombre;
                columnaCliente.style.textAlign = 'left';
                columnaCliente.style.paddingLeft = '15px';

                const columnaCantidadRemesas = d.createElement('td');
                columnaCantidadRemesas.innerHTML = element.cantidad_remesas;
                columnaCantidadRemesas.style.textAlign = 'center';

                const columnaTotalRemesas = d.createElement('td');
                columnaTotalRemesas.innerHTML = element.total_valores_remesas.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                });
                columnaTotalRemesas.style.textAlign = 'center';

                const columnaAcciones = d.createElement('td');
                columnaAcciones.innerHTML = `<a class="icon btn-detalle-remesas" data-id="${element.cliente_id}" href="#" title="Listar Remesas"><i class="mdi mdi-plus-circle-o"></i></a>`;
                columnaAcciones.setAttribute('class', 'actions');
                columnaAcciones.style.textAlign = 'center';

                fila.appendChild(columnaCliente);
                fila.appendChild(columnaCantidadRemesas);
                fila.appendChild(columnaTotalRemesas);
                fila.appendChild(columnaAcciones);
                tbody.appendChild(fila);

                // Añadir los datos para la gráfica
                clientes.push(element.nombre);
                totales.push(element.total_valores_remesas);
              }
            }
            $('#filtro_clientes').html = '';
            arrayData.forEach(element => {
              $('#filtro_clientes').append('<option value="' + element.cliente_id + '">' + element.nombre + '</option>');
            });
          } else {
            console.error('No se recibieron datos válidos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          $('#loading-overlay-nexosapp ').css('display', 'none');
        }
      }
    }

    if (e.target.matches('.btn-detalle-remesas') || e.target.matches('.btn-detalle-remesas *')) {
      let padre = e.target.parentElement.parentElement;
      d.getElementById('list_remesas_cliente').style.display = 'block';
      d.getElementById('titulo_cliente_seleccionado').style.display = 'block';
      d.getElementById('btn-limpiar-filtros').style.display = 'block';
      d.getElementById('miTabla').classList.add('hidden');
      d.getElementById('title_inicial').style.display = 'none';
      // d.getElementById('btn-principal').style.display = 'none';
      d.getElementById('btn-principal').classList.remove('hidden');
      d.getElementById('btn-principal').classList.add('visible');
      d.getElementById('btn-detalle-remesa-cliente').classList.add('hidden');
      var btn_cliente = padre.querySelector('.btn-detalle-remesas');
      const cliente_id = btn_cliente.getAttribute('data-id');
      let formdata = new FormData();
      // formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
      // formdata.append('fecha_final', d.getElementById('fecha_final').value);
      if (d.getElementById('filtro').value === 'Mes') {
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_mes').value : d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_mes').value : d.getElementById('fecha_final').value);
        formdata.append('cliente_id', cliente_id);
      } else {
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_fc').value : d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_fc').value : d.getElementById('fecha_final').value);
        formdata.append('cliente_id', cliente_id);
      }

      try {
        const response = await fetch($('#id_url_ajax').val() + 'informe/lista_remesas_cliente', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });

        const data = await response.json();
        if (data) {
          let tbody = d.getElementById('tbody_remesas_cliente');
          let tfoot = d.getElementById('tfoot_remesas_cliente');
          tbody.innerHTML = '';
          tfoot.innerHTML = '';

          // Inicializamos la variable para acumular el total
          let totalTarifaCalculada = 0;
          let totalPesoCalculado = 0;
          d.getElementById('cliente_list_remesas').innerHTML = ``;
          d.getElementById('cliente_list_remesas').innerHTML = data.resultados[0].nombre;
          data.resultados.forEach(element => {
            const fila = d.createElement('tr');

            const columnaRemesaCliente = d.createElement('td');
            columnaRemesaCliente.innerHTML = element.remesa_id;
            columnaRemesaCliente.style.textAlign = 'left';
            columnaRemesaCliente.style.paddingLeft = '15px';

            const columnaTarifaRemesaCliente = d.createElement('td');
            const tarifaCalculada = parseFloat(element.total_tarifacalculada);
            const pesoCalculado = parseFloat(element.cantidad_real_cargada);

            columnaTarifaRemesaCliente.innerHTML = tarifaCalculada.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            });
            columnaTarifaRemesaCliente.style.textAlign = 'center';
            columnaTarifaRemesaCliente.style.paddingLeft = '15px';

            // Sumar la tarifa calculada al total
            totalTarifaCalculada += tarifaCalculada;
            totalPesoCalculado += pesoCalculado;

            const columnaRemesaCoductor = d.createElement('td');
            columnaRemesaCoductor.innerHTML = element.conductor;
            columnaRemesaCoductor.style.textAlign = 'left';
            columnaRemesaCoductor.style.paddingLeft = '15px';

            const columnaRemesaPlaca = d.createElement('td');
            columnaRemesaPlaca.innerHTML = element.placa;
            columnaRemesaPlaca.style.textAlign = 'center';
            columnaRemesaPlaca.style.paddingLeft = '15px';

            const columnaRemesaMercancia = d.createElement('td');
            columnaRemesaMercancia.innerHTML = element.tipo_mercancia;
            columnaRemesaMercancia.style.textAlign = 'center';
            columnaRemesaMercancia.style.paddingLeft = '15px';

            const columnaRemesaCantidadCargada = d.createElement('td');
            // columnaRemesaCantidadCargada.innerHTML = kilolitrosAToneladas(element.cantidad_real_cargada) + ' Tn';
            columnaRemesaCantidadCargada.innerHTML = element.cantidad_real_cargada + ' Kg';
            columnaRemesaCantidadCargada.style.textAlign = 'center';
            columnaRemesaCantidadCargada.style.paddingLeft = '15px';

            const columnaRemesaFecha = d.createElement('td');
            columnaRemesaFecha.innerHTML = element.feha_remesa;
            columnaRemesaFecha.style.textAlign = 'center';
            columnaRemesaFecha.style.paddingLeft = '15px';

            fila.appendChild(columnaRemesaCliente);
            fila.appendChild(columnaRemesaFecha);
            fila.appendChild(columnaRemesaCoductor);
            fila.appendChild(columnaRemesaPlaca);
            fila.appendChild(columnaRemesaMercancia);
            fila.appendChild(columnaRemesaCantidadCargada);
            fila.appendChild(columnaTarifaRemesaCliente);

            tbody.appendChild(fila);
          });

          // Crear la fila en el pie de tabla (tfoot) para mostrar el total
          const filaTotal = d.createElement('tr');

          // Celda de texto para el total del peso (alineado en la columna correcta)
          const columnaTotalTextoPeso = d.createElement('td');
          columnaTotalTextoPeso.colSpan = 5; // Ajusta según la estructura de tu tabla
          columnaTotalTextoPeso.style.textAlign = 'right';
          columnaTotalTextoPeso.style.fontWeight = '900';
          columnaTotalTextoPeso.style.fontSize = '15px';
          columnaTotalTextoPeso.innerHTML = 'Total:';

          // Celda para el total del peso (debe estar alineado con la columnaRemesaCantidadCargada)
          const columnaTotalPeso = d.createElement('td');
          columnaTotalPeso.innerHTML = totalPesoCalculado + ' Kg'; // Formato de peso
          columnaTotalPeso.style.textAlign = 'center';
          columnaTotalPeso.style.fontWeight = '900';
          columnaTotalPeso.style.fontSize = '15px';

          // Celda de texto para el total de la tarifa (alineado en la columna correcta)
          // const columnaTotalTextoTarifa = d.createElement('td');
          // columnaTotalTextoTarifa.colSpan = 1; // Alineado con la columnaTarifaRemesaCliente
          // columnaTotalTextoTarifa.style.textAlign = 'right';
          // columnaTotalTextoTarifa.style.fontWeight = '900';
          // columnaTotalTextoTarifa.style.fontSize = '15px';
          // columnaTotalTextoTarifa.innerHTML = 'Total Tarifa Calculada:';

          // Celda para el total de la tarifa calculada
          const columnaTotalValorTarifa = d.createElement('td');
          columnaTotalValorTarifa.innerHTML = totalTarifaCalculada.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          });
          columnaTotalValorTarifa.style.textAlign = 'center';
          columnaTotalValorTarifa.style.fontWeight = '900';
          columnaTotalValorTarifa.style.fontSize = '15px';

          // Agregar columnas a la fila de total
          filaTotal.appendChild(columnaTotalTextoPeso);
          filaTotal.appendChild(columnaTotalPeso);
          // filaTotal.appendChild(columnaTotalTextoTarifa);
          filaTotal.appendChild(columnaTotalValorTarifa);

          // Agregar la fila al pie de tabla
          tfoot.appendChild(filaTotal);

          // arrayData.forEach(element => {
          //   // Aquí va la lógica para cada elemento
          //   $('#filtro_clientes').append('<option value="' + element.cliente_id + '">' + element.nombre + '</option>');
          // });
        } else {
          console.error('No se recibieron datos válidos');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none');
      }
    }

    // Tabla para manifiestos
    if (e.target.matches('#btn_list_manifiestos') || e.target.matches('#btn_list_manifiestos *')) {
      if (d.getElementById('filtro').value === '') {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Debe seleccionar una opción del filtro.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else if (d.getElementById('total_manifiestos').textContent === '$0.00') {
        Swal.fire({
          title: 'Información',
          text: 'No hay información para mostrar en la tabla de manifiestos.',
          icon: 'info',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
        d.getElementById('tbl_remesas_general').style.display = 'block';
        // d.getElementById('tbl-remesas-lista').style.display = 'none';
        d.getElementById('tbl-remesas-lista').style.display = 'none';
        d.getElementById('tbl-anticipos-lista').style.display = 'none';
        d.getElementById('tbl-manifiestos-lista').style.display = 'block';

        const table = d.getElementById('miTablaManifiestos');
        table.classList.add('table-animated');

        let formdata = new FormData();
        // formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        // formdata.append('fecha_final', d.getElementById('fecha_final').value);
        if (d.getElementById('filtro').value === 'Mes') {
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_mes').value : d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_mes').value : d.getElementById('fecha_final').value);
        } else {
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_fc').value : d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_fc').value : d.getElementById('fecha_final').value);
        }

        try {
          const response = await fetch($('#id_url_ajax').val() + 'informe/listar_manifiestos_informe', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });

          const data = await response.json();
          if (data) {
            const arrayData = Object.values(data);
            let tbody = d.getElementById('tbody_cliente_manifiestos');
            tbody.innerHTML = '';

            let template = '<option value="">Filtrar por cliente</option>';
            var array_remesas = [];

            // Arrays para Chart.js
            let clientes = [];
            let totales = [];

            for (let key in arrayData) {
              if (arrayData.hasOwnProperty(key)) {
                let element = arrayData[key];

                const fila = d.createElement('tr');

                const columnaCliente = d.createElement('td');
                columnaCliente.innerHTML = element.nombre;
                columnaCliente.style.textAlign = 'left';
                columnaCliente.style.paddingLeft = '15px';

                const columnaCantidadRemesas = d.createElement('td');
                columnaCantidadRemesas.innerHTML = element.cantidad_manifiestos;
                columnaCantidadRemesas.style.textAlign = 'center';

                const columnaTotalRemesas = d.createElement('td');
                columnaTotalRemesas.innerHTML = element.total_tarifa_viaje.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                });
                columnaTotalRemesas.style.textAlign = 'center';

                const columnaAcciones = d.createElement('td');
                columnaAcciones.innerHTML = `<a class="icon btn-detalle-manifiestos" data-id="${element.cliente_id}" href="#" title="Listar Manifiestos"><i class="mdi mdi-plus-circle-o"></i></a>`;
                columnaAcciones.setAttribute('class', 'actions');
                columnaAcciones.style.textAlign = 'center';

                fila.appendChild(columnaCliente);
                fila.appendChild(columnaCantidadRemesas);
                fila.appendChild(columnaTotalRemesas);
                fila.appendChild(columnaAcciones);
                tbody.appendChild(fila);

                // Añadir los datos para la gráfica
                clientes.push(element.nombre);
                totales.push(element.total_valores_remesas);
              }
            }
            $('#filtro_clientes').html = '';
            arrayData.forEach(element => {
              $('#filtro_clientes').append('<option value="' + element.cliente_id + '">' + element.nombre + '</option>');
            });
          } else {
            console.error('No se recibieron datos válidos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          $('#loading-overlay-nexosapp ').css('display', 'none');
        }
      }
    }

    if (e.target.matches('.btn-detalle-manifiestos') || e.target.matches('.btn-detalle-manifiestos *')) {
      let padre = e.target.parentElement.parentElement;
      d.getElementById('list_manifiestos_cliente').style.display = 'block';
      d.getElementById('titulo_cliente_seleccionado').style.display = 'block';
      d.getElementById('btn-limpiar-filtros').style.display = 'block';
      d.getElementById('miTablaManifiestos').classList.add('hidden');
      d.getElementById('title_inicial').style.display = 'none';
      // d.getElementById('btn-principal').style.display = 'none';
      d.getElementById('btn-detalle-manifiesto-cliente').classList.remove('hidden');
      d.getElementById('btn-detalle-manifiesto-cliente').classList.add('visible');
      d.getElementById('btn-principal-manifiesto').classList.add('hidden');
      var btn_cliente = padre.querySelector('.btn-detalle-manifiestos');
      const cliente_id = btn_cliente.getAttribute('data-id');
      let formdata = new FormData();
      // formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
      // formdata.append('fecha_final', d.getElementById('fecha_final').value);
      // formdata.append('cliente_id', cliente_id);
      if (d.getElementById('filtro').value === 'Mes') {
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_mes').value : d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_mes').value : d.getElementById('fecha_final').value);
        formdata.append('cliente_id', cliente_id);
      } else {
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_fc').value : d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_fc').value : d.getElementById('fecha_final').value);
        formdata.append('cliente_id', cliente_id);
      }
      try {
        const response = await fetch($('#id_url_ajax').val() + 'informe/lista_manifiestos_cliente', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });

        const data = await response.json();
        if (data) {
          let tbody = d.getElementById('tbody_manifiestos_cliente');
          let tfoot = d.getElementById('tfoot_manifiestos_cliente');
          tbody.innerHTML = '';
          tfoot.innerHTML = '';

          // Inicializamos la variable para acumular el total
          let totalTarifaCalculada = 0;
          // let totalPesoCalculado = 0;
          d.getElementById('cliente_list_remesas').innerHTML = ``;
          d.getElementById('cliente_list_remesas').innerHTML = data.resultados[0].nombre;
          data.resultados.forEach(element => {
            const fila = d.createElement('tr');

            const columnaManifiestoCliente = d.createElement('td');
            columnaManifiestoCliente.innerHTML = element.manifiesto_id;
            columnaManifiestoCliente.style.textAlign = 'left';
            columnaManifiestoCliente.style.paddingLeft = '15px';

            const columnaTarifaRemesaCliente = d.createElement('td');
            const tarifaCalculada = parseFloat(element.total_tarifa_manifiesto);
            // const pesoCalculado = parseFloat(element.cantidad_real_cargada);

            columnaTarifaRemesaCliente.innerHTML = tarifaCalculada.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            });
            columnaTarifaRemesaCliente.style.textAlign = 'center';
            columnaTarifaRemesaCliente.style.paddingLeft = '15px';

            // Sumar la tarifa calculada al total
            totalTarifaCalculada += tarifaCalculada;
            // totalPesoCalculado += pesoCalculado;

            const columnaRemesaCoductor = d.createElement('td');
            columnaRemesaCoductor.innerHTML = element.conductor;
            columnaRemesaCoductor.style.textAlign = 'left';
            columnaRemesaCoductor.style.paddingLeft = '15px';

            const columnaRemesaPlaca = d.createElement('td');
            columnaRemesaPlaca.innerHTML = element.placa;
            columnaRemesaPlaca.style.textAlign = 'center';
            columnaRemesaPlaca.style.paddingLeft = '15px';

            const columnaOrigenManifiesto = d.createElement('td');
            columnaOrigenManifiesto.innerHTML = element.Origen;
            columnaOrigenManifiesto.style.textAlign = 'center';
            columnaOrigenManifiesto.style.paddingLeft = '15px';

            const columnaDestinoManifiesto = d.createElement('td');
            columnaDestinoManifiesto.innerHTML = element.Destino;
            columnaDestinoManifiesto.style.textAlign = 'center';
            columnaDestinoManifiesto.style.paddingLeft = '15px';

            const columnaRemesaFecha = d.createElement('td');
            columnaRemesaFecha.innerHTML = element.feha_manifiesto;
            columnaRemesaFecha.style.textAlign = 'center';
            columnaRemesaFecha.style.paddingLeft = '15px';

            fila.appendChild(columnaManifiestoCliente);
            fila.appendChild(columnaRemesaFecha);
            fila.appendChild(columnaRemesaCoductor);
            fila.appendChild(columnaRemesaPlaca);
            fila.appendChild(columnaOrigenManifiesto);
            fila.appendChild(columnaDestinoManifiesto);
            fila.appendChild(columnaTarifaRemesaCliente);

            tbody.appendChild(fila);
          });

          // Crear la fila en el pie de tabla (tfoot) para mostrar el total
          const filaTotal = d.createElement('tr');

          // Celda de texto para el total del peso (alineado en la columna correcta)
          const columnaTotalTextoPeso = d.createElement('td');
          columnaTotalTextoPeso.colSpan = 6; // Ajusta según la estructura de tu tabla
          columnaTotalTextoPeso.style.textAlign = 'right';
          columnaTotalTextoPeso.style.fontWeight = '900';
          columnaTotalTextoPeso.style.fontSize = '15px';
          columnaTotalTextoPeso.innerHTML = 'Total:';

          // Celda para el total de la tarifa calculada
          const columnaTotalValorTarifa = d.createElement('td');
          columnaTotalValorTarifa.innerHTML = totalTarifaCalculada.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          });
          columnaTotalValorTarifa.style.textAlign = 'center';
          columnaTotalValorTarifa.style.fontWeight = '900';
          columnaTotalValorTarifa.style.fontSize = '15px';

          // Agregar columnas a la fila de total
          filaTotal.appendChild(columnaTotalTextoPeso);
          filaTotal.appendChild(columnaTotalValorTarifa);

          // Agregar la fila al pie de tabla
          tfoot.appendChild(filaTotal);
        } else {
          console.error('No se recibieron datos válidos');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none');
      }
    }

    //Funciones para los botones de los anticipos informe gerencial
    if (e.target.matches('#btn_list_anticipos') || e.target.matches('#btn_list_anticipos *')) {
      if (d.getElementById('filtro').value === '') {
        Swal.fire({
          title: 'Advertencia!',
          text: 'Debe seleccionar una opción del filtro.',
          icon: 'warning',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else if (d.getElementById('total_manifiestos').textContent === '$0.00') {
        Swal.fire({
          title: 'Información',
          text: 'No hay información para mostrar en la tabla de anticipos.',
          icon: 'info',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });
      } else {
        d.getElementById('tbl_remesas_general').style.display = 'block';
        d.getElementById('tbl-remesas-lista').style.display = 'none';
        d.getElementById('tbl-anticipos-lista').style.display = 'block';
        d.getElementById('tbl-manifiestos-lista').style.display = 'none';

        const table = d.getElementById('miTablaAnticipos');
        table.classList.add('table-animated');

        let formdata = new FormData();
        // formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
        // formdata.append('fecha_final', d.getElementById('fecha_final').value);
        if (d.getElementById('filtro').value === 'Mes') {
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_mes').value : d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_mes').value : d.getElementById('fecha_final').value);
        } else {
          formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_fc').value : d.getElementById('fecha_inicial').value);
          formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_fc').value : d.getElementById('fecha_final').value);
        }

        try {
          const response = await fetch($('#id_url_ajax').val() + 'informe/listar_anticipos_informe', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });

          const data = await response.json();
          if (data) {
            const arrayData = Object.values(data);
            let tbody = d.getElementById('tbody_cliente_anticipos');
            tbody.innerHTML = '';

            let template = '<option value="">Filtrar por cliente</option>';
            var array_remesas = [];

            // Arrays para Chart.js
            let clientes = [];
            let totales = [];

            for (let key in arrayData) {
              if (arrayData.hasOwnProperty(key)) {
                let element = arrayData[key];

                const fila = d.createElement('tr');

                const columnaCliente = d.createElement('td');
                columnaCliente.innerHTML = element.nombre;
                columnaCliente.style.textAlign = 'left';
                columnaCliente.style.paddingLeft = '15px';

                const columnaCantidadRemesas = d.createElement('td');
                columnaCantidadRemesas.innerHTML = element.cantidad_anticipos;
                columnaCantidadRemesas.style.textAlign = 'center';

                const columnaTotalRemesas = d.createElement('td');
                columnaTotalRemesas.innerHTML = parseFloat(element.total_tarifa_anticipo).toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                });
                columnaTotalRemesas.style.textAlign = 'center';

                const columnaAcciones = d.createElement('td');
                columnaAcciones.innerHTML = `<a class="icon btn-detalle-anticipos" data-id="${element.cliente_id}" href="#" title="Listar Anticipos"><i class="mdi mdi-plus-circle-o"></i></a>`;
                columnaAcciones.setAttribute('class', 'actions');
                columnaAcciones.style.textAlign = 'center';

                fila.appendChild(columnaCliente);
                fila.appendChild(columnaCantidadRemesas);
                fila.appendChild(columnaTotalRemesas);
                fila.appendChild(columnaAcciones);
                tbody.appendChild(fila);

                // Añadir los datos para la gráfica
                clientes.push(element.nombre);
                totales.push(element.total_valores_remesas);
              }
            }

            $('#filtro_clientes').html = '';
            arrayData.forEach(element => {
              $('#filtro_clientes').append('<option value="' + element.cliente_id + '">' + element.nombre + '</option>');
            });
          } else {
            console.error('No se recibieron datos válidos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          $('#loading-overlay-nexosapp ').css('display', 'none');
        }
      }
    }

    if (e.target.matches('.btn-detalle-anticipos') || e.target.matches('.btn-detalle-anticipos *')) {
      let padre = e.target.parentElement.parentElement;
      d.getElementById('list_anticipos_cliente').style.display = 'block';
      d.getElementById('titulo_cliente_seleccionado').style.display = 'block';
      d.getElementById('btn-limpiar-filtros').style.display = 'block';
      d.getElementById('miTablaAnticipos').classList.add('hidden');
      d.getElementById('title_inicial').style.display = 'none';
      // d.getElementById('btn-principal').style.display = 'none';
      d.getElementById('btn-detalle-anticipo-cliente').classList.remove('hidden');
      d.getElementById('btn-detalle-anticipo-cliente').classList.add('visible');
      d.getElementById('btn-principal-anticipo').classList.add('hidden');
      var btn_cliente = padre.querySelector('.btn-detalle-anticipos');
      const cliente_id = btn_cliente.getAttribute('data-id');
      let formdata = new FormData();
      // formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
      // formdata.append('fecha_final', d.getElementById('fecha_final').value);
      // formdata.append('cliente_id', cliente_id);
      if (d.getElementById('filtro').value === 'Mes') {
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_mes').value : d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_mes').value : d.getElementById('fecha_final').value);
        formdata.append('cliente_id', cliente_id);
      } else {
        formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value == '' ? d.getElementById('fecha_inicial_fc').value : d.getElementById('fecha_inicial').value);
        formdata.append('fecha_final', d.getElementById('fecha_final').value == '' ? d.getElementById('fecha_final_fc').value : d.getElementById('fecha_final').value);
        formdata.append('cliente_id', cliente_id);
      }
      try {
        const response = await fetch($('#id_url_ajax').val() + 'informe/lista_anticipos_cliente', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });

        const data = await response.json();
        if (data) {
          let tbody = d.getElementById('tbody_anticipos_cliente');
          let tfoot = d.getElementById('tfoot_anticipos_cliente');
          tbody.innerHTML = '';
          tfoot.innerHTML = '';

          // Inicializamos la variable para acumular el total
          let totalTarifaCalculada = 0;
          // let totalPesoCalculado = 0;
          d.getElementById('cliente_list_remesas').innerHTML = ``;
          d.getElementById('cliente_list_remesas').innerHTML = data.resultados[0].nombre;
          data.resultados.forEach(element => {
            const fila = d.createElement('tr');

            const columnaManifiestoCliente = d.createElement('td');
            columnaManifiestoCliente.innerHTML = element.manifiesto_id;
            columnaManifiestoCliente.style.textAlign = 'left';
            columnaManifiestoCliente.style.paddingLeft = '15px';

            const columnaTarifaRemesaCliente = d.createElement('td');
            const tarifaCalculada = parseFloat(element.total_tari_anticipo);
            // const pesoCalculado = parseFloat(element.cantidad_real_cargada);

            columnaTarifaRemesaCliente.innerHTML = tarifaCalculada.toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            });
            columnaTarifaRemesaCliente.style.textAlign = 'center';
            columnaTarifaRemesaCliente.style.paddingLeft = '15px';

            // Sumar la tarifa calculada al total
            totalTarifaCalculada += tarifaCalculada;
            // totalPesoCalculado += pesoCalculado;

            const columnaRemesaCoductor = d.createElement('td');
            columnaRemesaCoductor.innerHTML = element.conductor;
            columnaRemesaCoductor.style.textAlign = 'left';
            columnaRemesaCoductor.style.paddingLeft = '15px';

            const columnaRemesaPlaca = d.createElement('td');
            columnaRemesaPlaca.innerHTML = element.placa;
            columnaRemesaPlaca.style.textAlign = 'center';
            columnaRemesaPlaca.style.paddingLeft = '15px';

            const columnaOrigenManifiesto = d.createElement('td');
            columnaOrigenManifiesto.innerHTML = element.Origen;
            columnaOrigenManifiesto.style.textAlign = 'center';
            columnaOrigenManifiesto.style.paddingLeft = '15px';

            const columnaDestinoManifiesto = d.createElement('td');
            columnaDestinoManifiesto.innerHTML = element.Destino;
            columnaDestinoManifiesto.style.textAlign = 'center';
            columnaDestinoManifiesto.style.paddingLeft = '15px';

            const columnaRemesaFecha = d.createElement('td');
            columnaRemesaFecha.innerHTML = element.feha_manifiesto;
            columnaRemesaFecha.style.textAlign = 'center';
            columnaRemesaFecha.style.paddingLeft = '15px';

            fila.appendChild(columnaManifiestoCliente);
            fila.appendChild(columnaRemesaFecha);
            fila.appendChild(columnaRemesaCoductor);
            fila.appendChild(columnaRemesaPlaca);
            fila.appendChild(columnaOrigenManifiesto);
            fila.appendChild(columnaDestinoManifiesto);
            fila.appendChild(columnaTarifaRemesaCliente);

            tbody.appendChild(fila);
          });

          // Crear la fila en el pie de tabla (tfoot) para mostrar el total
          const filaTotal = d.createElement('tr');

          // Celda de texto para el total del peso (alineado en la columna correcta)
          const columnaTotalTextoPeso = d.createElement('td');
          columnaTotalTextoPeso.colSpan = 6; // Ajusta según la estructura de tu tabla
          columnaTotalTextoPeso.style.textAlign = 'right';
          columnaTotalTextoPeso.style.fontWeight = '900';
          columnaTotalTextoPeso.style.fontSize = '15px';
          columnaTotalTextoPeso.innerHTML = 'Total:';

          // Celda para el total de la tarifa calculada
          const columnaTotalValorTarifa = d.createElement('td');
          columnaTotalValorTarifa.innerHTML = totalTarifaCalculada.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          });
          columnaTotalValorTarifa.style.textAlign = 'center';
          columnaTotalValorTarifa.style.fontWeight = '900';
          columnaTotalValorTarifa.style.fontSize = '15px';

          // Agregar columnas a la fila de total
          filaTotal.appendChild(columnaTotalTextoPeso);
          filaTotal.appendChild(columnaTotalValorTarifa);

          // Agregar la fila al pie de tabla
          tfoot.appendChild(filaTotal);
        } else {
          console.error('No se recibieron datos válidos');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none');
      }
    }

    //Boton para limpiar los filtros de ver la informacion
    if (e.target.matches('#btn-limpiar-filtros') || e.target.matches('#btn-limpiar-filtros *')) {
      let padre = e.target.parentElement.parentElement;
      //Remesas
      d.getElementById('list_remesas_cliente').style.display = 'none';
      d.getElementById('titulo_cliente_seleccionado').style.display = 'none';

      // Limpiar formulario de filtros
      d.getElementById('btn-detalle-remesa-cliente').classList.add('hidden');
      //Boton para exportar datos de la tabla principal de clientes y remesas
      d.getElementById('btn-principal').classList.remove('hidden');
      d.getElementById('btn-principal').classList.add('visible');

      //Manifiestos
      d.getElementById('btn-limpiar-filtros').style.display = 'none';
      d.getElementById('miTabla').classList.remove('hidden');
      d.getElementById('miTabla').classList.add('visible');
      //Manifiestos
      d.getElementById('miTablaManifiestos').classList.remove('hidden');
      d.getElementById('miTablaManifiestos').classList.add('visible');
      d.getElementById('title_inicial').style.display = 'block';

      d.getElementById('btn-principal-manifiesto').classList.remove('hidden');
      d.getElementById('btn-principal-manifiesto').classList.add('visible');

      d.getElementById('list_manifiestos_cliente').style.display = 'none';

      //Anticipos
      d.getElementById('miTablaAnticipos').classList.remove('hidden');
      d.getElementById('miTablaAnticipos').classList.add('visible');
      d.getElementById('title_inicial').style.display = 'block';

      d.getElementById('btn-principal-anticipo').classList.remove('hidden');
      d.getElementById('btn-principal-anticipo').classList.add('visible');
      d.getElementById('list_anticipos_cliente').style.display = 'none';
    }

    // Botones para exportar las remesas
    d.getElementById('exportar_excel_remesas').addEventListener('click', function() {
      var table = d.getElementById('miTabla');

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
        {wpx: 320}, // Columna 1 ancho en píxeles
        {wpx: 120}, // Columna 2 ancho en píxeles
        {wpx: 150}, // Ajusta el tamaño de las columnas según el contenido
      ];

      // Crear contenido de archivo con fecha
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe Remesas Clientes - ${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });

    d.getElementById('exportar_excel_remesas_cliente').addEventListener('click', function() {
      var table = d.getElementById('miTabla1');

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
        {wpx: 100}, // Columna 1 ancho en píxeles
        {wpx: 100}, // Columna 2 ancho en píxeles
        {wpx: 180}, // Ajusta el tamaño de las columnas según el contenido
      ];

      // Crear contenido de archivo con fecha
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe Remesas Clientes - ${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });
    //Fin Botones para exportar las remesas

    // Botones para exportar las Manifiestos
    d.getElementById('exportar_excel_manifiesto').addEventListener('click', function() {
      var table = d.getElementById('miTablaManifiestos');

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
        {wpx: 320}, // Columna 1 ancho en píxeles
        {wpx: 120}, // Columna 2 ancho en píxeles
        {wpx: 150}, // Ajusta el tamaño de las columnas según el contenido
      ];

      // Crear contenido de archivo con fecha
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe Manifiestos Clientes - ${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });

    d.getElementById('exportar_excel_manifiestos_cliente').addEventListener('click', function() {
      var table = d.getElementById('miTablaDetalleManifiesto');

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
        {wpx: 100}, // Columna 1 ancho en píxeles
        {wpx: 100}, // Columna 2 ancho en píxeles
        {wpx: 180}, // Ajusta el tamaño de las columnas según el contenido
      ];

      // Crear contenido de archivo con fecha
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe Manifiestos Clientes - ${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });

    // Botones para exportar los Anticipos
    d.getElementById('exportar_excel_anticipo').addEventListener('click', function() {
      var table = d.getElementById('miTablaAnticipos');

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
        {wpx: 320}, // Columna 1 ancho en píxeles
        {wpx: 120}, // Columna 2 ancho en píxeles
        {wpx: 150}, // Ajusta el tamaño de las columnas según el contenido
      ];

      // Crear contenido de archivo con fecha
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe Anticipos Clientes - ${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });

    d.getElementById('exportar_excel_anticipos_cliente').addEventListener('click', function() {
      var table = d.getElementById('miTablaDetalleAnticipos');

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
        {wpx: 100}, // Columna 1 ancho en píxeles
        {wpx: 100}, // Columna 2 ancho en píxeles
        {wpx: 180}, // Ajusta el tamaño de las columnas según el contenido
      ];

      // Crear contenido de archivo con fecha
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Informe Anticipos Clientes - ${fechaActual}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });

    // Fin Botones para exportar las Manifiestos
  });

  /* Verificar que filtro se va a trabajar para crear el informe */
  d.addEventListener('change', async e => {
    if (e.target.matches('#filtro') | e.target.matches('#filtro *')) {
      var filtro = d.getElementById('filtro').value;
      let progress_bar = d.querySelectorAll('.progress');
      if (filtro === 'Fecha') {
        d.getElementById('filtro_fechas').style.display = 'block';
        d.getElementById('filtro_cliente').style.display = 'none';
        d.getElementById('filtro_fecha_cliente').style.display = 'none';
        d.getElementById('filtro_mes').style.display = 'none';
        d.getElementById('fecha_inicial_fc').value = '';
        d.getElementById('fecha_final_fc').value = '';
        progress_bar.forEach(element => {
          element.style.display = 'none';
        });
      } else if (filtro === 'Cliente') {
        d.getElementById('filtro_cliente').style.display = 'block';
        d.getElementById('filtro_fechas').style.display = 'none';
        d.getElementById('filtro_fecha_cliente').style.display = 'none';
        d.getElementById('filtro_mes').style.display = 'none';
        d.getElementById('fecha_cliente_id').value = '';
        d.getElementById('clientes_fc').value = '';
      } else if (filtro === 'fecha_cliente') {
        d.getElementById('filtro_cliente').style.display = 'none';
        d.getElementById('filtro_fechas').style.display = 'none';
        d.getElementById('filtro_fecha_cliente').style.display = 'block';
        d.getElementById('filtro_mes').style.display = 'none';
        d.getElementById('cliente_id').value = '';
        d.getElementById('clientes').value = '';
        d.getElementById('fecha_inicial').value = '';
        d.getElementById('fecha_final').value = '';
      } else if (filtro === 'Mes') {
        d.getElementById('filtro_cliente').style.display = 'none';
        d.getElementById('filtro_fechas').style.display = 'none';
        d.getElementById('filtro_fecha_cliente').style.display = 'none';
        d.getElementById('filtro_mes').style.display = 'block';

        //Eejcutar consulta a la tabla meses donde esta todo parametrizados
        try {
          const response = await fetch(d.getElementById('id_url_ajax').value + 'informe/listar_meses_filtro', {
            method: 'POST',
            cache: 'no-cache',
          });

          const data = await response.json();
          if (data) {
            const datos = [];
            d.getElementById('mes_filtro').innerHTML = '';
            data.forEach(element => {
              datos.push({
                fecha_inicio: element.fecha_inicio,
                fecha_fin: element.fecha_fin,
                id: element.id,
                nombre_mes: element.nombre_mes,
              });

              // Agregar opciones al select

              const option = d.createElement('option');
              option.value = element.id;
              option.textContent = element.nombre_mes;
              d.getElementById('mes_filtro').appendChild(option);
            });

            // Guardar los datos en sessionStorage como cadena JSON
            sessionStorage.setItem('datos_mes', JSON.stringify(datos));
          } else {
            console.error('No se recibieron datos válidos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          d.getElementById('loading-overlay-nexosapp').style.display = 'none';
        }

        progress_bar.forEach(element => {
          element.style.display = 'block';
        });
      } else if (filtro === '') {
        d.getElementById('filtro_cliente').style.display = 'none';
        d.getElementById('filtro_fechas').style.display = 'none';
        d.getElementById('filtro_fecha_cliente').style.display = 'none';
      }
    }

    if (e.target.matches('#filtro_clientes') || e.target.matches('#filtro_clientes *')) {
      // var cliente_id = d.getElementById('filtro_clientes').value;
      let formdata = new FormData();
      formdata.append('fecha_inicial', d.getElementById('fecha_inicial').value);
      formdata.append('fecha_final', d.getElementById('fecha_final').value);
      formdata.append('cliente_id', d.getElementById('filtro_clientes').value);
      try {
        const response = await fetch($('#id_url_ajax').val() + 'informe/listar_remesas_informe_cliente', {
          method: 'POST',
          body: formdata,
          cache: 'no-cache',
        });

        const data = await response.json();
        if (data) {
          const arrayData = Object.values(data);
          let tbody = d.getElementById('tbody_cliente_remesas');
          tbody.innerHTML = '';

          let template = '<option value="">Filtrar por cliente</option>';
          var array_remeesas = [];

          for (let key in arrayData) {
            if (arrayData.hasOwnProperty(key)) {
              let element = arrayData[key];

              for (let b = 0; b < element.remesas.length; b++) {
                array_remeesas.push(element.remesas[b].id_remesa);
              }

              var remesas_acumuladas = array_remeesas.join(', ');

              const fila = d.createElement('tr');

              const columnaCliente = d.createElement('td');
              columnaCliente.innerHTML = element.nombre;
              columnaCliente.style.textAlign = 'left';
              columnaCliente.style.paddingLeft = '15px';

              const columnaCantidadRemesas = d.createElement('td');
              columnaCantidadRemesas.innerHTML = element.cantidad_remesas;
              columnaCantidadRemesas.style.textAlign = 'center';

              const columnaTotalRemesas = d.createElement('td');
              columnaTotalRemesas.innerHTML = element.total_valores_remesas.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
              });
              columnaTotalRemesas.style.textAlign = 'center';

              const columnaAcciones = d.createElement('td');
              // columnaAcciones.innerHTML = `<a class="icon btn-detalle-remesas" data-id="${element.cliente_id}" href="#"><i class="mdi mdi-plus-circle-o"></i></a>`;
              columnaAcciones.innerHTML = `<a class="icon btn-detalle-remesas" data-id="${element.cliente_id}" href="#" title="Listar Remesas"><i class="mdi mdi-plus-circle-o"></i></a>`;
              // columnaAcciones.innerHTML = `<a class="icon btn-detalle-remesas" data-id="${element.cliente_id}" href="#" title="Listar Remesas"><i class="mdi mdi-plus-circle-o"></i></a>
              // <a class="icon btn-export-remesas" data-id="${element.cliente_id}" href="#" style="margin-left:12px;" title="Exportar a Excel"><i class="fas fa-table"></i></a>`;
              columnaAcciones.setAttribute('class', 'actions');
              columnaAcciones.style.textAlign = 'center';

              fila.appendChild(columnaCliente);
              fila.appendChild(columnaCantidadRemesas);
              fila.appendChild(columnaTotalRemesas);
              fila.appendChild(columnaAcciones);
              tbody.appendChild(fila);
            }
          }

          arrayData.forEach(element => {
            // Aquí va la lógica para cada elemento
            $('#filtro_clientes').append('<option value="' + element.cliente_id + '">' + element.nombre + '</option>');
          });
        } else {
          console.error('No se recibieron datos válidos');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none');
      }
    }
  });

  // Evento que se ejecuta cuando se selecciona un valor en el select
  // Seleccioanr fecha inicio y fecha fin de cadames
  d.getElementById('mes_filtro').addEventListener('change', async function() {
    const selectedId = this.value; // Obtener el valor seleccionado del select

    // Recuperar los datos del sessionStorage y convertirlos a un objeto
    const datosMes = JSON.parse(sessionStorage.getItem('datos_mes'));

    // Verificar si los datos existen y encontrar el elemento que coincide con el id seleccionado
    if (datosMes) {
      const mesSeleccionado = datosMes.find(mes => mes.id == selectedId);

      if (mesSeleccionado) {
        // Mostrar las fechas en el DOM si es necesario
        d.getElementById('fecha_inicial_mes').value = mesSeleccionado.fecha_inicio;
        d.getElementById('fecha_final_mes').value = mesSeleccionado.fecha_fin;

        // Consultar los kpi del mes seleccionado por el usuario
        let formdata = new FormData();
        formdata.append('mes', selectedId);

        try {
          const response = await fetch(d.getElementById('id_url_ajax').value + 'informe/listar_kpi_mes', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
          });

          const data = await response.json();
          if (data) {
            // console.log('🚀 ~ d.getElementById ~ data:', data);
            data.forEach(element => {
              if (element.tipo_kpi === 'REMESA' && element.operacion_kpi === 'CANTIDAD') {
                d.getElementById('remesa_meta').value = element.kpi;
              } else if (element.tipo_kpi === 'REMESA' && element.operacion_kpi === 'MONTO') {
                d.getElementById('total_remesa_meta').value = element.kpi;
              } else if (element.tipo_kpi === 'MANIFIESTO' && element.operacion_kpi === 'CANTIDAD') {
                d.getElementById('manifiesto_meta').value = element.kpi;
              } else if (element.tipo_kpi === 'MANIFIESTO' && element.operacion_kpi === 'MONTO') {
                d.getElementById('total_manifiesto_meta').value = element.kpi;
              }
            });
          } else {
            console.error('No se recibieron datos válidos');
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        } finally {
          d.getElementById('loading-overlay-nexosapp').style.display = 'none';
        }
      } else {
        console.error('No se encontró el mes seleccionado.');
      }
    } else {
      console.error('No se encontraron datos almacenados en sessionStorage.');
    }
  });
});

function animateValueCantidad(id, start, end, duration, currency = false) {
  const obj = document.getElementById(id);
  const range = end - start;
  let current = start;
  const increment = end > start ? range / (duration / 10) : -range / (duration / 10);
  const stepTime = Math.abs(Math.floor(duration / range));

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    // Formatear a moneda si se requiere
    obj.innerText = Math.floor(current);
  }, stepTime);
}

function animateValue(id, start, end, duration, currency = false) {
  const obj = document.getElementById(id);
  const range = end - start;
  let current = start;
  const increment = end > start ? range / (duration / 10) : -range / (duration / 10);
  const stepTime = Math.abs(Math.floor(duration / range));

  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    // Si es moneda, formatear con 'toLocaleString', de lo contrario mostrar el número entero
    obj.innerText = currency ? current.toLocaleString('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0}) : Math.floor(current);
  }, stepTime);
}

function kilolitrosAToneladas(kilolitros, densidad = 1000) {
  // Convertimos kilolitros a toneladas usando la densidad
  return kilolitros / densidad;
}

function reiniciarBarraDeProgresoRemesas() {
  $('#cantidad_progreso')
    .css({
      width: '0%', // Reiniciar el ancho a 0%
      color: '', // Reiniciar el color del texto (vacío)
      'background-color': '', // Reiniciar el color de fondo (vacío)
    })
    .removeClass('progress-bar-success progress-bar-warning progress-bar-danger') // Remover clases
    .html('0%')
    .css('color', '#000000'); // Eliminar el texto dentro de la barra

  $('#total_progreso')
    .css({
      width: '0%', // Reiniciar el ancho a 0%
      color: '', // Reiniciar el color del texto (vacío)
      'background-color': '', // Reiniciar el color de fondo (vacío)
    })
    .removeClass('progress-bar-success progress-bar-warning progress-bar-danger') // Remover clases
    .html('0%')
    .css('color', '#000000'); // Eliminar el texto dentro de la barra
}

function reiniciarBarraDeProgresoManifiestos() {
  $('#cantidad_manifiesto_progreso')
    .css({
      width: '0%', // Reiniciar el ancho a 0%
      color: '', // Reiniciar el color del texto (vacío)
      'background-color': '', // Reiniciar el color de fondo (vacío)
    })
    .removeClass('progress-bar-success progress-bar-warning progress-bar-danger') // Remover clases
    .html('0%')
    .css('color', '#000000'); // Eliminar el texto dentro de la barra

  $('#total_manifiesto_progreso')
    .css({
      width: '0%', // Reiniciar el ancho a 0%
      color: '', // Reiniciar el color del texto (vacío)
      'background-color': '', // Reiniciar el color de fondo (vacío)
    })
    .removeClass('progress-bar-success progress-bar-warning progress-bar-danger') // Remover clases
    .html('0%')
    .css('color', '#000000'); // Eliminar el texto dentro de la barra
}
