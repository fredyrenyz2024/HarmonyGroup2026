window.VENTANA = null; // Variable global para almacenar el ID

// sessionStorage.clear();

// Variables globales accesibles desde cualquier parte
window.intermedio = "";
window.contador_global1 = 0;

window.contador_remitentes = 0;
window.contador_destinatarios = 0;

// Variables sin inicializar pero accesibles globalmente
window.ID = null;
window.VEHICULO = null;
window.REMITENTE = null;
window.DESTINATARIO = null;
window.BLOQUE_MERCANCIA = null;
window.SERVICIO = null;
window.VENTANA = null;

// Arrays globales
window.ORIGEN_ARRAY = [];
window.DESTINO_ARRAY = [];
var destinatarios_por_remitente = {};

// 👇 ESTA VA AQUÍ
// var usuarioPresionoAgregar = false;

var remPorBloque = {};            // remPorBloque[bloque] = cantidad remitentes
var destPorRemBloque = {};        // destPorRemBloque[bloque][rem] = cantidad destinatarios

// Definir la función initScript globalmente
window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID recibido a la variable global
  resetMercancias();

  // let table = new DataTable('#myTable', {
  //   language: { // Corrección aquí (antes era 'lenguage')
  //     "processing": "Procesando...",
  //     "lengthMenu": "Mostrar _MENU_ registros",
  //     "zeroRecords": "No se encontraron resultados",
  //     "emptyTable": "Ningún dato disponible en esta tabla",
  //     "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
  //     "infoFiltered": "(filtrado de un total de _MAX_ registros)",
  //     "search": "Buscar:",
  //     "loadingRecords": "Cargando...",
  //     "paginate": {
  //       "first": "Primero",
  //       "last": "Último",
  //       "next": "Siguiente",
  //       "previous": "Anterior"
  //     }
  //   } // Se eliminó la coma extra antes del `)`
  // });

  /* Cargar datos de la solictud de servicio */
  $('#agencia').html(''); // Limpia el select antes de agregar nuevas opciones
  // Agrega la opción "Seleccione" como la primera opción y la marca como seleccionada
  $('#agencia').append('<option value="" selected>Seleccione</option>');

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Traer_Agencias',
    type: 'POST',
    dataType: 'json',
    success: function (data) {
      if (data) {
        // Itera sobre los datos recibidos y agrega cada opción al select
        data.forEach(function (element, index) {
          $('#agencia').append('<option value="' + element.id + '">' + element.nombre + '</option>');
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // document.addEventListener('click', async e => {
  //   // if (e.target.closest('#agregar_fila')) {

  //   //   e.preventDefault();
  //   //   e.stopPropagation();

  //   //   const cliente_id = $("#id_cliente_seleccionado").val();

  //   //   if (!cliente_id) {
  //   //     Swal.fire({
  //   //       icon: "warning",
  //   //       title: "Validación requerida",
  //   //       text: "Debe seleccionar el cliente para agregar el primer bloque de mercancía antes de continuar."
  //   //     });
  //   //     return;
  //   //   }

  //   //   // ⛔ EVITAR DUPLICADO
  //   //   if (!bloqueInicialCreado) {
  //   //     agregar();
  //   //     bloqueInicialCreado = true;
  //   //   }
  //   // }

  //   if (e.target.closest('#agregar_fila')) {

  //     e.preventDefault();
  //     e.stopPropagation();

  //     const cliente_id = $("#id_cliente_seleccionado").val();

  //     if (!cliente_id) {
  //       Swal.fire({
  //         icon: "warning",
  //         title: "Validación requerida",
  //         text: "Debe seleccionar el cliente para agregar el primer bloque de mercancía antes de continuar."
  //       });
  //       return;
  //     }

  //     // usuarioPresionoAgregar = true; // 👈 AQUÍ SE ACTIVA
  //     agregar(); // 👈 SIEMPRE
  //     // resetMercancias();
  //   }

  //   if (e.target.matches('#btn_cancelar') || e.target.matches('#btn_cancelar *')) {
  //     resetMercancias();
  //   }
  // });

  if (!window.listenerAgregarFilaInicializado) {
    window.listenerAgregarFilaInicializado = true;

    document.addEventListener('click', async function (e) {

      const btnAgregar = e.target.closest('#agregar_fila');
      if (btnAgregar) {
        e.preventDefault();

        const cliente_id = $("#id_cliente_seleccionado").val();
        if (!cliente_id) {
          Swal.fire({
            icon: "warning",
            title: "Validación requerida",
            text: "Debe seleccionar el cliente."
          });
          return;
        }

        agregar();
        return;
      }

      if (e.target.closest('#btn_cancelar')) {
        reiniciarBloquesMercancia();
      }
    });
  }

  $('#btn_agregar_cotizacion').click(function () {
    // if (!validateSolicitud()) {
    //   return; // NO GUARDA
    // }

    if (!validateSolicitud()) return;
    if (!validarITRPorBloques()) return;
    if (!validarRNDCPorBloque()) return;

    // si pasamos la validación → continuar guardado
    // console.log("VALIDADO OK → proceder a guardar");
    Swal.fire({
      title: 'Seguro',
      text: '¿Desea guardar la Solicitud de Servicio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3B71CA',
      cancelButtonColor: '#9FA6B2',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal2-custom-font',
      },
    }).then(async result => {
      if (result.isConfirmed) {
        Inserta_Solicitud();
      }
    });
  });

  $(document).on('select2:select', '.tmerca', function () {
    const bloque = this.id.replace('tipo_mercancia', '');
    const valor = $(this).val();

    manejarContenedorPorBloque(
      bloque,
      valor === 'CONTENEDOR VACIO'
    );
  });

  $(document).on('select2:select', '.empaquemer', function () {
    const bloque = this.id.replace('tipo_empaque', '');
    const valor = $(this).val();

    manejarContenedorPorBloque(
      bloque,
      ['8', '9', '10'].includes(valor)
    );
  });

  $(document).on('change', '.operamer', function () {
    const bloque = this.id.replace('tipo', '');
    const valor = $(this).val();

    manejarContenedorPorBloque(
      bloque,
      valor === 'C' || valor === 'V'
    );
  });

}

function verVehiculo(element) {
  // alert('llevar los datos');
  var elemento = $(element);

  // Recolección de datos
  var id = elemento.data('id');
  var digito = elemento.data('id2');
  var telefono = elemento.data('id3');
  var nombre = elemento.data('id4');
  var dire = elemento.data('id5');
  var idcliente = elemento.data('id6');
  var correo = elemento.data('id7');
  var tipo_documento = elemento.data('id8');
  var regimen = elemento.data('id9');
  var empresa_id = elemento.data('id10');
  // **CAPACIDAD DE ENDEUDAMIENTO (id11 en tu código original, corregido aquí)**
  var capacidad = parseFloat(elemento.data('id11') || 0); // Lo asumo como ID11
  // **CARTERA (id12)**
  var cartera = parseFloat(elemento.data('id12') || 0);

  // ----------------------------------------------------------------------
  // 🛑 VALIDACIÓN REQUERIDA: Cartera vs Capacidad de Endeudamiento
  // ----------------------------------------------------------------------

  if (capacidad !== 0 && cartera > capacidad) {
    // La cartera supera la capacidad de endeudamiento.

    // Crear el mensaje formateado para el contenido HTML de SweetAlert
    var mensajeHTML = "La Cartera actual del cliente " +
      "**(" + cartera.toFixed(2) + ")** " +
      "supera su Capacidad de Endeudamiento " +
      "**(" + capacidad.toFixed(2) + ")**.";

    Swal.fire({
      title: '⚠️ ALERTA DE CRÉDITO ⚠️',
      html: mensajeHTML,
      icon: 'warning', // Icono de advertencia
      confirmButtonText: 'Entendido',
      focusConfirm: true,
      // Configuración adicional para enfatizar la gravedad
      customClass: {
        title: 'text-danger', // Opcional: clase CSS para el título en rojo
        confirmButton: 'btn btn-warning' // Opcional: clase para el botón
      }
    }).then((result) => {
      // Opcional: Si necesitas ejecutar código después de que el usuario presione 'Entendido'
      // console.log("Usuario reconoció la alerta de crédito.");
    });

    // Opcional: Si quieres detener el proceso (y la llamada AJAX posterior), 
    // descomenta el 'return' aquí:
    return;
  }

  // ----------------------------------------------------------------------

  // Asignación de valores (se ejecuta sin importar la alerta)
  $('#cargar_cliente').val(nombre);
  $('.nombre').html(nombre);
  $('#nombre_clientes').val(nombre);
  $('#nit_empresa').val(id);
  $('#documento').val(id + '-' + digito);
  $('#digito_verificacion').val(digito);
  $('#telefono_cliente').val(telefono);
  $('.telefono').html(telefono);
  $('#direccion_cliente').val(dire);
  $('.ubicacion').html(dire);
  $('#correo').val(correo);
  $('#tipo_documento').val(tipo_documento + ' - ' + regimen);
  $('#id_cliente_cot').val(idcliente);
  $('#id_cliente_seleccionado').val(idcliente);
  $('#Nacional').attr('checked', false);
  $('#Internacional').attr('checked', false);
  $('#Almacenamiento').attr('checked', false);
  $('#staticBackdrop').modal('hide');
  $('#cliente2').html(nombre);
  $('.linea_negocicito').show();
  //Asgignar id de empresa seleccionada al cliente
  $('#empresa_seleccionada_id').val(empresa_id);
  /* Grupos y horas de envio de correos */
  $('#group').html(''); // Limpia el select #group
  $('#houremail').html(''); // Limpia el select #houremail

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Consultar_grupo',
    type: 'POST',
    data: { cliente: document.getElementById("nombre_clientes").value },
    dataType: 'json',
    success: function (data) {

      if (data.resultado) {
        data.resultado.forEach(el => {
          $('#group').append(`<option value="${el.id}">${el.nombre_grupo}</option>`);
        });
      }

      if (data.resultado2) {
        data.resultado2.forEach(el => {
          $('#houremail').append(`<option value="${el.id}">${el.nombre} - ${el.hora_envio}</option>`);
        });
      }

      // ACTIVAR SELECT2 después de llenar datos
      $('#group').select2({
        placeholder: "Seleccione grupo",
        width: '100%',
        allowClear: true,
      });

      $('#houremail').select2({
        placeholder: "Seleccione hora",
        width: '100%',
        allowClear: true,
      });

    },


    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });

}

