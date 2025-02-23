$(document).ready(function () {
  //cargar select origen y destino del modal
  // var url = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
  // origen_ruta();
  // destino_ruta();
  // function origen_ruta() {
  //   // alert('origen');
  //   /*$("#origen_c").select2({
  // 	 width:'80%'
  // });*/
  //   var datos = {
  //     action: "cargar_origen",
  //   };
  //   $.ajax({
  //     url: url,
  //     type: "POST",
  //     data: datos,
  //     dataType: "json",
  //     success: function (data) {
  //       console.log("trajo origen");
  //       data.result.forEach(function (element, index) {
  //         $("#origen_c").append('<option value="' + element.id + '">' + element.municipio + "-" + element.depto + "</option>");
  //       });
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log("no trajo origen");
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }
  // function destino_ruta() {
  //   // alert('destino');
  //   /*$("#destino_c").select2({
  // 	 width:'80%'
  // });*/
  //   var datos = {
  //     action: "cargar_destino",
  //   };
  //   $.ajax({
  //     url: url,
  //     type: "POST",
  //     data: datos,
  //     dataType: "json",
  //     success: function (data) {
  //       console.log("trajo destino");
  //       data.result.forEach(function (element, index) {
  //         $("#destino_c").append('<option value="' + element.id + '">' + element.municipio + "-" + element.depto + "</option>");
  //       });
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log("no trajo destino");
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // }
  // $("#origen_c").change(function () {
  //   var valor = $("#origen_c").val();
  //   var dato = {
  //     id: valor,
  //     action: "cordenadas_municipios",
  //   };
  //   $.ajax({
  //     url: url,
  //     type: "POST",
  //     data: dato,
  //     dataType: "json",
  //     success: function (data) {
  //       $("#la_ori").val("");
  //       $("#long_ori").val("");
  //       if (data) {
  //         $("#la_ori").val(data.result[0].latitud);
  //         $("#long_ori").val(data.result[0].longitud);
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log("no hay cordenadas");
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // });
  // $("#destino_c").change(function () {
  //   var valor = $("#destino_c").val();
  //   var dato = {
  //     id: valor,
  //     action: "cordenadas_municipios",
  //   };
  //   $.ajax({
  //     url: url,
  //     type: "POST",
  //     data: dato,
  //     dataType: "json",
  //     success: function (data) {
  //       $("#la_des").val("");
  //       $("#long_des").val("");
  //       if (data) {
  //         $("#la_des").val(data.result[0].latitud);
  //         $("#long_des").val(data.result[0].longitud);
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log("no hay cordenadas");
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // });
  // $("#origen_e").change(function () {
  //   var valor = $("#origen_e").val();
  //   var dato = {
  //     id: valor,
  //     action: "cordenadas_municipios",
  //   };
  //   $.ajax({
  //     url: url,
  //     type: "POST",
  //     data: dato,
  //     dataType: "json",
  //     success: function (data) {
  //       $("#vla_ori_e").val();
  //       $("#vlo_ori_e").val();
  //       if (data) {
  //         $("#vla_ori_e").val(data.result[0].latitud);
  //         $("#vlo_ori_e").val(data.result[0].longitud);
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log("no hay cordenadas");
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // });
  // $("#destino_e").change(function () {
  //   var valor = $("#destino_e").val();
  //   var dato = {
  //     id: valor,
  //     action: "cordenadas_municipios",
  //   };
  //   $.ajax({
  //     url: url,
  //     type: "POST",
  //     data: dato,
  //     dataType: "json",
  //     success: function (data) {
  //       $("#vla_des_e").val("");
  //       $("#vlo_des_e").val("");
  //       if (data) {
  //         $("#vla_des_e").val(data.result[0].latitud);
  //         $("#vlo_des_e").val(data.result[0].longitud);
  //       }
  //     },
  //     error: function (jqXHR, textStatus, errorThrown) {
  //       console.log("no hay cordenadas");
  //       console.log(jqXHR);
  //       console.log(textStatus);
  //       console.log(errorThrown);
  //     },
  //   });
  // });
  //guardar ruta
  // $("#btn_guadarruta").click(function () {
  //   if (window.confirm("¿Estas segurdo de crear la ruta?")) {
  //     var msg_error = "";
  //     if (!$("#origen_c").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Origen</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#origen_c");
  //     } else {
  //       RemueveFoco("#origen_c");
  //     }
  //     if (!$("#destino_c").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Destino</strong> para poder crear la ruta.</p>";
  //       AplicaFoco("#destino_c");
  //     } else {
  //       RemueveFoco("#destino_c");
  //     }
  //     if (!$("#observa_c").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Observación</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#observa_c");
  //     } else {
  //       RemueveFoco("#observa_c");
  //     }
  //     if (!$("#la_ori").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Latitud origen</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#la_ori");
  //     } else {
  //       RemueveFoco("#la_ori");
  //     }
  //     if (!$("#la_des").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Latitud destino</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#la_des");
  //     } else {
  //       RemueveFoco("#la_des");
  //     }
  //     if (!$("#long_ori").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Longitud origen</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#long_ori");
  //     } else {
  //       RemueveFoco("#long_ori");
  //     }
  //     if (!$("#long_des").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Longitud destino</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#long_des");
  //     } else {
  //       RemueveFoco("#long_des");
  //     }
  //     if (!$("#tiempo_c").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Tiempo total ruta</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#tiempo_c");
  //     } else {
  //       RemueveFoco("#tiempo_c");
  //     }
  //     if (!$("#kilometro_c").val()) {
  //       msg_error += "<p>Debe diligenciar el campo <strong>Kilometros total de la ruta</strong> para poder crear la Ruta.</p>";
  //       AplicaFoco("#kilometro_c");
  //     } else {
  //       RemueveFoco("#kilometro_c");
  //     }
  //     if (!msg_error) {
  //       validar_ruta();
  //     } else {
  //       $("#msg_editar").html(
  //         '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
  //           msg_error +
  //           "</div></div>",
  //       );
  //       $("#crear_ruta").animate({scrollTop: 0}, 600);
  //     }
  //   } else {
  //     console.log("Operacion cancelada");
  //   }
  // });
});

