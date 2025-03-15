
window.VENTANA = null;
$(document).ready(function () {

  window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    // Crear instancia
    // Usar una variable global o una propiedad en el objeto window
    if (!window.myOffcanvas) {
      window.myOffcanvas = new DynamicOffcanvas({
        id: `customOffcanvas${id}`,
        title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
        content: '<p>Contenido inicial</p>',
        scroll: true,
        backdrop: false
      });
    } else {
      console.log('El offcanvas ya está creado.');
    }

    const hoy = new Date(); // Obtener la fecha actual
    const fechaHoy = hoy.toISOString().split('T')[0]; // Formatear como YYYY-MM-DD
    const SELECTFILTRO = "todos";
    var fecha_inicial = fechaHoy;
    var fecha_final = fechaHoy;
    var estado = "Prioritaria";
    var cliente = "";
    Filtro_Prioritarias(SELECTFILTRO, fecha_inicial, fecha_final, estado, cliente);

    $(`#campo-${window.VENTANA}-filtro`).off("change").on("change", function () {
      let valorSeleccionado = $(this).val();
      if (valorSeleccionado.trim().toLowerCase() === "clientes") {
        document.getElementById(`campo-${window.VENTANA}-clientes`).style.display = "block";
        $.ajax({
          url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
          type: "POST",
          dataType: "json",
          success: function (data) {
            let select = $(`#campo-${window.VENTANA}-clientes`);
            select.empty().append('<option value="">Seleccione</option>');

            $.each(data, function (index, item) {
              select.append(`<option value="${item.id}">${item.nombre}</option>`);
            });

            // Inicializa Select2 en el select de clientes
            select.select2({
              placeholder: 'Seleccione una opción',
              allowClear: true,
            });
          },
          error: function (xhr, status, error) {
            console.error("Error en AJAX:", status, error);
            alert("Error al cargar los datos.");
          }
        });
      } else if (valorSeleccionado.length == 0) {
        document.getElementById(`campo-${window.VENTANA}-clientes`).style.display = "none";
      }
    });


    $(`#campo-${window.VENTANA}-clientes`).off("change").on("change", function () {
      let valorSeleccionado = $(this).val();
      // console.log("Cambio en el filtro detectado. Mostrando clientes... " + valorSeleccionado); // Depuración
      Filtro_Prioritarias(SELECTFILTRO, fecha_inicial, fecha_final, "Prioritaria", valorSeleccionado);
    });

    document.addEventListener('click', async function (e) {  // 🔹 Escuchamos eventos de clic en toda la página
      if (e.target.matches("#btn_aprobar_solicitud") || e.target.closest("#btn_aprobar_solicitud")) {
        let enlace = e.target.closest('#btn_aprobar_solicitud');
        let dataId = enlace.getAttribute('data-id');

        const result = await Swal.fire({
          title: 'Seguro',
          text: '¿Desea aprobar la solicitud?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3B71CA',
          cancelButtonColor: '#9FA6B2',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          customClass: {
            popup: 'swal2-custom-font',
          },
        });

        if (result.isConfirmed) {
          var datos = new FormData();
          datos.append('solicitud', dataId);
          datos.append('estado', "Aprobada");

          try {
            const response = await fetch($('#base_url').val() + 'serviciocliente/Aprobar_Prioridad', {
              method: 'POST',
              body: datos,
              cache: 'no-cache',
            });
            const data = await response.json();

            Swal.fire({
              title: "Mensaje!",
              text: data.message,
              icon: data.status === 200 ? "success" : "error",
              draggable: true
            });
            Filtro_Prioritarias(SELECTFILTRO, fecha_inicial, fecha_final, estado, cliente);

            if (data.ststus === 200) resetAll();
          } catch (error) {
            console.error('Error en la solicitud:', error);
          }
        }
      }

      if (e.target.matches("#btn-detalle-solicitud-servicio") || e.target.matches("#btn-detalle-solicitud-servicio *")) {
        myOffcanvas.updateContent(`<h4>Contenido Actualizados: ${window.VENTANA}</h4>`);
        myOffcanvas.show();
      }
    });

  };
});

