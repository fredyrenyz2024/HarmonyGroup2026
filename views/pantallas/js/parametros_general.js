
(function () {
  'use strict';
  window.VENTANA = null;

  window.initScript = function (id) {
    window.VENTANA = id;
    const BASE = $('#base_url').val(); // o tu variable global de base url


    // ==========================================
    // LISTAR - GET
    // ==========================================
    async function listarPorcentajesVariacion() {

      const tableId = "#porcentajes_export";
      const tbody = document.getElementById("porcentajes_body");

      // 🔥 PASO 1: destruir instancia previa
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
        $(`${tableId} thead tr.filters`).remove();
      }

      // 🔎 PASO 2: construir filtros
      const params = new URLSearchParams();
      const filtros = {
        tipo: document.getElementById("f_tipo")?.value,
        estado: document.getElementById("f_estado")?.value,
      };

      Object.keys(filtros).forEach(key => {
        if (filtros[key]) params.append(key, filtros[key]);
      });

      tbody.innerHTML = `
        <tr>
            <td colspan="5">
                <div class="text-center p-3">
                    <div class="spinner-border text-primary"></div>
                </div>
            </td>
        </tr>`;

      try {

        const response = await fetch(
          $("#base_url_api").val() + `porcentajes-variacion?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-API-KEY": "nexos_nacional2026@*",
            }
          }
        );

        if (!response.ok) throw new Error("Error al obtener datos");

        const result = await response.json();
        tbody.innerHTML = "";

        if (!result.data || result.data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="5">No hay registros</td></tr>`;
          return;
        }

        // 🔥 Render filas manual
        result.data.forEach((item, index) => {

          const porcentaje = parseFloat(item.porcentaje_variacion).toFixed(2);

          const estadoBadge = item.activo
            ? `<span class="badge bg-success">Activo</span>`
            : `<span class="badge bg-danger">Inactivo</span>`;

          const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.tipo}</td>
                    <td>${porcentaje}%</td>
                    <td>${estadoBadge}</td>
                    <td>
                        <div class="d-flex justify-content-center gap-1">
                            <button class="btn btn-warning btn-sm me-1 px-1 py-1 btn-editar" data-id="${item.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm me-1 px-1 py-1 btn-eliminar" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;

          tbody.insertAdjacentHTML("beforeend", row);
        });

        // 🔥 Inicializar DataTable
        setTimeout(() => {
          inicializarDataTable(tableId);
        }, 100);

      } catch (error) {
        console.error(error);
        tbody.innerHTML = `<tr><td colspan="5">Error al cargar datos</td></tr>`;
      }
    }


    function inicializarDataTable(tableId) {

      let table_Id = $('#tabla-porcentaje-variacion');

      // Clonar encabezado para filtros
      $(`${table_Id} thead tr`).clone(true)
        .addClass('filters')
        .appendTo(`${table_Id} thead`);

      const table = $(table_Id).DataTable({
        pageLength: 25,
        orderCellsTop: true,
        fixedHeader: true,
        language: {
          url: BASE + 'public/plugins/datatables/es-ES.json'
        }
      });

      // Filtros por columna
      table.columns().every(function (colIdx) {

        const cell = $('.filters th').eq(
          $(table.column(colIdx).header()).index()
        );

        $(cell).html('<input type="text" class="form-control form-control-sm" placeholder="Filtrar" />');

        $('input', cell)
          .off('keyup change')
          .on('keyup change', function (e) {

            e.stopPropagation();

            table
              .column(colIdx)
              .search(this.value)
              .draw();
          });
      });
    }

    // ==========================================
    // GUARDAR - POST
    // ==========================================
    async function guardarParametro() {
      const tipo = $('#nombre-parametro').val().trim();
      const porcentaje_variacion = $('#valor-parametro').val().replace(/[^0-9.]/g, '');
      const activo = $('#estado-parametro').val() === 'Activa' ? 1 : 0;
      const empresa_id = $('#perfil_id').val(); // o tu campo empresa

      // Validación básica
      if (!tipo || !porcentaje_variacion) {
        Swal.fire('Advertencia', 'Diligencie todos los campos obligatorios.', 'warning');
        return;
      }

      const confirm = await Swal.fire({
        title: '¿Confirmar?',
        text: '¿Desea guardar el parámetro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3B71CA',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirm.isConfirmed) return;

      try {
        // const res = await fetch(`${BASE}api/parametros/variacion-tarifas/porcentajes-variacion`, {
        const res = await fetch($("#base_url_api").val() + `porcentajes-variacion`, {
          method: 'POST',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": "nexos_nacional2026@*",
          },
          body: JSON.stringify({ empresa_id, tipo, porcentaje_variacion, activo })
        });

        const json = await res.json();

        if (json.success) {
          // toastr.success(json.message);
          Swal.fire({
            icon: 'success',
            title: 'Creación exitosa!',
            text: json.message,
            confirmButtonText: 'Aceptar',
            timer: 3000,
            timerProgressBar: true
          });
          resetFormulario();
          bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasImporteMasivo')).hide();
          listarPorcentajesVariacion();
        } else {
          manejarErrores(json);
        }

      } catch (error) {
        console.error('Error al guardar:', error);
        // toastr.error('Error al guardar el parámetro');
      }
    }

    // ==========================================
    // CARGAR DATOS PARA EDITAR - GET /{id}
    // ==========================================
    async function cargarParaEditar(id) {
      try {
        const res = await fetch($("#base_url_api").val() + `porcentajes-variacion/${id}`, {
          method: 'GET',
          headers: { 'Accept': 'application/json', "X-API-KEY": "nexos_nacional2026@*" }
        });

        const json = await res.json();

        if (json.success) {
          const d = json.data;

          // Rellenar formulario
          $('#nombre-parametro').val(d.tipo);
          $('#valor-parametro').val(d.porcentaje_variacion);
          $('#estado-parametro').val(d.activo ? 'Activa' : 'Inactiva');

          // Guardar ID en campo oculto para el update
          $('#parametro-id-edit').val(d.id);

          // Cambiar título y botón del offcanvas
          $('#offcanvasRightLabel').text('Editar Parámetro');
          $('#btn-accion-parametro')
            .text('Actualizar')
            .removeClass('btn-success')
            .addClass('btn-primary');

          // Abrir offcanvas
          new bootstrap.Offcanvas(document.getElementById('offcanvasImporteMasivo')).show();

        } else {
          // toastr.warning(json.message);
        }

      } catch (error) {
        console.error('Error al cargar:', error);
        // toastr.error('Error al cargar el parámetro');
      }
    }

    // ==========================================
    // ACTUALIZAR - PUT /{id}
    // ==========================================
    async function actualizarParametro() {
      const id = $('#parametro-id-edit').val();
      const tipo = $('#nombre-parametro').val().trim();
      const porcentaje_variacion = $('#valor-parametro').val().replace(/[^0-9.]/g, '');
      const activo = $('#estado-parametro').val() === 'Activa' ? 1 : 0;
      const empresa_id = $('#perfil_id').val();

      if (!tipo || !porcentaje_variacion) {
        Swal.fire('Advertencia', 'Diligencie todos los campos obligatorios.', 'warning');
        return;
      }

      const confirm = await Swal.fire({
        title: '¿Confirmar?',
        text: '¿Desea actualizar el parámetro?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3B71CA',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirm.isConfirmed) return;

      try {
        const res = await fetch($("#base_url_api").val() + `porcentajes-variacion/${id}`, {
          method: 'PUT',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": "nexos_nacional2026@*",
          },
          body: JSON.stringify({ empresa_id, tipo, porcentaje_variacion, activo })
        });

        const json = await res.json();

        if (json.success) {
          // toastr.success(json.message);
          Swal.fire({
            icon: 'success',
            title: 'Actualización exitosa!',
            text: json.message,
            confirmButtonText: 'Aceptar',
            timer: 3000,
            timerProgressBar: true
          });
          resetFormulario();
          bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasImporteMasivo')).hide();
          listarPorcentajesVariacion();
        } else {
          manejarErrores(json);
        }

      } catch (error) {
        console.error('Error al actualizar:', error);
        // toastr.error('Error al actualizar el parámetro');
      }
    }

    // ==========================================
    // ELIMINAR - DELETE /{id}
    // ==========================================
    async function eliminarParametro(id) {
      const confirm = await Swal.fire({
        title: '¿Eliminar?',
        text: 'Esta acción eliminará el parámetro. ¿Desea continuar?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#9FA6B2',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirm.isConfirmed) return;

      try {
        const res = await fetch($("#base_url_api").val() + `porcentajes-variacion/${id}`, {
          method: 'DELETE',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-API-KEY": "nexos_nacional2026@*",
          },
        });

        const json = await res.json();

        if (json.success) {
          // toastr.success(json.message);
          Swal.fire({
            icon: 'success',
            title: 'Eliminación exitosa!',
            text: json.message,
            confirmButtonText: 'Aceptar',
            timer: 3000,
            timerProgressBar: true
          });
          listarPorcentajesVariacion();
        } else {
          // toastr.warning(json.message);
        }

      } catch (error) {
        console.error('Error al eliminar:', error);
        // toastr.error('Error al eliminar el parámetro');
        Swal.fire({
          icon: 'error',
          title: 'Eliminación no exitosa!',
          text: error,
          confirmButtonText: 'Aceptar',
          timer: 3000,
          timerProgressBar: true
        });
      }
    }

    // ==========================================
    // HELPERS
    // ==========================================

    // Detectar si es crear o editar al hacer click en el botón del offcanvas
    function accionFormulario() {
      const id = $('#parametro-id-edit').val();
      if (id) {
        actualizarParametro();
      } else {
        guardarParametro();
      }
    }

    function resetFormulario() {
      $('#nombre-parametro').val('');
      $('#valor-parametro').val('');
      $('#estado-parametro').val('Activa');
      $('#parametro-id-edit').val('');
      $('#offcanvasRightLabel').text('Crear Parámetro');
      $('#btn-accion-parametro')
        .html('<i class="fas fa-upload"></i> Guardar')
        .removeClass('btn-primary')
        .addClass('btn-success');
    }

    function manejarErrores(json) {
      if (json.errors) {
        const msgs = Object.values(json.errors).flat().join('<br>');
        Swal.fire({ title: 'Error de validación', html: msgs, icon: 'error' });
      } else {
        // toastr.error(json.message ?? 'Ocurrió un error');
        console.log(json.message);
      }
    }

    // ==========================================
    // EVENTOS
    // ==========================================

    // Click en botón Editar de la tabla
    $('#tabla-porcentaje-variacion').on('click', '.btn-editar', function () {
      cargarParaEditar($(this).data('id'));
    });

    // Click en botón Eliminar de la tabla
    $('#tabla-porcentaje-variacion').on('click', '.btn-eliminar', function () {
      eliminarParametro($(this).data('id'));
    });

    // Click en botón principal del offcanvas (Guardar / Actualizar)
    $(document).on('click', '#btn-accion-parametro', accionFormulario);

    // Resetear formulario al cerrar offcanvas
    document.getElementById('offcanvasImporteMasivo')
      .addEventListener('hidden.bs.offcanvas', resetFormulario);

    // Cargar tabla al iniciar
    listarPorcentajesVariacion();
  };

})();