var url2 = $("#id_url_ajax").val() + "libs/trafico2_ajax.php";
// function validar_ruta() {
//   var url = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
//   var data = null;
//   data = new FormData();
//   var origen = $("#origen_c").val();
//   var destino = $("#destino_c").val();
//   //validar que no exista una ruta con igual origen-destino
//   var validar = {
//     origen: origen,
//     destino: destino,
//     action: "solo_una_ruta",
//   };

//   $.ajax({
//     url: url,
//     type: "POST",
//     data: validar,
//     dataType: "json",
//     success: function (data) {
//       if (data.result == null) {
//         // console.log('puede insertar ruta');
//         crear_ruta();
//       } else if (data.result != null) {
//         alert("Seleccione otra Ruta, esta ruta ya existe");
//       }
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log("no hay nada");
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// function crear_ruta() {
//   var url2 = $("#id_url_ajax").val() + "libs/trafico2_ajax.php";
//   var data = null;
//   data = new FormData();
//   var origen = $("#origen_c").val();
//   var destino = $("#destino_c").val();
//   var observacion = $("#observa_c").val();
//   var fecha = $("#fecha_c").val();
//   var hora = $("#hora_c").val();
//   var user = $("#user_c").val();
//   var la_ori = $("#la_ori").val();
//   var la_des = $("#la_des").val();
//   var lon_ori = $("#long_ori").val();
//   var lon_des = $("#long_des").val();
//   var tiempo_tot = $("#tiempo_c").val();
//   var kilo_tot = $("#kilometro_c").val();
//   data.append("accion", "insertar_ruta");
//   data.append("origen", origen);
//   data.append("destino", destino);
//   data.append("observa", observacion);
//   data.append("fecha", fecha);
//   data.append("hora", hora);
//   data.append("user", user);
//   data.append("latitud_origen", la_ori);
//   data.append("latitud_destino", la_des);
//   data.append("longitud_origen", lon_ori);
//   data.append("longitud_destino", lon_des);
//   data.append("tiempo_tot", tiempo_tot);
//   data.append("kilo_tot", kilo_tot);

//   $.ajax({
//     url: url2,
//     type: "POST",
//     data: data,
//     cache: false,
//     processData: false, // Don't process the files
//     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     dataType: "json",
//     success: function (data, textStatus, jqXHR) {
//       alert("Ok!! Solicitud Registrada Exitosamente!!");
//       location.reload();
//     },
//     error: function (jqXHR, textStatus, errorThrown) {
//       console.log("no inserto ruta");
//       console.log(jqXHR);
//       console.log(textStatus);
//       console.log(errorThrown);
//     },
//   });
// }

