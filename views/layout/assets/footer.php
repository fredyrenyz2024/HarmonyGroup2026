<?php
$vista = '
<!-- fin del contenido  -->

<div class="footer navbar-fixed-bottom">
	<div class="row"
		style="height:25px;background-color:#37474F;margin:0px;color:white;padding:5px;text-align:center;font-size:10pt">
		<div class="col-lg-12">
			<span> Harmony Group / Bogota - Colombia / Logistica - Almacenamiento - Transporte de Carga Multimodal /
				Nacional e Internacional
			</span>
		</div>
	</div>


	<div id="divProcessing" align="center" style="display: none;background :#FFFFFF;">
		<span id="divProcessMessage" style="max-width: 100px;"></span>
		<img src="%root_file%img/spinner.gif" /><br><br>
	</div>



	
	<script src="%root_file%js/jquery-ui-1.10.4.custom.min.js" type="text/javascript"></script>
	<script src="%root_file%lib/nexos.min.js" type="text/javascript"></script>
	

</div>
</div>
</div>
</body>

</html>

	';

// Se establecen los parametros de vista para el módulo
$vista = str_replace("%root_file%", $_layoutParams["ruta_layout"], $vista);

echo $vista;

?>