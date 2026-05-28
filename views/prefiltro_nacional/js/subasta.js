window.VENTANA = null;

window.initScript = function (id) {
    window.VENTANA = id;

    // $('#contenedor_dato').css('display', 'none');
    $('#tabla_filtro').css('display', '5');
    $('#seccion_placa').css('display', 'none');
    $('#seccion_ss').css('display', 'none');

    $('#filtro_subastaa').change(function () {
        let filtro = $('#filtro_subastaa').val();
        if (filtro === 'fecha') {
            $('#seccion_placa').css('display', 'none');
            $('#seccion_ss').css('display', 'none');
            $('#seccion_fecha').css('display', '');
        }
        if (filtro === 'placa') {
            $('#seccion_ss').css('display', 'none');
            $('#seccion_fecha').css('display', 'none');
            $('#seccion_placa').css('display', '');
        }
        if (filtro === 'ss') {
            $('#seccion_placa').css('display', 'none');
            $('#seccion_fecha').css('display', 'none');
            $('#seccion_ss').css('display', '');
        }
    });

    $('#buscar_datos').click(function () {
        consultar_tabla2();
    });

    $('#btn-closed-subasta').click(function () {
        consultar_tabla2();
    });
}

// function consultar_tabla2() {
//     $('#contenedor_dato').css('display', 'none');
//     $('#tabla_filtro').css('display', '5');
//     $('#tbl_subasta').html('');
//     var filtro = $('#filtro_subastaa').val();
//     var finicio = $('#fec_incio').val();
//     var ffinal = $('#fec_final').val();
//     var placa = $('#placa').val();
//     var sservicio = $('#sservicio').val();

//     $.post(
//         $('#base_url').val() + 'transporte/Consultasubasta2',
//         'filtro=' + filtro + '&fi=' + finicio + '&ff=' + ffinal + '&placa=' + placa + '&servicio=' + sservicio,
//         function (dato) {
//             if (dato && dato[0].length > 0) {
//                 //tabla principal
//                 for (var i = 0; i < dato[0].length; i++) {
//                     var statu = '';
//                     var btn_ver = '';
//                     var btn_cancela = '';
//                     var btn_resultado = '';
//                     var boton = '';
//                     var placas_sub = '';
//                     var estado_subasta = '';

//                     if (dato[0][i].estado == 1) {
//                         if (dato[0][i].subasta_vencida === 1) {
//                             statu = '<td class="nexos-txt-success">' + '<center><span class=fas fa-circle" title="Abierta"></span></center>' + '</td>';
//                             btn_cancela = `<button class="btn btn-space btn-danger btn-sm mdi mdi-close" title="Cancelar subasta" onClick="Validar_subasta(${dato[0][i].id});"></button>`;
//                             estado_subasta = '<span class="badge badge-danger float-right">Vencida</span>';
//                             boton = ``;
//                         } else {
//                             statu = '<td class="nexos-txt-success">' + '<center><span class=fas fa-circle" title="Abierta"></span></center>' + '</td>';
//                             btn_cancela = `<button class="btn btn-space btn-danger btn-sm mdi mdi-close" title="Cancelar subasta" onClick="Validar_subasta(${dato[0][i].id});"></button>`;
//                             estado_subasta = '<span class="badge badge-primary float-right">Activa</span>';
//                         }

//                         // '<button class="btn btn-space btn-secondary btn-sm mdi mdi-close" title="Cancelar subasta" onClick="Validar_subasta(' +dato[0][i].id +');"></button>';
//                     } else if (dato[0][i].estado == 0) {
//                         statu = '<td class="nexos-txt-danger">' + '<center><span class=fas fa-circle" title="Cerrada"></span></center>' + '</td>';
//                         estado_subasta = '<span class="badge badge-danger float-right">Cancelada</span>';
//                     } else if (dato[0][i].estado == 3) {
//                         statu = '<td class="nexos-txt-primary">' + '<center><span class=fas fa-circle" title="Finalizada"></span></center>' + '</td>';
//                         estado_subasta = '<span class="badge badge-warning float-right">Finalizada</span>';
//                     }

//                     var fecha = moment().format('YYYY-MM-DD');
//                     var fec_fin_sub = dato[2][i].fecha_cargue;
//                     var cant = moment(fec_fin_sub).diff(fecha, 'hours');
//                     var estado_subasta_solicitud = cant >= 0 ? '<span class="badge badge-success float-right">Activa</span>' : '<span class="badge badge-danger float-right">Vencida</span>';

//                     // Calcular el estado para la subasta
//                     // var fecha_subasta = moment().format('YYYY-MM-DD');
//                     // var fecha_subasta = moment().format('YYYY-MM-DD HH:mm:ss');
//                     // var fec_sub = dato[0][i].fecha + '-' + dato[1][i].hora;
//                     // var fec_sub = dato[0][i].fecha + ' ' + '11:10:00';
//                     // var fec_sub = dato[0][i].fecha;
//                     // var cant_subasta = moment(fec_sub).diff(fecha_subasta, 'hours');
//                     // var cant_subasta = moment(fec_sub).diff(fecha_subasta, 'minutes');
//                     // var estado_subasta = cant_subasta >= 0 ? '<span class="badge badge-primary float-right">Activa</span>' : '<span class="badge badge-danger float-right">Vencida</span>';
//                     // var estado_subasta = cant_subasta != 0 ? '<span class="badge badge-primary float-right">Activa</span>' : '<span class="badge badge-danger float-right">Vencida</span>';

