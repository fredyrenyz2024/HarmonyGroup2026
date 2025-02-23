const w = window;
const d = document;

d.addEventListener('DOMContentLoaded', async e => {
  e.preventDefault();
  let params = new URLSearchParams(location.search);
  var manifi = params.get('m');
  // manifiesti_codigo = manifi;
  // listar_manifiestos_salida();
  Informacio_Principal(decodificarBase64(manifi));
  Informacion(decodificarBase64(manifi));

  d.addEventListener('click', async e => {
    if (e.target.matches('#btn_dar_salida') || e.target.matches('#btn_dar_salida *')) {
      var padre = e.target.parentElement.parentElement;
      var placa = padre.querySelector('#placa_c').value;
      var cedula = padre.querySelector('#cedula_c').value;
      var celular = padre.querySelector('#celular_c').value;

      if (w.confirm('¿Estas seguro de dar salida a este manifiesto?')) {
        /* Validar los campos requeridos para no hacer duplicidad de la informacion en seguimiento */
        var datos = new FormData();
        datos.append('placa', placa);
        datos.append('cedula', cedula);
        datos.append('celular', celular);
        try {
          const response = await fetch($('#id_url_ajax').val() + 'trafico/validar_parametros_para_salida', {
            method: 'POST',
            body: datos,
            cache: 'no-cache',
          });
          const data = await response.json();
          console.log('🚀 ~ d.addEventListener ~ data:', typeof data);

          if (data.estado === true) {
            $('#Modal_Mensajes').modal('toggle');
            d.getElementById(
              'texto_alerta',
            ).textContent = `El conductor se encuentra asociado al manifiesto ${data.dato}, el cual esta activo primero debe darle llegada.`;
          } else {
            // console.log('Error fallo validacion de ese', data.dato);
            Salida(decodificarBase64(manifi));
          }
        } catch (error) {
          console.error('Error en la primera solicitud:', error);
          console.log('error no inserta');
          throw error;
        } finally {
          // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
        }
      } else {
        console.log('Operacion cancelada');
      }
    }

    if (e.target.matches('#btn_listar_salidas') || e.target.matches('#btn_listar_salidas *')) {
      url = $('#id_url_ajax').val() + 'control_ruta/salida_trafico/?idmenu=5';
      window.open(url, '_self');
    }
    if (e.target.matches('#btn_cancelar_salida') || e.target.matches('#btn_cancelar_salida *')) {
      url = $('#id_url_ajax').val() + 'control_ruta/salida_trafico/?idmenu=5';
      window.open(url, '_self');
    }
  });
});

/* Funcion para llenar información principal de seguimiento */
function Informacio_Principal(manifi) {
  var tabla = {
    manifiesto: manifi,
  };

  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'trafico/seguimiento_ruta',
    type: 'POST',
    data: tabla,
    dataType: 'json',
    beforeSend: function() {
      // window.modal1.showModal();
      $('#loading-overlay-nexosapp ').css('display', 'flex'); // Mostrar mensaje de carga
    },
    success: function(data) {
      $('#loading-overlay-nexosapp ').css('display', 'none');
      if (data) {
        // window.modal1.close();
        data.forEach(function(element, index) {
          var dcondu = element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2;
          codigoPlan = element.cod_plan;
          codigoInicio = element.cod_inicio;
          d.getElementById('codigo_inicio_salida').value = codigoInicio;
          plan_ruta(codigoPlan, codigoInicio, manifi);
          $('.manifiesto').html(element.num_manifiesto);
          // $(".agencia").html(decodeURIComponent(escape(element.Lugar)));
          $('.agencia').html(element.Lugar);
          $('.conductor').html(dcondu);
          $('.documento').html(element.cond_cedula);
          $('#cedula_c').val(element.cond_cedula);
          $('.celular').html(element.celular);
          $('#celular_c').val(element.celular);
          $('.telefono').html(element.celular);
          $('.marca').html(element.marca);
          $('.linea').html(element.descripcion);
          $('.color').html(element.color);
          $('.operador-gps').html(element.operador_gps);
          $('.url-gps').attr('href', element.url);
          $('.url-gps').html(element.url);
          $('.usuario-gps').html(element.usuario_satelital);
          $('.usuario-salida').html(element.usuario);
          $('.remolque').html(element.serie_chasis);

          /* Segunda columna de la tabla de informacioón */
          $('.origen').html(element.origin);
          $('.destino').html(element.destini);
          $('.ruta').html(element.nombre_plan);
          $('.fecha-salida').html(element.fechasalida + '-' + element.horasalida);
          // $(".fecha-llegada").html(element.nombre_plan);
          $('.configuracion').html(element.configuracion);
          $('.carroceria').html(element.carrocerias);
          $('.id-gps').html(element.id);
          $('.clave-gps').html(element.clave_satelital);
          $('.placa').html(element.placa);
          $('#placa_c').val(element.placa);
          $('.modelo').html(element.anio_fabricacion);
          $('.fecha-llegada').html(
            element.fecha_descargue && element.hora_descargue
              ? element.fecha_descargue + '-' + element.hora_descargue
              : 'Sin resgistrar' + ' - ' + 'Sin resgistrar',
          );
        });
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      alert('ocurrio un error en consulta de tabla');
    },
  });
  $.ajaxSetup({async: true});
}

