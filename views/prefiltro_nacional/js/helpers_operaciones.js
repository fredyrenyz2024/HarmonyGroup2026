window.datosnuevos = {
    web: '',
    user_satelite: '',
    clave: '',
    // nompro: '',
    docupro: '',
    // nomtene: '',
    docutene: '',
    // nomcondu: '',
    docucondu: '',
};

window.cont = 0;
window.m = 0;
window.contador_global1 = 0;


window.numero = 0;
/* Funciones para el area de operaciones */
function preestudio(element) {
    var elemento = $(element);
    var cotiza = elemento.data('id');
    var num = elemento.data('id2');
    var cliente = elemento.data('id3');
    var item = elemento.data('id4');
    var pareja = elemento.data('id5');
    var flete = elemento.data('id6');
    var pesoneto = elemento.data('id7'); //peso bruto tonelada
    var tipo_servicio = elemento.data('id8');
    var tarifa = elemento.data('id9');
    var origen = elemento.data('id10');
    var itr = elemento.data('id11');
    var empresa = elemento.data('id12');
    var escenario = elemento.data('id13');
    var cod_origen = elemento.data('id14');
    var cod_destino = elemento.data('id15');
    // $("#empresa_cliente").val(empresa);

    listar_responsables();
    let fecha = document.getElementById("fecha_dia_solicitud").value;
    let hora = document.getElementById('hora_dia_solicitud').value;
    let usuario = document.getElementById('ssn_nombre').value;

    /* Titulo del offcanva */
    myOffcanvas.updateTitle(`<span class="text-dark uil uil-car"></span> Consultar vehículo`);

    /* Contenido del offcanva */
    myOffcanvas.updateContent(`
    <div class="d-flex justify-content-center align-items-center w-100">
        <div class="row w-100">
            <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <label>N° solicitud</label>
                <input type="text" id="servicio_base" class="form-control form-control-sm text-center" value='${num}' disabled>
            </div>

            <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <label class="text-center">Tipo servicio</label>
                <input type="text" id="tipo_base" class="form-control form-control-sm text-center" value='${tipo_servicio}' disabled>
            </div>

            <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <label>Placa</label>
                <input type="text" id="placa" class="form-control form-control-sm text-center" oninput="this.value = this.value.toUpperCase();">
                <input type="hidden" id="proceso_itr" class="form-control form-control-sm text-center" value='${itr}'>
            </div>

            <div class="col-xs-3 col-md-3 col-sm-3 col-lg-3">
                <br>
                <button class="btn btn-primary btn-sm" onclick="ValidacionReglaNegocio();" style="width: 100%;">
                    <span class="uil uil-search"></span> Buscar
                </button>
            </div>

            <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <input type="hidden" id="origen_base" class="form-control form-control-sm" readonly="readonly" name="origen_de_base">
                <input type="hidden" id="empresa_cliente" class="form-control form-control-sm" readonly="readonly" name="empresa_cliente" value='${empresa}'>
            </div>
        </div>
    </div>

    <div id="nexos_messages_popup"></div>
    <!--CABECERA-->
    <h4 id="nexos_messages_b1"></h4>
    <h4 id="nexos_messages_b2"></h4>
    <div id="historicos"></div>
    <div id="mensaje_itr"></div>

    <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div id="historico"></div>
            <div id="historico_vencido"></div>
        </div>
    </div>

    <div class="row pt-2" id="controles_tipo">
        <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 thv" style="display:none;">
            <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                <input type="hidden" id="estado_vehiculo">
                <label><b>Tipo de operación:</b>&nbsp;<span style="color:red;"><i>(*)</i></span></label>
            </div>
            <div class="d-flex justify-content-center">
               <!-- <div id="divnuevo" class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style="display:none;">
                    <input type="radio" id="nuevo" class="tipo_hoja" name="gender" value="1" style="width: 20px; height: 20px;">
                    <label for="nuevo" id="nuevo2">Nuevo</label>&nbsp;&nbsp;
                </div>

                <div id="divhabil" class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style="display:none;">
                    <input type="radio" id="habil" class="tipo_hoja" name="gender" value="2" style="width: 20px; height: 20px;">
                    <label for="habil" id="habil2">Habilitar</label>&nbsp;&nbsp;
                </div>

                <div id="divactualiza" class="col-xs-3 col-sm-3 col-md-3 col-lg-3" style="display:none;">
                    <input type="radio" id="update" class="tipo_hoja" name="gender" value="3" style="width: 20px; height: 20px;">
                    <label for="update" id="update2">Actualizar</label>
                </div>-->

                <div class="form-check form-check-inline" id="divnuevo" style="display:none;">
                    <input class="form-check-input tipo_hoja" id="nuevo" type="radio" name="gender" value="1" style='transform: scale(1.2);'>
                    <label class="form-check-label" for="nuevo">Nuevo</label>
                </div>
                <div class="form-check form-check-inline" id="divhabil" style="display:none;">
                    <input class="form-check-input tipo_hoja" id="habil" type="radio" name="gender" value="2" style='transform: scale(1.2);'>
                    <label class="form-check-label" for="habil" id='habil2'>Habilitar</label>
                </div>
                <div class="form-check form-check-inline" id="divactualiza" style="display:none;">
                    <input class="form-check-input tipo_hoja" id="update" type="radio" name="gender" value="3" style='transform: scale(1.2);'>
                    <label class="form-check-label" for="update" id='update2'>Actualizar</label>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <!--estados de prefiltro -->
        <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
            <input type="hidden" id="tiporadio" class="form-control input-sm">
        </div>
        <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
            <label>Último estado (prefiltro):</label>
            <input type="text" id="estado_prefiltron" class="form-control text-danger input-sm" disabled="disabled" style="border:0px; background-color:white; font-weight:700;">
            <input type="hidden" id="solianterior" class="form-control input-sm">
        </div>
    </div>

    <!-- Pleacholders de cargando -->
    <div class="row p-1" id='placheolders' style='display:none;'>
        <p class="placeholder-glow py-1"><span class="placeholder col-12"></span></p>
        <p class="placeholder-glow py-1"><span class="placeholder col-8"></span></p>
        <p class="placeholder-glow py-1"><span class="placeholder col-6"></span></p>
        <p class="placeholder-glow py-1"><span class="placeholder col-4"></span></p>
    </div>

    <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" id="mensaje_vehiculo_bloquear"></div>
    <div class="col-xs-6 col-sm-12 col-md-12 col-lg-12" id="mensaje_inciado"></div>
    <!--CUERPO EDITAR PREESTUDIO-->
    <div class="row" style="padding-right:1px; padding-left:1px; padding-bottom:1px;  padding-top:1px;" id="diveditardatos">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"></div>
    </div>

    <!--CUERPO DEL VEHICULO PREESTUDIO CREAR PREESTUDIO-->
    <div class="row" id="divdatos">
      <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
        <div id="accordion1" class="panel-group accordion">
          <!-- Acordeon Itr -->
<div class="accordion" id="datos_proveedores" style="display:none;">
  <div class="accordion-item border-top">
    <h2 class="accordion-header" id="collapseredatositr">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDatosItr" aria-expanded="true" aria-controls="collapseDatosItr">Datos ITR</button>
    </h2>
  </div>

  <div class="accordion-collapse collapse" aria-labelledby="collapseredatositr" id="collapseDatosItr">
    <div class="accordion-body pt-0">
      <!-- Validar los datos del vehiculo para el otro servio itr -->
      <div class="datos_proveedores">
        <table cellpadding="0" cellspacing="0" width="100%" border="0" style="background-color: #332D2D;color:#fff;">
          <tbody>
            <tr>
              <td class="celda_titulo2 text-center" style="margin:25px;">
                <b>Datos del Vehículo</b>
              </td>
            </tr>
          </tbody>
        </table>
        <table cellpadding="0" cellspacing="0" width="100%" id="tbl_datos_prefiltro">
          <tbody>
            <tr class="text-center active">
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Propietario</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
            </tr>
            <tr>
              <td id="vpropi" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="vpdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="cpropi" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="accion_propietario" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
            </tr>
            <tr class="text-center active">
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Poseedor</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
            </tr>
            <tr>
              <td id="vtene" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="vtdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="ctene" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="accion_poseedor" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
            </tr>
            <tr class="text-center active">
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Conductor</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
            </tr>
            <tr>
              <td id="vcondu" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="vcdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="ccondu" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="accion_conductor" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
            </tr>
            <tr class="text-center active">
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Nombre Propietario Trailer</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Propietarioi Trailer</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Celular</th>
              <th style="color: #332D2D;background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Acción</th>
            </tr>
            <tr>
              <td id="ptcondu" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="ptcdocumento" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
              <td id="cpropt" class="text-left" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;"> </td>
              <td id="accion_propietario_trailer" class="text-left" style="border: 1px solid rgb(221, 221, 221); padding: 1px; width: auto; white-space: nowrap; background-color: rgb(255, 255, 255);"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

          <div class="accordion" id="hvpreestudio" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Datos del vehículo</button>
              </h2>
            </div>

            <div class="accordion-collapse collapse" aria-labelledby="headingOne" id="collapseOne">
              <div class="accordion-body pt-0">
                <div class="row">
                  <div class="sms"></div>
                  <div class="col-xs-12 col-md-6 col-sm-6 col-lg-6">
                    <label  class="form-label" for="placag">Placa Vehiculo&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="placag" class="form-control form-control-sm" disabled="disabled">
                  </div>
                  <div class="col-xs-12 col-md-6 col-sm-6 col-lg-6">
                    <label  class="form-label" for="placag">Configuración Vehiculo&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <select name="configuracion_vehiculo" id="configuracion_vehiculo" class="form-control form-control-sm">
                        <option selected="selected" value=""> </option>
                        <option value="2">Camión dos ejes - PBV mas de 10500 Kg </option>
                        <option value="2_7_8">Camión dos ejes - Livianos PBV 7500-8000 Kg </option>
                        <option value="2_8_9">Camión dos ejes - Livianos PBV 8001-9000 Kg </option>
                        <option value="2_9_105">Camión dos ejes - Livianos PBV 9001-10500 Kg </option>
                        <option value="2S2">Tractocamión dos ejes con semiremolque de dos ejes</option>
                        <option value="2S3">Tractocamión dos ejes con semiremolque de tres ejes</option>
                        <option value="3">Camión tres ejes </option>
                        <option value="3S2">Tractocamión tres ejes con semiremolque de dos ejes</option>
                        <option value="3S3">Tractocamión tres ejes con semiremolque de tres ejes</option>
                        <option value="V2">Volqueta dos ejes </option>
                        <option value="V3">Volqueta tres ejes </option>
                        <option value="V4">Volqueta cuatro ejes </option>
                    </select>
                  </div>
                  <div class="col-xs-12 col-md-6 col-sm-6 col-lg-4">
                    <label  class="form-label" for="web">Web Sátelital&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="web" name="web" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-12 col-md-6 col-sm-6 col-lg-4">
                    <label  class="form-label" for="user_satelite">Usuario&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="user_satelite" name="user_satelite" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-12 col-md-6 col-sm-6 col-lg-4">
                    <label  class="form-label" for="clave">Clave&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="clave" name="clave" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
                    <label  class="form-label" for="docupro">Documento Propietario&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="number" id="docupro" name="docupro" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
                    <label  class="form-label" for="nompro">Nombre Propietario&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="nompro" name="nompro" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
                    <div id="mensaje_propietario_existe"></div>
                  </div>
                  <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
                    <label  class="form-label" for="docutene">Documento Poseedor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="number" id="docutene" name="docutene" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
                    <label  class="form-label" for="nomtene">Nombre Poseedor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="nomtene" name="nomtene" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
                    <div id="mensaje_poseedor_existe"></div>
                  </div>
                  <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
                    <label class="form-label" for="docucondu">Documento Conductor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="number" id="docucondu" name="docucondu" class="form-control form-control-sm" onChange="javascript:referencias_prefiltro();">
                  </div>
                  <div class="col-xs-6 col-md-6 col-sm-6 col-lg-6">
                    <label  class="form-label" for="nomcondu">Nombre Conductor&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="nomcondu" name="nomcondu" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
                    <div id="mensaje_conductor_existe"></div>
                  </div>

                  <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12 mt-2">
                    <div class="p-2">
                     <!-- <h5 style="font-weight: bold;">Datos Trailer&nbsp;&nbsp;&nbsp;&nbsp;  <input type="checkbox" id="propietario_obligatorio" style="transform: scale(1.2);"> </h5>-->
                        <div class="form-check form-switch">
                            <input class="form-check-input" id="propietario_obligatorio" type="checkbox">
                            <label class="form-check-label" for="propietario_obligatorio">Datos Traile</label>
                        </div>
                    </div>
                  </div>

                  <div class="col-xs-12 col-md-4 col-sm-4 col-lg-4">
                    <label class="form-label" for="placat" id="etiqueta_placa_trailer">Placa Trailer </label>
                    <input type="text" id="placat" name="placat" disabled class="form-control form-control-sm">
                  </div>

                  <div class="col-xs-12 col-md-4 col-sm-4 col-lg-4">
                    <label class="form-label" for="docproptrailer" id="etiqueta_documento_trailer">Documento Propietario Trailer</label>
                    <input type="number" id="docproptrailer" name="docproptrailer" class="form-control form-control-sm" disabled>
                  </div>

                  <div class="col-xs-12 col-md-4 col-sm-4 col-lg-4">
                    <label class="form-label" for="nomproptrailer" id="estiqueta_propietario_trailer">Nombre Propietario Trailer</label>
                    <input type="text" id="nomproptrailer" name="nomproptrailer" class="form-control form-control-sm" disabled>
                  </div>

                  <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
                    <div id="mensaje_trailer_existe"></div>
                    <div id="mensaje_trailer_obligatorio" style="margin-top: 5px;"></div>
                  </div>

                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <input type="hidden" id="cab" value="1">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- REFERENCIAS PARA VEHICULO NUEVO -->
          <div class="accordion" id="panel_referenciaNEW" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="collapsereferencianew">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwos" aria-expanded="true" aria-controls="collapseTwos">Referencias laborales</button>
              </h2>
            </div>
            <div id="collapseTwos" class="accordion-collapse collapse" aria-labelledby="collapsereferencianew">
              <div class="accordion-body pt-0">
                <!--REFERENCIAS PARA VEHICULOS NUEVOS -->
                <div class="col-xs-6 col-sm-2 col-md-2 col-lg-2" style="margin-top:10px; text-align:center; ">
                  <button class="btn btn-primary btn-sm me-1 mb-1 my-0 text-center" data-toggle="tooltip" data-placement="top" title="Agregar fila" id="agregar_fila">
                    <span class="uil uil-file-plus-alt"></span>
                  </button>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id='contenedor_referencias'>
                  <!--<table class="table table-sm table-bordered" id="table_mercancia">
                    <thead style="border-color:blue;"></thead>
                    <tbody></tbody>
                  </table>-->
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <input type="hidden" id="ref" value="2">
                </div>
              </div>
            </div>
          </div>
          <!--FIN REFERENCIA PARA VEHICULOS NUEVOS -->

          <!--REFERENCIAS PARA ACTUALIZAR y HABILITAR  -->
          <div class="accordion" id="panel_referenciahv" style="display:none;">
                <div class="accordion-item border-top">
                <h2 class="accordion-header" id="headingReferer">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsereferencia" aria-expanded="true" aria-controls="collapsereferencia">Referencias Empresariales</button>
                </h2>
                </div>
                <div id="collapsereferencia" class="accordion-collapse collapse" aria-labelledby="headingReferer">
                <div class="accordion-body pt-0">
                    <input type="hidden" id="idconductor">
                    <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <span class="badge badge-pill badge-primary">1</span>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-12 REmpresarial8">
                        <label>Empresa 1:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                        <input type="text" class="form-control input-sm" id="referencias_empresariales1" >
                        <label id="error_referencia_empresarial2"></label>
                    </div>

                    <div class="col-xs-6 col-sm-6 col-md-6">
                        <label>Fecha Ingreso:</label>
                        <input type="date" id="fingreso1" class="form-control input-sm">
                    </div>

                    <div class="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Fecha Retiro:</label>
                        <input type="date" id="fretiro1" class="form-control input-sm">
                    </div>

                    <div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <label>Persona Contacto:</label>
                        <input type="text" id="contacto_ref1" placeholder="Nombre Contacto" class="form-control input-sm" >
                        <label id="error_contacto"></label>
                    </div>

                    <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <label>Celular Empresa:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                        <input type="int" id="celular_ref1" placeholder="Celular Empresa" maxlength="10" class="form-control input-sm">
                        <label id="error_celularref1"></label>
                    </div>

                    <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
                        <label>Cargo:</label>
                        <input type="text" id="cargo_ref1" placeholder="Cargo" class="form-control input-sm" >
                        <label id="error_cargo"></label>
                    </div>
                    <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
                        <label>Antiguedad</label>
                        <input type="number" id="anti_ref1" min="0" placeholder="Antiguedad1" class="form-control input-sm">
                    </div>
                    <input type="hidden" id="idrl1">
                    </div>
                    <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <span class="badge badge-pill badge-primary">2</span>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-12  REmpresarial8">
                        <label>Empresa 2:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                        <input type="text" class="form-control input-sm" id="referencias_empresariales2" >
                        <label id="error_referencia_empresarial2"></label>
                    </div>

                    <div class="col-xs-6 col-sm-6 col-md-6">
                        <label>Fecha Ingreso:</label>
                        <input type="date" id="fingreso2" class="form-control input-sm">
                    </div>

                    <div class="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Fecha Retiro:</label>
                        <input type="date" id="fretiro2" class="form-control input-sm">
                    </div>

                    <div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <label>Persona Contacto:</label>
                        <input type="text" id="contacto_ref2" placeholder="Nombre Contacto" class="form-control input-sm" >
                        <label id="error_contacto"></label>
                    </div>

                    <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <label>Celular Empresa:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                        <input type="int" id="celular_ref2" placeholder="Celular Empresa" maxlength="10" class="form-control input-sm">
                        <label id="error_celularref1"></label>
                    </div>

                    <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
                        <label>Cargo:</label>
                        <input type="text" id="cargo_ref2" placeholder="Cargo" class="form-control input-sm" >
                        <label id="error_cargo"></label>
                    </div>
                    <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
                        <label>Antiguedad</label>
                        <input type="number" id="anti_ref2" min="0" placeholder="Antiguedad2" class="form-control input-sm">
                    </div>
                    <input type="hidden" id="idrl2">
                    </div>
                    <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <span class="badge badge-pill badge-primary">3</span>
                    </div>

                    <div class="col-xs-12 col-sm-12 col-md-12  REmpresarial8">
                        <label>Empresa 3:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                        <input type="text" class="form-control input-sm" id="referencias_empresariales3" >
                        <label id="error_referencia_empresarial2"></label>
                    </div>

                    <div class="col-xs-6 col-sm-6 col-md-6">
                        <label>Fecha Ingreso:</label>
                        <input type="date" id="fingreso3" class="form-control input-sm">
                    </div>

                    <div class="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <label>Fecha Retiro:</label>
                        <input type="date" id="fretiro3" class="form-control input-sm">
                    </div>

                    <div class="form-group col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <label>Persona Contacto:</label>
                        <input type="text" id="contacto_ref3" placeholder="Nombre Contacto" class="form-control input-sm" >
                        <label id="error_contacto"></label>
                    </div>

                    <div class="form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
                        <label>Celular Empresa:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                        <input type="int" id="celular_ref3" placeholder="Celular Empresa" maxlength="10" class="form-control input-sm">
                        <label id="error_celularref1"></label>
                    </div>

                    <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
                        <label>Cargo:</label>
                        <input type="text" id="cargo_ref3" placeholder="Cargo" class="form-control input-sm" >
                        <label id="error_cargo"></label>
                    </div>
                    <div class="form-group col-xs-12 col-sm-4 col-md-4  col-lg-4">
                        <label>Antiguedad</label>
                        <input type="number" id="anti_ref3" min="0" placeholder="Antiguedad3" class="form-control input-sm">
                    </div>
                    <input type="hidden" id="idrl3">
                    </div>
                </div>
                </div>
          </div>

          <!--REFERENCIAS PERSONALES solo para habilitar-actualizar -->
          <div class="accordion" id="panel_refepersonal" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingReferer">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsepersonal" aria-expanded="true" aria-controls="collapsepersonal">Persona Contacto y Referencia</button>
              </h2>
            </div>
            <div id="collapsepersonal" class="accordion-collapse collapse">
              <div class="accordion-body pt-0">
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label><strong>Contacto en caso de emergencia</strong></label>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="badge badge-pill badge-primary">1</span>
                  </div>
                  <div class="col-xs-12 col-sm-3 col-md-3 REmpresarial2">
                    <label>Nombre Persona 1:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input class="form-control form-control-sm" id="referencias_personales1" >
                    <label id="error_referencias_personales"></label>
                  </div>
                  <div class="col-xs-12 col-sm-3 col-md-3 FPersonal1">
                    <label>Fecha 1:</label>
                    <input type="date" id="fecha_personal1" class="form-control form-control-sm">
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
                    <label>Parentezco:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <select class="form-select form-select-sm" id="parenp1">
                      <option value="" readonly="readonly">Seleccione una opción</option>
                      <option value="1">Amigo/a</option>
                      <option value="2">Hermano/a</option>
                      <option value="3">Padre</option>
                      <option value="4">Madre</option>
                      <option value="5">Tio/a</option>
                      <option value="6">Sobrino/a</option>
                      <option value="7">Hijo/a</option>
                      <option value="8">Espaso/a</option>
                    </select>
                    <label id="error_referencias_personales"></label>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
                    <label>Teléfono:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="number" id="telefonop1" min="0" class="form-control form-control-sm" maxlength="10">
                    <label id="error_referencias_personales"></label>
                  </div>
                  <div class="col-xs-12 col-sm-3 col-md-3 REmpresarial2">
                    <input type="hidden" id="idrper1">
                  </div>
                </div>
                <!-- Referencias personales -->
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label><strong>Referencia personal</strong></label>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <span class="badge badge-pill badge-primary">2</span>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 RPersonal2">
                    <label>Nombre Persona 2:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" class="form-control form-control-sm" id="referencias_personales2" >
                    <label id="error_referencias_personales"></label>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 FRpersonal2">
                    <label>Fecha Personal 2:</label>
                    <input type="date" id="fecha_personal2" class="form-control form-control-sm" value="">
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
                    <label>Parentezco:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <select class="form-select form-select-sm" id="parenp2">
                      <option value="" readonly="readonly">Seleccione una opción</option>
                      <option value="1">Amigo/a</option>
                      <option value="2">Hermano/a</option>
                      <option value="3">Padre</option>
                      <option value="4">Madre</option>
                      <option value="5">Tio/a</option>
                      <option value="6">Sobrino/a</option>
                      <option value="7">Hijo/a</option>
                      <option value="8">Espaso/a</option>
                    </select>
                    <label id="error_referencias_personales"></label>
                  </div>
                  <div class="col-xs-12 col-sm-6 col-md-3 REmpresarial2">
                    <label>Teléfono:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="number" id="telefonop2" min="0" class="form-control form-control-sm" maxlength="10">
                    <label id="error_referencias_personales"></label>
                  </div>
                  <div class="col-xs-12 col-sm-3 col-md-3 REmpresarial2">
                    <input type="hidden" id="idrper2">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="accordion" id="panel_solicitudes" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingDatosSolicitud">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="true" aria-controls="collapsepersonal">Datos de la solicitud</button>
              </h2>
            </div>
            <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingDatosSolicitud">
              <div class="accordion-body pt-0">
                <!--MODAL SOLICITUDES SERVICIO - cargarlas 
                <div id="solicitudservicio" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary" style="overflow-y:auto;">
                  <div class=".modal-dialog-modal-lg.modal-dialog ">
                    <div class="modal-content ">
                      <div class="modal-header">
                        <button type="button" id="cancel" class="close md-close"><span class="mdi mdi-close"></span></button>
                        <h3 class="modal-title">
                          <label style="font-weight:900; margin-top:20px;">
                            Solicitudes de servicio
                          </label>
                        </h3>
                      </div>
                      <div class="modal-body" style=" margin-top:20px; margin-bottom:20px;  margin-right:20px; margin-left:20px;">
                        <div id="nexos_messages_popup"></div>
                        <div class="row">
                          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <label>Listas seleccionadas</label>
                            <ul id="listamodal"></ul>
                          </div>
                          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <table id='table2' class='table table-striped table-hover' data-page-length='100'>
                              <thead>
                                <tr>
                                  <th>Solicitud</th>
                                  <th>Mercancía</th>
                                  <th>Item</th>
                                  <th>Origen</th>
                                  <th>Destino</th>
                                  <th>Peso(Kg) / Tipo vehiculo</th>
                                  <th>Cliente</th>
                                  <th>Tipo</th>
                                  <th>Acciones</th>
                                </tr>
                              </thead>
                              <tbody id="tbl-solicitudes-consolidadas"></tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" id="cancel" class="btn btn-default md-close">Cancelar</button>
                      </div>
                    </div>
                  </div>
                </div>
                SOLICITUD DE PREESTUDIO -->
                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:600; margin-top:20px;"> Solicitudes de servicio: </label>&nbsp;&nbsp;
                    <button type="button" class="btn btn-primary btn-sm me-1 mb-1 my-0" id="btn_soli" data-bs-toggle="modal" data-bs-target="#solicitudservicio"><span class="uil-shopping-cart-alt"></span></button>
                  </div>
                </div>

                <div class="row">
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <label style="font-weight:800; margin-top:20px;">Solicitudes de servicio seleccionadas</label>
                    <input type="hidden" id="maxservi" value="1">
                  </div>

                  <div class="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                    <input type="hidden" value="3" id="soli_total">
                  </div>

                  <style type="text/css">
                    .seleccionada {
                      background-color: #0585C0;
                      color: white;
                    }
                  </style>
                  
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="cuerpo_lista2"></div>

                  <!-- <div class="row"></div> -->
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="totalizar"></div>

                  <!-- <div class="row"></div> -->
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" id="cuerpo_fechas"></div>
                </div>

                <div class="row">
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <label>Total sumatoria Peso(Kg)</label>
                    <input type="text" id="total_pesos" class="form-control form-control-sm" disabled>
                  </div>
                  <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <label>Capacidad carga vehículo(Kg)&nbsp;<span style="color:red;"><i>(*)</i></span></label>
                    <input type="text" id="capa_carga_vh" class="form-control form-control-sm">
                  </div>
                </div>

                <div class="row">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Solicitud de Preestudio</label>
                  </div>
                  <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
                    <label>Fecha</label>
                    <input type="text" id="fpree" value="${fecha}" class="form-control form-control-sm" disabled>
                  </div>
                  <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
                    <label>Hora</label>
                    <input type="text" id="hpree" value="${hora}" class="form-control form-control-sm" disabled>
                  </div>
                  <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
                    <label>Usuario</label>
                    <input type="text" id="userpree" class="form-control form-control-sm" value="${usuario}" disabled>
                  </div>
                  <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12">
                    <label>Observaciones</label>
                    <textarea id="obserpree" class="form-control form-control-sm"></textarea>
                  </div>
                  <input type="hidden" id="id_consolidacion" class="form-control form-control-sm" disabled>
                </div>
              </div>
            </div>
          </div>

          <div class="accordion" id="panel_seguridad" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingUpdateData">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_update" aria-expanded="true" aria-controls="collapse_update">Actualiza Seguridad (hojas de vida)</button>
              </h2>
            </div>
            <div id="collapse_update" class="accordion-collapse collapse" aria-labelledby="headingUpdateData">
              <div class="accordion-body pt-0">
                <div id="msg_alerta" class="py-2"></div>
                <div class="row pt-3">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div class="row">
                      <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <h4><span class="uil-list-ui-alt"></span> Recursos actuales</h4>
                      </div>
                      <div class="col-sm-6 col-md-6 col-lg-6"></div>
                      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                        <div class="mb-1">
                          <label>Vehículo</label>
                          <input type="text" class="form-control form-control-sm fs-10" id="veh_vehiculo" disabled>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                        <div class="mb-1">
                          <label>Conductor</label>
                          <input type="text" class="form-control form-control-sm fs-10" id="veh_conduc" disabled>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                        <div class="mb-1">
                          <label>Propietario</label>
                          <input type="text" class="form-control form-control-sm fs-10" id="veh_propiet" disabled>
                        </div>
                      </div>
                      <div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                        <div class="mb-1">
                          <label>Poseedor</label>
                          <input type="text" class="form-control form-control-sm fs-10" id="veh_poseed" disabled>
                        </div>
                      </div>
                    </div>
                    <hr class="my-1 text-dark">
                    <div class="d-flex justify-content-center">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input recursos_checbox" id="cbox1" type="checkbox" value="nuevo_recurso" style="transform: scale(1.3);">
                        <label class="form-check-label fs-12" for="cbox1">Nuevo recurso</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input recursos_checbox" id="cbox2" type="checkbox" value="datos_dinamicos" style="transform: scale(1.3);">
                        <label class="form-check-label fs-12" for="cbox2">Datos dinámicos</label>
                      </div>
                    </div>
                    <hr class="my-1 text-dark">
                  </div>
                </div>

                <!-- TABS INICIO -->
                <div class="row panel_tabs_recursos pt-3">
                  <div class="col-sm-12 col-md-12 col-lg-12">
                    <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                      <li class="nav-item re_inexis"><a class="nav-link active" data-bs-toggle="tab" href="#home2" role="tab" aria-controls="home2" aria-selected="true" style="display: none;" id="creacion_nuevo_recuro">Creación de recursos nuevos</a></li>
                      <li class="nav-item re_dinamic"><a class="nav-link" data-bs-toggle="tab" href="#profile2" role="tab" aria-controls="profile2" aria-selected="false" style="display: none;" id="datos_dinamicos">Datos dinámicos</a></li>
                      <!-- <li class="nav-item"><a class="nav-link" id="contact-tab" data-bs-toggle="tab" href="#tab-contact" role="tab" aria-controls="tab-contact" aria-selected="false">Contact</a></li> -->
                    </ul>

                    <div class="tab-content mt-3" id="myTabContent">
                      <div class="tab-pane fade show active re_inexis" id="home2" role="tabpanel" aria-labelledby="home2">
                        <div class="panel panel-border-color panel-border-color-dark" id="inexistente_actividades"><!-- recurso -->
                          <div class="panel-body text-center" style="padding: 1px 1px 1p;">

                            <div class="d-flex justify-content-center">
                              <div class="form-check form-check-inline">
                                <input class="form-check-input chebox_recurso" id="cbpre1" type="checkbox" value="Propietario" style="transform: scale(1.3);">
                                <label class="form-check-label fs-12" for="cbpre1">Propietario</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input class="form-check-input chebox_recurso" id="cbpre2" type="checkbox" value="Poseedor" style="transform: scale(1.3);">
                                <label class="form-check-label fs-12" for="cbpre2">Poseedor</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input class="form-check-input chebox_recurso" id="cbpre3" type="checkbox" value="Conductor" style="transform: scale(1.3);">
                                <label class="form-check-label fs-12" for="cbpre3">Conductor</label>
                              </div>
                              <div class="form-check form-check-inline">
                                <input class="form-check-input chebox_recurso" id="cbpre4" type="checkbox" value="Trailer" style="transform: scale(1.3);">
                                <label class="form-check-label fs-12" for="cbpre4">Tráiler</label>
                              </div>
                            </div>

                          </div>
                        </div>

                        <!-- propietario -->
                        <div id="inexistente_propietario">
                          <div class="row">
                            <!-- <div class="panel-body"> </div> -->
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                              <div class="mb-1">
                                <label>Número Documento</label>
                                <input type="number" class="form-control form-control-sm" id="number_propietario">
                              </div>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                              <div class="mb-1">
                                <label>Nombre completo propietario</label>
                                <input type="text" class="form-control form-control-sm nombre_i" id="name_propietario">
                              </div>
                            </div>
                          </div>
                          <hr class="my-1 text-dark">
                        </div>

                        <!-- poseedor -->
                        <div id="inexistente_poseedor">
                          <div class="row">
                            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                              <label>Número Documento</label>
                              <input type="number" class="form-control form-control-sm" id="number_poseedor">
                            </div>
                            <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                              <label>Nombre completo poseedor</label>
                              <input type="text" class="form-control form-control-sm nombrei" id="name_poseedor">
                            </div>
                          </div>
                          <hr class="my-1 text-dark">
                        </div>

                        <!-- conductor-->
                        <div id="inexistente_conductor">
                          <div class="panel-body">
                            <div class="row">
                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <label>Número Documento</label>
                                <input type="number" class="form-control form-control-sm" id="number_conductor">
                              </div>
                              <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <label>Nombre completo conductor</label>
                                <input type="text" class="form-control form-control-sm nombre_i" id="name_conductor">
                              </div>
                            </div><br>
                            <div class="row">
                              <!-- Primera referencia -->
                              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" style="border-right:1px solid gray">
                                <span>Nombre Empresa</span>
                                <input type="text" class="form-control form-control-sm" id="referencias_empresariales1pre" >
                                <span>Persona Contacto</span>
                                <input type="text" id="contacto_ref1pre" placeholder="Nombre Contacto" class="form-control form-control-sm" >
                                <span>Celular Empresa</span>
                                <input type="number" id="celular_ref1pre" placeholder="Celular Empresa" maxlength="10" class="form-control form-control-sm">
                                <span>Cargo</span>
                                <input type="text" id="cargo_ref1pre" placeholder="Cargo" class="form-control input-sm" >
                                <span>Fecha ingreso 1</span>
                                <input type="date" id="fingresoa1pre" class="form-control form-control-sm">
                                <span>Fecha ingreso 2</span>
                                <input type="date" id="fretiroa3pre" class="form-control form-control-sm">
                                <span>Antiguedad</span>
                                <input type="number" id="anti_ref1pre" min="0" class="form-control form-control-sm">
                              </div>
                              <!-- Segunda referencia -->
                              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" style="border-right:1px solid gray">
                                <span>Nombre Empresa</span>
                                <input type="text" class="form-control form-control-sm" id="referencias_empresariales2pre" >
                                <span>Persona Contacto</span>
                                <input type="text" id="contacto_ref2pre" placeholder="Nombre Contacto" class="form-control form-control-sm" >
                                <span>Celular Empresa</span>
                                <input type="number" id="celular_ref2pre" placeholder="Celular Empresa" maxlength="10" class="form-control form-control-sm">
                                <span>Cargo</span>
                                <input type="text" id="cargo_ref2pre" placeholder="Cargo" class="form-control form-control-sm" >
                                <span>Fecha ingreso 1</span>
                                <input type="date" id="fingresob1pre" class="form-control form-control-sm">
                                <span>Fecha ingreso 2</span>
                                <input type="date" id="fretirob3pre" class="form-control form-control-sm">
                                <span>Antiguedad</span>
                                <input type="number" id="anti_ref2pre" min="0" class="form-control form-control-sm">
                              </div>
                              <!-- tercera referencia  -->
                              <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                                <span>Nombre Empresa</span>
                                <input type="text" class="form-control form-control-sm" id="referencias_empresariales3pre" >
                                <span>Persona Contacto</span>
                                <input type="text" id="contacto_ref3pre" placeholder="Nombre Contacto" class="form-control form-control-sm" >
                                <span>Celular Empresa</span>
                                <input type="number" id="celular_ref3pre" placeholder="Celular Empresa" maxlength="10" class="form-control form-control-sm">
                                <span>Cargo</span>
                                <input type="text" id="cargo_ref3pre" placeholder="Cargo" class="form-control form-control-sm" >
                                <span>Fecha ingreso 1</span>
                                <input type="date" id="fingresoc1pre" class="form-control form-control-sm">
                                <span>Fecha ingreso 2</span>
                                <input type="date" id="fretiroc3pre" class="form-control form-control-sm">
                                <span>Antiguedad</span>
                                <input type="number" id="anti_ref3pre" min="0" class="form-control form-control-sm">
                              </div>
                            </div>
                            <!--cierre del panel body -->
                          </div>
                          <hr class="my-1 text-dark">
                        </div>

                        <!-- vehiculo -->
                        <div class="panel panel-border-color panel-border-color-dark" id="inexistente_vehiculo">
                          <div class="panel-body">
                            <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                              <div class="mb-1">
                                <label>Placa vehículo</label>
                                <input type="text" class="form-control form-control-sm" id="placa_vehiculosat">
                              </div>
                            </div>
                            <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                              <div class="mb-1">
                                <label>URL satélital</label>
                                <input type="text" class="form-control form-control-sm" id="url_sat">
                              </div>
                            </div>
                            <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                              <div class="mb-1">
                                <label>Usuario satélital</label>
                                <input type="text" class="form-control form-control-sm" id="user_sat">
                              </div>
                            </div>
                            <div class="col-xs-6 col-sm-3 col-md-3 col-lg-3">
                              <div class="mb-1">
                                <label>Clave satélital</label>
                                <input type="text" class="form-control form-control-sm" id="pass_sat">
                              </div>
                            </div>
                          </div>
                          <hr class="my-1 text-dark">
                        </div>

                        <!--trailer -->
                        <div id="inexistente_trailer">
                          <div class="row">
                            <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4">
                              <label>Placa tráiler</label>
                              <input type="text" class="form-control form-control-sm" id="placa_trailerpre">
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <label>Número documento propietario tráiler</label>
                              <input type="text" class="form-control form-control-sm" id="propidocu_trailer">
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-4 col-lg-4">
                              <label>Nombre propietario tráiler</label>
                              <input type="text" class="form-control form-control-sm" id="propi_trailer">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="tab-pane fade re_dinamic" id="profile2" role="tabpanel" aria-labelledby="profile2">
                        <div class="row">
                          <div class="col-xs-12 col-sm-412col-md-12 col-lg-12">
                            <div class="input-group input-group-sm mb-3">
                              <label class="input-group-text" for="inputGroupSelect01">Tipo hoja de vida</label>
                              <select id="thv" class="form-select form-select-sm text-center">
                                <option value="">Seleccione</option>
                                <option value="propietario">Propietario</option>
                                <option value="conductor">Conductor</option>
                                <option value="tenedor">Tenedor</option>
                                <option value="vehiculo">Vehículo</option>
                                <option value="trailer">Trailer</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div class="row uno">
                          <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                            <div class="mb-1">
                              <input type="text" id="label" class="form-control form-control-sm" readonly="" style="font-size:12pt; text-align:center;">
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" id="elbtn">
                            <div class="mb-1">
                              <label>Campo actualizar: </label>
                              <input type='text' class='form-control form-control-sm' id='dato'>
                            </div>
                          </div>
                          <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" id="elbtn">
                            <div class="mb-1">
                              <label>Información actualizar: </label>
                              <input type='text' class='form-control form-control-sm' id='detalle'>
                            </div>
                          </div>
                          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 pt-4" id="elbtn">
                            <div class="mb-1">
                              <button id="agregue_tb" class="btn btn-phoenix-success btn-sm text-center"><span class="uil uil-plus-square"></span></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- <div class="tab-pane fade" id="tab-contact" role="tabpanel" aria-labelledby="contact-tab">Etsy mixtape wayfarers, ethical wes anderson tofu before they sold out mcsweeney's organic lomo retro fanny pack lo-fi farm-to-table readymade. Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.</div> -->
                    </div>
                  </div>
                </div>

                <!-- TABS FIN -->
                <!-- Tabla -->
                <div class="row panel_total_recursos pt-3">
                  <div class="col-sm-12 col-md-12 col-lg-12">
                    <div class="panel panel-default">
                      <table class="table table-hover table-bordered table-sm text-center" style=" font-size:12px;">
                        <thead>
                          <tr>
                            <th>Código</th>
                            <th>Tipo HV</th>
                            <th>Dato actualizar</th>
                            <th>Detalle</th>
                            <th>Archivo</th>
                          </tr>
                        </thead>
                        <tbody id="cuerpo_actu">
                        <tbody>
                      </table>
                      <input type="hidden" id="valortb" readonly="readonly">
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <!--DOCUMENTOS -->

          <!--documentos para actualizar-->
          <div class="accordion" id="panel_papeles_actualiza" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingUpdateData1">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#doc_update" aria-expanded="true" aria-controls="doc_update"><i class="icon mdi mdi-chevron-down"></i>Documentos Para Actualizar</button>
              </h2>
            </div>
            <div id="doc_update" class="accordion-collapse collapse" aria-labelledby="headingUpdateData1">
              <div class="accordion-body pt-0">
              </div>
            </div>
          </div>

          <!--documentos para habilitar-->
          <div class="accordion" id="panel_papeles_habilitar" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingUpdateData2">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#doc_habilitar" aria-expanded="true" aria-controls="doc_habilitar"><i class="icon mdi mdi-chevron-down"></i>Documentos Para Habilitar</a></button>
              </h2>
            </div>
            <div id="doc_habilitar" class="accordion-collapse collapse" aria-labelledby="headingUpdateData2">
              <div class="accordion-body pt-0">
                <div class="row">
                  <input type="hidden" id="deta_condu">
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <p class="text-center text-primary" style="font-size:14pt; margin-top:20px;"><strong>Documentos
                        obligatorios:</strong></p>
                    <hr>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Fotos del Conductor</label>

                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Fotos de Indumentaria</label>
                  </div>
                </div>
                <div class="row">
                  <p class="text-center text-primary" style="font-size:14pt; margin-top:20px;"><strong>Documentos
                      complementarios:</strong></p>
                  <hr>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Referencia laboral</label>
                    <table class="table">
                      <thead style="text-align:left;color:white; background-color:#FFA900;">
                        <tr>
                          <th style="width:3%;">#</th>
                          <th style="width:5%;">Documento/Img</th>
                          <th style="width:10%;">Nombre</th>
                          <th style="width:20%;">Actualice documento</th>
                        </tr>
                      </thead>
                      <tbody id="consulta_documentos">
                      </tbody>
                    </table>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Referencia Personal</label>
                    <table class="table">
                      <thead style="text-align:left;color:white; background-color:#FFA900;">
                        <tr>
                          <th style="width:3%;">#</th>
                          <th style="width:5%;">Documento/Img</th>
                          <th style="width:10%;">Nombre</th>
                          <th style="width:20%;">Actualice documento</th>
                        </tr>
                      </thead>
                      <tbody id="documentos_personal">
                      </tbody>
                    </table>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Licencia</label>
                    <table class="table">
                      <thead style="text-align:left;color:white; background-color:#FFA900;">
                        <tr>
                          <th style="width:3%;">#</th>
                          <th style="width:5%;">Documento/Img</th>
                          <th style="width:10%;">Nombre</th>
                          <th style="width:20%;">Actualice documento</th>
                        </tr>
                      </thead>
                      <tbody id="documentos_licencia">
                      </tbody>
                    </table>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Rut</label>
                    <table class="table">
                      <thead style="text-align:left;color:white; background-color:#FFA900;">
                        <tr>
                          <th style="width:3%;">#</th>
                          <th style="width:5%;">Documento/Img</th>
                          <th style="width:10%;">Nombre</th>
                          <th style="width:20%;">Actualice documento</th>
                        </tr>
                      </thead>
                      <tbody id="documentos_rut">
                      </tbody>
                    </table>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Eps</label>
                    <table class="table">
                      <thead style="text-align:left;color:white; background-color:#FFA900;">
                        <tr>
                          <th style="width:3%;">#</th>
                          <th style="width:5%;">Documento/Img</th>
                          <th style="width:10%;">Nombre</th>
                          <th style="width:20%;">Actualice documento</th>
                        </tr>
                      </thead>
                      <tbody id="documentos_eps">
                      </tbody>
                    </table>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Arl</label>
                    <table class="table">
                      <thead style="text-align:left;color:white; background-color:#FFA900;">
                        <tr>
                          <th style="width:3%;">#</th>
                          <th style="width:5%;">Documento/Img</th>
                          <th style="width:10%;">Nombre</th>
                          <th style="width:20%;">Actualice documento</th>
                        </tr>
                      </thead>
                      <tbody id="documentos_arl">
                      </tbody>
                    </table>
                  </div>
                  <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <label style="font-weight:800; margin-top:20px;">Curso Mercancías peligrosas</label>
                    <table class="table">
                      <thead style="text-align:left;color:white; background-color:#FFA900;">
                        <tr>
                          <th style="width:3%;">#</th>
                          <th style="width:5%;">Documento/Img</th>
                          <th style="width:10%;">Nombre</th>
                          <th style="width:20%;">Actualice documento</th>
                        </tr>
                      </thead>
                      <tbody id="documentos_peligro">
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--documentos nuevos-->
          <div class="accordion" id="panel_papeles" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingUpdateData3">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#documentos" aria-expanded="true" aria-controls="documentos"><i class="icon mdi mdi-chevron-down"></i>Documentos prefiltro</button>
              </h2>
            </div>
            <div id="documentos" class="accordion-collapse collapse" aria-labelledby="headingUpdateData3">
              <div class="accordion-body pt-2">
                <div class="row">
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <label>¿Desea Agregar un documento?</label>
                  </div>
                  <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 text-end">
                    <button class="btn btn-primary btn-sm me-1 mb-1 my-0" data-toggle="tooltip" data-placement="top" title="Agregar" id="agregar_docu"> Agregar Documentos</button>
                  </div>
                </div><br>
                <div class="row">
                    <div class='table-responsive p-1'>
                        <table class='table table-bordered table-sm' style=" font-size:12px;">
                            <thead>
                            <th class='text-center' style="color:black;width:auto; white-space: nowrap;">#</th>
                            <th class='text-center' style="color:black;width:auto; white-space: nowrap;">Tipo Hoja Vida</th>
                            <th class='text-center' style="color:black;width:auto; white-space: nowrap;">Clase</th>
                            <!--<th class='text-center' style="color:black;width:auto; white-space: nowrap;">Ruta</th>-->
                            <th class='text-center' style="color:black;width:auto; white-space: nowrap;">Subir</th>
                            <!--<th class='text-center' style="color:black;width:auto; white-space: nowrap;">Nombre Archivo</th>-->
                            <th class='text-center' style="color:black;width:auto; white-space: nowrap;">Acción</th>
                            </thead>
                            <tbody id="tabla_papeles"></tbody>
                        </table>
                    </div>
                </div>
                <input type="hidden" id="cont_papel">
                <input type="hidden" id="valor_documento" class="form-control input-sm" readonly="readonly" value="6">
              </div>
            </div>
          </div>

          <!--documento flete-placa -->
          <div class="accordion" id="panel_fletepk" style="display:none;">
            <div class="accordion-item border-top">
              <h2 class="accordion-header" id="headingSubasta">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo"><i class="icon mdi mdi-chevron-down"></i>Subasta</button>
              </h2>
            </div>
            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingSubasta">
              <div class="accordion-body pt-0">
                <div class="row">
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label>Placa</label>
                      <input type="text" id="su_placa" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label>Num. servicio</label>
                      <input type="text" id="su_servicio" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label>Flete sugerido</label>
                      <input type="text" id="su_fletecot" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label>Total flete propuesto</label>
                      <input type="text" id="su_propuesto" class="form-control form-control-sm" min="0">
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label>Total peso bruto(Tn)</label>
                      <input type="text" id="su_neto" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label title="sumatoria">Total peso Neto(Kg)</label>
                      <input type="text" id="su_sumatorianeto" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label>estado creación</label>
                      <input type="text" id="su_estado" value="pendiente" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <label>usuario creación</label>
                      <input type="text" id="su_user" class="form-control form-control-sm" value="${usuario}" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
                    <div class="mb-1">
                      <label>Fecha creación</label>
                      <input type="text" id="su_fecha" value="${fecha}" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
                    <div class="mb-1">
                      <label>Hora creación</label>
                      <input type="text" id="su_hora" value="${hora}" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
                    <div class="mb-1">
                      <label>Número subasta</label>
                      <input type="text" id="su_numsubasta" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <div class="col-xs-4 col-md-4 col-sm-4 col-lg-4">
                    <div class="mb-1">
                      <label>Responsable VehÍculo <span style="color:red;"><i>(*)</i></span></label>
                      <select name="responsable_vehiculo" id="responsable_vehiculo" class="form-control form-control-sm "></select>
                    </div>
                  </div>
                  <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <div class="mb-1">
                      <input type="hidden" id="su_tarifacot" class="form-control form-control-sm" disabled>
                    </div>
                  </div>
                  <input type="hidden" id="su_valida" class="form-control form-control-sm" disabled value="1">
                </div>
              </div>
            </div>
          </div>
          <!--FIN DOCUMENTOS -->
        </div>
        <!--GUARDAR SOLO  -->
        <!-- <div class="col-xs-12 col-md-12 col-sm-12 col-lg-12" id="divbotones">
              <button id="crear_preestudio" class="btn btn-success">Guardar</button>
            </div> -->
      </div>
    </div>
    <!--CUERPO DE LA SOLICITUD-->
    <div class="offcanvas-footer p-3 border-top text-center">
      <div class="d-flex justify-content-end align-content-between gap-3">
        <button type="button" id="btn_cerrar" data-bs-dismiss="offcanvas" aria-label="Close" class="btn btn-danger btn-sm me-1 my-0" id="cierremodal"><i class="fas fa-times"></i> Cancelar</button>
        <button id="crear_preestudio" class="btn btn-success btn-sm me-1 my-0" data-escenarioId='${escenario}' data-CodigoOrigen='${cod_origen}' data-CodigoDestino='${cod_destino}' data-NumdocSolicitud='${num}' ><i class="far fa-save"></i> Guardar Prefiltro</button>
      </div>
    </div>
    `);

    myOffcanvas.show();

    $('#cuerpo_lista2').html('');
    $('#totalfle').val('');
    $('#tottarifa').val('');

    if (itr === 'Si') {
        document.getElementById('mensaje_itr').innerHTML = `
            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                <p class="mb-0 flex-1 text-dark"><strong>Advertencia!</strong> Este Vehiculo sera clasificada como proceso ITR esta seguro.</p>
                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
        document.getElementById('proceso_itr').value = itr;
    }

    $('#servicio_base').val(num);
    $('#tipo_base').val(tipo_servicio);
    $('#origen_base').val(origen);
    $('#su_fletecot').val(flete);
    $('#su_servicio').val(num);
    $('#su_neto').val(pesoneto);
    $('#su_tarifacot').val(tarifa);
    if (tipo_servicio === 'Expreso') {
        document.getElementById('btn_soli').disabled = true;
    } else if (tipo_servicio === 'Consolidado') {
        document.getElementById('btn_soli').disabled = false;
    }

    $("#su_propuesto").change(function () {
        $('#su_propuesto').val(parseFloat($('#su_propuesto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    });

    $('#listamodal').html('<span class="badge badge-primary badge-pill" >' + num + '</span>');

    $('#cuerpo_lista2').html(`
        <div class="border rounded p-3 mb-3 bg-light prin${num}">
            <div class="row mb-2">
                <div class="col-md-1">
                    <label class="form-label">#</label>
                    <div class="form-control form-control-sm text-center bg-secondary text-white">${1}</div>
                </div>
                <div class="col-md-2">
                    <label class="form-label">Servicio</label>
                    <input type="hidden" id="servicio1" value="${num}" class="form-control form-control-sm fserva" name="fserva[]">
                    <div class="form-control form-control-sm bg-light">${num}</div>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Cotización</label>
                    <div class="form-control form-control-sm bg-light">${cotiza} (${item}) ${pareja}</div>
                </div>
                <div class="col-md-5">
                    <label class="form-label">Cliente</label>
                    <div class="form-control form-control-sm bg-light">${cliente}</div>
                </div>
                <div class="col-md-3">
                    <label class="form-label">Flete</label>
                    <input type="password" id="fl${num}" class="form-control form-control-sm tflete" value="${flete}" readonly onchange="javascript:currencyMask(this)">
                </div>
                <div class="col-md-4">
                    <label class="form-label">Tarifa</label>
                    <input type="hidden" id="tari${num}" class="form-control form-control-sm ttarifa" value="${tarifa}" readonly>
                    <div class="form-control form-control-sm bg-light">${tipo_servicio}</div>
                </div>
            </div>

            <!--<div class="row">
                <div class="col-md-4" style="display:none;">
                    <label class="form-label">Peso Neto</label>
                    <input type="text" class="form-control form-control-sm tneto2" value="${pesoneto}" readonly>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Tarifa</label>
                    <input type="hidden" id="tari${num}" class="form-control form-control-sm ttarifa" value="${tarifa}" readonly>
                    <div class="form-control form-control-sm bg-light">${tipo_servicio}</div>
                </div>
            </div>-->
        </div>
    `);

    $('#totalizar').html(`
        <div class="border rounded p-3 bg-white shadow-sm mb-3">
            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">Total Flete</label>
                    <input type="password" id="totalfle" class="form-control form-control-sm" value="${flete}" readonly>
                </div>
                <div class="col-md-4" style="display:none;">
                    <label class="form-label">Total Neto</label>
                    <input type="text" id="totalneto" class="form-control form-control-sm" value="${pesoneto}" readonly>
                </div>
                <div class="col-md-4">
                    <input type="hidden" id="tottarifa" class="form-control form-control-sm" value="${tarifa}" readonly>
                </div>
            </div>
        </div>
    `);

    //formatear
    $('#fl' + num).val(parseFloat($('#fl' + num).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    $('#totalfle').val(parseFloat($('#totalfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    $('#su_fletecot').val(parseFloat($('#su_fletecot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    $('#tari' + num).val(parseFloat($('#tari' + num).val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    $('#tottarifa').val(parseFloat($('#tottarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
    $('#su_tarifacot').val(parseFloat($('#su_tarifacot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());

    //VALIDAR SOLICITUD DE SERVICIO ANIDADAS
    let formdata = new FormData();
    formdata.append('solicitud_servicio_id', num);
    fetch($('#base_url').val() + 'validacionparametros/Validar_solicitud_agrupacion', {
        method: 'POST',
        cache: 'no-cache',
        body: formdata,
    })
        .then(response => response.json())
        .then(function (data) {
            if (data) {
                document.getElementById('id_consolidacion').value = data.agrupacion;
                // if (tipo_servicio === 'Consolidado') {}
                consulta_solicitudes_anidadas(data.agrupacion, num);
                fechas_cargue(data.agrupacion, num);
            } else {
                document.getElementById('id_consolidacion').value = '';
                fechas_cargue(0, num);
            }
        })
        .catch(error => {
            alert(error);
        });
}

$(document).on('click', '#btn_soli', function () { // Listar las solicitudes disponiblespara consolidar
    Listar_Solicitudes_Consolidadas();
});

//ACCIONES 
$(".uno").hide();
$(".dos").hide();
$("#agregue_tb").hide();
$("#label").hide();
$(".panel_papeles").hide();

$(document).on('change', '#thv', function () {
    var tipohv = $("#thv").val();
    $("#label").val(tipohv);
    if (tipohv == 'propietario' || tipohv == 'conductor' || tipohv == 'tenedor' || tipohv == 'vehiculo' || tipohv ==
        'trailer') {
        $(".uno").show();
        $(".dos").show();
        $("#agregue_tb").show();
        $("#label").show();
    } else {
        $(".uno").hide();
        $(".dos").hide();
        $("#agregue_tb").hide();
        $("#elbtn").hide();
        $("#label").hide();
    }
});

//Sugerir flete para aprobacion
function sugerir_flete(element) {
    var elemento = $(element);
    var idcotizacion = elemento.data("id");
    var idservicio = elemento.data("id2");
    var dato = {
        idcotizacion: idcotizacion,
        idservicio: idservicio,
        action: 'datos_sugerencia'
    };
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
            $("#s_fletecap").val('');
            $("#s_tarifa").val('');
            $("#s_calculo").val('');
            $("#s_rentabilidad").val('');
            if (data) {
                var p;
                if (data.result[0].tipo_carga == 'G') {
                    p = 'General';
                }
                if (data.result[0].tipo_carga == 'P') {
                    p = 'Paqueteo';
                }
                if (data.result[0].tipo_carga == 'C') {
                    p = 'Contenedor Cargado';
                }
                $("#s_cliente").val(data.result[0].nombre_cliente);
                $("#s_nsolicitud").val(idservicio);
                $("#s_vehiculo").val(data.result[0].tipovehiculo);
                $("#s_tipocarga").val(p);
                $("#s_mercancia").val(data.result[0].tipo_mercancia);
                $("#s_pesobruto").val(data.result[0].peso_bruto_kg);
                $("#s_pesnonetok").val(data.result[0].peso_neto_kg);
                $("#s_pesonetot").val(data.result[0].peso_neto_tn);
                $("#s_flete").val(data.result[0].flete);
                $("#s_rentactual").val(data.result[0].tmer_utili);
                $("#s_cotizacion").val(idcotizacion);
                $("#s_idservicio").val(idservicio);
                $("#s_tarifa").val(data.result[0].total_tarifa);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('error datos');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
    //consulta tabla
    var cons_table = {
        idcotizacion: idcotizacion,
        idservicio: idservicio,
        action: 'consulta_fletespropuesto'
    };
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: cons_table,
        dataType: 'json',
        success: function (data) {
            if (data) {
                var c = 0;
                $("#cuerpo_fletespropuestos").html('');
                data.result.forEach(function (element, index) {
                    c++;
                    var btn_anular = '';
                    if (element.estado == 2 && element.estado_actual == 1) {
                        btn_anular = '<button id="anular' + c +
                            '" class="btn btn-xs btn-danger mdi mdi-close-circle-o" title="Anular" onclick="Anular_propuesta(' +
                            element.id + ',' + c + ',' + element.idestado + ');"></button>';
                    }
                    var statu;
                    var color;
                    if (element.estado == 2) {
                        statu = 'Pendiente';
                        color = 'primary';
                    }
                    if (element.estado == 1) {
                        statu = 'Aprobado';
                        color = 'success';
                    }
                    if (element.estado == 3) {
                        statu = 'Anulado';
                        color = 'secondary';
                    }
                    if (element.estado == 4) {
                        statu = 'Rechazado';
                        color = 'danger';
                    }

                    $("#cuerpo_fletespropuestos").append('<tr>' +
                        '<td class="text-' + color + '">' + statu + '</td>' +
                        '<td>' + element.flete_nuevo + '</td>' +
                        '<td>' + element.fecha + '</td>' +
                        '<td>' + element.hora + '</td>' +
                        '<td>' + element.usuario + '</td>' +
                        '<td class="text-center">' + btn_anular + '</td>' +
                        '</tr>');
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

$("#s_fletecap").change(function () {
    var fle = $("#s_fletecap").val();
    //tarifa
    var tarifa = $("#s_tarifa").val();
    //calcular utilidad
    resta = (parseFloat(tarifa) - parseFloat(fle));
    calculo = (parseFloat(resta) / parseFloat(tarifa));
    res = (parseFloat(calculo) * 100);
    res = res.toFixed(2);
    $("#s_calculo").val(res);
    //calcular rentabilidad
    var rent = (parseFloat(tarifa) - parseFloat(fle));
    $("#s_rentabilidad").val(rent);
});

$("#btn_guadarp").click(function () {
    var msg_error = '';
    if (!$("#s_cliente").val()) {
        msg_error += "<p>El campo <strong>Cliente</strong> para poder registrar.</p>";
    }
    if (!$("#s_nsolicitud").val()) {
        msg_error += "<p>El campo <strong>N° solicitud</strong> para poder registrar.</p>";
    }
    if (!$("#s_vehiculo").val()) {
        msg_error += "<p>El campo <strong>Vehículo</strong> para poder registrar.</p>";
    }
    if (!$("#s_tipocarga").val()) {
        msg_error += "<p>El campo <strong>Tipo carga</strong> para poder registrar.</p>";
    }
    if (!$("#s_mercancia").val()) {
        msg_error += "<p>El campo <strong>Mercancía</strong> para poder registrar.</p>";
    }
    if (!$("#s_pesobruto").val()) {
        msg_error += "<p>El campo <strong>Peso Bruto</strong> para poder registrar.</p>";
    }
    if (!$("#s_pesnonetok").val()) {
        msg_error += "<p>El campo <strong>Peso Neto(kg)</strong> para poder registrar.</p>";
    }
    if (!$("#s_pesonetot").val()) {
        msg_error += "<p>El campo <strong>Peso Neto(Tn)</strong> para poder registrar.</p>";
    }
    if (!$("#s_flete").val()) {
        msg_error += "<p>El campo <strong>Flete cotización</strong> para poder registrar.</p>";
    }
    if (!$("#s_rentactual").val()) {
        msg_error += "<p>El campo <strong>Rentabilidad actual</strong> para poder registrar.</p>";
    }
    if (!$("#s_idservicio").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>N° solicitud</strong> para poder registrar.</p>";
    }
    if (!$("#s_fletecap").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Flete sugerido</strong> para poder registrar.</p>";
    }
    if (!msg_error) {
        Crear_Sugerencia();
    } else {
        $("#msg_posponerflete").html(
            '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            msg_error + '</div></div>');
        $("#cambiar_flete").animate({
            scrollTop: 0
        }, 600);
    }
});

function Anular_propuesta(idtb, id, idestado) {
    var anular = {
        idtbpropuesta: idtb,
        idtbestado: idestado,
        action: 'Anular_Propuesta'
    };
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: anular,
        dataType: 'json',
        success: function (data) {
            alert('Datos Actualizados Exitosamente!!');
            $("html, body").animate({
                scrollTop: 0
            }, 600);
            setTimeout(function () {
                location.reload(false);
            }, 800);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

//insertar
function Crear_Sugerencia() {
    var s_cliente = $("#s_cliente").val();
    var s_nsolicitud = $("#s_nsolicitud").val();
    var s_vehiculo = $("#s_vehiculo").val();
    var s_tipocarga = $("#s_tipocarga").val();
    var s_mercancia = $("#s_mercancia").val();
    var s_pesobruto = $("#s_pesobruto").val();
    var s_pesnonetok = $("#s_pesnonetok").val();
    var s_pesonetot = $("#s_pesonetot").val();
    var s_flete = $("#s_flete").val();
    var s_renta = $("#s_rentactual").val(); //rentabilidad anterior
    var s_cotizacion = $("#s_cotizacion").val();
    var s_idservicio = $("#s_idservicio").val();
    var s_fletecep = $("#s_fletecap").val();
    var s_tarifa = $("#s_tarifa").val();
    var s_calculo = $("#s_calculo").val(); //UTILIDAD nueva
    var s_rentab = $("#s_rentabilidad").val(); //rentabilidad nueva
    var s_total = $("#s_total").val();
    var consultar = {
        s_cotizacion: s_cotizacion,
        s_idservicio: s_idservicio,
        action: 'Consultar_estado'
    };

    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: consultar,
        dataType: 'json',
        success: function (data) {
            if (data.result != null) {
                alert('Existe una propuesta de Flete en estado Pendiente');
            }
            if (data.result == null) {
                Insertar_Sugerencia();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function Insertar_Sugerencia() {
    var s_cliente = $("#s_cliente").val();
    var s_nsolicitud = $("#s_nsolicitud").val();
    var s_vehiculo = $("#s_vehiculo").val();
    var s_tipocarga = $("#s_tipocarga").val();
    var s_mercancia = $("#s_mercancia").val();
    var s_pesobruto = $("#s_pesobruto").val();
    var s_pesnonetok = $("#s_pesnonetok").val();
    var s_pesonetot = $("#s_pesonetot").val();
    var s_flete = $("#s_flete").val();
    var s_renta = $("#s_rentactual").val(); //rentabilidad anterior
    var s_cotizacion = $("#s_cotizacion").val();
    var s_idservicio = $("#s_idservicio").val();
    var s_fletecep = $("#s_fletecap").val();
    var s_tarifa = $("#s_tarifa").val();
    var s_calculo = $("#s_calculo").val(); //UTILIDAD nueva
    var s_rentab = $("#s_rentabilidad").val(); //rentabilidad nueva
    var s_total = $("#s_total").val();
    var parametro = {
        s_cotizacion: s_cotizacion,
        s_idservicio: s_idservicio,
        s_fletecep: s_fletecep,
        s_tarifa: s_tarifa,
        s_calculo: s_calculo,
        s_renta: s_renta,
        s_rentab: s_rentab,
        s_total: s_total,
        s_cliente: s_cliente,
        action: 'Crear_Sugerencia'
    };
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: parametro,
        dataType: 'json',
        success: function (data) {
            if (data) {
                alert('Datos Registrados Exitosamente!!');
                $("html, body").animate({
                    scrollTop: 0
                }, 600);
                setTimeout(function () {
                    location.reload(false);
                }, 800);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

//validar los radiobutton de los tipos de hoja de vida
$(".panel_seguridad").hide();
$("#papeles").hide();
$("#nuevo").change(function () {
    if ($(this).is(":checked")) {
        if ($("#estado_vehiculo").val() == 'Nuevo') {
            $(".panel_seguridad").hide();
            $("#papeles").show();
            $("#placag").prop('disabled', true);
            // $("#placat").prop('disabled', true);
            $("#web").prop('disabled', true);
            $("#user_satelite").prop('disabled', true);
            $("#clave").prop('disabled', true);
            $("#nompro").prop('disabled', true);
            $("#docupro").prop('disabled', true);
            $("#nomtene").prop('disabled', true);
            $("#docutene").prop('disabled', true);
            $("#nomcondu").prop('disabled', true);
            $("#docucondu").prop('disabled', true);
            $("#obserpree").prop('disabled', true);
            $("#capa_carga_vh").prop('disabled', true);
            //$("#btn_soli").prop('disabled', false);
            var i;
            for (i = 1; i <= 3; i++) {
                $("#idrl" + i).prop('disabled', true);
                $("#referencias_empresariales" + i).prop('disabled', true);
                $("#fingreso" + i).prop('disabled', true);
                $("#fretiro" + i).prop('disabled', true);
                $("#contacto_ref" + i).prop('disabled', true);
                $("#celular_ref" + i).prop('disabled', true);
                $("#cargo_ref" + i).prop('disabled', true);
                $("#anti_ref" + i).prop('disabled', true);
                $("#docuupdate" + i).prop('disabled', true);
            }
        } else {
            $(".panel_seguridad").hide();
            $("#papeles").show();
            $("#placag").prop('disabled', true);
            // $("#placat").prop('disabled', false);
            $("#web").prop('disabled', false);
            $("#user_satelite").prop('disabled', false);
            $("#clave").prop('disabled', false);
            $("#nompro").prop('disabled', false);
            $("#docupro").prop('disabled', false);
            $("#nomtene").prop('disabled', false);
            $("#docutene").prop('disabled', false);
            $("#nomcondu").prop('disabled', false);
            $("#docucondu").prop('disabled', false);
            $("#obserpree").prop('disabled', false);
            $("#capa_carga_vh").prop('disabled', false);
            //$("#btn_soli").prop('disabled', false);
            var i;
            for (i = 1; i <= 3; i++) {
                $("#idrl" + i).prop('disabled', false);
                $("#referencias_empresariales" + i).prop('disabled', false);
                $("#fingreso" + i).prop('disabled', false);
                $("#fretiro" + i).prop('disabled', false);
                $("#contacto_ref" + i).prop('disabled', false);
                $("#celular_ref" + i).prop('disabled', false);
                $("#cargo_ref" + i).prop('disabled', false);
                $("#anti_ref" + i).prop('disabled', false);
                $("#docuupdate" + i).prop('disabled', false);
            }
            // flete_desbloquear(); Echo por mi
        }
    }
});

$(document).on('click', '#agregue_tb', function () {
    var msg_error = "";
    if (!$("#dato").val()) {
        msg_error += `<div class="text-dark mb-0 flex-1">Debe diligenciar el <strong>Campo actualizar</strong> para poder agregar las actualizaciones a seguridad.</div>`;
    }
    if (!$("#detalle").val()) {
        msg_error += `<div class="text-dark mb-0 flex-1">Debe diligenciar el <strong>Información actualizar</strong> para poder agregar las actualizaciones a seguridad.</div>`;
    }

    if (!msg_error) {
        tabla_seguridad();
    } else {
        $("#msg_alerta").html(`
            <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                  <div class="d-flex align-items-center">
                      <div>${msg_error}</div>
                    </div>
                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);
        $("#staticBackdrop").animate({ scrollTop: 0 }, 800);
    }
});