//                     var fecha_hora = moment().format('YYYY-MM-DD HH:mm:ss');
//                     var fec_fin_solicitud = dato[2][i].fecha_cargue + ' ' + dato[2][i].hora_cargue;
//                     var cant_vencimiento = moment(fec_fin_solicitud).diff(fecha_hora, 'minutes');

//                     // alert(cant_subasta);
//                     if (cant >= 0 && dato[0][i].estado != 3) {
//                         if (cant >= 0 && dato[0][i].estado == 0) {
//                             boton = ``;
//                         } else {
//                             if (cant_vencimiento - 15 > 0) {
//                                 if (dato[0][i].subasta_vencida === 1) {
//                                     boton = ``;
//                                 } else {
//                                     boton = `<button class="btn btn-space btn-success btn-sm mdi mdi-refresh-alt" title="Automatización" onClick="Calculo_Nuevo(this);" data-id="${dato[0][i]
//                                         .id}" data-id2="${finicio}" data-id3="${ffinal}" data-id4="${dato[0][i].estado}" data-id5="${dato[0][i].escenario_id}"></button>`;
//                                 }
//                             } else {
//                                 boton = ``;
//                                 estado_subasta_solicitud = '<span class="badge badge-danger float-right">Fecha de cargue vencida</span>';
//                             }
//                         }
//                     }

//                     btn_ver = `<button class="btn btn-space btn-primary btn-sm mdi mdi-eye" title="Consultar" onClick="Ver_subasta_s(${dato[0][i].id});"></button>`;

//                     btn_resultado = `<button class="btn btn-space btn-warning btn-sm mdi mdi-label" title="Estudios seguridad"  onClick="Resultado(${dato[0][i].id});"></button>`;

//                     //placas
//                     var arrayplaca = [];
//                     for (var p = 0; p < dato[1].length; p++) {
//                         if (dato[0][i].id == dato[1][p].id_suba) {
//                             arrayplaca.push(dato[1][p].placa);
//                         }
//                     }
//                     var placas_acumuladas = arrayplaca.join(', ');

//                     // Solicitudes de servicio
//                     var array_solicitudes = [];

//                     for (let b = 0; b < dato[2].length; b++) {
//                         if (dato[0][i].id == dato[2][b].subasta_id) {
//                             array_solicitudes.push(dato[2][b].solicitud_servicio);
//                         }
//                     }
//                     var solicitudes_acumuladas = array_solicitudes.join(', ');

//                     $('#tbl_subasta').append(`
//             <tr>
//               ${statu}
//               <td class="text-center">${dato[0][i].id}</td>
//               <td class="text-center">
//                 ${dato[0][i].fecha_inicio} ${dato[0][i].hora_inicio}
//                   <br>
//                 ${dato[0][i].fecha_finaliza} ${dato[0][i].hora_finaliza}
//               </td>
//               <td class="text-center">
//                 ${dato[0][i].usuario}
//                 <br>
//                 ${dato[0][i].fecha}
//               </td>
//               <td class="text-center"><span class="badge badge-secondary float-right">${solicitudes_acumuladas}</span></td>
//               <td class="text-center"><span class="badge badge-secondary float-right">${placas_acumuladas}</span></td>
//               <td class="text-center">${estado_subasta_solicitud}</td>
//               <td class="text-center">${estado_subasta}</td>
//               <td class="actions text-center" style="font-size: 10px; white-space: nowrap;">
//                 <div class="btn-group btn-group-xs" role="group">
//                   ${btn_ver}
//                   ${btn_cancela}
//                   ${btn_resultado}
//                   ${boton}
//                 </div>
//               </td>
//             </tr>
//           `);
//                 }
//             } else {
//                 $('#tbl_subasta').html('<tr colspan="7" class="text-center"><td>No hay datos</td></tr>');
//             }
//         },
//         'json',
//     );
// }

