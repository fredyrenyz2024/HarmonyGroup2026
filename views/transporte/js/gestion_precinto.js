let precintosDisponibles = [];
let Ordenescargue = [];
let Agencia = '';
document.addEventListener('DOMContentLoaded', async e => {
    document.addEventListener("click", async e => {
        if (e.target.matches(`#filtrar`) || e.target.matches(`#filtrar *`)) {
            try {
                let formdata = new FormData();
                formdata.append('num_criterio', document.getElementById('num_criterio').value);
                const response = await fetch($('#id_url_ajax').val() + 'transporte/consultar_documento_manifiesto', {
                    method: 'POST',
                    body: formdata,
                    cache: 'no-cache',
                });
                const data = await response.json();
                if (data) {
                    Agencia = data.resultados[0]['Agencia'];
                    document.getElementById('tbl_datos').style.display = '';
                    let tbody = document.getElementById('tbody-documentos-precintos');
                    tbody.innerHTML = '';
                    data.resultados.forEach(element => {
                        Ordenescargue = element.Orden_Cargue;
                        const fila = document.createElement('tr');

                        const columnaManifiesto = document.createElement('td');
                        columnaManifiesto.innerHTML = element.Manifiesto || '-';
                        columnaManifiesto.style.textAlign = 'center';
                        columnaManifiesto.style.borderBottom = '1px solid black';
                        columnaManifiesto.style.width = 'width';
                        columnaManifiesto.style.whiteSpace = 'nowrap';
                        columnaManifiesto.style.paddingFeft = '5px';

                        const columnaRemesa = document.createElement('td');
                        columnaRemesa.innerHTML = element.Remesa || '-';
                        columnaRemesa.style.textAlign = 'center';
                        columnaRemesa.style.borderBottom = '1px solid black';
                        columnaRemesa.style.width = 'width';
                        columnaRemesa.style.whiteSpace = 'nowrap';
                        columnaRemesa.style.paddingFeft = '5px';

                        const columnaOrdenCargue = document.createElement('td');
                        columnaOrdenCargue.innerHTML = element.Orden_Cargue || '-';
                        columnaOrdenCargue.style.textAlign = 'center';
                        columnaOrdenCargue.style.borderBottom = '1px solid black';
                        columnaOrdenCargue.style.width = 'width';
                        columnaOrdenCargue.style.whiteSpace = 'nowrap';
                        columnaOrdenCargue.style.paddingFeft = '5px';

                        const columnaAgencia = document.createElement('td');
                        columnaAgencia.innerHTML = element.Agencia || '-';
                        columnaAgencia.style.textAlign = 'center';
                        columnaAgencia.style.borderBottom = '1px solid black';
                        columnaAgencia.style.width = 'width';
                        columnaAgencia.style.whiteSpace = 'nowrap';
                        columnaAgencia.style.paddingFeft = '5px';

                        fila.appendChild(columnaManifiesto);
                        fila.appendChild(columnaRemesa);
                        fila.appendChild(columnaOrdenCargue);
                        fila.appendChild(columnaAgencia);
                        tbody.appendChild(fila);
                    });

                    //Listar precintos asociados a la orden de cargue
                    document.getElementById('tbl_datos_precintos').style.display = '';
                    let tbody1 = document.getElementById('tbody-precintos-asociados');
                    tbody1.innerHTML = '';
                    data.resultadosPrecintos.forEach(element1 => {
                        const fila = document.createElement('tr');

                        const columnaPrecinto = document.createElement('td');
                        columnaPrecinto.innerHTML = element1.serie_precinto || '-';
                        columnaPrecinto.style.textAlign = 'center';
                        columnaPrecinto.style.borderBottom = '1px solid black';
                        columnaPrecinto.style.width = 'width';
                        columnaPrecinto.style.whiteSpace = 'nowrap';
                        columnaPrecinto.style.paddingFeft = '5px';

                        const columnaTipoPrecinto = document.createElement('td');
                        columnaTipoPrecinto.innerHTML = element1.tipo_precinto || '-';
                        columnaTipoPrecinto.style.textAlign = 'center';
                        columnaTipoPrecinto.style.borderBottom = '1px solid black';
                        columnaTipoPrecinto.style.width = 'width';
                        columnaTipoPrecinto.style.whiteSpace = 'nowrap';
                        columnaTipoPrecinto.style.paddingFeft = '5px';

                        const columnaFechaPrecinto = document.createElement('td');
                        columnaFechaPrecinto.innerHTML = element1.Fecha_asignacion || '-';
                        columnaFechaPrecinto.style.textAlign = 'center';
                        columnaFechaPrecinto.style.borderBottom = '1px solid black';
                        columnaFechaPrecinto.style.width = 'width';
                        columnaFechaPrecinto.style.whiteSpace = 'nowrap';
                        columnaFechaPrecinto.style.paddingFeft = '5px';

                        fila.appendChild(columnaPrecinto);
                        fila.appendChild(columnaTipoPrecinto);
                        fila.appendChild(columnaFechaPrecinto);
                        tbody1.appendChild(fila);
                    });
                }
            } catch (error) {
                console.error('Error en la primera solicitud:', error);
                throw error;
            } finally {
                $('#loading-overlay-nexosapp ').css('display', 'none'); // Ocultar mensaje de carga independientemente del resultado
                $('#tbl_datos').css('display', 'flex');
                $('#tabla_precintos tbody').html('');
                $.post(
                    $('#id_url_ajax').val() + 'transporte/Consultar_Precintos',
                    'Agencia=' + Agencia,
                    function (data) {
                        if (data) {
                            precintosDisponibles = data; // guardar para uso posterior
                            agregarFilaPrecinto(); // insertar la primera fila
                        }
                    },
                    'json',
                );
            }
        }

        if (e.target.matches(`#Registrar_precintos`) || e.target.matches(`#Registrar_precintos *`)) {
            const result = await Swal.fire({
                title: '¿Seguro?',
                text: '¿Desea Actualiar los precintos de esta orden de cargue? ' + Ordenescargue,
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
                //INSERTAR PRECINTOS
                var preci = {
                    tipoprecinto: [],
                    num_preci: [],
                };
                $('.ipretipo').each(function (index) {
                    preci.tipoprecinto[index] = $(this).val();
                });
                $('.iselectprecinto').each(function (index) {
                    preci.num_preci[index] = $(this).val();
                });

                try {
                    const formdata = new FormData();
                    formdata.append('precintos', JSON.stringify(preci));
                    formdata.append('Ordenescargue', Ordenescargue);

                    const response = await fetch($('#id_url_ajax').val() + 'transporte/insertar_precintos_documento', {
                        method: 'POST',
                        body: formdata,
                        cache: 'no-cache',
                    });

                    const data = await response.json();

                    if (data.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Precintos asignados',
                            text: data.message,
                            timer: 2500,
                            showConfirmButton: false,
                            customClass: {
                                popup: 'swal2-custom-font',
                            },
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: data.message || 'Ocurrió un error al asignar los precintos.',
                        });
                    }

                } catch (error) {
                    console.error('Error en la solicitud:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de red',
                        text: 'No se pudo conectar con el servidor.',
                    });
                } finally {
                    $('#loading-overlay-nexosapp').hide();
                    $('#tbl_datos').show();
                }
            }
        }
    });

    document.addEventListener('change', async function (e) {
        if (e.target && e.target.classList.contains('ipretipo')) {
            const Tipo_Precinto = e.target.value;
            const index = e.target.getAttribute('data-index'); // ✅ Correcto: obtiene el valor del atributo
            // console.log("🚀 ~ index:", index)
            // const index = e.target.dataset.index; // obtenemos el índice
            // console.log("🚀 ~ index:", index)
            // console.log("Valor cambiado dinámicamente:", e.target.value);
            try {
                const formdata = new FormData();
                // formdata.append('precintos', JSON.stringify(preci));
                formdata.append('Tipo_Precinto', Tipo_Precinto);
                formdata.append('Agencia', Agencia);

                const response = await fetch($('#id_url_ajax').val() + 'transporte/Listar_Precintos', {
                    method: 'POST',
                    body: formdata,
                    cache: 'no-cache',
                });

                const data = await response.json();

                const selectPrecinto = document.querySelector(`.iselectprecinto[data-index="${index}"]`);

                if (selectPrecinto) {
                    // Obtener todos los precintos ya seleccionados en otros selects
                    const precintosSeleccionados = Array.from(document.querySelectorAll('.iselectprecinto'))
                        .filter(sel => sel.dataset.index !== index) // excluir el select actual
                        .map(sel => sel.value)
                        .filter(val => val !== ''); // excluir vacíos

                    // Limpiar el select actual y agregar el placeholder
                    selectPrecinto.innerHTML = '<option value="">-- Seleccione un precinto --</option>';

                    // Agregar opciones excluyendo las ya seleccionadas
                    data.forEach(item => {
                        if (!precintosSeleccionados.includes(item.codigo_precinto)) {
                            const option = document.createElement('option');
                            option.value = item.codigo_precinto;
                            option.textContent = item.codigo_precinto;
                            selectPrecinto.appendChild(option);
                        }
                    });
                }


            } catch (error) {
                console.error('Error en la solicitud:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error de red',
                    text: 'No se pudo conectar con el servidor.',
                });
            } finally {
                $('#loading-overlay-nexosapp').hide();
                $('#tbl_datos').show();
            }
        }
    });
});

