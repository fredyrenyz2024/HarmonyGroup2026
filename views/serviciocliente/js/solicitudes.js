$(document).ready(function () {
  var tipo = 2;
  var fecha_inicial = $('#fecha_inicial').val();
  var fecha_final = $('#fecha_final').val();

  listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final);

  document.addEventListener("click", async e => {
    if (e.target.matches("#buscar") || e.target.matches("#buscar *")) {
      var tipo = 2;
      var fecha_inicial = $('#fecha_inicial').val();
      var fecha_final = $('#fecha_final').val();
      listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final);
    }

    if (e.target.matches("#btn_ver_solicitud") || e.target.matches("#btn_ver_solicitud *")) {
      let padre = e.target.parentElement.parentElement;
      // Obtener el enlace (el elemento con el data-id)
      let enlace = e.target.closest('#btn_ver_solicitud');
      // Obtener el valor del atributo data-id
      let dataId = enlace.getAttribute('data-id');
      let dataId2 = enlace.getAttribute('data-id2');
      Visualizar(dataId, dataId2);
    }

    if (e.target.matches("#btn_edit_cargue") || e.target.matches("#btn_edit_cargue *")) {
      let fecha = document.getElementById("fecha_cargue_edit");
      let hora = document.getElementById("hora_cargue_edit");
      fecha.disabled = false;
      hora.disabled = false;
      document.getElementById("btn_save_cargue").style.display = "block";
      document.getElementById("btn_edit_cargue").style.display = "none";
    }

    if (e.target.matches("#btn_save_cargue") || e.target.matches("#btn_save_cargue *")) {
      if (window.confirm("¿Esta seguro que queire actuazliar la fecha de cargue de la solicitud de servicio?")) {
        let fecha = document.getElementById("fecha_cargue_edit");
        let hora = document.getElementById("hora_cargue_edit");
        var btn = document.getElementById("btn_save_cargue");
        var num_sol = btn.getAttribute("data-sol");
        let datos = new FormData();
        datos.append("solicitud", num_sol);
        datos.append("fecha_cargue", fecha.value);
        datos.append("hora_cargue", hora.value);
        try {
          const response = await fetch($("#id_url_ajax").val() + "solicitudes/update_cargue", {
            method: "POST",
            body: datos,
            cache: "no-cache",
          });
          const data = await response.json();
          // console.log("Primera solicitud completada:", data);
          // return data;
          if (data.numero === 200) {
            document.getElementById("Mensaje_update").innerHTML = `
            <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check-circle"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
              </div>`;
          } else {
            document.getElementById("Mensaje_update").innerHTML = `
            <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
            </div>`;
          }

        } catch (error) {
          console.error("Error en la primera solicitud:", error);
          throw error;
        } finally {
          document.getElementById("fecha_cargue_edit").disabled = true;
          document.getElementById("hora_cargue_edit").disabled = true;
          document.getElementById("btn_save_cargue").style.display = "none";
          document.getElementById("btn_edit_cargue").style.display = "block";
        }
      }
    }

    if (e.target.matches("#btn_edit_descargue") || e.target.matches("#btn_edit_descargue *")) {
      let fecha = document.getElementById("fecha_descargue_edit");
      let hora = document.getElementById("hora_descargue_edit");
      fecha.disabled = false;
      hora.disabled = false;
      document.getElementById("btn_save_descargue").style.display = "block";
      document.getElementById("btn_edit_descargue").style.display = "none";
    }

    /* Boton para gaurar el contenedor en las solicitudes */
    if (e.target.matches("#btn_save_contenedor") || e.target.matches("#btn_save_contenedor *")) {
      Swal.fire({
        title: 'Mnesaje',
        text: '¿Está seguro de continuar?',
        icon: 'question',
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
          formdata.append('numero_contenedor', document.getElementById('numero_contenedor').value);
          formdata.append('mer_idservicio', document.getElementById('mer_idservicio').value);

          // Obtén el elemento por su id (sin el #)
          var checkbox = document.getElementById("agrupable");
          // Verifica si está marcado
          if (checkbox.checked) {
            formdata.append('agrupado', "SI");
          } else {
            formdata.append('agrupado', "NO");
          }

          try {
            const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/GuardarContenedor', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });

            const data = await response.json();
            if (data.status === 400) {
              Swal.fire({
                title: 'Información',
                text: data.message,
                icon: 'info',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            } else {
              Swal.fire({
                title: 'Mensaje',
                text: data.message,
                icon: 'success',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            }
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          }
        }
      });
    }

    /* Boton para actualizar las referencias de los despachos */
    if (e.target.matches("#btn_save_referencia") || e.target.matches("#btn_save_referencia *")) {
      Swal.fire({
        title: 'Mnesaje',
        text: '¿Está seguro de continuar?',
        icon: 'question',
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
          formdata.append('referencia_operacion', document.getElementById('referencia_operacion').value);
          formdata.append('mer_idservicio', document.getElementById('mer_idservicio').value);

          try {
            const response = await fetch($('#id_url_ajax').val() + 'serviciocliente/ActualizarReferencia', {
              method: 'POST',
              body: formdata,
              cache: 'no-cache',
            });

            const data = await response.json();
            if (data.status === 400) {
              Swal.fire({
                title: 'Información',
                text: data.message,
                icon: 'info',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            } else {
              Swal.fire({
                title: 'Mensaje',
                text: data.message,
                icon: 'success',
                customClass: {
                  popup: 'swal2-custom-font',
                },
              });
            }
          } catch (error) {
            console.error('Error en la primera solicitud:', error);
            throw error;
          } finally {
            $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
          }
        }
      });
    }

    if (e.target.matches("#guarda_solicitud") || e.target.matches("#guarda_solicitud *")) {
      if (window.confirm("¿Esta seguro que quiere actualizar las fechas de la solicitud de servicio?")) {
        //let fechacargue= document.getElementById(fecha_cargue_edit);
        let msg_error = '';
        let fechacargue = $("#fecha_cargue_edit").val();
        let horacargue = $("#hora_cargue_edit").val();
        let fechadescargue = $("#fecha_descargue_edit").val();
        let horadescargue = $("#hora_descargue_edit").val();
        let num_sol = $("#mer_idservicio").val();
        let punto_rem = $("#punto_rem").val();
        let punto_des = $("#punto_des").val();
        var fc = (fechacargue + ' ' + horacargue);
        var fd = (fechadescargue + ' ' + horadescargue);

        /* Validar que actualizacion se va a realizar */
        let agencia = document.getElementById("servicio_agencia").value.trim();
        let tipo_servicio = document.getElementById("servicio_cliente").value.trim();

        if (agencia === "" && tipo_servicio === "") {
          if (fc > fd) {
            msg_error += "La Fecha - Hora de cargue no puede ser mayor a la Fecha Descargue";
            alert(msg_error);
          } else {
            let datos = new FormData();
            datos.append("fecha_cargue", fechacargue);
            datos.append("hora_cargue", horacargue);
            datos.append("fecha_descargue", fechadescargue);
            datos.append("hora_descargue", horadescargue);
            datos.append("solicitud", num_sol);
            datos.append("punto_rem", punto_rem);
            datos.append("punto_des", punto_des);
            try {
              const response = await fetch($("#id_url_ajax").val() + "solicitudes/update_cargue", {
                method: "POST",
                body: datos,
                cache: "no-cache",
              });
              const data = await response.json();
              if (data.numero === 200) {
                document.getElementById("Mensaje_update").innerHTML = `
                  <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-check-circle"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> ${data.mensaje}
                    </div>
                    </div>`;
                window.location.reload();
              } else {
                document.getElementById("Mensaje_update").innerHTML = `
                    <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                      <div class="message">
                        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                        <strong>Mensaje!</strong> ${data.mensaje}
                      </div>
                    </div>`;
              }
            } catch (error) {
              console.error("Error en la primera solicitud:", error);
              throw error;
            } finally {
              document.getElementById("fecha_cargue_edit").disabled = true;
              document.getElementById("hora_cargue_edit").disabled = true;
              document.getElementById("btn_edit_cargue").style.display = "block";
              document.getElementById("fecha_descargue_edit").disabled = true;
              document.getElementById("hora_descargue_edit").disabled = true;
              document.getElementById("btn_edit_descargue").style.display = "block";
            }
          }
        } else {
          let datos = new FormData();
          datos.append("agencia", agencia);
          datos.append("tipo_servicio", tipo_servicio);
          datos.append("solicitud", num_sol);
          datos.append("numero_cotizacion", document.getElementById("numero_cotizacion").value);
          try {
            const response = await fetch($("#id_url_ajax").val() + "serviciocliente/update_solicitud", {
              method: "POST",
              body: datos,
              cache: "no-cache",
            });
            const data = await response.json();
            if (data.status === 200) {
              document.getElementById("Mensaje_update").innerHTML = `
              <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-check-circle"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> ${data.message}
                </div>
              </div>`;
              window.location.reload();
            } else {
              document.getElementById("Mensaje_update").innerHTML = `
              <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> ${data.message}
                </div>
              </div>`;
            }

          } catch (error) {
            console.error("Error en la primera solicitud:", error);
            throw error;
          } finally {

          }
        }
      }
    }
  });

  // Seleccionar el checkbox por su id
  const checkbox = document.getElementById('flexSwitchCheckChecked');

  checkbox.addEventListener('change', async function (e) {
    e.preventDefault(); // Evita que el checkbox cambie directamente

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cambiar el estado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      // checkbox.checked = !checkbox.checked; // Aplica el cambio solo si se confirma
      if (checkbox.checked) {
        datos = new FormData();
        datos.append('estado', "Propuesta");
        datos.append('numdoc_solicitud', document.getElementById("numero_solicitud").value);

        try {
          const response = await fetch($('#base_url').val() + 'serviciocliente/Actualizar_Prioridad', {
            method: 'POST',
            body: datos,
            cache: 'no-cache',
          });
          const data = await response.json();

          if (data.status === 200) {
            Swal.fire({
              title: "Mensaje!",
              text: data.message,
              icon: "success",
              draggable: true
            });
            resetAll();
          } else {
            Swal.fire({
              title: "Mensaje!",
              text: data.message,
              icon: "error",
              draggable: true
            });
          }

        } catch (error) {
          console.error('Error en la primera solicitud:', error);
        }
      } else {
        console.log('El checkbox no está marcado (unchecked)');
        // Acciones si no está marcado
      }
    } else {
      checkbox.checked = !checkbox.checked; // Revierte el cambio si se cancela
    }
  });

});

async function listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('tipo', tipo);
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('estado', "Pendiente");
  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let tbody = document.getElementById('tblSolicitudesPendientes');
      tbody.innerHTML = '';
      let esatdo_autorizado = '';
      let col_estatus = '';
      let cot_itr = '';
      let n_cotizacion = '';
      let btn_editar = '';

      // document.querySelector('.badge').innerHTML = data.resultado_cantidad['total_cotizaciones'];
      // $('.badge').html(data.resultado_cantidad['total_cotizaciones']);

      data.resultado.forEach(element => {

        const fila = document.createElement('tr');
        if (element.estado === 'Pendiente') {
          col_estatus = `<span  data-toggle="tooltip" style="color:purple;">${element.estado}</span>`;
        } else if (element.estado === 'por autorizar') {
          col_estatus = `<span  data-toggle="tooltip" style="color:red;">${element.estado}</span>`;
        } else {
          col_estatus = `<td class="text"></td>`;
        }
        // if (element.estado_autorizado === 'autorizado') {
        //   col_estatus = `<span  data-toggle="tooltip" style="color:purple;">${element.estado_autorizado}</span>`;
        // } else if (element.estado_autorizado === 'por autorizar') {
        //   col_estatus = `<span  data-toggle="tooltip" style="color:red;">${element.estado_autorizado}</span>`;
        // } else {
        //   col_estatus = `<td class="text"></td>`;
        // }
        /* Consultas de estado de las solicitudes */
        if (element.estado_autorizacion === 'F1') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-default"  data-toggle="tooltip" title="Realizada" ></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F2') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-success"  data-toggle="tooltip" title="Entregada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F4') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-danger" data-toggle="tooltip" title="Pérdida"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F3') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-warning"  data-toggle="tooltip" title="Ganada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F5') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-primary" data-toggle="tooltip" title="Cancelada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F6') {
          // esatdo_autorizado = `<span class="mdi mdi-dot-circle icon text-gray" data-toggle="tooltip" title="Rechazada"></span>`;
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning"><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        }
        /* Validar si la solicitud es Itr */
        if (element.itr === 'Si') {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right">SI</span>`;
        } else {
          cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right">NO</span>`;
        }

        const columnaEstado = document.createElement('td');
        columnaEstado.innerHTML = col_estatus;
        const columnaEstado_Autorizacion = document.createElement('td');
        columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
        const columnaItr = document.createElement('td');
        columnaItr.innerHTML = cot_itr;
        const columnaNum_Cotizacion = document.createElement('td');
        columnaNum_Cotizacion.innerHTML = `<a href="#" id="btn_ver_solicitud" data-id="${element.n_cotizacion}"  data-id2="${element.nundoc_solicitud}" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" class="text-decoration-none" aria-disabled="true">N°${element.nundoc_solicitud}</a>`;
        // columnaNum_Cotizacion.innerHTML = `<a href="${$('#base_url').val()}serviciocliente/ver_solicitud?numdoc_solicitud=${element.nundoc_solicitud}" id="" target="_blank" class="text-decoration-none" aria-disabled="true">N°${element.nundoc_solicitud}</a>`;
        // columnaNum_Cotizacion.innerHTML = `<a href="#" id="" onclick="Ver_solicitud('${$('#base_url').val()}${intermedio}/ver_solicitud', '${element.nundoc_solicitud}');" class="text-decoration-none" aria-disabled="true">N°${element.nundoc_solicitud}</a>`;
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
        // const columnaAcciones = document.createElement('td');
        //Empresas
        const columnaAcciones = document.createElement('td');
        columnaAcciones.innerHTML = element.nombre_empresa;

        /* Acciones para los botones */
        // if (element.n_cotizacion) {
        //   n_cotizacion = element.n_cotizacion;
        //   if (element.estado_autorizacion === 'cancelada' || element.estado_autorizacion === 'autorizado') {
        //     btn_editar = `
        //       <button  class="btn btn-warning btn-sm cell-detail hint--top-left" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización" data-toogle="tooltip" data-placement="top" onclick="prueba_editar_no(this)" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
        //           <span class="uil uil-file-edit-alt" style="color:#ffffff;"></span>
        //       </button>`;
        //   } else if (element.estado_autorizacion !== 'cancelada' || element.estado_autorizacion !== 'autorizado') {
        //     btn_editar = `
        //     <button onclick="prueba_editar_no(this)" class="btn btn-warning btn-sm cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-id2="${element.estado_autorizado}">
        //       <!--<span class="icon mdi mdi-edit" data-toggle="modal" data-target="#no_editar_cotizacion" title="Editar Cotización"></span>-->
        //       <span class="uil uil-file-edit-alt" style="color:#ffffff;"></span>
        //     </button>`;
        //   }
        //   // columnaAcciones.innerHTML = `
        //   // <div class="btn-group btn-group-sm" role="group" aria-label="...">
        //   //   ${btn_editar}
        //   //   <button onclick="Visualizar(this)"; data-placement="top" class="btn btn-info btn-sm cell-detail hint--top-left" data-hint="" data-id="${n_cotizacion}" data-toggle="modal" data-target="#ver_cotizacion" title="Ver Cotización">
        //   //     <span class="uil uil-eye" style="color:#ffffff;"></span>
        //   //   </button>
        //   //   <button data-toggle="modal" data-target="#ver_historico" title="Historico" data-placement="top" onclick="historico(this,${n_cotizacion})";  class="btn btn-secondary btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
        //   //     <span class="icon mdi mdi-balance"></span>
        //   //   </button>
        //   //   <button data-placement="top" data-toggle="modal" data-target="#tb_solicitud" title="Solicitud de servicio" onclick="tbsolicitudes(this,${n_cotizacion})";  class="btn btn-success btn-xs cell-detail hint--top-left" data-hint="" data-id="${element.nombre_cliente}">
        //   //      <span class="icon mdi mdi-account-circle" style="color:#ffffff;"></span>
        //   //    </button>
        //   // </div>
        //   // `;
        // } else {
        // }

        fila.appendChild(columnaNum_Cotizacion);
        fila.appendChild(columnaItr);
        fila.appendChild(columnaCliente);
        fila.appendChild(columnaMercancia);
        fila.appendChild(columnaPeso);
        fila.appendChild(columnaServicio);
        fila.appendChild(columnafecha);
        fila.appendChild(columnaEstado_Autorizacion);
        fila.appendChild(columnaEstado);
        fila.appendChild(columnaAcciones);
        tbody.appendChild(fila);
      });
    } else {
      console.log('else');
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}