function consultar_tabla2() {
    $('#contenedor_dato').hide();
    $('#tabla_filtro').css('display', '');
    $('#tbl_subasta').html('');
    const filtro = $('#filtro_subastaa').val();
    const finicio = $('#fec_incio').val();
    const ffinal = $('#fec_final').val();
    const placa = $('#placa').val();
    const sservicio = $('#sservicio').val();

    $.post(
        $('#base_url').val() + 'transporte/Consultasubasta2',
        `filtro=${filtro}&fi=${finicio}&ff=${ffinal}&placa=${placa}&servicio=${sservicio}`,
        function (dato) {
            if (dato && dato[0].length > 0) {
                for (let i = 0; i < dato[0].length; i++) {
                    let statu = '';
                    let btn_ver = '';
                    let btn_cancela = '';
                    let btn_resultado = '';
                    let boton = '';
                    let estado_subasta = '';

                    const isVencida = dato[0][i].subasta_vencida === 1;

                    if (dato[0][i].estado === 1) {
                        statu = `<td style='width:auto; white-space: nowrap;' class="nexos-txt-success"><center><span class="fas fa-circle text-success" title="Abierta"></span></center></td>`;
                        estado_subasta = `<span class="badge badge-phoenix badge-phoenix-${isVencida ? 'danger' : 'primary'}">${isVencida ? 'Vencida' : 'Activa'}</span>`;
                        btn_cancela = isVencida ? '' : `<button class="btn btn-danger btn-sm me-1 px-1 py-1" title="Cancelar subasta" onClick="Validar_subasta(${dato[0][i].id});"><span class="far fa-window-close"></span></button>`;
                        boton = `<button class="btn btn-success btn-sm me-1 px-1 py-1" title="Automatización" onClick="Calculo_Nuevo(this);" 
                        data-id="${dato[0][i].id}" data-id2="${finicio}" data-id3="${ffinal}" data-id4="${dato[0][i].estado}" data-id5="${dato[0][i].escenario_id}"><span class="fas fa-retweet"></span></button>`;
                    } else if (dato[0][i].estado === 0) {
                        statu = `<td style='width:auto; white-space: nowrap;' class="nexos-txt-danger"><center><span class="fas fa-circle text-danger" title="Cerrada"></span></center></td>`;
                        estado_subasta = `<span class="badge badge-phoenix badge-phoenix-danger">Cancelada</span>`;
                        boton = ``;
                    } else if (dato[0][i].estado === 3) {
                        statu = `<td style='width:auto; white-space: nowrap;' class="nexos-txt-primary"><center><span class="fas fa-circle text-primary" title="Finalizada"></span></center></td>`;
                        estado_subasta = `<span class="badge badge-phoenix badge-phoenix-warning">Finalizada</span>`;
                        boton = ``;
                    }

                    // const fecha_hora = moment().format('YYYY-MM-DD HH:mm:ss');
                    // const fec_fin_solicitud = `${dato[2][i].fecha_cargue} ${dato[2][i].hora_cargue}`;
                    // const cant_vencimiento = moment(fec_fin_solicitud).diff(fecha_hora, 'minutes');

                    // let estado_subasta_solicitud = cant_vencimiento >= 0
                    //     ? '<span class="badge badge-phoenix badge-phoenix-success">Activa</span>'
                    //     : '<span class="badge badge-phoenix badge-phoenix-danger">Fecha cargue vencida</span>';

                    // if (cant_vencimiento >= 15 && dato[0][i].estado === 1 && !isVencida) {
                    //     boton = `<button class="btn btn-success btn-sm me-1 px-1 py-1 mdi mdi-refresh-alt" title="Automatización" onClick="Calculo_Nuevo(this);" 
                    //     data-id="${dato[0][i].id}" data-id2="${finicio}" data-id3="${ffinal}" data-id4="${dato[0][i].estado}" data-id5="${dato[0][i].escenario_id}"></button>`; 
                    // }

                    btn_ver = `<button type='button' class="btn btn-primary btn-sm me-1 px-1 py-1" title="Consultar" onClick="Ver_subasta_s(${dato[0][i].id});" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBackdrop" aria-controls="offcanvasWithBackdrop"><span class="far fa-eye"></span></button>`;
                    btn_resultado = `<button class="btn btn-warning btn-sm me-1 px-1 py-1" title="Estudios seguridad" onClick="Resultado(${dato[0][i].id});"><span class="fas fa-reply-all"></span></button>`;

                    const placas_acumuladas = dato[1].filter(p => dato[0][i].id == p.id_suba).map(p => p.placa).join(', ');
                    const solicitudes_acumuladas = dato[2].filter(b => dato[0][i].id == b.subasta_id).map(b => b.solicitud_servicio).join(', ');

                    $('#tbl_subasta').append(`
                        <tr>
                            ${statu}
                            <td style='width:auto; white-space: nowrap;' class="text-center">${dato[0][i].id}</td>
                            <td style='width:auto; white-space: nowrap;' class="text-center">
                                ${dato[0][i].fecha_inicio} ${dato[0][i].hora_inicio} - ${dato[0][i].fecha_finaliza} ${dato[0][i].hora_finaliza}
                            </td>
                            <td style='width:auto; white-space: nowrap;' class="text-center">
                                ${dato[0][i].usuario} - ${dato[0][i].fecha}
                            </td>
                            <td style='width:auto; white-space: nowrap;' class="text-center"><span class="badge badge-phoenix badge-phoenix-secondary">${solicitudes_acumuladas}</span></td>
                            <td style='width:auto; white-space: nowrap;' class="text-center"><span class="badge badge-phoenix badge-phoenix-secondary">${placas_acumuladas}</span></td>

                            <td style='width:auto; white-space: nowrap;' class="text-center">${estado_subasta}</td>
                            <td style='width:auto; white-space: nowrap;' class="text-center" style="font-size: 10px; white-space: nowrap;">
                                <div class="btn-group btn-group-xs" role="group">
                                ${btn_ver}
                                ${btn_cancela}
                                ${btn_resultado}
                                ${boton}
                                </div>
                            </td>
                        </tr>
                    `);
                    // <!--<td style='width:auto; white-space: nowrap;' class="text-center">${estado_subasta_solicitud}</td>-->
                }
            } else {
                $('#tbl_subasta').html('<tr><td colspan="8" class="text-center">No hay datos</td></tr>');
            }
        },
        'json'
    );
}

