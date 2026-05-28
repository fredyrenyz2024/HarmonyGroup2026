window.VENTANA = null;

window.initScript = function (id) {
  window.VENTANA = id;

  // Crear instancia
  // Usar una variable global o una propiedad en el objeto window
  if (!window.myOffcanvas) {
    window.myOffcanvas = new DynamicOffcanvas({
      id: `customOffcanvas${id}`,
      title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
      content: '<p>Contenido inicial</p>',
      scroll: true,
      backdrop: false
    });
  } else {
    console.log('El offcanvas ya está creado.');
  }

  const urle = 'public/files/estudioseguridad';

  const hoy = new Date();
  const opciones = { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" };

  // Formatear la fecha a "YYYY-MM-DD"
  const fechaColombia = new Intl.DateTimeFormat("es-CO", opciones)
    .format(hoy)
    .split("/")
    .reverse()
    .join("-");

  Litar_solicitudes(fechaColombia, fechaColombia, '', 'todos');


  document.querySelectorAll('#contactListTab .nav-link').forEach(link => {
    link.addEventListener('click', function () {
      const valor = this.getAttribute('data-valor') || 'todos';
      // console.log('Valor seleccionado:', valor);

      // Aquí puedes hacer algo, como filtrar los estudios
      Litar_solicitudes(fechaColombia, fechaColombia, '', valor);
    });
  });

  setInterval(() => {
    Litar_solicitudes(fechaColombia, fechaColombia, '', 'todos');
  }, 300000);

  const input = document.getElementById('buscar_estudio_seguridad');
  document.addEventListener('click', async e => {
    // Aplicar filtro de fechas en operaciones
    if (e.target.matches(`#btn_filtrar_estudios_seguridad`) || e.target.matches(`#btn_filtrar_estudios_seguridad *`)) {
      let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
      let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
      Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
    }

    if (e.target.matches('.btn-ver') || e.target.matches('.btn-ver *')) {
      const boton = e.target.closest('.btn-ver'); // obtiene el botón más cercano con esa clase
      const SolicitudId = boton.getAttribute('data-PreestudioId');
      const PreestudioId = boton.getAttribute('data-PreestudioId');
      const Placa = boton.getAttribute('data-Placa');
      const Operacion = boton.getAttribute('data-Operacion');
      const EscenarioId = boton.getAttribute('data-EscenarioId');
      const Estado = boton.getAttribute('data-Estado');
      const EstadoPrefiltro = boton.getAttribute('data-EstadoPrefiltro');
      const EstadoCreacion = boton.getAttribute('data-EstadoCreacion');
      const EsxisteEstudio = boton.getAttribute('data-EsxisteEstudio');
      const ProcesoPrefiltroItr = boton.getAttribute('data-proceso_prefiltro_itr');
      // const Nombre = boton.getAttribute('data-Nombre');
      // Traer datos de sesión (los que tienes en inputs hidden)
      const idUsuario = document.getElementById('ssn_id_usuario').value;
      const nombreUsuario = document.getElementById('ssn_nombre').value;

      // Primero verificamos si otro usuario está gestionando
      const data = new FormData();
      data.append('id_estudio', SolicitudId); // o PreestudioId si tu estudio principal es ese
      data.append('id_usuario', idUsuario);
      data.append('nombre_usuario', nombreUsuario);

      fetch($('#base_url').val() + 'validacionparametros/insertar_usuario_gestion', {
        method: 'POST',
        cache: 'no-cache',
        body: data
      })
        .then(response => response.json())
        .then(res => {
          // Siempre cargamos el detalle primero
          CargarDatosPrefiltros(PreestudioId, SolicitudId, Operacion, Placa, EscenarioId, Estado, ProcesoPrefiltroItr);

          // Y luego mostramos el mensaje (espera un poco a que se genere el HTML)
          setTimeout(() => {
            if (res.status === 'ocupado') {
              $(`#GestionadoPor${SolicitudId}`).html(`${res.usuario} está gestionando este estudio.`);
              $(`#GestionadoPor${SolicitudId}`).css('color', 'red').css('font-weight', 'bold');
            } else {
              $(`#GestionadoPor${SolicitudId}`).html(`Tú estás gestionando este estudio.`);
              $(`#GestionadoPor${SolicitudId}`).css('color', 'green').css('font-weight', 'bold');
            }
          }, 300);
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'No se pudo verificar el estado del estudio.',
            confirmButtonText: 'Cerrar'
          });
          console.error(error);
        });
    }

    if (e.target.matches('.btn-listado') || e.target.matches('.btn-listado *')) {
      const boton = e.target.closest('.btn-listado');

      const SolicitudId = boton.getAttribute('data-solicitudId');
      const Placa = boton.getAttribute('data-placa');
      const conductorId = boton.getAttribute('data-conductorId');
      const vehiculoId = boton.getAttribute('data-vehiculoId');
      const Operacion = boton.getAttribute('data-Operacion');
      const Nombre = boton.getAttribute('data-Nombre');
      const Estado = boton.getAttribute('data-Estado');
      const EstadoPrefiltro = boton.getAttribute('data-EstadoPrefiltro');
      const EstadoCreacion = boton.getAttribute('data-EstadoCreacion');
      const ObservacionGeneral = boton.getAttribute('data-ObservacionGeneral');
      const EscenarioId = boton.getAttribute('data-EscenarioId');
      const EstudioIdC = boton.getAttribute('data-EstudioIdC');
      const EsxisteEstudio = boton.getAttribute('data-EsxisteEstudio');
      const ProcesoPrefiltroItr = boton.getAttribute('data-proceso_prefiltro_itr');

      // LLAMADA CON EL ORDEN CORRECTO DE PARÁMETROS
      cargarDatosEstudioPromesa(SolicitudId, Placa, conductorId, vehiculoId, Operacion, Nombre, Estado, EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EstudioIdC, EscenarioId, ProcesoPrefiltroItr);
    }

    if (e.target.matches('#inicio_estudio') || e.target.matches(`#inicio_estudio *`)) {
      const BtnIniciEstudioSeguridad = document.getElementById('inicio_estudio');
      const EstudioId = BtnIniciEstudioSeguridad.getAttribute('data-SolicitudId');
      const VehiculoId = BtnIniciEstudioSeguridad.getAttribute('data-VehiculoId');
      const ConductorId = BtnIniciEstudioSeguridad.getAttribute('data-ConductorId');
      const EstudioIdC = BtnIniciEstudioSeguridad.getAttribute('data-EstudioIdC');
      const Placa = BtnIniciEstudioSeguridad.getAttribute('data-Placa');
      const Operacion = BtnIniciEstudioSeguridad.getAttribute('data-Operacion');
      const Nombre = BtnIniciEstudioSeguridad.getAttribute('data-Nombre');
      const Estado = 'iniciado';
      // const Estado = BtnIniciEstudioSeguridad.getAttribute('data-Estado');
      const EstadoPrefiltro = BtnIniciEstudioSeguridad.getAttribute('data-EstadoPrefiltro');
      const EstadoCreacion = BtnIniciEstudioSeguridad.getAttribute('data-EstadoCreacion');
      const ObservacionGeneral = BtnIniciEstudioSeguridad.getAttribute('data-ObservacionGeneral');
      const EscenarioId = BtnIniciEstudioSeguridad.getAttribute('data-EscenarioId');

      const result = await Swal.fire({
        title: '¿Seguro?',
        text: '¿Esta seguro de inicar estudio de seguridad?',
        icon: 'question',
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
        let data = new FormData();
        data.append('numsoli', EstudioId);
        data.append('id_conductor', ConductorId);
        data.append('id_vehiculo', VehiculoId);
        data.append('estudio_id_c', EstudioIdC);
        try {
          const response = await fetch($('#base_url').val() + 'validacionparametros/Inicio_Estudio_seguridad', {
            method: 'POST',
            cache: 'no-cache',
            body: data,
          });

          if (!response.ok) throw new Error(response.statusText);

          const dataJson = await response.json();

          if (dataJson.numero === 200) {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              html: dataJson.mensaje,
              confirmButtonColor: '#3085d6',
            }).then((result) => {
              if (result.isConfirmed) {
                let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
                let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
                Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
                cargarDatosEstudioPromesa(EstudioId, Placa, ConductorId, VehiculoId, Operacion, Nombre, Estado, EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EstudioIdC, EscenarioId);
              }
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: '¡Error!',
              html: dataJson.mensaje,
              confirmButtonColor: '#d33',
            });
          }

        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: error.message || 'Ocurrió un error al procesar la solicitud.',
            confirmButtonColor: '#d33',
          });
        }
      }
    }

    if (e.target.matches('#aprobarv1') || e.target.matches('#aprobarv1 *')) {
      const BtnAprobarVehiculoSeguridad = document.getElementById('aprobarv1');
      // const EstudioId = BtnAprobarVehiculoSeguridad.getAttribute('data-EstudioId');
      const EstudioId = BtnAprobarVehiculoSeguridad.getAttribute('data-EstudioNucdoc');
      const Placa = BtnAprobarVehiculoSeguridad.getAttribute('data-Placa');
      const VehiculoId = BtnAprobarVehiculoSeguridad.getAttribute('data-VehiculoId');
      const ConductorId = BtnAprobarVehiculoSeguridad.getAttribute('data-ConductorId');
      const EstudioIdC = BtnAprobarVehiculoSeguridad.getAttribute('data-EstudioIdC');
      // const Placa = BtnAprobarVehiculoSeguridad.getAttribute('data-Placa');
      const Operacion = BtnAprobarVehiculoSeguridad.getAttribute('data-Operacion');
      const Nombre = BtnAprobarVehiculoSeguridad.getAttribute('data-Nombre');
      const EstadoPrefiltro = BtnAprobarVehiculoSeguridad.getAttribute('data-EstadoPrefiltro');
      const EstadoCreacion = BtnAprobarVehiculoSeguridad.getAttribute('data-EstadoCreacion');
      const ObservacionGeneral = BtnAprobarVehiculoSeguridad.getAttribute('data-ObservacionGeneral');
      const EscenarioId = BtnAprobarVehiculoSeguridad.getAttribute('data-EscenarioId');
      aprobar_vehiculo(EstudioId, Placa, VehiculoId, ConductorId, EstudioIdC, Operacion, Nombre, EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EscenarioId);
    }

    if (e.target.matches('#noaprobarv1') || e.target.matches('#noaprobarv1 *')) {
      const BtnDesaprobarVehiculoSeguridad = document.getElementById('noaprobarv1');
      const EstudioId = BtnDesaprobarVehiculoSeguridad.getAttribute('data-EstudioId');
      const Placa = BtnDesaprobarVehiculoSeguridad.getAttribute('data-Placa');
      const VehiculoId = BtnDesaprobarVehiculoSeguridad.getAttribute('data-VehiculoId');
      const ConductorId = BtnDesaprobarVehiculoSeguridad.getAttribute('data-ConductorId');
      desaprobar_vehiculo(EstudioId, Placa, VehiculoId, ConductorId);
    }

    if (e.target.matches('#aprobarc1') || e.target.matches('#aprobarc1 *')) {
      const BtnAprobarConductorSeguridad = document.getElementById('aprobarc1');
      const EstudioId = BtnAprobarConductorSeguridad.getAttribute('data-EstudioId');
      const Placa = BtnAprobarConductorSeguridad.getAttribute('data-Placa');
      const VehiculoId = BtnAprobarConductorSeguridad.getAttribute('data-VehiculoId');
      const ConductorId = BtnAprobarConductorSeguridad.getAttribute('data-ConductorId');
      aprobar_conductor(EstudioId, Placa, VehiculoId, ConductorId);
    }

    if (e.target.matches('#noaprobarc1') || e.target.matches('#noaprobarc1 *')) {
      const BtnDesaprobarConductorSeguridad = document.getElementById('noaprobarc1');
      const EstudioId = BtnDesaprobarConductorSeguridad.getAttribute('data-EstudioId');
      const Placa = BtnDesaprobarConductorSeguridad.getAttribute('data-Placa');
      const VehiculoId = BtnDesaprobarConductorSeguridad.getAttribute('data-VehiculoId');
      const ConductorId = BtnDesaprobarConductorSeguridad.getAttribute('data-ConductorId');
      desaprobar_conductor(EstudioId, Placa, VehiculoId, ConductorId);
    }

    if (e.target.matches('#aprobarr8') || e.target.matches('#aprobarr8 *')) {
      const BtnAprobarDocumentos = document.getElementById('aprobarr8');
      const EstudioId = BtnAprobarDocumentos.getAttribute('data-EstudioId');
      const Placa = BtnAprobarDocumentos.getAttribute('data-Placa');
      const VehiculoId = BtnAprobarDocumentos.getAttribute('data-VehiculoId');
      const ConductorId = BtnAprobarDocumentos.getAttribute('data-ConductorId');
      aprobar_risk(EstudioId, Placa, VehiculoId, ConductorId);
    }

    if (e.target.matches('#noaprobarr8') || e.target.matches('#noaprobarr8 *')) {
      const BtnDesaprobarDocumentosSeguridad = document.getElementById('noaprobarr8');
      const EstudioId = BtnDesaprobarDocumentosSeguridad.getAttribute('data-EstudioId');
      const Placa = BtnDesaprobarDocumentosSeguridad.getAttribute('data-Placa');
      const VehiculoId = BtnDesaprobarDocumentosSeguridad.getAttribute('data-VehiculoId');
      const ConductorId = BtnDesaprobarDocumentosSeguridad.getAttribute('data-ConductorId');
      desaprobar_risk(EstudioId, Placa, VehiculoId, ConductorId);
    }

    if (e.target.matches('#aprobar_estudio_total') || e.target.matches('#aprobar_estudio_total *')) {
      const BtnAprobacionTotal = document.getElementById('aprobar_estudio_total');
      // let BtnAprobacionTotal = e.target.closest('#aprobar_estudio_total');
      const SolicitudIdEstudio = BtnAprobacionTotal.getAttribute('data-SolicitudIdEstudio');
      const SolicitudId = BtnAprobacionTotal.getAttribute('data-solicitudid');
      const VehiculoId = BtnAprobacionTotal.getAttribute('data-VehiculoId');
      const ConductorId = BtnAprobacionTotal.getAttribute('data-ConductorId');
      const EstudioIdC = BtnAprobacionTotal.getAttribute('data-EstudioIdC');
      const Placa = BtnAprobacionTotal.getAttribute('data-Placa');
      const Operacion = BtnAprobacionTotal.getAttribute('data-Operacion');
      const EscenarioId = BtnAprobacionTotal.getAttribute('data-EscenarioId');

      // Los que faltaban:
      const Nombre = BtnAprobacionTotal.getAttribute('data-Nombre');
      // const EstadoOperacion = BtnAprobacionTotal.getAttribute('data-Estado');
      const EstadoPrefiltro = BtnAprobacionTotal.getAttribute('data-EstadoPrefiltro');
      const EstadoCreacion = BtnAprobacionTotal.getAttribute('data-EstadoCreacion');
      const ObservacionGeneral = BtnAprobacionTotal.getAttribute('data-ObservacionGeneral');

      let solicitudesArray = [];

      if (SolicitudId) {
        try {
          const parsed = JSON.parse(SolicitudId);

          if (parsed.solicitudes && Array.isArray(parsed.solicitudes)) {
            solicitudesArray = parsed.solicitudes;
          }
        } catch (e) {
          console.error('Error parseando SolicitudId:', e);
        }
      }

      const Estado = 'Pendiente';

      const result = await Swal.fire({
        title: '¿Seguro?',
        text: '¿Estás seguro de enviar esta respuesta?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3B71CA',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'swal2-custom-font',
        },
      });

      //SolicitudId
      if (result.isConfirmed) {
        var select = $(`#estado_estu`).val();

        if (select === 'Aprobado') {
          var tipoestu = { idestudio: SolicitudIdEstudio };

          $.ajax({
            url: $('#base_url').val() + 'validacionparametros/tipos_estudios',
            type: 'POST',
            data: tipoestu,
            dataType: 'json',
            success: function (data) {
              if (data && Array.isArray(data)) {
                var sw = 0;
                var mensajeError = '';

                // // Iteración más rápida (for clásico)
                console.log("Antes del For");

                // Iniciar contador de tiempo
                console.time("Tiempo de validación");

                let cont = 0;
                // Iteración más rápida (for clásico)
                for (var i = 0; i < data.length; i++) {
                  console.log("tiempo por ejecucion " + cont++);

                  var estado = data[i].estado;       // 0 = rechazado, null = no contestado
                  var obligatorio = data[i].requerido;
                  var nombreTipo = data[i].nombre;

                  // Validar rechazado obligatorio
                  if (estado === 0 && obligatorio === 1) {
                    sw = 1;
                    mensajeError = `Tiene tipos de estudio <strong>rechazados</strong> que son obligatorios:<br><strong>${nombreTipo}</strong>`;
                    break;
                  }

                  // Validar sin contestar obligatorio
                  if ((estado === null || estado === undefined) && obligatorio === 1) {
                    sw = 1;
                    mensajeError = `Tiene tipos de estudio <strong>sin contestar</strong> que son obligatorios:<br><strong>${nombreTipo}</strong>`;
                    break;
                  }
                }

                // Finalizar contador de tiempo
                console.timeEnd("Tiempo de validación");  // Ej: "Tiempo de validación: 3.25ms"

                if (sw === 1) {
                  Swal.fire({
                    icon: 'error',
                    title: 'No es posible aprobar el estudio completo',
                    html: mensajeError,
                    confirmButtonText: 'Entendido'
                  });
                  console.timeEnd("Tiempo total proceso aprobación");
                  return;
                }

                // Si todo OK, enviar datos
                var datos = new FormData();
                datos.append('idcarro', VehiculoId);
                datos.append('idcondu', ConductorId);
                datos.append('idestudio', SolicitudIdEstudio);
                datos.append('obser', $('#obse_estu').val());
                datos.append('proceso', $('#proceso').val());
                datos.append('proceso_estudio', $('#proceso_estudio').val());
                datos.append('estado', 'Aprobado');
                datos.append('id_estudio_c', EstudioIdC);
                datos.append('id_escenario', EscenarioId);
                // datos.append('SolicitudId', SolicitudId);
                datos.append('SolicitudesId', JSON.stringify(solicitudesArray));

                console.time("Tiempo respuesta servidor (Ajax)");

                $.ajax({
                  url: $('#base_url').val() + 'validacionparametros/Aprobacion_total',
                  type: 'POST',
                  data: datos,
                  cache: false,
                  processData: false,
                  contentType: false,
                  dataType: 'json',
                  success: function (data) {
                    console.timeEnd("Tiempo respuesta servidor (Ajax)");

                    if (data.numero === 200) {
                      Swal.fire({
                        icon: 'success',
                        title: 'Estudio aprobado exitosamente',
                        html: data.mensaje,
                        confirmButtonText: 'Aceptar'
                      }).then(() => {
                        let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
                        let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
                        Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
                        cargarDatosEstudioPromesa(
                          SolicitudId, Placa, ConductorId, VehiculoId, Operacion,
                          Nombre, 'Aprobado', EstadoPrefiltro, EstadoCreacion,
                          ObservacionGeneral, EstudioIdC, EscenarioId
                        );
                      });
                    } else {
                      Swal.fire({
                        icon: 'error',
                        title: 'Error al aprobar el estudio',
                        html: data.mensaje,
                        confirmButtonText: 'Entendido'
                      });
                    }

                    console.timeEnd("Tiempo total proceso aprobación");
                  },
                  error: function () {
                    console.timeEnd("Tiempo respuesta servidor (Ajax)");
                    console.timeEnd("Tiempo total proceso aprobación");

                    Swal.fire({
                      icon: 'error',
                      title: 'Error de conexión',
                      text: 'No se pudo completar la solicitud. Intente nuevamente.',
                      confirmButtonText: 'Cerrar'
                    });
                  }
                });
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error('Error en validación:', textStatus, errorThrown);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al validar los tipos de estudio.',
                confirmButtonText: 'Cerrar'
              });
            }
          });
        }

        if (select === 'Rechazado') {
          var url = $('#base_url').val() + 'validacionparametros/Aprobacion_total';
          const formdata = new FormData();
          formdata.append('idcarro', VehiculoId);
          formdata.append('idcondu', ConductorId);
          formdata.append('idestudio', SolicitudIdEstudio);
          formdata.append('obser', $(`#obse_estu`).val());
          formdata.append('proceso', $(`#proceso`).val());
          formdata.append('proceso_estudio', $(`#proceso_estudio`).val());
          formdata.append('estado', 'Rechazado');
          formdata.append('id_estudio_c', EstudioIdC);
          formdata.append('id_escenario', EscenarioId);
          formdata.append('SolicitudId', SolicitudId);

          $.ajax({
            url: url,
            type: 'POST',
            data: formdata,
            cache: false,
            processData: false, // Don't process the files
            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
            dataType: 'json',

            success: function (data, textStatus, jqXHR) {
              if (data.numero === 200) {
                Swal.fire({
                  icon: 'success',
                  title: 'Estudio gestionado exitosamente',
                  html: data.mensaje,
                  confirmButtonText: 'Aceptar'
                }).then(() => {
                  let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
                  let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
                  Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
                  // cargarDatosEstudioPromesa(EstudioId, Placa, ConductorId, VehiculoId, Operacion, '', Estado, '', '', '');
                  cargarDatosEstudioPromesa(solicitudId, Placa, conductorId, vehiculoId, Operacion, Nombre, 'Rechazado', EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EstudioIdC, EscenarioId);
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'No se pudo gestionar el estudio',
                  text: data.mensaje,
                  confirmButtonText: 'Cerrar'
                }).then(() => {
                  $('#ver_lista').modal('hide');
                });
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              alert('Datos del Estudio Registrados Exitosamente');
              solicitudes();
              console.log('no inserto hv conductor');
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
          });
        }

        if (select === 'Pendiente') {
          //validar requeridos
          var tipoestu = {
            idestudio: SolicitudIdEstudio,
          };

          $.ajax({
            url: $('#base_url').val() + 'validacionparametros/tipos_estudios',
            type: 'POST',
            data: tipoestu,
            dataType: 'json',

            success: function (data) {
              if (data != '') {
                //resultado de tb aprobaciones x seguridad
                var tmp = Array();
                tmp = data;
                var c = tmp.length;
                var sw = 0;
                for (i = 0; i <= c; i++) {
                  // idtipos = tmp[i][1];
                  if (tmp[i][2] == 0 && tmp[i][3] == 1) {
                    sw = 1;
                    Swal.fire({
                      icon: 'error',
                      title: 'No se puede Colocar pendiente el estudio',
                      html: `El tipo de estudio <strong>${tipo.estudio}</strong> ha sido <strong>rechazado</strong> y es obligatorio.`,
                      confirmButtonText: 'Entendido'
                    });
                    break;
                  }

                  if (tmp[i][2] == null && tmp[i][3] == 1) {
                    sw = 1;
                    Swal.fire({
                      icon: 'warning',
                      title: 'Estudio sin contestar',
                      html: `El tipo de estudio <strong>${tipo.estudio}</strong> es obligatorio y aún no ha sido contestado.`,
                      confirmButtonText: 'Entendido'
                    });
                    break;
                  }

                  if (sw == 0 && i == c - 1) {
                    var url = $('#base_url').val() + 'validacionparametros/Aprobacion_total';
                    const formData = new FormData();
                    formData.append('idcarro', VehiculoId);
                    formData.append('idcondu', ConductorId);
                    formData.append('idestudio', SolicitudIdEstudio);
                    formData.append('obser', $(`#obse_estu`).val());
                    formData.append('proceso', $(`#proceso`).val());
                    formData.append('proceso_estudio', $(`#proceso_estudio`).val());
                    formData.append('estado', 'Pendiente');
                    formData.append('id_estudio_c', EstudioIdC);
                    formData.append('id_escenario', EscenarioId);
                    formData.append('SolicitudId', SolicitudId);

                    $.ajax({
                      url: url,
                      type: 'POST',
                      data: formData,
                      cache: false,
                      processData: false, // Don't process the files
                      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                      dataType: 'json',
                      success: function (data, textStatus, jqXHR) {
                        if (data.numero === 200) {
                          Swal.fire({
                            icon: 'success',
                            title: 'Estudio gestionado exitosamente',
                            html: data.mensaje,
                            confirmButtonText: 'Aceptar'
                          }).then(() => {
                            let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
                            let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
                            Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
                            cargarDatosEstudioPromesa(solicitudId, Placa, conductorId, vehiculoId, Operacion, Nombre, 'Pendiente', EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EstudioIdC, EscenarioId);
                          });
                          // push(idvehiculo, idconductor, idestudio, estado, obse, usuario);
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'No se pudo gestionar el estudio',
                            text: data.mensaje,
                            confirmButtonText: 'Cerrar'
                          }).then(() => {
                            $('#ver_lista').modal('hide');
                          });
                        }
                      },

                      error: function (jqXHR, textStatus, errorThrown) {
                        $('#ver_lista').modal('hide');
                        // solicitudes();
                        console.log('no inserto hv conductor');
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
                      },
                    });
                  }
                }
              } else {
                mensaje = `
                <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role="alert">
                    <div class="icon"><span class="mdi mdi-info-outline"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> No es posible aprobar el estudio completo cuando tiene tipos de estudio que son obligatorios sin contestar
                    </div>
                </div>`;
                d.getElementById('historico_estudios').innerHTML = mensaje;

                // $("#ver_lista").animate({ scrollTop: 0 }, 900);
              } //termina data.result
            },

            error: function (jqXHR, textStatus, errorThrown) {
              alert('ocurrio un error');
              console.log(jqXHR);
              console.log(textStatus);
              console.log(errorThrown);
            },
          });
        }

        if (select === 'Rechazado_modificar') {
          if (!$(`#obse_estu`).val()) {
            // alert('Debe diligenciar la observación, por favor escriba brevemente los motivos del rechazo para modificar');
            Swal.fire({
              icon: 'error',
              title: 'No se puede gestionar el estudio',
              text: 'Debe diligenciar la observación, por favor escriba brevemente los motivos del rechazo para modificar',
              confirmButtonText: 'Cerrar'
            }).then(() => {
              // $('#ver_lista').modal('hide');
            });
          } else {
            var url = $('#base_url').val() + 'validacionparametros/Aprobacion_total';

            const formData = new FormData();
            formData.append('idcarro', VehiculoId);
            formData.append('idcondu', ConductorId);
            formData.append('idestudio', SolicitudIdEstudio);
            formData.append('obser', $(`#obse_estu`).val());
            formData.append('proceso', $(`#proceso`).val());
            formData.append('proceso_estudio', $(`#proceso_estudio`).val());
            formData.append('estado', 'Rechazado_modificar');
            formData.append('id_estudio_c', EstudioIdC);
            formData.append('id_escenario', EscenarioId);
            formData.append('SolicitudId', SolicitudId);

            $.ajax({
              url: url,
              type: 'POST',
              data: formData,
              cache: false,
              processData: false, // Don't process the files
              contentType: false, // Set content type to false as jQuery will tell the server its a query string request
              dataType: 'json',

              success: function (data, textStatus, jqXHR) {
                if (data.numero === 200) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Estudio gestionado exitosamente',
                    html: data.mensaje,
                    confirmButtonText: 'Aceptar'
                  }).then(() => {
                    let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
                    let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
                    Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
                    // cargarDatosEstudioPromesa(EstudioId, Placa, ConductorId, VehiculoId, Operacion, '', Estado, '', '', '');
                    cargarDatosEstudioPromesa(solicitudId, Placa, conductorId, vehiculoId, Operacion, Nombre, 'Rechazado_modificar', EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EstudioIdC, EscenarioId);;
                  });
                  // push(idvehiculo, idconductor, idestudio, estado, obse, usuario);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'No se pudo gestionar el estudio',
                    text: data.mensaje,
                    confirmButtonText: 'Cerrar'
                  }).then(() => {
                    $('#ver_lista').modal('hide');
                  });
                }
              },

              error: function (jqXHR, textStatus, errorThrown) {
                console.log('no inserto hv conductor');
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
              },
            });
          }
        }
      } else {
        // Código a ejecutar si el usuario hace clic en "Cancelar"
        console.log('Acción confirmada.');
      }
    }

    /** Prefiltro de seguridad **/
    if (e.target.matches('#iniciacion_preestudio') || e.target.matches('#iniciacion_preestudio *')) {
      const BtnIniciarPrefiltro = e.target.closest('[id^="iniciacion_preestudio"]');
      let PrefiltroId = BtnIniciarPrefiltro.getAttribute('data-PrefiltroId');
      let Placa = BtnIniciarPrefiltro.getAttribute('data-Placa');
      // let SolicitudId = BtnIniciarPrefiltro.getAttribute('data-SolicitudId');
      let Operacion = BtnIniciarPrefiltro.getAttribute('data-Operacion');
      let EscenarioId = BtnIniciarPrefiltro.getAttribute('data-EscenarioId');
      let Estado = BtnIniciarPrefiltro.getAttribute('data-Estado');

      let data = new FormData();
      data.append('solicitud_id', PrefiltroId);

      fetch($('#base_url').val() + 'validacionparametros/Validar_inicio_prefiltro', {
        method: 'POST',
        cache: 'no-cache',
        body: data,
      })
        .then(response => response.json())
        .then(function (data) {
          if (data.numero === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Prefiltro Iniciado',
              text: data.mensaje,
              confirmButtonText: 'Aceptar'
            }).then(() => {
              // Litar_solicitudes();
              let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
              let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
              Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
              CargarDatosPrefiltros(PrefiltroId, '', Operacion, Placa, EscenarioId, 'iniciado', '');
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error al iniciar',
              text: data.mensaje || 'No se pudo iniciar el prefiltro',
              confirmButtonText: 'Cerrar'
            });
          }
        })
        .catch(error => {
          Swal.fire({
            icon: 'error',
            title: 'Error de red',
            text: 'No se pudo completar la solicitud. Intenta nuevamente.',
            confirmButtonText: 'Cerrar'
          });
          console.error(error);
        });
    }

    if (e.target.matches('#enviar_seguridad') || e.target.matches('#enviar_seguridad *')) {
      const BtnResponderPrefiltro = document.getElementById('enviar_seguridad');
      let PrefiltroId = BtnResponderPrefiltro.getAttribute('data-PrefiltroId');
      let Operacion = BtnResponderPrefiltro.getAttribute('data-Operacion');
      let Placa = BtnResponderPrefiltro.getAttribute('data-Placa');
      let EscenarioId = BtnResponderPrefiltro.getAttribute('data-EscenarioId');

      const result = await Swal.fire({
        title: '¿Seguro?',
        text: '¿Estás seguro de enviar la respuesta del prefiltro?',
        icon: 'question',
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
        let formdata = new FormData();
        formdata.append('solicitud', PrefiltroId);
        formdata.append('estado', document.getElementById(`estado_seguridad`).value);
        formdata.append('proceso', document.getElementById(`procesoprefiltro`).value);
        formdata.append('observacion', document.getElementById(`seguridad_observa`).value);

        fetch($('#base_url').val() + 'validacionparametros/Enviar_Prefiltro', {
          method: 'POST',
          cache: 'no-cache',
          body: formdata,
        })
          .then(response => response.json())
          .then(function (data) {
            if (data && data.numero === 200) {
              Swal.fire({
                icon: 'success',
                title: 'Prefiltro enviado',
                html: data.mensaje,
                confirmButtonText: 'Aceptar'
              }).then(() => {
                let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
                let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
                Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
                CargarDatosPrefiltros(PrefiltroId, '', Operacion, Placa, EscenarioId, document.getElementById(`estado_seguridad`).value, '');
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al enviar prefiltro',
                html: data.mensaje || 'Ocurrió un error desconocido.',
                confirmButtonText: 'Cerrar'
              });
            }
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: 'Error de red',
              text: 'No se pudo comunicar con el servidor. Intente nuevamente.',
              confirmButtonText: 'Cerrar'
            });
            console.error(error);
          });
      } else {
        console.log('Operación cancelada por el usuario.');
      }
    }

    //Recursos nuevos
    if (e.target.matches('#btn_guardar_prefiltro_nuevo') || e.target.matches('#btn_guardar_prefiltro_nuevo *')) {
      const BtnGuardarPrefiltro = document.getElementById('btn_guardar_prefiltro_nuevo');
      // Obtener datos desde atributos data-* del botón
      // const solicitudId = BtnGuardarPrefiltro.dataset.solicitudId;
      const solicitudId = BtnGuardarPrefiltro.getAttribute('data-solicitudId');
      const plac = BtnGuardarPrefiltro.getAttribute('data-Placa');
      const estadoSelect = document.getElementById(`estado_prefiltro_nuevo`);
      const observacion = document.getElementById(`observacion_prefiltro_nuevo`);

      // Confirmación previa con SweetAlert
      Swal.fire({
        title: '¿Confirmar operación?',
        text: '¿Está seguro de realizar la operación para el prefiltro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3B71CA',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (!estadoSelect.value) {
            Swal.fire({
              icon: 'warning',
              title: 'Falta seleccionar estado',
              text: 'Debes seleccionar un estado para poder guardar el prefiltro.',
              confirmButtonText: 'Entendido',
            });
            return;
          }

          // Enviar datos al servidor
          let formdata = new FormData();
          formdata.append('solicitud_id', solicitudId);
          formdata.append('estado', estadoSelect.value);
          formdata.append('observacion', observacion.value);
          formdata.append('placa', plac);

          try {
            const response = await fetch($('#base_url').val() + 'validacionparametros/Guardar_prefiltro_nuevo', {
              method: 'POST',
              cache: 'no-cache',
              body: formdata,
            });
            const data = await response.json();

            if (data && data.numero === 200) {
              Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                html: data.mensaje,
                confirmButtonText: 'Aceptar',
              }).then(() => {
                // let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
                // let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
                // Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
                // cargarDatosEstudioPromesa(solicitudId, plac, conductorId, vehiculoId, Operacion, Nombre, 'Pendiente', EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EstudioIdC, EscenarioId);
                Listar_datos_prefiltro_nuevo_recurso(solicitudId, plac);
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                html: data?.mensaje || 'Ocurrió un error al guardar el prefiltro.',
                confirmButtonText: 'Cerrar',
              });
            }
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Error de conexión',
              text: 'No se pudo completar la operación. Intenta nuevamente.',
              confirmButtonText: 'Cerrar',
            });
            console.error('Error en la solicitud:', error);
          }
        }
      });
    }

    /* Bonton para envair directamente a la edicion de los vehiculos */
    const BtnEditarVehiculo = e.target.closest('[id^="btn_editar_vehiculo"]');
    if (BtnEditarVehiculo) {
      // alert('Hola Mundo');
      e.stopPropagation();  // Evita que el evento siga burbujeando
      e.preventDefault();   // Previene doble acción en enlaces

      var vehiculo_id = BtnEditarVehiculo.getAttribute('data-idvehiculo');
      var ventanaAncho = screen.width; // Ancho de la pantalla
      var ventanaAlto = screen.height; // Alto de la pantalla
      var ventanaIzquierda = 0; // Posición izquierda
      var ventanaArriba = 0; // Posición superior

      // Opciones para la ventana emergente
      var opcionesVentana = `width=${ventanaAncho},height=${ventanaAlto},left=${ventanaIzquierda},top=${ventanaArriba},scrollbars=yes,fullscreen=yes`;

      // URL a abrir
      var url = $('#base_url').val() + `solicitudes/editar_vehiculo/?num_vehiculo=${codificarBase64(vehiculo_id)}&idmenu=3`;

      // Abre la ventana emergente
      window.open(url, '_blank', opcionesVentana);
    }

    /* Boton para editar al condutor */
    const BtnEditarConductor = e.target.closest('[id^="btn_editar_conductor"]');
    if (BtnEditarConductor) {
      e.stopPropagation();  // Evita que el evento siga burbujeando
      e.preventDefault();   // Previene doble acción en enlaces

      var conductor_id = BtnEditarConductor.getAttribute('data-idconductor');
      var ventanaAncho = screen.width; // Ancho de la pantalla
      var ventanaAlto = screen.height; // Alto de la pantalla
      var ventanaIzquierda = 0; // Posición izquierda
      var ventanaArriba = 0; // Posición superior

      // Opciones para la ventana emergente
      var opcionesVentana = `width=${ventanaAncho},height=${ventanaAlto},left=${ventanaIzquierda},top=${ventanaArriba},scrollbars=yes,fullscreen=yes`;

      var url = $('#base_url').val() + `solicitudes/editar_proveedor/?num_proveedor=${codificarBase64(conductor_id)}&idmenu=3`;

      // Abre la ventana emergente
      window.open(url, '_blank', opcionesVentana);
    }

  });

  document.addEventListener('change', function (e) {
    const select = e.target;

    if (e.target.matches(`#select_option`) || e.target.matches(`#select_option *`)) {
      const valor = select.value;
      const SelectHojaDeVida = document.getElementById('select_option');
      let EstudioNucdoc = SelectHojaDeVida.getAttribute("data-EstudioNucdoc");
      let Placa = SelectHojaDeVida.getAttribute("data-Placa");
      let VehiculoId = SelectHojaDeVida.getAttribute("data-VehiculoId");
      let ConductorId = SelectHojaDeVida.getAttribute("data-ConductorId");
      let EscenarioId = SelectHojaDeVida.getAttribute("data-EscenarioId");
      let Nombre = SelectHojaDeVida.getAttribute("data-Nombre");
      let Estado = SelectHojaDeVida.getAttribute("data-Estado");
      let EstadoPrefiltro = SelectHojaDeVida.getAttribute("data-EstadoPrefiltro");
      let EstadoCreacion = SelectHojaDeVida.getAttribute("data-EstadoCreacion");
      let ObservacionGeneral = SelectHojaDeVida.getAttribute("data-ObservacionGeneral");
      let Operacion = SelectHojaDeVida.getAttribute("data-Operacion");
      let EstudioIdC = SelectHojaDeVida.getAttribute("data-EstudioIdC");

      // Limpia los campos
      $('#evi_plataforma').val('');
      $('#name_eviden').val('');
      $('#obse_todo').val('');
      $('#obse_condu').val('');
      $('#observeheciulo').val('');

      // Aquí entra tu lógica de opciones
      if (valor === '0') {
        $(`#content_vehiculo`).hide();
        $(`#content_conductor`).hide();
        $(`#content_risk`).hide();
        $(`#divdatopreestudio`).hide();
      }

      if (valor === '1') {
        $(`#content_vehiculo`).show();
        $(`#content_conductor`).hide();
        $(`#divdatopreestudio`).hide();
        $(`#content_risk`).hide();
        $(`#id_tvehiculo`).val(1);
        $(`#botonescar`).html(
          `<button class="btn btn-subtle-success btn-sm me-1 px-1 py-1" 
              id="aprobarv1"  
              data-EstudioId='${EstudioNucdoc}'  
              data-Placa="${Placa}" 
              data-VehiculoId="${VehiculoId}" 
              data-ConductorId="${ConductorId}"
              data-EstudioNucdoc="${EstudioNucdoc}"
              data-EscenarioId="${EscenarioId}"
              data-Nombre="${Nombre}"
              data-Estado="${Estado}"
              data-EstadoPrefiltro="${EstadoPrefiltro}"
              data-EstadoCreacion="${EstadoCreacion}"
              data-ObservacionGeneral="${ObservacionGeneral}"
              data-Operacion="${Operacion}"
              data-EstudioIdC="${EstudioIdC}">
              Aprobar vehículo
          </button>

          <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-1" 
              id="noaprobarv1" 
              data-EstudioId='${EstudioNucdoc}' 
              data-Placa="${Placa}" 
              data-VehiculoId="${VehiculoId}" 
              data-ConductorId="${ConductorId}"
              data-EstudioNucdoc="${EstudioNucdoc}"
              data-EscenarioId="${EscenarioId}"
              data-Nombre="${Nombre}"
              data-Estado="${Estado}"
              data-EstadoPrefiltro="${EstadoPrefiltro}"
              data-EstadoCreacion="${EstadoCreacion}"
              data-ObservacionGeneral="${ObservacionGeneral}"
              data-Operacion="${Operacion}"
              data-EstudioIdC="${EstudioIdC}">
              Rechazar vehículo
          </button>`
        );

        // verVehiculo(EstudioNucdoc);
        verVehiculo();
      }

      if (valor === '2') {
        $(`#content_conductor`).show();
        $(`#content_vehiculo`).hide();
        $(`#divdatopreestudio`).hide();
        $(`#content_risk`).hide();
        $(`#id_tconductor`).val(2);
        $(`#botondriver`).html(`
          <button class="btn btn-subtle-success btn-sm me-1 px-1 py-1" 
              id="aprobarc1" 
              data-EstudioId='${EstudioNucdoc}' 
              data-Placa="${Placa}" 
              data-VehiculoId="${VehiculoId}" 
              data-ConductorId="${ConductorId}"
              data-EstudioNucdoc="${EstudioNucdoc}"
              data-EscenarioId="${EscenarioId}"
              data-Nombre="${Nombre}"
              data-Estado="${Estado}"
              data-EstadoPrefiltro="${EstadoPrefiltro}"
              data-EstadoCreacion="${EstadoCreacion}"
              data-ObservacionGeneral="${ObservacionGeneral}"
              data-Operacion="${Operacion}"
              data-EstudioIdC="${EstudioIdC}">
              Aprobar conductor
          </button>

          <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-1" 
              id="noaprobarc1" 
              data-EstudioId='${EstudioNucdoc}' 
              data-Placa="${Placa}" 
              data-VehiculoId="${VehiculoId}" 
              data-ConductorId="${ConductorId}"
              data-EstudioNucdoc="${EstudioNucdoc}"
              data-EscenarioId="${EscenarioId}"
              data-Nombre="${Nombre}"
              data-Estado="${Estado}"
              data-EstadoPrefiltro="${EstadoPrefiltro}"
              data-EstadoCreacion="${EstadoCreacion}"
              data-ObservacionGeneral="${ObservacionGeneral}"
              data-Operacion="${Operacion}">
              Rechazar conductor
          </button>
        `);

        // verConductor(EstudioNucdoc, VehiculoId, ConductorId, Placa);
        verConductor(ConductorId);
      }

      if (valor == '11') {
        var tipo = 'Gps';
        var ruta = urle + '/gps';
        $(`#divdatopreestudio`).hide();
        $(`#content_risk`).show();
        $(`#content_vehiculo`).hide();
        $(`#content_conductor`).hide();
        $(`#tipo_plataforma`).val(tipo);
        $(`#ruta_eviden`).val(ruta);
        $(`#id_totros`).val(11);
        $(`#losbototnes`).html(`
          <button class="btn btn-subtle-success btn-sm me-1 px-1 py-1" 
              id="aprobarr8" 
              data-EstudioId='${EstudioNucdoc}'  
              data-Placa="${Placa}" 
              data-VehiculoId="${VehiculoId}" 
              data-ConductorId="${ConductorId}"
              data-EstudioNucdoc="${EstudioNucdoc}"
              data-EscenarioId="${EscenarioId}"
              data-Nombre="${Nombre}"
              data-Estado="${Estado}"
              data-EstadoPrefiltro="${EstadoPrefiltro}"
              data-EstadoCreacion="${EstadoCreacion}"
              data-ObservacionGeneral="${ObservacionGeneral}"
              data-Operacion="${Operacion}"
              data-EstudioIdC="${EstudioIdC}">
              Aprobar
          </button>

          <button class="btn btn-subtle-danger btn-sm me-1 px-1 py-1" 
              id="noaprobarr8" 
              data-EstudioId='${EstudioNucdoc}'  
              data-Placa="${Placa}" 
              data-VehiculoId="${VehiculoId}" 
              data-ConductorId="${ConductorId}"
              data-EstudioNucdoc="${EstudioNucdoc}"
              data-EscenarioId="${EscenarioId}"
              data-Nombre="${Nombre}"
              data-Estado="${Estado}"
              data-EstadoPrefiltro="${EstadoPrefiltro}"
              data-EstadoCreacion="${EstadoCreacion}"
              data-ObservacionGeneral="${ObservacionGeneral}"
              data-Operacion="${Operacion}"
              data-EstudioIdC="${EstudioIdC}">
              Rechazar
          </button>
        `);

      }
    }

    if (select.tagName === 'SELECT' && select.id.startsWith('estado_estu')) {
      const valor = select.value;
      // let EstudioNucdoc = select.getAttribute("data-EstudioNucdoc");
      let Placa = select.getAttribute("data-placa");
      let VehiculoId = select.getAttribute("data-VehiculoId");
      let ConductorId = select.getAttribute("data-ConductorId");
      let EstudioNucdoc = select.getAttribute("data-SolicitudId");

      //validar el estado y que tenga todo aprobado
      if (valor === 'Aprobado') {
        var idvehiculo = VehiculoId;
        var idconductor = ConductorId;
        var idestudio = EstudioNucdoc;
        $(`#proceso_estudio`).val('Rea_Sol_Seg');

        if (idvehiculo.length > 0 && idconductor.length > 0 && idestudio.length > 0) {
          $('#aprobar_estudio_total').show();
        } else {
          alert('No puede aprobar el estudio falta algún dato de la primera hilera');
        }
      }

      if (valor === 'Pendiente') {
        var idvehiculo = VehiculoId;
        var idconductor = ConductorId;
        var idestudio = EstudioNucdoc;
        $(`#proceso_estudio`).val('Pen_Sol_Seg');

        if (idvehiculo.length > 0 && idconductor.length > 0 && idestudio.length > 0) {
          $('#aprobar_estudio_total').show();
          $('#causalidad').attr('disabled', false);
          $('#causalidad').focus();
        } else {
          alert('No puede poner pendien el estudio falta algún dato de la primera hilera');
        }
      }

      if (valor === 'Rechazado') {
        var idvehiculo = VehiculoId;
        var idconductor = ConductorId;
        var idestudio = EstudioNucdoc;
        $(`#proceso_estudio`).val('Rec_Sol_Seg');

        if (idvehiculo.length > 0 && idconductor.length > 0 && idestudio.length > 0) {
          $('#aprobar_estudio_total').show();
          $('#causalidad').attr('disabled', false);
          $('#causalidad').focus();
        } else {
          alert('No puede rechazar el estudio falta algún dato de la primera hilera');
        }
      }

      if (valor === 'Rechazado_modificar') {
        var idvehiculo = VehiculoId;
        var idconductor = ConductorId;
        var idestudio = EstudioNucdoc;

        if (idvehiculo.length > 0 && idconductor.length > 0 && idestudio.length > 0) {
          $('#aprobar_estudio_total').show();
          $('#causalidad').attr('disabled', false);
          $('#causalidad').focus();
        } else {
          alert('No puede poner rechazado para modificar el estudio falta algún dato de la primera hilera');
        }
      }
    }

    if (select.tagName === 'SELECT' && select.id.startsWith('estado_seguridad')) {
      const estado = select.value;
      let SolicitudId = select.getAttribute("data-SolicitudId");
      //proceso
      if (estado == 'pendiente') {
        $(`#procesoprefiltro`).val('Pen_Sol_PreR');
      }

      if (estado == 'rechazado') {
        $(`#procesoprefiltro`).val('Rec_Sol_PreR');
      }

      if (estado == 'cancelado') {
        $(`#procesoprefiltro`).val('Can_Sol_PreR');
      }

      if (estado == 'aprobado') {
        $(`#procesoprefiltro`).val('Rea_Sol_PreR');
      }

      if (estado == 'rechazado para modificar') {
        $(`#procesoprefiltro`).val('Rec_mod_Sol_PreR');
      }
    }
  });

  input.addEventListener('input', function () {
    const filtro = this.value.toLowerCase().trim();
    let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
    let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
    Litar_solicitudes(FechaInicial, FechaFinal, filtro, 'todos');
  });
}

