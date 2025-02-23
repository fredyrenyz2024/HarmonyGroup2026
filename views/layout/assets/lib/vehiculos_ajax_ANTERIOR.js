$(document).ready(function() {
	$("#btn_agregar_vehiculo").click(function () {
		$(".nexos_messages_popup").html('');
		var msg_error = "";
		var msg_error2 = "";

		// Se hacen las validaciones del formulario de creación del vehículo
		if( !$("#placa").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#configuracion").val() && !$("#id_vehiculo_configuracion").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Configuración</strong> para poder crear el Vehículo.</p>";
		}

		if( !$("#color").val() && !$("#id_vehiculo_color").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Color</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#marca").val() && !$("#id_vehiculo_marca").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Marca</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#linea").val() && !$("#id_vehiculo_linea").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Línea</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#modelo").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Modelo</strong> para poder crear el Vehículo.</p>";
		}
		//if( !$("#tipo_vehiculo").val() && !$("#id_tipo_vehiculo").val() ){
			//msg_error+= "<p>Debe diligenciar el campo <strong>Tipo de Vehículo</strong> para poder crear el Vehículo.</p>";
		//}
		// if( !$("#tipo_carroceria").val() ){
		// 	msg_error+= "<p>Debe seleccionar un <strong>Tipo Carrocería</strong> para poder crear el Vehículo.</p>";
		// }
		if( !$("#peso_vacio").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Peso Vacío</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#numero_poliza").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Número SOAT</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#soat_vencimiento").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Vencimiento SOAT</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#aseguradora").val() && !$("#id_vehiculo_aseguradora").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Aseguradora</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#web_satelital").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Web satelital</strong> para poder crear el Vehículo.</p>";
	
		}
		if( !$("#usuario_satelital").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Usuario satelital</strong> para poder crear el Vehículo.</p>";

		}
		if( !$("#clave_satelital").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Clave satelital</strong> para poder crear el Vehículo.</p>";
		}
		
		if( !$("#num_motor").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Número motor</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#num_chasis").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Número chasis</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#tipovinculacion").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Tipo de vinculación</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#capacidad_tn").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Capacidad de carga(Kg)</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#peso_bruto").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Peso Bruto (Kg)</strong> para poder crear el Vehículo.</p>";
		}

		if( !$("#clase_v").val()){
			msg_error+= "<p>Debe diligenciar el campo <strong>Clase de Vehículo</strong> para poder crear el Vehículo.</p>";
		}

		if( !$("#repotencia").val() ){
			msg_error+= "<p>Por favor seleccione una opción del campo <strong> Repotenciar </strong> para poder crear el Vehículo.</p>";
		}

		if($("#repotencia").val()==1){
			if(!$("#repotenciado").val()){
				msg_error+= "<p>Debe diligenciar el campo <strong>repotenciado a:</strong> para poder crear el Vehículo.</p>";
			}
		}

		if($("#repotencia").val()==0){
			$("#repotenciado").val('');
		}

		if(!$("#f_matricula").val()){
			msg_error+= "<p>Debe diligenciar el campo <strong>Fecha de matrícula</strong> para poder crear el Vehículo.</p>";
		}

		//validar tecnomecanica segun fecha
		if($("#f_matricula").val()){
			var matri=$("#f_matricula").val();
			var fhoy=moment();
			var tf=fhoy.diff(matri,'days');
			if(tf >730){//es obligatorio subir archivo y tecnomecanica
				if( !$("#foto_tecno").val() ){
					msg_error+= "<p>Debe diligenciar el campo <strong>Tecnomecánica (documento)</strong> para poder crear el Vehículo, ya que la fecha de matrícula es mayor a dos años.</p>";
				}

				if( !$("#tecnomecanica").val()){
					msg_error+= "<p>Debe diligenciar el campo <strong>Tecnomecánica</strong> para poder crear el Vehículo.</p>";
				}
			}
		}

		//validar el trailer según configuracion
		if($("#configuracion").val()){
			var confi=$("#configuracion").val();
			var dato={
				confi:confi,
				action:'verificar'
			};
			var msg_error2="";
			var sw = 0;
			$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data: dato,
	 			dataType:'json',
	 			success: function(data){
	 					var c=data.result[0].nombre;
	 					if (c=="S1"){
                           sw=1;
      					}
	 					var lon=c.length;
	 					if (lon == 1){
		 					sw=1;
	 					}	
	 					if (sw==0){
	 						if(!$("#trailers").val()){
	 							msg_error2+= "<p>Debe diligenciar el campo <strong>Trailer</strong> para poder crear el Vehículo, ya que es requerido por la configuración seleccionada.</p>";
	 							$(".nexos_messages_popup").append('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error2 + '</div></div>');		
	 						}
	 					}	
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no hizo valida configuracion');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}	
	 		});	
		}

		if( !$("#cedula_propietario").val() && !$("#id_propietario").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Documento Propietario</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#cedula_tenedor").val() && !$("#id_tenedor").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Documento Tenedor</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#cedula_conductor").val() && !$("#id_conductor").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Documento Conductor</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#id_propietario").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Propietario en Datos Específicos</strong> para poder crear el Vehículo.</p>";

		}
		if( !$("#id_tenedor").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Poseedor en Datos Específicos</strong> para poder crear el Vehículo.</p>";

		}
		if( !$("#id_conductor").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Conductor en Datos Específicos</strong> para poder crear el Vehículo.</p>";
		}
		// Fin - Se hacen las validaciones del formulario de creación del vehículo
		if ((!msg_error) && (!msg_error2)) {
			crearVehiculo();
			//alert('Puede crear vehiculo');
		} 
		else {
			$(".nexos_messages_popup").append('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');		
			$("#crea_vehiculos").animate({ scrollTop: 0 }, 600);
		}
	});
	$("#btn_editar_vehiculo").click(function () {
		$(".nexos_messages_popup").html('');
		var msg_error = "";
		// alert('editar vehiculo');
		// Se hacen las validaciones del formulario de edición del vehículo
		if( !$("#e_placa").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_configuracion").val() && !$("#e_id_vehiculo_configuracion").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Configuración</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_color").val() && !$("#e_id_vehiculo_color").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Color</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_marca").val() && !$("#e_id_vehiculo_marca").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Marca</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_linea").val() && !$("#e_id_vehiculo_linea").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Línea</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_modelo").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Modelo</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_tipo_vehiculo").val() && !$("#e_id_tipo_vehiculo").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Tipo de Vehículo</strong> para poder crear el Vehículo.</p>";
		}
		// if( !$("#e_tipo_carroceria").val() ){
		// 	msg_error+= "<p>Debe seleccionar un <strong>Tipo Carrocería</strong> para poder crear el Vehículo.</p>";
		// }
		if( !$("#e_peso_vacio").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Peso Vacío</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_cedula_propietario").val() && !$("#e_id_propietario").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Documento Propietario</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_cedula_tenedor").val() && !$("#e_id_tenedor").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Documento Tenedor</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_cedula_conductor").val() && !$("#e_id_conductor").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Documento Conductor</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_numero_poliza").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Número SOAT</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_soat_vencimiento").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Vencimiento SOAT</strong> para poder crear el Vehículo.</p>";
		}
		if( !$("#e_aseguradora").val() && !$("#e_id_vehiculo_aseguradora").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Aseguradora</strong> para poder crear el Vehículo.</p>";
		}
		// Fin - Se hacen las validaciones del formulario de creación del vehículo

		if (!msg_error) {
			editarVehiculo();
		} 
		else {
			$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#editar_vehiculos").animate({ scrollTop: 0 }, 600);
		}
	});
	//GUARDAR EDITAR NUEVO
	$("#btn_editar_vehiculonew").click(function () {
		$(".nexos_messages_popup").html('');
		var msg_error = "";
		// alert('editar vehiculo');
		// Se hacen las validaciones del formulario de edición del vehículo
		// if( !$("#e_placa").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_configuracion").val() && !$("#e_id_vehiculo_configuracion").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Configuración</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_color").val() && !$("#e_id_vehiculo_color").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Color</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_marca").val() && !$("#e_id_vehiculo_marca").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Marca</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_linea").val() && !$("#e_id_vehiculo_linea").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Línea</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_modelo").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Modelo</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_tipo_vehiculo").val() && !$("#e_id_tipo_vehiculo").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Tipo de Vehículo</strong> para poder crear el Vehículo.</p>";
		// }
		// // if( !$("#e_tipo_carroceria").val() ){
		// // 	msg_error+= "<p>Debe seleccionar un <strong>Tipo Carrocería</strong> para poder crear el Vehículo.</p>";
		// // }
		// if( !$("#e_peso_vacio").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Peso Vacío</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_cedula_propietario").val() && !$("#e_id_propietario").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Documento Propietario</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_cedula_tenedor").val() && !$("#e_id_tenedor").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Documento Tenedor</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_cedula_conductor").val() && !$("#e_id_conductor").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Documento Conductor</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_numero_poliza").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Número SOAT</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_soat_vencimiento").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Vencimiento SOAT</strong> para poder crear el Vehículo.</p>";
		// }
		// if( !$("#e_aseguradora").val() && !$("#e_id_vehiculo_aseguradora").val() ){
		// 	msg_error+= "<p>Debe diligenciar el campo <strong>Aseguradora</strong> para poder crear el Vehículo.</p>";
		// }
		// Fin - Se hacen las validaciones del formulario de creación del vehículo

		if (!msg_error) {
			editarvehiculonew();
		} 
		else {
			$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#editar_vehiculos").animate({ scrollTop: 0 }, 600);
		}
	});

	$("#btn_crear_trailer").click(function(){
		$(".nexos_messages_popup").html('');
		var msg_error = "";
		//validaciones del formulario
		if( !$("#placa_trailer").val() ){
			msg_error+= "<p>Debe diligenciar el campo <strong>Placa</strong> para poder crear el Trailer.</p>";
		}

		if (!msg_error) {
			CrearTrailer();
		} 
		else {
			$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#crea_vehiculos").animate({ scrollTop: 0 }, 600);
		}
		
	});

	$("#editareltrailer").click(function(){
		EditarTrailer();
	});

	$("#btn_activar_vehiculo").click(function () {
		activarVehiculo();
	});
	$("#btn_inactivar_vehiculo").click(function () {
		inactivarVehiculo();
	});
	cargarconductor();
	cargartenedor();
	cargarpropietario();
	//cargartiposvehiculos();
	//funciones nuevas(n)
	cargarmarcasn();
	//cargarlineasn();
	cargarcolorn();
	cargartipocarrocen();
	cargarclasen();
	cargarconfiguracion();
	cargarpropietarion();
	cargarposeedorn();
	cargarconductorn();

	/******** FUNCIONES DEL FORMULARIO DE CREACCION DE VEHICULO ********/ 
	$("#placa").focusout(function () {
		// console.log("Entro en funcion de placa") ;
		$(".nexos_messages_popup").html('');
		$("#configuracion").attr("disabled",false);

		// Se busca si el proveedor ya existe en el sistema 
		var params = {
			accion: 'verVehiculoPlaca',
			placa : $("#placa").val()
		};

		$.ajax({
			type		: "POST",
			cache		: false,
			url			: url,
			data		: params,
			dataType	: "json",
			beforeSend	: function(jqXHR, settings){
						$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
			},
			success		: function(data) {
						// console.log(data);
						$(".nexos-messages").html('');
						if (data.success) {
							$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>El vehículo ya se encuentra registrado, cualquier cambio lo puede realizar editando la información dentro de la lista.</p></div></div>');
							$("#crea_vehiculos").animate({ scrollTop: 0 }, 600);
							$("#configuracion").val("");
							$("#configuracion").attr("disabled",true);
						}
			}
		});

		//traer datos del satelital
		
		var sate={
				action:'TraerSatelital',
				placa : $("#placa").val()
		};

		$("#web_satelital").val('');
		$("#usuario_satelital").val('');
		$("#clave_satelital").val('');
		
		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data: sate,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('trajo datos del prefiltro');
	 					 

	 					 if(data.result){
	 					 	$("#web_satelital").prop('disabled', true);
							$("#usuario_satelital").prop('disabled', true);
							$("#clave_satelital").prop('disabled', true);

	 					 	$("#web_satelital").val(data.result[0].web_satelital);
							$("#usuario_satelital").val(data.result[0].usuario_satelital);
							$("#clave_satelital").val(data.result[0].clave_satelital);
	 					 }else{
	 					 	$("#web_satelital").prop('disabled', false);
							$("#usuario_satelital").prop('disabled', false);
							$("#clave_satelital").prop('disabled', false);
	 					 	$("#web_satelital").val('');
							$("#usuario_satelital").val('');
							$("#clave_satelital").val('');
	 					 }




	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo datos del prefiltro');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 	});


	});

	$("#cedula_propietario").focusout(function () {
		// console.log("Entro en funcion de cedula de propietario" + $("#id_propietario").val() ) ;
		if( $("#cedula_propietario").val() && $("#id_propietario").val() ){
			getTipoDocumento( $("#id_propietario").val(), "id_tipo_documento_propietario", "digito_verificacion_propietario");
		}
	});

	$("#cedula_tenedor").focusout(function () {
		// console.log("Entro en funcion de cedula de tenedor - " + $("#id_tenedor").val() ) ;
		if( $("#cedula_tenedor").val() && $("#id_tenedor").val() ){
			getTipoDocumento( $("#id_tenedor").val(), "id_tipo_documento_tenedor", "digito_verificacion_tenedor");
		}
	});

	$("#cedula_conductor").focusout(function () {
		// console.log("Entro en funcion de cedula de conductor - " + $("#id_conductor").val() ) ;
		if( $("#cedula_conductor").val() && $("#id_conductor").val() ){
			getTipoDocumento( $("#id_conductor").val(), "id_tipo_documento_conductor", "digito_verificacion_conductor");
		}
	});

	$("#btn_crea").click(function(){
		$("#nexos_messages_popup").html("");
		$(".nexos_messages_popup").html("");
		$("#caja_configuracion").html('<input type="text" class="typeahead form-control" placeholder="Configuración" id="configuracion">');
		rndcCargarVehiculoConfiguracion();
		$("#caja_color").html('<input type="text" class="typeahead form-control" placeholder="Color" id="color">');
		rndcCargarVehiculoColor();
		$("#caja_marca").html('<input type="text" class="typeahead form-control" placeholder="Marca" id="marca">');
		rndcCargarVehiculoMarca();
		$("#caja_linea").html('<input type="text" class="typeahead form-control" placeholder="Línea" id="linea">');
		rndcLineaVehiculo( );
		$("#linea").blur(function(){
			// console.log("Entro en fuincion de blur del campo linea");
			if ( $("#id_vehiculo_marca").val() && $("#id_vehiculo_linea").val() ) {
				// console.log("Se puede verificar");
				rndc_verificalinea( $("#id_vehiculo_marca").val(), $("#id_vehiculo_linea").val() );
			}
		});
		$("#caja_carroceria").html('<input type="text" class="typeahead form-control" placeholder="Carrocería" id="carroceria">');
		rndcCargarVehiculoCarroceria();
		$("#caja_aseguradora").html('<input type="text" class="typeahead form-control" placeholder="Aseguradora" id="aseguradora">');
		rndcCargarVehiculoAseguradora();

		//trailers
		$("#trailers").html('<option value="" readonly="readonly">Seleccione una opción</option>');
		var datos={
		action:'traertrailer'
		};
		$.ajax({
			url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
 			type:'POST',
 			data:datos,
 			dataType:'json',
 			success: function(data){
 				// console.log('trajo trailers');
 				 data.result.forEach(function(element,index){
 					$("#trailers").append('<option value="'+element.id+'">'+element.placa+'    '+element.namec+'    '+element.descc+'</option>');
 				});

 			},
 			error:function(jqXHR, textStatus, errorThrown){
 				console.log('no trajo trailers');
 				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
 			}	
 		});	
	});
	//funciones para la creacion del trailer 
		//traer datos al formulario de creacion del trailer
	$("#btn_trailer").click(function(){
		// alert('hi baby');
		//traer marcas
		var datos={
		action:'datos_trailer'
		};

		$("#T_marca").html('');
		$("#T_tramite").html('');
		$("#T_configuracion").html('');
		$("#T_propietario").html('');
		$("#T_aseguradora").html('');
		$("#T_carroceria").html('');

		$.ajax({
			url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
 			type:'POST',
 			data:datos,
 			dataType:'json',
 			success: function(data){
 				// console.log('SI HAY DATOS TRAILER');
 				 data.result.forEach(function(element,index){
 				 	$("#T_marca").append('<option value="'+element.codigo+'">'+element.marca+'</option>');
 				 });
 				 
 				 data.result2.forEach(function(element,index){
 				 	$("#T_tramite").append('<option value="'+element.id+'">'+element.tramite+'</option>');
 				 })	;

 				 data.result3.forEach(function(element,index){
 				 	$("#T_configuracion").append('<option value="'+element.id+'">'+element.nombre+'-' +element.descripcion+'</option>');
 				 });

 				 data.result4.forEach(function(element,index){
 				 	$("#T_propietario").append('<option value="'+element.numero_documento+'">'+element.nombre+ '-' +element.numero_documento+ '-'+element.tipo_documento+'</option>');
 				 });

 				 data.result5.forEach(function(element,index){
 				 	$("#T_aseguradora").append('<option value="'+element.nombre+'">'+element.nombre+'</option>');
 				 });

 				 data.result6.forEach(function(element,index){
 				 	$("#T_carroceria").append('<option value="'+element.id+'">'+element.descripcion+'</option>');
 				 });
 			},
 			error: function(jqXHR, textStatus, errorThrown){
 				// console.log('NO HAY DATOS TRAILER');
 				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
 			}	
 		});	
	});


	$("#marca").change(function(){
		var marca=$("#marca").val();
		if(marca==''){
			$("#linea").html('');
			$("#id_vehiculo_marca").val('');
			$("#rndc_vehiculo_marca").val('');
		}else{

		$("#linea").select2({
			width:'100%'
		}); 		

		var  cm={
			marca:marca,
			action:'cambiomarca'
		};
		$("#linea").html('');
		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:cm,
	 			dataType:'json',
	 			success: function(data){
	 				if(data.result){
	 					$("#id_vehiculo_marca").val(data.result[0].id);
	 					$("#rndc_vehiculo_marca").val(data.result[0].rndc_id);
	 					data.result.forEach(function(element,index){
	 						$("#linea").append('<option value="'+element.descripcion+'">'+element.descripcion+'</option>');
	 					});
	 				}
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo marcas');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 	});

	 	}
	});

	$("#color").change(function(){
		var colour=$("#color").val();
		if(colour==''){
			$("#id_vehiculo_color").val('');
			$("#rndc_vehiculo_color").val('');
		}else{
			var  kl={
				color:colour,
				action:'cambiocolour'
			};

			$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:kl,
	 			dataType:'json',
	 			success: function(data){
	 				if(data.result){
	 					$("#id_vehiculo_color").val(data.result[0].id);
	 					$("#rndc_vehiculo_color").val(data.result[0].rndc_id);
	 				}
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo ids del color');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});
		}

	});


	function cargarcolorn(){
		$("#color").select2({
			width:'100%'
		}); 
		var  color={
			action:'tipo_color'
		};

		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:color,
	 			dataType:'json',
	 			success: function(data){
	 				 data.result.forEach(function(element,index){
	 				 	$("#color").append('<option value="'+element.color+'">'+element.color+'</option>');
	 				 });
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo colores');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 	});
	}

	function cargarmarcasn(){
		$("#marca").select2({
			width:'100%'
		}); 
		var  mk={
			action:'tipo_marca'
		};

		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:mk,
	 			dataType:'json',
	 			success: function(data){
	 				 data.result.forEach(function(element,index){
	 				 	$("#marca").append('<option value="'+element.marca+'">'+element.marca+'</option>');
	 				 });
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo marcas');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 	});
	}

	function cargartipocarrocen(){
		$("#tipo_carroceria").select2({
			widt:'80%'
		}); 
		var  carro={
			action:'tipo_carroceria'
		};
		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:carro,
	 			dataType:'json',
	 			success: function(data){
	 				 data.result.forEach(function(element,index){
	 				 	$("#tipo_carroceria").append('<option value="'+element.tipo+'">'+element.tipo+'</option>');
	 				 });
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo tipo carroceria');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 	});
	}

	function cargarclasen(){
		$("#clase_v").select2({
			widt:'80%'
		}); 
		var  clase={
			action:'clase_vehiculo'
		};
		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:clase,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('trajo clase');
	 				 data.result.forEach(function(element,index){
	 				 	$("#clase_v").append('<option value="'+element.id+'">'+element.clase+ '</option>');
	 				 });
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo clase');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 	});
	}

	function cargarconfiguracion(){
		
		$("#configuracion").select2({
			widt:'80%'
		}); 

		var conf={
			action:'confi_vehiculo'
		};

		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:conf,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('trajo configuracion');
	 				 data.result.forEach(function(element,index){
	 				 	$("#configuracion").append('<option value="'+element.id+'">'+element.nombre+'-' +element.descripcion+ '</option>');
	 				 });
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo configuracion');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});
	}


	function cargarpropietarion(){
		
			$("#id_propietario").select2({
			  width:'80%'
			});
			var datos={
				action:'datos_propietario'
			};
			// $("#nombre_propietario").html('Seleccione una opción');
			$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:datos,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('trajo propietario');
	 				 data.result.forEach(function(element,index){
	 				 	$("#id_propietario").append('<option value="'+element.id+'">'+element.nombre+'-' +element.numero_documento+'/'+ element.celular +'</option>');
	 				 });
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo propietario');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});
	}

	function cargarposeedorn(){
		$("#id_tenedor").select2({
			  width:'80%'
			});
		var datos={
				action:'datos_poseedor'
		};
		// $("#nombre_poseedor").html('Seleccione una opción');
			$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:datos,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('trajo poseedor');
	 				data.result.forEach(function(element,index){
	 				 	$("#id_tenedor").append('<option value="'+element.id+'">'+element.nombre+ '-'+element.numero_documento+'/'+element.celular+'</option>');
	 				 });	 
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo poseedor');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});
	}

	function cargarconductorn(){
		$("#id_conductor").select2({
			  width:'80%'
			});
		var datos={
				action:'datos_conductor'
		};
		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:datos,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('trajo conductor');
	 				data.result.forEach(function(element,index){
	 				 	$("#id_conductor").append('<option value="'+element.id+'">'+element.nombre+ '-' +element.numero_documento+'/'+element.celular+'</option>');
	 				 });	 
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo conductor');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});
	}


	/******** FIN - FUNCIONES DEL FORMULARIO DE CREACCION DE VEHICULO ********/ 
});

function configu(){
		
		$("#rndc_vehiculo_configuracion").val('');
		$("#id_vehiculo_configuracion").val('');
		var c=$("#configuracion").val();
		
		var rndc_id={
			id:c,
			action:'traer_crndc_configuracion'
		};

		$.ajax({
				url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
	 			type:'POST',
	 			data:rndc_id,
	 			dataType:'json',
	 			success: function(data){
	 				console.log('trajo configuracion');
	 				 if(data){
	 				 	$("#rndc_vehiculo_configuracion").val(data.result[0].rndc_id);
	 				 	$("#id_vehiculo_configuracion").val(data.result[0].id);
	 				 }
	 			},
	 			error: function(jqXHR, textStatus, errorThrown){
	 				console.log('no trajo configuracion');
	 				console.log(jqXHR);
					console.log(textStatus);
					console.log(errorThrown);
	 			}
	 		});

}

var url =$("#id_url_ajax").val()+"libs/vehiculos_ajax.php";

var propietarios=[];
function cargarpropietario(){
	// alert('cargar propietario autocomplete');
	var params = {
		accion: "cargarpropietario",
	};

	propietarios=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				propietarios.push(data.content[x]['nombre']);
			}
			$('#caja_propietario .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(propietarios),
			});

			$.ajaxSetup({async: false});
			$('#caja_propietario').bind('typeahead:selected', function (obj, datum, name) {
				
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};
				
				$.post(url, params, function(data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#nombre_propietario").val(nombre);
						$("#id_propietario").val(data.content.id);
						$("#cedula_tenedor").focus();
					} else {
						$("#nombre_propietario").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
			$("#cedula_propietario").focusout(function() {
				// console.log($.inArray($("#cedula_propietario").val(), propietarios));
				if ($.inArray($("#cedula_propietario").val(), propietarios) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});

			$('#e_caja_propietario .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(propietarios),
			});

			$.ajaxSetup({async: false});
			$('#e_caja_propietario').bind('typeahead:selected', function(obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};

				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#e_nombre_propietario").val(nombre);
						$("#e_id_propietario").val(data.content.id);
						$("#e_cedula_tenedor").focus();
					} else {
						$("#e_nombre_propietario").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#e_cedula_propietario").focusout(function() {
				// console.log($.inArray($("#e_cedula_propietario").val(), propietarios));
				if ($.inArray($("#e_cedula_propietario").val(), propietarios) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});

			} else {}
		}, 'json');
	$.ajaxSetup({async: true});
}

var tenedores=[]
function cargartenedor(){
	// alert('cargar tenedor autocomplete');
	var params = {
		accion: "cargartenedor",
	};

    tenedores=[];
    $.ajaxSetup({async: false});
    $.post(url, params, function (data) {
    	if(data.success) {
    		for(let x = 0; x < data.content.length; x++) {
    			tenedores.push(data.content[x]['nombre']);
    		}
			// console.log(tenedores);
			//for(let x=0;x<cantidad_tramo;x++){
			$('#caja_tenedor .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(tenedores),
			});

			$.ajaxSetup({async: false});
			$('#caja_tenedor').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#nombre_tenedor").val(nombre);
						$("#id_tenedor").val(data.content.id);
						$("#cedula_conductor").focus();
					} else {
						$("#nombre_tenedor").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#cedula_tenedor").focusout(function () {
				// console.log($.inArray($("#cedula_tenedor").val(), tenedores));
				if ($.inArray($("#cedula_tenedor").val(), tenedores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});

			$('#e_caja_tenedor .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(tenedores),
			});

			$.ajaxSetup({async: false});
			$('#e_caja_tenedor').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};

				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#e_nombre_tenedor").val(nombre);
						$("#e_id_tenedor").val(data.content.id);
						$("#e_cedula_conductor").focus();
					} else {
						$("#e_nombre_tenedor").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#e_cedula_tenedor").focusout(function () {
				// console.log($.inArray($("#e_cedula_tenedor").val(), tenedores));
				if ($.inArray($("#e_cedula_tenedor").val(), tenedores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
}

var conductores=[];
function cargarconductor(){
	// alert('cargar conductor autocomplete');
   var params = {
	    accion: "cargarconductor",
	};
	
	conductores=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				conductores.push(data.content[x]['nombre']);
			}
			// console.log(conductores);

			$('#caja_conductor .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(conductores),
			});

			$.ajaxSetup({async: false});
			$('#caja_conductor').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};

				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#nombre_conductor").val(nombre);
						$("#id_conductor").val(data.content.id);  
						$("#numero_poliza").focus();
					} else {
						$("#nombre_conductor").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#cedula_conductor").focusout(function () {
				// console.log($.inArray($("#cedula_conductor").val(), conductores));
				if ($.inArray($("#cedula_conductor").val(), conductores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});

			$('#e_caja_conductor .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(conductores),
			});

			$.ajaxSetup({async: false});
			$('#e_caja_conductor').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosproveedor',
					numero_documento: datum.split(" - ")[0]
				};

				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						var nombre = data.content.nombre;
						$("#e_nombre_conductor").val(nombre);
						$("#e_id_conductor").val(data.content.id);
						$("#e_numero_poliza").focus();
					} else {
						$("#e_nombre_conductor").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});

			$("#e_cedula_conductor").focusout(function () {
				// console.log($.inArray($("#e_cedula_conductor").val(), conductores));
				if ($.inArray($("#e_cedula_conductor").val(), conductores) == (-1)) {
					//$("#nombre_propietario").val("");
				} else {}
			});
		} else {}
	}, 'json');
	$.ajaxSetup({async: true});
}