function Ver_subasta_s(id) {
    $('#tabla_filtro').css('display', 'none');
    $('#contenedor_dato').css('display', 'block');
    $('.FP').hide();
    $('.FT').hide();
    $('.FM').hide();
    $('.mg_title').html('');
    $('.FP2').html('');
    $.post(
        $('#base_url').val() + 'transporte/Consulta_subasta_vs',
        'id_subasta=' + id,
        function (data) {
            if (data) {
                // $('.mg_title').html('Solicitudes de servicio');
                for (var i = 0; i < data.length; i++) {
                    $('.FP2').append('<span class="badge badge-dark">' + data[i]['numer_solservicio'] + '</span>');
                }
                Ver_subasta(id);
            }
        },
        'json',
    );
}

function Ver_subasta(id) {
    $('#tabla_filtro').css('display', 'none');
    $('#contenedor_dato').css('display', 'block');
    $('#tabla_placas').html('');
    $('.FP').show();
    $('.FT').hide();
    $('.FM').hide();

    $.post(
        $('#base_url').val() + 'transporte/Consulta_subasta_v',
        'id_subasta=' + id,
        function (data) {
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    let boton = '';
                    let tabla_placas = '';

                    // Si SAC no aprueba el flete, mostrar botón
                    if (data[i]['estado_flete'] == 'no_aprueba_flete_sac') {
                        boton = `<button id="rta_sac" class="btn btn-xs mdi mdi-mail-send btn-primary"  
                                    onClick="rta_sac(${i}, ${id})"></button>`;
                    }

                    // Calcular rentabilidad
                    var tari = data[i]['tarifa_promedio'].replace(/,/g, '');
                    var flete = data[i]['flete_propuesto'].replace(/,/g, '');
                    let rent = parseFloat(tari) - parseFloat(flete);
                    let calculo = parseFloat(rent) / parseFloat(tari);
                    let res = parseFloat(calculo) * 100;
                    let util = res.toFixed(2);

                    // Formatear valores numéricos
                    let fletePropuestoTexto = parseFloat(flete || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 });
                    let fleteSugeridoTexto = parseFloat(data[i]['flete_sugerido'] || 0).toLocaleString('es-CO', { minimumFractionDigits: 2 });

                    // Construir fila de la tabla
                    tabla_placas = `
                    <tr>
                        <!-- Estudio de Seguridad -->
                        <td>
                            ${data[i]['placa']} - ${data[i]['nombre_conductor']} - ${data[i]['num_estudioseguridad']}
                            <input type="hidden" value="${data[i]['num_estudioseguridad']}">
                            <input type="hidden" id="placa${i}" value="${data[i]['placa']}">
                            <input type="hidden" value="${data[i]['nombre_conductor']}">
                        </td>

                        <!-- Flete Propuesto (solo texto) -->
                        <td>
                            ${fletePropuestoTexto}
                            <input type="hidden" id="fpro${i}" value="${data[i]['flete_propuesto']}">
                        </td>

                        <!-- Flete Sugerido -->
                        <td>
                            ${fleteSugeridoTexto}
                            <input type="hidden" id="fsu${i}" value="${data[i]['flete_sugerido']}">
                        </td>

                        <!-- Estado Flete -->
                        <td>
                            <strong style="font-size:medium;">${data[i]['estado_flete']}</strong>
                            <input type="hidden" id="subasta${i}" value="${data[i]['id']}">
                        </td>

                        <!-- Traza Estado -->
                        <td>
                            Sac_acepta flete(${data[i]['acepta_flete'] ?? ''}) 
                            Sac_tarifa(${data[i]['estado_sac'] ?? ''})  
                            Estado Final(${data[i]['estado_final'] ?? ''})
                            <input type="hidden" id="tarif${i}" value="${data[i]['tarifa_promedio'] ?? ''}">
                            <input type="hidden" id="rent${i}" value="${rent}">
                            <input type="hidden" id="util${i}" value="${util}">
                            ${boton}
                        </td>

                        <!-- Usuario -->
                        <td>
                            ${data[i]['usuario']}
                            <input type="hidden" value="${data[i]['usuario']}">
                        </td>

                        <!-- Acción -->
                        <td>
                            <button class="btn btn-space btn-danger btn-xs" onClick="cancelar_vehiculo()">
                                <i class="icon icon-left mdi mdi-alert-circle"></i>
                            </button>
                        </td>
                    </tr>`;

                    $('#tabla_placas').append(tabla_placas);
                }
            }
        },
        'json'
    );
}


function calcula_flete(elem, id) {
    prop = $('#fpro' + id).val();
    tari = $('#tarif' + id).val();
    var tari = tari.replace(/,/g, '');
    var flete = prop.replace(/,/g, '');
    let rent = parseFloat(tari) - parseFloat(prop);
    let calculo = parseFloat(rent) / parseFloat(tari);
    let res = parseFloat(calculo) * 100;
    let util = res.toFixed(2);
    $('#rent' + id).val(rent);
    $('#util' + id).val(util);
}

