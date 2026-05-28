window.VENTANA = null;

window.initScript = function (id) {
    window.VENTANA = id;
    Listar_Clientes();

    document.addEventListener("click", async e => {
        if (e.target.matches("#mascara_direccion") || e.target.matches("#mascara_direccion *")) {
            const div = document.getElementById("div_mascara");
            div.style.display = (div.style.display === '' || div.style.display === 'block') ? 'none' : 'block';
        }
    });

    //Formulario para gaurdar clientes

    $("#btn_crea_cliente").click(function (e) {
        //alert(' HOLA GATO');
        // console.log("Entro en funcion de evento del botón btn_crea_cliente");
        e.preventDefault();
        $("#nexos_messages_popup_crea").html('');
        var msg_error = "";
        /******* Se valida el contenido del formulario *******/
        // Contenido de información básica
        if ($("#info").length > 0) {
            // console.log("Entro en formulario de información básica.");
            // Contendo de la pestaña de información básica
            if ($("#info_basico").length > 0) {
                // console.log("Entro en formulario de pestaña de información básica.");

                if (!$("#slct_tipo_documento_").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Tipo de Documento</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#slct_tipo_documento_");
                } else {
                    RemueveFoco("#slct_tipo_documento_");
                }

                if (!$("#slct_regimen_").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Régimen</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#slct_regimen_");
                } else {
                    RemueveFoco("#slct_regimen_");
                }

                if (!$("#documento").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Documento</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#documento");
                } else {
                    RemueveFoco("#documento");
                    if ($("#slct_tipo_documento_").val() == "Natural") {
                        if ($("#documento").val().length < 6 || $("#documento").val().length > 12) {
                            msg_error += '<p>El campo <strong>Documento</strong> en la pestaña <strong>Información General</strong> debe tener mínimo 8 caracteres & máximo 12 caracteres para poder crear el Cliente.</p>';
                        }
                    }
                    if ($("#slct_tipo_documento_").val() == "Juridico") {
                        if ($("#documento").val().length != 9) {
                            msg_error += '<p>El campo <strong>Documento</strong> en la pestaña <strong>Información General</strong> debe tener 9 dígitos para poder crear el Cliente.</p>';
                        }
                    }
                }
                if (!$("#digito_verificacion").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Dígito de Verificación</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#digito_verificacion");
                } else {
                    RemueveFoco("#digito_verificacion");
                }

                /*if ( !$("#rut_file").val() ) {
                    msg_error+= '<p>Debe seleccionar un archivo <strong>Adjunto RUT</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                }else{*/
                if ($("#rut_file").val()) {
                    var adjunto = $('#rut_file')[0].files[0];
                    // console.log( $('#rut_file')[0].files[0] );
                    // console.log( adjunto.name );

                    // Se valida el tipo de archivo
                    var extension = adjunto.name.split(".");
                    var formato_archivo = "pdf,PDF,zip,ZIP,rar,RAR,doc,DOC,docx,DOCX,jpg,jpeg,png,gif,bmp,tif,JPG,JPEG,PNG,GIF,BMP,TIF,xls,XLS,xlsx,XLSX,ppt,PPT,pptx,PPTX,pps,PPS,ppsx,PPSX";
                    if (validaFormatoArchivo(formato_archivo, extension[extension.length - 1]) == 0) {
                        msg_error += "<p>Formato del archivo del campo <strong>Adjunto RUT</strong> en la pestaña <strong>Información General</strong> no es válido para poder crear el cliente.</p>";
                        msg_error += "<p>Formatos válidos: <strong>" + formato_archivo + "</strong>.</p>";
                    }
                }

                if (!$("#numero_formulario").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Número Formulario RUT</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#numero_formulario");
                } else {
                    if ($("#numero_formulario").val().length != 11) {
                        msg_error += '<p>El campo <strong>Número Formulario RUT</strong> en la pestaña <strong>Información General</strong> debe ser de 11 dígitos para poder crear el Cliente.</p>';
                    }
                    RemueveFoco("#numero_formulario");
                }

                if (!$("#rut_expedicion").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Fecha Expedición RUT</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#rut_expedicion");
                } else {
                    RemueveFoco("#rut_expedicion");
                }

                if (!$("#ciiu_principal").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>CIIU Principal</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#ciiu_principal");
                } else {
                    RemueveFoco("#ciiu_principal");
                }

                if (!$("#nombre").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Nombre o Razón Social</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#nombre");
                } else {
                    RemueveFoco("#nombre");
                }

                if (!$("#slct_tipo_sociedad_").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Tipo Sociedad</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#slct_tipo_sociedad_");
                } else {
                    RemueveFoco("#slct_tipo_sociedad_");
                }

                if (!$("#sigla").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Sigla</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sigla");
                } else {
                    RemueveFoco("#sigla");
                }

                if (!$("#actividad_cliente").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Actividad</strong> en la pestaña <strong>Información General</strong> para poder crear el Cliente.</p>';
                    //AplicaFoco("#actividad_cliente");
                } else {
                    //RemueveFoco("#actividad_cliente");
                }
            }
            // Contendo de la pestaña de ubicación
            if ($("#info_ubicacion").length > 0) {
                // console.log("Entro en formulario de pestaña de Ubicación.");

                if (!$("#slct_municipios_").val()) {
                    msg_error += '<p>Debe seleccionar una <strong>Ciudad</strong> en la pestaña <strong>Ubicación</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#slct_municipios_");
                } else {
                    RemueveFoco("#slct_municipios_");
                }

                if (!$("#direccion").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Dirección</strong> en la pestaña <strong>Ubicación</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#direccion");
                } else {
                    RemueveFoco("#direccion");
                }

                if (!$("#telefono").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>Teléfono</strong> en la pestaña <strong>Ubicación</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#telefono");
                } else {
                    RemueveFoco("#telefono");
                }

                if (!$("#email").val()) {
                    msg_error += '<p>Debe diligenciar el campo <strong>E-mail</strong> en la pestaña <strong>Ubicación</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#email");
                } else {
                    RemueveFoco("#email");
                }
                if (!$("#sede").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Nombre Sede</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sede");
                } else {
                    RemueveFoco("#sede");
                }
                if (!$("#sede_encargado").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>(*) Persona Encargada</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sede_encargado");
                } else {
                    RemueveFoco("#sede_encargado");
                }
                if (!$("#sede_atencion").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Días Información</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sede_atencion");
                } else {
                    RemueveFoco("#sede_atencion");
                }
                if (!$("#sede_cond_factura").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Condiciones de facturación</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sede_cond_factura");
                } else {
                    RemueveFoco("#sede_cond_factura");
                }
                if (!$("#slct_sede_otributaria").val()) {
                    msg_error += '<p>Debe seleccionar una <strong>Obligación tributaria</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#slct_sede_otributaria");
                } else {
                    RemueveFoco("#slct_sede_otributaria");
                }
                if (!$("#sede_cond_pago").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Condición de Pago</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sede_cond_pago");
                } else {
                    RemueveFoco("#sede_cond_pago");
                }
                if (!$("#sede_restriccion").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Restricción Acceso</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sede_restriccion");
                } else {
                    RemueveFoco("#sede_restriccion");
                }
                if (!$("#sede_instruccion").val()) {
                    msg_error += '<p>Debe seleccionar un <strong>Instrucción especial</strong> en la pestaña <strong>Sede</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("#sede_instruccion");
                } else {
                    RemueveFoco("#sede_instruccion");
                }
            }

            // Contendo de la pestaña de responsables
            if ($("#info_responsables").length > 0) {
                // console.log("Entro en formulario de pestaña de Responsables.");

                // Se valida la información de los responsables del cliente
                var flag_servicio = false;
                $(".servicio").each(function () {
                    if ($(this).is(":checked")) {
                        flag_servicio = true;
                        var div = $(this).attr("id").replace(/ /g, "_").toLowerCase();
                        // Se valida la información del Ejecutivo Comercial
                        var array_lista_comercial = new Array();
                        for (var i = 1; i <= $("." + div + "_comercial_clon").length; i++) {
                            if (!$("#slct_" + div + "_comercial_" + i).val()) {
                                msg_error += '<p>Debe seleccionar el <strong>Ejecutivo Comercial</strong> de la posición ' + i + ' para el servicio <strong>' + $(this).attr("id") + '</strong> en la pestaña <strong>Responsables</strong> para poder crear el Cliente.</p>';
                            } else {
                                if (array_lista_comercial.indexOf($("#slct_" + div + "_comercial_" + i).val()) != -1) {
                                    msg_error += '<p>El <strong>Ejecutivo Comercial</strong> de la posición ' + i + ' para el servicio <strong>' + $(this).attr("id") + '</strong> en la pestaña <strong>Responsables</strong> se encuentra repetido.</p>';
                                }
                                array_lista_comercial.push($("#slct_" + div + "_comercial_" + i).val());
                            }
                        }

                        // Se valida la información del Ejecutivo de Servicio al Cliente
                        var array_lista_servicio = new Array();
                        for (var i = 1; i <= $("." + div + "_servicio_clon").length; i++) {
                            if (!$("#slct_" + div + "_servicio_" + i).val()) {
                                msg_error += '<p>Debe seleccionar el <strong>Responsables del Cliente</strong> de la posición ' + i + ' para el servicio <strong>' + $(this).attr("id") + '</strong> en la pestaña <strong>Responsables</strong> para poder crear el Cliente.</p>';
                            } else {
                                if (array_lista_servicio.indexOf($("#slct_" + div + "_servicio_" + i).val()) != -1) {
                                    msg_error += '<p>El <strong>Responsables del Cliente</strong> de la posición ' + i + ' para el servicio <strong>' + $(this).attr("id") + '</strong> en la pestaña <strong>Responsables</strong> se encuentra repetido.</p>';
                                }
                                array_lista_servicio.push($("#slct_" + div + "_servicio_" + i).val());
                            }
                        }
                    }
                });

                if (!flag_servicio) {
                    msg_error += '<p>Debe seleccionar al menos un <strong>Servicio</strong> para poder crear el Cliente.</p>';
                    AplicaFoco("");
                } else {
                    RemueveFoco("");
                }
            }
        }
        /******* Fin - Se valida el contenido del formulario *******/
        if (!msg_error) {

            // Confirmación antes de crear el cliente
            Swal.fire({
                title: '¿Crear nuevo cliente?',
                text: '¿Está seguro que desea crear este cliente con los datos ingresados?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, crear',
                cancelButtonText: 'Cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    crearCliente();
                }
            });

            if (!msg_error) {
                var mensaje = "";
                $("#nexos_messages_popup_crea").html('');
                //Crear Cliente en Ministerio de transporte
                mensajea = "Se ha creado el registro con éxito NEXOSAPP";
                $("#nexos_messages_popup_crea").append('<div role="alert" class="alert alert-success alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-check"></span></button><strong>Proceso terminado! </strong>"' + mensajea + '"!! .</div></div>');
                if ($("#slct_tipo_documento_").val() == "Juridico") {
                    valor_sede = $("#valor_sede").val();
                    documento = $("#documento").val();
                    verificacion = $("#digito_verificacion").val();
                    nombre_cliente = $("#nombre").val();
                    direccion = $("#direccion").val();
                    municipio = $("#slct_municipios_").val();
                    nombre_sede = $("#sede").val();
                    msga = "Se ha creado el registro con éxito NEXOSAPP";
                    Crear_Cliente_Rndc(documento, verificacion, nombre_cliente, direccion, municipio, nombre_sede, valor_sede);
                    Crear_Tercero_OET(documento);
                }
                mensajeb = "";
                $("#crea_cliente").animate({
                    scrollTop: 0
                }, 600);
                //crear_dato_oet(true,msga,mensajeb);
                //setTimeout(function() { location.reload(false); }, 800);
            } else {
                $("#nexos_messages_popup_crea").append('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> No fue creado el registro con éxito NEXOSAPP.</div></div>');
                $("#nexos_messages_popup_crea").append('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-check"></span></button><strong>Proceso terminado! </strong> No fue fue creado exitosamente en RNDC !! .</div></div>');
                $("#nexos_messages_popup_crea").append('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Proceso terminado!</strong> No fue creado exitosamente  OET.</div></div>');
                $("#crea_cliente").animate({
                    scrollTop: 0
                }, 600);
                //setTimeout(function() { location.reload(false); }, 800);
            }
            if (msg_error) {
                $("#btn_crea_cliente").css("display", "none");
            }
        }


        if (msg_error) {
            // // Convertir el mensaje de error en un array de líneas
            // const lineas = msg_error.split('\n').filter(linea => linea.trim() !== '');

            // // Crear elementos de lista para cada línea
            // const listaItems = lineas.map(linea =>
            //     `<li class="text-dark">${linea.replace(/^- /, '').trim()}</li>`
            // ).join('');

            // // Construir la alerta con lista
            // $("#nexos_messages_popup_crea").append(`
            //     <div class="alert alert-outline-danger d-flex p-1" role="alert">
            //         <span class="fas fa-times-circle text-danger fs-5 me-3"></span>
            //         <div class="flex-1">
            //             <strong class="text-dark">Requisitos faltantes:</strong>
            //             <ul class="mb-0 ps-3 text-dark">
            //                 ${listaItems}
            //             </ul>
            //         </div>
            //         <button class="btn-close" type="button" data-bs-dismiss="alert" aria-label="Close"></button>
            //     </div>
            // `);

            // $("#crea_cliente").animate({
            //     scrollTop: 0
            // }, 600);

            // Mostrar errores con SweetAlert
            Swal.fire({
                title: 'Requisitos faltantes',
                html: `<div class="text-start"><ul class="mb-0 ps-3">${msg_error.split('\n')
                    .filter(linea => linea.trim() !== '')
                    .map(linea => `<li>${linea.replace(/^- /, '').trim()}</li>`)
                    .join('')
                    }</ul></div>`,
                icon: 'error',
                confirmButtonText: 'Entendido',
                scrollbarPadding: false
            });

            $("#crea_cliente").animate({ scrollTop: 0 }, 600);
            return;

        }
    });

    $(".address").change(function () {
        tipovia = $("#di_tipovia").val();
        di_nomvia = $("#di_nomvia").val();
        di_letra1 = $("#di_letra1").val();
        di_prefijo1 = $("#di_prefijo1").val();
        di_letra2 = $("#di_letra2").val();
        di_cuadrante = $("#di_cuadrante").val();
        di_num1 = $("#di_num1").val();
        di_letra3 = $("#di_letra3").val();
        di_numero2 = $("#di_numero2").val();
        di_cuadrante2 = $("#di_cuadrante2").val();
        di_tipovia1 = $("#di_tipovia1").val();
        di_numero3 = $("#di_numero3").val();
        var nomenclatura = (tipovia + ' ' + di_nomvia + ' ' + di_letra1 + ' ' + di_prefijo1 + ' ' + di_letra2 + ' ' + di_cuadrante + ' ' + di_num1 + ' ' + di_letra3 + ' ' + di_numero2 + ' ' + di_cuadrante2 + ' ' + di_tipovia1 + ' ' + di_numero3);
        $("#direccion_compuesta").val(nomenclatura);
        $("#direccion").val(nomenclatura);
    });

    $("#limpiar").click(function () {
        $("#di_tipovia").prop('selected', 'false');
        $("#di_nomvia").val('');
        $("#di_letra1").attr('selected', 'false');
        $("#di_prefijo1").attr('selected', 'false');
        $("#di_letra2").attr('selected', 'false');
        $("#di_cuadrante").attr('selected', 'false');
        $("#di_num1").val('');
        $("#di_letra3").attr('selected', 'false');
        $("#di_numero2").val('');
        $("#di_cuadrante2").attr('selected', 'false');
        $("#di_tipovia1").attr('selected', 'false');
        $("#di_numero3").val('');
        $("#direccion_compuesta").val('');
        $("#direccion").val('');
    });

    document.addEventListener("change", async e => {
        if (e.target.matches("#Complement") || e.target.matches("#Complement *")) {
            if (e.target.checked) {
                $("#div_complemento").show();
            } else {
                $("#div_complemento").hide();
            }
        }
    });

    $(".servicio").click(function () {
        $("#info_responsables").html("");
        let flag_content = false;
        let form_content = "";

        $(".servicio").each(function () {
            if ($(this).is(":checked")) {
                flag_content = true;
                const div = $(this).attr("id").replace(/ /g, "_").toLowerCase();
                const idOriginal = $(this).attr("id");

                form_content += `
                <h4>${idOriginal}</h4>
                <div class="col-sm-6" id="${div}_comercial">
                    <div class="col-sm-12">
                        <p><strong>Ejecutivo Comercial</strong></p>
                    </div>
                    <div class="icon col-sm-12 div_${div}_comercial my-2">
                        <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1 hint--top-right" data-hint="Agregar Ejecutivo Comercial" id="btn_${div}_agrega_comercial">
                            <span class="far fa-plus-square"></span>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 hint--top-right" data-hint="Quitar Ejecutivo Comercial" id="btn_${div}_quita_comercial">
                            <span class="fas fa-trash-alt"></span>
                        </button>
                    </div>
                    <div class="col-sm-12 ${div}_comercial_clon" id="form_${div}_comercial_1">
                        <div class="form-group mb-2">
                            ${thisHtmlSelect(`${div}_comercial_1`, `${div}_comercial_1`, "1", "13,7,22,23,24", "")}
                        </div>
                    </div>
                </div>
                <div class="col-sm-6" id="${div}_servicio">
                    <div class="col-sm-12">
                        <p><strong>Responsables del Cliente</strong></p>
                    </div>
                    <div class="icon col-sm-12 div_${div}_servicio my-2">
                        <button type="button" class="btn btn-success btn-sm me-1 px-1 py-1 hint--top-right" data-hint="Agregar Ejecutivo de Servicio al Cliente" id="btn_${div}_agrega_servicio">
                            <span class="far fa-plus-square"></span>
                        </button>
                        <button type="button" class="btn btn-danger btn-sm me-1 px-1 py-1 hint--top-right" data-hint="Quitar Ejecutivo de Servicio al Cliente" id="btn_${div}_quita_servicio">
                            <span class="fas fa-trash-alt"></span>
                        </button>
                    </div>
                    <div class="col-sm-12 ${div}_servicio_clon" id="form_${div}_servicio_1">
                        <div class="form-group mb-2">
                            ${thisHtmlSelect(`${div}_servicio_1`, `${div}_servicio_1`, "1", "5,6,7,8,9,10,11,12,22,23,24,25,26", "")}
                        </div>
                    </div>
                </div>
                <div class="row"></div>
            `;
            }
        });

        let content = `
        <div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible">
            <div class="icon">
                <span class="mdi mdi-close"></span>
            </div>
            <div class="message">
                <strong>Error!</strong>
                <p>No se ha seleccionado ningún servicio para el cliente...</p>
            </div>
        </div>
    `;

        if (flag_content) {
            content = form_content;
        }

        $("#info_responsables").html(content);

        // Funciones dinámicas
        $(".servicio").each(function () {
            if ($(this).is(":checked")) {
                const div = $(this).attr("id").replace(/ /g, "_").toLowerCase();
                formDinamicoResponsables(`${div}_comercial_clon`, `btn_${div}_agrega_comercial`, `btn_${div}_quita_comercial`, `div_${div}_comercial`, `form_${div}_comercial_`, `${div}_comercial_`, `slct_${div}_comercial_`);
                formDinamicoResponsables(`${div}_servicio_clon`, `btn_${div}_agrega_servicio`, `btn_${div}_quita_servicio`, `div_${div}_servicio`, `form_${div}_servicio_`, `${div}_servicio_`, `slct_${div}_servicio_`);
            }
        });
    });

    function thisHtmlSelect(id, name, id_cliente, id_perfil, id_usuario) {
        let htmlSelect = `<select id="${id}" name="${name}"><option>Cargando...</option></select>`;

        $.ajax({
            url: $('#base_url').val() + 'usuarios/listar',
            method: "POST",
            data: {
                name: name,
                id: id,
                id_cliente: id_cliente,
                id_perfil: id_perfil,
                id_usuario: id_usuario
            },
            async: false,
            success: function (response) {
                htmlSelect = response; // el backend ya manda el <select>
            },
            error: function () {
                htmlSelect = `<select id="${id}" name="${name}"><option>Error al cargar</option></select>`;
            }
        });

        return htmlSelect;
    }
}

