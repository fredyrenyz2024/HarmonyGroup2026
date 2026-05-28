/**
 * generacion_automatica_ventas.js
 * ═══════════════════════════════════════════════════════════════════════════
 * REQ 19v — Generación Automática de Rutas para Actualizar (VENTAS)
 * REQ 20v — Parámetro TOP % de Viajes (VENTAS)
 *
 * DIFERENCIA vs generacion_automaticas.js (COSTOS):
 *   - Endpoints: /rutas-prioritarias-ventas/* (en lugar de /rutas-prioritarias/*)
 *   - El modal incluye campo cliente_id (tarifa específica por cliente)
 *   - Procedencia de componentes = 'VENTA' (en lugar de 'COSTO')
 *   - Colores/indicadores visuales diferenciados para VENTAS
 *
 * ENDPOINTS CONSUMIDOS:
 *   [A] GET  /rutas-prioritarias-ventas/parametro?empresa_id=X
 *   [B] POST /rutas-prioritarias-ventas/parametro
 *   [C] GET  /rutas-prioritarias-ventas/filtros/clientes?empresa_id=X
 *   [D] GET  /rutas-prioritarias-ventas/filtros/zonas?empresa_id=X
 *   [E] POST /rutas-prioritarias-ventas/generar
 *   [F] GET  /rutas-prioritarias-ventas/detalle/{tarifaId}?empresa_id=X
 *   [G] POST /rutas-prioritarias-ventas/actualizar
 *   [H] POST /rutas-prioritarias-ventas/actualizar-masivo
 *   [I] POST /rutas-prioritarias-ventas/exportar
 *
 * IDs del phtml:
 *   SLIDER:  #top-slider, #top-display-val, #top-input, .preset-btn, #param-status, #param-status-text
 *   FILTROS: #g-desde, #g-hasta, #g-cliente, #g-zona
 *   STATS:   #st-rutas, #st-sin, #st-venc, #st-porv, #st-vig
 *   PARETO:  #pareto-wrap, #pareto-fill, #pareto-fill-label, #pareto-info, #pareto-rutas-total
 *   TABLA:   #table-wrap, #table-count, #count-txt, #tbl-filter, #actions-bar, #sel-count
 *   MODAL:   #modal-editar, #modal-title, #modal-ruta-info
 *            #m-origen, #m-destino, #m-vehiculo, #m-viajes, #m-estado-badge
 *            #m-sicetac, #m-mercado, #m-cliente-id, #m-cliente-label
 *            #m-plena, #m-multi-recogida, #m-multi-entrega
 *            #multi-origen-rows, #multi-origen-empty
 *            #multi-destino-rows, #multi-destino-empty
 *            #m-anio, #m-mes
 * ═══════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
   | SESIÓN Y CABECERAS
   ══════════════════════════════════════════════════════════ */
  const API = () => (document.getElementById('base_url_api')?.value || '').replace(/\/$/, '');
  const EMPRESA = () => parseInt(document.getElementById('empresa_id')?.value || 0);
  const USUARIO = () => document.getElementById('ssn_nombre')?.value || 'sistema';
  const HEADERS = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-KEY': 'nexos_nacional2026@*',
  });

  /* Prefijo de endpoint — solo cambia esto si el backend usa otra URL base */
  const EP = () => `${API()}/rutas-prioritarias-ventas`;

  /* ══════════════════════════════════════════════════════════
   | ESTADO GLOBAL
   ══════════════════════════════════════════════════════════ */
  const S = {
    allData: [],
    filteredData: [],
    selected: new Set(),
    currentEstado: 'todas',
    maxViajes: 1,
    resumen: null,
    // Modal
    editItem: null,
    editItemIdx: -1,
    multiOrigenRows: [],
    multiDestinoRows: [],
    modalCargando: false,
    clienteMap: {},   // id → nombre (para mostrar en tabla)
  };

  /* ══════════════════════════════════════════════════════════
   | INIT
   ══════════════════════════════════════════════════════════ */
  function _init() {
    _initFechas();
    _cargarParametro();
    _cargarClientes();
    _cargarZonas();

    const flt = document.getElementById('tbl-filter');
    if (flt) flt.addEventListener('input', () => { _applyFilters(); _renderTabla(); });
  }

  function _initFechas() {
    const hoy = new Date();
    const hace3 = new Date(hoy);
    hace3.setMonth(hace3.getMonth() - 3);
    _v('g-desde', hace3.toISOString().slice(0, 10));
    _v('g-hasta', hoy.toISOString().slice(0, 10));
    const mes = document.getElementById('m-mes');
    if (mes) mes.value = hoy.getMonth() + 1;
    _v('m-anio', hoy.getFullYear());
  }

  /* ══════════════════════════════════════════════════════════
   | [A] LEER PARÁMETRO TOP
   ══════════════════════════════════════════════════════════ */
  function _cargarParametro() {
    if (!EMPRESA()) return;
    fetch(`${EP()}/parametro?empresa_id=${EMPRESA()}`, { headers: HEADERS() })
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        _setSlider(res.data?.porcentaje_top ?? 80);
        if (res.data?.actualizado) {
          _t('param-status-text', `Guardado el ${res.data.actualizado} · por ${res.data.usuario || '—'}`);
          const st = document.getElementById('param-status');
          if (st) st.style.display = 'flex';
        }
      })
      .catch(() => { });
  }

  /* ══════════════════════════════════════════════════════════
   | [B] GUARDAR PARÁMETRO TOP
   ══════════════════════════════════════════════════════════ */
  window.ventasRP = window.ventasRP || {};
  window.ventasRP.guardarParametro = function () {
    const val = parseInt(document.getElementById('top-slider')?.value);
    if (isNaN(val) || val < 1 || val > 100) {
      _toast('El parámetro debe estar entre 1 y 100.', 'warning'); return;
    }
    fetch(`${EP()}/parametro`, {
      method: 'POST', headers: HEADERS(),
      body: JSON.stringify({ empresa_id: EMPRESA(), porcentaje_top: val, usuario: USUARIO() }),
    })
      .then(r => r.json())
      .then(res => {
        _toast(res.message || (res.success ? 'Guardado.' : 'Error.'), res.success ? 'success' : 'error');
        if (res.success) {
          _t('param-status-text', `Guardado · ${new Date().toLocaleString('es-CO')} · ${USUARIO()}`);
          const st = document.getElementById('param-status');
          if (st) st.style.display = 'flex';
        }
      })
      .catch(() => _toast('Error al guardar el parámetro.', 'error'));
  };

  /* ══════════════════════════════════════════════════════════
   | SLIDER HELPERS
   ══════════════════════════════════════════════════════════ */
  function _setSlider(val) {
    const sl = document.getElementById('top-slider');
    if (sl) { sl.value = val; _onSliderChange(val); }
  }
  function _onSliderChange(val) {
    _s('top-display-val', val);
    _v('top-input', val);
    const sl = document.getElementById('top-slider');
    if (sl) sl.style.setProperty('--pct', val + '%');
    document.querySelectorAll('.preset-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.textContent) === parseInt(val));
    });
  }
  window.ventasRP.onSlider = _onSliderChange;
  window.ventasRP.setPreset = function (val) { _setSlider(val); };

  /* ══════════════════════════════════════════════════════════
   | [C] CARGAR CLIENTES
   ══════════════════════════════════════════════════════════ */
  function _cargarClientes() {
    const sel = document.getElementById('g-cliente');
    if (!sel || !EMPRESA()) return;
    fetch(`${EP()}/filtros/clientes?empresa_id=${EMPRESA()}`, { headers: HEADERS() })
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        sel.innerHTML = '<option value="">Todos los clientes</option>';
        (res.data || []).forEach(c => {
          S.clienteMap[c.id] = c.nombre;
          const o = document.createElement('option');
          o.value = c.id; o.textContent = c.nombre;
          sel.appendChild(o);
        });
      })
      .catch(() => { });
  }

  /* ══════════════════════════════════════════════════════════
   | [D] CARGAR ZONAS
   ══════════════════════════════════════════════════════════ */
  function _cargarZonas() {
    const sel = document.getElementById('g-zona');
    if (!sel || !EMPRESA()) return;
    fetch(`${EP()}/filtros/zonas?empresa_id=${EMPRESA()}`, { headers: HEADERS() })
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        sel.innerHTML = '<option value="">Todas las zonas</option>';
        (res.data || []).forEach(z => {
          const o = document.createElement('option');
          o.value = z.id; o.textContent = z.nombre_zona;
          sel.appendChild(o);
        });
      })
      .catch(() => { });
  }

  /* ══════════════════════════════════════════════════════════
   | [E] GENERAR LISTA PRIORIZADA
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.generarLista = function () {
    const payload = _buildPayload();
    if (!payload) return;

    _showLoading('Generando lista priorizada de tarifas de venta...');
    _clearStats();
    S.selected.clear();
    _updateSelCount();

    fetch(`${EP()}/generar`, {
      method: 'POST', headers: HEADERS(), body: JSON.stringify(payload),
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(res => {
        if (!res.success) { _showError(res.message || 'Error en el servidor.'); return; }

        S.allData = res.data || [];
        S.resumen = res.resumen;
        S.currentEstado = 'todas';
        S.maxViajes = Math.max(1, ...S.allData.map(d => d.numero_viajes || 0));

        _renderStats(res.resumen);
        _renderParetoBar(res.resumen);
        _applyFilters();
        _renderTabla();
        _showResultadoUI();
      })
      .catch(e => _showError(`Error: ${e.message}`));
  };

  /* ══════════════════════════════════════════════════════════
   | TABS
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.setTab = function (tab) {
    S.currentEstado = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const el = document.getElementById('tab-' + tab);
    if (el) el.classList.add('active');
    _applyFilters();
    _renderTabla();
  };

  function _applyFilters() {
    const txt = (document.getElementById('tbl-filter')?.value || '').toLowerCase();
    const mapTab = { sin: 'SIN_TARIFA', vencida: 'VENCIDA', pv: 'POR_VENCER', vig: 'VIGENTE' };
    const estadoF = mapTab[S.currentEstado] || null;

    S.filteredData = S.allData.filter(d => {
      if (estadoF && d.estado !== estadoF) return false;
      if (!txt) return true;
      return [d.nombre_origen, d.nombre_destino, d.depto_origen, d.depto_destino,
      d.tipo_vehiculo, d.zona_origen, d.zona_destino]
        .some(v => (v || '').toLowerCase().includes(txt));
    });

    // Actualizar contadores de tabs
    const all = S.allData;
    _t('cnt-todas', `(${all.length})`);
    ['SIN_TARIFA', 'VENCIDA', 'POR_VENCER', 'VIGENTE'].forEach((e, i) => {
      const cnt = all.filter(d => d.estado === e).length;
      const ids = ['cnt-sin', 'cnt-vencida', 'cnt-pv', 'cnt-vig'];
    });
  }

  /* ══════════════════════════════════════════════════════════
   | RENDER TABLA
   ══════════════════════════════════════════════════════════ */
  function _renderTabla() {
    const data = S.filteredData.length ? S.filteredData : S.allData;
    const wrap = document.getElementById('table-wrap');
    if (!wrap) return;

    _s('count-txt', `${data.length} rutas`);

    if (!data.length) {
      wrap.innerHTML = `<div class="empty-state">
        <div class="empty-icon"><i class="fas fa-tags"></i></div>
        <div class="empty-text">No hay rutas de venta para mostrar con los filtros aplicados.</div>
      </div>`;
      return;
    }

    const rows = data.map((d, idx) => {
      const chk = `<input type="checkbox" onchange="ventasRP.toggleCheck(${idx})"
                      ${S.selected.has(idx) ? 'checked' : ''}>`;
      const semBadge = _semBadge(d.semaforo);
      const estTag = _estadoTag(d.estado);
      const tripBar = _tripBar(d.numero_viajes, S.maxViajes);
      const plena = d.tarifa_plena > 0
        ? `<span class="tv">$${_fmt(d.tarifa_plena)}</span>`
        : `<span class="tv-null">Sin tarifa</span>`;
      const diasStr = d.dias_sin_actualizar != null
        ? `<span style="font-size:.68rem;color:var(--muted)">${d.dias_sin_actualizar}d</span>` : '—';
      const clienteLabel = d.cliente_tarifa_id
        ? `<span style="font-size:.65rem;background:#d1fae5;color:#065f46;padding:1px 5px;border-radius:3px">${S.clienteMap[d.cliente_tarifa_id] || 'ID:' + d.cliente_tarifa_id}</span>`
        : `<span style="font-size:.65rem;color:var(--muted)">General</span>`;

      return `<tr>
        <td style="text-align:center;width:32px">${chk}</td>
        <td>${semBadge}</td>
        <td>
          <div style="font-weight:700;color:var(--navy);font-size:.8rem">${_esc(d.nombre_origen)}</div>
          <div style="font-size:.62rem;color:var(--muted)">${_esc(d.depto_origen)} · ${_esc(d.zona_origen || '—')}</div>
        </td>
        <td>
          <div style="font-weight:700;color:var(--navy);font-size:.8rem">${_esc(d.nombre_destino)}</div>
          <div style="font-size:.62rem;color:var(--muted)">${_esc(d.depto_destino)} · ${_esc(d.zona_destino || '—')}</div>
        </td>
        <td><span style="font-family:'DM Mono',monospace;font-size:.75rem;font-weight:700">${_esc(d.tipo_vehiculo)}</span></td>
        <td>${tripBar}</td>
        <td>${plena}</td>
        <td>${estTag}</td>
        <td>${diasStr}</td>
        <td>${clienteLabel}</td>
        <td>
          <div style="font-size:.65rem;color:var(--muted)">
            ${d.anio_tarifa ? `${d.anio_tarifa}/${String(d.mes_tarifa).padStart(2, '0')}` : '—'}
          </div>
        </td>
        <td style="white-space:nowrap;">
          <button class="btn btn-primary btn-sm" onclick="ventasRP.abrirModal(${idx})" title="Actualizar tarifa de venta">
            <i class="fas fa-edit"></i>
          </button>
        </td>
      </tr>`;
    }).join('');

    wrap.innerHTML = `<table class="main-table" id="tabla-ventas-prioritarias">
      <thead>
        <tr>
          <th><input type="checkbox" onchange="ventasRP.toggleTodos(this)"></th>
          <th>Estado</th>
          <th>Origen</th>
          <th>Destino</th>
          <th>Vehículo</th>
          <th>Viajes</th>
          <th>Tarifa Plena Venta</th>
          <th>Estado Tarifa</th>
          <th>Días</th>
          <th>Cliente</th>
          <th>Vigencia</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><td colspan="12" style="text-align:right;font-style:italic">${data.length} rutas · Tarifas de Venta</td></tr></tfoot>
    </table>`;

    setTimeout(() => _initDataTable('#tabla-ventas-prioritarias'), 100);
  }

  function _initDataTable(id) {
    const $t = $(id);
    if (!$t.length || !$.fn.DataTable) return;
    if ($.fn.DataTable.isDataTable(id)) $t.DataTable().destroy();
    $t.find('thead tr.filters').remove();

    const $fr = $('<tr class="filters"></tr>');
    $t.find('thead tr:first th').each(() => $fr.append('<th></th>'));
    $fr.appendTo($t.find('thead'));

    $t.DataTable({
      orderCellsTop: true, fixedHeader: true, destroy: true, pageLength: 25,
      language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
      columnDefs: [
        { orderable: false, targets: [0, 11] },
        { searchable: false, targets: [0, 11] },
      ],
      initComplete: function () {
        const api = this.api();
        api.columns().every(function (ci) {
          if (ci === 0 || ci === 11) return;
          const cell = $t.find('thead tr.filters th').get(ci);
          if (!cell) return;
          const title = $(api.column(ci).header()).text().trim();
          $(cell).html(`<input type="text" placeholder="${title}" style="font-size:11px;height:24px;width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:3px;padding:0 4px;">`);
          $('input', cell).on('keyup change', function (e) {
            e.stopPropagation();
            if (api.column(ci).search() !== this.value) api.column(ci).search(this.value).draw();
          });
        });
      },
    });
  }

  /* ══════════════════════════════════════════════════════════
   | SELECCIÓN
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.toggleCheck = function (idx) {
    if (S.selected.has(idx)) S.selected.delete(idx); else S.selected.add(idx);
    _updateSelCount();
  };
  window.ventasRP.toggleTodos = function (cb) {
    const data = S.filteredData.length ? S.filteredData : S.allData;
    data.forEach((_, i) => { if (cb.checked) S.selected.add(i); else S.selected.delete(i); });
    _updateSelCount();
    _renderTabla();
  };
  window.ventasRP.deseleccionarTodo = function () {
    S.selected.clear(); _updateSelCount(); _renderTabla();
  };
  function _updateSelCount() {
    _s('sel-count', `${S.selected.size} seleccionadas`);
    const ab = document.getElementById('actions-bar');
    if (ab) ab.style.display = S.selected.size ? 'flex' : 'none';
  }

  /* ══════════════════════════════════════════════════════════
   | MODAL — ABRIR
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.abrirModal = function (idx) {
    const data = S.filteredData.length ? S.filteredData : S.allData;
    const d = data[idx];
    if (!d) return;

    S.editItem = d;
    S.editItemIdx = idx;
    S.multiOrigenRows = [];
    S.multiDestinoRows = [];
    S.modalCargando = false;

    // Info ruta
    _t('m-origen', d.nombre_origen || d.origen);
    _t('m-destino', d.nombre_destino || d.destino);
    _t('m-vehiculo', d.tipo_vehiculo);
    _t('m-viajes', d.numero_viajes);
    _t('modal-title', 'Actualizar Tarifa de Venta');
    _t('modal-ruta-info', `${d.nombre_origen} → ${d.nombre_destino} · ${d.tipo_vehiculo}`);
    _t('m-sicetac', d.tarifa_sicetac || 'N/A');
    _t('m-mercado', d.tarifa_mercado || 'N/A');

    // Estado badge
    const eb = document.getElementById('m-estado-badge');
    if (eb) eb.innerHTML = _estadoTag(d.estado);

    // Cliente
    _v('m-cliente-id', d.cliente_tarifa_id || '');
    const cLabel = d.cliente_tarifa_id
      ? (S.clienteMap[d.cliente_tarifa_id] || 'ID: ' + d.cliente_tarifa_id)
      : 'General (aplica a todos)';
    _t('m-cliente-label', cLabel);

    // Vigencia
    const hoy = new Date();
    _v('m-anio', hoy.getFullYear());
    _v('m-mes', hoy.getMonth() + 1);

    // Valores actuales
    _v('m-plena', d.tarifa_plena || 0);
    _v('m-multi-recogida', d.multi_recogida || 0);
    _v('m-multi-entrega', d.multi_entrega || 0);

    // Limpiar rows dinámicos
    _renderMultiRows('origen', []);
    _renderMultiRows('destino', []);

    // Mostrar modal
    const modal = document.getElementById('modal-editar');
    if (modal) modal.style.display = 'flex';

    // Cargar detalles si hay tarifa
    if (d.tarifa_id) _cargarDetallesModal(d.tarifa_id);
  };

  /* ══════════════════════════════════════════════════════════
   | [F] CARGAR DETALLES DEL MODAL
   ══════════════════════════════════════════════════════════ */
  function _cargarDetallesModal(tarifaId) {
    S.modalCargando = true;
    fetch(`${EP()}/detalle/${tarifaId}?empresa_id=${EMPRESA()}`, { headers: HEADERS() })
      .then(r => r.json())
      .then(res => {
        if (!res.success || !res.data) return;
        const det = res.data;
        _v('m-plena', det.plena || 0);
        _v('m-multi-recogida', det.multi_recogida || 0);
        _v('m-multi-entrega', det.multi_entrega || 0);
        S.multiOrigenRows = det.multi_origen_detalles || [];
        S.multiDestinoRows = det.multi_destino_detalles || [];
        _renderMultiRows('origen', S.multiOrigenRows);
        _renderMultiRows('destino', S.multiDestinoRows);
      })
      .catch(() => { })
      .finally(() => { S.modalCargando = false; });
  }

  /* ══════════════════════════════════════════════════════════
   | MODAL — CERRAR
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.cerrarModal = function () {
    const modal = document.getElementById('modal-editar');
    if (modal) modal.style.display = 'none';
    S.editItem = null;
  };

  /* ══════════════════════════════════════════════════════════
   | [G] GUARDAR EDICIÓN (Tarifa de Venta)
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.guardarEdicion = function () {
    if (!S.editItem) return;

    const plena = parseFloat(document.getElementById('m-plena')?.value || 0);
    if (!plena || plena <= 0) { _toast('Ingrese un valor de tarifa plena mayor a 0.', 'warning'); return; }

    const multiOrigenDetalles = _recogerDetallesRows('origen');
    const multiDestinoDetalles = _recogerDetallesRows('destino');
    const multiOrigenTotal = multiOrigenDetalles.reduce((s, r) => s + (parseFloat(r.rate_1) || 0), 0);
    const multiDestinoTotal = multiDestinoDetalles.reduce((s, r) => s + (parseFloat(r.rate_1) || 0), 0);

    const clienteId = document.getElementById('m-cliente-id')?.value
      ? parseInt(document.getElementById('m-cliente-id').value) : null;

    const payload = {
      empresa_id: EMPRESA(),
      usuario: USUARIO(),
      origen: S.editItem.origen,
      destino: S.editItem.destino,
      tipo_vehiculo: S.editItem.tipo_vehiculo,
      plena: plena,
      multi_recogida: parseFloat(document.getElementById('m-multi-recogida')?.value || 0),
      multi_origen: multiOrigenTotal,
      multi_entrega: parseFloat(document.getElementById('m-multi-entrega')?.value || 0),
      multi_destino: multiDestinoTotal,
      multi_origen_detalles: multiOrigenDetalles,
      multi_destino_detalles: multiDestinoDetalles,
      cliente_id: clienteId,
    };

    fetch(`${EP()}/actualizar`, {
      method: 'POST', headers: HEADERS(), body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(res => {
        _toast(res.message || (res.success ? 'Tarifa de venta actualizada.' : 'Error.'),
          res.success ? 'success' : 'error');
        if (res.success) {
          // Actualizar datos en memoria
          const d = S.editItem;
          d.tarifa_id = res.tarifa_id;
          d.tarifa_plena = plena;
          d.multi_recogida = parseFloat(document.getElementById('m-multi-recogida')?.value || 0);
          d.multi_entrega = parseFloat(document.getElementById('m-multi-entrega')?.value || 0);
          d.multi_origen = multiOrigenTotal;
          d.multi_destino = multiDestinoTotal;
          d.estado = res.requiere_aprobacion ? 'PENDIENTE_APROBACION' : 'VIGENTE';
          d.semaforo = res.requiere_aprobacion ? 'amarillo' : 'verde';
          _renderTabla();
          _recalcStats();
          window.ventasRP.cerrarModal();
        }
      })
      .catch(() => _toast('Error al guardar la tarifa de venta.', 'error'));
  };

  /* ══════════════════════════════════════════════════════════
   | [H] ACTUALIZAR MASIVO
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.actualizarSeleccionadas = function () {
    const data = S.filteredData.length ? S.filteredData : S.allData;
    const sels = [...S.selected].map(i => data[i]).filter(Boolean);
    if (!sels.length) { _toast('Seleccione al menos una ruta.', 'warning'); return; }

    if (!confirm(`¿Actualizar ${sels.length} tarifas de venta seleccionadas?\nSe usarán los valores actuales de cada ruta.`)) return;

    const tarifas = sels.map(d => ({
      origen: d.origen,
      destino: d.destino,
      tipo_vehiculo: d.tipo_vehiculo,
      plena: d.tarifa_plena || 0,
      multi_recogida: d.multi_recogida || 0,
      multi_origen: d.multi_origen || 0,
      multi_entrega: d.multi_entrega || 0,
      multi_destino: d.multi_destino || 0,
      cliente_id: d.cliente_tarifa_id || null,
    }));

    fetch(`${EP()}/actualizar-masivo`, {
      method: 'POST', headers: HEADERS(),
      body: JSON.stringify({ empresa_id: EMPRESA(), usuario: USUARIO(), tarifas }),
    })
      .then(r => r.json())
      .then(res => {
        _toast(res.message || (res.success ? 'Proceso completado.' : 'Error.'),
          res.success ? 'success' : 'error');
        if (res.success) { S.selected.clear(); _updateSelCount(); window.ventasRP.generarLista(); }
      })
      .catch(() => _toast('Error en actualización masiva.', 'error'));
  };

  /* ══════════════════════════════════════════════════════════
   | [I] EXPORTAR
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.exportarExcel = function () {
    const data = S.filteredData.length ? S.filteredData : S.allData;
    if (!data.length) { _toast('No hay datos para exportar.', 'warning'); return; }

    fetch(`${EP()}/exportar`, {
      method: 'POST', headers: HEADERS(),
      body: JSON.stringify({ data, ruta: 'para_actualizar' }),
    })
      .then(r => r.json())
      .then(res => {
        if (!res.success) { _toast('Error al exportar.', 'error'); return; }
        _exportarSheetJS(res.data, 'Rutas_Ventas_Prioritarias');
        _toast(`${res.total} rutas exportadas.`, 'success');
      })
      .catch(() => _toast('Error al exportar.', 'error'));
  };

  function _exportarSheetJS(filas, nombre) {
    if (!window.XLSX) { _toast('SheetJS no disponible.', 'error'); return; }
    const ws = XLSX.utils.json_to_sheet(filas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, nombre.slice(0, 31));
    XLSX.writeFile(wb, `${nombre}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  /* ══════════════════════════════════════════════════════════
   | MULTI ORIGEN / DESTINO — ROWS DINÁMICOS
   ══════════════════════════════════════════════════════════ */
  window.ventasRP.addMultiOrigenRow = function () { _addMultiRow('origen'); };
  window.ventasRP.addMultiDestinoRow = function () { _addMultiRow('destino'); };

  function _addMultiRow(tipo) {
    const arr = tipo === 'origen' ? S.multiOrigenRows : S.multiDestinoRows;
    arr.push({ detalle_id: null, municipio_id: '', nombre_municipio: '', depto: '', rate_1: 0, rate_2: 0 });
    _renderMultiRows(tipo, arr);
  }

  function _renderMultiRows(tipo, arr) {
    const containerId = `multi-${tipo}-rows`;
    const emptyId = `multi-${tipo}-empty`;
    const cont = document.getElementById(containerId);
    const empty = document.getElementById(emptyId);
    if (!cont) return;

    if (!arr.length) {
      cont.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    cont.innerHTML = arr.map((row, i) => `
      <div style="display:grid;grid-template-columns:1fr 80px 80px 28px;gap:6px;align-items:center;margin-bottom:6px;padding:8px;background:#fff;border-radius:6px;border:1px solid var(--border);">
        <input type="text"
          class="form-control"
          placeholder="Municipio"
          value="${_esc(row.nombre_municipio || '')}"
          style="font-size:.75rem;"
          oninput="ventasRP._updateMultiRow('${tipo}',${i},'nombre_municipio',this.value)">
        <div style="position:relative;">
          <span style="position:absolute;left:7px;top:50%;transform:translateY(-50%);font-size:.65rem;color:var(--muted);font-weight:700">$</span>
          <input type="number" min="0" step="1000"
            class="form-control"
            value="${row.rate_1 || 0}"
            style="padding-left:18px;font-size:.75rem;font-family:'DM Mono',monospace;"
            placeholder="Rate 1"
            oninput="ventasRP._updateMultiRow('${tipo}',${i},'rate_1',parseFloat(this.value)||0)">
        </div>
        <div style="position:relative;">
          <span style="position:absolute;left:7px;top:50%;transform:translateY(-50%);font-size:.65rem;color:var(--muted);font-weight:700">$</span>
          <input type="number" min="0" step="1000"
            class="form-control"
            value="${row.rate_2 || 0}"
            style="padding-left:18px;font-size:.75rem;font-family:'DM Mono',monospace;"
            placeholder="Rate 2"
            oninput="ventasRP._updateMultiRow('${tipo}',${i},'rate_2',parseFloat(this.value)||0)">
        </div>
        <button onclick="ventasRP._removeMultiRow('${tipo}',${i})"
          style="height:28px;width:28px;border:none;border-radius:5px;background:#fef2f2;color:var(--red);cursor:pointer;font-size:.75rem;display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-times"></i>
        </button>
      </div>`).join('');
  }

  window.ventasRP._updateMultiRow = function (tipo, idx, field, val) {
    const arr = tipo === 'origen' ? S.multiOrigenRows : S.multiDestinoRows;
    if (arr[idx]) arr[idx][field] = val;
  };

  window.ventasRP._removeMultiRow = function (tipo, idx) {
    const arr = tipo === 'origen' ? S.multiOrigenRows : S.multiDestinoRows;
    arr.splice(idx, 1);
    _renderMultiRows(tipo, arr);
  };

  function _recogerDetallesRows(tipo) {
    const arr = tipo === 'origen' ? S.multiOrigenRows : S.multiDestinoRows;
    return arr.map(r => ({
      detalle_id: r.detalle_id || null,
      municipio_id: r.municipio_id || null,
      rate_1: parseFloat(r.rate_1) || 0,
      rate_2: parseFloat(r.rate_2) || 0,
    })).filter(r => r.rate_1 > 0 || r.detalle_id);
  }

  /* ══════════════════════════════════════════════════════════
   | STATS
   ══════════════════════════════════════════════════════════ */
  function _renderStats(r) {
    if (!r) return;
    _s('st-rutas', r.total_rutas || 0);
    _s('st-sin', r.sin_tarifa || 0);
    _s('st-venc', r.vencidas || 0);
    _s('st-porv', r.por_vencer || 0);
    _s('st-vig', r.vigentes || 0);
    S.resumen = r;
  }

  function _recalcStats() {
    const col = S.allData;
    _s('st-rutas', col.length);
    _s('st-sin', col.filter(d => d.estado === 'SIN_TARIFA').length);
    _s('st-venc', col.filter(d => d.estado === 'VENCIDA').length);
    _s('st-porv', col.filter(d => d.estado === 'POR_VENCER').length);
    _s('st-vig', col.filter(d => d.estado === 'VIGENTE').length);
  }

  function _clearStats() {
    ['st-rutas', 'st-sin', 'st-venc', 'st-porv', 'st-vig'].forEach(id => _s(id, '—'));
  }

  function _renderParetoBar(r) {
    if (!r) return;
    const wrap = document.getElementById('pareto-wrap');
    if (wrap) wrap.style.display = 'block';
    const total = r.total_rutas || 1;
    const wPct = Math.min(100, Math.round(((r.semaforo_rojo + r.semaforo_amarillo) / total) * 100));
    const fill = document.getElementById('pareto-fill');
    const label = document.getElementById('pareto-fill-label');
    const info = document.getElementById('pareto-info');
    const tot = document.getElementById('pareto-rutas-total');
    if (fill) fill.style.width = wPct + '%';
    if (label) label.textContent = `TOP ${r.parametro_top} · ${r.semaforo_rojo + r.semaforo_amarillo} requieren acción`;
    if (info) info.innerHTML = `<i class="fas fa-tags"></i> Tarifas Venta · TOP ${r.parametro_top}`;
    if (tot) tot.textContent = `${total} rutas priorizadas`;
  }

  /* ══════════════════════════════════════════════════════════
   | HELPERS UI
   ══════════════════════════════════════════════════════════ */
  function _buildPayload() {
    const desde = document.getElementById('g-desde')?.value;
    const hasta = document.getElementById('g-hasta')?.value;
    if (!desde || !hasta) { _toast('Seleccione rango de fechas.', 'warning'); return null; }
    if (desde > hasta) { _toast('Fecha Desde no puede ser mayor a Fecha Hasta.', 'warning'); return null; }
    if (!EMPRESA()) { _toast('No se pudo determinar la empresa.', 'error'); return null; }
    return {
      empresa_id: EMPRESA(),
      fecha_desde: desde,
      fecha_hasta: hasta,
      cliente_id: document.getElementById('g-cliente')?.value || null,
      zona_id: document.getElementById('g-zona')?.value || null,
    };
  }

  function _showLoading(msg) {
    const w = document.getElementById('table-wrap');
    if (w) w.innerHTML = `<div class="loading-state">
      <div class="spinner"></div>
      <div style="font-size:.78rem;color:var(--muted);margin-top:8px">${msg}</div>
    </div>`;
  }

  function _showError(msg) {
    const w = document.getElementById('table-wrap');
    if (w) w.innerHTML = `<div class="empty-state">
      <div class="empty-icon" style="color:var(--red)"><i class="fas fa-exclamation-triangle"></i></div>
      <div class="empty-text" style="color:var(--red)">${_esc(msg)}</div>
    </div>`;
  }

  function _showResultadoUI() {
    const tc = document.getElementById('table-count');
    const pw = document.getElementById('pareto-wrap');
    if (tc) tc.style.display = 'inline-flex';
    if (pw) pw.style.display = 'block';
  }

  function _semBadge(s) {
    const map = {
      rojo: '<span class="badge badge-rojo"><i class="fas fa-circle" style="font-size:.5rem"></i> Crítico</span>',
      amarillo: '<span class="badge badge-amarillo"><i class="fas fa-circle" style="font-size:.5rem"></i> Alerta</span>',
      verde: '<span class="badge badge-verde"><i class="fas fa-circle" style="font-size:.5rem"></i> OK</span>',
    };
    return map[s] || `<span class="badge badge-info">${_esc(s)}</span>`;
  }

  function _estadoTag(e) {
    const map = {
      SIN_TARIFA: '<span class="st-sin">Sin Tarifa</span>',
      VENCIDA: '<span class="st-venc">Vencida</span>',
      POR_VENCER: '<span class="st-porv">Por Vencer</span>',
      VIGENTE: '<span class="st-vig">Vigente</span>',
    };
    return map[e] || `<span style="font-size:.65rem">${_esc(e)}</span>`;
  }

  function _tripBar(viajes, max) {
    const pct = max > 0 ? Math.min(100, Math.round((viajes / max) * 100)) : 0;
    return `<div class="trip-bar">
      <div class="trip-bar-track"><div class="trip-bar-fill" style="width:${pct}%"></div></div>
      <span class="trip-bar-num">${viajes}</span>
    </div>`;
  }

  function _fmt(n) {
    return Number(n).toLocaleString('es-CO');
  }

  function _s(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
  function _t(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
  function _v(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
  function _esc(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ══════════════════════════════════════════════════════════
   | TOAST
   ══════════════════════════════════════════════════════════ */
  function _toast(msg, type = 'info') {
    if (window.Swal) {
      Swal.fire({ toast: true, position: 'top-end', icon: type, title: msg, showConfirmButton: false, timer: 3500 });
    } else if (window.toastr) {
      toastr[type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'success'](msg);
    } else {
      console.log(`[VENTAS-RP·${type.toUpperCase()}] ${msg}`);
    }
  }

  /* ══════════════════════════════════════════════════════════
   | AUTO-INICIO
   ══════════════════════════════════════════════════════════ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _init);
  } else {
    _init();
  }

  // Exponer toast globalmente
  window.ventasRP._toast = _toast;

})();