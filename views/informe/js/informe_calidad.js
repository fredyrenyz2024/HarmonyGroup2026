const d = document;
const w = window;

document.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();

  document.addEventListener('click', async e => {
    if (e.target.matches('#aplicar_filtro') || e.target.matches('#aplicar_filtro *')) {
      try {
        $('#loading-overlay-nexosapp').css('display', 'flex'); // Mostrar mensaje de carga
        let data = new FormData();
        data.append('fecha_inicial', document.getElementById('fecha_inicial').value);
        data.append('fecha_final', document.getElementById('fecha_final').value);

        await fetch($('#id_url_ajax').val() + 'informe/generar_informe_calidad', {
          method: 'POST',
          cache: 'no-cache',
          body: data,
        })
          .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then(function (data) {
            const arrayData = Object.values(data);

            cont = 0;
            let tbody = document.getElementById('tbl_informe_calidad');
            tbody.innerHTML = '';
            //CODIGO PARA GENERAR EL INFORME CONSOLIDADO POR REMESAS
            // // Solicitudes de servicio
            // var array_remeesas = [];
            // var array_orden_cargue = [];
            // var array_fecha_remesas = [];
            // var array_fecha_cumplidas = [];

            // for (let b = 0; b < element.remesas.length; b++) {
            //   // array_remeesas.push(element.remesas[b].id_orden_cargue);
            //   array_remeesas.push(element.remesas[b].id_remesa);
            //   array_orden_cargue.push(element.remesas[b].id_orden_cargue);
            //   array_fecha_remesas.push(element.remesas[b].fecha_remesa);
            //   array_fecha_cumplidas.push(element.remesas[b].fecha_cumplido);
            // }
            // var ordenes_acumuladas = array_orden_cargue.join(', ');
            // var remesas_acumuladas = array_remeesas.join(', ');
            // var fecha_remesas_acumuladas = array_fecha_remesas.join(', ');
            // var fecha_cumplida_remesas_acumuladas = array_fecha_cumplidas.join(', ');
            // console.log("🚀 ~ .then ~ solicitudes_acumuladas:", solicitudes_acumuladas)

            for (let key in arrayData) {
              if (arrayData.hasOwnProperty(key)) {
                let element = arrayData[key];
                for (let b = 0; b < element.remesas.length; b++) {
                  const fila = document.createElement('tr');
                  const columnaManifiesto = document.createElement('td'); //manifiesto
                  columnaManifiesto.innerHTML = element.numero_manifiesto;
                  columnaManifiesto.style.textAlign = 'center';
                  columnaManifiesto.style.width = 'auto';
                  columnaManifiesto.style.whiteSpace = 'white-space';
                  columnaManifiesto.style.paddingLeft = '15px';

                  const columnaFecha = document.createElement('td'); //fecha expedicion
                  columnaFecha.innerHTML = element.fecha_expedicion;
                  columnaFecha.style.textAlign = 'center';
                  columnaFecha.style.width = 'auto';
                  columnaFecha.style.whiteSpace = 'white-space';
                  columnaFecha.style.paddingLeft = '15px';

                  const columnaPlaca = document.createElement('td'); //placa del vehículo
                  columnaPlaca.innerHTML = element.placa;
                  columnaPlaca.style.textAlign = 'center';
                  columnaPlaca.style.width = 'auto';
                  columnaPlaca.style.whiteSpace = 'white-space';
                  columnaPlaca.style.paddingLeft = '5px';

                  const columnaTrailer = document.createElement('td'); //flete del conductor o valor del manifiesto
                  columnaTrailer.innerHTML = element.Trailer;
                  columnaTrailer.style.textAlign = 'center';
                  columnaTrailer.style.width = 'auto';
                  columnaTrailer.style.whiteSpace = 'white-space';
                  columnaTrailer.style.paddingLeft = '5px';

                  const columnaConfiguracion = document.createElement('td'); //anticipo
                  columnaConfiguracion.innerHTML = element.Configuracion;
                  columnaConfiguracion.style.textAlign = 'center';
                  columnaConfiguracion.style.width = 'auto';
                  columnaConfiguracion.style.whiteSpace = 'white-space';
                  columnaConfiguracion.style.paddingLeft = '5px';

                  const columnaVinculacion = document.createElement('td'); //fecha del cumplido
                  columnaVinculacion.innerHTML = element.tipo_vinculacion;
                  columnaVinculacion.style.textAlign = 'center';
                  columnaVinculacion.style.width = 'auto';
                  columnaVinculacion.style.whiteSpace = 'white-space';
                  columnaVinculacion.style.paddingLeft = '5px';

                  const columnaChasis = document.createElement('td'); // numero de remesa
                  columnaChasis.innerHTML = element.num_chasis;
                  columnaChasis.style.textAlign = 'center';
                  columnaChasis.style.width = 'auto';
                  columnaChasis.style.whiteSpace = 'white-space';
                  columnaChasis.style.paddingLeft = '5px';

                  const columnaOrdenCargue = document.createElement('td'); //generador de carga
                  columnaOrdenCargue.innerHTML = element.remesas[b].id_orden_cargue;
                  columnaOrdenCargue.style.textAlign = 'center';
                  columnaOrdenCargue.style.width = 'auto';
                  columnaOrdenCargue.style.whiteSpace = 'white-space';
                  columnaOrdenCargue.style.paddingLeft = '5px';

                  const columnaRemesas = document.createElement('td'); //generador de carga
                  columnaRemesas.innerHTML = element.remesas[b].id_remesa;
                  columnaRemesas.style.textAlign = 'center';
                  columnaRemesas.style.width = 'auto';
                  columnaRemesas.style.whiteSpace = 'white-space';
                  columnaRemesas.style.paddingLeft = '5px';

                  const columnaFechaRemesas = document.createElement('td'); //generador de carga
                  columnaFechaRemesas.innerHTML = element.remesas[b].fecha_remesa;
                  columnaFechaRemesas.style.textAlign = 'center';
                  columnaFechaRemesas.style.width = 'auto';
                  columnaFechaRemesas.style.whiteSpace = 'white-space';
                  columnaFechaRemesas.style.paddingLeft = '5px';

                  const columnaFechaCumplidaRemesas = document.createElement('td'); //generador de carga
                  columnaFechaCumplidaRemesas.innerHTML = element.remesas[b].fecha_cumplido;
                  columnaFechaCumplidaRemesas.style.textAlign = 'center';
                  columnaFechaCumplidaRemesas.style.width = 'auto';
                  columnaFechaCumplidaRemesas.style.whiteSpace = 'white-space';
                  columnaFechaCumplidaRemesas.style.paddingLeft = '5px';

                  const columnaFechaLlegadaCargue = document.createElement('td'); //generador de carga
                  columnaFechaLlegadaCargue.innerHTML = element.remesas[b].fecha_llegada_cargue;
                  columnaFechaLlegadaCargue.style.textAlign = 'center';
                  columnaFechaLlegadaCargue.style.width = 'auto';
                  columnaFechaLlegadaCargue.style.whiteSpace = 'white-space';
                  columnaFechaLlegadaCargue.style.paddingLeft = '5px';

                  const columnaFechaSalidaCargue = document.createElement('td'); //generador de carga
                  columnaFechaSalidaCargue.innerHTML = element.remesas[b].fecha_salida_cargue;
                  columnaFechaSalidaCargue.style.textAlign = 'center';
                  columnaFechaSalidaCargue.style.width = 'auto';
                  columnaFechaSalidaCargue.style.whiteSpace = 'white-space';
                  columnaFechaSalidaCargue.style.paddingLeft = '5px';

                  const columnaFechaLlegadaDescargue = document.createElement('td'); //generador de carga
                  columnaFechaLlegadaDescargue.innerHTML = element.remesas[b].fecha_llegada_descargue;
                  columnaFechaLlegadaDescargue.style.textAlign = 'center';
                  columnaFechaLlegadaDescargue.style.width = 'auto';
                  columnaFechaLlegadaDescargue.style.whiteSpace = 'white-space';
                  columnaFechaLlegadaDescargue.style.paddingLeft = '5px';

                  const columnaFechaSalidaDescargue = document.createElement('td'); //generador de carga
                  columnaFechaSalidaDescargue.innerHTML = element.remesas[b].fecha_salida_descargue;
                  columnaFechaSalidaDescargue.style.textAlign = 'center';
                  columnaFechaSalidaDescargue.style.width = 'auto';
                  columnaFechaSalidaDescargue.style.whiteSpace = 'white-space';
                  columnaFechaSalidaDescargue.style.paddingLeft = '5px';

                  const columnaCantidadRealCargada = document.createElement('td'); //generador de carga
                  columnaCantidadRealCargada.innerHTML = element.remesas[b].cantidad_real_cargada;
                  columnaCantidadRealCargada.style.textAlign = 'center';
                  columnaCantidadRealCargada.style.width = 'auto';
                  columnaCantidadRealCargada.style.whiteSpace = 'white-space';
                  columnaCantidadRealCargada.style.paddingLeft = '5px';

                  const columnaCliente = document.createElement('td'); //generador de carga
                  columnaCliente.innerHTML = element.remesas[b].nombre_cliente;
                  columnaCliente.style.textAlign = 'center';
                  columnaCliente.style.width = 'auto';
                  columnaCliente.style.whiteSpace = 'white-space';
                  columnaCliente.style.paddingLeft = '5px';

                  // const columnaSede = document.createElement('td'); //generador de carga
                  // columnaSede.innerHTML = element.remesas[b].nom_sede;
                  // columnaSede.style.textAlign = 'center';
                  // columnaSede.style.width = 'auto';
                  // columnaSede.style.whiteSpace = 'white-space';
                  // columnaSede.style.paddingLeft = '5px';

                  const columnaAgencia = document.createElement('td'); //generador de carga
                  columnaAgencia.innerHTML = element.remesas[b].Agencia;
                  columnaAgencia.style.textAlign = 'center';
                  columnaAgencia.style.width = 'auto';
                  columnaAgencia.style.whiteSpace = 'white-space';
                  columnaAgencia.style.paddingLeft = '5px';

                  // const columnaEmpaque = document.createElement('td'); //generador de carga
                  // columnaEmpaque.innerHTML = element.remesas[b].mer_empaque;
                  // columnaEmpaque.style.textAlign = 'center';
                  // columnaEmpaque.style.width = 'auto';
                  // columnaEmpaque.style.whiteSpace = 'white-space';
                  // columnaEmpaque.style.paddingLeft = '5px';

                  // const columnaPesoPedido = document.createElement('td'); //generador de carga
                  // columnaPesoPedido.innerHTML = element.remesas[b].peso_pedido;
                  // columnaPesoPedido.style.textAlign = 'center';
                  // columnaPesoPedido.style.width = 'auto';
                  // columnaPesoPedido.style.whiteSpace = 'white-space';
                  // columnaPesoPedido.style.paddingLeft = '5px';

                  // const columnaPesoOrdenCargue = document.createElement('td'); //generador de carga
                  // columnaPesoOrdenCargue.innerHTML = element.remesas[b].mer_pesomercancia;
                  // columnaPesoOrdenCargue.style.textAlign = 'center';
                  // columnaPesoOrdenCargue.style.width = 'auto';
                  // columnaPesoOrdenCargue.style.whiteSpace = 'white-space';
                  // columnaPesoOrdenCargue.style.paddingLeft = '5px';

                  // const columnaPesoRemesa = document.createElement('td'); //generador de carga
                  // columnaPesoRemesa.innerHTML = element.remesas[b].peso_pedido;
                  // columnaPesoRemesa.style.textAlign = 'center';
                  // columnaPesoRemesa.style.width = 'auto';
                  // columnaPesoRemesa.style.whiteSpace = 'white-space';
                  // columnaPesoRemesa.style.paddingLeft = '5px';

                  // const columnaPesoCumplido = document.createElement('td'); //generador de carga
                  // columnaPesoCumplido.innerHTML = element.remesas[b].total_peso;
                  // columnaPesoCumplido.style.textAlign = 'center';
                  // columnaPesoCumplido.style.width = 'auto';
                  // columnaPesoCumplido.style.whiteSpace = 'white-space';
                  // columnaPesoCumplido.style.paddingLeft = '5px';

                  const columnaFechaCumplidoManifiesto = document.createElement('td'); //generador de carga
                  columnaFechaCumplidoManifiesto.innerHTML = element.remesas[b].fecha_cumplido;
                  columnaFechaCumplidoManifiesto.style.textAlign = 'center';
                  columnaFechaCumplidoManifiesto.style.width = 'auto';
                  columnaFechaCumplidoManifiesto.style.whiteSpace = 'white-space';
                  columnaFechaCumplidoManifiesto.style.paddingLeft = '5px';

                  const columnaOrigenManifiesto = document.createElement('td'); //generador de carga
                  columnaOrigenManifiesto.innerHTML = element.remesas[b].origen_rem;
                  columnaOrigenManifiesto.style.textAlign = 'center';
                  columnaOrigenManifiesto.style.width = 'auto';
                  columnaOrigenManifiesto.style.whiteSpace = 'white-space';
                  columnaOrigenManifiesto.style.paddingLeft = '5px';

                  const columnaDestinoManifiesto = document.createElement('td'); //generador de carga
                  columnaDestinoManifiesto.innerHTML = element.remesas[b].destino_rem;
                  columnaDestinoManifiesto.style.textAlign = 'center';
                  columnaDestinoManifiesto.style.width = 'auto';
                  columnaDestinoManifiesto.style.whiteSpace = 'white-space';
                  columnaDestinoManifiesto.style.paddingLeft = '5px';

                  const columnaProducto = document.createElement('td'); //generador de carga
                  columnaProducto.innerHTML = element.remesas[b].tipo_mercancia;
                  columnaProducto.style.textAlign = 'center';
                  columnaProducto.style.width = 'auto';
                  columnaProducto.style.whiteSpace = 'white-space';
                  columnaProducto.style.paddingLeft = '5px';

                  const columnaConductor = document.createElement('td'); //generador de carga
                  columnaConductor.innerHTML = element.remesas[b].Conductor;
                  columnaConductor.style.textAlign = 'center';
                  columnaConductor.style.width = 'auto';
                  columnaConductor.style.whiteSpace = 'white-space';
                  columnaConductor.style.paddingLeft = '5px';

                  const columnaCedulaConductor = document.createElement('td'); //generador de carga
                  columnaCedulaConductor.innerHTML = element.remesas[b].cedula_conductor;
                  columnaCedulaConductor.style.textAlign = 'center';
                  columnaCedulaConductor.style.width = 'auto';
                  columnaCedulaConductor.style.whiteSpace = 'white-space';
                  columnaCedulaConductor.style.paddingLeft = '5px';

                  const columnaCelularConductor = document.createElement('td'); //generador de carga
                  columnaCelularConductor.innerHTML = element.remesas[b].celular_conductor;
                  columnaCelularConductor.style.textAlign = 'center';
                  columnaCelularConductor.style.width = 'auto';
                  columnaCelularConductor.style.whiteSpace = 'white-space';
                  columnaCelularConductor.style.paddingLeft = '5px';


                  const columnaPoseedor = document.createElement('td'); //generador de carga
                  columnaPoseedor.innerHTML = element.remesas[b].Poseedor;
                  columnaPoseedor.style.textAlign = 'center';
                  columnaPoseedor.style.width = 'auto';
                  columnaPoseedor.style.whiteSpace = 'white-space';
                  columnaPoseedor.style.paddingLeft = '5px';

                  const columnaCedulaPoseedor = document.createElement('td'); //generador de carga
                  columnaCedulaPoseedor.innerHTML = element.remesas[b].cedula_poseedor;
                  columnaCedulaPoseedor.style.textAlign = 'center';
                  columnaCedulaPoseedor.style.width = 'auto';
                  columnaCedulaPoseedor.style.whiteSpace = 'white-space';
                  columnaCedulaPoseedor.style.paddingLeft = '5px';

                  const columnaCelularPoseedor = document.createElement('td'); //generador de carga
                  columnaCelularPoseedor.innerHTML = element.remesas[b].celular_poseedor;
                  columnaCelularPoseedor.style.textAlign = 'center';
                  columnaCelularPoseedor.style.width = 'auto';
                  columnaCelularPoseedor.style.whiteSpace = 'white-space';
                  columnaCelularPoseedor.style.paddingLeft = '5px';

                  const columnaPedido = document.createElement('td'); //generador de carga
                  columnaPedido.innerHTML = element.remesas[b].nundoc_solicitud;
                  columnaPedido.style.textAlign = 'center';
                  columnaPedido.style.width = 'auto';
                  columnaPedido.style.whiteSpace = 'white-space';
                  columnaPedido.style.paddingLeft = '5px';

                  const columnaElaborado = document.createElement('td'); //generador de carga
                  columnaElaborado.innerHTML = element.remesas[b].elaborado;
                  columnaElaborado.style.textAlign = 'center';
                  columnaElaborado.style.width = 'auto';
                  columnaElaborado.style.whiteSpace = 'white-space';
                  columnaElaborado.style.paddingLeft = '5px';

                  const columnaEstadoManifiesto = document.createElement('td'); //generador de carga
                  columnaEstadoManifiesto.innerHTML = element.remesas[b].estado_manifiesto;
                  columnaEstadoManifiesto.style.textAlign = 'center';
                  columnaEstadoManifiesto.style.width = 'auto';
                  columnaEstadoManifiesto.style.whiteSpace = 'white-space';
                  columnaEstadoManifiesto.style.paddingLeft = '5px';

                  //Armar tabla
                  fila.appendChild(columnaManifiesto);
                  fila.appendChild(columnaFecha);
                  fila.appendChild(columnaPlaca);
                  fila.appendChild(columnaTrailer);
                  fila.appendChild(columnaConfiguracion);
                  fila.appendChild(columnaVinculacion);
                  fila.appendChild(columnaChasis);
                  fila.appendChild(columnaOrdenCargue);
                  fila.appendChild(columnaRemesas);
                  fila.appendChild(columnaFechaRemesas);
                  fila.appendChild(columnaFechaCumplidaRemesas);
                  fila.appendChild(columnaFechaLlegadaCargue);
                  fila.appendChild(columnaFechaSalidaCargue);
                  fila.appendChild(columnaFechaLlegadaDescargue);
                  fila.appendChild(columnaFechaSalidaDescargue);
                  fila.appendChild(columnaCantidadRealCargada);
                  fila.appendChild(columnaCliente);
                  // fila.appendChild(columnaSede);
                  fila.appendChild(columnaAgencia);
                  // fila.appendChild(columnaEmpaque);
                  // fila.appendChild(columnaPesoPedido);
                  // fila.appendChild(columnaPesoOrdenCargue);
                  // fila.appendChild(columnaPesoRemesa);
                  // fila.appendChild(columnaPesoCumplido);
                  fila.appendChild(columnaFechaCumplidoManifiesto);
                  fila.appendChild(columnaOrigenManifiesto);
                  fila.appendChild(columnaDestinoManifiesto);
                  fila.appendChild(columnaProducto);
                  fila.appendChild(columnaConductor);
                  fila.appendChild(columnaCedulaConductor);
                  fila.appendChild(columnaCelularConductor);
                  fila.appendChild(columnaPoseedor);
                  fila.appendChild(columnaCedulaPoseedor);
                  fila.appendChild(columnaCelularPoseedor);
                  fila.appendChild(columnaPedido);
                  fila.appendChild(columnaElaborado);
                  fila.appendChild(columnaEstadoManifiesto);
                  // fila.appendChild(columnaS);
                  // fila.appendChild(columnaL);
                  // fila.appendChild(columnaFacturacion);
                  // fila.appendChild(columnaAprobado);
                  // fila.appendChild(columnaRadicado);
                  tbody.appendChild(fila);
                }
              }
            }

            // cont = 0;
            // let tbody = document.getElementById('tbl_informe_calidad');
            // tbody.innerHTML = '';
            if (data.result != '') {
              // arrayData.forEach((index,element) => {
              //   console.log("🚀 ~ arrayData.forEach ~ element:", index.element)
              //   const fila = document.createElement('tr');
              //   const columnaManifiesto = document.createElement('td'); //manifiesto
              //   columnaManifiesto.innerHTML = element.numero_manifiesto;
              //   columnaManifiesto.style.textAlign = 'center';
              //   const columnaFecha = document.createElement('td'); //fecha expedicion
              //   columnaFecha.innerHTML = element.fecha_expedicion;
              //   columnaFecha.style.textAlign = 'center';
              //   const columnaPlaca = document.createElement('td'); //placa del vehículo
              //   columnaPlaca.innerHTML = element.placa;
              //   columnaPlaca.style.textAlign = 'center';
              //   const columnaTrailer = document.createElement('td'); //flete del conductor o valor del manifiesto
              //   columnaTrailer.innerHTML = element.Trailer;
              //   columnaTrailer.style.textAlign = 'center';
              //   const columnaConfiguracion = document.createElement('td'); //anticipo
              //   columnaConfiguracion.innerHTML = element.Configuracion;
              //   columnaConfiguracion.style.textAlign = 'center';
              //   const columnaVinculacion = document.createElement('td'); //fecha del cumplido
              //   columnaVinculacion.innerHTML = element.tipo_vinculacion;
              //   columnaVinculacion.style.textAlign = 'center';
              //   const columnaChasis = document.createElement('td'); // numero de remesa
              //   columnaChasis.innerHTML = element.num_chasis;
              //   columnaChasis.style.textAlign = 'center';
              //   // const columnaCliente = document.createElement('td'); //generador de carga
              //   // columnaCliente.innerHTML = element.nombre_cliente;
              //   // columnaCliente.style.textAlign = 'center';
              //   // const columnaS = document.createElement('td');
              //   // columnaS.innerHTML = '';
              //   // columnaS.style.textAlign = 'center';
              //   // const columnaL = document.createElement('td');
              //   // columnaL.innerHTML = '';
              //   // columnaL.style.textAlign = 'center';
              //   // const columnaFacturacion = document.createElement('td');
              //   // columnaFacturacion.innerHTML = '';
              //   // columnaFacturacion.style.textAlign = 'center';
              //   // const columnaAprobado = document.createElement('td');
              //   // columnaAprobado.innerHTML = '';
              //   // columnaAprobado.style.textAlign = 'center';
              //   // const columnaRadicado = document.createElement('td');
              //   // columnaRadicado.innerHTML = '';
              //   // columnaRadicado.style.textAlign = 'center';
              //   //Armar tabla
              //   fila.appendChild(columnaManifiesto);
              //   fila.appendChild(columnaFecha);
              //   fila.appendChild(columnaPlaca);
              //   fila.appendChild(columnaTrailer);
              //   fila.appendChild(columnaConfiguracion);
              //   fila.appendChild(columnaVinculacion);
              //   fila.appendChild(columnaChasis);
              //   // fila.appendChild(columnaCliente);
              //   // fila.appendChild(columnaS);
              //   // fila.appendChild(columnaL);
              //   // fila.appendChild(columnaFacturacion);
              //   // fila.appendChild(columnaAprobado);
              //   // fila.appendChild(columnaRadicado);
              //   tbody.appendChild(fila);
              // });
            } else {
              tbody.innerHTML = '';
              const fila = document.createElement('tr');
              const columnaDatos = document.createElement('td');
              columnaDatos.setAttribute('colspan', '8');
              columnaDatos.classList.add('text-center');
              columnaDatos.textContent = 'No hay resultados de la operación';
              fila.appendChild(columnaDatos);
              // Rendreizar la tabla
              tbody.appendChild(fila);
            }
          })
          .catch(error => {
            alert(error);
          });
      } catch (error) { } finally {
        $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
      }
    }
  });

  //boton de excel
  document.getElementById('exportar_excel').addEventListener('click', function () {
    var table = document.getElementById('informe_de_calidad');
    // var wb = XLSX.utils.table_to_book(table);
    // Crear contenido de archivo con fecha
    // var fecha = new Date();
    // Preprocesar la tabla: evitar que fechas se interpreten mal
    Array.from(table.getElementsByTagName('td')).forEach(function (td) {
      const text = td.innerText.trim();

      // Detectar valores con $ o formatos de fecha ISO
      const esFecha = /^\d{4}-\d{2}-\d{2}$/.test(text); // Formato YYYY-MM-DD

      if (esFecha) {
        td.setAttribute('data-t', 's'); // Marcar como texto para Excel
      }
    });

    var wb = XLSX.utils.table_to_book(table);
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe de Calidad${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
    XLSX.writeFile(wb, nombreArchivo);
  });
});