/******** FUNCIÓN PARA ADICIÓN DINÁMICA DE RESPONSABLES DEL CLIENTE ********/
function formDinamicoResponsables(clon, btn_agrega, btn_quita, div, form, slct_name, slct_id, cant) {

    if ($('.' + clon).length == 1) {
        $('#' + btn_quita).attr('disabled', 'disabled');
    }

    if (cant) {
        if ($('#' + cant).val() == $('.' + clon).length) {
            $('#' + btn_agrega).attr('disabled', 'disabled');
        }
    }

    $('#' + btn_agrega).click(function () {
        var num = $('.' + clon).length;
        var newNum = new Number(num + 1);

        // create the new element via clone(), and manipulate it's ID using newNum value
        var newElem = $('#' + form + num).clone().attr('id', form + newNum);

        newElem.children('#' + div + num).attr('id', div + newNum);

        // insert the new element after the last "duplicatable" input field
        $('#' + form + num).after(newElem);
        $('#' + form + newNum + ' #' + slct_id + num).attr('id', slct_id + newNum).attr('name', slct_name + newNum).val("");

        // // enable the "remove" button
        $('#' + btn_quita).removeAttr("disabled");

        // business rule: you can only add 100 names
        if (newNum == ($('#' + slct_id + "1" + ' > option').length - 1))
            $('#' + btn_agrega).attr('disabled', 'disabled');
    });

    // Programación del botón de quitar socio
    $('#' + btn_quita).click(function () {
        num = $('.' + clon).length;
        alert(num);

        $('#' + form + num).remove();

        // enable the "add" button
        $('#' + btn_agrega).removeAttr("disabled");

        // if only one element remains, disable the "remove" button
        if (num - 1 == 1) {
            $('#' + btn_quita).attr('disabled', 'disabled');
        }
    });
}


