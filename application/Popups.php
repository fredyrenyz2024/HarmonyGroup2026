<?php

/**
 * 
 */
class Popup
{
	public function _nifty_modal_colored_warning($id, $title, $content)
	{
		$_popup = '
				<!-- Nifty div id="colored-warning" Modal-->
				<div id="%id%" role="dialog" class="modal-container colored-header colored-header-warning modal-effect-12">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" data-dismiss="modal" aria-hidden="true" class="close modal-close"><span class="mdi mdi-close"></span></button>
							<h3 class="modal-title">%title%</h3>
						</div>
						<div class="modal-body">
							%content%
						</div>
						<div class="modal-footer">
							<button type="button" data-dismiss="modal" class="btn btn-default modal-close">Cerrar</button>
						</div>
					</div>
				</div>
			';

		$_popup = str_replace("%id%", $id, $_popup);
		$_popup = str_replace("%title%", $title, $_popup);
		$_popup = str_replace("%content%", $content, $_popup);

		return $_popup;
	}

	public function _bootstrap_modal_dialog($id, $title, $content)
	{
		$_popup = '
				<!-- Bootstrap div id="md-colored" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
								<h3 class="modal-title">%title%</h3>
							</div>
							<div class="modal-body">
								%content%
							</div>
							<div class="modal-footer">
								<button type="button" data-dismiss="modal" class="btn btn-default">Cerrar</button>
							</div>
						</div>
					</div>
				</div>
			';

		$_popup = str_replace("%id%", $id, $_popup);
		$_popup = str_replace("%title%", $title, $_popup);
		$_popup = str_replace("%content%", $content, $_popup);

		return $_popup;
	}

	public function _bootstrap_modal_dialog_btn($id, $title, $content)
	{
		$_popup = '
				<!-- Bootstrap div id="md-colored" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
								<h3 class="modal-title">%title%</h3>
							</div>
							<div class="modal-body">
								%content%
							</div>
							<div class="modal-footer">
								<button type="button" data-dismiss="modal" class="btn btn-success" id="btn_form_btn_' . $id . '">Guardar</button>
								<button type="button" data-dismiss="modal" class="btn btn-default">Cerrar</button>
							</div>
						</div>
					</div>
				</div>
			';

		$_popup = str_replace("%id%", $id, $_popup);
		$_popup = str_replace("%title%", $title, $_popup);
		$_popup = str_replace("%content%", $content, $_popup);

		return $_popup;
	}