// $("#elegir").change(function () {
//   var url = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
//   var eleccion = $("#elegir").val();
//   if (eleccion == "") {
//     alert("por favor seleccione una opción");
//     $("#lugares").html("");
//   } else {
//     if (eleccion == "Origen") {
//       var dato = {
//         action: "origeesderuta",
//       };
//     }

//     if (eleccion == "Destino") {
//       var dato = {
//         action: "destinosderuta",
//       };
//     }
//     $("#lugares").html("");
//     $.ajax({
//       url: url,
//       type: "POST",
//       data: dato,
//       dataType: "json",
//       success: function (data) {
//         data.result.forEach(function (element, index) {
//           $("#lugares").append('<option value="' + element.id + '" >' + element.municipio + "-" + element.depto + "</option>");
//         });
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log("no hay lugar filtro");
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//       },
//     });
//   }
// });

//tabla de filtros
// function solicitudes_rutas() {
//   // alert('sahfkjshd');
//   var eleccion = $("#elegir").val();
//   var lugar = $("#lugares").val();
//   //cargar los origenes que existan en la tabla rutas
//   if (eleccion == "" || lugar == "") {
//     alert("Por favor digite todos los campos");
//   } else {
//     //hacer consulta enla tabla rutas
//     var url = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
//     var consulta = {
//       eleccion: eleccion,
//       lugar: lugar,
//       action: "filtro_rutas",
//     };
//     $("#body_esconder").html("");
//     $.ajax({
//       url: url,
//       type: "POST",
//       data: consulta,
//       dataType: "json",
//       success: function (data) {
//         console.log("si trajo tabla filtro");
//         cuente = 0;
//         cont = 0;
//         data.result.forEach(function (element, index) {
//           cuente++;
//           cont++;
//           var btn_ver = "";
//           var btn_editar = "";
//           //variables para los botones
//           var id = element.id;
//           var origen = element.cod_ciudad_origen;
//           var destino = element.cod_ciudad_destino;

//           //botones
//           btn_ver =
//             '<button type="button" class="btn btn-info btn btn-xs" title="Consultar ruta"   id="btn_ver' +
//             cont +
//             '"   data-toggle="modal" data-target="#consulte_ruta"  data-id="' +
//             id +
//             '" data-id2="' +
//             origen +
//             '" data-id3="' +
//             destino +
//             '"><i class="far fa-eye"></i></button>';
//           btn_editar =
//             '<button type="button" class="btn btn-warning btn btn-xs" title="Editar ruta"   id="btn_editar' +
//             cont +
//             '"   data-toggle="modal" data-target="#edite_ruta"  data-id="' +
//             id +
//             '" data-id2="' +
//             origen +
//             '" data-id3="' +
//             destino +
//             '" ><i class="fas fa-pencil-alt"></i></button>';

//           var col_status = "";
//           var col_estado = "";
//           if (element.estado == "habilitado") {
//             col_status =
//               '<td class="text-success">' +
//               "<center>" +
//               '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' +
//               "</center>" +
//               "</td>";
//             col_estado = `<span class="label label-success" title="Ruta Habilitada">${element.estado}</span>`;
//           }

//           if (element.estado == "inhabilitado") {
//             col_status =
//               '<td class="text-danger">' +
//               "<center>" +
//               '<span class="mdi mdi-dot-circle icon"  data-toggle="tooltip" title="Realizada" ></span>' +
//               "</center>" +
//               "</td>";
//             col_estado = `<span class="label label-danger" title="Ruta Inhabilitada">${element.estado}</span>`;
//           }

//           var ol = element.om + "-" + element.od;
//           var dl = element.od1 + "-" + element.dd;

//           $("#body_esconder").append(
//             `<tr>
// 							${col_status}
// 							<td style="font-size:11px;">${element.id}</td>
// 							<td style="font-size:11px;" class="text-center">${ol} </td>
// 							<td style="font-size:11px;" class="text-center">${dl}</td>
// 							<td style="font-size:11px;" class="text-center">${col_estado}</td>
// 							<td style="font-size:11px;width:10px;">${btn_ver}	${btn_editar}</td>
// 						</tr>`,
//           );

//           $("#btn_ver" + cont + "").click(function () {
//             var urlu = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
//             var id = $(this).attr("data-id");
//             var origen = $(this).attr("data-id2");
//             var destino = $(this).attr("data-id3");