/*var tipos_vehiculos=[];
function cargartiposvehiculos(){
	var params = {
		accion: "cargartiposvehiculos",
	};

	tipos_vehiculos=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				tipos_vehiculos.push(data.content[x]['nombre']);
			}
			$('#e_caja_tipo_vehiculo .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(tipos_vehiculos),
			});

			$.ajaxSetup({async: false});
			$('#e_caja_tipo_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'obtenerdatosvehiculos',
					nombre: datum
				};
	            
	            $.post(url, params, function (data) {
	            	// console.log(data);
	            	if (data.success) {
	            		var nombre = data.content.nombre;
	            		$("#e_id_tipo_vehiculo").val(data.content.id);
	            		$("#e_tipo_carroceria").focus();
	            	} else {
	            		$("#e_tipo_vehiculo").val("");
	            	}
	            }, 'json');
	        });
	        $.ajaxSetup({async: true});

	        $("#e_tipo_vehiculo").focusout(function () {
	        	// console.log($.inArray($("#e_tipo_vehiculo").val(), tipos_vehiculos));
	        	if ($.inArray($("#e_tipo_vehiculo").val(), tipos_vehiculos) == (-1)) {
	        		//$("#nombre_propietario").val("");
	        	} else {}
	        });

	        $('#caja_tipo_vehiculo .typeahead').typeahead({
	        	minLength: 1
	        },
	        {
	        	name: 'states',
	        	source: substringMatcher(tipos_vehiculos),
	        });
	        $.ajaxSetup({async: false});

	        $('#caja_tipo_vehiculo').bind('typeahead:selected', function (obj, datum, name) {
	        	var params = {
	        		accion: 'obtenerdatosvehiculos',
	        		nombre: datum
	        	};

	        	$.post(url, params, function (data) {
	        		// console.log(data);
	        		if (data.success) {
	        			var nombre = data.content.nombre;
	        			$("#id_tipo_vehiculo").val(data.content.id);
	        			$("#tipo_vehiculo_peso").val(data.content.peso_maximo);
	        			$("#tipo_carroceria").focus();
	        		} else {
	        			$("#tipo_vehiculo").val("");
	        		}
	        	}, 'json');
	        });
	        $.ajaxSetup({async: true});

	        $("#tipo_vehiculo").focusout(function () {
	        	// console.log($.inArray($("#tipo_vehiculo").val(), tipos_vehiculos));
	        	if ($.inArray($("#tipo_vehiculo").val(), tipos_vehiculos) == (-1)) {
	        		//$("#nombre_propietario").val("");
	        	} else {}
	        });
	    } else {}
	}, 'json');
	$.ajaxSetup({async: true});
}*/

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

