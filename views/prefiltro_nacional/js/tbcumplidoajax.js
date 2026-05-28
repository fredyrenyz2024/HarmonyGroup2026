window.VENTANA = null;

window.initScript = function (id) {
  window.VENTANA = id;

  $('.js-example-basic-single').select2();

  const baseUrl = document.getElementById('base_url').value;
  const placao = document.getElementById('placao');

  $('#contenedor_datos').hide();
  $('#tabla_datos').hide();
  $('.fec').hide();
  $('.num').hide();

  $('#filtro_cumplido').change(function () {
    $filtro = $('#filtro_cumplido').val();
    if ($filtro == '') {
      $('#contenedor_datos').hide();
      $('#tabla_datos').hide();
      $('.fec').hide();
      $('.num').hide();
    }
    if ($filtro == 1) {
      $('#contenedor_datos').hide();
      $('#tabla_datos').hide();
      $('.num').show();
      $('.fec').hide();
    }
    if ($filtro == 2) {
      $('#contenedor_datos').hide();
      $('#tabla_datos').hide();
      $('.num').hide();
      $('.fec').show();
    }
  });

  $('#buscar_cumplido').click(function () {
    var enviar, fec1, fec2, numero, d;
    if ($('#filtro_cumplido').val() == 1) {
      d = $('#filtro_cumplido').val();
      numero = $('#numnani').val();
      fec1 = '';
      fec2 = '';
      enviar = 'filtro=' + d + '&num=' + numero + '&fec1=' + fec1 + '&fec2=' + fec2;
    }
    if ($('#filtro_cumplido').val() == 2) {
      d = $('#filtro_cumplido').val();
      fec1 = $('#finicial').val();
      fec2 = $('#ffinal').val();
      numero = '';
      enviar = 'filtro=' + d + '&num=' + numero + '&fec1=' + fec1 + '&fec2=' + fec2;
    }
    Tabla_Cumplido();
  });

  document.getElementById('btn_imprimir').addEventListener('click', async () => {
    const cumplido = document.getElementById('c_cumpli').value;
    const baseUrl = document.getElementById('base_url').value;

    try {
      const response = await fetch(`${baseUrl}transporte/CumplidoPdf`, {
        method: 'POST',
        body: new URLSearchParams({ idcumplido: cumplido })
      });

      const data = await response.json();

      if (!data || data.length === 0) return;

      const {
        id, placa, namete, teape1, teape2, docte,
        namecondu, conape1, conape2, doccondu, celular_condu,
        marca, anio_fabricacion, cantidad_multa, manifiesto,
        origen, destino, novedad, tipo_documento,
        total_peso, total_volumen, nueva_fecha, fecha_cumplido
      } = data[0];

      const query = new URLSearchParams({
        numcumplido: id,
        placa,
        poseedor: `${namete} ${teape1} ${teape2}`,
        docposee: docte,
        conductor: `${namecondu} ${conape1} ${conape2}`,
        doccondu,
        cel: celular_condu,
        marca,
        modelo: anio_fabricacion,
        cantmulta: cantidad_multa,
        manifiesto,
        origen,
        destino,
        novedad,
        tipodocp: tipo_documento,
        pesototal: total_peso,
        volumentotal: total_volumen,
        fecha_pago: nueva_fecha,
        fecha_cumplido
      });

      window.open(`${baseUrl}libs/cumplido_pdf.php?${query.toString()}`, '_blank');
    } catch (err) {
      console.error('Error al generar el PDF del cumplido:', err);
    }
  });

  // Cargar manifiestos
  fetch(`${baseUrl}transporte/Buscar_Mnf_Cumplido`)
    .then(res => res.json())
    .then(data => {
      placao.innerHTML = '<option value="">Seleccione</option>';
      if (Array.isArray(data)) {
        data.forEach(item => {
          const autorizacion = item.num_autorizacion || 'Sin número';
          const option = document.createElement('option');
          option.value = item.id;
          option.textContent = `${item.id} ${item.placa} (${autorizacion}) - ${item.fecha_expedicion}`;
          placao.appendChild(option);
        });
      }
    });

  // Cuando cambia el manifiesto
  // placao.addEventListener('change', async () => {
  //   const manifiesto = placao.value;

  $('#placao').on('select2:select', async function (e) {
    let manifiesto = $(this).val();
    let texto = $(this).find("option:selected").text();
    if (!manifiesto) return;

    const fetchPost = (url, bodyObj) =>
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(bodyObj)
      }).then(res => res.json());

    const datosManifiesto = await fetchPost(`${baseUrl}transporte/Manifiesto_Cumplido`, { idmanifi: manifiesto });
    const ordenesCargue = await fetchPost(`${baseUrl}transporte/Ordenes_Cumplido`, { idmanifi: manifiesto });
    const remesas = await fetchPost(`${baseUrl}transporte/Remesas_Cumplido`, { idmanifi: manifiesto });

    // Actualizar campos del formulario
    const campos = {
      id_manifiesto: datosManifiesto?.id || '',
      o_fecha_exedicion: datosManifiesto?.fecha_expedicion || '',
      tipo_manifiesto: ({
        1: 'General', 2: 'Paqueteo', 3: 'Urbano de puertos', 4: 'Masivo',
        5: 'Semimasivo', 6: 'Urbano', 7: 'Movimiento contenedores'
      })[datosManifiesto?.tipo_manifiesto] || '',
      origen: datosManifiesto?.ori || '',
      destino: datosManifiesto?.dest || '',
      placa: datosManifiesto?.placa || '',
      nameposee: `${datosManifiesto?.nameposeedor || ''} ${datosManifiesto?.poseape1 || ''} ${datosManifiesto?.poseape2 || ''}`.trim(),
      docposee: datosManifiesto?.docposeedor || '',
      namepropi: `${datosManifiesto?.namepropi || ''} ${datosManifiesto?.proape1 || ''} ${datosManifiesto?.proape2 || ''}`.trim(),
      docpropi: datosManifiesto?.docpropi || '',
      nameconduc: `${datosManifiesto?.nameconduc || ''} ${datosManifiesto?.conduape1 || ''} ${datosManifiesto?.conduape2 || ''}`.trim(),
      docconduc: datosManifiesto?.docucondu || '',
      fecha_pago: datosManifiesto?.fecha_pago || '',
      agencia_pago: datosManifiesto?.lugar || ''
    };

    Object.keys(campos).forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = campos[id];
    });

    // Mostrar ordenes de cargue
    const tablaCargue = document.getElementById('tabla_cargue');
    tablaCargue.innerHTML = '';
    ordenesCargue?.forEach(c => {
      tablaCargue.innerHTML += `
        <tr>
          <td><input type="text" class="form-control input-sm" value="${c.id_orden_cargue}" readonly></td>
          <td><input type="text" class="form-control input-sm" value="${c.fecha_cargue}" readonly></td>
          <td><input type="text" class="form-control input-sm" value="${c.hora_cargue}" readonly></td>
          <td><input type="text" class="form-control input-sm" value="${c.obs_cargue}" readonly></td>
          <td><input type="text" class="form-control input-sm" value="${c.tipo_fecha}" readonly></td>
        </tr>`;
    });

    // Mostrar remesas
    const tablaDescargue = document.getElementById('tabla_descargue');
    tablaDescargue.innerHTML = '';
    remesas?.forEach(r => {
      tablaDescargue.innerHTML += `
        <tr>
          <td><input type="text" class="form-control input-sm chreme" value="${r.id_remesa}" readonly></td>
          <td><input type="text" class="form-control input-sm chfecha" value="${r.fecha_descargue}" readonly></td>
          <td><input type="text" class="form-control input-sm chhora" value="${r.hora_descargue}" readonly></td>
          <td><input type="text" class="form-control input-sm chobs" value="${r.obs_descargue}" readonly></td>
          <td><input type="text" class="form-control input-sm chtipo" value="${r.tipo_fecha}" readonly></td>
        </tr>`;
    });
  });

  // Calcular valor de multa
  document.getElementById('cant_multa')?.addEventListener('change', () => {
    const canti = parseFloat(document.getElementById('cant_multa').value) || 0;
    const tarifa = 50000;
    document.getElementById('valor_multa').value = canti * tarifa;
  });

  document.getElementById('Registrar_Cumplido').addEventListener('click', async () => {
    const result = await Swal.fire({
      title: '¿Deseas guardar el cumplido?',
      text: 'Esta acción guardará los datos ingresados.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) {
      console.log('Operación cancelada.');
      return;
    }

    let errores = [];

    const campos = [
      { id: 'placao', nombre: 'Manifiesto' },
      { id: 'id_manifiesto', nombre: 'Manifiesto Seleccionado' },
      { id: 'o_fecha_exedicion', nombre: 'Fecha de expedición' },
      { id: 'tipo_manifiesto', nombre: 'Tipo Manifiesto' },
      { id: 'origen', nombre: 'Origen' },
      { id: 'destino', nombre: 'Destino' },
      { id: 'placa', nombre: 'Placa' },
      { id: 'nameposee', nombre: 'Nombre Poseedor' },
      { id: 'docposee', nombre: 'Documento Poseedor' },
      { id: 'namepropi', nombre: 'Nombre Propietario' },
      { id: 'docpropi', nombre: 'Documento Propietario' },
      { id: 'nameconduc', nombre: 'Nombre Conductor' },
      { id: 'docconduc', nombre: 'Documento Conductor' },
      { id: 'valor_multa', nombre: 'Valor Multa (ingrese Cantidad Multa)' },
      { id: 'fecha_pago', nombre: 'Fecha de Pago' },
      { id: 'agencia_pago', nombre: 'Agencia de Pago' },
      { id: 'expide_cumplido', nombre: 'Fecha de expedición cumplido' },
      { id: 'noveda', nombre: 'Novedad' }
    ];

    campos.forEach(campo => {
      if (!document.getElementById(campo.id).value.trim()) {
        errores.push(`<p>Debe ingresar <strong>${campo.nombre}</strong> para registrar el Cumplido.</p>`);
      }
    });

    const tablaCargue = document.querySelectorAll('#tabla_cargue tr');
    const tablaDescargue = document.querySelectorAll('#tabla_descargue tr');

    if (tablaCargue.length === 0) {
      errores.push('<p>Debe tener al menos una <strong>orden de cargue</strong> para registrar el Cumplido.</p>');
    }

    if (tablaDescargue.length === 0) {
      errores.push('<p>Debe tener al menos una <strong>remesa de descargue</strong> para registrar el Cumplido.</p>');
    }

    if (errores.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        html: errores.join(''),
        confirmButtonText: 'Revisar'
      });
      return;
    }

    // Si no hay errores, ejecuta la función
    // Crear_Cumplido_inicial(document.getElementById('id_manifiesto').value);
    Crear_Cumplido();
  });
};