//             $("#codigo_v").val(id);
//             $("#codigo_v").html(id);
//             $("#origen_v").val(origen);
//             $("#destino_v").val(destino);
//             //consultar origenes y destinos
//             var consu = {
//               id: id,
//               origen: origen,
//               destino: destino,
//               action: "lugares",
//             };
//             $.ajax({
//               url: urlu,
//               type: "POST",
//               data: consu,
//               dataType: "json",
//               success: function (data) {
//                 console.log("trajo ver ruta");
//                 if (data.result) {
//                   var ori = data.result[0].municipio + "-" + data.result[0].depto;
//                   // $("#observa_v").val(data.result[0].observaciones);
//                   $("#observa_v").html(data.result[0].observaciones);
//                   // $("#fecha_v").val(data.result[0].fecha);
//                   $("#fecha_v").html(data.result[0].fecha);
//                   // $("#hora_v").val(data.result[0].hora);
//                   $("#hora_v").html(data.result[0].hora);
//                   // $("#user_v").val(data.result[0].usuario);
//                   $("#user_v").html(data.result[0].usuario);
//                   $("#origen_vv").html(ori);
//                   // $("#vla_ori").val(data.result[0].latitud_origen);
//                   $("#vla_ori").html(data.result[0].latitud_origen);
//                   // $("#vla_des").val(data.result[0].latitud_destino);
//                   $("#vla_des").html(data.result[0].latitud_destino);
//                   // $("#vlo_ori").val(data.result[0].longitud_origen);
//                   $("#vlo_ori").html(data.result[0].longitud_origen);
//                   // $("#vlo_des").val(data.result[0].longitud_destino);
//                   $("#vlo_des").html(data.result[0].longitud_destino);
//                   // $("#vtiempo").val(data.result[0].tiempo_tot_ruta);
//                   $("#vtiempo").html(data.result[0].tiempo_tot_ruta);
//                   // $("#vkilometro").val(data.result[0].km_tot_ruta);
//                   $("#vkilometro").html(data.result[0].km_tot_ruta);
//                   var latori = data.result[0].latitud_origen;
//                   var latdes = data.result[0].latitud_destino;
//                   var lonori = data.result[0].longitud_origen;
//                   var londes = data.result[0].longitud_destino;
//                   pintar_mapa(latori, latdes, lonori, londes);
//                 }
//                 if (data.result2) {
//                   var des = data.result2[0].municipio + "-" + data.result2[0].depto;
//                   $("#destino_vv").html(des);
//                 }
//               },
//               error: function (jqXHR, textStatus, errorThrown) {
//                 console.log("no trajo ver ruta");
//                 console.log(jqXHR);
//                 console.log(textStatus);
//                 console.log(errorThrown);
//               },
//             });

//             function pintar_mapa(latori, latdes, lonori, londes) {
//               //alert('google maps');
//               var latori_1 = parseFloat(latori);
//               var latdes_1 = parseFloat(latdes);
//               var lonori_1 = parseFloat(lonori);
//               var londes_1 = parseFloat(londes);

//               var coord_ori = {lat: latori_1, lng: lonori_1};
//               var coord_des = {lat: latdes_1, lng: londes_1};

//               var coord_pais = {lat: 8.5709, lng: -74.2973}; //colombia
//               var map = new google.maps.Map(document.getElementById("map"), {
//                 zoom: 6,
//                 center: coord_pais,
//                 mapTypeId: "hybrid",
//               });

//               var marker = new google.maps.Marker({
//                 position: coord_ori,
//                 map: map,
//               });

//               marker = new google.maps.Marker({
//                 position: coord_des,
//                 map: map,
//               });

//               var objConfigDR = {map: map};
//               var objConfigDS = {
//                 origin: coord_ori,
//                 destination: coord_des,
//                 travelMode: google.maps.TravelMode.DRIVING,
//               };

//               //calcular la ruta con los datos satelitales de google
//               var ds = new google.maps.DirectionsService();
//               var dr = new google.maps.DirectionsRenderer(objConfigDR);
//               ds.route(objConfigDS, fnRutear);

//               function fnRutear(resultados, status) {
//                 if (status == "OK") {
//                   dr.setDirections(resultados);
//                 }
//               }
//             }
//           });