function rta_sac(id, numsubasta) {
    prop = $('#fpro' + id).val().replace(/,/g, '');
    tari = $('#tarif' + id).val().replace(/,/g, '');
    rent = $('#rent' + id).val().replace(/,/g, '');
    util = $('#util' + id).val();
    sub = $('#subasta' + id).val();
    placa = $('#placa' + id).val();
    //guardar
    $.ajax({
        url: $('#base_url').val() + 'transporte/respuesta_operacion',
        method: 'POST',
        data: { subasta: sub, prop: prop, tari: tari, rent: rent, util: util, placa: placa, numsubasta: numsubasta },
        dataType: 'json',
        success: function (data) {
            if (data == 'true') {
                alert('Registro existosamente!!');
                consultar_tabla2();
            } else if (data == 'false') {
                alert('Registro existosamente!!');
                consultar_tabla2();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
    });
}

function Validar_subasta(id) {
    //validar si la subasta tiene un flete aprobado
    // if (confirm('¿Seguro desea cancelar esta subasta?') == true) {}
    Swal.fire({
        title: '¿Estas seguro?',
        text: 'Desea cancelar esta subasta!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Cancelar Subasta',
        cancelButtonText: 'No, Cencelar',
        customClass: {
            popup: 'swal2-custom-font',
        },
    }).then(result => {
        if (result.isConfirmed) {
            $.post(
                $('#base_url').val() + 'transporte/Valide_subasta',
                'id_subasta=' + id,
                function (data) {
                    var id_flete = data[0]['id_suba_flete'];
                    var status = data[0]['estado'];
                    var valor_sub = data[0]['id_suba'];
                    if (id_flete > 0 || status == 'aprobado' || status == 'pendiente') {
                        Cancelar_subasta(id_flete, valor_sub);
                    } else {
                        alert('Señor usuario esta subasta aún no tiene un flete Aprobado o Ganador');
                    }
                },
                'json',
            );
        }
    });
}

function Cancelar_subasta(idflete, idsub) {
    $.post(
        $('#base_url').val() + 'transporte/Cancelar_subasta',
        'idflete=' + idflete + '&id_subasta=' + idsub,
        function (data) {
            if (data.success === true) {
                // alert('Subasta Finalizada Exitosamente!!');
                Swal.fire({
                    title: 'Exito!',
                    // text: 'Subasta Finalizada Exitosamente.',
                    text: data.message,
                    icon: 'success',
                    customClass: {
                        popup: 'swal2-custom-font',
                    },
                });
                consultar_tabla2();
            } else if (data == 'false') {
                alert('Ha ocurrido un error!!');
            }
        },
        'json',
    );
}

function Resultado(idsub) {
    $.post(
        $('#base_url').val() + 'transporte/Estado_estudio',
        'id_subasta=' + idsub,
        function (data) {
            $('#cuerpo_estado').html('');
            $('.mg_title').html('');

            if (data && data.length > 0) {
                // $('.mg_title').html('Solicitudes de servicio');
                $('#tabla_filtro').hide();
                $('#contenedor_dato').show();
                $('.FM').hide();
                $('.FP').hide();
                $('.FT').show();

                let body = '';
                for (let i = 0; i < data.length; i++) {
                    // Color del badge según estado
                    let badgeClass = 'badge badge-phoenix badge-phoenix-secondary';
                    if (data[i]['estado'] === 'Aprobado') badgeClass = 'badge badge-phoenix badge-phoenix-success';
                    else if (data[i]['estado'] === 'Pendiente') badgeClass = 'badge badge-phoenix badge-phoenix-warning';
                    else if (data[i]['estado'] === 'Rechazado') badgeClass = 'badge badge-phoenix badge-phoenix-danger';

                    body += `
                        <tr>
                            <td>${data[i]['id']}</td>
                            <td>${data[i]['id_suba_servicio']}</td>
                            <td>${data[i]['placa']}</td>
                            <td class="cell-detail">
                                ${data[i]['nombre']}
                                <span class="cell-detail-description">
                                    ${data[i]['numero_documento']}
                                </span>
                            </td>
                            <td>${data[i]['id_estudio']}</td>
                            <td>
                                <span class="badge ${badgeClass}">${data[i]['estado']}</span>
                            </td>
                        </tr>
                    `;
                }
                $('#cuerpo_estado').html(body);

                // Mostrar el offcanvas automáticamente
                const offcanvasElement = document.getElementById('offcanvasWithBackdrop');
                const offcanvasInstance = new bootstrap.Offcanvas(offcanvasElement);
                offcanvasInstance.show();
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin datos',
                    text: 'No hay solicitudes para esta subasta.',
                    confirmButtonText: 'Aceptar'
                });
            }
        },
        'json'
    );
}