var conteo = 0;
var a = 0;
function tabla_seguridad() {
    conteo++;
    a++;
    var tipo = $("#label").val();
    var dato = $("#dato").val();
    var detalle = $("#detalle").val();
    var archivo = `<input type="file" id="arc${conteo}" name="arcs[]" class="form-control form-control-sm" accept="image/*,.pdf"  onchange="name_fontal(this.value, ${conteo})">
                      <input type="hidden" id="nam${conteo}" class="form-control form-control-sm" name="man[]" disabled>                
                  `;

    $("#cuerpo_actu").append(`
                        <tr id="fila${conteo}">
                            <td class="contador">
                                <p><strong>${conteo}</strong></p>
                                <input type="hidden" id="sa${a}" value="1">
                            </td>
                            <td> <a href="#" class="text-decoration-none borrar3 text-danger" id="p${a}">${tipo}</a></td>
                            <td>${dato}</td>
                            <td>${detalle}</td>
                            <td>${archivo}</td>
                        </tr>
                    `);

    $("#dato").val('');
    $("#detalle").val('');
    $("#valortb").val(conteo);
}

// Evento para eliminar fila con confirmación
$(document).on('click', '.borrar3', function (event) {
    event.preventDefault();
    var boton = $(this); // Guardamos la referencia del botón clickeado

    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            boton.closest('tr').remove(); // Elimina la fila
            actualizarContadores(); // Recalcular numeración
            Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
        }
    });
});

// Función para actualizar los números de fila después de eliminar
function actualizarContadores() {
    conteo = 0;
    $("#cuerpo_actu tr").each(function () {
        conteo++;
        $(this).attr("id", `fila${conteo}`); // Actualiza ID de fila
        $(this).find(".contador p strong").text(conteo); // Actualiza el número visible
        $(this).find("input[type='hidden']").attr("id", `sa${conteo}`); // Actualiza ID del input hidden
        $(this).find(".borrar3").attr("id", `p${conteo}`); // Actualiza ID del botón eliminar
    });
    $("#valortb").val(conteo);
}

//Eliminar documentos
$(document).on('click', '.borrar2', function (event) {
    event.preventDefault();

    $(this).closest('tr').remove();
    var v = this.id;
    //alert('v'+v);
    var x = v.substr(1, 1);
    x = parseInt(x);
    //$("#sk"+x).val();
    var d = $("#sk" + x).val();
});
//agregar documentos campos
var a = 0;
var b = 0;