function Informacion(manifi) {
  $.post(
    $('#id_url_ajax').val() + 'tiempo_logistico_cargue/Selecciona_Ordenes',
    'manifiesto=' + manifi,
    function(data) {
      if (data) {
        data.forEach(element => {
          $('#tbl_informacion').append(`
            <tr>
              <td style="background-color: #FFCDD2;border-right:1px #ddd solid;font-weight:bold;">[${element.id}]</td>
              <td style="background-color: #FFCDD2;border-right:1px #ddd solid;font-weight:bold;">[${element.Remesa}]</td>
              <td style="border-right:1px #ddd solid;">0000-00-00 00-00-00</td>
              <td style="border-right:1px #ddd solid;">${element.peso}Kg</td>
              <td style="border-right:1px #ddd solid;">Volumen</td>
              <td style="border-right:1px #ddd solid;">${element.empaque}</td>
              <td style="border-right:1px #ddd solid;">${element.mer_producto}</td>
              <td style="border-right:1px #ddd solid;">${element.Cliente}</td>
              <td style="border-right:1px #ddd solid;">${element.Remitente}</td>
              <td style="border-right:1px #ddd solid;">${element.Destinatario}</td>
            </tr>
          `);
        });
      }
    },
    'json',
  );
}

function plan_ruta(codigoPlan, codigoInicio, manifi) {
  var cont = {
    id_plan: codigoPlan,
    codigo_ini: codigoInicio,
    manifiesto: manifi,
  };
  var pcarraylat = new Array();
  var pcarraylong = new Array();
  var namepc = new Array();
  $.ajax({
    // url: url,
    url: $('#id_url_ajax').val() + 'planruta/Listar_plan_ruta_seguimiento',
    type: 'POST',
    data: cont,
    dataType: 'json',
    success: function(data) {
      if (data) {
        var t = 0;
        var notas = data.notas_puntos;
        var puntos = data.plan_ruta;
        $('#panel_control_plan_ruta').html('');
        data.plan_ruta.forEach(function(element, index) {
          // este se itera 3 veces por el numero de puntos del plan de ruta
          //Traer puntos de control
          var clasificacion;
          if (element.tipo_punto == 'punto control') {
            clasificacion = 'punto físico';
          }
          if (element.tipo_punto == 'punto geografico') {
            clasificacion = 'punto virtual';
          }
          $('#panel_control_plan_ruta').append(
            `<tr style='border: 1px solid #ddd;padding: 1px;background-color:#fff;' class='punto_control${element.cod_punto}'>
               <td class='control_punto${element.cod_punto}'> ${element.nombre_punto} (${clasificacion})</td>
               <td>${element.municipio}-${element.depto}</td>
            </tr>`,
          );
        });
      }
      //pintar_mapacontrol(latori,latdes,longori,longdes,pcarraylat,pcarraylong,namepc);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

async function Salida(manifi) {
  var manifiesto_id = manifi;
  let formdata = new FormData();
  formdata.append('manifiesto_id', manifiesto_id);
  formdata.append('codigo_inicio_salida', d.getElementById('codigo_inicio_salida').value);
  try {
    const response = await fetch($('#id_url_ajax').val() + 'trafico/Dar_salida', {
      method: 'POST',
      body: formdata,
      cache: 'no-cache',
    });
    const data = await response.json();
    if (data === true) {
      d.getElementById('mensaje_salida').innerHTML = `
      <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role="alert">
          <div class="icon"><span class="mdi mdi-check"></span></div>
          <div class="message">
            <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
            <strong>Mensaje!</strong> Salida exitosa para el manifiesto ${manifi}.
          </div>
      </div>`;
      setTimeout(() => {
        url = $('#id_url_ajax').val() + 'control_ruta/salida_trafico/?idmenu=5';
        window.open(url, '_self');
      }, 1500);
    } else if (data === false) {
      d.getElementById('mensaje_salida').innerHTML = `
      <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
      <div class="icon"><span class="mdi mdi-info-outline"></span></div>
      <div class="message">
        <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
        <strong>Mensaje!</strong> Salida no dada al manigiesto ${manifi}.
      </div>
  </div>`;
    }
  } catch (error) {
    console.error('Error en la primera solicitud:', error);
    console.log('error no inserta');
    throw error;
  } finally {
    // d.getElementById('loading-overlay-mensaje_carga').style.display = 'none';
  }
}
