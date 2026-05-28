window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global
    document.getElementById(`campo-${window.VENTANA}-filtro`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-buscar`).style.display = 'none';

    Listar_clientes();
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

    // Validar los filtroe que se van a mostrar en la plataforma
    document.addEventListener('change', async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-filtros`) || e.target.matches(`#campo-${window.VENTANA}-filtros *`)) {
            let filtro = e.target.value;
            if (filtro === 'Documento') {
                document.getElementById(`campo-${window.VENTANA}-filtro`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-buscar`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-filtro`).value = '';
            } else if (filtro === 'Nombre') {
                document.getElementById(`campo-${window.VENTANA}-filtro`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-buscar`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-filtro`).value = '';
            } else if (filtro === 'Todos') {
                document.getElementById(`campo-${window.VENTANA}-filtro`).style.display = 'none';
                document.getElementById(`campo-${window.VENTANA}-buscar`).style.display = '';
            }
        }
    });

    document.addEventListener('click', async e => {
        if (e.target.matches(`#campo-${window.VENTANA}-buscar`) || e.target.matches(`#campo-${window.VENTANA}-buscar *`)) {
            let buscar = document.getElementById(`campo-${window.VENTANA}-filtro`).value.trim();
            let filtro = document.getElementById(`campo-${window.VENTANA}-filtros`).value;
            let formdata = new FormData();
            formdata.append('buscar', buscar);
            formdata.append('filtro', filtro);
            const loader = document.querySelector('.img_load');
            if (loader) loader.style.display = 'table-row';
            Listar_clientes(formdata);
            // try {
            //     const response = await fetch($('#base_url').val() + 'seguridad_prefiltro/listar_clientes_bloqueo', {
            //         method: 'POST',
            //         body: formdata,
            //         cache: 'no-cache',
            //     });
            //     const data = await response.json();
            //     // let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value;
            //     if (data) {
            //         Listar_clientes(/* filtro, */ data);
            //     }

            // } catch (error) {
            //     console.error('Error en la primera solicitud:', error);
            //     console.log('error no inserta');
            //     throw error;
            // } finally {
            //     if (loader) loader.style.display = 'none';
            // }

        }

        if (e.target.matches(`#btn-accion-cliente`) || e.target.matches(`#btn-accion-cliente *`)) {
            let Boton = e.target.closest(`#btn-accion-cliente`);
            let ClienteId = Boton.getAttribute('data-ClienteId');
            let Documento = Boton.getAttribute('data-Documento');
            let Sigla = Boton.getAttribute('data-Sigla');
            let Nombre = Boton.getAttribute('data-Nombre');
            let Estado = Boton.getAttribute('data-Estado');
            let ActvidadCliente = Boton.getAttribute('data-ActvidadCliente');
            let Telefono = Boton.getAttribute('data-Telefono');
            let Direccion = Boton.getAttribute('data-Direccion');
            let EstadoCliente = Boton.getAttribute('data-EstadoCliente');
            let CapacidadEndeudamiento = Boton.getAttribute('data-capacidad_endeudamiento');
            let SaldoInicial = Boton.getAttribute('data-Saldo_Inicial');
            let SaldoCartera = Boton.getAttribute('data-Saldo_Cartera');

            myOffcanvas.updateTitle(`<span class="text-primary-emphasis uil uil-file-alt"></span> Inhabilitar Clientes`);
            myOffcanvas.updateContent(`<h3 class="card-title mb-4">Datos del Cliente</h3>
            <div class="container-fluid">
                <div class="row mb-2">
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">NIT O C.C:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Documento}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Nombre o Razón Social:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Nombre}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Abreviatura:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Sigla}</span>
                        </p>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Actividad:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${ActvidadCliente}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Direccion:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Direccion}</span>
                        </p>
                    </div>
                    <div class="col-12 col-md-4">
                        <p class="mb-0">
                            <span class="text-body fw-semibold">Telefono:</span>
                            <span class="text-body-emphasis ms-1" style='font-size:13px;'>${Telefono}</span>
                        </p>
                    </div>
                </div>

                <div class="border-top border-translucent border-dashed pt-2"> 
                    <div class="row">
                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                            <label style="font-size: 12px;">Cupo Facturaci&oacute;n</label>
                            <input class="form-control form-control-sm" id="cupo_facturacion" type="text" onchange="currencyMask2(this)" value="${CapacidadEndeudamiento}">
                        </div>

                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                            <label style="font-size: 12px;">Saldo Inicial</label>
                            <input class="form-control form-control-sm" id="saldo_inicial" type="text" onchange="currencyMask2(this); copiarSaldoACartera();" value="${SaldoInicial}">
                        </div>

                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                            <label style="font-size: 12px;">Saldo Cartera</label>
                            <input class="form-control form-control-sm" id="saldo_cartera" type="text" onchange="currencyMask2(this)" disabled value="${SaldoCartera}">
                        </div>

                        <div class="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                            <label for="cod_tipinhID" class="form-label fw-semibold">Dias Vencimiento:</label>
                            <select class="form-select form-select-sm" aria-label=".form-select-sm example" id='Dias_Vencimiento'>
                                <option selected="">--Seleccione dias--</option>
                                <option value="0">0 Dias</option>
                                <option value="30">30 Dias</option>
                                <option value="45">45 Dias</option>
                                <option value="60">60 Dias</option>
                                <option value="120">120 Dias</option>
                                <option value="180">180 Dias</option>
                            </select>
                        </div>
                        <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-3">
                            <label for="cod_tipinhID" class="form-label fw-semibold">Observaciones:</label>
                            <textarea name="observacion" id="observacion" rows="1" class="form-control form-control-sm" oninput="this.value = this.value.toUpperCase();"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <div class="border-top border-translucent border-dashed pt-2">
                <div class="row justify-content-end">
                    <div class="col-auto">
                    <button class="btn btn-success btn-sm py-1" id="btn_inhabilitar_cliente" type="button" data-RecursoId='${ClienteId}' data-Documento='${Documento}' data-Nombre='${Nombre}' data-EstadoCliente='${EstadoCliente}' data-Objeto='vehiculo'> 
                        <span class="uil uil-play-circle"></span> Aceptar
                    </button>
                    </div>
                </div>
            </div>
            
            `);
            myOffcanvas.show();

            const saldoInicialInput = document.getElementById('saldo_inicial');
            const saldoCarteraInput = document.getElementById('saldo_cartera');

            if (saldoInicialInput && saldoCarteraInput) {

                // 🛑 Usamos el evento 'input' para copiar con cada pulsación de tecla.
                saldoInicialInput.addEventListener('input', copiarSaldoACartera);

                // Mantenemos el evento 'change' (o lo reasignamos) si tu función 
                // currencyMask2() aplica el formato final solo al salir del campo.
                // Si currencyMask2() formatea al salir, la función copiarSaldoACartera() 
                // ya usa el valor formateado final.
                saldoInicialInput.addEventListener('change', copiarSaldoACartera);
            }

            /**
             * Función que copia el valor (incluyendo el formato de moneda aplicado por onchange)
             * de Saldo Inicial al campo Saldo Cartera.
             */
            function copiarSaldoACartera() {
                const saldoInicial = document.getElementById('saldo_inicial').value;
                const saldoCartera = document.getElementById('saldo_cartera');

                // 🛑 COPIA DIRECTA DEL VALOR FORMATEADO O EN PROCESO DE FORMATEO
                saldoCartera.value = saldoInicial;
            }
        }

        if (e.target.matches(`#btn_inhabilitar_cliente`) || e.target.matches(`#btn_inhabilitar_cliente *`)) {
            let BotonInhabilitar = e.target.closest(`#btn_inhabilitar_cliente`);
            let ClienteId = BotonInhabilitar.getAttribute('data-RecursoId');
            let Documento = BotonInhabilitar.getAttribute('data-Documento');
            let Nombre = BotonInhabilitar.getAttribute('data-Nombre');
            let EstadoCliente = BotonInhabilitar.getAttribute('data-EstadoCliente');
            let cupo_facturacion = document.getElementById('cupo_facturacion').value;
            let saldo_inicial = document.getElementById('saldo_inicial').value;
            let saldo_cartera = document.getElementById('saldo_cartera').value;
            let DiasVencimiento = document.getElementById('Dias_Vencimiento').value;
            let Observacion = document.getElementById('observacion').value;

            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea Actualizar el Cliente? ' + Nombre,
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

                try {
                    let formdata = new FormData();
                    formdata.append('ClienteId', ClienteId);
                    formdata.append('EstadoCliente', EstadoCliente);
                    formdata.append('cupo_facturacion', cupo_facturacion);
                    formdata.append('saldo_inicial', saldo_inicial);
                    formdata.append('saldo_cartera', saldo_cartera);
                    formdata.append('DiasVencimiento', DiasVencimiento);
                    formdata.append('Observacion', Observacion);

                    const response = await fetch($('#base_url').val() + 'seguridad_prefiltro/Inhabilitar_cliente', {
                        method: 'POST',
                        body: formdata,
                        cache: 'no-cache',
                    });
                    const data = await response.json();

                    if (data && Array.isArray(data)) {
                        const resultado = data[0]; // Asumimos un solo elemento en el array de respuesta
                        if (resultado.status === true) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Éxito',
                                text: resultado.message,
                                timer: 2500,
                                showConfirmButton: false
                            });
                            myOffcanvas.hide();
                            Listar_clientes();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: resultado.message || 'Ocurrió un error inesperado',
                                timer: 3000,
                                showConfirmButton: false
                            });
                        }
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Respuesta inválida',
                            text: 'El servidor no devolvió un formato esperado',
                        });
                    }
                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'No se pudo conectar al servidor',
                    });
                }
            }
        }
    });


    // JS - Listener para manejar el cambio en el switch (MODIFICADO)
    document.addEventListener('change', async (e) => {
        // Verificamos que el cambio sea en nuestro switch
        if (e.target.matches('.switch-estado-cliente')) {
            const switchElement = e.target;
            const estadoActual = switchElement.checked ? 'Activo' : 'Inactivo'; // Estado AL QUE SE VA
            const estadoAnterior = switchElement.checked ? 'Inactivo' : 'Activo'; // Estado DEL QUE VIENE

            // El cambio visual ya ocurrió al hacer clic, pero lo revertiremos si el usuario CANCELA
            // Por ahora, guardamos el estado deseado.

            const documento = switchElement.getAttribute('data-documento');
            const clienteId = switchElement.getAttribute('data-clienteid');

            // 🚨 1. CONFIRMACIÓN CON SWEETALERT
            const result = await Swal.fire({
                title: `¿Confirmar cambio a ${estadoActual}?`,
                text: `¿Desea cambiar el estado del cliente ${documento} de ${estadoAnterior} a ${estadoActual}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: estadoActual === 'Activo' ? '#198754' : '#dc3545', // Verde o Rojo
                cancelButtonColor: '#6c757d',
                confirmButtonText: `Sí, cambiar a ${estadoActual}`,
                cancelButtonText: 'No, cancelar'
            });

            // 2. LÓGICA TRAS LA CONFIRMACIÓN
            if (result.isConfirmed) {

                // Si confirma, la lógica de fetch y revertir en caso de fallo es la misma.
                try {
                    const formData = new FormData();
                    formData.append('documento', documento);
                    formData.append('cliente_id', clienteId);
                    formData.append('nuevo_estado', estadoActual); // Usamos el estado confirmado

                    const response = await fetch($('#base_url').val() + 'seguridad_prefiltro/actualizarEstadoCliente', {
                        method: 'POST',
                        body: formData
                    });

                    const resultFetch = await response.json();

                    if (resultFetch.status === false) {
                        // Si el servidor falla: Revertir switch y color

                        // 🚨 Revertimos el checked del switch a su estado anterior
                        switchElement.checked = !switchElement.checked;
                        // Lógica de reversión visual
                        switchElement.classList.toggle('bg-success');
                        switchElement.classList.toggle('bg-danger');

                        Swal.fire('Error', resultFetch.message || `Fallo la actualización de estado a ${estadoActual}.`, 'error');
                    } else {
                        // Éxito: Ya se actualizó visualmente al inicio, solo se confirma.
                        Swal.fire('Éxito', `Estado actualizado a ${estadoActual} correctamente.`, 'success');
                        Listar_clientes();
                    }

                } catch (error) {
                    console.error('Fetch error:', error);

                    // Si falla la conexión: Revertir switch y color
                    switchElement.checked = !switchElement.checked;
                    switchElement.classList.toggle('bg-success');
                    switchElement.classList.toggle('bg-danger');

                    Swal.fire('Error', 'Error de conexión con el servidor.', 'error');
                }

            } else {
                // 3. Si el usuario CANCELA: Revertir switch y color al estado anterior

                // 🚨 Revertimos el checked del switch a su estado ANTERIOR
                switchElement.checked = !switchElement.checked;

                // Revertimos la clase visual que se aplicó al hacer clic
                switchElement.classList.toggle('bg-success');
                switchElement.classList.toggle('bg-danger');

                Swal.fire('Cancelado', `El estado se mantiene como ${estadoAnterior}.`, 'info');
            }
        }
    });
}

async function Listar_clientes(formdata) {
    try {
        const response = await fetch($('#base_url').val() + 'seguridad_prefiltro/listar_clientes_bloqueo', {
            method: 'POST',
            body: formdata,
            cache: 'no-cache',
        });
        const data = await response.json();
        // let filtro = document.getElementById(`campo-${window.VENTANA}-filtro`).value;
        if (data) {
            // Listar_clientes(/* filtro, */ data);
            let tbody = document.getElementById('tbody_clientes');
            tbody.innerHTML = '';
            let col_estatus_trazabilidad = "";
            data.forEach(element => {
                const fila = document.createElement('tr');
                // const tipo_Proveedor = document.getElementById(`campo-${window.VENTANA}-proveedores`).value;

                const estado = obtenerEstadoTrazabilidad(element.Estado);
                // console.log("🚀 ~ Listar_clientes ~ element.Estado:", element.Estado)
                col_estatus_trazabilidad = createBadge(estado.texto, estado.color);

                const columnaDocumentoCliente = document.createElement('td');
                columnaDocumentoCliente.innerHTML = `<a class='text-decoration-none' href='#' id='btn-accion-cliente' data-Documento='${element.documento}' data-ClienteId='${element.cliente_id}' data-Sigla='${element.sigla}'
                    data-Nombre='${element.nombre}' data-Estado='${element.Estado}' data-ActvidadCliente='${element.actividad_cliente}' data-Telefono='${element.telefono}' data-Direccion='${element.direccion}'
                    data-EstadoCliente='${element.Estado}' data-EstadoCliente='${element.Estado}' data-capacidad_endeudamiento="${element.capacidad_endeudamiento ? formatCOP(parseFloat(element.capacidad_endeudamiento)) : '$0.00'}"
                    data-Saldo_Inicial="${element.saldo_inicial ? formatCOP(parseFloat(element.saldo_inicial)) : '$0.00'}" data-Saldo_Cartera="${element.saldo_cartera ? formatCOP(parseFloat(element.saldo_cartera)) : '$0.00'}">
                    ${element.documento}
                </a>`;
                columnaDocumentoCliente.style.width = 'auto';
                columnaDocumentoCliente.style.whiteSpace = 'nowrap';
                columnaDocumentoCliente.style.textAlign = 'center';

                const columnaNombreCliente = document.createElement('td');
                columnaNombreCliente.innerHTML = element.nombre;
                columnaNombreCliente.style.width = 'auto';
                columnaNombreCliente.style.whiteSpace = 'nowrap';
                columnaNombreCliente.style.textAlign = 'center';

                const columnaCreditoCliente = document.createElement('td');
                columnaCreditoCliente.innerHTML = element.capacidad_endeudamiento ? formatCOP(parseFloat(element.capacidad_endeudamiento)) : '$0.00';
                columnaCreditoCliente.style.width = 'auto';
                columnaCreditoCliente.style.whiteSpace = 'nowrap';
                columnaCreditoCliente.style.textAlign = 'center';

                const columnaSaldoInicialCliente = document.createElement('td');
                columnaSaldoInicialCliente.innerHTML = element.saldo_inicial ? formatCOP(parseFloat(element.saldo_inicial)) : '$0.00';
                columnaSaldoInicialCliente.style.width = 'auto';
                columnaSaldoInicialCliente.style.whiteSpace = 'nowrap';
                columnaSaldoInicialCliente.style.textAlign = 'center';

                const columnaCarteraCliente = document.createElement('td');
                columnaCarteraCliente.innerHTML = element.saldo_cartera ? formatCOP(parseFloat(element.saldo_cartera)) : '$0.00';
                columnaCarteraCliente.style.width = 'auto';
                columnaCarteraCliente.style.whiteSpace = 'nowrap';
                columnaCarteraCliente.style.textAlign = 'center';

                const columnaPlazoFacturacionCliente = document.createElement('td');
                columnaPlazoFacturacionCliente.innerHTML = element.plazo_facturacion ? element.plazo_facturacion + ' Dias' : '0 Dias';
                columnaPlazoFacturacionCliente.style.width = 'auto';
                columnaPlazoFacturacionCliente.style.whiteSpace = 'nowrap';
                columnaPlazoFacturacionCliente.style.textAlign = 'center';

                // columnaActividadCliente.innerHTML = element.actividad_cliente;

                const columnaActividadCliente = document.createElement('td');
                // columnaActividadCliente.innerHTML = `
                // <div class="form-check form-switch">
                //     <input class="form-check-input" id="flexSwitchCheckAccion" data-Documento='${element.documento}' data-ClienteId='${element.cliente_id}' type="checkbox"/>
                // </div>`;

                // JS - (Dentro de tu bucle forEach que crea las filas)
                const estadoActivo = (element.Estado === 'Activo');
                const colorClase = estadoActivo ? 'bg-success' : 'bg-danger';
                // const Disabled = estadoActivo ? true : false;

                columnaActividadCliente.innerHTML = `
                <div class="form-check form-switch d-flex justify-content-center">
                    <input class="form-check-input switch-estado-cliente ${colorClase}"
                        id="flexSwitchCheckAccion_${element.documento}" 
                        data-documento='${element.documento}' 
                        data-clienteid='${element.cliente_id}' 
                        type="checkbox"
                        ${estadoActivo ? 'checked' : ''} />
                </div>`;
                // Se añade una clase para el listener: 'switch-estado-cliente'

                columnaActividadCliente.style.width = 'auto';
                columnaActividadCliente.style.whiteSpace = 'nowrap';
                columnaActividadCliente.style.textAlign = 'center';
                columnaActividadCliente.style.padding = '0px';

                const columnaEstadoCliente = document.createElement('td');
                columnaEstadoCliente.innerHTML = col_estatus_trazabilidad;
                columnaEstadoCliente.style.width = 'auto';
                columnaEstadoCliente.style.whiteSpace = 'nowrap';
                columnaEstadoCliente.style.textAlign = 'center';

                fila.appendChild(columnaDocumentoCliente);
                fila.appendChild(columnaNombreCliente);
                fila.appendChild(columnaEstadoCliente);
                fila.appendChild(columnaCreditoCliente);
                fila.appendChild(columnaSaldoInicialCliente);
                fila.appendChild(columnaCarteraCliente);
                fila.appendChild(columnaPlazoFacturacionCliente);
                fila.appendChild(columnaActividadCliente);
                tbody.appendChild(fila);
            });
        }

    } catch (error) {
        console.error('Error en la primera solicitud:', error);
        console.log('error no inserta');
        throw error;
    } finally {
        // if (loader) loader.style.display = 'none';
    }

}

window.formatCOP = (value) => {
    return value.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP'
    });
};

function limpiarNumero(valor) {
    return parseFloat(
        valor
            .replace(/\$/g, '')     // Eliminar símbolo $
            .replace(/\./g, '')     // Eliminar puntos de miles
            .replace(',', '.')      // Cambiar coma por punto decimal
    ) || 0;
}

function currencyMask2(ele) {
    let elemento = $(ele);
    let valor = elemento.val();

    // Quitar todo lo que no sea número
    valor = valor.replace(/[^\d]/g, "");

    if (valor === "") {
        elemento.val("");
        return;
    }

    // Convertir a número
    let numero = parseFloat(valor);

    // Formatear en pesos colombianos con dos decimales
    let formateado = numero.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2
    });

    elemento.val(formateado);
}