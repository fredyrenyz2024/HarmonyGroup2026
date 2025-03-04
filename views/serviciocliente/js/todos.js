window.VENTANA = null;
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID de la ventana a la variable global

  const hoy = new Date(); // Obtener la fecha actual
  const fechaHoy = hoy.toISOString().split('T')[0]; // Formatear como YYYY-MM-DD

  if (window.VENTANA == 1) {
    var tipo = 2;
    var dato = "";
    var fecha_inicial = $(`#campo-${window.VENTANA}-fecha_inicial`).val() === undefined ? fechaHoy : $(`#campo-${window.VENTANA}-fecha_inicial`).val();
    var fecha_final = $(`#campo-${window.VENTANA}-fecha_final`).val() === undefined ? fechaHoy : $(`#campo-${window.VENTANA}-fecha_final`).val();
    var cliente = $(`#campo-${window.VENTANA}-clientes`).length > 0 ? $(`#campo-${window.VENTANA}-clientes`).val() || "" : "";
    var empresa = $(`#campo-${window.VENTANA}-empresas`).length > 0 ? $(`#campo-${window.VENTANA}-empresas`).val() || "" : "";

    var estado = "Todas";
    listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);

    /************************** Funcion para buscar Cotizaciones ******************************/
    document.addEventListener("click", async e => {
      if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
        var tipo = 2;
        var fecha_inicial = $(`#campo-${window.VENTANA}-fecha_inicial`).val();
        var fecha_final = $(`#campo-${window.VENTANA}-fecha_final`).val();
        var cliente = $(`#campo-${window.VENTANA}-clientes`).val() === "" ? "" : $(`#campo-${window.VENTANA}-clientes`).val();
        var empresa = $(`#campo-${window.VENTANA}-empresas`).val() === '' ? "" : $(`#campo-${window.VENTANA}-empresas`).val();
        var estado = "Todas";
        listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
      }

      if (e.target.matches("#btn_ver_solicitud") || e.target.matches("#btn_ver_solicitud *")) {
        // let padre = e.target.parentElement.parentElement;
        // Obtener el enlace (el elemento con el data-id)
        let enlace = e.target.closest('#btn_ver_solicitud');
        // // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id');
        let dataId2 = enlace.getAttribute('data-id2');
        let dataId3 = enlace.getAttribute('data-id3');
        // Visualizar(dataId, dataId2, dataId3);

        // // Definir dimensiones de la nueva ventana
        const w = 1000;
        const h = 1000;

        // Fixes dual-screen position                         Most browsers      Firefox
        var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
        var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

        var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        var left = ((width / 2) - (w / 2)) + dualScreenLeft;
        var top = ((height / 2) - (h / 2)) + dualScreenTop;
        var newWindow = window.open($('#base_url').val() + "serviciocliente/canvas?cotizacion=" + encodeURIComponent(dataId) + "&solicitud_servicio=" + encodeURIComponent(dataId2) + "&ventana=" + encodeURIComponent(dataId3), "ventanaCentrada", 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

        // Puts focus on the newWindow
        if (window.focus) {
          newWindow.focus();
        }
      }
    });

    // // Filtro para clientes
    // $(document).on("change", `#campo-${window.VENTANA}-filtro`, function () {
    //   let valorSeleccionado = $(this).val();

    //   // Verifica si los elementos existen antes de manipularlos
    //   let $clientes = $(`#campo-${window.VENTANA}-clientes`);
    //   let $empresas = $(`#campo-${window.VENTANA}-empresas`);
    //   let $estados = $(`#campo-${window.VENTANA}-estados`);

    //   // Oculta todos antes de mostrar el que corresponde
    //   $clientes.hide();
    //   $empresas.hide();
    //   $estados.hide();

    //   if (valorSeleccionado === "Clientes") {
    //     $clientes.show();

    //     // Cargar clientes por AJAX
    //     $.ajax({
    //       url: $('#base_url').val() + 'serviciocliente/Listar_Clientes',
    //       type: "POST",
    //       dataType: "json",
    //       success: function (data) {
    //         $clientes.empty().append('<option value="">Seleccione</option>');
    //         $.each(data, function (index, item) {
    //           $clientes.append(`<option value="${item.id}">${item.nombre}</option>`);
    //         });

    //         // Inicializa Select2 en el select de clientes
    //         $clientes.select2({
    //           placeholder: 'Seleccione una opción',
    //           allowClear: true,
    //         });
    //       },
    //       error: function (xhr, status, error) {
    //         console.error("Error en AJAX:", status, error);
    //         alert("Error al cargar los datos.");
    //       }
    //     });

    //   } else if (valorSeleccionado === "Empresa") {
    //     if ($clientes) {
    //       $clientes.hide();
    //       alert("ENTRO BIEN")
    //     }
    //     $empresas.show();

    //     // Cargar empresas por AJAX
    //     $.ajax({
    //       url: $('#base_url').val() + 'serviciocliente/Listar_Empresas',
    //       type: "POST",
    //       dataType: "json",
    //       success: function (data) {
    //         $empresas.empty().append('<option value="">Seleccione</option>');
    //         $.each(data, function (index, item) {
    //           $empresas.append(`<option value="${item.id}">${item.nombre_empresa}</option>`);
    //         });

    //         // Inicializa Select2 en el select de empresas
    //         $empresas.select2({
    //           placeholder: 'Seleccione una opción',
    //           allowClear: true,
    //         });
    //       },
    //       error: function (xhr, status, error) {
    //         console.error("Error en AJAX:", status, error);
    //         alert("Error al cargar los datos.");
    //       }
    //     });
    //   } else if (valorSeleccionado === "Estado") {
    //     $estados.show();
    //   }
    // });

    // Suponiendo que "window.VENTANA" es "V1" o el que corresponda:
    // Si es variable, sustituye en la concatenación de IDs.
    // document.addEventListener('DOMContentLoaded', function () {});
    const filtro = document.getElementById(`campo-${window.VENTANA}-filtro`);
    if (!filtro) return; // Si no existe, salimos.

    // Escuchamos el evento 'change' en el <select> del filtro
    filtro.addEventListener('change', function () {
      const valorSeleccionado = this.value;

      // Referencias a los otros <select>
      const clientes = document.getElementById(`campo-${window.VENTANA}-clientes`);
      const empresas = document.getElementById(`campo-${window.VENTANA}-empresas`);
      const estados = document.getElementById(`campo-${window.VENTANA}-estados`);

      // Primero, ocultamos todos
      // if (clientes) clientes.style.display = 'none';
      // if (empresas) empresas.style.display = 'none';
      // if (estados) estados.style.display = 'none';

      // URL base (ajusta a tu ruta real)
      const baseUrl = document.getElementById('base_url').value;

      if (valorSeleccionado === 'Clientes') {
        if (clientes) {
          clientes.style.display = ''; // Muestra el select (display: block/inline-block, etc.)
          empresas.style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
          estados.style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)

          // Petición AJAX con fetch
          fetch(baseUrl + 'serviciocliente/Listar_Clientes', {
            method: 'POST',
            // Si tu backend requiere parámetros, ajusta headers/body:
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({}) // Envía lo que necesites
          })
            .then(response => response.json())
            .then(data => {
              // Vaciamos opciones y agregamos la opción "Seleccione"
              clientes.innerHTML = '<option value="">Seleccione</option>';

              data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nombre;
                clientes.appendChild(option);
              });

              // Inicializar Select2 (requiere jQuery).
              // Si sigues teniendo jQuery y select2 cargados, podrías hacer:
              if (window.$ && $.fn.select2) {
                $(clientes).select2({
                  placeholder: 'Seleccione una opción',
                  allowClear: true
                });
              }
            })
            .catch(error => {
              console.error('Error en AJAX:', error);
              alert('Error al cargar los datos.');
            });
        }

      } else if (valorSeleccionado === 'Empresa') {
        if (empresas) {
          // if (clientes) {
          //   alert(clientes);
          //   clientes.style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
          // }
          document.getElementById(`contenedor_1_clientes`).style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
          estados.style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
          empresas.style.display = '';
          
          fetch(baseUrl + 'serviciocliente/Listar_Empresas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          })
            .then(response => response.json())
            .then(data => {
              empresas.innerHTML = '<option value="">Seleccione</option>';

              data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.nombre_empresa;
                empresas.appendChild(option);
              });

              // Inicializar Select2 (requiere jQuery).
              if (window.$ && $.fn.select2) {
                $(empresas).select2({
                  placeholder: 'Seleccione una opción',
                  allowClear: true
                });
              }
            })
            .catch(error => {
              console.error('Error en AJAX:', error);
              alert('Error al cargar los datos.');
            });
        }

      } else if (valorSeleccionado === 'Estado') {
        if (estados) {
          estados.style.display = '';
          // Si necesitas cargar datos vía AJAX, hazlo de forma similar.
        }
      }
    });
  }

  async function listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id) {
    /* Funcion para enviar los datos */
    $('#load_info').css('display', 'flex'); // Mostrar mensaje de carga
    let dato = new FormData();
    dato.append('tipo', tipo);
    dato.append('fecha_inicial', fecha_inicial);
    dato.append('fecha_final', fecha_final);
    dato.append('estado', estado);
    dato.append('cliente', cliente);
    dato.append('empresa', empresa);
    try {
      const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
        method: 'POST',
        body: dato,
        cache: 'no-cache',
      });
      const data = await response.json();
      if (data) {
        $('#load_info').css('display', 'none'); // Mostrar mensaje de carga
        let tbody = document.getElementById('tbl_cotizaciones');
        tbody.innerHTML = '';
        let esatdo_autorizado = '';
        let col_estatus = '';
        let cot_itr = '';
        let n_cotizacion = '';
        let btn_editar = '';
        let Prioridad = '';

        data.resultado.forEach(element => {
          const fila = document.createElement('tr');
          if (element.estado_estudio === 'Sin Estado') {
            if (element.estado === 'Pendiente') {
              col_estatus = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado === 'por autorizar') {
              col_estatus = `<span  data-toggle="tooltip" style="color:#ec1f00;">${element.estado}</span>`;
            } else {
              col_estatus = ` <span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            }
          } else {
            if (element.estado_estudio === 'pendiente_iniciar') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Estudio Pendiente Iniciar</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'iniciado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-info"><span class="badge-label">Estudio Iniciado</span><span class="ms-1" data-feather="info" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Pendiente') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Estudio Pendiente</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Rechazado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Estudio Rechazado</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Aprobado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Estudio Aprobado</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'vencida') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Estudio Vencido</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
            } else if (element.estado_estudio === 'Sin Estado') {
              col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Sin Estado</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
            }
          }

          // if (element.estado_autorizado === 'autorizado') {
          //   col_estatus = `< span  data - toggle="tooltip" style = "color:purple;" > ${ element.estado_autorizado }</span > `;
          // } else if (element.estado_autorizado === 'por autorizar') {
          //   col_estatus = `< span  data - toggle="tooltip" style = "color:red;" > ${ element.estado_autorizado }</span > `;
          // } else {
          //   col_estatus = `< td class="text" ></td > `;
          // }

          /* Consultas de estado de las solicitudes */
          if (element.estado_autorizacion === 'F1') {
            // esatdo_autorizado = `< span class="mdi mdi-dot-circle icon text-default"  data - toggle="tooltip" title = "Realizada" ></span > `;
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary" ><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F2') {
            // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-success"  data - toggle="tooltip" title = "Entregada" ></span > `;
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary" ><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F4') {
            // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-danger" data - toggle="tooltip" title = "Pérdida" ></span > `;
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger" ><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F3') {
            // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-warning"  data - toggle="tooltip" title = "Ganada" ></span > `;
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success" ><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F5') {
            // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-primary" data - toggle="tooltip" title = "Cancelada" ></span > `;
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger" ><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F6') {
            // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-gray" data - toggle="tooltip" title = "Rechazada" ></span > `;
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning" ><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span > `;
          }
          /* Validar si la solicitud es Itr */
          if (element.itr === 'Si') {
            cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right" > SI</span > `;
          } else {
            cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right" > NO</span > `;
          }

          if (element.prioritaria === 'Propuesta') {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right" > <a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span > `;
          } else if (element.prioritaria === null) {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-info float-right" > No marcada</span > `;
          } else {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right" > ${element.prioritaria}</span > `;
          }

          const columnaEstado = document.createElement('td');
          columnaEstado.innerHTML = col_estatus;
          const columnaEstado_Autorizacion = document.createElement('td');
          columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
          const columnaItr = document.createElement('td');
          columnaItr.innerHTML = cot_itr;
          const columnaNum_Cotizacion = document.createElement('td');
          // columnaNum_Cotizacion.innerHTML = `<a href="#" id=btn_ver_solicitud" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}" aria-controls="offcanvasRight" class="text-decoration-none"> N°${element.nundoc_solicitud}</a > `;
          columnaNum_Cotizacion.innerHTML = `
                      <div class="dropdown">
                        <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.nundoc_solicitud}</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                          <a class="dropdown-item fw-bold" href="#" id=btn_ver_solicitud" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}"><span class="uil uil-file-search-alt"></span> Detalle solicitud servicio</a>
                          <a class="dropdown-item fw-bold" href="#"><span class="uil uil-transaction"></span> Aprobar Subasta</a> 
                          <a class="dropdown-item fw-bold" href="#"><span class="uil uil-feedback"></span> Aprobar Tarifa</a>

                          <!--<div class="dropdown-divider"></div>
                          <a class="dropdown-item" href="#">Separated link</a>-->
                        </div>
                      </div>
          `;
          const columnaCliente = document.createElement('td');
          columnaCliente.innerHTML = element.nombre_cliente;
          const columnaMercancia = document.createElement('td');
          columnaMercancia.innerHTML = element.tipo_mercancia;
          const columnaPeso = document.createElement('td');
          columnaPeso.innerHTML = element.peso_neto_kg + 'Kg';
          const columnafecha = document.createElement('td');
          columnafecha.innerHTML = element.fecha_solicitud_servicio;
          const columnaServicio = document.createElement('td');
          columnaServicio.innerHTML = element.tipo_transporte;
          const columnaPrioridad = document.createElement('td');
          columnaPrioridad.innerHTML = Prioridad;
          //Empresas
          const columnaAcciones = document.createElement('td');
          columnaAcciones.innerHTML = element.nombre_empresa;

          fila.appendChild(columnaNum_Cotizacion);
          fila.appendChild(columnaItr);
          fila.appendChild(columnaCliente);
          fila.appendChild(columnaMercancia);
          fila.appendChild(columnaPeso);
          fila.appendChild(columnaServicio);
          fila.appendChild(columnafecha);
          fila.appendChild(columnaEstado_Autorizacion);
          fila.appendChild(columnaEstado);
          fila.appendChild(columnaPrioridad);
          fila.appendChild(columnaAcciones);
          tbody.appendChild(fila);
        });
      } else {
        // $('#load_info').css('display', 'none'); // Mostrar mensaje de carga
        // const fila = document.createElement('tr');
        // let tbody = document.getElementById('tbl_cotizaciones');
        // tbody.innerHTML = '';
        // const columnaSinDatos = document.createElement('td');
        // columnaSinDatos.colSpan = '11';
        // columnaSinDatos.style.fontBold = 'bold';
        // columnaSinDatos.innerHTML = `<span class="uil uil-list-ui-alt"></span> Sin resultados`;
        // fila.appendChild(columnaSinDatos);
        // tbody.appendChild(fila);
      }
    } catch (error) {
      console.error('Error en la primera solicitud:', error);
      console.log('error no inserta');
      throw error;
    } finally {
      // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
    }
  }
}