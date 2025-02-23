const d = document;
const w = window;
d.addEventListener('DOMContentLoaded', async (e) => {
  e.preventDefault();

  /* Calcular el digiti de verificacion */
  d.addEventListener('change', async (e) => {
    if (e.target.matches('#nit_empresa')) {
      calcular();
    }
  });

  d.addEventListener('click', async (e) => {
    if (e.target.matches('#btn_save_empresa') || e.target.matches('#btn_save_empresa *')) {
      if (w.confirm('¿Esta seguro de crear esta empresa?')) {
        try {
          let dato = new FormData();
          dato.append('nit', d.getElementById('nit_empresa').value);
          dato.append('nomre_razonsocial', d.getElementById('nombre_empresa').value);
          dato.append('repesentante', d.getElementById('representante_empresa').value);
          dato.append('digito_empresa', d.getElementById('digito_empresa').value);

          await fetch($('#id_url_ajax').val() + 'empresa/Guardar_empresa', {
            method: 'POST',
            cache: 'no-cache',
            body: dato,
          })
            .then((response) => {
              if (!response.ok) throw new Error(response.statusText);
              return response.json();
            })
            .then(function (data) {
              console.log(data);
              if (data.numero === 200) {
                let mensaje = `
                <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
                    <div class="icon"><span class="mdi mdi-check"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> ${data.mensaje}
                    </div>
                </div> `;
                d.getElementById('mensaje').innerHTML = mensaje;
                limpiar_campos();
                setTimeout(() => {
                  var div = document.getElementById('mensaje');
                  div.style.display = div.style.display === 'none' ? 'block' : 'none';
                }, 1500);
              } else {
                let mensaje = `
                <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">
                    <div class="icon"><i class="fas fa-times"></i></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong>${data.mensaje}
                    </div>
                </div> `;
                document.getElementById('mensaje').innerHTML = mensaje;
                // limpiar_campos();
                setTimeout(() => {
                  var div = document.getElementById('mensaje');
                  div.style.display = div.style.display === 'none' ? 'block' : 'none';
                }, 1500);
              }
            })
            .catch((error) => {
              alert(error);
            });
        } catch (error) {
          throw error;
        }
      } else {
        console.log('OPERACION CANCELADA');
      }
    }

    if (e.target.matches('#btn_form_agencia') || e.target.matches('#btn_form_agencia *')) {
      Listar_empresas();
    }

    /* Agregar agencia */
    if (e.target.matches('#btn_save_agencia') || e.target.matches('#btn_save_agencia *')) {
      if (w.confirm('¿Estas seguro de guardar la agencia?')) {
        try {
          let dato = new FormData();
          dato.append('empresa', d.getElementById('empresa').value);
          dato.append('nombre_agencia', d.getElementById('nombre_agencia').value);
          dato.append('estado_agencia', d.getElementById('estado_agencia').value);
          dato.append('abreviatura', d.getElementById('abreviatura').value);

          await fetch($('#id_url_ajax').val() + 'empresa/Guardar_agencia', {
            method: 'POST',
            cache: 'no-cache',
            body: dato,
          })
            .then((response) => {
              if (!response.ok) throw new Error(response.statusText);
              return response.json();
            })
            .then(function (data) {
              console.log(data);
              if (data.numero === 200) {
                let mensaje = `
                <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
                    <div class="icon"><span class="mdi mdi-check"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> ${data.mensaje}
                    </div>
                </div> `;
                d.getElementById('mensaje').innerHTML = mensaje;
                limpiar_campos();
                setTimeout(() => {
                  var div = document.getElementById('mensaje');
                  div.style.display = div.style.display === 'none' ? 'block' : 'none';
                }, 1500);
              } else {
                let mensaje = `
                <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">
                    <div class="icon"><i class="fas fa-times"></i></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong>${data.mensaje}
                    </div>
                </div> `;
                document.getElementById('mensaje').innerHTML = mensaje;
                setTimeout(() => {
                  var div = document.getElementById('mensaje');
                  div.style.display = div.style.display === 'none' ? 'block' : 'none';
                }, 1500);
              }
            })
            .catch((error) => {
              alert(error);
            });
        } catch (error) {
          throw error;
        }
      }
    }

    if (e.target.matches('#btn_form_ambiente') || e.target.matches('#btn_form_ambiente *')) {
      Listar_agencias();
    }

    if (e.target.matches('#btn_agregar_fila') || e.target.matches('#btn_agregar_fila *')) {
      var table = document.getElementById('tbl_ambientes');
      var newRow = document.createElement('tr');

      newRow.innerHTML = `
      <th style="background-color: #FFFFFF; width: 200px;font-weight: bold;padding: 5px;"></th>
      <td style="padding: 1px;width: auto; white-space: nowrap;"></td>
      <th style="background-color: #FFFFFF; width: 200px;font-weight: bold;padding: 5px;"></th>
      <td style="padding: 1px;width: auto; white-space: nowrap;"></td>
      <th style="background-color: #FFFFFF; width: 200px;font-weight: bold;padding: 5px;"></th>
      <td style="padding: 1px;width: auto; white-space: nowrap;"></td>
      <th style="background-color: #F5F5F5; width: 200px;font-weight: bold;border: 1px solid #ddd;padding: 5px;">Url Conexión:</th>
      <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;">
        <input type="text" id="url_conexion[]" name="url_conexion[]" style="width: 600px;">
      </td>
    `;
      //   newRow.innerHTML = `
      //   <th style="background-color: #FFFFFF; width: 200px;font-weight: bold;padding: 5px;"></th>
      //   <td style="padding: 1px;width: auto; white-space: nowrap;"></td>
      //   <th style="background-color: #FFFFFF; width: 200px;font-weight: bold;padding: 5px;"></th>
      //   <td style="padding: 1px;width: auto; white-space: nowrap;"></td>
      //   <th style="background-color: #F5F5F5; width: 300px;font-weight: bold;border: 1px solid #ddd;padding: 5px;">Nombre url:</th>
      //   <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;">
      //     <input type="text" id="nombre_url[]" name="nombre_url[]" style="width: 120px;">
      //   </td>
      //   <th style="background-color: #F5F5F5; width: 300px;font-weight: bold;border: 1px solid #ddd;padding: 5px;">Url Conexión:</th>
      //   <td style="border: 1px solid #ddd;padding: 1px;width: auto; white-space: nowrap;">
      //     <input type="text" id="url_conexion[]" name="url_conexion[]" style="width: 450px;">
      //   </td>
      // `;
      table.appendChild(newRow);
    }

    if (e.target.matches('#btn_save_ambiente') || e.target.matches('#btn_save_ambiente *')) {
      if (w.confirm('¿Estas seguro de guardar el ambiente de la empresa?')) {
        try {
          let dato = new FormData();
          dato.append('agencia', d.getElementById('select_agencia').value);
          dato.append('ambiente_agencia', d.getElementById('ambiente_agencia').value);
          dato.append('proveedor', d.getElementById('proveedor').value);
          // Obtener una lista de elementos con name="nombre_url[]"
          // var nombre_urls = [];
          var urls_conexion = [];

          // var inputs_nombre_url = document.getElementsByName('nombre_url[]');
          // // Recorrer cada elemento y mostrar su valor
          // for (var i = 0; i < inputs_nombre_url.length; i++) {
          //   nombre_urls.push(inputs_nombre_url[i].value);
          // }
          // dato.append('nombre_url', JSON.stringify(nombre_urls));

          // Obtener una lista de elementos con name="url_conexion[]"
          var inputs_url_conexion = document.getElementsByName('url_conexion[]');
          // Recorrer cada elemento y mostrar su valor
          for (var i = 0; i < inputs_url_conexion.length; i++) {
            urls_conexion.push(inputs_url_conexion[i].value);
          }
          dato.append('url_conexion', JSON.stringify(urls_conexion));

          await fetch($('#id_url_ajax').val() + 'empresa/Agregar_Ambiente', {
            method: 'POST',
            cache: 'no-cache',
            body: dato,
          })
            .then((response) => {
              if (!response.ok) throw new Error(response.statusText);
              return response.json();
            })
            .then(function (data) {
              console.log(data);
              if (data.numero === 200) {
                let mensaje = `
                <div class="alert alert-success alert-icon alert-icon-border alert-dismissible" role = "alert">
                    <div class="icon"><span class="mdi mdi-check"></span></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong> ${data.mensaje}
                    </div>
                </div> `;
                d.getElementById('mensaje').innerHTML = mensaje;
                limpiar_campos();
                setTimeout(() => {
                  var div = document.getElementById('mensaje');
                  div.style.display = div.style.display === 'none' ? 'block' : 'none';
                }, 1500);
              } else {
                let mensaje = `
                <div class="alert alert-danger alert-icon alert-icon-border alert-dismissible" role = "alert">
                    <div class="icon"><i class="fas fa-times"></i></div>
                    <div class="message">
                      <button class="close" type="button" data-dismiss="alert" aria-label="Close"><span class="mdi mdi-close" aria-hidden="true"></span></button>
                      <strong>Mensaje!</strong>${data.mensaje}
                    </div>
                </div> `;
                document.getElementById('mensaje').innerHTML = mensaje;
                setTimeout(() => {
                  var div = document.getElementById('mensaje');
                  div.style.display = div.style.display === 'none' ? 'block' : 'none';
                }, 1500);
              }
            })
            .catch((error) => {
              alert(error);
            });
        } catch (error) {
          throw error;
        }
      }
    }
  });
});

