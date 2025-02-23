<?php

// $ssn_cliente = $_SESSION["usuario"]["nombre_cliente"];
// $ssn_id_cliente = $_SESSION["usuario"]["id_cliente"];

date_default_timezone_set('America/Bogota');

$vista = '
		<!DOCTYPE html>
		<html lang="es">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
				<meta http-equiv="X-UA-Compatible" content="IE=edge">
				<meta name="description" content="">
				<meta name="author" content="">
				<link rel="shortcut icon" href="%root_file%img/logo-fav.png">

				<link rel="stylesheet" type="text/css" href="%root_file%lib/perfect-scrollbar/css/perfect-scrollbar.min.css"/>
				<link rel="stylesheet" type="text/css" href="%root_file%lib/material-design-icons/css/material-design-iconic-font.min.css"/>
				
				<!--[if lt IE 9]>
				<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
				<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
				<![endif]-->
				<link  rel="stylesheet" type="text/css" href="%root_file%lib/select2/css/select2.min.css"/>
				<link rel="stylesheet" type="text/css" href="%root_file%lib/datatables/css/dataTables.bootstrap.min.css"/>
				<link rel="stylesheet" href="%root_file%css/style.css" type="text/css"/>
        <!--<link rel="stylesheet" href="%root_file%css/estilos.css" type="text/css"/>-->
				<!--<link href="https://cdn.jsdelivr.net/timepicker.js/latest/timepicker.min.css" rel="stylesheet"/>-->
				<!-- ESTILOS DE VALIDACIONES -->
				<link rel="stylesheet" href="%root_file%css/validaciones.css" type="text/css"/>
				<link rel="stylesheet" href="%root_file%css/jquery-ui-1.10.4.custom.min.css" type="text/css"/>

				<!-- ESTILOS DEL TOOLTIP -->
				<link rel="stylesheet" href="%root_file%css/hint.min.css" type="text/css"/>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
				<link rel="stylesheet" href="%root_file%css/timepicker.min.css" type="text/css"/>
				<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
				<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
        <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
				<!-- JS DEL GIF DE CARGA DE LA PÁGINA -->
				<style>
					.no-js #loader { display: none; }
					.js #loader { display: block; position: absolute; left: 100px; top: 0; }
					.se-pre-con {
						position: fixed;
						left: 0px;
						top: 0px;
						width: 100%;
						height: 100%;
						z-index: 9999;
						background-color:white;
						opacity:0.60;
						color:white;
						text-align:center;
						padding-top:350px;
						font-size:36px;

					}
          .fond {
						background-image:url("' . BASE_URL . 'views/layout/assets/img/logis.jpg");
						background-repeat: no-repeat;
						background-size:100% 100%;
					}
          .opa   {
						background-color:rgb(255,255,255,0.5);
						opacity:0.5;
						width: 500px;
						height:165px;
						padding: 20px;
						margin-left:380px;
						margin-top:170px;
						text-align:center;
						color:#0A0A2A;
						font-size:14pt;
						font-family:Times New Roman;
						border-radius:10px;
						font-weight:bold;
					 }
					 .logtx {
						background-image: url("' . BASE_URL . 'views/layout/assets/img/logtext.png");
						background-repeat: no-repeat;
				 }
				  .avab {
					background-image: url("' . BASE_URL . 'views/layout/assets/img/btn.png");
					 background-repeat: no-repeat;
					 background-size: 100% 100%;
				 }
				 .fonlog {
					background-image: url ("../img/logis3.jpg");
					}
					a.cajas:hover {
						background-color:white;
						opacity:0.4;
						color:white;
						transition: 0.5s;
					}
					.miestilo {
						/*background-image: url("' . BASE_URL . 'views/layout/assets/img/camion-duplicado.webp");*/
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center center;
					}
					/*Cards*/
					.container-card {
						width: 100%;
						/*display: flex;*/
						max-width: 1100px;
						margin: auto;
					}
					.title-cards {
						width: 100%;
						max-width: 1080px;
						margin: auto;
						padding: 1px;
						text-align: center;
						color: #FFFFFF;
					}
					.card {
						margin: 10px;
						border-radius: 6px;
						overflow: hidden;
						background: #fff;
						box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.2);
						transition: all 400ms ease-out;
						cursor: default;
					}
					.menus {
						width: 100%;
						height: 100px;
						border: 1px solid #ccc;
						padding: 10px;
					}
					.menus:hover {
						box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.4);
						transform: translateY(-3%);
					}
					.card img {
						width: 100%;
						height: 210px;
					}

					.card .contenido-card {
						padding: auto;
						margin: 10px;
						text-align: center;
					}

					.card .contenido-card h3 {
						margin-bottom: 15px;
						color: #7a7a7a;
					}

					.card .contenido-card p {
						line-height: 1.8;
						color: #6a6a6a;
						font-size: 14px;
						margin-bottom: 5px;
					}

					@media only screen and (min-width:320px) and (max-width:768px) {
						.container-card {
							flex-wrap: wrap;
						}

						.card {
							margin: 15px;
						}
					}

					.logo-menu {
						background-size: cover;
						width: 100px;
					}

					.fila h3 {
						align-items: center;
						margin-left: 220px;
					}

					.titles-navbars h3 {
						font-weight: 900;
					}
					@media(max-width: 768px) {
						.fila h3 {
							font-size: 15px;
							text-align: center;
							margin: 7px;
							margin-right: -50px;
						}

						.logo-menu {
							display: block;
							margin-left: -25px;
						}

						.contenedor {
							margin-top: 120px;
							height: 110vh;
						}
					}
					.foto-perfil {
						border-radius: 50%;
						width: 30px;
					}

					.contenedor {
						display: flex;
						justify-content: center;
						align-items: center;
						height: 100vh;
					}

					.links {
						text-decoration: none;
						color: #fff;
					}

					.links:hover {
						text-decoration: none;
						color: yellow;
					}
					h3 {
						/*  font-size: 2.5rem;
						color: #ffffff; */
						font-size: 2.5rem;
						color: #321c3b;
					}
					dialog {
						max-width: 850px;
						padding: 30px 60px;
						border: none;
						/* border: 8px solid #321c3b; */
						/* background-color: #fafafa; */
						background-color: rgba(255, 255, 255, 0.568);
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}

					dialog::backdrop {
						/* background: rgba(234, 206, 227, 0.9); */
					}

					dialog p {
						color: #321c3b;
					}

					dialog button {
						box-shadow: 0px 0px 0 #321c3b;
					}

					dialog button:hover {
						box-shadow: 8px 8px 0 #321c3b;
					}

					.select-container {
						display: flex;
						align-items: center;
					}

					select {
						margin-right: 10px;
					}
					.seguimientos {
						background-color:#9FA6B2 !important;
						color:#FFFFFF !important;
						margin: 0 1px;
						font-size:15px;
					}
					#myDiv {
						transition: opacity 0.5s ease;
					}
					.paneles{
						background-color:#9FA6B2 !important;
            color:#FFFFFF !important;
            margin: 0.1px 1px;
            font-size:15px;
						padding: 1px 1px 1px;
					}

					#loading-overlay {
						display: none;
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.5);
						justify-content: center;
						align-items: center;
						z-index: 9999;
					}

					#loading-overlay-nexosapp {
						display: none;
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.8);
						justify-content: center;
						align-items: center;
						z-index: 9999;
					}

					#loading-overlay-oet {
						display: none;
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.8);
						justify-content: center;
						align-items: center;
						z-index: 9999;
					}

					#loading-overlay-rndc {
						display: none;
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.8);
						justify-content: center;
						align-items: center;
						z-index: 9999;
					}

					#loading-overlay-mensaje_carga {
						display: none;
						position: fixed;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						background-color: rgba(0, 0, 0, 0.8);
						justify-content: center;
						align-items: center;
						z-index: 9999;
					}

					#loading-spinner {
						border: 4px solid rgba(255, 255, 255, 0.3);
						border-top: 4px solid #ffffff;
						border-radius: 50%;
						width: 50px;
						height: 50px;
						animation: spin 1s linear infinite;
					}

					@keyframes spin {
						0% {
							transform: rotate(0deg);
						}

						100% {
							transform: rotate(360deg);
						}
					}

					.tree {
            list-style-type: none;
        	}
				input[type="time"] {
					padding: 0.5em;
					border: 1px solid #ccc;
					border-radius: 4px;
					box-sizing: border-box;
					}

				/* Estilo específico para Firefox */
				@supports (-moz-appearance: meterbar) {
					input[type="time"] {
						/* Estilo adicional para Firefox */
					}
					}

				/* Estilo específico para Chrome y Safari */
				@supports (-webkit-appearance: none) {
					input[type="time"]::-webkit-calendar-picker-indicator {
						background: transparent;
						display: none;
					}

					input[type="time"]::-webkit-inner-spin-button,
					input[type="time"]::-webkit-clear-button,
					input[type="time"]::-webkit-outer-spin-button {
						-webkit-appearance: none;
						margin: 0;
					}
				}

				#modal1 {
					position: fixed;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					background-color: white;
					padding: 50px;
					border: none;
					border-radius: 10px;
					text-align: center;
				}

				.select2-container--default .select2-selection--single .select2-selection__rendered {
					padding: 0 15px;
					height: 20px;
					line-height: 25px;
					font-size: 14px;
					color: #404040;
			}

			.swal2-custom-font {
					font-size: 17px; /* Ajusta el tamaño según tus necesidades */
				}

			@keyframes slideIn {
					from {
						opacity: 0;
						transform: translateY(30px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
    		}

				.table-animated {
					animation: slideIn 0.5s ease-out;
				}
				.hidden {
					display: none;
				}

				.visible {
					display: table;
				}
					.custom-search{
					padding-left: 25px !important
					}
				</style>

				<script src="https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/shim.min.js"></script>
				<script src="https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.mini.min.js"></script>
				<!--<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js"></script>-->
			
				<script src="%root_file%lib/jquery/jquery.min.js" type="text/javascript"></script>
				<script src="%root_file%js/push.min.js" type="text/javascript"></script>
				<script src="%root_file%js/push.min.js" type="text/javascript"></script>
				<script>
					$(window).load(function() {
						$(".se-pre-con").fadeOut("slow");
					});
				</script>
				<title>%titulo%</title>
			</head>
		<body>

			<div id="loading-overlay">
				<img src="http://localhost/mvcLuisMiguel/public/img/nexos_loading.gif" height="100" width="100">
				<br>
				<br>
				<br>
				<h1 style="color:#FFF;" >Procesando...</h1>
			</div>

			<div class="container-fluid" style="height: 100%;">
				<div class="row" style="height: 100%;">
					<div class="se-pre-con mt-0">
					<div style="text-align: center;" id="loading">
						<img src="http://localhost/mvcLuisMiguel/public/img/nexos_loading.gif" height="100" width="100">
						<h1 style="color:#000;" >Cargando...</h1>
					</div>
			</div>
		';

/***** SE CREA MENU PRINCIPAL *****/
//session_start();
$host = $_SERVER["HTTP_HOST"];
$url = $_SERVER["REQUEST_URI"];
// Se valida si el usuario está logueado
if (isset($_SESSION['usuario']) == true) {
	$vista .= '<input type="hidden" id="id_url_ajax" value="' . BASE_URL . '">';
	$_url_preticion = $host . $url;
	// Se valida el acceso a la pagina es correcta
	if (BASE_URL == ("http://" . $_url_preticion)) {
		header('location:' . BASE_URL . 'index/lanzador');
	}

	$menu = '';
	// Se valida si no es el lanzador, para mostrar el menú del usuario y el encabezado
	$_lanzador = BASE_URL . "index/lanzador";
	if ($_lanzador != "http://" . $_url_preticion) {
		$url_ajax = BASE_URL . 'libs/myajax.php';
		$vista .= '
		<!--<script src="%root_file%lib/jquery/jquery.min.js" type="text/javascript"></script>
		<script src="%root_file%js/push.min.js" type="text/javascript"></script>-->
				<script>
					var id_perfil = ' . $_SESSION["usuario"]["id_perfil"] . ';
					$(document).ready(function() {
						// campananotificaciones();
						if(id_perfil == 1 || id_perfil == 10 || id_perfil == 12 || id_perfil == 13 || id_perfil == 21){
							//seguimiento_ruta_retrazo();
						}
					});

				    var urlajax = "' . $url_ajax . '";
				    setInterval(function(){
				        // campananotificaciones();
						if(id_perfil == 1 || id_perfil == 10 || id_perfil == 12 || id_perfil == 13 || id_perfil == 21){
							//seguimiento_ruta_retrazo();
						}
				        /*$.ajax({
				            type:       "POST", //TIPO DE PETICION PUEDE SER GET
				            dataType:   "json", //EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
				            url:        urlajax, //DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
				            data:{      Op:"notif",
				                        user_log:"' . $_SESSION['usuario']['id_usuario'] . '"
				            }, //DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
				            beforeSend: function(){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
				            },
				            success: function(response){//ACCION QUE SUCEDE DESPUES DE REALIZAR CORRECTAMENTE LA PETCION EL CUAL NOS TRAE UNA RESPUESTA
				                if (response.respuesta == "GOOD"){
				                	var nomcli=$("#nomcli").val();

				                    var cuerpo = "La actividad " + response.contenido[0][0] + " del número de orden "
				                    + response.contenido[0][1] + " se vence en " + minutesToString(response.contenido[0][2]) + ".";
				                    if (response.contenido[0][2] < 0){
				                        cuerpo = "La actividad " + response.contenido[0][0] + " del número de orden "
				                        + response.contenido[0][1] + " esta retrasada por " + minutesToString(response.contenido[0][2] * ( - 1)) + "."
				                    }
				                    Push.create("' . mb_convert_encoding($_SESSION['usuario']['nom_usuario'], 'UTF-8', 'ISO-8859-1') . '", {
										onClick:function (){
											url_orden = "' . BASE_URL . 'importacion/ver_actividades/" + response.contenido[0][1];
											window.location = url_orden;
											this.close();
										},
										body: cuerpo,
										timeout:20000,
										icon:"%root_file%img/logo.png" ,
									});
								}
				            },
				            error: function(){//SI OCURRE UN ERROR
				            }
				        });*/

						if( id_perfil == 7 ){
							// Se busca si existen tarifas de conductores pendientes por verificar
							var params = {
								accion 		: "buscarValidacionTarifa",
							}
							// console.log( params )
							$.ajax({
								type		: "POST",
								url			: $("#id_url_ajax").val() +  "libs/asignaciones_ajax.php",
								cache		: false,
								data		: params,
								dataType 	: "json",
								error 		: function(data){
									console.log(data);
								},
								success		: function(data) {
									// console.log(data);
									if( data.content ){
										var msg_content = "En ese momento hay " + data.content.length + " tarifa de conductor por verificar.";
										if( data.content.length > 1 ){
											var msg_content = "En ese momento hay " + data.content.length + " tarifas de conductores por verificar.";
										}
										Push.create("Hay fletes por verificar.", {
											onClick: function (){
												var url_orden = "' . BASE_URL . 'solicitudes/control_asignaciones/";
												window.location = url_orden;
												this.close();
											},
											body: msg_content,
											timeout:20000,
											icon:"%root_file%img/logo.png",
										});
									}
								}
							});
						}
					}, 60000);

				    /*function campananotificaciones (){
						var contenido = "";
						$.ajaxSetup({async: false});
						$.ajax({
							type:		"POST", //TIPO DE PETICION PUEDE SER GET
							dataType:	"json", //EL TIPO DE DATO QUE DEVUELVE PUEDE SER JSON/TEXT/HTML/XML
							url:		urlajax, //DIRECCION DONDE SE ENCUENTRA LA OPERACION A REALIZAR
							data:		{
											Op:"campana",
											user_log:"' . $_SESSION['usuario']['id_usuario'] . '"
										}, //DATOS ENVIADOS PUEDE SER TEXT A TRAVEZ DE LA URL O PUEDE SER UN OBJETO
							beforeSend: function(){//ACCION QUE SUCEDE ANTES DE HACER EL SUBMIT
							},
							success: function(response){//ACCION QUE SUCEDE DESPUES DE REALIZAR CORRECTAMENTE LA PETCION EL CUAL NOS TRAE UNA RESPUESTA
								// console.log(response);
								if (response.respuesta == "GOOD"){
									//document.getElementById("player").play();
									var contenido = ""; var content = "";
									$("#num_actividades").html(response.contenido.length);
									for (i = 0; i < response.contenido.length; i++){
										if (response.contenido[i][2] < 0){
											content += \'<li class="notification "><a href="' . BASE_URL . 'importacion/ver_actividades/\'+response.contenido[i][1]+\'" >\'+\' <div class="notification-info" style="padding-left:0px;"><div class="text"><span class="user-name">Tienes la <b>\'+response.contenido[i][0]+\'</b> pendiente de la orden número </span><b> \'+response.contenido[i][1]+\' (\'+response.contenido[i][3]+\')</b></div><span class="date">Tiempo de retraso: \'+minutesToString(response.contenido[i][2]*(-1))+\'.</span></div></a></li>\';
										}
										else{
											content += \'<li class="notification "><a href="' . BASE_URL . 'importacion/ver_actividades/\'+response.contenido[i][1]+\'" >\'+\' <div class="notification-info" style="padding-left:0px;"><div class="text"><span class="user-name">Tienes la <b>\'+response.contenido[i][0]+\'</b> pendiente de la orden número </span><b> \'+response.contenido[i][1]+\' (\'+response.contenido[i][3]+\')</b></div><span class="date">Tiempo de vencimiento: \'+minutesToString(response.contenido[i][2])+\'.</span></div></a></li>\';
										}
									}
									contenido = content;
									$("#bell_content").val(content);
									$("#pendientes").html(content);
								}
							},
							error: function(response){//SI OCURRE UN ERROR
								// console.log("se presenta error en consulta de campana");
							}
						});

						// Se verifica si existen fletes pendients por validar
						var id_perfil = ' . $_SESSION["usuario"]["id_perfil"] . ';
						if( id_perfil == 7 ){
							// Se busca si existen tarifas de conductores pendientes por verificar
							var params = {
								accion 		: "buscarValidacionTarifa",
							}
							// console.log( params )
							$.ajax({
								type		: "POST",
								url			: $("#id_url_ajax").val() +  "libs/asignaciones_ajax.php",
								cache		: false,
								data		: params,
								dataType 	: "json",
								error 		: function(data){
									console.log(data);
								},
								success		: function(data) {
									// console.log(data);
									var fletes_pendientes = "";
									if( data.content ){
										var msg_content = "En ese momento hay " + data.content.length + " tarifa de conductor por verificar.";
										if( data.content.length > 1 ){
											var msg_content = "En ese momento hay " + data.content.length + " tarifas de conductores por verificar.";
										}
										fletes_pendientes = \'<li class="notification "><a href="' . BASE_URL . 'solicitudes/control_asignaciones/" ><div class="notification-info" style="padding-left:0px;"><div class="text"><span class="user-name"><b>Hay fletes por verificar.</b></span><p><b>\' + msg_content + \'</b></p></div></div></a></li>\';
									}
									var bell_content = $("#bell_content").val() + fletes_pendientes;
									$("#pendientes").html("" + bell_content);
								}
							});
						}
						$.ajaxSetup({async: true});
				    }*/

					/*function seguimiento_ruta_retrazo(){
						$.ajax({
							url: $("#id_url_ajax").val() + "libs/gestion_seguridad.php?action=verificar_seguimientos",
							type: "POST",
							cache: false,
							dataType: "json",
							error: function (jqXHR, textStatus, errorThrown){
								console.log(jqXHR);
								console.log(textStatus);
								console.log(errorThrown);
							},
							success: function (data, textStatus, jqXHR){
								// console.log(data);
								if(data.cuantos > 0){
									$("#seguimeintos_ruta_content").fadeIn("fast");
									$("#num_seguimnientos").html(data.cuantos);
									$("#seguimientos_pendientes").html(data.content);
								} else {
									$("#seguimientos_pendientes").empty();
									$("#num_seguimnientos").html("0");
									$("#seguimeintos_ruta_content").fadeOut("fast");
								}
							}
						});
					}*/
				</script>
			';

		$_btn_seguimiento_ruta = '';
		if ($_SESSION["usuario"]["id_perfil"] == 1 or $_SESSION["usuario"]["id_perfil"] == 10 or $_SESSION["usuario"]["id_perfil"] == 12 or $_SESSION["usuario"]["id_perfil"] == 13 or $_SESSION["usuario"]["id_perfil"] == 21) {
			$_btn_seguimiento_ruta = '
					<li class="dropdown"  id="seguimeintos_ruta_content">
						<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle">
							<span class="icon mdi mdi-truck"></span>
							<span class="indicator"></span>
						</a>
						<ul class="dropdown-menu be-notifications">
							<li>
								<div class="title">Vehículos sin seguimiento<span class="badge" id="num_seguimnientos">0</span></div>
								<div class="list">
									<div class="be-scroller">
										<div class="content">
											<ul id="seguimientos_pendientes"></ul>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</li>
				';
		}

		$vista .= '
				<!--<audio id="player"> <source src= "' . BASE_URL . 'layout/assets/sounds/sound_notifications.ogg" ></audio>-->
				<input type="hidden" id="max_file_size" value="' . MAX_FILE_SIZE_JS . '">
				<input type="hidden" id="bell_content" >
				<div class="be-wrapper be-fixed-sidebar">

					<nav class="navbar navbar-default navbar-fixed-top be-top-header">
						<div class="container-fluid">
							<div class="navbar-header"><a href="%land_page%" class="navbar-brand"></a></div>
							<div class="be-right-navbar">
								<ul class="nav navbar-nav navbar-right be-user-nav">
									<li class="dropdown">
										<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle">
											<img src="%root_file%img/' . $_SESSION['usuario']['avatar'] . '" alt="Avatar">
											<span class="user-name">' . '</span>
										</a>
										<ul role="menu" class="dropdown-menu">
											<li>
												<div class="user-info">
													<div class="user-name">' . $_SESSION['usuario']['nom_usuario'] . '</div>
													<div class="online">' . $_SESSION['usuario']['nombre_perfil'] . '</div>
													<div class="online">' . $_SESSION['usuario']['nombre_cliente'] . '</div>
												</div>
											</li>
											<li><a href="' . BASE_URL . 'index/micuenta"><span class="icon mdi mdi-face"></span> Mi cuenta</a></li>
											<li><a href="' . BASE_URL . '/libs/cerrar.php" ><span class="icon mdi mdi-power"></span> Cerrar Sesión</a></li>
										</ul>
									</li>
								</ul>
								<div class="page-title d-flex justify-content-center"><h4 style="font-weight:900;" >%titulo_modulo% ' . $this->titulo . '</h4></div>
								<ul class="nav navbar-nav navbar-right be-icons-nav">
									' . $_btn_seguimiento_ruta . '
									<li class="dropdown">
										<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle">
											<span class="icon mdi mdi-notifications"></span>
											<span class="indicator"></span>
										</a>
										<ul class="dropdown-menu be-notifications">
											<li>
												<div class="title">Actividades pendientes<span class="badge" id="num_actividades">0</span></div>
												<div class="list">
													<div class="be-scroller">
														<div class="content">
															<ul id="pendientes"></ul>
														</div>
													</div>
												</div>
											</li>
										</ul>
									</li>
								</ul>
			';

		if (BASE_URL == "http://dow.nexosapp.com/" || BASE_URL == "http://www.dow.nexosapp.com/") {
			$vista .= '
										<ul class="nav navbar-nav navbar-right  be-user-nav">
											<li>
												<a href="#" ><img src="%root_file%img/dow.png" style="width:100px;" ></a>
											</li>
										</ul>
									';
		} else if (BASE_URL == "http://agralba.nexosapp.com/" || BASE_URL == "http://www.agralba.nexosapp.com/") {
			$vista .= '
										<ul class="nav navbar-nav navbar-right  be-user-nav">
											<li>
												<a href="#" ><img src="%root_file%img/agralba.png" style="width:100px;" ></a>
											</li>
										</ul>
									';
		}

		$vista .= '
						</div>
					</div>
				</nav>
				<div class="be-left-sidebar">
					<div class="left-sidebar-wrapper"><a href="#" class="left-sidebar-toggle">Dashboard</a>
						<div class="left-sidebar-spacer">
							<div class="left-sidebar-scroll">
								<div class="left-sidebar-content">%left_menu%</div>
							</div>
						</div>
					</div>
				</div>
				<div class="be-content">
				<div class="main-content container-fluid">
			';

		$menu = '
		        <!-- inicio del contenido  -->
		        <ul class="sidebar-elements">
		        	<li class="divider">Menu</li>
		        	<li>
		        		<a href="%land_page%">
		        			<i class="icon mdi mdi-home"></i>
		        			<span>Dashboard</span>
		        		</a>
		          </li>
			';

		if (isset($_layoutParams['menu'])) {
			$_get = new Request();

			foreach ($_layoutParams['menu'] as $key => $value) {
				$_activo = "";
				switch ($key) {
					case 'Comercio Exterior':
						$_icono = "mdi-truck";
						break;

					case 'Comercial':
						$_icono = "mdi-layers";
						break;

					case 'Clientes':
						$_icono = "mdi-case";
						break;

					case 'Materiales – Nexos':
						$_icono = "mdi-shape";
						break;

					case 'Materiales – Clientes':
						$_icono = "mdi-shape";
						break;

					case 'Usuarios':
						$_icono = "mdi-accounts";
						break;

					case 'Parámetros':
						$_icono = "mdi-settings";
						break;

					case 'Rutas':
						$_icono = "mdi-google-maps";
						break;

					case 'Bodegas':
						$_icono = "mdi-storage";
						break;

					case 'Importaciones':
						$_icono = "mdi-boat";
						break;

					default:
						$_icono = "mdi-layers";
						break;
				}

				$menu .= '<li class="' . $_activo . 'parent"><a href="#"><i class="icon mdi ' . $_icono . '"></i><span>' . $key . '</span></a><ul class="sub-menu">';

				//$_SESSION=0;

				//SECCION PARA TOMAR LOS PARAMETROS DE URL DE MENU Y SUBMENU

				// $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

				// // Extraer la parte de la consulta (query)
				// $query_string = parse_url($url, PHP_URL_QUERY);

				// // Reemplazar "/?" por "&" para corregir el formato
				// $query_string = str_replace('/?', '&', $query_string);

				// // Parsear los parámetros
				// parse_str($query_string, $query_params);

				// // Obtener los valores de idmenu y submenu
				// $idmenu_encrypted = $query_params['idmenu'] ?? null;
				// $submenu_encrypted = $query_params['submenu'] ?? null;

				// // Descifrar los valores
				// $idmenu = decrypt($idmenu_encrypted);
				// $submenu = decrypt($submenu_encrypted);
				// $tmpIdmenu =  $idmenu;


				foreach ($value as $key1 => $value1) {
					if ($_get->getControlador() == $value1["id"] and $_get->getMetodo() == $value1["metodo"]) {
						$_activo = 'class="active"';
					}
					/***** SE HACE FILTO PARA CASOS ESPECIALES *****/

					/*** Casos del modulo de proyectos ***/
					elseif ($_get->getControlador() == "proyecto" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "ver") {
						$_activo = 'class="active"';
					} elseif ($_get->getControlador() == "proyecto" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "detalle") {
						$_activo = 'class="active"';
					} elseif ($_get->getControlador() == "proyecto" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "proyectos_" and $_get->getMetodo() == "proyectos_") {
						$_activo = 'class="active"';
					} elseif ($_get->getControlador() == "proyecto" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "proyectos_" and $_get->getMetodo() == "cargas_") {
						$_activo = 'class="active"';
					}

					/*** Casos del modulo de clientes ***/
					elseif ($_get->getControlador() == "clientes" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "socios") {
						$_activo = 'class="active"';
					} elseif ($_get->getControlador() == "clientes" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "contactos") {
						$_activo = 'class="active"';
					} elseif ($_get->getControlador() == "clientes" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "verificacion_socio") {
						$_activo = 'class="active"';
					} elseif ($_get->getControlador() == "clientes" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "verificacion_cliente") {
						$_activo = 'class="active"';
					} elseif ($_get->getControlador() == "clientes" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "editar") {
						$_activo = 'class="active"';
					}

					/*** Casos del modulo de plantillas ***/
					elseif ($_get->getControlador() == "plantillas" and $_get->getControlador() == $value1["id"] and $value1["metodo"] == "index" and $_get->getMetodo() == "actividades") {
						$_activo = 'class="active"';
					}
					$tmpIdmenu = $_GET['idmenu'];
					/*** Se dibuja el menu en pantalla ***/
					$menu .= '<li ' . $_activo . '><a href="' . $value1["enlace"] . '/' . $value1["metodo"] . '/?idmenu=' . $tmpIdmenu . '">' . $value1["titulo"] . '</a></li>';
					$_activo = "";
				}

				$menu .= '</ul></li>';
			}
			$menu .= '</ul>';
		}
	} else {
		$vista .= '
		<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid" style="background-color:#ffffff; border:none;">
			<!-- Logo y título -->
			<div class="navbar-header fila">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
					data-target="#navbar-collapse-1" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<div class="container-fluid">
					<div class="row">
						<div class="col-xs-2 col-sm-2 col-md-2 col-lg-2">
							<a class="navbar-brand" href="#">
								<!--<img alt="Brand" src="%root_file%img\logo-xx.png" class="logo-menu">-->
								<img alt="Brand" src="%root_file%img\rb_45865.png" class="logo-menu">
							</a>
						</div>
						<div class="col-xs-10 col-sm-10 col-md-10 col-lg-10 titles-navbars">
							<h3 class="text-center">CATALOGO DE SERVICIOS</h3>
						</div>
					</div>
				</div>
			</div>

			<!-- Sección de perfil -->
			<div class="navbar-collapse collapse perfil" id="navbar-collapse-1">
				<ul class="nav navbar-nav navbar-right be-user-nav">
					<li class="dropdown">
						<a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="dropdown-toggle">
							<img src="%root_file%img/' . $_SESSION['usuario']['avatar'] . '" alt="Avatar">
							<span class="user-name">' . '</span>
						</a>
						<ul role="menu" class="dropdown-menu">
							<li>
								<div class="user-info">
									<div class="user-name">' . $_SESSION['usuario']['nom_usuario'] . '</div>
									<div class="online">' . $_SESSION['usuario']['nombre_perfil'] . '</div>
									<div class="online">' . $_SESSION['usuario']['nombre_cliente'] . '</div>
								</div>
							</li>
							<li><a href="' . BASE_URL . 'index/micuenta"><span class="icon mdi mdi-face"></span> Mi cuenta</a>
							</li>
							<li><a href="' . BASE_URL . '/libs/cerrar.php"><span class="icon mdi mdi-power"></span> Cerrar
									Sesión</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	</nav>';
	}
} else {
	$menu = "";
	if (BASE_URL != ("http://" . $host . $url)) {
		if (empty($_REQUEST['k'])) {
			header('location:' . BASE_URL);
		}
	}
}
// && (explode($_REQUEST['k'],("http://".$host.$url))[0]!= BASE_URL."index/reset")
/**** FIN CREACION MENU PRINCIPAL ****/

// Se establecen los parametros de vista para el módulo
$vista = str_replace("%left_menu%", $menu, $vista);
$vista = str_replace("%root_file%", $_layoutParams["ruta_layout"], $vista);
$vista = str_replace("%titulo%", APP_COMPANY . " " . APP_SLOGAN . " - " . APP_NAME, $vista);
$vista = str_replace("%titulo_modulo%", APP_NAME, $vista);
$vista = str_replace("%land_page%", BASE_URL, $vista);

echo $vista;