async function Filtro_Prioritarias(SELECTFILTRO, fecha_inicial, fecha_final, estado, cliente) {
  if (SELECTFILTRO !== '') {
    $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
    try {
      let data = new FormData();
      data.append('filtro', SELECTFILTRO);
      data.append('fecha_inicial', fecha_inicial);
      data.append('fecha_final', fecha_final);
      data.append('estado', estado);
      data.append('cliente', cliente);
      await fetch($('#base_url').val() + 'prefiltro_nacional/Consultar_Solicitudes', {
        method: 'POST',
        body: data,
      })
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then(function (data) {
          let tbody = document.getElementById('tbl-solicitudes-prioritarias');
          let clase_btn = '';
          let estado = '';
          let template = '';
          let toltip = '';
          let estadobtn = '';
          let itr = '';
          let perfil = document.getElementById("perfil_id").value;
          if (data.length > 0) {
            // console.log(data);
            template.innerHTML = '';
            data.forEach(element => {
              if (element.esoli === 'Realizada') {
                clase_btn = 'success';
                estado = 'Realizada';
                toltip = 'Realizada';
                estadobtn = 'disabled';
              } else if (element.esoli === 'En_subasta') {
                clase_btn = 'info';
                estado = 'Subasta';
                toltip = 'Subasta';
                estadobtn = '';
              } else if (element.esoli === 'Pendiente') {
                // Se usar el estado pendiente porque este proviene de la tabla de solicitudes de servicio.
                // } else if (element.esoli === null) {
                clase_btn = 'warning';
                estado = 'Pendiente';
                toltip = 'Pendiente';
                estadobtn = '';
              } else if (element.esoli === 'asignada') {
                clase_btn = 'warning';
                estado = 'Asignada';
                toltip = 'Asignada Solicitud Prefiltro';
                estadobtn = '';
              } else if (element.esoli === 'en_tramite') {
                clase_btn = 'warning';
                estado = 'En tramite';
                toltip = 'En tramite solicitud prefiltro';
                estadobtn = '';
              } else if (element.esoli === 'aprobado_prefiltro') {
                clase_btn = 'success';
                estado = 'Aprobado prefiltro';
                toltip = 'Aprobado prefiltro';
                estadobtn = '';
              }
              if (element.itr === 'Si') {
                // itr = '<span class="badge badge-success float-right">SI</span>';
                itr = '<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">SI</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>';
              } else {
                // itr = '<span class="badge badge-primary float-right">NO</span>';
                itr = '<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">NO</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>';
              }

              if (element.prioritaria === 'Propuesta') {
                if (perfil === '1') {
                  Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label"><a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-primary" title="Aprobar solicitud">${element.prioritaria}</a></span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
                } else {
                  Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">${element.prioritaria}</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
                }
              } else if (element.prioritaria === 'Aprobada') {
                Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">${element.prioritaria}</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
              } else {
                Prioridad = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Sin proponer</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
              }

              template += `
            <tr>
              <!--<td class='text-${clase_btn}'>
                 <center>
                  <span class="mdi mdi-dot-circle icon" data-toggle="tooltip" title="${element.esoli !== null ? element.esoli : 'Pendiente'}"></span>
                 </center> data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop"
              </td>-->

                <td class="cell-detail">
                  <div class="dropdown">
                    <a class="btn btn-link dropdown-toggle text-decoration-none fw-bold" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">N°${element.elid}</a>
                    <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                      <a class="dropdown-item fw-bold" href="#"  onclick="preestudio(this);" data-id="${element.n_cotizacion}" 
                      data-id2="${element.nundoc_solicitud}" data-id3="${element.nombre_cliente}" data-id4="${element.item}" data-id5="${element.tipo_mercancia}"
                      data-id6="${element.flete}" data-id7="${element.peso_neto_tn}" data-id8="${element.tipo_servicio_mer}"  data-id9="${element.total_tarifa}"
                      data-id10=""${element.origen_rndc}"  data-id11="${element.itr}" onclick="reiniciar_contador();" ${estadobtn}><span class="uil uil-envelope-send"></span> Solicitar Estudio Seguridad</a>
                      <a class="dropdown-item fw-bold" href="#" id="btn-detalle-solicitud-servicio" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}"><span class="uil uil-file-search-alt"></span> Detalle Solicitud</a>
                      ${(element.prioritaria === "Propuesta" || element.prioritaria === "Aprobada") ? '' : `<a class="dropdown-item fw-bold" id="btn-solicitar-prioridad" href="#" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}"> <span class="uil uil-bell"></span> Solicitar Prioridad </a>`}
                      <!--<div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#">Separated link</a>-->
                    </div>
                  </div>
                  <!--COT-SS-BN
                  <span>${element.n_cotizacion} - ${element.elid} - ${element.item} </span>
                  <span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer}</span>-->
                </td>
              <td>
                <span class="text-success" style="font-weight:800;">${element.tipo_servicio_mer}</span>   
              </td>

              <td>
                <span>${itr}</span>
              </td>

              <td style="width: auto; white-space: nowrap; color:black;">
                  <span> ${element.nombre_cliente} ${element.nit}</span>
              </td>

              <td style="width: auto; white-space: nowrap; color:black;">
                  <span>${element.tipo_mercancia}</span>
              </td>

              <td style="width: auto; white-space: nowrap; color:black;">
                  <span>${element.nombre}</span>
              </td>

              <td style="width: auto; white-space: nowrap; color:black;">
                <span title="Peso Neto kg">${formatNum(element.peso_kg)} kg</span>
              </td>

              <td style="width: auto; white-space: nowrap; color:black;">
                <span><b>Origén:</b> ${element.origen_solicitud} - <b>Destino:</b> ${element.destino_solicitud}</span>
              </td>

              <td class="cell-detail text-center" style="width: auto; white-space: nowrap; color:black;">
                <span>${element.fecha} ${element.hora_creacion} </span>
              </td>
              
              <td class="cell-detail text-center" style="width: auto; white-space: nowrap; color:black;">
                  ${Prioridad}
              </td>
            
              <td style="width: auto; white-space: nowrap; color:black;">
                   ${element.numero_placas > 0 ? '<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Placas asignadas</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>' : '<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Sin asignar</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>'}
              </td>
          </tr>`;
              tbody.innerHTML = template;
            });
          } else {
            tbody.innerHTML = '<tr><td class="cell-detail fw-bold" colspan="10"><span class="uil uil-list-ui-alt"></span> Sin resultados </td></tr>';
          }
        })
        .catch(error => {
          alert(error);
        });
    } catch (error) {
      alert('Error de trucaht' + error);
    } finally {
      $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
  }
}

function formatNum(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}