function Calcular(element) {
    $('#flete_ganador').val('');
    $('#id_fleteg').val('');
    $('#n_subasta').val('');
    $('#splaca').val('');
    $('#estadofle').val('');

    $('#cuerpo_calculo').html('');
    var elemento = $(element);
    var idsub = elemento.data('id');
    var finicio = elemento.data('id2');
    var ffin = elemento.data('id3');
    var estado = elemento.data('id4'); //estado de la subasta
    var e = '';
    var a;
    if (estado == 1) {
        //buscar todos los fletes propuestos para esa subasta con estudio APROBADO
        $.post(
            $('#base_url').val() + 'transporte/Consultar_fletes',
            'id_subasta=' + idsub,
            function (data) {
                $('#flete_ganador').val('');
                $('#id_fleteg').val('');
                if (data) {
                    var cantidad = data.length;
                    alert(cantidad);
                    if (cantidad > 1) {
                        //trae mas de un flete, comparar
                        //encontrar el flete con la mayor cantidad de viajes

                        var arreglo = new Array();
                        for (var i = 0; i < data.length; i++) {
                            arreglo.push(data[i]['cant_viajes']);
                        }
                        var maximo = Math.max.apply(Math, arreglo);

                        for (var m = 0; m < data.length; m++) {
                            if (data[m]['cant_viajes'] == maximo) {
                                //FLETE FINALIZTA

                                var fletepropuesto = data[m]['mfletepropuesto'];
                                var flete_cotizado = data[m]['flete_sugerido'];
                                var num_estudiosegu = data[m]['num_estudioseguridad'];
                                var plak = data[m]['placa'];
                                var idflete = data[m]['id_flete'];
                                var idsuba = data[m]['id_suba'];
                                //Validar si el flete finalizta es mayor o igual al flete cotizado
                                if (fletepropuesto >= flete_cotizado) {
                                    $.post(
                                        $('#base_url').val() + 'transporte/Valida_Vigencia',
                                        'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                                        function (data) {
                                            if (data) {
                                                //validar vigencia del estudio de seguridad
                                                var fhoy = moment();
                                                var tf = fhoy.diff(data[0]['fecha'], 'days');
                                                if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                                                    $('#flete_ganador').val(fletepropuesto);
                                                    $('#id_fleteg').val(idflete);
                                                    $('#n_subasta').val(idsuba);
                                                    $('#splaca').val(plak);
                                                    $('#estadofle').val('Ganador');
                                                    Actualiza_Flete();
                                                } else {
                                                    alert('El estudio ' + num_estudiosegu + ' no es vigente');
                                                }
                                            }
                                        },
                                        'json',
                                    );
                                } else {
                                    var tarifa_venta = data[m]['total_tarifa'];
                                    var resta = parseFloat(tarifa_venta) - parseFloat(data[m]['mfletepropuesto']);
                                    var calculo = parseFloat(resta) / parseFloat(fletepropuesto);
                                    var res = parseFloat(calculo) * 100;

                                    if (res >= 15) {
                                        $.post(
                                            $('#base_url').val() + 'transporte/Valida_Vigencia',
                                            'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                                            function (data) {
                                                if (data) {
                                                    var fhoy = moment();
                                                    var tf = fhoy.diff(data[0]['fecha'], 'days');
                                                    if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                                                        $('#flete_ganador').val(fletepropuesto);
                                                        $('#id_fleteg').val(idflete);
                                                        $('#n_subasta').val(idsuba);
                                                        $('#splaca').val(plak);
                                                        $('#estadofle').val('Ganador');
                                                        Actualiza_Flete();
                                                        //ENVIO A ORDEN DE CARGUE
                                                    } else {
                                                        alert('El estudio ' + num_estudiosegu + ' no es vigente');
                                                    }
                                                } else {
                                                    alert('No hay estudios de seguridad aprobados');
                                                }
                                            },
                                            'json',
                                        );
                                    } else {
                                        //bandeja de aprobacion gerencial-WILLIAM
                                        $.post(
                                            $('#base_url').val() + 'transporte/Valida_Vigencia',
                                            'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                                            function (data) {
                                                if (data) {
                                                    var fhoy = moment();
                                                    var tf = fhoy.diff(data[0]['fecha'], 'days');

                                                    if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                                                        $('#flete_ganador').val(fletepropuesto);
                                                        $('#id_fleteg').val(idflete);
                                                        $('#n_subasta').val(idsuba);
                                                        $('#splaca').val(plak);
                                                        $('#estadofle').val('pendiente_aprobacion');
                                                        Actualiza_Flete();
                                                        //ENVIO BANDEJA DE GERENCIA
                                                    } else {
                                                        alert('El estudio ' + num_estudiosegu + ' no es vigente');
                                                    }
                                                } else {
                                                    alert('No hay estudios de seguridad aprobados');
                                                }
                                            },
                                            'json',
                                        );
                                    }
                                } //cierre del else
                            }
                        }
                        //fin
                    }

                    if (cantidad == 1) {
                        //trae el valor mínimo
                        //comparar el flete con el flete sugerido
                        var tarifa_venta = data[0]['total_tarifa'];
                        var idflete = data[0]['id_flete'];
                        var idsuba = data[0]['id_suba'];
                        var num_estudiosegu = data[0]['num_estudioseguridad'];
                        var plak = data[0]['placa'];
                        var fletepropuesto = parseFloat(data[0]['mfletepropuesto']);
                        var fletecotizado = parseFloat(data[0]['flete_sugerido']);
                        alert(tarifa_venta);
                        if (fletepropuesto <= fletecotizado) {
                            //validar vigencia del estudio de seguridad
                            $.post(
                                $('#base_url').val() + 'transporte/Valida_Vigencia',
                                'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                                function (data) {
                                    if (data) {
                                        var fhoy = moment();
                                        var tf = fhoy.diff(data[0]['fecha'], 'days');
                                        if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                                            $('#flete_ganador').val(fletepropuesto);
                                            $('#id_fleteg').val(idflete);
                                            $('#n_subasta').val(idsuba);
                                            $('#splaca').val(plak);
                                            $('#estadofle').val('Ganador');
                                            Actualiza_Flete();
                                        } else {
                                            alert('El estudio ' + num_estudiosegu + ' no es vigente');
                                        }
                                    } else {
                                        alert('No hay estudios de seguridad aprobados');
                                    }
                                },
                                'json',
                            );
                        } else {
                            //FLETE OPERACIONES ES MAYOR AL FLETE COTIZACIONES
                            //calcular la rentabilidad

                            var resta = parseFloat(tarifa_venta) - parseFloat(data[0]['mfletepropuesto']);
                            var calculo = parseFloat(resta) / parseFloat(fletepropuesto);
                            var res = parseFloat(calculo) * 100;
                            if (res >= 15) {
                                $.post(
                                    $('#base_url').val() + 'transporte/Valida_Vigencia',
                                    'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                                    function (data) {
                                        if (data) {
                                            var fhoy = moment();
                                            var tf = fhoy.diff(data[0]['fecha'], 'days');
                                            if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                                                $('#flete_ganador').val(fletepropuesto);
                                                $('#id_fleteg').val(idflete);
                                                $('#n_subasta').val(idsuba);
                                                $('#splaca').val(plak);
                                                $('#estadofle').val('Ganador');
                                                Actualiza_Flete();
                                                //ENVIO A ORDEN DE CARGUE
                                            } else {
                                                alert('El estudio ' + num_estudiosegu + ' no es vigente');
                                            }
                                        } else {
                                            alert('No hay estudios de seguridad aprobados');
                                        }
                                    },
                                    'json',
                                );
                            } else {
                                //bandeja de aprobacion gerencial-WILLIAM
                                $.post(
                                    $('#base_url').val() + 'transporte/Valida_Vigencia',
                                    'num_estudio=' + num_estudiosegu + '&placa=' + plak,
                                    function (data) {
                                        if (data) {
                                            var fhoy = moment();
                                            var tf = fhoy.diff(data[0]['fecha'], 'days');

                                            if (data[0]['estado'] == 'Aprobado' && tf == 0) {
                                                $('#flete_ganador').val(fletepropuesto);
                                                $('#id_fleteg').val(idflete);
                                                $('#n_subasta').val(idsuba);
                                                $('#splaca').val(plak);
                                                $('#estadofle').val('pendiente_aprobacion');
                                                Actualiza_Flete();
                                                //ENVIO BANDEJA DE GERENCIA
                                            } else {
                                                alert('El estudio ' + num_estudiosegu + ' no es vigente');
                                            }
                                        } else {
                                            alert('No hay estudios de seguridad aprobados');
                                        }
                                    },
                                    'json',
                                );
                            }
                        }
                    }
                }
            },
            'json',
        );
        a = 'Class="text-success"';
        e = 'Activo';
    }
    if (estado == 0) {
        a = 'Class="text-danger"';
        e = 'Cancelado';
    }
    if (estado == 3) {
        a = 'Class="text-primary"';
        e = 'Terminada';
    }
    $('#tabla_filtro').css('display', 'none');
    $('#contenedor_dato').css('display', '');
    $('.FP').hide();
    $('.FT').hide();
    $('.FM').show();
    var tabla = '<tr>' + '<td>' + idsub + '</td>' + '<td>' + finicio + '</td>' + '<td>' + finicio + '</td>' + '<td ' + a + '>' + e + '</td>' + '</tr>';
    $('#cuerpo_calculo').append(tabla);
}