var conta = 0;
function agregarFilaPrecinto() {
    conta++;

    // Obtener precintos ya usados
    const seleccionados = $('.iselectprecinto')
        .map(function () {
            return $(this).val();
        })
        .get();

    // Filtrar disponibles
    const disponibles = precintosDisponibles.filter(p => !seleccionados.includes(p.codigo_precinto));

    if (disponibles.length === 0) {
        alert('Ya no hay más precintos disponibles.');
        return;
    }

    // Opciones de precintos (código)
    // let opcionesPrecinto = '<option value="">-- Seleccione un precinto --</option>';
    // for (const p of disponibles) {
    //     opcionesPrecinto += `<option value="${p.codigo_precinto}">${p.codigo_precinto}</option>`;
    // }

    // Obtener tipos únicos
    const tipos = [...new Set(precintosDisponibles.map(p => p.tipo_precinto))];

    // Opciones de tipos
    let opcionesTipo = '<option value="">-- Tipo --</option>';
    for (const t of tipos) {
        opcionesTipo += `<option value="${t}">${t}</option>`;
    }

    // Selects
    const selectPrecinto = `
        <select id="num_preci${conta}" data-index="${conta}" class="form-control input-xs iselectprecinto"></select>
    `;

    //     const selectPrecinto = `
    //     <select id="num_preci${conta}" class="form-control input-xs iselectprecinto">
    //       ${opcionesPrecinto}
    //     </select>
    //   `;

    const selectTipo = `
    <select id="tipopre${conta}" data-index="${conta}" class="form-control input-xs ipretipo">
      ${opcionesTipo}
    </select>
  `;

    const observar = `<textarea id="sellos${conta}" class="form-control input-xs ipreobs"></textarea>`;

    const eliminar = `
    <button class="btn btn-danger btn-sm ps${conta}" onclick="delete_precinto(${conta})">
      <i class="fa fa-trash"></i>
    </button>
  `;

    const fila = `
    <tr class="ps${conta}">
      <td><strong>${conta}</strong><input type="hidden" id="sk${conta}" value="1"></td>
      <td>${selectTipo}</td>
      <td>${selectPrecinto}</td>
      <td class="text-center">${eliminar}</td>
    </tr>
  `;

    $('#tabla_precintos tbody').append(fila);
}

function delete_precinto(id) {
    // Elimina la fila
    $('.ps' + id).remove();

    // Reiniciar contador y reasignar clases/IDs a todas las filas
    conta = 0;
    $('#tabla_precintos tbody tr').each(function () {
        conta++;

        // Reasignar clase principal
        $(this).attr('class', 'ps' + conta);

        // Reasignar cada elemento dentro de la fila
        $(this).find('td:eq(0)').html(`<strong>${conta}</strong><input type="hidden" id="sk${conta}" value="1">`);

        $(this).find('select.iselectprecinto').attr('id', 'num_preci' + conta);
        $(this).find('select.ipretipo').attr('id', 'tipopre' + conta);
        $(this).find('textarea.ipreobs').attr('id', 'sellos' + conta);
        $(this).find('button').attr('onclick', 'delete_precinto(' + conta + ')').attr('class', 'btn btn-danger btn-sm ps' + conta).attr('id', 'r' + conta);
    });
}