$(document).on('click', '#agregar_docu', function () {
    a++; //contador
    b++;
    const papel = `
        <tr>
            <td class="align-middle text-center">
                <strong>${a}</strong>
                <input type="hidden" id="sk${a}" value="1">
            </td>
            <td class="text-center align-middle">
                <select id="tipohoja${a}" name="tipohoja[]" class="form-select form-select-sm" onchange="tipodehoja(${a}, this.value);">
                    <option value="">Seleccione</option>
                    <option value="Propietario">Propietario</option>
                    <option value="Tenedor">Tenedor</option>
                    <option value="Conductor">Conductor</option>
                    <option value="Vehiculo">Vehículo</option>
                    <option value="Trailer">Trailer</option>
                    <option value="Referencia_laboral1">Referencia laboral 1</option>
                    <option value="Referencia_laboral2">Referencia laboral 2</option>
                    <option value="Referencia_laboral3">Referencia laboral 3</option>
                </select>
            </td>
            <td class="text-center align-middle">
                <select id="clase${a}" name="clase[]" class="form-select form-select-sm">
                    <option value="">Seleccione</option>
                    <option value="cedula">Cédula</option>
                    <option value="cedula_extranjeria">Cédula de extranjería</option>
                    <option value="tarjeta_propiedad">Tarjeta de propiedad</option>
                    <option value="pasaporte">Pasaporte</option>
                    <option value="referencia_laboral">Referencia laboral</option>
                    <option value="referencia_personal">Referencia personal</option>
                    <option value="licencia">Licencia</option>
                    <option value="fotografia_vehiculo">Fotografías vehículo</option>
                    <option value="fotografia_conductor_frontal">Foto conductor frontal</option>
                    <option value="fotografia_conductor_derecha">Foto conductor derecha</option>
                    <option value="fotografia_conductor_izquierda">Foto conductor izquierda</option>
                    <option value="fotografia_indumentaria">Foto Indumentaria</option>
                    <option value="fotografia_trailer">Foto trailer</option>
                    <option value="rut">RUT</option>
                    <option value="Antecedentes_policivos">Antecedentes policivos</option>
                    <option value="otros">Otros</option>
                </select>
            </td>
            <td class="text-center align-middle">
                <input type="file" class="form-control form-control-sm" name="documento[]" id="documento${a}"
                    onchange="namedocumento(${a}, this.value);" accept="image/*,.pdf">
            </td>
            <td class="text-center align-middle">
                <button type="button" id="p${a}" class="btn btn-sm btn-danger borrar2"><i class='fas fa-trash-alt'></i></button>
                <input type="hidden" name="ruta[]" id="ruta${a}">
                <input type="hidden" name="namearchivo[]" id="namearchivo${a}">
            </td>
        </tr>`;

    $("#tabla_papeles").append(papel);
    $("#cont_papel").val(b);
});


function tipodehoja(id, valor) {
    if (valor == '') {
        alert('Por favor seleccione un tipo de hoja de vida');
        $("#ruta" + id + "").val("");
    }

    if (valor == 'Propietario') {
        //ruta
        var r = 'public/files/datostransporte/Propietario//';
        $("#ruta" + id + "").val(r);
        //tipo de documentos
    }

    if (valor == 'Tenedor') {
        var r = 'public/files/datostransporte/Tenedor//';
        $("#ruta" + id + "").val(r);
    }

    if (valor == 'Conductor') {
        var r = 'public/files/datostransporte/Conductor//';
        $("#ruta" + id + "").val(r);
    }

    if (valor == 'Vehiculo') {
        var r = 'public/files/datostransporte/Vehiculo//';
        $("#ruta" + id + "").val(r);
    }

    if (valor == 'Trailer') {
        var r = 'public/files/datostransporte/Trailer//';
        $("#ruta" + id + "").val(r);
    }

    if (valor == 'Referencia_laboral1') {
        var r = 'public/files/datostransporte/lab1//';
        $("#ruta" + id + "").val(r);
    }
    if (valor == 'Referencia_laboral2') {
        var r = 'public/files/datostransporte/lab2//';
        $("#ruta" + id + "").val(r);
    }
    if (valor == 'Referencia_laboral3') {
        var r = 'public/files/datostransporte/lab3//';
        $("#ruta" + id + "").val(r);
    }

}

//funcion para extraer el nombre de los documentos
function namedocumento(id, valor) {
    var input = document.getElementById('documento' + id + ''); // Reemplaza 'tuInputFile' con el ID de tu input file
    var archivo = input.files[0];
    if (archivo) {
        var nombreArchivo = archivo.name;
        var extension = nombreArchivo.split(".").pop().toLowerCase();
        var extensionesPermitidas = ["pdf", "jpg", "png", "webp"]; // Lista de extensiones permitidas
        if (extensionesPermitidas.indexOf(extension) === -1) {
            let mensaje = `
            <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><i class="fas fa-info"></i></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> Extensión de archivo no permitida. Por favor, selecciona un archivo con una de las siguientes extensiones: ${extensionesPermitidas.join(", ")}
                </div>
            </div>`;
            $("#crea_vehiculopreestudio").animate({
                scrollTop: 0
            }, 600);
            d.getElementById("historicos").innerHTML = mensaje;
            input.value = ""; // Limpia el campo de entrada
        } else {
            var docu = document.getElementById('documento' + id + '').files[0].name;
            $("#namearchivo" + id + "").val(docu);
        }
    }
}