// function Listar_Clientes() {
//     // Ocultar/mostrar contenedores
//     // $('#contenedor_anticipo').hide();
//     // $('#contenedor_datos').hide();
//     // $('#tabla_datos').show();
//     // $('.campov').val('');
//     // $('#tabla_remesas').empty();
//     // $('#tb_anticipo').empty();

//     // const ini = $('#finicial').val();
//     // const fin = $('#ffinal').val();
//     const totalColumnas = $('#manfhead th').length || 7;

//     // Mostrar mensaje de carga
//     $('#clientebody').html(`
//     <tr>
//       <td colspan="${totalColumnas}" class="text-center py-4">
//         <div class="spinner-border text-success" role="status"></div>
//         <p class="mt-2 text-muted">Consultando Cliente...</p>
//       </td>
//     </tr>
//   `);

//     $.post(
//         $('#base_url').val() + 'clientes/listar_clientes',
//         // $('#base_url').val() + 'clientes/listar_clientes',
//         // `finicia=${ini}&ffinal=${fin}`,
//         function (data) {
//             $('#clientebody').empty();

//             console.log("🚀 ~ Listar_Clientes ~ data:", data)
//             if (data && data.length > 0) {
//                 $('.contador').text(data.total_manifiestos);

//                 $('#manfbody').html(filas.join(''));
//             } else {
//                 $('#clientebody').html(`
//           <tr>
//             <td colspan="${totalColumnas}" class="text-center text-muted py-4">
//               No se encontraron manifiestos para el rango seleccionado.
//             </td>
//           </tr>
//         `);
//             }
//         },
//         'json'
//     ).fail(function () {
//         $('#clientebody').html(`
//       <tr>
//         <td colspan="${totalColumnas}" class="text-center text-danger py-4">
//           Error al cargar los manifiestos. Intenta nuevamente.
//         </td>
//       </tr>
//     `);
//     });
// }