async function ConsultaCumplido(id, manifiesto) {
  $('#contenedor_datos').show();
  $('.campov').val('');

  const baseUrl = document.getElementById('base_url').value;

  try {
    // Cabecera
    const respCabecera = await fetch(`${baseUrl}transporte/ConsultaCumplido`, {
      method: 'POST',
      body: new URLSearchParams({ numma: manifiesto })
    });
    const cabecera = await respCabecera.json();

    if (cabecera) {
      $('#c_cumpli').val(cabecera.id);
      $('#c_placa').val(cabecera.placa);
      $('#c_manifi').val(cabecera.manifiesto);
      $('#c_nombre').val(cabecera.conductor);
      $('#c_numero').val(cabecera.doccondu);
      $('#c_propieta').val(cabecera.propietaro);
      $('#c_propinumero').val(cabecera.docprop);
      $('#c_posee').val(cabecera.tenedor);
      $('#c_poseenumero').val(cabecera.docte);
      $('#c_novedad').val(cabecera.novedad);
    }

    // Remesas
    const respRemesas = await fetch(`${baseUrl}transporte/ConsultaRemesas`, {
      method: 'POST',
      body: new URLSearchParams({ numcu: manifiesto })
    });

    const remesas = await respRemesas.json();

    if (Array.isArray(remesas) && remesas.length > 0) {
      const html = remesas.map(r => `
        <tr>
          <td>${r.id_remesa}</td>
          <td>${r.fecha}</td>
          <td>${r.hora}</td>
          <td>${r.observacion}</td>
          <td>${r.tipo_fecha}</td>
        </tr>`).join('');

      $('#tabla_remesas').html(html);
    } else {
      $('#tabla_remesas').html('<tr><td colspan="5">Sin remesas disponibles</td></tr>');
    }

  } catch (error) {
    console.error('Error al consultar cumplido o remesas:', error);
  }
}

