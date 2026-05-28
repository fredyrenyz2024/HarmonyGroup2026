window.VENTANA = null;

window.initScript = function (id) {
  window.VENTANA = id; // Asigna el ID de la ventana a la variable global
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

  /* Variables del filtro */
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];

  var tipo = 2;
  var dato = "";
  var fecha_inicial = $(`#campo-${id}-fecha_inicial`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_inicial`).val();
  var fecha_final = $(`#campo-${id}-fecha_final`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_final`).val();
  var cliente = $(`#campo-${id}-clientes`).length > 0 ? $(`#campo-${id}-clientes`).val() : "";
  var empresa = $(`#campo-${id}-empresas`).length > 0 ? $(`#campo-${id}-empresas`).val() : "";
  var comercial = $(`#campo-${id}-comerciales`).length > 0 ? $(`#campo-${id}-comerciales`).val() : "";
  var estado = "Todas";

  if (id == 1) {
    tipo = 2;
    dato = "";
    fecha_inicial = $(`#campo-${id}-fecha_inicial`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_inicial`).val();
    fecha_final = $(`#campo-${id}-fecha_final`).val() === undefined ? fechaHoy : $(`#campo-${id}-fecha_final`).val();
    cliente = $(`#campo-${id}-clientes`).length > 0 ? $(`#campo-${id}-clientes`).val() : "";
    empresa = $(`#campo-${id}-empresas`).length > 0 ? $(`#campo-${id}-empresas`).val() : "";
    comercial = $(`#campo-${id}-comerciales`).val() === '' ? "" : $(`#campo-${id}-comerciales`).val();
    estado = "Todas";
    listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id, comercial);
    // estado = "Todas";
    // listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);

    /************************** Funcion para buscar Cotizaciones ******************************/
    document.addEventListener("click", async e => {
      if (e.target.matches(`#campo-${id}-buscar`) || e.target.matches(`#campo-${id}-buscar *`)) {
        tipo = 2;
        fecha_inicial = $(`#campo-${id}-fecha_inicial`).val();
        fecha_final = $(`#campo-${id}-fecha_final`).val();
        cliente = $(`#campo-${id}-clientes`).val() === "" ? "" : $(`#campo-${id}-clientes`).val();
        empresa = $(`#campo-${id}-empresas`).val() === '' ? "" : $(`#campo-${id}-empresas`).val();
        comercial = $(`#campo-${id}-comerciales`).val() === '' ? "" : $(`#campo-${id}-comerciales`).val();
        estado = "Todas";
        listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id, comercial);
      }

      if (e.target.matches("#btn_ver_solicitud") || e.target.matches("#btn_ver_solicitud *")) {
        // let padre = e.target.parentElement.parentElement;
        // Obtener el enlace (el elemento con el data-id)
        let enlace = e.target.closest('#btn_ver_solicitud');
        // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id');
        let dataId2 = enlace.getAttribute('data-id2');
        let dataId3 = enlace.getAttribute('data-id3');
        let dataId4 = enlace.getAttribute('data-id4');
        let dataId5 = enlace.getAttribute('data-id5'); // Cliente
        Municipios();
        Mercancias();
        tipo_empaque();
        var horahoy = moment().format('HH:mm:ss');


        // Select cliente y hidden para nombre
        var cliente_select = `<select id='clientea' class='form-select form-select-sm re_cliente' onchange='Cambia_Remitente()'></select>
                        <input type='hidden' class='form-control input-xs re_nombre' id='re_namecli'>`;

        var city = `
              <select id='p_ciudad' class='form-select form-select-sm re_ciudad'>
                <option value="" readonly="readonly">Seleccione</option>
             </select>`;

        /* Titulo del offcanva */
        myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Datos solicitud de servicio`);

        myOffcanvas.updateContent(`
            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
              <div class="row">
                <div class="d-flex justify-content-end" id="check_prioridad">
                  <div class="form-check form-switch">
                    <input class="form-check-input" id="flexSwitchCheckChecked" type="checkbox" />
                    <label class="form-check-label" for="flexSwitchCheckChecked">Prioritaria</label>
                  </div>
                </div>

                <div id="msg_ver"></div><!-- id para manejar los mensajes de errordel popup -->
                <div id="content_ver">

                  <div class="d-flex flex-wrap justify-content-start mt-2">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                      <h6 class="mb-0 text-body-highlight me-2">Cliente</h6>
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <div id="cuerpo_cliente"><!-- Datos desde Javascript --></div>

                  <div class="d-flex flex-wrap justify-content-start mt-2">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                      <h6 class="mb-0 text-body-highlight me-2">Mercancia</h6>
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <ul class="nav nav-underline fs-9" role="tablist" id="bloques_mercancias_menu" style="--phoenix-nav-link-padding-x: rem !important;">
                      <!-- Bloques de mercancia -->
                    </ul>

                    <div class="tab-content mt-1" id="detalle_mercancias">
                      <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                    </div>

                    <!-- servicios especiales -->
                    <ul class="nav nav-underline fs-9" role="tablist" id="bloques_servicios_especiales_menu" style="--phoenix-nav-link-padding-x: rem !important;">
                      <!-- Bloques de servicio especial -->
                    </ul>

                    <div class="tab-content mt-1" id="detalle_servicios_especiales">
                      <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                    </div>
                  </div>

                  <div class="d-flex flex-wrap justify-content-start mt-2">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                      <h6 class="mb-0 text-body-highlight me-2">Costos de servicio</h6>
                    </div>
                  </div>

                  <hr class="my-1 text-dark">
                  <div id="costos"><!-- Contenido desde Javascript --></div>
                  <hr class="my-1 text-dark">
                  <div id="costos1"></div>
                  <hr class="my-1 text-dark">
                  <!-- Total del servicio -->
                  <div id="totcotiza"></div>

                  <div id="Mensaje_update"></div>

                  <div class="d-flex flex-wrap justify-content-start mt-2">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                      <h6 class="mb-0 text-body-highlight me-2">Remitentes y Destinatarios</h6>
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <!-- Remitentes -->
                  <div class="d-flex flex-wrap justify-content-start mt-2">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                      <h6 class="mb-0 text-body-highlight me-2">Remitente(s)</h6>
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <ul class="nav nav-underline fs-9" role="tablist" id="bloques_punto_remitente" style="--phoenix-nav-link-padding-x: rem !important;">
                      <!-- Bloques de remitentes -->
                    </ul>

                    <div class="tab-content" id="detalle_puntos_remitentes">
                      <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <!-- Destinatarios -->
                  <div class="d-flex flex-wrap justify-content-start mt-2">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                      <h6 class="mb-0 text-body-highlight me-2">Destinatario(s)</h6>
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <ul class="nav nav-underline fs-9" role="tablist" id="bloques_punto_destinatario" style="--phoenix-nav-link-padding-x: rem !important;">
                      <!-- Bloques de destinatarios -->
                    </ul>

                    <div class="tab-content" id="detalle_puntos_destinatarios">
                      <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <!-- Referenias para la facturacion -->
                  <div class="row">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                      <!-- Listar la referencias por cada destinatario de la oslicyud d servicio -->
                      <ul class="nav nav-underline fs-9" role="tablist" id="bloques_referencias_menu" style="--phoenix-nav-link-padding-x: rem !important;">
                        <!-- Bloques de mercancia -->
                      </ul>

                      <div class="tab-content mt-1" id="detalle_referencias">
                        <!-- Cargar tabla para seleccionar los remitentes seun su cantidad -->
                      </div>
                    </div>
                  </div>

                  <hr class="my-1 text-dark">
                  <div class="d-flex flex-wrap justify-content-start mt-2">
                    <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                      <h6 class="mb-0 text-body-highlight me-2">Datos Adicionales</h6>
                    </div>
                  </div>
                  <hr class="my-1 text-dark">

                  <div class="accordion" id="accordionExample">
                    <div class="accordion-item border-top p-1">
                      <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                          Editar Tipo Operacion y Agencia
                        </button>
                      </h2>
                      <div class="accordion-collapse collapse" id="collapseOne" aria-labelledby="headingOne" data-bs-parent="#accordionExample" style="">
                        <div class="accordion-body pt-0">
                          <div class="row" id="Datos_adicionales">
                            <div class="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
                              <div class="mb-1">
                                <label style="font-size: 12px;">Agencias</label>
                                <select id="servicio_agencia" style="width: 100%;" class="ts form-select form-select-sm" ${dataId4 === 'Aprobado' ? 'disabled' : ''}>
                                  <option value="" selected>Seleccione</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
                              <div class="mb-1">
                                <label style="font-size: 12px;">Tipo Servicio</label>
                                <select id="servicio_cliente" style="width: 100%;" class="ts form-select form-select-sm" ${dataId4 === 'Aprobado' ? 'disabled' : ''}>
                                  <option value="" selected>Seleccione</option>
                                  <option value="Expreso">Expreso - Viaje</option>
                                  <option value="Consolidado">Consolidado - Tonelada</option>
                                </select>
                              </div>
                            </div>
                            <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2" style="display:${dataId4 === 'Aprobado' ? 'none' : ''}">
                              <div class="mb-1 pt-5 d-flex justify-content-end">
                                <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_update_agencia_solicitud" data-ContizacionId="${dataId}" data-SolicitudId="${dataId2}"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                              </div>
                            </div>
                            <input type="hidden" name="numero_cotizacion" id="numero_cotizacion">
                            <input type="hidden" name="numero_solicitud" id="numero_solicitud">
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item p-1">
                      <h2 class="accordion-header" id="headingTwo">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                          Editar datos de mercancia
                        </button>
                      </h2>
                      <div class="accordion-collapse collapse" id="collapseTwo" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                        <div class="accordion-body pt-0">
                        <!-- Inicio Row -->
                            <div class="row">
                              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Servicio ITR</label>
                                  <select id="itr" style="width: 100%;color:#000;" class="form-select form-select-sm itr">
                                    <option value="" readonly="readonly">Seleccione</option>
                                    <option value="Si">Si</option>
                                    <option value="No" selected>No</option>
                                  </select>
                                </div>
                              </div>

                              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Mercancía</label>
                                  <select id="tipo_mercancia" class="tmerca form-select form-select-sm select2-sm" style="width: 100%;" data-choices="data-choices" data-options='{"removeItemButton":true,"placeholder":true}'>
                                    <option value="" selected>Seleccione</option>
                                  </select>
                                  <input type="hidden" class="form-control idproducto" id="codmercancia" readonly="readonly">
                                  <input type="hidden" class="form-control rndcproducto" id="rndcmercancia" readonly="readonly">
                                </div>
                              </div>

                              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Tipo Empaque</label>
                                  <select style="width: 100%;" id="tipo_empaque" class="form-select form-select-sm select2-sm empaquemer">
                                    <option value="" selected>Seleccione</option>
                                  </select>
                                </div>
                              </div>

                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Origen</label>
                                  <select id="origen_cliente" class="form-select form-select-sm select2-sm originario" style="width: 100%;">
                                    <option value="" selected>Seleccione</option>
                                  </select>
                                </div>
                              </div>

                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Destino</label>
                                  <select id="destino_cliente" class="form-select form-select-sm destinar select2-sm" style="width: 100%;">
                                    <option value="" selected>Seleccione</option>
                                  </select>
                                </div>
                              </div>

                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Peso bruto (kg)</label>
                                  <input type='text' id='npbruto' class='form-control form-control-sm' onChange="javascript:cambio_valor(this);">
                                </div>
                              </div>

                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Peso neto (kg)</label>
                                  <input type='text' id='epesone' class='form-control form-control-sm'>
                                </div>
                              </div>

                              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Peso Bruto (Tn)</label>
                                  <input type='text' id='pesobruto_cliente' class='form-control form-control-sm' disabled>
                                </div>
                              </div>

                              <!-- Costo Flete -->
                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Costo Flete</label>
                                  <input type="text" id="flete" class="form-control form-control-sm fletemer" min="0" style="width:100%;" onChange="javascript:utilidad_d()">
                                </div>
                              </div>

                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Tarifa venta</label>
                                  <input type="text" id="totaltarifa_cliente" class="form-control form-control-sm tarifamer" min="0" style="width:100%;" onChange="javascript:utilidad();">
                                </div>
                              </div>

                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Rentabilidad %</label>
                                  <input type="text" id="rentabilidad" class="form-control form-control-sm utilidad utilmer" min="0" style="width:100%;" disabled>
                                </div>
                              </div>

                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Utilidad</label>
                                  <input type="text" id="renta" class="form-control form-control-sm rentamer" style="width:100%;" disabled>
                                </div>
                              </div>

                              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Observación</label>
                                  <textarea id="observa" class="form-control form-control-sm observamer" style="width:100%;" rows="1"></textarea> <input type="hidden" class="identi" value="1" style="width:100%;">
                                </div>
                              </div>

                              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                              <hr class="text-dark">
                                <div class="d-flex flex-wrap justify-content-start mt-3">
                                  <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                    <h6 class="mb-0 text-body-highlight me-2"> Costo Servicios Mercancía</h6>
                                  </div>
                                </div>
                                <hr class="text-dark">
                              </div>

                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Valor total costo servicio</label>
                                  <input type="text" id="Tcosto_flete" disabled class="form-control form-control-sm">
                                </div>
                              </div>
                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Valor total tarifa venta</label>
                                  <input type="text" id="Tservicio_transporte" disabled class="form-control form-control-sm">
                                </div>
                              </div>
                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Valor total Rentabilidad %</label>
                                  <input type="text" id="Tutilidad" disabled class="form-control form-control-sm">
                                </div>
                              </div>
                              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                                <div class="mb-1">
                                  <label style="font-size: 12px;">Valor total utilidad</label>
                                  <input type="text" id="Trentabilidad" disabled class="form-control form-control-sm">
                                </div>
                              </div>

                              <div class="d-flex justify-content-end my-2">
                                <button class="btn btn-subtle-success btn-sm me-1 px-1 py-1" type="submit" id="btn_guardar_datos_mercancia" data-ContizacionId="${dataId}" data-SolicitudId="${dataId2}"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                              </div>
                            </div>
                            <!-- Fin Row -->
                        </div>
                      </div>
                    </div>

                    <div class="accordion-item p-1">
                      <h2 class="accordion-header" id="headingThree">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                          Grupo contactos y remitentes - destinatarios
                        </button>
                      </h2>
                      <div class="accordion-collapse collapse" id="collapseThree" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                        <div class="accordion-body pt-0">

                            <div class="row">
                                <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                  <div class="mb-1">
                                    <label style="font-size: 12px;">Grupo&nbsp;<span style="color:red;"><i>(*)</i></label>
                                    <select class="form-select form-select-sm mb-3 select2" aria-label="category" style="width:100%;" id="group" name="group[]" multiple="multiple"></select>
                                  </div>
                                </div>

                                <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                  <div class="mb-1">
                                    <label style="font-size: 12px;">Hora Envio email</label>
                                    <select class="form-select form-select-sm mb-3 select2" aria-label="category" style="width:100%;" id="houremail" name"houremail[]" multiple="multiple"></select>
                                  </div>
                                </div>

                            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                              <div class="d-flex flex-wrap justify-content-start mt-3">
                                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                  <h6 class="mb-0 text-body-highlight me-2"> Remitentes</h6>
                                </div>
                              </div>
                              <hr class="my-0 text-dark">
                            </div>

                            <div class="col">
                              <table class="table table-sm table-bordered  text-center" style="font-size:12px;">
                                  <thead>
                                    <tr class="">
                                      <th class="">Remitente
                                        <input type="hidden" id="destinatario" class="desti_remit ">
                                      </th>
                                      <th class="">Dirección</th>
                                      <th class="">Ciudad</th>
                                    </tr>
                                    <tr class="">
                                      <td>
                                        ${cliente_select}
                                        <input type="hidden" id="estado_upgrade" class="form-control input-xs est_upgrade">
                                        <input type="hidden" class="form-control input-xs rlname" id="rlname">
                                      </td>
                                      <td>
                                        <!--<button id="btnmascara_direccion" class="btn-xs btn-success mdi mdi-home class=" " tittle="Generar dirección" onclick="mascara_dire();"></button>-->
                                        <input type="text" id="dire" class="form-control form-control-sm re_dire" style=" height:14px; font-size:90%;" readonly="readonly">
                                        <input type="hidden" class="form-control input-xs rldire" id="rldire">
                                      </td>
                                      <td class="">${city}</td>
                                    </tr>

                                    <tr class="">
                                      <th class="">Teléfono</th>
                                      <th class="">Observación</th>
                                      <th>Peso Neto(Kg)</th>
                                    </tr>

                                    <tr class="">
                                      <td class="">
                                        <input type="number" id="telpunto" class="form-control form-control-sm re_telefono" min="0">
                                        <input type="hidden" id="rltel" class="form-control input-xs rltel">
                                      </td>
                                      <td class="">
                                        <textarea id="observa" class="form-control form-control-sm" rows="1"></textarea>
                                      </td>
                                      <td class="">
                                        <input type="number" id="peso" class="form-control form-control-sm re_peso">
                                      </td>
                                    </tr>

                                    <tr class="">
                                      <th class="">Fecha</th>
                                      <th class="">Hora</th>
                                      <th class="">Lugar</th>
                                    </tr>

                                    <tr class="">
                                      <td>
                                        <input type="date" id="fecha" class="form-control form-control-sm re_fecha">
                                      </td>
                                      <td class="">
                                        <input type="time" id="hora" class="form-control form-control-sm re_hora" value="${horahoy}">
                                      </td>
                                      <td class="">
                                        <input type="text" id="lugar" class="form-control form-control-sm re_lugar">
                                        <input type="hidden" id="id_puntorem" class="input_xs id_punto" value="">
                                      </td>
                                    </tr>
                                  </thead>
                                </table>
                            </div>
                            
                            <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                              <div class="d-flex flex-wrap justify-content-start mt-3">
                                <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                                  <h6 class="mb-0 text-body-highlight me-2"> Destinatarios</h6>
                                </div>
                              </div>
                              <hr class="my-0 text-dark">
                            </div>

                            <div class="col">
                              <table class="table table-bordered table-sm insercion_destina text-center" style="font-size:12px;">
                                <thead>
                                  <tr>
                                    <th>Destinatario</th>
                                    <th>Dirección
                                      <!--<boton id="btnmascara_direccionb" class="btn-xs btn-success mdi mdi-home" tooltip="top"
                                        tittle="Genera dirección" onclick="mascara_direb();"></boton>-->
                                    </th>
                                    <th>Ciudad</th>
                                  </tr>
                                  <tr>
                                    <td>
                                    <select id='clienteb' class='form-select form-select-sm de_cliente' onchange='Cambia_Destinatario()'></select>
                                      <input type='hidden' id='de_nombre' class='form-select form-select-sm de_nombre'>
                                      <input type="hidden" class="form-control form-control-sm dlname" id="dlname">
                                      <input type="hidden" class="form-control form-control-sm dlestado" id="dlestado">
                                    </td>
                                    <td>
                                      <input type="text" id="direb" class="form-control form-control-sm de_dire" readonly="readonly">
                                      <input type="hidden" class="form-control form-control-sm dldire" id="dldire">
                                    </td>
                                    <td>
                                    <select id='p_ciudadb' class='form-select form-select-sm de_ciudad'>
                                      <option value="" readonly="readonly">Seleccione</option>
                                    </select>
                                    </td>
                                  </tr>
                        
                                  <tr>
                                    <th>Teléfono</th>
                                    <th>Lugar</th>
                                    <th>Fecha entrega</th>
                                  </tr>
                        
                                  <tr>
                                    <td>
                                      <input type="text" id="telpuntob" class="form-control form-control-sm tel_dire" pattern="[0-9]{8,10}"
                                        maxlength="10">
                                      <input type="hidden" class="form-control form-control-sm dltel" id="dltel">
                                    </td>
                                    <td>
                                      <input type="text" id="lugarb" class="form-control form-control-sm de_lugar">
                                    </td>
                                    <td>
                                      <input type="date" id="fechab" class="form-control form-control-sm de_fecha">
                                    </td>
                                  </tr>
                                  <tr>
                                    <th>Hora entrega</th>
                                    <th>Peso Neto(kg)</th>
                                    <th>Orden</th>
                                  </tr>
                                  <!-- <tr></tr> -->
                                  <tr>
                                    <td>
                                      <input type="time" id="horab" class="form-control form-control-sm de_hora" value="${horahoy}">
                                    </td>
                                    <td>
                                      <input type="number" id="pesob" class="form-control form-control-sm de_peso">
                                    </td>
                                    <td>
                                      <input type="text" id="ordenb" class="form-control form-control-sm de_orden" value="1"
                                        readonly="readonly">
                                      <input type="hidden" class="bg-light form-control form-control-sm idrem_d" readonly="readonly" value="">
                                    </td>
                                  </tr>
                                  <!-- </td> -->
                        
                                  <!-- <tr>
                                    <th colspan="3">Observación</th>
                                  </tr>
                                  <tr> -->
                                  <tr>
                                    <td colspan="3">
                                      <input type="text" id="observdesb" class="form-control form-control-sm de_obser"
                                        placeholder="Observación del cliente">
                                  </tr>
                                </thead>
                              </table>
                            </div>

                                <div class="d-flex justify-content-end my-2">
                                  <button class="btn btn-subtle-success btn-sm me-1 px-1 py-1" type="submit" id="btn_actualizar_contacto_cliente" data-ContizacionId="${dataId}" data-SolicitudId="${dataId2}"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                                </div>
                            </div>

                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row" id="Datos_adicionales_operaciones" style="display: none;">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                      <div class="d-flex justify-content-center mb-2">
                        <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Información Restringida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>
                      </div>
                    </div>
                  </div>

                  <hr class="my-1 text-dark">

                  <!-- Datos para el contenedor  -->
                  <div class="row" id="Contenedor">
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-1">
                        <label style="font-size: 12px;">Numero Contenedor</label>
                        <input type="text" id="numero_contenedor" name="numero_contenedor" class="form-control form-control-sm text-dark fs-10" oninput="this.value = this.value.toUpperCase();">
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-1 pt-4">
                        <div class="form-check form-switch">
                          <input class="form-check-input" id="agrupable" type="checkbox">
                          <label class="form-check-label" for="agrupable">Agrupable</label>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                      <div class="mb-1 pt-5 d-flex justify-content-end">
                        <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_contenedor"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                      </div>
                    </div>
                  </div>

                  <div class="row" id="Contenedor_operaciones" style="display: none;">
                    <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                      <div class="d-flex justify-content-center mb-2">
                        <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Información Restringida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>
                      </div>
                    </div>
                  </div>

                  <hr class="my-1 text-dark">

                  <!-- Costos Adicionales -->
                  <div id="cuerpo_adicional"></div>
                </div>
              </div>
            </div>
        `);

        myOffcanvas.updateWidth('70%');
        myOffcanvas.show();
        Visualizar(dataId, dataId2, dataId3, dataId5);
      }

      if (e.target.matches("#btn-solicitar-prioridad") || e.target.matches("#btn-solicitar-prioridad *")) {
        // Obtener el enlace (el elemento con el data-id)
        let enlace = e.target.closest('#btn-solicitar-prioridad');
        // // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id');
        let dataId2 = enlace.getAttribute('data-id2');
        // let dataId3 = enlace.getAttribute('data-id3');

        /* Titulo del offcanva */
        myOffcanvas.updateTitle(`<span class="text-danger uil uil-bell"></span> Solicitar prioridad de solicitud de servicio`);

        myOffcanvas.updateContent(`
          <div class="d-flex justify-content-center">
            <h4>Solicitud de servicio: ${dataId2}</h4>
          </div>
          <hr class="my-1 text-dark">
        <!--<div class="container-fluid"> </div>-->
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div class="row">
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-1">
                  <label style="font-size: 12px;">Nivel Prioridad</label>
                    <select id="nivel_prioridad" style="width: 100%;" class="ts form-select form-select-sm">
                      <option value="" selected>Seleccione</option>
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                </div>
              </div>

              <!--Observacion o motivo de la prioridad-->
              <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                <div class="mb-1">
                  <label style="font-size: 12px;">Nivel Prioridad</label>
                    <select id="motivo_prioridad" style="width: 100%;" class="ts form-select form-select-sm">
                      <option value="" selected>Seleccione</option>
                      <option value="Cumplimiento de contrato">Cumplimiento de contrato</option>
                      <option value="Vehiculo debe estar cargado hoy">Vehiculo debe estar cargado hoy</option>
                      <option value="Varios viajes con el cliente">Varios viajes con el cliente</option>
                    </select>
                </div>
              </div>

              <!--<hr class="my-1 text-dark">-->

              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="mb-1 pt-5 d-flex justify-content-end">
                  <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_propuesta" data-NumdocSolicitud="${dataId2}"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar Prioridad</button>
                </div>
              </div>

            </div>
          </div>
        `);
        myOffcanvas.show();
      }

      if (e.target.matches("#btn_save_propuesta") || e.target.matches("#btn_save_propuesta *")) {
        let enlace = e.target.closest('#btn_save_propuesta');
        // // Obtener el valor del atributo data-id
        let Numdoc_solicitud = enlace.getAttribute('data-NumdocSolicitud');
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: '¿Quieres cambiar el estado?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, cambiar',
          cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
          /*  */// Aplica el cambio solo si se confirma
          datos = new FormData();
          datos.append('estado', "Propuesta");
          datos.append('numdoc_solicitud', Numdoc_solicitud);
          datos.append('nivel_prioridad', document.getElementById('nivel_prioridad').value);
          datos.append('motivo_prioridad', document.getElementById('motivo_prioridad').value);

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
              tipo = 2;
              fecha_inicial = $(`#campo-${id}-fecha_inicial`).val();
              fecha_final = $(`#campo-${id}-fecha_final`).val();
              cliente = $(`#campo-${id}-clientes`).val() === "" ? "" : $(`#campo-${id}-clientes`).val();
              empresa = $(`#campo-${id}-empresas`).val() === '' ? "" : $(`#campo-${id}-empresas`).val();
              estado = "Todas";
              listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
              myOffcanvas.hide();
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
          // Revierte el cambio si se cancela
        }
      }

      /* Aprobar tarifa subasta */
      if (e.target.matches("#btn-aprobar-tarifa-subasta") || e.target.matches("#btn-aprobar-tarifa-subasta *")) {
        // Obtener el valor del atributo data-id
        let enlace = e.target.closest('#btn-aprobar-tarifa-subasta');
        let dataId = enlace.getAttribute('data-id');
        myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Verificar Tarifa (subasta)`);
        myOffcanvas.updateContent(`
            <div id="msg_tarifa_subasta"></div>
              <div class="row" id="content_ver">
                <div id="titlu"></div>
                <input type="hidden" id="ssidflete">
                <input type="hidden" id="idpareja_origen_destino">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 msg"></div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="mb-1">
                    <label class="control-label">Subasta</label>
                    <input type="text" id="ssubnum" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="mb-1">
                    <label class="control-label">Nombre cliente</label>
                    <input type="text" id="sscliente" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">num seguridad</label>
                  <input type="text" id="ssseguridad" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Solicitud de servicio</label>
                  <input type="text" id="ssservicio" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Placa</label>
                  <input type="text" id="ssplaca" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Flete sugerido</label>
                  <input type="text" id="ssfsugerido" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label" style="font-weight: 700; color:orange;">Flete propuesto</label>
                  <input type="text" id="ssfpropuesto" class="form-control form-control-sm" disabled>
                  </div>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                 <div class="mb-1">
                  <label class="control-label">Acepta Flete:</label>
                  <select id="respuesta_flete_s" class="form-control form-control-sm">
                    <option value="">Seleccione</option>
                    <option value="1">Si</option>
                    <option value="0">No</option>
                  </select>
                  </div>
                </div>
                <!--<div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="my-4">
                    <button type="button" id="repuesta_flete" class="btn btn-subtle-primary btn-sm me-1 px-1 py-1"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                  </div>
                </div>-->

                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <hr class="my-1 text-dark">
                </div>
                
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Tarifa venta</label>
                  <input type="text" id="sstarifasold" class="form-control form-control-sm" onchange="cambia_tarifa()">
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Utilidad</label>
                  <input type="text" id="ss_utilidad" class="form-control form-control-sm" disabled>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Rentabilidad</label>
                  <input type="text" id="ss_rentabilidad" class="form-control form-control-sm" disabled>
                </div>
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Ajuste de tarifa</label>
                  <select id="ssaprobar" class="form-control form-control-sm">
                    <option value="">Seleccione</option>
                  </select>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label class="control-label">Estado Flete</label>
                  <input type="text" id="estado_flete" class="form-control input-sm" disabled>
                </div>
            </div><!--conten fin -->
          <div class="row">
                <div class="form-group col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <div class="my-4">
                    <button type="button" id="repuesta_flete" class="btn btn-subtle-primary btn-sm me-1 px-1 py-1"><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                  </div>
                </div>
          </div>
          `);
        myOffcanvas.show();

        var datos = {
          n_servicio: dataId
        };
        $.ajax({
          url: $('#base_url').val() + "serviciocliente/consulta_datos_subasta",
          type: 'POST',
          data: datos,
          dataType: 'json',
          success: function (data) {
            if (data.result != null) {

              if (data.result[0].acepta_flete == 'null') {
                document.getElementById("sstarifasold").disabled = true;
                document.getElementById("ssaprobar").disabled = true;
                $('#btnaprobar_tarifa').attr('disabled', true);
                document.getElementById("respuesta_flete_s").disabled = false;
                document.getElementById("repuesta_flete").disabled = false;
              }
              if (data.result[0].acepta_flete == 'Aceptado') {
                document.getElementById("sstarifasold").disabled = false;
                document.getElementById("ssaprobar").disabled = false;
                $('#btnaprobar_tarifa').attr('disabled', false);
                document.getElementById("respuesta_flete_s").disabled = true;
                document.getElementById("repuesta_flete").disabled = true;
              }

              $(".msg").html('');
              $("#estado_flete").val(data.result[0].acepta_flete);
              $("#ssidflete").val(data.result[0].idflete);
              $("#ssubnum").val(data.result[0].id_suba);
              $("#sscliente").val(data.result[0].nombre_cliente);
              $("#ssseguridad").val(data.result[0].num_estudioseguridad);
              $("#ssservicio").val(data.result[0].numer_solservicio);
              $("#ssplaca").val(data.result[0].placa);
              $("#ssfsugerido").val(data.result[0].flete_sugerido);
              $("#ssfpropuesto").val(data.result[0].flete_propuesto);
              $("#sstarifasold").val(data.result[0].tarifa_promedio);
              $("#idpareja_origen_destino").val(data.result[0].parejaorigen);
              //calcular utilidad + rentabilidad
              let a = (data.result[0].tarifa_promedio).replace(/,/g, "");
              let b = (data.result[0].flete_propuesto).replace(/,/g, "");
              let rent = (parseFloat(a) - parseFloat(b));
              $("#ss_rentabilidad").val(rent);
              let calculo = (parseFloat(rent) / parseFloat(a));
              let res = (parseFloat(calculo) * 100);
              let util = res.toFixed(2);
              $("#ss_utilidad").val(util);
              $("#ss_rentabilidad").val(parseFloat($("#ss_rentabilidad").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
              $("#ssfpropuesto").val(parseFloat($("#ssfpropuesto").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
              //  $("#sstarifasold").val(parseFloat($("#sstarifasold").val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
              if (parseFloat(util) >= parseFloat(15)) {
                $("#ssaprobar").html('<option value="aprobado_sac">Ajustar</option>');
              } else {
                $("#ssaprobar").html('<option value="no_aprobado_sac">No ajustar</option>');
              }
            } else {
              $(".msg").html(`
                <div class="alert alert-outline-danger d-flex align-items-center py-2" role="alert">
                  <span class="fas fa-times-circle text-danger fs-7 me-2"></span>
                  <p class="mb-0 flex-1">No hay tarifas registradas para esta solicitud.</p>
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `);
              $("#consulta_sub").animate({ scrollTop: 0 }, 600);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            // console.log('no trajomunis');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          }
        });
      }

      /* Respuesta de la aprobacion de las tarifa de fletes */
      // if (e.target.matches("#repuesta_flete") || e.target.matches("#repuesta_flete *")) {
      if (e.target.matches("#btnaprobar_tarifa") || e.target.matches("#btnaprobar_tarifa *")) {
        Swal.fire({
          title: 'Seguro',
          text: '¿Desea actualizar la solicitud de servicio?',
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
            flete_propu = $("#ssfpropuesto").val();
            tarifa_pro = $("#sstarifasold").val();
            utilidad = $("#ss_utilidad").val();
            rentabili = $("#ss_rentabilidad").val();
            subasta = $("#ssubnum").val();
            rta = $("#respuesta_flete_s").val();
            var sidflete = $("#ssidflete").val();
            ss = $("#ssservicio").val();

            if (rta == '1' || rta == '0') {
              var rta_flete = {
                sidflete: sidflete,
                flete_propu: flete_propu,
                tarifa_pro: tarifa_pro,
                utilidad: utilidad,
                rentabili: rentabili,
                subasta: subasta,
                estado: rta,
                nservicio: ss,
              };
              $.ajax({
                url: $("#id_url_ajax").val() + "serviciocliente/respuesta_flete",
                type: 'POST',
                data: rta_flete,
                dataType: 'json',
                success: function (data) {
                  if (data.numero === 200) {
                    Swal.fire({
                      title: "Mensaje!",
                      text: data.message,
                      icon: "success",
                      draggable: true
                    });
                    listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
                    myOffcanvas.hide();
                  } else {
                    Swal.fire({
                      title: "Mensaje!",
                      text: data.message,
                      icon: "error",
                      draggable: true
                    });
                  }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                  console.log('error error');
                  console.log(jqXHR);
                  console.log(textStatus);
                  console.log(errorThrown);
                }
              });
            } else {
              if (!$("#sstarifasold").val()) {
                msg_error += "<p>Debe diligenciar el campo <strong>Tarifa venta</strong> para poder registrar.</p>";
              }
              if (!$("#ssaprobar").val()) {
                msg_error += "<p>Debe seleccionar el campo <strong>Ajuste de tarifa</strong> para poder registrar.</p>";
              }
              if (!msg_error) {
                Aprobar_Tarifa();
              } else {
                $("#msg_tarifa_subasta").html(`
                <div class="alert alert-outline-danger d-flex align-items-center py-2" role="alert">
                  <span class="fas fa-times-circle text-danger fs-7 me-2"></span>
                  <!--<p class="mb-0 flex-1">No hay tarifas registradas para esta solicitud.</p>-->
                  ${msg_error}
                  <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                `);
                $("#consulta_sub").animate({
                  scrollTop: 0
                }, 600);
              }
            }
          }
        });
      }

      if (e.target.matches("#btn_cancelar_solicitud_servicio") || e.target.matches("#btn_cancelar_solicitud_servicio *")) {
        let enlace = e.target.closest('#btn_cancelar_solicitud_servicio');
        let dataId = enlace.getAttribute('data-id');

        Swal.fire({
          title: 'Seguro',
          text: '¿Desea anular la solicitud de servicio ' + dataId + '?',
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
            var buscar = {
              idsolicitud: dataId,
            };

            $.ajax({
              url: $("#base_url").val() + "serviciocliente/cancelar_solicitud_servicio",
              type: 'POST',
              data: buscar,
              dataType: 'json',
              success: function (data) {
                if (data.success === true) {
                  Swal.fire({
                    title: "Mensaje!",
                    html: data.message,
                    icon: "success",
                    draggable: true
                  });
                  listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id);
                } else {
                  Swal.fire({
                    title: "Mensaje!",
                    html: data.message,
                    icon: "error",
                    draggable: true
                  });
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log('error');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              }
            });
          }
        });
      }

      if (e.target.matches("#btn_duplicar_solicitud") || e.target.matches("#btn_duplicar_solicitud *")) {
        let enlace = e.target.closest('#btn_duplicar_solicitud');
        // Obtener el valor del atributo data-id
        let dataId = enlace.getAttribute('data-id'); // Cotizacion
        let dataId2 = enlace.getAttribute('data-id2'); // Solicitud de servicio
        let dataId3 = enlace.getAttribute('data-id3');

        let dato = new FormData();
        dato.append('Cotizacion', dataId);
        dato.append('Solicitud_Servicio', dataId2);

        try {
          // Mostrar loading
          Swal.fire({
            title: 'Duplicando solicitud...',
            text: 'Por favor espera unos segundos',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });

          const response = await fetch($('#base_url').val() + 'serviciocliente/Duplicar_Solicitud', {
            method: 'POST',
            body: dato,
            cache: 'no-cache',
          });

          const data = await response.json();

          // Cerrar loading
          Swal.close();

          if (data.success) {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: data.message,
              confirmButtonText: 'Aceptar'
            }).then(() => {
              // 👉 Aquí podrías recargar tabla, refrescar vista, etc.
              console.log("Nueva cotización:", data.nueva_cotizacion);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: data.message || 'No se pudo duplicar la solicitud',
            });
          }

        } catch (error) {
          Swal.close(); // Cierra loading si ocurre un error
          console.error('Error en la solicitud de tipo de mercancía:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error en la petición',
            text: 'Ocurrió un error inesperado. Intenta nuevamente.',
          });
        } finally {
          // Aquí puedes hacer limpieza si lo necesitas
        }

        //ID = 0;
        // 👇 Esperar a que se llenen los selects
        // Municipios();
        // Mercancias();
        // tipo_empaque();
        // Tipo_vehiculos();
        // Agencias();
        // var horahoy = moment().format('HH:mm:ss');

        // // Select cliente y hidden para nombre
        // var cliente_select = `<select id='clientea' class='form-select form-select-sm re_cliente' onchange='Cambia_Remitente()'></select>
        //                 <input type='hidden' class='form-control input-xs re_nombre' id='re_namecli'>`;

        //   var city = `
        //       <select id='p_ciudad' class='form-select form-select-sm re_ciudad'>
        //         <option value="" readonly="readonly">Seleccione</option>
        //       </select>`;

        // /* Titulo del offcanva */
        // myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Duplicar solicitud de servicio`);
        // myOffcanvas.updateContent(`
        //   <div class="row">
        //     <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        //       <hr class="my-0 text-dark">
        //       <div class="d-flex flex-wrap justify-content-start my-1">
        //         <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
        //           <h6 class="mb-0 text-body-highlight me-2">Datos del cliente</h6>
        //         </div>
        //       </div>
        //       <hr class="my-0 text-dark">
        //     </div>

        //     <div class="col-12 col-sm-12 col-md-12 col-lg-21 col-xl-12 col-xxl-12">
        //       <div class="row">
        //         <input type="hidden" name="id_cliente_seleccionado" id="id_cliente_seleccionado">
        //         <input type="hidden" name="empresa_seleccionada_id" id="empresa_seleccionada_id">
        //         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
        //           <div class="mb-1">
        //             <label style="font-size: 12px;">Documento</label>
        //             <input type="text" class="typeahead form-control form-control-sm" id="documento" disabled>
        //             <input type="hidden" class="typeahead form-control form-control-sm" id="nit_empresa" disabled>
        //             <input type="hidden" id="digito_verificacion" disabled class="form-control input-sm">
        //           </div>
        //         </div>
        //         <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
        //           <div class="mb-1">
        //             <label style="font-size: 12px;">Nombre</label>
        //             <input type="text" id="nombre_clientes" disabled class="form-control form-control-sm">
        //           </div>
        //         </div>
        //         <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
        //           <div class="mb-1">
        //             <label style="font-size: 12px;">Ubicación</label>
        //             <input type="text" id="direccion_cliente" class="form-control form-control-sm" disabled>
        //           </div>
        //         </div>
        //         <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
        //           <div class="mb-1">
        //             <label style="font-size: 12px;">Telefono</label>
        //             <input type="number" id="telefono_cliente" maxlength="10" minlength="0" class="form-control form-control-sm" disabled>
        //           </div>
        //         </div>
        //         <div class="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
        //           <div class="mb-1">
        //             <label style="font-size: 12px;">Correo</label>
        //             <input type="text" id="correo" disabled class="form-control form-control-sm">
        //           </div>
        //         </div>
        //         <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
        //           <div class="mb-1">
        //             <label style="font-size: 12px;">Tipo Documento</label>
        //             <input type="text" id="tipo_documento" class="form-control form-control-sm" disabled>
        //           </div>
        //         </div>
        //       </div>
        //     </div>

        //     <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        //       <hr class="my-0 text-dark">
        //       <div class="d-flex flex-wrap justify-content-start my-1">
        //         <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
        //           <h6 class="mb-0 text-body-highlight me-2">Datos de la Mercancia</h6>
        //         </div>
        //       </div>
        //       <hr class="my-0 text-dark">
        //     </div>

        //         <div  class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //           <div class="mb-1">
        //             <label style="font-size: 12px;">Servicio ITR&nbsp;<span style="color:blue;"><i>(*)</i></span></label> 
        //               <select id="itr" style="width: 100%;color:#000;" class="form-select form-select-sm itr" Onchange="Validar_operacion_itr()">
        //                 <option value="" readonly="readonly">Seleccione</option>
        //                 <option value="Si">Si</option>
        //                 <option value="No" selected>No</option>
        //               </select>
        //             </div>
        //         </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //             <label style="font-size: 12px;">Mercancía</label> 
        //             <select id="tipo_mercancia" class="tmerca form-select form-select-sm select2-sm" style="width: 100%;">
        //                 <option value="">Seleccione</option>
        //               </select>
        //             <input type="hidden" class="form-control idproducto" id="codmercancia" readonly="readonly">
        //             <input type="hidden" class="form-control rndcproducto" id="rndcmercancia" readonly="readonly">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Naturaleza</label> 
        //             <select style="width: 100%;" id="natu" readonly="readonly" class="form-select form-select-sm natumer"></select>
        //           </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Valor Declarado</label> 
        //             <input type="text" id="valor_mercancia" style="width: 100%;" class="form-control form-control-sm valor_merca" min="0" onChange="javascript:currencyMask(this)">
        //           </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Tipo Servicio</label> 
        //           <select id="servicio_cliente" style="width: 100%;" class="form-select form-select-sm ts" ${ID === '5' || ID === '6' || ID === '7' || ID === '8' ? 'disabled' : ''}>
        //             <option value="" readonly="readonly">Seleccione</option>
        //             <option value="Expreso"${ID === '5' || ID === '6' || ID === '7' || ID === '8' ? 'selected' : ''}>Expreso - Viaje</option>
        //             <option value="Consolidado">Consolidado - Tonelada</option>
        //           </select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Tipo Empaque</label> 
        //             <select style="width: 100%;" id="tipo_empaque" class="form-select form-select-sm select2-sm empaquemer">
        //               <option value="">Seleccione</option>
        //             </select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Tipo Operación</label> 
        //             <select style="width: 100%;" id="tipo" class="form-select form-select-sm operamer">
        //               <option value="">Seleccione</option>
        //               <option value="G">General</option>
        //               <option value="P">Paqueteo</option>
        //               <option value="C">Contenedor Cargado</option>
        //               <option value="V">Contenedor Vacío</option>
        //             </select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Tipo Transporte</label> 
        //           <select style="width: 100%;" id="tipo_transporte" class="form-select form-select-sm ttransportemer">
        //             <option value="">Seleccione</option>
        //             <option value="Importacion">Importación</option>
        //             <option value="Exportacion">Exportación</option>
        //             <option value="Nacional">Nacional</option>
        //             <option value="Urbano">Urbano</option>
        //           </select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Origen</label> 
        //             <select id="origen_cliente" class="form-select form-select-sm select2-sm originario" style="width: 100%;">
        //               <option value="" selected>Seleccione</option>
        //             </select>
        //             <input type="hidden" id="cant_carro" class="form-control form-control-sm cantvehi" min="1" style="width:100%;" value="1"  onchange="cuantitativo(this.value,)" readonly>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //             <label style="font-size: 12px;">Destino</label> 
        //             <select id="destino_cliente" class="form-select form-select-sm destinar select2-sm" style="width: 100%;">
        //               <option value="" selected>Seleccione</option>
        //             </select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Tipo Vehículo</label> 
        //           <select id="vehiculo_cliente" readonly="readonly" style="width:100%;" class="form-select form-select-sm tipovehiculo" onChange="javascript:obtenerflete(this.value,);"></select>
        //         </div>
        //       </div>

        //       <!-- Cantidad de vehiculos para la operacióm -->
        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Cantidad Vehículo</label> 
        //           <input type="number" id="cant_vehiculo" class="form-control form-control-sm cantvehiculo" min="1" style="width:100%;" value="${ID === '5' || ID === '6' | ID === '7' | ID === '8' ? 1 : ''}" ${ID === '5' || ID === '6' | ID === '7' | ID === '8' ? 'disabled' : ''}>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Peso Bruto(Kg)</label> 
        //           <input type="text" id="peso_client1" class="form-control form-control-sm pesobruto" min="0" style="width:100%;" onChange="javascript:cambio_valor(this,);">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Peso Neto(Kg)</label> 
        //           <input type="text" class="form-control form-control-sm p pnetomer" min="0" style="width:100%;" name="nombre" id="peso_neto_kg" onChange="javascript:CambioNeto(this,);">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Peso Bruto(Tn)</label> 
        //           <input type="text" class="form-control form-control-sm pesobrutoton" min="0" style="width:100%;" name="nombre" id="pesobruto_cliente" readonly>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Cantidad(unidades)</label> 
        //           <input type="text" id="cantidad" class="form-control form-control-sm cantidadmer" min="1" style="width:100%;" onChange="javascript:currencyMask(this)">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Alto(cm)</label> 
        //           <input type="number" id="alto_cliente" class="form-control form-control-sm altomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Largo(cm)</label> 
        //           <input type="text" id="largo_cliente"  class="form-control form-control-sm largomer" style="width:100%;" min="0" value="0" onChange="javascript:currencyMask(this)">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Ancho(cm)</label> 
        //           <input type="text" id="" name="ancho"  class="form-control form-control-sm ancho anchomer" style="width:100%;" min="0" value="0" onChange="volumen_total(this,);">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Volumen (m3)</label> 
        //             <input type="text" id="volumen_cliente" readonly="readonly"  class="form-control form-control-sm volumenmer" style="width:100%;" value="0">
        //         </div>
        //       </div>

        //       <!-- Costo Flete -->
        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Costo Flete</label> 
        //             <input type="text"  id="flete" class="form-control form-control-sm fletemer" min="0" value="0"  style="width:100%;" onChange="javascript:utilidad_d(this,,)">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Tarifa venta</label> 
        //             <input type="text" id="totaltarifa_cliente"  class="form-control form-control-sm tarifamer"  min="0" value="0" style="width:100%;" onChange="javascript:utilidad(this,,);" >
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Rentabilidad %</label> 
        //             <input type="text" id="rentabilidad_porcentaje"  class="form-control form-control-sm utilidad utilmer" min="0" style="width:100%;" readonly="readonly">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Utilidad</label> 
        //             <input type="text" id="renta" class="form-control form-control-sm rentamer" style="width:100%;"  readonly="readonly">
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 ">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Observación</label> 
        //             <textarea id="observa" class="form-control form-control-sm observamer" style="width:100%;" rows="1"></textarea> <input type="hidden" class="identi " value="1"  style="width:100%;">
        //         </div>
        //       </div>

        //     <!-- DATOS DE LA SOLICITUD DE SERVICIO -->
        //       <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Agencia&nbsp;<span style="color:red;"><i>(*)</i></label>
        //           <select id="agencia" class="form-select form-select-sm mb-3">
        //             <option value="">Seleccione</option>
        //           </select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Grupo&nbsp;<span style="color:red;"><i>(*)</i></label>
        //           <select class="form-select form-select-sm mb-3 select2" aria-label="category" style="width:100%;" id="group" name="group[]" multiple="multiple"></select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Hora Envio email</label>
        //           <select class="form-select form-select-sm mb-3 select2" aria-label="category" style="width:100%;" id="houremail" name"houremail[]" multiple="multiple"></select>
        //         </div>
        //       </div>

        //       <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        //         <div class="mb-1">
        //           <label style="font-size: 12px;">Observaciones Seguridad</label>
        //           <textarea type="text" id="observacion" min="0" class="form-control input-sm" rows="1"></textarea>
        //         </div>
        //       </div>

        //     <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        //       <div class="d-flex flex-wrap justify-content-start mt-3">
        //         <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        //           <h6 class="mb-0 text-body-highlight me-2"> Remitentes y Destinatarios</h6>
        //         </div>
        //       </div>
        //       <hr class="my-0 text-dark">
        //     </div>

        //     <div class="col">
        //       <table class="table table-sm table-bordered  text-center" style="font-size:12px;">
        //           <thead>
        //             <tr class="">
        //               <th class="">Remitente
        //                 <input type="hidden" id="destinatario" class="desti_remit ">
        //               </th>
        //               <th class="">Dirección</th>
        //               <th class="">Ciudad</th>
        //             </tr>
        //             <tr class="">
        //               <td>
        //                 ${cliente_select}
        //                 <input type="hidden" id="estado_upgrade" class="form-control input-xs est_upgrade">
        //                 <input type="hidden" class="form-control input-xs rlname" id="rlname">
        //               </td>
        //               <td>
        //                 <!--<button id="btnmascara_direccion" class="btn-xs btn-success mdi mdi-home class=" " tittle="Generar dirección" onclick="mascara_dire();"></button>-->
        //                 <input type="text" id="dire" class="form-control form-control-sm re_dire" style=" height:14px; font-size:90%;" readonly="readonly">
        //                 <input type="hidden" class="form-control input-xs rldire" id="rldire">
        //               </td>
        //               <td class="">${city}</td>
        //             </tr>

        //             <tr class="">
        //               <th class="">Teléfono</th>
        //               <th class="">Observación</th>
        //               <th>Peso Neto(Kg)</th>
        //             </tr>

        //             <tr class="">
        //               <td class="">
        //                 <input type="number" id="telpunto" class="form-control form-control-sm re_telefono" min="0">
        //                 <input type="hidden" id="rltel" class="form-control input-xs rltel">
        //               </td>
        //               <td class="">
        //                 <textarea id="observa" class="form-control form-control-sm" rows="1"></textarea>
        //               </td>
        //               <td class="">
        //                 <input type="number" id="peso" class="form-control form-control-sm re_peso">
        //               </td>
        //             </tr>

        //             <tr class="">
        //               <th class="">Fecha</th>
        //               <th class="">Hora</th>
        //               <th class="">Lugar</th>
        //             </tr>

        //             <tr class="">
        //               <td>
        //                 <input type="date" id="fecha" class="form-control form-control-sm re_fecha">
        //               </td>
        //               <td class="">
        //                 <input type="time" id="hora" class="form-control form-control-sm re_hora" value="${horahoy}">
        //               </td>
        //               <td class="">
        //                 <input type="text" id="lugar" class="form-control form-control-sm re_lugar">
        //                 <input type="hidden" id="id_puntorem" class="input_xs id_punto" value="">
        //               </td>
        //             </tr>
        //           </thead>
        //         </table>
        //     </div>

        //   </div>     
        // `);
        // myOffcanvas.updateWidth('60%');
        // myOffcanvas.show();

        // let dato = new FormData();
        // dato.append('Cotizacion', dataId);
        // dato.append('Solicitud_Servicio', dataId2);

        // try {
        //   // Realiza la solicitud para obtener los datos
        //   const response = await fetch($('#base_url').val() + 'serviciocliente/Select_solicitud', {
        //     method: 'POST',
        //     body: dato,
        //     dataType: 'json',
        //     cache: 'no-cache',
        //   });
        //   const data = await response.json();

        //   if (data) {
        //     const info = data.datos;  // 👈 datos principales
        //     const grupos = data.grupos;
        //     const horas = data.horas;


        //     document.getElementById('itr').value = info.itr;

        //     // document.getElementById('tipo_mercancia').value = info.tipo_mercancia;
        //     const select = document.getElementById('tipo_mercancia');
        //     const valor = info.tipo_mercancia;

        //     // Buscar opción que tenga ese texto
        //     // for (let option of select.options) {
        //     //   if (option.text === valor) {
        //     //     select.value = option.value; // asignar el value correspondiente
        //     //     break;
        //     //   }
        //     // }

        //     // Buscar opción que tenga ese texto
        //     let optionValue = null;
        //     for (let option of select.options) {
        //       if (option.text === valor) {
        //         optionValue = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     // Si encontramos la opción, seleccionarla con Select2
        //     if (optionValue) {
        //       $('#tipo_mercancia').val(optionValue).trigger('change');
        //     }

        //     document.getElementById('valor_mercancia').value = currencyMask(info.valor_mercancia);

        //     const selectServicio = document.getElementById('servicio_cliente');
        //     const servicio = info.tipo_servicio_mer;

        //     // Buscar opción que tenga ese texto
        //     for (let option of selectServicio.options) {
        //       if (option.value === servicio) {
        //         selectServicio.value = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     const selectEmpaque = document.getElementById('tipo_empaque');
        //     const TipoEmpaque = info.tipo_empaque;

        //     // Buscar opción que tenga ese texto
        //     let optionEmpaque = null;
        //     for (let option of selectEmpaque.options) {
        //       if (option.value === TipoEmpaque) {
        //         optionEmpaque = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     // Si encontramos la opción, seleccionarla con Select2
        //     if (optionEmpaque) {
        //       $('#tipo_empaque').val(optionEmpaque).trigger('change');
        //     }

        //     const selectCarga = document.getElementById('tipo');
        //     const TipoCarga = info.tipo_carga;

        //     // Buscar opción que tenga ese texto
        //     for (let option of selectCarga.options) {
        //       if (option.value === TipoCarga) {
        //         selectCarga.value = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     const selectTransporte = document.getElementById('tipo_transporte');
        //     const TipoTransporte = info.tipo_transporte;

        //     // Buscar opción que tenga ese texto
        //     for (let option of selectTransporte.options) {
        //       if (option.value === TipoTransporte) {
        //         selectTransporte.value = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     const selectOrigen = document.getElementById('origen_cliente');
        //     const Origen = info.origen;

        //     // Buscar opción que tenga ese texto
        //     let optionOrigen = null;
        //     for (let option of selectOrigen.options) {
        //       if (option.value === Origen) {
        //         // selectOrigen.value = option.value; // asignar el value correspondiente
        //         optionOrigen = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     if (optionOrigen) {
        //       $('#origen_cliente').val(optionOrigen).trigger('change');
        //     }

        //     const selectDestino = document.getElementById('destino_cliente');
        //     const Destino = info.destino;

        //     // Buscar opción que tenga ese texto
        //     let optionDestino = null;
        //     for (let option of selectDestino.options) {
        //       if (option.value === Destino) {
        //         // selectDestino.value = option.value; // asignar el value correspondiente
        //         optionDestino = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     if (optionDestino) {
        //       $('#destino_cliente').val(optionDestino).trigger('change');
        //     }

        //     const selectTipoVehiculo = document.getElementById('vehiculo_cliente');
        //     const TipoVehiculo = info.tipo_vehiculo;

        //     // Buscar opción que tenga ese texto
        //     for (let option of selectTipoVehiculo.options) {
        //       if (option.value === TipoVehiculo) {
        //         selectTipoVehiculo.value = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     document.getElementById('cant_vehiculo').value = info.cant_vehiculo;
        //     document.getElementById('peso_client1').value = info.peso_bruto_kg;
        //     document.getElementById('peso_neto_kg').value = info.peso_neto_kg;
        //     document.getElementById('pesobruto_cliente').value = info.peso_neto_tn;
        //     document.getElementById('cantidad').value = info.cantidad_empaque;
        //     document.getElementById('flete').value = currencyMask(info.flete);
        //     document.getElementById('totaltarifa_cliente').value = currencyMask(info.total_tarifa);
        //     document.getElementById('rentabilidad_porcentaje').value = currencyMask(info.utilidad);
        //     document.getElementById('renta').value = currencyMask(info.rentabilidad);
        //     document.getElementById('observa').value = info.observacion;

        //     /* Datos de la solicitud de servicio */

        //     // agencia
        //     const selectAgencia = document.getElementById('agencia');
        //     // const ValorAgencia = info.agencia;
        //     const ValorAgencia = info.agencia.toString();
        //     // Buscar opción que tenga ese texto
        //     for (let option of selectAgencia.options) {
        //       if (option.value === ValorAgencia) {
        //         selectAgencia.value = option.value; // asignar el value correspondiente
        //         break;
        //       }
        //     }

        //     const ValorGrupo = grupos.length > 0 ? grupos[0].id_grupo : null;
        //     const ValorHora = horas.length > 0 ? horas[0].hora_email : null;

        //     Grupos_contactos(info.nombre_cliente, ValorGrupo, ValorHora);


        //   }

        // } catch (error) {
        //   console.error('Error en la solicitud de tipo de mercancía:', error);
        //   throw error;
        // } finally {
        //   // tipo_empaque(); // Llama a la función para llenar el tipo de empaque
        // }

      }
    });

    const filtro = document.getElementById(`campo-${id}-filtro`);
    if (!filtro) return; // Si no existe, salimos.

    // Escuchamos el evento 'change' en el <select> del filtro
    filtro.addEventListener('change', function () {
      const valorSeleccionado = this.value;

      // Referencias a los otros <select>
      const clientes = document.getElementById(`campo-${id}-clientes`);
      const empresas = document.getElementById(`campo-${id}-empresas`);
      const estados = document.getElementById(`campo-${id}-estados`);
      const comerciales = document.getElementById(`campo-${id}-comerciales`);

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
          document.getElementById(`contenedor_${id}_clientes`).style.display = 'none'; // Muestra el select (display: block/inline-block, etc.)
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
      } else if (valorSeleccionado === 'Comercial') {
        if (comerciales) {
          // Petición AJAX con fetch
          fetch(baseUrl + 'serviciocliente/Listar_Comerciales', {
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
              comerciales.innerHTML = '<option value="">Seleccione</option>';

              data.forEach(item => {
                const option = document.createElement('option');
                // option.value = item.id;
                option.value = item.nom_usuario;
                option.textContent = item.nom_usuario;
                comerciales.appendChild(option);
              });

              // Inicializar Select2 (requiere jQuery).
              // Si sigues teniendo jQuery y select2 cargados, podrías hacer:
              if (window.$ && $.fn.select2) {
                $(comerciales).select2({
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
      }
    });
  }

  async function listar_cotizaciones(tipo, fecha_inicial, fecha_final, estado, cliente, empresa, id, comercial) {
    /* Funcion para enviar los datos */
    $('#load_info').css('display', 'flex'); // Mostrar mensaje de carga
    let dato = new FormData();
    dato.append('tipo', tipo);
    dato.append('fecha_inicial', fecha_inicial);
    dato.append('fecha_final', fecha_final);
    dato.append('estado', estado);
    dato.append('cliente', cliente);
    dato.append('empresa', empresa);
    dato.append('comercial', comercial);

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
        var btn_edita_tarifa = ''; //EDICION POR LA SUBASTA

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

          /* Consultas de estado de las solicitudes */
          if (element.estado_autorizacion === 'F1') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-secondary" ><span class="badge-label">Realizada</span><span class="ms-1" data-feather="plus" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F2') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-primary" ><span class="badge-label">Entregada</span><span class="ms-1" data-feather="check" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F4') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger" ><span class="badge-label">Pérdida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F3') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-success" ><span class="badge-label">Ganada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F5') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-danger" ><span class="badge-label">Cancelada</span><span class="ms-1" data-feather="package" style="height:12.8px;width:12.8px;"></span></span > `;
          } else if (element.estado_autorizacion === 'F6') {
            esatdo_autorizado = `<span class="badge badge-phoenix fs-10 badge-phoenix-warning" ><span class="badge-label">Rechazada</span><span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span > `;
          }

          /* Validar si la solicitud es Itr */
          if (element.itr === 'Si') {
            cot_itr = `<span class="badge badge-phoenix badge-phoenix-success float-right"> SI</span > `;
          } else {
            cot_itr = `<span class="badge badge-phoenix badge-phoenix-primary float-right"> NO</span > `;
          }

          if (element.prioritaria === 'Propuesta') {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-warning float-right"> <a href="#" id="btn_aprobar_solicitud" data-id="${element.nundoc_solicitud}" class="text-decoration-none text-warning" title="Aprobar solicitud">${element.prioritaria}</a></span > `;
          } else if (element.prioritaria === null) {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-info float-right"> No marcada</span > `;
          } else {
            Prioridad = `<span class="badge badge-phoenix badge-phoenix-primary float-right"> ${element.prioritaria}</span > `;
          }

          const columnaEstado = document.createElement('td');
          columnaEstado.innerHTML = col_estatus;
          const columnaEstado_Autorizacion = document.createElement('td');
          columnaEstado_Autorizacion.innerHTML = esatdo_autorizado;
          const columnaItr = document.createElement('td');
          columnaItr.innerHTML = cot_itr;
          const columnaNum_Cotizacion = document.createElement('td');
          columnaNum_Cotizacion.innerHTML = `
              <div class="dropdown">
                <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> N°${element.nundoc_solicitud}</a>
                <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink" style="">
                  <a class="dropdown-item fw-bold" href="#" id="btn_ver_solicitud" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}" data-id4="${element.estado_estudio}" data-id5="${element.Cliente_Id}"><span class="uil uil-file-search-alt"></span> Detalle solicitud servicio</a>
                  ${(element.estado == 'En_subasta' && element.estado_secundario == 'pendiente_aprobacion_sac' || element.estado_secundario == 'aprueba_flete_sac' || element.estado_secundario == 'no_aprueba_ge') ? `<a class="dropdown-item fw-bold" href="#" id="btn-aprobar-tarifa-subasta" data-id="${element.nundoc_solicitud}"><span class="uil uil-feedback"></span> Aprobar Tarifa</a>` : ``}
                  <a class="dropdown-item fw-bold" href="#"><span class="uil uil-transaction"></span> Aprobar Subasta</a> 
                  <a class="dropdown-item fw-bold" href="#" id="btn_cancelar_solicitud_servicio"  data-id="${element.nundoc_solicitud}"><span class="uil uil-feedback"></span> Anular solicitud servicio</a>
                  ${(element.prioritaria === "Propuesta" || element.prioritaria === "Aprobada") ? '' : ` <div class="dropdown-divider"></div> <a class="dropdown-item fw-bold" id="btn-solicitar-prioridad" href="#" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}"> <span class="uil uil-bell"></span> Solicitar Prioridad </a>`}
                  <a class="dropdown-item fw-bold" href="#" id="btn_duplicar_solicitud" data-id="${element.n_cotizacion}" data-id2="${element.nundoc_solicitud}" data-id3="${id}"><span class="uil uil-copy"></span> Duplicar solicitud servicio</a>
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

          //Comercial
          const columnaComercial = document.createElement('td');
          columnaComercial.innerHTML = element.elaborado_por;

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
          fila.appendChild(columnaComercial);
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

  function Aprobar_Tarifa() {
    var sidflete = $("#ssidflete").val();
    var subasta = $("#ssubnum").val();
    var cliente = $("#sscliente").val();
    var tarifa = $("#sstarifasold").val().replace(/,/g, "");
    var estado = $("#ssaprobar").val();
    var idpareja = $("#idpareja_origen_destino").val();
    //update en el campo nuevo de estado estado_sac
    //insert en el campo nuevo de detalle de mercancia
    // tarifa_subasta  responsable
    var dato = {
      sidflete: sidflete,
      subasta: subasta,
      tarifa: tarifa,
      estado: estado,
      idpareja: idpareja,
      action: 'Aprueba_Sac'
    };

    $.ajax({
      url: $("#id_url_ajax").val() + "libs/servicio_cliente_ajax.php",
      type: 'POST',
      data: dato,
      dataType: 'json',
      success: function (data) {
        alert('Se Registro Exitosamente!!!');
        $("html, body").animate({
          scrollTop: 0
        }, 600);
        setTimeout(function () {
          location.reload(false);
        }, 800);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('error error');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      }
    });
  }

  async function Municipios() {
    $('#origen_cliente').empty();
    $('#destino_cliente').empty();

    try {
      const response = await fetch($('#base_url').val() + 'serviciocliente/Consulta_Municipios', {
        method: 'POST',
        cache: 'no-cache'
      });
      const data = await response.json();

      $('#origen_cliente').append('<option value="">Seleccione un municipio</option>');
      $('#destino_cliente').append('<option value="">Seleccione un municipio</option>');

      data.forEach(function (element) {
        $('#origen_cliente').append(
          `<option value="${element.rndc_codigo_ciudad}" data-municipio="${element.municipio}" data-depto="${element.depto}">${element.municipio}-${element.depto}</option>`
        );
        $('#destino_cliente').append(
          `<option value="${element.rndc_codigo_ciudad}" data-municipio="${element.municipio}" data-depto="${element.depto}">${element.municipio}-${element.depto}</option>`
        );
      });

      $('#origen_cliente, #destino_cliente').select2({
        placeholder: 'Seleccione una opción',
        allowClear: true
      });

    } catch (error) {
      console.error('Error en Municipios:', error);
      throw error;
    }
  }

  async function Mercancias() {
    $('#tipo_mercancia').html('');

    try {
      const response = await fetch($('#base_url').val() + 'serviciocliente/Tipo_Mercancia', {
        method: 'POST',
        cache: 'no-cache'
      });
      const data = await response.json();

      data.forEach(function (element) {
        $('#tipo_mercancia').append(
          `<option value="${element.nombre}" data-id="${element.id}" data-id2="${element.codigo}" data-accion="Duplicar">${element.nombre}</option>`
        );
      });

      $('#tipo_mercancia').select2({
        placeholder: 'Seleccione una opción',
        allowClear: true
      });

      $('#tipo_mercancia').on('change', function () {
        let accion = $(this).find(':selected').data('accion');
        if (accion === 'Duplicar') {
          codigo_mercancia();
        }
      });

    } catch (error) {
      console.error('Error en Mercancias:', error);
      throw error;
    }
  }

  async function tipo_empaque() {
    $('#tipo_empaque').html('');

    try {
      const response = await fetch($('#base_url').val() + 'serviciocliente/Tipo_Empaque', {
        method: 'POST',
        cache: 'no-cache'
      });
      const data = await response.json();

      $('#tipo_empaque').append('<option value="">Seleccione un tipo de empaque</option>');

      data.forEach(function (element) {
        $('#tipo_empaque').append(
          `<option value="${element.id}">${element.empaque}</option>`
        );
      });

      $('#tipo_empaque').select2({
        placeholder: 'Seleccione una opción',
        allowClear: true
      });

    } catch (error) {
      console.error('Error en tipo_empaque:', error);
      throw error;
    }
  }

  function codigo_mercancia(id) {
    const selectMercancia = $('#tipo_mercancia');

    // Obtener el valor seleccionado y los atributos data-*
    const selectedOption = selectMercancia.find(':selected');
    const id_mercancia = selectedOption.data('id');
    const rndc_mercancia = selectedOption.data('id2');

    $('#codmercancia').val(id_mercancia);
    $('#rndcmercancia').val(rndc_mercancia);

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
          $('#natu').html('');
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
          $('#natu').append('<option value="' + natural + '">' + palabra + '</option>');
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  async function Tipo_vehiculos() {
    $.ajax({
      url: $('#base_url').val() + 'serviciocliente/Tipo_Vehiculos',
      type: 'POST',
      dataType: 'json',
      success: function (data) {
        //traer el tipo de vehiculo
        $('#vehiculo_cliente').append('<option value="">Seleccione</option>');
        data.forEach(function (element, index) {
          $('#vehiculo_cliente').append('<option value="' + element.id + '">' + element.nombre + '</option>');
          //costo individual

          //costo total
          // var tot = $('#Tcosto_flete').val(); //capturar el costo total del flete
          // var fle = $('#flete' + id).val(); //traer el valor actual del flete
          // var tf = fle - tot; //restar el total menos el flete actual
          // //poner el actual en cero
          // $('#Tcosto_flete').val(tf); //asignarle el resultado al total
          // $('#flete' + id).val(0);
          // //tarifa total
          // var totarifa = $('#Tservicio_transporte').val();
          // var ta = $('#totaltarifa_cliente' + id).val();
          // var to_ta = totarifa - ta;
          // $('#totaltarifa_cliente' + id).val(0);
          // $('#Tservicio_transporte').val(to_ta);

          // //total cotizacion
          // var tser = $('#Tservicio_transporte').val();
          // var tesp = $('#Ttarifa_especial').val();
          // var totcot = parseFloat(tser) + parseFloat(tesp);
          // $('#Ttotal_cotizacion').val(totcot);

          // $('.utilidad' + id).val(0);
          // $('#renta' + id).val(0);
          // $('#Tutilidad').val(0);
          // $('#Trentabilidad').val(0);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no entro ');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  async function Agencias() {
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
  }

  function Grupos_contactos(cliente, idGrupoSeleccionado = null, idHoraSeleccionada = null) {
    var gr = { cliente: cliente };

    $('#group').html('');
    $('#houremail').html('');

    $.ajax({
      url: $('#base_url').val() + 'serviciocliente/Consultar_grupo',
      type: 'POST',
      data: gr,
      dataType: 'json',
      success: function (data) {
        if (data.resultado != null) {
          data.resultado.forEach(function (element) {
            $('#group').append(
              '<option value="' + element.id + '">' + element.nombre_grupo + '</option>'
            );
          });
        }

        if (data.resultado2 != null) {
          data.resultado2.forEach(function (element) {
            $('#houremail').append(
              '<option value="' + element.id + '">' + element.nombre + ' - ' + element.hora_envio + '</option>'
            );
          });
        }

        // inicializar select2
        $('#group').select2({
          placeholder: 'Seleccione una opción',
          allowClear: true
        });

        $('#houremail').select2({
          placeholder: 'Seleccione una opción',
          allowClear: true
        });

        // 👉 Seleccionar grupo si hay id
        if (idGrupoSeleccionado) {
          $('#group').val(idGrupoSeleccionado).trigger('change');
        }

        // 👉 Seleccionar hora si hay id
        if (idHoraSeleccionada) {
          $('#houremail').val(idHoraSeleccionada).trigger('change');
        }
      },

      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }
}

//cambiar valor del peso neto total
function cambio_valor(elem) {
  var elemento = $(elem);
  t = elemento.val();
  var tonelada = 1000;
  var multi = t / tonelada;
  $('#pesobruto_cliente').val(multi);
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //maquetear peso bruto Tn
  $('#pesobruto_cliente').val(parseFloat($('#pesobruto_cliente').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

//calcula flete
function utilidad_d(elem, id, max) {
  var conte = 1;
  var valor = $('#totaltarifa_cliente').val().replace(/,/g, '');
  var calculo, resta, util, res;
  var acu = 0;
  var variable = 0;
  var f = $('#flete').val().replace(/,/g, '');
  var ff = $('#flete');
  ff.val(parseFloat(ff.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //UTILIDAD
  resta = parseFloat(valor) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(valor);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);
  $('.utilidad').val(res);
  $('.utilidad').val(parseFloat($('.utilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  //RENTABILIDAD
  var rent = parseFloat(valor) - parseFloat(f);
  $('#renta').val(rent);
  $('#renta').val(parseFloat($('#renta').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
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
    vtemp = $('#totaltarifa_cliente').val().replace(/,/g, '');
    sum = parseFloat(sum) + parseFloat(vtemp);

    vtempd = 0;
    vtempd = $('#flete').val().replace(/,/g, '');
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
  // var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
  var tesp = 0;
  var totcot = parseFloat(tser) + parseFloat(tesp);
  $('#Ttotal_cotizacion').val(totcot);
  //maquetar campos
  $('#Tcosto_flete').val(parseFloat($('#Tcosto_flete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad').val(parseFloat($('#Tutilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trentabilidad').val(parseFloat($('#Trentabilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tservicio_transporte').val(parseFloat($('#Tservicio_transporte').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  recalcula_cifras();
}

//calcula tarifa
function utilidad(elem, id, max) {
  var cont = 1;
  $('#totaltarifa_cliente').val(parseFloat($('#totaltarifa_cliente').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  var valor = $('#totaltarifa_cliente').val().replace(/,/g, '');
  //trayendo valor tarifa y el id de la tarifa
  //UTILIDAD INDIVIDUAL
  var calculo, resta, util, res;
  var acu = 0;
  var variable = 0;
  var f = $('#flete').val().replace(/,/g, '');
  resta = parseFloat(valor) - parseFloat(f);
  calculo = parseFloat(resta) / parseFloat(valor);
  res = parseFloat(calculo) * 100;
  res = res.toFixed(2);
  $('.utilidad').val(res);
  $('.utilidad').val(parseFloat($('.utilidad').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

  //RENTABILIDAD
  var rent = parseFloat(valor) - parseFloat(f);
  $('#renta').val(rent);
  $('#renta').val(parseFloat($('#renta').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  var i;
  var sum = 0;
  var vtemp;
  $('#Tservicio_transporte').val(0);
  recalcula_cifras();
  for (i = 1; i <= cont; i++) {
    //alert (max);
    vtemp = 0;
    vtemp = $('#totaltarifa_cliente').val().replace(/,/g, '');
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
  // var tesp = $('#Ttarifa_especial').val().replace(/,/g, '');
  var tesp = 0;
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

//calcular totales nuevamente
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
    // $('#Ttarifa_especial').val(0);
    $('#Tutilidad_especial').val(0);
    $('#Trenta_especial').val(0);
  }
  //total cotizacion
  var tarimer = $('#Tservicio_transporte').val().replace(/,/g, '');
  // var tariespe = $('#Ttarifa_especial').val().replace(/,/g, '');
  var tariespe = 0;
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
  // $('#Ttarifa_especial').val(parseFloat($('#Ttarifa_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.Total_utilidad_especial').html(parseFloat($('#Tutilidad_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Tutilidad_especial').val(parseFloat($('#Tutilidad_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  // $('.Total_renta_especial').html(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Trenta_especial').val(parseFloat($('#Tcosto_especial').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
  $('#Ttotal_cotizacion').val(parseFloat($('#Ttotal_cotizacion').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}

function currencyMask(value, locale = 'en-US') {
  if (value === null || value === undefined || value === '') return '';
  // quitar separadores previos (comas) y espacios
  const clean = String(value).replace(/,/g, '').trim();
  const num = Number(clean);
  if (isNaN(num)) return '';
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

function currencyMask2(elemento) {
  elemento.val(parseFloat(elemento.val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
}