// Función para listar clientes con AJAX
function Listar_Clientes() {
    const totalColumnas = $('#manfhead th').length || 7;

    // Mostrar mensaje de carga
    $('#clientebody').html(`
        <tr>
            <td colspan="${totalColumnas}" class="text-center py-4">
                <div class="spinner-border text-success" role="status"></div>
                <p class="mt-2 text-muted">Consultando Cliente...</p>
            </td>
        </tr>
    `);

    $.ajax({
        url: $('#base_url').val() + 'clientes/listar_clientes',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            $('#clientebody').empty();

            if (data && data && data.length > 0) {
                // Asumiendo que tienes access y ssn_id_perfil definidos
                const access = { editar: 1, eliminar: 1 }; // Ajustar según necesidades
                const ssn_id_perfil = '1'; // Ajustar según necesidades

                const rendered = renderClientesTable(data, access, ssn_id_perfil);
                $('#clientebody').html(rendered.tableContent);
                $('body').append(rendered.vista);

                // Actualizar contador si existe
                if ($('.contador').length) {
                    $('.contador').text(data.length);
                }
            } else {
                $('#clientebody').html(`
                    <tr>
                        <td colspan="${totalColumnas}" class="text-center text-muted py-4">
                            No se encontraron clientes.
                        </td>
                    </tr>
                `);
            }
        },
        error: function () {
            $('#clientebody').html(`
                <tr>
                    <td colspan="${totalColumnas}" class="text-center text-danger py-4">
                        Error al cargar los clientes. Intenta nuevamente.
                    </td>
                </tr>
            `);
        }
    });
}