function AnularCumplido(idcumpli) {
  $.post(
    $('#base_url').val() + 'transporte/AnuleCumplido',
    'numcu=' + idcumpli,
    function (data) {
      if (data == 'true') {
        alert('Datos Anulados Exitosamente!!');
        Tabla_Cumplido();
      }
    },
    'json',
  );
}

async function Tabla_Cumplido() {
  $('#contenedor_datos').hide();
  $('#tabla_datos').show();

  const filtro = $('#filtro_cumplido').val();
  const baseUrl = $('#base_url').val();
  const totalColumnas = $('#manfhead th').length || 7;

  const enviar = new URLSearchParams();

  if (filtro === '1') {
    enviar.append('filtro', filtro);
    enviar.append('num', $('#numnani').val());
    enviar.append('fec1', '');
    enviar.append('fec2', '');
  }

  if (filtro === '2') {
    enviar.append('filtro', filtro);
    enviar.append('num', '');
    enviar.append('fec1', $('#finicial').val());
    enviar.append('fec2', $('#ffinal').val());
  }

  // Mostrar loader en la tabla
  $('#cumplidobody').html(`
    <tr>
      <td colspan="${totalColumnas}" class="text-center py-4">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Consultando Cumplidos...</p>
      </td>
    </tr>
  `);

  try {
    const response = await fetch(`${baseUrl}transporte/Consultar_Tabla`, {
      method: 'POST',
      body: enviar
    });

    const data = await response.json();
    // console.log("🚀 ~ Tabla_Cumplido ~ data:", data.data);
    $('#cumplidobody').empty();
    $('.contador').text(data.total ?? 0);

    if (Array.isArray(data.data) && data.data.length > 0) {
      const filas = data.data.map(item => {
        const estado = item.estado == 1
          ? `<span class="badge bg-success">Activo</span>`
          : `<span class="badge bg-danger">Anulado</span>`;

        const btnConsultar = `
          <button class="btn btn-primary btn-sm me-1 px-1 py-1"
                  title="Ver cumplido" data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasDetalleCumplido"
                  aria-controls="offcanvasDetalleCumplido"
                  onClick="ConsultaCumplido(${item.id}, ${item.manifiesto})">
            <i class="fa-regular fa-eye"></i>
          </button>`;

        const btnEditar = item.estado == 1 ? `
          <button class="btn btn-warning btn-sm me-1 px-1 py-1"
                  title="Editar cumplido" data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasDetalleCumplido"
                  aria-controls="offcanvasDetalleCumplido"
                  onClick="ConsultaCumplido(${item.id}, ${item.manifiesto})">
            <i class="fa-solid fa-pencil"></i>
          </button>` : '';

        const btnAnular = item.estado == 1 ? `
          <button class="btn btn-danger btn-sm me-1 px-1 py-1"
                  title="Anular cumplido"
                  onClick="AnularCumplido(${item.id})">
            <i class="fa-solid fa-ban"></i>
          </button>` : '';

        return `
          <tr>
            <td class="text-center">${estado}</td>
            <td class="text-center">${item.id}</td>
            <td class="text-center">${item.manifiesto}</td>
            <td class="text-center">${item.placa}</td>
            <td class="text-center">
              <div class="btn-group btn-group-sm" role="group" aria-label="Acciones">
                ${btnConsultar}${btnEditar}${btnAnular}
              </div>
            </td>
          </tr>
        `;
      });

      $('#cumplidobody').html(filas.join(''));
    } else {
      $('#cumplidobody').html(`
        <tr>
          <td colspan="${totalColumnas}" class="text-center text-muted py-3">
            <i class="fa-regular fa-circle-xmark fs-3 mb-2"></i><br>
            No se encontraron cumplidos con los filtros aplicados.
          </td>
        </tr>
      `);
    }

  } catch (error) {
    console.error('Error al consultar la tabla:', error);
    $('#cumplidobody').html(`
      <tr>
        <td colspan="${totalColumnas}" class="text-center text-danger py-3">
          <i class="fa-solid fa-triangle-exclamation fs-4 mb-2"></i><br>
          Ocurrió un error al cargar los cumplidos. Intenta nuevamente.
        </td>
      </tr>
    `);
  }
}

