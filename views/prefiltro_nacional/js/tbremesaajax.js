
(function () {
    "use strict";

    window.VENTANA = null;
    window.URL_DSNUBE = null;

    window.initScript = function (id) {
        window.VENTANA = id;
        window.URL_DSNUBE = document.getElementById('url_api_dsnube').value;
        TablaRemesa();

        $('#contenedor_datos').css('display', 'none');
        $('#tabla_datos').css('display', '');
        $('.divcliente').hide();
        // $('.divfechas').hide();
        $('.divfechas').show();
        $('.divbtnbusqueda').hide();

        $('#buscar_remesa').click(function () {
            //consulta de la tabla de remesas
            TablaRemesa();
        });

        $('#btn_actualizar').click(function () {
            Actualizar_Remesa();
        });

        $('#btn_imprimir').click(function () {
            var idr = $('#c_remesa').val();
            var ido = $('#c_orden').val();
            var url = $('#base_url').val() + 'libs/remesa_pdf.php?' + 'remesa=' + codificarBase64(idr) + '&orden=' + codificarBase64(ido);
            window.open(url, '_blank');
        });

        $('#filtro_remesas').change(function () {
            var consultar = $('#filtro_remesas').val();
            if (consultar == '') {
                $('.divcliente').hide();
                $('.divfechas').hide();
                $('.divbtnbusqueda').hide();
            }
            if (consultar == 1) {
                $('.divcliente').hide();
                $('.divfechas').show();
                $('.divbtnbusqueda').show();
            }
            if (consultar == 2) {
                $('.divcliente').show();
                $('.divfechas').hide();
                $('.divbtnbusqueda').show();
                ConsultaCliente();
            }
            if (consultar == 3) {
                $('.divcliente').show();
                $('.divfechas').show();
                $('.divbtnbusqueda').show();
                ConsultaCliente();
            }
        });

        //Funcion para lisatr las ordenes de cargue
        Listar_Ordenes_Cargue();

        document.querySelector('#orden_cargue').addEventListener('change', async function () {
            const orden = this.value;
            if (!orden) {
                alert('Limpiar campos');
                return;
            }

            const selected = this.options[this.selectedIndex];
            const idoc = selected.dataset.uno;
            const servicio = selected.dataset.dos;
            const remi = selected.dataset.tres;
            const dest = selected.dataset.cuatro;
            const peso_real_carga = selected.dataset.cinco;
            const in_puntore = selected.dataset.seis;
            const tarifa_remesa = selected.dataset.siete;

            // Rellenar algunos campos iniciales
            document.querySelector('#num_oc').value = idoc;
            document.querySelector('#num_remi').value = remi;
            document.querySelector('#num_dest').value = dest;
            document.querySelector('#num_solicitud').value = servicio;
            document.querySelector('#cantidad_real').value = peso_real_carga;
            document.querySelector('#id_puntorem').value = in_puntore;

            const baseUrl = document.querySelector('#base_url').value;

            try {
                // 1) Obtener datos de la orden
                const datosOrden = await fetchPost(`${baseUrl}transporte/Datos_Orden`, { servicio });
                if (datosOrden?.length) renderDatosOrden(datosOrden[0]);

                // 2) Origen - Destino
                const origenDestino = await fetchPost(`${baseUrl}transporte/Origen_Destino`, { servicio });
                if (origenDestino?.length) {
                    document.querySelector('#origen_destino').innerHTML = `
                    <p><strong>Origen:</strong> ${origenDestino[0].origen} - <strong>Destino:</strong> ${origenDestino[0].destino}</p>
                `;
                }

                // 3) Remitente
                const remitente = await fetchPost(`${baseUrl}transporte/Dato_remitente`, { servicio, remit: remi });
                if (remitente?.length) renderRemitente(remitente[0]);

                // 4) Destinatario
                const destinatario = await fetchPost(`${baseUrl}transporte/Dato_Destinatario`, { servicio, remit: dest, desti: dest });
                if (destinatario?.length) renderDestinatario(destinatario[0]);

                // 5) Vehículo
                const vehiculo = await fetchPost(`${baseUrl}transporte/Dato_vehiculo`, { orden: idoc });
                if (vehiculo?.length) renderVehiculo(vehiculo[0]);

                // 6) Precintos (tabla)
                const precintos = await fetchPost(`${baseUrl}transporte/precintos`, { orden: idoc });
                const tbPrecinto = document.querySelector('#tb_precinto');
                tbPrecinto.innerHTML = '';
                precintos?.forEach((p) => {
                    tbPrecinto.innerHTML += `
                    <tr>
                    <td>${p.serie_precinto}</td>
                    <td>${p.tipo_precinto}</td>
                    </tr>
                `;
                });

                document.getElementById("Registrar_remesa").setAttribute('data-tarifa_remesa', tarifa_remesa);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            }
        });

        // Función para hacer peticiones POST con fetch
        async function fetchPost(url, params) {
            const formData = new URLSearchParams();
            Object.entries(params).forEach(([k, v]) => formData.append(k, v));

            const res = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            return res.json();
        }

        // Funciones de renderizado para mantener limpio el código
        function renderDatosOrden(data) {
            const carga =
                {
                    G: 'General',
                    P: 'Paqueteo',
                    C: 'Contenedor cargado',
                }[data.tipo_carga] || '';

            document.querySelector('#oficina').value = data.nombrea;
            document.querySelector('#tempaque').value = data.empaque;
            document.querySelector('#toperacion').value = carga;
            document.querySelector('#valor_mercancia').value = data.valor_mercancia;
            document.querySelector('#naturaleza').value = carga;
            document.querySelector('#cantidad').value = data.cantidad_empaque;
            document.querySelector('#volumen_total').value = data.volumen_total;
            document.querySelector('#peso_neto_tn').value = data.peso_neto_tn;
            document.querySelector('#mercancia').value = data.tipo_mercancia;
            document.querySelector('#unidad_medida').value = data.tipo_servicio_mer;
            document.querySelector('#protipoi').value = data.tipo_documento;
            document.querySelector('#pronumero').value = `${data.documento}-${data.digito_verificacion}`;
            document.querySelector('#pronombre').value = data.nombre;
            document.querySelector('#prodireccion').value = data.direccion;
            document.querySelector('#promunicipio').value = data.ciudad;
            document.querySelector('#propostal').value = data.codigo_postal;
            document.querySelector('#observacion_cliente').value = data.observaciones;
        }

        function renderRemitente(data) {
            document.querySelector('#rnombre').value = data.nombre;
            document.querySelector('#rciudad').value = data.ciudad;
            document.querySelector('#rdireccion').value = data.direccion_entrega;
            document.querySelector('#rtelefono').value = data.telefono;
            document.querySelector('#ridentifica').value = data.documento;
            document.querySelector('#r_fechacargue').value = data.fecha_estimada_entrega;
            document.querySelector('#r_horacargue').value = data.hora_estimada;
        }

        function renderDestinatario(data) {
            document.querySelector('#dnombre').value = data.nombre;
            document.querySelector('#didentifica').value = data.documento;
            document.querySelector('#dciudad').value = data.ciudad;
            document.querySelector('#ddireccion').value = data.direccion_entrega;
            document.querySelector('#dtelefono').value = data.telefono;
            document.querySelector('#fecha_entrega').value = data.fecha_estimada_entrega;
            document.querySelector('#hora_entrega').value = data.hora_estimada;
            document.querySelector('#r_fechadescargue').value = data.fecha_estimada_entrega;
            document.querySelector('#r_horadescargue').value = data.hora_estimada;
            document.querySelector('#observacion_destinatario').value = data.observacion;
        }

        function renderVehiculo(data) {
            document.querySelector('#placa').value = data.placa;
            document.querySelector('#conductor').value = `${data.nombre} ${data.apellido1} ${data.apellido2}`;
            document.querySelector('#condu_identifica').value = `${data.numero_documento}-${data.digito_verificacion}`;
        }

        // JavaScript
        document.getElementById('exportar_excel').addEventListener('click', function () {
            var table = document.getElementById('ordenes_remesa_export');
            if (table) {
                // Clonar la tabla
                var clonedTable = table.cloneNode(true);

                // Indicar qué columnas omitir (por ejemplo, 1 y 3)
                var columnsToOmit = [0, 6]; // Índices base 0

                // Eliminar las columnas no deseadas en el encabezado
                var ths = clonedTable.querySelectorAll('thead th');
                columnsToOmit
                    .slice()
                    .reverse()
                    .forEach((index) => {
                        ths[index].remove();
                    });

                // Eliminar las columnas no deseadas en las filas del cuerpo
                var rows = clonedTable.querySelectorAll('tbody tr');
                rows.forEach((row) => {
                    var cells = row.querySelectorAll('td');
                    columnsToOmit
                        .slice()
                        .reverse()
                        .forEach((index) => {
                            cells[index].remove();
                        });
                });

                // Convertir la tabla modificada a libro de Excel
                var wb = XLSX.utils.table_to_book(clonedTable);
                const fechaActual = new Date().toISOString().slice(0, 10);
                const nombreArchivo = `Informe de Remesas_${fechaActual}.xlsx`;
                XLSX.writeFile(wb, nombreArchivo);
            } else {
                console.error("El elemento con el ID 'ordenes_decargue' no existe.");
            }
        });

        // Manejador del evento clic en el botón de registro de remesa
        $('#Registrar_remesa').click(function () {
            Swal.fire({
                title: '¿Deseas guardar la remesa de transporte?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, guardar',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    let errores = [];

                    // -----------------------------------------------------------
                    // 1. Validaciones de campos obligatorios
                    // -----------------------------------------------------------
                    if (!$('#orden_cargue').val()) {
                        errores.push('Debe seleccionar la <strong>Orden de cargue</strong> para registrar la remesa');
                        AplicaFoco('#orden_cargue');
                    } else {
                        RemueveFoco('#orden_cargue');
                    }

                    if (!$('#rcontacto_remesa').val()) {
                        errores.push('Debe diligenciar el campo <strong>Remesa contado</strong> para registrar la remesa');
                        AplicaFoco('#rcontacto_remesa');
                    } else {
                        RemueveFoco('#rcontacto_remesa');
                    }

                    if (!$('#rcontra_remesa').val()) {
                        errores.push('Debe diligenciar el campo <strong>Remesa contraentrega</strong> para registrar la remesa');
                        AplicaFoco('#rcontra_remesa');
                    } else {
                        RemueveFoco('#rcontra_remesa');
                    }

                    // Recolección y validación de campos de Fecha/Hora
                    const horaCargue = $('#r_horacargue').val();
                    const fechaCargue = $('#r_fechacargue').val();
                    const horaDescargue = $('#r_horadescargue').val();
                    const fechaDescargue = $('#r_fechadescargue').val();

                    if (!horaCargue) {
                        errores.push('Debe diligenciar el campo <strong>Hora pactada del cargue</strong> para registrar la remesa');
                        AplicaFoco('#r_horacargue');
                    } else {
                        RemueveFoco('#r_horacargue');
                    }

                    if (!fechaCargue) {
                        errores.push('Debe diligenciar el campo <strong>Fecha/hora cita cargue</strong> para registrar la remesa');
                        AplicaFoco('#r_fechacargue');
                    } else {
                        RemueveFoco('#r_fechacargue');
                    }

                    if (!horaDescargue) {
                        errores.push('Debe diligenciar el campo <strong>Hora pactada del descargue</strong> para registrar la remesa');
                        AplicaFoco('#r_horadescargue');
                    } else {
                        RemueveFoco('#r_horadescargue');
                    }

                    if (!fechaDescargue) {
                        errores.push('Debe diligenciar el campo <strong>Fecha/hora cita descargue</strong> para registrar la remesa');
                        AplicaFoco('#r_fechadescargue');
                    } else {
                        RemueveFoco('#r_fechadescargue');
                    }

                    if (!$('#cantidad_real').val()) {
                        errores.push('Debe diligenciar el campo <strong>Cantidad_cargada</strong> para registrar la remesa');
                        AplicaFoco('#cantidad_real');
                    } else {
                        RemueveFoco('#cantidad_real');
                    }

                    // Validar horas de cargue
                    let cargue = parseInt($('#cant_hour_cargue').val(), 10);
                    if (isNaN(cargue) || cargue < 1) {
                        errores.push('El campo <strong>Horas pacto cargue</strong> debe ser mínimo 1');
                        AplicaFoco('#cant_hour_cargue');
                    } else {
                        RemueveFoco('#cant_hour_cargue');
                    }

                    if (!$('#cant_min_cargue').val()) {
                        errores.push('Debe diligenciar el campo <strong>Minutos pacto cargue</strong> para registrar la remesa');
                        AplicaFoco('#cant_min_cargue');
                    } else {
                        RemueveFoco('#cant_min_cargue');
                    }

                    // Validar horas de descargue
                    let descargue = parseInt($('#cant_hour_descargue').val(), 10);
                    if (isNaN(descargue) || descargue < 1) {
                        errores.push('El campo <strong>Horas pacto descargue</strong> debe ser mínimo 1');
                        AplicaFoco('#cant_hour_descargue');
                    } else {
                        RemueveFoco('#cant_hour_descargue');
                    }

                    if (!$('#cant_min_descargue').val()) {
                        errores.push('Debe diligenciar el campo <strong>Minutos pacto descargue</strong> para registrar la remesa');
                        AplicaFoco('#cant_min_descargue');
                    } else {
                        RemueveFoco('#cant_min_descargue');
                    }

                    // -----------------------------------------------------------
                    // 2. Validación de Lógica de Fechas/Horas (Cargue vs Descargue)
                    // -----------------------------------------------------------
                    // Solo se ejecuta si todas las fechas/horas están diligenciadas
                    if (fechaCargue && horaCargue && fechaDescargue && horaDescargue) {
                        // Combinar fecha y hora en formato YYYY-MM-DD HH:MM para crear objetos Date
                        const fechaHoraCargueStr = fechaCargue + ' ' + horaCargue;
                        const fechaHoraDescargueStr = fechaDescargue + ' ' + horaDescargue;

                        const dateCargue = new Date(fechaHoraCargueStr);
                        const dateDescargue = new Date(fechaHoraDescargueStr);

                        // Si ambas fechas son válidas, se realiza la comparación de timestamps
                        if (!isNaN(dateCargue.getTime()) && !isNaN(dateDescargue.getTime())) {
                            if (dateCargue.getTime() >= dateDescargue.getTime()) {
                                errores.push(
                                    'La <strong>Fecha y Hora de Cargue</strong> no pueden ser iguales o posteriores a la <strong>Fecha y Hora de Descargue</strong>.'
                                );
                                AplicaFoco('#r_fechacargue');

                                // 🛑 APLICACIÓN DE LA REGLA: Si la validación pasa, habilitamos los campos
                                $('#r_fechacargue').prop('disabled', false).removeClass('disabled');
                                $('#r_horacargue').prop('disabled', false).removeClass('disabled');
                                $('#r_fechadescargue').prop('disabled', false).removeClass('disabled');
                                $('#r_horadescargue').prop('disabled', false).removeClass('disabled');
                            }
                        }
                    }

                    // -----------------------------------------------------------
                    // 3. Mostrar errores con SweetAlert2 o llamar a Registro_Remesa
                    // -----------------------------------------------------------
                    if (errores.length > 0) {
                        const listaErrores = errores.map((msg) => `<li>${msg}</li>`).join('');
                        Swal.fire({
                            // title: 'Errores en el formulario',
                            title: '⚠️ ALERTA DE REMESA ⚠️',
                            html: `<ul class="text-start mb-0 ps-3">${listaErrores}</ul>`,
                            icon: 'warning',
                            confirmButtonText: 'Revisar',
                        });
                    } else {
                        // Si no hay errores, llama la función de registro
                        // Registro_Remesa();
                        const tarifaRemesa = $('#Registrar_remesa').data('tarifa_remesa');
                        Registro_Remesa(tarifaRemesa);
                    }
                } else {
                    Swal.fire('Operación cancelada', '', 'info');
                }
            });
        });
    };

    function Listar_Ordenes_Cargue() {
        fetch(`${$('#base_url').val()}transporte/Seleccione_orden`, {
            method: 'POST',
        })
            .then((response) => response.json())
            .then((data) => {
                const selectOrden = document.getElementById('orden_cargue');

                if (data && data.length > 0) {
                    // Habilitar el select si estaba deshabilitado
                    selectOrden.disabled = false;

                    // Limpiar opciones previas
                    selectOrden.innerHTML = '<option value="">Seleccione una orden</option>';

                    // Insertar opciones usando template literals
                    data.forEach((item) => {
                        const option = `
                        <option 
                            value="${item.id}"
                            data-uno="${item.id}"
                            data-dos="${item.mer_idservicio}"
                            data-tres="${item.id_remitente}"
                            data-cuatro="${item.id_destinatario}"
                            data-cinco="${item.ca_pesocargue}"
                            data-seis="${item.id_punto}"
                            data-siete="${item.valor_tarifa ?? 0}">
                            Orden: ${item.id} 
                            / Remi: (${item.id_remitente}) ${item.remitente} 
                            / Dest: (${item.id_destinatario}) ${item.destinatario} 
                            / Placa: ${item.placa}
                        </option>
                    `;
                        selectOrden.insertAdjacentHTML('beforeend', option);
                    });
                } else {
                    // Si no hay datos, dejar un mensaje y deshabilitar
                    selectOrden.innerHTML = '<option value="">No hay órdenes disponibles</option>';
                    selectOrden.disabled = true;
                }
            })
            .catch((error) => {
                console.error('Error al cargar órdenes:', error);
            });
    }

    // ============================================================
    //  ACUMULADOR GLOBAL DE MENSAJES
    // ============================================================
    window.mensajesTransmision = [];

    // ============================================================
    //  REGISTRAR REMESA LOCAL
    // ============================================================

    async function Registro_Remesa(tarifaRemesa) {
        $('#loading-overlay-nexosapp').css('display', 'flex');

        const num_orden = $('#num_oc').val();
        const fechar = $('#fecha_remesa').val();
        const horar = $('#hora_remesa').val();
        const id_remitente = $('#num_remi').val();
        const id_destinatario = $('#num_dest').val();
        const sol_servicio = $('#num_solicitud').val();

        const r_contado = $('#rcontacto_remesa').val();
        const rcontra_remesa = $('#rcontra_remesa').val();
        const valor = $('#valor_mercancia').val();

        const hcargue = $('#r_horacargue').val();
        const fcargue = $('#r_fechacargue').val();
        const hdescarga = $('#r_horadescargue').val();
        const fdescarga = $('#r_fechadescargue').val();

        const cantidad_real = $('#cantidad_real').val();
        const tn = $('#tipo_novedad').val();
        const descripcion = $('#describ_novedad').val();
        const factura = $('#dfactura').val();

        const id_puntorem = $('#id_puntorem').val();
        const horaspactocargue = $('#cant_hour_cargue').val();
        const minutospactodcargue = $('#cant_min_cargue').val();
        const horaspactodescargue = $('#cant_hour_descargue').val();
        const minutopactodescargue = $('#cant_min_descargue').val();
        const obsercliente = $('#observacion_cliente').val();
        const nomarchivo = $('#imagePreview2').val();

        let numero_remesa = null;
        let mensajeFinal = '';

        try {
            const datos = new FormData();
            datos.append('num_orden', num_orden);
            datos.append('id_remite', id_remitente);
            datos.append('id_dest', id_destinatario);
            datos.append('sol_servicio', sol_servicio);
            datos.append('r_contado', r_contado);
            datos.append('rcontra_remesa', rcontra_remesa);
            datos.append('valor', valor);
            datos.append('seguro', '');
            datos.append('hcargue', hcargue);
            datos.append('fcargue', fcargue);
            datos.append('hdescarga', hdescarga);
            datos.append('fdescarga', fdescarga);
            datos.append('cantidad_real', cantidad_real);
            datos.append('tipo_nove', tn);
            datos.append('desc_nove', descripcion);
            datos.append('facturara', factura);
            datos.append('fecha_creacion', fechar);
            datos.append('hora_creacion', horar);
            datos.append('nomarchivo', nomarchivo);
            datos.append('id_puntorem', id_puntorem);
            datos.append('horaspactocargue', horaspactocargue);
            datos.append('minutospactocargue', minutospactodcargue);
            datos.append('horaspactodescargue', horaspactodescargue);
            datos.append('minutospactodescargue', minutopactodescargue);
            datos.append('obsercliente', obsercliente);
            datos.append('tarifa_remesa', tarifaRemesa);

            const response = await fetch($('#base_url').val() + 'transporte/Registro_remesa', {
                method: 'POST',
                body: datos,
                cache: 'no-cache',
            });

            const data = await response.json();

            if (data.status === true) {
                numero_remesa = data.numero_documento;
                window.mensajesTransmision.push(`🟦 Remesa registrada localmente: <strong>${numero_remesa}</strong>`);
                // Subir archivo
                if ($('#archivo_adjunto').val()) {
                    const subioArchivo = await Subir_Archivo_Remesa(num_orden, id_remitente, id_destinatario);
                    if (subioArchivo) {
                        window.mensajesTransmision.push('📄 Archivo adjunto cargado correctamente.');
                    } else {
                        window.mensajesTransmision.push('⚠️ No se pudo cargar el archivo adjunto.');
                    }
                }
            } else {
                Swal.fire({
                    title: 'Error en Registro',
                    html: data.error || `La remesa no pudo ser registrada en NEXOSAPP.`,
                    icon: 'error',
                    confirmButtonText: 'Cerrar',
                });
                return;
            }
        } catch (error) {
            Swal.fire({
                title: 'Error Crítico',
                text: 'Ocurrió un error durante el registro de la remesa.',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
            return;
        } finally {
            $('#loading-overlay-nexosapp').css('display', 'none');
            // Ejecutar RNDC después de 1.5 segundos
            // setTimeout(async () => {}, 1000);
            if (numero_remesa) {
                await Crear_Remesa_Rndc(numero_remesa);
            }

        }
    }

    // ============================================================
    //  TRANSMITIR AL RNDC
    // ============================================================
    async function Crear_Remesa_Rndc(idRemesa) {
        $('#loading-overlay-rndc').css('display', 'flex');
        const payload = { remesa_id: idRemesa };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/rndc/transmitir-remesa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'mi_super_api_key_ultra_secreta_123',
                },
                body: JSON.stringify(payload),
            });

            const resultado = await response.json();

            if (!resultado.success) {
                window.mensajesTransmision.push(`
                ❌ Error al transmitir la remesa al RNDC:<br>
                ${resultado.message ?? ''} <br>
                <small>${resultado.error ?? ''}</small>
            `);
            } else {
                window.mensajesTransmision.push(`
                ✅ Remesa transmitida correctamente al RNDC.<br>
                ID RNDC: ${resultado.ingresoid ?? 'N/A'}
            `);
            }

        } catch (error) {
            window.mensajesTransmision.push(`❌ Error inesperado conectando al RNDC: ${error}`);
        } finally {
            $('#loading-overlay-rndc').css('display', 'none');
            await Crear_Datorm_Oet(idRemesa); // ✅ Una sola llamada, siempre al final
        }
    }

    // ============================================================
    //  REGISTRO EN OET (ya NO muestra el SweetAlert final)
    // ============================================================
    async function Crear_Datorm_Oet(num_mani) {
        $('#loading-overlay-oet').css('display', 'flex');

        let datos = new FormData();
        datos.append('recurso', 2);
        datos.append('numero', num_mani);

        try {
            const response = await fetch($('#base_url').val() + 'integrar_oet/Consulta_Transacciones', {
                method: 'POST',
                body: datos,
                cache: 'no-cache',
            });

            let text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error("Respuesta NO JSON: " + text);
            }

            if (data.status == true || data.status == 'true') {
                window.mensajesTransmision.push(`🟩 Remesa registrada en OET: ${data.id_remesa}`);
            } else {
                window.mensajesTransmision.push(`⚠️ No se registró remesa en OET`);
            }

        } catch (error) {
            window.mensajesTransmision.push(`❌ Error en OET: ${error.message}`);
        } finally {
            $('#loading-overlay-oet').css('display', 'none');
            // ✅ Ya NO muestra Swal aquí, se delega a CrearRemesaDsNube
            await CrearRemesaDsNube(num_mani);
            window.mensajesTransmision = [];
        }
    }

    // ============================================================
    //  CLIENTE API — maneja token automáticamente
    // ============================================================
    const DsnubeApi = {
        TOKEN_KEY: 'dsnube_api_token',
        BASE_URL: document.getElementById('url_api_dsnube').value,
        API_KEY: 'nexos_dsnube_2026*',

        getToken() {
            return localStorage.getItem(this.TOKEN_KEY);
        },

        saveToken(token) {
            if (token) localStorage.setItem(this.TOKEN_KEY, token);
        },

        clearToken() {
            localStorage.removeItem(this.TOKEN_KEY);
        },

        async login() {
            const response = await fetch(this.BASE_URL + 'login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': this.API_KEY,
                },
                body: JSON.stringify({
                    username: 'dsnube_api',   // lo pones en tu blade como variable global
                    password: 'Traveck2025*',
                }),
            });

            const data = await response.json();

            if (!data.success) throw new Error('Login DsNube fallido');

            this.saveToken(data.token);
            return data.token;
        },

        // ✅ Fetch inteligente: reintenta una vez si el token expiró
        async fetch(endpoint, options = {}) {
            const doRequest = async (token) => {
                const response = await fetch(this.BASE_URL + endpoint, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': this.API_KEY,
                        'Authorization': `Bearer ${token}`,
                        ...(options.headers ?? {}),
                    },
                });

                // Si Laravel devuelve un token renovado, guardarlo
                const newToken = response.headers.get('X-New-Token');
                if (newToken) this.saveToken(newToken);

                return response;
            };

            let token = this.getToken();

            // Sin token: hacer login primero
            if (!token) token = await this.login();

            let response = await doRequest(token);

            // Token expirado: login y reintentar UNA vez
            if (response.status === 401) {
                this.clearToken();
                token = await this.login();
                response = await doRequest(token);
            }

            return response;
        }
    };

    // ============================================================
    //  TRANSMISION DSNUBE (ahora es la ÚLTIMA y muestra el resumen)
    // ============================================================
    async function CrearRemesaDsNube(remesaId) {
        $('#loading-overlay-dsnube').css('display', 'flex'); // si tienes overlay para esto

        const payload = { remesa: remesaId };

        try {
            // const response = await fetch(window.URL_DSNUBE + 'transmitir-remesa', {
            const response = await DsnubeApi.fetch('transmitir-remesa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': 'nexos_dsnube_2026*',
                },
                body: JSON.stringify(payload),
            });

            const resultado = await response.json();

            if (!resultado.success) {
                window.mensajesTransmision.push(`
                ❌ Error al transmitir a DsNube:<br>
                ${resultado.message ?? ''}<br>
                <small>${resultado.error ?? ''}</small>
            `);
            } else {
                window.mensajesTransmision.push(`✅ Remesa transmitida correctamente a DsNube.`);
            }

        } catch (error) {
            window.mensajesTransmision.push(`❌ Error inesperado conectando a DsNube: ${error}`);
        } finally {
            $('#loading-overlay-dsnube').css('display', 'none');

            // 🎉 RESUMEN FINAL — ahora vive aquí
            Swal.fire({
                title: '📘 Resumen General de Procesos',
                html: window.mensajesTransmision.join('<br><hr>'),
                icon: 'info',
                width: '50%',
                confirmButtonText: 'Entendido',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        }
    }

    // Función para subir archivo (promesa)
    async function Subir_Archivo_Remesa(num_orden, id_remitente, id_destinatario) {
        try {
            const consulta = await fetch($('#base_url').val() + 'transporte/Consulta_IDR', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `idorden=${num_orden}&remit=${id_remitente}&dest=${id_destinatario}`,
            });
            const data = await consulta.json();
            if (!data || !data.id_remesa) return false;

            const idremesa = data.id_remesa;
            const archivoData = new FormData();
            const archivos = document.getElementById('archivo_adjunto').files;

            for (let x = 0; x < archivos.length; x++) {
                archivoData.append(`archivo_adjunto${x}`, archivos[x]);
            }
            archivoData.append('numero_remesa', idremesa);

            const subir = await fetch($('#base_url').val() + 'transporte/Subir_Archivo', {
                method: 'POST',
                body: archivoData,
                cache: 'no-cache',
            });
            const res = await subir.json();
            return res === 'true';
        } catch (error) {
            console.error('Error al subir archivo:', error);
            return false;
        }
    }

    function ConsultaRemesa_e(idremesa, idorden) {
        $('.btn2').hide();
        $('.btn1').show();
        $('.campov').val('');
        $('#tabla_datos').css('display', 'none');
        $('#contenedor_datos').css('display', '');
        //traer datos de la remesa
        $.post(
            $('#base_url').val() + 'transporte/Consulta_Dato_Remesa',
            'rem=' + idremesa + '&ord=' + idorden,
            function (data) {
                if (data) {
                    var seguro, contado, contra, nat;
                    if (data['aplica_seguro'] == 1) {
                        seguro = '<option value="1">Si</option>' + '<option value="0">No</option>';
                    }
                    if (data['aplica_seguro'] == 0) {
                        seguro = '<option value="0">No</option>' + '<option value="1">Si</option>';
                    }
                    if (data['remesa_contado'] == 1) {
                        contado = '<option value="1">Si</option>' + '<option value="0">No</option>';
                    }
                    if (data['remesa_contado'] == 0) {
                        contado = '<option value="0">No</option>' + '<option value="1">Si</option>';
                    }
                    if (data['remesa_contraentrega'] == 1) {
                        contra = '<option value="1">Si</option>' + '<option value="0">No</option>';
                    }
                    if (data['remesa_contraentrega'] == 0) {
                        contra = '<option value="0">No</option>' + '<option value="1">Si</option>';
                    }

                    if (data['naturaleza'] == 1) {
                        nat = 'Carga normal';
                    }
                    if (data['naturaleza'] == 2) {
                        nat = 'Carga peligrosa';
                    }
                    if (data['naturaleza'] == 3) {
                        nat = 'Carga extradimensionada';
                    }
                    if (data['naturaleza'] == 4) {
                        nat = 'Carga extrapesada';
                    }
                    if (data['naturaleza'] == 5) {
                        nat = 'Residuos Peligrosos';
                    }
                    if (data['naturaleza'] == 6) {
                        nat = 'Semovientes';
                    }
                    if (data['naturaleza'] == 7) {
                        nat = 'Refrigerada';
                    }

                    $('#c_remesa').val(data['id_remesa']);
                    $('#c_orden').val(data['id_orden_cargue']);
                    $('#c_fecha').val(data['fecha_creacion']);
                    $('#c_oficina').val(data['agencia']);
                    $('#c_placa').val(data['placa']);
                    $('#c_nombre').val(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
                    $('#c_numero').val(data['numero_documento']);
                    $('#c_remitente').val(data['remnombre']);
                    $('#c_remciudad').val(data['remcity']);
                    $('#c_remdireccion').val(data['remdireccion']);
                    $('#c_destinatario').val(data['desnombre']);
                    $('#c_desciudad').val(data['descity']);
                    $('#c_desdireccion').val(data['desdireccion']);
                    $('#c_flete').val(data['valor_declarado']);
                    $('#c_producto').val(data['tipo_mercancia']);
                    $('#c_natu').val(nat);
                    $('#c_seguro').html(seguro);
                    $('#c_remesac').html(contado);
                    $('#c_remcontra').html(contra);
                    $('#c_descripcion').val(data['descripcion_novedad']);
                    //
                    $('#c_seguro').attr('readonly', false);
                    $('#c_remesac').attr('readonly', false);
                    $('#c_remcontra').attr('readonly', false);
                }
            },
            'json'
        );
    }

    function ConsultaRemesa(idremesa, idorden) {
        $('#panel_oet').html('');
        $('.btn2').show();
        $('.btn1').hide();
        $('.campov').val('');
        // $('#tabla_datos').css('display', 'none');
        $('#contenedor_datos').css('display', '');
        //traer datos de la remesa
        $.post(
            $('#base_url').val() + 'transporte/Consulta_Dato_Remesa',
            'rem=' + idremesa + '&ord=' + idorden,
            function (data) {
                if (data) {
                    var seguro, contra, contado, nat;
                    if (data['aplica_seguro'] == 1) {
                        seguro = '<option value="1">Si</option>' + '<option value="0">No</option>';
                    }
                    if (data['aplica_seguro'] == 0) {
                        seguro = '<option value="0">No</option>' + '<option value="1">Si</option>';
                    }
                    if (data['remesa_contado'] == 1) {
                        contado = '<option value="1">Si</option>' + '<option value="0">No</option>';
                    }
                    if (data['remesa_contado'] == 0) {
                        contado = '<option value="0">No</option>' + '<option value="1">Si</option>';
                    }
                    if (data['remesa_contraentrega'] == 1) {
                        contra = '<option value="1">Si</option>' + '<option value="0">No</option>';
                    }
                    if (data['remesa_contraentrega'] == 0) {
                        contra = '<option value="0">No</option>' + '<option value="1">Si</option>';
                    }

                    if (data['naturaleza'] == 1) {
                        nat = 'Carga normal';
                    }
                    if (data['naturaleza'] == 2) {
                        nat = 'Carga peligrosa';
                    }
                    if (data['naturaleza'] == 3) {
                        nat = 'Carga extradimensionada';
                    }
                    if (data['naturaleza'] == 4) {
                        nat = 'Carga extrapesada';
                    }
                    if (data['naturaleza'] == 5) {
                        nat = 'Residuos Peligrosos';
                    }
                    if (data['naturaleza'] == 6) {
                        nat = 'Semovientes';
                    }
                    if (data['naturaleza'] == 7) {
                        nat = 'Refrigerada';
                    }

                    $('#c_remesa').val(data['id_remesa']);
                    $('#c_orden').val(data['id_orden_cargue']);
                    $('#c_fecha').val(data['fecha_creacion']);
                    $('#c_oficina').val(data['agencia']);
                    $('#c_placa').val(data['placa']);
                    $('#c_nombre').val(data['nombre'] + ' ' + data['apellido1'] + ' ' + data['apellido2']);
                    $('#c_numero').val(data['numero_documento']);
                    $('#c_remitente').val(data['remnombre']);
                    $('#c_remciudad').val(data['remcity']);
                    $('#c_remdireccion').val(data['remdireccion']);
                    $('#c_destinatario').val(data['desnombre']);
                    $('#c_desciudad').val(data['descity']);
                    $('#c_desdireccion').val(data['desdireccion']);
                    $('#c_flete').val(data['valor_declarado']);
                    $('#c_producto').val(data['tipo_mercancia']);
                    $('#c_natu').val(nat);
                    $('#c_seguro').html(seguro);
                    $('#c_remesac').html(contado);
                    $('#c_remcontra').html(contra);
                    $('#c_descripcion').val(data['descripcion_novedad']);
                    $('#id_servicio').val(data['id']);
                    if (data['nombre_archivo'] != '' && data['nombre_archivo'] != '') {
                        var docu =
                            '<a  href="' +
                            $('#base_url').val() +
                            data['soporte_novedad'] +
                            '/' +
                            data['nombre_archivo'] +
                            '"  target="_blank" class="cell-detail hint--top-left" data-hint="">' +
                            '<span class="icon mdi mdi-file-text data-toggle="modal" title="Documento" >' +
                            '</span>' +
                            '</a>';
                        $('#documento').html(docu);
                    } else {
                        $('#documento').html('<p>No existe un archivo en la ubicación</p>');
                    }
                    /*$("#c_seguro").attr('readonly', true);
            $("#c_remesac").attr('readonly', true);
            $("#c_remcontra").attr('readonly', true);*/
                    Consulta_Remesa_oet(data['id_remesa']);
                }
            },
            'json'
        );
    }

    function AnularRemesa(idremesa) {
        // Validar anulación de remesa
        $.post(
            $('#base_url').val() + 'transporte/ValidarRemesa',
            'id_remesa=' + idremesa,
            function (datu) {
                if (datu) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Remesa con Manifiesto Activo',
                        text: 'Esta remesa tiene un manifiesto activo y no puede ser anulada.',
                        confirmButtonColor: '#d33',
                    });
                } else {
                    // Confirmar anulación con el usuario
                    Swal.fire({
                        title: '¿Está seguro?',
                        text: `¿Desea anular la remesa N° ${idremesa}?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, anular',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#6c757d',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Anule_Remesa(idremesa);
                        }
                    });
                }
            },
            'json'
        );
    }

    function Anule_Remesa(numremesa) {
        $.post(
            $('#base_url').val() + 'transporte/AnularRemesa',
            'id_remesa=' + numremesa,
            function (datu) {
                if (datu == 'true') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Remesa anulada',
                        text: 'La remesa fue anulada exitosamente.',
                        confirmButtonColor: '#3085d6',
                    }).then(() => {
                        TablaRemesa(); // Recargar tabla
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo anular la remesa. Intente nuevamente.',
                    });
                }
            },
            'json'
        );
    }

    function Actualizar_Remesa() {
        var id = $('#c_remesa').val();
        var seguro = $('#c_seguro').val();
        var contado = $('#c_remesac').val();
        var contraentrega = $('#c_remcontra').val();

        var dato = 'id_remesa=' + id + '&seguro=' + seguro + '&contado=' + contado + '&contra=' + contraentrega;
        $.post(
            $('#base_url').val() + 'transporte/ActualizaRemesa',
            dato,
            function (datu) {
                if (datu == 'true') {
                    alert('Remesa Actualizada Exitosamente!!');
                    TablaRemesa();
                }
            },
            'json'
        );
    }

    async function TablaRemesa() {
        // Ocultar contenedor de datos y limpiar
        $('#contenedor_datos').css('display', 'none');
        $('#tabla_datos').css('display', '');
        $('#tabla_cremitente').html('');

        // Mostrar loader
        $('#remload').html(`
            <div class="text-center py-3">
            <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2 text-muted">Consultando Remesas...</p>
            </div>
        `);

        // Variables de filtro
        const filtrarpor = $('#filtro_remesas').val();
        let ini = '',
            fin = '',
            cliente = '';
        if (filtrarpor == 1) {
            ini = $('#finicial').val();
            fin = $('#ffinal').val();
        } else if (filtrarpor == 2) {
            cliente = $('#clientefiltro').val();
        } else if (filtrarpor == 3) {
            ini = $('#finicial').val();
            fin = $('#ffinal').val();
            cliente = $('#clientefiltro').val();
        }

        try {
            const url = `${$('#base_url').val()}transporte/Consulta_Remesas_TB`;
            const params = new URLSearchParams({
                finicia: ini,
                ffinal: fin,
                cliente: cliente,
                filtro: filtrarpor,
            });

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params,
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();

            // Actualizar badge de contador
            $('.contador').html(data.total_remesas ?? 0);
            $('#remesabody').html('');

            if (data.remesas && data.remesas.length > 0) {
                data.remesas.forEach((remesa) => {
                    let status = '',
                        btnanular = '',
                        btneditar = '',
                        btnconsultar = '',
                        btnpdf = '';

                    if (remesa.estado == 1) {
                        status = `<td class="nexos-txt-success"><center><span class="fas fa-circle text-success" title="Activo"></span></center></td>`;
                        btnanular = `<button class="btn btn-danger btn-sm me-1 px-1 py-1" title="Anular remesa" onClick="AnularRemesa(${remesa.id_remesa})"><i class="fa-solid fa-ban"></i></button>`;
                        btneditar = `<button class="btn btn-warning btn-sm me-1 px-1 py-1" title="Editar remesa" onClick="ConsultaRemesa_e(${remesa.id_remesa},${remesa.id_orden_cargue})"><i class="fa-solid fa-pencil"></i></button>`;
                        btnconsultar = `<button class="btn btn-info btn-sm me-1 px-1 py-1" title="Ver remesa" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDetalleRemesa" aria-controls="offcanvasDetalleRemesa" onClick="ConsultaRemesa(${remesa.id_remesa},${remesa.id_orden_cargue})"><i class="fa-regular fa-eye"></i></button>`;
                        btnpdf = `<button class="btn btn-success btn-sm me-1 px-1 py-1" title="Imprimir Remesa" onClick="ImprimirPdf(${remesa.id_remesa},${remesa.id_orden_cargue})"><i class="fa-solid fa-file-pdf"></i></button>`;
                    } else {
                        status = `<td class="nexos-txt-danger"><center><span class="fas fa-circle text-danger" title="Inactivo"></span></center></td>`;
                    }

                    $('#remesabody').append(`
          <tr>
            ${status}
            <td style='width:auto; white-space: nowrap;'>${remesa.id_remesa} / ${remesa.id_orden_cargue}</td>
            <td style='width:auto; white-space: nowrap;'>${remesa.placa}</td>
            <td style='width:auto; white-space: nowrap;'>${remesa.nombre} ${remesa.apellido1} ${remesa.apellido2}</td>
            <!--<td class="cell-detail"><span>${remesa.descripcion_novedad ?? ''}</span></td>-->
            <td style='width:auto; white-space: nowrap;'>${remesa.fecha_creacion} - ${remesa.hora_creacion}</td>
            <td style='width:auto; white-space: nowrap;'>
              <div class="btn-group btn-group-sm" role="group" aria-label="Acciones">
              ${btnconsultar}
                ${btnanular}
                ${btneditar}
                ${btnpdf}
              </div>
            </td>
          </tr>
        `);
                });
            } else {
                $('#remesabody').html(`
        <tr>
          <td colspan="6" class="text-center text-muted">No hay remesas disponibles para mostrar.</td>
        </tr>
      `);
            }
        } catch (error) {
            console.error('Error al consultar remesas:', error);
            $('#remesabody').html(`
      <tr>
        <td colspan="6" class="text-center text-danger">Error al cargar las remesas.</td>
      </tr>
    `);
        } finally {
            // Ocultar loader
            $('#remload').html('');
        }
    }

    function ImprimirPdf(id, or) {
        var url = $('#base_url').val() + 'libs/remesa_pdf.php?' + 'remesa=' + codificarBase64(id) + '&orden=' + codificarBase64(or);
        window.open(url, '_blank');
    }

    function ConsultaCliente() {
        $.post(
            $('#base_url').val() + 'transporte/ConsultaClienter',
            function (data) {
                $('#clientefiltro').html('<option value="">Seleccionar</option>');
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        $('#clientefiltro').append('<option value="' + data[i]['id'] + '">' + data[i]['nombre'] + '</option>');
                    }
                } else {
                    $('#clientefiltro').html('<option value="">Seleccionar</option>');
                }
            },
            'json'
        );
    }

    function Consulta_Remesa_oet(idremesa) {
        $('#panel_oet').html('NO HAY ENDPOINT PARA REALIZAR CONSULTA DE REMESA');
    }

    function codificarBase64(texto) {
        return btoa(texto);
    }

    // Función para decodificar Base64
    function decodificarBase64(textoCodificado) {
        return atob(textoCodificado);
    }

    function AplicaFoco(idelemento) {
        $(idelemento).focus().css('background-color', 'rgb(254,242,181)');
    }

    function RemueveFoco(idelemento) {
        $(idelemento).blur().css('background-color', 'white');
    }
})();