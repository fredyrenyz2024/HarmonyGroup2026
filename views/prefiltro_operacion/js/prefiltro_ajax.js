$(document).ready(function(){
	$(".divcliente").hide();
  	$(".divfechas").hide();
  	$(".divbtnbusqueda").hide();
  	$("#contenedor_registro").hide();
	$("#filtro").change(function(){
	  	var consultar=$("#filtro").val();
	  	if(consultar==''){
	  		$(".divcliente").hide();
	  		$(".divfechas").hide();
	  		$(".divbtnbusqueda").hide();
	  	}
	  	if(consultar==1){
	  		$(".divcliente").hide();
	  		$(".divfechas").show();
	  		$(".divbtnbusqueda").show();
	  	}
	  	if(consultar==2){
	  		$(".divcliente").show();
	  		$(".divfechas").hide();
	  		$(".divbtnbusqueda").show();
	  		ConsultaCliente();
	  	}
	  	if(consultar==3){
	  		$(".divcliente").show();
	  		$(".divfechas").show();
	  		$(".divbtnbusqueda").show();
	  		ConsultaCliente();
	  	}
  	});
  	//btn consultar
  	$("#buscar_prefiltro").click(function(){
  		Tabla_Prefiltro();
  	});

  	//btn registro
  	$("#crear_preestudio").click(function(){
  		var msg_error='';
  		if(!$("#placag").val()){
  			msg_error+="<p>Debe ingresar la <strong>Placa</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#web").val()){
  			msg_error+="<p>Debe ingresar la <strong>Web Sátelital</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#user_satelite").val()){
  			msg_error+="<p>Debe ingresar el <strong>Usuario Sátelital</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#clave").val()){
  			msg_error+="<p>Debe ingresar la <strong>Clave Sátelital</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#nompro").val()){
  			msg_error+="<p>Debe ingresar el <strong>Nombre Propietario</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#docupro").val()){
  			msg_error+="<p>Debe ingresar el <strong>Documento del Propietario</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#nomtene").val()){
  			msg_error+="<p>Debe ingresar el <strong>Nombre Poseedor</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#docutene").val()){
  			msg_error+="<p>Debe ingresar el <strong>Documento Poseedor</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#nomcondu").val()){
  			msg_error+="<p>Debe ingresar el <strong>Nombre Conductor</strong> para registrar el prefiltro</p>";
  		}
  		if(!$("#docucondu").val()){
  			msg_error+="<p>Debe ingresar el <strong>Documento del Conductor</strong> para registrar el prefiltro</p>";
  		}
  		//validar archivo
  		/*var cantp=$("#cont_papel").val();
  		if($("#cont_papel").val() > 0){
  				var u;
		 		for(u=1; u<=cantp; u++){
		 			if(typeof $("#sk"+u).val() !== 'undefined'){
		 				var tipohv_docu=$("#tipohoja"+u+"").val();
						var ruta=$("#ruta"+u+"").val();
						var namearchivo=$("#namearchivo"+u+"").val();
						var clase=$("#clase"+u+"").val();
						var documento=$("#documento"+u+"").val();
						if(!tipohv_docu){
							msg_error+="<p>Debe seleccionar el campo<strong>Tipo Hoja de vida</strong> para registrar el prefiltro</p>";
						}
						if(!clase){
							msg_error+="<p>Debe seleccionar el campo<strong>Clase</strong> para registrar el prefiltro</p>";
						}
						if(!namearchivo){
							msg_error+="<p>Debe seleccionar el campo<strong>Tipo Hoja de vida</strong> para registrar el prefiltro</p>";
						}
		 			}
		 		}
  		}*/
  		if(!msg_error){
  			Crear_Prefiltro();
  		}else{
  			$(".nexos-messages").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
			$(".panel-body").animate({ scrollTop: 1 }, 600);
  		}
  	});

  	//btn crear
  	$("#btn_crea").click(function(){
  		$("#contenedor_registro").toggle();
  		$("#contenedor_tabla").toggle();
  	});
});	