// Crear_Cumplido mejorado con notificaciones SweetAlert2 y loading overlay visibles por bloque

function Crear_Cumplido() {
  let manifi = $('#placao').val();
  let num_manifiesto = $('#id_manifiesto').val();
  let cant_multa = $('#cant_multa').val();
  let tarif_multa = $('#tarif_multa').val();
  let valor_multa = $('#valor_multa').val();
  let nove = $('#noveda').val();

  // Obtener datos de remesas
  let remesas = {
    idremesa: [], fecha: [], hora: [], obs: [], tipo: []
  };
  $('.chreme').each((i, el) => remesas.idremesa[i] = $(el).val());
  $('.chfecha').each((i, el) => remesas.fecha[i] = $(el).val());
  $('.chhora').each((i, el) => remesas.hora[i] = $(el).val());
  $('.chobs').each((i, el) => remesas.obs[i] = $(el).val());
  $('.chtipo').each((i, el) => remesas.tipo[i] = $(el).val());

  let paquete = `manifi=${manifi}&placa=${$('#placa').val()}&cantim=${cant_multa}&tarim=${tarif_multa}&valorm=${valor_multa}&remesa=${JSON.stringify(remesas)}&nove=${nove}`;

  $('#loading-overlay-nexosapp').css('display', 'flex');
  Swal.fire({
    title: 'Procesando',
    text: 'Registrando en NEXOSAPP...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  $.ajax({
    url: $('#base_url').val() + 'transporte/Registro_Cumplido',
    type: 'POST',
    data: paquete,
    dataType: 'json',
    success: (data) => {
      if (data.status) {
        // window.__mensajes_cumplido.push('Datos registrados correctamente en NexosApp');
        Crear_Cumplido_inicial(num_manifiesto);
      } else {
        Swal.fire('Error', 'Datos no registrados: ' + data.error, 'error');
      }
    },
    complete: () => $('#loading-overlay-nexosapp').hide(),
    error: () => Swal.fire('Error', 'Error al registrar los datos.', 'error')
  });
}