//           $("#btn_editar" + cont + "").click(function () {
//             var urlu = $("#id_url_ajax").val() + "libs/trafico_ajax.php";
//             var id = $(this).attr("data-id");
//             var origen = $(this).attr("data-id2");
//             var destino = $(this).attr("data-id3");
//             // alert('editar');
//             // alert(id);
//             // alert(origen);
//             // alert(destino);
//             $("#edite_ruta .form-control").val("Cargando...");
//             var edi = {
//               id: id,
//               origen: origen,
//               destino: destino,
//               action: "edit_ruta",
//             };
//             $("#habil_e").html("");
//             $.ajax({
//               url: urlu,
//               type: "POST",
//               data: edi,
//               dataType: "json",
//               success: function (data) {
//                 console.log("trajo editar ruta");
//                 console.log(data);
//                 if (data.result) {
//                   if (element.estado == "habilitado") {
//                     $("#habil_e").append('<option value="1">Si</option><option value="0">No</option>');
//                   }
//                   if (element.estado == "inhabilitado") {
//                     $("#habil_e").append('<option value="0">No</option><option value="1">Si</option>');
//                   }

//                   $("#codigo_e").val(id);
//                   $("#observa_e").val(data.result[0].observaciones);
//                   $("#fecha_e").val(data.result[0].fecha);
//                   $("#hora_e").val(data.result[0].hora);
//                   $("#user_e").val(data.result[0].usuario);
//                   $("#vla_ori_e").val(data.result[0].latitud_origen);
//                   $("#vla_des_e").val(data.result[0].latitud_destino);
//                   $("#vlo_ori_e").val(data.result[0].longitud_origen);
//                   $("#vlo_des_e").val(data.result[0].longitud_destino);
//                   $("#tiempoe").val(data.result[0].tiempo_tot_ruta);
//                   $("#kilometroe").val(data.result[0].km_tot_ruta);
//                   var tipo = $("#destino_e").html("");
//                   data.result[0].cod_ciudad_destino.forEach(function (element, index) {
//                     var tmpSelected = "";
//                     if (element.selected) {
//                       tmpSelected = "selected";
//                     }
//                     var tipo = $("#destino_e").append(
//                       "<option " +
//                         tmpSelected +
//                         ' value="' +
//                         element.id_destino +
//                         '">' +
//                         element.mun_destino +
//                         "-" +
//                         element.dep_destino +
//                         "</option>",
//                     );
//                   });

//                   var tip = $("#origen_e").html("");
//                   data.result[0].cod_ciudad_origen.forEach(function (element, index) {
//                     var tmpSelected = "";
//                     if (element.selected) {
//                       tmpSelected = "selected";
//                     }
//                     var tip = $("#origen_e").append(
//                       "<option " + tmpSelected + ' value="' + element.id_origen + '">' + element.mun_origen + "-" + element.dep_origen + "</option>",
//                     );
//                   });
//                 }
//               },
//               error: function (jqXHR, textStatus, errorThrown) {
//                 console.log("no trajo ver ruta");
//                 console.log(jqXHR);
//                 console.log(textStatus);
//                 console.log(errorThrown);
//               },
//             });
//           });
//         });
//       },
//       error: function (jqXHR, textStatus, errorThrown) {
//         console.log("no trajo tabla filtro");
//         console.log(jqXHR);
//         console.log(textStatus);
//         console.log(errorThrown);
//       },
//     });