async function Litar_solicitudes(FechaInicial, FechaFinal, Buscar = '', Valor = '') {
  try {
    let datos = new FormData();
    datos.append('estado', 't');
    datos.append('fecha_inicial', FechaInicial);
    datos.append('fecha_final', FechaFinal);
    datos.append('buscar', Buscar);
    datos.append('valor', Valor);

    const ul = document.getElementById('List_estudios_seguridad');
    ul.innerHTML = ''; // Limpiar lista antes de pintar

    await fetch($('#base_url').val() + 'validacionparametros/Consutar_solicitudes_seguridad', {
      method: 'POST',
      cache: 'no-cache',
      body: datos,
    })
      .then(response => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(function (data) {
        if (data.datos.length > 0) {
          const registros = data.datos;

          // Ordenar por fecha y hora (descendente)
          registros.forEach(r => {
            if (!r.fecha) r.fecha = '2000-01-01';
            if (!r.hora) r.hora = '00:00:00';
          });
          registros.sort((a, b) => new Date(`${b.fecha}T${b.hora}`) - new Date(`${a.fecha}T${a.hora}`));

          // Totales
          document.getElementById('total_general').innerHTML = data.total_general || 0;
          document.getElementById('total_prefiltros').innerHTML = data.total_prefiltros || 0;
          document.getElementById('total_estudios').innerHTML = data.total_estudios || 0;
          document.getElementById('total_aprobados').innerHTML = data.total_general_aprobados || 0;

          registros.forEach((element) => {
            // console.log("🚀 ~ Litar_solicitudes ~ element:", element.prioritaria)
            // Variables necesarias
            let estado = '';
            let itr = '';
            let status_e = '';
            let status_es = '';
            let status_pre = '';
            let col_status = '';
            let title = '';

            const operacion = element.operacion || 'Nuevo';

            // ===========================
            // PREFILTROS
            // ===========================
            if (element.tipo === 'prefiltro') {

              // Estado visual
              if (operacion === 'Nuevo') {
                if (element.estado === 'aprobado') {
                  col_status = '#14A44D';
                  title = 'Prefiltro aprobado Autoriza HV';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Prefiltro Aprobado</span>";
                } else if (element.estado === 'pendiente') {
                  col_status = '#E4A11B';
                  title = 'Prefiltro Pendiente';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Prefiltro Pendiente</span>";
                } else if (element.estado === 'vencida') {
                  col_status = '#5D4037';
                  title = 'Prefiltro Vencido';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Vencido</span>";
                } else if (element.estado === 'pendiente_iniciar') {
                  col_status = '#332D2D';
                  title = 'Prefiltro Pendiente por iniciar';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Prefiltro Pendiente Iniciar</span>";
                } else if (element.estado === 'iniciado') {
                  col_status = '#0D47A1';
                  title = 'Prefiltro iniciado';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Prefiltro Iniciado</span>";
                } else if (element.estado === 'rechazado') {
                  col_status = '#DC4C64';
                  title = 'Prefiltro rechazado';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Rechazado</span>";
                } else if (element.estado === 'cancelado') {
                  col_status = '#D50000';
                  title = 'Prefiltro cancelado';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Prefiltro Cancelado</span>";
                } else if (element.estado === 'Rechazado_modificar') {
                  col_status = '#F44336';
                  title = 'Prefiltro rechazado para modificar';
                  estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-info'>Prefiltro Rechazado para modificar</span>";
                }
                status_e = element.campo || '';
                status_es = estado;
              }

              // Validar si es ITR
              itr = (element.itr === 'SI')
                ? '<span class="label label-success">Si</span>'
                : '<span class="label label-danger">No</span>';

              // ===========================
              // RENDER HTML DEL ELEMENTO
              // ===========================

              // Contenedor avatar
              const avatarDiv = document.createElement('div');
              avatarDiv.className = 'avatar avatar-xl rounded-circle position-relative d-flex justify-content-center align-items-center me-3 me-sm-0 me-xl-2';
              avatarDiv.style.width = '50px';
              avatarDiv.style.height = '50px';
              avatarDiv.style.border = '0.9px solid #c0c0c0';
              avatarDiv.style.fontSize = '10px';
              avatarDiv.style.color = '#1976D2';
              avatarDiv.style.fontWeight = 'bold';
              avatarDiv.style.backgroundColor = '#f8f9fa';

              // Texto (placa)
              const placaSpan = document.createElement('span');
              placaSpan.className = 'z-1';
              placaSpan.innerText = element.placa || '';

              // Contador de interacciones
              const totalInteracciones = element.interacciones?.[0]?.Total_Interacciones ?? 0;
              const contadorSpan = document.createElement('span');
              contadorSpan.className = 'bg-primary rounded-circle top-0 end-0 position-absolute text-white d-flex justify-content-center align-items-center fs-10 fw-semibold lh-1';
              contadorSpan.style.height = '1rem';
              contadorSpan.style.width = '1rem';
              contadorSpan.innerText = totalInteracciones;

              avatarDiv.appendChild(contadorSpan);
              avatarDiv.appendChild(placaSpan);

              // LI contenedor
              const li = document.createElement('li');
              li.className = 'nav-item read estudio-animado';
              li.role = 'presentation';
              li.addEventListener('animationend', () => {
                li.classList.remove('estudio-animado');
              });

              // Link
              const link = document.createElement('a');
              link.className = 'nav-link d-flex align-items-center justify-content-center p-2';
              link.setAttribute('data-bs-toggle', 'tab');
              link.setAttribute('data-chat-thread', 'data-chat-thread');
              link.setAttribute('href', `#tab-thread-${element.esoli}`);
              link.setAttribute('role', 'tab');
              link.setAttribute('aria-selected', 'false');
              link.setAttribute('title', title);
              link.setAttribute('data-PreestudioId', element.esoli);
              // link.setAttribute('data-solicitudId', element.esoli);
              link.setAttribute('data-Placa', element.placa);
              link.setAttribute('data-Operacion', element.operacion);
              // link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2 ?? '');
              link.setAttribute('data-EscenarioId', element.escenario_id);
              // link.setAttribute('data-EsxisteEstudio', element.existe_estudio ?? '');
              link.setAttribute('data-proceso_prefiltro_itr', element.itr ?? '');
              link.setAttribute('data-Estado', element.estado);
              // link.setAttribute('data-VehiculoId', element.vehiculo_id ? element.vehiculo_id : '');
              // link.setAttribute('data-conductorId', element.conductor_id);
              link.classList.add('btn-ver');

              // Contenido
              const contentDiv = document.createElement('div');
              contentDiv.className = 'flex-1 d-sm-none d-xl-block';

              const topRow = document.createElement('div');
              topRow.className = 'd-flex justify-content-between align-items-center';
              topRow.innerHTML = `
                <div class="d-flex justify-content-between align-items-center w-100 position-relative grupo-hover">
                  <h5 class="fs-9 text-body-tertiary fw-normal name text-nowrap mb-0">
                    ${status_es} | Numero: ${element.esoli}
                  </h5>
                </div>
              `;

              let colorOperacion = '#6c757d'; // gris
              switch (operacion) {
                case 'Actualizar': colorOperacion = '#E4A11B'; break;
                case 'Habilitar': colorOperacion = '#14A44D'; break;
                case 'Nuevo': colorOperacion = '#0D47A1'; break;
              }

              const bottomRow = document.createElement('div');
              bottomRow.className = 'd-flex justify-content-between';
              bottomRow.innerHTML = `
                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message">
                  Operación: <b style="color:${colorOperacion}">${operacion}</b> | ${element.fecha} ${element.hora} | ${element.prioritaria === null ? `` : `<span class="badge badge-phoenix badge-phoenix-danger">Prioritaria <span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`}
                </p>
              `;

              const hr = document.createElement('div');
              hr.className = 'border-top border-translucent border-dashed';

              const gestionado = document.createElement('div');
              gestionado.className = 'd-flex justify-content-between';
              gestionado.innerHTML = `
                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message" id='GestionadoPor${element.esoli}'></p>
              `;

              contentDiv.appendChild(topRow);
              contentDiv.appendChild(bottomRow);
              contentDiv.appendChild(hr);
              contentDiv.appendChild(gestionado);

              link.appendChild(avatarDiv);
              link.appendChild(contentDiv);
              li.appendChild(link);
              ul.appendChild(li);
            }

            // ===========================
            // ESTUDIOS (por ahora solo log)
            // ===========================
            else if (element.tipo === 'estudio') {
              // console.log('Estudio:', element);

              if (operacion === 'Nuevo' || operacion === 'Habilitar' || operacion === 'Actualizar') {
                /* Validar si esta activo de la creacion de recurso nuevo para cambiar la etiqueda */
                if (operacion === 'Actualizar') {
                  if (element.estado_prefiltro === 'Pendiente' || element.estado_prefiltro === 'Iniciado' || element.estado_prefiltro === 'Rechazado' || element.estado_prefiltro === 'Aprobado') {
                    if (element.estado_creacion === 'TERCERO CREADO') {
                      col_status = '#0D47A1';
                      title = 'Recurso Creado';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Nuevo recurso creado</span>";
                    } else {
                      if (element.estado_prefiltro === 'Aprobado') {
                        col_status = '#14A44D';
                        title = 'Nuevo recurso Aprobado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-info'>Nuevo recurso Aprobado</span>";
                      } else if (element.estado_prefiltro === 'Pendiente') {
                        col_status = '#E4A11B';
                        title = 'Nuevo recurso Pendiente';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Nuevo recurso Pendiente</span>";
                      } else if (element.estado_prefiltro === 'Iniciado') {
                        col_status = '#0D47A1';
                        title = 'Nuevo recurso Iniciado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Nuevo recurso Iniciado</span>";
                      } else if (element.estado_prefiltro === 'Rechazado') {
                        col_status = '#F44336';
                        title = 'Nuevo recurso Rechazado';
                        estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Nuevo recurso Rechazado</span>";
                      }
                    }
                    status_es = estado;
                  } else {
                    if (element.estado == 'Aprobado') {
                      col_status = '#14A44D';
                      title = 'Estudio de seguridad aprobado';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
                    } else if (element.estado == 'Pendiente') {
                      col_status = '#E4A11B';
                      title = 'Estudio de seguridad Pendiente';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
                    } else if (element.estado == 'vencida') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad Vencido';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
                    } else if (element.estado == 'pendiente_iniciar') {
                      col_status = '#E4A11B';
                      title = 'Estudio de seguridad Pendiente por iniciar';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
                    } else if (element.estado == 'iniciado') {
                      col_status = '#0D47A1';
                      title = 'Estudio de seguridad iniciado';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
                    } else if (element.estado == 'Rechazado') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad rechazado';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger' >Estudio Rechazado</span>";
                    } else if (element.estado == 'cancelado') {
                      col_status = '#D50000';
                      title = 'Estudio de seguridad cancelado';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
                    } else if (element.estado == 'Rechazado_modificar') {
                      col_status = '#F44336';
                      title = 'Estudio de seguridad rechazado para modificar';
                      estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
                    }
                    status_es = estado;
                  }
                } else {
                  if (element.estado == 'Aprobado') {
                    col_status = '#14A44D';
                    title = 'Estudio de seguridad aprobado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
                  } else if (element.estado == 'Pendiente') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
                  } else if (element.estado == 'vencida') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad Vencido';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
                  } else if (element.estado == 'pendiente_iniciar') {
                    col_status = '#E4A11B';
                    title = 'Estudio de seguridad Pendiente por iniciar';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
                  } else if (element.estado == 'iniciado') {
                    col_status = '#0D47A1';
                    title = 'Estudio de seguridad iniciado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
                  } else if (element.estado == 'Rechazado') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger' >Estudio Rechazado</span>";
                  } else if (element.estado == 'cancelado') {
                    col_status = '#D50000';
                    title = 'Estudio de seguridad cancelado';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
                  } else if (element.estado == 'Rechazado_modificar') {
                    col_status = '#F44336';
                    title = 'Estudio de seguridad rechazado para modificar';
                    estado = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
                  }
                  status_es = estado;
                }
              }

              // Validar si es ITR
              itr = (element.itr === 'SI')
                ? '<span class="fs-10 badge badge-phoenix badge-phoenix-success">Si</span>'
                : '<span class="fs-10 badge badge-phoenix badge-phoenix-danger">No</span>';

              // ===========================
              // RENDER HTML DEL ELEMENTO
              // ===========================

              // Contenedor avatar
              const avatarDiv = document.createElement('div');
              avatarDiv.className = 'avatar avatar-xl rounded-circle position-relative d-flex justify-content-center align-items-center me-3 me-sm-0 me-xl-2';
              avatarDiv.style.width = '50px';
              avatarDiv.style.height = '50px';
              avatarDiv.style.border = '0.9px solid #c0c0c0';
              avatarDiv.style.fontSize = '10px';
              avatarDiv.style.color = '#1976D2';
              avatarDiv.style.fontWeight = 'bold';
              avatarDiv.style.backgroundColor = '#f8f9fa';

              // Texto (placa)
              const placaSpan = document.createElement('span');
              placaSpan.className = 'z-1';
              placaSpan.innerText = element.placa || '';

              // Contador de interacciones
              const totalInteracciones = element.interacciones?.[0]?.Total_Interacciones ?? 0;
              const contadorSpan = document.createElement('span');
              contadorSpan.className = 'bg-primary rounded-circle top-0 end-0 position-absolute text-white d-flex justify-content-center align-items-center fs-10 fw-semibold lh-1';
              contadorSpan.style.height = '1rem';
              contadorSpan.style.width = '1rem';
              contadorSpan.innerText = totalInteracciones;

              avatarDiv.appendChild(contadorSpan);
              avatarDiv.appendChild(placaSpan);

              // LI contenedor
              const li = document.createElement('li');
              li.className = 'nav-item read estudio-animado';
              li.role = 'presentation';
              li.addEventListener('animationend', () => {
                li.classList.remove('estudio-animado');
              });

              // Link
              const link = document.createElement('a');
              link.className = 'nav-link d-flex align-items-center justify-content-center p-2';
              link.setAttribute('data-bs-toggle', 'tab');
              link.setAttribute('data-chat-thread', 'data-chat-thread');
              link.setAttribute('href', `#tab-thread-${element.esoli}`);
              link.setAttribute('role', 'tab');
              link.setAttribute('aria-selected', 'false');
              link.setAttribute('title', title);

              link.setAttribute('data-solicitudId', element.id_estudio);
              link.setAttribute('data-Placa', element.placa);
              link.setAttribute('data-VehiculoId', element.id_vehiculo);
              link.setAttribute('data-conductorId', element.id_conductor);
              link.setAttribute('data-Operacion', element.operacion);
              // link.setAttribute('data-PreestudioId', element.id_preestudio ? element.id_preestudio : element.id_estudio);
              link.setAttribute('data-Nombre', element.nombre + ' ' + element.apellido1 + ' ' + element.apellido2 ?? '');
              // link.setAttribute('data-DataArray', JSON.stringify(data));
              link.setAttribute('data-Estado', element.estado);
              link.setAttribute('data-EstadoPrefiltro', element.estado_prefiltro);
              link.setAttribute('data-EstadoCreacion', element.estado_creacion ?? '');
              link.setAttribute('data-ObservacionGeneral', element.observacion_general ?? '');
              link.setAttribute('data-EscenarioId', element.escenario_id);
              link.setAttribute('data-EstudioIdC', element.id_estudio_c);
              link.setAttribute('data-EsxisteEstudio', element.existe_estudio);
              link.setAttribute('data-proceso_prefiltro_itr', element.itr);
              link.classList.add('btn-listado');

              // Contenido
              const contentDiv = document.createElement('div');
              contentDiv.className = 'flex-1 d-sm-none d-xl-block';

              const topRow = document.createElement('div');
              topRow.className = 'd-flex justify-content-between align-items-center';
              topRow.innerHTML = `
                <div class="d-flex justify-content-between align-items-center w-100 position-relative grupo-hover">
                  <h5 class="fs-9 text-body-tertiary fw-normal name text-nowrap mb-0">
                    ${status_es} | Numero: ${element.id_estudio}
                  </h5>
                </div>
              `;

              let colorOperacion = '#6c757d'; // gris
              switch (operacion) {
                case 'Actualizar': colorOperacion = '#E4A11B'; break;
                case 'Habilitar': colorOperacion = '#14A44D'; break;
                case 'Nuevo': colorOperacion = '#0D47A1'; break;
              }

              const bottomRow = document.createElement('div');
              bottomRow.className = 'd-flex justify-content-between';
              bottomRow.innerHTML = `
                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message">
                   Operación: <b style="color:${colorOperacion}">${operacion}</b> | ${element.fecha} ${element.hora} | ${element.prioritaria === null ? `` : `<span class="badge badge-phoenix badge-phoenix-danger">Prioritaria <span class="ms-1" data-feather="alert-octagon" style="height:12.8px;width:12.8px;"></span></span>`}
                </p>
              `;

              // bottomRow.innerHTML = `
              //   <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message">
              //     Operación: <b style="color:${colorOperacion}">${operacion}</b> | ${element.fecha} ${element.hora}
              //   </p>
              // `;

              const hr = document.createElement('div');
              hr.className = 'border-top border-translucent border-dashed';

              const gestionado = document.createElement('div');
              gestionado.className = 'd-flex justify-content-between';
              gestionado.innerHTML = `
                <p class="fs-10 mb-0 line-clamp-1 text-body-tertiary text-opacity-85 message" id='GestionadoPor${element.id_estudio}'></p>
              `;

              contentDiv.appendChild(topRow);
              contentDiv.appendChild(bottomRow);
              contentDiv.appendChild(hr);
              contentDiv.appendChild(gestionado);

              link.appendChild(avatarDiv);
              link.appendChild(contentDiv);
              li.appendChild(link);
              ul.appendChild(li);

            }
            else {
              console.warn('Tipo desconocido:', element.tipo);
            }
          });
        } else {
          const li = document.createElement('li');
          li.innerHTML = `<div class="text-center text-muted py-2">Sin registros en la lista</div>`;
          ul.appendChild(li);
        }
      })
      .catch(error => {
        console.error('Error cargando solicitudes:', error);
      });
  } catch (error) {
    console.error('Error general:', error);
  }
}