function renderClientesTable(arrayClientes, access, ssn_id_perfil) {
    let tableContent = '';
    let vista = '';
    let jsScripts = '';

    arrayClientes.forEach((value, key) => {
        // Código cliente
        let _cod_cliente = '';
        if (value.cod_cliente) {
            _cod_cliente = '(' + value.cod_cliente + ')';
        }

        let id_cliente = '';
        if (value.id) {
            id_cliente = value.id;
        }

        // Botón editar cliente según perfil
        let _btn_editar_cliente = '';
        if (access.editar == 1) {
            switch (ssn_id_perfil) {
                case '14':
                    _btn_editar_cliente = `
                        <a class="btn btn-warning btn-sm me-1 px-1 py-1" href="javascript:void(0)" onclick="editarCliente(${value[0]}, '${value.nombre} ${_cod_cliente}', ${ssn_id_perfil})" class="cell-detail hint--top-left" data-hint="Editar Documentos Cliente">
                            <i class="fas fa-file-alt" data-toggle="modal" data-target="#edita_cliente"></i>
                        </a>
                    `;
                    break;
                default:
                    _btn_editar_cliente = `
                        <a class="btn btn-info btn-sm me-1 px-1 py-1" href="javascript:void(0)" onclick="editarInfoCliente(${value.id}, '${value.nombre} ${_cod_cliente}', ${ssn_id_perfil})" class="cell-detail hint--top-left" data-hint="Editar Cliente">
                            <i class="fas fa-edit" data-toggle="modal" data-target="#edita_info_cliente"></i>
                        </a>
                        <a class="btn btn-warning btn-sm me-1 px-1 py-1" href="javascript:void(0)" onclick="editarCliente(${value.id}, '${value.nombre} ${_cod_cliente}', ${ssn_id_perfil})" class="cell-detail hint--top-left" data-hint="Editar Documentos Cliente">
                            <i class="fas fa-file-alt" data-toggle="modal" data-target="#edita_cliente"></i>
                        </a>
                        <a class="btn btn-secondary btn-sm me-1 px-1 py-1" href="javascript:void(0)" onclick="editarContratoCliente(${value.id}, '${value.nombre}', ${value.documento})" class="cell-detail hint--top-left" data-hint="Editar Contratos">
                            <i class="fas fa-file-contract" data-toggle="modal" data-target="#edita_contrato_cliente"></i>
                        </a>
                    `;
                    break;
            }
        }

        // Botón eliminar si tiene permiso
        if (access.eliminar == 1) {
            _btn_editar_cliente += `
                <a class="btn btn-danger btn-sm me-1 px-1 py-1 cell-detail hint--top-left" data-hint="Deshabilitar Cliente">
                    <i class="fas fa-times-circle" data-toggle="modal" data-target="#elimina_${value.id}"></i>
                </a>
            `;
        }

        // Agregar popup de eliminación (simplificado)
        vista += createAlertModal(value.id, "Realmente desea inactivar este cliente?", "danger");

        const tp = value.tipo_documento;
        const numero = value.documento;
        const digito = value.digito_verificacion;

        let _col_actions = `
            <td class="actions">
                <div class="btn-group btn-group-sm" role="group" aria-label="...">
                    <a class="btn btn-primary btn-sm me-1 px-1 py-1" href="javascript:void(0)" onclick="verCliente(${value.id}, '${value.nombre} ${_cod_cliente}', '${value.tipo_documento}', ${numero}, ${digito})" class="cell-detail hint--top-left" data-hint="Ver Datos Cliente">
                        <i class="fas fa-eye" data-toggle="modal" data-target="#ver_cliente"></i>
                    </a>
                    ${_btn_editar_cliente}
                </div>
            </td>
        `;

        let _rndc_status = '';
        if (value.rndc_id) {
            _rndc_status = '<strong class="text-success">RNDC</strong>';
        }

        let _btn_status = "nexos-txt-success";
        let title = "Inactivo";

        switch (value.estado) {
            case 0:
                _btn_status = "nexos-txt-danger";
                _col_actions = `
                    <td class="actions">
                        <a class="cell-detail hint--top-left" data-hint="Habilitar Cliente">
                            <i class="fas fa-check-circle" data-toggle="modal" data-target="#habilita_${value.id}" title="Cliente Habilitado"></i>
                        </a>
                    </td>
                `;
                vista += createAlertModal(value.id, "Realmente desea habilitar este elemento?", "warning");
                break;
            case 1:
                _btn_status = "nexos-txt-success";
                title = "Activo";
                break;
            case 2:
                _btn_status = "nexos-txt-warning";
                title = "";
                break;
            default:
                _btn_status = "nexos-txt-danger";
                break;
        }

        // Barra de progreso de documentos
        let _progress_bar_color = "progress-bar-success";
        let _porcentaje = 100;
        if (value.OBLIGATORIOS > value.REGISTRADOS) {
            _progress_bar_color = "progress-bar-danger";
            _porcentaje = Math.floor((value.REGISTRADOS * 100) / value.OBLIGATORIOS);
        }

        // Construir fila de la tabla
        tableContent += `
            <tr>
                <td class="${_btn_status}" title="${title}">
                    <center>
                        <i class="fas fa-circle"></i>
                    </center>
                </td>
                <td class="cell-detail md-trigger">
                    <span>${_rndc_status} ${value.nombre}</span>
                    <span class="cell-detail-description">${value.documento}-${value.digito_verificacion}</span>
                    <span class="cell-detail-description">${value.cod_cliente}</span>
                </td>
                <td class="cell-detail md-trigger">
                    <span>${value.direccion}</span>
                    <span class="cell-detail-description">${value.municipio} (${value.depto} - ${value.pais})</span>
                </td>
                <td class="cell-detail md-trigger">
                    <span>${value.telefono}</span>
                    <span class="cell-detail-description">${value.email}</span>
                </td>
                <td class="milestone">
                    <span class="progress-value">${_porcentaje}%</span>
                    <div class="progress">
                        <div style="width: ${_porcentaje}%;" class="progress-bar ${_progress_bar_color}"></div>
                    </div>
                </td>
                <td>${value.nombre_empresa}</td>
                ${_col_actions}
            </tr>
        `;
    });

    return {
        tableContent: tableContent,
        vista: vista,
        jsScripts: jsScripts
    };
}