//TRAER DATOS AL FORMULARIO EDITAR
function editartrailer(idvehiculo){
		// alert('editar trailer');
		var idvehiculo=idvehiculo;
		// alert(idvehiculo);
		// var idvehiculo=$("#idvehiculo_trailer").val();
		var dato={
			id:idvehiculo,
			action:'editar_traertrailer'
		};

		$.ajax({
			url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
 			type:'POST',
 			data:dato,
 			dataType:'json',
 			success: function(data){
 				console.log(data);
 				if(data){

 					$("#idtrailer").val(data.result[0].idtrailer);
 					$("#e_placa_trailer").val(data.result[0].placa);
 					// $("#eT_marca").val(data.result[0].marca);
 					var marca=$("#eT_marca").html('');
 					data.result[0].lasmarcas.forEach(function(element,index){
 						var tmpSelected = "";
 						if(element.selected){
	 					tmpSelected = "selected";
	 					}
	 					var marca=$("#eT_marca").append('<option '+tmpSelected+' value="'+element.codigo+'">'+element.marca+'</option>');
 					});
 					$("#eT_peso").val(data.result[0].peso_vacio);
 					$("#eT_alto").val(data.result[0].alto);
 					$("#eT_volumen").val(data.result[0].volumen);
 					var tramite=$("#eT_tramite").html('');
 					data.result[0].eltramite.forEach(function(element,index){
 						var tmpSelected = "";
 						if(element.selected){
	 					tmpSelected = "selected";
	 					}
	 					var tramite=$("#eT_tramite").append('<option '+tmpSelected+' value="'+element.id+'">'+element.nombre+'</option>');
 					});
 					$("#eT_chasis").val(data.result[0].serie_chasis);
 					// $("#eT_configuracion").val(data.result[0].configuracion);
 					var confi=$("#eT_configuracion").html('');
 					data.result[0].configura.forEach(function(element,index){
 						var tmpSelected = "";
 						if(element.selected){
	 					tmpSelected = "selected";
	 					}
	 					var confi=$("#eT_configuracion").append('<option '+tmpSelected+' value="'+element.id+'">'+element.sigla+'-'+element.descrip+'</option>');
 					});
 					$("#eT_modelo").val(data.result[0].modelo);
 					$("#eT_ancho").val(data.result[0].ancho);
 					$("#eT_largo").val(data.result[0].largo);
 					$("#eT_capacidad").val(data.result[0].capacidad);
 					// $("#eT_carroceria").val(data.result[0].carroceria);
 					var carroceria=$("#eT_carroceria").html('');
 					data.result[0].carroceriatrailer.forEach(function(element,index){
 						var tmpSelected = "";
 						if(element.selected){
	 					tmpSelected = "selected";
	 					}
	 					var carroceria=$("#eT_carroceria").append('<option '+tmpSelected+' value="'+element.id+'">'+element.nombre+'</option>');
 					});	
 					$("#eT_caracteristicas").val(data.result[0].caracteristica);
 					//eT_propietario
 					var propietario=$("#eT_propietario").html('');
 					data.result[0].propietario.forEach(function(element,index){
 						var tmpSelected = "";
 						if(element.selected){
	 					tmpSelected = "selected";
	 					}
	 					var propietario=$("#eT_propietario").append('<option '+tmpSelected+' value="'+element.id+'">'+element.nombre+'-'+element.id+'-'+element.tipo+'</option>');
 					});	


 					$("#eT_civil").val(data.result[0].numero_civil);
 					//eT_aseguradora
 					var aseguradora=$("#eT_aseguradora").html('');
 					data.result[0].aseguratrailer.forEach(function(element,index){
 						var tmpSelected = "";
 						if(element.selected){
	 					tmpSelected = "selected";
	 					}
	 					var aseguradora=$("#eT_aseguradora").append('<option '+tmpSelected+' value="'+element.id+'">'+element.id+'</option>');
 					});	
 					$("#eT_fechavence").val(data.result[0].fecha_vence);


 				}
 			},
 			error:function(jqXHR, textStatus, errorThrown){
 				console.log('no trajo trailer a editar');
 				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
 			}	
 		});	
}

function EditarTrailer(){
	alert('Eidtar trailer');
	var data = null;
	data = new FormData();
	var placatrailer=$("#e_placa_trailer").val();
	if(placatrailer.length!=0){

		var trailer = document.getElementById('e_foto_trailer').files;
		for (var m = 0; m < trailer.length; m++) {
			data.append("e_foto_trailer" + m, trailer[m]);
		}
		data.append("accion", 'EditarTrailer');
		data.append("eplaca_trailer", $("#e_placa_trailer").val());
		data.append("emarca", $("#eT_marca").val());
		data.append("epeso", $("#eT_peso").val());
		data.append("ealto", $("#eT_alto").val());
		data.append("evolumen", $("#eT_volumen").val());
		data.append("etramite", $("#eT_tramite").val());
		data.append("echasis", $("#eT_chasis").val());
		data.append("econfiguracion", $("#eT_configuracion").val());
		data.append("emodelo", $("#eT_modelo").val());
		data.append("eancho", $("#eT_ancho").val());
		data.append("elargo", $("#eT_largo").val());
		data.append("ecapacidad", $("#eT_capacidad").val());
		data.append("ecarroceria", $("#eT_carroceria").val());
		data.append("ecaracteristicas", $("#eT_caracteristicas").val());
		data.append("epropietario", $("#eT_propietario").val());
		data.append("ecivil", $("#eT_civil").val());
		data.append("easeguradora", $("#eT_aseguradora").val());
		data.append("efechavence", $("#eT_fechavence").val());
		data.append("idtrailer", $("#idtrailer").val());
	}

	var url =$("#id_url_ajax").val() + "libs/vehiculos_ajax.php";

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
			 console.log('ACTUALIZO TRAILER');
				alert('Datos Actualizados Existosamente!!!');
				$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);
			},
			error: function (jqXHR, textStatus, errorThrown){
				console.log('NO ACTUALIZO TRAILER');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});
	
}


function CrearTrailer(){
	alert('crear el trailer');
	var data = null;
	data = new FormData();
	//fotos del trailer
	var trailer =  document.getElementById("foto_trailer").files;
	for(var m = 0; m < trailer.length; m++){
	 data.append("foto_trailer" + m,trailer[m]);
	}
	//DATOS DEL TRAILER
	var placat=$("#placa_trailer").val();
	if(placat.length!=0){
		data.append("accion", 'CrearTrailer');
		data.append("placa_trailer", $("#placa_trailer").val());
		data.append("T_marca", $("#T_marca").val());
		data.append("T_peso", $("#T_peso").val());
		data.append("T_alto", $("#T_alto").val());
		data.append("T_volumen", $("#T_volumen").val());
		data.append("T_tramite", $("#T_tramite").val());
		data.append("T_chasis", $("#T_chasis").val());
		data.append("T_configuracion", $("#T_configuracion").val());
		data.append("T_modelo", $("#T_modelo").val());
		data.append("T_ancho", $("#T_ancho").val());
		data.append("T_largo", $("#T_largo").val());
		data.append("T_capacidad", $("#T_capacidad").val());
		data.append("T_carroceria", $("#T_carroceria").val());
		data.append("T_caracteristicas", $("#T_caracteristicas").val());
		data.append("T_propietario", $("#T_propietario").val());
		data.append("T_civil", $("#T_civil").val());
		data.append("T_aseguradora", $("#T_aseguradora").val());
		data.append("T_fechavence", $("#T_fechavence").val());
	}

	var url =$("#id_url_ajax").val() + "libs/vehiculos_ajax.php";
	$.ajax({
		url: url,
		type: 'POST',
		data: data,
		cache: false,
		processData: false, // Don't process the files
		contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		dataType: 'json',
		success: function(data, textStatus, jqXHR)
		{
			console.log('si inserto trailer');
				 // console.log(data);
			alert('Datos del trailer registrados Exitosamente');
			$("html, body").animate({ scrollTop: 0 }, 600);
			setTimeout(function() { location.reload(false);  }, 800);

			},
		error: function(jqXHR, textStatus, errorThrown)
		{
			console.log('error no inserta trailer');
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		}
	});

}