function Calculo_Nuevo(element) {
    Swal.fire({
        title: '¿Desea efectuar esta subasta?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $('#contenedor_dato').show();
            $('#tabla_filtro').hide();
            $('.FP').hide();
            $('.FT').hide();
            $('.FM').show();

            const elemento = $(element);
            const idsub = elemento.data('id');
            const finicio = elemento.data('id2');
            const ffin = elemento.data('id3');
            const estado = elemento.data('id5');
            const escenario_id = elemento.data('id4');
            const fecha_actual = moment().format('YYYY-MM-DD hh:mm:ss');

            let estadoTexto = '';
            let estadoClass = '';

            if (estado == 1) {
                estadoClass = 'text-success';
                estadoTexto = 'Activo';
            } else if (estado == 0) {
                estadoClass = 'text-danger';
                estadoTexto = 'Cancelado';
            } else if (estado == 3) {
                estadoClass = 'text-primary';
                estadoTexto = 'Terminada';
            }

            const filaTabla = `
                <tr>
                    <td>${idsub}</td>
                    <td>${finicio}</td>
                    <td>${ffin}</td>
                    <td class="${estadoClass}">${estadoTexto}</td>
                </tr>
            `;
            $('#cuerpo_calculo').append(filaTabla);

            // --- CONSULTA TODOS LOS VEHÍCULOS DE LA SUBASTA ---
            $.post(
                $('#base_url').val() + 'transporte/Estado_estudio',
                `id_subasta=${idsub}`,
                function (data) {
                    $('#cuerpo_estado2').html('');
                    if (data) {
                        data.forEach(item => {
                            const valor = parseFloat(item['flete_propuesto'], 100)
                                .toFixed(2)
                                .replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
                                .toString();

                            const fila = `
                                <tr class="${item['estado'] === 'Aprobado' ? 'table-success' : ''}">
                                    <td>${item['id_suba_servicio']}</td>
                                    <td>${item['placa']}</td>
                                    <td class="cell-detail">
                                        ${item['nombre']}
                                        <span class="cell-detail-description">${item['numero_documento']}</span>
                                    </td>
                                    <td>${item['id_estudio']}</td>
                                    <td>${valor}</td>
                                    <td>
                                        <span class="badge ${item['estado'] === 'Aprobado'
                                    ? 'badge badge-phoenix badge-phoenix-success'
                                    : item['estado'] === 'Pendiente'
                                        ? 'badge badge-phoenix badge-phoenix-warning'
                                        : 'badge badge-phoenix badge-phoenix-secondary'
                                }">${item['estado']}</span>
                                    </td>
                                </tr>
                            `;
                            $('#cuerpo_estado2').append(fila);
                        });
                    }

                    // Abre el offcanvas con resultados
                    const offcanvasEl = document.getElementById('offcanvasWithBackdrop');
                    const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
                    offcanvas.show();
                    // $('#contenedor_dato').show();
                    // consultar_tabla2();
                },
                'json'
            );

            // --- CONSULTA EL MENOR FLETE PROPUESTO ---
            $.post($('#base_url').val() + 'transporte/Consultar_fletes', `id_subasta=${idsub}`,
                function (data) {
                    if (data) {
                        const mostrarVigenciaSuperada = (estudio) => {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Vigencia del estudio vencida',
                                text: `El vehículo con flete ganador ${estudio} superó el tiempo de vigencia del estudio de seguridad.`,
                                confirmButtonText: 'Entendido'
                            });
                        };

                        const procesarGanador = (ganador, base, idsub) => {
                            const fpro = parseFloat(ganador['mfletepropuesto'].replace(/,/g, ''));
                            const fsug = parseFloat(ganador['flete_sugerido'].replace(/,/g, ''));
                            const tarifaVenta = parseFloat(ganador['total_tarifa'].replace(/,/g, ''));

                            const resta = tarifaVenta - fpro;
                            const rentabilidad = (resta / fpro) * 100;

                            $('#flete_ganador').val(fpro);
                            $('#id_fleteg').val(ganador['id_flete']);
                            $('#n_subasta').val(ganador['id_suba']);
                            $('#splaca').val(ganador['placa']);
                            $('#estadofle').val(fpro <= fsug && rentabilidad >= 15 ? 'Ganador' : 'pendiente_aprobacion');

                            Actualiza_Flete();
                        };

                        const horas_estudio = 60;

                        if (data.length > 1) {
                            const maxViajes = Math.max(...data.map(item => item['cant_viajes']));

                            data.forEach(item => {
                                if (item['cant_viajes'] == maxViajes) {
                                    const tf = moment().diff(item['fecha'], 'hour');
                                    if (tf <= horas_estudio) {
                                        procesarGanador(item, data[0], idsub);
                                    } else {
                                        mostrarVigenciaSuperada(data[0]['num_estudioseguridad']);
                                    }
                                }
                            });
                        } else if (data.length === 1) {
                            const tf = moment().diff(data[0]['fecha'], 'hour');
                            if (tf <= horas_estudio) {
                                procesarGanador(data[0], data[0], idsub);
                            } else {
                                mostrarVigenciaSuperada(data[0]['num_estudioseguridad']);
                            }
                        }
                    }
                },
                'json'
            );
        }
    });
}

