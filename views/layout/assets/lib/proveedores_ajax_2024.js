let valores = "";
$(document).ready(function () {
  valores = window.location.search;
  // let loadingOverlay = $("#loading-overlay");
  $("#actividades").hide();
  $(".select2").select2();
  $("#elmodalito2").click(function () {
    $("#actividades").hide();
    // $(".datos_val").show();
    $("#num_val").val("");
    $("#token_val").val("");
  });

  var datos = JSON.parse(sessionStorage.getItem("datos_valida"));
  if (sessionStorage.getItem("datos_valida") !== null) {
    $(".datos_val").hide();
    $("#frm_proveedores").css("display", "block");
    // console.log("🚀 ~ datos:", datos.operacion);
    Crear_ventana(datos.estudio, datos.operacion);
  } else {
    $(".datos_val").show();
    $("#frm_proveedores").css("display", "none");
  }

  /* Validar que tipo de operacion se va a realziar */
  let checkboxes_operaciones = document.querySelectorAll(".operacion");
  checkboxes_operaciones.forEach((checkbox_operacion) => {
    checkbox_operacion.addEventListener("change", () => {
      if (checkbox_operacion.checked) {
        const Operacion = checkbox_operacion.value;
        if (Operacion === "prefiltro") {
          if (document.getElementById("actualizacion").checked) {
            document.getElementById("mensaje_validacion").innerHTML = `
            <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><i class="fas fa-info"></i></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> Solo puede realizar una operación para crear las hojas de vida.
                </div>
            </div>
            `;
            document.getElementById("prefiltro").checked = false;
          } else {
            document.getElementById("campos_prefiltro_nuevo").style.display = "block";
          }
        } else if (Operacion === "actualizacion") {
          if (document.getElementById("prefiltro").checked) {
            document.getElementById("mensaje_validacion").innerHTML = `
            <div class="alert alert-primary alert-icon alert-icon-border alert-dismissible" role="alert">
                <div class="icon"><i class="fas fa-info"></i></div>
                <div class="message">
                  <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                    <strong>Mensaje!</strong> Solo puede realizar una operación para crear las hojas de vida.
                </div>
            </div>
            `;
            document.getElementById("actualizacion").checked = false;
          } else {
            document.getElementById("datos_prefiltro_actualizar").style.display = "block";
          }
        }
      } else if (!checkbox_operacion.checked) {
        const Operacionunchecked = checkbox_operacion.value;
        if (Operacionunchecked === "prefiltro") {
          document.getElementById("campos_prefiltro_nuevo").style.display = "none";
        } else if (Operacionunchecked === "actualizacion") {
          document.getElementById("datos_prefiltro_actualizar").style.display = "none";
        }
      }
    });
  });

  // Contador de campos
  let contadorCampos = 0;
  $("#agregar_campo").click(function () {
    if (contadorCampos < 3) {
      // Verificar el límite de 3 campos
      contadorCampos++;
      // Crear nuevo campo
      const nuevoCampo = document.createElement("div");
      nuevoCampo.classList.add("col-xs-12");
      nuevoCampo.classList.add("col-sm-12");
      nuevoCampo.classList.add("col-md-2");
      nuevoCampo.classList.add("col-lg-2");
      nuevoCampo.classList.add("text-center");
      nuevoCampo.innerHTML = `
        <div class="input-group" id="campos_documentos${contadorCampos}">
          <input type="number" class="form-control input-xs" name="campo" id="documento${contadorCampos}" placeholder="Documento ${contadorCampos}">
          <span class="input-group-btn">
            <button class="btn btn-danger btn-xs btn_delete far fa-trash-alt" id="boton${contadorCampos}" type="button" data-id="${contadorCampos}"></button>
          </span>
        </div>
        `;
      // Agregar nuevo campo al contenedor
      const contenedorCampos = document.getElementById("campos");
      contenedorCampos.appendChild(nuevoCampo);
    } else {
      document.getElementById("mensaje_validacion").innerHTML = `
        <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
            <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="message">
              <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> No puedes agregar más de 3 campos.
            </div>
        </div>
        `;
    }
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn_delete") || e.target.classList.contains("btn_delete *")) {
      const id = e.target.dataset.id;
      if (window.confirm(`¿Estás seguro de que deseas eliminar el documento ${id}?`)) {
        if (contadorCampos === 3 && id == 1) {
          document.getElementById("mensaje_validacion").innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> No puede eliminar el documento 1 y 2 si haber eliminado el 3.
              </div>
          </div>
          `;
        } else if (contadorCampos === 3 && id == 2) {
          document.getElementById("mensaje_validacion").innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> No puede eliminar el documento 1 y 2 si haber eliminado el 3.
              </div>
          </div>
          `;
        } else if (contadorCampos === 2 && id == 1) {
          document.getElementById("mensaje_validacion").innerHTML = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                  <strong>Mensaje!</strong> No puede eliminar el documento 2 si haber eliminado el 2.
              </div>
          </div>
          `;
        } else {
          const documento = document.getElementById("documento" + id);
          const boton = document.getElementById("boton" + id);
          documento.remove();
          boton.remove();
          contadorCampos--;
        }
      }
    }
  });

  $("#btn_cancelar_registro").click(function () {
    if (window.confirm("¿Esta seguro que sea cancelar la creación del proveedor?")) {
      sessionStorage.clear();
      location.reload();
    } else {
    }
  });

  /* Validar token de prefiltro par vehicuslos y proveedores nuevos */
  $("#validar_token").click(async function () {
    if (
      $("#num_val").val() === "" &&
      $("#token_val").val() == "" &&
      $("#documen_conductor").val() == "" &&
      $("#document_propietario").val() == "" &&
      $("#documento_tenedor").val() == ""
    ) {
      $("#mensaje_token").html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Advertencia!</strong> Debe ingresar el codigo de seguridad y el numero de prefiltro para completar el proceso de hoja de vida del vehiculo.
					</div>
			</div>`);
    } else if ($("#num_val").val() === "") {
      $("#mensaje_token").html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el numero de <strong> prefiltro </strong> para completar el proceso de hoja de vida del vehiculo.
					</div>
			</div>`);
    } else if ($("#token_val").val() == "") {
      $("#mensaje_token").html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el <strong> codigo de seguridad </strong> para completar el proceso de hoja de vida del vehiculo.
					</div>
			</div>`);
    } else if ($("#documen_conductor").val() == "") {
      $("#mensaje_token").html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el documento del <strong> conductor </strong>.
					</div>
			</div>`);
    } else if ($("#document_propietario").val() == "") {
      $("#mensaje_token").html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el documento del  <strong> propietario.</strong>
					</div>
			</div>`);
    } else if ($("#documento_tenedor").val() == "") {
      $("#mensaje_token").html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><span class="mdi mdi-info-outline"></span></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe ingresar el documento del <strong> tenedor. </strong>
					</div>
			</div>`);
    } else {
      $("#loading-overlay-nexosapp ").css("display", "flex");
      let formdata = new FormData();
      formdata.append("prefiltro", $("#num_val").val());
      formdata.append("token", $("#token_val").val());
      formdata.append("conductor", $("#documen_conductor").val());
      formdata.append("propietario", $("#document_propietario").val());
      formdata.append("tenedor", $("#documento_tenedor").val());
      var url = $("#id_url_ajax").val() + "proveedores/Validar_token";
      try {
        const response = await fetch(url, {
          method: "POST",
          body: formdata,
          cache: "no-cache",
        });
        const data = await response.json();
        let mensaje = "";
        if (data.numero === 400) {
          $("#cargando").css("display", "none");
          mensaje = `
          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
        } else if (data.numero === 200) {
          mensaje = `
          <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          Crear_ventana($("#num_val").val(), "Prefiltro Nuevo");
        } else {
          mensaje = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> Este vehículo con placa <strong>Texto</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
              </div>
          </div>`;
        }
        $("#mensaje_token").html(mensaje);
      } catch (error) {
        console.error("Error en la primera solicitud:", error);
        console.log("error no inserta");
        $("#crea_vehiculos").css("display", "none");
        $("#mensaje_token_estudio").html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-times"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
            "Error en la primera solicitud:",
          error + ".</div></div>",
        );
        throw error;
      } finally {
        $("#loading-overlay-nexosapp ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
        // Crear_ventana($("#num_val").val(), "Prefiltro Nuevo");
      }
    }
  });

  /* Validar token de estudio de seguridad en actualizacion para crear recursos a nuevos a vehiculos existentes. */
  $("#validar_token_estudio_nuevo").click(async function () {
    if ($("#num_val_estudio").val() === "" && $("#token_val_estudio").val() === "") {
      $("#mensaje_token_estudio").html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar todos los campos y agregar los docmentos para hacer optener la autorización para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($("#num_val_estudio").val() === "") {
      $("#mensaje_token_estudio").html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el numero de <strong> estudio </strong> para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($("#token_val_estudio").val() === "") {
      $("#mensaje_token_estudio").html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el <strong> token </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($("#documento1").val() === "" && $("#documento2").val() === "" && $("#documento3").val() === "") {
      $("#mensaje_token_estudio").html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar los <strong> documentos </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($("#documento1").val() === "") {
      $("#mensaje_token_estudio").html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el <strong> documento 1 </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else if ($("#documento1").val() === "" && $("#documento2").val() === "") {
      $("#mensaje_token_estudio").html(`
      <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
              <strong>Advertencia!</strong> Debe diligenciar el <strong> documento 1 y el documento 2 </strong> de estudio para crear la hoja de vida.
          </div>
      </div>`);
    } else {
      $("#loading-overlay-nexosapp ").css("display", "flex"); // Mostrar mensaje de carga
      let formdata = new FormData();
      formdata.append("estudio", $("#num_val_estudio").val());
      formdata.append("token", $("#token_val_estudio").val());
      /* Los tres documentos llenos */
      // Crear un objeto para almacenar los datos
      var datosValidaEstudio = {
        documento1: [],
        documento2: [],
        documento3: [],
      };
      if ($("#docmento1").val() !== "" && $("#docmento2").val() !== "" && $("#docmento3").val() !== "") {
        datosValidaEstudio.documento1 = $("#documento1").val();
        datosValidaEstudio.documento2 = $("#documento2").val();
        datosValidaEstudio.documento3 = $("#documento3").val();
        /* dos documentos llenos */
      } else if ($("#docmento1").val() !== "" && $("#docmento2").val() !== "") {
        datosValidaEstudio.documento1 = $("#documento1").val();
        datosValidaEstudio.documento2 = $("#documento2").val();
      } else if ($("#docmento1").val() !== "") {
        datosValidaEstudio.documento1 = $("#documento1").val();
      }
      formdata.append("documentos", JSON.stringify(datosValidaEstudio));
      try {
        const response = await fetch($("#id_url_ajax").val() + "proveedores/Validar_token_estudio", {
          method: "POST",
          body: formdata,
          cache: "no-cache",
        });
        const data = await response.json();
        let mensaje = "";
        if (data.numero === 400) {
          $("#cargando").css("display", "none");
          mensaje = `
          <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
        } else if (data.numero === 200) {
          mensaje = `
          <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-check"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> ${data.mensaje}
              </div>
          </div>`;
          Crear_ventana($("#num_val_estudio").val(), "Recurso Nuevo");
        } else {
          mensaje = `
          <div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
              <div class="icon"><span class="mdi mdi-info-outline"></span></div>
              <div class="message">
                <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                <strong>Mensaje!</strong> Este vehículo con placa <strong>Texto</strong> no se encuentra creado en el sistema, solicitar prefiltro para su creación.
              </div>
          </div>`;
        }
        $("#mensaje_token_estudio").html(mensaje);
      } catch (error) {
        console.error("Error en la primera solicitud:", error);
        console.log("error no inserta");
        $("#crea_vehiculos").css("display", "none");
        $("#mensaje_token_estudio").html(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><i class="fas fa-times"></i></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error ' +
            "Error en la primera solicitud:",
          error + ".</div></div>",
        );
        throw error;
      } finally {
        $("#loading-overlay-nexosapp ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
        // Crear_ventana($("#num_val_estudio").val(), "Recurso Nuevo");
      }
    }
  });

  async function Crear_ventana(estudio, operacion) {
    if (operacion === "Recurso Nuevo") {
      let paquete = new FormData();
      paquete.append("estudio", estudio);
      $("#loading-overlay-oet").css("display", "flex");
      try {
        const response = await fetch($("#id_url_ajax").val() + "proveedores/Consulta_Recursos", {
          method: "POST",
          body: paquete,
          cache: "no-cache",
        });
        const data = await response.json();
        // console.log("🚀 ~ Crear_ventana ~ data:", data.resultado);

        if (data) {
          sessionStorage.setItem(
            "datos_valida",
            JSON.stringify({
              propietario: data.resultado.documento_propietario,
              poseedor: data.resultado.documento_poseedor,
              conductor: data.resultado.documento_conductor,
              estudio: data.resultado.ESTUDIO,
              operacion: operacion,
            }),
          );
          let datos_proveedores = JSON.parse(sessionStorage.getItem("datos_valida"));
          console.log("🚀 ~ Crear_ventana ~ datos_proveedores:", datos_proveedores);
          if (data.resultado.propietario === "1" && data.resultado.poseedor === "1" && data.resultado.conductor === "1") {
            if (
              data.resultado.documento_propietario === data.resultado.documento_poseedor &&
              data.resultado.documento_conductor === data.resultado.documento_propietario
            ) {
              $(".datos_val").hide();
              $("#actividades").show();
              $("#acciones").show();
              $("#frm_proveedores").css("display", "block");
              $("#Conductor").show();
              $("#propietario_vehiculo").show();
              $("#poseedor_vehiculo").show();
              $("#Proveedor").hide();
              // Agrega un nuevo elemento al objeto JSON
              datos_proveedores["elementos"] = 1;
              // Almacena el objeto JSON actualizado en sessionStorage
              sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="fila_conductor">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">NO</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">NO existen terceros creados con este documento</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center"><i class="fab fa-creative-commons-zero"></i></td>
                  </tr>
                  <tr  class="fila_propietario">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">NO</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">NO existen terceros creados con este documento</td>
                  </tr>
                  <tr class="fila_possedor">
                    <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">NO</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">NO existen terceros creados con este documento</td>
                  </tr>
                </tbody>
              </table>`);
            } else if (
              data.resultado.documento_propietario == data.resultado.documento_poseedor &&
              data.resultado.documento_conductor != data.resultado.documento_propietario
            ) {
              $(".datos_val").hide();
              $("#actividades").show();
              $("#acciones").show();
              $("#frm_proveedores").css("display", "block");
              // $("#Conductor").hide();
              // $("#propietario_vehiculo").show();
              // $("#poseedor_vehiculo").show();
              $("#Proveedor").hide();
              // Agrega un nuevo elemento al objeto JSON
              datos_proveedores["elementos"] = 2;
              // Almacena el objeto JSON actualizado en sessionStorage
              sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
              /* Consultar los estados de los prooveedores */
              if (data.validar.numero_documento === data.resultado.documento_conductor) {
                $conductor_existe = `#aed5c0`;
                $texto = "Conductor ya cuenta con hoja de vida";
                $validado = "SI";
              } else {
                $texto = "Conductor no cuenta con hoja de vida";
                $validado = "NO";
              }

              if (
                data.validar.numero_documento === data.resultado.documento_propietario &&
                data.validar.numero_documento === data.resultado.documento_poseedor
              ) {
                $propietario_existe = `#aed5c0`;
                $texto_propieetario = "Existen terceros creados con este documento";
                $validado_propietario = "SI";
                $("#Conductor").hide();
                $("#propietario_vehiculo").hide();
                $("#poseedor_vehiculo").hide();
              } else {
                $propietario_existe = `#FFFFFF`;
                $texto_propieetario = "NO existen terceros creados con este documento";
                $validado_propietario = "NO";
                $("#Conductor").hide();
                $("#propietario_vehiculo").show();
                $("#poseedor_vehiculo").show();
              }

              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$conductor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto}</td>
                </tr>
                <tr style="background-color:${$propietario_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propieetario}</td>
                </tr>
                </tbody>
              </table>`);
            } else if (data.documento_propietario == data.documento_conductor && data.documento_poseedor != data.documento_propietario) {
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr>
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">NO</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">NO existen terceros creados con este documento</td>
                </tr>
                <tr>
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">NO</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">NO existen terceros creados con este documento</td>
                </tr>
                </tbody>
              </table>`);
            }
          } else if (data.resultado.propietario === "1" && data.resultado.poseedor === "0" && data.resultado.conductor === "0") {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Conductor").hide();
            $("#propietario_vehiculo").show();
            $("#poseedor_vehiculo").hide();
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_proveedores["elementos"] = 1;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            if (data.validar !== "Sin documentos") {
              data.validar.forEach((element) => {
                if (element.numero_documento === data.resultado.documento_propietario) {
                  $propietario_existe = `#aed5c0`;
                  $texto_propieetario = "Existen propietario creados con este documento";
                  $validado_propietario = "SI";
                } else {
                  $propietario_existe = `#FFFFFF`;
                  $texto_propieetario = "NO existe el propietario creados con este documento";
                  $validado_propietario = "NO";
                }
              });
            } else {
              $propietario_existe = `#FFFFFF`;
              $texto_propieetario = "NO existe el propietario creados con este documento";
              $validado_propietario = "NO";
            }

            $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$propietario_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propieetario}</td>
                </tr>
                <tr> 
                </tbody>
              </table>`);
          } else if (data.resultado.poseedor === "1" && data.resultado.propietario === "0" && data.resultado.conductor === "0") {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Conductor").hide();
            $("#propietario_vehiculo").hide();
            $("#poseedor_vehiculo").show();
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_proveedores["elementos"] = 1;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            if (data.validar !== "Sin documentos") {
              data.validar.forEach((element) => {
                if (element.numero_documento === data.resultado.documento_poseedor) {
                  $poseedor_existe = `#aed5c0`;
                  $texto_poseedor = "Existen poseedor creados con este documento";
                  $validado_poseedor = "SI";
                } else {
                  $poseedor_existe = `#FFFFFF`;
                  $texto_poseedor = "NO existe el poseedor creados con este documento";
                  $validado_poseedor = "NO";
                }
              });
            } else {
              $poseedor_existe = `#FFFFFF`;
              $texto_poseedor = "NO existe el poseedor creados con este documento";
              $validado_poseedor = "NO";
            }

            $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$poseedor_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_poseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_poseedor}</td>
                </tr>
                <tr> 
                </tbody>
              </table>`);
          } else if (data.resultado.conductor === "1" && data.resultado.propietario === "0" && data.resultado.poseedor === "0") {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Conductor").show();
            $("#propietario_vehiculo").hide();
            $("#poseedor_vehiculo").hide();
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_proveedores["elementos"] = 1;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            if (data.validar !== "Sin documentos") {
              data.validar.forEach((element) => {
                if (element.numero_documento === data.resultado.documento_conductor) {
                  $conductor_existe = `#aed5c0`;
                  $texto_condutor = "Existen poseedor creados con este documento";
                  $validado_conductor = "SI";
                } else {
                  $conductor_existe = `#FFFFFF`;
                  $texto_condutor = "NO existe el poseedor creados con este documento";
                  $validado_conductor = "NO";
                }
              });
            } else {
              $conductor_existe = `#FFFFFF`;
              $texto_condutor = "NO existe el poseedor creados con este documento";
              $validado_conductor = "NO";
            }

            $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$conductor_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_condutor}</td>
                </tr>
                <tr> 
                </tbody>
              </table>`);
          } else if (data.resultado.propietario === "1" && data.resultado.poseedor === "1" && data.resultado.conductor === "0") {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Conductor").hide();
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_proveedores["elementos"] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            if (datos_proveedores.propietario === datos_proveedores.poseedor) {
              $("#propietario_vehiculo").show();
              $("#poseedor_vehiculo").show();
              if (data.validar !== "Sin documentos") {
                data.validar.forEach((element) => {
                  if (element.numero_documento === data.resultado.documento_propietario) {
                    $propietario_existe = `#aed5c0`;
                    $texto_propietario = "Existen propietario creados con este documento";
                    $validado_propietario = "SI";
                  } else {
                    $propietario_existe = `#FFFFFF`;
                    $texto_propietario = "NO existe el propietario creados con este documento";
                    $validado_propietario = "NO";
                  }
                });
              } else {
                $propietario_existe = `#FFFFFF`;
                $texto_propietario = "NO existe el propietario creados con este documento";
                $validado_propietario = "NO";
              }
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$propietario_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propietario}</td>
                </tr>
                <tr> 
                </tbody>
              </table>`);
            } else {
              if (data.validar !== "Sin documentos") {
                data.validar.forEach((element) => {
                  if (element.numero_documento === data.resultado.documento_propietario && data.resultado.documento_propietario) {
                    $propietario_existe = `#aed5c0`;
                    $texto_propietario = "Existen propietario creados con este documento";
                    $validado_propietario = "SI";
                    $("#propietario_vehiculo").hide();
                    $("#poseedor_vehiculo").show();
                  } else {
                    $propietario_existe = `#FFFFFF`;
                    $texto_propietario = "NO existe el propietario creados con este documento";
                    $validado_propietario = "NO";
                    $("#propietario_vehiculo").show();
                    $("#poseedor_vehiculo").hide();
                  }

                  if (element.numero_documento === data.resultado.documento_poseedor) {
                    $poseedor_existe = `#aed5c0`;
                    $texto_poseedor = "Existen poseedor creados con este documento";
                    $validado_poseedor = "SI";
                  } else {
                    $poseedor_existe = `#FFFFFF`;
                    $texto_poseedor = "NO existe el poseedor creados con este documento";
                    $validado_poseedor = "NO";
                  }
                });
              } else {
                $propietario_existe = `#FFFFFF`;
                $texto_propietario = "NO existe el propietario creados con este documento";
                $validado_propietario = "NO";

                $poseedor_existe = `#FFFFFF`;
                $texto_poseedor = "NO existe el poseedor creados con este documento";
                $validado_poseedor = "NO";
                $("#propietario_vehiculo").show();
                $("#poseedor_vehiculo").hide();
              }
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$propietario_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propietario}</td>
                </tr>
                <tr style="background-color:${$poseedor_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_poseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_poseedor}</td>
                </tr>
                <tr> 
                </tbody>
              </table>`);
            }
          } else if (data.resultado.propietario === "1" && data.resultado.conductor === "1" && data.resultado.poseedor === "0") {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#poseedor_vehiculo").hide();
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_proveedores["elementos"] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            if (datos_proveedores.propietario === datos_proveedores.conductor) {
              $("#Conductor").show();
              $("#propietario_vehiculo").show();
              if (data.validar !== "Sin documentos") {
                data.validar.forEach((element) => {
                  if (element.numero_documento === data.resultado.documento_propietario && data.resultado.documento_conductor) {
                    $propietario_existe = `#aed5c0`;
                    $texto_propietario = "Existen Terceros creados con este documento";
                    $validado_propietario = "SI";
                  } else {
                    $propietario_existe = `#FFFFFF`;
                    $texto_propietario = "NO existe el Terceros creados con este documento";
                    $validado_propietario = "NO";
                  }
                });
              } else {
                $propietario_existe = `#FFFFFF`;
                $texto_propietario = "NO existe el Terceros creados con este documento";
                $validado_propietario = "NO";
              }
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$propietario_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propietario}</td>
                </tr>
                <tr> 
                </tbody>
              </table>`);
            } else {
              if (data.validar !== "Sin documentos") {
                data.validar.forEach((element) => {
                  if (element.numero_documento === data.resultado.documento_conductor) {
                    $conductor_existe = `#aed5c0`;
                    $texto_conductor = "Existen Conductor creados con este documento";
                    $validado_conductor = "SI";
                    $("#Conductor").hide();
                    $("#propietario_vehiculo").show();
                  } else {
                    $conductor_existe = `#FFFFFF`;
                    $texto_conductor = "NO existe el Conductor creados con este documento";
                    $validado_conductor = "NO";
                    $("#Conductor").show();
                    $("#propietario_vehiculo").hide();
                  }

                  if (element.numero_documento === data.resultado.documento_propietario) {
                    $propietario_existe = `#aed5c0`;
                    $texto_propietario = "Existen propietario creados con este documento";
                    $validado_propietario = "SI";
                  } else {
                    $propietario_existe = `#FFFFFF`;
                    $texto_propietario = "NO existe el propietario creados con este documento";
                    $validado_propietario = "NO";
                  }
                });
              } else {
                $propietario_existe = `#FFFFFF`;
                $texto_propietario = "NO existe el propietario creados con este documento";
                $validado_propietario = "NO";

                $conductor_existe = `#FFFFFF`;
                $texto_conductor = "NO existe el Conductor creados con este documento";
                $validado_conductor = "NO";
                $("#Conductor").show();
                $("#propietario_vehiculo").hide();
              }
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${$conductor_existe};" >
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_conductor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_conductor}</td>
                  </tr>
                  <tr style="background-color:${$propietario_existe};" >
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propietario}</td>
                  </tr>
                <tr> 
                </tbody>
              </table>`);
            }
          } else if (data.resultado.poseedor === "1" && data.resultado.conductor === "1" && data.resultado.propietario === "0") {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Proveedor").hide();
            $("#propietario_vehiculo").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_proveedores["elementos"] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            if (datos_proveedores.poseedor === datos_proveedores.conductor) {
              $("#Conductor").show();
              $("#poseedor_vehiculo").show();
              if (data.validar !== "Sin documentos") {
                data.validar.forEach((element) => {
                  if (element.numero_documento === data.resultado.documento_poseedor && data.resultado.documento_conductor) {
                    $poseedor_conductor_existe = `#aed5c0`;
                    $texto_poseedor_conductor = "Existen Terceros creados con este documento";
                    $validado_poseedor_conductor = "SI";
                  } else {
                    $poseedor_conductor_existe = `#FFFFFF`;
                    $texto_poseedor_conductor = "NO existe el Terceros creados con este documento";
                    $validado_poseedor_conductor = "NO";
                  }
                });
              } else {
                $poseedor_conductor_existe = `#FFFFFF`;
                $texto_poseedor_conductor = "NO existe el Terceros creados con este documento";
                $validado_poseedor_conductor = "NO";
              }
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$poseedor_conductor_existe};" >
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor & Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_poseedor_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_poseedor_conductor}</td>
                </tr>
                <tr> 
                </tbody>
              </table>`);
            } else {
              if (data.validar !== "Sin documentos") {
                data.validar.forEach((element) => {
                  if (element.numero_documento === data.resultado.documento_conductor) {
                    $conductor_existe = `#aed5c0`;
                    $texto_conductor = "Existen Conductor creados con este documento";
                    $validado_conductor = "SI";
                    $("#Conductor").hide();
                    $("#poseedor_vehiculo").show();
                  } else {
                    $conductor_existe = `#FFFFFF`;
                    $texto_conductor = "NO existe el Conductor creados con este documento";
                    $validado_conductor = "NO";
                    $("#Conductor").show();
                    $("#poseedor_vehiculo").hide();
                  }

                  if (element.numero_documento === data.resultado.documento_poseedor) {
                    $poseedor_existe = `#aed5c0`;
                    $texto_poseedor = "Existen Poseedor creados con este documento";
                    $validado_poseedor = "SI";
                  } else {
                    $poseedor_existe = `#FFFFFF`;
                    $texto_poseedor = "NO existe el Poseedor creados con este documento";
                    $validado_poseedor = "NO";
                  }
                });
              } else {
                $poseedor_existe = `#FFFFFF`;
                $texto_poseedor = "NO existe el Poseedor creados con este documento";
                $validado_poseedor = "NO";

                $conductor_existe = `#FFFFFF`;
                $texto_conductor = "NO existe el Conductor creados con este documento";
                $validado_conductor = "NO";
                $("#Conductor").show();
                $("#poseedor_vehiculo").hide();
              }
              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style="background-color:${$conductor_existe};" >
                    <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_conductor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_conductor}</td>
                  </tr>
                  <tr style="background-color:${$poseedor_existe};" >
                    <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_poseedor}</td>
                    <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_poseedor}</td>
                  </tr>
                <tr> 
                </tbody>
              </table>`);
            }
          }
        }
      } catch (error) {
        console.error("Error en la segunda solicitud:", error);
        throw error;
      } finally {
        $("#loading-overlay-oet ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
      }
    } else if (operacion === "Prefiltro Nuevo") {
      $("#loading-overlay-oet ").css("display", "flex");
      let paquete = new FormData();
      paquete.append("estudio", estudio);
      try {
        const response = await fetch($("#id_url_ajax").val() + "proveedores/Consulta_Recursos_Prefiltro", {
          method: "POST",
          body: paquete,
          cache: "no-cache",
        });
        const data = await response.json();
        // console.log("🚀 ~ Crear_ventana ~ data:", data.validar);

        if (data) {
          sessionStorage.setItem(
            "datos_valida",
            JSON.stringify({
              propietario: data.prefiltro.documento_propietario,
              poseedor: data.prefiltro.documento_tenedor,
              conductor: data.prefiltro.documento_conductor,
              estudio: data.prefiltro.ESTUDIO,
              operacion: operacion,
            }),
          );

          let datos_prefiltro = JSON.parse(sessionStorage.getItem("datos_valida"));
          // console.log("🚀 ~ sessionStorage ~ datos_prefiltro:", datos_prefiltro);

          if (
            data.prefiltro.documento_propietario === data.prefiltro.documento_tenedor &&
            data.prefiltro.documento_conductor === data.prefiltro.documento_propietario
          ) {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Conductor").show();
            $("#propietario_vehiculo").show();
            $("#poseedor_vehiculo").show();
            $("#Proveedor").hide();

            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro["elementos"] = 1;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));

            if (data.validar !== "Sin documentos") {
              if (data.validar) {
                // Iterar sobre las propiedades del objeto validar
                Object.keys(data.validar).forEach(function (key) {
                  var documento = data.validar[key].documento;
                  var actividad = data.validar[key].actividad;

                  /* Consultar los estados de los proveedores */
                  if (documento === data.prefiltro.documento_conductor && actividad === "Conductor") {
                    $conductor_existe = `#aed5c0`;
                    $texto = "Conductor ya cuenta con hoja de vida";
                    $validado = "SI";
                    $("#Conductor").hide();
                    $("#propietario_vehiculo").show();
                    $("#poseedor_vehiculo").show();
                  } else {
                    $conductor_existe = `#FFFFFF`;
                    $texto = "Conductor no cuenta con hoja de vida";
                    $validado = "NO";
                    $("#Conductor").show();
                    $("#propietario_vehiculo").hide();
                    $("#poseedor_vehiculo").hide();
                  }

                  // Verificar si es Propietario o Poseedor Vehiculo
                  if (
                    (documento === data.prefiltro.documento_propietario && actividad === "Propietario") ||
                    (documento === data.prefiltro.documento_tenedor && actividad === "Poseedor Vehiculo")
                  ) {
                    $propietario_existe = `#aed5c0`;
                    $texto_propietario = "Existen terceros creados con este documento";
                    $validado_propietario = "SI";
                  } else {
                    $propietario_existe = `#FFFFFF`;
                    $texto_propietario = "NO existen terceros creados con este documento";
                    $validado_propietario = "NO";
                    $("#propietario_vehiculo").show();
                    $("#poseedor_vehiculo").show();
                  }

                  console.log("Documento: " + documento + ", Actividad: " + actividad);
                });
              } else {
                // Si no hay datos para validar
                console.log("No hay datos para validar");
              }
            } else {
              $texto_propietario = "Propietario no cuenta con hoja de vida";
              $validado_propietario = "NO";
              $texto_tenedor = "Tenedor no cuenta con hoja de vida";
              $validado_tenedor = "NO";
              $texto = "Conductor no cuenta con hoja de vida";
              $validado = "NO";
            }
            $("#Lista_comprobacion").html(`
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
              <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                <tr>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                <tr class="fila_conductor">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto}</td>
                </tr>
                <tr  class="fila_propietario">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propietario}</td>
                </tr>
                <tr class="fila_possedor">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_tenedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_tenedor}</td>
                </tr>
              </tbody>
            </table>`);
          } else if (
            data.prefiltro.documento_propietario === data.prefiltro.documento_tenedor &&
            data.prefiltro.documento_conductor !== data.prefiltro.documento_propietario &&
            data.prefiltro.documento_tenedor
          ) {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Conductor").show();
            $("#propietario_vehiculo").show();
            $("#poseedor_vehiculo").show();
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro["elementos"] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            document.getElementById("num_element").innerHTML = datos_prefiltro.elementos;

            // Supongamos que data contiene el objeto que has proporcionado
            if (data.validar.length !== 0) {
              // Iterar sobre las propiedades del objeto validar
              Object.keys(data.validar).forEach(function (key) {
                var documentos = data.validar[key]; // Array de documentos y actividades
                console.log("🚀 ~ documentos:", documentos);

                // documentos.forEach(function (documentoActividad) {
                //   var documento = documentoActividad.documento;
                //   // console.log("🚀 ~ documento:", documento);
                //   var actividad = documentoActividad.actividad;
                //   // console.log("🚀 ~ actividad:", actividad);

                //   /* Consultar los estados de los proveedores */
                //   if (documento === data.prefiltro.documento_conductor && actividad === "Conductor") {
                //     var conductor_existe = "#81C784";
                //     var texto = "Conductor ya cuenta con hoja de vida";
                //     var validado = "SI";
                //   } else {
                //     var conductor_existe = "#FFFFFF";
                //     var texto = "Conductor no cuenta con hoja de vida";
                //     var validado = "NO";
                //   }

                //   // Verificar si es Propietario o Poseedor Vehiculo
                //   if (documento === data.prefiltro.documento_propietario && documento === data.prefiltro.documento_tenedor) {
                //     console.log("hola desde aqui");
                //     // Si el documento es igual tanto al propietario como al tenedor
                //     if (actividad === "Propietario Vehiculo" && actividad === "Poseedor Vehiculo") {
                //       console.log("hola desde aqui 2");
                //       var propietario_existe = "#81C784";
                //       var texto_propietario = "Este documento es tanto propietario como poseedor del vehículo";
                //       var validado_propietario = "SI"; // O podrías ajustar esto según lo necesites
                //     } else {
                //       var propietario_existe = "#FFFFFF";
                //       var texto_propietario = "NO existen terceros creados con este documento";
                //       var validado_propietario = "NO";
                //     }
                //   } else {
                //     // console.log("hola desde aqui " + documento);
                //     // Si no se cumple ninguna de las condiciones anteriores
                //     var propietario_existe = "#FFFFFF";
                //     var texto_propietario = "NO existen terceros creados con este documentos";
                //     var validado_propietario = "NO";
                //   }

                //   // Hacer algo con las variables conductor_existe, texto, validado, propietario_existe, texto_propietario, validado_propietario
                //   // Por ejemplo, puedes mostrar estos valores en tu interfaz de usuario o hacer cualquier otra operación necesaria
                //   $("#Lista_comprobacion").html(`
                //   <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                //   	<thead style="background-color:#332D2D;color:#fff;text-align:center;">
                //   		<tr>
                //   			<th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                //   			<th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                //   			<th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                //   		</tr>
                //   	</thead>
                //   	<tbody>
                //   	<tr style="background-color:${conductor_existe};">
                //   		<td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                //   		<td style="width: auto; white-space: nowrap;" class="text-center">${validado}</td>
                //   		<td style="width: auto; white-space: nowrap;" class="text-center">${texto}</td>
                //   	</tr>
                //   	<tr style="background-color:${propietario_existe};">
                //   		<td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                //   		<td style="width: auto; white-space: nowrap;" class="text-center">${validado_propietario}</td>
                //   		<td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario}</td>
                //   	</tr>
                //   	</tbody>
                //   </table>`);
                // });
              });
            } else {
              // Si no hay datos para validar
              var conductor_existe = "#FFFFFF";
              var texto = "Conductor no cuenta con hoja de vida";
              var validado = "NO";

              var propietario_existe = "#FFFFFF";
              var texto_propietario = "NO existen terceros creados con este documento";
              var validado_propietario = "NO";

              $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${conductor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto}</td>
                </tr>
                <tr style="background-color:${propietario_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario & Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${texto_propietario}</td>
                </tr>
                </tbody>
              </table>`);
            }
          } else if (
            data.prefiltro.documento_propietario === data.prefiltro.documento_conductor &&
            data.prefiltro.documento_tenedor != data.prefiltro.documento_propietario
          ) {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro["elementos"] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            document.getElementById("num_element").innerHTML = datos_prefiltro.elementos;
            if (data.validar !== "Sin documentos") {
              /* Recorrer array para colorear la lista */
              data.validar.forEach((element) => {
                if (
                  element.numero_documento === data.prefiltro.documento_propietario &&
                  element.numero_documento === data.prefiltro.documento_conductor
                ) {
                  $propietario_conductor_existe = `#aed5c0`;
                  $texto_propieetario_conductor = "Existen terceros creados con este documento";
                  $validado_propietario_conductor = "SI";
                  $("#Conductor").hide();
                  $("#propietario_vehiculo").hide();
                  $("#poseedor_vehiculo").show();
                } else {
                  $propietario_conductor_existe = `#FFFFFF`;
                  $texto_propieetario_conductor = "NO existen terceros creados con este documento";
                  $validado_propietario_conductor = "NO";
                  $("#Conductor").show();
                  $("#propietario_vehiculo").show();
                  $("#poseedor_vehiculo").hide();
                }

                if (element.numero_documento === data.prefiltro.documento_tenedor) {
                  $proseedor_existe = `#aed5c0`;
                  $texto_poseedor = "Existen terceros creados con este documento";
                  $validado_proseedor = "SI";
                } else {
                  $proseedor_existe = `#FFFFFF`;
                  $texto_poseedor = "NO existen terceros creados con este documento";
                  $validado_proseedor = "NO";
                }
              });
            } else {
              $proseedor_existe = `#FFFFFF`;
              $texto_poseedor = "NO existen terceros creados con este documento";
              $validado_proseedor = "NO";
            }

            $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$propietario_conductor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propieetario_conductor}</td>
                </tr>
                <tr style="background-color:${$proseedor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_proseedor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_poseedor}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (
            data.prefiltro.documento_tenedor === data.prefiltro.documento_conductor &&
            data.prefiltro.documento_propietario != data.prefiltro.documento_conductor
          ) {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro["elementos"] = 2;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            document.getElementById("num_element").innerHTML = datos_prefiltro.elementos;
            if (data.validar !== "Sin documentos") {
              data.validar.forEach((element) => {
                if (
                  element.numero_documento === data.prefiltro.documento_tenedor &&
                  element.numero_documento === data.prefiltro.documento_conductor
                ) {
                  $poseedor_conductor_existe = `#aed5c0`;
                  $texto_poseedor_conductor = "Existen terceros creados con este documento";
                  $validado_poseedor_conductor = "SI";
                  $("#Conductor").hide();
                  $("#propietario_vehiculo").show();
                  $("#poseedor_vehiculo").hide();
                } else {
                  $poseedor_conductor_existe = `#FFFFFF`;
                  $texto_poseedor_conductor = "NO existen terceros creados con este documento";
                  $validado_poseedor_conductor = "NO";
                  $("#Conductor").show();
                  $("#propietario_vehiculo").hide();
                  $("#poseedor_vehiculo").show();
                }

                if (element.numero_documento === data.prefiltro.documento_propietario) {
                  $propietario_existe = `#aed5c0`;
                  $texto_propietario = "Existen terceros creados con este documento";
                  $validado_propietario = "SI";
                } else {
                  $propietario_existe = `#aed5c0`;
                  $texto_propietario = "NO existen terceros creados con este documento";
                  $validado_propietario = "NO";
                }
              });
            } else {
              $propietario_existe = `#aed5c0`;
              $texto_propietario = "NO existen terceros creados con este documento";
              $validado_propietario = "NO";
            }

            $("#Lista_comprobacion").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
                <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                  <tr>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                    <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                  </tr>
                </thead>
                <tbody>
                <tr style="background-color:${$poseedor_conductor_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Conductor & Poseedor</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_poseedor_conductor}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_poseedor_conductor}</td>
                </tr>
                <tr style="background-color:${$propietario_existe};">
                  <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$validado_propietario}</td>
                  <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_propietario}</td>
                </tr>
                </tbody>
              </table>`);
          } else if (
            data.prefiltro.documento_tenedor !== data.prefiltro.documento_conductor &&
            data.prefiltro.documento_propietario !== data.prefiltro.documento_tenedor
          ) {
            $(".datos_val").hide();
            $("#actividades").show();
            $("#acciones").show();
            $("#frm_proveedores").css("display", "block");
            $("#Proveedor").hide();
            // Agrega un nuevo elemento al objeto JSON
            datos_prefiltro["elementos"] = 3;
            // Almacena el objeto JSON actualizado en sessionStorage
            sessionStorage.setItem("datos_valida", JSON.stringify(datos_prefiltro));
            document.getElementById("num_element").innerHTML = datos_prefiltro.elementos;

            if (data.validar !== "Sin documentos") {
              data.validar.forEach((element) => {
                if (element.numero_documento === data.prefiltro.documento_conductor) {
                  $conductor_existe = `#aed5c0`;
                  $texto_conductor = "Existe Conductor creado con este documento";
                  $valido_conductor = "SI";
                  $("#Conductor").hide();
                  $("#propietario_vehiculo").hide();
                  $("#poseedor_vehiculo").show();
                } else {
                  $conductor_existe = `#FFFFFF`;
                  $texto_conductor = "NO existe Conductor creado con este documento";
                  $valido_conductor = "NO";
                  $("#Conductor").show();
                  $("#propietario_vehiculo").hide();
                  $("#poseedor_vehiculo").hide();
                }

                if (element.numero_documento === data.prefiltro.documento_propietario) {
                  $Propietario_existe = `#aed5c0`;
                  $texto_Propietario = "Existe Conductor creado con este documento";
                  $valido_propietario = "SI";
                } else {
                  $Propietario_existe = `#FFFFFF`;
                  $texto_Propietario = "NO existe Conductor creado con este documento";
                  $valido_propietario = "NO";
                }

                if (element.numero_documento === data.prefiltro.documento_tenedor) {
                  $Poseedor_existe = `#aed5c0`;
                  $texto_Poseedor = "Existe Poseedor creado con este documento";
                  $valido_poseedor = "SI";
                  $("#Conductor").hide();
                  $("#propietario_vehiculo").show();
                  $("#poseedor_vehiculo").hide();
                } else {
                  $Poseedor_existe = `#FFFFFF`;
                  $texto_Poseedor = "NO existe Poseedor creado con este documento";
                  $valido_poseedor = "NO";
                }
              });
            } else {
              $conductor_existe = `#FFFFFF`;
              $texto_conductor = "NO existe Conductor creado con este documento";
              $valido_conductor = "NO";
              $Propietario_existe = `#FFFFFF`;
              $texto_Propietario = "NO existe Poseedor creado con este documento";
              $valido_propietario = "NO";
            }

            $("#Lista_comprobacion").html(`
            <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;border-top: 1px #fff solid;">
              <thead style="background-color:#332D2D;color:#fff;text-align:center;">
                <tr>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Objeto</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Validado</th>
                  <th style="width: auto; white-space: nowrap;" class="text-center">Mensaje</th>
                </tr>
              </thead>
              <tbody>
              <tr style="background-color:${$conductor_existe};">
                <td style="width: auto; white-space: nowrap;" class="text-center">Conductor</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${$valido_conductor}</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_conductor}</td>
              </tr>
              <tr style="background-color:${$Propietario_existe};">
                <td style="width: auto; white-space: nowrap;" class="text-center">Propietario</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${$valido_propietario}</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_Propietario}</td>
              </tr>
              <tr style="background-color:${$Poseedor_existe};">
                <td style="width: auto; white-space: nowrap;" class="text-center">Poseedor</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${$valido_poseedor}</td>
                <td style="width: auto; white-space: nowrap;" class="text-center">${$texto_Poseedor}</td>
              </tr>
              </tbody>
            </table>`);
          }
        }
      } catch (error) {
        console.error("Error en la segunda solicitud:", error);
        throw error;
      } finally {
        $("#loading-overlay-oet ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
      }
    }
  }

  $("#pasar_municipio").click(function () {
    if ($("#municipio").val() === "") {
      $(".mesanje_error").html(`
			<div class="alert alert-warning alert-icon alert-icon-border alert-dismissible" role="alert">
					<div class="icon"><i class="fas fa-exclamation-triangle"></i></div>
					<div class="message">
						<button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
							<strong>Mensaje!</strong> Debe diligenciar un Municipio para el proveedor.
					</div>
			</div>`);
    } else {
      $("#municipio_tabla").val($("#municipio").val());
      $("#Modal_Municipios").modal("toggle");
    }
  });

  $("#elmodalito2").click(function (event) {
    event.preventDefault();
    $("#div_mascara").hide(); //ocultar formato de direccion
    $("#div_complemento").hide();

    //ocultar los datos cuando entre al modal
    // $(".titulogeneral").hide();
    $("#datos_generalest").hide();
    $(".Datosespecificos").hide();
    $("#datos_onlyconductor").hide();
    $("#datos_proveedor").hide();
    $("#datos_contacto").hide();
    $("#datos_financieros").hide();
    $("#civil").hide();
    $(".zona").hide();
    $("#tipos_servicios").hide();
    $("#Transporte").hide();
    $("#agencia_carga").hide();
    $("#acordeon_proveedor").hide();

    //ocultar o mostrar datos si se salio del
    //modal y tiene un checkbox seleccionado
    var tipo_actividad = false;
    $(".tipo_actividad").each(function () {
      if ($(this).is(":checked")) {
        tipo_actividad = true;
        if ($(this).attr("id") == "Conductor") {
          $(".titulogeneral").show();
          $("#datos_generalest").show();
          $(".Datosespecificos").show();
          $("#datos_onlyconductor").show();
        }
        if ($(this).attr("id") == "poseedor_vehiculo" || $(this).attr("id") == "propietario_vehiculo" || $(this).attr("id") == "Proveedor") {
          $(".titulogeneral").show();
          $("#datos_generalest").show();

          if ($(this).attr("id") == "Proveedor") {
            $("#datos_proveedor").show();
            $("#datos_contacto").show();
          }
        } else {
        }
      }
    });
  });

  $("#numero_documento").change(function () {
    // Se busca si el proveedor ya existe en el sistema
    var params = {
      accion: "verProveedorDoc",
      doc_proveedor: $("#numero_documento").val(),
    };
    $.ajax({
      type: "POST",
      cache: false,
      url: url,
      data: params,
      dataType: "json",
      success: function (data) {
        // console.log(data);
        $(".nexos-messages").empty();
        if (data.success) {
          funct_msg_error(
            "#nexos_messages_popup",
            "El proveedor ya se encuentra registrado, cualquier cambio lo puede realizar editando la información dentro de la lista.",
          );
          $("#crea_proveedores").animate({scrollTop: 0}, 600);
          $("#rndc_nombre").val("");
          $("#rndc_nombre").attr("disabled", true);
          $("#btn_agregar_proveedor").hide();
        } else {
          if ($("#tipo_documento").val() == "NIT") {
            $("#digito_verificacion").val(calcularDigitoVerificacion($("#numero_documento").val()));
            $("#btn_agregar_proveedor").show();
          } else {
            $("#digito_verificacion").val(0);
            $("#btn_agregar_proveedor").show();
          }
        }
      },
    });
  });

  /* Validar el telfono fijo */

  // $("#numero_documento").blur(function () {
  //   // $("#numero_documento").keyup(function () {
  //   $("#rndc_nombre").attr("disabled", false);
  //   //$("#digito_verificacion").val("");
  //   var tipo_actividad = false;
  //   $(".tipo_actividad").each(function () {
  //     if ($(this).is(":checked")) {
  //       tipo_actividad = true;
  //       if ($(this).attr("id") == "Conductor" || $(this).attr("id") == "poseedor_vehiculo" || $(this).attr("id") == "propietario_vehiculo") {
  //         var cond = 0;
  //         var tene = 0;
  //         var propi = 0;
  //         if ($("#Conductor").is(":checked")) {
  //           cond = 1;
  //         }
  //         if ($("#poseedor_vehiculo").is(":checked")) {
  //           tene = 1;
  //         }
  //         if ($("#propietario_vehiculo").is(":checked")) {
  //           propi = 1;
  //         }
  //         //traer nombre
  //         var name = {
  //           accion: "TraerName",
  //           doc_proveedor: $("#numero_documento").val(),
  //           cond: cond,
  //           tene: tene,
  //           propi: propi,
  //         };
  //         //$("#rndc_nombre").val('');
  //         $.ajax({
  //           type: "POST",
  //           cache: false,
  //           url: url,
  //           data: name,
  //           dataType: "json",
  //           success: function (data) {
  //             if (data.success) {
  //               $("#rndc_nombre").prop("disabled", false);
  //               if (data.nombre[0].nombre_propietario != "" && data.nombre[0].nombre_propietario != null) {
  //                 let arr = data.nombre[0].nombre_propietario.split(" ");
  //                 $("#rndc_nombre").val(arr[0]);
  //                 $("#primer_apellido").val(arr[1]);
  //                 $("#segundo_apellido").val(arr[2]);
  //               }
  //               if (data.nombre[0].nombre_tenedor != "" && data.nombre[0].nombre_tenedor != null) {
  //                 let arr = data.nombre[0].nombre_tenedor.split(" ");
  //                 $("#rndc_nombre").val(arr[0]);
  //                 $("#primer_apellido").val(arr[1]);
  //                 $("#segundo_apellido").val(arr[2]);
  //               }
  //               if (data.nombre[0].nombre_conductor != "" && data.nombre[0].nombre_conductor != null) {
  //                 let arr = data.nombre[0].nombre_conductor.split(" ");
  //                 $("#rndc_nombre").val(arr[0]);
  //                 $("#primer_apellido").val(arr[1]);
  //                 $("#segundo_apellido").val(arr[2]);
  //               }
  //             }
  //             /*else{
  // 							$("#rndc_nombre").val('');
  // 						}*/
  //           },
  //           error: function (jqXHR, textStatus, errorThrown) {
  //             console.log(jqXHR);
  //             console.log(textStatus);
  //             console.log(errorThrown);
  //           },
  //         });
  //       }
  //     }
  //   });
  //   if ($("#numero_documento").val() !== "") {
  //     //traer referencias laborales
  //     var refe = {
  //       accion: "TraerRefeCondu",
  //       doc_proveedor: $("#numero_documento").val(),
  //     };

  //     $.ajax({
  //       type: "POST",
  //       cache: false,
  //       url: url,
  //       data: refe,
  //       dataType: "json",
  //       success: function (data) {
  //         if (data.success) {
  //           //bloquear los campos y llenarlos
  //           $(".nexos-messages").empty();
  //           $("#referencias_empresariales1").prop("disabled", true);
  //           $("#fecha_referencia1").prop("disabled", true);
  //           $("#fecha_retiro1").prop("disabled", true);
  //           $("#contacto_ref1").prop("disabled", true);
  //           $("#celular_ref1").prop("disabled", true);
  //           $("#cargo_ref1").prop("disabled", true);
  //           $("#anti_ref1").prop("disabled", true);
  //           $("#referencias_empresariales2").prop("disabled", true);
  //           $("#fecha_referencia2").prop("disabled", true);
  //           $("#fecha_retiro2").prop("disabled", true);
  //           $("#contacto_ref2").prop("disabled", true);
  //           $("#celular_ref2").prop("disabled", true);
  //           $("#cargo_ref2").prop("disabled", true);
  //           $("#anti_ref2").prop("disabled", true);
  //           $("#referencias_empresariales3").prop("disabled", true);
  //           $("#fecha_referencia3").prop("disabled", true);
  //           $("#fecha_retiro3").prop("disabled", true);
  //           $("#contacto_ref3").prop("disabled", true);
  //           $("#celular_ref3").prop("disabled", true);
  //           $("#cargo_ref3").prop("disabled", true);
  //           $("#anti_ref3").prop("disabled", true);
  //           $("#documento_referencia1").prop("disabled", false);
  //           $("#documento_referencia2").prop("disabled", false);
  //           $("#documento_referencia3").prop("disabled", false);
  //           //llenarlos
  //           var c = 0;
  //           data.referencias.forEach(function (element, index) {
  //             c++;
  //             $("#referencias_empresariales" + c).val(element.nombre_empresa);
  //             $("#fecha_referencia" + c).val(element.fecha_ingreso);
  //             $("#fecha_retiro" + c).val(element.fecha_retiro);
  //             $("#contacto_ref" + c).val(element.persona_contacto);
  //             $("#celular_ref" + c).val(element.celular);
  //             $("#cargo_ref" + c).val(element.cargo);
  //             $("#anti_ref" + c).val(element.antiguedad);
  //             $("#idp" + c).val(element.id);
  //           });
  //           funct_msg_success2("#nexos_messages_popup2", "Referencias del prefiltro.");
  //           $("#crea_proveedores").animate({scrollTop: 0}, 600);
  //           //$("#referencias_empresariales1").val(data.referencias[0].["nombre_empresa"]);
  //         }
  //       },
  //       error: function (jqXHR, textStatus, errorThrown) {
  //         console.log(jqXHR);
  //         console.log(textStatus);
  //         console.log(errorThrown);
  //       },
  //     });
  //   }
  // });

  $("#btn_agregar_proveedor").click(async function () {
    if (window.confirm("¿Esta seguro de crear este proveedor.?")) {
      $(".nexos-messages").html("");
      b = $("#numero_documento").val().length;
      // Se valida contenido del formulario
      var msg_error = "";
      var flag_primer_apellido = true;
      var flag_abreviatura = true;
      var flag_telefono = true;
      var tipo_actividad = false;

      $(".tipo_actividad").each(function () {
        if ($(this).is(":checked")) {
          tipo_actividad = true;
          if ($(this).attr("id") == "Conductor") {
            if (!$("#categoria_licencia").val()) {
              // msg_error += "<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder crear el Proveedor.</p>";
              $("#categoria_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe seleccionar una catergoría de Licencia")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#categoria_licencia").after(ERROR);
              AplicaFoco("#categoria_licencia");
            } else {
              RemueveFoco("#categoria_licencia");
              $("#categoria_licencia + p").remove();
            }
            if (!$("#numero_licencia").val()) {
              // msg_error += "<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder crear el Proveedor.</p>";
              $("#numero_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe diligenciar el campo numero de licencia")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#numero_licencia").after(ERROR);
              AplicaFoco("#numero_licencia");
            } else {
              RemueveFoco("#numero_licencia");
              $("#categoria_licencia + p").remove();
            }

            if ($("#numero_licencia").val().length < 5) {
              // alert("hola desde menos 5");
              $("#numero_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("El Número de Licencia debe tener mínimo 5 carácteres")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#numero_licencia").after(ERROR);
              AplicaFoco("#numero_licencia");
            } else if ($("#numero_licencia").val().length > 12) {
              $("#numero_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("El Número de Licencia debe tener maximo 12 carácteres")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#numero_licencia").after(ERROR);
              AplicaFoco("#numero_licencia");
            } else if ($("#numero_licencia").val() === "00000") {
              $("#numero_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("El Número de Licencia debe contener ceros")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#numero_licencia").after(ERROR);
              AplicaFoco("#numero_licencia");
            } else if ($("#numero_licencia").val() === "00000000000") {
              $("#numero_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("El Número de Licencia debe contener ceros")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#numero_licencia").after(ERROR);
              AplicaFoco("#numero_licencia");
            } else if ($("#numero_licencia").val() === "") {
              $("#numero_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe diligenciar el numero de licencia")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#numero_licencia").after(ERROR);
              AplicaFoco("#numero_licencia");
            } else {
              RemueveFoco("#numero_licencia");
              $("#numero_licencia + p").remove();
            }

            // if ($("#numero_licencia").val().length < 5 || $("#numero_licencia").val().length > 12) {
            //   // msg_error += "<p>El campo <strong>Número de Licencia: debe tener mínimo 5 máximo 12 carácteres</strong> para poder crear el Proveedor.</p>";
            // $("#numero_licencia + p").remove();
            // const ERROR = $("<p></p>")
            //   .text("El Número de Licencia debe tener mínimo 5 máximo 12 carácteres")
            //   .addClass("bg-danger text-center")
            //   .css({color: "#FFF", "font-size": "11px", margin: 0});
            // $("#numero_licencia").after(ERROR);
            // AplicaFoco("#numero_licencia");
            // } else {
            //   RemueveFoco("#numero_licencia");
            //   $("#numero_licencia + p").remove();
            // }

            var fileInput = $("#licencia")[0].files[0];
            // Verifica si se ha seleccionado un archivo
            if (!fileInput) {
              $("#licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe seleccionar un documento")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#licencia").after(ERROR);
              AplicaFoco("#licencia");
            } else {
              RemueveFoco("#licencia");
              $("#licencia + p").remove();
            }

            /* 10) Validar el documento de la cedula. */
            var fileInput = $("#documentos")[0].files[0];
            // Verifica si se ha seleccionado un archivo
            if (!fileInput) {
              $("#documentos + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe seleccionar un documento")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#documentos").after(ERROR);
              AplicaFoco("#documentos");
            } else {
              RemueveFoco("#documentos");
              $("#documentos + p").remove();
            }

            if (!$("#vencimiento_licencia").val()) {
              // msg_error += "<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder crear el Proveedor.</p>";
              $("#vencimiento_licencia + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe diligenciar el campo vencimiento Licencia")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#vencimiento_licencia").after(ERROR);
              AplicaFoco("#vencimiento_licencia");
            } else {
              if (!validaFechaActual($("#vencimiento_licencia").val())) {
                msg_error += "<p>El campo <strong>Vencimiento Licencia</strong> debe ser mayor de la fecha actual para poder crear el Proveedor.</p>";
                AplicaFoco("#vencimiento_licencia");
              } else {
                RemueveFoco("#vencimiento_licencia");
              }
              RemueveFoco("#vencimiento_licencia");
            }

            if ($("#tipo_documento").val() == "NIT") {
              msg_error += "<p>No se puede crear un conductor registrado con NIT.</p>";
              AplicaFoco("#tipo_documento");
            } else {
              RemueveFoco("#tipo_documento");
            }
            if ($("#tipo_documento").val() == "Identificacion Tributaria Internacional") {
              msg_error += "<p>No se puede crear un <strong>conductor</strong> registrado con Identificacion Tributaria Internacional.</p>";
              AplicaFoco("#tipo_documento");
            } else {
              RemueveFoco("#tipo_documento");
            }
            if (!$("#celular2").val()) {
              // msg_error += "<p>Debe diligenciar el campo <strong>Celular 2</strong> para poder crear el Proveedor.</p>";
              $("#celular2 + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe diligenciar el campo celular 2")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#celular2").after(ERROR);
              AplicaFoco("#celular2");
            } else {
              if ($("#celular2").length < 7) {
                // alert("el ceular debe ser mayor a 7 caracteres");
                $("#celular2 + p").remove();
                const ERROR = $("<p></p>")
                  .text("El ceular debe tener minimo 10 caracteres")
                  .addClass("bg-danger text-center")
                  .css({color: "#FFF", "font-size": "11px", margin: 0});
                $("#celular2").after(ERROR);
              } else if ($("#celular2").length > 30) {
                $("#celular2 + p").remove();
                const ERROR = $("<p></p>")
                  .text("El ceular no debe supearr los 30 caracteres")
                  .addClass("bg-danger text-center")
                  .css({color: "#FFF", "font-size": "11px", margin: 0});
                $("#celular2").after(ERROR);
              } else if ($("#celular2").val() == "0000000") {
                $("#celular2 + p").remove();
                const ERROR = $("<p></p>")
                  .text("El ceular no es valido")
                  .addClass("bg-danger text-center")
                  .css({color: "#FFF", "font-size": "11px", margin: 0});
                $("#celular2").after(ERROR);
              } else {
                RemueveFoco("#celular2");
                $("#celular2 + p").remove();
              }
            }
            if (!$("#celular").val()) {
              // msg_error += "<p>Debe diligenciar el campo <strong>Celular 1</strong> para poder crear el Proveedor.</p>";
              $("#celular + p").remove();
              const ERROR = $("<p></p>")
                .text("Debe diligenciar el campo celular 1")
                .addClass("bg-danger text-center")
                .css({color: "#FFF", "font-size": "11px", margin: 0});
              $("#celular").after(ERROR);
              AplicaFoco("#celular");
            } else {
              RemueveFoco("#celular");
              $("#celular + p").remove();
            }
            if (!$("#referencias_empresariales1").val()) {
              msg_error += "<p>Debe seleccionar una <strong>Referencias Empresariales 1</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#referencias_empresariales1");
            } else {
              RemueveFoco("#referencias_empresariales1");
            }
            if (!$("#celular_ref1").val()) {
              msg_error += "<p>Debe ingresar un <strong>Número Empresarial 1</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#celular_ref1");
            } else {
              RemueveFoco("#celular_ref1");
            }
            if (!$("#referencias_empresariales2").val()) {
              msg_error += "<p>Debe ingresar una <strong>Referencia Empresariales 2</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#referencias_empresariales2");
            } else {
              RemueveFoco("#referencias_empresariales2");
            }
            if (!$("#celular_ref2").val()) {
              msg_error += "<p>Debe ingresar un <strong>Número Empresarial 2</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#celular_ref2");
            } else {
              RemueveFoco("#celular_ref2");
            }
            if (!$("#referencias_empresariales3").val()) {
              msg_error += "<p>Debe ingresar una <strong>Referencia Empresarial 3</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#referencias_empresariales3");
            } else {
              RemueveFoco("#referencias_empresariales3");
            }
            if (!$("#celular_ref3").val()) {
              msg_error += "<p>Debe ingresar un <strong>Número Empresarial 3</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#celular_ref3");
            } else {
              RemueveFoco("#celular_ref3");
            }
            if (!$("#referencias_personales1").val()) {
              msg_error += "<p>Debe seleccionar una <strong>Referencias Personales 1</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#referencias_personales1");
            } else {
              RemueveFoco("#referencias_personales1");
            }
            if (!$("#parenp1").val()) {
              msg_error += "<p>Debe seleccionar un <strong>Parentezco Personales 1</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#parenp1");
            } else {
              RemueveFoco("#parenp1");
            }
            if (!$("#telefonop1").val()) {
              msg_error += "<p>Debe ingresar un <strong>Teléfono Personales 1</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#telefonop1");
            } else {
              RemueveFoco("#telefonop1");
            }
            if (!$("#referencias_personales2").val()) {
              msg_error += "<p>Debe ingresar una <strong>Refrencia Personales 2</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#referencias_personales2");
            } else {
              RemueveFoco("#referencias_personales2");
            }
            if (!$("#parenp2").val()) {
              msg_error += "<p>Debe seleccionar un <strong>parentezco Personales 2</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#parenp2");
            } else {
              RemueveFoco("#parenp2");
            }
            if (!$("#telefonop2").val()) {
              msg_error += "<p>Debe ingresar un <strong>Teléfono Personales 2</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#telefonop2");
            } else {
              RemueveFoco("#telefonop2");
            }
            if (!$("#sangre").val()) {
              msg_error += "<p>Debe Seleccionar un <strong> Grupo sanguineo </strong> para poder crear el Conductor.</p>";
              AplicaFoco("#sangre");
            } else {
              RemueveFoco("#sangre");
            }
            // ACUERDO DE SEGURIDAD DEL CONDUCTOR
            if (!$("#acuerdo_uno").val()) {
              msg_error += "<p>Debe seleccionar el <strong>Acuerdo de seguridad</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#acuerdo_uno");
            } else {
              RemueveFoco("#acuerdo_uno");
            }
            if (!$("#sexo").val()) {
              msg_error += "<p>Debe seleccionar el <strong>Género</strong> para poder crear el Conductor.</p>";
              AplicaFoco("#sexo");
            } else {
              RemueveFoco("#sexo");
            }
            if ($("#fecha_retiro1").val() < $("#fecha_referencia1").val()) {
              msg_error += "<p>La Fecha de retiro 1 no puede ser menor a la Fecha de ingreso 1</p>";
            }
            if ($("#fecha_retiro2").val() < $("#fecha_referencia2").val()) {
              msg_error += "<p>La Fecha de retiro 2 no puede ser menor a la Fecha de ingreso 2</p>";
            }
            if ($("#fecha_retiro3").val() < $("#fecha_referencia3").val()) {
              msg_error += "<p>La Fecha de retiro 3 no puede ser menor a la Fecha de ingreso 3</p>";
            }

            if (!$("#foto_conductor").val()) {
              msg_error += "<p>Debe seleccionar la <strong>Foto Frontal(1) del conductor</strong> para poder crear el Conductor.</p>";
            }

            if (!$("#foto_indume").val()) {
              msg_error += "<p>Debe seleccionar la <strong>Foto de  Indumentaria del conductor</strong> para poder crear el Conductor.</p>";
            }

            if (!$("#foto_derecha").val()) {
              msg_error += "<p>Debe seleccionar la <strong>Foto lateral derecho(1) del conductor</strong> para poder crear el Conductor.</p>";
            }

            if (!$("#foto_izquierda").val()) {
              msg_error += "<p>Debe seleccionar la <strong>Foto lateral izquierdo(1) del conductor</strong> para poder crear el Conductor.</p>";
            }

            //fin validaciones del conductor
          } //cierre del conductor

          if ($(this).attr("id") == "Proveedor") {
            if (!$("#pv_localizacion").val()) {
              msg_error += "<p>Debe seleccionar <strong>Localización operacional</strong> para poder crear el Proveedor.</p>";
              AplicaFoco("#pv_localizacion");
            } else {
              RemueveFoco("#pv_localizacion");
            }
            if (!$("#pv_tiposervice").val()) {
              msg_error += "<p>Debe seleccionar <strong>Tipo de servicio</strong> para poder crear el Proveedor.</p>";
              AplicaFoco("#pv_tiposervice");
            } else {
              RemueveFoco("#pv_tiposervice");
            }
            if ($("#pv_tiposervice").val() == "Transporte") {
              if (!$("#pv_via").val()) {
                msg_error += "<p>Debe seleccionar <strong>Vía</strong> para poder crear el Proveedor.</p>";
                AplicaFoco("#pv_via");
              } else {
                RemueveFoco("#pv_via");
              }
              if (!$("#pv_select").val()) {
                msg_error += "<p>Debe seleccionar <strong>Tipificación</strong> para poder crear el Proveedor.</p>";
                AplicaFoco("#pv_select");
              } else {
                RemueveFoco("#pv_select");
              }
            } else if ($("#pv_tiposervice").val() == "Porteadores") {
              if (!$("#detalle_porteador").val()) {
                msg_error += "<p>Debe seleccionar <strong>Detalle 1</strong> para poder crear el Proveedor.</p>";
                AplicaFoco("#detalle_porteador");
              } else {
                RemueveFoco("#detalle_porteador");
              }
            } else if ($("#pv_tiposervice").val() == "Agenciamiento de carga") {
              if (!$("#detalle_acarga").val()) {
                msg_error += "<p>Debe seleccionar <strong>Detalle 1</strong> para poder crear el Proveedor.</p>";
                AplicaFoco("#detalle_acarga");
              } else {
                RemueveFoco("#detalle_acarga");
              }
            } else if ($("#pv_tiposervice").val() == "Tramites administrativos") {
              if (!$("#tramite_ad").val()) {
                msg_error += "<p>Debe seleccionar <strong>Detalle 1</strong> para poder crear el Proveedor.</p>";
                AplicaFoco("#tramite_ad");
              } else {
                RemueveFoco("#tramite_ad");
              }
            }
          } //cierre del proveedor
        }
      });

      /* Validaciones de datos generales */
      /* 1) Validacion de seleccionar el tipo de actividad para crear el proveedor */
      if (!tipo_actividad) {
        msg_error += "<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder crear el Proveedor.</p>";
        AplicaFoco("#label_tipoactividad");
      } else {
        RemueveFoco("#label_tipoactividad");
      }

      /* 2) Validar el Tipo de documento para crear el proveedor solamente como propietario o poseedor */
      if (!$("#tipo_documento").val()) {
        // msg_error += "<p>Debe diligenciar el campo <strong>Tipo Documento</strong> para poder crear el Proveedor.</p>";
        AplicaFoco("#tipo_documento");
        $("#tipo_documento + p").remove();
        const ERROR = $("<p></p>")
          .text("Debe seleccionar el tipo de documento")
          .addClass("bg-danger text-center")
          .css({color: "#FFF", "font-size": "11px", margin: 0});
        $("#tipo_documento").after(ERROR);
        // $("#tipo_documento").before(ERROR);
      } else {
        RemueveFoco("#tipo_documento");
        $("#tipo_documento + p").remove(); // Elimina el mensaje de error si ya existe
      }

      if (!$("#tipo_documento").val()) {
        if (!$("#celular").val()) {
          $("#celular + p").remove();
          const ERROR = $("<p></p>")
            .text("Debe diligenciar el celular de contacto")
            // .text("Campo obligatorio")
            .addClass("bg-danger text-center")
            .css({color: "#FFF", "font-size": "11px", margin: 0});
          $("#celular").after(ERROR);
          AplicaFoco("#celular");
          // flag_telefono = false;
        } else {
          RemueveFoco("#celular");
          $("#celular + p").remove();
        }
      } else {
        if ($("#tipo_documento").val() == "Cedula de Ciudadania" || $("#tipo_documento").val() == "Cedula de Extranjeria") {
          if (!$("#primer_apellido").val()) {
            flag_primer_apellido = false;
          }
        }

        if ($("#tipo_documento").val() == "NIT" || $("#tipo_documento").val() == "Identificacion Tributaria Internacional") {
          if (!$("#contacto").val()) {
            flag_telefono = false;
            var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder crear el Proveedor.</p>";
          }
        }
        //validar longitud de numero de documento según el tipo
        if ($("#tipo_documento").val() == "Cedula de Ciudadania") {
          if (!$("#numero_documento").val()) {
            $("#numero_documento + p").remove();
            const ERROR = $("<p></p>")
              .text("Debe diligenciar el numero de documento")
              .addClass("bg-danger text-center")
              .css({color: "#FFF", "font-size": "11px", margin: 0});
            $("#numero_documento").after(ERROR);
            AplicaFoco("#numero_documento");
          } else if ($("#numero_documento").val().length < 8) {
            $("#numero_documento + p").remove();
            const ERROR = $("<p></p>")
              .text("Debe diligenciar minimo 8 caracteres para crear el proveedor")
              .addClass("bg-danger text-center")
              .css({color: "#FFF", "font-size": "11px", margin: 0});
            $("#numero_documento").after(ERROR);
            AplicaFoco("#numero_documento");
          } else if ($("#numero_documento").val().length > 12) {
            $("#numero_documento + p").remove();
            const ERROR = $("<p></p>")
              .text("Debe diligenciar maximo 12 caracteres para crear el proveedor")
              .addClass("bg-danger text-center")
              .css({color: "#FFF", "font-size": "11px", margin: 0});
            $("#numero_documento").after(ERROR);
            AplicaFoco("#numero_documento");
          } else if (/^0+$/.test($("#numero_documento").val())) {
            $("#numero_documento + p").remove();
            const ERROR = $("<p></p>")
              .text("El campo no puede contener solo ceros.")
              .addClass("bg-danger text-center")
              .css({color: "#FFF", "font-size": "11px", margin: 0});
            $("#numero_documento").after(ERROR);
            AplicaFoco("#numero_documento");
          } else if ($("#numero_documento").val() === "000000000000") {
            $("#numero_documento + p").remove();
            const ERROR = $("<p></p>")
              .text("El campo no puede contener solo ceros.")
              .addClass("bg-danger text-center")
              .css({color: "#FFF", "font-size": "11px", margin: 0});
            $("#numero_documento").after(ERROR);
            AplicaFoco("#numero_documento");
          } else {
            RemueveFoco("#numero_documento");
            $("#numero_documento + p").remove();
          }
        }

        if ($("#tipo_documento").val() == "Cedula de Extranjeria") {
          if ($("#numero_documento").val().length != 6) {
            msg_error +=
              "<p>El campo <strong>Número de documento</strong> debe tener 6 caracteres para poder crear el Proveedor con Cédula Extranjeria.</p>";
          }
        }

        if ($("#tipo_documento").val() == "NIT") {
          if ($("#numero_documento").val().length != 9) {
            msg_error += "<p>El campo <strong>Número de documento</strong> debe tener 9 caracteres para poder crear el Proveedor con Nit.</p>";
          }
        }
      }

      /* 3) Validar que el campo tipo documento no este vacio */
      if (!$("#numero_documento").val()) {
        $("#numero_documento + p").remove();
        const ERROR = $("<p></p>")
          .text("Debe diligenciar numero documento")
          .addClass("bg-danger text-center")
          .css({color: "#FFF", "font-size": "11px", margin: 0});
        $("#numero_documento").after(ERROR);
        AplicaFoco("#numero_documento");
      }

      /* 4) Validar Nombre o razon social del proveedor */
      if (!$("#rndc_nombre").val()) {
        // msg_error += "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder crear el Proveedor.</p>";
        $("#rndc_nombre + p").remove();
        const ERROR = $("<p></p>")
          .text("Debe diligenciar el campo Nombre o Razón social")
          .addClass("bg-danger text-center")
          .css({color: "#FFF", "font-size": "11px", margin: 0});
        $("#rndc_nombre").after(ERROR);
        AplicaFoco("#rndc_nombre");
      } else {
        RemueveFoco("#rndc_nombre");
        $("#rndc_nombre + p").remove();
      }

      /* 5) Validar Primer apellido para los datos generales */
      if (!flag_primer_apellido) {
        // msg_error += "<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder crear el Proveedor.</p>";
        $("#primer_apellido + p").remove();
        const ERROR = $("<p></p>")
          .text("Debe diligenciar el campo primer apellido")
          .addClass("bg-danger text-center")
          .css({color: "#FFF", "font-size": "11px", margin: 0});
        $("#primer_apellido").after(ERROR);
      }

      if (!flag_abreviatura) {
        msg_error += msg_error_abreviatura;
      }

      if (!flag_telefono) {
        msg_error += msg_error_telefono;
      }

      /* 6) Validar la direccion de los datos genrales */
      if (!$("#direccion").val()) {
        // msg_error += "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder crear el Proveedor.</p>";
        $("#direccion + p").remove();
        const ERROR = $("<p></p>")
          .text("Debe diligenciar el campo Dirección")
          .addClass("bg-danger text-center")
          .css({color: "#FFF", "font-size": "11px", margin: 0});
        $("#direccion").after(ERROR);
        AplicaFoco("#direccion");
        if (!$("#di_tipovia").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Tipo de vía</strong> del generador de direcciones.</p>";
        }
      } else {
        //validar contra mascara
        RemueveFoco("#direccion");
        $("#direccion + p").remove();
      }

      /* 7) Debe tener un municipio seleccionado */
      if (!$("#id_municipio").val() && !$("#rndc_id_municipio").val()) {
        // msg_error += "<p>Debe seleccionar(Click) <strong>Municipio</strong> para poder crear el Proveedor.</p>";
        $("#municipio_tabla + p").remove();
        const ERROR = $("<p></p>")
          .text("Debe dar (Click) para seleccionar elegir el Municipio")
          .addClass("bg-danger text-center")
          .css({color: "#FFF", "font-size": "11px", margin: 0});
        $("#municipio_tabla").after(ERROR);
        // municipio_tabla
        AplicaFoco("#municipio");
        $("#municipio").val(" ");
      } else {
        RemueveFoco("#municipio");
        $("#municipio_tabla + p").remove();
      }
      /* 8) Debe diligenciar el municipio */
      if (!$("#municipio").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Municipio</strong> para poder crear el Proveedor.</p>";
        AplicaFoco("#municipio");
      } else {
        RemueveFoco("#municipio");
      }

      /* 9) Validar el celular de contacto para datos generales */
      if ($("#celular").val()) {
        var celula = $("#celular").val().toString().length;
        if (celula < 10) {
          msg_error += "<p>El campo <strong>Celular 1</strong> debe tener 10 dígitos para poder crear el Proveedor.</p>";
          $("#celular + p").remove();
          const ERROR = $("<p></p>").text("Campo Requerido").addClass("bg-danger text-center").css({color: "#FFF", "font-size": "11px", margin: 0});
          $("#celular").after(ERROR);
          AplicaFoco("#celular");
        } else if (celula > 10) {
          $("#celular + p").remove();
          const ERROR = $("<p></p>")
            .text("El campo debe tener maximo 10 caracteres.")
            .addClass("bg-danger text-center")
            .css({color: "#FFF", "font-size": "11px", margin: 0});
          $("#celular").after(ERROR);
          AplicaFoco("#celular");
        } else if (/^0+$/.test($("#celular").val())) {
          $("#celular + p").remove();
          const ERROR = $("<p></p>")
            .text("El campo no puede contener solo ceros.")
            .addClass("bg-danger text-center")
            .css({color: "#FFF", "font-size": "11px", margin: 0});
          $("#celular").after(ERROR);
          AplicaFoco("#celular");
        } else {
          $("#celular + p").remove();
          RemueveFoco("#celular");
        }
      }

      if ($("#celular2").val()) {
        var celula = $("#celular2").val().toString().length;
        if (celula < 10) {
          msg_error += "<p>El campo <strong>Celular 1</strong> debe tener 10 dígitos para poder crear el Proveedor.</p>";
          $("#celular2 + p").remove();
          const ERROR = $("<p></p>")
            .text("El campo debe tener minimo 10 caracteres.")
            .addClass("bg-danger text-center")
            .css({color: "#FFF", "font-size": "11px", margin: 0});
          $("#celular2").after(ERROR);
          AplicaFoco("#celular2");
        } else if (celula > 10) {
          $("#celular2 + p").remove();
          const ERROR = $("<p></p>")
            .text("El campo debe tener maximo 10 caracteres.")
            .addClass("bg-danger text-center")
            .css({color: "#FFF", "font-size": "11px", margin: 0});
          $("#celular2").after(ERROR);
          AplicaFoco("#celular2");
        } else if (/^0+$/.test($("#celular2").val())) {
          $("#celular2 + p").remove();
          const ERROR = $("<p></p>")
            .text("El campo no puede contener solo ceros.")
            .addClass("bg-danger text-center")
            .css({color: "#FFF", "font-size": "11px", margin: 0});
          $("#celular2").after(ERROR);
          AplicaFoco("#celular2");
        } else {
          $("#celular2 + p").remove();
          RemueveFoco("#celular2");
        }
      }

      // /* 10) Validar el documento de la cedula. */
      // var fileInput = $("#documentos")[0].files[0];
      // // Verifica si se ha seleccionado un archivo
      // if (!fileInput) {
      //   $("#documentos + p").remove();
      //   const ERROR = $("<p></p>")
      //     .text("Debe seleccionar un documento")
      //     .addClass("bg-danger text-center")
      //     .css({color: "#FFF", "font-size": "11px", margin: 0});
      //   $("#documentos").after(ERROR);
      //   AplicaFoco("#documentos");
      // } else {
      //   RemueveFoco("#documentos");
      //   $("#documentos + p").remove();
      // }

      // Fin - Se valida contenido del formulario
      if (!msg_error) {
        // var datos = null;
        $("#loading-overlay-nexosapp ").css("display", "flex"); // Mostrar mensaje de carga
        var datos = new FormData();
        datos.append("documentos", document.getElementById("documentos").files[0]);
        // var archivos = document.getElementById("documentos").files;
        // for (var x = 0; x < archivos.length; x++) {
        //   datos.append("documentos" + x, archivos[x]);
        // }
        if ($("#Conductor").is(":checked")) {
          //ARCHIVOS DEL CONDUCTOR
          //documento licencia
          // alert("hola mundo");
          datos.append("licencia", document.getElementById("licencia").files[0]);
          // var licencia = document.getElementById("licencia").files;
          // for (var i = 0; i < licencia.length; i++) {
          //   datos.append("licencia" + i, licencia[i]);
          // }

          //documento eps
          datos.append("docu_eps", document.getElementById("docu_eps").files[0]);
          // var documento_eps = document.getElementById("docu_eps").files;
          // for (var m = 0; m < documento_eps.length; m++) {
          //   datos.append("docu_eps" + x, documento_eps[m]);
          // }
          //documento arl
          /*	var documento_arl = document.getElementById('docu_arl').files;
					for (var g = 0; g < documento_arl.length; g++) {
						datos.append("docu_arl" + g, documento_arl[g]);
					} */

          //documento empresarial 1
          datos.append("documento_referencia1", document.getElementById("documento_referencia1").files[0]);
          // var documento_empre1 = document.getElementById("documento_referencia1").files;
          // for (var a = 0; a < documento_empre1.length; a++) {
          //   datos.append("documento_referencia1" + a, documento_empre1[a]);
          //   //alert('doc'+documento_empre1[a]);
          // }

          //documento empresarial 2
          datos.append("documento_referencia2", document.getElementById("documento_referencia2").files[0]);
          // var documento_empre2 = document.getElementById("documento_referencia2").files;
          // for (var b = 0; b < documento_empre2.length; b++) {
          //   datos.append("documento_referencia2" + b, documento_empre2[b]);
          // }

          //documento empresarial 3
          datos.append("documento_referencia3", document.getElementById("documento_referencia3").files[0]);
          // var documento_empre3 = document.getElementById("documento_referencia3").files;
          // for (var u = 0; u < documento_empre3.length; u++) {
          //   datos.append("documento_referencia3" + u, documento_empre3[u]);
          // }

          //documento personal 1
          datos.append("documento_personal1", document.getElementById("documento_personal1").files[0]);
          // var documento_perso1 = document.getElementById("documento_personal1").files;
          // for (var c = 0; c < documento_perso1.length; c++) {
          //   datos.append("documento_personal1" + c, documento_perso1[c]);
          // }

          //documento personal 2
          datos.append("documento_personal2", document.getElementById("documento_personal2").files[0]);
          // var documento_perso2 = document.getElementById("documento_personal2").files;
          // for (var d = 0; d < documento_perso2.length; d++) {
          //   datos.append("documento_personal2" + d, documento_perso2[d]);
          // }

          //carnet curso mercancias peligrosas
          datos.append("docu_curso", document.getElementById("docu_curso").files[0]);
          // var curso = document.getElementById("docu_curso").files;
          // for (var e = 0; e < curso.length; e++) {
          //   datos.append("docu_curso" + e, curso[e]);
          // }

          //rut
          datos.append("rut", document.getElementById("rut").files[0]);
          // var rut = document.getElementById("rut").files;
          // for (var s = 0; s < rut.length; s++) {
          //   datos.append("rut" + s, rut[s]);
          // }

          //fotos del conductor FRONTAL
          datos.append("foto_conductor", document.getElementById("foto_conductor").files[0]);
          // var foto_conductor = document.getElementById("foto_conductor").files;
          // for (var k = 0; k < foto_conductor.length; k++) {
          //   datos.append("foto_conductor" + k, foto_conductor[k]);
          // }
          //foto del conductor DERECHA
          datos.append("foto_derecha", document.getElementById("foto_derecha").files[0]);
          // var foto_cderecha = document.getElementById("foto_derecha").files;
          // for (var u = 0; u < foto_cderecha.length; u++) {
          //   datos.append("foto_derecha" + u, foto_cderecha[u]);
          // }

          //foto del conductor izquierda
          datos.append("foto_izquierda", document.getElementById("foto_izquierda").files[0]);
          // var foto_cizquierda = document.getElementById("foto_izquierda").files;
          // for (var v = 0; v < foto_cizquierda.length; v++) {
          //   datos.append("foto_izquierda" + v, foto_cizquierda[v]);
          // }

          //foto de del conductor indumentaria
          datos.append("foto_indume", document.getElementById("foto_indume").files[0]);
          // var foto_indumentaria = document.getElementById("foto_indume").files;
          // for (var n = 0; n < foto_indumentaria.length; n++) {
          //   datos.append("foto_indume" + n, foto_indumentaria[n]);
          // }

          //acuerdo uno
          datos.append("acuerdo_uno", document.getElementById("acuerdo_uno").files[0]);
          // var acuerdo1 = document.getElementById("acuerdo_uno").files;
          // for (var s = 0; s < acuerdo1.length; s++) {
          //   datos.append("acuerdo_uno" + s, acuerdo1[s]);
          // }
        }

        var name = $("#rndc_nombre").val();
        // datos.append("accion", "crearProveedor");
        datos.append("tipo_documento", $("#tipo_documento").val());
        datos.append("numero_documento", $("#numero_documento").val());
        datos.append("digito_verificacion", $("#digito_verificacion").val());
        datos.append("tipo_identificacion", $("#tipo_identificacion").val());
        datos.append("nombre", name);
        datos.append("abreviatura", $("#abreviatura").val());
        datos.append("contacto", $("#contacto").val());
        datos.append("celular", $("#celular").val());
        datos.append("direccion", $("#direccion").val());
        datos.append("email", $("#email").val());
        datos.append("municipio", $("#id_municipio").val());
        datos.append("estado", $("#estado").val());
        datos.append("Conductor", $("#Conductor").is(":checked"));
        datos.append("poseedor_vehiculo", $("#poseedor_vehiculo").is(":checked"));
        datos.append("propietario_vehiculo", $("#propietario_vehiculo").is(":checked"));
        datos.append("Proveedor", $("#Proveedor").is(":checked"));
        datos.append("rndc_nombre", $("#rndc_nombre").val());
        datos.append("rndc_id_municipio", $("#rndc_id_municipio").val());
        datos.append("sexo", $("#sexo").val());
        if ($("#tipo_documento").val() == "Cedula de Ciudadania" || $("#tipo_documento").val() == "Cedula de Extranjeria") {
          var apellido1 = $("#primer_apellido").val();
          var apellido2 = $("#segundo_apellido").val();
          datos.append("1apellido", apellido1);
          datos.append("2apellido", apellido2);
        }

        if ($("#poseedor_vehiculo").is(":checked") || $("#propietario_vehiculo").is(":checked")) {
          datos.append("actividad_econo", $("#acti_economica").val());
          datos.append("tributarias", $("#tributaria").val());
          datos.append("banco", $("#banco").val());
          datos.append("tipocuenta", $("#tipo_cuenta").val());
          datos.append("numerocuenta", $("#num_cuenta").val());
          document.getElementById("tbl_datos_financieros").style.display = "block";
        }

        if ($("#Conductor").is(":checked")) {
          // console.log("está seleccionada la opción conductor");
          datos.append("categoria_licencia", $("#categoria_licencia").val());
          datos.append("numero_licencia", $("#numero_licencia").val());
          datos.append("vencimiento_licencia", $("#vencimiento_licencia").val());
          if ($("#primer_apellido").val()) {
            datos.append("primer_apellido", $("#primer_apellido").val());
          }
          if ($("#segundo_apellido").val()) {
            datos.append("segundo_apellido", $("#segundo_apellido").val());
          }
          // alert('conductor datos');
          datos.append("celular2", $("#celular2").val());
          datos.append("name_eps", $("#name_eps").val());
          datos.append("vence_eps", $("#vence_eps").val());
          //datos.append("ultimo_eps", $("#ultimo_eps").val());
          //datos.append("name_arl", $("#name_arl").val());
          //datos.append("vence_arl", $("#vence_arl").val());
          //datos.append("ultimo_arl", $("#ultimo_arl").val());
          datos.append("nom_enti", $("#nom_enti").val());
          datos.append("vence_curso", $("#vence_curso").val());
          //referencias empresariales 1
          datos.append("referencias_empresariales1", $("#referencias_empresariales1").val());
          datos.append("fecha_referencia1", $("#fecha_referencia1").val());
          datos.append("fecha_retiro1", $("#fecha_retiro1").val());
          datos.append("contacto_ref1", $("#contacto_ref1").val());
          datos.append("celular_ref1", $("#celular_ref1").val());
          datos.append("cargo_ref1", $("#cargo_ref1").val());
          datos.append("anti_ref1", $("#anti_ref1").val());
          datos.append("idp1", $("#idp1").val());
          //referencias empresariales 2
          datos.append("referencias_empresariales2", $("#referencias_empresariales2").val());
          datos.append("fecha_referencia2", $("#fecha_referencia2").val());
          datos.append("fecha_retiro2", $("#fecha_retiro2").val());
          datos.append("contacto_ref2", $("#contacto_ref2").val());
          datos.append("celular_ref2", $("#celular_ref2").val());
          datos.append("cargo_ref2", $("#cargo_ref2").val());
          datos.append("anti_ref2", $("#anti_ref2").val());
          datos.append("idp2", $("#idp2").val());
          //referencias empresariales 3
          datos.append("referencias_empresariales3", $("#referencias_empresariales3").val());
          datos.append("fecha_referencia3", $("#fecha_referencia3").val());
          datos.append("fecha_retiro3", $("#fecha_retiro3").val());
          datos.append("contacto_ref3", $("#contacto_ref3").val());
          datos.append("celular_ref3", $("#celular_ref3").val());
          datos.append("cargo_ref3", $("#cargo_ref3").val());
          datos.append("anti_ref3", $("#anti_ref3").val());
          datos.append("idp3", $("#idp3").val());
          //referencias personales 1
          datos.append("referencias_personales", $("#referencias_personales1").val());
          datos.append("fecha_personal1", $("#fecha_personal1").val());
          datos.append("parenp1", $("#parenp1").val());
          datos.append("telefonop1", $("#telefonop1").val());
          //referencias personales 2
          datos.append("referencias_personales2", $("#referencias_personales2").val());
          datos.append("fecha_personal2", $("#fecha_personal2").val());
          datos.append("parenp2", $("#parenp2").val());
          datos.append("telefonop2", $("#telefonop2").val());
          //demás
          datos.append("sexo", $("#sexo").val());
          datos.append("fecha_nacimiento", $("#fecha_nacimiento").val());
          datos.append("sangre", $("#sangre").val());
          datos.append("fecha_ingreso", $("#fecha_ingreso").val());
          //NOMBRES DE LOS DOCUMENTOS
          datos.append("name_soporte", $("#name_soporte").val());
          datos.append("name_soporte2", $("#name_soporte2").val());
          datos.append("name_soporte3", $("#name_soporte3").val());
          datos.append("docu_personal1", $("#docu_personal1").val());
          datos.append("docu_personal2", $("#docu_personal2").val());
          datos.append("namedocu_eps", $("#namedocu_eps").val());
          datos.append("namedocu_curso", $("#namedocu_curso").val());
          datos.append("name_docurut", $("#name_docurut").val());
          datos.append("name_doculice", $("#name_doculice").val());
          datos.append("name_fontall", $("#name_fontall").val());
          datos.append("name_derecha", $("#name_derecha").val());
          datos.append("name_izquierda", $("#name_izquierda").val());
          datos.append("name_indum", $("#name_indum").val());
          //acuerdos
          datos.append("name_a1", $("#name_a1").val());
        }

        if ($("#Proveedor").is(":checked")) {
          datos.append("tipo_proveedor", $(".tipo_proveedor").val());
          datos.append("nacional", $("#nacional").is(":checked"));
          datos.append("internacional", $("#internacional").is(":checked"));
          datos.append("pv_localizacion", $("#pv_localizacion").val());
          datos.append("pv_zona", $("#pv_zona").val());
          datos.append("pv_tiposervice", $("#pv_tiposervice").val());
          datos.append("pv_via", $("#pv_via").val());
          datos.append("pv_select", $("#pv_select").val());
          datos.append("detalle_porteador", $("#detalle_porteador").val());
          datos.append("detalle_acarga", $("#detalle_acarga").val());
          datos.append("tramite_ad", $("#tramite_ad").val());
          datos.append("verifica", "");
          datos.append("una", 1);
        }
        var creacion_proveedor = false;
        try {
          const response = await fetch($("#id_url_ajax").val() + "proveedores/Crear_proveedor", {
            method: "POST",
            body: datos,
            cache: "no-cache",
          });
          const data = await response.json();

          if (data.numero === 200) {
            creacion_proveedor = true;
            if ($("#Proveedor").is(":checked")) {
              insertcontac();
            }
            //$("#input_service").val(1);
            var tablas_locales = data.mensaje;
            icon = "check";
            color = "success";
            pal = "Proceso terminado";
            //crear_Dato_Oet("true");
            // crear_Dato_Ministerio($creacion_proveedor);
            // $("#loading-overlay").css("display", "none");
            $("#crea_proveedores").animate({scrollTop: 0}, 600);
          } else if (data.numero === 400) {
            var tablas_locales = data.mensaje;
            icon = "close";
            color = "danger";
            pal = "Error";
            $("#input_service").val(0);
            var msg_error = data.error.replace(/\n/g, "</p><p>");
            // $("#loading-overlay").css("display", "none");
            $("#crea_proveedores").animate({scrollTop: 0}, 600);
          }
          $("#nexos_messages_popup2").html("");
          $("#nexos_messages_popup").append(
            '<div role="alert" class="alert alert-' +
              color +
              ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-' +
              icon +
              '"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
              pal +
              "!</strong>" +
              tablas_locales +
              "</div></div>",
          );
        } catch (error) {
          console.error("Error en la primera solicitud:", error);
          throw error;
        } finally {
          $("#loading-overlay-nexosapp ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
          crear_Dato_Ministerio(creacion_proveedor);
        }
      } else {
        // $("#loading-overlay").css("display", "flex");
        //alert('OH NOU'+msg_error);
        //$("#nexos_messages_popup2").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
        //$("#nexos_messages_popup").html('');
        $("#nexos_messages_popup").append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
            msg_error +
            "</div></div>",
        );
        $("#crea_proveedores").animate({scrollTop: 0}, 600);
      }
    } else {
    }
  });

  $("#btn_editar_proveedor").click(function () {
    editarProveedor();
  });

  $("#btn_editar_proveedornew").click(function () {
    editarProveedornew();
  });

  $("#btn_activar_proveedor").click(function () {
    activarProveedor();
  });

  $("#btn_inactivar_proveedor").click(function () {
    inactivarProveedor();
  });

  $("#e_numero_documento").blur(function () {
    $("#e_digito_verificacion").val(calcularDigitoVerificacion($("#e_numero_documento").val()));
  });

  cargarmunicipios();
  paisesinternacional();

  $("#tipo_documento").change(function () {
    if ($("#tipo_documento").val() == "NIT") {
      $("#tipo_identificacion").val("31");
    } else if ($("#tipo_documento").val() == "Cedula de Ciudadania") {
      $("#tipo_identificacion").val("13");
    } else if ($("#tipo_documento").val() == "Cedula de Extranjeria") {
      $("#tipo_identificacion").val("22");
    } else if ($("#tipo_documento").val() == "Identificacion Tributaria Internacional") {
      $("#tipo_identificacion").val("");
    }
  });

  $("#e_tipo_documento").change(function () {
    if ($("#e_tipo_documento").val() == "NIT") {
      $("#e_tipo_identificacion").val("31");
    } else if ($("#e_tipo_documento").val() == "Cedula de Ciudadania") {
      $("#e_tipo_identificacion").val("13");
    } else if ($("#e_tipo_documento").val() == "Cedula de Extranjeria") {
      $("#e_tipo_identificacion").val("22");
    }
  });

  //mostrar segun lo seleccionado
  $("#Conductor").change(function () {
    $("#datos_conductor").html("");
    if ($(this).is(":checked")) {
      /* Consultar datos desde el prefiltro */
      var datos = JSON.parse(sessionStorage.getItem("datos_valida"));
      if (datos.operacion === "Recurso Nuevo") {
        console.log("🚀 ~ datos.operacion:", datos.operacion);
        var consulta_datos = {
          dato: datos.conductor,
        };
        $.ajax({
          url: $("#id_url_ajax").val() + "proveedores/Consultar_datos_estudio",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            if (data) {
              $("#numero_documento").val(data.documento_conductor);
              $("#numero_documento").prop("disabled", true);
              var Nombre = Organizar_Nombres(data.name_conductor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 3) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 4) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                }
              } else {
                console.log("error");
              }
              // Referencia 1
              $("#referencias_empresariales1").val(data.empresa1);
              $("#referencias_empresariales1").prop("disabled", true);
              $("#fecha_referencia1").val(data.feca1);
              $("#fecha_referencia1").prop("disabled", true);
              $("#fecha_retiro1").val(data.feca2);
              $("#fecha_retiro1").prop("disabled", true);
              $("#contacto_ref1").val(data.persona1);
              $("#contacto_ref1").prop("disabled", true);
              $("#celular_ref1").val(data.cel1);
              $("#celular_ref1").prop("disabled", true);
              $("#cargo_ref1").val(data.cargo1);
              $("#cargo_ref1").prop("disabled", true);
              $("#anti_ref1").val(data.antiguedad1);
              $("#anti_ref1").prop("disabled", true);
              // Referencia 2
              $("#referencias_empresariales2").val(data.empresa2);
              $("#referencias_empresariales2").prop("disabled", true);
              $("#fecha_referencia2").val(data.fecb1);
              $("#fecha_referencia2").prop("disabled", true);
              $("#fecha_retiro2").val(data.fecb2);
              $("#fecha_retiro2").prop("disabled", true);
              $("#contacto_ref2").val(data.persona2);
              $("#contacto_ref2").prop("disabled", true);
              $("#celular_ref2").val(data.cel2);
              $("#celular_ref2").prop("disabled", true);
              $("#cargo_ref2").val(data.cargo2);
              $("#cargo_ref2").prop("disabled", true);
              $("#anti_ref2").val(data.antiguedad2);
              $("#anti_ref2").prop("disabled", true);
              // Referencia 3
              $("#referencias_empresariales3").val(data.empresa3);
              $("#referencias_empresariales3").prop("disabled", true);
              $("#fecha_referencia3").val(data.fecc1);
              $("#fecha_referencia3").prop("disabled", true);
              $("#fecha_retiro3").val(data.fecc2);
              $("#fecha_retiro3").prop("disabled", true);
              $("#contacto_ref3").val(data.persona3);
              $("#contacto_ref3").prop("disabled", true);
              $("#celular_ref3").val(data.cel3);
              $("#celular_ref3").prop("disabled", true);
              $("#cargo_ref3").val(data.cargo3);
              $("#cargo_ref3").prop("disabled", true);
              $("#anti_ref3").val(data.antiguedad3);
              $("#anti_ref3").prop("disabled", true);
              $("#datos_conductor").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Catergoría Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <select id="categoria_licencia" style="width: 100%;">
                          <option value="" disabled selected>Seleccione</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                          <option value="C3">C3</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Número de Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input type="text" id="numero_licencia" placeholder="Número de Licencia" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha vencimiento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input  type="date" value="" id="vencimiento_licencia" style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha Nacimiento:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <input type="date" id="fecha_nacimiento" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Grupo sanguineo: (*)</label></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <select style="width: 100%;" id="sangre">
                          <option value="">Seleccione</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Rut</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                          <input type="file" name="file-2" id="rut" onchange="Rut(this.value)" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Nombre Documento Rut:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        <input type="text" style="width:100%;" id="name_docurut" disabled="disabled">
                      </td>
                        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Documento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                        <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;"> <!--accept=".pdf"-->
                          <!--<input type="file" name="file-2" id="licencia" onchange="lice(this.value)"  data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">-->
                          <input type="file" name="file-2" id="licencia" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">
                        </td>
                        <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          Nombre Documento Licencia</th>
                        <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          <input type="text" style="width:100%;" id="name_doculice" disabled="disabled">
                        </td>
                      <input type="hidden" id="fecha_ingreso" class="form-control input-sm">
                    </tr>
                  </thead>
                </table>
              `);
            } else {
              console.log("Error al traer los datos");
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      } else if (datos.operacion === "Prefiltro Nuevo") {
        var consulta_datos = {
          dato: datos.conductor,
        };
        $.ajax({
          url: $("#id_url_ajax").val() + "proveedores/Consultar_Datos",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            if (data) {
              $("#numero_documento").val(data.datos.documento_conductor);
              $("#numero_documento").prop("disabled", true);
              // Separar el nombre completo en palabras
              var Nombre = Organizar_Nombres(data.datos.nombre_conductor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 3) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 4) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                }
              } else {
                console.log("error");
              }
              // Referencia 1
              $("#referencias_empresariales1").val(data.referencias[0].nombre_empresa);
              $("#referencias_empresariales1").prop("disabled", true);
              $("#fecha_referencia1").val(data.referencias[0].fecha_ingreso);
              $("#fecha_referencia1").prop("disabled", true);
              $("#fecha_retiro1").val(data.referencias[0].fecha_retiro);
              $("#fecha_retiro1").prop("disabled", true);
              $("#contacto_ref1").val(data.referencias[0].persona_contacto);
              $("#contacto_ref1").prop("disabled", true);
              $("#celular_ref1").val(data.referencias[0].celular);
              $("#celular_ref1").prop("disabled", true);
              $("#cargo_ref1").val(data.referencias[0].cargo);
              $("#cargo_ref1").prop("disabled", true);
              $("#anti_ref1").val(data.referencias[0].antiguedad);
              $("#anti_ref1").prop("disabled", true);
              // Referencia 2
              $("#referencias_empresariales2").val(data.referencias[1].nombre_empresa);
              $("#referencias_empresariales2").prop("disabled", true);
              $("#fecha_referencia2").val(data.referencias[1].fecha_ingreso);
              $("#fecha_referencia2").prop("disabled", true);
              $("#fecha_retiro2").val(data.referencias[1].fecha_retiro);
              $("#fecha_retiro2").prop("disabled", true);
              $("#contacto_ref2").val(data.referencias[1].persona_contacto);
              $("#contacto_ref2").prop("disabled", true);
              $("#celular_ref2").val(data.referencias[1].celular);
              $("#celular_ref2").prop("disabled", true);
              $("#cargo_ref2").val(data.referencias[1].cargo);
              $("#cargo_ref2").prop("disabled", true);
              $("#anti_ref2").val(data.referencias[1].antiguedad);
              $("#anti_ref2").prop("disabled", true);
              // Referencia 3
              $("#referencias_empresariales3").val(data.referencias[2].nombre_empresa);
              $("#referencias_empresariales3").prop("disabled", true);
              $("#fecha_referencia3").val(data.referencias[2].fecha_ingreso);
              $("#fecha_referencia3").prop("disabled", true);
              $("#fecha_retiro3").val(data.referencias[2].fecha_retiro);
              $("#fecha_retiro3").prop("disabled", true);
              $("#contacto_ref3").val(data.referencias[2].persona_contacto);
              $("#contacto_ref3").prop("disabled", true);
              $("#celular_ref3").val(data.referencias[2].celular);
              $("#celular_ref3").prop("disabled", true);
              $("#cargo_ref3").val(data.referencias[2].cargo);
              $("#cargo_ref3").prop("disabled", true);
              $("#anti_ref3").val(data.referencias[2].antiguedad);
              $("#anti_ref3").prop("disabled", true);
              $("#datos_conductor").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Catergoría Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <select id="categoria_licencia" style="width: 100%;">
                          <option value="" disabled selected>Seleccione</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                          <option value="C3">C3</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Número de Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input type="text" id="numero_licencia" placeholder="Número de Licencia" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha vencimiento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input  type="date" value="" id="vencimiento_licencia" style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha Nacimiento:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <input type="date" id="fecha_nacimiento" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Grupo sanguineo: (*)</label></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <select style="width: 100%;" id="sangre">
                          <option value="">Seleccione</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Rut</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                          <input type="file" name="file-2" id="rut" onchange="Rut(this.value)" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Nombre Documento Rut:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        <input type="text" style="width:100%;" id="name_docurut" disabled="disabled">
                      </td>
                        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Documento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                        <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;"> <!--accept=".pdf"-->
                          <!--<input type="file" name="file-2" id="licencia" onchange="lice(this.value)"  data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">-->
                          <input type="file" name="file-2" id="licencia" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">
                        </td>
                        <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          Nombre Documento Licencia</th>
                        <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          <input type="text" style="width:100%;" id="name_doculice" disabled="disabled">
                        </td>
                      <input type="hidden" id="fecha_ingreso" class="form-control input-sm">
                    </tr>
                  </thead>
                </table>
              `);
            } else {
              $("#datos_conductor").html(`
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
                <thead>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Catergoría Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <select id="categoria_licencia" style="width: 100%;">
                          <option value="" disabled selected>Seleccione</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="C1">C1</option>
                          <option value="C2">C2</option>
                          <option value="C3">C3</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Número de Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input type="text" id="numero_licencia" placeholder="Número de Licencia" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha vencimiento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <input  type="date" value="" id="vencimiento_licencia" style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Fecha Nacimiento:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                        <input type="date" id="fecha_nacimiento" style="width: 100%;">
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Grupo sanguineo: (*)</label></th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                        <select style="width: 100%;" id="sangre">
                          <option value="">Seleccione</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </td>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">Documento Rut</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap; ">
                          <input type="file" name="file-2" id="rut" onchange="Rut(this.value)" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;">
                      </td>
                    </tr>
                    <tr>
                      <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Nombre Documento Rut:</th>
                      <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        <input type="text" style="width:100%;" id="name_docurut" disabled="disabled">
                      </td>
                        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                        Documento Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></th>
                        <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;"> <!--accept=".pdf"-->
                          <!--<input type="file" name="file-2" id="licencia" onchange="lice(this.value)"  data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">-->
                          <input type="file" name="file-2" id="licencia" data-multiple-caption="{count} archivos seleccionados" multiple style="width: 100%;" onchange="validarExtension(this.value);">
                        </td>
                        <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          Nombre Documento Licencia</th>
                        <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                          <input type="text" style="width:100%;" id="name_doculice" disabled="disabled">
                        </td>
                      <input type="hidden" id="fecha_ingreso" class="form-control input-sm">
                    </tr>
                  </thead>
                </table>
           `);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
      }

      $(".titulogeneral").show();
      $("#datos_generalest").show();
      $(".Datosespecificos").show();
      $("#datos_onlyconductor").show();
      $("#datos_financieros").hide();
      document.getElementById("tbl_datos_conductor").style.display = "block";
      document.getElementById("tbl_datos_especificos").style.display = "block";
      document.getElementById("tbl_datos_generales").style.display = "block";
    } else {
      $(".titulogeneral").hide();
      $("#datos_generalest").hide();
      $(".Datosespecificos").hide();
      $("#datos_onlyconductor").hide();
      $("#datos_proveedor").hide();
      $("#datos_financieros").hide();
      document.getElementById("tbl_datos_conductor").style.display = "none";
      document.getElementById("tbl_datos_especificos").style.display = "none";
      if ($("#poseedor_vehiculo").is(":checked") || $("#propietario_vehiculo").is(":checked")) {
        document.getElementById("tbl_datos_generales").style.display = "block";
      } else {
        document.getElementById("tbl_datos_generales").style.display = "none";
      }
    }
  });

  $("#poseedor_vehiculo").change(function () {
    if ($(this).is(":checked")) {
      /* Consultar datos desde el prefiltro */
      var datos = JSON.parse(sessionStorage.getItem("datos_valida"));
      if (datos.operacion === "Recurso Nuevo") {
        console.log("🚀 ~ datos.operacion:", datos.operacion);
        var consulta_datos = {
          dato: datos.poseedor,
        };
        $.ajax({
          url: $("#id_url_ajax").val() + "proveedores/Consultar_datos_estudio",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            if (data) {
              $("#numero_documento").val(data.documento_conductor);
              $("#numero_documento").prop("disabled", true);
              var Nombre = Organizar_Nombres(data.name_conductor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 3) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 4) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                }
              } else {
                console.log("error");
              }
            } else {
              console.log("Error al traer los datos");
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });

        var consulta_datos = {
          action: "Consulta_Datos_Financieros",
        };
        $.ajax({
          url: $("#id_url_ajax").val() + "libs/hojas_de_vida_ajax.php",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            $("#banco").html('<option value="">Seleccione</option>');
            $("#tributaria").val();
            $("#acti_economica").val();
            if (data.result) {
              data.result.forEach(function (element, index) {
                $("#banco").append('<option value="' + element.id + '">' + element.abreviatura + "</option>");
              });
            }
            if (data.result2) {
              data.result2.forEach(function (element, index) {
                $("#tributaria").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
            if (data.result3) {
              data.result3.forEach(function (element, index) {
                $("#acti_economica").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });

        $("#datos_financieros").html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      } else if (datos.operacion === "Prefiltro Nuevo") {
        var consulta_datos = {
          action: "Consulta_Datos_Financieros",
        };
        $.ajax({
          url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            $("#banco").html('<option value="">Seleccione</option>');
            $("#tributaria").val();
            $("#acti_economica").val();
            if (data.result) {
              data.result.forEach(function (element, index) {
                $("#banco").append('<option value="' + element.id + '">' + element.abreviatura + "</option>");
              });
            }
            if (data.result2) {
              data.result2.forEach(function (element, index) {
                $("#tributaria").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
            if (data.result3) {
              data.result3.forEach(function (element, index) {
                $("#acti_economica").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $("#datos_financieros").html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      }

      // $("#datos_financieros").html(`
      // 	<div class="row">
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Actividad económica CIIU</label>
      // 			<select id="acti_economica" class="select2">
      // 				<option value="">Seleccione</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Obligaciones tributarias</label>
      // 			<select id="tributaria" class="form-control input-sm">
      // 				<option value="">Seleccione</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Banco</label>
      // 			<select id="banco" class="form-control input-sm">
      // 				<option value="">Seleccione</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Tipo de Cuenta</label>
      // 			<select id="tipo_cuenta" class="form-control input-sm">
      // 				<option value="">Seleccione</option>
      // 				<option value="1">Cuenta de Ahorros</option>
      // 				<option value="2">Cuenta Corriente</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Número de Cuenta</label>
      // 			<input type="number" id="num_cuenta" class="form-control input-sm">
      // 		</div>
      // 	</div>
      // 	<script type="text/javascript">
      // 		$(document).ready(function(){
      // 			App.wizard();
      // 		});
      // 		$(document).ready(function(){
      // 			App.init();
      // 			//App.formElements();
      // 		});
      // </script>`);
      $(".titulogeneral").show();
      $("#datos_generalest").show();
      $("datos_conductor").hide();
      $("#datos_proveedor").hide();
      $("#datos_contacto").hide();
      $("#datos_financieros").show();
      document.getElementById("tbl_datos_financieros").style.display = "block";
      document.getElementById("tbl_datos_generales").style.display = "block";
    } else {
      $(".titulogeneral").hide();
      $("#datos_generalest").hide();
      $("datos_conductor").hide();
      $("#datos_proveedor").hide();
      $("#datos_contacto").hide();
      $("#datos_financieros").hide();
      document.getElementById("tbl_datos_financieros").style.display = "none";
      document.getElementById("tbl_datos_generales").style.display = "none";
    }
  });

  $("#propietario_vehiculo").change(function () {
    if ($(this).is(":checked")) {
      var datos = JSON.parse(sessionStorage.getItem("datos_valida"));
      if (datos.operacion === "Recurso Nuevo") {
        console.log("🚀 ~ datos.operacion:", datos.operacion);
        var consulta_datos = {
          dato: datos.propietario,
        };
        $.ajax({
          url: $("#id_url_ajax").val() + "proveedores/Consultar_datos_estudio",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            if (data) {
              $("#numero_documento").val(data.documento_conductor);
              $("#numero_documento").prop("disabled", true);
              var Nombre = Organizar_Nombres(data.name_conductor);
              if (Nombre !== false) {
                if (Nombre.logitud === 2) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 3) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                } else if (Nombre.logitud === 4) {
                  $("#rndc_nombre").val(Nombre.nombres);
                  $("#primer_apellido").val(Nombre.apellido);
                  $("#segundo_apellido").val(Nombre.apellido2);
                  $("#rndc_nombre").prop("disabled", true);
                  $("#primer_apellido").prop("disabled", true);
                  $("#segundo_apellido").prop("disabled", true);
                }
              } else {
                console.log("error");
              }
            } else {
              console.log("Error al traer los datos");
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        var consulta_datos = {
          action: "Consulta_Datos_Financieros",
        };
        $.ajax({
          url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            $("#banco").html("");
            $("#tributaria").val();
            $("#acti_economica").val();
            if (data.result) {
              data.result.forEach(function (element, index) {
                $("#banco").append('<option value="' + element.id + '">' + element.abreviatura + "</option>");
              });
            }
            if (data.result2) {
              data.result2.forEach(function (element, index) {
                $("#tributaria").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
            if (data.result3) {
              data.result3.forEach(function (element, index) {
                $("#acti_economica").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $("#datos_financieros").html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      } else if (datos.operacion === "Prefiltro Nuevo") {
        var consulta_datos = {
          action: "Consulta_Datos_Financieros",
        };
        $.ajax({
          url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
          type: "POST",
          data: consulta_datos,
          dataType: "json",
          success: function (data) {
            $("#banco").html("");
            $("#tributaria").val();
            $("#acti_economica").val();
            if (data.result) {
              data.result.forEach(function (element, index) {
                $("#banco").append('<option value="' + element.id + '">' + element.abreviatura + "</option>");
              });
            }
            if (data.result2) {
              data.result2.forEach(function (element, index) {
                $("#tributaria").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
            if (data.result3) {
              data.result3.forEach(function (element, index) {
                $("#acti_economica").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
              });
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.log("no trajo datos");
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
          },
        });
        $("#datos_financieros").html(`
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Actividad económica CIIU</th>
                <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                  <select id="acti_economica" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
          </thead>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%; border-collapse: collapse;">
          <thead>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Obligaciones tributarias:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tributaria" class="select2" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Banco:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="banco" style="width: 100%;">
                    <option value="">Seleccione</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th style="background-color: #F5F5F5; width: 250px; font-weight: bold; font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  Tipo de Cuenta:</th>
                <td style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                  <select id="tipo_cuenta" style="width: 100%;">
                    <option value="">Seleccione</option>
                    <option value="1">Cuenta de Ahorros</option>
                    <option value="2">Cuenta Corriente</option>
                  </select>	
                </td>
                  <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
                    Número de Cuenta:</th>
                  <td style="border: 1px solid #ddd; padding: 1px; padding: 1px 1px 1px; width: auto; white-space: nowrap;">
                    <input type="number" id="num_cuenta" style="width: 100%;">
                  </td>
              </tr>
            </thead>
          </table>`);
      }

      // $("#datos_financieros").html(`
      // 	<div class="row">
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Actividad económica CIIU</label>
      // 			<select id="acti_economica" class="form-control input-sm">
      // 				<option value="">Seleccione</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Obligaciones tributarias</label>
      // 			<select id="tributaria" class="form-control input-sm">
      // 				<option value="">Seleccione</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Banco</label>
      // 			<select id="banco" class="form-control input-sm">
      // 				<option value="">Seleccione</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Tipo de Cuenta</label>
      // 			<select id="tipo_cuenta" class="form-control input-sm">
      // 				<option value="">Seleccione</option>
      // 				<option value="1">Cuenta de Ahorros</option>
      // 				<option value="2">Cuenta Corriente</option>
      // 			</select>
      // 		</div>
      // 		<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
      // 			<label>Número de Cuenta</label>
      // 			<input type="number" id="num_cuenta" class="form-control input-sm">
      // 		</div>
      // 	</div>
      // 	<script type="text/javascript">
      // 		$(document).ready(function(){
      // 			App.wizard();
      // 		});
      // 		$(document).ready(function(){
      // 			App.init();
      // 			App.formElements();
      // 		});
      // 	</script>`);
      $(".titulogeneral").show();
      $("#datos_generalest").show();
      $("datos_conductor").hide();
      $("#datos_proveedor").hide();
      $("#datos_contacto").hide();
      $("#datos_financieros").show();
      document.getElementById("tbl_datos_financieros").style.display = "block";
      document.getElementById("tbl_datos_generales").style.display = "block";
    } else {
      $(".titulogeneral").hide();
      $("#datos_generalest").hide();
      $("datos_conductor").hide();
      $("#datos_proveedor").hide();
      $("#datos_contacto").hide();
      $("#datos_financieros").hide();
      document.getElementById("tbl_datos_financieros").style.display = "none";
      document.getElementById("tbl_datos_generales").style.display = "none";
    }
  });

  $("#Proveedor").change(function () {
    if ($(this).is(":checked")) {
      $(".titulogeneral").show();
      $("#datos_generalest").show();
      $("#datos_proveedor").show();
      $("#datos_contacto").show();
      $("datos_conductor").hide();
      document.getElementById("tbl_detalle_proveedor").style.display = "block";
      document.getElementById("tbl_contactos").style.display = "block";
      document.getElementById("tbl_datos_generales").style.display = "block";
    } else {
      $(".titulogeneral").hide();
      $("#datos_generalest").hide();
      $("#datos_proveedor").hide();
      $("#datos_contacto").hide();
      $("datos_conductor").hide();
      document.getElementById("tbl_detalle_proveedor").style.display = "none";
      document.getElementById("tbl_contactos").style.display = "none";
      document.getElementById("tbl_datos_generales").style.display = "none";
    }
  });
  //final del seleccionado

  //PROVEEDORES INTERNACIONAL
  $("#agregar_fila").click(function () {
    agregar_contacto();
  });

  $("#agregar_filam").click(function () {
    agregar_contactom();
  });

  $("#pv_localizacion").change(function () {
    var local = $("#pv_localizacion").val();
    if (local == "") {
      $("#pv_zona").val("");
      $(".zona").hide();
    } else {
      $(".zona").show();
    }
  });

  $("#pv_tiposervice").change(function () {
    //limpiar los campos de cada tipo de servicio
    var tipo_service = $("#pv_tiposervice").val();
    if (tipo_service == "") {
      $("#pv_via").html("");
      $("#pv_select").html("");
      $("#detalle_porteador").val("");
      $("#detalle_acarga").html("");
      $("#tramite_ad").html("");
      $("#titulo_tservice").html("");
      $("#Transporte").hide();
      $("#porteadores").hide();
      $("#agencia_carga").hide();
      $("#tramite_admin").hide();
    } else {
      $("#tipos_servicios").show();
      if (tipo_service == "Transporte") {
        //limpiar campos que no pertenecen a este tipo
        $("#detalle_porteador").val("");
        $("#detalle_acarga").val("");
        $("#tramite_ad").val("");
        //segun
        $("#titulo_tservice").html("TIPO SERVICIO: Transporte");
        $("#Transporte").show();
        $("#porteadores").hide();
        $("#agencia_carga").hide();
        $("#tramite_admin").hide();
      }

      if (tipo_service == "Porteadores") {
        //limpiar campos
        $("#pv_via").val("");
        $("#pv_select").html("");
        $("#detalle_acarga").val("");
        $("#tramite_ad").val("");
        //
        $("#titulo_tservice").html("TIPO SERVICIO: Porteadores");
        $("#Transporte").hide();
        $("#porteadores").show();
        $("#agencia_carga").hide();
        $("#tramite_admin").hide();
      }

      if (tipo_service == "Agenciamiento de carga") {
        //limpiar campos
        $("#pv_via").val("");
        $("#pv_select").html("");
        $("#detalle_porteador").val("");
        $("#tramite_ad").val("");
        //
        $("#titulo_tservice").html("TIPO SERVICIO: Agenciamiento de carga");
        $("#Transporte").hide();
        $("#porteadores").hide();
        $("#tramite_admin").hide();
        $("#agencia_carga").show();
      }

      if (tipo_service == "Tramites administrativos") {
        //limpiar campos
        $("#pv_via").val("");
        $("#pv_select").html("");
        $("#detalle_porteador").val("");
        $("#detalle_acarga").val("");
        //
        $("#titulo_tservice").html("TIPO SERVICIO: Trámites Administrativos");
        $("#tramite_admin").show();
        $("#Transporte").hide();
        $("#porteadores").hide();
        $("#agencia_carga").hide();
      }

      if (tipo_service == "Adecuaciones" || tipo_service == "Aduana" || tipo_service == "Impuestos" || tipo_service == "Tramites operativos") {
        //limpiar campos
        $("#pv_via").val("");
        $("#pv_select").html("");
        $("#detalle_porteador").val("");
        $("#detalle_acarga").val("");
        $("#tramite_ad").val("");
        //
        $("#titulo_tservice").html("");
        $("#tramite_admin").hide();
        $("#Transporte").hide();
        $("#porteadores").hide();
        $("#agencia_carga").hide();
      }
    }
  });

  $("#pv_via").change(function () {
    $("#pv_select").html("");
    var via = $("#pv_via").val();
    if (via == "") {
      $("#pv_select").html("");
    }

    if (via == "Aerea") {
      $("#pv_select").html(
        '<option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>' +
          '<option value="Courier Internacional">Courier Internacional</option>' +
          '<option value="Agentes aereos">Agentes aereos</option>' +
          '<option value="Aereos nacional">Aereos nacional</option>',
      );
    }

    if (via == "Maritima") {
      $("#pv_select").html('<option value="Navieras">Navieras</option>' + '<option value="Agentes maritimos">Agentes maritimos</option>');
    }

    if (via == "Terrestre") {
      $("#pv_select").html(
        '<option value="Transportadores terrestres">Transportadores terrestres</option>' +
          '<option value="Nacionales">Nacionales</option>' +
          '<option value="Transportadores urbanos">Transportadores urbanos</option>',
      );
    }
  });

  function paisesinternacional() {
    var paises = {
      action: "localizacion_operacional",
    };
    $("#pv_localizacion").html('<option value="">Seleccione(Municipio-Depto-País)</option>');
    $.ajax({
      url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
      type: "POST",
      data: paises,
      dataType: "json",
      success: function (data) {
        data.result.forEach(function (element, index) {
          $("#pv_localizacion").append(
            '<option value="' + element.id + '">' + element.municipio + "  -  " + element.depto + "  -  " + element.pais + "</option>",
          );
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("no trajo paises localizacion operacional");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  }

  $(document).on("click", ".borrar2", function (event) {
    event.preventDefault();
    $(this).closest("tr").remove();
    var v = this.id;
    //alert('v'+v);
    var x = v.substr(1, 1);
    x = parseInt(x);
    //$("#sk"+x).val();
    var d = $("#sk" + x).val();
    /*$("#tipohoja"+x).val(0);
		x2=$("#tipohoja"+x).val();
		$("#clase"+x).val(0);
		x3=$("#clase"+x).val();
		$("#ruta"+x).val(0);
		x4=$("#ruta"+x).val();
		$("#documento"+x).val(0);
		x5=$("#documento"+x).val();
		$("#namearchivo"+x).val(0);
		x6=$("#namearchivo"+x).val();

		alert('Xdos'+x2);
		alert('Xtres'+x3);*/
  });

  var a = 0;
  var b = 0;
  function agregar_contacto() {
    a++;
    b = b + 1;
    var ch = '<input type="button" id="p' + a + '" class="btn-primary borrar2" value="Eliminar">';
    var contace = `
      <tr>
        <th style="background-color: #54B4D3; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;color:#ffffff;" colspan="6">
          Contacto N°${a}
        </th>
        <input type="hidden" id="sk${a}" value="1" class="form-control input-sm">
      </tr>
      <tr>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" >
          Nombres:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;" colspan="6">
          <input type="text" id="nombres${a}" style="width:100%;">
        </td>
      </tr>
      <tr>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Cargo:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="text" id="cargo${a}" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Teléfono:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="text" id="fijo${a}" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Celular:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="text" id="celular${a}" style="width:100%;">
        </td>
      </tr>
      <tr>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
        Correo:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <input type="email" id="correo${a}" style="width:100%;">
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Info. crítica:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <textarea id="critica${a}" style="width:100%;" rows="1"></textarea>
        </td>
        <th style="background-color: #F5F5F5; width: 150px; font-weight: bold;font-size: 12px; border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          Referencia:</th>
        <td class="text-right" style="border: 1px solid #ddd; padding: 1px; width: auto; white-space: nowrap;">
          <textarea id="refe${a}" style="width:100%;" rows="1"></textarea>
        </td>
      </tr>
    `;

    // var contace =
    //   "<tr>" +
    //   '<td colspan="2" class="info"><label>N°</label><p class="text-center text-primary"><strong>' +
    //   a +
    //   '</strong></p><input type="hidden" id="sk' +
    //   a +
    //   '" value="1" class="form-control input-sm">  </td>' +
    //   "</tr><tr>" +
    //   '<td colspan="2"><label>Nombres</label> <input type="text" id="nombres' +
    //   a +
    //   '" class="form-control input-sm"></td>' +
    //   "</tr><tr>" +
    //   '<td><label>Cargo</label> <input type="text" id="cargo' +
    //   a +
    //   '" class="form-control input-xs"></td>' +
    //   '<td><label>Teléfono</label> <input type="number" id="fijo' +
    //   a +
    //   '" class="form-control input-xs"></td>' +
    //   "<tr>" +
    //   '<td><label>Celular</label> <input type="number" id="celular' +
    //   a +
    //   '" class="form-control input-xs">  </td>' +
    //   '<td><label>Correo</label>   <input type="email" id="correo' +
    //   a +
    //   '" class="form-control input-xs" > </td>' +
    //   "</tr>" +
    //   "<tr>" +
    //   '<td><label>Info. crítica</label> <textarea id="critica' +
    //   a +
    //   '" class="form-control input-xs"></textarea>   </td>' +
    //   '<td><label>Referencia</label> <textarea id="refe' +
    //   a +
    //   '" class="form-control input-xs"></textarea>  </td>' +
    //   "</tr>" +
    //   "</tr>";

    $("#tabla_contacte").append(contace);
    $("#cont_contactos").val(b);
  }

  // Funcion de formulario para conductores - editar
  $("#e_Conductor").change(function () {
    $("#e_datos_conductor").html("");
    if ($(this).is(":checked")) {
      $("#e_datos_conductor").html(`
				<div class="form-group  col-xs-12 col-sm-4 col-md-3">
					<label>Catergoría Licencia:</label>
					<select id="e_categoria_licencia" class="form-control input-sm">
						<option value="" disabled selected>Seleccione</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="C1">C1</option>
						<option value="C2">C2</option>
						<option value="C3">C3</option>
					</select>
					<label id="error_e_categoria_licencia"></label>
				</div>
				<div class="form-group col-xs-12 col-sm-4 col-md-6">
					<label>Número de Licencia:</label>
					<input type="text" id="e_numero_licencia" placeholder="Número de Licencia" class="form-control input-sm">
					<label id="error_e_numero_licencia"></label>
				</div>
				<div class="form-group col-xs-12 col-sm-4 col-md-3">
					<label>Vencimiento Licencia:</label>
					<div data-min-view="2" data-start-view="4" data-date-format="dd/mm/yyyy" data-link-field="dtp_input1" class="input-group date datetimepicker">
						<input size="16" type="text" value="" id="e_vencimiento_licencia" class="form-control input-sm" readonly=”readonly”>
						<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
					</div>
					<label id="error_e_vencimiento_licencia"></label>
				</div>
				
				<script type="text/javascript">
					$(document).ready(function(){
						App.wizard();
					});
					$(document).ready(function(){
						App.init();
						App.formElements();
					});
				</script>
			`);
    }
  });

  // Función de ajuste de nombre del proveedor dependiendo el tipo de documento
  $("#tipo_documento").change(function () {
    // Se filtran las validaciones de los campos contacto y celular dependiendo el tipo de documento seleccionado
    $("#contacto").removeAttr("maxlength");
    $("#celular").removeAttr("maxlength");

    if ($("#tipo_documento").val() != "Identificacion Tributaria Internacional" || $("#tipo_documento").val() != "NIT") {
      $("#abreviatura").val("");
      $("#abreviatura").attr("disabled", true);
    }

    if ($("#tipo_documento").val() != "Identificacion Tributaria Internacional") {
      $("#contacto").val("");
      $("#contacto").attr("maxlength", "7");
      $("#celular").val("");
      $("#celular").attr("maxlength", "10");
    }
    // Se filtra la gestión de los campos dependiendo el tipo de documento seleccionado
    $("#primer_apellido").attr("disabled", false);
    $("#segundo_apellido").attr("disabled", false);
    if ($("#tipo_documento").val() == "NIT" || $("#tipo_documento").val() == "Identificacion Tributaria Internacional") {
      $("#primer_apellido").val("");
      $("#segundo_apellido").val("");
      $("#abreviatura").val("");
      $("#primer_apellido").attr("disabled", true);
      $("#segundo_apellido").attr("disabled", true);
      $("#abreviatura").attr("disabled", false);
    }
    //llenaNombreProveedor("nombre", "rndc_nombre", "primer_apellido", "segundo_apellido");
  });

  //Agregar datos bancarios a tabla proveedor - poseedor
  var cont_finan = 0;
  $("#adicione_cuenta").click(function () {
    cont_finan++;
    var buscar_datos = {
      action: "Consulta_Datos_Financieros",
    };
    $.ajax({
      url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
      type: "POST",
      data: buscar_datos,
      dataType: "json",
      success: function (data) {
        if (data.result != null) {
          //bancos
          $("#bank" + cont_finan + "").html('<option value="">Seleccione</option>');
          data.result.forEach(function (element, index) {
            $("#bank" + cont_finan + "").append('<option value="' + element.id + '">' + element.abreviatura + "</option>");
          });
        }
        if (data.result2 != null) {
          $("#tributaria" + cont_finan + "").html('<option value="">Seleccione</option>');
          data.result2.forEach(function (element, index) {
            $("#tributaria" + cont_finan + "").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
          });
        }
        if (data.result3 != null) {
          $("#ciuu" + cont_finan + "").html('<option value="">Seleccione</option>');
          data.result3.forEach(function (element, index) {
            $("#ciuu" + cont_finan + "").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("no datos bancarios");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
    var tipo_cuenta =
      '<option value="">Seleccione</option>' + '<option value="1">Cuenta Ahorros</option>' + '<option value="2">Cuenta corriente</option>';
    var mg =
      '<input type="button" id="r' +
      cont_finan +
      '" class="btn-primary ps' +
      cont_finan +
      '" value="Eliminar" onclick="delete_cuenta(' +
      cont_finan +
      ')">';

    var tabla =
      "<tr class='col" +
      cont_finan +
      "'>" +
      "<td class='col" +
      cont_finan +
      "'>" +
      mg +
      "</td>" +
      "<td col" +
      cont_finan +
      "><select id='ciuu" +
      cont_finan +
      "' class='form-control input-sm rciuu'></select> </td>" +
      "<td col" +
      cont_finan +
      "><select id='tributaria" +
      cont_finan +
      "' class='form-control input-sm rtributaria'></select></td>" +
      "<td col" +
      cont_finan +
      "><select id='bank" +
      cont_finan +
      "' class='form-control input-sm rbanco'></select></td>" +
      "<td col" +
      cont_finan +
      "><select id='tipologiacu" +
      cont_finan +
      "' class='form-control input-sm rtipologia'>" +
      tipo_cuenta +
      "</select></td>" +
      "<td col" +
      cont_finan +
      "><input type='number' id='numcuenta" +
      cont_finan +
      "' class='form-control input-sm rnum'></td>" +
      "</tr col" +
      cont_finan +
      ">";
    $("#dato_bancario").append(tabla);
  });

  $("#btn_crear_cuentas").click(function () {
    var msg_error = "";
    if (!$(".rciuu").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Actividad economica CIIU</strong> para poder crear la cuenta.</p>";
      AplicaFoco(".rciuu");
    } else {
      RemueveFoco(".rciuu");
    }
    if (!$(".rtributaria").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Obligación Tributaria</strong> para poder crear la cuenta.</p>";
      AplicaFoco(".rtributaria");
    } else {
      RemueveFoco(".rtributaria");
    }
    if (!$(".rbanco").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Banco</strong> para poder crear la cuenta.</p>";
      AplicaFoco(".rbanco");
    } else {
      RemueveFoco(".rbanco");
    }
    if (!$(".rtipologia").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Tipo cuenta</strong> para poder crear la cuenta.</p>";
      AplicaFoco(".rtipologia");
    } else {
      RemueveFoco(".rtipologia");
    }
    if (!$(".rnum").val()) {
      msg_error += "<p>Debe diligenciar el campo <strong>Número cuenta</strong> para poder crear la cuenta.</p>";
      AplicaFoco(".rnum");
    } else {
      RemueveFoco(".rnum");
    }
    if (!msg_error) {
      Crear_Cuenta();
    } else {
      $("#nexos_messages_finan").html(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
          msg_error +
          "</div></div>",
      );
      $("#Agrega_Financiero").animate({scrollTop: 0}, 600);
    }
  });
});

$("#btnmascarae_direccion").click(function () {
  $("#div_mascarae").toggle();
});

$("#btnmascara_direccion").click(function () {
  $("#div_mascara").toggle();
});

var url = $("#id_url_ajax").val() + "libs/proveedores_ajax.php";
//funcion para agregar el nombre del archivo a el input
function Rut(fic) {
  fic = fic.split("\\");
  if (fic == "" || fic == null) {
    $("#name_docurut").val("");
  } else {
    $("#name_docurut").val(fic[fic.length - 1]);
  }
}

// function lice(fic) {
//   fic = fic.split("\\");
//   if (fic == "" || fic == null) {
//     $("#name_doculice").val("");
//   } else {
//     $("#name_doculice").val(fic[fic.length - 1]);
//   }
// }

function insertcontac() {
  var data = null;
  data = new FormData();
  var canti = $("#cont_contactos").val();
  if (canti > 0) {
    var i;
    for (i = 1; i <= canti; i++) {
      var nombre = $("#nombres" + i).val();
      var cargo = $("#cargo" + i).val();
      var fijo = $("#fijo" + i).val();
      var celular = $("#celular" + i).val();
      var correo = $("#correo" + i).val();
      var critica = $("#critica" + i).val();
      var refe = $("#refe" + i).val();
      data.append("accion", "crearContactos");
      data.append("nombre", nombre);
      data.append("cargo", cargo);
      data.append("fijo", fijo);
      data.append("celular", celular);
      data.append("correo", correo);
      data.append("critica", critica);
      data.append("refe", refe);
      data.append("verifica", 2);

      $.ajax({
        url: url,
        type: "POST",
        data: data,
        cache: false,
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
          console.log("si inserto contactos del proveedor");
          // alert('!!Registro Vehiculo exitosamente!!!');
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("no inserto contactos del proveedor");
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });
    }
  }
}

async function crear_Dato_Ministerio(respuesta) {
  if (respuesta == true) {
    var id = $("#numero_documento").val();
    var tipdoc = $("#tipo_documento").val();
    var mintrans = 0;
    if (id !== "") {
      //saber si es conductor o no
      var tipotercero = "";
      var tercero_clase = "";
      var driver = "";
      var holder = "";
      var owner = "";
      if ($("#Conductor").is(":checked")) {
        driver = "Conductor ";
      }
      if ($("#poseedor_vehiculo").is(":checked")) {
        holder = "Poseedor ";
      }
      if ($("#propietario_vehiculo").is(":checked")) {
        owner = "Propietario";
      }
      tercero_clase = driver + holder + owner;
      //insertar tabla transaccional del ministerio
      //$.post($("#id_url_ajax").val()+'web_service/terceros',paquete_transmite);
      var accion = {
        num_documento: id,
        tercero_clase: tercero_clase,
        action: "crear_transaccion_ministerio",
      };
      $.ajax({
        url: $("#id_url_ajax").val() + "libs/hojas_de_vida_ajax.php",
        type: "POST",
        data: accion,
        dataType: "json",
        success: function (data) {
          console.log(data);
          if (data) {
            mintrans = 1;
          } else {
            mintrans = 0;
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("no creo dato del ministerio");
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown);
        },
      });

      if ($("#Conductor").is(":checked") || $("#poseedor_vehiculo").is(":checked") || ($("#propietario_vehiculo").is(":checked") && mintrans == 1)) {
        //alert('ENVIAR AL MINISTERIO');
        if ($("#Conductor").is(":checked")) {
          var conduce = 1;
        } else {
          var conduce = 0;
        }
        var proceso = 11;

        $("#loading-overlay-rndc ").css("display", "flex"); // Mostrar mensaje de carga
        var datos_rndc = new FormData();
        datos_rndc.append("id", id);
        datos_rndc.append("tipdoc", tipdoc);
        datos_rndc.append("dato", 1);
        datos_rndc.append("filtro", tipotercero);
        datos_rndc.append("proceso", proceso);
        datos_rndc.append("tipopro", 2);
        datos_rndc.append("conduce", conduce);
        try {
          const response = await fetch($("#id_url_ajax").val() + "web_service/terceros", {
            method: "POST",
            body: datos_rndc,
            cache: "no-cache",
          });
          const data = await response.json();
          var tablas_locales = "";
          if (data.status == "true") {
            tablas_locales = "Se Registro Datos Exitosamente RNDC";
            $("#nexos_messages_popup").append(
              '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
                tablas_locales +
                " - " +
                data.resultado +
                "</div></div>",
            );
            $("#frm_proveedores").animate({scrollTop: 0}, 600);
            // crear_Dato_Oet(true);
          } else if (data.status == "false") {
            tablas_locales = "No se creo el Tercero en RNDC";
            $("#nexos_messages_popup").append(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
                tablas_locales +
                " - " +
                data.resultado +
                "</div></div>",
            );
            $("#frm_proveedores").animate({scrollTop: 0}, 600);
            // crear_Dato_Oet(true);
          }
        } catch (error) {
          console.error("Error en la primera solicitud:", error);
          throw error;
        } finally {
          $("#loading-overlay-rndc ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
          crear_Dato_Oet(true);
        }
      } else if (!$("#Conductor").is(":checked") && !$("#poseedor_vehiculo").is(":checked") && !$("#propietario_vehiculo").is(":checked")) {
        //proveedor
        setTimeout(function () {
          location.reload(false);
        }, 1000);
      }
    }
  }
}

async function crear_Dato_Oet(respuesta) {
  //if(respuesta == true){
  clase = 1;
  recurso = 1;
  // valor = "&dato_recurso=" + $("#numero_documento").val();
  activy1 = "";
  activy2 = "";
  activy3 = "";
  if ($("#propietario_vehiculo").is(":checked")) {
    activy2 = "3";
  }
  if ($("#poseedor_vehiculo").is(":checked")) {
    activy3 = "5";
  }
  if ($("#Conductor").is(":checked")) {
    activy1 = "4";
  }
  filtro = activy2 + activy3 + activy1;
  // var paquete = "clase_recurso=" + recurso + "&recurso=" + filtro + valor;
  $("#loading-overlay-oet ").css("display", "flex"); // Mostrar mensaje de carga
  let datos_oet = new FormData();
  datos_oet.append("clase_recurso", recurso);
  datos_oet.append("recurso", filtro);
  datos_oet.append("dato_recurso", $("#numero_documento").val());
  //Consulta_Recurso_Avansat
  try {
    const response = await fetch($("#id_url_ajax").val() + "integrar_oet/Consulta_Recurso_Avansat", {
      method: "POST",
      body: datos_oet,
      cache: "no-cache",
    });
    const data = await response.json();
    if (data.status == true || data.status == "true") {
      var tablas_locales = "Se Registro Datos Exitosamente GRUPO OET";
      $("#nexos_messages_popup").append(
        '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
          tablas_locales +
          "</div></div>",
      );
      $("#frm_proveedores").animate({scrollTop: 0}, 600);
      //Limpiar campos del modal
      // Limpiar_Modal_proveedores();
    } else if (data.status == false || data.status == "false") {
      var tablas_locales = "No se creo el Tercero en GRUPO OET";
      $("#nexos_messages_popup").append(
        '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
          tablas_locales +
          " - " +
          data.error +
          "</div></div>",
      );
      $("#frm_proveedores").animate({scrollTop: 0}, 600);
    }
  } catch (error) {
    console.error("Error en la primera solicitud:", error);
    throw error;
  } finally {
    var datos_el = JSON.parse(sessionStorage.getItem("datos_valida"));
    datos_el.elementos - 1;
    if (datos_el.elementos === 0) {
      $("#loading-overlay-oet ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
      //Limpiar campos del modal
      Limpiar_Modal_proveedores();
      sessionStorage.clear();
      location.reload();
    } else if (datos_el.elementos !== 0) {
      $("#loading-overlay-oet ").css("display", "none"); // Ocultar mensaje de carga independientemente del resultado
      location.reload();
    }
  }
}

var flag_proveedor;
function editardatosProveedor(id_proveedor) {
  if (flag_proveedor != id_proveedor) {
    flag_proveedor = id_proveedor;

    $(".nexos_messages_popup").html("");

    $("#e_id_proveedor").val(id_proveedor);
    $("#e_datos_conductor").html("");

    $("#e_rndc_nombre").val("");
    $("#e_primer_apellido").val("");
    $("#e_segundo_apellido").val("");
    $("#e_nombre").val("");

    var params = {
      accion: "verProveedor",
      id_proveedor: id_proveedor,
    };
    $.post(
      url,
      params,
      function (data) {
        // console.log(data);
        if (data.success) {
          $("#titulo_editar").text(" Proveedor #" + data.content["numero_documento"]);
          $("#e_tipo_documento").val(data.content["tipo_documento"]);
          $("#e_tipo_documento").attr("disabled", true);
          $("#e_Conductor").attr("disabled", false);
          if ($("#e_tipo_documento").val() == "NIT") {
            $("#e_Conductor").attr("disabled", true);
          }
          $("#e_numero_documento").val(data.content["numero_documento"]);
          $("#e_numero_documento").attr("disabled", true);
          $("#e_digito_verificacion").val(data.content["digito_verificacion"]);
          if (!data.content["digito_verificacion"]) {
            $("#e_digito_verificacion").val(calcularDigitoVerificacion(data.content["numero_documento"]));
          }
          $("#e_tipo_regimen").val(data.content["tipo_regimen"]);
          $("#e_tipo_identificacion").val(data.content["tipo_identificacion"]);
          if (!data.content["tipo_identificacion"]) {
            if ($("#e_tipo_documento").val() == "NIT") {
              $("#e_tipo_identificacion").val("31");
            } else if ($("#e_tipo_documento").val() == "Cedula de Ciudadania") {
              $("#e_tipo_identificacion").val("13");
            } else if ($("#e_tipo_documento").val() == "Cedula de Extranjeria") {
              $("#e_tipo_identificacion").val("22");
            }
          }
          $("#e_rndc_nombre").val(data.content["nombre"]);
          $("#e_nombre").val(data.content["nombre"]);
          $("#e_primer_apellido").attr("disabled", false);
          $("#e_segundo_apellido").attr("disabled", false);

          if (data.content["rndc_id"]) {
            if (data.rndc_result) {
              // console.log("Si hay respuesa del RNDC");
              // console.log(data.rndc_result);
              $("#e_rndc_nombre").val(data.rndc_result["nomidtercero"]);
              $("#e_primer_apellido").val(data.rndc_result["primerapellidoidtercero"]);
              $("#e_segundo_apellido").val(data.rndc_result["segundoapellidoidtercero"]);
              $("#e_nombre").val(
                data.rndc_result["nomidtercero"] +
                  " " +
                  data.rndc_result["primerapellidoidtercero"] +
                  " " +
                  data.rndc_result["segundoapellidoidtercero"],
              );
            }
          }

          if ($("#e_tipo_documento").val() == "NIT") {
            $("#e_primer_apellido").attr("disabled", true);
            $("#e_segundo_apellido").attr("disabled", true);
          }
          $("#e_abreviatura").val(data.content["abreviatura"]);
          $("#e_contacto").val(data.content["contacto"]);
          $("#e_celular").val(data.content["celular"]);
          if (!data.content["rndc_id"]) {
            $("#e_contacto").val(data.content["celular"]);
            $("#e_celular").val(data.content["contacto"]);
          }
          $("#e_direccion").val(data.content["direccion"]);
          $("#e_email").val(data.content["email"]);
          $("#e_estado").val(data.content["estado"]);
          $("#e_municipio").val(data.content["municipio"]);
          $("#e_id_municipio").val(data.content["id_municipio"]);
          $("#e_rndc_id_municipio").val(data.content["rndc_codigo_ciudad"]);
          $("#e_referencias_empresariales").val(data.content["referencias_empresariales"]);
          $("#e_referencias_personales").val(data.content["referencias_personales"]);
          $("#e_observaciones").val(data.content["observaciones"]);
          $("#e_ruta_documentos").val(data.content["documentos_soporte"]);
          $("#e_caja_documentos").html(data.archivos);
          $("#e_Conductor").prop("checked", false);
          $("#e_Empleado").prop("checked", false);
          $("#e_poseedor_vehiculo").prop("checked", false);
          $("#e_propietario_vehiculo").prop("checked", false);
          $("#e_Proveedor").prop("checked", false);

          if (data.actividades.length > 0) {
            for (let i = 0; i < data.actividades.length; i++) {
              if (data.actividades[i]["actividad"] == "Conductor") {
                $("#e_Conductor").prop("checked", true);

                $("#e_datos_conductor").html(`
								<div class="form-group col-xs-12 col-sm-4 col-md-3">
									<label>Catergoría Licencia:</label>
									<select id="e_categoria_licencia" class="form-control input-sm">
										<option value="" disabled selected>Seleccione</option>
										<option value="4">4</option>
										<option value="5">5</option>
										<option value="6">6</option>
										<option value="C1">C1</option>
										<option value="C2">C2</option>
										<option value="C3">C3</option>
									</select>
									<label id="error_e_categoria_licencia"></label>
								</div>
								<div class="form-group col-xs-12 col-sm-4 col-md-6">
									<label>Número de Licencia:</label>
									<input type="text" id="e_numero_licencia" placeholder="Número de Licencia" class="form-control input-sm">
									<label id="error_e_numero_licencia"></label>
								</div>
								<div class="form-group col-xs-12 col-sm-4 col-md-3">
									<label>Vencimiento Licencia:</label>
									<div data-min-view="2" data-start-view="4" data-date-format="dd/mm/yyyy" data-link-field="dtp_input1" class="input-group date datetimepicker">
										<input size="16" type="text" value="" id="e_vencimiento_licencia" class="form-control input-sm" readonly=”readonly”>
										<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
									</div>
									<label id="error_e_vencimiento_licencia"></label>
								</div>
								<script type="text/javascript">
									$(document).ready(function(){
										App.wizard();
									});
									$(document).ready(function(){
										App.init();
										App.formElements();
									});
								</script>
							`);

                $("#e_categoria_licencia").val(data.content["rndc_categoria_licencia"]);
                $("#e_numero_licencia").val(data.content["rndc_numero_licencia"]);
                $("#e_vencimiento_licencia").val(data.content["rndc_vencimiento_licencia"]);
              }
              if (data.actividades[i]["actividad"] == "Empleado") {
                $("#e_Empleado").prop("checked", true);
              }
              if (data.actividades[i]["actividad"] == "Poseedor Vehiculo") {
                $("#e_poseedor_vehiculo").prop("checked", true);
              }
              if (data.actividades[i]["actividad"] == "Propietario Vehiculo") {
                $("#e_propietario_vehiculo").prop("checked", true);
              }
              if (data.actividades[i]["actividad"] == "Proveedor") {
                $("#e_Proveedor").prop("checked", true);
              }
            }
          }
        }
        if (data.error) {
          var msg_error = data.error.replace(/\n/g, "</p><p>");
          $(".nexos_messages_popup").html(
            '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>' +
              msg_error +
              "</p></div></div>",
          );
          $("#editar_proveedor").animate({scrollTop: 0}, 600);
        }
      },
      "json",
    );
  }
}

function tipo_service() {
  var tp = $("#e_tiposervicio").val();

  $("#edetalle1").val("");
  $("#edetalle2").val("");

  if (tp == "Transporte") {
    $("#edetalle1").html(
      '<option value="Aerea">Aerea</option>' + '<option value="Maritima">Maritima</option>' + '<option value="Terrestre">Terrestre</option>',
    );

    $("#edetalle2").html(
      '<option disabled="disabled">AEREA</option>' +
        '<option value="Courier Internacional">Courier Internacional</option>' +
        '<option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>' +
        '<option value="Agentes aereos">Agentes aereos</option>' +
        '<option value="Aereos nacional">Aereos nacional</option>' +
        '<option disabled="disabled">MARITIMA</option>' +
        '<option value="Navieras">Navieras</option>' +
        '<option value="Agentes maritimos">Agentes maritimos</option>' +
        '<option disabled="disabled">TERRESTRE</option>' +
        '<option value="Transportadores terrestres">Transportadores terrestres</option>' +
        '<option value="Nacionales">Nacionales</option>' +
        '<option value="Transportadores urbanos">Transportadores urbanos</option>',
    );
  }

  if (tp == "Porteadores") {
    $("#edetalle1").html(
      '<option value="Puertos">Puertos</option>' +
        '<option value="Aeropuertos">Aeropuertos</option>' +
        '<option value="Entes regulatorios">Entes regulatorios</option>' +
        '<option value="Tramites en frontera">Trámites en frontera</option>',
    );
    $("#edetalle2").html('<option value="">No aplica</option>');
  }

  if (tp == "Adecuaciones" || tp == "Aduana" || tp == "Impuestos" || tp == "Tramites operativos") {
    $("#edetalle1").html('<option value="">No aplica</option>');
    $("#edetalle2").html('<option value="">No aplica</option>');
  }

  if (tp == "Agenciamiento de carga") {
    $("#edetalle1").html(
      '<option value="Agentes de carga">Agentes de carga</option>' + '<option value="Consolidador neutral">Consolidador neutral</option>',
    );
    $("#edetalle2").html('<option value="">No aplica</option>');
  }

  if (tp == "Tramites administrativos") {
    $("#edetalle1").html(
      '<option value="Navidad">Navidad</option>' +
        '<option value="Calendarios">Calendarios</option>' +
        '<option value="Dotaciones">Dotaciones</option>' +
        '<option value="Servicios públicos">Servicios públicos</option>',
    );
    $("#edetalle2").html('<option value="">No aplica</option>');
  }
}

function Crear_Cuenta() {
  var id = $("#num_proveedor").val();
  var dato = {
    ciu: [],
    obligacion: [],
    banco: [],
    tcuenta: [],
    ncuenta: [],
  };
  $(".rciuu").each(function (index) {
    var ciu = $(this).val();
    dato.ciu[index] = ciu;
  });
  $(".rtributaria").each(function (index) {
    var tribu = $(this).val();
    dato.obligacion[index] = tribu;
  });
  $(".rbanco").each(function (index) {
    var bank = $(this).val();
    dato.banco[index] = bank;
  });
  $(".rtipologia").each(function (index) {
    var tipo = $(this).val();
    dato.tcuenta[index] = tipo;
  });
  $(".rnum").each(function (index) {
    var numero = $(this).val();
    dato.ncuenta[index] = numero;
  });
  var notanew = dato;
  notanew = JSON.stringify(notanew);
  var envio_paquete = "idproveedor=" + id + "&dato_bancario=" + notanew;
  $.post(
    $("#id_url_ajax").val() + "solicitudes/Registro_Cuentas",
    envio_paquete,
    function (data) {
      if (data == "true") {
        alert("Datos Registrados Exitosamente!!");
        location.reload();
      } else {
        alert("Ocurrio algo");
      }
    },
    "json",
  );
}

function AgregaFinanciero(idproveedor) {
  $("#num_proveedor").val(idproveedor);
}

function delete_cuenta(id) {
  event.preventDefault();
  $(".col" + id).remove();
  $("#ciuu" + id).remove();
  $("#tributaria" + id).remove();
  $("#bank" + id).remove();
  $("#tipologiacu" + id).remove();
  $("#numcuenta" + id).remove();
  $(this).closest("col").remove();
  $(this).closest("tipo_precinto").remove();
  $(this).closest("r").remove();
  $(this).closest("sellos").remove();
  $(this).closest("sk").remove();
  $(this).closest("num_preci").remove();
  alert("Dato Eliminado!!");
}

//TRAER DATOS DEL PROVEEDOR AL FORMULARIO
//mostrar acordeones segun lo que trae
function editardatosProveedorn0(id_proveedor) {
  $("#div_mascarae").hide();
  $("#e_complemento").hide();
  $("#acordeon_proveedor").hide();
  $("#acordeon_conproveedor").hide();
  $("#acordeon_conductor").hide();
  var dato = {
    id_proveedor: id_proveedor,
    action: "consultar_actividad_proveedor",
  };
  $.ajax({
    url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
    type: "POST",
    data: dato,
    dataType: "json",
    success: function (data) {
      data.result.forEach(function (element, index) {
        actividad = element.acti;
        if (actividad == "Conductor") {
          $("#acordeon_conductor").show();
        }
        if (actividad == "Proveedor") {
          $("#acordeon_proveedor").show();
          $("#acordeon_conproveedor").show();
        }
      });
      editardatosProveedorn(id_proveedor);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("error dato proveedor");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//Actualizar cuenta bancaria
function update_cuenta(cuenta, idtabla) {
  let ciu = $("#eactividadciu" + cuenta).val();
  let obli = $("#eobligacion" + cuenta).val();
  let bank = $("#banco" + cuenta).val();
  let tipoc = $("#etipocuenta" + cuenta).val();
  let numc = $("#enumcuenta" + cuenta).val();
  var actualiza_cuenta = {
    actividad_economica: ciu,
    obligacion: obli,
    banco: bank,
    tipo_cuenta: tipoc,
    numero_cuenta: numc,
    idtabla: idtabla,
    action: "Actualiza_Cuenta_Bancaria",
  };
  $.ajax({
    url: $("#id_url_ajax").val() + "libs/hojas_de_vida_ajax.php",
    type: "POST",
    data: actualiza_cuenta,
    dataType: "json",
    success: function (data) {
      alert("Datos Actualizados Exitosamente!!");
      location.reload();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//Alimentar los datos
function editardatosProveedorn(id_proveedor) {
  var datos = {
    id: id_proveedor,
    action: "traer_datos_proveedor",
  };
  $("#e_poseedor_vehiculo").html("");
  $("#e_Conductor").html("");
  $("#e_propietario_vehiculo").html("");
  $("#e_Proveedor").html("");
  //check
  $("#e_Proveedor").prop("checked", false);
  $("#e_propietario_vehiculo").prop("checked", false);
  $("#e_poseedor_vehiculo").prop("checked", false);
  $("#e_Conductor").prop("checked", false);
  $("#etbcontact").html("");
  $(".edicion_dato_financiero").hide();
  $.ajax({
    url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
    type: "POST",
    data: datos,
    dataType: "json",
    success: function (data) {
      if (data.result) {
        if (data.result[0].estado_proceso == "bloqueado") {
          $("#estado_bloqueo").html('<p class="text-danger" style="font-weigth:800;">Bloqueado</p>');
          $(".des").prop("disabled", true);
          $("#btn_editar_proveedornew").hide();
        }
        var cont = 0;
        var contp = 0;
        $("#e_datos_especificos").hide();
        $(".e_titulogeneral").hide();
        //console.log(data);
        //cmx_proveedores
        $("#titulo_editar").text("Editar Proveedor #" + data.result[0].numero_documento);
        //datos para el conductor
        //var actividad=(data.result9[0].acti);
        data.result9.forEach(function (element, index) {
          actividad = element.acti;
          //$("#e_primer_apellido").val(data.result[0].acti);
          if (actividad == "Conductor") {
            $("#e_Conductor").prop("checked", true);
            $("#e_datos_especificos").show();
            $(".e_titulogeneral").show();
            //$("#e_categoria").val(data.result[0].rndc_categoria_licencia);
            var categoria = data.result[0].rndc_categoria_licencia.trim();
            if (data.result[0].rndc_categoria_licencia == "" || data.result[0].rndc_categoria_licencia == 0) {
              $("#e_categoria").html(
                '<option value="">Seleccione opción</option>' +
                  '<option value="C1">C1</option>' +
                  '<option value="C2">C2</option>' +
                  '<option value="C3">C3</option>' +
                  '<option value="4">4</option>' +
                  '<option value="5">5</option>' +
                  '<option value="6">6</option>',
              );
            }
            if (categoria == "C1") {
              $("#e_categoria").html(
                '<option value="C1">C1</option>' +
                  '<option value="C2">C2</option>' +
                  '<option value="C3">C3</option>' +
                  '<option value="4">4</option>' +
                  '<option value="5">5</option>' +
                  '<option value="6">6</option>',
              );
            }
            if (categoria == "C2") {
              $("#e_categoria").html(
                '<option value="C2">C2</option>' +
                  '<option value="C1">C1</option>' +
                  '<option value="C3">C3</option>' +
                  '<option value="4">4</option>' +
                  '<option value="5">5</option>' +
                  '<option value="6">6</option>',
              );
            }
            if (categoria == "C3") {
              $("#e_categoria").html(
                '<option value="C3">C3</option>' +
                  '<option value="C1">C1</option>' +
                  '<option value="C2">C2</option>' +
                  '<option value="4">4</option>' +
                  '<option value="5">5</option>' +
                  '<option value="6">6</option>',
              );
            }
            if (categoria == "6") {
              $("#e_categoria").html(
                '<option value="6">6</option>' +
                  '<option value="5">5</option>' +
                  '<option value="4">4</option>' +
                  '<option value="C3">C3</option>' +
                  '<option value="C1">C1</option>' +
                  '<option value="C2">C2</option>',
              );
            }
            if (categoria == "5") {
              $("#e_categoria").html(
                '<option value="5">5</option>' +
                  '<option value="6">6</option>' +
                  '<option value="4">4</option>' +
                  '<option value="C3">C3</option>' +
                  '<option value="C1">C1</option>' +
                  '<option value="C2">C2</option>',
              );
            }
            if (categoria == "4") {
              $("#e_categoria").html(
                '<option value="4">4</option>' +
                  '<option value="5">5</option>' +
                  '<option value="6">6</option>' +
                  '<option value="C3">C3</option>' +
                  '<option value="C1">C1</option>' +
                  '<option value="C2">C2</option>',
              );
            }
            $("#e_num_licencia").val(data.result[0].rndc_numero_licencia);
            $("#e_vence_licencia").val(data.result[0].rndc_vencimiento_licencia);
          }

          if (actividad == "Poseedor Vehiculo") {
            $("#e_poseedor_vehiculo").prop("checked", true);
          }
          if (actividad == "Propietario Vehiculo") {
            $("#e_propietario_vehiculo").prop("checked", true);
          }
          if (actividad == "Proveedor") {
            $("#e_Proveedor").prop("checked", true);
            $("#acordeon_proveedor").show();
          }
        });

        //TRAER DATOS DE LICENCIA SI ES CONDUCTOR
        $("#eusuario").val(data.result[0].idp);
        $("#e_rndc_nombre").val(data.result[0].nombre);
        $("#e_apellido1").val(data.result[0].apellido1);
        $("#e_apellido2").val(data.result[0].apellido2);
        // $("#e_primer_apellido").val();
        // $("#e_segundo_apellido").val();
        $("#e_abreviatura").val(data.result[0].abreviatura);
        $("#e_tipo_documento").val(data.result[0].tipo_documento);
        $("#e_numero_documento").val(data.result[0].numero_documento);
        $("#e_tipo_identificacion").val(data.result[0].tipo_identificacion);
        $("#e_contacto").val(data.result[0].contacto);
        $("#e_celular").val(data.result[0].celular);
        $("#e_email").val(data.result[0].email);
        $("#e_direccion").val(data.result[0].direccion);
        $("#e_digito_verificacion").val(data.result[0].digito_verificacion);
        $("#tb_dcondu").val(data.result[0].idp);
        //traer datos municipio
        var municipio = $("#e_municipio").html("");
        data.result[0].id_municipio.forEach(function (element, index) {
          var tmpSelected = "";
          if (element.selected) {
            tmpSelected = "selected";
          }
          var municipio = $("#e_municipio").append(
            "<option " + tmpSelected + ' value="' + element.munid + '">' + element.munmun + "-" + element.mundepto + "</option>",
          );
        });

        $("#e_celular2").val(data.result[0].celular2);
        $("#e_name_eps").val(data.result[0].nombre_eps);
        $("#e_vence_eps").val(data.result[0].fecha_vence_eps);
        //$("#e_ultimo_eps").val(data.result[0].ultimo_eps);
        //$("#e_name_arl").val(data.result[0].nombre_arl);
        //$("#e_vence_arl").val(data.result[0].fecha_vence_arl);
        //$("#e_ultimo_arl").val(data.result[0].ultimo_arl);
        $("#e_nom_enti").val(data.result[0].nombre_entidad);
        $("#e_vence_curso").val(data.result[0].vence_curso);
        $("#id_tbdetalle").val(data.result[0].iddetalle);
        $("#e_fecha_nacimiento").val(data.result[0].fecha_nacimiento);
        $("#e_ingreso").val(data.result[0].fecha_ingreso);
        var s = data.result[0].sexo;
        if (s == "" || s == null || s == "SIN REGISTRAR") {
          $("#e_sexo").html(
            '<option value="SIN REGISTRAR">SIN REGISTRAR</option>' +
              '<option value="Femenino">Femenino</option>' +
              '<option value="Masculino">Masculino</option>',
          );
        }
        if (s == "Femenino") {
          $("#e_sexo").html('<option value="' + s + '">' + s + "</option>" + '<option value="Masculino">Masculino</option>');
        }
        if (s == "Masculino") {
          $("#e_sexo").html('<option value="' + s + '">' + s + "</option>" + '<option value="Femenino">Femenino</option>');
        }
        var sangre = data.result[0].grupo_sanguineo;
        if (sangre == "" || sangre == null || sangre == "SIN REGISTRAR") {
          $("#e_sangre").html(
            '<option value="SIN REGISTRAR">SIN REGISTRAR</option>' +
              '<option value="O+">O+</option>' +
              '<option value="O-">O-</option>' +
              '<option value="A+">A+</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B+">B+</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB+">AB+</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "O+") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O-">O-</option>' +
              '<option value="A+">A+</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B+">B+</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB+">AB+</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "O-") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O+">O+</option>' +
              '<option value="A+">A+</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B+">B+</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB+">AB+</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "A+") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O+">O+</option>' +
              '<option value="O-">O-</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B+">B+</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB+">AB+</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "A-") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O+">O+</option>' +
              '<option value="O-">O-</option>' +
              '<option value="A+">A+</option>' +
              '<option value="B+">B+</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB+">AB+</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "B+") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O+">O+</option>' +
              '<option value="O-">O-</option>' +
              '<option value="A+">A+</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB+">AB+</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "B-") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O+">O+</option>' +
              '<option value="O-">O-</option>' +
              '<option value="A+">A+</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B+">B+</option>' +
              '<option value="AB+">AB+</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "AB+") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O+">O+</option>' +
              '<option value="O-">O-</option>' +
              '<option value="A+">A+</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B+">B+</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB-">AB-</option>',
          );
        }
        if (sangre == "AB-") {
          $("#e_sangre").html(
            '<option value="' +
              sangre +
              '">' +
              sangre +
              "</option>" +
              '<option value="O+">O+</option>' +
              '<option value="O-">O-</option>' +
              '<option value="A+">A+</option>' +
              '<option value="A-">A-</option>' +
              '<option value="B+">B+</option>' +
              '<option value="B-">B-</option>' +
              '<option value="AB+">AB+</option>',
          );
        }

        var civil = data.result[0].estado_civil;
        // $("#e_civil").html('<option value="">prueba</option>');
        // console.log('estado'+civil);
        if (civil == "" || civil == null || civil == 0) {
          $("#e_civil").html(
            '<option value="0">SIN REGISTRAR</option>' +
              '<option value="1">Casado</option>' +
              '<option value="2">Unión Libre</option>' +
              '<option value="3">Separado</option>' +
              '<option value="4">Divorciado</option>' +
              '<option value="5">Viudo</option>' +
              '<option value="6">Soltero</option>',
          );
        }
        if (civil == "1") {
          $("#e_civil").html(
            '<option value="' +
              civil +
              '">Casado</option>' +
              '<option value="2">Unión Libre</option>' +
              '<option value="3">Separado</option>' +
              '<option value="4">Divorciado</option>' +
              '<option value="5">Viudo</option>' +
              '<option value="6">Soltero</option>',
          );
        }
        if (civil == "2") {
          $("#e_civil").html(
            '<option value="' +
              civil +
              '">Unión Libre</option>' +
              '<option value="1">Casado</option>' +
              '<option value="3">Separado</option>' +
              '<option value="4">Divorciado</option>' +
              '<option value="5">Viudo</option>' +
              '<option value="6">Soltero</option>',
          );
        }
        if (civil == "3") {
          $("#e_civil").html(
            '<option value="' +
              civil +
              '">Separado</option>' +
              '<option value="1">Casado</option>' +
              '<option value="2">Unión Libre</option>' +
              '<option value="4">Divorciado</option>' +
              '<option value="5">Viudo</option>' +
              '<option value="6">Soltero</option>',
          );
        }
        if (civil == "4") {
          $("#e_civil").html(
            '<option value="' +
              civil +
              '">Divorciado</option>' +
              '<option value="1">Casado</option>' +
              '<option value="2">Unión Libre</option>' +
              '<option value="3">Separado</option>' +
              '<option value="5">Viudo</option>' +
              '<option value="6">Soltero</option>',
          );
        }
        if (civil == "5") {
          $("#e_civil").html(
            '<option value="' +
              civil +
              '">Viudo</option>' +
              '<option value="1">Casado</option>' +
              '<option value="2">Unión Libre</option>' +
              '<option value="3">Separado</option>' +
              '<option value="4">Divorciado</option>' +
              '<option value="6">Soltero</option>',
          );
        }
        if (civil == "6") {
          $("#e_civil").html(
            '<option value="' +
              civil +
              '">Soltero</option>' +
              '<option value="1">Casado</option>' +
              '<option value="2">Unión Libre</option>' +
              '<option value="3">Separado</option>' +
              '<option value="4">Divorciado</option>' +
              '<option value="5">Viudo</option>',
          );
        }
        //Referencias laborales - conductor
        if (data.result2) {
          data.result2.forEach(function (element, index) {
            cont++;
            $("#e_idrefe" + cont).val(element.id);
            $("#e_referencias_empresariales" + cont).val(element.nombre_empresa);
            $("#e_fecha_referencia" + cont).val(element.fecha_ingreso);
            $("#e_fecha_retiro" + cont).val(element.fecha_retiro);
            $("#e_contacto_ref" + cont).val(element.persona_contacto);
            $("#e_celular_ref" + cont).val(element.celular);
            $("#e_cargo_ref" + cont).val(element.cargo);
            $("#e_anti_ref" + cont).val(element.antiguedad);

            $("#idlab" + cont).val(element.id);
            //documentos
            if (element.name_documento != "" && element.name_documento != null) {
              docu =
                '<a  href="http://localhost/mvcLuisMiguel/' +
                element.documento_empresarial +
                "/" +
                element.name_documento +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
                "</span>" +
                "</a>";
              $("#lab" + cont).html(docu);
              //$("#idlab"+cont).val(element.id);
            } else {
              $("#lab" + cont).html('<p class="text-danger">No existe archivo</p>');
            }
          });
        }
        //Refrencias personales- conductor
        if (data.result3) {
          //alert('si referencia personal');
          data.result3.forEach(function (element, index) {
            contp++;
            //$("#e_parenp"+contp).val(element.);
            var pare = element.parentezco;
            if (pare == "" || pare == null || pare == 0) {
              $("#e_parenp" + contp).html(
                '<option value="0">Sin registrar</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="7">Hijo/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }
            if (pare == "1") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="7">Hijo/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }

            if (pare == "2") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Hermano/a</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="7">Hijo/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }
            if (pare == "3") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Padre</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="7">Hijo/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }
            if (pare == "4") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Madre</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="7">Hijo/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }
            if (pare == "5") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Tio/a</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="7">Hijo/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }
            if (pare == "6") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Sobrino/a</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="7">Hijo/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }
            if (pare == "7") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Hijo/a</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="8">Espaso/a</option>',
              );
            }
            if (pare == "8") {
              $("#e_parenp" + contp).html(
                '<option value="' +
                  pare +
                  '">Espaso/a</option>' +
                  '<option value="1">Amigo/a</option>' +
                  '<option value="2">Hermano/a</option>' +
                  '<option value="3">Padre</option>' +
                  '<option value="4">Madre</option>' +
                  '<option value="5">Tio/a</option>' +
                  '<option value="6">Sobrino/a</option>' +
                  '<option value="7">Hijo/a</option>',
              );
            }

            $("#e_referencias_personales" + contp).val(element.nombre_personal);
            $("#e_fecha_personal" + contp).val(element.fecha_personal);
            $("#e_telefonop" + contp).val(element.tel_personal);
            $("#e_idp" + contp).val(element.id);
            $("#idper" + contp).val(element.id);
            if (element.name_documento != "" && element.name_documento != null) {
              docu =
                '<a  href="http://localhost/mvcLuisMiguel/' +
                element.documento_personal +
                "/" +
                element.name_documento +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
                "</span>" +
                "</a>";
              $("#per" + contp).html(docu);
              //$("#idper"+contp).val(element.id);
            } else {
              $("#per" + contp).html('<p class="text-danger">No existe archivo</p>');
            }
          });
        }
        //Datos de proveedor
        if (data.result6) {
          var tp = data.result6[0].cod_tipo_proveedor;

          if (tp == 1) {
            $("#enacional").prop("checked", true);
          }
          if (tp == 2) {
            $("#einternacional").prop("checked", true);
          }
          var municipio = $("#e_localizacion").html("");
          data.result6[0].id_municipio.forEach(function (element, index) {
            var tmpSelected = "";
            if (element.selected) {
              tmpSelected = "selected";
            }
            var municipio = $("#e_localizacion").append(
              "<option " +
                tmpSelected +
                ' value="' +
                element.munid +
                '">' +
                element.munmun +
                "-" +
                element.mundepto +
                "-" +
                element.munpais +
                "</option>",
            );
          });

          $("#e_zona").val(data.result6[0].descripcion_zona);
          var ts = data.result6[0].tipo_servicio;

          if (ts == undefined || ts == "") {
            $("#e_tiposervicio").html(
              '<option value="">Seleccione</option>' +
                '<option value="Transporte">Transporte</option>' +
                '<option value="Porteadores">Porteadores</option>' +
                '<option value="Adecuaciones">Adecuaciones</option>' +
                '<option value="Aduana">Aduana</option>' +
                '<option value="Impuestos">Impuestos</option>' +
                '<option value="Agenciamiento de carga">Agenciamiento de carga</option>' +
                '<option value="Tramites operativos">Trámites operativos</option>' +
                '<option value="Tramites administrativos">Trámites administrativos</option>',
            );
          } else {
            $("#e_tiposervicio").html(
              '<option value="' +
                ts +
                '">' +
                ts +
                "</option>" +
                '<option value="Transporte">Transporte</option>' +
                '<option value="Porteadores">Porteadores</option>' +
                '<option value="Adecuaciones">Adecuaciones</option>' +
                '<option value="Aduana">Aduana</option>' +
                '<option value="Impuestos">Impuestos</option>' +
                '<option value="Agenciamiento de carga">Agenciamiento de carga</option>' +
                '<option value="Tramites operativos">Trámites operativos</option>' +
                '<option value="Tramites administrativos">Trámites administrativos</option>',
            );
          }

          var du = data.result6[0].tipo_servicio_detalle1;
          var dd = data.result6[0].tipo_servicio_detalle2;

          if (ts == "Aduana" || ts == "Impuestos" || ts == "Adecuaciones" || ts == "Tramites operativos") {
            $("#edetalle1").html('<option value="' + du + '">No aplica</option>');

            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Porteadores" && du == "Puertos") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Aeropuertos">Aeropuertos</option>' +
                '<option value="Entes regulatorios">Entes regulatorios</option>' +
                '<option value="Tramites en frontera">Trámites en frontera</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }
          if (ts == "Porteadores" && du == "Aeropuertos") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Puertos">Puertos</option>' +
                '<option value="Entes regulatorios">Entes regulatorios</option>' +
                '<option value="Tramites en frontera">Trámites en frontera</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }
          if (ts == "Porteadores" && du == "Entes regulatorios") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Aeropuertos">Aeropuertos</option>' +
                '<option value="Puertos">Puertos</option>' +
                '<option value="Tramites en frontera">Trámites en frontera</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Porteadores" && du == "Tramites en frontera") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Aeropuertos">Aeropuertos</option>' +
                '<option value="Puertos">Puertos</option>' +
                '<option value="Entes regulatorios">Entes regulatorios</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Agenciamiento de carga" && du == "Agente de carga") {
            $("#edetalle1").html(
              '<option value="' + du + '">' + du + "</option>" + '<option value="Consolidador neutral">Consolidador neutral</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Agenciamiento de carga" && du == "Consolidador neutral") {
            $("#edetalle1").html('<option value="' + du + '">' + du + "</option>" + '<option value="Agente de carga">Agente de carga</option>');
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Tramites administrativos" && du == "Navidad") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Calendario">Calendario</option>' +
                '<option value="Dotaciones">Dotaciones</option>' +
                '<option value="Servicios públicos">Servicios publicos</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Tramites administrativos" && du == "Calendario") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Navidad">Navidad</option>' +
                '<option value="Dotaciones">Dotaciones</option>' +
                '<option value="Servicios públicos">Servicios publicos</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Tramites administrativos" && du == "Dotaciones") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Calendario">Calendario</option>' +
                '<option value="Navidad">Navidad</option>' +
                '<option value="Servicios públicos">Servicios publicos</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Tramites administrativos" && du == "Servicios públicos") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Calendario">Calendario</option>' +
                '<option value="Dotaciones">Dotaciones</option>' +
                '<option value="Navidad">Navidad</option>',
            );
            $("#edetalle2").html('<option value="' + dd + '">No aplica</option>');
          }

          if (ts == "Transporte" && du == "Aerea") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Maritima">Maritima</option>' +
                '<option value="Terrestre">Terrestre</option>',
            );

            if (dd == "Aerolinea de carga/pasajeros") {
              $("#edetalle2").html(
                '<option value="' +
                  dd +
                  '">' +
                  dd +
                  "</option>" +
                  '<option value="Courier Internacional">Courier Internacional</option>' +
                  '<option value="Agentes aereos">Agentes aereos</option>' +
                  '<option value="Aereos nacional">Aereos nacional</option>',
              );
            }

            if (dd == "Courier Internacional") {
              $("#edetalle2").html(
                '<option value="' +
                  dd +
                  '">' +
                  dd +
                  "</option>" +
                  '<option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>' +
                  '<option value="Agentes aereos">Agentes aereos</option>' +
                  '<option value="Aereos nacional">Aereos nacional</option>',
              );
            }

            if (dd == "Agentes aereos") {
              $("#edetalle2").html(
                '<option value="' +
                  dd +
                  '">' +
                  dd +
                  "</option>" +
                  '<option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>' +
                  '<option value="Courier Internacional">Courier Internacional</option>' +
                  '<option value="Aereos nacional">Aereos nacional</option>',
              );
            }

            if (dd == "Aereos nacional") {
              $("#edetalle2").html(
                '<option value="' +
                  dd +
                  '">' +
                  dd +
                  "</option>" +
                  '<option value="Aerolinea de carga/pasajeros">Aerolinea de carga/pasajeros</option>' +
                  '<option value="Courier Internacional">Courier Internacional</option>' +
                  '<option value="Agentes aereos">Agentes aereos</option>',
              );
            }
          }

          if (ts == "Transporte" && du == "Maritima") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Aerea">Aerea</option>' +
                '<option value="Terrestre">Terrestre</option>',
            );

            if (dd == "Navieras") {
              $("#edetalle2").html('<option value="Navieras">Navieras</option>' + '<option value="Agentes maritimos">Agentes maritimos</option>');
            }

            if (dd == "Agentes maritimos") {
              $("#edetalle2").html('<option value="' + dd + '">' + dd + "</option>" + '<option value="Navieras">Navieras</option>');
            }
          }

          if (ts == "Transporte" && du == "Terrestre") {
            $("#edetalle1").html(
              '<option value="' +
                du +
                '">' +
                du +
                "</option>" +
                '<option value="Maritima">Maritima</option>' +
                '<option value="Aerea">Aerea</option>',
            );
          }

          if (dd == "Transportadores terrestres") {
            $("#edetalle2").html(
              '<option value="Transportadores terrestres">Transportadores terrestres</option>' +
                '<option value="Nacionales">Nacionales</option>' +
                '<option value="Transportadores urbanos">Transportadores urbanos</option>',
            );
          }

          if (dd == "Nacionales") {
            $("#edetalle2").html(
              '<option value="' +
                dd +
                '">' +
                dd +
                "</option>" +
                '<option value="Transportadores terrestres">Transportadores terrestres</option>' +
                '<option value="Transportadores urbanos">Transportadores urbanos</option>',
            );
          }

          if (dd == "Transportadores urbanos") {
            $("#edetalle2").html(
              '<option value="' +
                dd +
                '">' +
                dd +
                "</option>" +
                '<option value="Transportadores terrestres">Transportadores terrestres</option>' +
                '<option value="Nacionales">Nacionales</option>',
            );
          }
        }
        //contactos - proveedor
        if (data.result7) {
          var cont = 0;
          data.result7.forEach(function (element, index) {
            cont++;

            var ch = '<input type="button" id="p' + cont + '" class="btn-primary" value="Remover"  onclick="delete_asocia(this.id,' + cont + ')"  >';
            var tabla =
              "<tr class='tr" +
              cont +
              "'  > " +
              "<th class='tr" +
              cont +
              "'>Id</th><th class='tr" +
              cont +
              "'>Nombre</th><th class='tr" +
              cont +
              "'>Cargo</th></tr>" +
              "<tr class='tr" +
              cont +
              "'><td class='tr" +
              cont +
              "' > <input type='text' id='idtb" +
              cont +
              "' value=" +
              element.id +
              " disabled='disabled'>   </td> " +
              "<td> <input type='text' id='enombre" +
              cont +
              "' class='form-control input-sm tr" +
              cont +
              "'  value='" +
              element.nombres_apellidos +
              "'  > </td>" +
              "<td> <input type='text' id='ecargo" +
              cont +
              "' class='form-control input-sm tr" +
              cont +
              "' value='" +
              element.cargo +
              "'  > </td>" +
              "</tr><tr class='tr" +
              cont +
              "'>" +
              "<th class='tr" +
              cont +
              "'>Teléfono</th><th class='tr" +
              cont +
              "'>Celular</th>" +
              "</tr><tr class='tr" +
              cont +
              "'>" +
              "<td> <input type='number' id='etelefono" +
              cont +
              "' class='form-control input-sm tr" +
              cont +
              "' value='" +
              element.telefono +
              "' >  </td>" +
              "<td> <input type='number' id='ecelu" +
              cont +
              "' class='form-control input-sm tr" +
              cont +
              "' value='" +
              element.celular +
              "' >  </td>" +
              "</tr><tr class='tr" +
              cont +
              "'>" +
              "<th class='tr" +
              cont +
              "'>Correo</th><th class='tr" +
              cont +
              "'>Critica</th>" +
              "</tr><tr class='tr" +
              cont +
              "'>" +
              "<td> <input type='text' id='ecorreo" +
              cont +
              "' class='form-control input-sm tr" +
              cont +
              "' value='" +
              element.correo +
              "'>  </td>" +
              "<td> <input type='text' id='ecriti" +
              cont +
              "' class='form-control input-sm tr" +
              cont +
              "' value='" +
              element.inf_critica +
              "'  >  </td>" +
              "</tr><tr class='tr" +
              cont +
              "'>" +
              "<th class='tr" +
              cont +
              "'>Referencia</th>" +
              "<td colspan='2'> <input type='text' id='erefe" +
              cont +
              "' class='form-control input-sm tr" +
              cont +
              "'  value='" +
              element.referencias +
              "' > </td>" +
              '<td class="tr' +
              cont +
              '">' +
              ch +
              '<input type="hidden" id="sy' +
              cont +
              '" value="1"></td>' +
              "</tr>";
            $("#etbcontact").append(tabla);
            $("#ecant_contacto").val(cont);
          });
        }
        //Datos financieros propietarios - poseedor
        $(".edicion_dato_financiero").show();
        if (data.resultfinan) {
          var contu = 0;
          var contador_global1 = 0;
          $("#tb_cuenta_finan").html("");
          data.resultfinan.forEach(function (element, index) {
            contu++;
            contador_global1 = contador_global1 + 1;
            var identificador = id_proveedor + contu;
            resta = contador_global1 - 1;

            var typecount = '<option value="1">Cuenta Ahorros</option>' + '<option value="2">Cuenta Corriente</option>';
            var btn_upda =
              '<input type="button" id="upda' +
              contu +
              '" class="btn-primary btn-xs ps" value="Update" onclick="update_cuenta(' +
              contu +
              "," +
              element.id +
              ')">';
            var banco =
              "<select id='banco" +
              contu +
              "'  class='form-control input-xs bancos' style='font-size:8pt; width:220px; background-color:white;'>" +
              '<option value="" readonly="readonly">Seleccione</option></select>';
            //$(".bancos").html('');
            $("#tb_cuenta_finan").append(
              "<tr>" +
                '<td><select id="eactividadciu' +
                contu +
                '" class="form-control input-sm"></select></td>' +
                '<td><select id="eobligacion' +
                contu +
                '" class="form-control input-sm"></select> </td>' +
                "<td>" +
                banco +
                "</td>" +
                '<td><select id="etipocuenta' +
                contu +
                '" class="form-control input-sm">' +
                typecount +
                "</select></td>" +
                '<td><input type="number" id="enumcuenta' +
                contu +
                '" class="form-control input-sm efinan"  value="' +
                element.numero_cuenta +
                '" ></td>' +
                "<td>" +
                btn_upda +
                "</td>" +
                "</tr>",
            );
            $("#banco" + contu + "").html('<option value="">Seleccione</option>');
            $("#eactividadciu" + contu + "").html('<option value="">Seleccione</option>');
            $("#eobligacion" + contu + "").html('<option value="">Seleccione</option>');
            $("#etipocuenta" + contu + "").html('<option value="">Seleccione</option>');

            data.resultbancos.forEach(function (element, index) {
              $("#banco" + contu + "").append('<option value="' + element.id + '">' + element.nombre + "</option>");
            });
            data.resultciiu.forEach(function (element, index) {
              $("#eactividadciu" + contu + "").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
            });
            data.resultobligaciones.forEach(function (element, index) {
              $("#eobligacion" + contu + "").append('<option value="' + element.id + '">' + element.descripcion + "</option>");
            });
            $("#banco" + contu + " option[value=" + element.banco + "]").attr("selected", true);
            $("#eactividadciu" + contu + " option[value=" + element.actividad_economica + "]").attr("selected", true);
            $("#eobligacion" + contu + " option[value=" + element.obliga_tributaria + "]").attr("selected", true);
            $("#etipocuenta" + contu + " option[value=" + element.tipo_cuenta + "]").attr("selected", true);
          });
        } else {
          $(".efinan").val("");
          $(".edicion_dato_financiero").hide();
          $("#tb_cuenta_finan").html("");
        }

        //DOCUMENTOS
        //documentos acuerdos
        if (data.result[0].name_acuerdo1 != "" && data.result[0].name_acuerdo1 != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_acuerdo1 +
            "/" +
            data.result[0].name_acuerdo1 +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#acuerdo1").html(docu);
        } else {
          $("#acuerdo1").html('<p class="text-danger">No existe archivo</p>');
        }
        if (data.result[0].name_acuerdo2 != "" && data.result[0].name_acuerdo2 != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_acuerdo2 +
            "/" +
            data.result[0].name_acuerdo2 +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#acuerdo2").html(docu);
        } else {
          $("#acuerdo2").html('<p class="text-danger">No existe archivo</p>');
        }
        if (data.result[0].name_acuerdo3 != "" && data.result[0].name_acuerdo3 != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_acuerdo3 +
            "/" +
            data.result[0].name_acuerdo3 +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#acuerdo3").html(docu);
        } else {
          $("#acuerdo3").html('<p class="text-danger">No existe archivo</p>');
        }
        if (data.result[0].name_acuerdo4 != "" && data.result[0].name_acuerdo4 != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_acuerdo4 +
            "/" +
            data.result[0].name_acuerdo4 +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#acuerdo4").html(docu);
        } else {
          $("#acuerdo4").html('<p class="text-danger">No existe archivo</p>');
        }
        //documento soporte - cedulas
        if (data.result[0].documentos_soporte != "" && data.result[0].documentos_soporte != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].documentos_soporte +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#e_caja_cedula").html(docu);
        } else {
          $("#e_caja_cedula").html('<p class="text-danger">No existe archivo</p>');
        }
        //documento licencia
        if (data.result[0].n_docu_licencia != "" && data.result[0].n_docu_licencia != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].subir_licencia +
            "/" +
            data.result[0].n_docu_licencia +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#licen1").html(docu);
        } else {
          $("#licen1").html('<p class="text-danger">No existe archivo</p>');
        }
        //documento rut
        if (data.result[0].n_docu_rut != "" && data.result[0].n_docu_rut != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].documento_rut +
            "/" +
            data.result[0].n_docu_rut +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#rut1").html(docu);
        } else {
          $("#rut1").html('<p class="text-danger">No existe archivo</p>');
        }

        //documento eps
        if (data.result[0].n_docu_eps != "" && data.result[0].n_docu_eps != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].documento_eps +
            "/" +
            data.result[0].n_docu_eps +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#eps1").html(docu);
        } else {
          $("#eps1").html('<p class="text-danger">No existe archivo</p>');
        }

        //documento Arl
        /*if(data.result[0].n_docu_arl!='' && data.result[0].n_docu_arl!= null){
					docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].documento_arl+'/'+data.result[0].n_docu_arl+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
							'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
							'</span>'+
						'</a>';
						$("#arl1").html(docu);
				}else{
					$("#arl1").html('<p class="text-danger">No existe archivo</p>');
				}*/

        //documento mercancia peligrosa
        if (data.result[0].n_docu_curso != "" && data.result[0].n_docu_curso != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].carnet_curso +
            "/" +
            data.result[0].n_docu_curso +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#curso1").html(docu);
        } else {
          $("#curso1").html('<p class="text-danger">No existe Archivo</p>');
        }

        //documento indumentaria
        if (data.result[0].name_cindu != "" && data.result[0].name_cindu != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_indumentaria +
            "/" +
            data.result[0].name_cindu +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#indu1").html(docu);
        } else {
          $("#indu1").html('<p class="text-danger">No existe archivo</p>');
        }

        //documento foto frontal
        if (data.result[0].name_cfrontal != "" && data.result[0].name_cfrontal != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_conductor +
            "/" +
            data.result[0].name_cfrontal +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#frontal1").html(docu);
        } else {
          $("#frontal1").html('<p class="text-danger">No existe archivo</p>');
        }

        //documento foto derecha
        if (data.result[0].name_cderecha != "" && data.result[0].name_cderecha != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_derecha +
            "/" +
            data.result[0].name_cderecha +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#derecha1").html(docu);
        } else {
          $("#derecha1").html('<p class="text-danger">No existe archivo</p>');
        }

        //documento foto izquierda
        if (data.result[0].name_cizquierda != "" && data.result[0].name_cizquierda != null) {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_izquierda +
            "/" +
            data.result[0].name_cizquierda +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#izquierda1").html(docu);
        } else {
          $("#izquierda1").html('<p class="text-danger">No existe acrhivo</p>');
        }
        //DOCUMENTO CERTIFICADO, FOTOS CONDUCTOR, FOTOS INDUMENTARIA
      } else {
        console.log("no hay datos");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("error dato proveedor");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

$(document).on("click", ".borrar2", function (event) {
  event.preventDefault();
  $(this).closest("tr").remove();
  var v = this.id;
  //alert('v'+v);
  var x = v.substr(1, 1);
  x = parseInt(x);
  //$("#sk"+x).val();
  var d = $("#sk" + x).val();
});

var m = 0;
var n = 0;
function agregar_contactom() {
  m++;
  n = n + 1;

  var ch = '<input type="button" id="p' + m + '" class="btn-primary" value="Remover"  onclick="delete_cont(this.id,' + m + ')"  >';

  var contace =
    '<tr class="trc' +
    m +
    '">' +
    //'<th>#</th><th>Nombres</th><th>Cargo</th><th>Teléfono</th></tr><tr>'+
    '<td colspan="2" class="info trc' +
    m +
    '" ><label>N°</label><p class="text-center text-primary"><strong>' +
    m +
    '</strong></p><input type="hidden" id="sk' +
    m +
    '" value="1" class="form-control input-sm">  </td>' +
    '</tr><tr class="trc' +
    m +
    '">' +
    '<td colspan="2" class="trc' +
    m +
    '"><label>Nombres</label> <input type="text" id="nombres' +
    m +
    '" class="form-control input-sm trc' +
    m +
    '"></td>' +
    '</tr><tr class="trc' +
    m +
    '">' +
    '<td class="trc' +
    m +
    '"><label>Cargo</label> <input type="text" id="cargo' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></td>' +
    '<td class="trc' +
    m +
    '"><label>Teléfono</label> <input type="number" id="fijo' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></td>' +
    '<tr class="trc' +
    m +
    '">' +
    '<td class="trc' +
    m +
    '"><label>Celular</label> <input type="number" id="celular' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '">  </td>' +
    '<td class="trc' +
    m +
    '"><label>Correo</label>   <input type="email" id="correo' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '" > </td>' +
    "</tr>" +
    '<tr class="trc' +
    m +
    '">' +
    '<td class="trc' +
    m +
    '"><label>Info. crítica</label> <textarea id="critica' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></textarea>   </td>' +
    '<td class="trc' +
    m +
    '"><label>Referencia</label> <textarea id="refe' +
    m +
    '" class="form-control input-xs trc' +
    m +
    '"></textarea>  </td>' +
    "</tr>" +
    '<tr class="trc' +
    m +
    '"><td colspan="2">' +
    ch +
    "</td></tr>" +
    "</tr>";

  $("#mas_contactos").append(contace);
  $("#more_contactos").val(n);
}

//delete agregar
function delete_cont(btn, id) {
  event.preventDefault();
  $(".trc" + id).remove();
  $(this).closest("tr").remove();
}

//delete actualizar
function delete_asocia(btn, id) {
  var idtb = $("#idtb" + id + "").val();
  var delete_conta = {
    idtb: idtb,
    action: "eliminar_contacto_proveedor",
  };

  $.ajax({
    url: $("#id_url_ajax").val() + "libs/hojas_de_vida_ajax.php",
    type: "POST",
    data: delete_conta,
    dataType: "json",
    success: function (data) {
      event.preventDefault();
      $(".tr" + id).remove();
      $(this).closest("tr").remove();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      alert("No elimino contacto");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

function historicodatosProveedor(id) {
  // alert('historico proveedores');
  // alert(id);
  //datos de la tabla
  var datos = {
    id: id,
    action: "historicoproveedor",
  };
  $("#vehiculo").html("");
  $.ajax({
    url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
    type: "POST",
    data: datos,
    dataType: "json",
    success: function (data) {
      // console.log('hay historico');
      console.log(data);
      if (data) {
        // console.log('data si');
        if (data.result) {
          data.result.forEach(function (element, index) {
            $("#vehiculo").append(
              "<tr>" +
                "<td>" +
                element.estado +
                "</td>" +
                "<td>" +
                element.cod_vehiculo +
                "</td>" +
                "<td>" +
                element.fecha_anterior +
                "</td>" +
                "<td>" +
                element.fecha_actual +
                "</td>" +
                "</tr>",
            );
          });
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("no hay historico");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}
//VER PROVEEDOR ANTERIOR
function verProveedor(id_proveedor) {
  //alert(id_proveedor);
  var datos = {
    id: id_proveedor,
    action: "traer_datos_proveedorver",
  };
  $("#v_Conductor").html("");
  $("#v_poseedor_vehiculo").html("");
  $("#v_propietario_vehiculo").html("");
  $("#v_Proveedor").html("");
  $(".finan").val("");
  $.ajax({
    url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
    type: "POST",
    data: datos,
    dataType: "json",
    success: function (data) {
      if (data.result) {
        Consulta_Dato_Rndc(data.result[0].tipo_documento, data.result[0].numero_documento, data.result[0].digito_verificacion);
        Consulta_Dato_Oet(data.result[0].tipo_documento, data.result[0].numero_documento, data.result[0].digito_verificacion);
        //tipo de actividades
        data.result9.forEach(function (element, index) {
          actividad = element.acti;
          //$("#e_primer_apellido").val(data.result[0].acti);
          if (actividad == "Conductor") {
            $("#v_Conductor").prop("checked", true);
          }
          if (actividad == "Poseedor Vehiculo") {
            $("#v_poseedor_vehiculo").prop("checked", true);
          }
          if (actividad == "Propietario Vehiculo") {
            $("#v_propietario_vehiculo").prop("checked", true);
          }
          if (actividad == "Proveedor") {
            $("#v_Proveedor").prop("checked", true);
          }
        });
        //datos financieros
        if (data.result4) {
          $("#ver_cuenta").html("");
          data.result4.forEach(function (element, index) {
            var tipo = "";
            if (element.tipo_cuenta == "1") {
              tipo = "Cuenta Ahorros";
            } else {
              tipo = "Cuenta Corriente";
            }
            $("#ver_cuenta").append(
              "<tr>" +
                "<td>" +
                element.economi +
                "</td>" +
                "<td>" +
                element.descripcion +
                "</td>" +
                "<td>" +
                element.nombre +
                "</td>" +
                "<td>" +
                tipo +
                " <br> " +
                element.numero_cuenta +
                "</td>" +
                "</tr>",
            );
          });
        } else {
          $("#ver_cuenta").html("");
        }
        //datos generales
        $("#titulo_ver").text(data.result[0].nombre + "-" + data.result[0].numero_documento);
        $("#v_tipo_documento").val(data.result[0].tipo_documento);
        $("#v_numero_documento").val(data.result[0].numero_documento);
        $("#v_digito_verificacion").val(data.result[0].digito_verificacion);
        $("#v_tipo_regimen").val(data.result[0].tipo_regimen);
        $("#v_tipo_identificacion").val(data.result[0].tipo_identificacion);
        $("#v_nombre").val(data.result[0].nombre);
        $("#v_ape1").val(data.result[0].apellido1);
        $("#v_ape2").val(data.result[0].apellido2);
        $("#v_abreviatura").val(data.result[0].abreviatura);
        $("#v_contacto").val(data.result[0].contacto);
        $("#v_direccion").val(data.result[0].direccion);
        $("#v_email").val(data.result[0].email);
        $("#v_estado").val(data.result[0].estado);
        $("#v_municipio").val(data.result[0].cipio);
        $("#v_id_municipio").val(data.result[0].cipio);
        $("#v_categoria_licencia").val(data.result[0].rndc_categoria_licencia);
        $("#v_numero_licencia").val(data.result[0].rndc_numero_licencia);
        $("#v_fechavencelicencia").val(data.result[0].rndc_vencimiento_licencia);
        $("#v_eps").val(data.result[0].nombre_eps); //seguridad social
        $("#v_fechaeps").val(data.result[0].fecha_vence_eps); //seguridad social
        //$("#v_arl").val(data.result[0].nombre_arl);
        //$("#v_fechaarl").val(data.result[0].fecha_vence_arl);
        $("#v_curso").val(data.result[0].nombre_entidad);
        $("#v_fechacurso").val(data.result[0].vence_curso);
        // //
        $("#v_sexo").val(data.result[0].sexo);
        $("#v_fecha_nacimiento").val(data.result[0].fecha_nacimiento);
        $("#v_sangre").val(data.result[0].grupo_sanguineo);
        $("#v_ingreso").val(data.result[0].fecha_ingreso);
      } else {
        console.log("no hay datos");
      }
      //datos del proveedor - internacional
      if (data.resulta != null) {
        var tipo = data.resulta[0].cod_tipo_proveedor;
        var t = "";
        if (tipo == 1) {
          t = "Nacional";
        }

        if (tipo == 2) {
          t = "Internacional";
        }
        $("#v_proveedorinternacional").val(t);
        $("#v_localizacion").val(data.resulta[0].cipio);
        $("#v_zona").val(data.resulta[0].descripcion_zona);
        $("#v_tiposervice").val(data.resulta[0].tipo_servicio);
        var servi = data.resulta[0].tipo_servicio;
        if (servi == "Transporte") {
          $("#v_de1").val(data.resulta[0].tipo_servicio_detalle1);
          $("#v_de2").val(data.resulta[0].tipo_servicio_detalle2);
        } else {
          $("#v_de1").val(data.resulta[0].tipo_servicio_detalle1);
          $("#v_de2").val("");
        }
      }
      $("#tcontactos").html("");
      if (data.resultb != null) {
        data.resultb.forEach(function (element, index) {
          $("#tcontactos").append(
            "<tr>" +
              "<td>" +
              element.nombres_apellidos +
              "</td>" +
              "<td>" +
              element.cargo +
              "</td>" +
              "<td>" +
              element.telefono +
              "</td>" +
              "<td>" +
              element.celular +
              "</td>" +
              "<td>" +
              element.correo +
              "</td>" +
              "<td>" +
              element.inf_critica +
              "</td>" +
              "<td>" +
              element.referencias +
              "</td>" +
              +"</tr>",
          );
        });
      }
      //datos del conductor
      var cont = 0,
        i;
      if (data.result2) {
        data.result2.forEach(function (element, index) {
          cont++;
          $("#v_referencias_empresariales" + cont).val(element.nombre_empresa);
          $("#v_fechari" + cont).val(element.fecha_ingreso);
          $("#v_fecharr" + cont).val(element.fecha_retiro);
          $("#v_rcontac" + cont).val(element.persona_contacto);
          $("#v_rcelu" + cont).val(element.celular);
          $("#v_rcargo" + cont).val(element.cargo);
          $("#v_ranti" + cont).val(element.antiguedad);

          if (element.name_documento != "" && element.name_documento != null) {
            docu =
              '<a  href="http://localhost/mvcLuisMiguel/' +
              element.documento_empresarial +
              "/" +
              element.name_documento +
              '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
              '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
              "</span>" +
              "</a>";
            $("#v_laboral" + cont).html(docu);
            //$("#idlab"+cont).val(element.id);
          } else {
            $("#v_laboral" + cont).html('<p class="text-danger">No existe archivo</p>');
          }
        });
        //}

        var contp = 0;
        if (data.result3) {
          //alert('si referencia personal');
          data.result3.forEach(function (element, index) {
            contp++;
            //$("#e_parenp"+contp).val(element.);
            var pare = element.parentezco;
            if (pare == 0) {
              $("#v_pare" + contp).val("SIN REGISTRAR");
            }
            if (pare == 1) {
              $("#v_pare" + contp).val("Amigo/a");
            }

            if (pare == 2) {
              $("#v_pare" + contp).val("Hermano/a");
            }

            if (pare == 3) {
              $("#v_pare" + contp).val("Padre");
            }

            if (pare == 4) {
              $("#v_pare" + contp).val("Madre");
            }

            if (pare == 5) {
              $("#v_pare" + contp).val("Tio/a");
            }

            if (pare == 6) {
              $("#v_pare" + contp).val("Sobrino/a");
            }

            if (pare == 7) {
              $("#v_pare" + contp).val("Hijo/a");
            }

            if (pare == 8) {
              $("#v_pare" + contp).val("Espaso/a");
            }
            $("#v_referencias_personales" + contp).val(element.nombre_personal);
            $("#v_fechap" + contp).val(element.fecha_personal);
            $("#v_ptel" + contp).val(element.tel_personal);

            if (element.name_documento != "" && element.name_documento != null) {
              docu =
                '<a  href="http://localhost/mvcLuisMiguel/' +
                element.documento_personal +
                "/" +
                element.name_documento +
                '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
                "</span>" +
                "</a>";
              $("#v_personal" + contp).html(docu);
              //$("#idper"+contp).val(element.id);
            } else {
              $("#v_personal" + contp).html('<p class="text-danger">No existe archivo</p>');
            }
          });
        }
        //DOCUMENTOS
        var docu = "";
        if (data.result[0].documentos_soporte != null && data.result[0].documentos_soporte != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].documentos_soporte +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_caja_documentos").html(docu);
        } else {
          $("#v_caja_documentos").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].name_cfrontal != null && data.result[0].name_cfrontal != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_conductor +
            "/" +
            data.result[0].name_cfrontal +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_frente").html(docu);
        } else {
          $("#v_frente").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].name_cderecha != null && data.result[0].name_cderecha != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_derecha +
            "/" +
            data.result[0].name_cderecha +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_derecha").html(docu);
        } else {
          $("#v_derecha").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].name_cizquierda != null && data.result[0].name_cizquierda != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_izquierda +
            "/" +
            data.result[0].name_cizquierda +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_izquierda").html(docu);
        } else {
          $("#v_izquierda").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].name_cindu != null && data.result[0].name_cindu != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].foto_indumentaria +
            data.result[0].name_cindu +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_indumentaria").html(docu);
        } else {
          $("#v_indumentaria").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].n_docu_licencia != null && data.result[0].n_docu_licencia != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].subir_licencia +
            data.result[0].n_docu_licencia +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_licencia").html(docu);
        } else {
          $("#v_licencia").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].n_docu_eps != null && data.result[0].n_docu_eps != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].documento_eps +
            "/" +
            data.result[0].n_docu_eps +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_planilla").html(docu);
        } else {
          $("#v_planilla").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].n_docu_curso != null && data.result[0].n_docu_curso != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].carnet_curso +
            data.result[0].n_docu_curso +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_curso").html(docu);
        } else {
          $("#v_curso").html('<p class="text-danger">No existe archivo</p>');
        }

        if (data.result[0].n_docu_rut != null && data.result[0].n_docu_rut != "") {
          docu =
            '<a  href="http://localhost/mvcLuisMiguel/' +
            data.result[0].documento_rut +
            data.result[0].n_docu_rut +
            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
            "</span>" +
            "</a>";
          $("#v_certificado").html(docu);
        } else {
          $("#v_certificado").html('<p class="text-danger">No existe archivo</p>');
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("error dato proveedor");
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//Consulta al  Ministerio
function Consulta_Dato_Rndc(tipo, numero, digito) {
  $("#panel_rndc").html("");
  var paquete_transmite = "documento=" + numero + "&tdoc=" + tipo + "&digitove=" + digito;
  $.post(
    $("#id_url_ajax").val() + "web_service/Consulta_Tercero_Rndc",
    paquete_transmite,
    function (data) {
      var tablas_locales = "";
      if (data.status == "true") {
        $("#panel_rndc").html('<p class="text-center text-success">' + data.resultado + "</p>");
      } else if (data.status == "false") {
        $("#panel_rndc").html('<p class="text-center text-danger">' + data.resultado + "</p>");
      }
    },
    "json",
  );
}

function Consulta_Dato_Oet(tipo, numero, digito) {
  $("#panel_oet").html("");
  clase = 1;
  recurso = 1;
  valor = "&dato_recurso=" + numero;
  filtro = 5; //poseedor
  var paquete = "clase_recurso=" + recurso + "&recurso=" + filtro + valor;
  //Consulta_Recurso_Avansat
  $.post(
    $("#id_url_ajax").val() + "integrar_oet/Consulta_Recurso",
    paquete,
    function (data) {
      console.log(data);
      if (data.status == true || data.status == "true") {
        $("#panel_oet").html('<p class="text-center text-success">' + data.resultado + "</p>");
      } else if (data.status == false || data.status == "false") {
        $("#panel_oet").html('<p class="text-center text-danger">' + data.resultado + "</p>");
      }
    },
    "json",
  );
}

//EDITAR EL FORMULARIO DE PROVEEDOR
function editarProveedornew() {
  //VALIDACIONES
  $(".nexos-messages_editap").html("");
  // Se valida contenido del formulario
  //alert('entro a editarProveedor');
  var msg_error = "";
  var flag_primer_apellido = true;
  var flag_abreviatura = true;
  var flag_telefono = true;
  var tipo_actividad = false;
  $(".e_tipo_actividad").each(function () {
    if ($(this).is(":checked")) {
      tipo_actividad = true;
      if ($(this).attr("id") == "e_Conductor") {
        if (!$("#e_categoria").val()) {
          msg_error += "<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_categoria");
        } else {
          RemueveFoco("#e_categoria");
        }
        if (!$("#e_num_licencia").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_num_licencia");
        } else {
          RemueveFoco("#e_num_licencia");
        }
        if (!$("#e_vence_licencia").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_vence_licencia");
        } else {
          var fhoy = moment();
          if ($("#e_vence_licencia").val() < fhoy) {
            msg_error += "<p>El campo <strong>Vencimiento Licencia</strong> debe ser mayor de la fecha actual para poder editar el Proveedor.</p>";
            AplicaFoco("#e_vence_licencia");
          } else {
            RemueveFoco("#e_num_licencia");
          }
        }
        if (!$("#e_celular2").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Celular Contacto 2</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_celular2");
        } else {
          RemueveFoco("#e_celular2");
        }
        if (!$("#e_referencias_empresariales1").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Empresa 1</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_referencias_empresariales1");
        } else {
          RemueveFoco("#e_referencias_empresariales1");
        }
        if (!$("#e_celular_ref1").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Celular Empresa 1</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_celular_ref1");
        } else {
          RemueveFoco("#e_celular_ref1");
        }
        if (!$("#e_referencias_empresariales2").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Empresa 2</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_referencias_empresariales2");
        } else {
          RemueveFoco("#e_referencias_empresariales2");
        }
        if (!$("#e_celular_ref2").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Celular Empresa 2</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_celular_ref2");
        } else {
          RemueveFoco("#e_celular_ref2");
        }
        if (!$("#e_referencias_empresariales3").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Empresa 3</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_referencias_empresariales3");
        } else {
          RemueveFoco("#e_referencias_empresariales3");
        }
        if (!$("#e_celular_ref3").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Celular Empresa 3</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_celular_ref3");
        } else {
          RemueveFoco("#e_celular_ref3");
        }
        if (!$("#e_sangre").val()) {
          msg_error += "<p>Debe seleccionar el <strong>Grupo sanguíneo</strong> para poder editar el Proveedor.</p>";
          AplicaFoco("#e_sangre");
        } else {
          RemueveFoco("#e_sangre");
        }
        if ($("#e_tipo_documento").val() == "NIT") {
          msg_error += "<p>No se puede crear un conductor registrado con NIT.</p>";
          AplicaFoco("#e_tipo_documento");
        } else {
          RemueveFoco("#e_tipo_documento");
        }

        name_acuerdo = document.getElementById("acuerdo1").innerHTML;
        if (!$("#e_acuerdo1").val() && name_acuerdo == '<p class="text-danger">No existe archivo</p>') {
          msg_error += "<p>Debe seleccionar el <strong>Acuerdo de seguridad</strong> para poder editar el conductor</p>";
          AplicaFoco("#e_acuerdo1");
        } else {
          RemueveFoco("#e_acuerdo1");
        }

        if (!$("#e_sexo").val()) {
          msg_error += "<p>Debe seleccionar el <strong>Género</strong> para poder editar el conductor</p>";
          AplicaFoco("#e_sexo");
        } else {
          RemueveFoco("#e_sexo");
        }
      }
      if ($(this).attr("id") == "e_poseedor_vehiculo" || $(this).attr("id") == "e_propietario_vehiculo") {
        /*if(!$("#eactividadciu").val()){
					msg_error+= "<p>Debe seleccionar una <strong>Actividad economica CIIU</strong> para poder editar el Proveedor.</p>";
					AplicaFoco("#eactividadciu");
				}else{
					RemueveFoco("#eactividadciu");
				}
				if(!$("#eobligacion").val()){
					msg_error+= "<p>Debe seleccionar una <strong>Obligación Tributaria</strong> para poder editar el Proveedor.</p>";
					AplicaFoco("#eobligacion");
				}else{
					RemueveFoco("#eobligacion");
				}
				if(!$("#ebanco").val()){
					msg_error+= "<p>Debe seleccionar un <strong>Banco</strong> para poder editar el Proveedor.</p>";
					AplicaFoco("#ebanco");
				}else{
					RemueveFoco("#ebanco");
				}
				if(!$("#etipocuenta").val()){
					msg_error+= "<p>Debe seleccionar un <strong>Tipo cuenta</strong> para poder editar el Proveedor.</p>";
					AplicaFoco("#etipocuenta");
				}else{
					RemueveFoco("#etipocuenta");
				}
				if(!$("#enumcuenta").val()){
					msg_error+= "<p>Debe seleccionar un <strong>Número cuenta</strong> para poder editar el Proveedor.</p>";
					AplicaFoco("#enumcuenta");
				}else{
					RemueveFoco("#enumcuenta");
				}*/
      }
    }
  });
  if (!tipo_actividad) {
    msg_error += "<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder editar el Proveedor.</p>";
  }
  if (!$("#e_tipo_documento").val()) {
    msg_error += "<p>Debe seleccionar un <strong>Tipo de documento</strong> para poder editar el Proveedor.</p>";
    if (!$("#e_contacto").val() && !$("#e_celular").val()) {
      flag_telefono = false;
      var msg_error_telefono =
        "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
    }
  } else {
    if ($("#e_tipo_documento").val() == "Cedula de Ciudadania" || $("#e_tipo_documento").val() == "Cedula de Extranjeria") {
      if (!$("#e_apellido1").val()) {
        msg_error += "<p>Debe diligenciar el campo <strong>Primer apellido</strong> para poder editar el proveedor.</p>";
      }
      if (!$("#e_celular").val()) {
        flag_telefono = false;
        var msg_error_telefono = "<p>Debe diligenciar el campo<strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
      }
    }
    if ($("#e_tipo_documento").val() == "NIT") {
      if (!$("#e_contacto").val()) {
        flag_telefono = false;
        var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder editar el Proveedor.</p>";
      }
    }
  }
  if (!$("#e_numero_documento").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Número de documento</strong> para poder editar el Proveedor.</p>";
  }

  if (!$("#e_rndc_nombre").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder editar el Proveedor.</p>";
    AplicaFoco("#e_rndc_nombre");
  } else {
    RemueveFoco("#e_rndc_nombre");
  }

  if (!$("#e_direccion").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder editar el Proveedor.</p>";
    AplicaFoco("#e_direccion");
  } else {
    RemueveFoco("#e_direccion");
  }

  if (!$("#e_municipio").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Municipio</strong> para poder editar el Proveedor.</p>";
    AplicaFoco("#e_municipio");
  } else {
    RemueveFoco("#e_municipio");
  }

  /*var name=$("#enombre1").val();
	msg_error+=name;*/

  if (!msg_error) {
    // alert('actualizar el proveedor');
    var data = null;
    data = new FormData();
    //ARCHIVOS PARA ACTUALIZAR
    //documento soporte
    var archivos = document.getElementById("e_documentos").files;
    for (var x = 0; x < archivos.length; x++) {
      data.append("e_documentos" + x, archivos[x]);
    }

    //Datos
    data.append("accion", "editarProveedornew");
    data.append("id_proveedor", $("#eusuario").val());
    data.append("nombre", $("#e_rndc_nombre").val());
    data.append("apellido1", $("#e_apellido1").val());
    data.append("apellido2", $("#e_apellido2").val());
    data.append("abreviatura", $("#e_abreviatura").val());
    data.append("tipo_docu", $("#e_tipo_documento").val());
    data.append("num_docu", $("#e_numero_documento").val());
    data.append("tipo_identificacion", $("#e_tipo_identificacion").val());
    data.append("e_contacto", $("#e_contacto").val());
    data.append("e_celular", $("#e_celular").val());
    data.append("email", $("#e_email").val());
    data.append("estado", $("#e_estado").val());
    data.append("municipio", $("#e_municipio").val());
    data.append("direccion", $("#e_direccion").val());
    data.append("digito", $("#e_digito_verificacion").val());
    data.append("ecedula", $("#textocedulas").val());
    //datos de licencia
    data.append("e_categoria", $("#e_categoria").val());
    data.append("e_num_licencia", $("#e_num_licencia").val());
    data.append("e_vence_licencia", $("#e_vence_licencia").val());
    data.append("conductor", 0);
    data.append("hacer", 0);
    data.append("edicion_financiera", 0);

    $(".e_tipo_actividad").each(function () {
      if ($(this).is(":checked")) {
        tipo_actividad = true;
        //if( $(this).attr("id") == "e_Conductor" ){
        if ($("#e_Conductor").is(":checked")) {
          //referencia laboral 1
          var laboral = document.getElementById("e_documento_referencia1").files;
          for (var a = 0; a < laboral.length; a++) {
            data.append("e_documento_referencia1" + a, laboral[a]);
          }

          //referencia 2
          var laborald = document.getElementById("e_documento_referencia2").files;
          for (var t = 0; t < laborald.length; t++) {
            data.append("e_documento_referencia2" + t, laborald[t]);
          }

          //referencia 3
          var laboralt = document.getElementById("e_documento_referencia3").files;
          for (var q = 0; q < laboralt.length; q++) {
            data.append("e_documento_referencia3" + q, laboralt[q]);
          }
          //personal 1
          var personalu = document.getElementById("e_documento_personal1").files;
          for (var b = 0; b < personalu.length; b++) {
            data.append("e_documento_personal1" + b, personalu[b]);
          }
          //personal 2
          var personald = document.getElementById("e_documento_personal2").files;
          for (var c = 0; c < personald.length; c++) {
            data.append("e_documento_personal2" + c, personald[c]);
          }
          //eps
          var eps = document.getElementById("e_docu_eps").files;
          for (var d = 0; d < eps.length; d++) {
            data.append("e_docu_eps" + d, eps[d]);
          }
          //arl
          /*var arl = document.getElementById('e_docu_arl').files;
						for(var e = 0; e < arl.length; e++){
							data.append("e_docu_arl" + e, arl[e]);
					}	*/
          //curso
          var curso = document.getElementById("e_docu_curso").files;
          for (var f = 0; f < curso.length; f++) {
            data.append("e_docu_curso" + f, curso[f]);
          }

          //rut
          var rut = document.getElementById("e_docu_rut").files;
          for (var r = 0; r < rut.length; r++) {
            data.append("e_docu_rut" + r, rut[r]);
          }
          //licencia
          var lice = document.getElementById("e_docu_lice").files;
          for (var l = 0; l < lice.length; l++) {
            data.append("e_docu_lice" + l, lice[l]);
          }
          //fotos conductor fontral
          var conductor = document.getElementById("e_foto_conductor").files;
          for (var g = 0; g < conductor.length; g++) {
            data.append("e_foto_conductor" + g, conductor[g]);
          }
          //fotos conductor derecha

          var conductord = document.getElementById("e_foto_derecha").files;
          for (var x = 0; x < conductord.length; x++) {
            data.append("e_foto_derecha" + x, conductord[x]);
          }

          //fotos conductor izquierda
          var conductori = document.getElementById("e_foto_izquierda").files;
          for (var z = 0; z < conductori.length; z++) {
            data.append("e_foto_izquierda" + z, conductori[z]);
          }
          //fotos indumentaria
          var cursoi = document.getElementById("e_foto_indume").files;
          for (var f = 0; f < cursoi.length; f++) {
            data.append("e_foto_indume" + f, cursoi[f]);
          }
          //licencia de conduccion
          var licen = document.getElementById("e_docu_licencia").files;
          for (var h = 0; h < licen.length; h++) {
            data.append("e_docu_licencia" + h, licen[h]);
          }

          //acuerdos

          var acuerdo1 = document.getElementById("e_acuerdo1").files;
          for (var g = 0; g < acuerdo1.length; g++) {
            data.append("e_acuerdo1" + g, acuerdo1[g]);
          }

          data.append("conductor", 1);
          data.append("hacer", 9);
          data.append("eps", $("#e_name_eps").val());
          data.append("venceeps", $("#e_vence_eps").val());
          //data.append("arl", $("#e_name_arl").val());
          //data.append("vencearl", $("#e_vence_arl").val());
          data.append("nomenti", $("#e_nom_enti").val());
          data.append("vencecurso", $("#e_vence_curso").val());
          data.append("e_celular2", $("#e_celular2").val());
          //datos nuevos empresarial1
          data.append("e_id1", $("#e_idrefe1").val());
          data.append("e_referencias_empresariales1", $("#e_referencias_empresariales1").val());
          data.append("e_fecha_referencia1", $("#e_fecha_referencia1").val());
          data.append("e_fecha_retiro1", $("#e_fecha_retiro1").val());
          data.append("e_contacto_ref1", $("#e_contacto_ref1").val());
          data.append("e_celular_ref1", $("#e_celular_ref1").val());
          data.append("e_cargo_ref1", $("#e_cargo_ref1").val());
          data.append("e_anti_ref1", $("#e_anti_ref1").val());
          //ref2  empresarial2
          data.append("e_id2", $("#e_idrefe2").val());
          data.append("e_referencias_empresariales2", $("#e_referencias_empresariales2").val());
          data.append("e_fecha_referencia2", $("#e_fecha_referencia2").val());
          data.append("e_fecha_retiro2", $("#e_fecha_retiro2").val());
          data.append("e_contacto_ref2", $("#e_contacto_ref2").val());
          data.append("e_celular_ref2", $("#e_celular_ref2").val());
          data.append("e_cargo_ref2", $("#e_cargo_ref2").val());
          data.append("e_anti_ref2", $("#e_anti_ref2").val());
          //referencia empresarial 3
          data.append("e_id3", $("#e_idrefe3").val());
          data.append("e_referencias_empresariales3", $("#e_referencias_empresariales3").val());
          data.append("e_fecha_referencia3", $("#e_fecha_referencia3").val());
          data.append("e_fecha_retiro3", $("#e_fecha_retiro3").val());
          data.append("e_contacto_ref3", $("#e_contacto_ref3").val());
          data.append("e_celular_ref3", $("#e_celular_ref3").val());
          data.append("e_cargo_ref3", $("#e_cargo_ref3").val());
          data.append("e_anti_ref3", $("#e_anti_ref3").val());

          //referencia personal1
          data.append("refep1", $("#e_referencias_personales1").val());
          data.append("fechap1", $("#e_fecha_personal1").val());
          data.append("e_parenp1", $("#e_parenp1").val());
          data.append("e_telefonop1", $("#e_telefonop1").val());
          data.append("e_idp1", $("#e_idp1").val());
          //referencia personal2
          data.append("refep2", $("#e_referencias_personales2").val());
          data.append("fechap2", $("#e_fecha_personal2").val());
          data.append("e_parenp2", $("#e_parenp2").val());
          data.append("e_telefonop2", $("#e_telefonop2").val());
          data.append("e_idp2", $("#e_idp2").val());
          //data.append("e_ultimo_arl", $("#e_ultimo_arl").val());
          //data.append("e_ultimo_eps", $("#e_ultimo_eps").val());
          //demas datos
          data.append("e_sexo", $("#e_sexo").val());
          data.append("e_fecha_nacimiento", $("#e_fecha_nacimiento").val());
          data.append("e_ingreso", $("#e_ingreso").val());
          data.append("e_sangre", $("#e_sangre").val());
          data.append("e_civil", $("#e_civil").val());

          //capturar las rutas

          data.append("e_ruta_ref1", $("#e_ruta_ref1").val());
          data.append("e_ruta_ref2", $("#e_ruta_ref2").val());

          data.append("e_ruta_per1", $("#e_ruta_per1").val());
          data.append("e_ruta_per2", $("#e_ruta_per2").val());
          data.append("e_ruta_eps", $("#e_ruta_eps").val());
          data.append("e_ruta_arl", $("#e_ruta_arl").val());
          data.append("e_ruta_curso", $("#e_ruta_curso").val());
          data.append("e_ruta_fotos", $("#e_ruta_fotos").val()); //frontal

          data.append("e_ruta_indumentaria", $("#e_ruta_indumentaria").val());
          data.append("e_ruta_licencia", $("#e_ruta_licencia").val());

          //capturas nombres
          data.append("lab1n", $("#lab1n").val());
          data.append("lab2n", $("#lab2n").val());
          data.append("lab3n", $("#lab3n").val());
          data.append("per1n", $("#per1n").val());
          data.append("per2n", $("#per2n").val());
          data.append("epsname", $("#epsname").val());
          data.append("rutname", $("#rutname").val());
          data.append("arlname", "");
          data.append("licenname", $("#licenname").val());
          data.append("induname", $("#induname").val());
          data.append("frontalname", $("#frontalname").val());
          data.append("derechaname", $("#derechaname").val());
          data.append("izquierdaname", $("#izquierdaname").val());
          data.append("cursoname", $("#cursoname").val());
          //capturas id's

          data.append("id_conductor", $("#tb_dcondu").val());
          data.append("id_tbdetalle", $("#id_tbdetalle").val());
          data.append("idlab1", $("#idlab1").val());
          data.append("idlab2", $("#idlab2").val());
          data.append("idlab3", $("#idlab3").val());
          data.append("idper1", $("#idper1").val());
          data.append("idper2", $("#idper2").val());

          data.append("acuerdo1name", $("#acuerdo1name").val());
        }
      }
      //if( $(this).attr("id")=="e_Proveedor" ){
      if ($("#e_Proveedor").is(":checked")) {
        //data.append("accion", 'editarsolo_Proveedor');
        data.append("Proveedor", 8);
        data.append("id_proveedor", $("#eusuario").val());
        data.append("enacional", $("#enacional").is(":checked"));
        data.append("einternacional", $("#einternacional").is(":checked"));
        data.append("e_localizacion", $("#e_localizacion").val());
        data.append("e_zona", $("#e_zona").val());
        data.append("e_tiposervicio", $("#e_tiposervicio").val());
        data.append("edetalle1", $("#edetalle1").val());
        data.append("edetalle2", $("#edetalle2").val());
        data.append("hacer", 5);
        //data.append("conductor", 9);

        //actualizar contactos
        var c = $("#ecant_contacto").val();
        if (c > 0) {
          var i;
          for (i = 1; i <= c; i++) {
            if (typeof $("#sy" + i).val() !== "undefined") {
              var namen = $("#enombre" + i + "").val();
              var cargo = $("#ecargo" + i + "").val();
              var telefono = $("#etelefono" + i + "").val();
              var celular = $("#ecelu" + i + "").val();
              var correo = $("#ecorreo" + i + "").val();
              var critica = $("#ecriti" + i + "").val();
              var refe = $("#erefe" + i + "").val();
              var idtb = $("#idtb" + i + "").val();
              data.append("name", namen);
              data.append("cargo", cargo);
              data.append("telefono", telefono);
              data.append("celular", celular);
              data.append("correo", correo);
              data.append("critica", critica);
              data.append("refe", refe);
              data.append("idtb", idtb);
              data.append("hacer", 5);
            }
          }
        }
      }

      if ($("#e_poseedor_vehiculo").is(":checked") || $("#e_propietario_vehiculo").is(":checked")) {
        data.append("acticiuu", $("#eactividadciu").val());
        data.append("tributario", $("#eobligacion").val());
        data.append("banco", $("#ebanco").val());
        data.append("tipocuenta", $("#etipocuenta").val());
        data.append("numcuenta", $("#enumcuenta").val());
        data.append("edicion_financiera", 25);
      }
    });
    $.ajax({
      url: url,
      type: "POST",
      data: data,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      dataType: "json",
      success: function (data, textStatus, jqXHR) {
        if (!data.error) {
          if ($("#e_Proveedor").is(":checked")) {
            insertcontac_new();
          }
          mensaje = "Registro Actualizado Con Éxito en NEXOSAPP";
          icon = "check";
          color = "success";
          pal = "Proceso terminado";
          $actualiza_proveedor = true;
          Actualiza_Dato_Ministerio($actualiza_proveedor);
          //Actualiza_Dato_Oet('true');
        } else {
          mensaje = "No se creo el Tercero en NEXOSAPP";
          icon = "close";
          color = "danger";
          pal = "Error";
          $(".nexos-messages_editap").append(
            '<div role="alert" class="alert alert-' +
              color +
              ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
              pal +
              "!</strong>No se registro el Tercero en RNDC </div></div>",
          );
          $(".nexos-messages_editap").append(
            '<div role="alert" class="alert alert-' +
              color +
              ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>' +
              pal +
              "!</strong>No se registro el Tercero en OET </div></div>",
          );
        }
        $(".nexos-messages_editap").append(
          '<div role="alert" class="alert alert-' +
            color +
            ' alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-' +
            icon +
            '"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-' +
            icon +
            '"></span></button><strong>' +
            pal +
            "!</strong>" +
            mensaje +
            "</div></div>",
        );
        $("#editar_proveedor").animate({scrollTop: 0}, 900);
        /*alert('Datos Actualizados Existosamente!!!');
				$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);*/
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("ERRORE" + jqXHR.responseText);
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
    function insertcontac_new() {
      var canti = $("#more_contactos").val();
      if (canti > 0) {
        var i;
        for (i = 1; i <= canti; i++) {
          if (typeof $("#sk" + i).val() !== "undefined") {
            var nombre = $("#nombres" + i).val();
            var cargo = $("#cargo" + i).val();
            var fijo = $("#fijo" + i).val();
            var celular = $("#celular" + i).val();
            var correo = $("#correo" + i).val();
            var critica = $("#critica" + i).val();
            var refe = $("#refe" + i).val();
            data.append("accion", "crearContactos2");
            data.append("id_proveedor", $("#eusuario").val());
            data.append("nombre", nombre);
            data.append("cargo", cargo);
            data.append("fijo", fijo);
            data.append("celular", celular);
            data.append("correo", correo);
            data.append("critica", critica);
            data.append("refe", refe);
            data.append("verifica", 2);

            $.ajax({
              url: url,
              type: "POST",
              data: data,
              cache: false,
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              dataType: "json",
              success: function (data, textStatus, jqXHR) {
                console.log("si inserto contactos del proveedor");
                // alert('!!Registro Vehiculo exitosamente!!!');
              },
              error: function (jqXHR, textStatus, errorThrown) {
                console.log("no inserto contactos del proveedor");
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });
          }
        }
      }
    }
  } else {
    $(".nexos-messages_editap").html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        "</div></div>",
    );
    $("#editar_proveedor").animate({scrollTop: 0}, 600);
  }
}

function Actualiza_Dato_Ministerio(respuesta) {
  var id = $("#e_numero_documento").val();
  var tipdoc = $("#e_tipo_documento").val();
  var mintrans = 0;
  tercero_clase = "";
  if (id != "") {
    var accion = {
      num_documento: id,
      tercero_clase: tercero_clase,
      action: "crear_transaccion_ministerio",
    };
    $.ajax({
      url: "http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
      type: "POST",
      data: accion,
      dataType: "json",
      success: function (data) {
        console.log(data);
        if (data) {
          mintrans = 1;
        } else {
          mintrans = 0;
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("no creo dato del ministerio");
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
    if (
      $("#e_Conductor").is(":checked") ||
      $("#e_poseedor_vehiculo").is(":checked") ||
      ($("#e_propietario_vehiculo").is(":checked") && mintrans == 1)
    ) {
      if ($("#e_Conductor").is(":checked")) {
        var conduce = 1;
      } else {
        var conduce = 0;
      }
      var proceso = 11;
      var tipotercero = "";
      var paquete_transmite =
        "id=" + id + "&tipdoc=" + tipdoc + "&dato=1" + "&filtro=" + tipotercero + "&proceso=" + proceso + "&tipopro=2" + "&conduce=" + conduce;
      $.post(
        $("#id_url_ajax").val() + "web_service/terceros",
        paquete_transmite,
        function (data) {
          var tablas_locales = "";
          if (data.status == "true") {
            tablas_locales = "Se Registro Datos Exitosamente RNDC";
            $(".nexos-messages_editap").append(
              '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong>' +
                tablas_locales +
                " - " +
                data.resultado +
                "</div></div>",
            );
            $("#editar_proveedor").animate({scrollTop: 0}, 600);
            Actualiza_Dato_Oet(true);
          } else if (data.status == "false") {
            tablas_locales = "No se actualizo el Tercero en RNDC";
            $(".nexos-messages_editap").append(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
                tablas_locales +
                " - " +
                data.resultado +
                "</div></div>",
            );
            $(".nexos-messages_editap").append(
              '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>No se creo el Tercero en OET</div></div>',
            );
            $("#editar_proveedor").animate({scrollTop: 0}, 600);
            Actualiza_Dato_Oet(true);
            //setTimeout(function() { location.reload(false);  }, 1000);
          }
          //setTimeout(function() { location.reload(false);  }, 1000);
        },
        "json",
      );
    }
  }
}

function Actualiza_Dato_Oet(respuesta) {
  clase = 1;
  recurso = 1;
  valor = "&dato_recurso=" + $("#e_numero_documento").val();
  activy1 = "";
  activy2 = "";
  activy3 = "";
  if ($("#e_propietario_vehiculo").is(":checked")) {
    activy2 = "3";
  }
  if ($("#e_poseedor_vehiculo").is(":checked")) {
    activy3 = "5";
  }
  if ($("#e_Conductor").is(":checked")) {
    activy1 = "4";
  }
  filtro = activy2 + activy3 + activy1;
  var paquete = "clase_recurso=" + recurso + "&recurso=" + filtro + valor;
  $.post(
    $("#id_url_ajax").val() + "integrar_oet/Consulta_Recurso_Avansat",
    paquete,
    function (data) {
      if (data.status == true || data.status == "true") {
        var tablas_locales = "Se Registro Datos Exitosamente GRUPO OET";
        $(".nexos-messages_editap").append(
          '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> ' +
            tablas_locales +
            "</div></div>",
        );
        $("#editar_proveedor").animate({scrollTop: 0}, 600);
        setTimeout(function () {
          location.reload(false);
        }, 1000);
      } else if (data.status == false || data.status == "false") {
        var tablas_locales = "No se creo el Tercero en GRUPO OET";
        $(".nexos-messages_editap").append(
          '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> ' +
            tablas_locales +
            " - " +
            data.error +
            "</div></div>",
        );
        $("#editar_proveedor").animate({scrollTop: 0}, 600);
        setTimeout(function () {
          location.reload(false);
        }, 1000);
      }
    },
    "json",
  );
}

//EDITAR PROVEEDOR ANTERIOR
function editarProveedor() {
  $(".nexos-messages").html("");
  // Se valida contenido del formulario
  alert("entro a editarProveedor");
  var msg_error = "";
  var flag_primer_apellido = true;
  var flag_abreviatura = true;
  var flag_telefono = true;
  var tipo_actividad = false;

  $(".e_tipo_actividad").each(function () {
    if ($(this).is(":checked")) {
      tipo_actividad = true;
      if ($(this).attr("id") == "e_Conductor") {
        if (!$("#e_categoria_licencia").val()) {
          msg_error += "<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder editar el Proveedor.</p>";
        }
        if (!$("#e_numero_licencia").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder editar el Proveedor.</p>";
        }
        if (!$("#e_vencimiento_licencia").val()) {
          msg_error += "<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder editar el Proveedor.</p>";
        } else {
          if (!validaFechaActual($("#e_vencimiento_licencia").val())) {
            msg_error += "<p>El campo <strong>Vencimiento Licencia</strong> debe ser mayor de la fecha actual para poder editar el Proveedor.</p>";
          }
        }
        if ($("#e_tipo_documento").val() == "NIT") {
          msg_error += "<p>No se puede crear un conductor registrado con NIT.</p>";
        }
      }
    }
  });
  if (!tipo_actividad) {
    msg_error += "<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder editar el Proveedor.</p>";
  }
  if (!$("#e_tipo_documento").val()) {
    msg_error += "<p>Debe seleccionar un <strong>Tipo de documento</strong> para poder editar el Proveedor.</p>";
    if (!$("#e_contacto").val() && !$("#e_celular").val()) {
      flag_telefono = false;
      var msg_error_telefono =
        "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
    }
  } else {
    if ($("#e_tipo_documento").val() == "Cedula de Ciudadania" || $("#e_tipo_documento").val() == "Cedula de Extranjeria") {
      if (!$("#e_primer_apellido").val()) {
        flag_primer_apellido = false;
      }
      if (!$("#e_contacto").val() && !$("#e_celular").val()) {
        flag_telefono = false;
        var msg_error_telefono =
          "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
      }
    }
    if ($("#e_tipo_documento").val() == "NIT") {
      if (!$("#e_contacto").val()) {
        flag_telefono = false;
        var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder editar el Proveedor.</p>";
      }
      if (!$("#e_abreviatura").val()) {
        flag_abreviatura = false;
        var msg_error_abreviatura = "<p>Debe diligenciar el campo <strong>Abreviatura</strong> para poder editar el Proveedor.</p>";
      }
    }
  }
  if (!$("#e_numero_documento").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Número de documento</strong> para poder editar el Proveedor.</p>";
  }
  if (!$("#e_tipo_regimen").val()) {
    msg_error += "<p>Debe seleccionar un <strong>Tipo de régimen</strong> para poder editar el Proveedor.</p>";
  }
  if (!$("#e_rndc_nombre").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder editar el Proveedor.</p>";
  }
  if (!flag_primer_apellido) {
    msg_error += "<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder editar el Proveedor.</p>";
  }
  if (!flag_abreviatura) {
    msg_error += msg_error_abreviatura;
  }
  if (!flag_telefono) {
    msg_error += msg_error_telefono;
  }
  if (!$("#e_direccion").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder editar el Proveedor.</p>";
  }
  if (!$("#e_email").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Correo electrónico</strong> para poder editar el Proveedor.</p>";
  }
  if (!$("#e_id_municipio").val()) {
    msg_error += "<p>Debe diligenciar el campo <strong>Municipio</strong> para poder editar el Proveedor.</p>";
  }
  // Fin - Se valida contenido del formulario

  if (!msg_error) {
    var data = null;
    data = new FormData();
    //ARCHIVOS PARA ACTUALIZAR
    var archivos = document.getElementById("e_documentos").files;
    for (var x = 0; x < archivos.length; x++) {
      data.append("documentos" + x, archivos[x]);
    }
    data.append("accion", "editarProveedor");
    data.append("id_proveedor", $("#e_id_proveedor").val());
    data.append("tipo_documento", $("#e_tipo_documento").val());
    data.append("numero_documento", $("#e_numero_documento").val());
    data.append("digito_verificacion", $("#e_digito_verificacion").val());
    data.append("tipo_regimen", $("#e_tipo_regimen").val());
    data.append("tipo_identificacion", $("#e_tipo_identificacion").val());
    data.append("nombre", $("#e_nombre").val());
    data.append("abreviatura", $("#e_abreviatura").val());
    data.append("contacto", $("#e_contacto").val());
    data.append("celular", $("#e_celular").val());
    data.append("direccion", $("#e_direccion").val());
    data.append("email", $("#e_email").val());
    data.append("municipio", $("#e_id_municipio").val());
    data.append("estado", $("#e_estado").val());
    data.append("referencias_empresariales", $("#e_referencias_empresariales").val());
    data.append("referencias_personales", $("#e_referencias_personales").val());
    data.append("observaciones", $("#e_observaciones").val());
    data.append("Conductor", $("#e_Conductor").is(":checked"));
    data.append("Empleado", $("#e_Empleado").is(":checked"));
    data.append("poseedor_vehiculo", $("#e_poseedor_vehiculo").is(":checked"));
    data.append("propietario_vehiculo", $("#e_propietario_vehiculo").is(":checked"));
    data.append("Proveedor", $("#e_Proveedor").is(":checked"));
    data.append("rndc_nombre", $("#e_rndc_nombre").val());
    data.append("rndc_id_municipio", $("#e_rndc_id_municipio").val());

    if ($("#e_primer_apellido").val()) {
      data.append("primer_apellido", $("#e_primer_apellido").val());
    }
    if ($("#e_segundo_apellido").val()) {
      data.append("segundo_apellido", $("#e_segundo_apellido").val());
    }

    if ($("#e_Conductor").is(":checked")) {
      // console.log("está seleccionada la opción conductor");
      data.append("categoria_licencia", $("#e_categoria_licencia").val());
      data.append("numero_licencia", $("#e_numero_licencia").val());
      data.append("vencimiento_licencia", $("#e_vencimiento_licencia").val());
    }

    $.ajax({
      url: url,
      type: "POST",
      data: data,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      dataType: "json",
      beforeSend: function (jqXHR, settings) {
        $(".nexos-messages").html(
          '<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' +
            $("#id_url_ajax").val() +
            'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>',
        );

        console.log(data);
      },
      success: function (data, textStatus, jqXHR) {
        // console.log(data);
        if (!data.error) {
          $(".nexos-messages").html(
            '<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>',
          );
          $("html, body").animate({scrollTop: 0}, 600);
          setTimeout(function () {
            location.reload(false);
          }, 800);
        } else {
          var msg_error = data.error.replace(/\n/g, "</p><p>");
          $(".nexos-messages").html(
            '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
              msg_error +
              "</div></div>",
          );
          $("html, body").animate({scrollTop: 0}, 600);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    $(".nexos-messages").html(
      '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
        msg_error +
        "</div></div>",
    );
    $("html, body").animate({scrollTop: 0}, 600);
  }
}

function datosinactivarproveedor(id_proveedor) {
  $("#i_id_proveedor").val(id_proveedor);
  var params = {
    accion: "verProveedor",
    id_proveedor: id_proveedor,
  };
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        // $("#titulo_inactivar").text("¿Desea inactivar el proveedor con numero de documento "+data.content["numero_documento"]+"?");
      } else {
      }
    },
    "json",
  );
}

function datosactivarproveedor(id_proveedor) {
  $("#a_id_proveedor").val(id_proveedor);
  var params = {
    accion: "verProveedor",
    id_proveedor: id_proveedor,
  };
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        // $("#titulo_activar").text("¿Desea activar el proveedor con numero de documento "+data.content["numero_documento"]+"?");
      } else {
      }
    },
    "json",
  );
}

function inactivarProveedor() {
  var params = {
    accion: "inactivarProveedor",
    id_proveedor: $("#i_id_proveedor").val(),
  };
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        $("#btn_inactivar_proveedor").attr("data-dismiss", "modal");
        location.reload();
      } else {
        $("#btn_inactivar_proveedor").removeAttr("data-dismiss");
      }
    },
    "json",
  );
}

function activarProveedor() {
  var params = {
    accion: "activarProveedor",
    id_proveedor: $("#a_id_proveedor").val(),
  };
  $.post(
    url,
    params,
    function (data) {
      // console.log(data);
      if (data.success) {
        $("#btn_activar_proveedor").attr("data-dismiss", "modal");
        location.reload();
      } else {
        $("#btn_activar_proveedor").removeAttr("data-dismiss");
      }
    },
    "json",
  );
}

function calcularDigitoVerificacion(myNit) {
  var vpri, x, y, z;
  // Se limpia el Nit
  myNit = myNit.replace(/\s/g, ""); // Espacios
  myNit = myNit.replace(/,/g, ""); // Comas
  myNit = myNit.replace(/\./g, ""); // Puntos
  myNit = myNit.replace(/-/g, ""); // Guiones

  // Se valida el nit
  if (isNaN(myNit)) {
    console.log("El nit/cédula '" + myNit + "' no es válido(a).");
    return "";
  }

  // Procedimiento
  vpri = new Array(16);
  z = myNit.length;

  vpri[1] = 3;
  vpri[2] = 7;
  vpri[3] = 13;
  vpri[4] = 17;
  vpri[5] = 19;
  vpri[6] = 23;
  vpri[7] = 29;
  vpri[8] = 37;
  vpri[9] = 41;
  vpri[10] = 43;
  vpri[11] = 47;
  vpri[12] = 53;
  vpri[13] = 59;
  vpri[14] = 67;
  vpri[15] = 71;

  x = 0;
  y = 0;
  for (var i = 0; i < z; i++) {
    y = myNit.substr(i, 1);
    // console.log ( y + "x" + vpri[z-i] + ":" ) ;
    x += y * vpri[z - i];
    // console.log ( x ) ;
  }

  y = x % 11;
  // console.log ( y ) ;
  return y > 1 ? 11 - y : y;
}

var municipios = [];
function cargarmunicipios() {
  var data = null;
  data = new FormData();
  data.append("accion", "cargarmunicipios");
  municipios = [];
  $.ajaxSetup({async: false});
  $.ajax({
    url: url,
    type: "POST",
    data: data,
    cache: data,
    processData: false, // Don't process the files
    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
    dataType: "json",
    success: function (data, textStatus, jqXHR) {
      // console.log(data);
      if (data.success) {
        for (let x = 0; x < data.content.length; x++) {
          municipios.push(data.content[x]["MUNICIPIO"]);
        }
        // console.log(municipios);
        $("#caja_municipio .typeahead").typeahead(
          {
            hint: true,
            highlight: true,
            minLength: 1,
          },
          {
            name: "states",
            source: substringMatcher(municipios),
          },
        );

        $.ajaxSetup({async: false});
        $("#caja_municipio").bind("typeahead:selected", function (obj, datum, name) {
          var params = {
            accion: "obtenerdatosmunicipio",
            municipio: datum,
          };
          $.post(
            url,
            params,
            function (data) {
              if (data.success) {
                var nombre = data.content.nombre;
                $("#municipio").val(nombre);
                $("#municipio_tabla").val(nombre);
                $("#id_municipio").val(data.content.id);
                $("#rndc_id_municipio").val(data.content.rndc_codigo_ciudad);
                $("#estado").focus();
              } else {
                $("#municipio").val("");
              }
            },
            "json",
          );
        });
        $.ajaxSetup({async: true});
        $("#municipio").focusout(function () {
          if ($.inArray($("#municipio").val(), municipios) == -1) {
          } else {
          }
        });
        $("#e_caja_municipio .typeahead").typeahead(
          {
            minLength: 1,
          },
          {
            name: "states",
            source: substringMatcher(municipios),
          },
        );

        $.ajaxSetup({async: false});
        $("#e_caja_municipio").bind("typeahead:selected", function (obj, datum, name) {
          var params = {
            accion: "obtenerdatosmunicipio",
            municipio: datum,
          };
          $.post(
            url,
            params,
            function (data) {
              // console.log(data);
              if (data.success) {
                var nombre = data.content.nombre;
                $("#e_municipio").val(nombre);
                $("#e_id_municipio").val(data.content.id);
                $("#e_rndc_id_municipio").val(data.content.rndc_codigo_ciudad);
                $("#e_estado").focus();
              } else {
                $("#e_municipio").val("");
              }
            },
            "json",
          );
        });
        $.ajaxSetup({async: true});
        $("#e_municipio").focusout(function () {
          // console.log($.inArray($("#e_municipio").val(), municipios));
          if ($.inArray($("#e_municipio").val(), municipios) == -1) {
            //$("#nombre_propietario").val("");
          } else {
          }
        });
      } else {
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
  $.ajaxSetup({async: true});
}

var substringMatcher = function (strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, "i");

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function (i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

function Limpiar_Modal_proveedores() {
  // Conductores
  $("#tipo_documento").val("");
  $("#numero_documento").val("");
  $("#digito_verificacion").val("");
  $("#rndc_nombre").val("");
  $("#nombre").val("");
  $("#primer_apellido").val("");
  $("#segundo_apellido").val("");
  $("#abreviatura").val("");
  $("#contacto").val("");
  $("#celular").val("");
  $("#celular2").val("");
  $("#email").val("");
  $("#municipio").val("");
  $("#id_municipio").val("");
  $("#rndc_id_municipio").val("");
  $("#direccion").val("");
  $("#tipo_identificacion").val("");
  $("#estado").val("");
  $("#sexo").val("");
  $("#documentos").val(null);
  $("#docu_soporte").val("");
  $("#categoria_licencia").val("");
  $("#numero_licencia").val("");
  $("#vencimiento_licencia").val("");
  $("#fecha_nacimiento").val("");
  $("#sangre").val("");
  $("#rut").val(null);
  $("#name_docurut").val("");
  $("#licencia").val(null);
  $("#name_docurut").val("");
  $("#fecha_ingreso").val("");
  // Referencias empresariales
  $("#referencias_empresariales1").val("");
  $("#fecha_referencia1").val("");
  $("#fecha_retiro1").val("");
  $("#contacto_ref1").val("");
  $("#celular_ref1").val("");
  $("#cargo_ref1").val("");
  $("#anti_ref1").val("");
  $("#documento_referencia1").val(null);
  $("#name_soporte").val("");
  $("#idp1").val("");

  $("#referencias_empresariales2").val("");
  $("#fecha_referencia2").val("");
  $("#fecha_retiro2").val("");
  $("#contacto_ref2").val("");
  $("#celular_ref2").val("");
  $("#cargo_ref2").val("");
  $("#anti_ref2").val("");
  $("#documento_referencia2").val(null);
  $("#name_soporte2").val("");
  $("#idp2").val("");

  $("#referencias_empresariales3").val("");
  $("#fecha_referencia3").val("");
  $("#fecha_retiro3").val("");
  $("#contacto_ref3").val("");
  $("#celular_ref3").val("");
  $("#cargo_ref3").val("");
  $("#anti_ref3").val("");
  $("#documento_referencia3").val(null);
  $("#name_soporte3").val("");
  $("#idp3").val("");
  //Referencia personal
  $("#referencias_personales1").val("");
  $("#fecha_personal1").val("");
  $("#parenp1").val("");
  $("#telefonop1").val("");
  $("#documento_personal1").val(null);
  $("#docu_personal1").val("");

  $("#referencias_personales2").val("");
  $("#fecha_personal2").val("");
  $("#parenp2").val("");
  $("#telefonop2").val("");
  $("#documento_personal2").val(null);
  $("#docu_personal2").val("");

  //Seguridad Social
  $("#name_eps").val("");
  $("#vence_eps").val("");
  $("#docu_eps").val(null);
  $("#namedocu_eps").val("");

  // Curso Mercancias peligrosas
  $("#nom_enti").val("");
  $("#vence_curso").val("");
  $("#docu_curso").val("");
  $("#namedocu_curso").val("");

  //Foto Conductor
  $("#foto_conductor").val(null);
  $("#name_fontall").val("");
  $("#foto_derecha").val(null);
  $("#name_derecha").val("");
  $("#foto_izquierda").val(null);
  $("#name_izquierda").val("");
  $("#foto_indume").val(null);
  $("#name_indum").val("");
  $("#acuerdo_uno").val(null);
  $("#name_a1").val("");
}

function crear_proveedor() {
  // alert("hola mundo");
  window.location = `${$("#id_url_ajax").val()}solicitudes/crear_proveedores/${valores}`;
}

function validarExtension(fic) {
  var input = document.getElementById("licencia"); // Reemplaza 'tuInputFile' con el ID de tu input file
  var archivo = input.files[0];

  if (archivo) {
    var nombreArchivo = archivo.name;
    var extension = nombreArchivo.split(".").pop().toLowerCase();

    var extensionesPermitidas = ["pdf"]; // Lista de extensiones permitidas

    if (extensionesPermitidas.indexOf(extension) === -1) {
      // alert("Extensión de archivo no permitida. Por favor, selecciona un archivo con una de las siguientes extensiones: " +extensionesPermitidas.join(", "),);
      $("#licencia + p").remove();
      const ERROR = $("<p></p>")
        .text("Por favor, seleccione un archivo (PDF).")
        .addClass("bg-danger text-center")
        .css({color: "#FFF", "font-size": "12px", margin: 0});
      $("#licencia").after(ERROR);
      input.value = ""; // Limpia el campo de entrada
      $("#name_doculice").val("");
    } else {
      fic = fic.split("\\");
      if (fic == "" || fic == null) {
        $("#name_doculice").val("");
      } else {
        $("#name_doculice").val(fic[fic.length - 1]);
      }
    }

    // Verifica el tamaño del archivo (en este caso, máximo 1MB)
    var maxSize = 1 * 1024 * 1024; // 1MB en bytes
    if (archivo.size > maxSize) {
      $("#licencia + p").remove();
      const ERROR = $("<p></p>")
        .text("El archivo no debe superar el tamaño de 1MB.")
        .addClass("bg-danger text-center")
        .css({color: "#FFF", "font-size": "12px", margin: 0});
      $("#licencia").after(ERROR);
      $("#name_doculice").val("");
    } else {
      $("#licencia + p").remove();
    }
  }
}