function Crear_Cumplido_inicial(num_manifiesto) {
  let paquete = `num_manifiesto=${num_manifiesto}&proceso=3&dato=3&filtro=""&tipopro=3`;

  $('#loading-overlay-rndc').css('display', 'flex');
  Swal.fire({
    title: 'Transmitiendo Cumplido Inicial',
    text: 'Procesando remesas en RNDC...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  $.ajax({
    url: $('#base_url').val() + 'web_service/Transmite_Cumplido_Inicial',
    type: 'POST',
    data: paquete,
    dataType: 'json',
    success: (data) => {
      window.__mensajes_cumplido = [];
      data.forEach((item) => {
        window.__mensajes_cumplido.push('Remesa RNDC: ' + JSON.stringify(item));
      });
      Cumplido_Manifiesto_Rndc(num_manifiesto);
    },
    complete: () => $('#loading-overlay-rndc').hide(),
    error: () => Swal.fire('Error', 'Error al transmitir el cumplido inicial.', 'error')
  });
}

function Cumplido_Manifiesto_Rndc(num_manifiesto) {
  let paquete = `id=${num_manifiesto}&proceso=3&dato=3&filtro=""&tipopro=3`;

  $('#loading-overlay-rndc').css('display', 'flex');
  Swal.fire({
    title: 'Transmitiendo Cumplido RNDC',
    text: 'Finalizando registro en RNDC...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  $.ajax({
    url: $('#base_url').val() + 'web_service/Transmite_Cumplido',
    type: 'POST',
    data: paquete,
    dataType: 'json',
    success: (data) => {
      if (data.status === 'true') {
        window.__mensajes_cumplido.push(`Cumplido ${data.num_cumplido} registrado correctamente en RNDC`);
      } else {
        window.__mensajes_cumplido.push(`No se creó el Cumplido ${data.num_cumplido} en RNDC`);
      }
    },
    complete: () => {
      $('#loading-overlay-rndc').hide();
      Crea_Dato_Oet(num_manifiesto);
    },
    error: () => Swal.fire('Error', 'Error al transmitir el cumplido.', 'error')
  });
}

function Crea_Dato_Oet(num_manifiesto) {
  let paquete = `recurso=4&numero=${num_manifiesto}`;

  $('#loading-overlay-oet').css('display', 'flex');
  Swal.fire({
    title: 'Integrando con OET',
    text: 'Registrando datos en OET...',
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  $.ajax({
    url: $('#base_url').val() + 'integrar_oet/Consulta_Transacciones',
    type: 'POST',
    data: paquete,
    dataType: 'json',
    success: (data) => {
      if (data.status === true || data.status === 'true') {
        window.__mensajes_cumplido.push('Datos registrados correctamente en OET');
      } else {
        window.__mensajes_cumplido.push('No se registraron los datos en OET: ' + data.error);
      }
      Swal.fire({
        title: 'Resultado del Cumplido',
        html: '<ul style="text-align:left">' + window.__mensajes_cumplido.map(m => `<li>${m}</li>`).join('') + '</ul>',
        icon: 'info'
      });
      setTimeout(() => location.reload(), 6000);
    },
    complete: () => $('#loading-overlay-oet').hide(),
    // error: () => Swal.fire('Error', 'Error al procesar la solicitud en OET.', 'error')
    error: () => Swal.fire({
      title: 'Resultado del Cumplido',
      html: '<ul style="text-align:left">' + window.__mensajes_cumplido.map(m => `<li>${m}</li>`).join('') + '</ul>',
      icon: 'info'
    })
  });
}