function crearVehiculo() {
	// alert('crea vehiiiculo');
	var data = null;
	data = new FormData();
	//ARCHIVOS - frontal
	var carro =  document.getElementById("foto_vehiculo").files;
	for(var i = 0; i < carro.length; i++){
	 data.append("foto_vehiculo" + i,carro[i]);
	}

	var der =  document.getElementById("foto_vehiculod").files;
	for(var f = 0; f < der.length; f++){
	 data.append("foto_vehiculod" + f,der[f]);
	}


	var izqui =  document.getElementById("foto_vehiculoi").files;
	for(var a = 0; a < izqui.length; a++){
	 data.append("foto_vehiculoi" + a,izqui[a]);
	}


	var trase =  document.getElementById("foto_vehiculoa").files;
	for(var  b= 0; b < trase.length; b++){
	 data.append("foto_vehiculoa" + b,trase[b]);
	}


	//soat y tecnomecanica

	var soat =  document.getElementById("foto_soat").files;
	for(var  m= 0; m < soat.length; m++){
	 data.append("foto_soat" + m,soat[m]);
	}


	var tecno =  document.getElementById("foto_tecno").files;
	for(var  n= 0; n < tecno.length; n++){
	 data.append("foto_tecno" + n,tecno[n]);
	}




	//DATOS CMX_VEHICULOS
	data.append("accion", 'crearVehiculo');
	data.append("placa", $("#placa").val());
	data.append("id_propietario", $("#id_propietario").val());
	data.append("id_tenedor", $("#id_tenedor").val());
	data.append("id_conductor", $("#id_conductor").val());
	//data.append("tipo_vehiculo", $("#id_tipo_vehiculo").val());
	data.append("tipo_carroceria", $("#tipo_carroceria").val());
	data.append("web_satelital", $("#web_satelital").val());
	data.append("usuario_satelital", $("#usuario_satelital").val());
	data.append("clave_satelital", $("#clave_satelital").val());
	//DATOS CMX_DETALLE_VEHICULO
	// data.append("num_licencia", $("#num_licencia").val());
	// data.append("fecha_tarjeta_propiedad", $("#fecha_tarjeta_propiedad").val());
	// data.append("fechavence_tarjeta_propiedad", $("#fechavence_tarjeta_propiedad").val());
	data.append("tecnomecanica", $("#tecnomecanica").val());
	data.append("fecha_tecno", $("#fecha_tecno").val());
	data.append("fecha_vig_tecno", $("#fecha_vig_tecno").val());
	//DATOS CMX_VEHICULO2
	data.append("configuracion", $("#id_vehiculo_configuracion").val());
	data.append("clase", $("#clase_v").val());
	data.append("color", $("#color").val());
	data.append("marca", $("#marca").val());
	data.append("linea", $("#linea").val());
	data.append("modelo", $("#modelo").val());
	data.append("tipo_combustible", $("#tipo_combustible").val());
	//rndc carroceria en el formulario 
	data.append("carroceria", $("#carroceria").val());
	data.append("peso_vacio", $("#peso_vacio").val());
	//numero soat
	data.append("numero_poliza", $("#numero_poliza").val());
	data.append("soat_vencimiento", $("#soat_vencimiento").val());
	data.append("aseguradora", $("#aseguradora").val());
	data.append("num_motor", $("#num_motor").val());
	data.append("num_chasis", $("#num_chasis").val());
	data.append("numero_poliza", $("#numero_poliza").val());
	data.append("fecha_poliza", $("#fecha_poliza").val());
	data.append("repotenciado", $("#repotenciado").val());
	data.append("tipovinculacion", $("#tipovinculacion").val());
	data.append("fecha_mantenimientogps", $("#fecha_mantenimientogps").val());
	data.append("capacidad_tn", $("#capacidad_tn").val());
	data.append("trailers", $("#trailers").val());


	data.append("peso_bruto", $("#peso_bruto").val());
	data.append("f_matricula", $("#f_matricula").val());

	//nombres de los documentos
	data.append("name_frontal", $("#name_frontal").val());
	data.append("name_derecha", $("#name_derecha").val());
	data.append("name_izquierda", $("#name_izquierda").val());
	data.append("name_atras", $("#name_atras").val());
	data.append("name_soat", $("#name_soat").val());
	data.append("name_tecno", $("#name_tecno").val());

	// var params = {
	// 	accion: 'crearVehiculo',
	// 	//DATOS CMX_VEHICULOS
	// 	placa: 							$("#placa").val(),
	// 	placa_trailer: 					$("#placa_trailer").val(),
	// 	id_propietario: 				$("#id_propietario").val(),
	// 	id_tenedor: 					$("#id_tenedor").val(),
	// 	id_conductor: 					$("#id_conductor").val(),
	// 	tipo_vehiculo : 				$("#id_tipo_vehiculo").val(),
	// 	tipo_carroceria : 				$("#tipo_carroceria").val(),
	// 	web_satelital : 				$("#web_satelital").val(),
	// 	usuario_satelital : 			$("#usuario_satelital").val(),
	// 	clave_satelital : 				$("#clave_satelital").val(),
		
	// 	//DATOS CMX_DETALLE_VEHICULO
	// 	num_licencia:					$("#num_licencia").val(),
	// 	fecha_tarjeta_propiedad: 		$("#fecha_tarjeta_propiedad").val(),
	// 	fechavence_tarjeta_propiedad: 	$("#fechavence_tarjeta_propiedad").val(),
	// 	tecnomecanica: 					$("#tecnomecanica").val(),
	// 	fecha_tecno: 					$("#fecha_tecno").val(),
	// 	fecha_vig_tecno: 				$("#fecha_vig_tecno").val(),
	// 	//DATOS CMX_VEHICULO2
	// 	configuracion: 					$("#id_vehiculo_configuracion").val(),
	// 	color: 							$("#color").val(),
	// 	marca: 							$("#marca").val(),
	// 	linea: 							$("#linea").val(),
	// 	modelo: 						$("#modelo").val(),
	// 	tipo_combustible: 				$("#tipo_combustible").val(),
	// 	//rndc carroceria en el formulario 
	// 	carroceria: 					$("#carroceria").val(),
	// 	peso_vacio: 					$("#peso_vacio").val(),
	// 	//numero soat
	// 	numero_poliza: 					$("#numero_poliza").val(),
	// 	soat_vencimiento: 				$("#soat_vencimiento").val(),
	// 	aseguradora: 					$("#aseguradora").val(),
		// DATOS PARA ELM RNDC
		// rndc_id_tipo_documento_propietario: $("#id_tipo_documento_propietario").val(),
		// digito_verificacion_propietario: 	$("#digito_verificacion_propietario").val(),
		// rndc_id_tipo_documento_tenedor: 	$("#id_tipo_documento_tenedor").val(),
		// digito_verificacion_tenedor: 		$("#digito_verificacion_tenedor").val(),
		// rndc_id_tipo_documento_conductor: 	$("#id_tipo_documento_conductor").val(),
		// digito_verificacion_conductor: 		$("#digito_verificacion_conductor").val(),
		// rndc_vehiculo_configuracion: 		$("#rndc_vehiculo_configuracion").val(),
		// rndc_vehiculo_color: 				$("#rndc_vehiculo_color").val(),
		// rndc_vehiculo_marca: 				$("#rndc_vehiculo_marca").val(),
		// rndc_vehiculo_linea: 				$("#rndc_vehiculo_linea").val(),
		// rndc_modelo: 						$("#modelo").val(),
		// rncd_tipo_combustible: 				$("#tipo_combustible").val(),
		// rndc_vehiculo_carroceria: 			$("#rndc_vehiculo_carroceria").val(),
		// rndc_peso_vacio: 					$("#peso_vacio").val(),
		// rndc_capacidad_carga: 				$("#tipo_vehiculo_peso").val(),
		// rndc_numero_poliza: 				$("#numero_poliza").val(),
		// rndc_soat_vencimiento: 				$("#soat_vencimiento").val(),
		// rndc_vehiculo_aseguradora: 			$("#rndc_vehiculo_aseguradora").val(),
	// };
	


	// arrayRndcCedulaPropietario = $("#cedula_propietario").val().split(" - ");
	// params["rndc_cedula_propietario"] = arrayRndcCedulaPropietario[0];
	// arrayRndcCedulaTenedor = $("#cedula_tenedor").val().split(" - ");
	// params["rndc_cedula_tenedor"] = arrayRndcCedulaTenedor[0];
	// arrayRndcCedulaConductor = $("#cedula_conductor").val().split(" - ");
	// params["rndc_cedula_conductor"] = arrayRndcCedulaConductor[0];

	
		// alert('Datos registrados Exitosamente');
		// $("html, body").animate({ scrollTop: 0 }, 600);
		// setTimeout(function() { location.reload(false);  }, 800);
		var url =$("#id_url_ajax").val() + "libs/vehiculos_ajax.php";
			$.ajax({
			url: url,
			type: 'POST',
			data: data,
			cache: false,
			processData: false, // Don't process the files
			contentType: false, // Set content type to false as jQuery will tell the server its a query string request
			dataType: 'json',
			success: function(data, textStatus, jqXHR)
			{
				// console.log('si inserto vehiculo');
				 // console.log(data);
				 if(!data.error){
				 	alert('Datos registrados Exitosamente');
					$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);

				 }else{
				 	$("#crea_vehiculos").css("display","none");
					$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error.</div></div>');
				 }
			},
			error: function(jqXHR, textStatus, errorThrown)
			{
				// console.log('error no inserta');
				$("#crea_vehiculos").css("display","none");
				$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Ha ocurrrido un error.</div></div>');
		 		$("html, body").animate({ scrollTop: 0 }, 600);
				setTimeout(function() { location.reload(false);  }, 800);

				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});




	// $.post(url, params, function (data) {
	// 	// console.log(data);
	// 	if (!data.error) {
	// 		$("#crea_vehiculos").css("display","none");
	// 		$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>');
	// 		// $("html, body").animate({ scrollTop: 0 }, 600);
	// 		// setTimeout(function() { location.reload(false);  }, 800);
	// 	} 
	// 	else {
	// 		var msg_error = data.error.replace(/\n/g , "</p><p>");
	// 		// $(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
	// 		// $("#crea_vehiculos").animate({ scrollTop: 0 }, 600);
	// 	}
	// }, 'json');

}

function historialconductores(id_vehiculo){
	var id_vehiculo=id_vehiculo;
	var datos={
		id:id_vehiculo,
		action:'historicovehiculo'
	};
	$("#tbproveedor").html('');
	$.ajax({
			url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
 			type:'POST',
 			data:datos,
 			dataType:'json',
 			success: function(data){
 				console.log(data);
 				data.result.forEach(function(element,index){
					$("#tbproveedor").append('<tr>'+
					 '<td>'+element.estado+'</td>'+
					 '<td>'+element.numero_documento+'/'+element.nombre+'</td>'+
					 '<td>'+element.fecha_anterior+'</td>'+
					 '<td>'+element.fecha_actual+'</td>'+
					 '</tr>');
 				});		
 			},
 			error: function(jqXHR, textStatus, errorThrown){
 				console.log('no hay historico');
 				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
 			}
 		});	
}

