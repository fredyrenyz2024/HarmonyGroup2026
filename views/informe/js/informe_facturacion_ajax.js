const d = document;
const w = window;

document.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();

  document.addEventListener('click', async (e) => {
    if (e.target.matches('#aplicar_filtro') || e.target.matches('#aplicar_filtro *')) {
      try {
        let data = new FormData();
        data.append('fecha_inicial', document.getElementById('fecha_inicial').value);
        data.append('fecha_final', document.getElementById('fecha_final').value);
        await fetch($('#id_url_ajax').val() + 'informe/listar_consulta_facturacion', {
          method: 'POST',
          cache: 'no-cache',
          body: data,
        })
          .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then(function (data) {
            cont = 0;
            let tbody = document.getElementById('tbl_informe_factu');
            tbody.innerHTML = '';
            if (data.result != '') {
              data.resultado.forEach((element) => {
                const fila = document.createElement('tr');
                const columnaManifiesto = document.createElement('td'); //manifiesto
                columnaManifiesto.innerHTML = element.numero_manifiesto;
                columnaManifiesto.style.textAlign = 'center';

                const columnaFecha = document.createElement('td'); //fecha expedicion
                columnaFecha.innerHTML = element.fecha_expedicion;
                columnaFecha.style.textAlign = 'center';

                const columnaPlaca = document.createElement('td'); //placa del vehículo
                columnaPlaca.innerHTML = element.placa;
                columnaPlaca.style.textAlign = 'center';

                const columnaFlete = document.createElement('td'); //flete del conductor o valor del manifiesto
                columnaFlete.innerHTML = element.valor_total_viaje;
                columnaFlete.style.textAlign = 'center';

                const columnaAnticipo = document.createElement('td'); //anticipo
                columnaAnticipo.innerHTML = element.valor_anticipo;
                columnaAnticipo.style.textAlign = 'center';

                const columnaCumplido = document.createElement('td'); //fecha del cumplido
                columnaCumplido.innerHTML = element.fecha_cumplido;
                columnaCumplido.style.textAlign = 'center';

                const columnaRemesa = document.createElement('td'); // numero de remesa
                columnaRemesa.innerHTML = element.numero_remesa;
                columnaRemesa.style.textAlign = 'center';

                const columnaCliente = document.createElement('td'); //generador de carga
                columnaCliente.innerHTML = element.nombre_cliente;
                columnaCliente.style.textAlign = 'center';

                const columnaS = document.createElement('td');
                columnaS.innerHTML = '';
                columnaS.style.textAlign = 'center';

                const columnaL = document.createElement('td');
                columnaL.innerHTML = '';
                columnaL.style.textAlign = 'center';

                const columnaFacturacion = document.createElement('td');
                columnaFacturacion.innerHTML = '';
                columnaFacturacion.style.textAlign = 'center';

                const columnaAprobado = document.createElement('td');
                columnaAprobado.innerHTML = '';
                columnaAprobado.style.textAlign = 'center';

                const columnaRadicado = document.createElement('td');
                columnaRadicado.innerHTML = '';
                columnaRadicado.style.textAlign = 'center';

                //Armar tabla
                fila.appendChild(columnaManifiesto);
                fila.appendChild(columnaFecha);
                fila.appendChild(columnaPlaca);
                fila.appendChild(columnaFlete);
                fila.appendChild(columnaAnticipo);
                fila.appendChild(columnaCumplido);
                fila.appendChild(columnaRemesa);
                fila.appendChild(columnaCliente);
                // fila.appendChild(columnaS);
                // fila.appendChild(columnaL);
                // fila.appendChild(columnaFacturacion);
                fila.appendChild(columnaAprobado);
                fila.appendChild(columnaRadicado);
                tbody.appendChild(fila);
              });
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
          .catch((error) => {
            alert(error);
          });
      } catch (error) {}
    }
  });

  //boton de excel
  document.getElementById('exportar_excel').addEventListener('click', function () {
    var table = document.getElementById('informe_afacturacion');
    var wb = XLSX.utils.table_to_book(table);
    // Crear contenido de archivo con fecha
    // var fecha = new Date();
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombreArchivo = `Informe Facturacion${fechaActual}.xlsx`; //'Informe Remesas_${fecha.toISOString()}.xlsx '
    XLSX.writeFile(wb, nombreArchivo);
  });
});