async function Listar_empresas() {
  try {
    await fetch($('#id_url_ajax').val() + 'empresa/listar_empresa', {
      method: 'POST',
      cache: 'no-cache',
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(function (data) {
        if (data) {
          let EMPRESAS = d.getElementById('empresa');
          EMPRESAS.innerHTML = '';
          EMPRESAS.innerHTML = '<option>Seleccione Empresa</option>';
          data.forEach((value) => {
            let {nombre_empresa, nit_empresa, representante, id} = value;
            let opt = document.createElement('option');
            opt.value = id;
            opt.textContent = nombre_empresa + ' - ' + representante;
            EMPRESAS.appendChild(opt);
          });
        } else {
        }
      })
      .catch((error) => {
        alert(error);
      });
  } catch (error) {
    throw error;
  }
}

async function Listar_agencias() {
  try {
    await fetch($('#id_url_ajax').val() + 'empresa/listar_agencia', {
      method: 'POST',
      cache: 'no-cache',
    })
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then(function (data) {
        if (data) {
          let AGENCIAS = d.getElementById('select_agencia');
          AGENCIAS.innerHTML = '';
          AGENCIAS.innerHTML = '<option>Seleccione Agencia</option>';
          data.forEach((value) => {
            let {nombre_agencia, nombre_empresa, agencia_id} = value;
            let opt = document.createElement('option');
            opt.value = agencia_id;
            opt.textContent = 'Agencia: ' + nombre_agencia + ' - ' + 'Empresa: ' + nombre_empresa;
            AGENCIAS.appendChild(opt);
          });
        } else {
        }
      })
      .catch((error) => {
        alert(error);
      });
  } catch (error) {
    throw error;
  }
}

function limpiar_campos() {
  d.getElementById('nit_empresa').value = '';
  d.getElementById('nombre_empresa').value = '';
  d.getElementById('representante_empresa').value = '';
  d.getElementById('digito_empresa').value = '';
  /* Agencias */
  d.getElementById('empresa').value = '';
  d.getElementById('nombre_agencia').value = '';
  d.getElementById('abreviatura').value = '';
  d.getElementById('estado_agencia').value = '';
}