// Procesa el ganador y actualiza
function procesarGanador(item, ref, idsuba) {
    var fpro = parseFloat(ref['mfletepropuesto'].replace(/,/g, ''));
    var fsug = parseFloat(ref['flete_sugerido'].replace(/,/g, ''));
    var tarifa_venta = parseFloat(item['total_tarifa'].replace(/,/g, ''));
    var resta = tarifa_venta - fpro;
    var calculo = resta / fpro;
    var res = (calculo * 100).toFixed(2);

    $('#flete_ganador').val(ref['mfletepropuesto']);
    $('#id_fleteg').val(item['id_flete']);
    $('#n_subasta').val(idsuba);
    $('#splaca').val(item['placa']);
    $('#estadofle').val((parseFloat(res) >= 15 && fpro <= fsug) ? 'Ganador' : 'pendiente_aprobacion');

    Actualiza_Flete();
}

function Actualiza_Flete() {
    //FLETE GANADOR
    var fg = $('#flete_ganador').val();
    var idflete = $('#id_fleteg').val();
    var idsub = $('#n_subasta').val();
    var estado = $('#estadofle').val();
    var placa = $('#splaca').val();
    $.post(
        $('#base_url').val() + 'transporte/Actualiza_Subasta',
        'id_subasta=' + idsub + '&id_flete=' + idflete + '&statu=' + estado + '&placa=' + placa,
        function (data) {
            if (data == true) {
                alert('Datos Ganados!!');
                //Calcular();
                //Calculo_Nuevo();
            }
        },
        'json',
    );
}

function Buscar_Regla() {
    $.post(
        $('#base_url').val() + 'transporte/Consultar_Regla',
        function (data) {
            if (data) {
                var respuesta = data['valor'];
                return respuesta;
            }
        },
        'json',
    );
}