//TRAER DATOS DEL VEHICULO NUEVO 
function editardatosvehiculonew(id_vehiculo){
	// alert('hello baby');
	var traerdatos={
			id:id_vehiculo,
			action:'traer_datos_vehiculo'
		};
	$.ajax({
			url:"http://localhost/mvcLuisMiguel/libs/hojas_de_vida_ajax.php",
 			type:'POST',
 			data:traerdatos,
 			dataType:'json',
 			success: function(data){
 				console.log('ok datos del vehiculo');
 				//poner los datos del vehículo
 				console.log(data);
 				if(data.result){
 					console.log('si hay resultados');

 					if(data.result[0].estado_proceso=='bloqueado'){
 						$(".des").prop('disabled', true);
 						$("#idblok").html('<p class="text-danger">Bloqueado</p>');
 						$("#btn_editar_vehiculonew").hide();
 					}

 					$("#idvehiculo_trailer").val(id_vehiculo);
 					$("#e_placa").val(data.result[0].placa);
 					$("#e_modelo").val(data.result[0].anio_fabricacion);
 					$("#e_peso_vacio").val(data.result[0].peso);
 					$("#e_numero_poliza").val(data.result[0].num_soat);
 					$("#e_soat_vencimiento").val(data.result[0].vence_soat);
 					$("#e_tecnomecanica").val(data.result[0].tecnomecanica);
 					$("#e_fecha_tecno").val(data.result[0].tecno_fecha_expedida);
 					$("#e_fecha_vig_tecno").val(data.result[0].tecno_fecha_vigencia);
 					$("#e_web_satelital").val(data.result[0].web_satelital);
 					$("#e_usuario_satelital").val(data.result[0].usuario_satelital);
 					$("#e_clave_satelital").val(data.result[0].clave_satelital);
 					$("#e_placa_trailer").val(data.result[0].placa_trailer);
 					// $("#e_num_licencia").val(data.result[0].numero_licencia);
 					// $("#e_fecha_tarjeta_propiedad").val(data.result[0].fecha_expe_licencia);
 					// $("#e_fechavence_tarjeta_propiedad").val(data.result[0].fecha_vence_licencia);
 					var combustible=data.result[0].cod_tipo_combustible;
 					var c='';
 					if(combustible==1){
 						c='Diesel o ACPM';
 						$("#e_tipo_combustible").html('<option value="1">'+c+'</option>'+
 							'<option value="2">Gasolina</option>'+
 							'<option value="3">Gas</option>'+
 							'<option value="4">Gas/Gasolina</option>');
 					}
 					if(combustible==2){
 						c='Gasolina';
 						$("#e_tipo_combustible").html('<option value="2">'+c+'</option>'+
 							'<option value="1">Diesel o ACPM</option>'+
 							'<option value="3">Gas</option>'+
 							'<option value="4">Gas/Gasolina</option>');
 					}
 					if(combustible==3){
 						c='Gas';
 						$("#e_tipo_combustible").html('<option value="3">'+c+'</option>'+
 							'<option value="1">Diesel o ACPM</option>'+
 							'<option value="2">Gasolina</option>'+
 							'<option value="4">Gas/Gasolina</option>');
 					}
 					if(combustible==4){
 						c='Gas/Gasolina';
 						$("#e_tipo_combustible").html('<option value="4">'+c+'</option>'+
 							'<option value="3">Gas</option>'+
 							'<option value="2">Gasolina</option>'+
 							'<option value="1">Diesel o ACPM</option>');
 					}

 					$("#id_carro").val(data.result[0].elid);	
 					//traer datos para campos que no se editan 
 					//$("#e_configuracion").val(data.result[0].v_confi+'-'+data.result[0].v_descri);
 					//$("#e_color").val(data.result[0].color);
 					//$("#e_marca").val(data.result[0].marca);
 					//$("#e_linea").val(data.result[0].linea);
 					
 					//$("#e_tipo_carroceria").val(data.result[0].tipo_carroceria);
 					$("#e_carroceria").val(data.result[0].cod_rndc_carroceria);
 					
 					$("#e_num_motor").val(data.result[0].num_motor);
					$("#e_num_chasis").val(data.result[0].num_chasis);
					$("#e_numerito_poliza").val(data.result[0].poliza_responsabilidad);
					$("#e_fecha_poliza").val(data.result[0].vence_poliza);
					$("#e_repotenciado").val(data.result[0].repotenciado);
					$("#e_fecha_mantenimientogps").val(data.result[0].fecha_mant_gps);
					$("#e_capacidad_tn").val(data.result[0].capacidad_tn);
					$("#e_bruto_kg").val(data.result[0].pesobruto_kg);
					$("#e_fecha_matricula").val(data.result[0].f_matricula);

					var vincular=data.result[0].tipo_vinculacion;
					if(vincular=='' || vincular==null){
						$("#e_tipovinculacion").html('<option value="">Seleccione</option>'+
														'<option value="Tercero">Tercero</option>'+
													'<option value="Propio">Propio</option>');
					}

					if(vincular=='Tercero'){
						$("#e_tipovinculacion").html('<option value="'+vincular+'">Tercero</option>'+
													'<option value="Propio">Propio</option>');
					}

					if(vincular=='Propio'){
						$("#e_tipovinculacion").html('<option value="'+vincular+'">Propio</option>'+
													'<option value="Tercero">Tercero</option>');
					}

 					//ARCHIVOS MOSTRAR LOS QUE YA EXISTEN
 					//vehiculo
 					$("#e_ruta_vehiculo").val(data.result[0].foto_vehiculo);
 					$("#e_caja_vehiculo").html(data.archivos);
 					//trailer
 					$("#e_ruta_trailer").val(data.result[0].foto_trailer);
 					$("#e_caja_trailer").html(data.archivost);
 					
 					//traer campos para los selects que son editables 
 					// e_tipovehiculo , Solo servicio al cliente
 					//var tipo=$('#e_tipovehiculo').html('');
	 			/*data.result[0].tipo_vehiculo.forEach(function(element,index){
	 				var tmpSelected = "";
	 				if(element.selected){
	 					tmpSelected = "selected";
	 				}
	 				var tipo=$('#e_tipovehiculo').append('<option '+tmpSelected+' value="'+element.tipo_carro+'">'+element.tipo_carron+'</option>');
	 			});*/
 					// e_aseguradora
 					var asegure=$('#e_aseguradora').html('');
	 			data.result[0].aseguradora.forEach(function(element,index){
	 				var tmpSelected = "";
	 				if(element.selected){
	 					tmpSelected = "selected";
	 				}
	 				var tipo=$('#e_aseguradora').append('<option '+tmpSelected+' value="'+element.asegure+'">'+element.asegure+'</option>');
	 			});

	 			//configuracion
	 			var confi=$("#e_configuracion").html('');
	 			data.result[0].configuracion.forEach(function(element,index){
	 				var tmpSelected="";
	 				if(element.selected){
	 					tmpSelected="selected";
	 				}
	 				var conf=$("#e_configuracion").append('<option '+tmpSelected+' value="'+element.id+'">'+element.nombre+'-'+element.descripcion+'</option>');
	 				//$("#eid_vehiculo_configuracion").val(element.id);
	 				//$("#erndc_vehiculo_configuracion").val(element.rndc_id);

	 			});

	 			//color
	 			var color=$("#e_color").html('');
	 			data.result[0].color.forEach(function(element,index){
	 				var tmpSelected="";
	 				if(element.selected){
	 					tmpSelected="selected";
	 				}
	 				var colour=$("#e_color").append('<option '+tmpSelected+' value="'+element.color+'">'+element.color+'</option>');
	 			});

	 			//marca
	 			var marca=$("#e_marca").html('');
	 			data.result[0].marca.forEach(function(element,index){
	 				var tmpSelected="";
	 				if(element.selected){
	 					tmpSelected="selected";
	 				}
	 				var marca=$("#e_marca").append('<option '+tmpSelected+' value="'+element.marca+'">'+element.marca+'</option>');
	 			});

	 			//linea
	 			var linea=$("#e_linea").html('');
 				data.result[0].line.forEach(function(element,index){
 					var tmpSelected="";
 					if(element.selected){
 						tmpSelected="selected";
 					}
 					var linea=$("#e_linea").append('<option '+tmpSelected+' value="'+element.linea+'">'+element.linea+'</option>');
 				});

 				//carroceria
 				var carro=$("#e_carroceria").html('');
 				data.result[0].carroceria.forEach(function(element,index){
 					var tmpSelected="";
 					if(element.selected){
 						tmpSelected="selected";
 					}
 					var carro=$("#e_carroceria").append('<option '+tmpSelected+' value="'+element.carroceria+'">'+element.carroceria+'</option>');
 				});


 				//tipo carroceria
 				var tcarro=$("#e_tipo_carroceria").html('');
 				data.result[0].tipocarroceria.forEach(function(element,index){
 					var tmpSelected="";
 					if(element.selected){
 						tmpSelected="selected";
 					}
 					var tcarcarroceriaro=$("#e_tipo_carroceria").append('<option '+tmpSelected+' value="'+element.tipocarroceria+'">'+element.tipocarroceria+'</option>');
 				});

 				//clase
 				var tclase=$("#e_clasevehiculo").html('');
 				data.result[0].clase.forEach(function(element,index){
 					var tmpSelected="";
 					if(element.selected){
 						tmpSelected="selected";
 					}
 					var tclase=$("#e_clasevehiculo").append('<option '+tmpSelected+' value="'+element.idclase+'">'+element.clase+'</option>');
 				});

 					
 					//e_docpropietario   e_nombre_propietario
 					var propi=$('#e_docpropietario').html('');
	 				data.result[0].id_propietario.forEach(function(element,index){
	 				var tmpSelected = "";
	 				if(element.selected){
	 					tmpSelected = "selected";
	 				}
	 				var propi=$('#e_docpropietario').append('<option '+tmpSelected+' value="'+element.propi+'">'+element.propid+'-'+element.propin+'</option>');
	 				});
	 				//e_doctenedor   e_nombre_tenedor
	 				var tene=$('#e_doctenedor').html('');
	 				data.result[0].id_tenedor.forEach(function(element,index){
	 				var tmpSelected = "";
	 				if(element.selected){
	 					tmpSelected = "selected";
	 				}
	 				var tene=$('#e_doctenedor').append('<option '+tmpSelected+' value="'+element.tene+'">'+element.tenedocu+'-'+element.tenename+'</option>');
	 				});
	 				//e_docconductor    e_nombre_conductor
	 				var conductor=$('#e_docconductor').html('');
	 				data.result[0].id_conductor.forEach(function(element,index){
	 				var tmpSelected = "";
	 				if(element.selected){
	 					tmpSelected = "selected";
	 				}
	 				var conductor=$('#e_docconductor').append('<option '+tmpSelected+' value="'+element.conductor+'">'+element.conductordocu+'-'+element.conductorname+'</option>');
	 				});
	 				//estado de solicitud

	 				//trailer, validar si trae o no trailer
	 				var trailer=$("#e_trailers").html('<option value="nada" readonly="readonly">Seleccione esta opción para no editar con trailer</option>');
	 				data.result[0].id_trailer.forEach(function(element,index){
	 					if(element.selected){
	 						var anterior=$("#trailer_anterior").val(element.idtrailer);
	 					}
	 					
	 					var estado=element.estado_soli;
	 					if(estado=='Disponible'){
	 						var color='blue';
	 					}else if(estado=='Asignado'){
	 					 	var	color='red';
	 					}
	 					var tmpSelected = "";
	 				if(element.selected){
	 					tmpSelected = "selected";
	 				}
	 					var trailer=$('#e_trailers').append('<option '+tmpSelected+' value="'+element.idtrailer+'" style="color:'+color+';" >'+element.placatrailer+'</option>');

	 				});

	 				//ARCHIVOS
	 				var docu='';

	 				if(data.result[0].name_soat!=null && data.result[0].name_soat!=''){
	 					docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_soat+'/'+data.result[0].name_soat+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
						$("#as").html(docu);
	 				}else{
	 					$("#as").html('<p class="text-danger">No existe archivo</p>');
	 				}


	 				if(data.result[0].name_tecno!=null && data.result[0].name_tecno!=''){
	 					docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_tecno+'/'+data.result[0].name_tecno+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
						$("#at").html(docu);
	 				}else{
	 					$("#at").html('<p class="text-danger">No existe archivo</p>');
	 				}


	 				if(data.result[0].name_frontal!=null && data.result[0].name_frontal!=''){
	 					docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_vehiculo+'/'+data.result[0].name_frontal+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#avf").html(docu);
	 				}else{
	 					$("#avf").html('<p class="text-danger">No existe archivo</p>');
	 				}

	 				if(data.result[0].name_derecha!=null && data.result[0].name_derecha!=''){
	 					docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_derecha+'/'+data.result[0].name_derecha+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#avd").html(docu);
	 				}else{
	 					$("#avd").html('<p class="text-danger">No existe archivo</p>');
	 				}

	 				if(data.result[0].name_izquierda!=null && data.result[0].name_izquierda!=''){
	 					docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_izquierda+'/'+data.result[0].name_izquierda+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#avi").html(docu);
	 				}else{
	 					$("#avi").html('<p class="text-danger">No existe archivo</p>');
	 				}

	 				if(data.result[0].name_atras!=null && data.result[0].name_atras!=''){
	 					docu='<a  href="http://localhost/mvcLuisMiguel/'+data.result[0].foto_atras+'/'+data.result[0].name_atras+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
								$("#ava").html(docu);
	 				}else{
	 					$("#ava").html('<p class="text-danger">No existe archivo</p>');
	 				}






	 			$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>');
				$("html, body").animate({ scrollTop: 0 }, 600);

 				}else{
 					console.log('no hay resultados');	
 				}
 			},
 			error: function(jqXHR, textStatus, errorThrown){
 				console.log('error datos vehiculo');
 				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
 			}

 		});		

}
//TRAER DATOS DEL VEHÍCULO ANTERIOR
function editardatosVehiculo(id_vehiculo) {
	$(".form-control").val("");
	$(".hidden-form").val("");

	$("#e_id_vehiculo").val(id_vehiculo);
	$("#nexos_messages_popup").html("");
	$(".nexos_messages_popup").html("");

	$("#e_placa").attr("disabled", true);
	$("#e_configuracion").attr("disabled", false);
	$("#e_color").attr("disabled", false);
	$("#e_marca").attr("disabled", false);
	$("#e_linea").attr("disabled", false);
	$("#e_modelo").attr("disabled", false);
	$("#e_tipo_combustible").attr("disabled", false);
	$("#e_carroceria").attr("disabled", false);
	$("#e_peso_vacio").attr("disabled", false);
	$("#e_tipo_vehiculo").attr("disabled", false);
	$("#e_tipo_carroceria").attr("disabled", false);

	var params = {
		accion: 'verVehiculo',
		id_vehiculo : id_vehiculo
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#titulo_editar").text("Vehiculo #"+data.content["placa"]);
			$("#e_placa").val(data.content["placa"]);
			$("#e_placa_trailer").val(data.content["placa_trailer"]);
			$("#e_cedula_propietario").val(data.content["documento_propietario"] + " - " + data.content["nombre_propietario"] );
			$("#e_id_propietario").val(data.content["id_propietario"]);
			$("#e_id_tipo_documento_propietario").val(data.content["tipo_documento_propietario"]);
			$("#e_digito_verificacion_propietario").val( calcularDigitoVerificacion(data.content["documento_propietario"]) );
			$("#e_nombre_propietario").val(data.content["nombre_propietario"]);
			$("#e_cedula_tenedor").val(data.content["documento_tenedor"] + " - " + data.content["nombre_tenedor"] );
			$("#e_id_tenedor").val(data.content["id_tenedor"]);
			$("#e_id_tipo_documento_tenedor").val(data.content["tipo_documento_tenedor"]);
			$("#e_digito_verificacion_tenedor").val( calcularDigitoVerificacion(data.content["documento_tenedor"]) );
			$("#e_nombre_tenedor").val(data.content["nombre_tenedor"]);
			$("#e_cedula_conductor").val(data.content["documento_conductor"] + " - " + data.content["nombre_conductor"] );
			$("#e_id_conductor").val(data.content["id_conductor"]);
			$("#e_id_tipo_documento_conductor").val(data.content["tipo_documento_conductor"]);
			$("#e_digito_verificacion_conductor").val( calcularDigitoVerificacion(data.content["documento_conductor"]) );
			$("#e_nombre_conductor").val(data.content["nombre_conductor"]);
			$("#e_tipo_vehiculo").val(data.content["tipo_vehiculo"]);
			// $("#e_tipo_vehiculo").attr("disabled", true);
			$("#e_id_tipo_vehiculo").val(data.content["id_tipo_vehiculo"]);
			$("#e_tipo_vehiculo_peso").val(data.content["tipo_vehiculo_peso"]);
			$("#e_tipo_carroceria").val(data.content["tipo_carroceria"]);
			if ( data.content["tipo_carroceria"] ) {
				$("#e_tipo_carroceria").attr("disabled", true);
			}
			$("#e_web_satelital").val(data.content["web_satelital"]);
			$("#e_usuario_satelital").val(data.content["usuario_satelital"]);
			$("#e_clave_satelital").val(data.content["clave_satelital"]);
			


			var msg_error = "";
			if ( !data.content["rndc_propietario"] ) {
				msg_error+= "<p>1El <strong>propietario</strong> de este vehículo no se encuentra sincronizado con el <strong>RNDC</strong>, por favor realice el ajuste en el módulo de <strong>proveedores</strong> antes de editar este vehículo.</p>";
			}
			if ( !data.content["rndc_tenedor"] ) {
				msg_error+= "<p>El <strong>tenedor</strong> de este vehículo no se encuentra sincronizado con el <strong>RNDC</strong>, por favor realice el ajuste en el módulo de <strong>proveedores</strong> antes de editar este vehículo.</p>";
			}
			if ( !data.content["rndc_conductor"] ) {
				msg_error+= "<p>El <strong>conductor</strong> de este vehículo no se encuentra sincronizado con el <strong>RNDC</strong>, por favor realice el ajuste en el módulo de <strong>proveedores</strong> antes de editar este vehículo.</p>";
			}

			// Se buscan los registros del rndc 
			if ( data.content["rndc_result"] ) {
				// console.log(data.content["rndc_result"]);

				// Configuración
				$("#e_configuracion").val(data.content["rndc_result"]["rndc_vehiculo_configuracion"]["NOMBRE"]);
				$("#e_id_vehiculo_configuracion").val(data.content["rndc_result"]["rndc_vehiculo_configuracion"]["id"]);
				$("#e_rndc_vehiculo_configuracion").val(data.content["rndc_result"]["rndc_vehiculo_configuracion"]["rndc_id"]);

				// Color
				$("#e_color").val(data.content["rndc_result"]["rndc_vehiculo_color"]["color"]);
				$("#e_id_vehiculo_color").val(data.content["rndc_result"]["rndc_vehiculo_color"]["id"]);
				$("#e_rndc_vehiculo_color").val(data.content["rndc_result"]["rndc_vehiculo_color"]["rndc_id"]);

				// Marca
				$("#e_marca").val(data.content["rndc_result"]["rndc_vehiculo_marca"]["marca"]);
				$("#e_id_vehiculo_marca").val(data.content["rndc_result"]["rndc_vehiculo_marca"]["id"]);
				$("#e_rndc_vehiculo_marca").val(data.content["rndc_result"]["rndc_vehiculo_marca"]["rndc_id"]);

				// Línea
				$("#e_linea").val(data.content["rndc_result"]["rndc_vehiculo_linea"]["descripcion"]);
				$("#e_id_vehiculo_linea").val(data.content["rndc_result"]["rndc_vehiculo_linea"]["id"]);
				$("#e_rndc_vehiculo_linea").val(data.content["rndc_result"]["rndc_vehiculo_linea"]["rndc_id"]);

				// Modelo
				$("#e_modelo").val(data.content["rndc_result"]["anofabricacionvehiculocarga"] );

				// tipo de combustible
				$("#e_tipo_combustible").val(data.content["rndc_result"]["codtipocombustible"] );

				// Tipo carrocería
				$("#e_carroceria").val(data.content["rndc_result"]["rndc_vehiculo_carroceria"]["descripcion"]);
				$("#e_id_vehiculo_carroceria").val(data.content["rndc_result"]["rndc_vehiculo_carroceria"]["id"]);
				$("#e_rndc_vehiculo_carroceria").val(data.content["rndc_result"]["rndc_vehiculo_carroceria"]["rndc_id"]);

				// peso vacío
				$("#e_peso_vacio").val(data.content["rndc_result"]["pesovehiculovacio"] );

				// # SOAT
				$("#e_numero_poliza").val(data.content["rndc_result"]["numsegurosoat"] );

				// # SOAT
				$("#e_soat_vencimiento").val(data.content["rndc_result"]["fechavencimientosoat"] );

				// Aseguradoras
				$("#e_aseguradora").val(data.content["rndc_result"]["rndc_vehiculo_aseguradora"]["nombre"]);
				$("#e_id_vehiculo_aseguradora").val(data.content["rndc_result"]["rndc_vehiculo_aseguradora"]["id"]);
				$("#e_rndc_vehiculo_aseguradora").val(data.content["rndc_result"]["rndc_vehiculo_aseguradora"]["rndc_id"]);

				// Se inactivan campos que no se deben editar 
				$("#e_configuracion").attr("disabled", true);
				$("#e_color").attr("disabled", true);
				$("#e_marca").attr("disabled", true);
				$("#e_linea").attr("disabled", true);
				$("#e_modelo").attr("disabled", true);
				$("#e_tipo_combustible").attr("disabled", true);
				$("#e_carroceria").attr("disabled", true);
				$("#e_peso_vacio").attr("disabled", true);
			}else{
				if ( !data.error ) {
					// Si no se deshabilitan los formularios se genera el listado precargado
					$("#e_caja_configuracion").html('<input type="text" class="typeahead form-control" placeholder="Configuración" id="e_configuracion">');
					e_rndcCargarVehiculoConfiguracion();
					$("#e_caja_color").html('<input type="text" class="typeahead form-control" placeholder="Color" id="e_color">');
					e_rndcCargarVehiculoColor();
					$("#e_caja_marca").html('<input type="text" class="typeahead form-control" placeholder="Marca" id="e_marca">');
					e_rndcCargarVehiculoMarca();
					$("#e_caja_linea").html('<input type="text" class="typeahead form-control" placeholder="Línea" id="e_linea">');
					e_rndcLineaVehiculo( );
					$("#e_linea").blur(function(){
						// console.log("Entro en fuincion de blur del campo linea");
						if ( $("#e_id_vehiculo_marca").val() && $("#e_id_vehiculo_linea").val() ) {
							// console.log("Se puede verificar");
							e_rndc_verificalinea( $("#e_id_vehiculo_marca").val(), $("#e_id_vehiculo_linea").val() );
						}
					});
					$("#e_caja_carroceria").html('<input type="text" class="typeahead form-control" placeholder="Carrocería" id="e_carroceria">');
					e_rndcCargarVehiculoCarroceria();
					$("#e_caja_aseguradora").html('<input type="text" class="typeahead form-control" placeholder="Aseguradora" id="e_aseguradora">');
					e_rndcCargarVehiculoAseguradora();
				}
				else{
					msg_error+= "<p>" + data.error + "</p>";
				}
			}

			if ( msg_error ) {
				$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
				$("#editar_vehiculos").animate({ scrollTop: 0 }, 600);
			}
		}
	}, 'json');
}