// Función auxiliar para crear modales de alerta
function createAlertModal(id, message, type) {
    return `
        <div class="modal fade" id="${type === 'danger' ? 'elimina' : 'habilita'}_${id}" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header modal-header-${type}">
                        <h4 class="modal-title">Confirmación</h4>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-${type}" onclick="${type === 'danger' ? 'inactivar' : 'habilitar'}Cliente(${id})">Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function verCliente(id_cliente, nombre, tipodoc, numero, digitov) {
    // console.log("Entro en función verCliente");
    $("#ver_cliente_title").html("Información Cliente - " + nombre);
    $("#contenidoeditacliente").html("");
    $("#contenidoeditainfocliente").html("");
    $("#contenidovercliente").html("");
    $("#nexos_messages_popup_ver").html("");
    var msg_error = "";
    var params = {
        id: id_cliente
    }
    $.ajaxSetup({
        async: false
    });
    $.ajax({
        url: $("#base_url").val() + "libs/clientes_ajax.php?action=verCliente",
        type: 'POST',
        data: params,
        cache: false,
        dataType: 'json',
        beforeSend: function (jqXHR, settings) {
            $(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#base_url").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $(".nexos-messages").html('');
            msg_error += "<p>" + jqXHR.responseText + "</p>";
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        },
        success: function (data, textStatus, jqXHR) {
            $(".nexos-messages").html('');
            // console.log(data);
            if (!msg_error) {
                $("#nexos_messages_popup_ver").html("");
                if (data.content) {
                    $("#contenidovercliente").html(data.content);
                }
                //INVOCAR FUNCIONES PARA CONSULTAS DE TRANSIMISIONES
                Consultar_Dato_Rndc(tipodoc, numero, digitov);
                Consultar_Dato_Oet(tipodoc, numero, digitov);
            }
        }
    });
    if (msg_error) {
        $("#nexos_messages_popup_ver").html('<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-check"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' + msg_error + '</div></div>');
        $("#edita_cliente").animate({
            scrollTop: 0
        }, 600);
    }
    $.ajaxSetup({
        async: true
    });
}

function Consultar_Dato_Rndc(tipodoc, numero, digitov) {
    $("#panel_rndc").html('');
    var paquete_transmite = 'documento=' + numero + '&tdoc=' + tipodoc + '&digitove=' + digitov;
    $.post($("#base_url").val() + 'web_service/Consulta_Tercero_Rndc', paquete_transmite, function (data) {
        var tablas_locales = "";
        if (data.status == "true") {
            $("#panel_rndc").html('<p class="text-center text-success">' + data.resultado + '</p>');
        } else if (data.status == "false") {
            $("#panel_rndc").html('<p class="text-center text-danger">' + data.resultado + '</p>');
        }
    }, 'json');
}

function Consultar_Dato_Oet(tipo, numero, digito) {
    $("#panel_oet").html('');
    clase = 1;
    recurso = 1;
    valor = '&dato_recurso=' + numero;
    filtro = 1; //cliente
    var paquete = 'clase_recurso=' + recurso + '&recurso=' + filtro + valor;
    //Consulta_Recurso_Avansat
    $.post($("#base_url").val() + 'integrar_oet/Consulta_Recurso', paquete, function (data) {
        console.log(data);
        if (data.status == true || data.status == "true") {
            $("#panel_oet").html('<p class="text-center text-success">' + data.resultado + '</p>');
        } else if (data.status == false || data.status == "false") {
            $("#panel_oet").html('<p class="text-center text-danger">' + data.resultado + '</p>');
        }
    }, 'json');
}

function crearCliente() {
    var params = new FormData();
    params.append('tipo_documento', $("#slct_tipo_documento_").val());
    params.append('regimen', $("#slct_regimen_").val());
    params.append('documento', $("#documento").val());
    params.append('digito_verificacion', $("#digito_verificacion").val());
    params.append('numero_documento', $("#numero_formulario").val());
    params.append('fecha_expedicion', $("#rut_expedicion").val());
    params.append('ciiu_principal', $("#ciiu_principal").val());
    params.append('actividad_aduanera', $("#actividad_aduanera").val());
    params.append('url_rut', $('#rut_file')[0].files[0]);
    params.append('nombre', $("#nombre").val());
    params.append('tipo_sociedad', $("#slct_tipo_sociedad_").val());
    params.append('sigla', $("#sigla").val());
    params.append('actividad_cliente', $("#actividad_cliente").val());

    params.append('ciudad', $("#slct_municipios_").val()); //municipio sede

    params.append('codigo_postal', $("#codigo_postal").val()); //codigo_postal sede
    params.append('direccion', $("#direccion").val()); //direccion sede
    params.append('telefono', $("#telefono").val()); //tel sede
    params.append('email', $("#email").val()); //email sede
    params.append('indicaciones_llegada', $("#indicaciones_llegada").val()); //sede indicaciones

    params.append('name_sede', $("#sede").val());
    params.append('encargado_sede', $("#sede_encargado").val()); //sede encargado
    params.append('atencion_sede', $("#sede_atencion").val()); //atencion
    params.append('factura_sede', $("#sede_cond_factura").val()); //condicion facturacion
    params.append('tributaria', $("#slct_sede_otributaria").val()); //sede obligcion
    params.append('pago_sede', $("#sede_cond_pago").val()); //sede pago
    params.append('restri_sede', $("#sede_restriccion").val()); //restriccion
    params.append('instruccion_sede', $("#sede_instruccion").val()); //sede instruccion
    params.append('empresa_cliente', $("#slct_cliente_empresa").val()); //empresa cliente


    // Se valida la información de los responsables del cliente
    $(".servicio").each(function () {
        if ($(this).is(":checked")) {
            var div = $(this).attr("id").replace(/ /g, "_").toLowerCase();
            params.append(div, div);

            // Se valida la información del Ejecutivo Comercial
            for (var i = 1; i <= $("." + div + "_comercial_clon").length; i++) {
                params.append("slct_" + div + "_comercial_" + i, $("#slct_" + div + "_comercial_" + i).val());
            }

            // Se valida la información del Ejecutivo de Servicio al Cliente
            for (var i = 1; i <= $("." + div + "_servicio_clon").length; i++) {
                params.append("slct_" + div + "_servicio_" + i, $("#slct_" + div + "_servicio_" + i).val());
            }
        }
    });

    // Mostrar loader
    Swal.fire({
        title: 'Creando cliente',
        html: 'Por favor espere mientras procesamos su solicitud...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    var valor_sede = "";
    $.ajax({
        url: $("#base_url").val() + "libs/clientes_ajax.php?action=crearCliente",
        type: 'POST',
        contentType: false,
        data: params,
        cache: false,
        dataType: 'json',
        processData: false,
        success: function (data) {
            Swal.close();

            if (data.success) {
                // Cliente creado exitosamente
                let promises = [];
                let successMessages = ['Cliente creado exitosamente en NEXOSAPP'];

                if ($("#slct_tipo_documento_").val() == "Juridico") {
                    const valor_sede = $("#valor_sede").val();
                    const documento = $("#documento").val();
                    const verificacion = $("#digito_verificacion").val();
                    const nombre_cliente = $("#nombre").val();
                    const direccion = $("#direccion").val();
                    const municipio = $("#slct_municipios_").val();
                    const nombre_sede = $("#sede").val();

                    // Agregar procesos adicionales
                    promises.push(
                        Crear_Cliente_Rndc(documento, verificacion, nombre_cliente, direccion, municipio, nombre_sede, valor_sede)
                            .then(() => successMessages.push('Cliente creado en RNDC'))
                            .catch(() => successMessages.push('Error al crear en RNDC'))
                    );

                    promises.push(
                        Crear_Tercero_OET(documento)
                            .then(() => successMessages.push('Tercero creado en OET'))
                            .catch(() => successMessages.push('Error al crear en OET'))
                    );
                }

                // Esperar a que terminen todos los procesos
                Promise.all(promises).finally(() => {
                    Swal.fire({
                        title: '¡Éxito!',
                        html: successMessages.join('<br>'),
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        location.reload();
                    });
                });
            } else {
                // Error al crear cliente
                Swal.fire({
                    title: 'Error',
                    text: data.message || 'No se pudo crear el cliente',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }
        },
        error: function (jqXHR) {
            Swal.fire({
                title: 'Error',
                html: jqXHR.responseText || 'Error en la solicitud',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
        }
    });

    // $.ajax({
    //     url: $("#id_url_ajax").val() + "libs/clientes_ajax.php?action=crearCliente",
    //     type: 'POST',
    //     contentType: false,
    //     data: params,
    //     cache: false,
    //     dataType: 'json',
    //     // dataType: false,
    //     processData: false,
    //     beforeSend: function (jqXHR, settings) {
    //         $(".nexos-messages").html('<div id="clock" role="modal" class="modal" style="display: block; background-color: rgba(0,0,0,0.5););"><div style="text-align: center; margin-top: 10%; background-color: #fff; padding: 30px; min-width: 20%; max-width: 60%; border-radius: 5px; border: 1px solid rgba(0,0,0,0.8); margin: 10% auto;"><img src="' + $("#id_url_ajax").val() + 'public/img/nexos_loading.gif" height="60" width="60"><h3>Solicitud en proceso...</h3><h4>Por favor, espere unos segundos.</h4></div></div>');
    //     },
    //     error: function (jqXHR, textStatus, errorThrown) {
    //         $(".nexos-messages").html('');
    //         msg_error += "<p>" + jqXHR.responseText + "</p>";
    //         console.log(jqXHR);
    //         console.log(textStatus);
    //         console.log(errorThrown);
    //     },
    //     success: function (data, textStatus, jqXHR) {
    //         $(".nexos-messages").html('');
    //         console.log('PRUEBA' + data.result);
    //         $("#valor_sede").val(data.result);
    //     }
    // });
    // $.ajaxSetup({
    //     async: true
    // });
}
function AplicaFoco(idelemento) {
    $(idelemento).focus().css("background-color", "rgb(254,242,181)");
}

function RemueveFoco(idelemento) {
    $(idelemento).blur().css("background-color", "white");
}

function direccion_sede(conteo) {
    $("#div_mascaras_sede" + conteo + "").toggle();
}

$(".address_s").change(function () {
    tipovia = $("#di_tipovia").val();
    di_nomvia = $("#di_nomvia").val();
    di_letra1 = $("#di_letra1").val();
    di_prefijo1 = $("#di_prefijo1").val();
    di_letra2 = $("#di_letra2").val();
    di_cuadrante = $("#di_cuadrante").val();
    di_num1 = $("#di_num1").val();
    di_letra3 = $("#di_letra3").val();
    di_numero2 = $("#di_numero2").val();
    di_cuadrante2 = $("#di_cuadrante2").val();
    di_tipovia1 = $("#di_tipovia1").val();
    di_numero3 = $("#di_numero3").val();
    var nomenclatura = (tipovia + ' ' + di_nomvia + ' ' + di_letra1 + ' ' + di_prefijo1 + ' ' + di_letra2 + ' ' + di_cuadrante + ' ' + di_num1 + ' ' + di_letra3 + ' ' + di_numero2 + ' ' + di_cuadrante2 + ' ' + di_tipovia1 + ' ' + di_numero3);
    $("#direccion_compuesta").val(nomenclatura);
    $("#direccion").val(nomenclatura);
});

function Cambia_Direccion(id) {
    tipovia = $("#di_tipoviasd" + id).val();
    di_nomvia = $("#di_nomviasd" + id).val();
    di_letra1 = $("#di_letra1sd" + id).val();
    di_prefijo1 = $("#di_prefijo1sd" + id).val();
    di_letra2 = $("#di_letra2sd" + id).val();
    di_cuadrante = $("#di_cuadrantesd" + id).val();
    di_num1 = $("#di_num1sd" + id).val();
    di_letra3 = $("#di_letra3sd" + id).val();
    di_numero2 = $("#di_numero2sd" + id).val();
    di_cuadrante2 = $("#di_cuadrante2sd" + id).val();
    di_tipovia1 = $("#di_tipovia1sd" + id).val();
    di_numero3 = $("#di_numero3sd" + id).val();
    var nomenclatura = (tipovia + ' ' + di_nomvia + ' ' + di_letra1 + ' ' + di_prefijo1 + ' ' + di_letra2 + ' ' + di_cuadrante + ' ' + di_num1 + ' ' + di_letra3 + ' ' + di_numero2 + ' ' + di_cuadrante2 + ' ' + di_tipovia1 + ' ' + di_numero3);
    $("#direccion_compuesta_sd" + id).val(nomenclatura);
    $("#dire" + id).val(nomenclatura);
}

function Validar_Telefono(telefono) {
    // Acceder al valor del campo de entrada
    var telefonoValue = telefono.target.value;
    var telefonoValido = validarTelefono(telefonoValue);
    var mensajeTelefono = document.getElementById("mensajeTelefono");
    if (telefonoValido) {
        // $("#telefono").css("color","green");
        mensajeTelefono.textContent = "Número de teléfono válido";
        mensajeTelefono.style.color = "green";
        $("#footer_boton").css("display", "block");
    } else {
        // $("#telefono").css("color","red");
        mensajeTelefono.textContent = "El número de teléfono debe tener 10 dígitos";
        mensajeTelefono.style.color = "red";
        $("#footer_boton").css("display", "none");
    }
}

function Validar_Correo(correo) {
    // var inputCorreo = document.getElementById("correo"); // Reemplaza "correo" con el id de tu campo de correo
    var correos = correo.target.value;

    var mensajeResultado = document.getElementById("mensajeCorreo"); // Reemplaza "mensajeResultado" con el id de tu elemento donde mostrarás el resultado

    if (validarCorreo(correos)) {
        mensajeResultado.textContent = "Correo válido";
        mensajeResultado.style.color = "green";
        $("#footer_boton").css("display", "block");
    } else {
        mensajeResultado.textContent = "Correo no válido";
        mensajeResultado.style.color = "red";
        $("#footer_boton").css("display", "none");
    }
}

function Validar_Nombre(nombre) {
    //nombre del tercero
    var nombreValue = nombre.target.value;
    var tipo = $("#slct_tipo_documento_").val();
    var NombreValido = validarLongitud(nombreValue, 3, 60);
    var mensajeResultado = document.getElementById("mensajeNombre");
    if (NombreValido == true) {
        mensajeResultado.textContent = "Nombre válido";
        mensajeResultado.style.color = "green";
        $("#footer_boton").css("display", "block");
    } else if (NombreValido == false) {
        mensajeResultado.textContent = "El Nombre debe tener 60 caracteres máximo";
        mensajeResultado.style.color = "red";
        $("#footer_boton").css("display", "none");
    }
}

function Validar_Documento(documento) {
    var tipodocumento = $("#slct_tipo_documento_").val();
    var mensajeResultado = document.getElementById("mensajeDocumento");
    if (!tipodocumento) {
        mensajeResultado.textContent = "Seleccione tipo de documento";
        mensajeResultado.style.color = "red";
        $("#footer_boton").css("display", "none");
    } else if (tipodocumento == 'Natural') {
        var documentoValue = documento.target.value;
        var NumeroValido = validarLongitud(documentoValue, 6, 12);
        if (NumeroValido == true) {
            mensajeResultado.textContent = "Número de documento válido";
            mensajeResultado.style.color = "green";
            $("#footer_boton").css("display", "block");
        } else if (NumeroValido == false) {
            mensajeResultado.textContent = "El Número de documento debe tener máximo 12 dígitos";
            mensajeResultado.style.color = "red";
            $("#footer_boton").css("display", "none");
        }
    } else if (tipodocumento == 'Juridico') {
        var documentoValue = documento.target.value;
        var NumeroValido = validarLongitud(documentoValue, 9, 9);
        if (NumeroValido == true) {
            mensajeResultado.textContent = "Número de documento válido";
            mensajeResultado.style.color = "green";
            $("#footer_boton").css("display", "block");
        } else if (NumeroValido == false) {
            mensajeResultado.textContent = "El Número de documento debe tener 9 dígitos";
            mensajeResultado.style.color = "red";
            $("#footer_boton").css("display", "none");
        }
    }
}

function Valida_Longitud(campo) {
    var campoValue = campo.target.value;
    var NumeroValido = validarLongitud(campoValue, 12, 12);
    var idms = "mensajeRut";
    var mensajeResultado = document.getElementById(idms);
    if (NumeroValido == true) {
        mensajeResultado.textContent = "Número de Rut válido";
        mensajeResultado.style.color = "green";
        $("#footer_boton").css("display", "block");
    } else if (NumeroValido == false) {
        mensajeResultado.textContent = "El Número de Rut debe tener máximo 12 dígitos";
        mensajeResultado.style.color = "red";
        $("#footer_boton").css("display", "none");
    }
}

function Valida_Sede(nombre) {
    var campoValue = nombre.target.value;
    var NumeroValido = validarLongitud(campoValue, 1, 20);
    var mensajeResultado = document.getElementById("mensajesede");
    if (NumeroValido == true) {
        mensajeResultado.textContent = "Nombre válido";
        mensajeResultado.style.color = "green";
        $("#footer_boton").css("display", "block");
    } else if (NumeroValido == false) {
        mensajeResultado.textContent = "El Nombre debe tener máximo 20 dígitos";
        mensajeResultado.style.color = "red";
        $("#footer_boton").css("display", "none");
    }
}

function calculaCapacidadEndeudamiento() {
    $("#finanzas_capacidad_endeudamiento").val("");
    var finanzas_ingreso_mensual = $("#finanzas_ingreso_mensual").val().split('.').join('');
    var finanzas_pasivo_corriente = $("#finanzas_pasivo_corriente").val().split('.').join('');
    var finanzas_pasivo_no_corriente = $("#finanzas_pasivo_no_corriente").val().split('.').join('');

    if (finanzas_ingreso_mensual && finanzas_pasivo_corriente && finanzas_pasivo_no_corriente && finanzas_ingreso_mensual > 0 && finanzas_pasivo_corriente > 0 && finanzas_pasivo_no_corriente > 0) {
        var endeudamiento = finanzas_ingreso_mensual - finanzas_pasivo_corriente - finanzas_pasivo_no_corriente;
        $("#finanzas_capacidad_endeudamiento").val(endeudamiento);
    }
}