// var usuarioPresionoAgregar = false;
var cont = 0;
var contador_global1 = 0;
var contador_global2 = 0;
function agregar() {
  // ⛔ Evitar creación automática del bloque 1
  // if (cont === 0 && !usuarioPresionoAgregar) {
  //   return;
  // }

  console.log('AGREGAR EJECUTADO', cont + 1);
  cont++;
  contador_global1 = contador_global1 + 1;

  remPorBloque[cont] = 0;
  destPorRemBloque[cont] = {};

  /* Tipo Mecancia */
  Mercancias(cont);

  // TABLA MERCANCIA 1
  const origen = `
    <select id="origen_cliente${cont}" 
            class="form-select form-select-sm select2-sm originario" 
            onchange="lugares(${cont}); Agrega_Remitente(document.getElementById('id_cliente_seleccionado').value, this.value, ${cont});" 
            style="width: 100%;">
        <option value="" readonly="readonly">Seleccione</option>
    </select>`;

  const destino = `
    <select id="destino_cliente${cont}" class="form-select form-select-sm destinar select2-sm" 
            onchange="Agrega_Destinatariob(null, document.getElementById('id_cliente_seleccionado').value, this.value, cont, remPorBloque[cont]);" style="width: 100%;">
        <option value="" readonly="readonly">Seleccione</option>
    </select>`;

  // Lógica para generar los selects dinámicos
  var mercancia = `<select id="tipo_mercancia${cont}" class="tmerca form-select form-select-sm select2-sm" style="width: 100%;" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                      <option value="">Seleccione</option>
                    </select>`;

  var tipo_empaque = '<select style="width: 100%;" id="tipo_empaque' + cont + '" class="form-select form-select-sm select2-sm empaquemer">' + '<option value="">Seleccione</option>' + '</select>';
  //boton de eliminar
  var btn_elimina = '';
  var linea = '';
  if (cont !== 1) { btn_elimina = `<a class="fw-bold fs-9 text-decoration-none elimina text-center" id="elimina${cont}" href="#!" tooltip="Eliminar bloque${cont}" onclick="Elimina_Mercancia(this.id,${cont})" style="width: 40%;"><i class="far fa-trash-alt text-black"></i> Eliminar</a>`; linea = ` <hr class="my-1 text-dark"> `; }
  //contador de la fila
  var htmlTags = `
    <div class="row tr${cont} bloque_mercancia" data-bloque="${cont}">
          <input type="hidden" class="bloque_id" value="${cont}">
          <!-- ↑ ESTE HIDDEN PERMITE VALIDAR SOLO ESTE BLOQUE -->

          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            ${linea}
              <div class="d-flex flex-wrap justify-content-start" style="color:#fff;">
                <div class="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 col-xxl-10 d-flex align-items-center">
                  <h6 class="mb-0 text-body-highlight me-2">Bloque de mercancia N° ${cont}</h6>
                </div>
                <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 d-flex justify-content-end">
                  ${btn_elimina}
                  <input type="hidden" class="form-control input-xs item_merca" readonly="readonly" value="${cont}">
                </div>
              </div>
            <hr class="my-1 text-dark">
          </div>
  
          <div  class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
            <div class="mb-1">
              <label style="font-size: 12px;">Servicio ITR&nbsp;<span style="color:blue;"><i>(*)</i></span></label> 
                <select id="itr${cont}" style="width: 100%;color:#000;" class="form-select form-select-sm itr" Onchange="Validar_operacion_itr(${cont})">
                  <option value="" readonly="readonly">Seleccione</option>
                  <option value="Si">Si</option>
                  <option value="No" selected>No</option>
                </select>
              </div>
          </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Mercancía</label> 
            ${mercancia}
            <input type="hidden" class="form-control idproducto" id="codmercancia${cont}" readonly="readonly">
            <input type="hidden" class="form-control rndcproducto" id="rndcmercancia${cont}" readonly="readonly">
            </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Naturaleza</label> 
              <select style="width: 100%;" id="natu${cont}" readonly="readonly" class="form-select form-select-sm natumer"></select>
            </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Valor Declarado</label> 
             <input type="text" id="valor_mercancia${cont}" style="width: 100%;" class="form-control form-control-sm valor_merca" min="0" onChange="javascript:currencyMask(this)">
            </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Tipo Servicio</label> 
            <select id="servicio_cliente${cont}" style="width: 100%;" class="form-select form-select-sm ts">
              <option value="" readonly="readonly">Seleccione</option>
              <option value="Expreso">Expreso - Viaje</option>
              <option value="Consolidado">Consolidado - Tonelada</option>
            </select>
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Tipo Empaque</label> 
              ${tipo_empaque}
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Tipo Operación</label> 
              <select style="width: 100%;" id="tipo${cont}" class="form-select form-select-sm operamer">
                <option value="">Seleccione</option>
                <option value="G">General</option>
                <option value="P">Paqueteo</option>
                <option value="C">Contenedor Cargado</option>
                <option value="V">Contenedor Vacío</option>
              </select>
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Tipo Transporte</label> 
            <select style="width: 100%;" id="tipotr${cont}" class="form-select form-select-sm ttransportemer">
              <option value="">Seleccione</option>
              <option value="Importacion">Importación</option>
              <option value="Exportacion">Exportación</option>
              <option value="Nacional">Nacional</option>
              <option value="Urbano">Urbano</option>
            </select>
          </div>
        </div>
    
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Origen</label> 
            ${origen}
             <input type="hidden" id="cant_carro${cont}" class="form-control form-control-sm cantvehi" min="1" style="width:100%;" value="1"  onchange="cuantitativo(this.value,${cont})" readonly>
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Destino</label> 
            ${destino}
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Tipo Vehículo</label> 
            <!--<select id="vehiculo_cliente${cont}" readonly="readonly" style="width:100%;" class="form-select form-select-sm tipovehiculo" onChange="javascript:obtenerflete(this.value,${cont},${contador_global1});"></select>-->
            <select id="vehiculo_cliente${cont}" readonly="readonly" style="width:100%;" class="form-select form-select-sm tipovehiculo"></select>
          </div>
        </div>
    
        <!-- Cantidad de vehiculos para la operacióm -->
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Cantidad Vehículo</label> 
            <input type="number" id="cant_vehiculo${cont}" class="form-control form-control-sm cantvehiculo" min="1" style="width:100%;" value="1" disabled>
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Configuración de su vehículo &nbsp;<span style="color:red;"><i>(*)</i></label> 
            <select name="configuracion_vehiculos" id="configuracion_vehiculos${cont}" class="form-control form-control-sm configuracion_vehiculo_sicetac" onChange="javascript:obtenerflete(this.value,${cont},${contador_global1});">
              <option selected="selected" value=""> </option>
              <option value="2">Camión dos ejes - Sencillo PBV mas de 10500 Kg </option>
              <option value="2_7_8">Camion dos ejes - Sencillo PBV 7500-8000 Kg </option>
              <option value="2_8_9">Camion dos ejes - Sencillo PBV 8001-9000 Kg </option>
              <option value="2_9_105">Camion dos ejes - Sencillo PBV 9001-10500 Kg </option>
              <option value="2S2">Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes</option>
              <option value="2S3">Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes</option>
              <option value="3">Camión tres ejes - Dobletroque </option>
              <option value="3S2">Tractocamión tres ejes - Tractomula con semiremolque de dos ejes</option>
              <option value="3S3">Tractocamión tres ejes - Tractomula con semiremolque de tres ejes</option>
              <option value="V2">Volqueta dos ejes - Sencillo </option>
              <option value="V3">Volqueta tres ejes - Dobletroque </option>
              <option value="V4">Volqueta cuatro ejes - Cuatromanos </option>
            </select>
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Unidad de Transporte &nbsp;<span style="color:red;"><i>(*)</i></label> 
            <select name="unidadtransporte" id="unidadtransporte${cont}" class="form-select form-select-sm unidad_transporte_sicetac">
              <option selected="selected" value=""> </option>
              <option value="1">ESTACAS</option>
              <option value="10">ESTIBAS</option>
              <option value="1061">TANQUE</option>
              <option value="2">FURGON</option>
              <option value="231">PORTACONTENEDORES</option>
              <option value="36">TRAYLER</option>
              <option value="4">VOLCO</option>
              <option value="48">PLATAFORMA</option>
              <option value="60">FURGON REFRIGERADO</option>
            </select>
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Tipo de Carga &nbsp;<span style="color:red;"><i>(*)</i></label> 
            <select name="tipocarga" id="tipocarga${cont}" class="form-select form-select-sm tipo_carga_sicetac">
              <option selected="selected" value=""> </option>
              <option value="1003">Granel líquido</option>
              <option value="12">General</option>
              <option value="13">Contenedor</option>
              <option value="2">Carga Refrigerada</option>
              <option value="5">Granel Sólido</option>
            </select>
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Costo sicetac</label>
              <input type="text" class="typeahead form-control form-control-sm costo_sicetac" id="costo_sicetac${cont}" disabled>
          </div>
        </div>

        <div class="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1 col-xxl-1 tr${cont}">
          <div class="mt-4">
              <button class="btn btn-subtle-secondary btn-sm me-1 px-1 py-1" id="btn-validar-sicetac${cont}" data-id="${cont}" type="button" style="width: 100%;">Validar Sicetac</button>
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Peso Bruto(Kg)</label> 
            <input type="text" id="peso_client1${cont}" class="form-control form-control-sm pesobruto" min="0" style="width:100%;"  onChange="javascript:cambio_valor(this,${cont});">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Peso Neto(Kg)</label> 
            <input type="text" class="form-control form-control-sm p${cont} pnetomer" min="0" style="width:100%;" name="nombre${cont}" id="${cont}" onChange="javascript:CambioNeto(this,${cont});">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Peso Bruto(Tn)</label> 
            <input type="text" class="form-control form-control-sm pesobrutoton" min="0" style="width:100%;" name="nombre${cont}" id="pesobruto_cliente${cont}" readonly>
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Cantidad(unidades)</label> 
            <input type="text" id="cantidad${cont}" class="form-control form-control-sm cantidadmer" min="1" style="width:100%;" onChange="javascript:currencyMask(this)">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Alto(cm)</label> 
            <input type="number" id="alto_cliente${cont}" class="form-control form-control-sm altomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Largo(cm)</label> 
            <input type="text" id="largo_cliente${cont}"  class="form-control form-control-sm largomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Ancho(cm)</label> 
            <input type="text" id="${cont}" name="ancho${cont}"  class="form-control form-control-sm ancho${cont} anchomer" style="width:100%;" min="0" value="0" onChange="volumen_total(this,${cont});">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Volumen (m3)</label> 
             <input type="text" id="volumen_cliente${cont}" readonly="readonly"  class="form-control form-control-sm volumenmer" style="width:100%;" value="0">
          </div>
        </div>
  
        <!-- Costo Flete -->
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="row">
            <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 tr${cont}">
              <div class="mb-1">
                <label style="font-size: 12px;">Costo Flete</label> 
                  <input type="text"  id="flete${cont}" class="form-control form-control-sm fletemer" min="0" value="0"  style="width:100%;" onChange="javascript:utilidad_d(this,${cont},${contador_global1})">
              </div>
            </div>
            <!-- <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6 tr${cont}">
              <div class="mb-1">
                <label style="font-size: 12px;">Costo Flete</label> 
                  <input type="text"  id="flete_sicetac${cont}" class="form-control form-control-sm fletemer" min="0" value="0" disabled style="width:100%;" onChange="javascript:utilidad_d(this,${cont},${contador_global1})">
              </div>
            </div>-->   
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Tarifa venta</label> 
              <!--<input type="text" id="totaltarifa_cliente${cont}"  class="form-control form-control-sm tarifamer"  min="0" value="0" style="width:100%;" onChange="javascript:utilidad(this,${cont},${contador_global1});" >-->
              <!--<input type="text" id="totaltarifa_cliente${cont}" class="form-control form-control-sm tarifamer" min="0" value="0" style="width:100%;" onkeyup="utilidad(this,${cont},${contador_global1}); recalcularTarifasDestinatariosPorBloque(${cont});" onchange="utilidad(this,${cont},${contador_global1}); recalcularTarifasDestinatariosPorBloque(${cont});">-->
                  <input type="text" id="totaltarifa_cliente${cont}" class="form-control form-control-sm tarifamer" value="0" oninput="utilidad_sin_formato(this,${cont},${contador_global1}); recalcularTarifasDestinatariosPorBloque(${cont});" onblur="utilidad(this,${cont},${contador_global1}); recalcularTarifasDestinatariosPorBloque(${cont});">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Rentabilidad %</label> 
              <input type="text" id="${cont}"  class="form-control form-control-sm utilidad${cont} utilmer" min="0" style="width:100%;" readonly="readonly">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Utilidad</label> 
             <input type="text" id="renta${cont}" class="form-control form-control-sm rentamer" style="width:100%;"  readonly="readonly">
          </div>
        </div>
  
        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 tr${cont}">
          <div class="mb-1">
            <label style="font-size: 12px;">Observación Operaciones</label> 
             <textarea id="observa${cont}" class="form-control form-control-sm observamer" style="width:100%;" rows="1"></textarea> <input type="hidden" class="identi tr${cont}" value="1"  style="width:100%;">
          </div>
        </div>

        <div id="devolver_contenedor${cont}" style="display:none;">
            <div class="row">
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <hr class="my-1 text-dark">
                <span style="font-weight:500; margin-top:20px;"><strong>Datos de Contenedor</strong></span>
                <span class="cell-detail-description" style="font-size:10px;"> (El registro de contenedor se activa cuando el tipo de carga es Contenedor Cargado o Contenedor Vacío).</span>
                <hr class="my-1 text-dark">
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Devuelve Contenedor</label>
                  <select id="cnt_opcion${cont}" class="form-select form-select-sm" disabled>
                    <option value="">Seleccione</option>
                    <option value="1">Si</option>
                    <option value="0">No</option>
                  </select>
                </div>
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Tipo Contenedor</label>
                  <select id="cnt_tipocon${cont}" class="form-select form-select-sm" disabled></select>
                </div>
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Núm. contenedor</label>
                  <input type="text" id="cnt_num${cont}" class="form-control form-control-sm" min="0" placeholder="# Contenedor" disabled>
                </div>
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Fecha de vencimiento</label>
                  <input type="date" id="cnt_dias${cont}" class="form-control form-control-sm" disabled>
                </div>
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Mun devolución</label>
                  <select id="cnt_municipio${cont}" class="form-select form-select-sm" disabled>
                    <option value="">Seleccione</option>
                  </select>
                </div>
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Dirección devolución</label>
                  <input type="text" id="cnt_direccion${cont}" class="form-control form-control-sm" disabled>
                </div>
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Fecha comodato</label>
                  <input type="date" id="cnt_fcomodato${cont}" class="form-control form-control-sm" disabled>
                </div>
              </div>

              <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <div class="mb-3">
                  <label style="font-size: 12px;">Peso Vacío (Kg)</label>
                  <input type="numer" id="cnt_peso${cont}" class="form-control form-control-sm" placeholder="sin puntos" disabled>
                </div>
              </div>

              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <input type="hidden" class="form-control input-xs" id="tip_transport${cont}">
              </div>
            </div>
        </div>
        
        <!-- DATOS DE LOS REMITENTES Y DESTINATARIOS -->
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="d-flex flex-wrap justify-content-start mt-3">
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <h6 class="mb-0 text-body-highlight me-2"> Remitentes y Destinatarios</h6>
              </div>
            </div>
            <hr class="my-1 text-dark">
          </div>

          <div class="d-flex justify-content-center align-items-center mb-3">
            <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
              <!-- <h6 class="mb-0 text-body-highlight me-2"> Remitentes y Destinatarios</h6> -->
              <div class="input-group mb-3">
                <input type="number" class="form-control form-control-sm text-center" placeholder="Cantidad Puntos" id="maximo_entregab${cont}">
                <button class="btn btn-outline-secondary btn-sm" type="button" data-toggle="tooltip" data-placement="top" title="Agregar punto" onclick="AgregarRemitentesPorBloque(${cont})" id="agregar_fila_entrega2${cont}">Agregar</button>
              </div>
            </div>
          </div>

          <div>
            <input type="hidden" id="cabw${cont}" value="1">
            <input type="hidden" id="pun${cont}" value="2">
          </div>

          <div class="row">
            <!--Remitentes -->
            <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
              <div class="widgets-scrollspy-nav mt-n5 bg-body-emphasis z-5 border-bottom">
                <nav class="navbar py-0" id="widgets-scrollspy">
                  <ul class="nav flex-nowrap" id="remitentes_menu${cont}" style="overflow-x: auto;">
                    <!-- Elementos del menú -->
                  </ul>
                </nav>
              </div>

              <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
              <div data-bs-spy="scroll" data-bs-target="#widgets-scrollspy">
                <div class="tab-content bg-success-white" id="nav_contenedor${cont}">
                  <!-- Elementos del tab -->
                </div>
              </div>
            </div>
            <!-- Destinatarios -->
             <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6" id="destinatarios_contenedor_bloque${cont}"></div>
          </div>
    </div>`;

  $('#table_mercancia').append(htmlTags);
  llenaritem();

  // ================================
  // HEREDAR TIPO DE SERVICIO
  // ================================
  // if (cont > 1) {
  //   const servicioAnterior = $(`#servicio_cliente${cont - 1}`).val();

  //   if (servicioAnterior) {
  //     $(`#servicio_cliente${cont}`).val(servicioAnterior).trigger('change');
  //     // Deshabilitar edición
  //     $(`#servicio_cliente${cont}`).prop('disabled', true).css('background-color', '#e9ecef'); // opcional estilo gris
  //   }
  // }
}

