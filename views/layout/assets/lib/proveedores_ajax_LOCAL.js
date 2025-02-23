$(document).ready(function() {
	$("#elmodalito2").click(function(){
		// alert('entro jiji');
		//ocultar los datos cuando entre al modal
		 // $(".titulogeneral").hide();
		 $("#datos_generalest").hide();
		 $(".Datosespecificos").hide();
		 $("#datos_onlyconductor" ).hide();
		 $("#civil").hide();
		//ocultar o mostrar datos si se salio del 
		//modal y tiene un checkbox seleccionado
		var tipo_actividad = false;
		$( ".tipo_actividad").each(function() {
			if( $(this).is(":checked") ) {
				tipo_actividad = true;
				if($(this).attr("id") == "Conductor"){
						$(".titulogeneral").show();
						$("#datos_generalest").show();
						$(".Datosespecificos").show();
						$("#datos_onlyconductor" ).show();
				}
				if( $(this).attr("id") == "poseedor_vehiculo" ||
					$(this).attr("id") == "propietario_vehiculo" ||
					$(this).attr("id") == "Proveedor"  ){
					$(".titulogeneral").show();
					$("#datos_generalest").show();	
				}else{
				}
			}
		});	
	});


	$("#btn_agregar_proveedor").click(function () {
		crearProveedor();
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


	$("#numero_documento").focusout(function () {
		$("#nexos_messages_popup").html('');
		$("#rndc_nombre").attr("disabled",false);
		$("#digito_verificacion").val("");


		var tipo_actividad = false;
		$( ".tipo_actividad").each(function() {
			if( $(this).is(":checked") ) {
				tipo_actividad = true;
				
				if( $(this).attr("id") == "Conductor" || $(this).attr("id") == "poseedor_vehiculo" ||
					$(this).attr("id") == "propietario_vehiculo"){
					var cond=0;
					var tene=0;
					var propi=0;
					
					if($("#Conductor").is(':checked')){
						cond=1;
					}
					if($("#poseedor_vehiculo").is(':checked')){
						tene=1;
					}
					if($("#propietario_vehiculo").is(':checked')){
						propi=1;
					}
					
					//traer nombre
					var name={
						accion:'TraerName',
						doc_proveedor :$("#numero_documento").val(),
						cond:cond,
						tene:tene,
						propi:propi
					};
					$("#rndc_nombre").val('');
					$.ajax({
						type		: "POST",
						cache		: false,
						url			: url,
						data		: name,
						dataType	: "json",
						beforeSend	: function(jqXHR, settings){
							funct_msg_loading(".nexos-messages");
						},
						success		: function(data){
							if(data.success){
								$("#rndc_nombre").prop('disabled', false);
								if(data.nombre[0].nombre_propietario!='' && data.nombre[0].nombre_propietario!=null){
									$("#rndc_nombre").val(data.nombre[0].nombre_propietario);
								}

								if(data.nombre[0].nombre_tenedor!='' && data.nombre[0].nombre_tenedor!=null){
									$("#rndc_nombre").val(data.nombre[0].nombre_tenedor);
								}

								if(data.nombre[0].nombre_conductor!='' && data.nombre[0].nombre_conductor!=null){
									$("#rndc_nombre").val(data.nombre[0].nombre_conductor);
								}
								
							}else{
								$("#rndc_nombre").val('');
							}
						},
						error: function(jqXHR, textStatus, errorThrown){
							console.log(jqXHR);
							console.log(textStatus);
							console.log(errorThrown);
						}	
					});		
				}
			}
		});

		//traer referencias laborales
		var refe={
			accion: 'TraerRefeCondu',
			doc_proveedor : $("#numero_documento").val(),
		};

		$.ajax({
				type		: "POST",
				cache		: false,
				url			: url,
				data		: refe,
				dataType	: "json",
				beforeSend	: function(jqXHR, settings){
					funct_msg_loading(".nexos-messages");
				},
				success		: function(data) {
					if(data.success){
						//bloquear los campos y llenarlos
						$(".nexos-messages").empty();
						$("#referencias_empresariales1").prop('disabled', true);
						$("#fecha_referencia1").prop('disabled', true);
						$("#fecha_retiro1").prop('disabled', true);
						$("#contacto_ref1").prop('disabled', true);
						$("#celular_ref1").prop('disabled', true);
						$("#cargo_ref1").prop('disabled', true);
						$("#anti_ref1").prop('disabled', true);
						$("#referencias_empresariales2").prop('disabled', true);
						$("#fecha_referencia2").prop('disabled', true);
						$("#fecha_retiro2").prop('disabled', true);
						$("#contacto_ref2").prop('disabled', true);
						$("#celular_ref2").prop('disabled', true);
						$("#cargo_ref2").prop('disabled', true);
						$("#anti_ref2").prop('disabled', true);
						$("#referencias_empresariales3").prop('disabled', true);
						$("#fecha_referencia3").prop('disabled', true);
						$("#fecha_retiro3").prop('disabled', true);
						$("#contacto_ref3").prop('disabled', true);
						$("#celular_ref3").prop('disabled', true);
						$("#cargo_ref3").prop('disabled', true);
						$("#anti_ref3").prop('disabled', true);
						$("#documento_referencia1").prop('disabled', false);
						$("#documento_referencia2").prop('disabled', false);
						$("#documento_referencia3").prop('disabled', false);
						//llenarlos
						var c=0;
						data.referencias.forEach(function(element,index){
							c++
							$("#referencias_empresariales"+c).val(element.nombre_empresa);
							$("#fecha_referencia"+c).val(element.fecha_ingreso);
							$("#fecha_retiro"+c).val(element.fecha_retiro);
							$("#contacto_ref"+c).val(element.persona_contacto);
							$("#celular_ref"+c).val(element.celular);
							$("#cargo_ref"+c).val(element.cargo);
							$("#anti_ref"+c).val(element.antiguedad);
							$("#idp"+c).val(element.id);
						});
						funct_msg_success2("#nexos_messages_popup", 'Referencias del prefiltro.');
						$("#crea_proveedores").animate({ scrollTop: 0 }, 600);
						//$("#referencias_empresariales1").val(data.referencias[0].["nombre_empresa"]);

					}else{
						$("#referencias_empresariales1").prop('disabled', false);
						$("#fecha_referencia1").prop('disabled', false);
						$("#fecha_retiro1").prop('disabled', false);
						$("#contacto_ref1").prop('disabled', false);
						$("#celular_ref1").prop('disabled', false);
						$("#cargo_ref1").prop('disabled', false);
						$("#anti_ref1").prop('disabled', false);
						$("#referencias_empresariales2").prop('disabled', false);
						$("#fecha_referencia2").prop('disabled', false);
						$("#fecha_retiro2").prop('disabled', false);
						$("#contacto_ref2").prop('disabled', false);
						$("#celular_ref2").prop('disabled', false);
						$("#cargo_ref2").prop('disabled', false);
						$("#anti_ref2").prop('disabled', false);
						$("#referencias_empresariales3").prop('disabled', false);
						$("#fecha_referencia3").prop('disabled', false);
						$("#fecha_retiro3").prop('disabled', false);
						$("#contacto_ref3").prop('disabled', false);
						$("#celular_ref3").prop('disabled', false);
						$("#cargo_ref3").prop('disabled', false);
						$("#anti_ref3").prop('disabled', false);
						$("#documento_referencia1").prop('disabled', false);
						$("#documento_referencia2").prop('disabled', false);
						$("#documento_referencia3").prop('disabled', false);

						$("#referencias_empresariales1").val('');
						$("#fecha_referencia1").val('');
						$("#fecha_retiro1").val('');
						$("#contacto_ref1").val('');
						$("#celular_ref1").val('');
						$("#cargo_ref1").val('');
						$("#anti_ref1").val('');
						$("#referencias_empresariales2").val('');
						$("#fecha_referencia2").val('');
						$("#fecha_retiro2").val('');
						$("#contacto_ref2").val('');
						$("#celular_ref2").val('');
						$("#cargo_ref2").val('');
						$("#anti_ref2").val('');
						$("#referencias_empresariales3").val('');
						$("#fecha_referencia3").val('');
						$("#fecha_retiro3").val('');
						$("#contacto_ref3").val('');
						$("#celular_ref3").val('');
						$("#cargo_ref3").val('');
						$("#anti_ref3").val('');
					}
				},
				error: function(jqXHR, textStatus, errorThrown){
					console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
				}	
		});

		// Se busca si el proveedor ya existe en el sistema 
		var params = {
			accion: 'verProveedorDoc',
			doc_proveedor : $("#numero_documento").val()
		};

		$.ajax({
			type		: "POST",
			cache		: false,
			url			: url,
			data		: params,
			dataType	: "json",
			beforeSend	: function(jqXHR, settings){
				funct_msg_loading(".nexos-messages");
			},
			success		: function(data) {
				// console.log(data);
				$(".nexos-messages").empty();
				if (data.success) {
					funct_msg_error("#nexos_messages_popup", 'El proveedor ya se encuentra registrado, cualquier cambio lo puede realizar editando la información dentro de la lista.');
					$("#crea_proveedores").animate({ scrollTop: 0 }, 600);
					$("#rndc_nombre").val("");
					$("#rndc_nombre").attr("disabled",true);
					$("#btn_agregar_proveedor").hide();
				}else{
					$("#digito_verificacion").val(calcularDigitoVerificacion($("#numero_documento").val()));
					$("#btn_agregar_proveedor").show();
				}
			}
		});

	});

	$("#e_numero_documento").focusout(function () {
		$("#e_digito_verificacion").val(calcularDigitoVerificacion($("#e_numero_documento").val()));
	});

	cargarmunicipios();

	$("#tipo_documento").change(function(){
		if ($("#tipo_documento").val() == "NIT"){
			$("#tipo_identificacion").val("31");
		}
		else if ($("#tipo_documento").val() == "Cedula de Ciudadania"){
			$("#tipo_identificacion").val("13");
		}
		else if ($("#tipo_documento").val() == "Cedula de Extranjeria"){
			$("#tipo_identificacion").val("22");
		}
		else if ($("#tipo_documento").val() == "Identificacion Tributaria Internacional"){
			$("#tipo_identificacion").val("");
		}
	});

	$("#e_tipo_documento").change(function(){
		if ($("#e_tipo_documento").val() == "NIT"){
			$("#e_tipo_identificacion").val("31");
		}
		else if ($("#e_tipo_documento").val() == "Cedula de Ciudadania"){
			$("#e_tipo_identificacion").val("13");
		}
		else if ($("#e_tipo_documento").val() == "Cedula de Extranjeria"){
			$("#e_tipo_identificacion").val("22");
		}
	});

	/****** Funciones de llenado automático del nombre para el portal web ******/
	// Funcion de crear
	$("#rndc_nombre").focusout(function () {
		llenaNombreProveedor("nombre", "rndc_nombre", "primer_apellido", "segundo_apellido");
	});

	$("#primer_apellido").focusout(function () {
		llenaNombreProveedor("nombre", "rndc_nombre", "primer_apellido", "segundo_apellido");
	});

	$("#segundo_apellido").focusout(function () {
		llenaNombreProveedor("nombre", "rndc_nombre", "primer_apellido", "segundo_apellido");
	});

	// Funcion de crear
	$("#e_rndc_nombre").focusout(function () {
		llenaNombreProveedor("e_nombre", "e_rndc_nombre", "e_primer_apellido", "e_segundo_apellido");
	});

	$("#e_primer_apellido").focusout(function () {
		llenaNombreProveedor("e_nombre", "e_rndc_nombre", "e_primer_apellido", "e_segundo_apellido");
	});

	$("#e_segundo_apellido").focusout(function () {
		llenaNombreProveedor("e_nombre", "e_rndc_nombre", "e_primer_apellido", "e_segundo_apellido");
	});

	//mostrar segun lo seleccionado

	$("#Conductor").change(function () {
		$("#datos_conductor").html("");
		if( $(this).is(":checked") ) {
			$("#datos_conductor").html(`

			<div class="row">	
				<div class="form-group col-xs-12 col-sm-4 col-md-3">
					<label>Catergoría Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
					<select id="categoria_licencia" class="form-control input-sm">
						<option value="" disabled selected>Seleccione</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="C1">C1</option>
						<option value="C2">C2</option>
						<option value="C3">C3</option>
					</select>
					<label id="error_categoria_licencia"></label>
				</div>
				<div class="form-group col-xs-12 col-sm-4 col-md-6">
					<label>Número de Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
					<input type="text" id="numero_licencia" placeholder="Número de Licencia" class="form-control input-sm">
					<label id="error_numero_licencia"></label>
				</div>
				<div class="form-group col-xs-12 col-sm-4 col-md-3">
					<label>Fecha vence Licencia:&nbsp;<span style="color:red;"><i>(*)</i></span></label>
					<div data-min-view="2" data-start-view="4" data-date-format="dd/mm/yyyy" data-link-field="dtp_input1" class="input-group date datetimepicker">
						<input size="16" type="text" value="" id="vencimiento_licencia" class="form-control input-sm" readonly=”readonly”>
						<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
					</div>
					<label id="error_vencimiento_licencia"></label>
				</div>
			</div>	
			<div class="row">
				<div class=" form-group col-xs-12 col-sm-4 col-md-4">
					<label>Sexo:</label>
					<select class="form-control input-sm"  id="sexo">
						<option value="">Seleccione</option>
						<option value="Femenino">Femenino</option>
						<option value="Masculino">Masculino</option>
						<option value="Otro">Otro</option>
					</select>
				</div>
				<div class=" form-group col-xs-12 col-sm-4 col-md-4 col-lg-4">
					<label>Fecha Nacimiento:</label>
					<div data-min-view="2" data-start-view="4" data-date-format="yyyy/mm/dd" data-link-field="dtp_input1" class="input-group date datetimepicker">
						<input size="16" type="text" value="" id="fecha_nacimiento" class="form-control input-sm" readonly=”readonly”>
						<span class="input-group-addon btn btn-primary"><i class="icon-th mdi mdi-calendar"></i></span>
					</div>
					<label id="error_fecha_nacimiento"></label>
				</div>	
				<div class="form-group  col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<label>Grupo sanguineo:</label><br>
					<select class="form-control input-sm text-center"  id="sangre">
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
				</div>	
			</div>
			<div class="row">
				<div class=" form-group col-xs-12 col-sm-6 col-md-6 SubirRut">
						<label>Upload Rut:</label><br>
						<input type="file" name="file-2" id="rut" onchange="Rut(this.value)"   data-multiple-caption="{count} archivos seleccionados" multiple class="inputfile form-control input-lg">
				        <label for="rut" class="btn-primary"> <i class="icon mdi mdi-file"></i><span>Rut</span></label>
				</div>
				<div class="form-group col-xs-12 col-sm-6 col-md-6 SubirLicencia">
					<label>Upload Licencia:</label><br>
					 <input type="file" name="file-2" id="licencia" onchange="lice(this.value)"  data-multiple-caption="{count} archivos seleccionados" multiple class="inputfile form-control input-md">
				     <label for="licencia" class="btn-primary"> <i class="icon mdi mdi-file"></i><span>Licencia</span></label>
				</div>
				<div class="form-group col-xs-12 col-sm-6 col-md-6 SubirRut">
					<label>Nombre Documento Rut</label>
					<input type="text" class="form-control input-sm" id="name_docurut" disabled="disabled">
				</div>
				<div class="form-group col-xs-12 col-sm-6 col-md-6 SubirLicencia">
					<label>Nombre Documento Licencia</label>
					<input type="text" class="form-control input-sm" id="name_doculice" disabled="disabled">
				</div>
				<div class="form-group  col-xs-4 col-sm-4 col-md-4 col-lg-4">
					<input type="hidden" id="fecha_ingreso" class="form-control input-sm">
						<label id="error_fecha_ingreso"></label>
				</div>
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
			//
				$(".titulogeneral").show();
				$("#datos_generalest").show();
				$(".Datosespecificos").show();
				$("#datos_onlyconductor").show();

		}else{

				$(".titulogeneral").hide();
				$("#datos_generalest").hide();
				$(".Datosespecificos").hide();
				$("#datos_onlyconductor").hide();
		}
	});

	$("#poseedor_vehiculo").change(function () {
		if( $(this).is(":checked") ) {
				$(".titulogeneral").show();
				$("#datos_generalest").show();
				$("datos_conductor").hide();
		}else{
			$(".titulogeneral").hide();
			$("#datos_generalest").hide();
			$("datos_conductor").hide();
		}
	});

	$("#propietario_vehiculo").change(function(){
		if( $(this).is(":checked")){
			$(".titulogeneral").show();
			$("#datos_generalest").show();
			$("datos_conductor").hide();
		}else{
			$(".titulogeneral").hide();
			$("#datos_generalest").hide();
			$("datos_conductor").hide();
		}
	});

	$("#Proveedor").change(function(){
			if( $(this).is(":checked")){
				$(".titulogeneral").show();
				$("#datos_generalest").show();
				$("datos_conductor").hide();
			}else{
				$(".titulogeneral").hide();
				$("#datos_generalest").hide();
				$("datos_conductor").hide();
			}
	});



	//final del seleccionado

	// Funcion de formulario para conductores - editar
	$("#e_Conductor").change(function () {
		$("#e_datos_conductor").html("");
		if( $(this).is(":checked") ) {
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
		if ($("#tipo_documento").val() != "Identificacion Tributaria Internacional"){
			$("#contacto").val("");
			$("#contacto").attr("maxlength","7");
			$("#celular").val("");
			$("#celular").attr("maxlength","10");
		}

		// Se filtra la gestión de los campos dependiendo el tipo de documento seleccionado 
		$("#primer_apellido").attr("disabled",false);
		$("#segundo_apellido").attr("disabled",false);
		if ( $("#tipo_documento").val() == "NIT" || $("#tipo_documento").val() == "Identificacion Tributaria Internacional" ) {
			$("#primer_apellido").val("");
			$("#segundo_apellido").val("");
			$("#primer_apellido").attr("disabled",true);
			$("#segundo_apellido").attr("disabled",true);
		}
		llenaNombreProveedor("nombre", "rndc_nombre", "primer_apellido", "segundo_apellido");
	});
	/****** Funciones de llenado automático del nombre para el portal web ******/
});

var url =$("#id_url_ajax").val() + "libs/proveedores_ajax.php";

	//traer nombre documentos
		document.getElementById('documentos').onchange = function () {
			var docu=document.getElementById('documentos').files[0].name;
			$("#namedocu").val(docu);
		}

//funcion para agregar el nombre del archivo a el input
function Rut(fic){

		fic = fic.split('\\');
		  if(fic=='' || fic==null){
		  	$("#name_docurut").val('');
		  }else{
		  	$("#name_docurut").val(fic[fic.length-1]);
		  }
}

function lice(fic){
		fic = fic.split('\\');
		  if(fic=='' || fic==null){
		  	$("#name_doculice").val('');
		  }else{
		  	$("#name_doculice").val(fic[fic.length-1]);
		  }
}
		
	
function crearProveedor(){

$(".nexos-messages").html('');

	// Se valida contenido del formulario 
	var msg_error = "";
	var flag_primer_apellido = true;
	var flag_abreviatura = true;
	var flag_telefono = true;
	var tipo_actividad = false;

	$( ".tipo_actividad" ).each(function() {
		if( $(this).is(":checked") ) {
			tipo_actividad = true;
			if( $(this).attr("id") == "Conductor" ){
				if( !$("#categoria_licencia").val() ){
					msg_error+= "<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder crear el Proveedor.</p>";
				}
				if( !$("#numero_licencia").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder crear el Proveedor.</p>";
				}
				if( !$("#vencimiento_licencia").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder crear el Proveedor.</p>";
				}else{
					if ( !validaFechaActual( $("#vencimiento_licencia").val() ) ) {
						msg_error+= "<p>El campo <strong>Vencimiento Licencia</strong> debe ser mayor de la fecha actual para poder crear el Proveedor.</p>";
					}
				}
				if ( $("#tipo_documento").val() == "NIT" ) {
					msg_error+= "<p>No se puede crear un conductor registrado con NIT.</p>";
				}
				if ( $("#tipo_documento").val() == "Identificacion Tributaria Internacional" ) {
					msg_error+= "<p>No se puede crear un conductor registrado con Identificacion Tributaria Internacional.</p>";
				}

				if( !$("#celular2").val()){
					msg_error+= "<p>Debe diligenciar el campo <strong>Celular 2</strong> para poder crear el Proveedor.</p>";
				}

			//CREAR VALIDACIONES SOLO PARA EL CONDUCTOR <referencias y fotos>
				// var fecha = new Date(); //Fecha actual
			 //  	var mes = fecha.getMonth()+1; //obteniendo mes
			 //  	var dia = fecha.getDate(); //obteniendo dia
			 //  	var ano = fecha.getFullYear(); //obteniendo año
			 //  	if(dia<10){
			 //  	 	dia='0'+dia; //agrega cero si el menor de 10
			 // 	 } 
			 // 	 if(mes<10){
			 //  		mes='0'+mes //agrega cero si el menor de 10
			 //  		}
				// var hoy=ano+"-"+mes+"-"+dia;
				
				// if($("#vence_arl").val()<=hoy){
				// 	msg_error+= "<p>No se puede crear un conductor con la <strong>ARL</strong> vencida.</p>";

				// }
				// if($("#vence_eps").val()<=hoy){
				// 	msg_error+= "<p>No se puede crear un conductor con <strong>Certificado de EPS</strong> vencido.</p>";

				// }
				// if($("#vence_curso").val()<=hoy){
				// 	msg_error+= "<p>No se puede crear un conductor con el <strong>Carnet Mercancias Peligrosas</strong> vencido.</p>";

				// }

				if(!$("#referencias_empresariales1").val()){
					msg_error+= "<p>Debe seleccionar una <strong>Referencias Empresariales 1</strong> para poder crear el Conductor.</p>";

				}
				if(!$("#celular_ref1").val()){
					msg_error+= "<p>Debe ingresar un <strong>Número Empresarial 1</strong> para poder crear el Conductor.</p>";

				}
				
				if(!$("#referencias_empresariales2").val()){
					msg_error+= "<p>Debe ingresar una <strong>Referencia Empresariales 2</strong> para poder crear el Conductor.</p>";

				}
				if(!$("#celular_ref2").val()){
					msg_error+= "<p>Debe ingresar un <strong>Número Empresarial 2</strong> para poder crear el Conductor.</p>";

				}
				if(!$("#referencias_empresariales3").val()){
					msg_error+= "<p>Debe ingresar una <strong>Referencia Empresarial 3</strong> para poder crear el Conductor.</p>";

				}
				if(!$("#celular_ref3").val()){
					msg_error+= "<p>Debe ingresar un <strong>Número Empresarial 3</strong> para poder crear el Conductor.</p>";
				}

				
				if(!$("#referencias_personales1").val()){
					msg_error+= "<p>Debe seleccionar una <strong>Referencias Personales 1</strong> para poder crear el Conductor.</p>";
				}

				if(!$("#parenp1").val()){
					msg_error+= "<p>Debe seleccionar un <strong>Parentezco Personales 1</strong> para poder crear el Conductor.</p>";

				}

				if(!$("#telefonop1").val()){
					msg_error+= "<p>Debe ingresar un <strong>Teléfono Personales 1</strong> para poder crear el Conductor.</p>";
				}

				if(!$("#referencias_personales2").val()){
					msg_error+= "<p>Debe ingresar una <strong>Refrencia Personales 2</strong> para poder crear el Conductor.</p>";
				}

				if(!$("#parenp2").val()){
					msg_error+= "<p>Debe seleccionar un <strong>parentezco Personales 2</strong> para poder crear el Conductor.</p>";
				}

				if(!$("#telefonop2").val()){
					msg_error+= "<p>Debe ingresar un <strong>Teléfono Personales 2</strong> para poder crear el Conductor.</p>";

				} 
				
			/*	if(!$("#foto_conductor").val()){
					msg_error+= "<p>Debe seleccionar la <strong>Foto Frontal(1) del conductor</strong> para poder crear el Conductor.</p>";
				 }
				
				if(!$("#foto_indume").val()){
					msg_error+= "<p>Debe seleccionar la <strong>Foto de  Indumentaria del conductor</strong> para poder crear el Conductor.</p>";

				}

				if(!$("#foto_derecha").val()){
					msg_error+= "<p>Debe seleccionar la <strong>Foto lateral derecho(1) del conductor</strong> para poder crear el Conductor.</p>";
				}

				if(!$("#foto_izquierda").val()){
					msg_error+= "<p>Debe seleccionar la <strong>Foto lateral izquierdo(1) del conductor</strong> para poder crear el Conductor.</p>";
				}   */

			
				//fin validaciones del conductor
			}//cierre del conductor
		}
	});
	if( !tipo_actividad ){
		msg_error+= "<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder crear el Proveedor.</p>";
	}
	if( !$("#tipo_documento").val() ){
		msg_error+= "<p>Debe seleccionar un <strong>Tipo de documento</strong> para poder crear el Proveedor.</p>";
		if (  !$("#celular").val() ) {
			flag_telefono = false;
			var msg_error_telefono = "<p>Debe diligenciar el campo  <strong>Celular Contacto</strong> para poder crear el Proveedor.</p>";
		}
	}else{
		if ( $("#tipo_documento").val() == "Cedula de Ciudadania" || $("#tipo_documento").val() == "Cedula de Extranjeria" ) {
			if( !$("#primer_apellido").val() ){
				flag_primer_apellido = false;
			}
			/*if ( !$("#contacto").val() && !$("#celular").val() ) {
				flag_telefono = false;
				var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder crear el Proveedor.</p>";
			} */
		}
		if ( $("#tipo_documento").val() == "NIT" || $("#tipo_documento").val() == "Identificacion Tributaria Internacional" ) {
			/*if( !$("#contacto").val() ){
				flag_telefono = false;
				var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder crear el Proveedor.</p>";
			}*/
			// if( !$("#abreviatura").val() ){
			// 	flag_abreviatura = false;
			// 	var msg_error_abreviatura = "<p>Debe diligenciar el campo <strong>Abreviatura</strong> para poder crear el Proveedor.</p>";
			// }
		}
	}
	if( !$("#numero_documento").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Número de documento</strong> para poder crear el Proveedor.</p>";
	}
	// if( !$("#tipo_regimen").val() ){
	// 	msg_error+= "<p>Debe seleccionar un <strong>Tipo de régimen</strong> para poder crear el Proveedor.</p>";
	// }
	if( !$("#rndc_nombre").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder crear el Proveedor.</p>";
	}
	if ( !flag_primer_apellido ) {
		msg_error+= "<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder crear el Proveedor.</p>";
	}
	if( !flag_abreviatura ){
		msg_error+= msg_error_abreviatura;
	}
	if( !flag_telefono ){
		msg_error+= msg_error_telefono;
	}
	if( !$("#direccion").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder crear el Proveedor.</p>";
	}
	/*if( !$("#email").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Correo electrónico</strong> para poder crear el Proveedor.</p>";
	}*/
	if( !$("#id_municipio").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Municipio</strong> para poder crear el Proveedor.</p>";
	}
	// Fin - Se valida contenido del formulario 

	if (!msg_error) {
		var data = null;
		data = new FormData();
		
		var archivos = document.getElementById('documentos').files;
		for (var x = 0; x < archivos.length; x++) {
			data.append("documentos" + x, archivos[x]);
		}

		if($("#Conductor").is(':checked')){
			//ARCHIVOS DEL CONDUCTOR
			//documento licencia
			var licencia = document.getElementById('licencia').files;
			for (var i = 0; i < licencia.length; i++) {
				data.append("licencia" + i, licencia[i]);
			}

			//documento eps 
			var documento_eps = document.getElementById('docu_eps').files;
			for (var m = 0; m < documento_eps.length; m++) {
				data.append("docu_eps" + x, documento_eps[m]);
			}
			//documento arl
		/*	var documento_arl = document.getElementById('docu_arl').files;
			for (var g = 0; g < documento_arl.length; g++) {
				data.append("docu_arl" + g, documento_arl[g]);
			} */

			//documento empresarial 1
			var documento_empre1 = document.getElementById('documento_referencia1').files;
			for (var a = 0; a < documento_empre1.length; a++) {
				data.append("documento_referencia1" + a, documento_empre1[a]);
				//alert('doc'+documento_empre1[a]);
			}

			//documento empresarial 2
			var documento_empre2 = document.getElementById('documento_referencia2').files;
			for (var b = 0; b < documento_empre2.length; b++) {
				data.append("documento_referencia2" + b, documento_empre2[b]);
			}

			//documento empresarial 3
			var documento_empre3=document.getElementById('documento_referencia3').files;
			for(var u =0;  u < documento_empre3.length;  u++ ){
				data.append("documento_referencia3" + u, documento_empre3[u])
			}


			//documento personal 1
			var documento_perso1 = document.getElementById('documento_personal1').files;
			for (var c = 0; c < documento_perso1.length; c++) {
				data.append("documento_personal1" + c, documento_perso1[c]);
			}

			//documento personal 2
			var documento_perso2 = document.getElementById('documento_personal2').files;
			for (var d = 0; d < documento_perso2.length; d++) {
				data.append("documento_personal2" + d, documento_perso2[d]);
			}
				
			

			//carnet curso mercancias peligrosas
			var curso = document.getElementById('docu_curso').files;
			for (var e = 0; e < curso.length; e++) {
				data.append("docu_curso" + e, curso[e]);
			}	

			//rut
			var rut = document.getElementById('rut').files;
			for (var s = 0; s < rut.length; s++) {
				data.append("rut" + s, rut[s]);
			}

			//fotos del conductor FRONTAL
			var foto_conductor = document.getElementById('foto_conductor').files;
			for (var k = 0; k < foto_conductor.length; k++) {
				data.append("foto_conductor" + k, foto_conductor[k]);
			}


			//foto del conductor DERECHA
			var foto_cderecha = document.getElementById('foto_derecha').files;
			for (var u = 0; u < foto_cderecha.length; u++) {
				data.append("foto_derecha" + u, foto_cderecha[u]);
			}

			//foto del conductor izquierda
			var foto_cizquierda = document.getElementById('foto_izquierda').files;
			for (var v = 0; v < foto_cizquierda.length; v++) {
				data.append("foto_izquierda" + v, foto_cizquierda[v]);
			}

			//foto de del conductor indumentaria 
			var foto_indumentaria = document.getElementById('foto_indume').files;
			for (var n = 0; n < foto_indumentaria.length; n++) {
				data.append("foto_indume" + n, foto_indumentaria[n]);
			}
		}


		data.append("accion", 'crearProveedor');
		data.append("tipo_documento", $("#tipo_documento").val());
		data.append("numero_documento", $("#numero_documento").val());
		data.append("digito_verificacion", $("#digito_verificacion").val());
		data.append("tipo_identificacion", $("#tipo_identificacion").val());
		data.append("nombre", $("#nombre").val());
		data.append("abreviatura", $("#abreviatura").val());
		data.append("contacto", $("#contacto").val());
		data.append("celular", $("#celular").val());
		data.append("direccion", $("#direccion").val());
		data.append("email", $("#email").val());
		data.append("municipio", $("#id_municipio").val());
		data.append("estado", $("#estado").val());
		data.append("Conductor", $("#Conductor").is(':checked'));
		data.append("poseedor_vehiculo", $("#poseedor_vehiculo").is(':checked'));
		data.append("propietario_vehiculo", $("#propietario_vehiculo").is(':checked'));
		data.append("Proveedor", $("#Proveedor").is(':checked'));
		data.append("rndc_nombre", $("#rndc_nombre").val());
		data.append("rndc_id_municipio", $("#rndc_id_municipio").val());

		if ( $("#tipo_documento").val() == "Cedula de Ciudadania" || $("#tipo_documento").val() == "Cedula de Extranjeria" ) {
			if ( $("#primer_apellido").val() ) {
				data.append("primer_apellido", $("#primer_apellido").val());
			}
			if ( $("#segundo_apellido").val() ) {
				data.append("segundo_apellido", $("#segundo_apellido").val());
			}
		}

		if ( $("#Conductor").is(':checked') ) {
			// console.log("está seleccionada la opción conductor");
			data.append("categoria_licencia", $("#categoria_licencia").val());
			data.append("numero_licencia", $("#numero_licencia").val());
			data.append("vencimiento_licencia", $("#vencimiento_licencia").val());
			if ( $("#primer_apellido").val() ) {
				data.append("primer_apellido", $("#primer_apellido").val());
			}
			if ( $("#segundo_apellido").val() ) {
				data.append("segundo_apellido", $("#segundo_apellido").val());
			}
			// alert('conductor datos');
			data.append("celular2", $("#celular2").val());
			data.append("name_eps", $("#name_eps").val());
			data.append("vence_eps", $("#vence_eps").val());
			//data.append("ultimo_eps", $("#ultimo_eps").val());
			//data.append("name_arl", $("#name_arl").val());
			//data.append("vence_arl", $("#vence_arl").val());
			//data.append("ultimo_arl", $("#ultimo_arl").val());
			data.append("nom_enti", $("#nom_enti").val());
			data.append("vence_curso", $("#vence_curso").val());
			//referencias empresariales 1
			data.append("referencias_empresariales1", $("#referencias_empresariales1").val());
			data.append("fecha_referencia1", $("#fecha_referencia1").val());
			data.append("fecha_retiro1", $("#fecha_retiro1").val());
			data.append("contacto_ref1", $("#contacto_ref1").val());
			data.append("celular_ref1", $("#celular_ref1").val());
			data.append("cargo_ref1", $("#cargo_ref1").val());
			data.append("anti_ref1", $("#anti_ref1").val());
			data.append("idp1", $("#idp1").val());
			//referencias empresariales 2
			data.append("referencias_empresariales2", $("#referencias_empresariales2").val());
			data.append("fecha_referencia2", $("#fecha_referencia2").val());
			data.append("fecha_retiro2", $("#fecha_retiro2").val());
			data.append("contacto_ref2", $("#contacto_ref2").val());
			data.append("celular_ref2", $("#celular_ref2").val());
			data.append("cargo_ref2", $("#cargo_ref2").val());
			data.append("anti_ref2", $("#anti_ref2").val());
			data.append("idp2", $("#idp2").val());
			//referencias empresariales 3 
			data.append("referencias_empresariales3", $("#referencias_empresariales3").val());
			data.append("fecha_referencia3", $("#fecha_referencia3").val());
			data.append("fecha_retiro3", $("#fecha_retiro3").val());
			data.append("contacto_ref3", $("#contacto_ref3").val());
			data.append("celular_ref3", $("#celular_ref3").val());
			data.append("cargo_ref3", $("#cargo_ref3").val());
			data.append("anti_ref3", $("#anti_ref3").val());
			data.append("idp3", $("#idp3").val());
			
			//referencias personales 1
			data.append("referencias_personales", $("#referencias_personales1").val());
			data.append("fecha_personal1", $("#fecha_personal1").val());
			data.append("parenp1", $("#parenp1").val());
			data.append("telefonop1", $("#telefonop1").val());
			//referencias personales 2
			data.append("referencias_personales2", $("#referencias_personales2").val());
			data.append("fecha_personal2", $("#fecha_personal2").val());
			data.append("parenp2", $("#parenp2").val());
			data.append("telefonop2", $("#telefonop2").val());  
			//demás
			data.append("sexo", $("#sexo").val());
			data.append("fecha_nacimiento", $("#fecha_nacimiento").val());
			data.append("sangre", $("#sangre").val());
			data.append("fecha_ingreso", $("#fecha_ingreso").val());
			//NOMBRES DE LOS DOCUMENTOS
			data.append("name_soporte", $("#name_soporte").val());
			data.append("name_soporte2", $("#name_soporte2").val());
			data.append("name_soporte3", $("#name_soporte3").val());
			data.append("docu_personal1", $("#docu_personal1").val());
			data.append("docu_personal2", $("#docu_personal2").val());
			data.append("namedocu_eps", $("#namedocu_eps").val());
			data.append("namedocu_curso", $("#namedocu_curso").val());
			data.append("name_docurut", $("#name_docurut").val());
			data.append("name_doculice", $("#name_doculice").val());

			data.append("name_fontall", $("#name_fontall").val());
			data.append("name_derecha", $("#name_derecha").val());
			data.append("name_izquierda", $("#name_izquierda").val());
			data.append("name_indum", $("#name_indum").val());
		}

		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			beforeSend	: function(jqXHR, settings){
				// console.log("Entro en el proceso de creación del proveedor");
				// console.log(data);
				$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
			},
			success: function (data, textStatus, jqXHR)
			{
				// console.log(data);
				if (!data.error) {
						$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>');
					$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);
				} 
				else {
					var msg_error = data.error.replace(/\n/g , "</p><p>");
					$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
					$("html, body").animate({ scrollTop: 0 }, 600);
				}
			},
			error: function (jqXHR, textStatus, errorThrown)
			{

				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});

	}else {
		$("#nexos_messages_popup2").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		//$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("#crea_proveedores").animate({ scrollTop: 0 }, 600);
		//$("html, body").animate({ scrollTop: 0 }, 600);
	}
}

var flag_proveedor;
function editardatosProveedor(id_proveedor) {
	if (flag_proveedor != id_proveedor) {
		flag_proveedor = id_proveedor;
		alert('ENTRO A editardatosproveedor');
		$(".nexos_messages_popup").html('');

		$("#e_id_proveedor").val(id_proveedor);
		$("#e_datos_conductor").html('');

		$("#e_rndc_nombre").val("");
		$("#e_primer_apellido").val("");
		$("#e_segundo_apellido").val("");
		$("#e_nombre").val("");

		var params = {
			accion: 'verProveedor',
			id_proveedor : id_proveedor
		};
		$.post(url, params, function (data) {
			// console.log(data);
			if (data.success) {
				$("#titulo_editar").text(" Proveedor #"+data.content["numero_documento"]);
				$("#e_tipo_documento").val(data.content["tipo_documento"]);
				$("#e_tipo_documento").attr("disabled",true);
				$("#e_Conductor").attr("disabled",false);
				if ($("#e_tipo_documento").val() == "NIT"){
					$("#e_Conductor").attr("disabled",true);
				}
				$("#e_numero_documento").val(data.content["numero_documento"]);
				$("#e_numero_documento").attr("disabled",true);
				$("#e_digito_verificacion").val(data.content["digito_verificacion"]);
				if ( !data.content["digito_verificacion"] ) {
					$("#e_digito_verificacion").val(calcularDigitoVerificacion(data.content["numero_documento"]));
				}
				$("#e_tipo_regimen").val(data.content["tipo_regimen"]);
				$("#e_tipo_identificacion").val(data.content["tipo_identificacion"]);
				if( !data.content["tipo_identificacion"] ){
					if ($("#e_tipo_documento").val() == "NIT"){
						$("#e_tipo_identificacion").val("31");
					}
					else if ($("#e_tipo_documento").val() == "Cedula de Ciudadania"){
						$("#e_tipo_identificacion").val("13");
					}
					else if ($("#e_tipo_documento").val() == "Cedula de Extranjeria"){
						$("#e_tipo_identificacion").val("22");
					}
				}
				$("#e_rndc_nombre").val(data.content["nombre"]);
				$("#e_nombre").val(data.content["nombre"]);
				$("#e_primer_apellido").attr("disabled",false);
				$("#e_segundo_apellido").attr("disabled",false);

				if ( data.content["rndc_id"] ) {
					if ( data.rndc_result ) {
						// console.log("Si hay respuesa del RNDC");
						// console.log(data.rndc_result);
						$("#e_rndc_nombre").val(data.rndc_result["nomidtercero"]);
						$("#e_primer_apellido").val(data.rndc_result["primerapellidoidtercero"]);
						$("#e_segundo_apellido").val(data.rndc_result["segundoapellidoidtercero"]);
						$("#e_nombre").val(data.rndc_result["nomidtercero"] + " " + data.rndc_result["primerapellidoidtercero"] + " " + data.rndc_result["segundoapellidoidtercero"] );
					}
				}

				if ($("#e_tipo_documento").val() == "NIT"){
					$("#e_primer_apellido").attr("disabled",true);
					$("#e_segundo_apellido").attr("disabled",true);
				}
				$("#e_abreviatura").val(data.content["abreviatura"]);
				$("#e_contacto").val(data.content["contacto"]);
				$("#e_celular").val(data.content["celular"]);
				if ( !data.content["rndc_id"] ) {
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
				$("#e_caja_documentos").html (data.archivos);
				$("#e_Conductor").prop("checked",false);
				$("#e_Empleado").prop("checked",false);
				$("#e_poseedor_vehiculo").prop("checked",false);
				$("#e_propietario_vehiculo").prop("checked",false);
				$("#e_Proveedor").prop("checked",false);

				if(data.actividades.length>0){
					for(let i=0;i<data.actividades.length;i++){
						if (data.actividades[i]["actividad"]=="Conductor"){
							$("#e_Conductor").prop("checked",true);

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
						if (data.actividades[i]["actividad"]=="Empleado"){
							$("#e_Empleado").prop("checked",true);
						}
						if (data.actividades[i]["actividad"]=="Poseedor Vehiculo"){
							$("#e_poseedor_vehiculo").prop("checked",true);
						}
						if (data.actividades[i]["actividad"]=="Propietario Vehiculo"){
							$("#e_propietario_vehiculo").prop("checked",true);
						}
						if (data.actividades[i]["actividad"]=="Proveedor"){
							$("#e_Proveedor").prop("checked",true);
						}
					}
				}
			}
			if (data.error) {
				var msg_error = data.error.replace(/\n/g , "</p><p>");
				$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>' + msg_error + '</p></div></div>');
				$("#editar_proveedor").animate({ scrollTop: 0 }, 600);
			}
		}, 'json');  
	}
}

//TRAER DATOS DEL PROVEEDOR AL FORMULARIO 
function editardatosProveedorn(id_proveedor){
	  
		var datos={
			id:id_proveedor,
			action:'traer_datos_proveedor'
		};
		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:datos,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('ok dato proveedor');
	 				if(data.result){

	 					
	 					if(data.result[0].estado_proceso=='bloqueado'){
	 						$("#estado_bloqueo").html('<p class="text-danger" style="font-weigth:800;">Bloqueado</p>');
	 						$(".des").prop('disabled', true);
	 						$("#btn_editar_proveedornew").hide();
	 					}

	 					var cont=0;
	 					var contp=0;
	 					$("#e_datos_especificos").hide();
						$(".e_titulogeneral").hide();
	 					// console.log('si hay datos');
	 					console.log(data);
	 					//cmx_proveedores
	 					$("#titulo_editar").text("Editar Proveedor #"+data.result[0].numero_documento);
						//datos para el conductor
						var actividad=(data.result[0].acti);
					
						$("#e_primer_apellido").val(data.result[0].acti);
						if(actividad=='Conductor'){
							$("#e_Conductor").prop("checked",true);
							 $("#e_datos_especificos").show();
						 	 $(".e_titulogeneral").show();
						}
						$("#e_categoria").val(data.result[0].rndc_categoria_licencia);
						$("#e_num_licencia").val(data.result[0].rndc_numero_licencia);
						$("#e_vence_licencia").val(data.result[0].rndc_vencimiento_licencia);

						 if(actividad=='Poseedor Vehiculo'){
							$("#e_poseedor_vehiculo").prop("checked",true);
						}
						 if(actividad=='Propietario Vehiculo'){
							$("#e_propietario_vehiculo").prop("checked",true);
							
						}
						 if(actividad=='Proveedor'){
							$("#e_Proveedor").prop("checked",true);
							
						}

						//TRAER DATOS DE LICENCIA SI ES CONDUCTOR	
						$("#eusuario").val(data.result[0].idp);
						$("#e_rndc_nombre").val(data.result[0].nombre);
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
						 var municipio=$('#e_municipio').html('');
		 				data.result[0].id_municipio.forEach(function(element,index){
		 				var tmpSelected = "";
		 				if(element.selected){
		 					tmpSelected = "selected";
		 				}
		 				var municipio=$('#e_municipio').append('<option '+tmpSelected+' value="'+element. munid+'">'+element.munmun+'-'+element.mundepto+'</option>');
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
						 var s=data.result[0].sexo;
						 if(s=='Femenino'){
						 	$("#e_sexo").html('<option value="'+s+'">'+s+'</option>'+
						 		'<option value="Masculino">Masculino</option>');
						 }
						 if(s=='Masculino'){
						 	$("#e_sexo").html('<option value="'+s+'">'+s+'</option>'+
						 		'<option value="Femenino">Femenino</option>');
						 }
						 var sangre=data.result[0].grupo_sanguineo;
						 if(sangre=='O+'){
						 	 $("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O-">O-</option>'+
								'<option value="A+">A+</option>'+
								'<option value="A-">A-</option>'+
								'<option value="B+">B+</option>'+
								'<option value="B-">B-</option>'+
								'<option value="AB+">AB+</option>'+
								'<option value="AB-">AB-</option>');
						 }
						 if(sangre=='O-'){
						 	 $("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O+">O+</option>'+
								'<option value="A+">A+</option>'+
								'<option value="A-">A-</option>'+
								'<option value="B+">B+</option>'+
								'<option value="B-">B-</option>'+
								'<option value="AB+">AB+</option>'+
								'<option value="AB-">AB-</option>');
						 }
						 if(sangre=='A+'){
						 	 $("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O+">O+</option>'+
						 	 	'<option value="O-">O-</option>'+
								'<option value="A-">A-</option>'+
								'<option value="B+">B+</option>'+
								'<option value="B-">B-</option>'+
								'<option value="AB+">AB+</option>'+
								'<option value="AB-">AB-</option>');
						 }
						 if(sangre=='A-'){
						 	 $("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O+">O+</option>'+
						 	 	'<option value="O-">O-</option>'+
								'<option value="A+">A+</option>'+
								'<option value="B+">B+</option>'+
								'<option value="B-">B-</option>'+
								'<option value="AB+">AB+</option>'+
								'<option value="AB-">AB-</option>');
						 }
						if(sangre=='B+'){
							 $("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O+">O+</option>'+
						 	 	'<option value="O-">O-</option>'+
						 	 	'<option value="A+">A+</option>'+
								'<option value="A-">A-</option>'+
								'<option value="B-">B-</option>'+
								'<option value="AB+">AB+</option>'+
								'<option value="AB-">AB-</option>');
						}
						if(sangre=='B-'){
							$("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O+">O+</option>'+
						 	 	'<option value="O-">O-</option>'+
						 	 	'<option value="A+">A+</option>'+
								'<option value="A-">A-</option>'+
								'<option value="B+">B+</option>'+
								'<option value="AB+">AB+</option>'+
								'<option value="AB-">AB-</option>');
						}
						if(sangre=='AB+'){
							$("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O+">O+</option>'+
						 	 	'<option value="O-">O-</option>'+
						 	 	'<option value="A+">A+</option>'+
								'<option value="A-">A-</option>'+
								'<option value="B+">B+</option>'+
								'<option value="B-">B-</option>'+
								'<option value="AB-">AB-</option>');
						}
						if(sangre=='AB-'){
							$("#e_sangre").html('<option value="'+sangre+'">'+sangre+'</option>'+
						 	 	'<option value="O+">O+</option>'+
						 	 	'<option value="O-">O-</option>'+
						 	 	'<option value="A+">A+</option>'+
								'<option value="A-">A-</option>'+
								'<option value="B+">B+</option>'+
								'<option value="B-">B-</option>'+
								'<option value="AB+">AB+</option>');
						}
						
						var civil=data.result[0].estado_civil;
						// $("#e_civil").html('<option value="">prueba</option>');
						// console.log('estado'+civil);
						if(civil=='1'){
							$("#e_civil").html('<option value="'+civil+'">Casado</option>'+
							'<option value="2">Unión Libre</option>'+
							'<option value="3">Separado</option>'+
							'<option value="4">Divorciado</option>'+
							'<option value="5">Viudo</option>'+
							'<option value="6">Soltero</option>');
						}
						if(civil=='2'){
							$("#e_civil").html('<option value="'+civil+'">Unión Libre</option>'+
							'<option value="1">Casado</option>'+
							'<option value="3">Separado</option>'+
							'<option value="4">Divorciado</option>'+
							'<option value="5">Viudo</option>'+
							'<option value="6">Soltero</option>');
						}
						if(civil=='3'){
							$("#e_civil").html('<option value="'+civil+'">Separado</option>'+
							'<option value="1">Casado</option>'+
							'<option value="2">Unión Libre</option>'+
							'<option value="4">Divorciado</option>'+
							'<option value="5">Viudo</option>'+
							'<option value="6">Soltero</option>');
						}
						if(civil=='4'){
							$("#e_civil").html('<option value="'+civil+'">Divorciado</option>'+
							'<option value="1">Casado</option>'+
							'<option value="2">Unión Libre</option>'+
							'<option value="3">Separado</option>'+
							'<option value="5">Viudo</option>'+
							'<option value="6">Soltero</option>');
						}
						if(civil=='5'){
							$("#e_civil").html('<option value="'+civil+'">Viudo</option>'+
							'<option value="1">Casado</option>'+
							'<option value="2">Unión Libre</option>'+
							'<option value="3">Separado</option>'+
							'<option value="4">Divorciado</option>'+
							'<option value="6">Soltero</option>');
						}
						if(civil=='6'){
							$("#e_civil").html('<option value="'+civil+'">Soltero</option>'+
							'<option value="1">Casado</option>'+
							'<option value="2">Unión Libre</option>'+
							'<option value="3">Separado</option>'+
							'<option value="4">Divorciado</option>'+
							'<option value="5">Viudo</option>');
						}

						//referencias
						if(data.result2){
							data.result2.forEach(function(element,index){
								cont++;
								$("#e_idrefe"+cont).val(element.id);
								$("#e_referencias_empresariales"+cont).val(element.nombre_empresa);
								$("#e_fecha_referencia"+cont).val(element.fecha_ingreso);
								$("#e_fecha_retiro"+cont).val(element.fecha_retiro);
								$("#e_contacto_ref"+cont).val(element.persona_contacto);
								$("#e_celular_ref"+cont).val(element.celular);
								$("#e_cargo_ref"+cont).val(element.cargo);
								$("#e_anti_ref"+cont).val(element.antiguedad);
							
								$("#idlab"+cont).val(element.id);
								//documentos
								if(element.name_documento!='' && element.name_documento!=null){
									
										docu='<a  href="http://localhost/mvcLuisMiguel/'+element.documento_empresarial+'/'+element.name_documento+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
										$("#lab"+cont).html(docu);
										//$("#idlab"+cont).val(element.id);	
								}else{
									$("#lab"+cont).html('<p class="text-danger">No existe archivo</p>');
								}

							});
						}

						if(data.result3){
							//alert('si referencia personal');
							data.result3.forEach(function(element,index){
								contp++
								//$("#e_parenp"+contp).val(element.);
								var pare=element.parentezco;
								if(pare=='1'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Amigo/a</option>'+
										'<option value="2">Hermano/a</option>'+
										'<option value="3">Padre</option>'+
										'<option value="4">Madre</option>'+
										'<option value="5">Tio/a</option>'+
										'<option value="6">Sobrino/a</option>'+
										'<option value="7">Hijo/a</option>'+
										'<option value="8">Espaso/a</option>');
								}

								if(pare=='2'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Hermano/a</option>'+
										'<option value="1">Amigo/a</option>'+
										'<option value="3">Padre</option>'+
										'<option value="4">Madre</option>'+
										'<option value="5">Tio/a</option>'+
										'<option value="6">Sobrino/a</option>'+
										'<option value="7">Hijo/a</option>'+
										'<option value="8">Espaso/a</option>');
							 	}
							 	if(pare=='3'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Padre</option>'+
										'<option value="1">Amigo/a</option>'+
										'<option value="2">Hermano/a</option>'+
										'<option value="4">Madre</option>'+
										'<option value="5">Tio/a</option>'+
										'<option value="6">Sobrino/a</option>'+
										'<option value="7">Hijo/a</option>'+
										'<option value="8">Espaso/a</option>');
							 }
							 if(pare=='4'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Madre</option>'+
										'<option value="1">Amigo/a</option>'+
										'<option value="2">Hermano/a</option>'+
										'<option value="3">Padre</option>'+
										'<option value="5">Tio/a</option>'+
										'<option value="6">Sobrino/a</option>'+
										'<option value="7">Hijo/a</option>'+
										'<option value="8">Espaso/a</option>');
							 }
							  if(pare=='5'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Tio/a</option>'+
										'<option value="1">Amigo/a</option>'+
										'<option value="2">Hermano/a</option>'+
										'<option value="3">Padre</option>'+
										'<option value="4">Madre</option>'+
										'<option value="6">Sobrino/a</option>'+
										'<option value="7">Hijo/a</option>'+
										'<option value="8">Espaso/a</option>');
							 }
							 if(pare=='6'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Sobrino/a</option>'+
										'<option value="1">Amigo/a</option>'+
										'<option value="2">Hermano/a</option>'+
										'<option value="3">Padre</option>'+
										'<option value="4">Madre</option>'+
										'<option value="5">Tio/a</option>'+
										'<option value="7">Hijo/a</option>'+
										'<option value="8">Espaso/a</option>');
							 }
							 if(pare=='7'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Hijo/a</option>'+
										'<option value="1">Amigo/a</option>'+
										'<option value="2">Hermano/a</option>'+
										'<option value="3">Padre</option>'+
										'<option value="4">Madre</option>'+
										'<option value="5">Tio/a</option>'+
										'<option value="6">Sobrino/a</option>'+
										'<option value="8">Espaso/a</option>');
							 }
							  if(pare=='8'){
							 	$("#e_parenp"+contp).html('<option value="'+pare+'">Espaso/a</option>'+
										'<option value="1">Amigo/a</option>'+
										'<option value="2">Hermano/a</option>'+
										'<option value="3">Padre</option>'+
										'<option value="4">Madre</option>'+
										'<option value="5">Tio/a</option>'+
										'<option value="6">Sobrino/a</option>'+
										'<option value="7">Hijo/a</option>');
							 }

								$("#e_referencias_personales"+contp).val(element.nombre_personal);
								$("#e_fecha_personal"+contp).val(element.fecha_personal);
								$("#e_telefonop"+contp).val(element.tel_personal);
								$("#e_idp"+contp).val(element.id);
								$("#idper"+contp).val(element.id);
								if(element.name_documento!='' && element.name_documento!=''){
									docu='<a  href="http://localhost/mvcLuisMiguel/'+element.documento_personal+'/'+element.name_documento+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
									'</a>';
									$("#per"+contp).html(docu);
									//$("#idper"+contp).val(element.id);
								}else{
									$("#per"+contp).html('<p class="text-danger">No existe archivo</p>');
								}
								

							});
						}

						//documento licencia
						if(data.result[0].n_docu_licencia!='' && data.result[0].n_docu_licencia!=null){
							
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].subir_licencia+'/'+data.result[0].n_docu_licencia+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#licen1").html(docu);
						}else{
								$("#licen1").html('<p class="text-danger">No existe archivo</p>');
						}

						//documento rut
						if(data.result[0].n_docu_rut!='' && data.result[0].n_docu_rut!=null){
							
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].documento_rut+'/'+data.result[0].n_docu_rut+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#rut1").html(docu);
						}else{
								$("#rut1").html('<p class="text-danger">No existe archivo</p>');
						}

						//documento eps
						if(data.result[0].n_docu_eps!='' && data.result[0].n_docu_eps!= null){
							
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].documento_eps+'/'+data.result[0].n_docu_eps+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#eps1").html(docu);
						}else{
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
						if(data.result[0].n_docu_curso!='' && data.result[0].n_docu_curso!= null){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].carnet_curso+'/'+data.result[0].n_docu_curso+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#curso1").html(docu);
						}else{
							$("#curso1").html('<p class="text-danger">No existe Archivo</p>');
						}

						//documento indumentaria
						if(data.result[0].name_cindu!='' && data.result[0].name_cindu!= null){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_indumentaria+'/'+data.result[0].name_cindu+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#indu1").html(docu);
						}else{
							$("#indu1").html('<p class="text-danger">No existe archivo</p>');
						}


						//documento foto frontal
						if(data.result[0].name_cfrontal!='' && data.result[0].name_cfrontal!= null){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_conductor+'/'+data.result[0].name_cfrontal+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
							$("#frontal1").html(docu);
						}else{
							$("#frontal1").html('<p class="text-danger">No existe archivo</p>');
						}

						//documento foto derecha
						if(data.result[0].name_cderecha!='' && data.result[0].name_cderecha!= null){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_derecha+'/'+data.result[0].name_cderecha+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
							$("#derecha1").html(docu);
						}else{
							$("#derecha1").html('<p class="text-danger">No existe archivo</p>');
						}

						//documento foto izquierda
						if(data.result[0].name_cizquierda!='' && data.result[0].name_cizquierda!= null){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_izquierda+'/'+data.result[0].name_cizquierda+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
							$("#izquierda1").html(docu);
						}else{
							$("#izquierda1").html('<p class="text-danger">No existe acrhivo</p>');
						}


						/*
						 //DEMAS DATOS
						 //documentos de soporte
						 $("#e_caja_documentos").html(data.archivos);
						 $("#e_ruta_documentos").val(data.result[0].documentos_soporte);
						 //rferencia laboral1
						 $("#e_caja_referencia1").html();
						 $("#e_ruta_ref1").val(data.result[0].documento_empresarial1);
						 //referecnia laboral 2
						 $("#e_ruta_ref2").val(data.result[0].documento_empresarial2);
						 //referencia personal 1
						 $("#e_ruta_per1").val(data.result[0].documento_personal1);
						 //referencia personal 2
						 $("#e_ruta_per2").val(data.result[0].documento_personal2);
						 //eps
						 $("#e_ruta_eps").val(data.result[0].documento_eps);
						 //arl
						 $("#e_ruta_arl").val(data.result[0].documento_arl);
						 //curso 
						 $("#e_ruta_curso").val(data.result[0].carnet_curso);
						 //fotos proveedor
						 $("#e_ruta_fotos").val(data.result[0].foto_conductor);
						 //fotos indumentaria
						 $("#e_ruta_indumentaria").val(data.result[0].foto_indumentaria);
						 //licenica
						 $("#e_ruta_licencia").val(data.result[0].subir_licencia);
						 //rut

						 //TRAER NOMBRE DE LOS FICHEROS
						 //documentos
						 document.getElementById('e_documentos').onchange = function () {
						var docu=document.getElementById('e_documentos').files[0].name;
							$("#namefichero").val(docu);
						 }
						 //licencia conduccion
						  document.getElementById('e_docu_licencia').onchange = function () {
						var licencia=document.getElementById('e_docu_licencia').files[0].name;
							$("#namelicencia").val(licencia);
						 }
						 //referencialaboral1
						 document.getElementById('e_documento_referencia1').onchange = function () {
						var laboral1=document.getElementById('e_documento_referencia1').files[0].name;
							$("#namefre1").val(laboral1);
						 }
						 //referencialaboral2
						 document.getElementById('e_documento_referencia2').onchange = function () {
						var laboral2=document.getElementById('e_documento_referencia2').files[0].name;
							$("#nameref2").val(laboral2);
						 }
						 //referencia personal1
						  document.getElementById('e_documento_personal1').onchange = function () {
						var personal1=document.getElementById('e_documento_personal1').files[0].name;
							$("#namepersonal1").val(personal1);
						 }
						 //referencia personal2
						document.getElementById('e_documento_personal2').onchange = function () {
						var personal2=document.getElementById('e_documento_personal2').files[0].name;
							$("#namepersonal2").val(personal2);
						 }
						 //eps
						 document.getElementById('e_docu_eps').onchange = function () {
						var eps=document.getElementById('e_docu_eps').files[0].name;
							$("#nameeps").val(eps);
						 }
						 //arl
						  document.getElementById('e_docu_arl').onchange = function () {
						var arl=document.getElementById('e_docu_arl').files[0].name;
							$("#namearl").val(arl);
						 }
						 //curso
						 document.getElementById('e_docu_curso').onchange = function () {
						var curso=document.getElementById('e_docu_curso').files[0].name;
							$("#namecurso").val(curso);
						 }
						 //fotos conductor
						  document.getElementById('e_foto_conductor').onchange = function () {
						var photo=document.getElementById('e_foto_conductor').files[0].name;
							$("#namefotos").val(photo);
						 }
						 //fotos indumentaria
						 document.getElementById('e_foto_indume').onchange = function () {
						var photoi=document.getElementById('e_foto_indume').files[0].name;
							$("#nameindu").val(photoi);
						 }
							*/
						

						 //DOCUMENTO CERTIFICADO, FOTOS CONDUCTOR, FOTOS INDUMENTARIA

	 				}else{
	 					console.log('no hay datos');
	 				}
	 				
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('error dato proveedor');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});	
}

function historicodatosProveedor(id){
	// alert('historico proveedores');
	// alert(id);
	//datos de la tabla 
	var datos={
		id:id,
		action:'historicoproveedor'
	};
	$("#vehiculo").html('');
	$.ajax({
			url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
 			type:'POST',
 			data:datos,
 			dataType:'json',
 			success: function(data){
 				// console.log('hay historico');
 				console.log(data);
 				if(data){
 					// console.log('data si');
 					if(data.result){
 							data.result.forEach(function(element,index){
		 					$("#vehiculo").append('<tr>'+
		 					'<td>'+element.estado+'</td>'+
		 					'<td>'+element.cod_vehiculo+'</td>'+
		 					'<td>'+element.fecha_anterior+'</td>'+
		 					'<td>'+element.fecha_actual+'</td>'+
		 					'</tr>');
		 					});
 					}

 				}
 				
 			},
 			error: function(jqXHR, textStatus, errorThrown){
 				console.log('no hay historico');
 				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
 			}
 		});	

}
//VER PROVEEDOR ANTERIOR
function verProveedor(id_proveedor) {
	var datos={
			id:id_proveedor,
			action:'traer_datos_proveedorver'
		};
		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:datos,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('ok dato proveedor');
	 				console.log(data);
	 				if(data.result){
	 					//datos basicos

	 					$("#titulo_ver").text(data.result[0].nombre+"-"+data.result[0].numero_documento  );
						$("#v_tipo_documento").val(data.result[0].tipo_documento);
						$("#v_numero_documento").val(data.result[0].numero_documento);
						$("#v_digito_verificacion").val(data.result[0].digito_verificacion);
						$("#v_tipo_regimen").val(data.result[0].tipo_regimen);
						$("#v_tipo_identificacion").val(data.result[0].tipo_identificacion);
						$("#v_nombre").val(data.result[0].nombre);
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
						$("#v_eps").val(data.result[0].nombre_eps);//seguridad social
						 $("#v_fechaeps").val(data.result[0].fecha_vence_eps);//seguridad social
						 //$("#v_arl").val(data.result[0].nombre_arl);
						 //$("#v_fechaarl").val(data.result[0].fecha_vence_arl);
						 $("#v_curso").val(data.result[0].nombre_entidad);
						 $("#v_fechacurso").val(data.result[0].vence_curso);
						// //
						 $("#v_sexo").val(data.result[0].sexo);
						 $("#v_fecha_nacimiento").val(data.result[0].fecha_nacimiento);
						 $("#v_sangre").val(data.result[0].grupo_sanguineo);
						 $("#v_ingreso").val(data.result[0].fecha_ingreso);
						 

						  }else{
	 						console.log('no hay datos');
	 					}
						//datos del conductor
						var cont=0, i;
						if(data.result2){
							data.result2.forEach(function(element,index){
								cont++;
									$("#v_referencias_empresariales"+cont).val(element.nombre_empresa);
									$("#v_fechari"+cont).val(element.fecha_ingreso);
									$("#v_fecharr"+cont).val(element.fecha_retiro);
									$("#v_rcontac"+cont).val(element.persona_contacto);
									$("#v_rcelu"+cont).val(element.celular);
									$("#v_rcargo"+cont).val(element.cargo);
									$("#v_ranti"+cont).val(element.antiguedad);
									
									if(element.name_documento!='' && element.name_documento!=null){
									
										docu='<a  href="http://localhost/mvcLuisMiguel/'+element.documento_empresarial+'/'+element.name_documento+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
										$("#v_laboral"+cont).html(docu);
										//$("#idlab"+cont).val(element.id);	
									}else{
										$("#v_laboral"+cont).html('<p class="text-danger">No existe archivo</p>');
									}
							});
						 //}	

							var contp=0;
						if(data.result3){
							//alert('si referencia personal');
							data.result3.forEach(function(element,index){
								contp++
								//$("#e_parenp"+contp).val(element.);
							var pare=element.parentezco;
							 if(pare==1){
							 	$("#v_pare"+contp).val('Amigo/a');
							 }

							 if(pare==2){
							 	$("#v_pare"+contp).val('Hermano/a');
							 }

							 if(pare==3){
							 	$("#v_pare"+contp).val('Padre');
							 }

							 if(pare==4){
							 	$("#v_pare"+contp).val('Madre');
							 }

							 if(pare==5){
							 	$("#v_pare"+contp).val('Tio/a');
							 }

							 if(pare==6){
							 	$("#v_pare"+contp).val('Sobrino/a');
							 }

							 if(pare==7){
							 	$("#v_pare"+contp).val('Hijo/a');
							 }

							 if(pare==8){
							 	$("#v_pare"+contp).val('Espaso/a');
							 }
								$("#v_referencias_personales"+contp).val(element.nombre_personal);
								$("#v_fechap"+contp).val(element.fecha_personal);
								$("#v_ptel"+contp).val(element.tel_personal);


								if(element.name_documento!='' && element.name_documento!=''){
									docu='<a  href="http://localhost/mvcLuisMiguel/'+element.documento_personal+'/'+element.name_documento+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
									'</a>';
									$("#v_personal"+contp).html(docu);
									//$("#idper"+contp).val(element.id);
								}else{
									$("#v_personal"+contp).html('<p class="text-danger">No existe archivo</p>');
								}


							});
						}	

						//DOCUMENTOS
						var docu='';
						if(data.result[0].name_cfrontal!=null && data.result[0].name_cfrontal!=''){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_conductor+'/'+data.result[0].name_cfrontal+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
							$("#v_frente").html(docu);			
							
						}else{
							$("#v_frente").html('<p class="text-danger">No existe archivo</p>');
						}

						if(data.result[0].name_cderecha!=null && data.result[0].name_cderecha!='' ){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_derecha+'/'+data.result[0].name_cderecha+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
							$("#v_derecha").html(docu);			

						}else{
							$("#v_derecha").html('<p class="text-danger">No existe archivo</p>');
						}

			

						if(data.result[0].name_cizquierda!=null && data.result[0].name_cizquierda!='' ){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_izquierda+'/'+data.result[0].name_cizquierda+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
							$("#v_izquierda").html(docu);
						}else{
							$("#v_izquierda").html('<p class="text-danger">No existe archivo</p>');
						}


						if(data.result[0].name_cindu!=null && data.result[0].name_cindu!=''){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_indumentaria+data.result[0].name_cindu+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
							$("#v_indumentaria").html(docu);	
						}else{
							$("#v_indumentaria").html('<p class="text-danger">No existe archivo</p>');
						}

						if(data.result[0].n_docu_licencia!=null  && data.result[0].n_docu_licencia!=''){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].subir_licencia+data.result[0].n_docu_licencia+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
							$("#v_licencia").html(docu);
						}else{
							$("#v_licencia").html('<p class="text-danger">No existe archivo</p>');
						}

						if(data.result[0].n_docu_eps!=null && data.result[0].n_docu_eps!=''){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].documento_eps+'/'+data.result[0].n_docu_eps+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
							$("#v_planilla").html(docu);
						}else{
							$("#v_planilla").html('<p class="text-danger">No existe archivo</p>');
						}

						if(data.result[0].n_docu_curso!=null && data.result[0].n_docu_curso!=''){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].carnet_curso+data.result[0].n_docu_curso+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';			
							$("#v_curso").html(docu);
						}else{
							$("#v_curso").html('<p class="text-danger">No existe archivo</p>');
						}

						if(data.result[0].n_docu_rut!=null && data.result[0].n_docu_rut!=''){
							docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].documento_rut+data.result[0].n_docu_rut+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
										'</a>';
							$("#v_certificado").html(docu);
						}else{
							$("#v_certificado").html('<p class="text-danger">No existe archivo</p>');
						}

						
						

						
						






							/*
						 $("#v_caja_conductor").html(data.fotosc);
						 $("#v_caja_indumentaria").html(data.fotosi);
						 $("#v_caja_licencia").html(data.licen);
						 $("#v_caja_laboralu").html(data.labuno);
						 $("#v_caja_laborald").html(data.labdos);
						 $("#v_caja_personalu").html(data.peru);
						 $("#v_caja_personald").html(data.perd);
						 $("#v_caja_esp").html(data.eps);
						 $("#v_caja_arl").html(data.arl);
						 $("#v_caja_curso").html(data.curso);
						 $("#v_caja_rut").html(data.rut); */

						}



	 				
	 				
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('error dato proveedor');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});		





/*
	//$("#e_id_vehiculo").val(id_vehiculo);
	$("#li_conduce").show();	
	 // alert('Bienvenido a ver proveedor');
	var params = {
		accion: 'verProveedor',
		id_proveedor : id_proveedor
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			// alert('success');
			$("#titulo_ver").text(data.content["nombre"]+"-"+data.content["numero_documento"]  );
			$("#v_tipo_documento").val(data.content["tipo_documento"]);
			$("#v_numero_documento").val(data.content["numero_documento"]);
			$("#v_digito_verificacion").val(data.content["digito_verificacion"]);
			$("#v_tipo_regimen").val(data.content["tipo_regimen"]);
			$("#v_tipo_identificacion").val(data.content["tipo_identificacion"]);
			$("#v_nombre").val(data.content["nombre"]);
			$("#v_abreviatura").val(data.content["abreviatura"]);
			$("#v_contacto").val(data.content["contacto"]);
			$("#v_direccion").val(data.content["direccion"]);
			$("#v_email").val(data.content["email"]);
			$("#v_estado").val(data.content["estado"]);
			$("#v_municipio").val(data.content["municipio"]);
			$("#v_id_municipio").val(data.content["id_municipio"]);
			
			// $("#v_Conductor").prop("checked",false);
			// $("#v_Empleado").prop("checked",false);
			// $("#v_poseedor_vehiculo").prop("checked",false);
			// $("#v_propietario_vehiculo").prop("checked",false);
			// $("#v_Destinatario").prop("checked",false);
			// $("#v_Remitente").prop("checked",false);
			// $("#v_Proveedor").prop("checked",false);
			// $("#v_caja_documentos").html (data.archivos);
				
			//if(data.actividades.length>0){
				//for(let i=0;i<data.actividades.length;i++){
					//if (data.actividades[i]["actividad"]=="Conductor"){
						//$("#v_Conductor").prop("checked",true);
						
						 if(data.content2){
						 	$("#li_conduce").show();
						 	//console.log(data.content2[0]);
						// 	console.log('actividad no reporta conductor');
						//}else{
						// 	console.log('si hay actividad reportada de conductor');
						// }
						//añadir los valores con content2
						 $("#v_referencias_empresariales").val(data.content2["referencias_empresariales"]);
						 $("#v_referencias_personales").val(data.content2["referencias_personales"]);
						 $("#v_observaciones").val(data.content2["observaciones"]);
						 $("#v_categoria_licencia").val(data.content["rndc_categoria_licencia"]);
						 $("#v_numero_licencia").val(data.content["rndc_numero_licencia"]);
						 $("#v_fecha_expidelicencia").val(data.content2["licencia_expedicion"]);
						 $("#v_fechavencelicencia").val(data.content["rndc_vencimiento_licencia"]);
						 $("#v_referencias_empresariales").val(data.content2["nombre_empresarial1"]);
						 $("#v_fechar1").val(data.content2["fecha_empresarial1"]);
						 $("#v_referencias_empresariales2").val(data.content2["nombre_Empresarial2"]);
						 $("#v_fechar2").val(data.content2["fecha_empresarial2"]);
						 $("#v_referencias_personales").val(data.content2["nombre_personal1"]);
						 $("#v_fechap1").val(data.content2["fecha_personal1"]);
						 $("#v_referencias_personales2").val(data.content2["nombre_personal2"]);
						 $("#v_fechap2").val(data.content2["fecha_personal2"]);
						 $("#v_eps").val(data.content2["nombre_eps"]);
						 $("#v_fechaeps").val(data.content2["fecha_vence_eps"]);
						 $("#v_arl").val(data.content2["nombre_arl"]);
						 $("#v_fechaarl").val(data.content2["fecha_vence_arl"]);
						 $("#v_curso").val(data.content2["nombre_entidad"]);
						 $("#v_fechacurso").val(data.content2["vence_curso"]);
						// //
						 $("#v_sexo").val(data.content2["sexo"]);
						 $("#v_fecha_nacimiento").val(data.content2["fecha_nacimiento"]);
						 $("#v_sangre").val(data.content2["grupo_sanguineo"]);
						 $("#v_civil").val(data.content2["estado_civil"]);
						 $("#v_ingreso").val(data.content2["fecha_ingreso"]);
						 $("#v_caja_conductor").html(data.fotosc);
						 $("#v_caja_indumentaria").html(data.fotosi);
						 $("#v_caja_licencia").html(data.licen);
						 $("#v_caja_laboralu").html(data.labuno);
						 $("#v_caja_laborald").html(data.labdos);
						 $("#v_caja_personalu").html(data.peru);
						 $("#v_caja_personald").html(data.perd);
						 $("#v_caja_esp").html(data.eps);
						 $("#v_caja_arl").html(data.arl);
						 $("#v_caja_curso").html(data.curso);
						 $("#v_caja_rut").html(data.rut);
					}
					if (data.actividades[i]["actividad"]=="Empleado"){
						$("#v_Empleado").prop("checked",true);
					}
					if (data.actividades[i]["actividad"]=="Poseedor Vehiculo"){
						$("#v_poseedor_vehiculo").prop("checked",true);
					}
					if (data.actividades[i]["actividad"]=="Propietario Vehiculo"){
						$("#v_propietario_vehiculo").prop("checked",true);
					}
					if (data.actividades[i]["actividad"]=="Destinatario"){
						$("#v_Destinatario").prop("checked",true);
					}
					if (data.actividades[i]["actividad"]=="Remitente"){
						$("#v_Remitente").prop("checked",true);
					}
					if (data.actividades[i]["actividad"]=="Proveedor"){
						$("#v_Proveedor").prop("checked",true);
					}
				//}
			//}
		}
		else{}
	}, 'json');*/
}

//EDITAR EL FORMULARIO DE PROVEEDOR
function editarProveedornew(){
	//VALIDACIONES
	$(".nexos-messages_editap").html('');
	// Se valida contenido del formulario 
	//alert('entro a editarProveedor');
	var msg_error = "";
	var flag_primer_apellido = true;
	var flag_abreviatura = true;
	var flag_telefono = true;
	var tipo_actividad = false;
	$( ".e_tipo_actividad" ).each(function() {
		if( $(this).is(":checked") ) {
			tipo_actividad = true;
			if( $(this).attr("id") == "e_Conductor" ){
				if( !$("#e_categoria").val() ){
					msg_error+= "<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_num_licencia").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_vence_licencia").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder editar el Proveedor.</p>";
				}else{
					if ( !validaFechaActual( $("#e_vence_licencia").val() ) ) {
						msg_error+= "<p>El campo <strong>Vencimiento Licencia</strong> debe ser mayor de la fecha actual para poder editar el Proveedor.</p>";
					}
				}
				if( !$("#e_celular2").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Celular Contacto 2</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_referencias_empresariales1").val()){
					msg_error+= "<p>Debe diligenciar el campo <strong>Empresa 1</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_celular_ref1").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Celular Empresa 1</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_referencias_empresariales2").val()){
					msg_error+= "<p>Debe diligenciar el campo <strong>Empresa 2</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_celular_ref2").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Celular Empresa 2</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_referencias_empresariales3").val()){
					msg_error+= "<p>Debe diligenciar el campo <strong>Empresa 3</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_celular_ref3").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Celular Empresa 3</strong> para poder editar el Proveedor.</p>";
				}
				if ( $("#e_tipo_documento").val() == "NIT" ) {
					msg_error+= "<p>No se puede crear un conductor registrado con NIT.</p>";
				}
			}
		}
	});
	if( !tipo_actividad ){
		msg_error+= "<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder editar el Proveedor.</p>";
	}
	if( !$("#e_tipo_documento").val() ){
		msg_error+= "<p>Debe seleccionar un <strong>Tipo de documento</strong> para poder editar el Proveedor.</p>";
		if ( !$("#e_contacto").val() && !$("#e_celular").val() ) {
			flag_telefono = false;
			var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
		}
	}else{
		if ( $("#e_tipo_documento").val() == "Cedula de Ciudadania" || $("#e_tipo_documento").val() == "Cedula de Extranjeria" ) {
			if( !$("#e_primer_apellido").val() ){
				flag_primer_apellido = false;
			}
			if (!$("#e_celular").val() ) {
				flag_telefono = false;
				var msg_error_telefono = "<p>Debe diligenciar el campo<strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
			}
		}
		if ( $("#e_tipo_documento").val() == "NIT" ) {
			if( !$("#e_contacto").val() ){
				flag_telefono = false;
				var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder editar el Proveedor.</p>";
			}
			
		}
	}
	if( !$("#e_numero_documento").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Número de documento</strong> para poder editar el Proveedor.</p>";
	}
	
	if( !$("#e_rndc_nombre").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder editar el Proveedor.</p>";
	}
	
	if( !$("#e_direccion").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder editar el Proveedor.</p>";
	}
	
	if( !$("#e_municipio").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Municipio</strong> para poder editar el Proveedor.</p>";
	}
	if (!msg_error) {
		 
	// alert('actualizar el proveedor');
	var data = null;
	data = new FormData();
	//ARCHIVOS PARA ACTUALIZAR
	//documento soporte
	var archivos = document.getElementById('e_documentos').files;
	for (var x = 0; x < archivos.length; x++) {
			data.append("e_documentos" + x, archivos[x]);
	}

	//Datos
		data.append("accion", 'editarProveedornew');
		data.append("id_proveedor", $("#eusuario").val());
		data.append("nombre", $("#e_rndc_nombre").val());
		data.append("abreviatura", $("#e_abreviatura").val());
		data.append("tipo_docu", $("#e_tipo_documento").val());
		data.append("num_docu", $("#e_numero_documento").val());
		data.append("tipo_identificacion", $("#e_tipo_identificacion").val());
		data.append("telefono", $("#e_contacto").val());
		data.append("celular", $("#e_celular").val());
		data.append("email", $("#e_email").val());
		data.append("estado", $("#e_estado").val());
		data.append("municipio", $("#e_municipio").val());
		data.append("direccion", $("#e_direccion").val());
		data.append("digito", $("#e_digito_verificacion").val());
		data.append("e_ruta_documentos", $("#e_ruta_documentos").val());
		//datos de licencia
		data.append("e_categoria", $("#e_categoria").val());
		data.append("e_num_licencia", $("#e_num_licencia").val());
		data.append("e_vence_licencia", $("#e_vence_licencia").val());
		data.append("conductor", 0);

$(".e_tipo_actividad" ).each(function() {
	if( $(this).is(":checked") ) {
			tipo_actividad = true;
		if( $(this).attr("id") == "e_Conductor" ){
		//referencia laboral 1
		var laboral = document.getElementById('e_documento_referencia1').files;
			for(var a = 0; a < laboral.length; a++){
				data.append("e_documento_referencia1" + a, laboral[a]);
		}

		//referencia 2
		var laborald = document.getElementById('e_documento_referencia2').files;
			for(var t = 0; t < laborald.length; t++){
				data.append("e_documento_referencia2" + t, laborald[t]);
			}

		//referencia 3
		var laboralt = document.getElementById('e_documento_referencia3').files;
			for(var q = 0; q < laboralt.length; q++){
				data.append("e_documento_referencia3" + q, laboralt[q]);
			}	
		//personal 1
		var personalu = document.getElementById('e_documento_personal1').files;
			for(var b = 0; b < personalu.length; b++){
				data.append("e_documento_personal1" + b, personalu[b]);
			}
		//personal 2
			var personald = document.getElementById('e_documento_personal2').files;
			for(var c = 0; c < personald.length; c++){
				data.append("e_documento_personal2" + c, personald[c]);
			}	
		//eps
		var eps = document.getElementById('e_docu_eps').files;
			for(var d = 0; d < eps.length; d++){
				data.append("e_docu_eps" + d, eps[d]);
		}	
		//arl
		/*var arl = document.getElementById('e_docu_arl').files;
			for(var e = 0; e < arl.length; e++){
				data.append("e_docu_arl" + e, arl[e]);
		}	*/
		//curso
		var curso = document.getElementById('e_docu_curso').files;
			for(var f = 0; f < curso.length; f++){
				data.append("e_docu_curso" + f, curso[f]);
		}

		//rut
		var rut = document.getElementById('e_docu_rut').files;
			for(var r = 0; r < rut.length; r++){
				data.append("e_docu_rut" + r, rut[r]);
		}
		//licencia
		var lice = document.getElementById('e_docu_lice').files;
			for(var l = 0; l < lice.length; l++){
				data.append("e_docu_lice" + l, lice[l]);
		}
		//fotos conductor fontral
		var conductor = document.getElementById('e_foto_conductor').files;
			for(var g = 0; g < conductor.length; g++){
				data.append("e_foto_conductor" + g, conductor[g]);
		}
		//fotos conductor derecha

		var conductord = document.getElementById('e_foto_derecha').files;
			for(var x = 0; x < conductord.length; x++){
				data.append("e_foto_derecha" + x, conductord[x]);
		}

		//fotos conductor izquierda
		var conductori = document.getElementById('e_foto_izquierda').files;
			for(var z = 0; z < conductori.length; z++){
				data.append("e_foto_izquierda" + z, conductori[z]);
		}
		//fotos indumentaria
		var cursoi = document.getElementById('e_foto_indume').files;
			for(var f = 0; f < cursoi.length; f++){
				data.append("e_foto_indume" + f, cursoi[f]);
		}
		//licencia de conduccion
		var licen = document.getElementById('e_docu_licencia').files;
			for(var h = 0; h < licen.length; h++){
				data.append("e_docu_licencia" + h, licen[h]);
		}

		

		data.append("conductor", 1);
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
		data.append("e_ruta_fotos", $("#e_ruta_fotos").val());//frontal

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
		data.append("arlname", '');
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
		}
	}
  });


	$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function (data, textStatus, jqXHR)
			{
				// console.log('ACTUALIZO PROVEEDOR');
				alert('Datos Actualizados Existosamente!!!');
				$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);
			},
			error: function (jqXHR, textStatus, errorThrown){
				console.log('NO ACTUALIZO PROVEEDOR');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
	});

	

	}else{
		$(".nexos-messages_editap").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("#editar_proveedor").animate({ scrollTop: 0 }, 600);
	}

}


//EDITAR PROVEEDOR ANTERIOR
function editarProveedor() {
	$(".nexos-messages").html('');
	// Se valida contenido del formulario 
	alert('entro a editarProveedor');
	var msg_error = "";
	var flag_primer_apellido = true;
	var flag_abreviatura = true;
	var flag_telefono = true;
	var tipo_actividad = false;

	$( ".e_tipo_actividad" ).each(function() {
		if( $(this).is(":checked") ) {
			tipo_actividad = true;
			if( $(this).attr("id") == "e_Conductor" ){
				if( !$("#e_categoria_licencia").val() ){
					msg_error+= "<p>Debe seleccionar una <strong>Catergoría Licencia</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_numero_licencia").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Número de Licencia</strong> para poder editar el Proveedor.</p>";
				}
				if( !$("#e_vencimiento_licencia").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Vencimiento Licencia</strong> para poder editar el Proveedor.</p>";
				}else{
					if ( !validaFechaActual( $("#e_vencimiento_licencia").val() ) ) {
						msg_error+= "<p>El campo <strong>Vencimiento Licencia</strong> debe ser mayor de la fecha actual para poder editar el Proveedor.</p>";
					}
				}
				if ( $("#e_tipo_documento").val() == "NIT" ) {
					msg_error+= "<p>No se puede crear un conductor registrado con NIT.</p>";
				}
			}
		}
	});
	if( !tipo_actividad ){
		msg_error+= "<p>Debe seleccionar por lo menos un <strong>Tipo de actividad</strong> para poder editar el Proveedor.</p>";
	}
	if( !$("#e_tipo_documento").val() ){
		msg_error+= "<p>Debe seleccionar un <strong>Tipo de documento</strong> para poder editar el Proveedor.</p>";
		if ( !$("#e_contacto").val() && !$("#e_celular").val() ) {
			flag_telefono = false;
			var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
		}
	}else{
		if ( $("#e_tipo_documento").val() == "Cedula de Ciudadania" || $("#e_tipo_documento").val() == "Cedula de Extranjeria" ) {
			if( !$("#e_primer_apellido").val() ){
				flag_primer_apellido = false;
			}
			if ( !$("#e_contacto").val() && !$("#e_celular").val() ) {
				flag_telefono = false;
				var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> o <strong>Celular Contacto</strong> para poder editar el Proveedor.</p>";
			}
		}
		if ( $("#e_tipo_documento").val() == "NIT" ) {
			if( !$("#e_contacto").val() ){
				flag_telefono = false;
				var msg_error_telefono = "<p>Debe diligenciar el campo <strong>Teléfono Fijo Contacto</strong> para poder editar el Proveedor.</p>";
			}
			if( !$("#e_abreviatura").val() ){
				flag_abreviatura = false;
				var msg_error_abreviatura = "<p>Debe diligenciar el campo <strong>Abreviatura</strong> para poder editar el Proveedor.</p>";
			}
		}
	}
	if( !$("#e_numero_documento").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Número de documento</strong> para poder editar el Proveedor.</p>";
	}
	if( !$("#e_tipo_regimen").val() ){
		msg_error+= "<p>Debe seleccionar un <strong>Tipo de régimen</strong> para poder editar el Proveedor.</p>";
	}
	if( !$("#e_rndc_nombre").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Nombre o Razón social</strong> para poder editar el Proveedor.</p>";
	}
	if ( !flag_primer_apellido ) {
		msg_error+= "<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder editar el Proveedor.</p>";
	}
	if( !flag_abreviatura ){
		msg_error+= msg_error_abreviatura;
	}
	if( !flag_telefono ){
		msg_error+= msg_error_telefono;
	}
	if( !$("#e_direccion").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder editar el Proveedor.</p>";
	}
	if( !$("#e_email").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Correo electrónico</strong> para poder editar el Proveedor.</p>";
	}
	if( !$("#e_id_municipio").val() ){
		msg_error+= "<p>Debe diligenciar el campo <strong>Municipio</strong> para poder editar el Proveedor.</p>";
	}
	// Fin - Se valida contenido del formulario 

	if (!msg_error) {
		var data = null;
		data = new FormData();
		//ARCHIVOS PARA ACTUALIZAR
		var archivos = document.getElementById('e_documentos').files;
		for (var x = 0; x < archivos.length; x++) {
			data.append("documentos" + x, archivos[x]);
		}



		data.append("accion", 'editarProveedor');
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
		data.append("Conductor", $("#e_Conductor").is(':checked'));
		data.append("Empleado", $("#e_Empleado").is(':checked'));
		data.append("poseedor_vehiculo", $("#e_poseedor_vehiculo").is(':checked'));
		data.append("propietario_vehiculo", $("#e_propietario_vehiculo").is(':checked'));
		data.append("Proveedor", $("#e_Proveedor").is(':checked'));
		data.append("rndc_nombre", $("#e_rndc_nombre").val());
		data.append("rndc_id_municipio", $("#e_rndc_id_municipio").val());

		if ( $("#e_primer_apellido").val() ) {
			data.append("primer_apellido", $("#e_primer_apellido").val());
		}
		if ( $("#e_segundo_apellido").val() ) {
			data.append("segundo_apellido", $("#e_segundo_apellido").val());
		}

		if ( $("#e_Conductor").is(':checked') ) {
			// console.log("está seleccionada la opción conductor");
			data.append("categoria_licencia", $("#e_categoria_licencia").val());
			data.append("numero_licencia", $("#e_numero_licencia").val());
			data.append("vencimiento_licencia", $("#e_vencimiento_licencia").val());
		}

		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			beforeSend	: function(jqXHR, settings){
				$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
			
				console.log(data);
			},
			success: function (data, textStatus, jqXHR)
			{

				// console.log(data);
				if (!data.error) {
					$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>');
					$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);
				} 
				else {
					var msg_error = data.error.replace(/\n/g , "</p><p>");
					$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
					$("html, body").animate({ scrollTop: 0 }, 600);
				}
			},
			error: function (jqXHR, textStatus, errorThrown){
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	}
	else{
		$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
		$("html, body").animate({ scrollTop: 0 }, 600);
	}
}

function datosinactivarproveedor(id_proveedor) {
	$("#i_id_proveedor").val(id_proveedor);
	var params = {
		accion: 'verProveedor',
		id_proveedor : id_proveedor
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			// $("#titulo_inactivar").text("¿Desea inactivar el proveedor con numero de documento "+data.content["numero_documento"]+"?");
		}
		else{}
	}, 'json');
}

function datosactivarproveedor(id_proveedor) {
	$("#a_id_proveedor").val(id_proveedor);
	var params = {
		accion: 'verProveedor',
		id_proveedor : id_proveedor
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if(data.success) {
			// $("#titulo_activar").text("¿Desea activar el proveedor con numero de documento "+data.content["numero_documento"]+"?");
		}
		else{}
	}, 'json');
}

function inactivarProveedor() {
	var params = {
		accion: 'inactivarProveedor',
		id_proveedor: $("#i_id_proveedor").val()
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#btn_inactivar_proveedor").attr("data-dismiss","modal");
			location.reload();
		}
		else{
			$("#btn_inactivar_proveedor").removeAttr("data-dismiss");
		}
	}, 'json');
}

function activarProveedor() {
	var params = {
		accion: 'activarProveedor',
		id_proveedor: $("#a_id_proveedor").val()
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#btn_activar_proveedor").attr("data-dismiss","modal");
			location.reload();
		}
		else{
			$("#btn_activar_proveedor").removeAttr("data-dismiss");
		}
	}, 'json');
}

function calcularDigitoVerificacion( myNit )  {
	var vpri, x, y, z;
  
	// Se limpia el Nit
	myNit = myNit.replace ( /\s/g, "" ) ; // Espacios
	myNit = myNit.replace ( /,/g,  "" ) ; // Comas
	myNit = myNit.replace ( /\./g, "" ) ; // Puntos
	myNit = myNit.replace ( /-/g,  "" ) ; // Guiones
	
	// Se valida el nit
	if  ( isNaN ( myNit ) )  {
		console.log ("El nit/cédula '" + myNit + "' no es válido(a).") ;
		return "" ;
	};

	// Procedimiento
	vpri = new Array(16) ;
	z = myNit.length ;

	vpri[1]  =  3 ;
	vpri[2]  =  7 ;
	vpri[3]  = 13 ; 
	vpri[4]  = 17 ;
	vpri[5]  = 19 ;
	vpri[6]  = 23 ;
	vpri[7]  = 29 ;
	vpri[8]  = 37 ;
	vpri[9]  = 41 ;
	vpri[10] = 43 ;
	vpri[11] = 47 ;  
	vpri[12] = 53 ;  
	vpri[13] = 59 ; 
	vpri[14] = 67 ; 
	vpri[15] = 71 ;

	x = 0 ;
	y = 0 ;
	for  ( var i = 0; i < z; i++ )  { 
		y = ( myNit.substr (i, 1 ) ) ;
		// console.log ( y + "x" + vpri[z-i] + ":" ) ;
		x += ( y * vpri [z-i] ) ;
		// console.log ( x ) ;
	}

	y = x % 11 ;
	// console.log ( y ) ;
	return ( y > 1 ) ? 11 - y : y ;
}

var municipios=[]
function cargarmunicipios(){
	var data = null;
	data = new FormData();
	data.append("accion","cargarmunicipios");
	municipios=[];
	$.ajaxSetup({async: false});

	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		cache: data,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function (data, textStatus, jqXHR){
			// console.log(data);
			if (data.success) {
				for (let x = 0; x < data.content.length; x++) {
					municipios.push(data.content[x]['MUNICIPIO']);
				}
				// console.log(municipios);
				$('#caja_municipio .typeahead').typeahead(
					{
						minLength: 1
					},
					{
						name: 'states',
						source: substringMatcher(municipios),
					}
				);

				$.ajaxSetup({async: false});
				$('#caja_municipio').bind('typeahead:selected', function (obj, datum, name) {
					var params = {
						accion: 'obtenerdatosmunicipio',
						municipio: datum
					};
					$.post(url, params, function (data) {
						// console.log(data);
						if (data.success) {
							var nombre = data.content.nombre;
							$("#municipio").val(nombre);
							$("#id_municipio").val(data.content.id);
							$("#rndc_id_municipio").val(data.content.rndc_codigo_ciudad);
							$("#estado").focus();
						} else {
							$("#municipio").val("");
						}
					}, 'json');
				});
				$.ajaxSetup({async: true});
				$("#municipio").focusout(function () {
					// console.log($.inArray($("#municipio").val(), municipios));
					if ($.inArray($("#municipio").val(), municipios) == (-1)) {
					} else {
					}
				});
				$('#e_caja_municipio .typeahead').typeahead(
					{
						minLength: 1
					},
					{
						name: 'states',
						source: substringMatcher(municipios),
					}
				);

				$.ajaxSetup({async: false});
				$('#e_caja_municipio').bind('typeahead:selected', function (obj, datum, name) {
					var params = {
						accion: 'obtenerdatosmunicipio',
						municipio: datum
					};
					$.post(url, params, function (data) {
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
					}, 'json');
				});
				$.ajaxSetup({async: true});
				$("#e_municipio").focusout(function () {
					// console.log($.inArray($("#e_municipio").val(), municipios));
					if ($.inArray($("#e_municipio").val(), municipios) == (-1)) {
						//$("#nombre_propietario").val("");
					} else {
					}
				});
			} else {
			}
		},
		error: function (jqXHR, textStatus, errorThrown){
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});
	$.ajaxSetup({async: true});
}

var substringMatcher = function (strs) {
	return function findMatches(q, cb) {
		var matches, substringRegex;

		// an array that will be populated with substring matches
		matches = [];

		// regex used to determine if a string contains the substring `q`
		substrRegex = new RegExp(q, 'i');

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