function verVehiculo(id_vehiculo) {
	 // alert('bienvenido a ver vehiculo');
	
	$("#e_id_vehiculo").val(id_vehiculo);
	$("#titulo_ver").text("Vehículo # Cargando...");
	$("#ver_vehiculos .form-control").val("Cargando...");
	var params = {
		accion: 'verVehiculo',
		id_vehiculo : id_vehiculo
	};
	$.post(url, params, function (data) {
		console.log(data);
		if (data.success) {

			$("#titulo_ver").text("Vehículo # "+data.content["placa"]);
			$("#v_placa").val(data.content["placa"]);
			$("#v_placa_trailer").val(data.content["placa_trailer"]);
			$("#v_cedula_propietario").val(data.content["documento_propietario"]);
			$("#v_id_propietario").val(data.content["id_propietario"]);
			$("#v_nombre_propietario").val(data.content["nombre_propietario"]);
			$("#v_cedula_tenedor").val(data.content["documento_tenedor"]);
			$("#v_id_tenedor").val(data.content["id_tenedor"]);
			$("#v_nombre_tenedor").val(data.content["nombre_tenedor"]);
			$("#v_cedula_conductor").val(data.content["documento_conductor"]);
			$("#v_id_conductor").val(data.content["id_conductor"]);
			$("#v_nombre_conductor").val(data.content["nombre_conductor"]);
			$("#v_clase_vehiculo").val(data.content["clase"]);
			$("#v_id_tipo_vehiculo").val(data.content["id_tipo_vehiculo"]);
			$("#v_tipo_carroceria").val(data.content["tipo_carroceria"]);
			$("#v_web_satelital").val(data.content["web_satelital"]);
			$("#v_usuario_satelital").val(data.content["usuario_satelital"]);
			$("#v_clave_satelital").val(data.content["clave_satelital"]);
			
			var combustible=data.content["cod_tipo_combustible"];
			var c='';
			if(combustible==1){
				c='Diesel o ACPM';
			}
			if(combustible==2){
				c='Gasolina';
			}
			if(combustible==3){
				c='Gas';
			}

			if(combustible==4){
				c='Gas/Gasolina';
			}


			 $("#v_config").val(data.content["sigla_c"]+'-'+data.content["des_c"]);
			 $("#v_color").val(data.content["color"]);
			 $("#v_marca").val(data.content["marca"]);
			 $("#v_linea").val(data.content["linea"]);
			 $("#v_modelo").val(data.content["anio_fabricacion"]);
			 $("#v_peso").val(data.content["peso"]);
			 $("#v_combustible").val(c);
			$("#v_tcerroceria").val(data.content["cod_rndc_carroceria"]);
			$("#v_soat").val(data.content["num_soat"]);
			$("#v_vencesoat").val(data.content["vence_soat"]);
			$("#v_asegura").val(data.content["aseguradora"]);
			$("#v_num_motor").val(data.content["num_motor"]);
			$("#v_num_chasis").val(data.content["num_chasis"]);
			$("#v_vencepoliza").val(data.content["vence_poliza"]);
			$("#v_repotenciado").val(data.content["repotenciado"]);
			$("#v_vinculacion").val(data.content["tipo_vinculacion"]);
			$("#v_poliza").val(data.content["poliza_responsabilidad"]);
			$("#v_mantenimiento").val(data.content["fecha_mant_gps"]);
			$("#v_capacidad").val(data.content["capacidad_tn"]);
			$("#v_bruto").val(data.content["pesobruto_kg"]);
			$("#v_tecno").val(data.content["tecnomecanica"]);
			$("#v_etecno").val(data.content["tecno_fecha_expedida"]);
			$("#v_vitecno").val(data.content["tecno_fecha_vigencia"]);
			var trailer=data.content["placa_trailer"];
			if(trailer!=null || trailer!=''){
				$("#v_trailer").val(data.content["placa_trailer"]);
			}else if(trailer==null || trailer==''){
				$("#v_trailer").html('No aplica');
			}
			
			//documentos
			var docu='';
			if(data.content["name_frontal"]!=''){
			
				docu='<a  href="http://localhost/mvcLuisMiguel/'+data.content["foto_vehiculo"]+'/'+data.content["name_frontal"]+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
				$("#vf").html(docu);	
			}else{
				$("#vf").html('<p class="text-danger">No existe el archivo</p>');
			}

			if(data.content["name_derecha"]!=''){

				docu='<a  href="http://localhost/mvcLuisMiguel/'+data.content["foto_derecha"]+'/'+data.content["name_derecha"]+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
				$("#vd").html(docu);
			}else{
				$("#vd").html('<p class="text-danger">No existe el archivo</p>');
			}

			if(data.content["name_izquierda"]!=''){
				docu='<a  href="http://localhost/mvcLuisMiguel/'+data.content["foto_izquierda"]+'/'+data.content["name_izquierda"]+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
				$("#vi").html(docu);
			}else{
				$("#vi").html('<p class="text-danger">No existe el archivo</p>');
			}

			if(data.content["name_atras"]!=''){
				docu='<a  href="http://localhost/mvcLuisMiguel/'+data.content["foto_atras"]+'/'+data.content["name_atras"]+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
				$("#vt").html(docu);
			}else{
				$("#vt").html('<p class="text-danger">No existe el archivo</p>');
			}

			if(data.content["name_soat"]!=''){
				docu='<a  href="http://localhost/mvcLuisMiguel/'+data.content["foto_soat"]+'/'+data.content["name_soat"]+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
				$("#vso").html(docu);
			}else{
				$("#vso").html('<p class="text-danger">No existe el archivo</p>');
			}

			if(data.content["name_tecno"]!=''){
				docu='<a  href="http://localhost/mvcLuisMiguel/'+data.content["foto_tecno"]+'/'+data.content["name_tecno"]+'"  target="_blank" class="cell-detail hint--top-left" data-hint="">'+
									'<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >'+
									'</span>'+
								'</a>';
				$("#vte").html(docu);
			}else{
				$("#vte").html('<p class="text-danger">No existe el archivo</p>');
			}



		}
		else{}
	}, 'json');  
}