	public function _alert_modal_mod_danger($id, $content, $table)
	{
		$idPopup = "elimina_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<!-- Nifty div id="mod-danger" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-danger"><span class="modal-main-icon mdi mdi-close-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="estado" value="0">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-danger">Eliminar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);


		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de inactivar");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion inactivar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion inactivar : id - ' . $id . '");
											console.log("entro en funcion inactivar : tabla - ' . $table . '");
											console.log("entro en funcion inactivar : bd tabla - ' . $dbTable . '");
											console.log("entro en funcion inactivar : url - ' . $url . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha inactivado el registro con éxito.</div></div>\');
										$("#table1").hide();
										setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});

				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _alert_modal_mod_multiple_danger($name, $id, $content, $table)
	{
		$idPopup = "elimina_" . $name;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<!-- Nifty div id="mod-danger" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-danger"><span class="modal-main-icon mdi mdi-close-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="estado" value="0">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-danger">Eliminar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);


		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de inactivar");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion inactivar ajax...");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha inactivado el registro con éxito.</div></div>\');
										setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	// Pasar a estado 1  
	public function _alert_modal_mod_success($id, $content, $table)
	{
		$idPopup = "habilita_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<!-- Nifty div id="mod-success" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-success"><span class="modal-main-icon mdi mdi-check-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="estado" value="1">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-success">Aceptar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);


		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de habilitar");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion habilitar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion habilitar : id - ' . $id . '");
											console.log("entro en funcion habilitar : tabla - ' . $table . '");
											console.log("entro en funcion habilitar : bd tabla - ' . $dbTable . '");
											console.log("entro en funcion habilitar : url - ' . $url . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha habilitado el registro con éxito.</div></div>\');
										setTimeout(function() { location.reload(false);  }, 600);
							}
						});

					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	// Pasar a estado 2  
	public function _alert_modal_mod_warning($id, $content, $table)
	{
		$idPopup = "habilita_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<!-- Nifty div id="mod-success" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-success"><span class="modal-main-icon mdi mdi-check-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="estado" value="2">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-success">Aceptar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);


		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de habilitar");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion habilitar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion habilitar : id - ' . $id . '");
											console.log("entro en funcion habilitar : tabla - ' . $table . '");
											console.log("entro en funcion habilitar : bd tabla - ' . $dbTable . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
											console.log("entro en funcion habilitar : url - ' . $url . '");
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha habilitado el registro con éxito.</div></div>\');
										setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});

				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	// Pasar al estado definido en la programación 
	public function _alert_modal_mod_habilita($id, $content, $table, $estado)
	{
		$idPopup = "habilita_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<!-- Nifty div id="mod-success" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-success"><span class="modal-main-icon mdi mdi-check-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="estado" value="' . $estado . '">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-success">Aceptar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);


		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de habilitar");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion habilitar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion habilitar : id - ' . $id . '");
											console.log("entro en funcion habilitar : tabla - ' . $table . '");
											console.log("entro en funcion habilitar : bd tabla - ' . $dbTable . '");
											console.log("entro en funcion habilitar : url - ' . $url . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha habilitado el registro con éxito.</div></div>\');
										setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});

				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _form_modal_update($id, $title, $content, $table)
	{
		$idPopup = "edita_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									<div class="text-right">
										<span>(*) Campos Obligatorios</span>
									</div>
									<br>
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';

		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de actualizacion");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion actualizacion ajax...");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							error 		: function(data){
											console.log(data);
										},
							success		: function(data) {
											console.log(data);
											$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>\');
											$("#table1").hide();
											setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _form_modal_simple_insert($id, $title, $content, $table)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;

		$url = BASE_URL . 'libs/insertar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									<div class="text-right">
										<span>(*) Campos Obligatorios</span>
									</div>
									<br/>
									%content%
								</div>
								<div class="modal-footer" id="footer_boton">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';

		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log(%id%);
						$.ajaxSetup({async: false});
						console.log("Entro en funcion de insercion");
						var msg_error = "";
						var origen = $("#archivo").val();
						var flag_origen = false;
						if(origen){
							flag_origen = true;
							switch (origen){
								case "clientes/bodegas":
									console.log("Entro en clientes/bodegas");
									var form_content = $("#form_%id%").serialize();
									var arrayForm = form_content.split("&");
									for( var i=0; i < arrayForm.length; i++ ){
										var arrayData = arrayForm[i].split("=");
										switch ( arrayData[0] ){
											case "id_cliente":
												if (!arrayData[1]){
													msg_error+= "<p>Debe seleccionar un <strong>Cliente</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												break;

											case "tipo_documento":
												if (!arrayData[1]){
													msg_error+= "<p>Debe seleccionar un <strong>Tipo de documento</strong> para poder crear el Remitente/Destinatario.</p>";
												}else{
													var tipo_documento = arrayData[1];
												}
												break;

											case "documento":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Documento</strong> para poder crear el Remitente/Destinatario.</p>";
												}else{
													if($("#tipo_documento").val() == "Cedula de Ciudadania" || $("#tipo_documento").val() == "Cedula de Extranjeria"){
														if( !$("#primer_apellido").val() ){
															msg_error+= "<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder crear el Remitente/Destinatario.</p>";
														}
													}
													if($("#tipo_documento").val() == "NIT"){
														if(arrayData[1].length > 9 || arrayData[1].length < 9){
															msg_error+= "<p>El campo <strong>Número Documento</strong> debe tener 9 caracteres para poder crear el Remitente/Destinatario con Nit.</p>";
														}
													}
													if($("#tipo_documento").val() == "Cedula de Ciudadania"){
														if(arrayData[1].length < 6 || arrayData[1].length > 12){
															msg_error+= "<p>El campo <strong>Número Documento</strong> debe tener mínimo 8 caracteres & máximo 12 para poder crear el Remitente/Destinatario.</p>";
														}
													}
													if($("#tipo_documento").val() == "Cedula de Extranjeria"){
														if(arrayData[1].length != 6){
															msg_error+= "<p>El campo <strong>Número Documento</strong> debe tener 9 caracteres para poder crear el Remitente/Destinatario.</p>";
														}
													}
												}
												break;

											case "digito_verificacion":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Dígito de Verificación</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												break;

											case "rndc_nombre":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Nombre</strong> para poder crear el Remitente/Destinatario.</p>";
												}else{
													if($("#tipo_documento").val() == "Cedula de Ciudadania" || $("#tipo_documento").val() == "Cedula de Extranjeria"){
														if( !$("#primer_apellido").val() ){
															msg_error+= "<p>Debe diligenciar el campo <strong>Primer Apellido</strong> para poder crear el Remitente/Destinatario.</p>";
														}
															var suma_nom = $("#rndc_nombre").val().length;
															var suma_ape1 = $("#primer_apellido").val().length;
															var suma_ape2 = $("#segundo_apellido").val().length;
															var suma_total = (parseFloat(suma_nom) + parseFloat(suma_ape1) + parseFloat(suma_ape2));
														if(suma_total < 3 && suma_total > 50){
															msg_error+= "<p>La longitud de  <strong>Nombre y apellidos</strong> no puede ser mayor a  50  caracteres.</p>";
														}
													}else if($("#tipo_documento").val() == "NIT"){
														if(arrayData[1].length < 3 && arrayData[1].length > 50){
															msg_error+= "<p>La longitud del <strong>Nombre de la persona Jurídica</strong> no puede ser mayor a  50  caracteres.</p>";
														}
													}
												}
												break;

											case "sigla":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Sigla</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												break;

											case "contacto":
												if($("#tipo_documento").val() == "NIT" || $("#tipo_documento").val() == "Identificación Tributaria Internacional"){
													if (!arrayData[1]){
														msg_error+= "<p>Si el tipo de documento es NIT debe diligenciar el campo <strong>Teléfono Fijo</strong> para poder crear el Remitente/Destinatario.</p>";
													}
												}else if( !$("#contacto").val() && !$("#celular").val() ){
													msg_error+= "<p>Debe diligenciar el campo <strong>Teléfono Fijo</strong> o <strong>Celular Contacto</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												if( arrayData[1] && arrayData[1].length != 7 ){
													if( $("#slct_pais_").val() == "COLOMBIA" ){
														msg_error+= "<p>El campo <strong>Teléfono Fijo</strong> debe contener 7 digitos para que sea válido y poder crear el Remitente/Destinatario.</p>";
													}
												}
												break;

											case "celular":
												if( $("#slct_pais_").val() == "COLOMBIA"){
													if(!arrayData[1]){
														msg_error+= "<p>El ingresar campo <strong>Celular Contacto</strong> para poder crear el Remitente/Destinatario.</p>";
													}else{
														if( arrayData[1] && arrayData[1].length != 10 ){
															msg_error+= "<p>El campo <strong>Celular Contacto</strong> debe contener 10 digitos para que sea válido y poder crear el Remitente/Destinatario.</p>";
														}
													}
												}
												break;

											case "id_ciudad":
												if (!arrayData[1]){
													msg_error+= "<p>Debe seleccionar una <strong>Ciudad</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												break;

											case "ciudad":
												if (!$("#slct_municipio_").val()){
													msg_error+= "<p>Debe seleccionar una <strong>Ciudad</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												break;

											case "direccion":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Dirección</strong> para poder crear el Remitente/Destinatario.</p>";
												}else{
													if(arrayData[1].length > 50){
														msg_error+= "<p>El campo <strong>Dirección</strong> debe tener máximo 50 carácteres para poder crear el Remitente/Destinatario.</p>";
													}
												}
												break;

											case "latitud":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Latitud</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												break;

											case "longitud":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Longitud</strong> para poder crear el Remitente/Destinatario.</p>";
												}
												break;

											case "codigo_postal":
												if (arrayData[1] == 0 && arrayData[1]){
													msg_error+= "<p>La coordenadas no son correctas para la ubicación del Remitente/Destinatario.</p>";
												}
												break;

											case "rndc_id_municipio":
												if( $("#slct_pais_").val() == "COLOMBIA"){
													if (!$("#rndc_id_municipio").val()){
														msg_error+= "<p>Debe seleccionar una <strong>Ciudad</strong> para poder crear el Remitente/Destinatario.</p>";
													}
												}
												break;
											default:
												break;
										}
									}
									if( !msg_error && ($("#slct_pais_").val() == "COLOMBIA" || $("#tipo_documento").val() == "Identificación Tributaria Internacional") ){
										$(".nexos-messages").html("");
										console.log("Se puede crear el registro en el rndc");
										var rndc_id = "";
										$.ajax({
											url: "' . BASE_URL . 'libs/remitentes_ajax.php?action=rndcGuardaRemitente",
											type: \'POST\',
											data: form_content,
											cache: false,
											dataType: \'json\',
											beforeSend	: function(jqXHR, settings){
												console.log("Entro en el proceso de creación del remitente/destinatario");
												/*
												$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="\' + $("#id_url_ajax").val() + \'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
												*/
											},
											success: function (data, textStatus, jqXHR)
											{
												console.log(data);
												if (data.error){

													msg_error+= data.error.replace(/\n/g , "</p><p>");
														$(".nexos-messages").append(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>No se creo el registro con éxito RNDC msg_error  .</div></div>\');
												} else {

													rndc_id = data.crea_tercero_id_crea
													$(".nexos-messages").append(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong>Se ha creado el registro con éxito RNDC rndc_id.</div></div>\');
												}
											},
											error: function (jqXHR, textStatus, errorThrown)
											{
												console.log(jqXHR);
												console.log(textStatus);
												console.log(errorThrown);
											}
										});
										
									}
									break;

								case "rutas/puntos_control":
									console.log("Entro en rutas/puntos_control");
									var form_content = $("#form_%id%").serialize();
									var arrayForm = form_content.split("&");

									for( var i=0; i < arrayForm.length; i++ ){
										var arrayData = arrayForm[i].split("=");
										switch ( arrayData[0] ){
											case "nombre":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Nombre</strong> para poder crear el Punto de control.</p>";
												}
												break;

											case "tipo_punto":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Contacto</strong> para poder crear el Punto de control.</p>";
												}
												break;

											case "contacto":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Contacto</strong> para poder crear el Punto de control.</p>";
												}
												break;

											case "telefono":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Teléfono</strong> para poder crear el Punto de control.</p>";
												}
												break;

											case "ubicacion":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Ubicación</strong> para poder crear el Punto de control.</p>";
												}
												break;

											case "latitud":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Latitud</strong> para poder crear el Punto de control.</p>";
												}
												break;

											case "longitud":
												if (!arrayData[1]){
													msg_error+= "<p>Debe diligenciar el campo <strong>Longitud</strong> para poder crear el Punto de control.</p>";
												}
												break;

											default:
												break;
										}
									}
									break;

								default: 
									console.log("Entro en caso por defecto");
									break;
							}
							
						}else{
							console.log("No Hay origen de módulo para generar validaciones");
						}

						var params = $("#form_%id%").serialize();

						console.log(params);
						console.log(flag_origen);
						console.log( $("#rndc_id_municipio").val());


						if( flag_origen && origen == "clientes/bodegas" && $("#slct_pais_").val() == "COLOMBIA" ){
							params = $("#form_%id%").serialize() + "&rndc_id=" + rndc_id;
						}
						//console.log( params );
						if(!msg_error){
							// hola
							$.ajax({
								type		: "POST",
								cache		: false,
								url			: "' . $url . '",
								data		: params,
								/*beforeSend	: function(jqXHR, settings){
												$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
								},*/
								success		: function(data) {
											$(".nexos-messages").append(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado! </strong>Se ha creado el registro con éxito NEXOSAPP.</div></div>\');
											if(rndc_id){
												var datos="numero_documento="+$("#documento").val()+"&rndcid="+rndc_id;
												$.ajax({
													url: "' . BASE_URL . 'libs/remitentes_ajax.php?action=rndcGuardaresultado",
													type: \'POST\',
													data: datos,
													cache: false,
													dataType: \'json\',
													beforeSend	: function(jqXHR, settings){
														console.log("Entro en el proceso de activo del remitente/destinatario en rndc");
													},
													success: function (data, textStatus, jqXHR)
													{
														console.log(data.activa_tercero_result);
													},
													error: function (jqXHR, textStatus, errorThrown)
													{
														console.log(jqXHR);
														console.log(textStatus);
														console.log(errorThrown);
													}
												});
											}		
											$("html, body").animate({ scrollTop: 0 }, 600);
											setTimeout(function() { location.reload(false);  }, 1000);
													
								}
							});
							
						}
						if(msg_error){
							if(rndc_id){
								var datos="numero_documento="+$("#documento").val()+"&rndcid="+rndc_id;
								$.ajax({
									url: "' . BASE_URL . 'libs/remitentes_ajax.php?action=rndcGuardaresultado",
									type: \'POST\',
									data: datos,
									cache: false,
									dataType: \'json\',
									beforeSend	: function(jqXHR, settings){
										console.log("Entro en el proceso de activo del remitente/destinatario en rndc");
									},
									success: function (data, textStatus, jqXHR)
									{
										console.log(data.activa_tercero_result);
									},
									error: function (jqXHR, textStatus, errorThrown)
									{
										console.log(jqXHR);
										console.log(textStatus);
										console.log(errorThrown);
									}
								});
							}	
							$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>\' + msg_error + \' NEXOSAPP </div></div>\');
							
							$("html, body").animate({ scrollTop: 0 }, 900);
						}
						// $.ajaxSetup({async: true});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _form_modal_multiple_insert($id, $title, $content, $table, $campo_multiple, $table_file, $folder, $field_file, $proyecto)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;
		$dbTable_file = "cmx_" . $table_file;

		$url = BASE_URL . 'libs/insertar.php?tabla=' . $dbTable . '&misma_tabla=1';
		$url_1 = $url;
		if ($dbTable != $dbTable_file) {
			$url_1 = BASE_URL . 'libs/insertar.php?tabla=' . $dbTable_file . '&misma_tabla=0';
		}

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%" enctype="multipart/form-data" method="POST">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer col-md-6">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';

		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de inserción");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '&campo_multiple=' . $campo_multiple . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion insertar ajax...");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
						},
							success		: 	function(data) {
											console.log(data);
											$(".nexos-messages").hide();

											// se recibe el archivo adjunto
											var formData = new FormData($("#form_%id%")[0]);
											$(".nexos-messages").hide();
											if(formData){
												console.log("es un archivo");

												// tomo los valores para la tabla 
												var id_actividades = $("#id").val();

												$.ajax({
													url 		: "' . $url_1 . '&id_actividades=" + id_actividades + "&file_name=' . $field_file . '&proyecto=' . $proyecto . '",
													type 		: "POST",
													data 		: formData,
													contentType : false,
													processData	: false,
													beforeSend	: function(jqXHR, settings){
																	console.log("entro en el ajax de envio de archivo");
																$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
													},
													error		: function(data) {
																console.log(data);
																$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Error en la creacion del registro.</div></div>\');
																$("#table1").hide();
																$("html, body").animate({ scrollTop: 0 }, 600);
													},
													success		: function(data) {
																console.log(data);
																$(".nexos-messages").hide();
																$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
																$("#table1").hide();
													}
												})
											}
											else{
												console.log("No hay archivo a Adjuntar");
											}
											$(".nexos-messages").append(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong>Se ha creado el registro con éxito NEXOSAPP.</div></div>\');
										$("#table1").hide();
										setTimeout(function() { location.reload(false);  }, 1000);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _form_modal_relacion_insert($id, $title, $content, $table, $arrayRelacion)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;
		$dbTableRel = "cmx_" . $arrayRelacion["tabla"];
		$url = BASE_URL . 'libs/insertar.php?tabla=' . $dbTable . '&relacion=' . $dbTableRel . '&campo_relacion=' . $arrayRelacion["campo_relacion"];

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';

		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de insercion");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion insertar multiple ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion insertar : tabla - ' . $table . '");
											console.log("entro en funcion insertar : bd tabla - ' . $dbTable . '");
											console.log("entro en funcion insertar : url - ' . $url . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
											console.log(data);
											setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _message_title_modal($id, $title, $content)
	{
		$idPopup = "edita_" . $id;
		$_popup = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
							<h3 class="modal-title">%title%</h3>
							</div>
							<div class="modal-body">
								%content%
							</div>
							<div class="modal-footer">
								<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
							</div>
						</div>
					</div>
				</div>
			';

		$_popup = str_replace("%id%", $idPopup, $_popup);
		$_popup = str_replace("%title%", $title, $_popup);
		$_popup = str_replace("%content%", $content, $_popup);

		return $_popup;
	}

	public function _message_title_warning($id, $title, $content)
	{
		$idPopup = "edita_" . $id;
		$_popup = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-warning">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
							<h3 class="modal-title">%title%</h3>
							</div>
							<div class="modal-body">
								%content%
							</div>
							<div class="modal-footer">
								<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
							</div>
						</div>
					</div>
				</div>
			';

		$_popup = str_replace("%id%", $idPopup, $_popup);
		$_popup = str_replace("%title%", $title, $_popup);
		$_popup = str_replace("%content%", $content, $_popup);

		return $_popup;
	}

	public function _message_title_danger($id, $title, $content)
	{
		$idPopup = "msg_" . $id;
		$_popup = '
				<div id="%id%" class="panel panel-full-color panel-full-danger">
					%title%
					%content%
				</div>
			';

		// valido contenido del titlulo
		if ($title) {
			$_title = '
					<div class="panel-heading panel-heading-contrast">
						' . $title . '
						<div class="tools"><span class="icon mdi mdi-close"></span></div><span class="panel-subtitle">Panel subtitle description</span>
					</div>
				';
		} else {
			$_title = '';
		}

		// valido contenido del contenido
		if ($content) {
			$_content = '
					<div class="panel-body">
						<p>' . $content . '</p>
					</div>
				';
		} else {
			$_content = '';
		}

		$_popup = str_replace("%id%", $idPopup, $_popup);
		$_popup = str_replace("%title%", $title, $_popup);
		$_popup = str_replace("%content%", $content, $_popup);

		return $_popup;
	}

	public function _message_title_success($id, $title, $content)
	{
		$idPopup = "edita_" . $id;
		$_popup = '
				<div id="%id%" class="panel panel-full-color panel-full-success">
					%title%
					%content%
				</div>
			';

		// valido contenido del titlulo
		if ($title) {
			$_title = '
					<div class="panel-heading panel-heading-contrast" id=>
						' . $title . '
						<div class="tools"><span class="icon mdi mdi-close"></span></div><span class="panel-subtitle">Panel subtitle description</span>
					</div>
				';
		} else {
			$_title = '';
		}

		// valido contenido del contenido
		if ($content) {
			$_content = '
					<div class="panel-body">
						<p>' . $content . '</p>
					</div>
				';
		} else {
			$_content = '';
		}

		$_popup = str_replace("%id%", $idPopup, $_popup);
		$_popup = str_replace("%title%", $title, $_popup);
		$_popup = str_replace("%content%", $content, $_popup);

		return $_popup;
	}


	// FORMULARIO PARA ORDENAMIENTO DE LAS ACTIVIDADES DE LA PLANTILLA
	public function _form_modal_multiple_insert_orden1($id, $title, $content, $table, $accion, $orden_compra, $orden)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url = BASE_URL . 'libs/insertar_plantilla.php?tabla=' . $dbTable;
		$url_ordenamiento = BASE_URL . 'libs/ordenar_plantilla.php?tabla=' . $dbTable . '&accion=' . $accion;

		switch ($accion) {
			case 'adicionar':
				$_popup[1] = '
						<script type="text/javascript">
							$("#btn_%id%").click(function () {
								console.log("Entro en funcion de adicionar actividad con orden");

								if ( $(\'select[id=slct_actividades_plantilla_' . $orden_compra . $orden . ']\').length > 0 ) {
									// console.log("Existe el select");
									var array_orden = $(\'select[id=slct_actividades_plantilla_' . $orden_compra . $orden . ']\').val() ;
								}else{
									// console.log("No Existe el select");
									var array_orden = "vacio";
								}

								if(array_orden){
									if (array_orden != "vacio"){
										var orden_maximo = Math.max.apply(null, array_orden);
										// console.log("Actividad maxima seleccionada " + orden_maximo);
									}

									var id_plantilla = $(\'input[name=id_plantilla]\').val();
									var integracion = $(\'#slct_integracion_\').val();

									console.log("funcion de ordenamiento de actividades");
									$.ajax({
										type		: "POST",
										cache		: false,
										url			: "' . $url_ordenamiento . '",
										data		: "actividad_previa=" + orden_maximo + "&id_plantilla=" + id_plantilla + "&integracion=" + integracion,
										// data		: $("#form_%id%").serialize(),
										beforeSend	: function(jqXHR, settings){
														$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
													console.log(data);
										},
										success		: function(data) {
													console.log(data);
													console.log("funcion de adición de actividades");
													$.ajax({
														type		: "POST",
														cache		: false,
														url			: "' . $url . '",
														data		: $("#form_%id%").serialize(),
														beforeSend	: function(jqXHR, settings){
																		$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
														},
														error		: function(data) {
																	console.log(data);
																	$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Error en la creacion del registro.</div></div>\');
																	$("#table1").hide();
														},
														success		: function(data) {
																	console.log(data);
																	$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
																	setTimeout(function() { location.reload(false); }, 800);
														}
													});
										}
									});
								}else{
									console.log("No hay");
									$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error en el Proceso!</strong> Error en la creación del registro.</div></div>\');
									$("html, body").animate({ scrollTop: 0 }, 600);
								}
							});
						</script>
					';

				$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);
				break;

			case 'modificar':
				$_popup[1] = '
						<script type="text/javascript">
							$("#btn_%id%").click(function () {
								console.log("Entro en funcion de modificar ordenamiento de actividades");

								var array_orden = $(\'select[id=slct_actividades_plantilla_' . $orden_compra . $orden . ']\').val();
								console.log(array_orden);
								if(array_orden){
									console.log("Si hay");
									var orden_inicial = $(\'#orden_' . $orden_compra . $orden . '\').val();
									console.log("Orden actividad inicial " + orden_inicial);
									var orden_final = Math.max.apply(null, array_orden);
									console.log("Orden actividad previa deseada " + orden_final);

									var id_plantilla = $(\'input[name=id_plantilla]\').val();
									console.log("Carga a modificar " + id_plantilla);

									console.log("funcion de ordenamiento de actividades");
									$.ajax({
										type		: "POST",
										cache		: false,
										url			: "' . $url_ordenamiento . '",
										data		: "actividad_previa_deseada=" + orden_final + "&orden_inicial=" + orden_inicial + "&id_plantilla=" + id_plantilla,
										beforeSend	: function(jqXHR, settings){
														console.log("entro en funcion ordenar actividades : url - ' . $url_ordenamiento . '");
														console.log("Informacion de data... " + orden_final);
														$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
													console.log("error");
													console.log(data);
										},
										success		: function(data) {
													console.log(data);
													$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
													setTimeout(function() { location.reload(false); }, 800);
										}
									});
								}else{
									console.log("No hay");
									$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error en el Proceso!</strong> Error en la creación del registro.</div></div>\');
									$("html, body").animate({ scrollTop: 0 }, 600);
								}
							});

						</script>
					';

				$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);
				break;
		}
		return $_popup;
	}

	// FORMULARIO PARA LA INACTIVACION DE LAS ACTIVIDADES DE LA PLANTILLA
	public function _alert_modal_actividad_danger1($id, $content, $table, $accion, $orden)
	{
		$idPopup = "elimina_" . $id;
		$dbTable = "cmx_" . $table;

		$_popup[0] = '
				<!-- Nifty div id="mod-danger" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-danger"><span class="modal-main-icon mdi mdi-close-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id_plantilla" value="' . $id . '">
											<input type="hidden" name="orden" value="' . $orden . '">
											<input type="hidden" name="estado" value="0">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-danger">Eliminar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url = BASE_URL . 'libs/ordenar_plantilla.php?tabla=' . $dbTable . '&accion=' . $accion;

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de inactivar actividades");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion inactivar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion inactivar : id - ' . $id . '");
											console.log("entro en funcion inactivar : tabla - ' . $table . '");
											console.log("entro en funcion inactivar : bd tabla - ' . $dbTable . '");
											console.log("entro en funcion inactivar : url - ' . $url . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha inactivado el registro con éxito.</div></div>\');
										setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}


	// FORMULARIO PARA ORDENAMIENTO DE LAS ACTIVIDADES MODULO PRAXAIR
	public function _form_modal_multiple_insert_orden($id, $title, $content, $table, $campo_multiple, $accion, $orden_compra, $orden)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);


		$url = BASE_URL . 'libs/insertar.php?tabla=' . $dbTable . '&campo_multiple=' . $campo_multiple;
		$url_ordenamiento = BASE_URL . 'libs/ordenar.php?tabla=' . $dbTable . '&accion=' . $accion;

		switch ($accion) {
			case 'adicionar':
				$_popup[1] = '
						<script type="text/javascript">
							$("#btn_%id%").click(function () {
								console.log("Entro en funcion de adicionar actividad con orden");

								var array_orden = $(\'select[id=slct_actividades_plantilla_' . $orden_compra . $orden . ']\').val();
								console.log("$(\'select[id=slct_actividades_plantilla_' . $orden_compra . $orden . ']\').val()");
								console.log(array_orden);
								if(array_orden){
									console.log("Si hay");
									var orden_maximo = Math.max.apply(null, array_orden);
									console.log("Actividad maxima seleccionada " + orden_maximo);

									var id_carga = $(\'input[name=id_carga]\').val();
									console.log("Carga a modificar " + id_carga);

									console.log("funcion de ordenamiento de actividades");
									$.ajax({
										type		: "POST",
										cache		: false,
										url			: "' . $url_ordenamiento . '",
										data		: "actividad_previa=" + orden_maximo + "&id_carga=" + id_carga,
										beforeSend	: function(jqXHR, settings){
														console.log("entro en funcion ordenar actividades : url - ' . $url_ordenamiento . '");
														console.log("Informacion de data... " + orden_maximo);
														$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
													console.log("error");
													console.log(data);
										},
										success		: function(data) {
													console.log(data);
													console.log("funcion de adicion de actividades");
													$(".nexos-messages").hide();
													$.ajax({
														type		: "POST",
														cache		: false,
														url			: "' . $url . '",
														data		: $("#form_%id%").serialize(),
														beforeSend	: function(jqXHR, settings){
																		console.log("Informacion de data... " + $("#form_%id%").serialize());
																		console.log("entro en funcion insertar : bd tabla - ' . $dbTable . '");
																		console.log("entro en funcion insertar : url - ' . $url . '");
																		$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
														},
														error		: function(data) {
																	console.log(data);
																	$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Error en la creacion del registro.</div></div>\');
																	$("#table1").hide();
														},
														success		: function(data) {
																	console.log(data);
																	$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
																	$("#table1").hide();
																	setTimeout(function() { location.reload(false); }, 800);
														}
													});
										}
									});

								}else{
									console.log("No hay");
									$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error en el Proceso!</strong> Error en la creación del registro.</div></div>\');
									$("html, body").animate({ scrollTop: 0 }, 600);
								}
							});
						</script>
					';

				$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);
				break;

			case 'modificar':
				$_popup[1] = '
						<script type="text/javascript">
						
							$("#btn_%id%").click(function () {
								console.log("Entro en funcion de modificar ordenamiento de actividades");

								var array_orden = $(\'select[id=slct_actividades_plantilla_' . $orden_compra . $orden . ']\').val();
								console.log(array_orden);
								if(array_orden){
									console.log("Si hay");
									var orden_inicial = $(\'#orden_' . $orden_compra . $orden . '\').val();
									console.log("Orden actividad inicial " + orden_inicial);
									var orden_final = Math.max.apply(null, array_orden);
									console.log("Orden actividad previa deseada " + orden_final);

									var id_carga = $(\'input[name=id_carga]\').val();
									console.log("Carga a modificar " + id_carga);

									console.log("funcion de ordenamiento de actividades");
									$.ajax({
										type		: "POST",
										cache		: false,
										url			: "' . $url_ordenamiento . '",
										data		: "actividad_previa_deseada=" + orden_final + "&orden_inicial=" + orden_inicial + "&id_carga=" + id_carga,
										beforeSend	: function(jqXHR, settings){
														console.log("entro en funcion ordenar actividades : url - ' . $url_ordenamiento . '");
														console.log("Informacion de data... " + orden_final);
														$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
													console.log("error");
													console.log(data);
										},
										success		: function(data) {
													console.log(data);
													$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
													setTimeout(function() { location.reload(false); }, 800);
										}
									});
								}else{
									console.log("No hay");
									$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error en el Proceso!</strong> Error en la creación del registro.</div></div>\');
									$("html, body").animate({ scrollTop: 0 }, 600);
								}
							});
						</script>
					';

				$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);
				break;
		}

		return $_popup;
	}

	// FORMULARIO PARA LA INACTIVACION DE LAS ACTIVIDADES MODULO PRAXAIR
	public function _alert_modal_actividad_danger($name, $id, $content, $table, $accion, $id_carga, $orden)
	{
		$idPopup = "elimina_" . $name;
		$dbTable = "cmx_" . $table;

		$_popup[0] = '
				<!-- Nifty div id="mod-danger" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-danger"><span class="modal-main-icon mdi mdi-close-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id_actividad" value="' . $id . '">
											<input type="hidden" name="id_carga" value="' . $id_carga . '">
											<input type="hidden" name="orden" value="' . $orden . '">
											<input type="hidden" name="estado" value="0">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-danger">Eliminar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url = BASE_URL . 'libs/ordenar.php?tabla=' . $dbTable . '&accion=' . $accion;

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de inactivar actividades");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion inactivar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha inactivado el registro con éxito.</div></div>\');
										setTimeout(function() { location.reload(false);  }, 600);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	// FORMULARIO PARA LA ADMINISTRACIÓN DE LAS ACTIVIDADES GENÉRICO
	public function _form_modal_actividades($id, $title, $content, $table, $proyecto)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;


		// Se toma el numero del id 
		$arrayId = explode("_", $idPopup);
		$_id = $arrayId[(COUNT($arrayId) - 1)];

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%" enctype="multipart/form-data" method="POST">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url = BASE_URL . 'libs/gestion_actividades.php?tabla=' . $dbTable . '&proyecto=' . $proyecto;
		$url_1 = BASE_URL . 'libs/gestion_entregables.php?proyecto=' . $proyecto;

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						var flag_click = false;
						if(!flag_click){
							flag_click = true;
							$(".nexos-messages").html(\'\');
							var id_carga = $(\'input[name=id_carga]\').val();
							// var adjunto  = $(\'input[name=adjunto]\').val();
							var adjunto  = $(\'#adjunto_' . $_id . '\').val();
							var url_entregable  = $(\'#url_entregable_' . $_id . '\').val();
							var tipo_actividad  = $(\'#tipo_actividad_' . $_id . '\').val();
							var flag_arregla_actividad_oferta_comercial = false;

							var msg_error = "";
							if(adjunto == 1 && !url_entregable){
								msg_error+= "<p>Debe adjuntar un entregable para concluir esta Actividad.</p>";
							}
							switch(tipo_actividad){
								case "fecha":
									console.log("Tipo de actividad fecha");
									var fecha  = $(\'input[name=fecha]\').val();
									if(!fecha){
										msg_error+= "<p>Debe generar una fecha para concluir esta Actividad.</p>";
									}
									break;

								case "verificacion_mercancia":
									console.log("Tipo de actividad verificacion mercancía");

									// se verifica si hay imagenes adjuntos
									if($(\'input[name=imagenes]\').val()){
										var imagenes= document.getElementById(\'imagenes\').files;
										for( var i=0; i < imagenes.length; i++ ){
											var extension = imagenes[i].name.split(".");
											// Se valida el tipo de archivo
											if( validaFormatoArchivo("jpg,jpeg,png,gif,bmp,JPG,JPEG,PNG,GIF,BMP", extension[ extension.length - 1 ]) == 0 ){
												msg_error+= "<p>Formato de una o varias imagenes adjuntas no es válido como entregable para esta actividad.</p>";
												break;
											}
										}
									}else{
										msg_error+= "<p>Debe adjuntar imágenes para concluir esta Actividad.</p>";
									}

									// se verifica contenido de las observaciones del material
									var id_materiales = $(\'#id_material\').val();
									var id_material = id_materiales.split(",");
									for(var i = 0 ; i < (id_material.length - 1) ; i++ ){
										if( $(\'#observacion_check_\' + id_material[i] ).prop("checked") ){
											if( !$(\'#observacion_material_\' + id_material[i] ).val() ){
												msg_error+= "<p>Debe diligenciar la observación del material seleccionado para concluir esta Actividad.</p>";
											}
										}
									}
									break;

								case "carga_inicial":
									console.log("Tipo de actividad carga_inicial");

									var id_tramo = $(\'input[name=id_tramo]\').val();
									var tramos = $(\'input[name=lista_tramos]\').val();
									var arrayTramos = tramos.split(",");
									for(var i=0 ; i < arrayTramos.length-1 ; i++){
										var inicial = $("#primero_" + arrayTramos[i]).val();
										if(inicial == 1){
											var fecha_tramo = $("input[name=fecha_" + id_tramo + "]").val();
											if(!fecha_tramo){
												msg_error+= "<p>Debe diligenciar la fecha del primer tramo.</p>";
											}
										}
									}

									break;

								case "seguimiento":
									console.log("Tipo de actividad seguimiento");

									var seguimiento = $(\'textarea[name=seguimiento]\').val();
									break;

								case "seguimiento_cliente":
									console.log("Tipo de actividad seguimiento_cliente");

									var seguimiento = $(\'textarea[name=seguimiento]\').val();
									break;

								case "seguimiento_ruta":
									console.log("Tipo de actividad seguimiento_ruta");

									var tipo_seguimiento_ruta = $("#tipo_seguimiento_ruta").val();
									var latitud = $("#latitud").val();
									var longitud = $("#longitud").val();

									if( !tipo_seguimiento_ruta ){
										msg_error+= "<p>Para continuar debe seleccionar un <strong>Tipo de Seguimiento de Ruta</strong>.</p>";
									}
									if( !latitud || !longitud ){
										msg_error+= "<p>Para continuar debe establecer la ubicación del seguimiento en el mapa.</p>";
									}
									break;

								case "intr_oferta_comercial":
									console.log("Tipo de actividad intr_oferta_comercial");
									var fecha_oferta  = $(\'#fecha_oferta_' . $_id . '\').val();
									var id_moneda = $(\'select[name=moneda_oferta]\').val();
									var valor_oferta  = $(\'#valor_oferta_' . $_id . '\').val();
									var url_oferta  = $(\'#url_oferta_' . $_id . '\').val();

									if(!fecha_oferta){
										msg_error+= "<p>Debe generar una <strong>Fecha Oferta</strong> para concluir esta Actividad.</p>";
									}
									if(!id_moneda){
										msg_error+= "<p>Debe seleccionar una <strong>Moneda Oferta</strong> para concluir esta Actividad.</p>";
									}
									if(!valor_oferta){
										msg_error+= "<p>Debe generar un <strong>Valor Oferta</strong> para concluir esta Actividad.</p>";
									}
									if(!url_oferta){
										msg_error+= "<p>Debe seleccionar un <strong>Archivo Oferta</strong> para concluir esta Actividad.</p>";
									}
									break;

								default:
									console.log("Tipo de actividad genérica");
									break;
							}

							if(!msg_error){
								console.log("Todo OK");
								$.ajaxSetup({async: false});
								$.ajax({
									type		: "POST",
									cache		: false,
									url			: "' . $url . '",
									data		: $("#form_%id%").serialize(),
									beforeSend	: function(jqXHR, settings){
													$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
									},
									error		: function(data) {
												console.log(data);
												$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Error en la creacion del registro.</div></div>\');
									},
									success		: function(data) {
												console.log(data);

												// se recibe el archivo adjunto
												var formData = new FormData($("#form_%id%")[0]);

												// se asignan las imagenes del la actividad tipo verificar mercancia
												if(imagenes){
													for( var i=0; i < imagenes.length; i++ ){
														formData.append( "imagen_" + i , imagenes[i] );
													}
												}

												if(formData){
													// tomo los valores para la tabla 
													var id_actividades = $("#id").val();

													try {
														$.ajax({
															url 		: "' . $url_1 . '&id_actividades=" + id_actividades,
															type 		: "POST",
															data 		: formData,
															contentType : false,
															processData	: false,
															error		: function(data) {
																		console.log(data);
																		$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Error en la creacion del registro.</div></div>\');
															},
															success		: function(data) {
																		console.log(data);
															}
														})
													}
													catch(err) {
														msg_error+= "<p><strong>" + err.message + ".</strong> Por favor intente gestionar la actividad nuevamente.</p>";
														var flag_arregla_actividad_oferta_comercial = true;
													}
												}
												else{
													console.log("No hay archivo a Adjuntar");
												}
									}
								});
								$.ajaxSetup({async: true});
							}
							if(!msg_error){
								$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
								$("html, body").animate({ scrollTop: 0 }, 600);
								$setTimeout(function() { location.reload(false); }, 800);

							}
							if(msg_error){
								flag_click = false;
								if (flag_arregla_actividad_oferta_comercial && tipo_actividad == "intr_oferta_comercial") {
									console.log("se debe arreglar la actividad");

									params = {
										id: $("#id").val()
									}

									$.ajaxSetup({async: false});
									$.ajax({
										url: $("#id_url_ajax").val() + "libs/importaciones.php?action=ajusta_intr_oferta_comercial",
										type: "POST",
										data: params,
										cache: false,
										dataType: "json",
										error: function (jqXHR, textStatus, errorThrown){
											$(".nexos-messages").html("");
											msg_error+= "<p>" + jqXHR.responseText + "</p>";
											console.log(jqXHR);
											console.log(textStatus);
											console.log(errorThrown);
										},
										success: function (data, textStatus, jqXHR){
											// console.log(data);
											$(".nexos-messages").html("");
										}
									});
									$.ajaxSetup({async: true});
								} 

								$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>\' + msg_error + \'</div></div>\');
								$("html, body").animate({ scrollTop: 0 }, 600);
							}
						}
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _form_modal_actividad_material_importacion_upload($id, $title, $content, $table, $proyecto)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;

		// Se toma el numero del id 
		$arrayId = explode("_", $idPopup);
		$_id = $arrayId[(COUNT($arrayId) - 1)];

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%" enctype="multipart/form-data" method="POST">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url = BASE_URL . 'libs/importaciones.php?action=sube_material';
		$url_1 = BASE_URL . 'libs/gestion_actividades.php?tabla=' . $dbTable . '&proyecto=' . $proyecto;
		$url_2 = BASE_URL . 'libs/gestion_entregables.php?proyecto=' . $proyecto;
		$url_3 = BASE_URL . 'libs/importaciones.php?action=verifica_archivo';

		$_popup[1] = '
				<script type="text/javascript">
					var flag_click = false;
					$("#btn_%id%").click(function () {
						var msg_error = "";
						var adjunto = $("#url_entregable_' . $_id . '").val();
						$(".nexos-messages").html(\'\');

						if(!flag_click){
							flag_click = true;

							if(adjunto){
								// se valida el formato del archivo
								var file = adjunto.split(".");
								var posiciones = file.length;
								if(file[posiciones-1] == "csv"){
									var formData = new FormData($("#form_%id%")[0]);
									// Se verifica si el archivo está diligenciado 
									$.ajaxSetup({async: false});
									$.ajax({
										url 		: "' . $url_3 . '",
										type 		: "POST",
										data 		: formData,
										dataType 	: "json",
										contentType : false,
										processData	: false,
										beforeSend	: function(jqXHR, settings){
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
													console.log(data);
										},
										success		: function(data) {
											console.log(data.control);
											if(data.lineas > 1){
												// se recibe el archivo adjunto
												if(formData){
													console.log("Es un archivo");
													$.ajax({
														url 		: "' . $url . '",
														type 		: "POST",
														data 		: formData,
														dataType	: "json",
														contentType : false,
														processData	: false,
														error		: function(data) {
															console.log(data);
														},
														success		: function(data) {
															console.log(data.control);
															if(!data.error){
																console.log("Archivo diligenciado correctamente");
																$.ajax({
																	type		: "POST",
																	cache		: false,
																	url			: "' . $url_1 . '",
																	data		: $("#form_%id%").serialize(),
																	error		: function(data) {
																				console.log(data);
																	},
																	success		: function(data) {
																		console.log(data);
																		// se recibe el archivo adjunto
																		var formData = new FormData($("#form_%id%")[0]);
																		if(formData){
																			console.log("es un formulario de archivos");

																			// tomo los valores para la tabla 
																			var id_actividades = $("#id").val();
																			$.ajax({
																				url 		: "' . $url_2 . '&id_actividades=" + id_actividades,
																				type 		: "POST",
																				data 		: formData,
																				contentType : false,
																				processData	: false,
																				error		: function(data) {
																					console.log(data);
																				},
																				success		: function(data) {
																					console.log(data);
																				}
																			})
																		}
																		else{
																			console.log("No hay archivo a Adjuntar");
																		}
																	}
																});
															}else{
																console.log("Error en diligenciamiento de archivo");
																msg_error+= data.error;
															}
														}
													})
												}
												else{
													console.log("No hay archivo a Adjuntar");
													msg_error+= "<p>Debe seleccionar un archivo de materiales para poder incluirlos en la importación.</p>";
												}
											}else{
												msg_error+= "<p>Debe diligenciar el archivo con materiales para poder incluirlos en la importación.</p>";
											}
										}
									});
									$.ajaxSetup({async: true});
								}else{
									msg_error+= "<p>Formato de archivo debe estar e formato <strong>.csv</strong> para poder incluir el material de la importación.</p>";
								}
							}else{
								msg_error+= "<p>Debe seleccionar un archivo de materiales para poder incluirlos en la importación.</p>";
							}
							if(msg_error){
								flag_click = false;
								$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>\' + msg_error + \'</div></div>\');
								$("html, body").animate({ scrollTop: 0 }, 600);
							}else{
								setTimeout(function() { location.reload(false); }, 800);
							}
						}
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}


	/*************** MÓDULO IMPORTACIONES ****************/
	// Crear importacion
	public function _form_crea_importacion($id, $title, $content)
	{
		$idPopup = $id;
		$dbTable = "cmx_importacion_proyecto";

		$url = BASE_URL . "libs/importaciones.php";
		$url_1 = BASE_URL . "libs/importaciones.php?action=actividades_proyecto";

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%" enctype="multipart/form-data">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									<div id="formulario_"></div>
									<div class="text-right">
										<span>(*) Campos Obligatorios</span>
									</div>
									<br/>
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">GuardarES</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';

		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					var flag_click = false;
					$("#btn_%id%").click(function () {
						if(!flag_click){
							flag_click = true;
							$(".nexos-messages").html("");
							var msg_error = "";
							var params = new FormData();

							var tipo_operacion = $(\'#slct_tipo_operacion_\').val();
							if(tipo_operacion == null){
								msg_error+= "<p>Debe seleccionar un <strong>Tipo de Operación</strong> para poder generar el proyecto.</p>";
							} else {
								// Se filtra si el proyecto es nacional o internacional
								var flag_vista;
								switch( $("#slct_tipo_operacion_").val() ){
									case "IMPORTACION":
										flag_vista = "INTERNACIONAL";
										break;
									case "EXPORTACION":
										flag_vista = "INTERNACIONAL";
										break;

									case "NACIONAL_AEREO":
										flag_vista = "INTERNACIONAL";
										break;

									case "NACIONAL":
										flag_vista = "NACIONAL";
										break;

									case "URBANO":
										flag_vista = "NACIONAL";
										break;
								}

								switch( flag_vista ){
									case "INTERNACIONAL":
										var importacion = $(\'#importacion\').val();
										if(!importacion){
											msg_error+= "<p>Debe diligenciar el <strong>Número de Operación</strong> para poder generar el proyecto.</p>";
										}

										var id_cliente = $(\'#slct_id_cliente\').val();
										if(!id_cliente){
											msg_error+= "<p>Debe seleccionar un <strong>Cliente</strong> para poder generar el proyecto.</p>";
											msg_error+= "<p>Debe seleccionar un <strong>Tipo de Tramo</strong> para poder generar el proyecto.</p>";
											msg_error+= "<p>Debe seleccionar un <strong>Remitente - Destinatario</strong> para poder generar el proyecto.</p>";
										} else {
											// console.log("Hay " + $(\'.tramo_clon\').length + " tramos en el formulario");
											if( $(\'.tramo_clon\').length > 1 ){
												var array_lista_rem_dest = new Array();
												var cant_cargues = 0;
												var cant_descargues = 0;
												$(\'.tramo_clon\').each(function(e){
													var tipo_tramo = $(\'#slct_tipo_tramo_\' + (e + 1) ).val();
													if(!tipo_tramo){
														msg_error+= "<p>Debe seleccionar un <strong>Tipo de Tramo</strong> en la posición " + (e + 1) + " para poder generar el proyecto.</p>";
													}

													var rem_dest = $(\'#slct_remitente_destinatario_\' + (e + 1) ).val();
													if(!rem_dest){
														msg_error+= "<p>Debe seleccionar un <strong>Remitente - Destinatario</strong> en la posición " + (e + 1) + " para poder generar el proyecto.</p>";
													} else {
														if ( array_lista_rem_dest.indexOf( $("#slct_remitente_destinatario_" + (e + 1) ).val() ) != -1 ){
															msg_error+= "<p>El <strong>Remitente - Destinatario</strong> de la posición " + (e + 1) + " se encuentra repetido.</p>";
														}
														array_lista_rem_dest.push( $("#slct_remitente_destinatario_" + (e + 1) ).val() );
													}

													if( tipo_tramo && rem_dest ){
														switch ( tipo_tramo ){
															case "Cargue":
																cant_cargues++;
																break;

															case "Descargue":
																cant_descargues++;
																break;
														}
													}
												});

												if( cant_cargues == 0 ){
													msg_error+= "<p>Debe existir por lo menos un tramo de Cargue para poder generar el proyecto.</p>";
												}

												if( cant_descargues == 0 ){
													msg_error+= "<p>Debe existir por lo menos un tramo de Descargue para poder generar el proyecto.</p>";
												}
											} else {
												msg_error+= "<p>Se debe registrar al menos un tramo de <strong>carga</strong> y uno de <strong>descarga</strong> para poder generar el proyecto.</p>";
											}
										}

										var tipo_transporte = $(\'#slct_tipo_transporte_\').val();
										if(!tipo_transporte){
											msg_error+= "<p>Debe seleccionar un <strong>Tipo de Transporte</strong> para poder generar el proyecto.</p>";
										}

										var incoterm = $(\'#slct_incoterms_\').val();
										if(!incoterm){
											msg_error+= "<p>Debe seleccionar un <strong>Incoterm</strong> para poder generar el proyecto.</p>";
										}
										break;

									case "NACIONAL":
										var importacion = $(\'#importacion\').val();
										if(!importacion){
											msg_error+= "<p>Debe diligenciar el <strong>Número de Operación</strong> para poder generar el proyecto.</p>";
										}

										var rndc_tipo_material = $(\'#slct_rndc_material_\').val();
										if(!rndc_tipo_material){
											msg_error+= "<p>Debe diligenciar el <strong>Tipo de Material</strong> para poder generar el proyecto.</p>";
										}

										var id_cliente = $(\'#slct_id_cliente\').val();
										if(!id_cliente){
											msg_error+= "<p>Debe seleccionar un <strong>Cliente</strong> para poder generar el proyecto.</p>";
										}

										var id_contrato = $(\'#slct_contrato_\').val();
										if(id_contrato == null){
											msg_error+= "<p>Debe seleccionar un <strong>Contrato</strong> para poder generar el proyecto.</p>";
										} else {
											if(id_contrato == "otro"){
												// Se valida el contenido del formulario
												if ( !$("#slct_tipo_contrato_").val() ) {
													msg_error+= "<p>Debe seleccionar un <strong>Tipo de Contrato</strong> para poder crear el contrato del Proyecto.</p>";
												}
												if ( !$("#valor_contrato").val() ) {
													msg_error+= "<p>Debe diligenciar el campo <strong>Valor Contrato</strong> para poder crear el contrato del Proyecto.</p>";
												}
												if ( !$("#inicio_contrato").val() ) {
													msg_error+= "<p>Debe diligenciar el campo <strong>Inicio de Contrato</strong> para poder crear el contrato del Proyecto.</p>";
												}
												if ( !$("#fin_contrato").val() ) {
													msg_error+= "<p>Debe diligenciar el campo <strong>Finalización de contrato</strong> para poder crear el contrato del Proyecto.</p>";
												}
												if ( !$("#url_contrato").val() ) {
													msg_error+= "<p>Debe seleccionar un archivo <strong>Adjunto Contrato</strong> para poder crear el contrato del Proyecto.</p>";
												}else{
													var adjunto = $(\'#url_contrato\')[0].files[0];
													// console.log( $(\'#url_contrato\')[0].files[0] );
													// console.log( adjunto.name );

													// Se valida el tipo de archivo
													var extension = adjunto.name.split(".");
													var formato_archivo = "pdf,PDF,zip,ZIP,rar,RAR,doc,DOC,docx,DOCX,jpg,jpeg,png,gif,bmp,tif,JPG,JPEG,PNG,GIF,BMP,TIF,xls,XLS,xlsx,XLSX,ppt,PPT,pptx,PPTX,pps,PPS,ppsx,PPSX";
													if( validaFormatoArchivo( formato_archivo , extension[ extension.length - 1 ]) == 0 ){
														msg_error+= "<p>Formato del archivo del campo <strong>Adjunto Contrato</strong> no es válido para poder crear el contrato del Proyecto.</p>";
														msg_error+= "<p>Formatos válidos: <strong>" + formato_archivo + "</strong>.</p>";
													}
												}
												if ( $("#geografico").is(":checked") ) {
													if ( !$("select[name=\'origenes\']").val() ) {
														msg_error+= "<p>Debe seleccionar los <strong>Orígenes</strong> para poder crear el contrato del Proyecto.</p>";
													}
													if ( !$("select[name=\'destinos\']").val() ) {
														msg_error+= "<p>Debe seleccionar los <strong>Destinos</strong> para poder crear el contrato del Proyecto.</p>";
													}
												} else {
													msg_error+= "<p>Debe establecer los <strong>Orígenes</strong> y <strong>Destinos</strong> para poder crear el contrato del Proyecto.</p>";
												}
												if ( $("#tipo_vehiculo").is(":checked") ) {
													if ( !$("select[name=\'tipos_vehiculo\']").val() ) {
														msg_error+= "<p>Debe seleccionar los <strong>Tipos de Vehículo</strong> para poder crear el contrato del Proyecto.</p>";
													}
												} else {
													msg_error+= "<p>Debe establecer los <strong>Tipos de Vehículo</strong> para poder crear el contrato del Proyecto.</p>";
												}
												$(".param_condiciones:checked").each(function(){
													if ( !$("#condicion_" + $(this).val() + "_val").val() ) {
														msg_error+= "<p>Debe diligenciar el campo <strong>" + $(\'#condicion_\' + $(this).val() + \'_val\').attr(\'placeholder\') + "</strong> para poder crear el contrato del Proyecto.</p>";
													}
												});
											}
										}
										break;
								}
							}

							var id_tipo_carga = $(\'#slct_tipo_cargas_\').val();
							var cant_contenedores = 0;

							if(id_tipo_carga == null){
								msg_error+= "<p>Debe seleccionar un <strong>Tipo de Carga</strong> para poder generar el proyecto.</p>";
							}else if(id_tipo_carga == 1){
								var cant_contenedores = $(".contenedor_clon").length;
								// console.log( $(".contenedor_clon").length );

								for (var i = 1; i <= $(".contenedor_clon").length; i++) {
									var slct_tipo_contenedor_ = $(\'#slct_tipo_contenedor_\' + i).val();
									var contenedor = $(\'#contenedor_\' + i).val();

									if(slct_tipo_contenedor_ == null){
										msg_error+= "<p>Debe seleccionar un <strong>Tipo de Contenedor</strong> en la posición <strong>" + i + "</strong> para poder generar el proyecto.</p>";
									}
									if(!contenedor){
										msg_error+= "<p>Debe diligenciar el <strong>Número del Contenedor</strong> en la posición <strong>" + i + "</strong>  para poder generar el proyecto.</p>";
									}

									if( $(\'#devolucion_\' + i).is(":checked") ){
										var fecha_devolucion = $(\'#devolucion_contenedor_\' + i).val();
										var fecha_comodato = $(\'#fecha_comodato_\' + i).val();
										var file_comodato = $(\'#url_comodato_\' + i).val();
										if(!fecha_devolucion){
											msg_error+= "<p>Debe diligenciar el <strong>Devolución Contenedor:</strong> en la posición<strong>" + i + "</strong> para poder generar el proyecto.</p>";
										}
										if(!fecha_comodato){
											msg_error+= "<p>Debe diligenciar el <strong>Fecha Comodato:</strong> en la posición<strong>" + i + "</strong> para poder generar el proyecto.</p>";
										}
										if(!file_comodato){
											msg_error+= "<p>Debe seleccinar un <strong>Adjunto Comodato:</strong> en la posición<strong>" + i + "</strong> para poder generar el proyecto.</p>";
										} else {
											var adjunto = $(\'#url_comodato_\' + i)[0].files[0];
											params.append(\'url_comodato_\' + i, adjunto );

											// console.log(adjunto);
											// Se valida el peso del archivo
											if ( adjunto.size < $("#max_file_size").val() ) {
												// Se valida el tipo de archivo
												var extension = adjunto.name.split(".");
												var formato_archivo = "pdf,PDF,zip,ZIP,rar,RAR,doc,DOC,docx,DOCX,jpg,jpeg,png,gif,bmp,tif,JPG,JPEG,PNG,GIF,BMP,TIF,xls,XLS,xlsx,XLSX,ppt,PPT,pptx,PPTX,pps,PPS,ppsx,PPSX,ods,ODS";
												if( validaFormatoArchivo( formato_archivo , extension[ extension.length - 1 ]) == 0 ){
													msg_error+= "<p>Formato del archivo del campo <strong>Adjunto Comodato:</strong> no es válido para poder crear el sobrecosto.</p>";
													msg_error+= "<p>Formatos válidos: <strong>" + formato_archivo + "</strong>.</p>";
												}
											} else {
												msg_error+= "<p>El archivo del campo <strong>Adjunto Comodato:</strong> es muy pesado para subirlo al servidor. El peso máximo del archivo debe ser menor de <strong>" + ($("#max_file_size").val() / 1000000 ) + "MB</strong>.</p>";
											}
										}
									}
								}
							}

							var id_plantilla = $(\'#slct_plantilla_\').val();
							if(!id_plantilla){
								msg_error+= "<p>Debe asignar una plantilla para poder crear las actividades del proyecto.</p>";
							}

							if(!msg_error){
								console.log("todo OK");
								switch( flag_vista ){
									case "NACIONAL":
										var other_data = $("#form_%id%").serializeArray();
										// console.log(other_data);
										$.each(other_data,function(key,input){
											params.append(input.name,input.value);
										});
										params.append("cant_contenedores",cant_contenedores);
										// console.log(params);

										$.ajaxSetup({async: false});
										$.ajax({
											url			: "' . $url . '?action=insertar_nacional",
											type		: "POST",
											data		: params,
											cache		: false,
											processData : false, 
											contentType: false, 
											beforeSend	: function(jqXHR, settings){
												// console.log("Entra en la funcion insertar ajax...");
												$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
											},
											error 		: function(data){
												console.log(data);
												console.log(data.control);
												console.log(data.error);
											},
											success		: 	function(data) {
												// console.log(data);
												// Se crea el nuevo contrato
												if(id_contrato == "otro"){
													var params = new FormData();
													params.append(\'url\', $(\'#url_contrato\')[0].files[0] );
													params.append(\'origenes\', $("select[name=\'origenes\']").val() );
													params.append(\'destinos\', $("select[name=\'destinos\']").val() );
													params.append(\'tipos_vehiculo\', $("select[name=\'tipos_vehiculo\']").val() );

													let $_condiciones = "";
													$(".param_condiciones:checked").each(function(){
														$_condiciones+= $(this).val() + ",";
														params.append(\'condicion_\' + $(this).val(), $("#condicion_" + $(this).val() + "_val").val() );
													});
													params.append(\'id_condiciones\', $_condiciones );

													$.ajax({
														url: "' . $url . '?action=sube_contrato",
														type: \'POST\',
														data: params,
														dataType: \'json\',
														cache: false,
														contentType: false,
														processData:false,
														error: function (jqXHR, textStatus, errorThrown){
															console.log(jqXHR);
															console.log(textStatus);
															console.log(errorThrown);
														},
														success: function (data, textStatus, jqXHR){
															console.log(data);
														}
													});
												} 

												// Se crean las actividades
												var grupo = $(\'#grupo\').val();
												var actividades = $(\'#cant_actividades_\').val();
												$("#formulario_").html("");
												for ( var j=1; j <= actividades; j++) { 
													// console.log("Valor de arrayActividades " + j);

													var nombre_actividad = $("#nombre_" + j).val();
													var descripcion = $("#descripcion_" + j).val();
													var id_centro_costo = $("#slct_id_centro_costo_" + j).val();
													var orden = $("#orden_" + j).val();
													var actividad_previa = $("#actividad_previa_" + j).val();
													var bloque = $("#bloque_" + j).val();
													var simultaneo = $("#simultaneo_" + j).val();
													var urbaneo = $("#urbaneo_" + j).val();
													var perfil_responsable = $("#slct_perfil_responsable_" + j).val();
													var documentos = $("#documentos_" + j).val();
													var tiempo_estimado = $("#tiempo_aprobado_" + j).val();
													var costo_estimado = $("#costo_aprobado_" + j).val();
													var moneda = $("#moneda_" + j).val();
													var adjunto = $("#adjunto_" + j).val();
													var integracion = $("#integracion_" + j).val();
													var sub_integracion = $("#sub_integracion_" + j).val();
													var tipo_actividad = $("#tipo_actividad_" + j).val();

													var id_form = "form_" + j;

													$("#formulario_").append("<form id=\"" + id_form + "\"><input type=\"text\" name=\"nombre\" class=\"tmp_field\" value=\"" + nombre_actividad + "\" ><input type=\"text\" name=\"descripcion\" class=\"tmp_field\" value=\"" + descripcion + "\" ><input type=\"text\" name=\"actividad_previa\" class=\"tmp_field\" value=\"" + actividad_previa + "\" ><input type=\"text\" name=\"orden\" class=\"tmp_field\" value=\"" + orden + "\" ><input type=\"text\" name=\"documentos\" class=\"tmp_field\" value=\"" + documentos + "\" ><input type=\"text\" name=\"tiempo_aprobado\" class=\"tmp_field\" value=\"" + tiempo_estimado + "\" ><input type=\"text\" name=\"costo_aprobado\" class=\"tmp_field\" value=\"" + costo_estimado + "\" ><input type=\"text\" name=\"moneda\" class=\"tmp_field\" value=\"" + moneda + "\" ><input type=\"text\" name=\"perfil_responsable\" class=\"tmp_field\" value=\"" + perfil_responsable + "\" ><input type=\"text\" name=\"id_centro_costo\" class=\"tmp_field\" value=\"" + id_centro_costo + "\" ><input type=\"text\" name=\"bloque\" class=\"tmp_field\" value=\"" + bloque + "\" ><input type=\"text\" name=\"simultaneo\" class=\"tmp_field\" value=\"" + simultaneo + "\" ><input type=\"text\" name=\"urbaneo\" class=\"tmp_field\" value=\"" + urbaneo + "\" ><input type=\"text\" name=\"grupo\" class=\"tmp_field\" value=\"" + grupo + "\" ><input type=\"text\" name=\"integracion\" class=\"tmp_field\" value=\"" + integracion + "\" ><input type=\"text\" name=\"sub_integracion\" class=\"tmp_field\" value=\"" + sub_integracion + "\" ><input type=\"text\" name=\"tipo_actividad\" class=\"tmp_field\" value=\"" + tipo_actividad + "\" ><input type=\"text\" name=\"adjunto\" class=\"tmp_field\" value=\"" + adjunto + "\" ><br /></form><br />");

														$.ajax({
															type		: "POST",
															cache		: false,
															url			: "' . $url_1 . '",
															data		: $("#" + id_form).serialize(),
															dataType	: "json",
															beforeSend	: 	function(jqXHR, settings){
																				$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
																			},
															error 		: 	function(data) {
																				console.log(data);
																				console.log(data.control);
																				console.log(data.error);
																			},
															success		: 	function(data) {
																				// console.log(data);
																				console.log(data.control);
																				console.log(data.error);
																			}
														});
												}
												setTimeout(function() { location.reload(false);  }, 600);
											}
										});
										$.ajaxSetup({async: true});
										break;

									case "INTERNACIONAL":
										var str = $("#form_%id%").serialize();
										var params = $("#form_%id%").serialize();
										params = params + "&cant_contenedores=" + cant_contenedores;

										$.ajaxSetup({async: false});
										$.ajax({
											type		: "POST",
											cache		: false,
											url			: "' . $url . '?action=insertar_internacional",
											data		: params,
											beforeSend	: function(jqXHR, settings){
															$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
											},
											error 		: 	function(data){
																console.log(data);
																console.log(data.control);
																console.log(data.error);
															},
											success		: 	function(data) {
																// console.log(data);

																var grupo = $(\'#grupo\').val();
																var actividades = $(\'#cant_actividades_\').val();
																$("#formulario_").html("");
																for ( var j=1; j <= actividades; j++) { 
																	// console.log("Valor de arrayActividades " + j);

																	var nombre_actividad = $("#nombre_" + j).val();
																	var descripcion = $("#descripcion_" + j).val();
																	var id_centro_costo = $("#slct_id_centro_costo_" + j).val();
																	var orden = $("#orden_" + j).val();
																	var actividad_previa = $("#actividad_previa_" + j).val();
																	var bloque = $("#bloque_" + j).val();
																	var simultaneo = $("#simultaneo_" + j).val();
																	var urbaneo = $("#urbaneo_" + j).val();
																	var perfil_responsable = $("#slct_perfil_responsable_" + j).val();
																	var documentos = $("#documentos_" + j).val();
																	var tiempo_estimado = $("#tiempo_aprobado_" + j).val();
																	var costo_estimado = $("#costo_aprobado_" + j).val();
																	var moneda = $("#moneda_" + j).val();
																	var adjunto = $("#adjunto_" + j).val();
																	var integracion = $("#integracion_" + j).val();
																	var sub_integracion = $("#sub_integracion_" + j).val();
																	var tipo_actividad = $("#tipo_actividad_" + j).val();

																	var id_form = "form_" + j;

																	$("#formulario_").append("<form id=\"" + id_form + "\"><input type=\"text\" name=\"nombre\" class=\"tmp_field\" value=\"" + nombre_actividad + "\" ><input type=\"text\" name=\"descripcion\" class=\"tmp_field\" value=\"" + descripcion + "\" ><input type=\"text\" name=\"actividad_previa\" class=\"tmp_field\" value=\"" + actividad_previa + "\" ><input type=\"text\" name=\"orden\" class=\"tmp_field\" value=\"" + orden + "\" ><input type=\"text\" name=\"documentos\" class=\"tmp_field\" value=\"" + documentos + "\" ><input type=\"text\" name=\"tiempo_aprobado\" class=\"tmp_field\" value=\"" + tiempo_estimado + "\" ><input type=\"text\" name=\"costo_aprobado\" class=\"tmp_field\" value=\"" + costo_estimado + "\" ><input type=\"text\" name=\"moneda\" class=\"tmp_field\" value=\"" + moneda + "\" ><input type=\"text\" name=\"perfil_responsable\" class=\"tmp_field\" value=\"" + perfil_responsable + "\" ><input type=\"text\" name=\"id_centro_costo\" class=\"tmp_field\" value=\"" + id_centro_costo + "\" ><input type=\"text\" name=\"bloque\" class=\"tmp_field\" value=\"" + bloque + "\" ><input type=\"text\" name=\"simultaneo\" class=\"tmp_field\" value=\"" + simultaneo + "\" ><input type=\"text\" name=\"urbaneo\" class=\"tmp_field\" value=\"" + urbaneo + "\" ><input type=\"text\" name=\"grupo\" class=\"tmp_field\" value=\"" + grupo + "\" ><input type=\"text\" name=\"integracion\" class=\"tmp_field\" value=\"" + integracion + "\" ><input type=\"text\" name=\"sub_integracion\" class=\"tmp_field\" value=\"" + sub_integracion + "\" ><input type=\"text\" name=\"tipo_actividad\" class=\"tmp_field\" value=\"" + tipo_actividad + "\" ><input type=\"text\" name=\"adjunto\" class=\"tmp_field\" value=\"" + adjunto + "\" ><br /></form><br />");

																		$.ajax({
																			type		: "POST",
																			cache		: false,
																			url			: "' . $url_1 . '",
																			data		: $("#" + id_form).serialize(),
																			dataType	: "json",
																			beforeSend	: 	function(jqXHR, settings){
																								$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
																							},
																			error 		: 	function(data) {
																								console.log(data);
																								console.log(data.control);
																								console.log(data.error);
																							},
																			success		: 	function(data) {
																								// console.log(data);
																								console.log(data.control);
																								console.log(data.error);
																							}
																		});
																}
																setTimeout(function() { location.reload(false);  }, 600);
															}
										});
										$.ajaxSetup({async: true});
										break;
								}
							}
							if(msg_error){
								flag_click = false;
								// console.log(msg_error);
								$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close-circle-o"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong><br />\' + msg_error + \'</div></div>\');
								$("html, body").animate({ scrollTop: 0 }, 600);
							}
						}
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	// Subir material de Importación 
	public function _form_modal_material_importacion_upload($id, $title, $content, $table)
	{
		$idPopup = "edita_" . $id;
		$dbTable = "cmx_" . $table;

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%" enctype="multipart/form-data" method="POST">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url = BASE_URL . 'libs/importaciones.php?action=sube_material';

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de generación de materiales");
						var msg_error = "";

						var adjunto = $("#url_adjunto").val();
						console.log("Este es el valor del adjunto " + adjunto + "\n");

						if(adjunto){
							// se valida el formato del archivo
							var file = adjunto.split(".");
							var posiciones = file.length;
							if(file[posiciones-1] == "csv"){
								// se recibe el archivo adjunto
								var formData = new FormData($("#form_%id%")[0]);
								$(".nexos-messages").hide();
								if(formData){
									console.log("es un archivo");

									$.ajax({
										url 		: "' . $url . '",
										type 		: "POST",
										data 		: formData,
										dataType	: "json",
										contentType : false,
										processData	: false,
										beforeSend	: function(jqXHR, settings){
														console.log("entro en el ajax de envio de archivo");
														$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
														console.log(data);
														$(".nexos-messages").hide();
														$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Error en la creacion del registro.</div></div>\');
										},
										success		: function(data) {
														console.log(data.control);
														console.log(data.error);
														$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
										}
									})
								}
								else{
									console.log("No hay archivo a Adjuntar");
									msg_error+= "<p>Debe seleccionar un archivo de materiales para poder incluirlos en la importación.</p>";
								}
							}else{
								msg_error+= "<p>Formato de archivo debe estar e formato <strong>.csv</strong> para poder incluir el material de la importación.</p>";
							}
						}else{
							console.log("No hay archivo");
							msg_error+= "<p>Debe seleccionar un archivo de materiales para poder incluirlos en la importación.</p>";
						}
						if(msg_error){
							$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>\' + msg_error + \'</div></div>\');
							$("html, body").animate({ scrollTop: 0 }, 600);
						}
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	// Desconsolidar material del proyecto
	public function _form_modal_importacion_desconsolidar($id, $title, $content)
	{
		$idPopup = "edita_" . $id;
		$url = BASE_URL . 'libs/importaciones.php?action=desconsolidar';

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									<div class="text-right">
										<span>(*) Campos Obligatorios</span>
									</div>
									<br>
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';

		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de desconsolidación");

						$(".nexos-messages").html(\'\');
						msg_error = "";
						var cantidad_material = 0;
						var cantidad_solicitada = 0;
						var flag_contenido_material = true;
						var id_materiales = $("#id_materiales_' . $id . '").val();
						var num_materiales = $("#num_materiales_' . $id . '").val();

						if(id_materiales){
							var arrayMateriales = id_materiales.split(",");

							// si solo se selecciona 1 material verifico que el material solicitado sea menor que la cantidad total del material
							if( (arrayMateriales.length - 1) == 1){
								cantidad_material = $("#cantidad_' . $id . '-" + arrayMateriales[0] ).val();
								cantidad_solicitada = $("#cantidad_solicitada_' . $id . '-" + arrayMateriales[0] ).val();
								if( parseInt(cantidad_solicitada) < 1 ){
									msg_error+= "<p>No puede realizar una desconsolidación del material con una cantidad en 0 o menor.</p>";
								}
								if( cantidad_material == cantidad_solicitada && num_materiales == 1 ){
									msg_error+= "<p>No puede desconsolidar un sólo material completo, debe seleccionar una cantidad menor al la cantidad total de la mercancia disponible.</p>";
								}
								if( parseInt(cantidad_solicitada) > parseInt(cantidad_material) ){
									msg_error+= "<p>La cantidad a desconsolidar excede a la cantidad disponible del material.</p>";
								}
							}else{
								for ( var j=0; j < arrayMateriales.length-1; j++) { 
									cantidad_material = $("#cantidad_' . $id . '-" + arrayMateriales[j] ).val();
									cantidad_solicitada = $("#cantidad_solicitada_' . $id . '-" + arrayMateriales[j] ).val();

									if( ( arrayMateriales.length - 1 ) == parseInt(num_materiales) ){
										var flag_contenido_material = false;
										if( parseInt(cantidad_material) != parseInt(cantidad_solicitada) ){
											flag_contenido_material = true;
											break;
										}
									}

									if(	parseInt(cantidad_solicitada) > parseInt(cantidad_material) && parseInt(num_materiales) > 1 ){
										msg_error+= "<p>La cantidad a desconsolidar excede a la cantidad disponible del material.</p>";
									}
								}

								if(!flag_contenido_material){
									msg_error+= "<p>No puede realizar una desconsolidación de todo el material de la importación.</p>";
								}
							}
							if(!msg_error){
								console.log("Todo Ok para la desconsolidación");
								$.ajax({
									type		: "POST",
									cache		: false,
									url			: "' . $url . '",
									data		: $("#form_%id%").serialize(),
									dataType	: "json",
									beforeSend	: function(jqXHR, settings){
													$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
									},
									error 		: function(data){
													console.log(data);
													console.log(data.control);
													console.log(data.error);
												},
									success		: function(data) {
													console.log(data.control);
													console.log(data.error);
													setTimeout(function() { location.reload(\'' . BASE_URL . '/importacion/ver_actividades/\');  }, 1000);
									}
								});
							}
						}else{
							msg_error+= "<p>Debe seleccionar el material para poder desconsolidar la importación.</p>";
						}

						if(msg_error){
							$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong> \' + msg_error + \'</div></div>\');
							$("html, body").animate({ scrollTop: 0 }, 600);
						}
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}
	/*************** FIN MÓDULO IMPORTACIONES ****************/


	/*************** FIN MÓDULO PLANILLAR Y ANTICIPOS ****************/
	// Asignación de anticipos
	public function _form_modal_update_validate($id, $title, $content, $table)
	{
		$idPopup = "edita_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/asignar_anticipo.php?tabla=' . $dbTable;
		$url_gestion_actividad = BASE_URL . 'libs/gestion_actividades.php?tabla=cmx_importacion_actividades&proyecto=importaciones';

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									<div class="text-right">
										<span>(*) Campos Obligatorios</span>
									</div>
									<br>
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';

		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						$(".nexos-messages").html("");
						var msg_error = "";

						var modulo = $(\'input[name=modulo]\').val();
						switch(modulo){
							case "planillar":
								if(!$(\'#numero_manifiesto_' . $id . '\').val()){
									msg_error+="<p>Debe diligenciar el campo <strong>Manifiesto</strong> para poder continuar.</p>";
								}
								if(!$(\'#slct_agencia_' . $id . '\').val()){
									msg_error+="<p>Debe diligenciar el campo <strong>Agencia</strong> para poder continuar.</p>";
								}
								if(!$(\'#flete_' . $id . '\').val()){
									msg_error+="<p>Debe diligenciar el campo <strong>Flete</strong> para poder continuar.</p>";
								}else if($(\'#flete_' . $id . '\').val() > $(\'#param_flete_' . $id . '\').val() ){
									msg_error+="<p>El flete no puede superar el valor establecido de <strong>$ " + $(\'#param_flete_' . $id . '\').val() + "</strong>.</p>";
								}
								if(!$(\'#slct_porcentaje_anticipo_' . $id . '\').val()){
									msg_error+="<p>Debe diligenciar el campo <strong>% Anticipo</strong> para poder continuar.</p>";
								}else{
									if( $(\'#slct_porcentaje_anticipo_' . $id . '\').val() != 0 ){
										if(!$("#slct_metodo_desembolso_' . $id . '").val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Método de Desembolso</strong> para poder continuar.</p>";
										}
										if(!$("#slct_beneficiario_' . $id . '").val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Beneficiario</strong> para poder continuar.</p>";
										}
									} 
								}
								if( $("#param_trailer_' . $id . '").val() == 1 ){
									if( !$("#placa_trailer_' . $id . '").val() ){
										msg_error+="<p>Debe diligenciar el campo <strong>Placa Trailer</strong> para poder continuar.</p>";
									}
								}

								var arrayValidaOrden = [];
								var flag_valida_orden = true;
								$(".orden_' . $id . '").each(function(){
									if( !arrayValidaOrden[ $(this).val() ] ){
										arrayValidaOrden[ $(this).val() ] = $(this).val();
									}else{
										flag_valida_orden = false;
									}
								});
								if( !flag_valida_orden ){
									msg_error+="<p>Debe establecer el orden de los tramos de forma correcta para poder continuar.</p>";
								}

								var origen_manifiesto = $(\'input[name=CODMUNICIPIOORIGENMANIFIESTO_\' + ' . $id . ' + \']\').val();
								var destino_manifiesto = $(\'input[name=CODMUNICIPIODESTINOMANIFIESTO_\' + ' . $id . ' + \']\').val();

								// Se buscan las solicitudes asociadas al Agrupamiento para determianr el origen y destino RNDC  
								var solicitudes = $(\'input[name=solicitudes_\' + ' . $id . ' + \']\').val();
								var arraySolicitudes = solicitudes.split(",");
								var rndc_complemento = "";

								for(var i = 0; i < (arraySolicitudes.length - 1); i++){
									var rndc_doc_origen = $(\'input[name=NUMIDREMITENTE_\' + arraySolicitudes[i] + \']\').val();
									var rndc_sede_origen = $(\'input[name=CODSEDEREMITENTE_\' + arraySolicitudes[i] + \']\').val();
									var rndc_origen = $(\'input[name=CODMUNICIPIOORIGENINFOVIAJE_\' + arraySolicitudes[i] + \']\').val();
									var rndc_doc_destino = $(\'input[name=NUMIDDESTINATARIO_\' + arraySolicitudes[i] + \']\').val();
									var rndc_sede_destino = $(\'input[name=CODSEDEDESTINATARIO_\' + arraySolicitudes[i] + \']\').val();
									var rndc_destino = $(\'input[name=CODMUNICIPIODESTINOINFOVIAJE_\' + arraySolicitudes[i] + \']\').val();

									rndc_complemento+= "&CODMUNICIPIOORIGENINFOVIAJE_" + arraySolicitudes[i] + "=" + rndc_origen + "&CODMUNICIPIODESTINOINFOVIAJE_" + arraySolicitudes[i] + "=" + rndc_destino + "&NUMIDREMITENTE_" + arraySolicitudes[i] + "=" + rndc_doc_origen + "&NUMIDDESTINATARIO_" + arraySolicitudes[i] + "=" + rndc_doc_destino + "&CODSEDEREMITENTE_" + arraySolicitudes[i] + "=" + rndc_sede_origen + "&CODSEDEDESTINATARIO_" + arraySolicitudes[i] + "=" + rndc_sede_destino ;

									if( $(\'input[name=PESOCONTENEDORVACIO_\' + arraySolicitudes[i] + \']\').val() ){
										var rndc_peso_contenedor = $(\'input[name=PESOCONTENEDORVACIO_\' + arraySolicitudes[i] + \']\').val();
										rndc_complemento+= "&PESOCONTENEDORVACIO_" + arraySolicitudes[i] + "=" + rndc_peso_contenedor;
									}
								}

								rndc_complemento+= "&CODMUNICIPIOORIGENMANIFIESTO=" + origen_manifiesto + "&CODMUNICIPIODESTINOMANIFIESTO=" + destino_manifiesto;

								rndc_complemento+= "&solicitudes" + arraySolicitudes[i] + "=" + solicitudes;
								break;

							case "anticipo":
								// console.log("entro en anticipo js");

								if(!$(\'#comprobante_egreso_' . $id . '\').val()){
									msg_error+="<p>Debe diligenciar el campo <strong>Comprobante de Egreso</strong> para poder continuar.</p>";
								}
								if(!$(\'#cuenta_' . $id . '\').val()){
									msg_error+="<p>Debe diligenciar el campo <strong>Cuenta</strong> para poder continuar.</p>";
								}

								var metodo_desembolso = $("#metodo_desembolso_' . $id . '").val();
								switch(metodo_desembolso) {
									case "Tarjeta Débito":
										if(!$(\'#pin_tarjeta_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Número de Tarjeta</strong> para poder continuar.</p>";
										}
										if(!$(\'#clave_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Clave</strong> para poder continuar.</p>";
										}
										break;

									case "Cuenta Personal":
										if(!$(\'#banco_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Entidad Bancaria</strong> para poder continuar.</p>";
										}
										if(!$(\'#tipo_cuenta_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Tipo de Cuenta</strong> para poder continuar.</p>";
										}
										if(!$(\'#num_cuenta_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Número de Cuenta</strong> para poder continuar.</p>";
										}
										if(!$(\'#documento_titular_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Documento del Titular</strong> para poder continuar.</p>";
										}
										if(!$(\'#nombre_titular_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Nombre del Titular</strong> para poder continuar.</p>";
										}
										break;

									case "Cheque":
										if(!$(\'#numero_cheque_' . $id . '\').val()){
											msg_error+="<p>Debe diligenciar el campo <strong>Número de Cheque</strong> para poder continuar.</p>";
										}
										break;

									default:
										msg_error+= "<p>Debe seleccionar un método de desembolso del anticipo para poder continuar.</p>";
										break;
								}
							break;
						}

						// console.log( $("#form_%id%").serialize() );
						var data = $("#form_%id%").serialize();
						if( rndc_complemento ){
							data = $("#form_%id%").serialize() + rndc_complemento;
						}
						// console.log(data);

						if(!msg_error){
							if( modulo == "anticipo" ){
								// Se abre url de creacion de archivo Excel de anticipos
								var id_agrupacion = $("#id_agrupacion_' . $id . '").val();
								var cuenta = $("#cuenta_' . $id . '").val();
								window.open("' . BASE_URL . 'libs/helisa_ajax.php?action=generaExcelAnticipos&id_agrupacion=" + id_agrupacion + "&cuenta=" + cuenta, "_blank");
							}

							$.ajax({
								type		: "POST",
								cache		: false,
								url			: "' . $url . '",
								dataType	: "json",
								data		: data,
								beforeSend	: function(jqXHR, settings){
									$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
								},
								error 		: function(data){
									// console.log(data);
											},
								success		: function(data) {
									// console.log(data);
									if(modulo && !data.error){
										for(i=0; i < $(\'#cant_materiales_' . $id . '\').val(); i++) { 
											var id = $(\'#id_' . $id . '_\' + i).val() + ",";
											var id_importacion = $(\'#id_importacion_' . $id . '_\' + i).val();
											var id_material = $(\'#id_material_' . $id . '_\' + i).val() + ",";
											var orden = $(\'#orden_' . $id . '_\' + i).val();
											var tipo_actividad = $(\'#tipo_actividad_' . $id . '_\' + i).val();
											var fecha_hora_inicio = $(\'#fecha_hora_inicio_' . $id . '_\' + i).val();
											var costo_real = $(\'#costo_real_' . $id . '_\' + i).val();
											var respuesta = $(\'#respuesta_' . $id . '_\' + i).val();

											var params = {
												id 					: id,
												id_importacion		: id_importacion,
												id_material			: id_material,
												orden				: orden,
												tipo_actividad 		: tipo_actividad,
												fecha_hora_inicio	: fecha_hora_inicio,
												costo_real 			: costo_real,
												respuesta 			: respuesta
											};
											// console.log(params);
											$.ajaxSetup({async: false});
											$.ajax({
												type		: "POST",
												cache		: false,
												url			: "' . $url_gestion_actividad . '",
												data		: params,
												beforeSend	: function(jqXHR, settings){
												},
												error: function (jqXHR, textStatus, errorThrown)
												{
													console.log(jqXHR);
													console.log(textStatus);
													console.log(errorThrown);
												},
												success		: function(data) {
													// console.log(data);
												}
											});
											$.ajaxSetup({async: true});
										}

										// Se pregunta si el anticipo es igual a 0
										if( modulo == "planillar" && $(\'#slct_porcentaje_anticipo_' . $id . '\').val() == 0 ){
											// Si el anticipo es == a 0 se gestionan las actividades anticipo e informar anticipo al conductor
											for(i=0; i < $(\'#cant_materiales_' . $id . '\').val(); i++) { 
												// Se gestiona la actividad Anticipo
												var id = $(\'#id_actividad_anticipo_' . $id . '_\' + i).val() + ",";
												var id_importacion = $(\'#id_importacion_anticipo_' . $id . '_\' + i).val();
												var id_material = $(\'#id_material_anticipo_' . $id . '_\' + i).val() + ",";
												var orden = $(\'#orden_anticipo_' . $id . '_\' + i).val();
												var tipo_actividad = $(\'#tipo_actividad_anticipo_' . $id . '_\' + i).val();
												var fecha_hora_inicio = $(\'#fecha_hora_inicio_' . $id . '_\' + i).val();
												var costo_real = $(\'#costo_real_anticipo_' . $id . '_\' + i).val();
												var respuesta = $(\'#respuesta_anticipo_' . $id . '_\' + i).val();

												var params = {
													id 					: id,
													id_importacion		: id_importacion,
													id_material			: id_material,
													orden				: orden,
													tipo_actividad 		: tipo_actividad,
													fecha_hora_inicio	: fecha_hora_inicio,
													costo_real 			: costo_real,
													respuesta 			: respuesta
												};
												$.ajaxSetup({async: false});
												$.ajax({
													type		: "POST",
													cache		: false,
													url			: "' . $url_gestion_actividad . '",
													data		: params,
													beforeSend	: function(jqXHR, settings){
													},
													error: function (jqXHR, textStatus, errorThrown)
													{
														console.log(jqXHR);
														console.log(textStatus);
														console.log(errorThrown);
													},
													success		: function(data) {
														// console.log(data);
													}
												});
												$.ajaxSetup({async: true});

												// Se gestiona la actividad Informar Anticipo
												var id = $(\'#id_actividad_informar_' . $id . '_\' + i).val() + ",";
												var id_importacion = $(\'#id_importacion_informar_' . $id . '_\' + i).val();
												var id_material = $(\'#id_material_informar_' . $id . '_\' + i).val() + ",";
												var orden = $(\'#orden_informar_' . $id . '_\' + i).val();
												var tipo_actividad = $(\'#tipo_actividad_informar_' . $id . '_\' + i).val();
												var fecha_hora_inicio = $(\'#fecha_hora_inicio_' . $id . '_\' + i).val();
												var costo_real = $(\'#costo_real_informar_' . $id . '_\' + i).val();
												var respuesta = $(\'#respuesta_informar_' . $id . '_\' + i).val();

												var params = {
													id 					: id,
													id_importacion		: id_importacion,
													id_material			: id_material,
													orden				: orden,
													tipo_actividad 		: tipo_actividad,
													fecha_hora_inicio	: fecha_hora_inicio,
													costo_real 			: costo_real,
													respuesta 			: respuesta
												};
												$.ajaxSetup({async: false});
												$.ajax({
													type		: "POST",
													cache		: false,
													url			: "' . $url_gestion_actividad . '",
													data		: params,
													beforeSend	: function(jqXHR, settings){
													},
													error: function (jqXHR, textStatus, errorThrown)
													{
														console.log(jqXHR);
														console.log(textStatus);
														console.log(errorThrown);
													},
													success		: function(data) {
														// console.log(data);
													}
												});
												$.ajaxSetup({async: true});
											}
										}
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha actualizado el registro con éxito.</div></div>\');
										$("html, body").animate({ scrollTop: 0 }, 600);
										setTimeout(function() { location.reload(false); }, 800);
									}else{
										var msg_error = data.error.replace(/\n/g , "</p><p>");

										$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>\' + msg_error + \'</div></div>\');
										$("html, body").animate({ scrollTop: 0 }, 600);
									}
								}
							});
						}

						if(msg_error){
							$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>\' + msg_error + \'</div></div>\');
							$("html, body").animate({ scrollTop: 0 }, 600);
						}
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}
	/*************** FIN MÓDULO PLANILLAR Y ANTICIPOS ****************/


	/*************** MÓDULO CONTROL AGRUPACIONES ****************/
	// Aprobación de tarifa en módulo "Control Rentabiliad"  
	public function _alert_modal_mod_success_control($id, $content, $table)
	{
		$idPopup = "habilita_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<!-- Nifty div id="mod-success" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-success"><span class="modal-main-icon mdi mdi-check-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="estado" value="1">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-success">Aceptar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de habilitar");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion habilitar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion habilitar : id - ' . $id . '");
											console.log("entro en funcion habilitar : tabla - ' . $table . '");
											console.log("entro en funcion habilitar : bd tabla - ' . $dbTable . '");
											console.log("entro en funcion habilitar : url - ' . $url . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha habilitado el registro con éxito.</div></div>\');
										setTimeout(function() { location.reload(false);  }, 500);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}

	public function _alert_modal_mod_danger_control($id, $content, $table)
	{
		$idPopup = "elimina_" . $id;
		$dbTable = "cmx_" . $table;
		$url = BASE_URL . 'libs/editar.php?tabla=' . $dbTable;

		$_popup[0] = '
				<!-- Nifty div id="mod-danger" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-danger"><span class="modal-main-icon mdi mdi-close-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="estado" value="0">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-danger">Eliminar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);


		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de inactivar");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											console.log("Entra en la funcion inactivar ajax...");
											console.log("Informacion de data... " + $("#form_%id%").serialize());
											console.log("entro en funcion inactivar : id - ' . $id . '");
											console.log("entro en funcion inactivar : tabla - ' . $table . '");
											console.log("entro en funcion inactivar : bd tabla - ' . $dbTable . '");
											console.log("entro en funcion inactivar : url - ' . $url . '");
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha inactivado el registro con éxito.</div></div>\');
										$("#table1").hide();
										setTimeout(function() { location.reload(false);  }, 500);
							}
						});
					});

				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}
	/*************** FIN MÓDULO CONTROL AGRUPACIONES ****************/


	/*************** MÓDULO CREACIUÓN DE PUESTOS DE CONTROL Y RUTAS  ****************/
	// FORMULARIO PARA ORDENAMIENTO DE LAS RUTAS
	public function _form_modal_multiple_insert_orden_rutas($id, $title, $content, $table, $accion, $orden_compra, $orden)
	{
		$idPopup = $id;
		$dbTable = "cmx_" . $table;

		$_popup[0] = '
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade colored-header colored-header-primary">
					<div class="modal-dialog custom-width">
						<div class="modal-content">
							<form id="form_%id%">
								<div class="modal-header">
									<button type="button" data-dismiss="modal" aria-hidden="true" class="close md-close"><span class="mdi mdi-close"></span></button>
									<h3 class="modal-title">%title%</h3>
								</div>
								<div class="modal-body">
									%content%
								</div>
								<div class="modal-footer">
									<button type="button" data-dismiss="modal" class="btn btn-default md-close">Cancelar</button>
									<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-success md-close">Guardar</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%title%", $title, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url_ordenamiento = BASE_URL . 'libs/ordenar_ruta.php?tabla=' . $dbTable . '&accion=' . $accion;

		switch ($accion) {
			case 'adicionar':
				$_popup[1] = '
						<script type="text/javascript">
							$("#btn_%id%").click(function () {
								console.log("Entro en funcion de adicionar punto de control con orden");
								msg_error = "";
								// Se validan datos del formulario
								if( $(\'select[id=slct_punto_control_' . $orden_compra . $orden . ']\').val() == "nada" ){
									msg_error+= "<p>Debe seleccionar un <strong>Punto de Control Previo</strong> para poder continuar.</p>";
								}

								if( !$(\'select[id=slct_nuevo_punto_control_' . $orden_compra . $orden . ']\').val() ){
									msg_error+= "<p>Debe seleccionar un <strong>Punto de Control</strong> para poder continuar.</p>";
								}
								if( !$(\'#tiempo\').val() ){
									msg_error+= "<p>Debe Diligenciar el campo <strong>Tiempo estimado</strong> para poder continuar.</p>";
								}
								if( !$(\'select[id=slc_medida_tiempo]\').val() ){
									msg_error+= "<p>Debe seleccionar un <strong>Medida de Tiempo</strong> para poder continuar.</p>";
								}

								if(!msg_error){
									var id_mapa_ruta = $(\'input[name=id_mapa_ruta]\').val();
									console.log("funcion de ordenamiento de actividades");
									$.ajax({
										type		: "POST",
										cache		: false,
										url			: "' . $url_ordenamiento . '",
										data		: $("#form_%id%").serialize(),
										beforeSend	: function(jqXHR, settings){
														$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
													console.log(data);
										},
										success		: function(data) {
													console.log(data);
													$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Éxito!</strong><p>Se ha creado el registro.</p></div></div>\');
													$("html, body").animate({ scrollTop: 0 }, 600);
													setTimeout(function() { location.reload(false); }, 800);
										}
									});
								}else{
									console.log("No hay");
									$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error en el Proceso!</strong>\' + msg_error + \' </div></div>\');
									$("html, body").animate({ scrollTop: 0 }, 600);
								}
							});
						</script>
					';

				$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);
				break;

			case 'modificar':
				$_popup[1] = '
						<script type="text/javascript">
							$("#btn_%id%").click(function () {
								console.log("Entro en funcion de modificar ordenamiento de actividades");

								var array_orden = $(\'select[id=slct_actividades_plantilla_' . $orden_compra . $orden . ']\').val();
								console.log(array_orden);
								if(array_orden){
									console.log("Si hay");
									var orden_inicial = $(\'#orden_' . $orden_compra . $orden . '\').val();
									console.log("Orden actividad inicial " + orden_inicial);
									var orden_final = Math.max.apply(null, array_orden);
									console.log("Orden actividad previa deseada " + orden_final);

									var id_plantilla = $(\'input[name=id_plantilla]\').val();
									console.log("Carga a modificar " + id_plantilla);

									console.log("funcion de ordenamiento de actividades");
									$.ajax({
										type		: "POST",
										cache		: false,
										url			: "' . $url_ordenamiento . '",
										data		: "actividad_previa_deseada=" + orden_final + "&orden_inicial=" + orden_inicial + "&id_plantilla=" + id_plantilla,
										beforeSend	: function(jqXHR, settings){
														console.log("entro en funcion ordenar actividades : url - ' . $url_ordenamiento . '");
														console.log("Informacion de data... " + orden_final);
														$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
										},
										error		: function(data) {
													console.log("error");
													console.log(data);
										},
										success		: function(data) {
													console.log(data);
													$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha creado el registro con éxito.</div></div>\');
													setTimeout(function() { location.reload(false); }, 800);
										}
									});
								}else{
									console.log("No hay");
									$(".nexos-messages").html(\'<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error en el Proceso!</strong> Error en la creación del registro.</div></div>\');
									$("html, body").animate({ scrollTop: 0 }, 600);
								}
							});

						</script>
					';

				$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);
				break;
		}
		return $_popup;
	}

	// FORMULARIO PARA LA INACTIVACION DE LAS ACTIVIDADES DE LA PLANTILLA
	public function _alert_modal_actividad_danger_rutas($id, $id_mapa_ruta, $content, $table, $accion, $orden)
	{
		$idPopup = "elimina_" . $id;
		$dbTable = "cmx_" . $table;

		$_popup[0] = '
				<!-- Nifty div id="mod-danger" Modal-->
				<div id="%id%" tabindex="-1" role="dialog" class="modal fade">
					<div class="modal-dialog">
						<div class="modal-content">
							<div class="modal-header">
								<button type="button" data-dismiss="modal" aria-hidden="true" class="close"><span class="mdi mdi-close"></span></button>
							</div>
							<div class="modal-body">
								<div class="text-center">
									<form id="form_%id%">
										<div class="text-danger"><span class="modal-main-icon mdi mdi-close-circle"></span></div>
										<h3>Alerta!</h3>
										<p>%content%</p>
										<div class="xs-mt-50">
											<input type="hidden" name="id" value="' . $id . '">
											<input type="hidden" name="id_mapa_ruta" value="' . $id_mapa_ruta . '">
											<input type="hidden" name="orden" value="' . $orden . '">
											<input type="hidden" name="estado" value="0">
											<button type="button" data-dismiss="modal" class="btn btn-space btn-default">Cancelar</button>
											<button id="btn_%id%" type="button" data-dismiss="modal" class="btn btn-space btn-danger">Eliminar</button>
										</div>
									</form>
								</div>
							</div>
							<div class="modal-footer"></div>
						</div>
					</div>
				</div>
			';
		$_popup[0] = str_replace("%id%", $idPopup, $_popup[0]);
		$_popup[0] = str_replace("%content%", $content, $_popup[0]);

		$url = BASE_URL . 'libs/ordenar_ruta.php?tabla=' . $dbTable . '&accion=' . $accion;

		$_popup[1] = '
				<script type="text/javascript">
					$("#btn_%id%").click(function () {
						console.log("Entro en funcion de inactivar punto de control");
						$.ajax({
							type		: "POST",
							cache		: false,
							url			: "' . $url . '",
							data		: $("#form_%id%").serialize(),
							beforeSend	: function(jqXHR, settings){
											// console.log("Informacion de data... " + $("#form_%id%").serialize());
											$(".nexos-messages").html(\'<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' . BASE_URL . 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>\');
							},
							success		: function(data) {
										console.log(data);
										$(".nexos-messages").html(\'<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> Se ha inactivado el registro con éxito.</div></div>\');
										$("html, body").animate({ scrollTop: 0 }, 600);
										setTimeout(function() { location.reload(false); }, 800);
							}
						});
					});
				</script>
			';

		$_popup[1] = str_replace("%id%", $idPopup, $_popup[1]);

		return $_popup;
	}
	/*************** FIN MÓDULO CREACIUÓN DE PUESTOS DE CONTROL Y RUTAS  ****************/
}