//     // $("#btn_updateruta").click(function () {
//     //   // $("#btn_updateruta").hide();
//     //   if (window.confirm("¿Estas segurdo de actualizar la ruta?")) {
//     //     var msg_error = "";
//     //     if (!$("#codigo_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Código</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#codigo_e");
//     //     } else {
//     //       RemueveFoco("#codigo_e");
//     //     }
//     //     if (!$("#origen_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Origen</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#origen_e");
//     //     } else {
//     //       RemueveFoco("#origen_e");
//     //     }
//     //     if (!$("#destino_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Destino</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#destino_e");
//     //     } else {
//     //       RemueveFoco("#destino_e");
//     //     }
//     //     if (!$("#vla_ori_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Latitud origen</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#vla_ori_e");
//     //     } else {
//     //       RemueveFoco("#vla_ori_e");
//     //     }
//     //     if (!$("#vla_des_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Latitud destino</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#vla_des_e");
//     //     } else {
//     //       RemueveFoco("#vla_des_e");
//     //     }
//     //     if (!$("#vlo_ori_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Longitud origen</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#vlo_ori_e");
//     //     } else {
//     //       RemueveFoco("#vlo_ori_e");
//     //     }
//     //     if (!$("#vlo_des_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Longitud destino</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#vlo_des_e");
//     //     } else {
//     //       RemueveFoco("#vlo_des_e");
//     //     }
//     //     if (!$("#tiempoe").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Tiempo total de la ruta</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#tiempoe");
//     //     } else {
//     //       RemueveFoco("#tiempoe");
//     //     }
//     //     if (!$("#kilometroe").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Kilometros totales de la ruta</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#kilometroe");
//     //     } else {
//     //       RemueveFoco("#kilometroe");
//     //     }
//     //     if (!$("#observa_e").val()) {
//     //       msg_error += "<p>Debe diligenciar el campo <strong>Kilometros totales de la ruta</strong> para poder actualizar la Ruta.</p>";
//     //       AplicaFoco("#observa_e");
//     //     } else {
//     //       RemueveFoco("#observa_e");
//     //     }
//     //     if (!msg_error) {
//     //       Actualiza_Ruta();
//     //     } else {
//     //       $("#msg_edicion").html(
//     //         '<div role="alert" class="alert alert-danger alert-icon alert-icon-border alert-dismissible"><div class="icon"><span class="mdi mdi-close"></span></div><div class="message"><button type="button" data-dismiss="alert" aria-label="Close" class="close"><span aria-hidden="true" class="mdi mdi-close"></span></button><strong>Error!</strong>' +
//     //           msg_error +
//     //           "</div></div>",
//     //       );
//     //       $("#edite_ruta").animate({scrollTop: 0}, 600);
//     //     }
//     //   } else {
//     //     // Código a ejecutar si el usuario hace clic en "Cancelar"
//     //     $("#btn_updateruta").show();
//     //   }
//     // });

//     // function Actualiza_Ruta() {
//     //   var url2 = $("#id_url_ajax").val() + "libs/trafico2_ajax.php";
//     //   // alert('actualizar esta ruta');
//     //   var id = $("#codigo_e").val();
//     //   var ori = $("#origen_e").val();
//     //   var des = $("#destino_e").val();
//     //   var obs = $("#observa_e").val();
//     //   var fech = $("#fecha_e").val();
//     //   var hora = $("#hora_e").val();
//     //   var user = $("#user_e").val();
//     //   var es = $("#habil_e").val();
//     //   var tiempoe = $("#tiempoe").val();
//     //   var kilometroe = $("#kilometroe").val();

//     //   var a = $("#habil_e").val();
//     //   if (a == "1") {
//     //     estado = "habilitado";
//     //   }
//     //   if (a == "0") {
//     //     estado = "inhabilitado";
//     //   }
//     //   var vla_ori_e = $("#vla_ori_e").val();
//     //   var vla_des_e = $("#vla_des_e").val();
//     //   var vlo_ori_e = $("#vlo_ori_e").val();
//     //   var vlo_des_e = $("#vlo_des_e").val();
//     //   var data = null;
//     //   data = new FormData();
//     //   data.append("accion", "update_ruta");
//     //   data.append("id", id);
//     //   data.append("origen", ori);
//     //   data.append("destino", des);
//     //   data.append("observa", obs);
//     //   data.append("fecha", fech);
//     //   data.append("hora", hora);
//     //   data.append("user", user);
//     //   data.append("estado", estado);
//     //   data.append("vla_ori_e", vla_ori_e);
//     //   data.append("vla_des_e", vla_des_e);
//     //   data.append("vlo_ori_e", vlo_ori_e);
//     //   data.append("vlo_des_e", vlo_des_e);
//     //   data.append("tiempoe", tiempoe);
//     //   data.append("kilometroe", kilometroe);
//     //   $.ajax({
//     //     url: url2,
//     //     type: "POST",
//     //     data: data,
//     //     cache: false,
//     //     processData: false, // Don't process the files
//     //     contentType: false, // Set content type to false as jQuery will tell the server its a query string request
//     //     dataType: "json",
//     //     success: function (data, textStatus, jqXHR) {
//     //       alert("Ok!!Ruta Actualizada Exitosamente!!");
//     //       location.reload();
//     //     },
//     //     error: function (jqXHR, textStatus, errorThrown) {
//     //       console.log("no actualizo ruta");
//     //       console.log(jqXHR);
//     //       console.log(textStatus);
//     //       console.log(errorThrown);
//     //     },
//     //   });
//     // }
//   }
// }