function datosinactivarvehiculo(id_vehiculo) {
	$("#i_id_vehiculo").val(id_vehiculo);
	var params = {
		accion: 'verdatosActivarVehiculo',
		id_vehiculo : id_vehiculo
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#i_num_vehiculo").text("¿Desea inactivar el vehiculo con placas "+data.content["placa"]+"?");
		}
		else{}
	}, 'json');
}

function datosactivarvehiculo(id_vehiculo) {
	$("#a_id_vehiculo").val(id_vehiculo);
	var params = {
		accion: 'verdatosActivarVehiculo',
		id_vehiculo : id_vehiculo
	};
	
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#a_num_vehiculo").text("¿Desea activar el vehiculo con placas "+data.content["placa"]+"?");
		}
		else{}
	}, 'json');  
}
//EDICION DE DATOS NEUVA
function editarvehiculonew(){
	// alert('editese bien ');
	var data = null;
	data = new FormData();
	//ARCHIVOS ACTUALIZAR

	//foto frontal
	var archivos = document.getElementById('e_foto_vehiculo').files;
		for (var i = 0; i < archivos.length; i++) {
			data.append("e_foto_vehiculo" + i, archivos[i]);
	}

	//soat
	var soat = document.getElementById('f_soat').files;
		for (var s = 0; s < soat.length; s++) {
			data.append("f_soat" + s, soat[s]);
	}	
	//tecnomecanica
	var tecno = document.getElementById('f_tecno').files;
		for (var t = 0; t < tecno.length; t++) {
			data.append("f_tecno" + t, tecno[t]);
	}

	//foto derecha
	var derecha = document.getElementById('f_derecha').files;
		for (var d = 0; d < derecha.length; d++) {
			data.append("f_derecha" + d, derecha[d]);
	}

	//foto izquierda
	var izqui = document.getElementById('f_izquierda').files;
		for (var m = 0; m < izqui.length; m++) {
			data.append("f_izquierda" + m, izqui[m]);
	}

	//foto atras
	var atras = document.getElementById('f_atras').files;
		for (var a = 0; a < atras.length; a++) {
			data.append("f_atras" + a, atras[a]);
	}	

	data.append("accion", 'editarvehiculonew');
	data.append("idusuario", $("#e_id_usuario").val());
	data.append("id_vehiculo", $("#id_carro").val());
	data.append("placa", $("#e_placa").val());
	//data.append("tipo_vehiculo", $("#e_tipovehiculo").val());
	data.append("nsoat", $("#e_numero_poliza").val());
	data.append("fechavence", $("#e_soat_vencimiento").val());
	data.append("asegura", $("#e_aseguradora").val());
	data.append("tecno", $("#e_tecnomecanica").val());
	data.append("expetecno", $("#e_fecha_tecno").val());
	data.append("vigentecno", $("#e_fecha_vig_tecno").val());
	data.append("web", $("#e_web_satelital").val());
	data.append("user", $("#e_usuario_satelital").val());
	data.append("clave", $("#e_clave_satelital").val());
	data.append("placat", $("#e_trailers").val());
	// data.append("licencia", $("#e_num_licencia").val());
	// data.append("expelicencia", $("#e_fecha_tarjeta_propiedad").val());
	// data.append("vencelicencia", $("#e_fechavence_tarjeta_propiedad").val());
	data.append("docpropi", $("#e_docpropietario").val());
	data.append("doctenedor", $("#e_doctenedor").val());
	data.append("docconductor", $("#e_docconductor").val());
	data.append("e_ruta_vehiculo", $("#e_ruta_vehiculo").val());
	// data.append("e_ruta_trailer", $("#e_ruta_trailer").val());
	data.append("e_num_motor", $("#e_num_motor").val());
	data.append("e_num_chasis", $("#e_num_chasis").val());
	data.append("e_numerito_poliza", $("#e_numerito_poliza").val());
	data.append("e_fecha_poliza", $("#e_fecha_poliza").val());
	data.append("e_repotenciado", $("#e_repotenciado").val());
	data.append("e_tipovinculacion", $("#e_tipovinculacion").val());
	data.append("e_fecha_mantenimientogps", $("#e_fecha_mantenimientogps").val());
	data.append("e_capacidad_tn", $("#e_capacidad_tn").val());
	data.append("e_bruto_kg", $("#e_bruto_kg").val());
	data.append("e_fecha_matricula", $("#e_fecha_matricula").val());



	data.append("e_configuracion", $("#e_configuracion").val());
	data.append("e_color", $("#e_color").val());
	data.append("e_marca", $("#e_marca").val());
	data.append("e_linea", $("#e_linea").val());
	data.append("e_modelo", $("#e_modelo").val());
	data.append("e_tipo_combustible", $("#e_tipo_combustible").val());
	data.append("e_clasevehiculo", $("#e_clasevehiculo").val());
	data.append("e_tipo_carroceria", $("#e_tipo_carroceria").val());
	data.append("e_carroceria", $("#e_carroceria").val());
	data.append("e_peso_vacio", $("#e_peso_vacio").val());

	



	//nombres de los archivos
	data.append("newso", $("#newso").val());
	data.append("newte", $("#newte").val());
	data.append("newavf", $("#newavf").val());
	data.append("newavd", $("#newavd").val());	
	data.append("newavi", $("#newavi").val());
	data.append("newava", $("#newava").val());

	//editar datos del trailer
		//tres eventos 1 sin trailer,2 con trailer update new , 
		var trailer=$("#e_trailers").val();
	if(trailer=='nada'){
		data.append("e_trailers", $("#e_trailers").val());
	 // data.append("trailer_anterior", $("#trailer_anterior").val());

	}else if(trailer.length>0){
		data.append("e_trailers", $("#e_trailers").val());
	 	 data.append("trailer_anterior", $("#trailer_anterior").val());
	}	

	 
	var url =$("#id_url_ajax").val() + "libs/vehiculos_ajax.php";

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
			 	// console.log('ACTUALIZO VEHICULO');
				alert('Datos Actualizados Existosamente!!!');
				$("html, body").animate({ scrollTop: 0 }, 600);
					setTimeout(function() { location.reload(false);  }, 800);
			},
			error: function (jqXHR, textStatus, errorThrown){
				console.log('NO ACTUALIZO VEHICULO');
				console.log(jqXHR);
				console.log(textStatus);
				console.log(errorThrown);
			}
		});



	// var params = {

	// accion: 'editarvehiculonew',
	// idusuario:    $("#e_id_usuario").val(),
	// id_vehiculo:   $("#id_carro").val(), 
	// placa:         $("#e_placa").val(),
	//  tipo_vehiculo:    $("#e_tipovehiculo").val(),
	//  nsoat:            $("#e_numero_poliza").val(),
	//  fechavence:       $("#e_soat_vencimiento").val(),
	//  asegura:          $("#e_aseguradora").val(),
	//  tecno:            $("#e_tecnomecanica").val(),
	//  expetecno:        $("#e_fecha_tecno").val(),
	//  vigentecno:       $("#e_fecha_vig_tecno").val(),
	//  web:              $("#e_web_satelital").val(),
	//  user:             $("#e_usuario_satelital").val(),
	//  clave:            $("#e_clave_satelital").val(),
	//  placat:            $("#e_placa_trailer").val(),
	//  licencia:         $("#e_num_licencia").val(),
	//  expelicencia:     $("#e_fecha_tarjeta_propiedad").val(),
	//  vencelicencia:    $("#e_fechavence_tarjeta_propiedad").val(),
	// //datos de propietario, tenedor, conductor
	//  docpropi:         $("#e_docpropietario").val(),
	//  doctenedor:       $("#e_doctenedor").val(),
	//  docconductor:     $("#e_docconductor").val(),
	// };

	// // $("html, body").animate({ scrollTop: 0 }, 600);
	// // 		setTimeout(function() { location.reload(false);  }, 800);

	// $.post(url, params, function (data) {
	// 	console.log(data);
	// 	if (!data.error) {
	// 		$("#editar_vehiculos").css("display","none");
	// 		$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>');
	// 		$("html, body").animate({ scrollTop: 0 }, 600);
	// 		setTimeout(function() { location.reload(false);  }, 800);
	// 	} 
	// 	else {
	// 		var msg_error = data.error.replace(/\n/g , "</p><p>");
	// 		$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
	// 		$("#editar_vehiculos").animate({ scrollTop: 0 }, 600);
	// 	}
	// }, 'json');

}
//EDICION DE DATOS ANTEIOR 
function editarVehiculo() {
	var params = {
		accion: 'editarVehiculo',

		placa: 					$("#e_placa").val(),
	    id_vehiculo: 			$("#e_id_vehiculo").val(),
		id_propietario: 		$("#e_id_propietario").val(),
		id_tenedor: 			$("#e_id_tenedor").val(),
		id_conductor: 			$("#e_id_conductor").val(),
		tipo_vehiculo : 		$("#e_id_tipo_vehiculo").val(),
		tipo_carroceria : 		$("#e_tipo_carroceria").val(),
		web_satelital : 		$("#e_web_satelital").val(),
		usuario_satelital : 	$("#e_usuario_satelital").val(),
		clave_satelital : 		$("#e_clave_satelital").val(),
		placa_trailer: 			$("#e_placa_trailer").val(),

		// DATOS PARA ELM RNDC
		rndc_id_tipo_documento_propietario: $("#e_id_tipo_documento_propietario").val(),
		digito_verificacion_propietario: 	$("#e_digito_verificacion_propietario").val(),
		rndc_id_tipo_documento_tenedor: 	$("#e_id_tipo_documento_tenedor").val(),
		digito_verificacion_tenedor: 		$("#e_digito_verificacion_tenedor").val(),
		rndc_id_tipo_documento_conductor: 	$("#e_id_tipo_documento_conductor").val(),
		digito_verificacion_conductor: 		$("#e_digito_verificacion_conductor").val(),
		rndc_vehiculo_configuracion: 		$("#e_rndc_vehiculo_configuracion").val(),
		rndc_vehiculo_color: 				$("#e_rndc_vehiculo_color").val(),
		rndc_vehiculo_marca: 				$("#e_rndc_vehiculo_marca").val(),
		rndc_vehiculo_linea: 				$("#e_rndc_vehiculo_linea").val(),
		rndc_modelo: 						$("#e_modelo").val(),
		rncd_tipo_combustible: 				$("#e_tipo_combustible").val(),
		rndc_vehiculo_carroceria: 			$("#e_rndc_vehiculo_carroceria").val(),
		rndc_peso_vacio: 					$("#e_peso_vacio").val(),
		rndc_capacidad_carga: 				$("#e_tipo_vehiculo_peso").val(),
		rndc_numero_poliza: 				$("#e_numero_poliza").val(),
		rndc_soat_vencimiento: 				$("#e_soat_vencimiento").val(),
		rndc_vehiculo_aseguradora: 			$("#e_rndc_vehiculo_aseguradora").val(),
	};
	arrayRndcCedulaPropietario = $("#e_cedula_propietario").val().split(" - ");
	params["rndc_cedula_propietario"] = arrayRndcCedulaPropietario[0];
	arrayRndcCedulaTenedor = $("#e_cedula_tenedor").val().split(" - ");
	params["rndc_cedula_tenedor"] = arrayRndcCedulaTenedor[0];
	arrayRndcCedulaConductor = $("#e_cedula_conductor").val().split(" - ");
	params["rndc_cedula_conductor"] = arrayRndcCedulaConductor[0];

	$.post(url, params, function (data) {
		console.log(data);
		if (!data.error) {
			$("#editar_vehiculos").css("display","none");
			$(".nexos-messages").html('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>');
			$("html, body").animate({ scrollTop: 0 }, 600);
			setTimeout(function() { location.reload(false);  }, 800);
		} 
		else {
			var msg_error = data.error.replace(/\n/g , "</p><p>");
			$(".nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$("#editar_vehiculos").animate({ scrollTop: 0 }, 600);
		}
	}, 'json');
}

function inactivarVehiculo() {
	var params = {
		accion: 'inactivarVehiculo',
		id_vehiculo: $("#i_id_vehiculo").val()
	};

	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#btn_inactivar_vehiculo").attr("data-dismiss","modal");
			location.reload();
		}
		else{
			$("#btn_inactivar_vehiculo").removeAttr("data-dismiss");
		}
	}, 'json');
}

function activarVehiculo() {
	var params = {
		accion: 'activarVehiculo',
		id_vehiculo: $("#a_id_vehiculo").val()
	};
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			$("#btn_activar_vehiculo").attr("data-dismiss","modal");
			location.reload();
		}
		else{
			$("#btn_activar_vehiculo").removeAttr("data-dismiss");
		}
	}, 'json');
}