function Visualizar(cotizacion, solicitud_servicio) {
  document.getElementById("numero_cotizacion").value = cotizacion;
  document.getElementById("numero_solicitud").value = solicitud_servicio;
  //CABECERA
  var dato = {
    ncotizar: cotizacion,
    // action: 'ver',
  };

  $('#panel_principal').html('');
  $('#panel_secundario').html('');

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Ver_cotizacion',
    type: 'POST',
    data: dato,
    dataType: 'json',
    success: function (data) {
      if (data) {
        $('#titlu').html('<h3 class="text-center"><strong>Cotizacion Número: ' + data.n_cotizacion + '</strong></h3>');
        $('#linea').val('');

        $('#cuerpo_cliente').html(
          '<tr>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.nombre_cliente +
          '</td>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.nit +
          '-' +
          data.digito +
          '</td>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.direccion +
          '</td>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.telefono +
          '</td>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.procedencia_cotizacion +
          '</td>' +
          '</tr>',
        );

        $('#costos').html(
          '<tr>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="tottari" class="form-control input-xs text-center" readonly="readonly" value="' +
          data.total_transporte +
          '" style="background-color:white;"></td>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totfle" class="form-control input-xs text-center" readonly="readonly" value="' +
          data.tmer_flete +
          '" style="background-color:white;"></td>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totutil" class="form-control input-xs text-center" readonly="readonly" value="' +
          data.tmer_rent +
          '" style="background-color:white;"></td>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totren" class="form-control input-xs text-center maqu" value="' +
          data.tmer_utili +
          '" readonly="readonly" style="background-color:white;"></td>' +
          '</tr>',
        );

        $('#costos1').html(
          '<tr>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="flees" class="form-control input-xs text-center" value="' +
          data.tes_flete +
          '" readonly="readonly" style="background-color:white;"></td>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="tarespe" class="form-control input-xs text-center" value="' +
          data.tes_tarifa +
          '" readonly="readonly" style="background-color:white;">  </td>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totuties" class="form-control input-xs text-center" value="' +
          data.tes_renta +
          '" readonly="readonly" style="background-color:white;"></td>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totrenes" class="form-control input-xs text-center  bg-white text-dark" value="' +
          data.tes_util +
          '" readonly="readonly"  style="background-color:white;"></td></tr>',
        );

        $('#totcotiza').html(
          '<tr>' +
          '<td style="white-space: nowrap;" class="text-center"><input type="text" id="totalcoti" class="form-control input-xs text-center" value="' +
          data.total_cotizacion +
          '" readonly="readonly" style="background-color:white;">    </td></tr>',
        );

        $('#cuerpo_adicional').html(
          '<tr>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.observaciones +
          '</td>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.elaborado_por +
          '</td>' +
          '<td style="white-space: nowrap;" class="text-center">' +
          data.autorizado_por +
          '</td>' +
          '</tr>',
        );
      }

      //Formatear números	totales - bloques
      $('#totalcoti').val(parseFloat($('#totalcoti').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totfle').val(parseFloat($('#totfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#tottari').val(parseFloat($('#tottari').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totutil').val(parseFloat($('#totutil').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totren').val(parseFloat($('#totren').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

      //Formatear números	totales - especiales

      $('#flees').val(parseFloat($('#flees').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#tarespe').val(parseFloat($('#tarespe').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totuties').val(parseFloat($('#totuties').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totrenes').val(parseFloat($('#totrenes').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    },

    error: function (jqXHR, textStatus, errorThrown) {
      // console.log(data.result);
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //MERCANCIAS
  var dato1 = {
    ncotizar1: cotizacion,
  };

  $('#cuerpo_mer1').html('');
  $('#cuerpo_mer2').html('');
  $('#muniorigen').html('');
  $('#munidestino').html('');
  var htm, fila;

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Ver_Merncancia',
    type: 'POST',
    data: dato1,
    dataType: 'json',
    success: function (data) {
      // console.log(data.result);
      var c = 0;
      var contador = 0;
      var carga = '';
      data.forEach(function (element, index) {
        c++;
        contador = contador + 1;
        if (c <= contador) {
          if (element.tipo_carga == 'G') {
            carga = 'General';
          }

          if (element.tipo_carga == 'P') {
            carga = 'Paqueteo';
          }

          if (element.tipo_carga == 'C') {
            carga = 'Contenedor Cargado';
          }

          if (element.tipo_carga == 'V') {
            carga = 'Contenedor Vacío';
          }

          var idorigen = element.origen;

          var iddestino = element.destino;

          fila = `
          <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <a href="#" class="badge badge-primary" title="servicio mercancia">${c}</a>
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Pareja origen-destino</span>
              <input type="text" class="form-control input-xs" value="${element.id}" readonly="readonly" style="background-color:white;">
              <span style="font-weight:500; margin-top:20px;">Tipo servicio</span>
              <input type="text" class="form-control input-xs" value="${element.tipo_servicio_mer}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Tipo vehículo</span>
              <input type="text" class="form-control input-xs" value="${element.nombre}" readonly="readonly" style="background-color:white;">
              <span style="font-weight:500; margin-top:20px;">Tipo carga</span>
              <input type="text" class="form-control input-xs" value="${carga}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Tipo transporte</span>
                <input type="text" class="form-control input-xs" value="${element.tipo_transporte}" readonly="readonly" style="background-color:white;">
                <span style="font-weight:500; margin-top:20px;">Peso bruto (kg)</span>
              <input type="text" id="pbruto${c}" class="form-control input-xs maq" value="${element.peso_bruto_kg}" readonly="readonly" style="background-color:white;">
            </div>
            
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Peso neto (kg)</span>
              <input type="text" id="pneto${c}" class="form-control input-xs" value="${element.peso_neto_kg}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Peso Bruto (Tn)</span>
              <input type="text" id="netotn${c}" class="form-control input-xs" value="${element.peso_neto_tn}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Alto</span>
              <input type="text" id="valto${c}" class="form-control input-xs" value="${element.alto}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Largo</span>
              <input type="text" id="vlargo${c}" class="form-control input-xs" value="${element.largo}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Ancho</span>
              <input type="text" id="vancho${c}" class="form-control input-xs maqu" value="${element.ancho}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Volumen total</span>
              <input type="text" id="vvolum${c}" class="form-control input-xs" value="${element.volumen_total}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Costo flete</span>
              <input type="text" id="vflete${c}" class="form-control input-xs" value="${element.flete}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Tarifa venta</span>
              <input type="text" id="vtarifa${c}" class="form-control input-xs" value="${element.total_tarifa}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Rentabilidad%</span>
              <input type="text" id="vutil${c}" class="form-control input-xs" value="${element.utilidad}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Utilidad</span>
              <input type="text" id="vrent${c}" class="form-control input-xs" value="${element.rentabilidad}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Tipo Mercancía</span>
              <input type="text" class="form-control input-xs" value="${element.tipo_mercancia}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Valor Mercancía</span>
              <input type="text" id="vmerca${c}" class="form-control input-xs" value="${element.valor_mercancia}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Tipo empaque</span>
              <input type="text" class="form-control input-xs" value="${element.empaque}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
              <span style="font-weight:500; margin-top:20px;">Cantidad Empaque</span>
              <input type="text" id="vcant${c}" class="form-control input-xs" value="${element.cantidad_empaque}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <span style="font-weight:500; margin-top:20px;">Origen</span>
              <input type="text" class="form-control input-xs" value="${element.orig}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
              <span style="font-weight:500; margin-top:20px;">Destino</span>
              <input type="text" class="form-control input-xs" value="${element.dest}" readonly="readonly" style="background-color:white;">
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <span style="font-weight:500; margin-top:20px;">Observación</span>
              <textarea class="form-control input-sm" readonly="readonly" style="background-color:white;">${element.observacion}</textarea>
            </div>
          </div>
        `;

          $('#panel_principal').append(fila);

          //$(".maq").trigger('change');//formatea números

          //FORMATEAR NUMEROS
          $('#pbruto' + c).val(parseFloat($('#pbruto' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#pneto' + c).val(parseFloat($('#pneto' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#netotn' + c).val(parseFloat($('#netotn' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#valto' + c).val(parseFloat($('#valto' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vlargo' + c).val(parseFloat($('#vlargo' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vancho' + c).val(parseFloat($('#vancho' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vvolum' + c).val(parseFloat($('#vvolum' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vflete' + c).val(parseFloat($('#vflete' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vtarifa' + c).val(parseFloat($('#vtarifa' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vutil' + c).val(parseFloat($('#vutil' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vrent' + c).val(parseFloat($('#vrent' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vmerca' + c).val(parseFloat($('#vmerca' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
          $('#vcant' + c).val(parseFloat($('#vcant' + c).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        } //cierre del if
      });
    }, //succes ver

    error: function (jqXHR, textStatus, errorThrown) {
      console.log('error ver');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  //SERVICIOS ESPECIALES
  var dato2 = {
    ncotizar2: cotizacion,
  };

  fila_espe = '';
  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Ver_Servicios_Especiales',
    type: 'POST',
    data: dato2,
    dataType: 'json',
    success: function (data) {
      ce = 0;
      htm = '';
      if (data.length === 0) {
        htm = "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>Sin servicios especiales</div>";
      } else {
        data.forEach(function (element, index) {
          ce++;
          htm +=
            '<div class="panel panel-default"><div class="panel-body">' +
            "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12'>" +
            '<label>Servicio especial/ Mercancia a la que pertenece:</label><br>' +
            "<a href='#' class='badge badge-success' title='servicio especial'   >" +
            element.item_especial +
            '</a>' +
            '/' +
            "<a href='#' class='badge badge-primary' title='servicio mercancia'   >" +
            element.item_mercancia +
            '</a>' +
            '<h4>Servicios especiales</h4>' +
            '</div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">' +
            '<span style="font-weight:500; margin-top:20px;">Tipo servicio </span><input type="text" class="form-control input-xs" value="' +
            element.tipo_servicio +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Cantidad</span><input type="text"  class="form-control input-xs" value="' +
            element.cantidad +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Costo unitario</span><input type="text" id="valores' +
            ce +
            '" class="form-control input-xs" value="' +
            element.valor_unitario +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Tarifa unitaria</span><input type="text" id="taries' +
            ce +
            '" class="form-control input-xs maqu" value="' +
            element.tarifa_unitaria +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Cálculo costo</span><input type="text" id="totes' +
            ce +
            '" value="' +
            element.total_servicio +
            '" class="form-control input-xs" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Calculo tarifa</span><input type="text" id="tarifaes' +
            ce +
            '" class="form-control input-xs" value="' +
            element.tarifa +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Utilidad</span><input type="text" id="uties' +
            ce +
            '" value="' +
            element.rentabilidad +
            '" class="form-control input-xs" readonly="readonly" style="background-color:white;"></div>' +
            '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"><span style="font-weight:500; margin-top:20px;">Rentabilidad%</span><input type="text" id="rentes' +
            ce +
            '" class="form-control input-xs" value="' +
            element.utilidad +
            '" readonly="readonly" style="background-color:white;"></div>' +
            '</div></div>'; // }
        });
      }

      $('#panel_secundario').append(htm);

      //$(".maqu").trigger('change');//formatea números
      $('#valores' + ce).val(parseFloat($('#valores' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#taries' + ce).val(parseFloat($('#taries' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#totes' + ce).val(parseFloat($('#totes' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#tarifaes' + ce).val(parseFloat($('#tarifaes' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#uties' + ce).val(parseFloat($('#uties' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
      $('#rentes' + ce).val(parseFloat($('#rentes' + ce).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });


  $("#cuerpo_servicio").html('');
  $("#cuerpo_servicio2").html('');
  var soli = {
    soli_servi: solicitud_servicio,
    action: 'solicitud_servicio'
  };
  $.ajax({
    url: $('#base_url').val() + "libs/servicio_cliente_ajax.php",
    type: 'POST',
    data: soli,
    dataType: 'json',
    success: function (data) {
      document.getElementById("referencia_operacion").value = data.result[0].observacion;
      //numero_contenedor
      if (data.result[0].numero_contenedor === null) {
        document.getElementById("numero_contenedor").value = "";
        document.getElementById("numero_contenedor").disabled = false;
        document.getElementById("btn_save_contenedor").disabled = false;
        document.getElementById("agrupable").checked = false;
        document.getElementById("agrupable").disabled = false;
      } else {
        if (data.result[0].agrupable === null || data.result[0].agrupable === 'NO') {
          document.getElementById("numero_contenedor").value = data.result[0].numero_contenedor;
          document.getElementById("numero_contenedor").disabled = true;
          document.getElementById("btn_save_contenedor").disabled = true;
          document.getElementById("agrupable").checked = false;
          document.getElementById("agrupable").disabled = false;
        } else {
          document.getElementById("numero_contenedor").value = data.result[0].numero_contenedor;
          document.getElementById("numero_contenedor").disabled = true;
          document.getElementById("btn_save_contenedor").disabled = true;
          document.getElementById("agrupable").checked = true;
          document.getElementById("agrupable").disabled = true;
        }

      }
      data.result.forEach(function (element, index) {
        $("#cuerpo_servicio").append('<tr>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><input type="text" id="mer_idservicio" disabled style="width:100%;height24px;" value="' + element.nundoc_solicitud + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><input type="text" id="punto_rem" disabled style="width:100%;height24px;" value="' + element.punto_rem + '"></td>' +
          '<td class="text-center style="font-size: 10px;white-space: nowrap;"><input type="text" id="remitente_edit" disabled style="width:100%;height24px;" value="' + element.remitente + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><input type="date" id="fecha_cargue_edit" disabled style="width:100%;height24px;" value="' + element.fecha_cargue + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><input type="time" id="hora_cargue_edit" disabled style="width:100%;height24px;" value="' + element.hora_cargue + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;">' + element.usuario_auditor + '</td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;">' + element.nombre + '</td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;">' + element.proceso + '</td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">' +
          '<button type="button" class="btn btn-warning btn-sm" id="btn_edit_cargue"><i class="fas fa-pencil-alt"></i></button>' +
          ' </div></td>' +
          '</tr>');

        $("#cuerpo_servicio2").append('<tr>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"> <input type="text" disabled style="width:100%;height24px;" value="' + element.nundoc_solicitud + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"> <input type="text" id="punto_des" disabled style="width:100%;height24px;" value="' + element.punto_des + '"></td>' +
          '<td class="text-center style="font-size: 10px;white-space: nowrap;"> <input type="text" id="destinatario_edit" disabled style="width:100%;height24px;" value="' + element.destinatario + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><input type="date" id="fecha_descargue_edit" disabled style="width:100%;height24px;" value="' + element.fecha_descargue + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><input type="time" id="hora_descargue_edit" disabled style="width:100%;height24px;" value="' + element.hora_descargue + '"></td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;">' + element.usuario_auditor + '</td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;">' + element.nombre + '</td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;">' + element.proceso + '</td>' +
          '<td class="text-center" style="font-size: 10px;white-space: nowrap;"><div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">' +
          '<button type="button" class="btn btn-warning btn-sm" id="btn_edit_descargue"><i class="fas fa-pencil-alt"></i></button>' +
          ' </div></td>' +
          '</tr>');

      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('error');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }

  });

  /* Consultar las agencias y lostipos de servicio para actualizar */
  fetch($('#base_url').val() + "serviciocliente/ListarAgenciasTipoServicios", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(data => {
      $("#servicio_agencia").html('');
      $("#servicio_agencia").append('<option value="" selected>Seleccione...</option>');
      data.forEach(element => {
        $("#servicio_agencia").append('<option value="' + element.id + '">' + element.nombre + '</option>');
      });
    })
    .catch(error => {
      console.log('error');
      console.log(error);
    });
}