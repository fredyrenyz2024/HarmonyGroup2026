(function () {
  'use strict';
  // /**
  //  * nuevo_pedido.js  —  Torre de Control / Nuevo Pedido
  //  * ─────────────────────────────────────────────────────
  //  * Maneja:
  //  *  • Selección de tipo de pedido (masivo / individual)
  //  *  • Drag & drop + selección de archivo Excel
  //  *  • Preview local con SheetJS (XLSX)
  //  *  • Envío al servidor → TorreControlController::importarPedidosExcel
  //  *  • Secciones de progreso y resultado con manejo completo
  //  *    de la respuesta { numero, mensaje, data: { insertados, errores } }
  //  */

  // /* ═══════════════════════════════════════════════════════
  //  *  ESTADO GLOBAL
  //  * ═══════════════════════════════════════════════════════ */
  // if (!window.globalData) window.globalData = [];
  // if (!window.npArchivoActual) window.npArchivoActual = null;

  // /* ═══════════════════════════════════════════════════════
  //  *  INIT
  //  * ═══════════════════════════════════════════════════════ */
  // window.initScript = function (id) {
  //   window.VENTANA = id;
  //   Listar_clientes();
  //   _initSelectTipo();
  //   _initArchivoInput();
  // };

  // /* ── Selector de tipo de pedido ─────────────────────── */
  // function _initSelectTipo() {
  //   const select = document.getElementById('miSelect');

  //   select.addEventListener('change', function () {
  //     const masivo = document.getElementById('np-bloque-masivo');
  //     const individual = document.getElementById('crear_pedido');

  //     if (this.value === 'cargue') {
  //       masivo.style.display = '';
  //       individual.style.display = 'none';
  //       npReset();                         // asegurar estado limpio
  //     } else if (this.value === 'crear_pedido') {
  //       masivo.style.display = 'none';
  //       individual.style.display = '';
  //     } else {
  //       masivo.style.display = 'none';
  //       individual.style.display = 'none';
  //     }
  //   });
  // }

  // /* ── Input de archivo ───────────────────────────────── */
  // function _initArchivoInput() {
  //   const input = document.getElementById('np_archivo_excel');
  //   input.addEventListener('change', function () {
  //     if (this.files[0]) npOnArchivoSeleccionado(this.files[0]);
  //   });

  //   // Botón previsualizar
  //   document.getElementById('np-btn-previsualizar').addEventListener('click', npPrevisualizar);

  //   // Botón importar
  //   document.getElementById('np-btn-importar').addEventListener('click', npImportar);

  //   // Botón cancelar preview
  //   document.getElementById('np-btn-cancelar').addEventListener('click', npReset);

  //   // Click en botones de pedido individual
  //   document.addEventListener('click', async (e) => {
  //     if (e.target.closest('#agregar_fila')) agregar_mercancia();
  //     if (e.target.closest('#btn_guardar_pedido')) guardar_mercancias();
  //     if (e.target.closest('#btn-cancelar-pedido')) {
  //       document.getElementById('crear_pedido').style.display = 'none';
  //       document.getElementById('miSelect').value = '';
  //     }
  //   });
  // }

  // /* ═══════════════════════════════════════════════════════
  //  *  DRAG & DROP
  //  * ═══════════════════════════════════════════════════════ */
  // function npDragOver(e) {
  //   e.preventDefault();
  //   document.getElementById('np-dropzone').classList.add('dragover');
  // }
  // function npDragLeave(e) {
  //   document.getElementById('np-dropzone').classList.remove('dragover');
  // }
  // function npDrop(e) {
  //   e.preventDefault();
  //   document.getElementById('np-dropzone').classList.remove('dragover');
  //   const file = e.dataTransfer.files[0];
  //   if (file) npOnArchivoSeleccionado(file);
  // }

  // /* ── Archivo seleccionado ────────────────────────────── */
  // function npOnArchivoSeleccionado(file) {
  //   const ext = file.name.split('.').pop().toLowerCase();
  //   if (!['xls', 'xlsx'].includes(ext)) {
  //     Swal.fire({
  //       icon: 'warning', title: 'Formato incorrecto',
  //       text: 'Solo se permiten archivos .xlsx o .xls.'
  //     });
  //     return;
  //   }

  //   window.npArchivoActual = file;

  //   // Mostrar badge con info del archivo
  //   const preview = document.getElementById('np-file-preview');
  //   document.getElementById('np-file-name').textContent = file.name;
  //   document.getElementById('np-file-size').textContent =
  //     (file.size / 1024).toFixed(1) + ' KB';
  //   preview.classList.add('show');

  //   // Habilitar botón previsualizar
  //   document.getElementById('np-btn-previsualizar').disabled = false;
  // }

  // function npLimpiarArchivo() {
  //   window.npArchivoActual = null;
  //   window.globalData = [];
  //   document.getElementById('np_archivo_excel').value = '';
  //   document.getElementById('np-file-preview').classList.remove('show');
  //   document.getElementById('np-btn-previsualizar').disabled = true;
  //   _npMostrarSeccion('upload');
  // }

  // /* ═══════════════════════════════════════════════════════
  //  *  PREVISUALIZAR EXCEL (SheetJS local)
  //  * ═══════════════════════════════════════════════════════ */
  // function npPrevisualizar() {
  //   const file = window.npArchivoActual;
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = function (e) {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  //     if (!sheetData.length) {
  //       Swal.fire({
  //         icon: 'warning', title: 'Archivo vacío',
  //         text: 'El archivo no contiene datos.'
  //       });
  //       return;
  //     }

  //     const allHeaders = sheetData[0];
  //     const filasUtiles = sheetData.slice(1).filter(row =>
  //       row.some(c => c !== undefined && c !== null && String(c).trim() !== '')
  //     );

  //     if (!filasUtiles.length) {
  //       Swal.fire({
  //         icon: 'warning', title: 'Sin datos',
  //         text: 'El archivo solo tiene cabeceras, no hay filas de datos.'
  //       });
  //       return;
  //     }

  //     // Guardar globalData (array de objetos)
  //     window.globalData = filasUtiles.map(row => {
  //       const obj = {};
  //       allHeaders.forEach((h, i) => { obj[h] = row[i] ?? ''; });
  //       return obj;
  //     });

  //     _renderizarTabla(allHeaders, filasUtiles);
  //     _npMostrarSeccion('preview');
  //     document.getElementById('np-badge-filas').textContent = filasUtiles.length + ' fila(s)';
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  // /* ── Renderizar tabla de preview ────────────────────── */
  // function _renderizarTabla(headers, filas) {
  //   const table = document.getElementById('np_previewTable');
  //   table.innerHTML = '';

  //   // THEAD
  //   const thead = document.createElement('thead');
  //   const trH = document.createElement('tr');
  //   ['#', ...headers, 'Acción'].forEach(h => {
  //     const th = document.createElement('th');
  //     th.textContent = h;
  //     trH.appendChild(th);
  //   });
  //   thead.appendChild(trH);
  //   table.appendChild(thead);

  //   // TBODY
  //   const tbody = document.createElement('tbody');
  //   filas.forEach((rowData, rowIdx) => {
  //     const tr = document.createElement('tr');

  //     // # de fila
  //     const tdNum = document.createElement('td');
  //     tdNum.innerHTML = `<span class="np-badge-fila">${rowIdx + 2}</span>`;
  //     tr.appendChild(tdNum);

  //     // Celdas de datos
  //     rowData.forEach((cell, colIdx) => {
  //       const td = document.createElement('td');
  //       td.textContent = _formatearCelda(cell, headers[colIdx] || '');
  //       tr.appendChild(td);
  //     });

  //     // Botón eliminar
  //     const tdAcc = document.createElement('td');
  //     tdAcc.innerHTML = `<button class="btn-del-row" data-idx="${rowIdx}" title="Eliminar fila">
  //                        <i class="fas fa-trash-alt"></i>
  //                      </button>`;
  //     tr.appendChild(tdAcc);
  //     tbody.appendChild(tr);
  //   });

  //   table.appendChild(tbody);

  //   // Delegación para eliminar filas del preview
  //   tbody.addEventListener('click', e => {
  //     const btn = e.target.closest('.btn-del-row');
  //     if (!btn) return;
  //     const idx = parseInt(btn.dataset.idx);
  //     window.globalData.splice(idx, 1);
  //     npPrevisualizar();   // re-render con datos actualizados
  //   });
  // }

  // /* ── Formatear celda según nombre de columna ─────────── */
  // function _formatearCelda(valor, nombreCol) {
  //   if (valor === undefined || valor === null) return '';
  //   const col = nombreCol.toLowerCase();

  //   if (typeof valor === 'number') {
  //     if (col.includes('fecha')) {
  //       const d = new Date((valor - 25569) * 86400 * 1000);
  //       return d.toISOString().split('T')[0];
  //     }
  //     if (col.includes('hora')) {
  //       const seg = Math.round(valor * 86400);
  //       const h = Math.floor(seg / 3600);
  //       const m = Math.floor((seg % 3600) / 60);
  //       const s = seg % 60;
  //       return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  //     }
  //   }
  //   return String(valor);
  // }

  // /* ═══════════════════════════════════════════════════════
  //  *  IMPORTAR → servidor
  //  * ═══════════════════════════════════════════════════════ */
  // async function npImportar() {
  //   if (!window.globalData.length) {
  //     Swal.fire({
  //       icon: 'warning', title: 'Sin datos',
  //       text: 'No hay filas para importar.'
  //     }); return;
  //   }

  //   const modalidad = document.getElementById('miSelectModalidad').value;
  //   if (!modalidad) {
  //     document.getElementById('miSelectModalidad').classList.add('is-invalid');
  //     Swal.fire({
  //       icon: 'warning', title: 'Modalidad requerida',
  //       text: 'Selecciona una modalidad antes de importar.'
  //     }); return;
  //   }

  //   const conf = await Swal.fire({
  //     title: '¿Importar pedidos?',
  //     html: `<strong>${window.globalData.length}</strong> fila(s) serán enviadas al servidor.`,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#1a5ce5',
  //     cancelButtonColor: '#9FA6B2',
  //     confirmButtonText: 'Sí, importar',
  //     cancelButtonText: 'Cancelar',
  //     customClass: { popup: 'swal2-custom-font' },
  //   });
  //   if (!conf.isConfirmed) return;

  //   // ── Mostrar progreso ──────────────────────────────────
  //   _npMostrarSeccion('progress');
  //   _npProgreso(10, 'Preparando datos...');

  //   try {
  //     // Construir FormData con el archivo original
  //     const fd = new FormData();
  //     fd.append('archivo', window.npArchivoActual);
  //     fd.append('modalidad', document.getElementById("miSelectModalidad").value);
  //     fd.append('empresa_id', document.getElementById("empresa_id").value);
  //     fd.append('usuario', document.getElementById("ssn_nombre").value);

  //     _npProgreso(35, 'Enviando al servidor...');

  //     const baseUrl = document.getElementById('base_url_api')?.value || '';
  //     const res = await fetch(baseUrl + 'Importar_pedidos_excel', {
  //       method: 'POST',
  //       headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
  //       body: fd,
  //     });

  //     _npProgreso(70, 'Procesando respuesta...');

  //     const json = await res.json();   // { numero, mensaje, data: { insertados, errores } }

  //     _npProgreso(100, 'Finalizado');

  //     // Pequeño delay para que se vea el 100%
  //     await _sleep(500);

  //     _npMostrarResultado(json);

  //   } catch (err) {
  //     console.error('Error al importar:', err);
  //     _npMostrarSeccion('upload');
  //     Swal.fire({
  //       icon: 'error', title: 'Error de conexión',
  //       text: 'No se pudo comunicar con el servidor. Intenta nuevamente.'
  //     });
  //   }
  // }

  // /* ── Mostrar resultado en la sección 4 ─────────────── */
  // function _npMostrarResultado(json) {
  //   _npMostrarSeccion('result');

  //   const ok = json.numero === 200;
  //   const data = json.data || {};
  //   const insertados = data.insertados ?? 0;
  //   const errores = data.errores ?? [];

  //   // Hero
  //   document.getElementById('np-result-icon').textContent = ok ? '✅' : '❌';
  //   document.getElementById('np-result-title').textContent =
  //     ok ? '¡Importación completada!' : 'Importación con problemas';
  //   document.getElementById('np-result-sub').innerHTML = json.mensaje || '';

  //   // Tarjetas resumen
  //   document.getElementById('np-sum-ok').textContent = insertados;
  //   document.getElementById('np-sum-err').textContent = errores.length;

  //   // Bloque de errores
  //   const blockErr = document.getElementById('np-block-errores');
  //   if (errores.length > 0) {
  //     blockErr.style.display = '';
  //     document.getElementById('np-badge-errores').textContent = errores.length;

  //     const detalle = document.getElementById('np-detail-errores');
  //     detalle.innerHTML = errores.map(e => `
  //     <div class="np-detail-row">
  //       <strong>Fila ${e.fila}</strong> — Pedido: <em>${e.pedido}</em><br>
  //       <span style="color:var(--im-red);">${(e.errores || []).join(' · ')}</span>
  //     </div>`).join('');
  //   } else {
  //     blockErr.style.display = 'none';
  //   }
  // }

  // /* ── Toggle acordeón de detalle ─────────────────────── */
  // function npToggleDetalle(tipo) {
  //   const body = document.getElementById(`np-detail-${tipo}`);
  //   body.classList.toggle('open');
  // }

  // /* ── Barra de progreso ──────────────────────────────── */
  // function _npProgreso(pct, label) {
  //   const fill = document.getElementById('np-progress-fill');
  //   const lbl = document.getElementById('np-pct-label');
  //   const rgt = document.getElementById('np-pct-right');
  //   if (fill) fill.style.width = pct + '%';
  //   if (lbl) lbl.textContent = pct + '%';
  //   if (rgt) rgt.textContent = pct + '%';
  // }

  // /* ── Mostrar/ocultar secciones ──────────────────────── */
  // function _npMostrarSeccion(sec) {
  //   const mapa = {
  //     upload: 'np-upload-section',
  //     preview: 'np-preview-section',
  //     progress: 'np-progress-section',
  //     result: 'np-result-section',
  //   };
  //   Object.entries(mapa).forEach(([k, id]) => {
  //     const el = document.getElementById(id);
  //     if (el) el.style.display = (k === sec) ? '' : 'none';
  //   });
  // }

  // /* ── Reset completo ─────────────────────────────────── */
  // function npReset() {
  //   window.globalData = [];
  //   window.npArchivoActual = null;
  //   document.getElementById('np_archivo_excel').value = '';
  //   document.getElementById('np-file-preview').classList.remove('show');
  //   document.getElementById('np-btn-previsualizar').disabled = true;
  //   document.getElementById('np_previewTable').innerHTML = '';
  //   document.getElementById('np-block-errores').style.display = 'none';
  //   _npProgreso(0, '0%');
  //   _npMostrarSeccion('upload');
  // }

  // /* ── Utilidad sleep ─────────────────────────────────── */
  // function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }


  // /* ═══════════════════════════════════════════════════════
  //  *  LISTAR CLIENTES (pedido individual)
  //  * ═══════════════════════════════════════════════════════ */
  // async function Listar_clientes() {
  //   try {
  //     const baseUrl = document.getElementById('base_url_api')?.value || '';
  //     const res = await fetch(baseUrl + 'torrecontrol/Listar_clientes', {
  //       method: 'POST', cache: 'no-cache'
  //     });
  //     const json = await res.json();
  //     const data = json.data ?? json;

  //     const sel = document.getElementById('slct_clientes_');
  //     if (!sel) return;
  //     sel.innerHTML = '<option value="">Seleccione cliente</option>';
  //     (data || []).forEach(c => {
  //       const o = document.createElement('option');
  //       o.value = c.id;
  //       o.textContent = c.razon_social || c.nombre || c.id;
  //       sel.appendChild(o);
  //     });

  //     if (typeof $ !== 'undefined') {
  //       $(sel).select2({ placeholder: 'Seleccione cliente', allowClear: true });
  //     }
  //   } catch (err) {
  //     console.error('Error al listar clientes:', err);
  //   }
  // }


  // /* ═══════════════════════════════════════════════════════
  //  *  PEDIDO INDIVIDUAL (funciones existentes, sin cambios)
  //  * ═══════════════════════════════════════════════════════ */
  // function agregar_mercancia() {
  //   // Tu lógica original aquí (sin cambios)
  // }

  // async function guardar_mercancias() {
  //   // Tu lógica original aquí (sin cambios)
  //   const mercancias = {
  //     referencia_pedido: [], ciudad_origen: [], sitio_cargue: [],
  //     ciudad_destino: [], sitio_descargue: [], cod_producto: [],
  //     producto: [], peso_neto: [], peso_bruto: [], presentacion: [],
  //     unidades: [], lote: [], num_estibas: [], fecha_cargue: [], fecha_entrega: [],
  //   };

  //   // Recolectar inputs (mantiene la misma lógica de tus .each())
  //   const recolectar = (selector, key) => {
  //     document.querySelectorAll(selector).forEach(el => {
  //       if (el.value) mercancias[key].push(el.value);
  //     });
  //   };
  //   recolectar('.referencia_pedido_', 'referencia_pedido');
  //   recolectar('.slct_origen_', 'ciudad_origen');
  //   recolectar('.sitio_cargue_', 'sitio_cargue');
  //   recolectar('.slct_destino_', 'ciudad_destino');
  //   recolectar('.sitio_descargue_', 'sitio_descargue');
  //   recolectar('.cod_producto_', 'cod_producto');
  //   recolectar('.producto_', 'producto');
  //   recolectar('.peso_neto_', 'peso_neto');
  //   recolectar('.peso_bruto_', 'peso_bruto');
  //   recolectar('.presentacion_', 'presentacion');
  //   recolectar('.unidades_', 'unidades');
  //   recolectar('.lote_', 'lote');
  //   recolectar('.num_estibas_', 'num_estibas');
  //   recolectar('.fecha_cargue_', 'fecha_cargue');
  //   recolectar('.fecha_entrega_', 'fecha_entrega');

  //   if (!mercancias.ciudad_origen.length) {
  //     Swal.fire({
  //       icon: 'warning', title: 'Sin datos',
  //       text: 'No hay mercancías para guardar.'
  //     }); return;
  //   }

  //   const baseUrl = document.getElementById('base_url_api')?.value
  //     || document.getElementById('base_url')?.value || '';

  //   const fd = new FormData();
  //   fd.append('mercancias', JSON.stringify(mercancias));
  //   fd.append('cliente', document.getElementById('slct_clientes_')?.value || '');

  //   try {
  //     const res = await fetch(baseUrl + 'torrecontrol/insertar_pedido_torre_control', {
  //       method: 'POST', body: fd, cache: 'no-cache'
  //     });
  //     const json = await res.json();

  //     const ok = json.numero === 200 || json.success === true;
  //     Swal.fire({
  //       icon: ok ? 'success' : 'error',
  //       title: ok ? '¡Guardado!' : 'Error',
  //       html: json.mensaje || json.message || (ok ? 'Pedido guardado.' : 'Error al guardar.'),
  //     });
  //     if (ok) resetFormulario();

  //   } catch (err) {
  //     console.error(err);
  //     Swal.fire({
  //       icon: 'error', title: 'Error de conexión',
  //       text: 'No se pudo conectar con el servidor.'
  //     });
  //   }
  // }

  // function resetFormulario() {
  //   document.querySelectorAll('.tab-pane input, .tab-pane select, .tab-pane textarea')
  //     .forEach(el => { el.value = ''; });
  //   const first = document.querySelector('.nav-tabs li:first-child a');
  //   if (first) first.click();
  // }

  /**
   * nuevo_pedido.js  —  Torre de Control / Nuevo Pedido
   * ─────────────────────────────────────────────────────
   * Maneja:
   *  • Selección de tipo de pedido (masivo / individual)
   *  • Drag & drop + selección de archivo Excel
   *  • Preview local con SheetJS (XLSX)
   *  • Envío al servidor → TorreControlController::importarPedidosExcel
   *  • Secciones de progreso y resultado con manejo completo
   *    de la respuesta { numero, mensaje, data: { insertados, errores } }
   */

  /* ═══════════════════════════════════════════════════════
   *  ESTADO GLOBAL
   * ═══════════════════════════════════════════════════════ */
  if (!window.globalData) window.globalData = [];
  if (!window.npArchivoActual) window.npArchivoActual = null;

  /* ═══════════════════════════════════════════════════════
   *  INIT
   * ═══════════════════════════════════════════════════════ */
  window.initScript = function (id) {
    window.VENTANA = id;
    Listar_clientes();
    _initSelectTipo();
    _initArchivoInput();
  };

  /* ── Selector de tipo de pedido ─────────────────────── */
  function _initSelectTipo() {
    const select = document.getElementById('miSelect');

    select.addEventListener('change', function () {
      const masivo = document.getElementById('np-bloque-masivo');
      const individual = document.getElementById('crear_pedido');

      if (this.value === 'cargue') {
        masivo.style.display = '';
        individual.style.display = 'none';
        npReset();                         // asegurar estado limpio
      } else if (this.value === 'crear_pedido') {
        masivo.style.display = 'none';
        individual.style.display = '';
      } else {
        masivo.style.display = 'none';
        individual.style.display = 'none';
      }
    });
  }

  /* ── Input de archivo ───────────────────────────────── */
  function _initArchivoInput() {
    const input = document.getElementById('np_archivo_excel');
    input.addEventListener('change', function () {
      if (this.files[0]) npOnArchivoSeleccionado(this.files[0]);
    });

    // Botón previsualizar
    document.getElementById('np-btn-previsualizar').addEventListener('click', npPrevisualizar);

    // Botón importar
    document.getElementById('np-btn-importar').addEventListener('click', npImportar);

    // Botón cancelar preview
    document.getElementById('np-btn-cancelar').addEventListener('click', npReset);

    // Click en botones de pedido individual
    document.addEventListener('click', async (e) => {
      if (e.target.closest('#agregar_fila')) agregar_mercancia();
      if (e.target.closest('#btn_guardar_pedido')) guardar_mercancias();
      if (e.target.closest('#btn-cancelar-pedido')) {
        document.getElementById('crear_pedido').style.display = 'none';
        document.getElementById('miSelect').value = '';
      }
    });
  }

  /* ═══════════════════════════════════════════════════════
   *  DRAG & DROP
   * ═══════════════════════════════════════════════════════ */
  function npDragOver(e) {
    e.preventDefault();
    document.getElementById('np-dropzone').classList.add('dragover');
  }

  function npDragLeave(e) {
    document.getElementById('np-dropzone').classList.remove('dragover');
  }

  function npDrop(e) {
    e.preventDefault();
    document.getElementById('np-dropzone').classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) npOnArchivoSeleccionado(file);
  }

  /* ── Archivo seleccionado ────────────────────────────── */
  function npOnArchivoSeleccionado(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['xls', 'xlsx'].includes(ext)) {
      Swal.fire({
        icon: 'warning', title: 'Formato incorrecto',
        text: 'Solo se permiten archivos .xlsx o .xls.'
      });
      return;
    }

    window.npArchivoActual = file;

    // Mostrar badge con info del archivo
    const preview = document.getElementById('np-file-preview');
    document.getElementById('np-file-name').textContent = file.name;
    document.getElementById('np-file-size').textContent =
      (file.size / 1024).toFixed(1) + ' KB';
    preview.classList.add('show');

    // Habilitar botón previsualizar
    document.getElementById('np-btn-previsualizar').disabled = false;
  }

  function npLimpiarArchivo() {
    window.npArchivoActual = null;
    window.globalData = [];
    document.getElementById('np_archivo_excel').value = '';
    document.getElementById('np-file-preview').classList.remove('show');
    document.getElementById('np-btn-previsualizar').disabled = true;
    _npMostrarSeccion('upload');
  }

  /* ═══════════════════════════════════════════════════════
   *  PREVISUALIZAR EXCEL (SheetJS local)
   * ═══════════════════════════════════════════════════════ */
  // function npPrevisualizar() {
  //   const file = window.npArchivoActual;
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = function (e) {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const sheet = workbook.Sheets[workbook.SheetNames[0]];
  //     const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  //     if (!sheetData.length) {
  //       Swal.fire({
  //         icon: 'warning', title: 'Archivo vacío',
  //         text: 'El archivo no contiene datos.'
  //       });
  //       return;
  //     }

  //     const allHeaders = sheetData[0];
  //     const filasUtiles = sheetData.slice(1).filter(row =>
  //       row.some(c => c !== undefined && c !== null && String(c).trim() !== '')
  //     );

  //     if (!filasUtiles.length) {
  //       Swal.fire({
  //         icon: 'warning', title: 'Sin datos',
  //         text: 'El archivo solo tiene cabeceras, no hay filas de datos.'
  //       });
  //       return;
  //     }

  //     // Guardar globalData (array de objetos con campos nombrados)
  //     // Mapeo exacto de la plantilla IMPO_PL-PEDIDOS-CQ-V1 (31 columnas)
  //     const COLUMNAS = [
  //       'modalidad', 'cliente', 'pedido', 'ciudad_origen', 'remitente',
  //       'ciudad_destino', 'destinatario', 'cod_producto', 'producto',
  //       'kg_neto', 'kg_bruto', 'presentacion', 'unidades', 'lote', 'nro_estibas',
  //       'fecha_cargue', 'hora_cargue', 'fecha_entrega', 'hora_entrega',
  //       'tipo_vehiculo', 'costo', 'tarifa',
  //       'fecha_retiro_contenedor', 'hora_retiro_contenedor',
  //       'booking', 'unidad_transporte', 'observaciones',
  //       'latitud_origen', 'longitud_origen', 'latitud_destino', 'longitud_destino','codigo_remitente','codigo_destinatario'
  //     ];

  //     window.globalData = filasUtiles.map(row => {
  //       const obj = {};
  //       COLUMNAS.forEach((key, i) => { obj[key] = row[i] ?? ''; });
  //       return obj;
  //     });

  //     _renderizarTabla(allHeaders, filasUtiles);
  //     _npMostrarSeccion('preview');
  //     document.getElementById('np-badge-filas').textContent = filasUtiles.length + ' fila(s)';
  //   };
  //   reader.readAsArrayBuffer(file);
  // }

  /* ═══════════════════════════════════════════════════════
   * PREVISUALIZAR EXCEL (SheetJS local) - CORREGIDO
   * ═══════════════════════════════════════════════════════ */
  function npPrevisualizar() {
    const file = window.npArchivoActual;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array', cellDates: true }); // cellDates para mejor manejo de fechas
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      /**
       * SOLUCIÓN AL DESCUADRE:
       * 1. Usamos 'defval: ""' para que las celdas vacías no se omitan del array.
       * 2. 'header: 1' nos da un array de arrays.
       */
      const sheetData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: "",
        blankrows: false
      });

      if (!sheetData.length) {
        Swal.fire({ icon: 'warning', title: 'Archivo vacío', text: 'El archivo no contiene datos.' });
        return;
      }

      const allHeaders = sheetData[0];

      // Filtrar filas que no tengan contenido real (evitar basura al final del Excel)
      const filasUtiles = sheetData.slice(1).filter(row =>
        row.some(c => c !== undefined && c !== null && String(c).trim() !== '')
      );

      if (!filasUtiles.length) {
        Swal.fire({ icon: 'warning', title: 'Sin datos', text: 'El archivo solo tiene cabeceras.' });
        return;
      }

      // Mapeo exacto basado en tu estructura (33 columnas según tu lista)
      const COLUMNAS = [
        'modalidad', 'cliente', 'pedido', 'ciudad_origen', 'remitente',
        'ciudad_destino', 'destinatario', 'cod_producto', 'producto',
        'kg_neto', 'kg_bruto', 'presentacion', 'unidades', 'lote', 'nro_estibas',
        'fecha_cargue', 'hora_cargue', 'fecha_entrega', 'hora_entrega',
        'tipo_vehiculo', 'costo', 'tarifa',
        'fecha_retiro_contenedor', 'hora_retiro_contenedor',
        'booking', 'unidad_transporte', 'observaciones',
        'latitud_origen', 'longitud_origen', 'latitud_destino', 'longitud_destino',
        'codigo_remitente', 'codigo_destinatario'
      ];

      window.globalData = filasUtiles.map((row, rowIndex) => {
        const obj = {};
        COLUMNAS.forEach((key, i) => {
          /**
           * row[i] ahora será exactamente la columna i gracias a 'defval'.
           * Si el Excel tiene menos columnas de las esperadas, ponemos string vacío.
           */
          let valor = row[i];

          // Limpieza básica de strings
          if (typeof valor === 'string') valor = valor.trim();

          obj[key] = (valor !== undefined && valor !== null) ? valor : '';
        });
        return obj;
      });

      // Renderizado
      _renderizarTabla(allHeaders, filasUtiles);
      _npMostrarSeccion('preview');

      const badge = document.getElementById('np-badge-filas');
      if (badge) badge.textContent = filasUtiles.length + ' fila(s)';
    };
    reader.readAsArrayBuffer(file);
  }

  /* ── Renderizar tabla de preview ────────────────────── */
  function _renderizarTabla(headers, filas) {
    const table = document.getElementById('np_previewTable');
    table.innerHTML = '';

    // THEAD
    const thead = document.createElement('thead');
    const trH = document.createElement('tr');
    ['#', ...headers, 'Acción'].forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      trH.appendChild(th);
    });
    thead.appendChild(trH);
    table.appendChild(thead);

    // TBODY
    const tbody = document.createElement('tbody');
    filas.forEach((rowData, rowIdx) => {
      const tr = document.createElement('tr');

      // # de fila
      const tdNum = document.createElement('td');
      tdNum.innerHTML = `<span class="np-badge-fila">${rowIdx + 2}</span>`;
      tr.appendChild(tdNum);

      // Celdas de datos
      rowData.forEach((cell, colIdx) => {
        const td = document.createElement('td');
        td.textContent = _formatearCelda(cell, headers[colIdx] || '');
        tr.appendChild(td);
      });

      // Botón eliminar
      const tdAcc = document.createElement('td');
      tdAcc.innerHTML = `<button class="btn-del-row" data-idx="${rowIdx}" title="Eliminar fila">
                         <i class="fas fa-trash-alt"></i>
                       </button>`;
      tr.appendChild(tdAcc);
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);

    // Delegación para eliminar filas del preview
    tbody.addEventListener('click', e => {
      const btn = e.target.closest('.btn-del-row');
      if (!btn) return;
      const idx = parseInt(btn.dataset.idx);
      window.globalData.splice(idx, 1);
      npPrevisualizar();   // re-render con datos actualizados
    });
  }

  /* ── Formatear celda según nombre de columna ─────────── */
  function _formatearCelda(valor, nombreCol) {
    if (valor === undefined || valor === null) return '';
    const col = nombreCol.toLowerCase();

    if (typeof valor === 'number') {
      // Columnas de FECHA — número serial Excel (> 1)
      if (col.includes('fecha')) {
        const d = new Date((valor - 25569) * 86400 * 1000);
        return d.toISOString().split('T')[0];
      }
      // Columnas de HORA — fracción decimal (< 1)
      if (col.includes('hora')) {
        const seg = Math.round(valor * 86400);
        const h = Math.floor(seg / 3600);
        const m = Math.floor((seg % 3600) / 60);
        const s = seg % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      }
    }

    // Objeto Date que SheetJS ya parseó
    if (valor instanceof Date) {
      if (col.includes('hora')) return valor.toTimeString().slice(0, 8);
      if (col.includes('fecha')) return valor.toISOString().split('T')[0];
      return valor.toISOString().split('T')[0];
    }

    return String(valor);
  }

  /* ═══════════════════════════════════════════════════════
   *  IMPORTAR → servidor
   * ═══════════════════════════════════════════════════════ */
  async function npImportar() {
    if (!window.globalData.length) {
      Swal.fire({
        icon: 'warning', title: 'Sin datos',
        text: 'No hay filas para importar.'
      }); return;
    }

    const modalidad = document.getElementById('miSelectModalidad').value;
    if (!modalidad) {
      document.getElementById('miSelectModalidad').classList.add('is-invalid');
      Swal.fire({
        icon: 'warning', title: 'Modalidad requerida',
        text: 'Selecciona una modalidad antes de importar.'
      }); return;
    }

    const conf = await Swal.fire({
      title: '¿Importar pedidos?',
      html: `<strong>${window.globalData.length}</strong> fila(s) serán enviadas al servidor.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1a5ce5',
      cancelButtonColor: '#9FA6B2',
      confirmButtonText: 'Sí, importar',
      cancelButtonText: 'Cancelar',
      customClass: { popup: 'swal2-custom-font' },
    });
    if (!conf.isConfirmed) return;

    // ── Mostrar progreso ──────────────────────────────────
    _npMostrarSeccion('progress');
    _npProgreso(10, 'Preparando datos...');

    try {
      // Construir FormData con el archivo original
      const fd = new FormData();
      fd.append('archivo', window.npArchivoActual);
      fd.append('modalidad', document.getElementById("miSelectModalidad").value);
      fd.append('empresa_id', document.getElementById("empresa_id").value);
      fd.append('usuario', document.getElementById("ssn_nombre").value);

      _npProgreso(35, 'Enviando al servidor...');

      const baseUrl = document.getElementById('base_url_api')?.value || '';
      const res = await fetch(baseUrl + 'Importar_pedidos_excel', {
        method: 'POST',
        headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
        body: fd,
      });

      _npProgreso(70, 'Procesando respuesta...');

      const json = await res.json();   // { numero, mensaje, data: { insertados, errores } }

      _npProgreso(100, 'Finalizado');

      // Pequeño delay para que se vea el 100%
      await _sleep(500);

      _npMostrarResultado(json);

    } catch (err) {
      console.error('Error al importar:', err);
      _npMostrarSeccion('upload');
      Swal.fire({
        icon: 'error', title: 'Error de conexión',
        text: 'No se pudo comunicar con el servidor. Intenta nuevamente.'
      });
    }
  }

  /* ── Mostrar resultado en la sección 4 ─────────────── */
  function _npMostrarResultado(json) {
    _npMostrarSeccion('result');

    const ok = json.numero === 200;
    const data = json.data || {};
    const insertados = data.insertados ?? 0;
    const errores = data.errores ?? [];

    // Hero
    document.getElementById('np-result-icon').textContent = ok ? '✅' : '❌';
    document.getElementById('np-result-title').textContent =
      ok ? '¡Importación completada!' : 'Importación con problemas';
    document.getElementById('np-result-sub').innerHTML = json.mensaje || '';

    // Tarjetas resumen
    document.getElementById('np-sum-ok').textContent = insertados;
    document.getElementById('np-sum-err').textContent = errores.length;

    // Bloque de errores
    const blockErr = document.getElementById('np-block-errores');
    if (errores.length > 0) {
      blockErr.style.display = '';
      document.getElementById('np-badge-errores').textContent = errores.length;

      const detalle = document.getElementById('np-detail-errores');
      detalle.innerHTML = errores.map(e => `
      <div class="np-detail-row">
        <strong>Fila ${e.fila}</strong> — Pedido: <em>${e.pedido}</em><br>
        <span style="color:var(--im-red);">${(e.errores || []).join(' · ')}</span>
      </div>`).join('');
    } else {
      blockErr.style.display = 'none';
    }
  }

  /* ── Toggle acordeón de detalle ─────────────────────── */
  function npToggleDetalle(tipo) {
    const body = document.getElementById(`np-detail-${tipo}`);
    body.classList.toggle('open');
  }

  /* ── Barra de progreso ──────────────────────────────── */
  function _npProgreso(pct, label) {
    const fill = document.getElementById('np-progress-fill');
    const lbl = document.getElementById('np-pct-label');
    const rgt = document.getElementById('np-pct-right');
    if (fill) fill.style.width = pct + '%';
    if (lbl) lbl.textContent = pct + '%';
    if (rgt) rgt.textContent = pct + '%';
  }

  /* ── Mostrar/ocultar secciones ──────────────────────── */
  function _npMostrarSeccion(sec) {
    const mapa = {
      upload: 'np-upload-section',
      preview: 'np-preview-section',
      progress: 'np-progress-section',
      result: 'np-result-section',
    };
    Object.entries(mapa).forEach(([k, id]) => {
      const el = document.getElementById(id);
      if (el) el.style.display = (k === sec) ? '' : 'none';
    });
  }

  /* ── Reset completo ─────────────────────────────────── */
  function npReset() {
    window.globalData = [];
    window.npArchivoActual = null;
    document.getElementById('np_archivo_excel').value = '';
    document.getElementById('np-file-preview').classList.remove('show');
    document.getElementById('np-btn-previsualizar').disabled = true;
    document.getElementById('np_previewTable').innerHTML = '';
    document.getElementById('np-block-errores').style.display = 'none';
    _npProgreso(0, '0%');
    _npMostrarSeccion('upload');
  }

  /* ── Utilidad sleep ─────────────────────────────────── */
  function _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }


  /* ═══════════════════════════════════════════════════════
   *  LISTAR CLIENTES (pedido individual)
   * ═══════════════════════════════════════════════════════ */
  async function Listar_clientes() {
    try {
      const baseUrl = document.getElementById('base_url_api')?.value || '';
      const res = await fetch(baseUrl + 'torrecontrol/Listar_clientes', {
        method: 'POST', cache: 'no-cache'
      });
      const json = await res.json();
      const data = json.data ?? json;

      const sel = document.getElementById('slct_clientes_');
      if (!sel) return;
      sel.innerHTML = '<option value="">Seleccione cliente</option>';
      (data || []).forEach(c => {
        const o = document.createElement('option');
        o.value = c.id;
        o.textContent = c.razon_social || c.nombre || c.id;
        sel.appendChild(o);
      });

      if (typeof $ !== 'undefined') {
        $(sel).select2({ placeholder: 'Seleccione cliente', allowClear: true });
      }
    } catch (err) {
      console.error('Error al listar clientes:', err);
    }
  }


  /* ═══════════════════════════════════════════════════════
   *  PEDIDO INDIVIDUAL (funciones existentes, sin cambios)
   * ═══════════════════════════════════════════════════════ */
  function agregar_mercancia() {
    // Tu lógica original aquí (sin cambios)
  }

  async function guardar_mercancias() {
    // Tu lógica original aquí (sin cambios)
    const mercancias = {
      referencia_pedido: [], ciudad_origen: [], sitio_cargue: [],
      ciudad_destino: [], sitio_descargue: [], cod_producto: [],
      producto: [], peso_neto: [], peso_bruto: [], presentacion: [],
      unidades: [], lote: [], num_estibas: [], fecha_cargue: [], fecha_entrega: [],
    };

    // Recolectar inputs (mantiene la misma lógica de tus .each())
    const recolectar = (selector, key) => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.value) mercancias[key].push(el.value);
      });
    };
    recolectar('.referencia_pedido_', 'referencia_pedido');
    recolectar('.slct_origen_', 'ciudad_origen');
    recolectar('.sitio_cargue_', 'sitio_cargue');
    recolectar('.slct_destino_', 'ciudad_destino');
    recolectar('.sitio_descargue_', 'sitio_descargue');
    recolectar('.cod_producto_', 'cod_producto');
    recolectar('.producto_', 'producto');
    recolectar('.peso_neto_', 'peso_neto');
    recolectar('.peso_bruto_', 'peso_bruto');
    recolectar('.presentacion_', 'presentacion');
    recolectar('.unidades_', 'unidades');
    recolectar('.lote_', 'lote');
    recolectar('.num_estibas_', 'num_estibas');
    recolectar('.fecha_cargue_', 'fecha_cargue');
    recolectar('.fecha_entrega_', 'fecha_entrega');

    if (!mercancias.ciudad_origen.length) {
      Swal.fire({
        icon: 'warning', title: 'Sin datos',
        text: 'No hay mercancías para guardar.'
      }); return;
    }

    const baseUrl = document.getElementById('base_url_api')?.value
      || document.getElementById('base_url')?.value || '';

    const fd = new FormData();
    fd.append('mercancias', JSON.stringify(mercancias));
    fd.append('cliente', document.getElementById('slct_clientes_')?.value || '');

    try {
      const res = await fetch(baseUrl + 'torrecontrol/insertar_pedido_torre_control', {
        method: 'POST', body: fd, cache: 'no-cache'
      });
      const json = await res.json();

      const ok = json.numero === 200 || json.success === true;
      Swal.fire({
        icon: ok ? 'success' : 'error',
        title: ok ? '¡Guardado!' : 'Error',
        html: json.mensaje || json.message || (ok ? 'Pedido guardado.' : 'Error al guardar.'),
      });
      if (ok) resetFormulario();

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error', title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor.'
      });
    }
  }

  function resetFormulario() {
    document.querySelectorAll('.tab-pane input, .tab-pane select, .tab-pane textarea')
      .forEach(el => { el.value = ''; });
    const first = document.querySelector('.nav-tabs li:first-child a');
    if (first) first.click();
  }

})();