async function CargarDatosPrefiltros(PreestudioId, SolicitudId, Operacion, Placa, EscenarioId, Estado, ProcesoPrefiltroItr) {
  const baseUrl = $('#base_url').val();
  const contenedor = '.tab-content.flex-1';

  // URL dinámica para poder acceder al estudio directamente
  const nuevaUrl = `${window.location.origin}${window.location.pathname}?idmenu=4&submenu=114&solicitud=${codificarBase64(PreestudioId)}`;
  window.history.pushState({ PreestudioId }, '', nuevaUrl);

  try {
    // Mostrar loader
    $(contenedor).html('<div class="p-4 text-center">Cargando estudio...</div>');

    // Cargar la vista desde el servidor
    const respuesta = await fetch(`${baseUrl}views/templates/template_prefiltros_seguridad.phtml`, {
      method: 'GET',
      headers: { 'Content-Type': 'text/html' },
      cache: 'no-cache',
    });

    if (!respuesta.ok) {
      throw new Error(`Error al cargar la vista: ${respuesta.status}`);
    }

    const html = await respuesta.text();

    // Insertar la vista en el contenedor
    document.querySelector(contenedor).innerHTML = html;

    const BotonInicioPrefiltro = document.getElementById('iniciacion_preestudio');
    BotonInicioPrefiltro.setAttribute('data-Placa', Placa);
    BotonInicioPrefiltro.setAttribute('data-PrefiltroId', PreestudioId);
    BotonInicioPrefiltro.setAttribute('data-PreestudioId', PreestudioId);
    // BotonInicioPrefiltro.setAttribute('data-SolicitudId', SolicitudId);
    BotonInicioPrefiltro.setAttribute('data-Operacion', Operacion);
    BotonInicioPrefiltro.setAttribute('data-EscenarioId', EscenarioId);
    BotonInicioPrefiltro.setAttribute('data-Estado', Estado);

    const SelectRespuestaSeguridad = document.getElementById('estado_seguridad');
    SelectRespuestaSeguridad.setAttribute('data-PreestudioId', PreestudioId);
    Estado === 'pendiente_iniciar' || Estado === 'aprobado' ? SelectRespuestaSeguridad.disabled = true : '';

    const ProcesoFiltro = document.getElementById('procesoprefiltro');
    Estado === 'pendiente_iniciar' ? ProcesoFiltro.disabled = true : ProcesoFiltro.disabled = true;

    const SeguridasdObservacion = document.getElementById('seguridad_observa');
    Estado === 'pendiente_iniciar' || Estado === 'aprobado' ? SeguridasdObservacion.disabled = true : '';

    const BotonGuardarPrefiltro = document.getElementById('enviar_seguridad');
    BotonGuardarPrefiltro.setAttribute('data-Placa', Placa);
    BotonGuardarPrefiltro.setAttribute('data-PrefiltroId', PreestudioId);
    BotonGuardarPrefiltro.setAttribute('data-EscenarioId', EscenarioId);
    BotonGuardarPrefiltro.setAttribute('data-Operacion', Operacion);

    if (Estado === 'pendiente_iniciar') {
      document.getElementById('btn-acciones-prefiltro').style.display = '';
      document.getElementById('enviar_seguridad').style.display = 'none';
    } else if (Estado === 'iniciado') {
      document.getElementById('enviar_seguridad').style.display = '';
      document.getElementById('btn-acciones-prefiltro').style.display = 'none';
    } else if (Estado === 'aprobado') {
      document.getElementById('enviar_seguridad').style.display = 'none';
      document.getElementById('btn-acciones-prefiltro').style.display = 'none';
    } else if (Estado === 'cancelado') {
      document.getElementById('btn-acciones-prefiltro').style.display = 'none';
      document.getElementById('enviar_seguridad').style.display = 'none';
    } else if (Estado === 'Rechazado_modificar') {
      document.getElementById('btn-acciones-prefiltro').style.display = 'none';
      document.getElementById('enviar_seguridad').style.display = 'none';
    }

    //Llenar los datos del prefiltro 
    let data = new FormData();
    data.append('preestudio', PreestudioId);
    data.append('solicitud', PreestudioId);
    fetch($('#base_url').val() + 'validacionparametros/Ver_Seguridad', {
      method: 'POST',
      cache: 'no-cache',
      body: data,
    })
      .then(response => response.json())
      .then(function (data) {
        if (data) {
          $(`#vid`).html(data.ver_seguridad.id);
          $(`#vcliente`).html(data.ver_seguridad.nombre_cliente);
          $(`#vplaca`).html(data.ver_seguridad.placa + ' - ' + data.ver_seguridad.placa_trailer);
          $(`#vconse`).html(data.ver_sePreestudioId);
          $(`#vfecha`).html(data.ver_seguridad.fecha);
          $(`#vhora`).html(data.ver_seguridad.hora);
          $(`#vuser`).html(data.ver_seguridad.usuario_operaciones);

          if (data.ver_seguridad.documento_propietario === data.ver_seguridad.Propietario) {
            $(`#vpropi`).html(data.ver_seguridad.nombre_propietario);
            $(`#vpropi`).css('backgroundColor', '#A5D6A7');
            $(`#vpropi`).css('Color', '#FFFFFF');
            $(`#vpdocumento`).css('backgroundColor', '#A5D6A7');
            $(`#vpdocumento`).css('Color', '#FFFFFF');
            $(`#vpdocumento`).html(data.ver_seguridad.documento_propietario);
            $(`#estado_tercero_propietario`).html('<i class="fas fa-user-check"></i> Tercero Creado');
            $(`#estado_tercero_propietario`).css('backgroundColor', '#A5D6A7');
          } else {
            $(`#estado_tercero_propietario`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
            $(`#estado_tercero_propietario`).css('backgroundColor', '#FFFFFF');
            $(`#vpropi`).css('backgroundColor', '#FFFFFF');
            $(`#vpropi`).css('Color', '#000000');
            $(`#vpdocumento`).css('backgroundColor', '#FFFFFF');
            $(`#vpdocumento`).css('Color', '#000000');
            $(`#vpropi`).html(data.ver_seguridad.nombre_propietario);
            $(`#vpdocumento`).html(data.ver_seguridad.documento_propietario);
          }

          if (data.ver_seguridad.documento_tenedor === data.ver_seguridad.Poseedor) {
            $(`#vtene`).html(data.ver_seguridad.nombre_tenedor);
            $(`#vtene`).css('backgroundColor', '#A5D6A7');
            $(`#vtene`).css('Color', '#FFFFFF');
            $(`#vtdocumento`).css('backgroundColor', '#A5D6A7');
            $(`#vtdocumento`).css('Color', '#FFFFFF');
            $(`#vtdocumento`).html(data.ver_seguridad.documento_tenedor);
            $(`#estado_tercero_poseedor`).html('<i class="fas fa-user-check"></i> Tercero Creado');
            $(`#estado_tercero_poseedor`).css('backgroundColor', '#A5D6A7');
          } else {
            $(`#estado_tercero_poseedor`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
            $(`#estado_tercero_poseedor`).css('backgroundColor', '#FFFFFF');
            $(`#vtene`).css('backgroundColor', '#FFFFFF');
            $(`#vtene`).css('Color', '#000000');
            $(`#vtdocumento`).css('backgroundColor', '#FFFFFF');
            $(`#vtdocumento`).css('Color', '#000000');
            $(`#vtene`).html(data.ver_seguridad.nombre_tenedor);
            $(`#vtdocumento`).html(data.ver_seguridad.documento_tenedor);
          }

          if (data.ver_seguridad.documento_conductor === data.ver_seguridad.Conductor) {
            $(`#vcondu`).html(data.ver_seguridad.nombre_conductor);
            $(`#vcondu`).css('backgroundColor', '#A5D6A7');
            $(`#vcondu`).css('Color', '#FFFFFF');
            $(`#vcdocumento`).css('backgroundColor', '#A5D6A7');
            $(`#vcdocumento`).css('Color', '#FFFFFF');
            $(`#vcdocumento`).html(data.ver_seguridad.documento_conductor);
            $(`#estado_tercero_conductor`).html('<i class="fas fa-user-check"></i> Tercero Creado');
            $(`#estado_tercero_conductor`).css('backgroundColor', '#A5D6A7');
          } else {
            $(`#estado_tercero_conductor`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
            $(`#estado_tercero_conductor`).css('backgroundColor', '#FFFFFF');
            $(`#estado_tercero_conductor`).html('<i class="fas fa-user-times"></i> Tercero Pendiente');
            $(`#estado_tercero_conductor`).css('backgroundColor', '#FFFFFF');
            $(`#vcondu`).css('backgroundColor', '#FFFFFF');
            $(`#vcondu`).css('Color', '#000000');
            $(`#vcdocumento`).css('backgroundColor', '#FFFFFF');
            $(`#vcdocumento`).css('Color', '#000000');
            $(`#vcondu`).html(data.ver_seguridad.nombre_conductor);
            $(`#vcdocumento`).html(data.ver_seguridad.documento_conductor);
          }

          if (data.ver_seguridad.documento_propietario_trailer !== '') {
            if (data.ver_seguridad.documento_propietario_trailer === data.ver_seguridad.Propietario_Trailer) {
              $(`#ptcondu`).html(data.ver_seguridad.nombre_propietario_trailer);
              $(`#ptcondu`).css('backgroundColor', '#A5D6A7');
              $(`#ptcondu`).css('Color', '#FFFFFF');
              $(`#ptcdocumento`).css('backgroundColor', '#A5D6A7');
              $(`#ptcdocumento`).css('Color', '#FFFFFF');
              $(`#ptcdocumento`).html(data.ver_seguridad.documento_propietario_trailer);
              $(`#estado_tercero_pro_trailer`).html('<i class="fas fa-user-check"></i> Tercero Creado');
              $(`#estado_tercero_pro_trailer`).css('backgroundColor', '#A5D6A7');
            } else {
              $(`#ptcondu`).css('backgroundColor', '#FFFFFF');
              $(`#ptcondu`).css('Color', '#000000');
              $(`#ptcdocumento`).css('backgroundColor', '#FFFFFF');
              $(`#ptcdocumento`).css('Color', '#000000');
              $(`#ptcondu`).html(data.ver_seguridad.nombre_propietario_trailer);
              $(`#ptcdocumento`).html(data.ver_seguridad.documento_propietario_trailer);
              $(`#estado_tercero_pro_trailer`).html('<i class="fas fa-user-check"></i> Tercero Pendiente');
              $(`#estado_tercero_pro_trailer`).css('backgroundColor', '#FFFFFF');
            }
          } else {
            // console.log('Sin pripietario de trailer');
            $(`#ptcondu`).html('No Aplica');
            $(`#ptcondu`).css('backgroundColor', '#FFFFFF');
            $(`#ptcondu`).css('Color', '#000000');
            $(`#ptcdocumento`).css('backgroundColor', '#FFFFFF');
            $(`#ptcdocumento`).css('Color', '#000000');
            $(`#ptcdocumento`).html('No Aplica');
            $(`#estado_tercero_pro_trailer`).html('No Aplica');
            $(`#estado_tercero_pro_trailer`).css('backgroundColor', '#FFFFFF');
          }

          $(`#vweb`).html(data.ver_seguridad.web_satelital);
          $(`#vwuser`).html(data.ver_seguridad.usuario_satelital);
          $(`#vwclave`).html(data.ver_seguridad.clave_satelital);
          $(`#vuser`).html(data.ver_seguridad.usuario);

          /* Observaciones operaciones */
          document.getElementById(`observacion_operaciones`).value = data.ver_seguridad.observacion;

          // Listar Referencias
          $(`#consulta_referencia`).html('');

          if (data.resultado_referencias) {
            data.resultado_referencias.forEach(function (element) {
              $(`#consulta_referencia`).append(
                `<tr>
                          <td style="1px; width: auto; white-space: nowrap;">${element.nombre_empresa}</td>
                          <td style="1px; width: auto; white-space: nowrap;">${element.fecha_ingreso}</td>
                          <td style="1px; width: auto; white-space: nowrap;">${element.fecha_retiro}</td>
                          <td style="1px; width: auto; white-space: nowrap;">${element.persona_contacto}</td>
                          <td style="1px; width: auto; white-space: nowrap;">${element.celular}</td>
                          <td style="1px; width: auto; white-space: nowrap;">${element.cargo}</td>
                      </tr>`,
              );
            });
          } else {
            $(`#consulta_referencia`).html(
              `<tr>
                      <td></td>
                      <td></td>
                      <td>No hay Referencias</td>
                      <td></td>
                      <td></td>
                      <td></td>
                  </tr>`,
            );
          }

          $(`#consulta_servicio`).html('');
          if (data.resultado_preestudio) {
            data.resultado_preestudio.forEach(function (element) {
              $(`#consulta_servicio`).append(
                `<tr>
                        <td style="1px; width: auto; white-space: nowrap;">${element.nundoc_solicitud}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${element.nombre_cliente}</td>
                        <td style="1px; width: auto; white-space: nowrap;" colspan="2"> <b>Origen:</b> ${element.orige}    <b >Destino:</b> ${element.dest}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${element.usuario_auditor}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                    </tr>`,
              );
              document.getElementById(`observacion_servicio_cliente`).value = element.observaciones;
            });

            /* Datos del contenedor para la solicitud */
            $(`#datos_contenedor`).html('');
            if (data.nombre_contenedor != '' && Array.isArray(data.nombre_contenedor)) {
              data.nombre_contenedor.forEach(function (contenedor) {
                $(`#datos_contenedor`).append(
                  `<tr>
                        <td style="1px; width: auto; white-space: nowrap;">${contenedor.devol_numcont}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${data.nombre_contenedor}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${contenedor.devol_dias}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${contenedor.devolucion_contenedor}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${contenedor.devol_direccion}</td>
                      </tr>`,
                );
              });
            } else {
              $(`#datos_contenedor`).append(
                `<tr>
                          <td style="1px; width: auto; white-space: nowrap;" colspan='5'>No tiene contendor</td>
                      </tr>`,
              );
            }
          }

          $(`#consulta_documentos`).html('');
          if (data.resultado_documentos) {
            data.resultado_documentos.forEach(function (element, index) {
              $(`#consulta_documentos`).append(
                `<tr>
                        <td style="1px; width: auto; white-space: nowrap;">${element.tipo_hv}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${element.clase}</td>
                        <td style="1px; width: auto; white-space: nowrap;"> <a href="#" onclick="abrir_fotos('${element.ruta}' , '${element.nombre_archivo}')" class="cell-detail hint--top-left" data-hint="">
                        <span class="icon mdi mdi-file-text text-center"  data-toggle="modal" title="Documento"></span>
                        </a></td>
                        <td style="1px; width: auto; white-space: nowrap;">${element.usuario}</td>
                        <td style="1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                      </tr>`,
              );
            });
          } else {
            $(`#consulta_documentos`).append(
              `<tr>
                        <td style="1px; width: auto; white-space: nowrap;" colspan='5'>No tiene Documentos</td>
                    </tr>`,
            );
          }

          $(`#consulta_tbservicio`).html('');
          if (data.resultado_preestudio) {
            data.resultado_preestudio.forEach(function (element) {
              // document.getElementById("aprobar_estudio_total").setAttribute('data-SolicitudId', JSON.stringify({ solicitudes: [element.nundoc_solicitud] }));
              $(`#consulta_tbservicio`).append(
                ` <tr>
                      <td style="padding: 1px; width: auto; white-space: nowrap;">${element.nundoc_solicitud}</td>
                      <td style="padding: 1px; width: auto; white-space: nowrap;">${element.nombre_cliente}</td>
                      <td style="padding: 1px;">${element.orige} - ${element.dest}</td>
                      <td style="padding: 1px; width: auto; white-space: nowrap;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
                      <td style="padding: 1px; width: auto; white-space: nowrap;">${element.usuario_auditor}</td>
                      <td style="padding: 1px; width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                  </tr>`);
            });
          }

          $(`#tbl_observaciones`).html('');
          if (data.resultado_observacion) {
            data.resultado_observacion.forEach(function (element, index) {
              $(`#tbl_observaciones`).append(
                `<tr>
                  <td style="padding: 1px; width: auto; white-space: nowrap;">${element.id}</td>
                  <td style="padding: 1px;">${element.observacion}</td>
                  <td style="padding: 1px; width: auto; white-space: nowrap;">${element.fecha}-${element.hora}</td>
                  <td style="padding: 1px; width: auto; white-space: nowrap;">${element.usuario}</td>
              </tr>`);
            });
          } else {
            $(`#tbl_observaciones`).append(
              `<tr>
                <td style="padding: 1px; width: auto; white-space: nowrap;" colspan='5'>No tiene Observaciones</td>
            </tr>`,
            );
          }


          $(`#respuestas_seguridad`).html('');
          if (data.resultado_observacion) {
            data.resultado_observacion.forEach(function (element, index) {
              $(`#respuestas_seguridad`).append(
                `<tr>
                    <td style="padding: 1px; width: auto; white-space: nowrap;">${element.id}</td>
                    <td style="padding: 1px;">${element.observacion}</td>
                    <td style="padding: 1px; width: auto; white-space: nowrap;">${element.fecha}-${element.hora}</td>
                    <td style="padding: 1px; width: auto; white-space: nowrap;">${element.usuario}</td>
                </tr>`);
            });
          } else {
            $(`#respuestas_seguridad`).append(
              `<tr>
                  <td style="padding: 1px; width: auto; white-space: nowrap;" colspan='5'>No tiene Observaciones</td>
               </tr>`);
          }
        } else {
          alert('Error de operación');
        }
      })
      .catch(error => {
        alert(error);
      });

  } catch (error) {
    console.error('Error cargando vista:', error);
    document.querySelector(contenedor).innerHTML = `
      <div class="alert alert-danger p-3">Error cargando la vista del estudio.</div>`;
  }
}

async function cargarDatosEstudioPromesa(SolicitudId, Placa, ConductorId, VehiculoId, Operacion, Nombre, Estado, EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EstudioIdC, EscenarioId, ProcesoPrefiltroItr) {
  const baseUrl = $('#base_url').val();
  const contenedor = '.tab-content.flex-1';

  // URL dinámica para poder acceder al estudio directamente
  const nuevaUrl = `${window.location.origin}${window.location.pathname}?idmenu=4&submenu=114&solicitud=${codificarBase64(SolicitudId)}`;
  window.history.pushState({ SolicitudId }, '', nuevaUrl);

  try {
    // Mostrar loader
    $(contenedor).html('<div class="p-4 text-center">Cargando estudio...</div>');

    // Cargar la vista desde el servidor
    const respuesta = await fetch(`${baseUrl}views/templates/template_estudios_seguridad.phtml`, {
      method: 'GET',
      headers: { 'Content-Type': 'text/html' },
      cache: 'no-cache',
    });

    if (!respuesta.ok) {
      throw new Error(`Error al cargar la vista: ${respuesta.status}`);
    }

    const html = await respuesta.text();

    // Insertar la vista en el contenedor
    document.querySelector(contenedor).innerHTML = html;

    // Seleccionar el botón
    // Asignar dinámicamente los atributos data-*
    const botonInicio = document.getElementById('inicio_estudio');
    botonInicio.setAttribute('data-EstudioIdC', EstudioIdC);
    botonInicio.setAttribute('data-Placa', Placa);
    botonInicio.setAttribute('data-SolicitudId', SolicitudId);
    botonInicio.setAttribute('data-VehiculoId', VehiculoId);
    botonInicio.setAttribute('data-ConductorId', ConductorId);
    botonInicio.setAttribute('data-EscenarioId', EscenarioId);
    botonInicio.setAttribute('data-Nombre', Nombre);
    botonInicio.setAttribute('data-Estado', Estado);
    botonInicio.setAttribute('data-EstadoPrefiltro', EstadoPrefiltro);
    botonInicio.setAttribute('data-EstadoCreacion', EstadoCreacion);
    botonInicio.setAttribute('data-ObservacionGeneral', ObservacionGeneral);
    botonInicio.setAttribute('data-Operacion', Operacion);

    const SelectEstado = document.getElementById('estado_estu');
    SelectEstado.setAttribute('data-EstudioIdC', EstudioIdC);
    SelectEstado.setAttribute('data-Placa', Placa);
    SelectEstado.setAttribute('data-SolicitudId', SolicitudId);
    SelectEstado.setAttribute('data-VehiculoId', VehiculoId);
    SelectEstado.setAttribute('data-ConductorId', ConductorId);

    const BotonAprobar = document.getElementById('aprobar_estudio_total');
    BotonAprobar.setAttribute('data-EstudioIdC', EstudioIdC);
    BotonAprobar.setAttribute('data-Placa', Placa);
    BotonAprobar.setAttribute('data-SolicitudIdEstudio', SolicitudId);
    BotonAprobar.setAttribute('data-VehiculoId', VehiculoId);
    BotonAprobar.setAttribute('data-ConductorId', ConductorId);
    BotonAprobar.setAttribute('data-Operacion', Operacion);
    BotonAprobar.setAttribute('data-EscenarioId', EscenarioId);
    BotonAprobar.setAttribute('data-Nombre', Nombre);
    BotonAprobar.setAttribute('data-Estado', Estado);
    BotonAprobar.setAttribute('data-Estado', Estado);
    BotonAprobar.setAttribute('data-EstadoPrefiltro', EstadoPrefiltro);
    BotonAprobar.setAttribute('data-EstadoCreacion', EstadoCreacion);
    BotonAprobar.setAttribute('data-ObservacionGeneral', ObservacionGeneral);

    const SelectHojasVida = document.getElementById('select_option');
    SelectHojasVida.setAttribute('data-EstudioNucdoc', SolicitudId);
    SelectHojasVida.setAttribute('data-Placa', Placa);
    SelectHojasVida.setAttribute('data-VehiculoId', VehiculoId);
    SelectHojasVida.setAttribute('data-ConductorId', ConductorId);
    SelectHojasVida.setAttribute('data-EscenarioId', EscenarioId);
    SelectHojasVida.setAttribute('data-EscenarioId', EscenarioId);
    SelectHojasVida.setAttribute('data-Nombre', Nombre);
    SelectHojasVida.setAttribute('data-Estado', Estado);
    SelectHojasVida.setAttribute('data-EstadoPrefiltro', EstadoPrefiltro);
    SelectHojasVida.setAttribute('data-EstadoCreacion', EstadoCreacion);
    SelectHojasVida.setAttribute('data-ObservacionGeneral', ObservacionGeneral);
    SelectHojasVida.setAttribute('data-Operacion', Operacion);
    SelectHojasVida.setAttribute('data-EstudioIdC', EstudioIdC);

    const BotonGuardarPrefiltro = document.getElementById('btn_guardar_prefiltro_nuevo');
    BotonGuardarPrefiltro.setAttribute('data-solicitudId', SolicitudId);
    BotonGuardarPrefiltro.setAttribute('data-Placa', Placa);

    return new Promise((resolve, reject) => {
      let status_es = '';

      if (Estado) {
        if (Operacion === 'Actualizar' && ['Pendiente', 'Iniciado', 'Rechazado', 'Aprobado'].includes(EstadoPrefiltro)) { // Validar estados de nuevo recurso
          if (EstadoCreacion === 'TERCERO CREADO') { //
            if (['iniciado', 'Rechazado', 'Cancelado', 'cancelado', 'Rechazado_modificar', 'Pendiente', 'Aprobado', 'vencida'].includes(Estado)) {
              switch (Estado) {
                case 'Aprobado':
                  col_status = '#14A44D';
                  title = 'Estudio de seguridad aprobado';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
                  break;
                case 'Pendiente':
                  col_status = '#E4A11B';
                  title = 'Estudio de seguridad Pendiente';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
                  break;
                case 'vencida':
                  col_status = '#F44336';
                  title = 'Estudio de seguridad Vencido';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
                  break;
                case 'pendiente_iniciar':
                  col_status = '#E4A11B';
                  title = 'Estudio de seguridad Pendiente por iniciar';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
                  break;
                case 'iniciado':
                  col_status = '#0D47A1';
                  title = 'Estudio de seguridad iniciado';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
                  break;
                case 'Rechazado':
                  col_status = '#F44336';
                  title = 'Estudio de seguridad rechazado';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Rechazado</span>";
                  break;
                case 'Cancelado':
                case 'cancelado':
                  col_status = '#D50000';
                  title = 'Estudio de seguridad cancelado';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
                  break;
                case 'Rechazado_modificar':
                  col_status = '#F44336';
                  title = 'Estudio de seguridad rechazado para modificar';
                  status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
                  break;
              }
            } else {
              col_status = '#0D47A1';
              title = 'Recurso Creado';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Nuevo recurso creado</span>";
            }
          } else {
            switch (EstadoPrefiltro) {
              case 'Aprobado':
                col_status = '#14A44D';
                title = 'Nuevo recurso Aprobado';
                status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-info'>Nuevo recurso Aprobado</span>";
                break;
              case 'Pendiente':
                col_status = '#E4A11B';
                title = 'Nuevo recurso Pendiente';
                status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Nuevo recurso Pendiente</span>";
                break;
              case 'Iniciado':
                col_status = '#0D47A1';
                title = 'Nuevo recurso Iniciado';
                status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Nuevo recurso Iniciado</span>";
                break;
              case 'Rechazado':
                col_status = '#F44336';
                title = 'Nuevo recurso Rechazado';
                status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Nuevo recurso Rechazado</span>";
                break;
            }
          }
        } else {
          switch (Estado) {
            case 'Aprobado':
              col_status = '#14A44D';
              title = 'Estudio de seguridad aprobado';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Estudio Aprobado</span>";
              break;
            case 'Pendiente':
              col_status = '#E4A11B';
              title = 'Estudio de seguridad Pendiente';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente</span>";
              break;
            case 'vencida':
              col_status = '#F44336';
              title = 'Estudio de seguridad Vencido';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Vencido</span>";
              break;
            case 'pendiente_iniciar':
              col_status = '#E4A11B';
              title = 'Estudio de seguridad Pendiente por iniciar';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Pendiente Iniciar</span>";
              break;
            case 'iniciado':
              col_status = '#0D47A1';
              title = 'Estudio de seguridad iniciado';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Estudio Iniciado</span>";
              break;
            case 'Rechazado':
              col_status = '#F44336';
              title = 'Estudio de seguridad rechazado';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Rechazado</span>";
              break;
            case 'Cancelado':
            case 'cancelado':
              col_status = '#D50000';
              title = 'Estudio de seguridad cancelado';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Estudio Cancelado</span>";
              break;
            case 'Rechazado_modificar':
              col_status = '#F44336';
              title = 'Estudio de seguridad rechazado para modificar';
              status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Estudio Rechazado para modificar</span>";
              break;
          }
        }
      }

      //----------------------------------------------------------------//

      // Documentos campos
      let formdatadocumento = new FormData();
      formdatadocumento.append('placa', Placa);
      formdatadocumento.append('solicitud', SolicitudId);
      fetch($('#base_url').val() + 'validacionparametros/Documentos_Actualizar', {
        method: 'POST',
        cache: 'no-cache',
        body: formdatadocumento,
      })
        .then(response => response.json())
        .then(function (data) {
          setTimeout(() => {
            document.getElementById(`content_vehiculo`).style.display = 'none';
            document.getElementById(`content_conductor`).style.display = 'none';
            document.getElementById(`content_risk`).style.display = 'none';
            document.getElementById(`recoger_trailer`).style.display = 'none';
            document.getElementById(`recoger_trailer2`).style.display = 'none';


            document.getElementById(`observacion_operaciones_estudio`).value = ObservacionGeneral;
            //----------------------------------------------------------------//
            if ($(`.idvehiculo`).length) $(`.idvehiculo`).html(Placa);
            if ($(`.idconductor`).length) $(`.idconductor`).html(Nombre);
            if ($(`.idstudy`).length) $(`.idstudy`).html(SolicitudId);
            if ($(`.estadostudy`).length) $(`.estadostudy`).html(status_es);

            //----------------------------------------------------------------//
            if ($(`#idvehiculo`).length) $(`#idvehiculo`).val(VehiculoId);
            if ($(`#idconductor`).length) $(`#idconductor`).val(ConductorId);
            if ($(`#idstudy`).length) $(`#idstudy`).val(SolicitudId);
            if ($(`#estadostudy`).length) $(`#estadostudy`).val(Estado);

            //----------------------------------------------------------------//
            if ($(`#valor_vehiculo`).length) $(`#valor_vehiculo`).val(VehiculoId);
            if ($(`#valor_conductor`).length) $(`#valor_conductor`).val(VehiculoId);
            if ($(`#conductor_id`).length) $(`#conductor_id`).val(VehiculoId);
            lista_hojas_de_vida(SolicitudId, VehiculoId, ConductorId, SolicitudId)

            //----------------------------------------------------------------//

            if (Estado === 'Aprobado') {
              document.getElementById(`estado_estu`).disabled = true;
              document.getElementById(`obse_estu`).disabled = true;
              document.getElementById('btn-acciones-estudio').style.display = 'none';
              document.getElementById('select-hojas-vida').style.display = 'none';
            } else if (Estado === 'Pendiente') {
              document.getElementById(`estado_estu`).disabled = false;
              document.getElementById(`obse_estu`).disabled = false;
              document.getElementById('btn-acciones-estudio').style.display = 'none';
              cargarselect(SolicitudId);
            } else if (Estado === 'vencida') {
              document.getElementById('select_estados').style.display = 'none';
              document.getElementById('input_proceso').style.display = 'none';
              document.getElementById('textarea_observacion').style.display = 'none';
              document.getElementById('aprobar_estudio_total').style.display = 'none';
              document.getElementById(`estado_estu`).disabled = true;
              document.getElementById(`obse_estu`).disabled = true;
              document.getElementById('btn-acciones-estudio').style.display = 'none';
            } else if (Estado === 'pendiente_iniciar') {
              document.getElementById(`estado_estu`).disabled = true;
              document.getElementById(`obse_estu`).disabled = true;
              document.getElementById('btn-acciones').style.display = '';
              document.getElementById('select-hojas-vida').style.display = 'none';
              document.getElementById('btn-acciones-estudio').style.display = 'none';
            } else if (Estado === 'iniciado') {
              document.getElementById(`estado_estu`).disabled = false;
              document.getElementById(`obse_estu`).disabled = false;
              document.getElementById('btn-acciones-estudio').style.display = '';
              cargarselect(SolicitudId);
            } else if (Estado === 'Rechazado') {
              document.getElementById('btn-acciones-estudio').style.display = 'none';
            } else if (Estado === 'cancelado') {
              document.getElementById(`estado_estu`).disabled = true;
              document.getElementById(`obse_estu`).disabled = true;
              document.getElementById('btn-acciones-estudio').style.display = 'none';
            } else if (Estado === 'Rechazado_modificar') {
              document.getElementById(`estado_estu`).disabled = false;
              document.getElementById(`obse_estu`).disabled = false;
              document.getElementById('btn-acciones-estudio').style.display = 'none';
              cargarselect(SolicitudId);
            }

            $(`#consulta_tbservicio_estudio`).html('');
            $(`#consulta_datoupdate`).html('');
            if (data.resultado_preestudio) {
              let solicitudes = [];
              data.resultado_preestudio.forEach(element => {
                solicitudes.push(element.nundoc_solicitud);
                // document.getElementById(`aprobar_estudio_total`).setAttribute('data-SolicitudId', JSON.stringify({ solicitudes: [element.nundoc_solicitud] }));
                $(`#consulta_tbservicio_estudio`).append(`
                    <tr>
                        <td>${element.nundoc_solicitud}</td>
                        <td style="width: auto; white-space: nowrap;">${element.nombre_cliente}</td>
                        <td>${element.orige} - ${element.dest}</td>
                        <td style="width: auto; white-space: nowrap;">${element.peso_kg} / ${element.tipo_vehiculo}</td>
                        <td style="width: auto; white-space: nowrap;">${element.usuario_auditor}</td>
                        <td style="width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                    </tr>`);
                document.getElementById(`observacion_servicio_cliente_estudio`).value = element.observaciones;
              });
              const solicitudesJson = JSON.stringify({ solicitudes });

              $('#aprobar_estudio_total').attr(
                'data-solicitudid',
                solicitudesJson
              );

              const documentos = data.resultado_documento_actualizar || [];

              if (documentos.length === 0) {
                $(`#consulta_datoupdate`).html(`
                                  <tr>
                                      <td colspan="6" class="text-center text-muted">
                                          <b>No hay datos para actualizar</b>
                                      </td>
                                  </tr>
                              `);
                return; // salir si no hay nada más que mostrar
              }

              data.resultado_documento_actualizar.forEach(function (element, index) {
                index++;
                const icono = obtenerIconoArchivo(element.name_archivo); // ← AQUI USAS TU FUNCIÓN

                // $(`#consulta_datoupdate`).append(
                //   `<tr>
                //         <td style="width: auto; white-space: nowrap; "> ${index}</td>
                //         <td style="width: auto; white-space: nowrap; ">${element.tipo_hv}</td>
                //         <td style="width: auto; white-space: nowrap; ">${element.tipo_campo}</td>
                //         <td style="width: auto; white-space: nowrap; ">
                //             ${element.name_archivo === "" ? 'Sin Documento' : `<a href="#" onclick="abrir_fotos('${element.ruta_archivo}' , '${element.name_archivo}')" class="cell-detail hint--top-left" data-hint=""> ${icono} </a>`}
                //         </td>
                //         <td style="width: auto; white-space: nowrap; ">${element.usuario}</td>
                //         <td style="width: auto; white-space: nowrap; ">${element.fecha} - ${element.hora}</td>
                //     </tr>`
                // );

                // $(`#consulta_datoupdate`).append(
                //   `<tr>
                //       <td style="width: auto; white-space: nowrap;">${index}</td>
                //       <td style="width: auto; white-space: nowrap;">${element.tipo_hv}</td>
                //       <td style="width: auto; white-space: nowrap;">${element.tipo_campo}</td>
                //       <td style="width: auto; white-space: nowrap;">
                //             ${ 
                //               (element.name_archivo === "" && element.info_campo === "")
                //                 ? "Sin Documento"
                //                 : (element.info_campo === ""
                //                       ? `<a href="#" onclick="abrir_fotos('${element.ruta_archivo}', '${element.name_archivo}')" class="cell-detail hint--top-left" data-hint="">${icono}</a>`
                //                       : element.info_campo
                //                   )
                //             }
                //       </td>
                //       <td style="width: auto; white-space: nowrap;">${element.usuario}</td>
                //       <td style="width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                //   </tr>`
                // );

                // $(`#consulta_datoupdate`).append(
                //   `<tr>
                //                         <td style="width: auto; white-space: nowrap;">${index}</td>
                //                         <td style="width: auto; white-space: nowrap;">${element.tipo_hv}</td>
                //                         <td style="width: auto; white-space: nowrap;">${element.tipo_campo}</td>
                //                         <td style="width: auto; white-space: nowrap;">
                //                         ${element.name_archivo === "" && element.info_campo === ""
                //     ? 'Sin Documento'
                //     : (element.info_campo === ""
                //       ? `<a href="#" onclick="abrir_fotos('${element.ruta_archivo}' , '${element.name_archivo}')" class="cell-detail hint--top-left" data-hint="">${icono}</a>`
                //       : element.info_campo)
                //   }
                //                         </td>
                //                         <td style="width: auto; white-space: nowrap;">${element.usuario}</td>
                //                         <td style="width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                //                     </tr>`
                // );

                $(`#consulta_datoupdate`).append(
                  `<tr>
                      <td>${index}</td>
                      <td>${element.tipo_hv}</td>
                      <td>${element.tipo_campo}</td>
                      <td>
                        ${element.name_archivo !== ""
                    ? `<a href="#" onclick="abrir_fotos('${element.ruta_archivo}', '${element.name_archivo}')" class="cell-detail hint--top-left">${icono}</a>`
                    : ""
                  }
                        ${element.info_campo !== "" ? element.info_campo : (element.name_archivo === "" ? "Sin Documento" : "")}
                      </td>
                      <td>${element.usuario}</td>
                      <td>${element.fecha} - ${element.hora}</td>
                  </tr>`);
              });

              $(`#datos_contenedor_estudio`).html('');
              if (data.nombre_contenedor) {
                data.resultado_preestudio.forEach(function (contenedor) {
                  $(`#datos_contenedor_estudio`).append(
                    `<tr>
                        <td style="width: auto; white-space: nowrap;">${contenedor.devol_numcont}</td>
                        <td style="width: auto; white-space: nowrap;">${data.nombre_contenedor}</td>
                        <td style="width: auto; white-space: nowrap;">${contenedor.devol_dias}</td>
                        <td style="width: auto; white-space: nowrap;">${contenedor.devolucion_contenedor}</td>
                        <td style="width: auto; white-space: nowrap;">${contenedor.devol_direccion}</td>
                    </tr>`,
                  );
                });
              } else {
                $(`#datos_contenedor_estudio`).append(
                  `<tr>
                      <td style="width: auto; white-space: nowrap;" colspan='5'>No tiene contendor</td>
                  </tr>`,
                );
              }
            }
          }, 500);
        })
        .catch(error => {
          alert(error);
        });

      cargarRespuestasOperaciones(SolicitudId);
      if (Operacion === 'Actualizar' && ['Pendiente', 'Iniciado', 'Rechazado', 'Aprobado'].includes(EstadoPrefiltro)) {
        document.getElementById('accordionExample').style.display = '';
        Listar_datos_prefiltro_nuevo_recurso(SolicitudId, Placa);
      }
      resolve(true);

      // Agregarlo al contenedor de contenido
      // tabContent.appendChild(detalleDiv);
    });

  } catch (error) {
    console.error('Error cargando vista:', error);
    document.querySelector(contenedor).innerHTML = `
      <div class="alert alert-danger p-3">Error cargando la vista del estudio.</div>`;
  }
}

// Escuchar el "atrás/adelante" del navegador para recargar el estudio
window.addEventListener('popstate', function (event) {
  if (event.state && event.state.SolicitudId) {
    cargarDatosEstudioPromesa(event.state.SolicitudId);
  }

  if (event.state && event.state.PreestudioId) {
    CargarDatosPrefiltros(event.state.PreestudioId);
  }
});

function cargarselect(solicitudId) {
  $(`#select_option`).html('');
  var dato1s = {
    action: 'cargue_select',
  };

  $(`#select_option`).html('<option value="0">Seleccione una opcion</option>');

  $.ajax({
    url: $('#base_url').val() + 'libs/seguridad_estudio2_ajax.php',
    type: 'POST',
    data: dato1s,
    dataType: 'json',
    success: function (data) {
      if (data.result) {
        data.result.forEach(function (element, index) {
          $(`#select_option`).append('<option value="' + element.id + '">' + element.nombre + '</option>');
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('no cargo el select');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

//CONSULTAR EL VEHÍCULO
function verVehiculo() {
  const placa_vehiculo = '';
  const placa_trailer = '';
  const documentos = {
    documento: [],
    actividad: [],
    tipo_documento: [],
  };

  const idVehiculo = $(`#valor_vehiculo`).val();

  const $fotosVehiculo = $(`#fotos_vehiculo`);
  const $fotosDocumentos = $(`#fotos_vehiculo_documentos`);

  /* Boton para tomar el id del vehiculo */
  var btn = document.getElementById(`btn_editar_vehiculo`);
  btn.setAttribute('data-idvehiculo', idVehiculo);

  $.ajax({
    url: $('#base_url').val() + 'validacionparametros/ver_vehiculo',
    type: 'POST',
    data: { id_vehiculo: idVehiculo },
    dataType: 'json',
    success: function (data) {
      const vehiculo = data.vehiculo;
      const trailer = data.trailer;

      if (vehiculo) {
        // Combustible
        const combustibles = {
          1: 'Gasolina',
          2: 'GNV',
          3: 'Diesel',
          4: 'Gas/Gasol',
          5: 'Electrico',
          12: 'ACPM',
          13: 'Gas'
        };

        const combustible = combustibles[vehiculo.cod_tipo_combustible] || 'No definido';

        // Llenar campos básicos del vehículo
        const campos = {
          placa: vehiculo.placa,
          confi: vehiculo.configure,
          color: vehiculo.color,
          marca: vehiculo.marca,
          tip_combustible: combustible,
          linea: vehiculo.linea,
          anio: vehiculo.anio_fabricacion,
          tipo_caro: vehiculo.tipo_carroceria,
          carroceria: vehiculo.cod_rndc_carroceria,
          peso: vehiculo.peso,
          capacidad: vehiculo.capacidad_tn,
          peso_bruto: vehiculo.pesobruto_kg,
          nsoat: vehiculo.num_soat,
          vsoat: vehiculo.vence_soat,
          ase: vehiculo.aseguradora,
          tecno: vehiculo.tecnomecanica,
          vtecno: vehiculo.tecno_fecha_vigencia,
          webs: vehiculo.web_satelital,
          usuarios: vehiculo.usuario_satelital,
          claves: vehiculo.clave_satelital,
          clase_vehi: vehiculo.clase,
          licen_vehi: vehiculo.licencia_transito,
          nom_propi: `${vehiculo.nom_pro} ${vehiculo.proape1} ${vehiculo.proape2}`,
          docu_propi: vehiculo.docu_pro,
          celular_propietario: vehiculo.celular_propietario,
          nom_pose: `${vehiculo.nom_te} ${vehiculo.teape1} ${vehiculo.teape2}`,
          docu_pose: vehiculo.docu_te,
          celular_tenedor: vehiculo.celular_tenedor,
          fecha_matriculall: vehiculo.f_matricula,
          fetecnoll: vehiculo.tecno_fecha_expedida,
          motorll: vehiculo.num_motor,
          chasisll: vehiculo.num_chasis,
          repotenciadoll: vehiculo.repotenciado,
          vinculacionll: vehiculo.tipo_vinculacion,
          cantidadviajell: vehiculo.cant_viajes,
          polresponll: vehiculo.poliza_responsabilidad,
          empresagpsll: vehiculo.operador_gps,
          mantenimientogpsll: vehiculo.fecha_mant_gps
        };

        for (let key in campos) {
          $(`#${key}`).val(campos[key]);
        }

        // Registrar documentos
        documentos.documento.push(vehiculo.docu_pro, vehiculo.docu_te, vehiculo.docu_cond);
        documentos.tipo_documento.push(
          vehiculo.Tipo_documento_propietario,
          vehiculo.Tipo_documento_tenedor,
          vehiculo.Tipo_documento_conductor
        );
        documentos.actividad.push('Propietario', 'Poseedor', 'Conductor');


        $fotosVehiculo.html('');
        $fotosDocumentos.html('');

        // Función auxiliar para mostrar fotos
        function renderFoto(nombre, url, tipo, index, destino) {
          const nombreSeguro = nombre ? nombre : `No aplica ${tipo}`;
          const isImagen = nombre && nombre.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i);
          const icono = obtenerIconoArchivoHojaVida(nombre);

          const contenido = nombre
            ? `
            <div class="card shadow-sm border rounded h-100">
              <div class="card-body text-center p-2 d-flex flex-column align-items-center justify-content-between">
                <a href="#" onclick="abrir_fotos('${url}', '${nombre}')" class="text-decoration-none" style="font-size: 3rem;">
                  ${isImagen ? `<img src="${$('#base_url').val()}${url}${nombre}" class="img-fluid rounded mb-2" style="max-height:100px;">` : icono}
                </a>
                <div class="small text-muted text-truncate w-100" title="${nombre}">${nombre}</div>
                <div class="badge bg-secondary text-wrap">${tipo}</div>
              </div>
            </div>`
            : `
            <div class="card shadow-sm border rounded h-100">
              <div class="card-body d-flex align-items-center justify-content-center text-center p-3">
                <div class="text-muted small">No aplica ${tipo}</div>
              </div>
            </div>`;

          $(destino).append(`<div class="col">${contenido}</div>`);
        }

        // Fotos vehículo
        renderFoto(vehiculo.name_frontal, vehiculo.foto_vehiculo, 'Frontal', 1, $fotosVehiculo);
        renderFoto(vehiculo.name_derecha, vehiculo.foto_derecha, 'Derecha', 2, $fotosVehiculo);
        renderFoto(vehiculo.name_izquierda, vehiculo.foto_izquierda, 'Izquierda', 3, $fotosVehiculo);
        renderFoto(vehiculo.name_atras, vehiculo.foto_atras, 'Trasera', 4, $fotosVehiculo);

        // Documentos
        renderFoto(vehiculo.name_soat, vehiculo.foto_soat, 'Soat', 1, $fotosDocumentos);
        renderFoto(vehiculo.name_tecno, vehiculo.foto_tecno, 'Tecnomecánica', 2, $fotosDocumentos);
        renderFoto(vehiculo.name_transito, vehiculo.foto_transito, 'Licencia de tránsito', 3, $fotosDocumentos);
        renderFoto(vehiculo.nombre_kit, vehiculo.documento_kit, 'Kit de mercancías peligrosas', 4, $fotosDocumentos);
        renderFoto(vehiculo.nombre_preopeacional, vehiculo.documento_preopeacional, 'Preoperacional', 5, $fotosDocumentos);
      }

      // TRAILER
      if (trailer) {
        $(`#recoger_trailer, #recoger_trailer2`).show();

        const camposTrailer = {
          ptrailer: trailer.placa,
          tra_placa: trailer.placa,
          tra_anio: trailer.modelo,
          tra_marca: trailer.mark,
          tra_peso: trailer.peso_vacio,
          tra_alto: trailer.alto,
          tra_volu: trailer.volumen,
          tra_tramite: trailer.tramitee,
          tra_confi: trailer.confi,
          tra_chasis: trailer.serie_chasis,
          tra_ancho: trailer.ancho,
          tra_largo: trailer.largo,
          tra_capacidad: trailer.capacidad,
          tra_carroceria: trailer.ceria,
          tra_caracteris: trailer.caracteristica,
          tra_aseguradora: trailer.aseguradora,
          tra_civil: trailer.numero_civil,
          tra_vence: trailer.fecha_vence
        };

        for (let key in camposTrailer) {
          $(`#${key}`).val(camposTrailer[key]);
        }

        documentos.documento.push(trailer.docu_prot);
        documentos.tipo_documento.push(trailer.Tipo_documento_propietario_trailer);
        documentos.actividad.push('Propietario Trailer');

        const trailerFoto = trailer.n_docu_trailer;
        const licFoto = trailer.name_licencia;

        $(`#tra_foto`).html(
          trailerFoto ? `
            <a href="#" onclick="abrir_fotos('${vehiculo.foto_trailer}' , '${trailer.n_docu_trailer}')" class="cell-detail hint--top-left">
              <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
            </a>` : '<p class="text-danger">No existe archivo</p>'
        );

        $(`#tra_licen_foto`).html(
          licFoto ? `
            <a href="#" onclick="abrir_fotos('${trailer.foto_licencia}' , '${trailer.name_licencia}')" class="cell-detail hint--top-left">
              <span class="icon mdi mdi-file-text text-center" data-toggle="modal" title="Documento"></span>
            </a>` : '<p class="text-danger">No existe archivo</p>'
        );
      } else {
        $(`#ptrailer`).val('No posee trailer asociado');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error en AJAX', textStatus, errorThrown, jqXHR);
    },
    complete: function () {
      // Aquí puedes ejecutar algo al final
      // crear_Proveedores_Ministerio(documentos, placa_vehiculo, placa_trailer);
    }
  });
}

//Datos del conductor
function verConductor(ConductorId) {
  var btn = document.getElementById(`btn_editar_conductor`);
  btn.setAttribute('data-idconductor', ConductorId);

  const $fotosConductor = $(`#fotos_conductor`);
  $fotosConductor.html('');

  const $fotosCedula = $(`#fotos_cedulas`);
  $fotosCedula.html('');

  // Limpiar secciones visibles
  $(`#fotos_conductor`).empty();
  $(`#fotos_cedulas`).empty();

  // Limpiar contenedores individuales
  $(`#foto_indumentaria`).empty();
  $(`#documentos_licencia`).empty();
  $(`#documentos_rut`).empty();
  $(`#documentos_eps`).empty();
  $(`#documentos_peligro`).empty();
  $(`#documentos_acuerdo`).empty();

  // Limpiar tablas y documentos
  $(`#documentos_laborales`).empty();
  $(`#documentos_personal`).empty();

  var params2 = {
    id_conductor: ConductorId,
    // num_documento: num_doc,
  };

  // $(`#fotos_conductor`).html('');
  $(`#foto_indumentaria`).html('');
  $(`#documentos_licencia`).html('');
  $(`#documentos_rut`).html('');
  $(`#documentos_eps`).html('');
  $(`#documentos_peligro`).html('');
  $(`#documentos_acuerdo`).html('');
  $(`#fotos_cedulas`).html('');

  $.ajax({
    url: $(`#base_url`).val() + 'validacionparametros/ver_conductor',
    type: 'POST',
    data: params2,
    dataType: 'json',
    success: function (data) {
      if (data.proveedores) {
        const set = (id, val) => $(`#${id}`).val(val ?? '');

        set('name', `${data.proveedores.nombre} ${data.proveedores.apellido1} ${data.proveedores.apellido2}`);
        set('tdocumento', data.proveedores.tipo_documento);
        set('documento', data.proveedores.numero_documento);
        set('numero', data.proveedores.celular);
        set('numero2', data.proveedores.celular2);
        set('contacto', data.proveedores.contacto);
        set('dire', data.proveedores.direccion);
        set('muni', data.proveedores.cipio);
        set('num_li', data.proveedores.rndc_numero_licencia);
        set('cate_li', data.proveedores.rndc_categoria_licencia);
        set('fecha_vencimiento_licencia', data.proveedores.rndc_vencimiento_licencia);
        set('veps', data.proveedores.fecha_vence_eps);
        set('ultimoeps', data.proveedores.ultimo_eps);
        set('arl', data.proveedores.nombre_arl);
        set('varl', data.proveedores.fecha_vence_arl);
        set('ultimoarl', data.proveedores.ultimo_arl);
        set('fijocll', data.proveedores.contacto);
        set('emailcll', data.proveedores.email);
        set('plantillacll', data.proveedores.nombre_eps);
        set('fecha_vencimiento_plantilla', data.proveedores.fecha_vence_eps);
        set('curso_peligrosocll', data.proveedores.nombre_entidad);
        set('fecha_vencimiento_curso', data.proveedores.vence_curso);
        set('sexo', data.proveedores.sexo);
        set('fecha_nacimiento', data.proveedores.fecha_nacimiento);
        set('grupo_sanguineo', data.proveedores.grupo_sanguineo);
        set('estado_civil', data.proveedores.estado_civil);
        set('fecha_ingreso', data.proveedores.fecha_ingreso);

        function renderFoto(nombre, url, tipo, index, destino) {
          const nombreSeguro = nombre ? nombre : `No aplica ${tipo}`;
          const isImagen = nombre && nombre.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i);
          const icono = obtenerIconoArchivoHojaVida(nombre);

          const contenido = nombre
            ? `
            <div class="card shadow-sm border rounded h-100">
              <div class="card-body text-center p-2 d-flex flex-column align-items-center justify-content-between">
                <a href="#" onclick="abrir_fotos('${url}', '${nombre}')" class="text-decoration-none" style="font-size: 3rem;">
                  ${isImagen ? `<img src="${$('#base_url').val()}${url}${nombre}" class="img-fluid rounded mb-2" style="max-height:100px;">` : icono}
                </a>
                <div class="small text-muted text-truncate w-100" title="${nombre}">${nombre}</div>
                <div class="badge bg-secondary text-wrap">${tipo}</div>
              </div>
            </div>`
            : `
            <div class="card shadow-sm border rounded h-100">
              <div class="card-body d-flex align-items-center justify-content-center text-center p-3">
                <div class="text-muted small">No aplica ${tipo}</div>
              </div>
            </div>`;

          $(destino).append(`<div class="col">${contenido}</div>`);
        }


        // Fotos vehículo
        renderFoto(data.proveedores.name_cfrontal, data.proveedores.foto_conductor, 'Frontal', 1, $fotosConductor);
        renderFoto(data.proveedores.name_cderecha, data.proveedores.foto_derecha, 'Derecha', 2, $fotosConductor);
        renderFoto(data.proveedores.name_cizquierda, data.proveedores.foto_izquierda, 'Derecha', 3, $fotosConductor);
        renderFoto(data.proveedores.name_cindu, data.proveedores.foto_indumentaria, 'Indumentaria', 4, $fotosConductor);

        //CDocumentos
        // 1) Extraer la parte antes del último "/"
        const rutaBase = data.proveedores.documentos_soporte.substring(0, data.proveedores.documentos_soporte.lastIndexOf('/') + 1);

        // 2) Extraer el archivo (después del último "/")
        const archivo = data.proveedores.documentos_soporte.substring(data.proveedores.documentos_soporte.lastIndexOf('/') + 1);
        renderFoto(archivo, rutaBase, 'Cedula Ciudadania', 1, $fotosCedula);
        renderFoto(data.proveedores.n_docu_licencia, data.proveedores.subir_licencia, 'Licencia de Conduccíon', 2, $fotosCedula);
        renderFoto(data.proveedores.n_docu_eps, data.proveedores.documento_eps, 'EPS', 2, $fotosCedula);

        //Referencias laborales
        renderFoto(data.proveedores.name_documento, data.proveedores.documento_empresarial, 'Referencia Laboral 1', 3, $fotosCedula);
        renderFoto(data.proveedores.name_documento, data.proveedores.documento_empresarial, 'Referencia Laboral 2', 4, $fotosCedula);
        renderFoto(data.proveedores.name_documento, data.proveedores.documento_empresarial, 'Referencia Laboral 3', 5, $fotosCedula);

        // Referencias personales
        renderFoto(data.proveedores.name_documento, data.proveedores.documento_personal, 'Referencia  Personal 1', 6, $fotosCedula);
        renderFoto(data.proveedores.name_documento, data.proveedores.documento_personal, 'Referencia Personal 2', 7, $fotosCedula);
        renderFoto(data.proveedores.n_docu_rut, data.proveedores.documento_rut, 'Rut', 8, $fotosCedula);
        renderFoto(data.proveedores.n_docu_curso, data.proveedores.carnet_curso, 'Curso Mercancias Peligrosas', 9, $fotosCedula);
        renderFoto(data.proveedores.name_acuerdo1, data.proveedores.foto_acuerdo1, 'Acuerdo', 10, $fotosCedula);

        // Referencias laborales y personales también deben usar IDs con sufijo ``:
        if (data.referencia_laboral) {
          $(`#documentos_laborales`).html('');
          data.referencia_laboral.forEach((e, i) => {
            $(`#refl${i + 1}`).val(e.nombre_empresa);
            $(`#fechal${i + 1}`).val(e.fecha_ingreso);
            $(`#fechafinall${i + 1}`).val(e.fecha_retiro);
            $(`#contactol${i + 1}`).val(e.persona_contacto);
            $(`#cel${i + 1}`).val(e.celular);
            $(`#cargo${i + 1}`).val(e.cargo);
            $(`#antig${i + 1}`).val(e.antiguedad);
            if (e.name_documento) {
              $(`#documentos_laborales`).append(`<tr><td>${i + 1}</td><td><a href="javascript:void(0);" onclick="abrir_fotos('${e.documento_empresarial}','${e.name_documento}')"><span class="icon mdi mdi-file-text"></span></a></td><td>${e.name_documento}</td></tr>`);
            }
          });
        }

        if (data.referencia_personales) {
          $(`#documentos_personal`).html('');
          data.referencia_personales.forEach((e, i) => {
            const parentesco = {
              '1': 'Amigo/a',
              '2': 'Hermano/a',
              '3': 'Padre',
              '4': 'Madre',
              '5': 'Tío/a',
              '6': 'Sobrino/a',
              '7': 'Hijo/a',
              '8': 'Esposo/a',
            }[e.parentezco] || 'N/A';

            $(`#parenp${i + 1}`).val(parentesco);
            $(`#refp${i + 1}`).val(e.nombre_personal);
            $(`#fechap${i + 1}`).val(e.fecha_personal);
            $(`#telp${i + 1}`).val(e.tel_personal);

            if (e.name_documento) {
              $(`#documentos_personal${EstudioNucdoc}`).append(`<tr><td>${i + 1}</td><td><a onclick="abrir_fotos('${e.documento_personal}','${e.name_documento}')"><span class="icon mdi mdi-file-text"></span></a></td><td>${e.name_documento}</td></tr>`);
            }
          });
        }
      } else {
        console.log('No hay datos conductor');
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log('Error al consultar conductor');
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  });
}

//aprobar la hoja de vida del vehiculo
async function aprobar_vehiculo(EstudioId, Placa, VehiculoId, ConductorId, EstudioIdC, Operacion, Nombre, EstadoPrefiltro, EstadoCreacion, ObservacionGeneral, EscenarioId) {
  const result = await Swal.fire({
    title: '¿Seguro?',
    text: '¿Estás seguro de que desea aprobar el vehículo?',
    icon: 'question',
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
    let data = new FormData();
    data.append('observeheciulo', $(`#observeheciulo`).val());
    data.append('id_vehiculo', VehiculoId);
    data.append('id_conductor', ConductorId);
    data.append('idsoli', EstudioId);
    data.append('idtipo', $(`#id_tvehiculo`).val());

    $.ajax({
      url: $('#base_url').val() + 'validacionparametros/Aprobar_vehiculo_estudio',
      type: 'POST',
      data: data,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      dataType: 'json',

      success: function (data, textStatus, jqXHR) {
        if (data.numero === 200) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            html: data.mensaje,
            confirmButtonColor: '#3B71CA',
          });
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
        } else {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            html: data.mensaje,
            confirmButtonColor: '#DC3545',
          });
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
        }
        $(`#content_risk`).hide();
        $(`#content_conductor`).hide();
        $(`#content_vehiculo`).hide();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no inserto hv vehiculo');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    console.log('Acción confirmada.');
  }
}

async function desaprobar_vehiculo(EstudioId, Placa, VehiculoId, ConductorId) {

  const result = await Swal.fire({
    title: '¿Seguro?',
    text: '¿Estás seguro de que desea rechazar el vehículo?',
    icon: 'question',
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

    let data = new FormData();
    data.append('observeheciulo', $(`#observeheciulo`).val());
    data.append('id_vehiculo', VehiculoId);
    data.append('id_conductor', ConductorId);
    data.append('idsoli', EstudioId);
    data.append('idtipo', $(`#id_tvehiculo`).val());

    $.ajax({
      url: $('#base_url').val() + 'validacionparametros/Desaprobar_vehiculo_estudio',
      type: 'POST',
      data: data,
      cache: false,
      processData: false, // Don't process the files
      contentType: false, // Set content type to false as jQuery will tell the server its a query string request
      dataType: 'json',

      success: function (data, textStatus, jqXHR) {
        if (data.numero === 200) {
          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            html: data.mensaje,
            confirmButtonColor: '#3B71CA',
          });
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
        } else {
          Swal.fire({
            icon: 'error',
            title: '¡Error!',
            html: data.mensaje,
            confirmButtonColor: '#DC3545',
          });
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
        }
        $(`#content_risk`).hide();
        $(`#content_conductor`).hide();
        $(`#content_vehiculo`).hide();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no inserto hv vehiculo no aprobada');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);
      },
    });
  } else {
    // Código a ejecutar si el usuario hace clic en "Cancelar"
    console.log('Acción confirmada.');
  }
}

//aprobar la hoja de vida del coductor
async function aprobar_conductor(EstudioId, Placa, VehiculoId, ConductorId) {
  const result = await Swal.fire({
    title: '¿Seguro?',
    text: '¿Estás seguro de que deseas aprobar al conductor?',
    icon: 'question',
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
    let data = new FormData();
    data.append('id_vehiculo', VehiculoId);
    data.append('id_conductor', ConductorId);
    data.append('obse_condu', $(`#obse_condu`).val());
    data.append('idsoli', EstudioId);
    data.append('idtipo', $(`#id_tconductor`).val());

    $.ajax({
      url: $('#base_url').val() + 'validacionparametros/Aprobar_conductor_estudio',
      type: 'POST',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        if (data.numero === 200) {
          Swal.fire({
            icon: 'success',
            title: '¡Aprobado!',
            html: data.mensaje,
            confirmButtonColor: '#3B71CA'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            html: data.mensaje,
            confirmButtonColor: '#d33'
          });
        }

        lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
        $(`#content_risk`).hide();
        $(`#content_conductor`).hide();
        $(`#content_vehiculo`).hide();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log('no inserto hv conductor');
        console.log(jqXHR);
        console.log(textStatus);
        console.log(errorThrown);

        Swal.fire({
          icon: 'error',
          title: 'Error inesperado',
          text: 'No se pudo aprobar al conductor. Intenta nuevamente.',
          confirmButtonColor: '#d33'
        });
      },
    });
  } else {
    console.log('Acción cancelada por el usuario.');
  }
}

async function desaprobar_conductor(EstudioId, Placa, VehiculoId, ConductorId) {
  const result = await Swal.fire({
    title: '¿Seguro?',
    text: '¿Estás seguro de que deseas rechazar al conductor?',
    icon: 'question',
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
    const data = new FormData();
    data.append('id_vehiculo', VehiculoId);
    data.append('id_conductor', ConductorId);
    data.append('obse_condu', $(`#obse_condu`).val());
    data.append('idsoli', EstudioId);
    data.append('idtipo', $(`#id_tconductor`).val());

    $.ajax({
      url: $('#base_url').val() + 'validacionparametros/Desaprobar_conductor_estudio',
      type: 'POST',
      data: data,
      cache: false,
      processData: false,
      contentType: false,
      dataType: 'json',
      success: function (data) {
        if (data.numero === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Desaprobado',
            html: `<strong>${data.mensaje}</strong>`,
            confirmButtonText: 'Aceptar',
          }).then(() => {
            lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
            $(`#content_risk`).hide();
            $(`#content_conductor`).hide();
            $(`#content_vehiculo`).hide();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al desaprobar',
            html: `<strong>${data.mensaje}</strong>`,
            confirmButtonText: 'Aceptar',
          }).then(() => {
            lista_hojas_de_vida(VehiculoId, ConductorId, EstudioId);
          });
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        Swal.fire({
          icon: 'error',
          title: 'Error en la solicitud',
          html: `
            <p>Ocurrió un error al enviar los datos.</p>
            <small><strong>${textStatus}</strong>: ${errorThrown}</small>
          `,
          confirmButtonText: 'Aceptar',
        });
      },
    });
  } else {
    console.log('Acción cancelada por el usuario.');
  }
}

function aprobar_risk(EstudioId, Placa, VehiculoId, ConductorId) {
  const data = new FormData();
  const evidencia = document.getElementById(`evi_plataforma`).files;

  if (evidencia.length === 0) {
    data.append(`evi_plataforma`, 'Sin_datos');
  } else {
    for (let i = 0; i < evidencia.length; i++) {
      data.append(`evi_plataforma${i}`, evidencia[i]);
    }
  }

  data.append('id_vehiculo', VehiculoId);
  data.append('id_conductor', ConductorId);
  data.append('tipo_estudio', $(`#tipo_plataforma`).val());
  data.append('obse_todo', $(`#obse_todo`).val());
  data.append('name_eviden', $(`#name_eviden`).val());
  data.append('ruta_eviden', $(`#ruta_eviden`).val());
  data.append('idsoli', EstudioId);
  data.append('idtipo', $(`#id_totros`).val());

  $.ajax({
    url: $('#base_url').val() + 'validacionparametros/Aprobar_risk',
    type: 'POST',
    data: data,
    cache: false,
    processData: false,
    contentType: false,
    dataType: 'json',
    success: function (data) {
      if (data.numero === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Aprobado',
          html: `<strong>${data.mensaje}</strong>`,
          confirmButtonText: 'Aceptar',
        }).then(() => {
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
          $(`#content_risk`).hide();
          $(`#content_conductor`).hide();
          $(`#content_vehiculo`).hide();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al aprobar',
          html: `<strong>${data.mensaje}</strong>`,
          confirmButtonText: 'Aceptar',
        }).then(() => {
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        html: `
          <p>Ocurrió un problema al procesar la aprobación del estudio.</p>
          <small><strong>${textStatus}</strong>: ${errorThrown}</small>
        `,
        confirmButtonText: 'Aceptar',
      });
    },
  });
}

//desaprobar risck
function desaprobar_risk(EstudioId, Placa, VehiculoId, ConductorId) {
  let data = new FormData();
  const evidencia = document.getElementById(`evi_plataforma`).files;

  if (evidencia.length === 0) {
    data.append(`evi_plataforma`, 'Sin_datos');
  } else {
    for (let i = 0; i < evidencia.length; i++) {
      data.append(`evi_plataforma${i}`, evidencia[i]);
    }
  }

  data.append('id_vehiculo', VehiculoId);
  data.append('id_conductor', ConductorId);
  data.append('tipo_estudio', $(`#tipo_plataforma`).val());
  data.append('obse_todo', $(`#obse_todo`).val());
  data.append('name_eviden', $(`#name_eviden`).val());
  data.append('ruta_eviden', $(`#ruta_eviden`).val());
  data.append('idsoli', EstudioId);
  data.append('idtipo', $(`#id_totros`).val());

  $.ajax({
    url: $('#base_url').val() + 'validacionparametros/Desaprobar_risk',
    type: 'POST',
    data: data,
    cache: false,
    processData: false,
    contentType: false,
    dataType: 'json',
    success: function (data) {
      if (data.numero === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Desaprobado',
          html: `<strong>${data.mensaje}</strong>`,
          confirmButtonText: 'Aceptar',
        }).then(() => {
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
          $(`#content_risk`).hide();
          $(`#content_conductor`).hide();
          $(`#content_vehiculo`).hide();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo desaprobar',
          html: `<strong>${data.mensaje}</strong>`,
          confirmButtonText: 'Aceptar',
        }).then(() => {
          lista_hojas_de_vida(EstudioId, VehiculoId, ConductorId, EstudioId);
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      Swal.fire({
        icon: 'error',
        title: 'Error del servidor',
        html: `
          <p>Ocurrió un problema al procesar la desaprobación del estudio.</p>
          <small><strong>${textStatus}</strong>: ${errorThrown}</small>
        `,
        confirmButtonText: 'Aceptar',
      });
    },
  });
}

function obtenerIconoArchivo(nombreArchivo) {
  if (!nombreArchivo) return '<span class="fas fa-file text-secondary" title="Archivo"></span>';

  const ext = nombreArchivo.split('.').pop().toLowerCase();

  switch (ext) {
    case 'pdf':
      return '<span class="fas fa-file-pdf text-danger" title="PDF"></span>';
    case 'doc':
    case 'docx':
      return '<span class="fas fa-file-word text-primary" title="Word"></span>';
    case 'xls':
    case 'xlsx':
      return '<span class="fas fa-file-excel text-success" title="Excel"></span>';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return '<span class="fas fa-file-image text-info" title="Imagen"></span>';
    case 'zip':
    case 'rar':
      return '<span class="fas fa-file-archive text-warning" title="Archivo comprimido"></span>';
    case 'txt':
      return '<span class="fas fa-file-alt text-muted" title="Texto"></span>';
    default:
      return '<span class="fas fa-file text-secondary" title="Archivo"></span>';
  }
}

function obtenerIconoArchivoHojaVida(nombre) {
  if (!nombre) return '<i class="fa-regular fa-file text-secondary"></i>';
  const ext = nombre.split('.').pop().toLowerCase();
  const iconos = {
    pdf: '<i class="fa-solid fa-file-pdf text-danger"></i>',
    doc: '<i class="fa-solid fa-file-word text-primary"></i>',
    docx: '<i class="fa-solid fa-file-word text-primary"></i>',
    xls: '<i class="fa-solid fa-file-excel text-success"></i>',
    xlsx: '<i class="fa-solid fa-file-excel text-success"></i>',
    jpg: '<i class="fa-solid fa-file-image text-info"></i>',
    jpeg: '<i class="fa-solid fa-file-image text-info"></i>',
    png: '<i class="fa-solid fa-file-image text-info"></i>',
    gif: '<i class="fa-solid fa-file-image text-info"></i>',
    default: '<i class="fa-regular fa-file text-secondary"></i>'
  };
  return iconos[ext] || iconos['default'];
}

function lista_hojas_de_vida(solicitudId, vehiculo_id, conductor_id) {
  // Limpiar campos antes de cargar
  const campos = [
    "ini", "apro", "aevi", "cini", "capro", "cevi", "rini", "rapro", "revi",
    "ruini", "ruapro", "ruevi", "pini", "poapro", "poevi", "proini", "proapro", "proevi",
    "smini", "sipro", "smevi", "siscini", "siscompro", "sievi", "aini", "adrpro", "adevi",
    "gini", "gpro", "gevi", "preini", "prepro", "previ", `cuerpo_estudio`
  ];
  campos.forEach(id => $(`#${id}`).html(''));

  const datos = {
    idv: vehiculo_id,
    idc: conductor_id,
    idsoli: solicitudId
  };

  $.ajax({
    url: $('#base_url').val() + 'validacionparametros/Ver_Estudio_Seguridad',
    type: 'POST',
    data: datos,
    dataType: 'json',
    success: function (data) {
      if (data.length === 0) {
        mostrarSinDatos(solicitudId);
        // return;
      }
      if (data.length === 0) {
        // mostrarSinDatos(solicitudId);
        $(`#cuerpo_estudio`).html(`
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <b>No hay gestion para las hojas de vida del estudio.</b>
                </td>
            </tr>
        `);
        return;
      }
      $(`#cuerpo_estudio`).html(` `);
      data.forEach(element => {
        const tipo = element.estudio.toLowerCase();
        const estado = element.estado;
        const evidencia = obtenerEvidencia(element);
        const circuloVerde = '<center><span class="text-success fas fa-circle"></span></center>';
        const circuloRojo = '<center><span class="text-danger fas fa-circle"></span></center>';
        const aprobado = estado === 1 ? circuloVerde : circuloRojo;

        $(`#idstudy`).val(element.id_estudio);
        const estadoTotal = element.estadototal;
        const estadoTexto = estadoTotal === 'gray' ? 'sin respuesta' : estadoTotal;
        $(`#estadostudy`).val(estadoTexto);

        const deshabilitar = ['Aprobado', 'Rechazado_modificar', 'Rechazado'].includes(estadoTotal);
        $(`#estado_estu`).prop('disabled', deshabilitar);
        $(`#obse_estu`).prop('disabled', deshabilitar);
        $(`#aprobar_estudio_total`)[deshabilitar ? 'hide' : 'show']();

        // Mapeo de tipo a sufijos de ID
        const mapeo = {
          'hoja de vida vehiculo': ['ini', 'apro', 'aevi'],
          'hoja de vida conductor': ['cini', 'capro', 'cevi'],
          'risck': ['rini', 'rapro', 'revi'],
          'siplaft': ['sini', 'sapro', null],
          'runt': ['ruini', 'ruapro', 'ruevi'],
          'policia': ['pini', 'poapro', 'poevi'],
          'procuraduria': ['proini', 'proapro', 'proevi'],
          'simit': ['smini', 'sipro', 'smevi'],
          'siscomn': ['siscini', 'siscompro', 'sievi'],
          'adres': ['aini', 'adrpro', 'adevi'],
          'gps': ['gini', 'gpro', 'gevi'],
          'dato preestudio': ['preini', 'prepro', 'previ']
        };

        if (mapeo[tipo]) {
          const [iniId, aproId, eviId] = mapeo[tipo];
          if (iniId) $(`#${iniId}`).html(circuloVerde);
          if (aproId) $(`#${aproId}`).html(aprobado);
          if (eviId) $(`#${eviId}`).html(evidencia);
        }

        // Agregar a tabla de observaciones
        window.estadoTexto = estado === 1 ? 'Aceptado' : 'No aceptado';

        $(`#cuerpo_estudio`).append(`
          <tr>
            <td style='width:auto; white-space: nowrap;'>${element.estudio}</td>
            <td style='width:auto; white-space: nowrap;'>${CrearBadge(window.estadoTexto)}</td>
            <td>${element.observacion}</td>
            <td style='width:auto; white-space: nowrap;'>${element.usuario}</td>
            <td style='width:auto; white-space: nowrap;'>${element.fecha} - ${element.hora}</td>
          </tr>
        `);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error('Error al obtener los estudios:', textStatus, errorThrown);
    }
  });

  $('#ver_lista').show();
}

// FUNCIONES AUXILIARES
function obtenerEvidencia(element) {
  if (element.name_evidencia) {
    return `
      <a href="#" onclick="abrir_fotos('${element.ruta_evidencia}', '${element.name_evidencia}')" class="cell-detail hint--top-left">
        <span class="fas fa-file-archive text-center" data-toggle="modal" title="${element.observacion}"></span>
      </a>`;
  } else {
    return `<p class="text-primary text-center" title="${element.observacion}">Sin archivo</p>`;
  }
}

function mostrarSinDatos(solicitudId) {
  const rojo = '<center><span class="text-danger fas fa-circle"></span></center>';
  const campos = [
    "ini", "cini", "rini", "sini", "ruini", "pini",
    "proini", "smini", "siscini", "aini", "gini", "preini"
  ];
  campos.forEach(id => $(`#${id}${solicitudId}`).html(rojo));
}

async function cargarRespuestasOperaciones(solicitudId) {
  try {
    const response = await fetch(`${$('#base_url').val()}validacionparametros/consultar_respuesta_operaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ idestudio: solicitudId })
    });

    const data = await response.json();

    const tabla = document.getElementById(`tbr_opera`);
    tabla.innerHTML = '';

    if (data && data.respuesta_operaciones.length > 0) {
      data.respuesta_operaciones.forEach(element => {
        let archivoHTML;

        if (!element.nom_archivo) {
          archivoHTML = `<label>Sin archivo</label>`;
        } else {
          const icono = obtenerIconoArchivo(element.nom_archivo);
          archivoHTML = `<a href="javascript:void(0);" class="cell-deta" onclick="abrir_fotos('${element.archivo}', '${element.nom_archivo}')" data-hint=""> ${icono}</a>`;
        }

        tabla.innerHTML += `
          <tr>
              <td style="width: auto; white-space: nowrap; " class='text-center'>${element.estudio_letra}</td>
              <td style="width: auto; white-space: nowrap; " class='text-center'>${element.fecha}</td>
              <td style="width: auto; white-space: nowrap; " class='text-center'>${element.hora}</td>
              <td class='text-center'>${element.nota}</td>
              <td style="width: auto; white-space: nowrap; " class='text-center'>${archivoHTML}</td>
          </tr>`;
      });
    } else {
      tabla.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center;"><b>Sin respuesta de operaciones</b></td>
            </tr>`;
    }

    $(`#tbr_observaciones`).html('');
    if (data.resultado_observacion) {
      data.resultado_observacion.forEach(function (element, index) {
        $(`#tbr_observaciones`).append(
          `<tr>
                <td style="width: auto; white-space: nowrap;">${element.id}</td>
                <td>${element.observacion ?? 'Sin Obseravción'}</td>
                <td style="width: auto; white-space: nowrap;">${element.fecha} - ${element.hora}</td>
                <td style="width: auto; white-space: nowrap;">${element.usuario}</td>
                <td style="width: auto; white-space: nowrap;">${CrearBadge(element.estado)}</td>
            </tr>
            `,
        );
      });
    } else {
      $(`#tbr_observaciones`).append(
        `<tr>
              <td style="width: auto; white-space: nowrap;" colspan='5'>No tiene Observaciones</td>
          </tr>`,
      );
    }
  } catch (error) {
    const tabla = document.getElementById(`tbr_opera`);
    console.error('Error al consultar respuestas de operaciones:', error);
    tabla.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; color: red;"><b>Error al cargar respuestas</b></td>
        </tr>`;
    reject(error);
  }
}

function abrir_fotos(url, name) {
  // URL de la página que deseas abrir en la nueva ventana
  var url = $('#base_url').val() + url + name;
  // Opciones de la ventana emergente (ancho, alto, opciones adicionales)
  var ventanaAncho = 1000;
  var ventanaAlto = 1000;
  // Calcula las coordenadas para centrar la ventana
  var ventanaIzquierda = (window.innerWidth - ventanaAncho) / 2;
  var ventanaArriba = (window.innerHeight - ventanaAlto) / 2;
  // Opciones de la ventana emergente (ancho, alto, posición)
  var opcionesVentana = 'width=' + ventanaAncho + ',height=' + ventanaAlto + ',left=' + ventanaIzquierda + ',top=' + ventanaArriba + ',scrollbars=yes';
  // Utiliza window.open para abrir la nueva ventana
  window.open(url, name, opcionesVentana);
}

function CrearBadge(Estado) {
  // estados normales
  let status_es = '';
  switch (Estado) {
    case 'Aprobado':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-success'>Aprobado</span>";
      break;
    case 'Pendiente':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Pendiente</span>";
      break;
    case 'vencida':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Vencido</span>";
      break;
    case 'pendiente_iniciar':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Pendiente Iniciar</span>";
      break;
    case 'iniciado':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-primary'>Iniciado</span>";
      break;
    case 'Rechazado':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Rechazado</span>";
      break;
    case 'cancelado':
    case 'Cancelado':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>Cancelado</span>";
      break;
    case 'Rechazado_modificar':
      status_es = "<span class='fs-10 badge badge-phoenix badge-phoenix-warning'>Rechazado para modificar</span>";
      break;
    case 'Aceptado':
      status_es = `<span class='fs-10 badge badge-phoenix badge-phoenix-success'>${Estado}</span>`;
      break;
    case 'No aceptado':
      status_es = `<span class='fs-10 badge badge-phoenix badge-phoenix-danger'>${Estado}</span>`;
      break;
  }
  return status_es;
}

function evidencia(fic, EstudioId) {
  fic = fic.split('\\');
  if (fic == '' || fic == null) {
    $(`#name_eviden${EstudioId}`).val('');
  } else {
    $(`#name_eviden${EstudioId}`).val(fic[fic.length - 1]);
  }
}

async function Listar_datos_prefiltro_nuevo_recurso(solicitud_id, placa) {
  let formdata = new FormData();
  formdata.append('solicitud_id', solicitud_id);
  fetch($('#base_url').val() + 'validacionparametros/verificar_datos_nuevos', {
    method: 'POST',
    cache: 'no-cache',
    body: formdata,
  })
    .then(response => response.json())
    .then(function (data) {
      // d.getElementById('tbl_datos').innerHTML = '';
      if (data) {
        /* VALIDART LOS ESTADOS DEL PREFILTRO NUEVO */
        if (data.estado_prefiltro === 'Pendiente') {
          document.getElementById(`estado_prefiltro_recurso_nuevo`).innerHTML = data.estado_prefiltro;
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.backgroundColor = '#E4A11B';
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.color = '#FFFFFF';
          var select = document.getElementById(`estado_prefiltro_nuevo`);
          select.disabled = false;
          var options = select.options;
          for (var i = 0; i < options.length; i++) {
            if (options[i].value === data.estado_prefiltro) {
              options[i].disabled = true;
              break; // Terminar el bucle ya que hemos encontrado la opción correspondiente
            } else {
              options[i].disabled = false;
            }
          }
          var btn = document.getElementById(`btn_guardar_prefiltro_nuevo`);
          btn.disabled = false;
        } else if (data.estado_prefiltro === 'Iniciado') {
          document.getElementById(`estado_prefiltro_recurso_nuevo`).innerHTML = data.estado_prefiltro;
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.backgroundColor = '#54B4D3';
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.color = '#FFFFFF';
          var select = document.getElementById(`estado_prefiltro_nuevo`);
          select.disabled = false;
          var options = select.options;
          for (var i = 0; i < options.length; i++) {
            if (options[i].value === data.estado_prefiltro) {
              options[i].disabled = true;
              break; // Terminar el bucle ya que hemos encontrado la opción correspondiente
            }
          }
          let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
          let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
          // Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
          var btn = document.getElementById(`btn_guardar_prefiltro_nuevo`);
          btn.disabled = false;
        } else if (data.estado_prefiltro === 'Rechazado') {
          document.getElementById(`estado_prefiltro_recurso_nuevo`).innerHTML = data.estado_prefiltro;
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.backgroundColor = '#DC4C64';
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.color = '#FFFFFF';
          var select = document.getElementById(`estado_prefiltro_nuevo`);
          select.disabled = true;
          let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
          let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
          // Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
          var btn = document.getElementById(`btn_guardar_prefiltro_nuevo`);
          btn.disabled = true;
        } else if (data.estado_prefiltro === 'Aprobado') {
          document.getElementById(`estado_prefiltro_recurso_nuevo`).innerHTML = data.estado_prefiltro;
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.backgroundColor = '#14A44D';
          document.getElementById(`estado_prefiltro_recurso_nuevo`).style.color = '#FFFFFF';
          var select = document.getElementById(`estado_prefiltro_nuevo`);
          select.disabled = true;
          let FechaInicial = document.getElementById(`fecha_inicial_estudios`).value;
          let FechaFinal = document.getElementById(`fecha_final_estudios`).value;
          // Litar_solicitudes(FechaInicial, FechaFinal, '', 'todos');
          var btn = document.getElementById(`btn_guardar_prefiltro_nuevo`);
          btn.disabled = true;
        }

        var tabla_datos = document.getElementById(`tbl_datos`);
        tabla_datos.innerHTML = '';
        /* Propietario */
        if (data.propietario === '1') {
          const filasp = document.createElement('tr');
          const columnaTituloPropietario = document.createElement('th');
          columnaTituloPropietario.innerHTML = 'Nombre Propietario';
          // columnaTituloPropietario.style.backgroundColor = '#F5F5F5';
          columnaTituloPropietario.style.fontWeight = 'bold';
          columnaTituloPropietario.style.fontSize = '12px';
          // columnaTituloPropietario.style.border = '1px solid';
          columnaTituloPropietario.style.width = 'auto';
          columnaTituloPropietario.style.whiteSpace = 'nowrap';
          const columnaNombrePropietario = document.createElement('td');
          columnaNombrePropietario.textContent = data.name_propietario;
          const columnaTitulo2Propietario = document.createElement('th');
          columnaTitulo2Propietario.innerHTML = 'Documento';
          // columnaTitulo2Propietario.style.backgroundColor = '#F5F5F5';
          columnaTitulo2Propietario.style.fontWeight = 'bold';
          columnaTitulo2Propietario.style.fontSize = '12px';
          // columnaTitulo2Propietario.style.border = '1px solid';
          columnaTitulo2Propietario.style.width = 'auto';
          columnaTitulo2Propietario.style.whiteSpace = 'nowrap';
          const columnaDocumentoPropietario = document.createElement('td');
          columnaDocumentoPropietario.textContent = data.documento_propietario;
          filasp.appendChild(columnaTituloPropietario);
          filasp.appendChild(columnaNombrePropietario);
          filasp.appendChild(columnaTitulo2Propietario);
          filasp.appendChild(columnaDocumentoPropietario);
          // Rendreizar la tabla
          tabla_datos.appendChild(filasp);
        }

        // /* Poseedor */
        if (data.poseedor === '1') {
          const filaspos = document.createElement('tr');
          const columnaTituloPoseedor = document.createElement('th');
          columnaTituloPoseedor.innerHTML = 'Nombre Poseedor';
          // columnaTituloPoseedor.style.backgroundColor = '#F5F5F5';
          columnaTituloPoseedor.style.fontWeight = 'bold';
          columnaTituloPoseedor.style.fontSize = '12px';
          // columnaTituloPoseedor.style.border = '1px solid';
          columnaTituloPoseedor.style.width = 'auto';
          columnaTituloPoseedor.style.whiteSpace = 'nowrap';
          const columnaNombrePoseedor = document.createElement('td');
          columnaNombrePoseedor.textContent = data.name_poseedor;
          const columnaTitulo2Poseedor = document.createElement('th');
          columnaTitulo2Poseedor.innerHTML = 'Documento';
          // columnaTitulo2Poseedor.style.backgroundColor = '#F5F5F5';
          columnaTitulo2Poseedor.style.fontWeight = 'bold';
          columnaTitulo2Poseedor.style.fontSize = '12px';
          // columnaTitulo2Poseedor.style.border = '1px solid';
          columnaTitulo2Poseedor.style.width = 'auto';
          columnaTitulo2Poseedor.style.whiteSpace = 'nowrap';
          const columnaDocumentoPoseedor = document.createElement('td');
          columnaDocumentoPoseedor.textContent = data.documento_poseedor;
          filaspos.appendChild(columnaTituloPoseedor);
          filaspos.appendChild(columnaNombrePoseedor);
          filaspos.appendChild(columnaTitulo2Poseedor);
          filaspos.appendChild(columnaDocumentoPoseedor);
          // Rendreizar la tabla
          tabla_datos.appendChild(filaspos);
        }

        // /* Conductor */
        if (data.conductor === '1') {
          const filascond = document.createElement('tr');
          const columnaTituloConductor = document.createElement('th');
          columnaTituloConductor.innerHTML = 'Nombre Conductor';
          // columnaTituloConductor.style.backgroundColor = '#F5F5F5';
          columnaTituloConductor.style.fontWeight = 'bold';
          columnaTituloConductor.style.fontSize = '12px';
          // columnaTituloConductor.style.border = '1px solid';
          columnaTituloConductor.style.width = 'auto';
          columnaTituloConductor.style.whiteSpace = 'nowrap';
          const columnaNombreConductor = document.createElement('td');
          columnaNombreConductor.textContent = data.name_conductor;
          const columnaTitulo2Conductor = document.createElement('th');
          columnaTitulo2Conductor.innerHTML = 'Documento';
          // columnaTitulo2Conductor.style.backgroundColor = '#F5F5F5';
          columnaTitulo2Conductor.style.fontWeight = 'bold';
          columnaTitulo2Conductor.style.fontSize = '12px';
          // columnaTitulo2Conductor.style.border = '1px solid';
          columnaTitulo2Conductor.style.width = 'auto';
          columnaTitulo2Conductor.style.whiteSpace = 'nowrap';
          const columnaDocumentoConductor = document.createElement('td');
          columnaDocumentoConductor.textContent = data.documento_conductor;
          filascond.appendChild(columnaTituloConductor);
          filascond.appendChild(columnaNombreConductor);
          filascond.appendChild(columnaTitulo2Conductor);
          filascond.appendChild(columnaDocumentoConductor);
          // Rendreizar la tabla
          tabla_datos.appendChild(filascond);
          /* Tabla de referencias labaroales */
          let tbody = document.getElementById(`referencias_nuevas`);
          tbody.textContent = '';
          const fila = document.createElement('tr');
          const columnaEmpresa1 = document.createElement('td');
          columnaEmpresa1.textContent = data.empresa1;
          const columnaIngreso1 = document.createElement('td');
          columnaIngreso1.textContent = data.feca1 ?? '-';
          const columnaRetiro1 = document.createElement('td');
          columnaRetiro1.textContent = data.feca2 ?? '-';
          const columnaContacto1 = document.createElement('td');
          columnaContacto1.textContent = data.persona1;
          const columnaCelular1 = document.createElement('td');
          columnaCelular1.textContent = data.cel1;
          const columnaCargo1 = document.createElement('td');
          columnaCargo1.textContent = data.cargo1;
          fila.appendChild(columnaEmpresa1);
          fila.appendChild(columnaIngreso1);
          fila.appendChild(columnaRetiro1);
          fila.appendChild(columnaContacto1);
          fila.appendChild(columnaCelular1);
          fila.appendChild(columnaCargo1);
          const fila2 = document.createElement('tr');
          const columnaEmpresa2 = document.createElement('td');
          columnaEmpresa2.textContent = data.empresa2;
          const columnaIngreso2 = document.createElement('td');
          columnaIngreso2.textContent = data.fecb1 ?? '-';
          const columnaRetiro2 = document.createElement('td');
          columnaRetiro2.textContent = data.fecb2 ?? '-';
          const columnaContacto2 = document.createElement('td');
          columnaContacto2.textContent = data.persona2;
          const columnaCelular2 = document.createElement('td');
          columnaCelular2.textContent = data.cel2;
          const columnaCargo2 = document.createElement('td');
          columnaCargo2.textContent = data.cargo2;
          fila2.appendChild(columnaEmpresa2);
          fila2.appendChild(columnaIngreso2);
          fila2.appendChild(columnaRetiro2);
          fila2.appendChild(columnaContacto2);
          fila2.appendChild(columnaCelular2);
          fila2.appendChild(columnaCargo2);

          const fila3 = document.createElement('tr');
          const columnaEmpresa3 = document.createElement('td');
          columnaEmpresa3.textContent = data.empresa3;
          const columnaIngreso3 = document.createElement('td');
          columnaIngreso3.textContent = data.fecc1 ?? '-';
          const columnaRetiro3 = document.createElement('td');
          columnaRetiro3.textContent = data.fecc2 ?? '-';
          const columnaContacto3 = document.createElement('td');
          columnaContacto3.textContent = data.persona3;
          const columnaCelular3 = document.createElement('td');
          columnaCelular3.textContent = data.cel3;
          const columnaCargo3 = document.createElement('td');
          columnaCargo3.textContent = data.cargo3;
          fila3.appendChild(columnaEmpresa3);
          fila3.appendChild(columnaIngreso3);
          fila3.appendChild(columnaRetiro3);
          fila3.appendChild(columnaContacto3);
          fila3.appendChild(columnaCelular3);
          fila3.appendChild(columnaCargo3);
          // Rendreizar la tabla
          tbody.appendChild(fila);
          tbody.appendChild(fila2);
          tbody.appendChild(fila3);
          document.getElementById(`tbl_referencias`).style.display = '';
        } else {
          let tbody = document.getElementById(`referencias_nuevas`);
          tbody.innerHTML = '';
          document.getElementById(`tbl_referencias`).style.display = 'none';
        }

        // /* Trailer */
        if (data.trailer === '1') {
          const filasTrailer = document.createElement('tr');
          const columnaTituloTrailer = document.createElement('th');
          columnaTituloTrailer.innerHTML = 'Placa Trailer';
          columnaTituloTrailer.style.fontWeight = 'bold';
          columnaTituloTrailer.style.fontSize = '12px';
          columnaTituloTrailer.style.border = '1px solid';
          columnaTituloTrailer.style.width = 'auto';
          columnaTituloTrailer.style.whiteSpace = 'nowrap';

          const columnaPlacaTraileer = document.createElement('td');
          columnaPlacaTraileer.textContent = data.placa_trailer;

          const columnaTitulo2Trailer = document.createElement('th');
          columnaTitulo2Trailer.innerHTML = 'Propietario Trailer';
          columnaTitulo2Trailer.style.fontWeight = 'bold';
          columnaTitulo2Trailer.style.fontSize = '12px';
          columnaTitulo2Trailer.style.border = '1px solid';
          columnaTitulo2Trailer.style.width = 'auto';
          columnaTitulo2Trailer.style.whiteSpace = 'nowrap';

          const columnaPropetarioTrailer = document.createElement('td');
          columnaPropetarioTrailer.textContent = data.name_propietario_trailer;

          filasTrailer.appendChild(columnaTituloTrailer);
          filasTrailer.appendChild(columnaPlacaTraileer);
          filasTrailer.appendChild(columnaTitulo2Trailer);
          filasTrailer.appendChild(columnaPropetarioTrailer);

          const filasDocTrailer = document.createElement('tr');
          const columnaTitulo3Trailer = document.createElement('th');
          columnaTitulo3Trailer.innerHTML = 'Documento Propietario Trailer';
          columnaTitulo3Trailer.style.fontWeight = 'bold';
          columnaTitulo3Trailer.style.fontSize = '12px';
          columnaTitulo3Trailer.style.border = '1px solid';
          columnaTitulo3Trailer.style.width = 'auto';
          columnaTitulo3Trailer.style.whiteSpace = 'nowrap';

          const columnaDocumentoTraileer = document.createElement('td');
          columnaDocumentoTraileer.textContent = data.documento_propi_trailer;

          filasDocTrailer.appendChild(columnaTitulo3Trailer);
          filasDocTrailer.appendChild(columnaDocumentoTraileer);

          // Agregar a la tabla correctamente
          tabla_datos.appendChild(filasTrailer);
          tabla_datos.appendChild(filasDocTrailer);
        } else {
          // Si NO hay trailer, mostramos un aviso en la tabla
          const filaVacia = document.createElement('tr');
          const celda = document.createElement('td');
          celda.colSpan = 4; // para que ocupe todo el ancho
          celda.style.textAlign = 'center';
          celda.style.color = 'gray';
          celda.textContent = 'Sin información de trailer';
          filaVacia.appendChild(celda);
          tabla_datos.appendChild(filaVacia);
        }

      } else {
        alert('Error de operación');
      }
    })
    .catch(error => {
      // console.log("🚀 ~ Listar_datos_prefiltro_nuevo_recurso ~ error:", error)
      // alert(error);
    });

  /* Traer los datos actuales del vehiculos al que se le va hacer la actualización */
  let datos = new FormData();
  datos.append('placa_consulta', placa);
  fetch($('#base_url').val() + 'validacionparametros/verificar_datos_actuales', {
    method: 'POST',
    cache: 'no-cache',
    body: datos,
  })
    .then(response => response.json())
    .then(function (data) {
      if (data) {
        document.getElementById(`propietario_actual`).innerHTML = data.Propietario;
        document.getElementById(`documento_propietario_actual`).innerHTML = data.cedula_propietario;
        document.getElementById(`tenedor_actual`).innerHTML = data.Poseedor;
        document.getElementById(`documento_tenedor_actual`).innerHTML = data.cedula_poseedor;
        document.getElementById(`conductor_actual`).innerHTML = data.Conductor;
        document.getElementById(`documento_conductor_actual`).innerHTML = data.cedula_conductor;

        /* DATOS DEL TRAILER ACTUAL */
        if (data.Placa_Trailer) {
          document.getElementById(`actual_placa_trailer`).innerHTML = data.Placa_Trailer;
          document.getElementById(`actual_propietario_trailer`).innerHTML = data.Propietario_Trailer;
          document.getElementById(`documento_actual_propietario_trailer`).innerHTML = data.cedula_propietario_trailer;
        } else {
          document.getElementById(`actual_placa_trailer`).textContent = 'No Aplica';
          document.getElementById(`actual_propietario_trailer`).textContent = '';
          document.getElementById(`documento_actual_propietario_trailer`).textContent = '';
        }

        /* Datos del satelital del vehículo */
        document.getElementById(`web_satelital`).innerHTML = `<a href="${data.web_satelital}" target="_blank">${data.web_satelital}</a>`;
        document.getElementById(`usuario_satelital`).innerHTML = data.usuario_satelital;
        document.getElementById(`clave_satelital`).innerHTML = data.clave_satelital;

      } else {
        alert('Error de operación');
      }
    })
    .catch(error => {
      // alert(error);
    });

  /* Listar los log del vehiculo segun el estado */
  let formdatos = new FormData();
  formdatos.append('placa_consulta', placa);
  formdatos.append('solicitud_id', solicitud_id);
  fetch($('#base_url').val() + 'validacionparametros/listar_logs_prefiltro_nuevo', {
    method: 'POST',
    cache: 'no-cache',
    body: formdatos,
  })
    .then(response => response.json())
    .then(function (data) {
      if (data) {
        // Seleccionar el elemento <ul>
        var ul = document.getElementById(`lista_log_estdo`);
        ul.innerHTML = '';

        data.forEach(element => {
          const li = document.createElement('li');
          li.classList.add('p-2', 'mb-2', 'rounded', 'shadow-sm');

          // Colores según estado
          let bgColor = '#f8f9fa';
          if (element.estado === 'Iniciado') bgColor = '#e3f2fd';
          else if (element.estado === 'Aprobado') bgColor = '#76f393ff';
          else if (element.estado === 'Rechazado') bgColor = '#f8d7da';
          else if (element.estado === 'Pendiente') bgColor = '#fff3cd';

          li.style.backgroundColor = bgColor;
          li.style.borderLeft = '4px solid #0d6efd';
          li.style.fontSize = '13px';

          li.innerHTML = `
            <div class="fw-bold mb-1 text-dark">
              Estado: <span class="text-primary">${element.estado}</span>
            </div>
            <div class="text-muted" style="font-size:12px;">
              <strong>Observación:</strong> ${element.observacion || 'Sin observación'}<br>
              <strong>Usuario:</strong> ${element.usuario} <br>
              <strong>Fecha:</strong> ${element.fecha} ${element.hora}
            </div>
          `;

          ul.appendChild(li);
        });

      } else {
        alert('Error de operación');
      }
    })
    .catch(error => {
      // alert(error);
    });
}

function validarExtension(fic) {
  var input = document.getElementById("op_archivo"); // Reemplaza 'tuInputFile' con el ID de tu input file
  var archivos = input.files[0];
  if (archivos) {
    // Lista de extensiones permitidas
    var extensionesPermitidas = ["pdf", "jpg", "jpeg", "png", "webp"]; // Lista de extensiones permitidas
    // Obtener el nombre del archivo del input
    const archivo = input.value;
    // var archivos = licencia_conductor.files[0];
    // Obtener la extensión del archivo
    const extension = archivo.split('.').pop().toLowerCase(); // Obtiene la última parte después del punto y la convierte a minúscula
    // Verificar si la extensión está en la lista de permitidas
    if (extensionesPermitidas.includes(extension)) {
      console.log('Extensión permitida: ' + extension);
      // Verifica el tamaño del archivo (en este caso, máximo 2MB)
      var maxSize = 2 * 1024 * 1024; // 2 MB = 2,097,152 bytes
      if (archivos.size > maxSize) {
        // alert("El archivo no debe superar el tamaño de 2MB.");
        Swal.fire({
          title: "Mensaje!",
          text: "El archivo no debe superar el tamaño de 2MB.",
          icon: "warning"
        });

        $('#op_nomarchivo').val('');
        input.value = '';
      } else {
        fic = fic.split("\\");
        if (fic == "" || fic == null) {
          $("#op_nomarchivo").val("");
        } else {
          $("#op_nomarchivo").val(fic[fic.length - 1]);
        }
      }
      return true;
    } else {
      // alert("Extensión de archivo no permitida. Por favor, selecciona un archivo con una de las siguientes extensiones: " +
      //     extensionesPermitidas.join(", "),
      // );
      Swal.fire({
        title: "Mensaje!",
        text: `Extensión de archivo no permitida. Por favor, selecciona un archivo con una de las siguientes extensiones: ${extensionesPermitidas.join(", ")}`,
        icon: "warning"
      });
      input.value = ''; // Vaciar el campo para evitar cargar el archivo
      document.getElementById('op_nomarchivo').value = ''; // Vaciar el campo para evitar cargar el archivo
      return false;
    }
  }
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
        aria-labelledby="${this.settings.id}-label" style="width: 800px;">
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

// Función para codificar en Base64
function codificarBase64(texto) {
  return btoa(texto);
}

// Función para decodificar Base64
function decodificarBase64(textoCodificado) {
  return atob(textoCodificado);
}