function llenaritem() {
  var s;
  if (contador_global1 > 0) {
    for (b = 1; b <= contador_global2; b++) {
      $('#select_mercancia' + b).html('');
      s = '';
      $('#numeral_mer' + b).html('');
      for (a = 1; a <= contador_global1; a++) {
        s = s + '<option value=' + a + '>' + a + '</option>';
        j = a;
      }
      $('#select_mercancia' + b).html(s);
      $('#numeral_mer' + b).html(j);
    }
    //cambiomerca(1,);
  } else {
    alert('Debe agregar mercancías a la cotización');
  }
}

async function Mercancias(cont) {
  // Vacía el select antes de llenarlo
  $('#tipo_mercancia').html('');

  try {
    // Realiza la solicitud para obtener los datos
    const response = await fetch($('#base_url').val() + 'serviciocliente/Tipo_Mercancia', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache',
    });
    const data = await response.json();

    // Llena el select con las opciones dinámicas
    data.forEach(function (element, index) {
      $('#tipo_mercancia' + cont).append(
        '<option value="' + element.nombre + '" data-id="' + element.id + '" data-id2="' + element.codigo + '">' + element.nombre + '</option>'
      );
    });

    // Inicializa Select2 en el select de tipo de mercancía
    $('#tipo_mercancia' + cont).select2({
      placeholder: 'Seleccione una opción', // Texto del placeholder
      allowClear: true, // Permite limpiar la selección
    });

    // Configura el evento change de Select2
    $('#tipo_mercancia' + cont).on('change', function () {
      codigo_mercancia(cont);
    });
  } catch (error) {
    console.error('Error en la solicitud de tipo de mercancía:', error);
    throw error;
  } finally {
    tipo_empaque(cont); // Llama a la función para llenar el tipo de empaque
  }
}

async function tipo_empaque(cont) {
  // Vacía el select antes de llenarlo
  $('#tipo_empaque').html('');

  try {
    // Realiza la solicitud para obtener los datos
    const response = await fetch($('#base_url').val() + 'serviciocliente/Tipo_Empaque', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache',
    });
    const data = await response.json();

    // Llena el select con las opciones dinámicas
    data.forEach(function (element, index) {
      $('#tipo_empaque' + cont).append(
        '<option value="' + element.id + '">' + element.empaque + '</option>'
      );
    });

    // Inicializa Select2 en el select de tipo de empaque
    $('#tipo_empaque' + cont).select2({
      placeholder: 'Seleccione una opción', // Texto del placeholder
      allowClear: true, // Permite limpiar la selección
    });
  } catch (error) {
    console.error('Error en la solicitud de tipo de empaque:', error);
    throw error;
  } finally {
    Municipios(cont); // Llama a la función para llenar los municipios
  }
}

async function Municipios(cont) {
  // Vaciar el contenido de los selects específicos usando el identificador dinámico
  $('#origen_cliente').empty();
  $('#destino_cliente').empty();

  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
      method: 'POST',
      dataType: 'json',
      cache: 'no-cache'
    });
    const data = await response.json();

    data.forEach(function (element) {
      $('#origen_cliente' + cont).append('<option value="' + element.rndc_codigo_ciudad + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
      $('#destino_cliente' + cont).append('<option value="' + element.rndc_codigo_ciudad + '" data-municipio="' + element.municipio + '" data-depto="' + element.depto + '">' + element.municipio + '-' + element.depto + '</option>');
    });
    // Inicializar (o reinicializar) los selects con Select2 para ambos casos
    $('#origen_cliente' + cont).select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });
    $('#destino_cliente' + cont).select2({
      placeholder: 'Seleccione una opción',
      allowClear: true
    });

  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
}