//borrar archivos
$(document).on('click', '.borrar2', function(event) {
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
$("#agregar_docu").click(function(){
  a++; //contador
  b = b + 1;
  var m, sw;

  //if(sw==1){
  var ch = '<input type="button" id="p' + a + '" class="btn-primary borrar2" value="Eliminar">';
  var hv = '<select id="tipohoja' + a + '" class="form-control input-sm"  onchange="tipodehoja(' + a +
    ', this.value);" >' +
    '<option value="">Seleccione</option>' +
    '<option value="Propietario">Propietario</option>' +
    '<option value="Tenedor">Tenedor</option>' +
    '<option value="Conductor">Conductor</option>' +
    '<option value="Vehiculo">Vehículo</option>' +
    '<option value="Trailer">Trailer</option>' +
    '<option value="Referencia_laboral1">Referencia laboral 1</option>' +
    '<option value="Referencia_laboral2">Referencia laboral 2</option>' +
    '<option value="Referencia_laboral3">Referencia laboral 3</option>' +
    +'</select>';
  var clase = '<select id="clase' + a + '" class="form-control input-sm"><option value="">Seleccione</option>' +
    '<option value="cedula">Cédula</option>' +
    '<option value="cedula_extranjeria">Cédula de extranjería</option>' +
    '<option value="tarjeta_propiedad">Tarjeta de propiedad</option>' +
    '<option value="pasaporte">Pasaporte</option>' +
    '<option value="referencia_laboral">Referencia laboral</option>' +
    '<option value="referencia_personal">Referencia personal</option>' +
    '<option value="licencia">Licencia </option>' +
    '<option value="fotografia_vehiculo">Fotografias vehículo</option>' +
    '<option value="fotografia_conductor_frontal">Fotografia del conductor frontal</option>' +
    '<option value="fotografia_conductor_derecha">Fotografia del conductor derecha</option>' +
    '<option value="fotografia_conductor_izquierda">Fotografia del conductor izquierda</option>' +
    '<option value="fotografia_indumentaria">Fotografia de Indumentaria</option>' +
    '<option value="fotografia_trailer">Fotografia de trailer</option>' +
    '<option value="rut">Rut</option>' +
    '<option value="Antecedentes_policivos">Antecedentes policivos</option>' +
    '<option value="otros">Otros</option>' +
    +' </select>';
  //rutas
  var papel = '<tr>' +
    '<td><p><strong>' + a + '</strong></p><input type="hidden" id="sk' + a + '" value="1">   </td>' +
    '<td>' + hv + '</td>' +
    '<td>' + clase + '</td>' +
    '<td><input type="text" class="form-control input-sm" id="ruta' + a + '" disabled="disabled"></td>' +
    '<td> <input type="file" class="form-control input-sm" name="documento' + a + '" id="documento' + a +
    '"  onchange="namedocumento(' + a + ', this.value);"  > </td>' +
    '<td> <input type="text" class="form-control input-sm" name="namearchivo' + a + '" id="namearchivo' + a +
    '" readonly="readonly">    </td>' +
    '<td>' + ch + '</td>' +
    +'</tr>';

  $("#tabla_papeles").append(papel);
  $("#cont_papel").val(b);

  //}
});

//funcion para extraer el nombre de los documentos
function namedocumento(id, valor) {
  var docu = document.getElementById('documento' + id + '').files[0].name;
  $("#namearchivo" + id + "").val(docu);
}


function ConsultaCliente(){
	$.post($("#id_url_ajax").val()+'prefiltro_operacion/ConsultaCliente',function(data){
		$("#clientefiltro").html('<option value="">Seleccionar</option>');	
		if(data){
			for(var i=0; i<data.length; i++){
				$("#clientefiltro").append('<option value="'+data[i]['id']+'">'+data[i]['nombre']+'</option>');
			}
		}else{
			$("#clientefiltro").html('<option value="">Seleccionar</option>');
		}
	},'json');		
}

function Tabla_Prefiltro(){
	var filtrarpor=$("#filtro").val();
	var fecha, fechab, cliente;
	if(filtrarpor==1){
		fecha=$("#finicial").val();
		fechab=$("#ffinal").val();
		cliente='';
	}
	
	$.post($("#id_url_ajax").val()+'prefiltro_operacion/Consulta_Datos','finicia='+fecha+'&ffinal='+fechab+'&cliente='+cliente+'&filtro='+filtrarpor,function(data){
		$("#tabla_prefiltros").html('');	
		if(data){
			for(var v=0; v<data.length; v++){
				$("#tabla_prefiltros").append('<tr>'+
				'<td class="cell-detail">'+data[v]['placa_vehiculo']+
					'<span class="">Tráiler: '+data[v]['placa_trailer']+'</span>'+
				'</td>'+
				'<td class="cell-detail">'+
					data[v]['nombre_propietario']+
					'<span>'+data[v]['documento_propietario']+'</span>'
				+'</td>'+
				'<td class="cell-detail">'+data[v]['nombre_tenedor']+
					'<span>'+data[v]['documento_tenedor']+'</span>'+'</td>'+
				'<td class="cell-detail">'+data[v]['nombre_conductor']+
					'<span>'+data[v]['documento_conductor']+'</span>'+'</td>'+
				'<td class="cell-detail">'+
				'<span><a href="'+data[v]['web_satelital']+'" target="_blank">'+data[v]['web_satelital']+'</a></span>'+
				'<span>'+data[v]['usuario_satelital']+'</span>'+
				'<span>'+data[v]['clave_satelital']+'</span>'+
				'</td>'+	
				'<td></td>'
				+'</tr>');
			}
		}
	},'json');
}

function Crear_Prefiltro(){
	var placa=$("#placag").val();
	var satelital=$("#web").val();
	var trailer=$("#placat").val();
	var user=$("#user_satelite").val();
	var clave=$("#clave").val();
	var propi=$("#nompro").val();
	var docu_propi=$("#docupro").val();
	var tene=$("#nomtene").val();
	var docu_tene=$("#docutene").val();
	var conductor=$("#nomcondu").val();
	var docu_condu=$("#docucondu").val();
	var capacidad=$("#capa_carga_vh").val();
	//referencias
	refe1=$("#referencias_empresariales1").val();
	contacto=$("#contacto_ref1").val();
	celular=$("#celular_ref1").val();
	cargo=$("#cargo_ref1").val();
	antigu=$("#anti_ref1").val();
	fecha1=$("#fingresoa1").val();
	fecha2=$("#fretiroa3").val();
	//referencias 2
	refe2=$("#referencias_empresariales2").val();
	contacto2=$("#contacto_ref2").val();
	celular2=$("#celular_ref2").val();
	cargo2=$("#cargo_ref2").val();
	antigu2=$("#anti_ref2").val();
	fechab1=$("#fingresob1").val();
	fechab2=$("#fretirob3").val();
	//referencias 3
	refe3=$("#referencias_empresariales3").val();
	contacto3=$("#contacto_ref3").val();
	celular3=$("#celular_ref3").val();
	cargo3=$("#cargo_ref3").val();
	antigu3=$("#anti_ref3").val();
	fechac1=$("#fingresoc1").val();
	fechac2=$("#fretiroc3").val();
	//archivos
	/*var cantp=$("#cont_papel").val();
	if(cantp>0){
			var u;
	 		for(u=1; u<=cantp; u++){
	 			//var sw=$("#sk"+u).val();
			if(typeof $("#sk"+u).val() !== 'undefined'){
				var tipohv_docu=$("#tipohoja"+u+"").val();
				var ruta=$("#ruta"+u+"").val();
				var namearchivo=$("#namearchivo"+u+"").val();
				var clase=$("#clase"+u+"").val();
				var documento=$("#documento"+u+"").val();
				//data.append("Papel", $("#papeles").is(':checked'));
				data.append("Papel", $("#valor_documento").val());
	 			var papeles = document.getElementById('documento'+u+'').files;
	 			for (var a = 0; a < papeles.length; a++) {
					data.append("papeles" + a, papeles[a]);

				}
				}
 			}
	}*/

	var datos_prefiltro='placa='+placa+'&satelital='+satelital+'&trailer='+trailer+'&user='+user+'&clave='+clave+
	'&propi='+propi+'&docpropi='+docu_propi+'&tene='+tene+'&doctene='+docu_tene+'&condu='+conductor+
	'&doccondu='+docu_condu+'&capacidad='+capacidad+
	'&ref1='+refe1+'&contacto='+contacto+'&celular='+celular+
	'&cargo='+cargo+'&antigu='+antigu+'&fecha1='+fecha1+'&fecha2='+fecha2+
	'&refe2='+refe2+'&contacto2='+contacto2+'&celular2='+celular2+'&cargo2='+cargo2+'&antiguedad2='+antigu2+'&fechab1='+fechab1+'&fechab2='+fechab2+
	'&refe3='+refe3+'&contacto3='+contacto3+'&celular3='+celular3+'&cargo3='+cargo3+'&antiguedad3='+antigu3+
	'&fechac1='+fechac1+'&fechac2='+fechac2;

	$.post($("#id_url_ajax").val()+'prefiltro_operacion/Registro_Prefiltro',datos_prefiltro,function(data){
		if(data.status==true){
			mensaje="Datos Registrados Exitosamente NEXOSAPP";
			$(".nexos-messages").append('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> '+mensaje+'</div></div>');
			$(".panel-body").animate({ scrollTop: 0 }, 900,'swing');
			setTimeout(function () { location.reload(false); }, 800);
		}else if(data.status==false){
			mensaje="Datos No Registrados NEXOSAPP";
			$(".nexos-messages").append('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="check" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> '+mensaje+'</div></div>');
			$(".panel-body").animate({ scrollTop: 0 }, 900,'swing');
			setTimeout(function () { location.reload(false); }, 800);
		}
	},'json');
}