$(".ocultar").hide();
//consultar cotizacion y solicitud de servicio
function consulta_coti(element) {
    $("#consultass_general").html('');
    $("#contener_remitente").html('');
    $(".destinatari").html('');
    var elemento = $(element);
    var num_cotizacion = elemento.data("id");
    var solicitud_servicio = elemento.data("id2");
    var id_bloque = elemento.data("id3");
    var c_pedida = elemento.data("id4");
    var c_disponible = elemento.data("id5");
    var consulta_solicitud = {
        cotizar: num_cotizacion,
        solicitud: solicitud_servicio,
        action: 'consulta_serviciob'
    };
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: consulta_solicitud,
        dataType: 'json',
        success: function (data) {
            if (data) {

                $("#consultass_general").html(`
          <table class="table table-bordered table-striped">
              <colgroup>
              <col class="col-xs-2">
              <col class="col-xs-7">
              </colgroup>
              <thead>
                  <tr>
                      <th>Items</th>
                      <th>Descripsión</th>
                  </tr>
              </thead>
              <tbody>
                    <tr>
                      <th scope="row"><b>Solicitud</b></th>
                      <td>${solicitud_servicio}- Cot:${num_cotizacion}</td>
                    </tr>
                    <tr>
                      <th scope="row"> <b>Cliente:</b> </th>
                      <td>${data.result[0].nombre_cliente}</td>
                    </tr>
                    <tr>
                      <th scope="row"> <b>Ruta</b> </th>
                      <td>${data.result[0].origen} - ${data.result[0].destino}</td>
                    </tr>
                    <tr>
                      <th scope="row"><b>Vehículo</b> </th>
                      <td>${data.result[0].nombre} - Cant. Solicitada: ${data.result[0].cant_vehiculo} - Cant. Disponible: ${data.result[0].cant_disponible} </td>
                    </tr>
                    <tr>
                      <th scope="row"><b>Peso</b></th>
                      <td>${data.result[0].peso_kg} KG</td>
                    </tr>
                    <tr>
                      <th scope="row"><b>Materias Primas</b></th>
                      <td>${data.result[0].tipo_mercancia} - ${data.result[0].cantidad_empaque} - ${data.result[0].volumen_total}</td>
                    </tr>
                    <tr>
                      <th scope="row"><b>Agencia</b></th>
                      <td>${data.result[0].agencia}</td>
                    </tr>
                    <tr>
                      <th scope="row"><b>Observacion:</b></th>
                      <td>${data.result[0].observacion}</td>
                    </tr>
              </tbody>
            </table>
          `);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    var consulta_solciitud2 = {
        cotizar: num_cotizacion,
        solicitud: solicitud_servicio,
        action: 'consulta_remitente'
    };
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: consulta_solciitud2,
        dataType: 'json',
        success: function (data) {
            if (data) {
                data.result.forEach(function (element, index) {
                    var observa = '';
                    if (element.observacion != '') {
                        observa = element.observacion;
                    } else {
                        observa = 'No hay observación';
                    }
                    $("#contener_remitente").append(
                        '<div class="panel-body panel panel-default panel-contrast">' +
                        '<span><strong>Remitentes</strong></span>' +
                        '<div class="panel-heading">' +
                        '<span><u>' + element.nombre + '</u></span>' +
                        '<span class="panel-subtitle">' +
                        '<p><strong>' + element.fecha_estimada_entrega + ' ' + element.hora_estimada + '</strong>  ' +
                        element.direccion_entrega +
                        '(' + element.municipio + ')' + '   ' + element.telefono + '  ' + observa + '</p>' +
                        '</span>' +
                        '</div>' +
                        '<div class="panel-body panel-body-contrast">' +
                        '<span><strong>Destinatarios</strong></span>' +
                        '<div id="destinatario' + element.id +
                        '" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 destinatari"></div>' +
                        '</div></div>');
                });
            }
            if (data.result2 != '') {
                data.result2.forEach(function (element, index) {
                    $("#destinatario" + element.remitente).append('<hr/><div>' +
                        '<strong>Destinatario:</strong> ' + element.nombre + '  ' + '<strong>Dirección:</strong> ' +
                        element.direccion_entrega + '  ' + '<strong>Municipio:</strong> ' + element.municipio + ' ' +
                        '<strong>Fecha Hora:</strong> ' + element.fecha_estimada_entrega + ' ' + element.hora_estimada +
                        '  ' + '<strong>Peso descargar:</strong> ' + element.peso + '  ' +
                        '<strong>Teléfono:</strong> ' + element.telefono + '</div>');
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

//vinculos
function ir_modulopreestudio() {
    var url = $("#base_url").val() + 'preestudiov/nacional_preestudio/?idmenu=1';
    window.location = (url);
}

function Status_Solo(element) {
    var elemento = $(element);
    var placa = elemento.data("id");
    //traer los movimientos de operaciones y seguridad
    //pertenecientes a esta placa
    var status_solo = {
        placa: placa,
        action: 'consultecarroindividual'
    };
    $("#movimientos_statussolo").html('');
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: status_solo,
        dataType: 'json',
        success: function (data) {
            // alert('si hay movimiento');
            if (data) {
                data.result.forEach(function (element, index) {
                    $("#movimientos_statussolo").append('<tr><td>Operaciones</td>' +
                        '<td>' + element.observacion + '</td>' +
                        '<td>' + element.fecha_asignacion + '</td>' +
                        '<td>' + element.hora_asignacion + '</td>' +
                        '<td>' + element.user_log + '</td>' +
                        '<td>' + element.estado + '</td>' +
                        '</tr>');
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert('No hay movimiento');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function status(element) {
    // alert('hola estatus operaciones');
    $("#tbtres").hide();
    var elemento = $(element);
    var id = elemento.data("id");
    var solicitud = elemento.data("id2");
    //cotizacion
    var coti = {
        idcotizar: id,
        action: 'consulte_cotizar'
    };
    $("#movimientos_coti").html('');
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: coti,
        dataType: 'json',
        success: function (data) {
            if (data) {
                var statu = '';
                data.result.forEach(function (element, index) {
                    if (element.estado == 'F3') {
                        statu = 'F3-Ganada';
                    }
                    if (element.estado == 'F2') {
                        statu = 'F2-Entregada';
                    }
                    if (element.estado == 'F1') {
                        statu = 'F1.Realizada';
                    }
                    if (element.estado == 'F4') {
                        statu = 'F4-Perdida';
                    }
                    if (element.estado == 'F5') {
                        statu = 'F5-Cancelada';
                    }

                    $("#movimientos_coti").append('<tr><td>' + element.n_cotizacion + '</td>' +
                        '<td>' + element.item + '</td>' +
                        '<td>' + element.pareja + '</td>' +
                        '<td>' + statu + '</td>' +
                        '<td>' + element.fecha_creacion + '</td>' +
                        '<td>' + element.hora_creacion + '</td>' +
                        '<td>' + element.elaborado_por + '</td>' +
                        '<td>' + element.proceso + '</td>' +
                        '</tr>');
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    //solicitud de servicio + operaciones
    var status = {
        idcotizar: id,
        solicitud: solicitud,
        action: 'consulte_movimientos'
    };
    $("#movimientos_status").html('');
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: status,
        dataType: 'json',
        success: function (data) {
            if (data) {
                data.result.forEach(function (element, index) {
                    $("#movimientos_status").append('<tr><td>' + element.nundoc_solicitud + '</td>' +
                        '<td>' + element.n_cotizacion + '</td>' +
                        '<td>' + element.item + '</td>' +
                        '<td>' + element.pareja + '</td>' +
                        '<td>' + element.fecha + '</td>' +
                        '<td>' + element.hora + '</td>' +
                        '<td>' + element.usuario_auditor + '</td>' +
                        '<td>' + element.estado + '</td>' +
                        '<td>' + element.proceso + '</td>' +
                        '</tr>');

                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    //preestudio
    var pre = {
        //solicitud de servicio
        solicitud: solicitud,
        action: 'consulte_preestudio'
    };
    $("#movimientos_preestudio").html('');
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: pre,
        dataType: 'json',
        success: function (data) {
            console.log('si llego preestudio');
            $("#tbtres").show();
            if (data) {

                $("#movimientos_preestudio").append('<tr>' +
                    '<td>' + data.result[0].id_preestudio + '</td>' +
                    '<td>' + data.result[0].id + '</td>' +
                    '<td>' + data.result[0].id_servicio_cliente + '</td>' +
                    '<td>' + data.result[0].fecha + '</td>' +
                    '<td>' + data.result[0].hora + '</td>' +
                    '<td>' + data.result[0].usuario + '</td>' +
                    '<td>' + data.result[0].proceso + '</td>' +
                    '</tr>');
            } else {
                $("#tbtres").hide();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('no llego preestudio');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    //estados de prefiltro
    var est = {
        idcotizar: solicitud,
        action: 'consulte_preestudio_estados'
    }
    $("#estados_preestudio").html('');
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: est,
        dataType: 'json',
        success: function (data) {
            if (data) {
                data.result.forEach(function (element, index) {
                    $("#estados_preestudio").append('<tr><td>' + element.placa + '</td>' +
                        '<td>' + element.fecha_solicitud + '</td>' +
                        '<td>' + element.usuario + '</td>' +
                        '<td>' + element.operacion + '</td>' +
                        // '<td>' + btn + '</td>' +
                        '</tr>');
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('no llego preestudio');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function Historial_estado(element) {
    var elemento = $(element);
    var id = elemento.data("id");
    $(document).on('click', '#btn_' + id, function () {
        $('#historial_estados').modal('show');
        $('#historial_estados').modal('handleUpdate');
        // $("#div_header").css('background','yellow');
    });
    var dato = {
        id: id,
        action: 'Consulta_Historial_Estudios'
    }
    $("#tbody_historia_estado").html('');
    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
            if (data) {
                data.result.forEach(function (element, index) {
                    let estadoh;
                    if (element.estado == 'pendiente_iniciar') {
                        estadoh = 'Pendiente de iniciar';
                    } else if (element.estado == 'iniciado') {
                        estadoh = 'Iniciado';
                    } else if (element.estado == 'aprobado') {
                        estadoh = 'Aprobado';
                    } else if (element.estado == 'rechazado para modificar') {
                        estadoh = 'Rechazado para modificar';
                    } else if (element.estado == 'rechazado') {
                        estadoh = 'Rechazado';
                    } else if (element.estado == 'cancelado') {
                        estadoh = 'Cancelado';
                    } else if (element.estado == 'vencida') {
                        estadoh = 'Vencida';
                    } else if (element.estado == 'pendiente') {
                        estadoh = 'Pendiente';
                    }
                    var cuerpo_tabla = `<tr>
          <td class="text-center" style="font-size:10px;">${element.id}</td>
          <td class="text-center"style="font-size:10px;width:40px;">${element.placa}</td>
          <td class="text-center" style="font-size:10px;width:120px;">${estadoh}</td>
          <td class="text-center" style="font-size:10px;">${element.traza}</td>
        </tr>`;
                    $("#tbody_historia_estado").append(cuerpo_tabla);
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('no consulta');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });
}

function historico() {
    $(".ocultar").show();
}

$(document).on('click', '.borrar', function (event) {
    event.preventDefault();
    //eliminar de tabla

    $(this).closest('tr').remove();
    var v = this.id;
    var x = v.substr(1, 1);
    x = parseInt(x);
    $("#servicio" + x).val(0);
    x2 = $("#servicio" + x).val();
    //sumatoria();//funcion recalcular tabla totalizar
    //eliminar de tabla cuerpo_fechas
    var y = $(this).data('formid'); //traer data del boton eliminar
    $("." + y).remove();
    sumatoria(); //funcion recalcular tabla totalizar
    //eliminar de tabla cuerpo_fechas
});

$("#listamodal").html('');
var con = 1;
var cone = 1;

function atraparsolici(cont, element) {
    var elemento = $(element);
    var idsol = elemento.data("id");
    var cliente = elemento.data("id2");
    var ncotiza = elemento.data("id3");
    var item = elemento.data("id4");
    var merc = elemento.data("id5");
    var flete = elemento.data("id6");
    var pesoneto = elemento.data("id7"); // peso bruto tonelada
    var tarifa = elemento.data("id8");

    var valida_numsubasta = {
        numservicio: idsol,
        action: 'valida_numero_subasta'
    };

    $.ajax({
        url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
        type: 'POST',
        data: valida_numsubasta,
        dataType: 'json',
        success: function (data) {
            if (data.result != null) {
                // Ya tiene subasta activa
                alert('No puede agregar esta solicitud: pertenece a otra subasta activa ' + data.result[0]["id_subasta"]);
                return;
            }

            // Validar si la subasta base ya tiene condiciones
            if ($("#su_numsubasta").val()) {
                $("#btn_soli").prop("disabled", true);
                alert('No puede agregar solicitudes: esta subasta ya tiene condiciones.');
                return;
            }

            // Verificar si ya existe en la lista
            var sw = 1;
            for (var a = 1; a <= cone; a++) {
                var id = $("#servicio" + a).val();
                if (idsol == id) {
                    sw = 0;
                    alert('Esta solicitud ya fue agregada');
                    break;
                }
            }

            if (sw == 1) {
                con++;
                cone++;

                // Renderizar la solicitud en formato card
                $('#cuerpo_lista2').append(`
                    <div class="border rounded p-3 mb-3 bg-light prin${con}">
                        <div class="row mb-2">
                            <div class="col-md-1">
                                <label class="form-label">#</label>
                                <div class="form-control form-control-sm text-center bg-secondary text-white">${cone}</div>
                            </div>
                            <div class="col-md-2">
                                <label class="form-label">Servicio</label>
                                <input type="hidden" id="servicio${con}" value="${idsol}" class="form-control form-control-sm fserva" name="fserva[]">
                                <div class="form-control form-control-sm bg-light">${idsol}</div>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Cotización</label>
                                <div class="form-control form-control-sm bg-light">${ncotiza} (${item}) ${merc}</div>
                            </div>
                            <div class="col-md-5">
                                <label class="form-label">Cliente</label>
                                <div class="form-control form-control-sm bg-light">${cliente}</div>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Flete</label>
                                <input type="text" id="fl${idsol}" class="form-control form-control-sm tflete" value="${flete}" readonly>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Tarifa</label>
                                <input type="hidden" id="tari${con}" class="form-control form-control-sm ttarifa" value="${tarifa}" readonly>
                                <div class="form-control form-control-sm bg-light">${tarifa}</div>
                            </div>
                            <div class="col-md-2 d-flex align-items-end">
                                <button type="button" class="btn btn-danger btn-sm borrar" data-formid="${idsol}">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                `);

                // Actualizar bloque de totales
                $('#totalizar').html(`
                    <div class="border rounded p-3 bg-white shadow-sm mb-3">
                        <div class="row">
                            <div class="col-md-4">
                                <label class="form-label">Total Flete</label>
                                <input type="text" id="totalfle" class="form-control form-control-sm" value="${flete}" readonly>
                            </div>
                            <div class="col-md-4" style="display:none;">
                                <label class="form-label">Total Neto</label>
                                <input type="text" id="totalneto" class="form-control form-control-sm" value="${pesoneto}" readonly>
                            </div>
                            <div class="col-md-4">
                                <input type="hidden" id="tottarifa" class="form-control form-control-sm" value="${tarifa}" readonly>
                            </div>
                        </div>
                    </div>
                `);

                // Actualizar contadores
                $("#maxservi").val(cone);
                $("#maxservi2").val(cone);

                // Formatear flete
                if ($('#fl' + idsol).val() > 0) {
                    $('#fl' + idsol).val(parseFloat($('#fl' + idsol).val(), 10)
                        .toFixed(2)
                        .replace(/(\d)(?=(\d{3})+\.)/g, "$1,"));
                }

                // Consultar fechas de cargue para esta solicitud
                $.ajax({
                    url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
                    type: 'POST',
                    data: { id_sol_servicio: idsol, action: 'consultar_fechacargue' },
                    dataType: 'json',
                    success: function (data) {
                        if (data.result) {
                            var mor = 1;
                            data.result.forEach(function (element) {
                                mor++;
                                var datec = element.fecha_estimada_entrega + 'T' + element.hora_estimada;
                                var actuali = moment().format('YYYY-MM-DD HH:mm:ss');
                                var cant = moment(datec, "YYYY-MM-DDTHH:mm:ss").diff(moment(actuali, "YYYY-MM-DD HH:mm:ss"), 'hours');
                                $("#cuerpo_fechas").append(`
                                    <tr id="fil${mor}" class="${element.cod_ini_ruta}">
                                        <td>
                                            <input type="hidden" id="oculto${mor}" value="${cant}" class="fo" readonly>
                                            <input type="text" id="serv${mor}" class="form-control input-xs fserv" value="${element.cod_ini_ruta}" readonly>
                                        </td>
                                        <td><input type="text" id="fecha${mor}" class="form-control input-xs cp" value="${element.fecha_estimada_entrega} ${element.hora_estimada}" readonly></td>
                                        <td><input type="text" id="peso${mor}" class="form-control input-xs fp" value="${element.peso}" readonly></td>
                                        <td>
                                            <input type="text" class="form-control input-xs" value="${element.lugar} (${element.direccion_entrega})" readonly title="${element.direccion_entrega}">
                                            <input type="text" class="form-control input-xs" value="${element.muni}" readonly>
                                        </td>
                                    </tr>
                                `);
                                sumatoria();
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error(textStatus, errorThrown);
                    }
                });

                sumatoria();
                alert('Solicitud agregada');
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error(textStatus, errorThrown);
        }
    });
}

function sumatoria() { //Fletes y pesos netos
    var suma = 0; //acumulador
    var suman = 0;
    var sumapes = 0;
    var sumntarifa = 0;
    $(".tflete").each(function () {
        var valor = ($(this).val()).replace(/,/g, "");
        suma += parseFloat(valor);
    });
    var canserv = $("#cuerpo_lista2").find('tr').length;
    var div = parseFloat(suma) / parseFloat(canserv);
    // $("#totalfle").val(suma);
    $(".tneto2").each(function () {
        var peso = ($(this).val()).replace(/,/g, "");
        suman += parseFloat(peso);
    });
    //sumar pesos netos , vienen del remitente
    $(".fp").each(function () {
        var valpeso = ($(this).val()).replace(/,/g, "");
        sumapes += parseFloat(valpeso);
    });
    //sumas tarifas
    $(".ttarifa").each(function () {
        var valtarifa = ($(this).val()).replace(/,/g, "");
        sumntarifa += parseFloat(valtarifa);
    });
    //var totari=parseFloat(sumntarifa)/parseFloat(canserv);
    $('#totalfle').val(suma);
    $("#tottarifa").val(sumntarifa);
    $("#totalneto").val(suman);
    $("#su_fletecot").val(suma);
    $("#su_neto").val(suman);
    $("#total_pesos").val(sumapes);
    $("#su_sumatorianeto").val(sumapes);
    $("#su_tarifacot").val(sumntarifa);
    //formatear numeros
    $('#totalfle').val(parseFloat($('#totalfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    $('#totalneto').val(parseFloat($('#totalneto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $('#su_fletecot').val(parseFloat($('#su_fletecot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $('#su_neto').val(parseFloat($('#su_neto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    $('#total_pesos').val(parseFloat($('#total_pesos').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $('#su_sumatorianeto').val(parseFloat($('#su_sumatorianeto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,
        "$1,").toString());
    $("#tottarifa").val(parseFloat($('#tottarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $("#su_tarifacot").val(parseFloat($('#su_tarifacot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
}

conteo = 0;
function seleccionar(idfila) {
    if ($("#" + idfila).hasClass('seleccionada')) {
        $("#" + idfila).removeClass('seleccionada');
    } else {
        $("#" + idfila).addClass('seleccionada');
    }
    id_fila_selected = idfila;
}

$("#remover").click(function () {
    eliminar(id_fila_selected);
});

$("#remover2").click(function () {
    eliminar_new(id_fila_selected);
});

function eliminar(idfila) {
    if (idfila.length > 0) {
        $("#" + idfila).remove();
        $("#s" + idfila).remove();
        var inpu = $("#maxservi").val();
        //alert(inpu);
        var r = 0;
        r = (parseFloat(inpu) - 1);
        //alert('descontar'+r);
        $("#maxservi").val(r);
        //alert($("#maxservi").val());

    }
}

function eliminar_new(idfila) {
    if (idfila.length > 0) {
        $("#" + idfila).remove();
        $("#s" + idfila).remove();
        var inpu = $("#maxservi2").val();
        //alert(inpu);
        var r = 0;
        r = (parseFloat(inpu) - 1);
        //alert('descontar'+r);
        $("#maxservi2").val(r);
        //alert($("#maxservi").val());
    }
}

function atraparVehiculo(element) {
    // alert('atrapado');
    var elemento = $(element);
    var placa = elemento.data("id");
    $("#cargar_cliente").val(placa);
    $("#exampleModalLong").modal('hide');
    $("#placa_sele").val(placa);
}

$("#asignar").click(function () {
    alert('asignar vehiculo a esta solicitud de servicio');
    //UPDATE EN LA TABLA cmx_solicitud_vehiculo2 enviado la placa
    var placa = $("#placa_sele").val();
    var n_solicitud = $("#num_soli").val();
    var usuario = $("#usuario").val();
    var tipo_vehiculo = $("#veh").val();
    var observe = $("#observe").val();

    if (!placa) {
        alert('la placa esta vacia, por favor busque un vehículo para asignarlo a esta Solicitud');
    } else {

        var asigne = {
            placa: placa,
            n_solicitud: n_solicitud,
            user: usuario,
            vehiculo: tipo_vehiculo,
            observe: observe,
            action: 'asinar_vehiculo_solicitud'
        };
        $.ajax({
            url: $("#base_url").val() + "libs/solicitudes_nacional_ajax.php",
            type: 'POST',
            data: asigne,
            dataType: 'json',
            success: function (data) {
                alert('Datos registrados exitosamente!!!');
                $("html, body").animate({
                    scrollTop: 0
                }, 600);
                setTimeout(function () {
                    location.reload(false);
                }, 800);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('error de asignacion');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
});

$(document).ready(function () {
    $("#placag").prop('disabled', true);
    // $("#placat").prop('disabled', true);
    $("#web").prop('disabled', true);
    $("#user_satelite").prop('disabled', true);
    $("#clave").prop('disabled', true);
    $("#nompro").prop('disabled', true);
    $("#docupro").prop('disabled', true);
    $("#nomtene").prop('disabled', true);
    $("#docutene").prop('disabled', true);
    $("#nomcondu").prop('disabled', true);
    $("#docucondu").prop('disabled', true);


    var i;
    for (i = 1; i <= 3; i++) {
        $("#idrl" + i).prop('disabled', false);
        $("#referencias_empresariales" + i).prop('disabled', true);
        $("#fingreso" + i).prop('disabled', true);
        $("#fretiro" + i).prop('disabled', true);
        $("#contacto_ref" + i).prop('disabled', true);
        $("#celular_ref" + i).prop('disabled', true);
        $("#cargo_ref" + i).prop('disabled', true);
        $("#anti_ref" + i).prop('disabled', true);
        //deshabilitar los input file para actualizar documentos
        $("#docuupdate" + i).prop('disabled', true);
    }

    var m;
    for (m = 1; m <= 2; m++) {
        $("#referencias_personales" + m).prop('disabled', true);
        $("#fecha_personal" + m).prop('disabled', true);
        $("#parenp" + m).prop('disabled', true);
        $("#telefonop" + m).prop('disabled', true);
        $("#docuupdatep" + m).prop('disabled', true);
    }
    $("#obserpree").prop('disabled', true);
    //$("#btn_soli").prop('disabled', true);

    $("#docuupdatepli1").prop('disabled', true);
    $("#docuupdatepru1").prop('disabled', true);
    $("#docuupdateeps1").prop('disabled', true);
    $("#docuupdatearl1").prop('disabled', true);
    $("#docuupdatecurso1").prop('disabled', true);
});

function currencyMask(ele) {
    alert('ssjdh');
}

/* Checked de tipo de estudio de seguridad */
document.addEventListener('change', async e => {
    if (e.target.matches('#update') || e.target.matches('#update *')) {
        op = '';
        accordion1desbloqueado(op);
        referencias_ah_des();
        datossolicitudes_des();
        //documentos_ah_des();
        campos_ah_bloc();
        consultar_hojadevida();
        readonly_campos();
        flete_desbloquear();
        campos_ah_des();
        $('#inexistente_propietario').hide();
        $('#inexistente_poseedor').hide();
        $('#inexistente_conductor').hide();
        $('#inexistente_vehiculo').hide();
        $('#inexistente_trailer').hide();
        $('#inexistente_actividades').hide();
        /* Acciones para elegir el tipo de operación */
        let checkboxes = document.querySelectorAll('.recursos_checbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    const valorSeleccionado = checkbox.value;
                    if (valorSeleccionado === 'nuevo_recurso') {
                        document.getElementById('creacion_nuevo_recuro').style.display = '';
                        document.getElementById('inexistente_actividades').style.display = '';
                    } else if (valorSeleccionado === 'datos_dinamicos') {
                        document.getElementById('datos_dinamicos').style.display = '';
                    }
                } else if (!checkbox.checked) {
                    const valorunchecked = checkbox.value;
                    if (valorunchecked === 'nuevo_recurso') {
                        document.getElementById('creacion_nuevo_recuro').style.display = 'none';
                        document.getElementById('inexistente_actividades').style.display = 'none';
                    } else if (valorunchecked === 'datos_dinamicos') {
                        document.getElementById('datos_dinamicos').style.display = 'none';
                    }
                }
            });
        });

        /* Elegir el tipo de de recurso que se queire crear */
        let checkboxes_recursos = document.querySelectorAll('.chebox_recurso');
        checkboxes_recursos.forEach(checkbox_recurso => {
            checkbox_recurso.addEventListener('change', () => {
                if (checkbox_recurso.checked) {
                    const Recurso = checkbox_recurso.value;
                    if (Recurso === 'Propietario') {
                        document.getElementById('inexistente_propietario').style.display = '';
                    } else if (Recurso === 'Poseedor') {
                        document.getElementById('inexistente_poseedor').style.display = '';
                    } else if (Recurso === 'Conductor') {
                        document.getElementById('inexistente_conductor').style.display = '';
                    } else if (Recurso === 'Trailer') {
                        document.getElementById('inexistente_trailer').style.display = '';
                    } else if (Recurso === 'Vehículo') {
                        document.getElementById('inexistente_vehiculo').style.display = '';
                    }
                } else if (!checkbox_recurso.checked) {
                    const Recursounchecked = checkbox_recurso.value;
                    if (Recursounchecked === 'Propietario') {
                        document.getElementById('inexistente_propietario').style.display = 'none';
                    } else if (Recursounchecked === 'Poseedor') {
                        document.getElementById('inexistente_poseedor').style.display = 'none';
                    } else if (Recursounchecked === 'Conductor') {
                        document.getElementById('inexistente_conductor').style.display = 'none';
                    } else if (Recursounchecked === 'Trailer') {
                        document.getElementById('inexistente_trailer').style.display = 'none';
                    } else if (Recursounchecked === 'Vehículo') {
                        document.getElementById('inexistente_vehiculo').style.display = 'none';
                    }
                }
            });
        });
    }

    // Validar si el propietario ya esta registardo en la base de datos
    if (e.target.matches('#docupro') || e.target.matches('#docupro *')) {
        let documento = document.getElementById('docupro').value;
        let dato = new FormData();
        dato.append('documento', documento);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Propietario', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                document.getElementById('nompro').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
                document.getElementById('mensaje_propietario_existe').innerHTML = `
              <p class="bg-success text-center" style='color:#FFF'>Este Propietario ya esta registrado en el sistema.</p>
            `;
            } else {
                document.getElementById('docupro').disabled = false;
                document.getElementById('nompro').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }

    // Validar si el poseedor existe en la base de datos
    if (e.target.matches('#docutene') || e.target.matches('#docutene *')) {
        let documento = document.getElementById('docutene').value;
        let dato = new FormData();
        dato.append('documento', documento);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Poseedor', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                document.getElementById('nomtene').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
                document.getElementById('mensaje_poseedor_existe').innerHTML = `
              <p class="bg-success text-center" style='color:#FFF'>Este Poseedor ya esta registrado en el sistema.</p>
            `;
            } else {
                document.getElementById('docutene').disabled = false;
                document.getElementById('nomtene').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }

    // Validar si el conductor existe en la base de datos
    if (e.target.matches('#docucondu') || e.target.matches('#docucondu *')) {
        let documento = document.getElementById('docucondu').value;
        let dato = new FormData();
        dato.append('documento', documento);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Conductor', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                document.getElementById('nomcondu').value = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
                document.getElementById('mensaje_conductor_existe').innerHTML = `
              <p class="bg-success text-center" style='color:#FFF'>Este Conductor ya esta registrado en el sistema.</p>
            `;
            } else {
                document.getElementById('docucondu').disabled = false;
                document.getElementById('nomcondu').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }

    // Validar si la placa del trailer esta cread y asosiada a un vehiculo
    if (e.target.matches('#placat') || e.target.matches('#placat *')) {
        let placa = document.getElementById('placat').value;
        let dato = new FormData();
        dato.append('placa_trailer', placa);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Trailer', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                document.getElementById('placat').disabled = true;
                document.getElementById('docproptrailer').value = data.numero_documento;
                document.getElementById('nomproptrailer').value = data.Nombre_propietario;
                document.getElementById('mensaje_trailer_existe').innerHTML = `
          <p class="bg-success text-center" style='color:#FFF'>Este Trailer ya esta registrado en el sistema, con el vehiculo de placa: ${data.placa_vehiculo}</p>
        `;
            } else {
                document.getElementById('placat').disabled = false;
                document.getElementById('docproptrailer').disabled = false;
                document.getElementById('nomproptrailer').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }

    /* Validar los numeros de documentos de los recursos nuevos para verificar y notificar al usaurio por que caminio es. */
    if (e.target.matches('#number_propietario') || e.target.matches('#number_propietario *')) {
        let documento = document.getElementById('number_propietario').value;
        let dato = new FormData();
        dato.append('documento', documento);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Propietario', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                $('#crea_vehiculopreestudio').modal('hide');
                $('#mensaje_notificacion').html('<b>Advertencia!</b>');
                const name_propietario = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
                let actividad = 'Propietario';
                $('#texto_notificacion').html(
                    `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_propietario}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
                );
                $('#mod-warning').modal('toggle');
            } else {
                document.getElementById('number_propietario').disabled = false;
                document.getElementById('name_propietario').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }

    if (e.target.matches('#number_poseedor') || e.target.matches('#number_poseedor *')) {
        let documento = document.getElementById('number_poseedor').value;
        let dato = new FormData();
        dato.append('documento', documento);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Poseedor', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                $('#crea_vehiculopreestudio').modal('hide');
                $('#mensaje_notificacion').html('<b>Advertencia!</b>');
                const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
                let actividad = 'Poseedor';
                $('#texto_notificacion').html(
                    `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
                );
                $('#mod-warning').modal('toggle');
            } else {
                document.getElementById('number_poseedor').disabled = false;
                document.getElementById('name_propietario').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }

    if (e.target.matches('#number_conductor') || e.target.matches('#number_conductor *')) {
        let documento = document.getElementById('number_conductor').value;
        let dato = new FormData();
        dato.append('documento', documento);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Conductor', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                $('#crea_vehiculopreestudio').modal('hide');
                $('#mensaje_notificacion').html('<b>Advertencia!</b>');
                const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
                let actividad = 'Conductor';
                $('#texto_notificacion').html(
                    `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
                );
                $('#mod-warning').modal('toggle');
            } else {
                document.getElementById('number_conductor').disabled = false;
                document.getElementById('name_propietario').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }

    if (e.target.matches('#propidocu_trailer') || e.target.matches('#propidocu_trailer *')) {
        let documento = document.getElementById('propidocu_trailer').value;
        let dato = new FormData();
        dato.append('documento', documento);
        try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Validar_Conductor', {
                method: 'POST',
                body: dato,
                cache: 'no-cache',
            });
            const data = await response.json();
            if (data) {
                $('#crea_vehiculopreestudio').modal('hide');
                $('#mensaje_notificacion').html('<b>Advertencia!</b>');
                const name_pOSEEDOR = data.nombre + ' ' + (data.apellido1 !== null ? data.apellido1 : '') + ' ' + (data.apellido2 !== null ? data.apellido2 : '');
                let actividad = 'Conductor';
                $('#texto_notificacion').html(
                    `Este <b>${actividad}</b> ya esta registrado en NexosApp como: <b>${name_pOSEEDOR}</b> la actualizacion de campos diferentes a documentos y placas debe ser por datos dinamicos`,
                );
                $('#mod-warning').modal('toggle');
            } else {
                document.getElementById('propidocu_trailer').disabled = false;
                document.getElementById('name_propietario').disabled = false;
            }
        } catch (error) {
            console.error('Error en la segunda solicitud:', error);
            throw error;
        } finally {
            $('#loading-overlay-oet ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        }
    }
});

window.datos_validado = 0;

document.addEventListener('click', async e => {
    //Validar propietario para ITR
    if (e.target.matches('#si_propietario') || e.target.matches('#si_propietario *')) {
        document.getElementById('accion_propietario').innerHTML = 'Validado';
        document.getElementById('accion_propietario').style.backgroundColor = '#14A44D';
        document.getElementById('accion_propietario').style.color = '#FFFFFF';
        window.datos_validado++;
    } else if (e.target.matches('#no_propietario') || e.target.matches('#no_propietario *')) {
        actualizar_itr();
    }

    // Validar poseedor de ITR
    if (e.target.matches('#si_poseedor') || e.target.matches('#si_poseedor *')) {
        document.getElementById('accion_poseedor').innerHTML = 'Validado';
        document.getElementById('accion_poseedor').style.backgroundColor = '#14A44D';
        document.getElementById('accion_poseedor').style.color = '#FFFFFF';
        window.datos_validado++;
    } else if (e.target.matches('#no_poseedor') || e.target.matches('#no_poseedor *')) {
        actualizar_itr();
    }

    // Validar conductor de ITR
    if (e.target.matches('#si_conductor') || e.target.matches('#si_conductor *')) {
        document.getElementById('accion_conductor').innerHTML = 'Validado';
        document.getElementById('accion_conductor').style.backgroundColor = '#14A44D';
        document.getElementById('accion_conductor').style.color = '#FFFFFF';
        window.datos_validado++;
    } else if (e.target.matches('#no_conductor') || e.target.matches('#no_conductor *')) {
        actualizar_itr();
    }

    // Validar propietario del tráiler para ITR
    if (e.target.matches('#si_propietario_trailer') || e.target.matches('#si_propietario_trailer *')) {
        document.getElementById('accion_propietario_trailer').innerHTML = 'Validado';
        document.getElementById('accion_propietario_trailer').style.backgroundColor = '#14A44D';
        document.getElementById('accion_propietario_trailer').style.color = '#FFFFFF';
        window.datos_validado++;
    } else if (e.target.matches('#no_propietario_trailer') || e.target.matches('#no_propietario_trailer *')) {
        actualizar_itr();
    }

    const el = document.getElementById('accion_propietario_trailer');
    if (el && el.textContent === 'No Aplica') {
        if (datos_validado >= 3) {
            $('#crear_preestudio').show();
        }
    } else {
        if (datos_validado >= 4) {
            $('#crear_preestudio').show();
        }
    }

    /* Guardar registros de prefiltro */
    if (e.target.matches('#crear_preestudio') || e.target.matches('#crear_preestudio *')) {
        e.stopPropagation();  // Evita que el evento siga burbujeando
        e.preventDefault();   // Previene doble acción en enlaces
        let BtnPreestudio = e.target.closest('#crear_preestudio');
        let EscenarioId = BtnPreestudio.getAttribute('data-escenarioId');
        let proceso_itr = document.getElementById('proceso_itr').value;

        let CodigoDestino = BtnPreestudio.getAttribute('data-CodigoDestino');
        let CodigoOrigen = BtnPreestudio.getAttribute('data-CodigoOrigen');
        let Configuracion = BtnPreestudio.getAttribute('data-Configuracion');
        let configuracion_vehiculo = document.getElementById('configuracion_vehiculo').value || Configuracion;
        let numdoc = BtnPreestudio.getAttribute('data-NumdocSolicitud');

        //VALIDAR Sicetac NumdocSolicitud
        // Mostrar mensaje de validación
        // Swal.fire({
        //     title: 'Validando tarifas',
        //     text: 'Por favor espera...',
        //     allowOutsideClick: false,
        //     didOpen: () => {
        //         Swal.showLoading();
        //     }
        // });

        // try {
        //     const formData = new FormData();
        //     formData.append('configuracion_vehiculo', configuracion_vehiculo);
        //     formData.append('codigo_origen_manifesto', CodigoOrigen);
        //     formData.append('codigo_destino_manifesto', CodigoDestino);
        //     formData.append('numdoc', numdoc);

        //     const response = await fetch($('#base_url').val() + 'web_service/Validar_Sicetac', {
        //         method: 'POST',
        //         body: formData
        //     });

        //     const data = await response.json();

        //     if (data.status === 'true') {
        //         let resultado = data.resultado;

        //         // ejemplo: si quieres mostrar todas las tarifas en lista
        //         let html = '<ul>';
        //         for (const [key, value] of Object.entries(resultado)) {
        //             html += `<li><b>${key}:</b> ${value}</li>`;
        //         }
        //         html += '</ul>';

        //         Swal.fire({
        //             icon: 'success',
        //             title: 'Tarifas encontradas',
        //             html: html
        //         });

        //     } else {
        //         Swal.fire({
        //             icon: 'error',
        //             title: 'Error',
        //             text: data.mensaje || data.resultado || 'No se pudo validar las tarifas'
        //         });
        //     }

        // } catch (error) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error inesperado',
        //         text: error.message
        //     });
        // }

        if (proceso_itr === 'Si') {
            if (window.datos_validado === 0) {
                // Primer viaje
                if (document.getElementById('placa').value !== '') {
                    const result = await Swal.fire({
                        title: '¿Estás seguro?',
                        text: '¿Realizar solicitud de vehiculo?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, cambiar',
                        cancelButtonText: 'Cancelar'
                    });

                    if (result.isConfirmed) {
                        // Código a ejecutar si el usuario hace clic en "Aceptar"
                        var msg_error = '';
                        if ($('#papeles').is(':checked')) {
                            var p;
                            for (p = 1; p == b; p++) {
                                if (!$('#tipohoja' + p + '').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                                }
                                if (!$('#ruta' + p + '').val()) {
                                    msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                                }
                                if (!$('#namearchivo' + p + '').val()) {
                                    msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                                }
                            }
                        }
                        if (!$('#placag').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#placag');
                        } else {
                            `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                            <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                            <p class="mb-0 flex-1">${msg_error}</br></p>
                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>`
                        }
                        if (!$('#web').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#web');
                        } else {
                            RemueveFoco('#web');
                        }
                        if (!$('#user_satelite').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#user_satelite');
                        } else {
                            RemueveFoco('#user_satelite');
                        }
                        if (!$('#clave').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#clave');
                        } else {
                            RemueveFoco('#clave');
                        }
                        if (!$('#nompro').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#nompro');
                        } else {
                            RemueveFoco('#nompro');
                        }
                        if (!$('#docupro').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#docupro');
                        } else {
                            RemueveFoco('#docupro');
                        }
                        if (!$('#nomtene').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#nomtene');
                        } else {
                            RemueveFoco('#nomtene');
                        }
                        if (!$('#docutene').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#docutene');
                        } else {
                            RemueveFoco('#docutene');
                        }
                        if (!$('#nomcondu').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#nomcondu');
                        } else {
                            RemueveFoco('#nomcondu');
                        }
                        if (!$('#docucondu').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
                            AplicaFoco('#docucondu');
                        } else {
                            RemueveFoco('#docucondu');
                        }
                        if (!$('#su_propuesto').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
                            AplicaFoco('#su_propuesto');
                        } else {
                            RemueveFoco('#su_propuesto');
                        }
                        if (!$('#responsable_vehiculo').val()) {
                            //campos dinamicos
                            msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
                            AplicaFoco('#responsable_vehiculo');
                        } else {
                            RemueveFoco('#responsable_vehiculo');
                        }
                        if (!$('input[name=gender]').is(':checked')) {
                            msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
                        }

                        if (!$('#total_pesos').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
                            AplicaFoco('#total_pesos');
                        } else {
                            RemueveFoco('#total_pesos');
                        }

                        if (!$('#capa_carga_vh').val()) {
                            msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
                            AplicaFoco('#capa_carga_vh');
                        } else {
                            if ($('#capa_carga_vh').val().length > 5) {
                                msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
                            } else {
                                RemueveFoco('#capa_carga_vh');
                            }
                        }
                        if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
                            var tpeso = $('#total_pesos').val().replace(/,/g, '');
                            var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
                            if (parseFloat(tpeso) > parseFloat(capacidad)) {
                                msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                                AplicaFoco('#total_pesos');
                                AplicaFoco('#capa_carga_vh');
                            } else {
                                RemueveFoco('#total_pesos');
                                RemueveFoco('#capa_carga_vh');
                            }
                        }

                        if ($('#estado_prefiltron').val() == '') {
                            if (document.getElementById('nuevo').checked) {
                                if (contador_global1 < 3) {
                                    msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                                }
                                var m;
                                for (m = 1; m <= contador_global1; m++) {
                                    if (!$('#empresa_crear' + m + '').val().trim()) {
                                        msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                                        AplicaFoco('#empresa_crear' + m + '');
                                    } else {
                                        RemueveFoco('#empresa_crear' + m + '');
                                    }

                                    if (!$('#numero_crear' + m + '').val().trim()) {
                                        msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                                        AplicaFoco('#numero_crear' + m + '');
                                    } else {
                                        if ($('#numero_crear' + m + '').val().length !== 10) {
                                            msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                                        } else {
                                            RemueveFoco('#numero_crear' + m + '');
                                        }
                                    }
                                }
                            }

                            /* Validar si esta checkd el campo de trailers */
                            if (document.getElementById('propietario_obligatorio').checked) {
                                if (document.getElementById('placat').value === '') {
                                    // console.log('campos obligatorios');
                                    $('#placat + p').remove();
                                    const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                    $('#placat').after(ERROR);
                                    AplicaFoco('#placat');
                                    msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                                } else {
                                    $('#placat + p').remove();
                                    RemueveFoco('#placat');
                                }

                                if (document.getElementById('docproptrailer').value === '') {
                                    $('#docproptrailer + p').remove();
                                    const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                    $('#docproptrailer').after(ERROR2);
                                    AplicaFoco('#docproptrailer');
                                    msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                                } else {
                                    $('#docproptrailer + p').remove();
                                    RemueveFoco('#docproptrailer');
                                }

                                if (document.getElementById('nomproptrailer').value === '') {
                                    $('#nomproptrailer + p').remove();
                                    const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                    $('#nomproptrailer').after(ERROR3);
                                    AplicaFoco('#nomproptrailer');
                                    msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
                                } else {
                                    $('#nomproptrailer + p').remove();
                                    RemueveFoco('#nomproptrailer');
                                }
                            } else {
                                // console.log('campos no obligatorios');
                                $('#placat + p').remove();
                                $('#docproptrailer + p').remove();
                                $('#nomproptrailer + p').remove();
                                RemueveFoco('#placat');
                                RemueveFoco('#docproptrailer');
                                RemueveFoco('#nomproptrailer');
                            }

                            if (document.getElementById('habil').checked || document.getElementById('update').checked) {
                                if (!$('#referencias_empresariales1').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#celular_ref1').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#referencias_empresariales2').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#celular_ref2').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#referencias_empresariales3').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#celular_ref3').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                                }
                                //personales
                                if (!$('#referencias_personales1').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#parenp1').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#telefonop1').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#referencias_personales2').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#parenp2').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                                }
                                if (!$('#telefonop2').val()) {
                                    msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                                }

                                if (document.getElementById('update').checked) {
                                    if (!document.getElementById('cbox1').checked && !document.getElementById('cbox2').checked) {
                                        msg_error += '<p>Debe seleccionar <strong>una opción de recurso</strong> para poder crear la solicitud (Actualiza seguridad).</p>';
                                    } else {
                                        if (document.getElementById('cbox1').checked) {
                                            //registrar campos nuevos
                                            if (
                                                !document.getElementById('cbpre1').checked &&
                                                !document.getElementById('cbpre2').checked &&
                                                !document.getElementById('cbpre3').checked &&
                                                !document.getElementById('cbpre4').checked &&
                                                !document.getElementById('cbpre5').checked
                                            ) {
                                                msg_error += '<p>Por favor seleccione el recurso a crear , opción seleccionada <strong>Recursos inexistentes</strong>.</p>';
                                            } else {
                                                if (document.getElementById('cbpre1').checked) {
                                                    //propietario
                                                    if (!$('#name_propietario').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Nombre Propietario</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#number_propietario').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Documento Propietario</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                }

                                                if (document.getElementById('cbpre2').checked) {
                                                    //poseedor
                                                    if (!$('#name_poseedor').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Nombre Poseedor</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#number_poseedor').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Documento Poseedor</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                }

                                                if (document.getElementById('cbpre3').checked) {
                                                    //conductor
                                                    if (!$('#name_conductor').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Nombre Conductor</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#number_conductor').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Documento Conductor</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#referencias_empresariales1pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Nombre referencia 1</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#contacto_ref1pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Persona contacto 1</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#celular_ref1pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Celular empresa 1</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#referencias_empresariales2pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Nombre referencia 2</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#contacto_ref2pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Persona contacto 2</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#celular_ref2pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Celular empresa 2</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#referencias_empresariales3pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Nombre referencia 3</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#contacto_ref3pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Persona contacto 3</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#celular_ref3pre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Celular empresa 3</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                }

                                                if (document.getElementById('cbpre4').checked) {
                                                    //trailer
                                                    if (!$('#placa_trailerpre').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Placa tráiler</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#propi_trailer').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Nombre propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                    if (!$('#propidocu_trailer').val()) {
                                                        msg_error += '<p>Debe diligenciar <strong>Documento propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                                                    }
                                                }
                                            }
                                        }
                                        if (document.getElementById('cbox2').checked) {
                                            //campos dinamicos
                                            var idfila = $('#cuerpo_actu tr').length; //cantidad de filas de la tabla
                                            if (idfila == 0) {
                                                msg_error += '<p>Debe ingresar <strong>Mínimo 1 dato </strong> en bloque actualizar seguridad para poder crear la solicitudocument.</p>';
                                            }
                                        }
                                    }
                                }
                            }
                        }


                        // Validar la condifugracion de los vehiculos nuevos para el sicetac
                        if (!$('#configuracion_vehiculo').val()) {
                            //campos dinamicos
                            msg_error += '<p>Debe seleccionar una <strong>Configuración </strong> del vehículo para poder crear la solicitudocument.</p>';
                            AplicaFoco('#configuracion_vehiculo');
                        } else {
                            RemueveFoco('#configuracion_vehiculo');
                        }

                        if (!msg_error && $('#estado_prefiltron').val() == '') {
                            if (comprobar() === false) {
                                if (document.getElementById('nuevo').checked) {
                                    let data = new FormData();
                                    var operacion;
                                    if ($('#update').is(':checked')) {
                                        operacion = 'Actualizar';
                                    }

                                    if ($('#nuevo').is(':checked')) {
                                        operacion = 'Nuevo';
                                    }

                                    if ($('#habil').is(':checked')) {
                                        operacion = 'Habilitar';
                                    }
                                    let fletef = $('#su_propuesto').val().split(',').join('');
                                    let tarifaf = $('#su_tarifacot').val().split(',').join('');
                                    data.append('placa', document.getElementById('placag').value);
                                    // Datos del propietario del vehiculo
                                    data.append('trailer', document.getElementById('placat').value);
                                    data.append('documento_propietario_trailer', document.getElementById('docproptrailer').value);
                                    data.append('propietario_trailer', document.getElementById('nomproptrailer').value);
                                    data.append('propietario', document.getElementById('nompro').value);
                                    data.append('documento_pro', document.getElementById('docupro').value);
                                    data.append('tenedor', document.getElementById('nomtene').value);
                                    data.append('documento_tene', document.getElementById('docutene').value);
                                    data.append('conductor', document.getElementById('nomcondu').value);
                                    data.append('documento_condu', document.getElementById('docucondu').value);
                                    data.append('web', document.getElementById('web').value);
                                    data.append('user_satelite', document.getElementById('user_satelite').value);
                                    data.append('clave', document.getElementById('clave').value);
                                    data.append('tipologianuevo', $('#nuevo').val());
                                    data.append('tipologiahabilte', $('#habilite').val());
                                    data.append('tipologiaactualice', $('#actualice').val());
                                    data.append('tipo_operacion', operacion);
                                    data.append('fecha', $('#fpree').val());
                                    data.append('hora', $('#hpree').val());
                                    data.append('usuario', $('#userpree').val());
                                    data.append('observacion', $('#obserpree').val());
                                    data.append('su_sumatorianeto', $('#su_sumatorianeto').val());
                                    data.append('total_peso', $('#total_peso').val());
                                    data.append('flete_subasta', fletef);
                                    data.append('tarifa_subasta', tarifaf);
                                    data.append('propietario_obligatorio', $('#propietario_obligatorio').is(':checked'));
                                    data.append('proceso_itr', proceso_itr);
                                    /* Responsable de vehiculo */
                                    data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                                    data.append('empresa_cliente', $('#empresa_cliente').val());
                                    data.append('EscenarioId', EscenarioId);

                                    // Obtener los valores de los inputs de tipo array
                                    let datos_referencias = {
                                        empresa_crear: [],
                                        fingreso_crear: [],
                                        fretiro_crear: [],
                                        contacto_crear: [],
                                        numero_crear: [],
                                        cargo_crear: [],
                                        antiguedad_crear: [],
                                    };

                                    // Llenamos el array por campo
                                    document.querySelectorAll('[name="empresa_crear[]"]').forEach(el => {
                                        datos_referencias.empresa_crear.push(el.value);
                                    });

                                    document.querySelectorAll('[name="fingreso_crear[]"]').forEach(el => {
                                        datos_referencias.fingreso_crear.push(el.value);
                                    });

                                    document.querySelectorAll('[name="fretiro_crear[]"]').forEach(el => {
                                        datos_referencias.fretiro_crear.push(el.value);
                                    });

                                    document.querySelectorAll('[name="contacto_crear[]"]').forEach(el => {
                                        datos_referencias.contacto_crear.push(el.value);
                                    });

                                    document.querySelectorAll('[name="numero_crear[]"]').forEach(el => {
                                        datos_referencias.numero_crear.push(el.value);
                                    });

                                    document.querySelectorAll('[name="cargo_crear[]"]').forEach(el => {
                                        datos_referencias.cargo_crear.push(el.value);
                                    });

                                    document.querySelectorAll('[name="antiguedad_crear[]"]').forEach(el => {
                                        datos_referencias.antiguedad_crear.push(el.value);
                                    });

                                    // Convertimos a JSON
                                    let nota_referencias = JSON.stringify(datos_referencias);

                                    // Agregamos al FormData
                                    data.append('referencias_laborales', nota_referencias);

                                    // Solicitudes de servicio
                                    var solicitudes = document.getElementsByName('fserva[]');
                                    for (var i = 0; i < solicitudes.length; i++) {
                                        data.append('fserva[]', solicitudes[i].value);
                                    }

                                    //se construye el objeto que almacena los datos
                                    let datos = {
                                        tipohoja: [],
                                        clase: [],
                                        ruta: [],
                                        documento: [],
                                        namearchivo: [],
                                        papeles: [],
                                    };

                                    //Archivos
                                    var cantp = $('#cont_papel').val();
                                    if (cantp > 0) {
                                        var tipohj = document.getElementsByName('tipohoja[]');
                                        for (var i = 0; i < tipohj.length; i++) {
                                            var tipo = tipohj[i].value;
                                            datos.tipohoja[i] = tipo;
                                        }
                                        var clase = document.getElementsByName('clase[]');
                                        for (var i = 0; i < clase.length; i++) {
                                            var clas = clase[i].value;
                                            datos.clase[i] = clas;
                                        }

                                        var ruta = document.getElementsByName('ruta[]');
                                        for (var i = 0; i < ruta.length; i++) {
                                            var rut = ruta[i].value;
                                            datos.ruta[i] = rut;
                                        }

                                        var documento = document.getElementsByName('documento[]');
                                        for (var i = 0; i < documento.length; i++) {
                                            var doc = documento[i].value;
                                            datos.documento[i] = doc;
                                        }

                                        var namearchivo = document.getElementsByName('namearchivo[]');
                                        for (var i = 0; i < namearchivo.length; i++) {
                                            var name = namearchivo[i].value;
                                            datos.namearchivo[i] = name;
                                        }

                                        var u;
                                        for (u = 1; u <= cantp; u++) {
                                            data.append('Papel', $('#papeles').is(':checked'));
                                            var papeles = document.getElementById('documento' + u + '').files;
                                            if (papeles.length > 0) {
                                                for (var a = 0; a < papeles.length; a++) {
                                                    data.append('papeles[]', papeles[a]);
                                                }
                                            } else {
                                                data.append('papeles', 'sin_datos');
                                            }
                                        }
                                        // Nuevo Array completo
                                        var nota = datos;
                                        nota = JSON.stringify(nota);
                                        data.append('notas', nota);
                                    }
                                    await fetch($('#base_url').val() + 'validacionparametros/Insertar_preestudio_nuevo', {
                                        method: 'POST',
                                        body: data,
                                        cache: 'no-cache',
                                    })
                                        .then(response => {
                                            if (!response.ok) throw new Error(response.statusText);
                                            return response.json();
                                        })
                                        .then(function (datas) {
                                            if (datas) {
                                                myOffcanvas.hide();
                                                Swal.fire({
                                                    title: 'Solicitud Guardada',
                                                    text: datas || 'La solicitud fue guardada exitosamente.',
                                                    icon: 'success',
                                                    confirmButtonColor: '#3B71CA',
                                                    customClass: {
                                                        popup: 'swal2-custom-font',
                                                    },
                                                });
                                                Filtro();
                                                Limpiarmodal();
                                                Ocultarbloque();
                                                $('#crear_preestudio').show();
                                                resetReferencias();
                                            } else {
                                                $('#crear_preestudio').show();
                                            }
                                        })
                                        .catch(error => {
                                            Swal.fire({
                                                title: 'Error',
                                                text: error,
                                                icon: 'error',
                                                confirmButtonColor: '#3B71CA',
                                                customClass: {
                                                    popup: 'swal2-custom-font',
                                                },
                                            });
                                            $('#crear_preestudio').show();
                                        });
                                }
                            }

                            if (document.getElementById('habil').checked || document.getElementById('update').checked) {
                                let data = new FormData();
                                var operacion;
                                if ($('#update').is(':checked')) {
                                    operacion = 'Actualizar';
                                }
                                if ($('#habil').is(':checked')) {
                                    operacion = 'Habilitar';
                                }
                                let fletef = $('#su_propuesto').val().split(',').join('');
                                let tarifaf = $('#su_tarifacot').val().split(',').join('');
                                data.append('tipo_operacion', operacion);
                                data.append('placa', document.getElementById('placag').value);
                                data.append('flete_subasta', fletef);
                                data.append('tarifa_subasta', tarifaf);
                                data.append('fecha', $('#fpree').val());
                                data.append('hora', $('#hpree').val());
                                data.append('usuario', $('#userpree').val());
                                data.append('papeles', 'sin_datos');
                                data.append('observacion', $('#obserpree').val());
                                data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                                data.append('empresa_cliente', $('#empresa_cliente').val());
                                data.append('EscenarioId', EscenarioId);

                                // Solicitudes de servicio
                                var solicitudes = document.getElementsByName('fserva[]');
                                for (var i = 0; i < solicitudes.length; i++) {
                                    data.append('fserva[]', solicitudes[i].value);
                                }

                                //se construye el objeto que almacena los datos
                                let element = {
                                    tipohojahv: [],
                                    campos: [],
                                    datos: [],
                                    namearchivo: [],
                                };

                                if ($('#update').is(':checked')) {
                                    //insercion de datos dinamicos
                                    if (document.getElementById('cbox2').checked) {
                                        data.append('dinamicos', 'si');
                                        var cantp = $('#valortb').val();
                                        if (cantp > 0) {
                                            var e, n;
                                            for (e = 1; e <= cantp; e++) {
                                                if (typeof $('#sa' + e).val() !== 'undefined') {
                                                    var tipohv = $('#fila' + e).find('td').eq(1).find('a').text();
                                                    var campo = $('#fila' + e + '').find('td').eq(2).html();
                                                    var dato = $('#fila' + e + '').find('td').eq(3).html();
                                                    var namea = $('#nam' + e + '').val();
                                                    var papeles = document.getElementById('arc' + e + '').files;
                                                    if (papeles.length > 0) {
                                                        for (var a = 0; a < papeles.length; a++) {
                                                            data.append('papeles[]', papeles[a]);
                                                        }
                                                    } else {
                                                        data.append('papeles', 'Sin_datos');
                                                    }
                                                    element.tipohojahv.push(tipohv);
                                                    element.campos.push(campo);
                                                    element.namearchivo.push(namea);
                                                    element.datos.push(dato);
                                                    // Nuevo Array completo
                                                    var nota = element;
                                                    nota = JSON.stringify(nota);
                                                    data.append('notas', nota);
                                                }
                                            }
                                        }
                                    } else {
                                        data.append('dinamicos', 'no');
                                    }

                                    //inserción de recursos inexistentes es decir, nuevos
                                    if (document.getElementById('cbox1').checked) {
                                        data.append('nuevos_recursos', 'si');
                                        if (document.getElementById('cbpre1').checked) {
                                            //propietario
                                            tipologia = 'propietario';
                                            var name_propie = $('#name_propietario').val();
                                            var tipohv = 'Propietario';
                                            var docu_propi = $('#number_propietario').val();
                                            data.append('propietario_check', $('#cbpre1').is(':checked'));
                                            data.append('tipo_propi', tipologia);
                                            data.append('nombre_propietario', name_propie);
                                            data.append('docu_propi', docu_propi);
                                        } else {
                                            data.append('propietario_check', $('#cbpre1').is(':checked'));
                                        }
                                        if (document.getElementById('cbpre2').checked) {
                                            //poseedor
                                            tipologia = 'tenedor';
                                            campo = 'Nombre';
                                            name_posee = $('#name_poseedor').val();
                                            data.append('poseedor_check', $('#cbpre2').is(':checked'));
                                            docu_posee = $('#number_poseedor').val();
                                            data.append('tipo_posee', tipologia);
                                            data.append('nombre_poseedor', name_posee);
                                            data.append('docu_posee', docu_posee);
                                        } else {
                                            data.append('poseedor_check', $('#cbpre2').is(':checked'));
                                        }
                                        if (document.getElementById('cbpre3').checked) {
                                            //conductor
                                            tipologia = 'conductor';
                                            campo = 'Nombre';
                                            cedula = $('#number_conductor').val();
                                            nombre = $('#name_conductor').val();
                                            ref1 = $('#referencias_empresariales1pre').val();
                                            per1 = $('#contacto_ref1pre').val();
                                            cel1 = $('#celular_ref1pre').val();
                                            cargo1 = $('#cargo_ref1pre').val();
                                            fec1 = $('#fingresoa1pre').val();
                                            fec11 = $('#fretiroa3pre').val();
                                            anti = $('#anti_ref1pre').val();
                                            //
                                            ref2 = $('#referencias_empresariales2pre').val();
                                            per2 = $('#contacto_ref2pre').val();
                                            cel2 = $('#celular_ref2pre').val();
                                            cargo2 = $('#cargo_ref2pre').val();
                                            fec2 = $('#fingresob1pre').val();
                                            fec22 = $('#fretirob3pre').val();
                                            anti2 = $('#anti_ref2pre').val();
                                            //
                                            ref3 = $('#referencias_empresariales3pre').val();
                                            per3 = $('#contacto_ref3pre').val();
                                            cel3 = $('#celular_ref3pre').val();
                                            cargo3 = $('#cargo_ref3pre').val();
                                            fec3 = $('#fingresoc1pre').val();
                                            fec33 = $('#fretiroc3pre').val();
                                            anti3 = $('#anti_ref3pre').val();

                                            data.append('conductor_check', $('#cbpre3').is(':checked'));
                                            data.append('tipo_condu', tipologia);
                                            data.append('nombre_conductor', nombre);
                                            data.append('docu_condu', cedula);
                                            data.append('refe1', ref1);
                                            data.append('contacto1', per1);
                                            data.append('celular1', cel1);
                                            data.append('cargo1', cargo1);
                                            data.append('fechaa1', $('#fingresoa1pre').val());
                                            data.append('fechaa2', fec11);
                                            data.append('anti1', anti);
                                            data.append('refe2', ref2);
                                            data.append('contacto2', per2);
                                            data.append('celular2', cel2);
                                            data.append('cargo2', cargo2);
                                            data.append('fechab1', fec2);
                                            data.append('fechab2', fec22);
                                            data.append('anti2', anti2);
                                            data.append('refe3', ref3);
                                            data.append('contacto3', per3);
                                            data.append('celular3', cel3);
                                            data.append('cargo3', cargo3);
                                            data.append('fechac1', fec3);
                                            data.append('fechac2', $('#fretiroc3pre').val());
                                            data.append('anti3', anti3);
                                        } else {
                                            data.append('conductor_check', $('#cbpre3').is(':checked'));
                                        }

                                        if (document.getElementById('cbpre4').checked) {
                                            //trailer
                                            tipologia = 'trailer';
                                            campo = 'Nombre';
                                            placa = $('#placa_trailerpre').val();
                                            propi = $('#propi_trailer').val();
                                            docupropit = $('#propidocu_trailer').val();
                                            data.append('trailer_check', $('#cbpre4').is(':checked'));
                                            data.append('tipo_trai', tipologia);
                                            data.append('placa_trailer', placa);
                                            data.append('propi_trailer', propi);
                                            data.append('propidoc_trailer', docupropit);
                                        } else {
                                            data.append('trailer_check', $('#cbpre4').is(':checked'));
                                        }
                                    }

                                }
                                await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio_itr', {
                                    method: 'POST',
                                    body: data,
                                    cache: 'no-cache',
                                })
                                    .then(response => {
                                        if (!response.ok) throw new Error(response.statusText);
                                        return response.json();
                                    })
                                    .then(function (data) {
                                        if (data.numero === 200) {
                                            mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert">
                                                <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                                                <p class="mb-0 flex-1"> ${data.mensaje}</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                            $('#crea_vehiculopreestudio').modal('hide');
                                            Filtro();
                                            Limpiarmodal();
                                            Ocultarbloque();
                                        } else {
                                            mensaje = `
                                                <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                                                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                                    <div class="message">
                                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                                    <strong>Mensaje!</strong> ${data.mensaje}
                                                    </div>
                                                </div>`;
                                            $('#crear_preestudio').show();
                                        }
                                        document.getElementById('historicos').innerHTML = mensaje;
                                    })
                                    .catch(error => {
                                        alert(error);
                                        $('#crear_preestudio').show();
                                    });
                            }
                        } else {
                            // // Convierte el HTML en una lista de textos por <p>
                            // const tempDiv = document.createElement('div');
                            // tempDiv.innerHTML = msg_error;

                            // const mensajes = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);

                            // // Mostrar en formato de lista
                            // $('#nexos_messages_popup').html(`
                            //     <div class="alert alert-outline-danger d-flex align-items-start p-2 mt-2" role="alert">
                            //         <span class="fas fa-times-circle text-danger fs-5 me-3 mt-1"></span>
                            //         <div class="message flex-grow-1">
                            //         <ul class="mb-0 mt-1 ps-3">
                            //             ${mensajes.map(msg => `<li class="text-dark" style="font-size: 13px;">${msg}</li>`).join('')}
                            //         </ul>
                            //         </div>
                            //         <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                            //     </div>
                            // `);

                            // $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                            // $('#crear_preestudio').show();

                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = msg_error;

                            // Extraer los <p> y armar lista
                            const mensajes = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);

                            // Crear lista en HTML
                            const listaMensajes = `
                                <ul style="text-align: left; padding-left: 20px; margin: 0;">
                                    ${mensajes.map(msg => `<li style="font-size: 13px; color: #333;">${msg}</li>`).join('')}
                                </ul>
                            `;

                            // Mostrar en SweetAlert2
                            Swal.fire({
                                icon: 'error',
                                title: 'Errores encontrados',
                                html: listaMensajes,
                                confirmButtonText: 'Entendido',
                                confirmButtonColor: '#d33'
                            });

                            // Scroll y mostrar tu sección si aplica
                            $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                            $('#crear_preestudio').show();
                        }
                    } else {
                        // Código a ejecutar si el usuario hace clic en "Cancelar"
                        $('#crear_preestudio').show();
                    }
                } else {
                    mensaje = `
                        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                            <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                            <div class="message">
                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                            <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                            </div>
                        </div>`;
                    document.getElementById('historicos').innerHTML = mensaje;
                    $('#crear_preestudio').show();
                }
            } else {
                /* Seundo viaje en adelante */
                if (document.getElementById('accion_propietario_trailer').textContent === 'No Aplica') {
                    if (window.datos_validado >= 3) {
                        var radio = document.getElementById('habil');
                        radio.checked = true; // Marcar como seleccionado
                        if (document.getElementById('placa').value !== '') {
                            const result = await Swal.fire({
                                title: 'Seguro',
                                text: '¿Estas seguro de realizar la operación de solicitud de vehiculo?',
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
                                // Código a ejecutar si el usuario hace clic en "Aceptar"
                                var msg_error = '';
                                if ($('#papeles').is(':checked')) {
                                    var p;
                                    for (p = 1; p == b; p++) {
                                        //var papeles = document.getElementById('documento'+i+'').files;
                                        if (!$('#tipohoja' + p + '').val()) {
                                            msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                                        }
                                        if (!$('#ruta' + p + '').val()) {
                                            msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                                        }
                                        if (!$('#namearchivo' + p + '').val()) {
                                            msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                                        }
                                    }
                                }
                                if (!$('#placag').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#placag');
                                } else {
                                    `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                                    <p class="mb-0 flex-1">${msg_error}</br></p>
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`
                                }
                                if (!$('#web').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#web');
                                } else {
                                    RemueveFoco('#web');
                                }
                                if (!$('#user_satelite').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#user_satelite');
                                } else {
                                    RemueveFoco('#user_satelite');
                                }
                                if (!$('#clave').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#clave');
                                } else {
                                    RemueveFoco('#clave');
                                }
                                if (!$('#nompro').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#nompro');
                                } else {
                                    RemueveFoco('#nompro');
                                }
                                if (!$('#docupro').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#docupro');
                                } else {
                                    RemueveFoco('#docupro');
                                }
                                if (!$('#nomtene').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#nomtene');
                                } else {
                                    RemueveFoco('#nomtene');
                                }
                                if (!$('#docutene').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#docutene');
                                } else {
                                    RemueveFoco('#docutene');
                                }
                                if (!$('#nomcondu').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#nomcondu');
                                } else {
                                    RemueveFoco('#nomcondu');
                                }
                                if (!$('#docucondu').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#docucondu');
                                } else {
                                    RemueveFoco('#docucondu');
                                }
                                if (!$('#su_propuesto').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
                                    AplicaFoco('#su_propuesto');
                                } else {
                                    RemueveFoco('#su_propuesto');
                                }
                                if (!$('#responsable_vehiculo').val()) {
                                    //campos dinamicos
                                    msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
                                    AplicaFoco('#responsable_vehiculo');
                                } else {
                                    RemueveFoco('#responsable_vehiculo');
                                }
                                if (!$('input[name=gender]').is(':checked')) {
                                    msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
                                }

                                if (!$('#total_pesos').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
                                    AplicaFoco('#total_pesos');
                                } else {
                                    RemueveFoco('#total_pesos');
                                }

                                if (!$('#capa_carga_vh').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
                                    AplicaFoco('#capa_carga_vh');
                                } else {
                                    if ($('#capa_carga_vh').val().length > 5) {
                                        msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
                                    } else {
                                        RemueveFoco('#capa_carga_vh');
                                    }
                                }
                                if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
                                    var tpeso = $('#total_pesos').val().replace(/,/g, '');
                                    var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
                                    if (parseFloat(tpeso) > parseFloat(capacidad)) {
                                        msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                                        AplicaFoco('#total_pesos');
                                        AplicaFoco('#capa_carga_vh');
                                    } else {
                                        RemueveFoco('#total_pesos');
                                        RemueveFoco('#capa_carga_vh');
                                    }
                                }
                                if ($('#estado_prefiltron').val() == '') {
                                    if (document.getElementById('nuevo').checked) {
                                        if (contador_global1 < 3) {
                                            msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                                        }
                                        var m;
                                        for (m = 1; m <= contador_global1; m++) {
                                            if (!$('#empresa_crear' + m + '').val()) {
                                                msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                                                AplicaFoco('#empresa_crear' + m + '');
                                            } else {
                                                RemueveFoco('#empresa_crear' + m + '');
                                            }

                                            if (!$('#numero_crear' + m + '').val()) {
                                                msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                                                AplicaFoco('#numero_crear' + m + '');
                                            } else {
                                                if ($('#numero_crear' + m + '').val().length !== 10) {
                                                    msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                                                } else {
                                                    RemueveFoco('#numero_crear' + m + '');
                                                }
                                            }
                                        }
                                    }

                                    /* Validar si esta checkd el campo de trailers */
                                    if (document.getElementById('propietario_obligatorio').checked) {
                                        if (document.getElementById('placat').value === '') {
                                            // console.log('campos obligatorios');
                                            $('#placat + p').remove();
                                            const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                            $('#placat').after(ERROR);
                                            AplicaFoco('#placat');
                                            msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                                        } else {
                                            $('#placat + p').remove();
                                            RemueveFoco('#placat');
                                        }

                                        if (document.getElementById('docproptrailer').value === '') {
                                            $('#docproptrailer + p').remove();
                                            const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                            $('#docproptrailer').after(ERROR2);
                                            AplicaFoco('#docproptrailer');
                                            msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                                        } else {
                                            $('#docproptrailer + p').remove();
                                            RemueveFoco('#docproptrailer');
                                        }

                                        if (document.getElementById('nomproptrailer').value === '') {
                                            $('#nomproptrailer + p').remove();
                                            const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                            $('#nomproptrailer').after(ERROR3);
                                            AplicaFoco('#nomproptrailer');
                                            msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
                                        } else {
                                            $('#nomproptrailer + p').remove();
                                            RemueveFoco('#nomproptrailer');
                                        }
                                    } else {
                                        // console.log('campos no obligatorios');
                                        $('#placat + p').remove();
                                        $('#docproptrailer + p').remove();
                                        $('#nomproptrailer + p').remove();
                                        RemueveFoco('#placat');
                                        RemueveFoco('#docproptrailer');
                                        RemueveFoco('#nomproptrailer');
                                    }

                                    if (document.getElementById('habil').checked) {
                                        if (!$('#referencias_empresariales1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#celular_ref1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#referencias_empresariales2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#celular_ref2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#referencias_empresariales3').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#celular_ref3').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        //personales
                                        if (!$('#referencias_personales1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#parenp1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#telefonop1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#referencias_personales2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#parenp2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#telefonop2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                    }
                                }

                                if (!msg_error && $('#estado_prefiltron').val() == '') {
                                    if (document.getElementById('habil').checked) {
                                        let data = new FormData();
                                        var operacion;
                                        if ($('#update').is(':checked')) {
                                            operacion = 'Actualizar';
                                        }
                                        if ($('#habil').is(':checked')) {
                                            operacion = 'Habilitar';
                                        }
                                        let fletef = $('#su_propuesto').val().split(',').join('');
                                        let tarifaf = $('#su_tarifacot').val().split(',').join('');
                                        data.append('tipo_operacion', operacion);
                                        data.append('placa', document.getElementById('placag').value);
                                        data.append('flete_subasta', fletef);
                                        data.append('tarifa_subasta', tarifaf);
                                        data.append('fecha', $('#fpree').val());
                                        data.append('hora', $('#hpree').val());
                                        data.append('usuario', $('#userpree').val());
                                        data.append('papeles', 'sin_datos');
                                        data.append('solicitud', document.getElementById('servicio_base').value);
                                        data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                                        data.append('empresa_cliente', $('#empresa_cliente').val());
                                        data.append('EscenarioId', EscenarioId);
                                        // Solicitudes de servicio
                                        var solicitudes = document.getElementsByName('fserva[]');
                                        for (var i = 0; i < solicitudes.length; i++) {
                                            data.append('fserva[]', solicitudes[i].value);
                                        }

                                        //se construye el objeto que almacena los datos
                                        let element = {
                                            tipohojahv: [],
                                            campos: [],
                                            datos: [],
                                            namearchivo: [],
                                        };

                                        await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio_itr_subasta', {
                                            method: 'POST',
                                            body: data,
                                            cache: 'no-cache',
                                        })
                                            .then(response => {
                                                if (!response.ok) throw new Error(response.statusText);
                                                return response.json();
                                            })
                                            .then(function (data) {
                                                if (data.numero === 200) {
                                                    // mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert">
                                                    //     <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                                                    //     <p class="mb-0 flex-1"> ${data.mensaje}</p>
                                                    //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                                    // </div>`;
                                                    // $('#crea_vehiculopreestudio').modal('hide');
                                                    myOffcanvas.hide();
                                                    Swal.fire({
                                                        title: 'Solicitud Guardada',
                                                        text: data.mensaje || 'La solicitud fue guardada exitosamente.',
                                                        icon: 'success',
                                                        confirmButtonColor: '#3B71CA',
                                                        customClass: {
                                                            popup: 'swal2-custom-font',
                                                        },
                                                    });
                                                    Filtro();
                                                    Limpiarmodal();
                                                    Ocultarbloque();
                                                } else {
                                                    // mensaje = `
                                                    // <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                                                    //     <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                                    //     <div class="message">
                                                    //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                                    //     <strong>Mensaje!</strong> ${data.mensaje}
                                                    //     </div>
                                                    // </div>`;
                                                    // $('#crear_preestudio').show();
                                                    Swal.fire({
                                                        title: 'Error',
                                                        text: data.mensaje,
                                                        icon: 'success',
                                                        confirmButtonColor: '#3B71CA',
                                                        customClass: {
                                                            popup: 'swal2-custom-font',
                                                        },
                                                    });
                                                }
                                                document.getElementById('historicos').innerHTML = mensaje;
                                            })
                                            .catch(error => {
                                                alert(error);
                                                $('#crear_preestudio').show();
                                            });
                                    }
                                } else {
                                    // alert("HOLA MUNDO DESDE ESTE LADO 2");
                                    // Convierte el HTML en una lista de textos por <p>
                                    const tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = msg_error;

                                    const mensajes = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);

                                    // Mostrar en formato de lista
                                    $('#nexos_messages_popup').html(`
                                        <div class="alert alert-outline-danger d-flex align-items-start p-2 mt-2" role="alert">
                                            <span class="fas fa-times-circle text-danger fs-5 me-3 mt-1"></span>
                                            <div class="message flex-grow-1">
                                            <ul class="mb-0 mt-1 ps-3">
                                                ${mensajes.map(msg => `<li class="text-dark" style="font-size: 13px;">${msg}</li>`).join('')}
                                            </ul>
                                            </div>
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    `);
                                    $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                                    $('#crear_preestudio').show();
                                }
                            } else {
                                // Código a ejecutar si el usuario hace clic en "Cancelar"
                                $('#crear_preestudio').show();
                            }
                        } else {
                            mensaje = `
                            <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                <div class="message">
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                                </div>
                            </div>`;
                            document.getElementById('historicos').innerHTML = mensaje;
                            // alert("debe diligenciar la placa para la solicitud");
                            $('#crear_preestudio').show();
                        }
                    } else {
                        // console.log('debe diligenciar la validacion de parametros');
                        document.getElementById('mensaje_itr').innerHTML = `
                            <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                            <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                            <div class="message">
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Advertencia!</strong> Debe verificar los datos para poder generar la orden de cargue nuevamente.
                            </div>
                            </div>`;
                    }
                } else {
                    if (window.datos_validado >= 4) {
                        var radio = document.getElementById('habil');
                        radio.checked = true; // Marcar como seleccionado
                        if (document.getElementById('placa').value !== '') {
                            const result = await Swal.fire({
                                title: 'Seguro',
                                text: '¿Estas seguro de realizar la operación de solicitud de vehiculo?',
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
                                // Código a ejecutar si el usuario hace clic en "Aceptar"
                                var msg_error = '';
                                if ($('#papeles').is(':checked')) {
                                    var p;
                                    for (p = 1; p == b; p++) {
                                        if (!$('#tipohoja' + p + '').val()) {
                                            msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                                        }
                                        if (!$('#ruta' + p + '').val()) {
                                            msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                                        }
                                        if (!$('#namearchivo' + p + '').val()) {
                                            msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                                        }
                                    }
                                }
                                if (!$('#placag').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#placag');
                                } else {
                                    `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                                    <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                                    <p class="mb-0 flex-1">${msg_error}</br></p>
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`
                                }
                                if (!$('#web').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#web');
                                } else {
                                    RemueveFoco('#web');
                                }
                                if (!$('#user_satelite').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#user_satelite');
                                } else {
                                    RemueveFoco('#user_satelite');
                                }
                                if (!$('#clave').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#clave');
                                } else {
                                    RemueveFoco('#clave');
                                }
                                if (!$('#nompro').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#nompro');
                                } else {
                                    RemueveFoco('#nompro');
                                }
                                if (!$('#docupro').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#docupro');
                                } else {
                                    RemueveFoco('#docupro');
                                }
                                if (!$('#nomtene').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#nomtene');
                                } else {
                                    RemueveFoco('#nomtene');
                                }
                                if (!$('#docutene').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#docutene');
                                } else {
                                    RemueveFoco('#docutene');
                                }
                                if (!$('#nomcondu').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#nomcondu');
                                } else {
                                    RemueveFoco('#nomcondu');
                                }
                                if (!$('#docucondu').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
                                    AplicaFoco('#docucondu');
                                } else {
                                    RemueveFoco('#docucondu');
                                }
                                if (!$('#su_propuesto').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
                                    AplicaFoco('#su_propuesto');
                                } else {
                                    RemueveFoco('#su_propuesto');
                                }
                                if (!$('#responsable_vehiculo').val()) {
                                    //campos dinamicos
                                    msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
                                    AplicaFoco('#responsable_vehiculo');
                                } else {
                                    RemueveFoco('#responsable_vehiculo');
                                }
                                if (!$('input[name=gender]').is(':checked')) {
                                    msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
                                }

                                if (!$('#total_pesos').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
                                    AplicaFoco('#total_pesos');
                                } else {
                                    RemueveFoco('#total_pesos');
                                }

                                if (!$('#capa_carga_vh').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
                                    AplicaFoco('#capa_carga_vh');
                                } else {
                                    if ($('#capa_carga_vh').val().length > 5) {
                                        msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
                                    } else {
                                        RemueveFoco('#capa_carga_vh');
                                    }
                                }
                                if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
                                    var tpeso = $('#total_pesos').val().replace(/,/g, '');
                                    var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
                                    if (parseFloat(tpeso) > parseFloat(capacidad)) {
                                        msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                                        AplicaFoco('#total_pesos');
                                        AplicaFoco('#capa_carga_vh');
                                    } else {
                                        RemueveFoco('#total_pesos');
                                        RemueveFoco('#capa_carga_vh');
                                    }
                                }
                                if ($('#estado_prefiltron').val() == '') {
                                    if (document.getElementById('nuevo').checked) {
                                        if (contador_global1 < 3) {
                                            msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                                        }
                                        var m;
                                        for (m = 1; m <= contador_global1; m++) {
                                            if (!$('#empresa_crear' + m + '').val()) {
                                                msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                                                AplicaFoco('#empresa_crear' + m + '');
                                            } else {
                                                RemueveFoco('#empresa_crear' + m + '');
                                            }

                                            if (!$('#numero_crear' + m + '').val()) {
                                                msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                                                AplicaFoco('#numero_crear' + m + '');
                                            } else {
                                                if ($('#numero_crear' + m + '').val().length !== 10) {
                                                    msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                                                } else {
                                                    RemueveFoco('#numero_crear' + m + '');
                                                }
                                            }
                                        }
                                    }

                                    /* Validar si esta checkd el campo de trailers */
                                    if (document.getElementById('propietario_obligatorio').checked) {
                                        if (document.getElementById('placat').value === '') {
                                            // console.log('campos obligatorios');
                                            $('#placat + p').remove();
                                            const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                            $('#placat').after(ERROR);
                                            AplicaFoco('#placat');
                                            msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                                        } else {
                                            $('#placat + p').remove();
                                            RemueveFoco('#placat');
                                        }

                                        if (document.getElementById('docproptrailer').value === '') {
                                            $('#docproptrailer + p').remove();
                                            const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                            $('#docproptrailer').after(ERROR2);
                                            AplicaFoco('#docproptrailer');
                                            msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                                        } else {
                                            $('#docproptrailer + p').remove();
                                            RemueveFoco('#docproptrailer');
                                        }

                                        if (document.getElementById('nomproptrailer').value === '') {
                                            $('#nomproptrailer + p').remove();
                                            const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                            $('#nomproptrailer').after(ERROR3);
                                            AplicaFoco('#nomproptrailer');
                                            msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
                                        } else {
                                            $('#nomproptrailer + p').remove();
                                            RemueveFoco('#nomproptrailer');
                                        }
                                    } else {
                                        // console.log('campos no obligatorios');
                                        $('#placat + p').remove();
                                        $('#docproptrailer + p').remove();
                                        $('#nomproptrailer + p').remove();
                                        RemueveFoco('#placat');
                                        RemueveFoco('#docproptrailer');
                                        RemueveFoco('#nomproptrailer');
                                    }

                                    if (document.getElementById('habil').checked) {
                                        if (!$('#referencias_empresariales1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#celular_ref1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#referencias_empresariales2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#celular_ref2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#referencias_empresariales3').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#celular_ref3').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        //personales
                                        if (!$('#referencias_personales1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#parenp1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#telefonop1').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#referencias_personales2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#parenp2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                        if (!$('#telefonop2').val()) {
                                            msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                                        }
                                    }
                                }

                                if (!msg_error && $('#estado_prefiltron').val() == '') {
                                    if (document.getElementById('habil').checked) {
                                        let data = new FormData();
                                        var operacion;
                                        if ($('#update').is(':checked')) {
                                            operacion = 'Actualizar';
                                        }
                                        if ($('#habil').is(':checked')) {
                                            operacion = 'Habilitar';
                                        }
                                        let fletef = $('#su_propuesto').val().split(',').join('');
                                        let tarifaf = $('#su_tarifacot').val().split(',').join('');
                                        data.append('tipo_operacion', operacion);
                                        data.append('placa', document.getElementById('placag').value);
                                        data.append('flete_subasta', fletef);
                                        data.append('tarifa_subasta', tarifaf);
                                        data.append('fecha', $('#fpree').val());
                                        data.append('hora', $('#hpree').val());
                                        data.append('usuario', $('#userpree').val());
                                        data.append('papeles', 'sin_datos');
                                        data.append('solicitud', document.getElementById('servicio_base').value);
                                        data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                                        data.append('empresa_cliente', $('#empresa_cliente').val());
                                        // Solicitudes de servicio
                                        var solicitudes = document.getElementsByName('fserva[]');
                                        for (var i = 0; i < solicitudes.length; i++) {
                                            data.append('fserva[]', solicitudes[i].value);
                                        }
                                        //se construye el objeto que almacena los datos
                                        let element = {
                                            tipohojahv: [],
                                            campos: [],
                                            datos: [],
                                            namearchivo: [],
                                        };

                                        await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio_itr_subasta', {
                                            method: 'POST',
                                            body: data,
                                            cache: 'no-cache',
                                        })
                                            .then(response => {
                                                if (!response.ok) throw new Error(response.statusText);
                                                return response.json();
                                            })
                                            .then(function (data) {
                                                if (data.numero === 200) {
                                                    // mensaje = `<div class="alert alert-outline-success d-flex align-items-center" role="alert">
                                                    //     <span class="fas fa-check-circle text-success fs-5 me-3"></span>
                                                    //     <p class="mb-0 flex-1"> ${data.mensaje}</p>
                                                    //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                                    // </div>`;
                                                    // $('#crea_vehiculopreestudio').modal('hide');
                                                    myOffcanvas.hide();
                                                    Swal.fire({
                                                        title: 'Solicitud Guardada',
                                                        text: data.mensaje || 'La solicitud fue guardada exitosamente.',
                                                        icon: 'success',
                                                        confirmButtonColor: '#3B71CA',
                                                        customClass: {
                                                            popup: 'swal2-custom-font',
                                                        },
                                                    });
                                                    Filtro();
                                                    Limpiarmodal();
                                                    Ocultarbloque();
                                                } else {
                                                    // mensaje = `
                                                    // <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                                                    //     <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                                    //     <div class="message">
                                                    //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                                    //     <strong>Mensaje!</strong> ${data.mensaje}
                                                    //     </div>
                                                    // </div>`;
                                                    // $('#crear_preestudio').show();
                                                    // myOffcanvas.hide();
                                                    Swal.fire({
                                                        title: 'Error',
                                                        text: data.mensaje,
                                                        icon: 'success',
                                                        confirmButtonColor: '#3B71CA',
                                                        customClass: {
                                                            popup: 'swal2-custom-font',
                                                        },
                                                    });
                                                }
                                                document.getElementById('historicos').innerHTML = mensaje;
                                            })
                                            .catch(error => {
                                                alert(error);
                                                $('#crear_preestudio').show();
                                            });
                                    }
                                } else {
                                    // alert("HOLA MUNDO DESDE ESTE LADO 3");
                                    // Convierte el HTML en una lista de textos por <p>
                                    const tempDiv = document.createElement('div');
                                    tempDiv.innerHTML = msg_error;

                                    const mensajes = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);

                                    // Mostrar en formato de lista
                                    $('#nexos_messages_popup').html(`
                                        <div class="alert alert-outline-danger d-flex align-items-start p-2 mt-2" role="alert">
                                            <span class="fas fa-times-circle text-danger fs-5 me-3 mt-1"></span>
                                            <div class="message flex-grow-1">
                                            <ul class="mb-0 mt-1 ps-3">
                                                ${mensajes.map(msg => `<li class="text-dark" style="font-size: 13px;">${msg}</li>`).join('')}
                                            </ul>
                                            </div>
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    `);
                                    $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                                    $('#crear_preestudio').show();
                                }
                            } else {
                                // Código a ejecutar si el usuario hace clic en "Cancelar"
                                $('#crear_preestudio').show();
                            }
                        } else {
                            mensaje = `
                            <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                <div class="message">
                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                                </div>
                            </div>`;
                            document.getElementById('historicos').innerHTML = mensaje;
                            // alert("debe diligenciar la placa para la solicitud");
                            $('#crear_preestudio').show();
                        }
                    } else {
                        // console.log('debe diligenciar la validacion de parametros');
                        document.getElementById('mensaje_itr').innerHTML = `
                        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                        <div class="icon"><span class="mdi mdi-alert-triangle"></span></div>
                        <div class="message">
                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Advertencia!</strong> Debe verificar los datos para poder generar la orden de cargue nuevamente.
                        </div>
                        </div>`;
                    }
                }
            }
        } else {
            if (document.getElementById('placa').value !== '') {
                const result = await Swal.fire({
                    title: 'Seguro',
                    text: '¿Estas seguro de realizar la operación de solicitud de vehiculo?',
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
                    // Código a ejecutar si el usuario hace clic en "Aceptar"
                    var msg_error = '';
                    if ($('#papeles').is(':checked')) {
                        var p;
                        for (p = 1; p == b; p++) {
                            //var papeles = document.getElementById('documento'+i+'').files;
                            if (!$('#tipohoja' + p + '').val()) {
                                msg_error += '<p>Debe diligenciar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para poder crear el prefiltro.</p>';
                            }
                            if (!$('#ruta' + p + '').val()) {
                                msg_error += '<p>Debe seleccionar el campo <strong>Tipo hoja de vida  en la fila ' + p + '</strong> para que aparezca una ruta y poder crear el prefiltro.</p>';
                            }
                            if (!$('#namearchivo' + p + '').val()) {
                                msg_error += '<p>Debe seleccionar un  <strong>(1) Archivo  en la fila ' + p + ' </strong> para poder crear el prefiltro.</p>';
                            }
                        }
                    }

                    if (!$('#placag').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#placag');
                    } else {
                        `<div class="alert alert-outline-danger d-flex align-items-center" role="alert">
                            <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
                            <p class="mb-0 flex-1">${msg_error}</br></p>
                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`
                    }

                    if (!$('#web').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Web satélital</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#web');
                    } else {
                        RemueveFoco('#web');
                    }

                    if (!$('#user_satelite').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>usuario</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#user_satelite');
                    } else {
                        RemueveFoco('#user_satelite');
                    }

                    if (!$('#clave').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Clave</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#clave');
                    } else {
                        RemueveFoco('#clave');
                    }

                    if (!$('#nompro').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Propietario</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#nompro');
                    } else {
                        RemueveFoco('#nompro');
                    }

                    if (!$('#docupro').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Documento de Propietario</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#docupro');
                    } else {
                        RemueveFoco('#docupro');
                    }

                    if (!$('#nomtene').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Tenedor</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#nomtene');
                    } else {
                        RemueveFoco('#nomtene');
                    }

                    if (!$('#docutene').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Documento de Tenedor</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#docutene');
                    } else {
                        RemueveFoco('#docutene');
                    }

                    if (!$('#nomcondu').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Nombre de Conductor</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#nomcondu');
                    } else {
                        RemueveFoco('#nomcondu');
                    }

                    if (!$('#docucondu').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Documento de Conductor</strong> para poder crear el vehículo.</p>';
                        AplicaFoco('#docucondu');
                    } else {
                        RemueveFoco('#docucondu');
                    }

                    if (!$('#su_propuesto').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Flete propuesto </strong>en datos de la subasta para poder crear el vehículo.</p>';
                        AplicaFoco('#su_propuesto');
                    } else {
                        RemueveFoco('#su_propuesto');
                    }

                    if (!$('#responsable_vehiculo').val()) {
                        //campos dinamicos
                        msg_error += '<p>Debe seleccionar un <strong>Responsable </strong> del vehículo para poder crear la solicitudocument.</p>';
                        AplicaFoco('#responsable_vehiculo');
                    } else {
                        RemueveFoco('#responsable_vehiculo');
                    }

                    if (!$('input[name=gender]').is(':checked')) {
                        msg_error += '<p>Debe diligenciar el <strong>Tipo de operación</strong> para poder crear el vehículo.</p>';
                    }

                    if (!$('#total_pesos').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Total Peso(Kg) </strong>en datos de la solicitud para poder crear el vehículo.</p>';
                        AplicaFoco('#total_pesos');
                    } else {
                        RemueveFoco('#total_pesos');
                    }

                    if (!$('#capa_carga_vh').val()) {
                        msg_error += '<p>Debe diligenciar el campo <strong>Capacidad carga(Kg)</strong>en datos de la solicitud para poder crear el vehículo.</p>';
                        AplicaFoco('#capa_carga_vh');
                    } else {
                        if ($('#capa_carga_vh').val().length > 5) {
                            msg_error += '<p>El campo <strong>Capacidad carga(Kg)</strong> debe tener máximo 5 dígitos.</p>';
                        } else {
                            RemueveFoco('#capa_carga_vh');
                        }
                    }

                    if ($('#total_pesos').val() != '' && $('#capa_carga_vh').val() != '') {
                        var tpeso = $('#total_pesos').val().replace(/,/g, '');
                        var capacidad = $('#capa_carga_vh').val().replace(/,/g, '');
                        if (parseFloat(tpeso) > parseFloat(capacidad)) {
                            msg_error += '<p>El <strong>Total sumatoria Peso(Kg) </strong> debe ser menor o igual a la <strong>Capacidad de carga vehículo(Kg)</strong></p>';
                            AplicaFoco('#total_pesos');
                            AplicaFoco('#capa_carga_vh');
                        } else {
                            RemueveFoco('#total_pesos');
                            RemueveFoco('#capa_carga_vh');
                        }
                    }

                    if ($('#estado_prefiltron').val() == '') {
                        if (document.getElementById('nuevo').checked) {
                            if (contador_global1 < 3) {
                                msg_error += '<p>Debe diligenciar mínimo <strong>tres referencias laborales</strong> para poder crear la referencia.</p>';
                            }
                            var m;
                            for (m = 1; m <= contador_global1; m++) {
                                if (!$('#empresa_crear' + m + '').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Empresa ' + m + ' </strong> para poder crear la referencia.</p>';
                                    AplicaFoco('#empresa_crear' + m + '');
                                } else {
                                    RemueveFoco('#empresa_crear' + m + '');
                                }

                                if (!$('#numero_crear' + m + '').val()) {
                                    msg_error += '<p>Debe diligenciar el campo <strong>Teléfono ' + m + ' </strong> para poder crear la referencia.</p>';
                                    AplicaFoco('#numero_crear' + m + '');
                                } else {
                                    if ($('#numero_crear' + m + '').val().length !== 10) {
                                        msg_error += '<p>El campo <strong>Teléfono ' + m + ' </strong> debe tener 10 dígitos.</p>';
                                    } else {
                                        RemueveFoco('#numero_crear' + m + '');
                                    }
                                }
                            }
                        }

                        /* Validar si esta checkd el campo de trailers */
                        if (document.getElementById('propietario_obligatorio').checked) {
                            if (document.getElementById('placat').value === '') {
                                // console.log('campos obligatorios');
                                $('#placat + p').remove();
                                const ERROR = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                $('#placat').after(ERROR);
                                AplicaFoco('#placat');
                                msg_error += '<p>Debe diligenciar <strong>placa</strong> del trailer para poder crear la solicitudocument.</p>';
                            } else {
                                $('#placat + p').remove();
                                RemueveFoco('#placat');
                            }

                            if (document.getElementById('docproptrailer').value === '') {
                                $('#docproptrailer + p').remove();
                                const ERROR2 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                $('#docproptrailer').after(ERROR2);
                                AplicaFoco('#docproptrailer');
                                msg_error += '<p>Debe diligenciar <strong>Documento Propietario trailer</strong> para poder crear la solicitudocument.</p>';
                            } else {
                                $('#docproptrailer + p').remove();
                                RemueveFoco('#docproptrailer');
                            }

                            if (document.getElementById('nomproptrailer').value === '') {
                                $('#nomproptrailer + p').remove();
                                const ERROR3 = $('<p></p>').text('El campo es obligatorio').addClass('bg-danger text-center').css({ color: '#FFF', 'font-size': '11px', margin: 0 });
                                $('#nomproptrailer').after(ERROR3);
                                AplicaFoco('#nomproptrailer');
                                msg_error += '<p>Debe diligenciar <strong>Nombre Propietario Trailer</strong> para poder crear la solicitudocument.</p>';
                            } else {
                                $('#nomproptrailer + p').remove();
                                RemueveFoco('#nomproptrailer');
                            }
                        } else {
                            // console.log('campos no obligatorios');
                            $('#placat + p').remove();
                            $('#docproptrailer + p').remove();
                            $('#nomproptrailer + p').remove();
                            RemueveFoco('#placat');
                            RemueveFoco('#docproptrailer');
                            RemueveFoco('#nomproptrailer');
                        }

                        if (document.getElementById('habil').checked || document.getElementById('update').checked) {
                            if (!$('#referencias_empresariales1').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Referencias laboral 1</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#celular_ref1').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Celular laboral 1</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#referencias_empresariales2').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Referencias laboral 2</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#celular_ref2').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Celular laboral 2</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#referencias_empresariales3').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Referencias laboral 3</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#celular_ref3').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Celular laboral 3</strong> para poder crear la solicitudocument.</p>';
                            }
                            //personales
                            if (!$('#referencias_personales1').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Nombre persona 1</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#parenp1').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Parentezco 1</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#telefonop1').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Teléfono 1</strong> en ref. personal para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#referencias_personales2').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Nombre persona 2</strong> en ref. personal para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#parenp2').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Parentezco 2</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (!$('#telefonop2').val()) {
                                msg_error += '<p>Debe diligenciar <strong>Teléfono 2</strong> para poder crear la solicitudocument.</p>';
                            }
                            if (document.getElementById('update').checked) {
                                if (!document.getElementById('cbox1').checked && !document.getElementById('cbox2').checked) {
                                    msg_error += '<p>Debe seleccionar <strong>una opción de recurso</strong> para poder crear la solicitud (Actualiza seguridad).</p>';
                                } else {
                                    if (document.getElementById('cbox1').checked) {
                                        //registrar campos nuevos
                                        if (
                                            !document.getElementById('cbpre1').checked &&
                                            !document.getElementById('cbpre2').checked &&
                                            !document.getElementById('cbpre3').checked &&
                                            !document.getElementById('cbpre4').checked &&
                                            !document.getElementById('cbpre5').checked
                                        ) {
                                            msg_error += '<p>Por favor seleccione el recurso a crear , opción seleccionada <strong>Recursos inexistentes</strong>.</p>';
                                        } else {
                                            if (document.getElementById('cbpre1').checked) {
                                                //propietario
                                                if (!$('#name_propietario').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Nombre Propietario</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#number_propietario').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Documento Propietario</strong> para poder crear la solicitudocument.</p>';
                                                }
                                            }

                                            if (document.getElementById('cbpre2').checked) {
                                                //poseedor
                                                if (!$('#name_poseedor').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Nombre Poseedor</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#number_poseedor').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Documento Poseedor</strong> para poder crear la solicitudocument.</p>';
                                                }
                                            }

                                            if (document.getElementById('cbpre3').checked) {
                                                //conductor
                                                if (!$('#name_conductor').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Nombre Conductor</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#number_conductor').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Documento Conductor</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#referencias_empresariales1pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Nombre referencia 1</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#contacto_ref1pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Persona contacto 1</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#celular_ref1pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Celular empresa 1</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#referencias_empresariales2pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Nombre referencia 2</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#contacto_ref2pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Persona contacto 2</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#celular_ref2pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Celular empresa 2</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#referencias_empresariales3pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Nombre referencia 3</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#contacto_ref3pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Persona contacto 3</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#celular_ref3pre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Celular empresa 3</strong> para poder crear la solicitudocument.</p>';
                                                }
                                            }

                                            if (document.getElementById('cbpre4').checked) {
                                                //trailer
                                                if (!$('#placa_trailerpre').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Placa tráiler</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#propi_trailer').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Nombre propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                                                }
                                                if (!$('#propidocu_trailer').val()) {
                                                    msg_error += '<p>Debe diligenciar <strong>Documento propietario tráiler</strong> para poder crear la solicitudocument.</p>';
                                                }
                                            }
                                        }
                                    }
                                    if (document.getElementById('cbox2').checked) {
                                        //campos dinamicos
                                        var idfila = $('#cuerpo_actu tr').length; //cantidad de filas de la tabla
                                        if (idfila == 0) {
                                            msg_error += '<p>Debe ingresar <strong>Mínimo 1 dato </strong> en bloque actualizar seguridad para poder crear la solicitudocument.</p>';
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Validar la condifugracion de los vehiculos nuevos para el sicetac
                    if (!$('#configuracion_vehiculo').val()) {
                        //campos dinamicos
                        msg_error += '<p>Debe seleccionar una <strong>Configuración </strong> del vehículo para poder crear la solicitudocument.</p>';
                        AplicaFoco('#configuracion_vehiculo');
                    } else {
                        RemueveFoco('#configuracion_vehiculo');
                    }

                    if (!msg_error && $('#estado_prefiltron').val() == '') {
                        if (comprobar() === false) {
                            if (document.getElementById('nuevo').checked) {
                                let data = new FormData();
                                var operacion;
                                if ($('#update').is(':checked')) {
                                    operacion = 'Actualizar';
                                }

                                if ($('#nuevo').is(':checked')) {
                                    operacion = 'Nuevo';
                                }
                                if ($('#habil').is(':checked')) {
                                    operacion = 'Habilitar';
                                }
                                let fletef = $('#su_propuesto').val().split(',').join('');
                                let tarifaf = $('#su_tarifacot').val().split(',').join('');
                                data.append('placa', document.getElementById('placag').value);
                                // Datos del propietario del vehiculo
                                data.append('trailer', document.getElementById('placat').value);
                                data.append('documento_propietario_trailer', document.getElementById('docproptrailer').value);
                                data.append('propietario_trailer', document.getElementById('nomproptrailer').value);
                                data.append('propietario', document.getElementById('nompro').value);
                                data.append('documento_pro', document.getElementById('docupro').value);
                                data.append('tenedor', document.getElementById('nomtene').value);
                                data.append('documento_tene', document.getElementById('docutene').value);
                                data.append('conductor', document.getElementById('nomcondu').value);
                                data.append('documento_condu', document.getElementById('docucondu').value);
                                data.append('web', document.getElementById('web').value);
                                data.append('user_satelite', document.getElementById('user_satelite').value);
                                data.append('clave', document.getElementById('clave').value);
                                data.append('tipologianuevo', $('#nuevo').val());
                                data.append('tipologiahabilte', $('#habilite').val());
                                data.append('tipologiaactualice', $('#actualice').val());
                                data.append('tipo_operacion', operacion);
                                data.append('fecha', $('#fpree').val());
                                data.append('hora', $('#hpree').val());
                                data.append('usuario', $('#userpree').val());
                                data.append('observacion', $('#obserpree').val());
                                data.append('su_sumatorianeto', $('#su_sumatorianeto').val());
                                data.append('total_peso', $('#total_peso').val());
                                data.append('flete_subasta', fletef);
                                data.append('tarifa_subasta', tarifaf);
                                data.append('propietario_obligatorio', $('#propietario_obligatorio').is(':checked'));
                                /* Responsable vehiculo */
                                data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                                data.append('empresa_cliente', $('#empresa_cliente').val());
                                data.append('EscenarioId', EscenarioId);

                                let datos_referencias = {
                                    empresa_crear: [],
                                    fingreso_crear: [],
                                    fretiro_crear: [],
                                    contacto_crear: [],
                                    numero_crear: [],
                                    cargo_crear: [],
                                    antiguedad_crear: [],
                                };

                                // Llenamos el array por campo
                                document.querySelectorAll('[name="empresa_crear[]"]').forEach(el => {
                                    datos_referencias.empresa_crear.push(el.value);
                                });

                                document.querySelectorAll('[name="fingreso_crear[]"]').forEach(el => {
                                    datos_referencias.fingreso_crear.push(el.value);
                                });

                                document.querySelectorAll('[name="fretiro_crear[]"]').forEach(el => {
                                    datos_referencias.fretiro_crear.push(el.value);
                                });

                                document.querySelectorAll('[name="contacto_crear[]"]').forEach(el => {
                                    datos_referencias.contacto_crear.push(el.value);
                                });

                                document.querySelectorAll('[name="numero_crear[]"]').forEach(el => {
                                    datos_referencias.numero_crear.push(el.value);
                                });

                                document.querySelectorAll('[name="cargo_crear[]"]').forEach(el => {
                                    datos_referencias.cargo_crear.push(el.value);
                                });

                                document.querySelectorAll('[name="antiguedad_crear[]"]').forEach(el => {
                                    datos_referencias.antiguedad_crear.push(el.value);
                                });

                                // Convertimos a JSON
                                let nota_referencias = JSON.stringify(datos_referencias);

                                // Agregamos al FormData
                                data.append('referencias_laborales', nota_referencias);

                                // Solicitudes de servicio
                                var solicitudes = document.getElementsByName('fserva[]');
                                for (var i = 0; i < solicitudes.length; i++) {
                                    data.append('fserva[]', solicitudes[i].value);
                                }

                                //se construye el objeto que almacena los datos
                                let datos = {
                                    tipohoja: [],
                                    clase: [],
                                    ruta: [],
                                    documento: [],
                                    namearchivo: [],
                                    papeles: [],
                                };

                                //Archivos
                                var cantp = $('#cont_papel').val();
                                if (cantp > 0) {
                                    var tipohj = document.getElementsByName('tipohoja[]');
                                    for (var i = 0; i < tipohj.length; i++) {
                                        var tipo = tipohj[i].value;
                                        datos.tipohoja[i] = tipo;
                                    }
                                    var clase = document.getElementsByName('clase[]');
                                    for (var i = 0; i < clase.length; i++) {
                                        var clas = clase[i].value;
                                        datos.clase[i] = clas;
                                    }

                                    var ruta = document.getElementsByName('ruta[]');
                                    for (var i = 0; i < ruta.length; i++) {
                                        var rut = ruta[i].value;
                                        datos.ruta[i] = rut;
                                    }

                                    var documento = document.getElementsByName('documento[]');
                                    for (var i = 0; i < documento.length; i++) {
                                        var doc = documento[i].value;
                                        datos.documento[i] = doc;
                                    }

                                    var namearchivo = document.getElementsByName('namearchivo[]');
                                    for (var i = 0; i < namearchivo.length; i++) {
                                        var name = namearchivo[i].value;
                                        datos.namearchivo[i] = name;
                                    }

                                    var u;
                                    for (u = 1; u <= cantp; u++) {
                                        data.append('Papel', $('#papeles').is(':checked'));
                                        var papeles = document.getElementById('documento' + u + '').files;
                                        if (papeles.length > 0) {
                                            for (var a = 0; a < papeles.length; a++) {
                                                data.append('papeles[]', papeles[a]);
                                            }
                                        } else {
                                            data.append('papeles', 'sin_datos');
                                        }
                                    }
                                    // Nuevo Array completo
                                    var nota = datos;
                                    nota = JSON.stringify(nota);
                                    data.append('notas', nota);
                                }
                                await fetch($('#base_url').val() + 'validacionparametros/Insertar_preestudio_nuevo', {
                                    method: 'POST',
                                    body: data,
                                    cache: 'no-cache',
                                })
                                    .then(response => {
                                        if (!response.ok) throw new Error(response.statusText);
                                        return response.json();
                                    })
                                    .then(function (datas) {
                                        console.log(datas);
                                        if (datas) {
                                            myOffcanvas.hide();
                                            Swal.fire({
                                                title: 'Solicitud Guardada',
                                                text: datas || 'La solicitud fue guardada exitosamente.',
                                                icon: 'success',
                                                confirmButtonColor: '#3B71CA',
                                                customClass: {
                                                    popup: 'swal2-custom-font',
                                                },
                                            });
                                            Filtro();
                                            Limpiarmodal();
                                            Ocultarbloque();
                                            $('#crear_preestudio').show();
                                            resetReferencias();
                                        } else {
                                            alert('error');
                                            $('#crear_preestudio').show();
                                        }
                                    })
                                    .catch(error => {
                                        Swal.fire({
                                            title: 'Solicitud Guardada',
                                            text: error || 'La solicitud fue guardada exitosamente.',
                                            icon: 'success',
                                            confirmButtonColor: '#3B71CA',
                                            customClass: {
                                                popup: 'swal2-custom-font',
                                            },
                                        });
                                    });
                            }
                        }

                        if (document.getElementById('habil').checked || document.getElementById('update').checked) {
                            let data = new FormData();
                            var operacion;
                            if ($('#update').is(':checked')) {
                                operacion = 'Actualizar';
                            }
                            if ($('#habil').is(':checked')) {
                                operacion = 'Habilitar';
                            }
                            let fletef = $('#su_propuesto').val().split(',').join('');
                            let tarifaf = $('#su_tarifacot').val().split(',').join('');
                            data.append('tipo_operacion', operacion);
                            data.append('placa', document.getElementById('placag').value);
                            data.append('flete_subasta', fletef);
                            data.append('tarifa_subasta', tarifaf);
                            data.append('fecha', $('#fpree').val());
                            data.append('hora', $('#hpree').val());
                            data.append('usuario', $('#userpree').val());
                            data.append('papeles', 'sin_datos');
                            data.append('observacion', $('#obserpree').val());
                            /* Responsable vehiculo */
                            data.append('responsable_vehiculo', $('#responsable_vehiculo').val());
                            data.append('empresa_cliente', $('#empresa_cliente').val());
                            data.append('EscenarioId', EscenarioId);
                            // Solicitudes de servicio
                            var solicitudes = document.getElementsByName('fserva[]');
                            for (var i = 0; i < solicitudes.length; i++) {
                                data.append('fserva[]', solicitudes[i].value);
                            }

                            //se construye el objeto que almacena los datos
                            let element = {
                                tipohojahv: [],
                                campos: [],
                                datos: [],
                                namearchivo: [],
                            };

                            if ($('#update').is(':checked')) {
                                //insercion de datos dinamicos
                                if (document.getElementById('cbox2').checked) {
                                    data.append('dinamicos', 'si');
                                    var cantp = $('#valortb').val();
                                    if (cantp > 0) {
                                        var e, n;
                                        for (e = 1; e <= cantp; e++) {
                                            if (typeof $('#sa' + e).val() !== 'undefined') {
                                                var tipohv = $('#fila' + e).find('td').eq(1).find('a').text();
                                                var campo = $('#fila' + e + '').find('td').eq(2).html();
                                                var dato = $('#fila' + e + '').find('td').eq(3).html();
                                                var namea = $('#nam' + e + '').val();
                                                var papeles = document.getElementById('arc' + e + '').files;
                                                if (papeles.length > 0) {
                                                    for (var a = 0; a < papeles.length; a++) {
                                                        data.append('papeles[]', papeles[a]);
                                                    }
                                                } else {
                                                    data.append('papeles', 'Sin_datos');
                                                }
                                                element.tipohojahv.push(tipohv);
                                                element.campos.push(campo);
                                                element.namearchivo.push(namea);
                                                element.datos.push(dato);
                                                // Nuevo Array completo
                                                var nota = element;
                                                nota = JSON.stringify(nota);
                                                data.append('notas', nota);
                                            }
                                        }
                                    }
                                } else {
                                    data.append('dinamicos', 'no');
                                }

                                //inserción de recursos inexistentes es decir, nuevos
                                if (document.getElementById('cbox1').checked) {
                                    data.append('nuevos_recursos', 'si');
                                    if (document.getElementById('cbpre1').checked) {
                                        //propietario
                                        tipologia = 'propietario';
                                        var name_propie = $('#name_propietario').val();
                                        var tipohv = 'Propietario';
                                        var docu_propi = $('#number_propietario').val();
                                        data.append('propietario_check', $('#cbpre1').is(':checked'));
                                        data.append('tipo_propi', tipologia);
                                        data.append('nombre_propietario', name_propie);
                                        data.append('docu_propi', docu_propi);
                                    } else {
                                        data.append('propietario_check', $('#cbpre1').is(':checked'));
                                    }

                                    if (document.getElementById('cbpre2').checked) {
                                        //poseedor
                                        tipologia = 'tenedor';
                                        campo = 'Nombre';
                                        name_posee = $('#name_poseedor').val();
                                        data.append('poseedor_check', $('#cbpre2').is(':checked'));
                                        docu_posee = $('#number_poseedor').val();
                                        data.append('tipo_posee', tipologia);
                                        data.append('nombre_poseedor', name_posee);
                                        data.append('docu_posee', docu_posee);
                                    } else {
                                        data.append('poseedor_check', $('#cbpre2').is(':checked'));
                                    }

                                    if (document.getElementById('cbpre3').checked) {
                                        //conductor
                                        tipologia = 'conductor';
                                        campo = 'Nombre';
                                        cedula = $('#number_conductor').val();
                                        nombre = $('#name_conductor').val();
                                        ref1 = $('#referencias_empresariales1pre').val();
                                        per1 = $('#contacto_ref1pre').val();
                                        cel1 = $('#celular_ref1pre').val();
                                        cargo1 = $('#cargo_ref1pre').val();
                                        fec1 = $('#fingresoa1pre').val();
                                        fec11 = $('#fretiroa3pre').val();
                                        anti = $('#anti_ref1pre').val();
                                        //
                                        ref2 = $('#referencias_empresariales2pre').val();
                                        per2 = $('#contacto_ref2pre').val();
                                        cel2 = $('#celular_ref2pre').val();
                                        cargo2 = $('#cargo_ref2pre').val();
                                        fec2 = $('#fingresob1pre').val();
                                        fec22 = $('#fretirob3pre').val();
                                        anti2 = $('#anti_ref2pre').val();
                                        //
                                        ref3 = $('#referencias_empresariales3pre').val();
                                        per3 = $('#contacto_ref3pre').val();
                                        cel3 = $('#celular_ref3pre').val();
                                        cargo3 = $('#cargo_ref3pre').val();
                                        fec3 = $('#fingresoc1pre').val();
                                        fec33 = $('#fretiroc3pre').val();
                                        anti3 = $('#anti_ref3pre').val();

                                        data.append('conductor_check', $('#cbpre3').is(':checked'));
                                        data.append('tipo_condu', tipologia);
                                        data.append('nombre_conductor', nombre);
                                        data.append('docu_condu', cedula);
                                        data.append('refe1', ref1);
                                        data.append('contacto1', per1);
                                        data.append('celular1', cel1);
                                        data.append('cargo1', cargo1);
                                        data.append('fechaa1', $('#fingresoa1pre').val());
                                        data.append('fechaa2', fec11);
                                        data.append('anti1', anti);
                                        data.append('refe2', ref2);
                                        data.append('contacto2', per2);
                                        data.append('celular2', cel2);
                                        data.append('cargo2', cargo2);
                                        data.append('fechab1', fec2);
                                        data.append('fechab2', fec22);
                                        data.append('anti2', anti2);
                                        data.append('refe3', ref3);
                                        data.append('contacto3', per3);
                                        data.append('celular3', cel3);
                                        data.append('cargo3', cargo3);
                                        data.append('fechac1', fec3);
                                        data.append('fechac2', $('#fretiroc3pre').val());
                                        data.append('anti3', anti3);
                                    } else {
                                        data.append('conductor_check', $('#cbpre3').is(':checked'));
                                    }

                                    if (document.getElementById('cbpre4').checked) {
                                        //trailer
                                        tipologia = 'trailer';
                                        campo = 'Nombre';
                                        placa = $('#placa_trailerpre').val();
                                        propi = $('#propi_trailer').val();
                                        docupropit = $('#propidocu_trailer').val();
                                        data.append('trailer_check', $('#cbpre4').is(':checked'));
                                        data.append('tipo_trai', tipologia);
                                        data.append('placa_trailer', placa);
                                        data.append('propi_trailer', propi);
                                        data.append('propidoc_trailer', docupropit);
                                    } else {
                                        data.append('trailer_check', $('#cbpre4').is(':checked'));
                                    }
                                }
                            }

                            await fetch($('#base_url').val() + 'validacionparametros/Insert_estudio', {
                                method: 'POST',
                                body: data,
                                cache: 'no-cache',
                            })
                                .then(response => {
                                    if (!response.ok) throw new Error(response.statusText);
                                    return response.json();
                                })
                                .then(function (data) {
                                    if (data.numero === 200) {
                                        Swal.fire({
                                            title: "¡Éxito!",
                                            text: data.mensaje, // Usa el mensaje recibido en `data`
                                            icon: "success",
                                            confirmButtonText: "Aceptar",
                                            showCloseButton: true
                                        });
                                        let offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('staticBackdrop'));
                                        if (offcanvas) {
                                            offcanvas.hide();
                                            document.getElementById('placa').value = "";
                                            document.getElementById('placa').diabled = false;
                                        }
                                        Filtro();
                                        Limpiarmodal();
                                        Ocultarbloque();
                                    } else {
                                        mensaje = `
                                            <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                                                <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                                                <div class="message">
                                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                                    <strong>Mensaje!</strong> ${data.mensaje}
                                                </div>
                                            </div>`;
                                        $('#crear_preestudio').show();
                                    }
                                    document.getElementById('historicos').innerHTML = mensaje;
                                })
                                .catch(error => {
                                    // alert(error);
                                    $('#crear_preestudio').show();
                                });
                        }

                    } else {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = msg_error;

                        // Extraer los <p> y armar lista
                        const mensajes = Array.from(tempDiv.querySelectorAll('p')).map(p => p.innerHTML);

                        // Crear lista en HTML
                        const listaMensajes = `
                            <ul style="text-align: left; padding-left: 20px; margin: 0;">
                                ${mensajes.map(msg => `<li style="font-size: 13px; color: #333;">${msg}</li>`).join('')}
                            </ul>
                        `;

                        // Mostrar en SweetAlert2
                        Swal.fire({
                            icon: 'error',
                            title: 'Errores encontrados',
                            html: listaMensajes,
                            confirmButtonText: 'Entendido',
                            confirmButtonColor: '#d33'
                        });

                        // Scroll y mostrar tu sección si aplica
                        $('#crea_vehiculopreestudio').animate({ scrollTop: 0 }, 600);
                        $('#crear_preestudio').show();
                    }
                } else {
                    // Código a ejecutar si el usuario hace clic en "Cancelar"
                    $('#crear_preestudio').show();
                }
            } else {
                mensaje = `
                <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                        <strong>Mensaje!</strong> Debes diligenciar la placa para la solicitud de servicio
                    </div>
                </div>`;
                document.getElementById('historicos').innerHTML = mensaje;
                $('#crear_preestudio').show();
            }
        }
    }

    //boton agregar referencias para nuevo
    if (e.target.matches('#agregar_fila') || e.target.matches('#agregar_fila *')) {
        numero++;
        if (numero < 3) {
            agregar();
        } else if (numero === 3) {
            agregar();
            document.querySelector('#agregar_fila').classList.add('d-none');
            // No mostramos el alert aquí
        }
    }


    if (e.target.matches('#btn_cerrar') || e.target.matches('#btn_cerrar')) {
        $('#placa').prop('disabled', false);
    }

    if (e.target.matches('#btn_cerrar_notificaciones')) {
        $('#mod-warning').modal('hide');
        $('#crea_vehiculopreestudio').modal('toggle');
        document.getElementById('number_propietario').value = '';
        document.getElementById('number_poseedor').value = '';
        document.getElementById('number_conductor').value = '';
        document.getElementById('propidocu_trailer').value = '';
    }

    // Verificar si el evento fue en el checkbox o en un hijo del checkbox
    if (e.target.matches('#propietario_obligatorio') || e.target.matches('#propietario_obligatorio *')) {
        // Obtener el checkbox, en caso de que el evento venga de un hijo
        const checkbox = document.getElementById('propietario_obligatorio');
        // Verificar si está marcado
        if (checkbox.checked) {
            // console.log('El checkbox está marcado');
            // document.getElementById('placat').style.readonly = false;
            $('#placat').prop('disabled', false);
            $('#docproptrailer').prop('disabled', false);
            $('#nomproptrailer').prop('disabled', false);
            document.getElementById('mensaje_trailer_obligatorio').innerHTML = `
      <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
        <div class="icon"><span class="mdi mdi-notifications"></span></div>
        <div class="message">
          <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Información!</strong> Los campos del trailer son obligatorios.
        </div>
      </div>
      `;
            document.getElementById('etiqueta_placa_trailer').innerHTML = `Placa Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
            document.getElementById('etiqueta_documento_trailer').innerHTML = `Documento Propietario Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
            document.getElementById('estiqueta_propietario_trailer').innerHTML = `Nombre Propietario Trailer&nbsp;<span style="color:red;"><i>(*)</i></span>`;
        } else {
            $('#placat').prop('disabled', true);
            $('#docproptrailer').prop('disabled', true);
            $('#nomproptrailer').prop('disabled', true);
            document.getElementById('mensaje_trailer_obligatorio').innerHTML = `
      <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
        <div class="icon"><span class="mdi mdi-notifications"></span></div>
        <div class="message">
          <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button><strong>Información!</strong> Los campos del trailer no requeridos.
        </div>
      </div>
      `;
            document.getElementById('etiqueta_placa_trailer').innerHTML = `Placa Trailer`;
            document.getElementById('etiqueta_documento_trailer').innerHTML = `Documento Propietario Trailer`;
            document.getElementById('estiqueta_propietario_trailer').innerHTML = `Nombre Propietario Trailer`;
        }
    }
});

// Selecciona los elementos por su ID y asigna el evento 'blur'
// $('#web, #user_satelite, #clave, #docupro, #docutene, #docucondu').on('blur', validar_formulario);
// Delegación de evento blur desde el document
$(document).on('blur', '#web, #user_satelite, #clave, #docupro, #docutene, #docucondu', validar_formulario);

function validar_formulario(e) {
    if (e.target.value.trim() === '') {
        MostrarMensaje(`El campo es obligatorio`, e.target.parentElement);
        datosnuevos[e.target.id] = '';
        comprobar();
        return;
    }
    limpiaralerta(e.target.parentElement);
    //Asignar valores
    // datosnuevos[e.target.name] = e.target.value.trim().toLowerCase();
    datosnuevos[e.target.id] = e.target.value.trim().toLowerCase();
    comprobar();
}

function MostrarMensaje(mensaje, referencia) {
    limpiaralerta(referencia);
    const ERROR = document.createElement('P');
    ERROR.textContent = mensaje;
    ERROR.classList.add('bg-danger', "text-white", 'text-center', 'w-100');
    ERROR.style.fontSize = '12px';
    referencia.appendChild(ERROR);
}

function limpiaralerta(referencia) {
    const ALERTA = referencia.querySelector('.bg-danger');
    if (ALERTA) {
        ALERTA.remove();
    }
}

function comprobar() {
    console.log(Object.values(datosnuevos).includes(''));
    if (Object.values(datosnuevos).includes('')) {
        return true;
    } else {
        return false;
    }
}

//funcion para poner el nombre de los archivos Actualiza seguridad (hojas de vida)
function name_fontal(value, id) {
    var input = document.getElementById('arc' + id);
    var archivo = input.files[0];

    if (archivo) {
        var nombreArchivo = archivo.name;
        var extension = nombreArchivo.split(".").pop().toLowerCase();

        var extensionesPermitidas = ["pdf", "jpg", "png", "webp"]; // Extensiones válidas

        if (!extensionesPermitidas.includes(extension)) {
            Swal.fire({
                icon: "error",
                title: "Extensión no permitida",
                text: `Por favor, selecciona un archivo con una de las siguientes extensiones: ${extensionesPermitidas.join(", ")}`,
                confirmButtonColor: "#d33",
                confirmButtonText: "Aceptar"
            });

            input.value = ""; // Limpiar el input file si el archivo no es válido
        } else {
            // Mostrar nombre del archivo en el campo de texto deshabilitado
            document.getElementById('nam' + id).value = nombreArchivo;
        }
    }
}

// Agregar Filas
// var cont = 0;
// var m = 0;
// var contador_global1 = 0;
function agregar() {
    // cont++;
    // m++;
    // contador_global1++;

    window.cont++;
    window.m++;
    window.contador_global1++;

    var referencias = `
    <div id="referencia_${cont}" class="border rounded p-3 mb-3 bg-light">
        <div class="row mb-2">
            <div class="col-md-4">
                <label class="form-label">Empresa <span class="text-danger">*</span></label>
                <input type="text" id="empresa_crear${cont}" name="empresa_crear[]" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
                <label class="form-label">Fecha Ingreso</label>
                <input type="date" id="fingreso_crear${cont}" name="fingreso_crear[]" class="form-control form-control-sm" value="">
            </div>
            <div class="col-md-4">
                <label class="form-label">Fecha Retiro</label>
                <input type="date" id="fretiro_crear${cont}" name="fretiro_crear[]" class="form-control form-control-sm" value="">
            </div>
        </div>

        <div class="row mb-2">
            <div class="col-md-4">
                <label class="form-label">Contacto</label>
                <input type="text" id="contacto_crear${cont}" name="contacto_crear[]" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
                <label class="form-label">Teléfono <span class="text-danger">*</span></label>
                <input type="number" id="numero_crear${cont}" name="numero_crear[]" class="form-control form-control-sm">
            </div>
            <div class="col-md-4">
                <label class="form-label">Cargo</label>
                <input type="text" id="cargo_crear${cont}" name="cargo_crear[]" class="form-control form-control-sm">
            </div>
        </div>

        <div class="row mb-2">
            <div class="col-md-4">
                <label class="form-label">Antigüedad</label>
                <input type="number" id="antiguedad_crear${cont}" name="antiguedad_crear[]" class="form-control form-control-sm" min="0">
            </div>
        </div>
    </div>
    `;

    $('#contenedor_referencias').append(referencias);
}

function consulta_solicitudes_anidadas(id_agrupacion, numservi) {
    let formdata = new FormData();
    formdata.append('id_agrupacion', id_agrupacion);
    formdata.append('num_servicio', numservi);

    fetch($('#base_url').val() + 'validacionparametros/Consulta_solicitudes_anidadas', {
        method: 'POST',
        cache: 'no-cache',
        body: formdata,
    })
        .then(response => response.json())
        .then(function (data) {
            console.log(data);
            if (data.result !== null) {
                document.getElementById('btn_soli').disabled = true;

                let cont = 1;
                // $('#cuerpo_lista2').html(''); // Limpiar antes de pintar

                data.forEach(function (element) {
                    cont++;

                    // Formatear flete como moneda si aplica
                    let flete = element.flete || 0;
                    if (flete > 0) {
                        flete = parseFloat(flete).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
                    }

                    // Tarjeta por cada servicio
                    const tarjeta = `
                        <div class="border rounded p-3 mb-3 bg-light prin${cont}">
                            <div class="row mb-2">
                                <div class="col-md-1">
                                    <label class="form-label">#</label>
                                    <div class="form-control form-control-sm text-center bg-secondary text-white">${cont}</div>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label">Servicio</label>
                                    <input type="hidden" id="servicio${cont}" value="${element.solicitud_servicio}" class="form-control form-control-sm fserva" name="fserva[]">
                                    <div class="form-control form-control-sm bg-light">${element.solicitud_servicio}</div>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Cotización</label>
                                    <div class="form-control form-control-sm bg-light">
                                        ${element.n_cotizacion} (${element.item}) ${element.tipo_mercancia}
                                    </div>
                                </div>
                                <div class="col-md-5">
                                    <label class="form-label">Cliente</label>
                                    <div class="form-control form-control-sm bg-light">${element.nombre_cliente}</div>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Flete</label>
                                    <input type="password" id="fl${element.numer_solservicio}" 
                                        class="form-control form-control-sm tflete" 
                                        value="${flete}" readonly onchange="javascript:currencyMask(this)">
                                </div>
                                <div class="col-md-4" style="display:none;">
                                    <label class="form-label">Peso Neto</label>
                                    <input type="text" class="form-control form-control-sm tneto2" 
                                        value="${element.peso_neto_tn}" readonly>
                                </div>
                                <div class="col-md-4">
                                    <label class="form-label">Tarifa</label>
                                    <input type="hidden" id="tari${cont}" class="form-control form-control-sm ttarifa" 
                                        value="${element.total_tarifa}" readonly>
                                    <div class="form-control form-control-sm bg-light">${element.tipo_servicio_mer}</div>
                                </div>
                            </div>
                        </div>
                    `;

                    $('#cuerpo_lista2').append(tarjeta);

                    // if ($('.tflete').val() > 0) {
                    //     $('.tflete').val(parseFloat($('.tflete').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').toString());
                    // }

                    // Actualizar contadores
                    $('#maxservi').val(cont);
                    $('#maxservi2').val(cont);
                });

                // Sumar totales
                sumatoria();
            } else {
                console.log("hola");

            }
        })
        .catch(error => {
            alert(error);
        });
}

function fechas_cargue(id_agrupacion, numservi) {
    let formdatafechas = new FormData();
    formdatafechas.append('id_agrupacion', id_agrupacion);
    formdatafechas.append('solicitud_servicio_id', numservi);
    fetch($('#base_url').val() + 'validacionparametros/Consultar_fecha_cargue', {
        method: 'POST',
        cache: 'no-cache',
        body: formdatafechas,
    })
        .then(response => response.json())
        .then(function (data) {
            if (data) {
                $('#cuerpo_fechas').html('');
                //$("#cuerpo_fechas").html('');
                data.forEach(function (element, index) {
                    var datec = element.fecha_estimada_entrega + 'T' + element.hora_estimada; // Agregar "T"
                    var actuali = moment().format('YYYY-MM-DD HH:mm:ss'); // Asegurar formato correcto
                    // Convertir ambas fechas a Moment con el formato adecuado
                    var cant = moment(datec, "YYYY-MM-DDTHH:mm:ss").diff(moment(actuali, "YYYY-MM-DD HH:mm:ss"), 'hours');
                    //                 $('#cuerpo_fechas').append(`
                    //       <tr id="fil1" class="${element.cod_ini_ruta}">
                    //           <td>
                    //               <input type="hidden" id="oculto1" value="${cant}" class="fo" readonly="readonly">
                    //               <input type="text" id="serv1" class="form-control form-control-sm fserv" 
                    //                   value="${element.cod_ini_ruta}" readonly="readonly">
                    //           </td>
                    //           <td>
                    //               <input type="text" id="fecha1" class="form-control form-control-sm cp" 
                    //                   value="${element.fecha_estimada_entrega} ${element.hora_estimada}" readonly="readonly">
                    //           </td>
                    //           <td>
                    //               <input type="text" id="peso1" class="form-control form-control-sm fp" 
                    //                   value="${element.peso}" readonly="readonly">
                    //           </td>
                    //           <td>
                    //               <input type="text" class="form-control form-control-sm" 
                    //                   value="${element.lugar} (${element.direccion_entrega})" 
                    //                   readonly="readonly" title="${element.direccion_entrega}">
                    //               <input type="text" class="form-control form-control-sm" 
                    //                   value="${element.muni}" readonly="readonly">
                    //           </td>
                    //       </tr>
                    //   `);
                    $('#cuerpo_fechas').append(`
                        <div id="fil1" class="border rounded p-3 mb-3 bg-light ${element.cod_ini_ruta}">
                            <div class="row mb-2">
                                <div class="col-md-3">
                                    <label class="form-label">Código Ruta</label>
                                    <input type="hidden" id="oculto1" value="${cant}" class="form-control form-control-sm fo" disabled>
                                    <input type="text" id="serv1" class="form-control form-control-sm fserv" value="${element.cod_ini_ruta}" disabled>
                                </div>

                                <div class="col-md-3">
                                    <label class="form-label">Fecha y Hora Estimada</label>
                                    <input type="text" id="fecha1" class="form-control form-control-sm cp" 
                                        value="${element.fecha_estimada_entrega} ${element.hora_estimada}" disabled>
                                </div>

                                <div class="col-md-3">
                                    <label class="form-label">Peso</label>
                                    <input type="text" id="peso1" class="form-control form-control-sm fp" value="${element.peso}" disabled>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <label class="form-label">Lugar de Entrega</label>
                                    <input type="text" class="form-control form-control-sm" 
                                        value="${element.lugar} (${element.direccion_entrega})" disabled 
                                        title="${element.direccion_entrega}">
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Municipio</label>
                                    <input type="text" class="form-control form-control-sm" value="${element.muni}" disabled>
                                </div>
                            </div>
                        </div>
                        `);
                    sumatoria();
                });
            }
        })
        .catch(error => {
            alert(error);
        });
}

function Listar_Solicitudes_Consolidadas() {
    $.post($('#base_url').val() + 'validacionparametros/getSolicitudesConsolidadas', function (data) {
        $('#tbl-solicitudes-consolidadas').html('');
        data.forEach(function (solicitud) {
            $('#tbl-solicitudes-consolidadas').append(`
    <tr>
      <td>${solicitud.nundoc_solicitud}</td>
      <td>${solicitud.tipo_mercancia}</td>
      <td>${solicitud.item}</td>
      <td>${solicitud.ori}</td>
      <td>${solicitud.des}</td>
      <td>${solicitud.peso_neto_tn} / ${solicitud.tipo_vehiculo ?? ''}</td>
      <td>${solicitud.nombre_cliente ?? ''}</td>
      <td>${solicitud.tipo_servicio_mer}</td>
      <td>
        <button 
            class="btn btn-sm btn-success" 
            onclick="atraparsolici(${solicitud.nundoc_solicitud}, this)" 
            data-id="${solicitud.nundoc_solicitud}"
            data-id2="${solicitud.nombre_cliente ?? ''}"
            data-id3="${solicitud.n_cotizacion ?? ''}"
            data-id4="${solicitud.item ?? ''}"
            data-id5="${solicitud.tipo_mercancia ?? ''}"
            data-id6="${solicitud.flete ?? ''}"
            data-id7="${solicitud.peso_neto_tn ?? ''}"
            data-id8="${solicitud.total_tarifa ?? ''}">
            <span class="far fa-plus-square"></span>
        </button>
      </td>
    </tr>
`);

        });
    }, 'json');
}

/******************************    VALIDACION DE BOTON  buscar EN SOLICITUDES DE SERVICIO    **********************************************/
$('#placa').keyup(function () {
    let texto = document.getElementById('placa').value;
    document.getElementById('placa').value = texto.toUpperCase();
});

/* FUNCIONPARA SUBIR AL SERVIDOR PRINCIPAL EL DIA DE HOY */
async function ValidacionReglaNegocio() {
    /* Nueva funcion para valdiar los tipos de documentos para definir la operacion a realziazr */
    $('#placheolders').css('display', 'flex');
    document.getElementById('historico').style.display = '';

    let $placa = $('#placa');         // objeto jQuery del input
    let placa = $placa.val().trim();  // valor del input
    let proceso_itr = $('#proceso_itr').val().trim();

    if (placa === '') {
        Swal.fire({
            icon: 'error',
            title: 'Errores encontrados',
            html: `Debe diligenciar una placa para iniciar el proceso de estudios de seguridad.`,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d33'
        }).then(() => {
            // Foco después de cerrar el alert
            $placa.focus().css("background-color", "rgb(254,242,181)");
        });

        $('#placheolders').css('display', 'none');
        return;
    }

    let datos = new FormData();
    datos.append('placa', placa);
    try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/busqueda_datos_vencimiento', {
            method: 'POST',
            body: datos,
            cache: 'no-cache',
        });
        const data = await response.json();
        if (data) { // Recursos con datos vencidos
            // Obtener la fecha actual
            let today = moment();
            // Validar si las fechas están vencidas
            function isExpired(date) {
                return moment(date).isBefore(today, 'day');
            }

            // Función para calcular los días vencidos
            function daysExpired(date) {
                let expirationDate = moment(date);
                if (expirationDate.isBefore(today, 'day')) {
                    return today.diff(expirationDate, 'days');
                }
                return 0; // No está vencida
            }

            // Colcoar configuracion en el boton de crear estudio
            document.getElementById('crear_preestudio').setAttribute('data-Configuracion', data.Configuracion);

            // Calcular los días vencidos para cada fecha
            let diasVencidosLicencia = daysExpired(data.rndc_vencimiento_licencia);
            let diasVencidosTecno = daysExpired(data.tecno_fecha_vigencia);
            let diasVencidosSoat = daysExpired(data.vence_soat);
            let diasVencidosPreoperacional = daysExpired(data.fecha_vencimiento_preoperacional);

            // Construir el mensaje basado en las fechas vencidas
            let mensajes = [];
            let mensaje = '';
            if (diasVencidosLicencia > 0) {
                mensajes.push(`El conductor <strong>${data.Conductor}</strong> con numero de documento <strong>${data.numero_documento}</strong> se cuentra con la licencia vencida hace <strong> ${diasVencidosLicencia} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del conductor`);
            }

            if (diasVencidosTecno > 0) {
                mensajes.push(`Este vehículo con placa <strong>${placa}</strong> cuenta con la tecnomecanica vencida hace <strong> ${diasVencidosTecno} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`);
            }

            if (diasVencidosSoat > 0) {
                mensajes.push(`Este vehículo con placa <strong>${placa}</strong> cuenta con el SOAT vencido hace <strong> ${diasVencidosSoat} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`);
            }

            if (diasVencidosPreoperacional > 0) {
                mensajes.push(`Este vehículo con placa <strong>${placa}</strong> cuenta con el Preoperacional vencido hace <strong> ${diasVencidosSoat} </strong> dias, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`);
            } else if (data.fecha_vencimiento_preoperacional === null || data.fecha_vencimiento_preoperacional === '') {
                mensajes.push(`Este vehículo con placa <strong>${placa}</strong> no cuenta con el <strong>Preoperacional</strong> diligenciado, por favor solicitar la actualización de este dato en la hoja de vida del vehiculo`);
            }

            // Construir el mensaje final para mostrar los documento vencidos
            let mensajeFinal;
            if (mensajes.length === 4) {
                mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-center p-1" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                        <ul class="mb-0 mt-2">
                            ${mensajes.map(msg => `<li class='text-dark' style='font-size=9px;'>${msg}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                $('#historico_vencido').html(mensaje);
                /* Solo colocar la opcion de actualizar */
                Vencimientoprefiltro();
                Limpiarmodal();
                Ocultarbloque();
                $('#historico').html('');
                $.post(
                    $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
                    'placa=' + placa + '&proceso_itr=' + proceso_itr,
                    function (data) {
                        var mensaje = '';
                        let estado_Vehiculo = data.estado_vehiculo;
                        $('#nexos_messages_b1').html('');
                        $('#nexos_messages_b2').html('');
                        //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
                        if (data['evaluacion'] === 'estudio') {
                            if (data['estado_vigencia'] === 'bloqueado') {
                                mensaje = `
                                    <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                        <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo o algun proveedor esta Bloqueado, Solicitar informacion al area de seguridad.</p>

                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
                                // mensaje = `
                                // <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                //     <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                //     <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo con placas <strong>${placa}</strong> esta Bloqueado.</p>

                                //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                // </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                                $('#mensaje_vehiculo_bloquear').html(mensaje);
                            } else if (data['estado_vigencia'] === 'seguimiento') {
                                mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                                radioitrblock();
                            } else if (data['estado_vigencia'] === 'desbloqueado') {
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    // radioactu();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] && data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            } else {
                                //Validaciones estudio
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark" style='font-size:11px;'><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            }
                            // $('#historico').html(mensaje);
                            // setTimeout(() => {
                            //     document.getElementById('historico').style.display = 'none';
                            // }, 10000);
                        }
                    },
                    'json',
                );
            } else if (mensajes.length === 3) {
                mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-center p-1" role="alert">
                    <span class="fas fa-info-circle text-warning me-3"></span>
                    <div class="message">
                        <ul class="mb-0 mt-2">
                            ${mensajes.map(msg => `<li class='text-dark' style='font-size=9px;'>${msg}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                $('#historico_vencido').html(mensaje);
                /* Solo colocar la opcion de actualizar */
                Vencimientoprefiltro();
                Limpiarmodal();
                Ocultarbloque();
                $('#historico').html('');
                $.post(
                    $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
                    'placa=' + placa + '&proceso_itr=' + proceso_itr,
                    function (data) {
                        var mensaje = '';
                        let estado_Vehiculo = data.estado_vehiculo;
                        $('#nexos_messages_b1').html('');
                        $('#nexos_messages_b2').html('');
                        //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
                        if (data['evaluacion'] === 'estudio') {
                            if (data['estado_vigencia'] === 'bloqueado') {
                                // mensaje = `
                                // <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                //     <span class="fas fa-info-circle text-warning me-2"></span>
                                //     <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo con placas <strong>${placa}</strong> esta Bloqueado.</p>

                                //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                // </div>`;

                                mensaje = `
                                    <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                        <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo o algun proveedor esta Bloqueado, Solicitar informacion al area de seguridad.</p>

                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                            } else if (data['estado_vigencia'] === 'seguimiento') {
                                mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>

                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                                radioitrblock();
                            } else if (data['estado_vigencia'] === 'desbloqueado') {
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    // radioactu();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] && data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark" style='font-size:11px;'><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            } else {
                                //Validaciones estudio
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark" style='font-size:11px;'><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            }
                            // $('#historico').html(mensaje);
                            // setTimeout(() => {
                            //     document.getElementById('historico').style.display = 'none';
                            // }, 10000);
                        }
                    },
                    'json',
                );
            } else if (mensajes.length === 2) {
                mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-center p-1" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                        <ul class="mb-0 mt-2">
                            ${mensajes.map(msg => `<li class='text-dark' style='font-size=9px;'>${msg}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                $('#historico_vencido').html(mensaje);
                /* Solo colocar la opcion de actualizar */
                Vencimientoprefiltro();
                Limpiarmodal();
                Ocultarbloque();
                $('#historico').html('');
                $.post(
                    $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
                    'placa=' + placa + '&proceso_itr=' + proceso_itr,
                    function (data) {
                        var mensaje = '';
                        let estado_Vehiculo = data.estado_vehiculo;
                        $('#nexos_messages_b1').html('');
                        $('#nexos_messages_b2').html('');
                        //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
                        if (data['evaluacion'] === 'estudio') {
                            if (data['estado_vigencia'] === 'bloqueado') {
                                // mensaje = `
                                // <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                //     <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                //     <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo con placas <strong>${placa}</strong> esta Bloqueado.</p>

                                //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                // </div>`;

                                mensaje = `
                                    <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                        <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo o algun proveedor esta Bloqueado, Solicitar informacion al area de seguridad.</p>

                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                            } else if (data['estado_vigencia'] === 'seguimiento') {
                                mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>

                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                                radioitrblock();
                            } else if (data['estado_vigencia'] === 'desbloqueado') {
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    // radioactu();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] && data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark" style='font-size:11px;'><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            } else {
                                //Validaciones estudio
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark" style='font-size:11px;'><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            }
                            // $('#historico').html(mensaje);
                            // setTimeout(() => {
                            //     document.getElementById('historico').style.display = 'none';
                            // }, 10000);
                        }
                    },
                    'json',
                );
            } else if (mensajes.length === 1) {
                mensaje = `
                <div class="alert alert-outline-warning d-flex align-items-center p-1" role="alert">
                    <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                    <div class="message">
                        <ul class="mb-0 mt-2">
                            ${mensajes.map(msg => `<li class='text-dark' style='font-size=9px;'>${msg}</li>`).join('')}
                        </ul>
                    </div>
                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;
                $('#historico_vencido').html(mensaje);

                /* Solo colocar la opcion de actualizar */
                Vencimientoprefiltro();
                Limpiarmodal();
                Ocultarbloque();
                $('#historico').html('');
                $.post($('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
                    'placa=' + placa + '&proceso_itr=' + proceso_itr,
                    function (data) {
                        var mensaje = '';
                        let estado_Vehiculo = data.estado_vehiculo;
                        $('#nexos_messages_b1').html('');
                        $('#nexos_messages_b2').html('');
                        //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
                        if (data['evaluacion'] === 'estudio') {
                            if (data['estado_vigencia'] === 'bloqueado') {
                                // mensaje = `
                                // <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                //     <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                //     <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo con placas <strong>${placa}</strong> esta Bloqueado.</p>

                                //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                // </div>`;

                                mensaje = `
                                    <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                        <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo o algun proveedor esta Bloqueado, Solicitar informacion al area de seguridad.</p>

                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                            } else if (data['estado_vigencia'] === 'seguimiento') {
                                mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>

                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                                radioitrblock();
                            } else if (data['estado_vigencia'] === 'desbloqueado') {
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    // radioactu();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] && data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark" style='font-size:11px;'><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            } else {
                                //Validaciones estudio
                                if (data['mensaje'] == 'autorizado') {
                                    radionuevo_bloc();
                                    radioactu_vencido();
                                } else {
                                    if (data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark" style='font-size:11px;'><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            }
                            // $('#historico').html(mensaje);
                            // setTimeout(() => {
                            //     document.getElementById('historico').style.display = 'none';
                            // }, 10000);
                        }
                    },
                    'json',
                );
            } else {
                Vencimientoprefiltro();
                Limpiarmodal();
                Ocultarbloque();
                $('#historico').html('');
                $.post(
                    $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
                    'placa=' + placa + '&proceso_itr=' + proceso_itr,
                    function (data) {
                        var mensaje = '';
                        let estado_Vehiculo = data.estado_vehiculo;
                        $('#nexos_messages_b1').html('');
                        $('#nexos_messages_b2').html('');
                        //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
                        if (data['evaluacion'] === 'estudio') {
                            if (data['estado_vigencia'] === 'bloqueado') {
                                // mensaje = `
                                // <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                //     <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                //     <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo con placas <strong>${placa}</strong> esta Bloqueado.</p>

                                //     <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                // </div>`;
                                mensaje = `
                                    <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                        <p class="mb-0 flex-1"><strong>Mensaje!</strong> El vehículo o algun proveedor esta Bloqueado, Solicitar informacion al area de seguridad.</p>

                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                            } else if (data['estado_vigencia'] === 'seguimiento') {
                                mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>

                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                                $('#historicos').html(mensaje);
                                radionuevo_bloc();
                                radiohv_bloc();
                                radioitrblock();
                            } else if (data['estado_vigencia'] === 'desbloqueado') {
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    radioactu();
                                } else {
                                    if (data['itr'] && data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>

                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                    }
                                }
                            } else {
                                //Validaciones estudio
                                if (data['mensaje'] === 'autorizado') {
                                    radionuevo_bloc();
                                    radioactu();
                                } else {
                                    if (data['itr'] !== '') {
                                        $('#crear_preestudio').hide();
                                        radioitr();
                                        /* Mostar tabla de verificacion de datos */
                                        document.getElementById('datos_proveedores').style.display = '';
                                        // Propietario
                                        document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                        document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                        document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                        document.getElementById('accion_propietario').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Poseedor
                                        document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                        document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                        document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                        document.getElementById('accion_poseedor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Conductor
                                        document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                        document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                        document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                        document.getElementById('accion_conductor').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                        // Propietario trailer
                                        if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                            document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                            document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                            document.getElementById('cpropt').innerHTML = 'No Aplica';
                                            document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                        } else {
                                            document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                            document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                            document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                            document.getElementById('accion_propietario_trailer').innerHTML = `
                                                <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                    <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                    <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                                </div>
                                            `;
                                        }
                                    } else {
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark"><strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                        $('#historico').html(mensaje);
                                        radionuevo_bloc();
                                        radiohv_bloc();
                                        $('#crear_preestudio').show();
                                    }
                                }
                            }
                            // $('#historico').html(mensaje);
                            // setTimeout(() => {
                            //     document.getElementById('historico').style.display = 'none';
                            // }, 10000);
                        }
                        //Prefiltros de veiculos nuevos
                        if (data['evaluacion'] === 'prefiltro') {
                            var fhoy = moment();
                            var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
                            if (data['respuesta']['estado'] === null || data['respuesta']['estado'] === 'rechazado' || data['respuesta']['estado'] === 'vencida' || data['respuesta']['estado'] === 'cancelado') {
                                mensaje = `
                                    <div class="alert alert-outline-warning d-flex align-items-center" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-3"></span>
                                        <div class="message">
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
                                        </div>
                                    </div>`;
                                let op = 'NEW';
                                accordion1desbloqueado(op);
                                radiohv_bloc();
                                radionuevo();
                                referencias_nuevo_des();
                                // referencias_ah_des2(data.id_conductor);
                                datossolicitudes_des();
                                documento_nuevo_des();
                                flete_desbloquear();
                                boton_guardar_des();
                            } else {
                                if (data['respuesta']['estado'] === 'pendiente_iniciar' || data['respuesta']['estado'] === 'iniciado' || data['respuesta']['estado'] === 'pendiente' || data['respuesta']['estado'] === 'rechazado para modificar' || data['respuesta']['estado'] === 'aprobado') {
                                    //calcular fecha prefiltro con la fecha actual
                                    var fhoy = moment();
                                    var horahoy = moment().format('HH:mm:ss');
                                    var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
                                    if (data['respuesta']['estado'] !== 'aprobado' && tf === 0) {
                                        //son de hoy
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ${data['respuesta']['id_preestudio']}, estado: ${data['respuesta']['estado']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                    } else if (data['respuesta']['estado'] === 'aprobado' && tf === 0) {
                                        //estado aprobado de hoy mostar msg
                                        mensaje += `
                                            <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                                <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                                <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ${data['respuesta']['id_preestudio']} , estado: ${data['respuesta']['estado']}.</p>
                                                <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                            </div>`;
                                    } else if (data['respuesta']['estado'] === 'aprobado' && tf > 0) {
                                        //estado aprobado y no he de hoy registrar
                                        let op = 'NEW';
                                        accordion1desbloqueado(op);
                                        radiohv_bloc();
                                        radionuevo();
                                        referencias_nuevo_des();
                                        // referencias_ah_des2(data.id_conductor);
                                        datossolicitudes_des();
                                        documento_nuevo_des();
                                        flete_desbloquear();
                                        boton_guardar_des();
                                    }
                                } else if (data['respuesta']['estado'] === 'cancelado' && tf === 0) {
                                    // mensaje
                                    mensaje += `
                                        <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                            <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                            <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ${data['respuesta']['id_preestudio']} , estado: ${data['respuesta']['estado']} no esta autorizado para cargar con Nexos Cargo.</p>
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>`;
                                    $('#historico').html(mensaje);
                                }
                            }
                            // $('#historico').html(mensaje);
                            // setTimeout(() => {
                            //     document.getElementById('historico').style.display = 'none';
                            // }, 10000);
                        }
                    },
                    'json',
                );
            }
        } else {
            Vencimientoprefiltro();
            Limpiarmodal();
            Ocultarbloque();
            $('#historico').html('');
            $.post(
                $('#base_url').val() + 'validacionparametros/busqueda_vehiculo',
                'placa=' + placa + '&proceso_itr=' + proceso_itr,
                function (data) {
                    var mensaje = '';
                    // let estado_Vehiculo = data.estado_vehiculo;
                    $('#nexos_messages_b1').html('');
                    $('#nexos_messages_b2').html('');
                    //Validacion del tipo de operacion para saber si se puede escoger una o mas solicitudes de servicio
                    if (data['evaluacion'] === 'estudio') {
                        if (data['estado_vigencia'] === 'bloqueado') {
                            mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> esta Bloqueado.</p>
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                            $('#historico').html(mensaje);
                            radionuevo_bloc();
                            radiohv_bloc();
                        } else if (data['estado_vigencia'] === 'seguimiento') {
                            mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                            $('#historico').html(mensaje);
                            radionuevo_bloc();
                            radiohv_bloc();
                            radioitrblock();
                        } else if (data['estado_vigencia'] === 'desbloqueado') {
                            if (data['mensaje'] === 'autorizado') {
                                radionuevo_bloc();
                                radioactu();
                            } else {
                                if (data['itr'] && data['itr'] !== '') {
                                    $('#crear_preestudio').hide();
                                    radioitr();
                                    /* Mostar tabla de verificacion de datos */
                                    document.getElementById('datos_proveedores').style.display = '';
                                    // Propietario
                                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                    document.getElementById('accion_propietario').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                    `;
                                    // Poseedor
                                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                    document.getElementById('accion_poseedor').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                    `;
                                    // Conductor
                                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                    document.getElementById('accion_conductor').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                    `;
                                    // Propietario trailer
                                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                        document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                        document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                        document.getElementById('cpropt').innerHTML = 'No Aplica';
                                        document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                    } else {
                                        document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                        document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                        document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                        document.getElementById('accion_propietario_trailer').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                    }
                                } else {
                                    mensaje += `
                                        <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                            <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                            <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>`;
                                    $('#historico').html(mensaje);
                                    radionuevo_bloc();
                                    radiohv_bloc();
                                    $('#crear_preestudio').show();
                                }
                            }
                        } else {
                            //Validaciones estudio
                            if (data['mensaje'] === 'autorizado') {
                                radionuevo_bloc();
                                radioactu();
                            } else {
                                if (data['itr'] !== '') {
                                    $('#crear_preestudio').hide();
                                    radioitr();
                                    /* Mostar tabla de verificacion de datos */
                                    document.getElementById('datos_proveedores').style.display = '';
                                    // Propietario
                                    document.getElementById('vpropi').innerHTML = data.itr['Propietario'];
                                    document.getElementById('vpdocumento').innerHTML = data.itr['cedula_propietario'];
                                    document.getElementById('cpropi').innerHTML = data.itr['Celular_propietario'];
                                    document.getElementById('accion_propietario').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                    `;
                                    // Poseedor
                                    document.getElementById('vtene').innerHTML = data.itr['Poseedor'];
                                    document.getElementById('vtdocumento').innerHTML = data.itr['cedula_poseedor'];
                                    document.getElementById('ctene').innerHTML = data.itr['Celular_poseedor'];
                                    document.getElementById('accion_poseedor').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_poseedor"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_poseedor"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                    `;
                                    // Conductor
                                    document.getElementById('vcondu').innerHTML = data.itr['Conductor'];
                                    document.getElementById('vcdocumento').innerHTML = data.itr['cedula_conductor'];
                                    document.getElementById('ccondu').innerHTML = data.itr['celular'] + ' - ' + data.itr['celular2'];
                                    document.getElementById('accion_conductor').innerHTML = `
                                        <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                            <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_conductor"><i class="fa-solid fa-user-check"></i></button>
                                            <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_conductor"><i class="fa-solid fa-user-xmark"></i></button>
                                        </div>
                                    `;
                                    // Propietario trailer
                                    if (data.itr['cedula_propietario_trailer'] === null && data.itr['celuar_propietario_trailer'] === null) {
                                        document.getElementById('ptcondu').innerHTML = 'No Aplica';
                                        document.getElementById('ptcdocumento').innerHTML = 'No Aplica';
                                        document.getElementById('cpropt').innerHTML = 'No Aplica';
                                        document.getElementById('accion_propietario_trailer').innerHTML = 'No Aplica';
                                    } else {
                                        document.getElementById('ptcondu').innerHTML = data.itr['Propietario_trailer'];
                                        document.getElementById('ptcdocumento').innerHTML = data.itr['cedula_propietario_trailer'];
                                        document.getElementById('cpropt').innerHTML = data.itr['celuar_propietario_trailer'];
                                        document.getElementById('accion_propietario_trailer').innerHTML = `
                                            <div class="btn-group btn-group-xs" role="group" aria-label="Extra-small button group" style="width: 100%;">
                                                <button type="button" class="btn btn-success" data-toggle="tooltip" data-placement="bottom" title="Si" id="si_propietario_trailer"><i class="fa-solid fa-user-check"></i></button>
                                                <button type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="bottom" title="No" id="no_propietario_trailer"><i class="fa-solid fa-user-xmark"></i></button>
                                            </div>
                                        `;
                                    }
                                } else {
                                    mensaje += `
                                        <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                            <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                            <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> ${data['mensaje']}.</p>
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>`;
                                    $('#historico').html(mensaje);
                                    radionuevo_bloc();
                                    radiohv_bloc();
                                    $('#crear_preestudio').show();
                                }
                            }
                        }
                    }

                    if (data['evaluacion'] === 'prefiltro') {
                        var fhoy = moment();
                        var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
                        if (data['respuesta']['estado'] === null || data['respuesta']['estado'] === 'rechazado' || data['respuesta']['estado'] === 'vencida' || data['respuesta']['estado'] === 'cancelado') {
                            mensaje += `
                                <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                    <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                    <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.</p>
                                    <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>`;
                            $('#historico').html(mensaje);
                            let op = 'NEW';
                            accordion1desbloqueado(op);
                            radiohv_bloc();
                            radionuevo();
                            referencias_nuevo_des();
                            // referencias_ah_des2(data.id_conductor);
                            datossolicitudes_des();
                            documento_nuevo_des();
                            flete_desbloquear();
                            boton_guardar_des();
                        } else {
                            if (
                                data['respuesta']['estado'] === 'pendiente_iniciar' ||
                                data['respuesta']['estado'] === 'iniciado' ||
                                data['respuesta']['estado'] === 'pendiente' ||
                                data['respuesta']['estado'] === 'rechazado para modificar' ||
                                data['respuesta']['estado'] === 'aprobado'
                            ) {
                                //calcular fecha prefiltro con la fecha actual
                                var fhoy = moment();
                                var horahoy = moment().format('HH:mm:ss');
                                var tf = fhoy.diff(data['respuesta']['fecha'], 'days');
                                if (data['respuesta']['estado'] !== 'aprobado' && tf === 0) {
                                    //son de hoy
                                    mensaje += `
                                        <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                            <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                            <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ${data['respuesta']['id_preestudio']} , estado: ${data['respuesta']['estado']}.</p>
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>`;
                                    $('#historico').html(mensaje);
                                } else if (data['respuesta']['estado'] === 'aprobado' && tf === 0) {
                                    //estado aprobado de hoy mostar msg
                                    mensaje += `
                                        <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                            <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                            <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ${data['respuesta']['id_preestudio']} , estado: ${data['respuesta']['estado']}.</p>
                                            <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>`;
                                    $('#historico').html(mensaje);
                                } else if (data['respuesta']['estado'] === 'aprobado' && tf > 0) {
                                    //estado aprobado y no he de hoy registrar
                                    let op = 'NEW';
                                    accordion1desbloqueado(op);
                                    radiohv_bloc();
                                    radionuevo();
                                    referencias_nuevo_des();
                                    // referencias_ah_des2(data.id_conductor);
                                    datossolicitudes_des();
                                    documento_nuevo_des();
                                    flete_desbloquear();
                                    boton_guardar_des();
                                }
                            } else if (data['respuesta']['estado'] === 'cancelado' && tf === 0) {
                                mensaje += `
                                    <div class="alert alert-outline-warning d-flex align-items-center mt-1 p-1" role="alert">
                                        <span class="fas fa-info-circle text-warning fs-5 me-2"></span>
                                        <p class="mb-0 flex-1 text-dark"> <strong>Mensaje!</strong> Este vehículo con placa <strong>${placa}</strong> tiene prefiltro ${data['respuesta']['id_preestudio']} , estado: ${data['respuesta']['estado']}.</p>
                                        <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>`;
                                $('#historico').html(mensaje);
                            }
                        }
                    }
                },
                'json',
            );
        }
    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
    } finally {
        // $('#loading-overlay-nexosapp').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
        $('#placheolders').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
}

function Vencimientoprefiltro() {
    $.post(
        $('#base_url').val() + 'validacionparametros/vencimientoprefiltro',
        function (data) {
            if (data == 1) {
                console.log(data);
            } else {
                console.log(data);
            }
        },
        'json',
    );
}

function Limpiarmodal() {
    document.getElementById('habil').checked = false;
    document.getElementById('update').checked = false;
    document.getElementById('nuevo').checked = false;
    limpiacampos_datosvehiculos1();
    limpiacampos_referencia();
    limpiacampos_solicitud();
    limpia_archivoprefiltro();
    limpia_referencias_hv();
    limpia_actualza();
    limpia_subasta();
}

function Ocultarbloque() {
    document.getElementById('divdatos').style.display = 'none';
    document.getElementById('panel_referenciaNEW').style.display = 'none';
    document.getElementById('panel_solicitudes').style.display = 'none';
    document.getElementById('panel_papeles').style.display = 'none';
    document.getElementById('panel_referenciahv').style.display = 'none';
    document.getElementById('panel_refepersonal').style.display = 'none';
    document.getElementById('panel_seguridad').style.display = 'none';
    document.getElementById('panel_fletepk').style.display = 'none';
    radiohv_bloc();
    radionuevo_bloc();
}

/***********************************  Función para mostar/ocultar bloque datos   **************************************************/
//Colocar Formato moneda
function formatNum(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

//Consulta vehículos segun estado
function accordion1desbloqueado(op) {
    $('#divdatos').show();
    var opcion = op;
    //$("#habil").hide();
    //$("#update").hide();
    $('#hvpreestudio').show();
    var pk = $('#placa').val();
    $('#placag').val(pk);
    $('#su_placa').val(pk);

    if (opcion == 'R') {
        //alert('traer datos');
        var t = {
            placa: pk,
            action: 'consultavprees',
        };
        $.ajax({
            url: url2,
            type: 'POST',
            data: t,
            dataType: 'json',
            success: function (data) {
                if (data.result != null) {
                    $('#placat').val(data.result[0].placa_trailer);
                    $('#web').val(data.result[0].web_satelital);
                    $('#user_satelite').val(data.result[0].usuario_satelital);
                    $('#clave').val(data.result[0].clave_satelital);
                    $('#nompro').val(data.result[0].nombre_propietario);
                    $('#docupro').val(data.result[0].documento_propietario);
                    $('#nomtene').val(data.result[0].nombre_tenedor);
                    $('#docutene').val(data.result[0].documento_tenedor);
                    $('#nomcondu').val(data.result[0].nombre_conductor);
                    $('#docucondu').val(data.result[0].documento_conductor);
                    $('#deta_condu').val(data.result[0].id_detacondu);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    }

    if (opcion == 'CA') {
        //alert('traer datos');
        var t = {
            placa: pk,
            action: 'consultavprees',
        };

        $.ajax({
            url: url2,
            type: 'POST',
            data: t,
            dataType: 'json',
            success: function (data) {
                if (data.result != null) {
                    $('#placat').val(data.result[0].placa_trailer);
                    $('#web').val(data.result[0].web_satelital);
                    $('#user_satelite').val(data.result[0].usuario_satelital);
                    $('#clave').val(data.result[0].clave_satelital);
                    $('#nompro').val(data.result[0].nombre_propietario);
                    $('#docupro').val(data.result[0].documento_propietario);
                    $('#nomtene').val(data.result[0].nombre_tenedor);
                    $('#docutene').val(data.result[0].documento_tenedor);
                    $('#nomcondu').val(data.result[0].nombre_conductor);
                    $('#docucondu').val(data.result[0].documento_conductor);
                    $('#deta_condu').val(data.result[0].id_detacondu);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    }

    if (opcion == 'AR') {
        //alert('traer datos');
        var t = {
            placa: pk,
            action: 'consultavprees',
        };

        $.ajax({
            url: url2,
            type: 'POST',
            data: t,
            dataType: 'json',
            success: function (data) {
                if (data.result != null) {
                    $('#placat').val(data.result[0].placa_trailer);
                    $('#web').val(data.result[0].web_satelital);
                    $('#user_satelite').val(data.result[0].usuario_satelital);
                    $('#clave').val(data.result[0].clave_satelital);
                    $('#nompro').val(data.result[0].nombre_propietario);
                    $('#docupro').val(data.result[0].documento_propietario);
                    $('#nomtene').val(data.result[0].nombre_tenedor);
                    $('#docutene').val(data.result[0].documento_tenedor);
                    $('#nomcondu').val(data.result[0].nombre_conductor);
                    $('#docucondu').val(data.result[0].documento_conductor);
                    $('#deta_condu').val(data.result[0].id_detacondu);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            },
        });
    }

    if (opcion == 'PE') {
        //alert('traer datos');
        var t = {
            placa: pk,
            action: 'consultavprees',
        };

        $.ajax({
            url: url2,
            type: 'POST',
            data: t,
            dataType: 'json',
            success: function (data) {
                if (data.result != null) {
                    $('#placat').val(data.result[0].placa_trailer);
                    $('#web').val(data.result[0].web_satelital);
                    $('#user_satelite').val(data.result[0].usuario_satelital);
                    $('#clave').val(data.result[0].clave_satelital);
                    $('#nompro').val(data.result[0].nombre_propietario);
                    $('#docupro').val(data.result[0].documento_propietario);
                    $('#nomtene').val(data.result[0].nombre_tenedor);
                    $('#docutene').val(data.result[0].documento_tenedor);
                    $('#nomcondu').val(data.result[0].nombre_conductor);
                    $('#docucondu').val(data.result[0].documento_conductor);
                    $('#deta_condu').val(data.result[0].id_detacondu);
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

function radionuevo() {
    $('.thv').show();
    $('#divnuevo').show();
    $('#placa').prop('disabled', true);
}

function radionuevo_bloc() {
    $('#tiporadio').val('');
    $('#divnuevo').hide();
    $('#capa_carga_vh').attr('disabled', false);
}

/* Actializar */
function radioactu() {
    $('#tiporadio').val('');
    $('.thv').show();
    $('#divhabil').show();
    $('#divactualiza').show();
    $('#placa').prop('disabled', true);
}

/* Actualizar solo cuando algo este vencido */
function radioactu_vencido() {
    $('#tiporadio').val('');
    $('.thv').show();
    // $('#divhabil').show();
    $('#divactualiza').show();
    $('#placa').prop('disabled', true);
}

/* Actializar Itr*/
function actualizar_itr() {
    $('#tiporadio').val('');
    $('.thv').show();
    $('#divactualiza').show();
    $('#placa').prop('disabled', true);
    document.getElementById('datos_proveedores').style.display = 'none';
    $('#crear_preestudio').show();
}

/* Itr */
function radioitr() {
    $('#tiporadio').val('');
    $('.thv').show();
    $('#placa').prop('disabled', true);
    op = '';
    accordion1desbloqueado(op);
    referencias_ah_des();
    datossolicitudes_des();
    //documentos_ah_des();
    campos_ah_bloc();
    consultar_hojadevida();
    readonly_campos();
    limpia_actualza();
    flete_desbloquear();
    $('#inexistente_propietario').hide();
    $('#inexistente_poseedor').hide();
    $('#inexistente_conductor').hide();
    $('#inexistente_vehiculo').hide();
    $('#inexistente_trailer').hide();
}

/* Itr block */
function radioitrblock() {
    $('.thv').show();
    $('#tiporadio').val('');
    $('#divhabil').hide();
    $('#divactualiza').hide();
}

function radiohv_bloc() {
    $('.thv').show();
    $('#tiporadio').val('');
    $('#divhabil').hide();
    $('#divactualiza').hide();
}

function referencias_nuevo_des() {
    $('#panel_referenciaNEW').show();
}

function datossolicitudes_des() {
    $('#divdatos').show();
    $('#panel_solicitudes').show();
}

function documento_nuevo_des() {
    $('#panel_papeles').show();
}

function boton_guardar_des() {
    $('#divdatos').show();
    $('#crear_preestudio').show();
}

function referencias_ah_des() {
    $('#panel_referenciahv').show();
    $('#panel_refepersonal').show();
}

function documentos_ah_des() {
    $('#panel_papeles_habilitar').show();
}

function campos_ah_bloc() {
    $('#panel_seguridad').hide();
}

function flete_desbloquear() {
    $('#panel_fletepk').css('display', 'block');
}

function campos_ah_des() {
    $('#panel_seguridad').show();
}

/*********************************************Función para limpiar campos v nuevos*********************************/
function limpiacampos_datosvehiculos1() {
    $('#web').val('');
    $('#user_satelite').val('');
    $('#clave').val('');
    $('#nompro').val('');
    $('#docupro').val('');
    $('#nomtene').val('');
    $('#docutene').val('');
    $('#nomcondu').val('');
    $('#docucondu').val('');
    $('#obserpree').val('');
}

function limpiacampos_datosvehiculo() {
    $('#placa').val('');
    $('#placag').val('');
    $('#placat').val('');
    $('#web').val('');
    $('#user_satelite').val('');
    $('#clave').val('');
    $('#nompro').val('');
    $('#docupro').val('');
    $('#nomtene').val('');
    $('#docutene').val('');
    $('#nomcondu').val('');
    $('#docucondu').val('');
}

function limpiacampos_referencia() {
    $('#empresa_crear1').val('');
    $('#fingreso_crear1').val('');
    $('#fretiro_crear1').val('');
    $('#contacto_crear1').val('');
    $('#numero_crear1').val('');
    $('#cargo_crear1').val('');
    $('#antiguedad_crear1').val('');

    $('#empresa_crear2').val('');
    $('#fingreso_crear2').val('');
    $('#fretiro_crear2').val('');
    $('#contacto_crear2').val('');
    $('#numero_crear2').val('');
    $('#cargo_crear2').val('');
    $('#antiguedad_crear2').val('');

    $('#empresa_crear3').val('');
    $('#fingreso_crear3').val('');
    $('#fretiro_crear3').val('');
    $('#contacto_crear3').val('');
    $('#numero_crear3').val('');
    $('#cargo_crear3').val('');
    $('#antiguedad_crear3').val('');
}

function limpiacampos_solicitud() {
    $('#capa_carga_vh').val('');
}

function limpia_archivoprefiltro() {
    $('#tabla_papeles').html('');
}

function limpia_referencias_hv() {
    $('#referencias_empresariales1').val();
    $('#fingreso1').val('');
    $('#fretiro1').val('');
    $('#contacto_ref1').val('');
    $('#celular_ref1').val('');
    $('#cargo_ref1').val('');
    $('#anti_ref1').val('');

    $('#referencias_empresariales2').val();
    $('#fingreso2').val('');
    $('#fretiro2').val('');
    $('#contacto_ref2').val('');
    $('#celular_ref2').val('');
    $('#cargo_ref2').val('');
    $('#anti_ref2').val('');

    $('#referencias_empresariales3').val();
    $('#fingreso3').val('');
    $('#fretiro13').val('');
    $('#contacto_ref3').val('');
    $('#celular_ref3').val('');
    $('#cargo_ref3').val('');
    $('#anti_ref3').val('');

    $('#referencias_personales1').val();
    $('#fecha_personal1').val();
    $('#parenp1').blur();
    $('#telefonop1').val('');

    $('#referencias_personales2').val('');
    $('#fecha_personal2').val('');
    $('#parenp2').blur();
    $('#telefonop2').val('');
}

function limpia_actualza() {
    //update
    $('#cuerpo_actu').html('');
    $('#dato').val('');
    $('#detalle').val('');
    $('#label').val('');
}

function limpia_subasta() {
    $('#su_propuesto').val('');
}

function readonly_campos() {
    $('#placag').prop('disabled', true);
    $('#placat').prop('disabled', true);
    $('#web').prop('disabled', true);
    $('#user_satelite').prop('disabled', true);
    $('#clave').prop('disabled', true);
    $('#nompro').prop('disabled', true);
    $('#docupro').prop('disabled', true);
    $('#nomtene').prop('disabled', true);
    $('#docutene').prop('disabled', true);
    $('#nomcondu').prop('disabled', true);
    $('#docucondu').prop('disabled', true);
    $('#capa_carga_vh').prop('disabled', false);
    $('#obserpree').attr('disabled', false);
    $('#capa_carga_vh').attr('disabled', true);
    var i;
    for (i = 1; i <= 3; i++) {
        $('#idrl' + i).prop('disabled', false);
        $('#referencias_empresariales' + i).prop('disabled', true);
        $('#fingreso' + i).prop('disabled', true);
        $('#fretiro' + i).prop('disabled', true);
        $('#contacto_ref' + i).prop('disabled', true);
        $('#celular_ref' + i).prop('disabled', true);
        $('#cargo_ref' + i).prop('disabled', true);
        $('#anti_ref' + i).prop('disabled', true);
        //deshabilitar los input file para actualizar documentos
        $('#docuupdate' + i).prop('disabled', true);
    }
}

function consultar_hojadevida() {
    let placa = $('#placag').val();
    $.post(
        $('#base_url').val() + 'validacionparametros/Consulta_Preestudio',
        'placa=' + placa,
        function (data) {
            if (data) {
                $('#placag').val(data[0].placa);
                $('#placat').val(data[0].placa_trailer);
                $('#web').val(data[0].web_satelital);
                $('#user_satelite').val(data[0].usuario_satelital);
                $('#clave').val(data[0].clave_satelital);
                $('#nompro').val(data[0].nombre_propietario + ' ' + data[0].proape1 + ' ' + data[0].proape2);
                $('#docupro').val(data[0].documento_propietario);
                $('#nomtene').val(data[0].nombre_tenedor + ' ' + data[0].teape1 + ' ' + data[0].teape2);
                $('#docutene').val(data[0].documento_tenedor);
                $('#nomcondu').val(data[0].nombre_conductor + ' ' + data[0].coape1 + ' ' + data[0].coape2);
                $('#docucondu').val(data[0].documento_conductor);
                $('#capa_carga_vh').val(data[0].capacidad_tn);
                $('#docproptrailer').val(data[0].documento_propietario_trailer);
                $('#nomproptrailer').val(data[0].nombre_propietario_trailer + ' ' + data[0].protape1 + ' ' + data[0].protape2);

                //Campos actualizar acordeon
                $('#veh_vehiculo').val(data[0].placa + ' - ' + data[0].placa_trailer);
                $('#veh_conduc').val(data[0].nombre_conductor + ' ' + data[0].coape1 + ' ' + data[0].coape2 + '-' + data[0].documento_conductor);
                $('#veh_propiet').val(data[0].nombre_propietario + ' ' + data[0].proape1 + ' ' + data[0].proape2 + '-' + data[0].documento_propietario);
                $('#veh_poseed').val(data[0].nombre_tenedor + ' ' + data[0].teape1 + ' ' + data[0].teape2 + '-' + data[0].documento_tenedor);
            }
        },
        'json',
    );

    $.post(
        $('#base_url').val() + 'validacionparametros/Consulta_Referencia',
        'placa=' + placa,
        function (data) {
            if (data) {
                let cun = 0;
                for (var i = 0; i < data.length; i++) {
                    cun++;
                    $('#idconductor').val(data[i].id_conductor);
                    $('#idrl' + cun).val(data[i].id);
                    $('#referencias_empresariales' + cun).val(data[i].nombre_empresa);
                    $('#fingreso' + cun).val(data[i].fecha_ingreso);
                    $('#fretiro' + cun).val(data[i].fecha_retiro);
                    $('#contacto_ref' + cun).val(data[i].persona_contacto);
                    $('#celular_ref' + cun).val(data[i].celular);
                    $('#cargo_ref' + cun).val(data[i].cargo);
                    $('#anti_ref' + cun).val(data[i].antiguedad);
                }
            }
        },
        'json',
    );

    $.post(
        $('#base_url').val() + 'validacionparametros/Consulta_Rpersonal',
        'placa=' + placa,
        function (data) {
            if (data) {
                let con = 0;
                for (var i = 0; i < data.length; i++) {
                    con++;
                    $('#referencias_personales' + con).val(data[i].nombre_personal);
                    $('#fecha_personal' + con).val(data[i].fecha);
                    $('#parenp' + con).val(data[i].parentezco);
                    $('#telefonop' + con).val(data[i].tel_personal);
                }
            }
        },
        'json',
    );
}

function referencias_prefiltro() {
    if (document.getElementById('nuevo').checked) {
        if ($('#nuevo').is(':checked')) {
            contador_global1 = 0;
            var documento_conductor = $('#docucondu').val();
            $.post(
                $('#base_url').val() + 'validacionparametros/busqueda_referencias',
                'documento_conductor=' + documento_conductor,
                function (data) {
                    var mensaje = '';
                    if (data != null && data != '') {
                        $('#contenedor_referencias').html('');
                        $('#agregar_fila').hide();
                        var hoy = moment().format('YYYY-MM-DD');
                        for (i = 0; i <= 2; i++) {
                            contador_global1 = contador_global1 + 1;
                            let cont = i + 1;
                            var referencias = `
                                <div id="referencia_${cont}" class="border rounded p-3 mb-3 bg-light">
                                    <div class="row mb-2">
                                        <div class="col-md-4">
                                            <label class="form-label">Empresa <span class="text-danger">*</span></label>
                                            <input type="text" id="empresa_crear${cont}" name="empresa_crear[]" class="form-control form-control-sm" value="${data[i]['nombre_empresa']}">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Fecha Ingreso</label>
                                            <input type="date" id="fingreso_crear${cont}" name="fingreso_crear[]" class="form-control form-control-sm" value="${hoy}">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Fecha Retiro</label>
                                            <input type="date" id="fretiro_crear${cont}" name="fretiro_crear[]" class="form-control form-control-sm" value="${hoy}">
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <div class="col-md-4">
                                            <label class="form-label">Contacto</label>
                                            <input type="text" id="contacto_crear${cont}" name="contacto_crear[]" class="form-control form-control-sm" value="${data[i]['persona_contacto']}">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Teléfono <span class="text-danger">*</span></label>
                                            <input type="number" id="numero_crear${cont}" name="numero_crear[]" class="form-control form-control-sm" value="${data[i]['celular']}">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label">Cargo</label>
                                            <input type="text" id="cargo_crear${cont}" name="cargo_crear[]" class="form-control form-control-sm" value="${data[i]['cargo']}">
                                        </div>
                                    </div>

                                    <div class="row mb-2">
                                        <div class="col-md-4">
                                            <label class="form-label">Antigüedad</label>
                                            <input type="number" id="antiguedad_crear${cont}" name="antiguedad_crear[]" class="form-control form-control-sm" min="0" value="${data[i]['antiguedad']}">
                                            <input type="hidden" id="" value="${cont}" class="form-control" readonly="readonly">
                                        </div>
                                    </div>
                                </div>
                                `;
                            $('#contenedor_referencias').append(referencias);
                        }
                    } else {
                        $('#contenedor_referencias').html('');
                        $('#agregar_fila').show();
                        contador_global1 = 0;
                        numero = 0;
                    }
                },
                'json',
            );
        }
    }
}

/*************************** Función para ubicar bloque de datos segun radio seleccionado *********************/
// $('#habil').change(function () {
$(document).on('change', '#habil', function () {
    if ($(this).is(':checked')) {
        let op = '';
        accordion1desbloqueado(op);
        referencias_ah_des();
        datossolicitudes_des();
        //documentos_ah_des();
        campos_ah_bloc();
        consultar_hojadevida();
        readonly_campos();
        limpia_actualza();
        flete_desbloquear();
        $('#inexistente_propietario').hide();
        $('#inexistente_poseedor').hide();
        $('#inexistente_conductor').hide();
        $('#inexistente_vehiculo').hide();
        $('#inexistente_trailer').hide();
    }
});


async function listar_responsables() {
    try {
        const response = await fetch($('#base_url').val() + 'validacionparametros/listar_responsables_vehiculo', {
            method: 'POST',
            // body: datos,
            cache: 'no-cache',
        });
        const data = await response.json();
        // console.log('🚀 ~ listar_responsables ~ data:', data);
        var html = '<option value="">Seleccionar cliente</option>';
        data.forEach(function (item) {
            html += `<option value="${item.usuario_responsable_id}">${item.user_log} - ${item.nom_usuario}</option>`;
        });
        $('#responsable_vehiculo').html(html);
    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        throw error;
    } finally {
        // $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
    }
}

function sumatoria() { //Fletes y pesos netos
    var suma = 0; //acumulador
    var suman = 0;
    var sumapes = 0;
    var sumntarifa = 0;
    $(".tflete").each(function () {
        var valor = ($(this).val()).replace(/,/g, "");
        suma += parseFloat(valor);
    });
    var canserv = $("#cuerpo_lista2").find('tr').length;
    var div = parseFloat(suma) / parseFloat(canserv);
    // $("#totalfle").val(suma);
    $(".tneto2").each(function () {
        var peso = ($(this).val()).replace(/,/g, "");
        suman += parseFloat(peso);
    });
    //sumar pesos netos , vienen del remitente
    $(".fp").each(function () {
        var valpeso = ($(this).val()).replace(/,/g, "");
        sumapes += parseFloat(valpeso);
    });
    //sumas tarifas
    $(".ttarifa").each(function () {
        var valtarifa = ($(this).val()).replace(/,/g, "");
        sumntarifa += parseFloat(valtarifa);
    });
    //var totari=parseFloat(sumntarifa)/parseFloat(canserv);
    $('#totalfle').val(suma);
    $("#tottarifa").val(sumntarifa);
    $("#totalneto").val(suman);
    $("#su_fletecot").val(suma);
    $("#su_neto").val(suman);
    $("#total_pesos").val(sumapes);
    $("#su_sumatorianeto").val(sumapes);
    $("#su_tarifacot").val(sumntarifa);
    //formatear numeros
    $('#totalfle').val(parseFloat($('#totalfle').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    $('#totalneto').val(parseFloat($('#totalneto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $('#su_fletecot').val(parseFloat($('#su_fletecot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $('#su_neto').val(parseFloat($('#su_neto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    $('#total_pesos').val(parseFloat($('#total_pesos').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $('#su_sumatorianeto').val(parseFloat($('#su_sumatorianeto').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g,
        "$1,").toString());
    $("#tottarifa").val(parseFloat($('#tottarifa').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
    $("#su_tarifacot").val(parseFloat($('#su_tarifacot').val(), 100).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,")
        .toString());
}

function AplicaFoco(idelemento) {
    $(idelemento).focus().css("background-color", "rgb(254,242,181)");
}

function RemueveFoco(idelemento) {
    $(idelemento).blur().css("background-color", "white");
}

function Visualizar(cotizacion, solicitud_servicio, ventana) {
    document.getElementById("numero_cotizacion").value = cotizacion;
    document.getElementById("numero_solicitud").value = solicitud_servicio;
    //CABECERA
    var dato = {
        ncotizar: cotizacion,
        // action: 'ver',
    };

    $.ajax({
        url: $('#base_url').val() + 'serviciocliente/Ver_cotizacion',
        type: 'POST',
        data: dato,
        dataType: 'json',
        success: function (data) {
            if (data) {
                // $('#titlu').html('<h3 class="text-center"><strong>Cotizacion Número: ' + data.n_cotizacion + '</strong></h3>');
                $('#linea').val('');

                $(`#cuerpo_cliente`).html("");
                $(`#cuerpo_cliente`).html(`
          <div class="row">
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="mb-1">
                  <label style="font-size: 12px;">Cliente</label>
                  <input type="text" id="nombre_cliente" class="form-control form-control-sm text-center text-dark fs-10" value="${data.nombre_cliente}" disabled>
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Numero documento</label>
                  <input type="text" id="documento_cliente" class="form-control form-control-sm text-center text-dark fs-10" value="${data.nit}-${data.digito}" disabled>
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Dirección</label>
                  <input type="text" id="direccion_cliente" class="form-control form-control-sm text-center text-dark fs-10" value="${data.direccion}" disabled>
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Telefono</label>
                  <input type="text" id="telefono_cliente" class="form-control form-control-sm text-center text-dark fs-10" value="${data.telefono}" disabled>
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Procedencia</label>
                  <input type="text" id="procedencia_pedido_cliente" class="form-control form-control-sm text-center text-dark fs-10" value="${data.procedencia_cotizacion}" disabled>
                </div>
              </div>
          </div>
        `);

                if (ventana === '8') {
                    $(`#costos`).html(`
            <div class="d-flex justify-content-center mb-2">
              <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Información Restringida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>
            </div>`);
                    $(`#costos1`).html(`
            <div class="d-flex justify-content-center mb-2">
              <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Información Restringida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>
            </div>`);
                    $(`#totcotiza`).html(`
            <div class="d-flex justify-content-center mb-2">
              <span class="badge badge-phoenix fs-10 badge-phoenix-danger"><span class="badge-label">Información Restringida</span><span class="ms-1" data-feather="x" style="height:12.8px;width:12.8px;"></span></span>
            </div>`);

                } else {
                    $(`#costos`).html("");
                    $(`#costos`).html(`
              <div class="row"> 
                <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div class="mb-1">
                    <label style="font-size: 12px;">Tarifa venta</label>
                    <input type="text" id="tottari" class="form-control form-control-sm text-center text-dark fs-10" disabled value="${data.total_transporte}">
                  </div>
                </div>
                <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div class="mb-1">
                    <label style="font-size: 12px;">Tarifa Flete</label>
                   <input type="text" id="totfle" class="form-control form-control-sm text-center text-dark fs-10" readonly value="${data.tmer_flete}">
                  </div>
                </div>
                <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div class="mb-1">
                    <label style="font-size: 12px;">Utilidad</label>
                    <input type="text" id="totutil" class="form-control form-control-sm text-center text-dark fs-10" readonly value="${data.tmer_rent}">
                  </div>
                </div>
                <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                  <div class="mb-1">
                    <label style="font-size: 12px;">Rentabilidad</label>
                    <input type="text" id="totren" class="form-control form-control-sm text-center text-dark fs-10 maqu" readonly value="${data.tmer_utili}">
                  </div>
                </div>
              </div>
          `);

                    $(`#costos1`).html("");
                    $(`#costos1`).html(`
            <div class="row">
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Costo servicio especial</label>
                  <input type="text" id="flees" class="form-control form-control-sm text-center text-dark fs-10" readonly value="${data.tes_flete}">
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Tarifa servicio especial</label>
                 <input type="text" id="tarespe" class="form-control form-control-sm text-center text-dark fs-10" readonly value="${data.tes_tarifa}">
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Utilidad servicio especial</label>
                 <input type="text" id="totuties" class="form-control form-control-sm text-center text-dark fs-10" readonly value="${data.tes_renta}">
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                <div class="mb-1">
                  <label style="font-size: 12px;">Rentabilidad servicio especial</label>
                   <input type="text" id="totrenes" class="form-control form-control-sm text-center text-dark fs-10 bg-white text-dark" readonly value="${data.tes_util}">
                </div>
              </div>
            </div>
          `);

                    $(`#costos2`).html("");
                    $(`#totcotiza`).html(`
            <div class="row">
              <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div class="mb-1">
                  <label style="font-size: 12px;">Total del servicio</label>
                  <input type="text" id="totalcoti" class="form-control form-control-sm text-center text-dark fs-10" readonly value="${data.total_cotizacion}">
                </div>
              </div>
            </div>
          `);
                }

                $(`#cuerpo_adicional`).html("");
                $(`#cuerpo_adicional`).html(`
            <div class="row">
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-1">
                  <label style="font-size: 12px;">Observación</label>
                  <input type="text" id="observaciones" class="form-control form-control-sm text-center text-dark fs-10" disabled value="${data.observaciones}">
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-1">
                  <label style="font-size: 12px;">Elaborado</label>
                  <input type="text" id="elaborado_por" class="form-control form-control-sm text-center text-dark fs-10" disabled value="${data.elaborado_por}">
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <div class="mb-1">
                  <label style="font-size: 12px;">Autorizado</label>
                  <input type="text" id="autorizado_por" class="form-control form-control-sm text-center text-dark fs-10" disabled value="${data.autorizado_por}">
                </div>
              </div>
            </div>
        `);
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
        // ncotizar1: cotizacion,
        ncotizar1: solicitud_servicio,
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
            var tipo_campo = '';

            $(`#detalle_mercancias`).html('');
            $(`#bloques_mercancias_menu`).html("");
            data.forEach(function (element, index) {
                c++;
                // Clases para el nav-item (active solo en el primero)
                const isFirst = index === 0;
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

                    if (ventana === '8') {
                        tipo_campo = "password";
                    } else {
                        tipo_campo = "text";
                    }


                    var cabeza = `<li class="nav-item"><a class="nav-link ${isFirst ? 'active' : ''}" id="home-tab-${c}" data-bs-toggle="tab" href="#tab-${c}" role="tab" aria-controls="tab-${c}" aria-selected="${isFirst ? 'true' : 'false'}">Bloque de Mercancia ${c}</a></li>`;
                    $(`#bloques_mercancias_menu`).append(cabeza);

                    fila = `
           <div class="tab-pane fade ${isFirst ? 'show active' : ''}" id="tab-${c}" role="tabpanel" aria-labelledby="home-${c}">
              <div class="row">
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Pareja origen-destino</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.id}" disabled>
                  <label style="font-size:12px;" >Tipo servicio</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.tipo_servicio_mer}" disabled>
                </div>
                <div class="col-xs-6 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Tipo vehículo</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.nombre}" disabled>
                  <label style="font-size:12px;" >Tipo carga</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${carga}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Tipo transporte</label>
                    <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.tipo_transporte}" disabled>
                    <label style="font-size:12px;" >Peso bruto (kg)</label>
                  <input type="text" id="pbruto${c}" class="form-control form-control-sm text-dark fs-10 maq" value="${element.peso_bruto_kg}" disabled>
                </div>
                
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Peso neto (kg)</label>
                  <input type="text" id="pneto${c}" class="form-control form-control-sm text-dark fs-10" value="${element.peso_neto_kg}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Peso Bruto (Tn)</label>
                  <input type="text" id="netotn${c}" class="form-control form-control-sm text-dark fs-10" value="${element.peso_neto_tn}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Alto</label>
                  <input type="text" id="valto${c}" class="form-control form-control-sm text-dark fs-10" value="${element.alto}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Largo</label>
                  <input type="text" id="vlargo${c}" class="form-control form-control-sm text-dark fs-10" value="${element.largo}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Ancho</label>
                  <input type="text" id="vancho${c}" class="form-control form-control-sm text-dark fs-10 maqu" value="${element.ancho}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Volumen total</label>
                  <input type="text" id="vvolum${c}" class="form-control form-control-sm text-dark fs-10" value="${element.volumen_total}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Costo flete</label>
                  <input type="${tipo_campo}" id="vflete${c}" class="form-control form-control-sm text-dark fs-10" value="${element.flete}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Tarifa venta</label>
                  <input type="${tipo_campo}" id="vtarifa${c}" class="form-control form-control-sm text-dark fs-10" value="${element.total_tarifa}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Rentabilidad%</label>
                  <input type="${tipo_campo}" id="vutil${c}" class="form-control form-control-sm text-dark fs-10" value="${element.utilidad}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Utilidad</label>
                  <input type="${tipo_campo}" id="vrent${c}" class="form-control form-control-sm text-dark fs-10" value="${element.rentabilidad}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Tipo Mercancía</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.tipo_mercancia}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Valor Mercancía</label>
                  <input type="${tipo_campo}" id="vmerca${c}" class="form-control form-control-sm text-dark fs-10" value="${element.valor_mercancia}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Tipo empaque</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.empaque}" disabled>
                </div>
                <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                  <label style="font-size:12px;" >Cantidad Empaque</label>
                  <input type="text" id="vcant${c}" class="form-control form-control-sm text-dark fs-10" value="${element.cantidad_empaque}" disabled>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <label style="font-size:12px;" >Origen</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.orig}" disabled>
                </div>
                <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                  <label style="font-size:12px;" >Destino</label>
                  <input type="text" class="form-control form-control-sm text-dark fs-10" value="${element.dest}" disabled>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <label style="font-size:12px;" >Observación</label>
                  <textarea class="form-control form-control-sm text-dark" disabled rows="1">${element.observacion}</textarea>
                </div>
              </div>
          </div>
        `;

                    $(`#detalle_mercancias`).append(fila);
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

    // fila_espe = '';
    $.ajax({
        url: $('#base_url').val() + 'serviciocliente/Ver_Servicios_Especiales',
        type: 'POST',
        data: dato2,
        dataType: 'json',
        success: function (data) {
            var ce = 0;
            htm = '';
            $(`#detalle_servicios_especiales`).html('');
            $(`#bloques_servicios_especiales_menu`).html('');
            if (data.length === 0) {
                htm = "<div class='col-xs-12 col-sm-12 col-md-12 col-lg-12 d-flex justify-content-center fw-bold my-3'>Sin servicios especiales</div>";
            } else {
                data.forEach(function (element, index) {
                    ce++;
                    var cabeza = `<li class="nav-item"><a class="nav-link" id="home-tab-${ce}" data-bs-toggle="tab" href="#tab-${ce}" role="tab" aria-controls="tab-${ce}" aria-selected="true">Servicio Especial ${ce}</a></li>`;
                    $(`#bloques_servicios_especiales_menu`).append(cabeza);
                    htm += `
          <div class="tab-pane fade show" id="home-tab-${ce}" role="tabpanel" aria-labelledby="home-${ce}">
            <div class="panel-body">
              <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <label>Servicio especial/ Mercancía a la que pertenece:</label><br>
                <a href="#" class="badge badge-success" title="Servicio especial">${element.item_especial}</a> /
                <a href="#" class="badge badge-primary" title="Servicio mercancía">${element.item_mercancia}</a>
                <h4>Servicios especiales</h4>
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Tipo servicio</span>
                <input type="text" class="form-control input-xs" value="${element.tipo_servicio}" readonly style="background-color:white;">
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Cantidad</span>
                <input type="text" class="form-control input-xs" value="${element.cantidad}" readonly style="background-color:white;">
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Costo unitario</span>
                <input type="text" id="valores${ce}" class="form-control input-xs" value="${element.valor_unitario}" readonly style="background-color:white;">
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Tarifa unitaria</span>
                <input type="text" id="taries${ce}" class="form-control input-xs maqu" value="${element.tarifa_unitaria}" readonly style="background-color:white;">
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Cálculo costo</span>
                <input type="text" id="totes${ce}" value="${element.total_servicio}" class="form-control input-xs" readonly style="background-color:white;">
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Cálculo tarifa</span>
                <input type="text" id="tarifaes${ce}" class="form-control input-xs" value="${element.tarifa}" readonly style="background-color:white;">
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Utilidad</span>
                <input type="text" id="uties${ce}" value="${element.rentabilidad}" class="form-control input-xs" readonly style="background-color:white;">
              </div>
              <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                <span style="font-weight:500; margin-top:20px;">Rentabilidad%</span>
                <input type="text" id="rentes${ce}" class="form-control input-xs" value="${element.utilidad}" readonly style="background-color:white;">
              </div>
            </div>
          </div>`;
                });
            }
            $(`#detalle_servicios_especiales`).append(htm);

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


    /* Remitentes */
    var soli = {
        soli_servi: solicitud_servicio,
        // action: 'solicitud_servicio'
    };

    $.ajax({
        url: $('#base_url').val() + 'serviciocliente/solicitar_remitentes',
        type: 'POST',
        data: soli,
        dataType: 'json',
        success: function (data) {
            // document.getElementById("referencia_operacion").value = data[0].observacion; //verificar segun los escenearios
            // numero_contenedor
            if (data[0].numero_contenedor === null) {
                document.getElementById("numero_contenedor").value = "";
                document.getElementById("numero_contenedor").disabled = false;
                document.getElementById("btn_save_contenedor").disabled = false;
                document.getElementById("agrupable").checked = false;
                document.getElementById("agrupable").disabled = false;
            } else {
                if (data[0].agrupable === null || data[0].agrupable === 'NO') {
                    document.getElementById("numero_contenedor").value = data[0].numero_contenedor;
                    document.getElementById("numero_contenedor").disabled = true;
                    document.getElementById("btn_save_contenedor").disabled = true;
                    document.getElementById("agrupable").checked = false;
                    document.getElementById("agrupable").disabled = false;
                } else {
                    document.getElementById("numero_contenedor").value = data[0].numero_contenedor;
                    document.getElementById("numero_contenedor").disabled = true;
                    document.getElementById("btn_save_contenedor").disabled = true;
                    document.getElementById("agrupable").checked = true;
                    document.getElementById("agrupable").disabled = true;
                }
            }

            /* Validar y marcar la solictud si es prioritaria si esta aprobada */
            if (data[0].Solicitud_Prioritaria === "Aprobada") {
                document.getElementById(`flexSwitchCheckChecked`).checked = true;
                document.getElementById(`flexSwitchCheckChecked`).disabled = true;
            } else {
                if (ventana === '8') {
                    document.getElementById(`flexSwitchCheckChecked`).disabled = true;
                } else {
                    document.getElementById(`flexSwitchCheckChecked`).checked = false;
                    document.getElementById(`flexSwitchCheckChecked`).disabled = true;
                }
            }

            // Limpia los contenedores antes de agregar nuevos elementos
            $(`#bloques_punto_remitente`).empty();
            $(`#detalle_puntos_remitentes`).empty();
            var c = 0;
            // let navItem = '';
            let tabPane = '';
            data.forEach(function (element, index) {
                c++;
                // Clases para el nav-item (active solo en el primero)
                const isFirst = index === 0;
                // Crea el elemento del menú (nav item)
                var navItem = ` 
                    <li class="nav-item">
                        <a class="nav-link ${isFirst ? 'active' : ''}" id="home-tabs-${c}" data-bs-toggle="tab" href="#tabRemitente-${c}" role="tab" aria-controls="tabRemitente-${c}" aria-selected="${isFirst ? 'true' : 'false'}">
                        Remitente ${element.punto_rem}
                        </a>
                    </li>
                    `;

                let BontonesAccion = '';
                if (ventana === '8') {
                    BontonesAccion += '';
                } else {
                    BontonesAccion += `
            <div class="row mb-2">
              <div class="col-12 d-flex justify-content-end align-items-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">
                  <button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0" type="button" id="btn_edit_cargue${element.punto_entrega_id}" style="font-size:12px;" data-puntoId="${element.punto_entrega_id}">
                    <span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Editar
                  </button>
                  <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_cargue${element.punto_entrega_id}" style="font-size:12px;display:none;" data-Remitente="${element.remitente}" data-Punto="${element.punto_rem}" data-puntoId="${element.punto_entrega_id}" data-NumDocSol="${element.nundoc_solicitud}">
                    <span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar
                  </button>
                  <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0" type="button" id="btn_canelar_cargue${element.punto_entrega_id}" style="font-size:12px;display:none;" data-Remitente="${element.remitente}" data-Punto="${element.punto_rem}" data-puntoId="${element.punto_entrega_id}" data-NumDocSol="${element.nundoc_solicitud}">
                    <span class="uil uil-cancel" data-fa-transform="shrink-3"></span> Cacelar
                  </button>
                </div>
              </div>
            </div>
          `;
                }

                tabPane = `
        <div class="tab-pane fade ${isFirst ? 'show active' : ''}" id="tabRemitente-${c}" role="tabpanel" aria-labelledby="tabRemitente-${c}">
          <!-- Fila con el botón en la esquina superior derecha -->
                ${BontonesAccion}
          
          <!-- Fila con los campos -->
          <div class="row g-2">
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="text" id="mer_idservicio${element.punto_entrega_id}" disabled value="${element.nundoc_solicitud}">
            </div>
            <div class="col-4 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="text" id="remitente_edit${element.punto_entrega_id}" disabled value="${element.remitente}">
            </div>
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="date" id="fecha_cargue_edit${element.punto_entrega_id}" disabled value="${element.fecha_cargue}">
            </div>
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="time" id="hora_cargue_edit${element.punto_entrega_id}" disabled value="${element.hora_cargue}">
            </div>
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="text" id="agencia${element.punto_entrega_id}" disabled value="${element.nombre}">
            </div>
          </div>
        </div>
        `;
                $(`#bloques_punto_remitente`).append(navItem);
                $(`#detalle_puntos_remitentes`).append(tabPane);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    //Destinatarios
    $.ajax({
        url: $('#base_url').val() + 'serviciocliente/solicitar_destinatarios',
        type: 'POST',
        data: soli,
        dataType: 'json',
        success: function (data) {
            // document.getElementById("referencia_operacion").value = data[0].observacion; //verificar segun los escenearios
            // numero_contenedor
            if (data[0].numero_contenedor === null) {
                document.getElementById("numero_contenedor").value = "";
                document.getElementById("numero_contenedor").disabled = false;
                document.getElementById("btn_save_contenedor").disabled = false;
                document.getElementById("agrupable").checked = false;
                document.getElementById("agrupable").disabled = false;
            } else {
                if (data[0].agrupable === null || data[0].agrupable === 'NO') {
                    document.getElementById("numero_contenedor").value = data[0].numero_contenedor;
                    document.getElementById("numero_contenedor").disabled = true;
                    document.getElementById("btn_save_contenedor").disabled = true;
                    document.getElementById("agrupable").checked = false;
                    document.getElementById("agrupable").disabled = false;
                } else {
                    document.getElementById("numero_contenedor").value = data[0].numero_contenedor;
                    document.getElementById("numero_contenedor").disabled = true;
                    document.getElementById("btn_save_contenedor").disabled = true;
                    document.getElementById("agrupable").checked = true;
                    document.getElementById("agrupable").disabled = true;
                }
            }

            // Limpia los contenedores antes de agregar nuevos elementos
            $(`#bloques_punto_destinatario`).empty();
            $(`#detalle_puntos_destinatarios`).empty();
            /* Refrencias */
            $(`#bloques_referencias_menu`).empty();
            $(`#detalle_referencias`).empty();
            var c = 0;
            let tabPane = '';
            let tabPaneRef = '';

            data.forEach(function (element, index) {
                c++;
                // Clases para el nav-item (active solo en el primero)
                const isFirst = index === 0;

                let BontonesAccionDestinatario = '';
                let BontonesReferenciaDestinatario = '';
                if (ventana === '8') {
                    BontonesAccionDestinatario += '';
                    BontonesReferenciaDestinatario += '';
                } else {
                    BontonesAccionDestinatario += `
            <div class="row mb-2">
              <div class="col-12 d-flex justify-content-end align-items-center">
                <div class="btn-group btn-group-sm" role="group" aria-label="Extra-small button group">
                  <button class="btn btn-subtle-warning btn-sm me-1 px-1 py-0" type="button" id="btn_edit_descargue${element.punto_destinatario_id}" style="font-size:12px;" data-puntoId="${element.punto_destinatario_id}">
                    <span class="uil uil-file-edit-alt" data-fa-transform="shrink-3"></span> Editar
                  </button>
                  <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_descargue${element.punto_destinatario_id}" style="font-size:12px;display:none;" data-Destinatario="${element.remitente}"  data-Punto="${element.punto_des}" data-puntoId="${element.punto_destinatario_id}" data-NumDocSol="${element.nundoc_solicitud}">
                    <span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar
                  </button>
                  <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-0" type="button" id="btn_canelar_descargue${element.punto_destinatario_id}" style="font-size:12px;display:none;" data-Destinatario="${element.remitente}"  data-Punto="${element.punto_des}" data-puntoId="${element.punto_destinatario_id}" data-NumDocSol="${element.nundoc_solicitud}">
                    <span class="uil uil-cancel" data-fa-transform="shrink-3"></span> Cacelar
                  </button>
                </div>
              </div>
            </div>
          `;
                    BontonesReferenciaDestinatario += `
                <div class="mb-1 pt-5 d-flex justify-content-end">
                  <button class="btn btn-subtle-success btn-sm me-1 px-1 py-0" type="button" id="btn_save_referencia${element.punto_destinatario_id}" data-puntoId="${element.punto_destinatario_id}" data-NumDocSol="${element.nundoc_solicitud}" ><span class="uil uil-save" data-fa-transform="shrink-3"></span> Guardar</button>
                </div>
          `;
                }

                //Llenar las referencais de los destinatarios
                var navTitleRef = `
          <li class="nav-item">
              <a class="nav-link ${isFirst ? 'show active' : ''}" id="home-tabs-${c}" data-bs-toggle="tab" href="#tabRefDestinatario-${c}" role="tab" aria-controls="tabRefDestinatario-${c}" aria-selected="${isFirst ? 'true' : 'false'}">
                Referencia ${element.punto_des}
              </a>
          </li>
        `;
                $(`#bloques_referencias_menu`).append(navTitleRef);

                /* Detalle de las referencias por cada destinatario */
                tabPaneRef = `
          <div class="tab-pane fade ${isFirst ? 'show active' : ''}" id="tabRefDestinatario-${c}" role="tabpanel" aria-labelledby="tabRefDestinatario-${c}">
            <div class="row">
              <div class="col-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                <div class="mb-1">
                  <label style="font-size: 12px;">Referencia</label>
                  <input type="text" id="referencia_operacion${element.punto_destinatario_id}" name="referencia_operacion" class="form-control form-control-sm text-dark fs-10" value="${element.observacion}" oninput="this.value = this.value.toUpperCase();">
                </div>
              </div>
              <div class="col-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                  ${BontonesReferenciaDestinatario}
              </div>
            </div>
          </div>`;
                $(`#detalle_referencias`).append(tabPaneRef);

                // Crea el elemento del menú (nav item)
                var navItem = ` 
          <li class="nav-item">
            <a class="nav-link ${isFirst ? 'show active' : ''}" id="home-tabs-${c}" data-bs-toggle="tab" href="#tabDestinatario-${c}" role="tab" aria-controls="tabDestinatario-${c}" aria-selected="${isFirst ? 'true' : 'false'}">
              Destinatario ${element.punto_des}
            </a>
          </li>
        `;
                $(`#bloques_punto_destinatario`).append(navItem);

                // Crea el contenedor de la pestaña (tab pane)
                tabPane = `
        <div class="tab-pane fade ${isFirst ? 'show active' : ''}" id="tabDestinatario-${c}" role="tabpanel" aria-labelledby="tabDestinatario-${c}">
          <!-- Fila con el botón en la esquina superior derecha -->
              ${BontonesAccionDestinatario}
          
          <!-- Fila con los campos -->
          <div class="row g-2">
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="text" id="desti_idservicio${element.punto_destinatario_id}" disabled value="${element.nundoc_solicitud}">
            </div>
            <div class="col-4 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="text" id="destinatario_edit${element.punto_destinatario_id}" disabled value="${element.destinatario}">
            </div>
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="date" id="fecha_descargue_edit${element.punto_destinatario_id}" disabled value="${element.fecha_descargue}">
            </div>
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="time" id="hora_descargue_edit${element.punto_destinatario_id}" disabled value="${element.hora_descargue}">
            </div>
            <div class="col-2 text-center">
              <input class="form-control form-control-sm text-dark fs-10" type="text" id="agencia${element.punto_destinatario_id}" disabled value="${element.nombre}">
            </div>
          </div>
        </div>
      `;

                $(`#detalle_puntos_destinatarios`).append(tabPane);
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('error');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

    if (ventana === "8") {
        document.getElementById("Datos_adicionales").style.display = "none";
        document.getElementById("Datos_adicionales_operaciones").style.display = "block";
        document.getElementById("Contenedor").style.display = "none";
        document.getElementById("Contenedor_operaciones").style.display = "block";
    } else {
        document.getElementById("Datos_adicionales").style.display = "";
        document.getElementById("Datos_adicionales_operaciones").style.display = "none";
        document.getElementById("Contenedor").style.display = "";
        document.getElementById("Contenedor_operaciones").style.display = "none";
    }

    /* Consultar las agencias y lostipos de servicio para actualizar */
    fetch($('#base_url').val() + "serviciocliente/ListarAgenciasTipoServicios", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(response => response.json())
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

function resetReferencias() {
    window.cont = 0;
    window.m = 0;
    window.contador_global1 = 0;
    $('#contenedor_referencias').empty();
}

// Construir un OffCanvas
// Constructor del Offcanvas Dinámico
function DynamicOffcanvas(options) {
    // Configuración predeterminada
    var defaults = {
        id: 'dynamicOffcanvas',
        title: 'Default Title',
        content: 'Default Content',
        scroll: true,
        backdrop: false
    };

    // Fusionar opciones con defaults
    this.settings = Object.assign({}, defaults, options);

    // Inicializar
    this.initialize();
}

DynamicOffcanvas.prototype.initialize = function () {
    this.createOffcanvas();
    this.bsOffcanvas = new bootstrap.Offcanvas(this.offcanvasElement);
};

DynamicOffcanvas.prototype.createOffcanvas = function () {
    var offcanvasHTML = `
        <div class="offcanvas offcanvas-end" 
            id="${this.settings.id}" 
            data-bs-scroll="${this.settings.scroll}" 
            data-bs-backdrop="${this.settings.backdrop}"
            data-bs-backdrop="static"
            tabindex="-1" 
            aria-labelledby="${this.settings.id}-label" style="width: 1200px;">
            <div class="offcanvas-header">
            <h5 class="offcanvas-title fw-bold" id="${this.settings.id}-label">
                ${this.settings.title}
            </h5>
            <button class="btn-close text-reset" type="button" data-bs-dismiss="offcanvas"></button>
            </div>
        <div class="offcanvas-body">
            ${this.settings.content}
        </div>
        </div>
    `;

    var container = document.createElement('div');
    container.innerHTML = offcanvasHTML;
    this.offcanvasElement = container.firstElementChild;
    document.body.appendChild(this.offcanvasElement);
};

DynamicOffcanvas.prototype.updateContent = function (newContent) {
    var body = this.offcanvasElement.querySelector('.offcanvas-body');
    body.innerHTML = newContent;
};

DynamicOffcanvas.prototype.updateTitle = function (newTitle) {
    var title = this.offcanvasElement.querySelector('.offcanvas-title');
    title.innerHTML = newTitle;
};

DynamicOffcanvas.prototype.show = function () {
    this.bsOffcanvas.show();
};

DynamicOffcanvas.prototype.hide = function () {
    this.bsOffcanvas.hide();
};