function codigo_mercancia(id) {
  const selectMercancia = $('#tipo_mercancia' + id);

  // Obtener el valor seleccionado y los atributos data-*
  const selectedOption = selectMercancia.find(':selected');
  const id_mercancia = selectedOption.data('id');
  const rndc_mercancia = selectedOption.data('id2');

  $('#codmercancia' + id).val(id_mercancia);
  $('#rndcmercancia' + id).val(rndc_mercancia);

  // Llamar a la API para obtener la naturaleza
  var select_merca = {
    id_mercancia: id_mercancia,
  };

  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Consultar_naturaleza',
    type: 'POST',
    data: select_merca,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      if (data != null) {
        $('#natu' + id).html('');
        var tipo = data['tipo'];
        var natural = '';
        var palabra = '';
        if (tipo == '00') {
          natural = '1';
          palabra = 'Carga normal';
        }
        if (tipo == 'CP') {
          natural = '2';
          palabra = 'Carga peligrosa';
        }
        if (tipo == 'DP') {
          natural = '5';
          palabra = 'Desechos peligrosos';
        }
        $('#natu' + id).append('<option value="' + natural + '">' + palabra + '</option>');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//eliminar datos de mercancia
function Elimina_Mercancia(btn, id) {
  let confirm = window.confirm('¿Desea eliminar el bloque de mercancia ' + id + '?');
  if (confirm == true) {
    event.preventDefault();
    $('.tr' + id).remove();
    $(this).closest('tr').remove();
  }
  //recalcular totales
  recalcula_cifras();
  llenaritem();
}

function lugares(id) {

  //alert('cambio');
  $('#vehiculo_cliente' + id).html('');
  var origen = $('#origen_cliente' + id).val();
  let selectedOrigen = $('#origen_cliente' + id).find('option:selected'); // Obtiene la opción seleccionada
  var municipio_origen = selectedOrigen.data('municipio');
  var depto_origen = selectedOrigen.data('depto');

  let selectedDestino = $('#destino_cliente' + id).find('option:selected'); // Obtiene la opción seleccionada
  var destino = $('#destino_cliente' + id).val();
  var municipio_destino = selectedDestino.data('municipio');
  var depto_destino = selectedDestino.data('depto');

  // Agrega_Remitente(document.getElementById('id_cliente_seleccionado').value, origen);
  $.ajax({
    url: $('#base_url').val() + 'serviciocliente/Tipo_Vehiculos',
    type: 'POST',
    dataType: 'json',
    success: function (data) {
      //traer el tipo de vehiculo
      $('#vehiculo_cliente' + id + '').append('<option value="">Seleccione</option>');
      data.forEach(function (element, index) {
        $('#vehiculo_cliente' + id + '').append('<option value="' + element.id + '">' + element.nombre + '</option>');
        //costo individual

        //costo total
        var tot = $('#Tcosto_flete').val(); //capturar el costo total del flete
        var fle = $('#flete' + id).val(); //traer el valor actual del flete
        var tf = fle - tot; //restar el total menos el flete actual
        //poner el actual en cero
        $('#Tcosto_flete').val(tf); //asignarle el resultado al total
        $('#flete' + id).val(0);
        //tarifa total
        var totarifa = $('#Tservicio_transporte').val();
        var ta = $('#totaltarifa_cliente' + id).val();
        var to_ta = totarifa - ta;
        $('#totaltarifa_cliente' + id).val(0);
        $('#Tservicio_transporte').val(to_ta);

        //total cotizacion
        var tser = $('#Tservicio_transporte').val();
        var tesp = $('#Ttarifa_especial').val();
        var totcot = parseFloat(tser) + parseFloat(tesp);
        $('#Ttotal_cotizacion').val(totcot);

        $('.utilidad' + id).val(0);
        $('#renta' + id).val(0);
        $('#Tutilidad').val(0);
        $('#Trentabilidad').val(0);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no entro ');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });

  // Agregar el origen al array si no existe
  if (origen && !ORIGEN_ARRAY.includes(origen)) {
    ORIGEN_ARRAY.push(origen);
    ORIGEN_ARRAY.push(municipio_origen);
    ORIGEN_ARRAY.push(depto_origen);
  }

  // Agregar el destino al array si no existe
  if (destino && !DESTINO_ARRAY.includes(destino)) {
    DESTINO_ARRAY.push(destino);
    DESTINO_ARRAY.push(municipio_destino);
    DESTINO_ARRAY.push(depto_destino);
  }
}

function AgregarRemitentesPorBloque(bloque) {
  let max = parseInt($("#maximo_entregab" + bloque).val(), 10);

  if (!max || max < 1) {
    alert("Debe colocar una cantidad válida de remitentes.");
    return;
  }

  // si no existe, arranca en 0
  if (!remPorBloque[bloque]) remPorBloque[bloque] = 0;

  // agrega hasta que el contador llegue al máximo
  while (remPorBloque[bloque] < max) {
    // contver++;
    let cliente = $("#id_cliente_seleccionado").val();
    let origen = $("#origen_cliente" + bloque).val();

    Agrega_Remitente(cliente, origen, bloque);
  }
  // alert("Se agregaron " + max + " remitentes al bloque " + bloque);
}

/* FUNCION PARA AGREGAR REMITENTE */
var i = 0; // opcional, si lo usas en otro lado
function Agrega_Remitente(cliente, origen, bloque) {
  var cl = cliente;
  var idorigen = origen;

  if (!remPorBloque[bloque]) remPorBloque[bloque] = 0;
  if (!destPorRemBloque[bloque]) destPorRemBloque[bloque] = {};

  // 1) leer límite
  var m = parseInt($(`#maximo_entregab${bloque}`).val(), 10) || 9999;

  // 2) incrementar contador
  remPorBloque[bloque]++;

  // 3) si NOS PASAMOS del límite, deshacer incremento y salir
  if (remPorBloque[bloque] >= m) {
    document.getElementById(`maximo_entregab${bloque}`).disabled = true;
    document.getElementById(`agregar_fila_entrega2${bloque}`).disabled = true;
    // return;
  }

  // 4) ya es seguro usar el número de remitente
  var rem = remPorBloque[bloque];

  // --- Ahora que el HTML existe, hacemos el AJAX para llenar #clientea{S}
  var cliente_datos = {
    cliente: cl,
    origen: idorigen,
    action: 'cliente_puntos1'
  };

  $.ajax({
    url: $("#base_url").val() + "libs/trafico_ajax.php",
    type: "POST",
    data: cliente_datos,
    dataType: 'json',
    success: function (data) {
      // var $sel = $("#clientea" + cont);
      var $sel = $("#clientea" + bloque + "_" + rem);
      $sel.html('<option value="">Seleccione</option>');
      if (data && data.result) {
        data.result.forEach(function (element) {
          $sel.append('<option value="' + element.id + '">' + element.nombre + ' |  ' + element.municipio + ' ' + element.depto + '</option>');
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(jqXHR, textStatus, errorThrown);
    }
  });

  // incrementamos contadores
  contador_remitentes++;
  i = cont; // si usas i en otra parte, mantenerlo sincronizado
  // s++;
  // activar sólo el primero (igual que tu lógica original)
  var activo = (rem === 1) ? 'active' : '';
  var aria_selected = (rem === 1) ? 'true' : 'false';
  var tabPaneClass = (rem === 1) ? 'tab-pane fade show active' : 'tab-pane fade';

  // Botón eliminar sólo si hay más de uno
  var belimina_remi = '';
  if (remPorBloque[bloque] > 1) {
    belimina_remi = `<button class="btn btn-danger btn-sm me-1 px-1 py-1"
        data-toggle="tooltip"
        id="limpiar_remit${bloque}_${rem}"
        onclick="Elimina_Remitente(this.id,'${bloque}_${rem}',${bloque})">
        <i class="far fa-trash-alt"></i>
    </button>`;
  }

  let title_remitente = `<span id='titulo_remitente${bloque}_${rem}'>Remitente-${bloque}_${rem}</span>`;

  // Cabeza (nav item)
  var cabeza = `<li class="nav-item d-flex align-items-center remitente_bloque" data-bloque="${bloque}" data-rem="${rem}" id="navitem_remit${bloque}_${rem}">
                  <a class="nav-link ${activo} text-body-tertiary fw-bold lh-1 text-nowrap"
                     data-bs-toggle="tab"
                     role="tab"
                     aria-controls="TabRemitente-${bloque}_${rem}"
                     aria-selected="${aria_selected}"
                     href="#TabRemitente${bloque}_${rem}">
                    Remitente ${bloque}_${rem}
                  </a>
                  ${belimina_remi}
                </li>`;

  // Ciudad select (vacío, se llenará o por otro script)
  var city = `
    <select id='p_ciudad${bloque}_${rem}' class='form-select form-select-sm re_ciudad'>
      <option value="" readonly="readonly">Seleccione</option>
    </select>`;

  // Select cliente y hidden para nombre
  var cliente_select = `<select id='clientea${bloque}_${rem}' class='form-select form-select-sm re_cliente' onchange="Cambia_Remitente('${bloque}_${rem}')"></select>
                        <input type='hidden' class='form-control input-xs re_nombre' id='re_namecli${bloque}_${rem}'>`;

  var horahoy = moment().format('HH:mm:ss');

  /* Accion solo para agragr un solo destinatario a varios remitentes */
  var btn_agregar_destinatario = "";
  btn_agregar_destinatario = `<button class="btn btn-primary btn-sm me-0 px-5 py-0" onclick="Agrega_Destinatariob(this)" data-bloque="${bloque}" data-rem="${rem}" data-cliente_id="${cl}" id="agregar_destinatario${bloque}_${rem}"> &nbsp;<span class="mdi mdi-plus"></span> Destinatarios </button>`;

  // Esqueleto completo (conservé todo tu HTML)
  var esqueleto = `
    <div class="${tabPaneClass} remitente_bloque" data-bloque="${bloque}" data-rem="${rem}" role="tabpanel" aria-labelledby="TabRemitente${bloque}_${rem}" id="TabRemitente${bloque}_${rem}">
      <div class="col">
        <table class="table table-sm table-bordered tre${bloque}_${rem} text-center" style="font-size:12px;">
            <thead>
              <tr class="tre${bloque}_${rem}">
                <th class="tre${bloque}_${rem}">${title_remitente} ${btn_agregar_destinatario}
                  <input type="hidden" id="destinatario${bloque}_${rem}" class="desti_remit tre${bloque}_${rem}">
                </th>
                <th class="tre${bloque}_${rem}">Dirección</th>
                <th class="tre${bloque}_${rem}">Ciudad</th>
              </tr>
              <tr class="tre${bloque}_${rem}">
                <td>
                  ${cliente_select}
                  <input type="hidden" id="estado_upgrade${bloque}_${rem}" class="form-control input-xs est_upgrade">
                  <input type="hidden" class="form-control input-xs rlname" id="rlname${bloque}_${rem}">
                </td>
                <td>
                  <!--<button id="btnmascara_direccion${bloque}_${rem}" class="btn-xs btn-success mdi mdi-home class=" tre${bloque}_${rem}" tittle="Generar dirección" onclick="mascara_dire(${bloque}_${rem});"></button>-->
                  <input type="text" id="dire${bloque}_${rem}" class="form-control form-control-sm re_dire" style=" height:14px; font-size:90%;" readonly="readonly">
                  <input type="hidden" class="form-control input-xs rldire" id="rldire${bloque}_${rem}">
                </td>
                <td class="tre${bloque}_${rem}">${city}</td>
              </tr>

              <tr class="tre${bloque}_${rem}">
                <th class="tre${bloque}_${rem}">Teléfono</th>
                <th class="tre${bloque}_${rem}">Observación</th>
                <th>Peso Neto(Kg)</th>
              </tr>

              <tr class="tre${bloque}_${rem}">
                <td class="tre${bloque}_${rem}">
                  <input type="number" id="telpunto${bloque}_${rem}" class="form-control form-control-sm re_telefono" min="0">
                  <input type="hidden" id="rltel${bloque}_${rem}" class="form-control input-xs rltel">
                </td>
                <td class="tre${bloque}_${rem}">
                  <textarea id="observa${bloque}_${rem}" class="form-control form-control-sm" rows="1"></textarea>
                </td>
                <td class="tre${bloque}_${rem}">
                  <input type="number" id="peso${bloque}_${rem}" class="form-control form-control-sm re_peso">
                </td>
              </tr>

              <tr class="tre${bloque}_${rem}">
                <th class="tre${bloque}_${rem}">Fecha de recogida</th>
                <th class="tre${bloque}_${rem}">Hora de recogida</th>
                <th class="tre${bloque}_${rem}">Lugar de recogida</th>
              </tr>

              <tr class="tre${bloque}_${rem}">
                <td>
                  <input type="date" id="fecha${bloque}_${rem}" class="form-control form-control-sm re_fecha">
                </td>
                <td class="tre${bloque}_${rem}">
                  <input type="time" id="hora${bloque}_${rem}" class="form-control form-control-sm re_hora" value="${horahoy}">
                </td>
                <td class="tre${bloque}_${rem}">
                  <input type="text" id="lugar${bloque}_${rem}" class="form-control form-control-sm re_lugar">
                  <input type="hidden" id="id_puntorem${bloque}_${rem}" class="input_xs id_punto" value="${bloque}_${rem}">
                </td>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
      </div>
    </div>
  `;

  // DESTINATARIOS CONTENEDOR INDEPENDIENTE
  var esqueleto_destinatarios = `
      <!-- AQUÍ CREO EL CONTENEDOR DE DESTINATARIOS  -->
    <div id="destinatarios_contenedor${bloque}_${rem}" class="mt-5 destinatarios_bloque" data-bloque="${bloque}" data-rem="${rem}">
      <div class="widgets-scrollspy-nav mt-n5 bg-body-emphasis z-5 border-bottom">
        <nav class="navbar py-0" id="widgets-scrollspy-destinatario${bloque}_${rem}">
          <ul class="nav flex-nowrap" id="destinatarios_menu${bloque}_${rem}" style="overflow-x: auto;">
            <!-- Elementos del menú -->
          </ul>
        </nav>
      </div>

      <div data-bs-spy="scroll" data-bs-target="#widgets-scrollspy-destinatario">
        <div class="tab-content bg-success-white" id="accordion_destinatario${bloque}_${rem}">
          <!-- Elementos del tab -->
        </div>
      </div>
    </div>
  `;

  // APPEND CORRECTO
  $(`#remitentes_menu${bloque}`).append(cabeza);
  $(`#nav_contenedor${bloque}`).append(esqueleto);
  $(`#destinatarios_contenedor_bloque${bloque}`).append(esqueleto_destinatarios);

  // inicializar destinatarios para este remitente
  destPorRemBloque[bloque][rem] = 0;
}

// FUNCION PARA AGREGAR DESTINATARIO CON TABS CORRECTOS
var destino = "";
function Agrega_Destinatariob(element, clienteDestino, destino, bloque, rem) {

  let cliente_id;
  let bloque_id;
  let rem_id;
  let destino_val;

  if (element) {
    const $el = $(element);
    bloque_id = $el.data("bloque");
    rem_id = $el.data("rem");
    cliente_id = $el.data("cliente_id");
    destino_val = $("#destino_cliente" + bloque_id).val();
  } else {
    bloque_id = bloque;
    rem_id = rem;
    cliente_id = clienteDestino;
    destino_val = destino;
  }

  if (!destino_val) {
    alert("Debe seleccionar destino");
    return;
  }

  // inicializar contadores por remitente
  if (!destPorRemBloque[bloque_id]) destPorRemBloque[bloque_id] = {};
  if (!destPorRemBloque[bloque_id][rem_id]) destPorRemBloque[bloque_id][rem_id] = 0;

  // === VALIDACIÓN DE LIMITE ===
  let maxDest = parseInt($(`#maximo_entregab${bloque_id}`).val(), 10) || 9999;

  destPorRemBloque[bloque_id][rem_id]++;

  // if (destPorRemBloque[bloque_id][rem_id] > maxDest) {
  //   destPorRemBloque[bloque_id][rem_id]--;
  //   alert(`Se alcanzó el número máximo (${maxDest}) de destinatarios para el remitente ${bloque_id}_${rem_id}`);
  //   return;
  // }

  // if (destPorRemBloque[bloque_id][rem_id] === maxDest) {
  //   $(`#agregar_destinatario${bloque_id}_${rem_id}`).prop('disabled', true);
  // }

  const d = destPorRemBloque[bloque_id][rem_id];

  const id_prefix = `${bloque_id}_${rem_id}_${d}`;
  const horahoy = moment().format("HH:mm:ss");

  // llenar select cliente vía AJAX
  $.ajax({
    url: $("#base_url").val() + "libs/trafico_ajax.php",
    type: "POST",
    data: {
      cliente: cliente_id,
      destino: destino_val,
      action: "cliente_puntos"
    },
    dataType: "json",
    success: function (data) {
      $("#clienteb" + id_prefix).html('<option value="">Seleccione</option>');
      if (data.result) {
        data.result.forEach(el => {
          $("#clienteb" + id_prefix).append(`<option value="${el.id}">${el.nombre} | ${el.municipio} ${el.depto}</option>`);
        });
      }
    }
  });

  // activar sólo el primero (igual que tu lógica original)
  var activo = (d === 1) ? 'active' : '';
  var aria_selected = (d === 1) ? 'true' : 'false';
  var tabPaneClass = (d === 1) ? 'tab-pane fade show active' : 'tab-pane fade';

  /** botón para eliminar destinatario **/
  const btn_eliminar = `
    <button onclick="Elimina_Destinatario('${id_prefix}', ${bloque_id}, ${rem_id})" class="btn btn-danger float-end btn btn-danger btn-sm me-1 px-1 py-1">
      <i class="far fa-trash-alt"></i>
    </button>`;

  /** TAB HEADER **/
  const cabeza = `
      <li class="nav-item d-flex align-items-center destinatario_item" data-bloque="${bloque_id}" data-rem="${rem_id}" data-dest="${d}">
        <a class="nav-link ${activo} text-body-tertiary fw-bold lh-1"
           data-bs-toggle="tab"
           href="#TabDestinatario${id_prefix}"
           aria-selected="${aria_selected}">
          Destinatario ${id_prefix} - R${rem_id}
        </a>
        ${btn_eliminar}
      </li>`;

  /** TAB CONTENT **/
  const contenido = `
      <div class="${tabPaneClass} destinatario_contenido" data-bloque="${bloque_id}" data-rem="${rem_id}" data-dest="${d}" role="tabpanel" id="TabDestinatario${id_prefix}">
        <table class="table table-bordered table-sm text-center" style="font-size:12px;">
          <thead>
            <tr>
              <th>Destinatario</th>
              <th>Dirección</th>
              <th>Ciudad</th>
            </tr>
            <tr>
              <td>
              <select id="clienteb${id_prefix}" class="form-select form-select-sm de_cliente" onchange="Cambia_Destinatario('${bloque_id}_${rem_id}_${d}')"></select>
               <input type="hidden" class="form-control form-control-sm dlname" id="dlname${id_prefix}">
               <input type="hidden" class="form-control form-control-sm dlestado" id="dlestado${id_prefix}">
              </td>
              <td>
                <input type="text" id="direb${id_prefix}" class="form-control form-control-sm de_dire" readonly>
                <input type="hidden" class="form-control form-control-sm dldire" id="dldire${id_prefix}">
              </td>
              <td>
                <select id="p_ciudadb${id_prefix}" class="form-select form-select-sm de_ciudad">
                  <option value="">Seleccione</option>
                </select>
              </td>
            </tr>
            <tr>
              <th>Teléfono</th>
              <th>Lugar</th>
              <th>Fecha</th>
            </tr>
            <tr>
              <td>
                <input type="text" id="telpuntob${id_prefix}" class="form-control form-control-sm tel_dire" pattern="[0-9]{8,10}" maxlength="10">
                <input type="hidden" class="form-control form-control-sm dltel" id="dltel${id_prefix}">
              </td>
              <td>
                <input type="text" id="lugarb${id_prefix}" class="form-control form-control-sm de_lugar">
              </td>
              <td>
                <input type="date" id="fechab${id_prefix}" class="form-control form-control-sm de_fecha">
              </td>
            </tr>
            <tr>
              <th>Hora</th>
              <th>Peso</th>
              <th>Orden</th>
            </tr>
            <tr>
              <td><input type="time" id="horab${id_prefix}" class="form-control form-control-sm de_hora" value="${horahoy}"></td>
              <!--<td><input type="number" id="pesob${id_prefix}" class="form-control form-control-sm de_peso"></td>-->
              <td>
                <input type="number"
                      id="pesob${id_prefix}"
                      class="form-control form-control-sm de_peso"
                      onkeyup="calcularTarifaDestinatario(${bloque_id}, ${rem_id}, ${d})"
                      onchange="calcularTarifaDestinatario(${bloque_id}, ${rem_id}, ${d})">
              </td>
              <td><input type="text" id="ordenb${id_prefix}" class="form-control form-control-sm" readonly value="${d}"></td>
              <input type="hidden" class="bg-light form-control form-control-sm idrem_d" readonly="readonly" id="idrem_d${id_prefix}" value="${id_prefix}">
            </tr>
            <tr>
              <td colspan="2">
                <textarea type="text" id="observdesb${id_prefix}" class="form-control form-control-sm de_obser" rows="1" placeholder="Observación del cliente"></textarea>
              </td>
              <td>
                <input type="text" id="valor_tarifa_venta${id_prefix}" class="form-control form-control-sm" placeholder="Total Tarifa" disabled>
              </td>
            </tr>
          </thead>
        </table>
      </div>`;

  /** APPEND SIN REEMPLAZAR **/
  $(`#destinatarios_menu${bloque_id}_${rem_id}`).append(cabeza);
  $(`#accordion_destinatario${bloque_id}_${rem_id}`).append(contenido);
}

function Elimina_Remitente(btnId, rem_id, bloque) {

  let partes = rem_id.split("_");
  let realRem = partes.length > 1 ? partes[1] : rem_id;

  // eliminar elementos
  $(`#navitem_remit${bloque}_${realRem}`).remove();
  $(`#TabRemitente${bloque}_${realRem}`).remove();
  $(`#destinatarios_contenedor${bloque}_${realRem}`).remove();

  let nuevoIndex = 1;
  let tempDest = {};

  $(`#remitentes_menu${bloque} li`).each(function () {

    let $li = $(this);
    let $a = $li.find("a");

    if (!$a.length) return;

    let href = $a.attr("href");
    let match = href.match(/TabRemitente(\d+)_(\d+)/);

    if (!match) return;

    let oldRem = match[2];
    let newRem = nuevoIndex++;

    //Actualizar Titulo del contenedor
    $(`#titulo_remitente${bloque}_${oldRem}`).html(`Remitente-${bloque}_${newRem}`);

    // actualizar NAV
    $li.attr("id", `navitem_remit${bloque}_${newRem}`);
    $a.attr("href", `#TabRemitente${bloque}_${newRem}`);
    $a.html(`Remitente ${bloque}_${newRem}`);

    // actualizar TAB contenido
    $(`#TabRemitente${bloque}_${oldRem}`)
      .attr("id", `TabRemitente${bloque}_${newRem}`)
      .find(`#agregar_destinatario${bloque}_${oldRem}`)
      .attr("id", `agregar_destinatario${bloque}_${newRem}`)
      .attr("data-rem", newRem); // ACTUALIZA data-attr

    // actualizar botón eliminar
    $(`#limpiar_remit${bloque}_${oldRem}`)
      .attr("id", `limpiar_remit${bloque}_${newRem}`)
      .attr("onclick", `Elimina_Remitente(this.id, '${bloque}_${newRem}', ${bloque})`);

    // actualizar contenedor destinatarios
    $(`#destinatarios_contenedor${bloque}_${oldRem}`).attr("id", `destinatarios_contenedor${bloque}_${newRem}`);
    $(`#destinatarios_menu${bloque}_${oldRem}`).attr("id", `destinatarios_menu${bloque}_${newRem}`);
    $(`#accordion_destinatario${bloque}_${oldRem}`).attr("id", `accordion_destinatario${bloque}_${newRem}`);

    // manejar destinatarios existentes
    let dCount = destPorRemBloque[bloque][oldRem] || 0;

    if (dCount > 0) {
      tempDest[newRem] = dCount;

      for (let d = 1; d <= dCount; d++) {
        let oldPrefix = `${bloque}_${oldRem}_${d}`;
        let newPrefix = `${bloque}_${newRem}_${d}`;

        $(`#TabDestinatario${oldPrefix}`).attr("id", `TabDestinatario${newPrefix}`);
        $(`#clienteb${oldPrefix}`).attr("id", `clienteb${newPrefix}`);
        $(`#p_ciudadb${oldPrefix}`).attr("id", `p_ciudadb${newPrefix}`);
        $(`#direb${oldPrefix}`).attr("id", `direb${newPrefix}`);
        $(`#telpuntob${oldPrefix}`).attr("id", `telpuntob${newPrefix}`);
        $(`#ordenb${oldPrefix}`).attr("id", `ordenb${newPrefix}`);
      }
    }
  });

  destPorRemBloque[bloque] = tempDest;
  remPorBloque[bloque] = nuevoIndex - 1;

  document.getElementById(`maximo_entregab${bloque}`).disabled = false;
  document.getElementById(`agregar_fila_entrega2${bloque}`).disabled = false;
}

function Elimina_Destinatario(id_prefix, bloque_id, rem_id) {
  let partes = id_prefix.split("_");
  let oldDest = partes[2];

  $(`#TabDestinatario${id_prefix}`).remove();
  $(`#destinatarios_menu${bloque_id}_${rem_id} li a[href='#TabDestinatario${id_prefix}']`).closest("li").remove();

  let totalDest = destPorRemBloque[bloque_id][rem_id] || 0;

  if (totalDest <= 1) {
    destPorRemBloque[bloque_id][rem_id] = 0;
    return;
  }

  let nuevoIndex = 1;

  $(`#destinatarios_menu${bloque_id}_${rem_id} li`).each(function () {

    let $li = $(this);
    let $a = $li.find("a");

    let href = $a.attr("href");
    let match = href.match(/TabDestinatario(\d+)_(\d+)_(\d+)/);
    if (!match) return;

    let oldBloque = match[1];
    let oldRem2 = match[2];
    let oldDest2 = match[3];

    let newDest = nuevoIndex++;

    // ===== CAPTURAR ANTES DE RENOMBRAR =====
    let $orden = $(`#ordenb${oldBloque}_${oldRem2}_${oldDest2}`);
    let $idrem = $(`#idrem_d${oldBloque}_${oldRem2}_${oldDest2}`);

    // NAV
    $a.attr("href", `#TabDestinatario${bloque_id}_${rem_id}_${newDest}`);
    $a.text(`Destinatario ${bloque_id}_${rem_id}_${newDest} - R${rem_id}`);

    let $btn = $li.find("button");
    if ($btn.length) {
      $btn.attr("onclick", `Elimina_Destinatario('${bloque_id}_${rem_id}_${newDest}', ${bloque_id}, ${rem_id})`);
    }

    // CONTENEDORES
    $(`#TabDestinatario${oldBloque}_${oldRem2}_${oldDest2}`)
      .attr("id", `TabDestinatario${bloque_id}_${rem_id}_${newDest}`);

    $(`#clienteb${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `clienteb${bloque_id}_${rem_id}_${newDest}`);
    $(`#p_ciudadb${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `p_ciudadb${bloque_id}_${rem_id}_${newDest}`);
    $(`#direb${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `direb${bloque_id}_${rem_id}_${newDest}`);
    $(`#telpuntob${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `telpuntob${bloque_id}_${rem_id}_${newDest}`);
    $(`#lugarb${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `lugarb${bloque_id}_${rem_id}_${newDest}`);
    $(`#fechab${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `fechab${bloque_id}_${rem_id}_${newDest}`);
    $(`#horab${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `horab${bloque_id}_${rem_id}_${newDest}`);
    $(`#pesob${oldBloque}_${oldRem2}_${oldDest2}`).attr("id", `pesob${bloque_id}_${rem_id}_${newDest}`);

    // ===== RENAME IDs =====
    $orden.attr("id", `ordenb${bloque_id}_${rem_id}_${newDest}`);
    $idrem.attr("id", `idrem_d${bloque_id}_${rem_id}_${newDest}`);

    // ===== UPDATE VALUE =====
    $(`#ordenb${bloque_id}_${rem_id}_${newDest}`).val(`${bloque_id}_${rem_id}_${newDest}`);
    $(`#idrem_d${bloque_id}_${rem_id}_${newDest}`).val(`${bloque_id}_${rem_id}_${newDest}`);
  });

  destPorRemBloque[bloque_id][rem_id] = nuevoIndex - 1;
}

function ReiniciarDestinatarios(cont) {
  // 1. Reinicializar las variables globales
  // Asumo que estas variables son globales y controlan la lógica de la función Agrega_Destinatariob
  // DEBES asegurarte de que 'contador_destinatarios', 'contador_remitentes' (si aplica) 
  // y otras variables de control global estén definidas fuera de cualquier función.
  window.d = 0;
  window.accion_destinatario = 0;
  window.contador_destinatarios = 0; // Asumo que existe y lo usas globalmente
  // window.contador_remitentes = 0; // Si el cambio de servicio afecta a los remitentes, también reinícialo

  // 2. Limpiar los contenedores HTML de la Vista
  const menuDestinatarios = document.getElementById(`destinatarios_menu${cont}`);
  const acordeonDestinatarios = document.getElementById(`accordion_destinatario${cont}`);

  if (menuDestinatarios) {
    menuDestinatarios.innerHTML = '';
    // Opcional: Reinserta la pestaña inicial si la necesitas
    // Por ejemplo: menuDestinatarios.innerHTML = '<li class="nav-item"><a class="nav-link active..." href="#TabDestinatario1">Destinatario 1</a></li>';
  }

  if (acordeonDestinatarios) {
    acordeonDestinatarios.innerHTML = '';
  }

  // 3. Opcional: Habilitar o mostrar el botón inicial de agregar destinatario
  // (Si tienes un botón para agregar el primer destinatario que pudo haber sido ocultado)
  // document.getElementById("agregar_destinatario1").style.display = "block";

  console.log("Reiniciados los contadores y la vista de destinatarios.");
}

function Cambia_Remitente(c) {
  var remite = $("#clientea" + c).val();
  if (remite != '') {
    var dato = {
      idremite: remite,
      action: 'consulta_datos_remitente'
    };

    $.ajax({
      url: $("#base_url").val() + "libs/servicio_cliente_ajax.php",
      type: 'POST',
      data: dato,
      dataType: 'json',
      success: function (data) {
        $("#p_ciudad" + c + "").html('');
        if (data) {
          $("#p_ciudad" + c + "").html(
            '<option value="' + data.result[0].id_municipio + '">' + data.result[0].municipio + '/' + data
              .result[0].depto + '</option>');
          $("#dire" + c + "").val(data.result[0].direccion);
          $("#telpunto" + c + "").val(data.result[0].celular);
          $("#re_namecli" + c + "").val(data.result[0].nombre);
          $("#estado_upgrade" + c + "").val(data.result[0].estado_actualizacion_rndc);
          $("#rlname" + c + "").val(data.result[0].long_name);
          $("#rldire" + c + "").val(data.result[0].long_address);
          $("#rltel" + c + "").val(data.result[0].long_cel);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no trajo datos remitente');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  }
}

function Cambia_Destinatario(c) {
  var remite = $("#clienteb" + c).val();
  if (remite != '') {
    var dato = {
      idremite: remite,
      action: 'consulta_datos_remitente'
    };

    $.ajax({
      url: $("#base_url").val() + "libs/servicio_cliente_ajax.php",
      type: 'POST',
      data: dato,
      dataType: 'json',
      success: function (data) {
        $("#p_ciudadb" + c + "").html('');
        if (data) {
          $("#p_ciudadb" + c + "").html(
            '<option value="' + data.result[0].id_municipio + '">' + data.result[0].municipio + '/' + data
              .result[0].depto + '</option>');
          $("#direb" + c + "").val(data.result[0].direccion);
          $("#telpuntob" + c + "").val(data.result[0].celular);
          $("#de_nombre" + c + "").val(data.result[0].nombre);
          $("#dlname" + c + "").val(data.result[0].long_name);
          $("#dlestado" + c + "").val(data.result[0].estado_actualizacion_rndc);
          $("#dldire" + c + "").val(data.result[0].long_address);
          $("#dltel" + c + "").val(data.result[0].long_cel);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no trajo datos remitente');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  }
}

//cambiar valor del peso neto total
function cambio_valor(elem, id2) {
  var elemento = $(elem);
  t = elemento.val();
  var tonelada = 1000;
  var multi = t / tonelada;
  $('#pesobruto_cliente' + id2).val(multi);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //maquetear peso bruto Tn
  $('#pesobruto_cliente' + id2).val(parseFloat($('#pesobruto_cliente' + id2).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

// cambiar valor del peso neto + validación
function CambioNeto(elem, id2) {

  const elemento = $(elem);

  // Peso Neto ingresado
  let pesoNeto = parseFloat(
    elemento.val().toString().replace(/,/g, '')
  ) || 0;

  // Peso Bruto del mismo bloque
  const pesoBrutoInput = $(`#peso_client1${id2}`);
  let pesoBruto = parseFloat(
    pesoBrutoInput.val()?.toString().replace(/,/g, '')
  ) || 0;

  // VALIDACIÓN CLAVE
  if (pesoNeto > pesoBruto) {
    Swal.fire({
      icon: 'warning',
      title: 'Peso inválido',
      text: 'El peso neto no puede ser mayor al peso bruto.',
    });

    elemento.val('');
    elemento.focus();
    return false;
  }

  // Formatear correctamente (si pasa validación)
  elemento.val(
    pesoNeto
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  );

  return true;
}

//cambiar valor del volumen total
function volumen_total(elem, ida) {
  // a = valor del ancho
  //ida = id del campo
  var elemento = $(elem);
  var to, go, cho;
  var alto = $('#alto_cliente' + ida).val().replace(/,/g, '');
  var largo = $('#largo_cliente' + ida).val().replace(/,/g, '');
  var ancho = elemento.val().replace(/,/g, '');
  to = alto / 100;
  go = largo / 100;
  cho = ancho / 100;
  if (alto != '' && largo != '') {
    var operar = go * cho * to;
    $('#volumen_cliente' + ida).val(operar);
    //maquetar ancho
    elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    //maquetar volumen
    $('#volumen_cliente' + ida).val(parseFloat($('#volumen_cliente' + ida).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  }
}

//calcula tarifa
function utilidad(elem, id, max) {
  var cont = contador_global1;
  $('#totaltarifa_cliente' + id).val(parseFloat($('#totaltarifa_cliente' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
  //trayendo valor tarifa y el id de la tarifa
  //UTILIDAD INDIVIDUAL
  var calculo, resta, util, res;
  var acu = 0;
  var variable = 0;
  var f = $('#flete' + id).val().replace(/,/g, '');
  resta = parseFloat(valor) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(valor);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);
  $('.utilidad' + id).val(res);
  $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

  //RENTABILIDAD
  var rent = parseFloat(valor) - parseFloat(f);
  $('#renta' + id).val(rent);
  $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  var i;
  var sum = 0;
  var vtemp;
  $('#Tservicio_transporte').val(0);
  recalcula_cifras();
  for (i = 1; i <= cont; i++) {
    //alert (max);
    vtemp = 0;
    vtemp = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
    sum = parseFloat(sum) + parseFloat(vtemp);
  }
  var vt = $('#Tservicio_transporte').val().replace(/,/g, '');
  var sumtotal = parseFloat(vt) + parseFloat(sum);
  $('#Tservicio_transporte').val(sumtotal);
  //utilidad total
  var costot = $('#Tcosto_flete').val().replace(/,/g, '');
  var tartot = $('#Tservicio_transporte').val().replace(/,/g, '');
  var utitot = (parseFloat(tartot) - parseFloat(costot)) / tartot * 100;
  utitot = utitot.toFixed(2);
  $('#Tutilidad').val(utitot);
  var rentot = parseFloat(tartot) - parseFloat(costot);
  $('#Trentabilidad').val(rentot);
  //total cotizacion
  var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
  var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
  var totcot = parseFloat(tser) + parseFloat(tesp);
  $('#Ttotal_cotizacion').val(totcot);
  //maquetar los totales
  $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //$("#Tcosto_flete").val(parseFloat($("#Tcosto_flete").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
  $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //recalcular cifras
  recalcula_cifras();
}

//calcula flete
function utilidad_d(elem, id, max) {
  var conte = contador_global1;
  var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
  var calculo, resta, util, res;
  var acu = 0;
  var variable = 0;
  var f = $('#flete' + id).val().replace(/,/g, '');
  var ff = $('#flete' + id);
  ff.val(parseFloat(ff.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //UTILIDAD
  resta = parseFloat(valor) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(valor);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);
  $('.utilidad' + id).val(res);
  $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //RENTABILIDAD
  var rent = parseFloat(valor) - parseFloat(f);
  $('#renta' + id).val(rent);
  $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //Recalcular la tarifa total
  var i;
  var sum = 0;
  var vtemp;
  //Recalcular el costo flete total
  var e;
  var mas = 0;
  var vtempd;
  //SUBTOTALES DE DATOS DE MERCANCIA
  //Valor total costo del flete
  recalcula_cifras();
  $('#Tservicio_transporte').val(0);
  $('#Tcosto_flete').val(0);
  for (i = 1; i <= conte; i++) {
    //alert (max);
    vtemp = 0;
    vtemp = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
    sum = parseFloat(sum) + parseFloat(vtemp);

    vtempd = 0;
    vtempd = $('#flete' + i).val().replace(/,/g, '');
    mas = parseFloat(mas) + parseFloat(vtempd);
  }
  var vt = $('#Tservicio_transporte').val().replace(/,/g, '');
  var sumtotal = parseFloat(vt) + parseFloat(sum);
  $('#Tservicio_transporte').val(sumtotal);

  var vf = $('#Tcosto_flete').val().replace(/,/g, '');
  var sumftotal = parseFloat(vf) + parseFloat(mas);
  $('#Tcosto_flete').val(sumftotal);
  //Utilidad y Rentabilidad total
  var costot = $('#Tcosto_flete').val().replace(/,/g, '');
  var tartot = $('#Tservicio_transporte').val().replace(/,/g, '');
  var utitot = (parseFloat(tartot) - parseFloat(costot)) / tartot * 100;
  utitot = utitot.toFixed(2);
  $('#Tutilidad').val(utitot);
  var rentot = parseFloat(tartot) - parseFloat(costot);
  $('#Trentabilidad').val(rentot);
  //Total cotización
  var tser = $('#Tservicio_transporte').val().replace(/,/g, '');
  var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
  var totcot = parseFloat(tser) + parseFloat(tesp);
  $('#Ttotal_cotizacion').val(totcot);
  //maquetar campos
  $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  recalcula_cifras();
}

function recalcula_cifras() {
  var resum = 0;
  let retari = 0;
  let reutil = 0;
  let rerenta = 0;
  //especiales
  let costoes = 0;
  let taries = 0;
  let utiles = 0;
  let rentaes = 0;
  $('.fletemer').each(function (index) {
    var valorfle = $(this).val().replace(/,/g, '');
    resum = parseFloat(resum) + parseFloat(valorfle);
    //alert('TOTflete'+resum);
    $('#Tcosto_flete').val(resum);
  });
  $('.tarifamer').each(function (index) {
    var valortarifa = $(this).val().replace(/,/g, '');
    retari = parseFloat(retari) + parseFloat(valortarifa);
    //alert('TOTtari'+retari);
    $('#Tservicio_transporte').val(retari);
  });
  $('.utilmer').each(function (index) {
    var valorf = $('#Tcosto_flete').val().replace(/,/g, '');
    var valort = $('#Tservicio_transporte').val().replace(/,/g, '');
    restaT = parseFloat(valort) - parseFloat(valorf);
    calculo = parseFloat(restaT) / parseFloat(valort);
    res_utilidad = parseFloat(calculo) * 100;
    res_utilidad = res_utilidad.toFixed(2);
    $('#Tutilidad').val(res_utilidad);
  });
  $('.rentamer').each(function (index) {
    var valorrenta = $(this).val().replace(/,/g, '');
    rerenta = parseFloat(rerenta) + parseFloat(valorrenta);
    //alert('TOTren'+rerenta);
    $('#Trentabilidad').val(rerenta);
  });
  /*alert('renta'+retari);
  alert('uti'+reutil);
  alert('renta'+rerenta);*/
  //especiales
  if (typeof $('.tcostoesp').val() !== 'undefined') {
    $('.tcostoesp').each(function (index) {
      var valorcostoe = $(this).val().replace(/,/g, '');
      costoes = parseFloat(costoes) + parseFloat(valorcostoe);
      $('#Tcosto_especial').val(costoes);
    });
    $('.ttariesp').each(function (index) {
      var valortari = $(this).val().replace(/,/g, '');
      taries = parseFloat(taries) + parseFloat(valortari);
      $('#Ttarifa_especial').val(taries);
    });
    $('.tutiesp').each(function () {
      var valoru = $(this).val().replace(/,/g, '');
      utiles = parseFloat(utiles) + parseFloat(valoru);
      $('#Tutilidad_especial').val(utiles);
    });
    $('.trenesp').each(function (index) {
      var valorrentes = $(this).val().replace(/,/g, '');
      rentaes = parseFloat(rentaes) + parseFloat(valorrentes);
      $('#Trenta_especial').val(rentaes);
    });
  } else {
    //alert('cero dato especial');
    //recalcula_cifras();
    $('#Tcosto_especial').val(0);
    $('#Ttarifa_especial').val(0);
    $('#Tutilidad_especial').val(0);
    $('#Trenta_especial').val(0);
  }
  //total cotizacion
  var tarimer = $('#Tservicio_transporte').val().replace(/,/g, '');
  var tariespe = $('#Ttarifa_especial').val().replace(/,/g, '');
  var sumatot = parseFloat(tarimer) + parseFloat(tariespe);
  $('#Ttotal_cotizacion').val(sumatot);
  //formatear números
  // $('.costos_flete').html(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.tarifa_servicio_transporte').html(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.total_utilidad').html(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.Total_rentabilidad').html(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  /* Servicios especiales */
  // $('.costos_especial').html(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tcosto_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.Total_tarifa_especial').html(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.Total_utilidad_especial').html(parseFloat($('#Tutilidad_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad_especial').val(parseFloat($('#Tutilidad_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.Total_renta_especial').html(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trenta_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

//Función para maquetear números
function currencyMask(ele) {
  //alert('agua bendita');
  var elemento = $(ele);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

function currencyMask2(elemento) {
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

var cuente = 0;
function obtenerflete(valor, id, max) {
  //alert('cambio de flete');
  //alert (valor);
  $('#flete' + id).val(0);
  var origen = $('#origen_cliente' + id).val();
  var destino = $('#destino_cliente' + id).val();
  var tvehiculo = valor;
  var i;
  var sum = 0;
  var dum = 0;

  Calcular_Tarifa(id, origen, destino);

  var flete = {
    origen: origen,
    destino: destino,
    vehiculo: tvehiculo,
    // action: 'traer_flete',
  };

  $.ajax({
    // url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
    url: $('#base_url').val() + 'serviciocliente/Consultar_Flete',
    type: 'POST',
    data: flete,
    dataType: 'json',
    success: function (data) {
      if (data) {
        //$("#Tcosto_flete").val(0);
        let costoflete = data?.[0]?.tarifa ?? 0;
        $('#flete' + id + '').val(costoflete);
        $('#flete' + id + '').val(parseFloat($('#flete' + id + '').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        //utilidad
        var calculo, resta, util, res;
        var valor = $('#totaltarifa_cliente' + id).val().replace(/,/g, '');
        resta = parseFloat(valor) - parseFloat(costoflete);
        calculo = parseFloat(resta) / parseFloat(valor);
        res = parseFloat(calculo) * 100;
        res = res.toFixed(2);
        $('.utilidad' + id).val(res);
        $('.utilidad' + id).val(parseFloat($('.utilidad' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        //rentabilidad
        recalcula_cifras();
        var rent = parseFloat(valor) - parseFloat(costoflete);
        $('#renta' + id).val(rent);
        $('#renta' + id).val(parseFloat($('#renta' + id).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        //otros - obtener subtotales de la cotizacion
        for (i = 1; i <= contador_global1; i++) {
          var f = $('#flete' + i).val().replace(/,/g, '');
          var t = $('#totaltarifa_cliente' + i).val().replace(/,/g, '');
          sum = parseFloat(sum) + parseFloat(f);
          //var y=parseFloat(sum)+parseFloat(costu);
          dum = parseFloat(dum) + parseFloat(t);
        }

        //var costu=$("#Tcosto_flete").val();//0
        //var y=parseFloat(sum)+parseFloat(costu);
        var costot = $('#Tcosto_flete').val(sum);
        var tartot = $('#Tservicio_transporte').val(dum);
        //maquetar datos

        //calcular utilidad total
        var utitot = (parseFloat(dum) - parseFloat(sum)) / dum * 100;
        utitot = utitot.toFixed(2);
        $('#Tutilidad').val(utitot);

        var rentot = parseFloat(dum) - parseFloat(sum);
        $('#Trentabilidad').val(rentot);
        //$("#Trentabilidad").val(parseFloat($("#Trentabilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        //total cotización
        var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
        var totcot = parseFloat(dum) + parseFloat(tesp);
        $('#Ttotal_cotizacion').val(totcot);
        //$("#Ttotal_cotizacion").val(parseFloat($("#Ttotal_cotizacion").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

        //fin for
      } else {
        alert('No existe un flete para esa asociación, por favor creelo.');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log('no trajo flete');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  recalcula_cifras();
}

function Calcular_Tarifa(id, origen, destino) {
  // var destino = $('#destino_cliente' + id).val();
  var cliente = document.getElementById('id_cliente_seleccionado').value

  var flete = {
    cliente: cliente,
    origen: origen,
    destino: destino,
  };

  $.ajax({
    // url: $('#base_url').val() + 'libs/servicio_cliente_ajax.php',
    // url: $('#base_url').val() + 'serviciocliente/Consultar_venta_cliente',
    url: $('#base_url').val() + 'serviciocliente/Consultar_Tarifa_Venta',
    type: 'POST',
    data: flete,
    dataType: 'json',
    success: function (data) {
      if (data) {
        //$("#Tcosto_flete").val(0);
        var costoflete = data.tarifa;
        $('#totaltarifa_cliente' + id + '').val(costoflete);
        $('#totaltarifa_cliente' + id + '').val(parseFloat($('#totaltarifa_cliente' + id + '').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
        recalcula_cifras();
        //fin for
      } else {
        alert('No existe un flete para esa asociación, por favor creelo.');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // console.log('no trajo flete');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function marcarError(selector) {
  const $el = $(selector);

  if ($el.length) {

    // Caso SELECT2
    if ($el.hasClass("select2-hidden-accessible")) {
      let $select2 = $el.next(".select2-container").find(".select2-selection");

      $select2.addClass("input-error");

      $el.on("change", function () {
        $select2.removeClass("input-error");
      });

    } else {
      // Inputs normales
      $el.addClass("input-error");

      $el.on("input change", function () {
        $(this).removeClass("input-error");
      });
    }
  }
}

function validateSolicitud() {
  let errores = [];

  // ======================================================
  // VALIDAR MERCANCÍAS
  // ======================================================
  for (let b = 1; b <= cont; b++) {

    if (!$(`#tipo_mercancia${b}`).val()) {
      errores.push(`Bloque ${b}: falta seleccionar tipo de mercancía.`);
      marcarError(`#tipo_mercancia${b}`);
    }

    if (!$(`#valor_mercancia${b}`).val()) {
      errores.push(`Bloque ${b}: valor declarado vacío.`);
      marcarError(`#valor_mercancia${b}`);
    }

    if (!$(`#servicio_cliente${b}`).val()) {
      errores.push(`Bloque ${b}: falta seleccionar el tipo servicio.`);
      marcarError(`#servicio_cliente${b}`);
    }

    if (!$(`#tipo_empaque${b}`).val()) {
      errores.push(`Bloque ${b}: falta seleccionar tipo empaque.`);
      marcarError(`#tipo_empaque${b}`);
    }

    if (!$(`#tipo${b}`).val()) {
      errores.push(`Bloque ${b}: falta seleccionar tipo de operación.`);
      marcarError(`#tipo${b}`);
    }

    if (!$(`#tipotr${b}`).val()) {
      errores.push(`Bloque ${b}: falta seleccionar tipo de transporte.`);
      marcarError(`#tipotr${b}`);
    }

    if (!$(`#origen_cliente${b}`).val()) {
      errores.push(`Bloque ${b}: falta seleccionar ORIGEN.`);
      marcarError(`#origen_cliente${b}`);
    }

    if (!$(`#destino_cliente${b}`).val()) {
      errores.push(`Bloque ${b}: falta seleccionar DESTINO.`);
      marcarError(`#destino_cliente${b}`);
    }

    if (!$(`#peso_client1${b}`).val()) {
      errores.push(`Bloque ${b}: peso bruto faltante.`);
      marcarError(`#peso_client1${b}`);
    }

    if (!$(`#${b}`).val()) {
      errores.push(`Bloque ${b}: peso neto faltante.`);
      marcarError(`#${b}`);
    }

    if (!$(`#cantidad${b}`).val()) {
      errores.push(`Bloque ${b}: cantidad faltante.`);
      marcarError(`#cantidad${b}`);
    }

    // if (!$(`#volumen_cliente${b}`).val()) {
    //   errores.push(`Bloque ${b}: volumen no calculado.`);
    //   marcarError(`#volumen_cliente${b}`);
    // }

    if (!$(`#flete${b}`).val() || $(`#flete${b}`).val() === '0') {
      errores.push(`Bloque ${b}: flete no diligenciada.`);
      marcarError(`#flete${b}`);
    }

    if (!$(`#totaltarifa_cliente${b}`).val() || $(`#totaltarifa_cliente${b}`).val() === '0') {
      errores.push(`Bloque ${b}: Tarifa no diligenciada.`);
      marcarError(`#totaltarifa_cliente${b}`);
    }
  }

  // ======================================================
  // VALIDAR REMITENTES Y DESTINATARIOS
  // ======================================================
  for (const bloque in remPorBloque) {
    const totalRem = remPorBloque[bloque];

    for (let r = 1; r <= totalRem; r++) {

      if (!$(`#clientea${bloque}_${r}`).val()) {
        errores.push(`Remitente ${bloque}_${r}: cliente no seleccionado.`);
        marcarError(`#clientea${bloque}_${r}`);
      }

      if (!$(`#dire${bloque}_${r}`).val()) {
        errores.push(`Remitente ${bloque}_${r}: dirección vacía.`);
        marcarError(`#dire${bloque}_${r}`);
      }

      if (!$(`#p_ciudad${bloque}_${r}`).val()) {
        errores.push(`Remitente ${bloque}_${r}: ciudad no seleccionada.`);
        marcarError(`#p_ciudad${bloque}_${r}`);
      }

      if (!$(`#telpunto${bloque}_${r}`).val()) {
        errores.push(`Remitente ${bloque}_${r}: teléfono vacío.`);
        marcarError(`#telpunto${bloque}_${r}`);
      }

      if (!$(`#fecha${bloque}_${r}`).val()) {
        errores.push(`Remitente ${bloque}_${r}: falta fecha.`);
        marcarError(`#fecha${bloque}_${r}`);
      }

      if (!$(`#hora${bloque}_${r}`).val()) {
        errores.push(`Remitente ${bloque}_${r}: falta hora.`);
        marcarError(`#hora${bloque}_${r}`);
      }

      if (!$(`#lugar${bloque}_${r}`).val()) {
        errores.push(`Remitente ${bloque}_${r}: falta lugar.`);
        marcarError(`#lugar${bloque}_${r}`);
      }

      const totalDest = destPorRemBloque[bloque]?.[r] || 0;

      for (let d = 1; d <= totalDest; d++) {
        let key = `${bloque}_${r}_${d}`;

        if (!$(`#clienteb${key}`).val()) {
          errores.push(`Destinatario ${key}: cliente vacío.`);
          marcarError(`#clienteb${key}`);
        }

        if (!$(`#direb${key}`).val()) {
          errores.push(`Destinatario ${key}: dirección vacía.`);
          marcarError(`#direb${key}`);
        }

        if (!$(`#p_ciudadb${key}`).val()) {
          errores.push(`Destinatario ${key}: ciudad no seleccionada.`);
          marcarError(`#p_ciudadb${key}`);
        }

        if (!$(`#lugarb${key}`).val()) {
          errores.push(`Destinatario ${key}: lugar vacío.`);
          marcarError(`#lugarb${key}`);
        }

        if (!$(`#fechab${key}`).val()) {
          errores.push(`Destinatario ${key}: fecha vacía.`);
          marcarError(`#fechab${key}`);
        }

        if (!$(`#horab${key}`).val()) {
          errores.push(`Destinatario ${key}: hora vacía.`);
          marcarError(`#horab${key}`);
        }

        if (!$(`#ordenb${key}`).val()) {
          errores.push(`Destinatario ${key}: orden vacía.`);
          marcarError(`#ordenb${key}`);
        }

        if (!$(`#pesob${key}`).val()) {
          errores.push(`Destinatario ${key}: peso vacío.`);
          marcarError(`#pesob${key}`);
        }
      }
    }
  }

  const erroresPeso = validarPesosBloque();
  errores.push(...erroresPeso);

  // ======================================================
  // REPORTAR RESULTADOS
  // ======================================================
  if (errores.length > 0) {
    Swal.fire({
      icon: "warning",
      title: "Validación incompleta",
      html: errores.join("<br>"),
      confirmButtonText: "OK"
    });
    return false;
  }

  Swal.fire({
    icon: "success",
    title: "Validación correcta",
    text: "Todos los campos obligatorios están completos."
  });

  return true;
}

function normalizarNumero(valor) {
  if (valor === undefined || valor === null) return 0;

  // Pasar a string, quitar espacios y comas de miles.
  // "18,000.00" -> "18000.00"
  const limpio = String(valor).trim().replace(/,/g, '');

  const n = parseFloat(limpio);
  return isNaN(n) ? 0 : n;
}

function validarPesosBloque() {
  let errores = [];
  const tolerancia = 0.01; // 10 gramos de margen, ajusta si quieres

  for (let b = 1; b <= cont; b++) {

    // Peso bruto del bloque (campo: peso_client1{b})
    const pesoBruto = normalizarNumero($(`#peso_client1${b}`).val());

    let sumaRem = 0;
    let sumaDest = 0;

    const totalRem = remPorBloque[b] || 0;

    // ===============================
    // Sumar REMITENTES y DESTINATARIOS
    // ===============================
    for (let r = 1; r <= totalRem; r++) {

      // Remitente peso{bloque}_{r}
      sumaRem += normalizarNumero($(`#peso${b}_${r}`).val());

      // Destinatarios de ese remitente
      const totalDest = destPorRemBloque[b]?.[r] || 0;
      for (let d = 1; d <= totalDest; d++) {
        sumaDest += normalizarNumero($(`#pesob${b}_${r}_${d}`).val());
      }
    }

    // ===============================
    // Validar REMITENTES
    // ===============================
    if (Math.abs(sumaRem - pesoBruto) > tolerancia) {
      errores.push(
        `Bloque ${b}: la suma de REMITENTES (${sumaRem}) no coincide con el peso bruto del bloque (${pesoBruto}).`
      );

      // marcar todos los pesos de remitente del bloque
      for (let r = 1; r <= totalRem; r++) {
        marcarError(`#peso${b}_${r}`);
      }
      marcarError(`#peso_client1${b}`);
    }

    // ===============================
    // Validar DESTINATARIOS
    // ===============================
    if (Math.abs(sumaDest - pesoBruto) > tolerancia) {
      errores.push(
        `Bloque ${b}: la suma de DESTINATARIOS (${sumaDest}) no coincide con el peso bruto del bloque (${pesoBruto}).`
      );

      const totalRem2 = remPorBloque[b] || 0;
      for (let r = 1; r <= totalRem2; r++) {
        const totalDest = destPorRemBloque[b]?.[r] || 0;
        for (let d = 1; d <= totalDest; d++) {
          marcarError(`#pesob${b}_${r}_${d}`);
        }
      }
      marcarError(`#peso_client1${b}`);
    }
  }

  return errores;
}

async function Inserta_Solicitud() {

  // if (!validateSolicitud()) {
  //   return;
  // }

  const id_cliente = $("#id_cliente_seleccionado").val();
  const id_empresa = $("#empresa_seleccionada_id").val();

  // ------------------------------------------
  //  BLOQUES MERCANCIA DINÁMICOS
  // ------------------------------------------

  let bloques_mercancia = [];

  for (let b = 1; b <= cont; b++) {

    let bloque = {
      bloque: b,
      itr: $(`#itr${b}`).val(),
      mercancia: $(`#tipo_mercancia${b}`).val(),
      naturaleza: $(`#natu${b}`).val(),
      valor: $(`#valor_mercancia${b}`).val().replace(/,/g, ""),
      servicio: $(`#servicio_cliente${b}`).val(),
      empaque: $(`#tipo_empaque${b}`).val(),
      operacion: $(`#tipo${b}`).val(),
      transporte: $(`#tipotr${b}`).val(),
      origen: $(`#origen_cliente${b}`).val(),
      destino: $(`#destino_cliente${b}`).val(),
      vehiculo_cliente: $(`#vehiculo_cliente${b}`).val(),
      peso_bruto: $(`#peso_client1${b}`).val().replace(/,/g, ""),
      peso_neto: $(`#${b}`).val().replace(/,/g, ""),
      peso_bruto_tn: $(`#pesobruto_cliente${b}`).val().replace(/,/g, ""),
      cantidad_unidades: $(`#cantidad${b}`).val(),
      alto: $(`#alto_cliente${b}`).val(),
      largo: $(`#largo_cliente${b}`).val(),
      ancho: $(`input[name='ancho${b}']`).val(),
      volumen: $(`#volumen_cliente${b}`).val(),
      costo_flete: $(`#flete${b}`).val().replace(/,/g, ""),
      tarifa: $(`#totaltarifa_cliente${b}`).val().replace(/,/g, ""),
      utilidad: $(`#utilidad${b}`).val(),
      rentabilidad: $(`.utilidad${b}`).val(),
      retabilidad_valor: $(`#renta${b}`).val().replace(/,/g, ""),
      observacion: $(`#observa${b}`).val(),
      idproducto: $(`#codmercancia${b}`).val(),
      parejaid: ''
    };

    bloques_mercancia.push(bloque);
  }

  // ------------------------------------------
  //  CONTENEDORES POR BLOQUE
  // ------------------------------------------

  let contenedores = [];

  for (let b = 1; b <= cont; b++) {

    const contenedorDiv = document.getElementById(`devolver_contenedor${b}`);

    // Si no existe o no está visible → NO enviar
    if (!contenedorDiv || contenedorDiv.style.display === 'none') {
      continue;
    }

    let contenedor = {
      bloque: b,
      devuelve_contenedor: $(`#cnt_opcion${b}`).val(),
      tipo_contenedor: $(`#cnt_tipocon${b}`).val(),
      numero_contenedor: $(`#cnt_num${b}`).val(),
      fecha_vencimiento: $(`#cnt_dias${b}`).val(),
      municipio_devolucion: $(`#cnt_municipio${b}`).val(),
      direccion_devolucion: $(`#cnt_direccion${b}`).val(),
      fecha_comodato: $(`#cnt_fcomodato${b}`).val(),
      peso_vacio: $(`#cnt_peso${b}`).val()
    };

    contenedores.push(contenedor);
  }

  // ------------------------------------------
  //  REMITENTES DINÁMICOS
  // ------------------------------------------

  let remitentes = [];

  for (const bloque in remPorBloque) {

    const totalRem = remPorBloque[bloque];

    for (let r = 1; r <= totalRem; r++) {

      let rem = {
        bloque: bloque,
        remitente: r,
        cliente: $(`#clientea${bloque}_${r}`).val(),
        ciudad: $(`#p_ciudad${bloque}_${r}`).val(),
        direccion: $(`#dire${bloque}_${r}`).val(),
        telefono: $(`#telpunto${bloque}_${r}`).val(),
        fecha: $(`#fecha${bloque}_${r}`).val(),
        hora: $(`#hora${bloque}_${r}`).val(),
        lugar: $(`#lugar${bloque}_${r}`).val(),
        peso: $(`#peso${bloque}_${r}`).val(),
        observacion: $(`#observa${bloque}_${r}`).val()
      };

      remitentes.push(rem);
    }
  }

  // ------------------------------------------
  //  DESTINATARIOS DINÁMICOS
  // ------------------------------------------

  let destinatarios = [];

  for (const bloque in destPorRemBloque) {

    for (const rem in destPorRemBloque[bloque]) {

      const totalDest = destPorRemBloque[bloque][rem];

      for (let d = 1; d <= totalDest; d++) {

        const key = `${bloque}_${rem}_${d}`;

        let dest = {
          bloque: bloque,
          remitente: rem,
          destinatario: d,
          cliente: $(`#clienteb${key}`).val(),
          ciudad: $(`#p_ciudadb${key}`).val(),
          direccion: $(`#direb${key}`).val(),
          telefono: $(`#telpuntob${key}`).val(),
          fecha: $(`#fechab${key}`).val(),
          hora: $(`#horab${key}`).val(),
          lugar: $(`#lugarb${key}`).val(),
          peso: $(`#pesob${key}`).val(),
          observacion: $(`#observdesb${key}`).val(),
          valor_tarifa_venta: $(`#valor_tarifa_venta${key}`).val()
        };

        destinatarios.push(dest);
      }
    }
  }

  var agencia = $('#agencia').val();
  var t = $('#group').val();
  var hocliente = $('#houremail').val();
  var observacion = $('#observacion').val();
  var totalcostof = $('#Tcosto_flete').val().replace(/,/g, '');
  var totalservi = $('#Tservicio_transporte').val().replace(/,/g, '');
  var totalutili = $('#Tutilidad').val().replace(/,/g, '');
  var totalrenta = $('#Trentabilidad').val().replace(/,/g, '');
  var totalcoti = $('#Ttotal_cotizacion').val().replace(/,/g, '');


  //Datos del cliente para la cotizacion
  var estado = 'F3';
  var estado_autorizado = 'autorizado';
  var nit_empresa = $('#nit_empresa').val();
  var digito_veri = $('#digito_verificacion').val();
  var direccion_cotizacion = $('#direccion_cliente').val();
  var name_cliente = $('#cargar_cliente').val();
  var cliente = $('#nombre_clientes').val();
  var telefono = $('#telefono_cliente').val();
  var procede_cliente = $('#procede_cliente').val();
  var observacion_general = $('.observacion_general').val();
  // var observacion = $('#observacion').val();
  var elaborado_por = $('#elaborado_por').val();
  var Nacional = $('#Nacional').is(':checked');
  var Internacional = $('#Internacional').is(':checked');
  var Almacenamiento = $('#Almacenamiento').is(':checked');
  var user_log = $('#elaborado_por').val();

  // ------------------------------------------
  //  FORM DATA PARA ENVIAR
  // ------------------------------------------

  let formData = new FormData();

  formData.append("cliente_id", id_cliente);
  formData.append("empresa_id", id_empresa);
  formData.append("estado", estado);
  formData.append("estado_autorizado", estado_autorizado);
  formData.append("nit_empresa", nit_empresa);
  formData.append("digito_veri", digito_veri);
  formData.append("direccion_cotizacion", direccion_cotizacion);
  formData.append("name_cliente", name_cliente);
  formData.append("cliente", cliente);
  formData.append("telefono", telefono);
  formData.append("procede_cliente", procede_cliente);
  formData.append("observacion_general", observacion_general);
  formData.append("elaborado_por", elaborado_por);
  formData.append("Nacional", Nacional);
  formData.append("Internacional", Internacional);
  formData.append("Almacenamiento", Almacenamiento);
  formData.append("user_log", user_log);

  formData.append("bloques", JSON.stringify(bloques_mercancia));
  formData.append("remitentes", JSON.stringify(remitentes));
  formData.append("destinatarios", JSON.stringify(destinatarios));
  formData.append("contenedores", JSON.stringify(contenedores));

  formData.append("agencia", agencia);
  formData.append("t", t);
  formData.append("hocliente", hocliente);
  formData.append("observacion", observacion);
  formData.append("totalcostof", totalcostof);
  formData.append("totalservi", totalservi);
  formData.append("totalutili", totalutili);
  formData.append("totalrenta", totalrenta);
  formData.append("totalcoti", totalcoti);

  // ------------------------------------------
  // ENVIAR AL BACKEND
  // ------------------------------------------

  try {
    const response = await fetch($('#base_url').val() + 'serviciocliente/CrearSolicitud', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      // Swal.fire("Registro exitoso", "Solicitud creada", "success");
      Swal.fire({
        title: "Registro exitoso!",
        text: "Solicitud creada.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        window.location.reload(true); // Recarga suave
      });
      // TODO: limpiar formulario
    } else {
      Swal.fire("Error", data.mensaje, "error");
    }

  } catch (e) {
    console.error(e);
    Swal.fire("Error", "No se pudo enviar la solicitud", "error");
  }
}

function manejarContenedorPorBloque(bloque, mostrar) {
  const contenedor = $(`#devolver_contenedor${bloque}`);

  const campos = [
    `#cnt_opcion${bloque}`,
    `#cnt_tipocon${bloque}`,
    `#cnt_num${bloque}`,
    `#cnt_dias${bloque}`,
    `#cnt_municipio${bloque}`,
    `#cnt_direccion${bloque}`,
    `#cnt_fcomodato${bloque}`,
    `#cnt_peso${bloque}`
  ];

  if (mostrar) {
    contenedor.show();
    campos.forEach(id => $(id).prop('disabled', false));

    // Tipos de contenedor
    $(`#cnt_tipocon${bloque}`).html('<option value="">Seleccione</option>');
    $.post(
      $('#base_url').val() + 'serviciocliente/Consultar_Contenedor',
      {},
      function (data) {
        data.forEach(el => {
          $(`#cnt_tipocon${bloque}`).append(
            `<option value="${el.id}">${el.nombre}</option>`
          );
        });
      },
      'json'
    );

    // Municipios
    $(`#cnt_municipio${bloque}`).html('<option value="">Seleccione</option>');
    $.post(
      $('#base_url').val() + 'serviciocliente/Consultar_Municipios',
      {},
      function (data) {
        data.forEach(el => {
          $(`#cnt_municipio${bloque}`).append(
            `<option value="${el.id}">${el.municipio} - ${el.depto}</option>`
          );
        });
      },
      'json'
    );

  } else {
    contenedor.hide();
    campos.forEach(id => $(id).prop('disabled', true));
  }
}

function Validar_operacion_itr(bloqueId) {

  const itrSelect = document.getElementById(`itr${bloqueId}`);
  const tipotr = document.getElementById(`tipotr${bloqueId}`);
  const servicio = document.getElementById(`servicio_cliente${bloqueId}`);

  const esITR = itrSelect.value === 'Si';

  // =========================
  // TIPO TRANSPORTE
  // =========================
  if (esITR) {
    tipotr.value = 'Urbano';

    [...tipotr.options].forEach(opt => {
      opt.disabled = opt.value !== 'Urbano';
    });
  } else {
    tipotr.value = '';

    [...tipotr.options].forEach(opt => {
      opt.disabled = false;
    });
  }

  // =========================
  // TIPO SERVICIO
  // =========================
  if (esITR) {
    servicio.value = 'Expreso';

    [...servicio.options].forEach(opt => {
      opt.disabled = opt.value !== 'Expreso';
    });
  } else {
    servicio.value = '';

    [...servicio.options].forEach(opt => {
      opt.disabled = false;
    });
  }

}

function validarITRPorBloques() {

  for (let b = 1; b <= cont; b++) {

    const itr = $(`#itr${b}`).val();
    const tipotr = $(`#tipotr${b}`).val();
    const servicio = $(`#servicio_cliente${b}`).val();
    const origen = $(`#origen_cliente${b}`).val();
    const destino = $(`#destino_cliente${b}`).val();

    // =========================
    // SOLO APLICA SI ES ITR
    // =========================
    if (itr === 'Si') {

      // -------------------------
      // 1. VALIDAR TIPO TRANSPORTE
      // -------------------------
      if (tipotr !== 'Urbano') {
        Swal.fire("Error",
          `Bloque ${b}: Si es ITR, el tipo transporte debe ser Urbano`,
          "error"
        );
        return false;
      }

      // -------------------------
      // 2. VALIDAR TIPO SERVICIO
      // -------------------------
      if (servicio !== 'Expreso') {
        Swal.fire("Error",
          `Bloque ${b}: Si es ITR, el tipo servicio debe ser Expreso`,
          "error"
        );
        return false;
      }

      // -------------------------
      // 3. ORIGEN = DESTINO
      // -------------------------
      if (!origen || !destino || origen !== destino) {
        Swal.fire("Error",
          `Bloque ${b}: En servicios ITR, el origen y el destino deben ser el mismo`,
          "error"
        );
        return false;
      }

      // -------------------------
      // 4. VALIDAR REMITENTE ≠ DESTINATARIO (MISMA DIRECCIÓN)
      // -------------------------

      const totalRem = remPorBloque[b] || 0;

      for (let r = 1; r <= totalRem; r++) {

        const remDireccion = $(`#dire${b}_${r}`).val()?.trim();

        const totalDest = destPorRemBloque[b]?.[r] || 0;

        for (let d = 1; d <= totalDest; d++) {

          const key = `${b}_${r}_${d}`;
          const destDireccion = $(`#direb${key}`).val()?.trim();

          if (
            remDireccion &&
            destDireccion &&
            remDireccion.toLowerCase() === destDireccion.toLowerCase()
          ) {
            Swal.fire(
              "Error",
              `Bloque ${b}: En servicios ITR el remitente y el destinatario no pueden tener la misma dirección`,
              "error"
            );
            return false;
          }
        }
      }

    }
  }

  return true;
}

function validarRNDCPorBloque() {

  let msg_error = '';
  let valido = true;

  $('.bloque_mercancia').each(function () {

    const bloque = $(this).data('bloque');

    /* ============================
       VALIDAR DESTINATARIO (dlestado)
       ============================ */
    $(this).find('.dlestado').each(function () {
      const estado = $(this).val();

      if (estado === '0' || estado === 0 || estado === '') {
        msg_error += `
          <p>
            ❌ Bloque <strong>#${bloque}</strong> :
            Por favor transmitir el <strong>Destinatario</strong>
          </p>`;
        valido = false;
      }
    });

    /* ============================
       VALIDAR REMITENTE (est_upgrade)
       ============================ */
    $(this).find('.est_upgrade').each(function () {
      const estado = $(this).val();

      if (estado === '0' || estado === 0 || estado === '') {
        msg_error += `
          <p>
            ❌ Bloque <strong>#${bloque}</strong> :
            Por favor transmitir el <strong>Remitente</strong>
          </p>`;
        valido = false;
      }
    });

  });

  if (!valido) {
    Swal.fire({
      icon: 'warning',
      title: 'Validación RNDC',
      html: msg_error,
      confirmButtonText: 'OK'
    });
  }

  return valido;
}

// function reiniciarBloquesMercancia() {
//   cont = 0;
//   contador_global1 = 0;
//   contador_global2 = 0;

//   remPorBloque = {};
//   destPorRemBloque = {};

//   // Limpia el HTML
//   $('#table_mercancia').html('');

//   console.log('Bloques reiniciados');
// }

function resetMercancias() {
  cont = 0;
  contador_global1 = 0;
  contador_global2 = 0;

  usuarioPresionoAgregar = false; // 👈 REINICIO CLAVE

  remPorBloque = {};
  destPorRemBloque = {};

  $('#table_mercancia').html('');
}

function calcularTarifaDestinatario(bloque_id, rem_id, dest_id) {

  const id_prefix = `${bloque_id}_${rem_id}_${dest_id}`;

  // ===== Obtener valores base =====
  const totalViaje = parseFloat(
    ($('#totaltarifa_cliente' + bloque_id).val() || '0').toString().replace(/,/g, '')) || 0;

  const pesoBrutoTotal = parseFloat(
    ($('#peso_client1' + bloque_id).val() || '0').toString().replace(/,/g, '')) || 0;

  const pesoDestinatario = parseFloat(
    ($('#pesob' + id_prefix).val() || '0').toString().replace(/,/g, '')) || 0;

  // ===== Validaciones =====
  if (totalViaje <= 0 || pesoBrutoTotal <= 0 || pesoDestinatario <= 0) {
    $('#valor_tarifa_venta' + id_prefix).val('0.00');
    return;
  }

  // ===== Fórmula =====
  const tarifaPorKg = totalViaje / pesoBrutoTotal;
  const tarifaDestinatario = tarifaPorKg * pesoDestinatario;

  // ===== Asignar resultado =====
  $('#valor_tarifa_venta' + id_prefix).val(
    tarifaDestinatario
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}

function recalcularTarifasDestinatariosPorBloque(bloque_id) {

  // 🔒 Buscar destinatarios existentes del bloque
  const $destinatarios = $(`.destinatario_contenido[data-bloque="${bloque_id}"]`);

  // ❗ Si no hay destinatarios, NO hacer nada
  if (!$destinatarios.length) {
    return;
  }

  // 🔁 Recorrer cada destinatario existente
  $destinatarios.each(function () {
    const rem_id = $(this).data('rem');
    const dest_id = $(this).data('dest');

    calcularTarifaDestinatario(bloque_id, rem_id, dest_id);
  });
}

// 👉 MISMA FUNCIÓN, SIN FORMATEAR EL INPUT
function utilidad_sin_formato(elem, id, max) {

  var cont = contador_global1;

  // ❌ NO formatear aquí
  var valor = ($('#totaltarifa_cliente' + id).val() || '0').replace(/,/g, '');

  // ===== TU LÓGICA ORIGINAL =====
  var calculo, resta, util, res;
  var f = ($('#flete' + id).val() || '0').replace(/,/g, '');

  resta = parseFloat(valor) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(valor || 1);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);

  $('.utilidad' + id).val(res);

  // RENTABILIDAD
  var rent = parseFloat(valor) - parseFloat(f);
  $('#renta' + id).val(rent);

  // ❌ NO maquetar totales aquí
}
