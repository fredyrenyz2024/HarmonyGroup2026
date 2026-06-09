var solicitud_servicio = new Array();
document.addEventListener('DOMContentLoaded', async e => {
    let codigo_inicio = '';

    init();
    setInterval(init, 300000);

    // document.addEventListener('click', async e => {
    //     const BtnGestion = e.target.closest('.btn-gestion-manifiesto');
    //     if (BtnGestion) {
    //         let ManifiestoId = BtnGestion.getAttribute('data-Manifiestoid');
    //         Tarjeta_Seguimiento(ManifiestoId);
    //         Informacion(ManifiestoId);
    //     }
    // });

    // $('#btn_finalizar').click(async function () {
    //     let dato = new FormData();
    //     dato.append('maniesto', $('#maniesto').val());
    //     dato.append('cod_inicio', $('#cod_inicio').val());
    //     dato.append('cod_punto', $('#cod_punto').val());
    //     try {
    //         const response = await fetch($('#base_url').val() + 'control_ruta/finalziar_Seguimiento', {
    //             method: 'POST',
    //             body: dato,
    //             cache: 'no-cache',
    //         });
    //         const data = await response.json();
    //         if (data.numero == 200) {
    //             let mensaje = `
    //   <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
    //       <div class="icon"><span class="mdi mdi-check"></span></div>
    //       <div class="message">
    //         <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //         <strong>Mensaje!</strong> ${data.mensaje}
    //       </div>
    //   </div> `;
    //             document.getElementById('mensaje').innerHTML = mensaje;
    //             $('#d-footer-primary').modal('toggle');
    //             Tabla_llegada();
    //         } else {
    //             let mensaje = `
    //   <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">
    //       <div class="icon"><i class="fas fa-times"></i></div>
    //       <div class="message">
    //         <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
    //         <strong>Mensaje!</strong> Error al finalziar el Manifiesto.
    //       </div>
    //   </div> `;
    //             document.getElementById('mensaje').innerHTML = mensaje;
    //         }
    //     } catch (error) {
    //         console.error('Error en la segunda solicitud:', error);
    //         throw error;
    //     } finally {
    //         $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    //     }
    // });
});

async function init() {
    try {
        alert('Entro a la función init');
        // const response = await fetch($('#base_url').val() + 'trafico/Datos_SinFiltro', {
        //     method: 'POST',
        //     cache: 'no-cache',
        // });
        // const data = await response.json();

        // if (!data || !data.data) {
        //     alert('Error al traer los datos');
        //     return;
        // }

        // let template = '';
        // let solicitudes = [];

        // data.data.forEach((item, i) => {
        //     const c = i + 1;

        //     template += `
        //         <tr id="tiempos${c}">
        //             <td style="white-space: nowrap;" id="semaforo${c}">
        //                 <!--<a href="#" class='text-decoration-none btn-gestion-manifiesto' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" data-ManifiestoId='${item.id}'>${item.id}</a>-->
        //                 <a href="#" onClick="Registra_Seguimiento(${item.id})">${item.id}</a>
        //             </td>
        //             <td style='width:auto; white-space: nowrap;' id="tiempo${c}"></td>
        //             <td style='width:auto; white-space: nowrap;'>${item.origen} - ${item.destino}</td>
        //             <td style='width:auto; white-space: nowrap;'>${item.placa}</td>
        //             <td style='width:auto; white-space: nowrap;'>${item.nombre_conductor} ${item.apellido1} ${item.apellido2}</td>
        //             <td style='width:auto; white-space: nowrap;'>${item.celular}</td>
        //             <td style='width:auto; white-space: nowrap;'>${item.nombre_cliente}</td>
        //             <td style='width:auto; white-space: nowrap;' id="ultimositio${c}"></td>
        //             <td style='width:auto; white-space: nowrap;' id="maxhorafecha${c}"></td>
        //             <td style='width:auto; white-space: nowrap;' id="ultimaousuario${c}"></td>
        //         </tr>`;

        //     if (item.cod_ini_ruta) {
        //         solicitudes.push({ codini: item.cod_ini_ruta, id: c });
        //     }
        // });

        // // Destruir el DataTable si existe antes de limpiar e insertar HTML nuevo
        // if ($.fn.DataTable.isDataTable('#tbl_Manifiestos_seguimiento')) {
        //     $('#tbl_Manifiestos_seguimiento').DataTable().clear().destroy();
        // }

        // // Renderizar nuevo contenido
        // $('#tablero').html(template);

        // // Esperar a que el DOM se actualice completamente
        // setTimeout(async () => {
        //     // Ejecutar actualizaciones por cada fila (datos asíncronos)
        //     // await Promise.all(solicitudes.map(item => actualizarInfo(item.codini, item.id)));
        //     await actualizarInfoLote(solicitudes);

        //     // Verificar que la tabla exista
        //     if (document.querySelector('#tbl_Manifiestos_seguimiento')) {
        //         new DataTable('#tbl_Manifiestos_seguimiento', {
        //             paging: false,
        //             searching: true,
        //             ordering: true,
        //             order: [[1, 'desc']],
        //             info: false,
        //             responsive: true,
        //             pageLength: 100,
        //             dom: '<"row"<"col-sm-10 custom-search"f><"col-sm-2 text-right"B>>' + '<"row"<"col-sm-12"tr>>',
        //             buttons: [
        //                 {
        //                     extend: 'excelHtml5',
        //                     text: '<i class="fa-regular fa-file-excel"></i> Exportar a Excel',
        //                     className: 'btn btn-success input-sm',
        //                     exportOptions: { columns: ':visible', modifier: { page: 'all' } },
        //                 },
        //             ],
        //             language: {
        //                 decimal: ',',
        //                 thousands: '.',
        //                 search: 'Buscar:',
        //                 zeroRecords: 'No se encontraron resultados',
        //                 info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        //                 infoEmpty: 'Mostrando 0 a 0 de 0 registros',
        //                 infoFiltered: '(filtrado de _MAX_ registros totales)',
        //                 paginate: { first: 'Primero', last: 'Último', next: 'Siguiente', previous: 'Anterior' },
        //             },
        //         });
        //     }

        //     // Funciones auxiliares luego de renderizar
        //     await Contadores_manifiestos();
        //     Tabla_llegada();
        // }, 50); // Esperar que el DOM pinte

    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
