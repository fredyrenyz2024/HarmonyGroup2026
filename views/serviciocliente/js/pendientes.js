window.VENTANA = null; // Variable global para almacenar el ID
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  $(document).ready(function () {

    // Definir la función initScript globalmente
    const hoy = new Date(); // Obtener la fecha actual
    const fechaHoy = hoy.toISOString().split('T')[0]; // Formatear como YYYY-MM-DD


    
    if (window.VENTANA == 5) {
      // Si la ventana es la 2, activar el evento de cambio en #filtro
      let tipo = 2;
      let cliente = "";
      var fecha_inicial = $(`#campo-${window.VENTANA}-fecha_inicial`).val() === undefined ? fechaHoy : $(`#campo-${window.VENTANA}-fecha_inicial`).val();
      var fecha_final = $(`#campo-${window.VENTANA}-fecha_final`).val() === undefined ? fechaHoy : $(`#campo-${window.VENTANA}-fecha_final`).val();
      listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, cliente);

      $(`#campo-${window.VENTANA}-filtro`).off("change").on("change", function () {
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
      });

      $(`#campo-${window.VENTANA}-clientes`).off("change").on("change", function () {
        let valorSeleccionado = $(this).val();
        listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, valorSeleccionado);
      });
    }
  });
};

async function listar_solicitudes_pendientes(tipo, fecha_inicial, fecha_final, cliente) {
  /* Funcion para enviar los datos */
  let dato = new FormData();
  dato.append('tipo', tipo);
  dato.append('fecha_inicial', fecha_inicial);
  dato.append('fecha_final', fecha_final);
  dato.append('estado', "Pendiente");
  dato.append('cliente', cliente);

  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/consultar_cotizaciones', {
      method: 'POST',
      body: dato,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data) {
      let esatdo_autorizado = '';
      let col_estatus = '';
      let cot_itr = '';
      // let n_cotizacion = '';
      // let btn_editar = '';

      let tbody = document.getElementById('tblSolicitudesPendientes');
      tbody.innerHTML = '';

      data.resultado.forEach(element => {
        const fila = document.createElement('tr');
        if (element.estado_estudio === 'Sin Estado') {
          if (element.estado === 'Pendiente') {
            col_estatus = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">sin gestionar</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
          } else if (element.estado === 'por autorizar') {
            col_estatus = `<span  data-toggle="tooltip" style="color:#ec1f00;">${element.estado}</span>`;
          } else {
            col_estatus = `<td class="text"></td>`;
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
          } else {
            col_estatus = `<td class="text"></td>`;
          }
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
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary"><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F2') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary"><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F4') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F3') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success"><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F5') {
          esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span>`;
        } else if (element.estado_autorizacion === 'F6') {
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