function getTipoDocumento( id, form_destino, digito_verificacion){
	// Se busca la información del tercero
	var params = {
		accion: "verProveedor",
		id_proveedor : id
	};
	// console.log( params );
	$.ajax({
		type		: "POST",
		cache		: false,
		url 		: $("#id_url_ajax").val() + "libs/proveedores_ajax.php",
		data		: params,
		dataType	: "json",
		beforeSend	: function(jqXHR, settings){
					$(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
		},
		success		: function(data) {
					// console.log(data);
					$(".nexos-messages").html("");
					// console.log(data.content.tipo_documento);
					$("#" + form_destino).val(data.content.tipo_documento)
					$("#" + digito_verificacion).val(data.content.digito_verificacion)
		}
	});
}


/******** FUNCIONES PARA CAMPOS RNDC DE CREACION DE VEHÍCULO ********/
function rndcCargarVehiculoConfiguracion(){
	// console.log("Entro en funcion rndcCargarVehiculoConfiguracion");
	$("#id_vehiculo_configuracion").val("");
	$("#rndc_vehiculo_configuracion").val("");
	var params = {
		accion: "rndc_cargarconfiguracion",
	};

	configuracion=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				configuracion.push(data.content[x]['nombre']);
			}
			$('#caja_configuracion .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(configuracion),
			});
			$.ajaxSetup({async: false});
			$('#caja_configuracion').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatosconfiguracion',
					nombre: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#id_vehiculo_configuracion").val(data.content[0]["id"]);
						$("#rndc_vehiculo_configuracion").val(data.content[0]["rndc_id"]);
						$("#color").focus();
					} else {
						$("#id_vehiculo_configuracion").val("");
						$("#rndc_vehiculo_configuracion").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function rndcCargarVehiculoColor(){
	// console.log("Entro en funcion rndcCargarVehiculoColor");
	$("#id_vehiculo_color").val("");
	$("#rndc_vehiculo_color").val("");
	var params = {
		accion: "rndc_cargarcolor",
	};

	color=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				color.push(data.content[x]['color']);
			}
			$('#caja_color .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(color),
			});
			$.ajaxSetup({async: false});
			$('#caja_color').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatoscolor',
					color: datum
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#id_vehiculo_color").val(data.content[0]["id"]);
						$("#rndc_vehiculo_color").val(data.content[0]["rndc_id"]);
						$("#marca").focus();
					} else {
						$("#id_vehiculo_color").val("");
						$("#rndc_vehiculo_color").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function rndcCargarVehiculoMarca(){
	// console.log("Entro en funcion rndcCargarVehiculoMarca");
	var params = {
		accion: "rndc_cargarmarca",
	};

	marca=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				marca.push(data.content[x]['marca']);
			}
			$('#caja_marca .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(marca),
			});
			$.ajaxSetup({async: false});
			$('#caja_marca').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatosmarca',
					marca: datum
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						//$("#id_vehiculo_marca").val(data.content[0]["id"]);
						//$("#rndc_vehiculo_marca").val(data.content[0]["rndc_id"]);


						$("#id_vehiculo_marca").val(data.content[0]["rndc_id"]);
						$("#rndc_vehiculo_marca").val(data.content[0]["id"]);
						$("#linea").focus();
					} else {
						$("#id_vehiculo_marca").val("");
						$("#rndc_vehiculo_marca").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function rndcLineaVehiculo( id_marca_vehiculo ){
	
	// console.log("Entro en funcion rndcLineaVehiculo");
	$("#id_vehiculo_linea").val("");
	$("#rndc_vehiculo_linea").val("");
	var params = {
		accion: 	"rndc_cargarlinea",
		id_marca: 	id_marca_vehiculo
	};
	// console.log(params);
	linea=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				linea.push(data.content[x]['descripcion']);
			}
			$('#caja_linea .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(linea),
			});
			$.ajaxSetup({async: false});
			$('#caja_linea').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatoslinea',
					descripcion: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#id_vehiculo_linea").val(data.content[0]["id"]);
						$("#rndc_vehiculo_linea").val(data.content[0]["rndc_id"]);
					} else {
						$("#id_vehiculo_linea").val("");
						$("#rndc_vehiculo_linea").val("");
					}
					$("#modelo").focus();
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function rndc_verificalinea( id_vehiculo_marca, id_vehiculo_linea ){
	// console.log("Entro en funcion rndc_verificalinea");
	$("#nexos_messages_popup").html("");



	var params = {
		accion: "rndc_verificalinea",
		id_vehiculo_marca: id_vehiculo_marca, 
		id_vehiculo_linea: id_vehiculo_linea
	};

	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (!data.success) {
			$("#linea").val("");
			$("#id_vehiculo_linea").val("");
			$("#rndc_vehiculo_linea").val("");
			$("#nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>La marca y línea del vehículo seleccionado coinciden con los registrados en el RNDC, por favor seleccione una combinación existente.</p></div></div>');
			$("#crea_vehiculos").animate({ scrollTop: 0 }, 600);
		}
		$("#modelo").focus();
	}, 'json');
	$.ajaxSetup({async: true});
}

function rndcCargarVehiculoCarroceria(){
	// console.log("Entro en funcion rndcCargarVehiculoCarroceria");
	$("#id_vehiculo_carroceria").val("");
	$("#rndc_vehiculo_carroceria").val("");
	var params = {
		accion: "rndc_cargarcarroceria",
	};

	carroceria=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				carroceria.push(data.content[x]['descripcion']);
			}
			$('#caja_carroceria .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(carroceria),
			});
			$.ajaxSetup({async: false});
			$('#caja_carroceria').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatoscarroceria',
					descripcion: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#id_vehiculo_carroceria").val(data.content[0]["id"]);
						$("#rndc_vehiculo_carroceria").val(data.content[0]["rndc_id"]);
					} else {
						$("#id_vehiculo_carroceria").val("");
						$("#rndc_vehiculo_carroceria").val("");
					}
					$("#peso_vacio").focus();
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function rndcCargarVehiculoAseguradora(){
	// console.log("Entro en funcion rndcCargarVehiculoAseguradora");
	$("#id_vehiculo_aseguradora").val("");
	$("#rndc_vehiculo_aseguradora").val("");
	var params = {
		accion: "rndc_cargaraseguradora",
	};

	aseguradora=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				aseguradora.push(data.content[x]['nombre']);
			}
			$('#caja_aseguradora .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(aseguradora),
			});
			$.ajaxSetup({async: false});
			$('#caja_aseguradora').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatosaseguradora',
					nombre: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#id_vehiculo_aseguradora").val(data.content[0]["id"]);
						$("#rndc_vehiculo_aseguradora").val(data.content[0]["rndc_id"]);
					} else {
						$("#id_vehiculo_aseguradora").val("");
						$("#rndc_vehiculo_aseguradora").val("");
					}
					$("#placa_trailer").focus();
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}
/******** FIN - FUNCIONES PARA CAMPOS RNDC DE CREACION DE VEHÍCULO ********/


/******** FUNCIONES PARA CAMPOS RNDC DE EDICION DE VEHÍCULO ********/
function e_rndcCargarVehiculoConfiguracion(){
	// console.log("Entro en funcion rndcCargarVehiculoConfiguracion");
	$("#e_id_vehiculo_configuracion").val("");
	$("#e_rndc_vehiculo_configuracion").val("");
	var params = {
		accion: "rndc_cargarconfiguracion",
	};

	configuracion=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				configuracion.push(data.content[x]['nombre']);
			}
			$('#e_caja_configuracion .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(configuracion),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_configuracion').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatosconfiguracion',
					nombre: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#e_id_vehiculo_configuracion").val(data.content[0]["id"]);
						$("#e_rndc_vehiculo_configuracion").val(data.content[0]["rndc_id"]);
						$("#e_color").focus();
					} else {
						$("#e_id_vehiculo_configuracion").val("");
						$("#e_rndc_vehiculo_configuracion").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function e_rndcCargarVehiculoColor(){
	// console.log("Entro en funcion rndcCargarVehiculoColor");
	$("#e_id_vehiculo_color").val("");
	$("#e_rndc_vehiculo_color").val("");
	var params = {
		accion: "rndc_cargarcolor",
	};

	color=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				color.push(data.content[x]['color']);
			}
			$('#e_caja_color .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(color),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_color').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatoscolor',
					color: datum
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#e_id_vehiculo_color").val(data.content[0]["id"]);
						$("#e_rndc_vehiculo_color").val(data.content[0]["rndc_id"]);
						$("#e_marca").focus();
					} else {
						$("#e_id_vehiculo_color").val("");
						$("#e_rndc_vehiculo_color").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function e_rndcCargarVehiculoMarca(){
	// console.log("Entro en funcion rndcCargarVehiculoMarca");
	var params = {
		accion: "rndc_cargarmarca",
	};

	marca=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				marca.push(data.content[x]['marca']);
			}
			$('#e_caja_marca .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(marca),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_marca').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatosmarca',
					marca: datum
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#e_id_vehiculo_marca").val(data.content[0]["id"]);
						$("#e_rndc_vehiculo_marca").val(data.content[0]["rndc_id"]);
						$("#e_linea").focus();
					} else {
						$("#e_id_vehiculo_marca").val("");
						$("#e_rndc_vehiculo_marca").val("");
					}
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function e_rndcLineaVehiculo( id_marca_vehiculo ){
	// console.log("Entro en funcion rndcLineaVehiculo");
	$("#e_id_vehiculo_linea").val("");
	$("#e_rndc_vehiculo_linea").val("");
	var params = {
		accion: 	"rndc_cargarlinea",
		id_marca: 	id_marca_vehiculo
	};
	// console.log(params);
	linea=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				linea.push(data.content[x]['descripcion']);
			}
			$('#e_caja_linea .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(linea),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_linea').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatoslinea',
					descripcion: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#e_id_vehiculo_linea").val(data.content[0]["id"]);
						$("#e_rndc_vehiculo_linea").val(data.content[0]["rndc_id"]);
					} else {
						$("#e_id_vehiculo_linea").val("");
						$("#e_rndc_vehiculo_linea").val("");
					}
					$("#e_modelo").focus();
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function e_rndc_verificalinea( id_vehiculo_marca, id_vehiculo_linea ){
	// console.log("Entro en funcion rndc_verificalinea");
	$("#e_nexos_messages_popup").html("");

	var params = {
		accion: "rndc_verificalinea",
		id_vehiculo_marca: id_vehiculo_marca, 
		id_vehiculo_linea: id_vehiculo_linea
	};

	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (!data.success) {
			$("#e_linea").val("");
			$("#e_id_vehiculo_linea").val("");
			$("#e_rndc_vehiculo_linea").val("");
			$("#e_nexos_messages_popup").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><p>La marca y línea del vehículo seleccionado coinciden con los registrados en el RNDC, por favor seleccione una combinación existente.</p></div></div>');
			$("#e_crea_vehiculos").animate({ scrollTop: 0 }, 600);
		}
		$("#e_modelo").focus();
	}, 'json');
	$.ajaxSetup({async: true});
}

function e_rndcCargarVehiculoCarroceria(){
	// console.log("Entro en funcion rndcCargarVehiculoCarroceria");
	$("#e_id_vehiculo_carroceria").val("");
	$("#e_rndc_vehiculo_carroceria").val("");
	var params = {
		accion: "rndc_cargarcarroceria",
	};

	carroceria=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				carroceria.push(data.content[x]['descripcion']);
			}
			$('#e_caja_carroceria .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(carroceria),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_carroceria').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatoscarroceria',
					descripcion: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#e_id_vehiculo_carroceria").val(data.content[0]["id"]);
						$("#e_rndc_vehiculo_carroceria").val(data.content[0]["rndc_id"]);
					} else {
						$("#e_id_vehiculo_carroceria").val("");
						$("#e_rndc_vehiculo_carroceria").val("");
					}
					$("#e_peso_vacio").focus();
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}

function e_rndcCargarVehiculoAseguradora(){
	// console.log("Entro en funcion rndcCargarVehiculoAseguradora");
	$("#e_id_vehiculo_aseguradora").val("");
	$("#e_rndc_vehiculo_aseguradora").val("");
	var params = {
		accion: "rndc_cargaraseguradora",
	};

	aseguradora=[];
	$.ajaxSetup({async: false});
	$.post(url, params, function (data) {
		// console.log(data);
		if (data.success) {
			for (let x = 0; x < data.content.length; x++) {
				aseguradora.push(data.content[x]['nombre']);
			}
			$('#e_caja_aseguradora .typeahead').typeahead({
				minLength: 1
			},
			{
				name: 'states',
				source: substringMatcher(aseguradora),
			});
			$.ajaxSetup({async: false});
			$('#e_caja_aseguradora').bind('typeahead:selected', function (obj, datum, name) {
				var params = {
					accion: 'rndc_obtenerdatosaseguradora',
					nombre: datum.split(" - ")[0]
				};
				$.post(url, params, function (data) {
					// console.log(data);
					if (data.success) {
						$("#e_id_vehiculo_aseguradora").val(data.content[0]["id"]);
						$("#e_rndc_vehiculo_aseguradora").val(data.content[0]["rndc_id"]);
					} else {
						$("#e_id_vehiculo_aseguradora").val("");
						$("#e_rndc_vehiculo_aseguradora").val("");
					}
					$("#e_placa_trailer").focus();
				}, 'json');
			});
			$.ajaxSetup({async: true});
		}
	}, 'json');
	$.ajaxSetup({async: true});
}
/******** FIN - FUNCIONES PARA CAMPOS RNDC DE EDICION DE VEHÍCULO ********/
