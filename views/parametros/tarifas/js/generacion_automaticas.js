/**
 * generacion_automatica.js  ← REEMPLAZA generacion_automaticas.js
 * ═══════════════════════════════════════════════════════════════════════════
 * REQ 19 — Generación Automática de Rutas para Actualizar
 * REQ 20 — Parámetro TOP % de Viajes
 *
 * ENDPOINTS:
 *   [A] GET  /rutas-prioritarias/parametro?empresa_id=X
 *   [B] POST /rutas-prioritarias/parametro
 *   [C] GET  /rutas-prioritarias/filtros/clientes?empresa_id=X
 *   [D] GET  /rutas-prioritarias/filtros/zonas?empresa_id=X
 *   [E] POST /rutas-prioritarias/generar
 *   [F] GET  /rutas-prioritarias/detalle/{tarifaId}?empresa_id=X
 *   [G] POST /rutas-prioritarias/detalle/actualizar
 *   [H] POST /rutas-prioritarias/actualizar-masivo
 *   [I] POST /rutas-prioritarias/exportar
 *
 * IDs del phtml usados:
 *   SLIDER:   #top-slider, #top-display-val, #top-input, .preset-btn, #param-status, #param-status-text
 *   FILTROS:  #g-desde, #g-hasta, #g-cliente, #g-zona
 *   STATS:    #st-rutas, #st-sin, #st-venc, #st-porv, #st-vig
 *   PARETO:   #pareto-wrap, #pareto-fill, #pareto-fill-label, #pareto-info, #pareto-rutas-total
 *   TABLA:    #table-wrap, #table-count, #count-txt, #tbl-filter, #actions-bar, #sel-count
 *   MODAL:    #modal-editar, #modal-title, #modal-ruta-info
 *             #m-origen, #m-destino, #m-vehiculo, #m-viajes, #m-estado-badge
 *             #m-sicetac, #m-mercado
 *             #m-plena, #m-multi-recogida, #m-multi-entrega
 *             #multi-origen-rows, #multi-origen-empty
 *             #multi-destino-rows, #multi-destino-empty
 *             #m-anio, #m-mes
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

  /* ══════════════════════════════════════════════════════════
   | ESTADO GLOBAL
   ══════════════════════════════════════════════════════════ */
  const S = {
    allData: [],     // respuesta completa de /generar
    filteredData: [],     // tras filtro texto + tab estado
    selected: new Set(),
    currentEstado: 'todas',
    maxViajes: 1,
    resumen: null,
    // Modal
    editItem: null,
    editItemIdx: -1,
    multiOrigenRows: [],   // [{ detalle_id, municipio_id, nombre_municipio, depto, rate_1, rate_2 }]
    multiDestinoRows: [],
    modalCargando: false,
  };

  // /* ══════════════════════════════════════════════════════════
  //  | INIT
  //  ══════════════════════════════════════════════════════════ */
  // document.addEventListener('DOMContentLoaded', function () {
  //   _initFechas();
  //   _cargarParametro();   // [A]
  //   _cargarClientes();    // [C]
  //   _cargarZonas();       // [D]

  //   document.getElementById('tbl-filter')
  //     ?.addEventListener('input', function () { _applyFilters(); _renderTabla(); });
  // });

  function _initFechas() {
    const hoy = new Date();
    const hace3 = new Date(hoy);
    hace3.setMonth(hace3.getMonth() - 3);
    const dsd = document.getElementById('g-desde');
    const hst = document.getElementById('g-hasta');
    if (dsd) dsd.value = hace3.toISOString().slice(0, 10);
    if (hst) hst.value = hoy.toISOString().slice(0, 10);
    const mes = document.getElementById('m-mes');
    if (mes) mes.value = hoy.getMonth() + 1;
  }

  /* ══════════════════════════════════════════════════════════
   | [A] LEER PARÁMETRO TOP
   ══════════════════════════════════════════════════════════ */
  function _cargarParametro() {
    if (!EMPRESA()) return;
    fetch(`${API()}/rutas-prioritarias/parametro?empresa_id=${EMPRESA()}`, { headers: HEADERS() })
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        _setSlider(res.data?.porcentaje_top ?? 80);
        const st = document.getElementById('param-status');
        if (st && res.data?.actualizado) {
          document.getElementById('param-status-text').textContent =
            `Guardado el ${res.data.actualizado} · por ${res.data.usuario || '—'}`;
          st.style.display = 'flex';
        }
      })
      .catch(() => { });
  }

  /* ══════════════════════════════════════════════════════════
   | [B] GUARDAR PARÁMETRO TOP
   ══════════════════════════════════════════════════════════ */
  window.guardarParametro = function () {
    const val = parseInt(document.getElementById('top-slider')?.value);
    if (isNaN(val) || val < 1 || val > 100) {
      _toast('El parámetro debe estar entre 1 y 100.', 'warning');
      return;
    }
    fetch(`${API()}/rutas-prioritarias/parametro`, {
      method: 'POST', headers: HEADERS(),
      body: JSON.stringify({ empresa_id: EMPRESA(), porcentaje_top: val, usuario: USUARIO() }),
    })
      .then(r => r.json())
      .then(res => {
        _toast(res.message || (res.success ? 'Guardado.' : 'Error.'), res.success ? 'success' : 'error');
        if (res.success) {
          const st = document.getElementById('param-status');
          if (st) {
            document.getElementById('param-status-text').textContent =
              `Guardado · ${new Date().toLocaleString('es-CO')} · ${USUARIO()}`;
            st.style.display = 'flex';
          }
        }
      })
      .catch(() => _toast('Error al guardar el parámetro.', 'error'));
  };

  /* ══════════════════════════════════════════════════════════
   | [C] CARGAR CLIENTES
   ══════════════════════════════════════════════════════════ */
  function _cargarClientes() {
    console.log("hola");

    const sel = document.getElementById('g-cliente');
    if (!sel || !EMPRESA()) return;
    fetch(`${API()}/rutas-prioritarias/filtros/clientes?empresa_id=${EMPRESA()}`, { headers: HEADERS() })
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        sel.innerHTML = '<option value="">Todos los clientes</option>';
        (res.data || []).forEach(c => {
          const o = document.createElement('option');
          o.value = c.id;
          o.textContent = c.nombre;
          sel.appendChild(o);
        });
      })
      .catch(() => { }); // silencioso — opcional
  }

  /* ══════════════════════════════════════════════════════════
   | [D] CARGAR ZONAS
   ══════════════════════════════════════════════════════════ */
  function _cargarZonas() {
    const sel = document.getElementById('g-zona');
    if (!sel || !EMPRESA()) return;
    fetch(`${API()}/rutas-prioritarias/filtros/zonas?empresa_id=${EMPRESA()}`, { headers: HEADERS() })
      .then(r => r.json())
      .then(res => {
        if (!res.success) return;
        sel.innerHTML = '<option value="">Todas las zonas</option>';
        (res.data || []).forEach(z => {
          const o = document.createElement('option');
          o.value = z.id;
          o.textContent = z.nombre_zona;
          sel.appendChild(o);
        });
      })
      .catch(() => { });
  }

  /* ══════════════════════════════════════════════════════════
   | [E] GENERAR LISTA PRIORIZADA
   ══════════════════════════════════════════════════════════ */
  window.generarLista = function () {
    const payload = _buildPayload();
    if (!payload) return;

    _showLoading('Generando lista priorizada — análisis Pareto...');
    _clearStats();
    S.selected.clear();
    _updateSelCount();

    fetch(`${API()}/rutas-prioritarias/generar`, {
      method: 'POST', headers: HEADERS(), body: JSON.stringify(payload),
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(res => {
        if (!res.success) { _showError(res.message || 'Error en el servidor.'); return; }

        S.allData = res.data || [];
        S.resumen = res.resumen || {};
        S.maxViajes = S.allData.reduce((m, d) => Math.max(m, d.numero_viajes), 1);
        S.currentEstado = 'todas';
        S.filteredData = [];

        _applyFilters();
        _renderStats(res.resumen);
        _renderParetoBar(res.resumen);
        _renderTabla();
        _showResultadoUI();

        const r = res.resumen;
        _toast(`${r.total_rutas} rutas priorizadas · ${r.semaforo_rojo} rojas · ${r.semaforo_amarillo} amarillas`, 'success');
      })
      .catch(err => { console.error('[GENERAR]', err); _showError('Error de conexión.'); });
  };

  /* ══════════════════════════════════════════════════════════
   | [F] ABRIR MODAL — CARGAR DETALLE DE TARIFA
   ══════════════════════════════════════════════════════════ */
  window.abrirEdicion = function (globalIdx) {
    const item = S.allData[globalIdx];
    if (!item) return;

    S.editItem = item;
    S.editItemIdx = globalIdx;

    // ── Poblar datos estáticos del modal ──
    _t('modal-title', `Actualizar Tarifa — ${item.nombre_origen} → ${item.nombre_destino}`);
    _t('modal-ruta-info', `${item.tipo_vehiculo} · ${item.numero_viajes} viajes · ${(item.porcentaje_viajes || 0).toFixed(1)}% acumulado`);
    _t('m-origen', item.nombre_origen);
    _t('m-destino', item.nombre_destino);
    _t('m-vehiculo', item.tipo_vehiculo);
    _t('m-viajes', item.numero_viajes);

    const badgeMap = {
      SIN_TARIFA: ['badge-sin-tarifa', 'Sin Tarifa'],
      VENCIDA: ['badge-vencida', 'Vencida'],
      POR_VENCER: ['badge-por-vencer', 'Por Vencer'],
      VIGENTE: ['badge-vigente', 'Vigente'],
    };
    const [cls, txt] = badgeMap[item.estado] || ['badge-sin-tarifa', item.estado];
    document.getElementById('m-estado-badge').innerHTML = `<span class="badge ${cls}">${txt}</span>`;

    const fmt = v => v ? `$${parseFloat(v).toLocaleString('es-CO')}` : 'N/A';
    _t('m-sicetac', fmt(item.tarifa_sicetac));
    _t('m-mercado', fmt(item.tarifa_mercado));

    // ── Valores escalares ──
    _v('m-plena', item.tarifa_plena || '');
    _v('m-multi-recogida', item.multi_recogida || 0);
    _v('m-multi-entrega', item.multi_entrega || 0);

    const hoy = new Date();
    _v('m-anio', item.anio_tarifa || hoy.getFullYear());
    _v('m-mes', item.mes_tarifa || (hoy.getMonth() + 1));

    // ── Limpiar detalles ──
    S.multiOrigenRows = [];
    S.multiDestinoRows = [];
    _renderMultiRows();

    // ── Mostrar modal ──
    document.getElementById('modal-editar').style.display = 'flex';

    // ── Si hay tarifa_id → cargar detalles reales [F] ──
    if (item.tarifa_id) {
      _cargarDetallesTarifa(item.tarifa_id);
    } else {
      // Sin tarifa: solo mostrar mensaje en las secciones multi
      _mostrarSinDetalle();
    }
  };

  /* ── [F] Fetch detalle tarifa ── */
  function _cargarDetallesTarifa(tarifaId) {
    S.modalCargando = true;
    _showMultiLoading();

    fetch(`${API()}/rutas-prioritarias/detalle/${tarifaId}?empresa_id=${EMPRESA()}`, {
      headers: HEADERS(),
    })
      .then(r => r.json())
      .then(res => {
        S.modalCargando = false;
        if (!res.success) {
          _mostrarSinDetalle();
          return;
        }
        const d = res.data;
        // Actualizar también los escalares con los datos más frescos del detalle
        _v('m-plena', d.plena || '');
        _v('m-multi-recogida', d.multi_recogida || 0);
        _v('m-multi-entrega', d.multi_entrega || 0);
        _v('m-anio', d.vigencia || new Date().getFullYear());
        _v('m-mes', d.mes || (new Date().getMonth() + 1));

        // Detalles por municipio (solo lectura de rate_1 y rate_2 — no se puede agregar/quitar)
        S.multiOrigenRows = (d.multi_origen_detalles || []).map(x => ({ ...x }));
        S.multiDestinoRows = (d.multi_destino_detalles || []).map(x => ({ ...x }));
        _renderMultiRows();
      })
      .catch(() => {
        S.modalCargando = false;
        _mostrarSinDetalle();
      });
  }

  function _mostrarSinDetalle() {
    S.multiOrigenRows = [];
    S.multiDestinoRows = [];
    _renderMultiRows();
  }

  function _showMultiLoading() {
    const spinner = `<div style="text-align:center;padding:12px;font-size:.72rem;color:var(--muted)"><i class="fas fa-spinner fa-spin" style="margin-right:6px"></i>Cargando detalles...</div>`;
    const w1 = document.getElementById('multi-origen-rows');
    const w2 = document.getElementById('multi-destino-rows');
    if (w1) w1.innerHTML = spinner;
    if (w2) w2.innerHTML = spinner;
    const e1 = document.getElementById('multi-origen-empty');
    const e2 = document.getElementById('multi-destino-empty');
    if (e1) e1.style.display = 'none';
    if (e2) e2.style.display = 'none';
  }

  /* ══════════════════════════════════════════════════════════
   | MODAL — RENDER MULTI ROWS (solo edición de rate_1 / rate_2)
   | NO hay botón "Agregar" — solo los detalles que ya existen
   ══════════════════════════════════════════════════════════ */
  function _renderMultiRows() {
    _renderGrupoMulti(
      S.multiOrigenRows,
      'multi-origen-rows',
      'multi-origen-empty',
      'orígen',
      '#0ea5e9',
      'updateOrigenRow'
    );
    _renderGrupoMulti(
      S.multiDestinoRows,
      'multi-destino-rows',
      'multi-destino-empty',
      'destino',
      '#7c3aed',
      'updateDestinoRow'
    );
  }

  function _renderGrupoMulti(rows, wrapId, emptyId, label, color, updateFn) {
    const wrap = document.getElementById(wrapId);
    const empty = document.getElementById(emptyId);
    if (!wrap) return;

    if (!rows.length) {
      if (empty) empty.style.display = 'block';
      wrap.innerHTML = '';
      return;
    }

    if (empty) empty.style.display = 'none';

    wrap.innerHTML = rows.map((r, i) => `
      <div style="display:grid;grid-template-columns:1fr 130px 130px;gap:6px;margin-bottom:6px;
                  align-items:center;background:#fff;padding:8px 12px;border-radius:7px;
                  border:1px solid var(--border);">
        <!-- Municipio (solo lectura) -->
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></span>
          <div>
            <div style="font-weight:700;font-size:.75rem;color:var(--navy)">${_esc(r.nombre_municipio)}</div>
            <div style="font-size:.6rem;color:var(--muted)">${_esc(r.depto || '')} · <span style="font-family:monospace">${_esc(r.municipio_id || '')}</span></div>
          </div>
        </div>
        <!-- Rate 1 -->
        <div>
          <div style="font-size:.58rem;text-transform:uppercase;font-weight:700;color:var(--muted);margin-bottom:3px">Rate 1</div>
          <div style="position:relative">
            <span style="position:absolute;left:7px;top:50%;transform:translateY(-50%);font-size:.65rem;color:var(--muted);font-weight:700">$</span>
            <input type="number" value="${r.rate_1 || 0}" min="0" step="1000"
              oninput="${updateFn}(${i},'rate_1',this.value)"
              style="height:28px;width:100%;padding:0 6px 0 18px;border:1px solid var(--border);
                     border-radius:5px;font-size:.72rem;font-family:'DM Mono',monospace;outline:none;">
          </div>
        </div>
        <!-- Rate 2 -->
        <div>
          <div style="font-size:.58rem;text-transform:uppercase;font-weight:700;color:var(--muted);margin-bottom:3px">Rate 2</div>
          <div style="position:relative">
            <span style="position:absolute;left:7px;top:50%;transform:translateY(-50%);font-size:.65rem;color:var(--muted);font-weight:700">$</span>
            <input type="number" value="${r.rate_2 || 0}" min="0" step="1000"
              oninput="${updateFn}(${i},'rate_2',this.value)"
              style="height:28px;width:100%;padding:0 6px 0 18px;border:1px solid var(--border);
                     border-radius:5px;font-size:.72rem;font-family:'DM Mono',monospace;outline:none;">
          </div>
        </div>
      </div>
    `).join('');
  }

  /* Funciones update expuestas para los oninput */
  window.updateOrigenRow = (i, field, val) => { if (S.multiOrigenRows[i]) S.multiOrigenRows[i][field] = parseFloat(val) || 0; };
  window.updateDestinoRow = (i, field, val) => { if (S.multiDestinoRows[i]) S.multiDestinoRows[i][field] = parseFloat(val) || 0; };

  /* Los botones "Agregar" del phtml se DESHABILITAN: ya no aplica */
  // addMultiOrigenRow() y addMultiDestinoRow() quedan como no-op
  window.addMultiOrigenRow = () => _toast('Los municipios de Multi Origen se definen en la configuración de la tarifa base.', 'info');
  window.addMultiDestinoRow = () => _toast('Los municipios de Multi Destino se definen en la configuración de la tarifa base.', 'info');

  /* ══════════════════════════════════════════════════════════
   | CERRAR MODAL
   ══════════════════════════════════════════════════════════ */
  window.cerrarModal = function () {
    document.getElementById('modal-editar').style.display = 'none';
    S.editItem = null;
    S.editItemIdx = -1;
    S.multiOrigenRows = [];
    S.multiDestinoRows = [];
  };

  /* ══════════════════════════════════════════════════════════
   | [G] GUARDAR EDICIÓN
   ══════════════════════════════════════════════════════════ */
  window.guardarEdicion = function () {
    if (S.modalCargando) {
      _toast('Espere a que terminen de cargar los detalles.', 'warning');
      return;
    }
    if (!S.editItem) return;

    const plena = parseFloat(document.getElementById('m-plena')?.value);
    if (isNaN(plena) || plena <= 0) {
      _toast('Ingrese un valor de Tarifa Plena válido (> 0).', 'warning');
      return;
    }

    const payload = {
      empresa_id: EMPRESA(),
      usuario: USUARIO(),
      tarifa_id: S.editItem.tarifa_id || null,
      origen: S.editItem.origen_id,        // cmx_municipios.id
      destino: S.editItem.destino_id,
      tipo_vehiculo: S.editItem.tipo_vehiculo,
      plena,
      multi_recogida: parseFloat(document.getElementById('m-multi-recogida')?.value) || 0,
      multi_entrega: parseFloat(document.getElementById('m-multi-entrega')?.value) || 0,
      multi_origen_detalles: S.multiOrigenRows.map(r => ({
        detalle_id: r.detalle_id,
        rate_1: r.rate_1,
        rate_2: r.rate_2,
      })),
      multi_destino_detalles: S.multiDestinoRows.map(r => ({
        detalle_id: r.detalle_id,
        rate_1: r.rate_1,
        rate_2: r.rate_2,
      })),
    };

    // ── Deshabilitar botón ──
    const btn = document.querySelector('#modal-editar .btn-primary[onclick="guardarEdicion()"]');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...'; }

    // Elegir endpoint: si tiene detalles → actualizarConDetalles; si no → actualizar simple
    const hayDetalles = payload.multi_origen_detalles.length || payload.multi_destino_detalles.length;
    const url = hayDetalles
      ? `${API()}/rutas-prioritarias/detalle/actualizar`
      : `${API()}/rutas-prioritarias/actualizar/${payload.tarifa_id || ''}`;

    fetch(url, { method: 'POST', headers: HEADERS(), body: JSON.stringify(payload) })
      .then(r => r.json())
      .then(res => {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios'; }
        if (!res.success) { _toast(res.message || 'Error al guardar.', 'error'); return; }

        _toast(res.message || 'Tarifa actualizada.', 'success');

        // Actualizar ítem en STATE sin re-fetch completo
        if (S.editItemIdx !== -1 && S.allData[S.editItemIdx]) {
          const d = S.allData[S.editItemIdx];
          d.tarifa_id = res.tarifa_id;
          d.tarifa_plena = plena;
          d.multi_recogida = payload.multi_recogida;
          d.multi_entrega = payload.multi_entrega;
          d.multi_origen = S.multiOrigenRows.reduce((s, r) => s + r.rate_1 + r.rate_2, 0);
          d.multi_destino = S.multiDestinoRows.reduce((s, r) => s + r.rate_1 + r.rate_2, 0);
          d.estado = res.requiere_aprobacion ? 'POR_VENCER' : 'VIGENTE';
          d.semaforo = res.requiere_aprobacion ? 'amarillo' : 'verde';
          d.dias_sin_actualizar = 0;
          d.mes_tarifa = new Date().getMonth() + 1;
          d.anio_tarifa = new Date().getFullYear();
        }

        _applyFilters();
        _recalcStats();
        _renderTabla();
        cerrarModal();
      })
      .catch(err => {
        console.error('[GUARDAR]', err);
        if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios'; }
        _toast('Error de red al guardar.', 'error');
      });
  };

  /* ══════════════════════════════════════════════════════════
   | [H] ACTUALIZAR MASIVO
   ══════════════════════════════════════════════════════════ */
  window.actualizarSeleccionadas = function () {
    if (!S.selected.size) { _toast('Seleccione al menos una ruta.', 'warning'); return; }

    const tarifas = [];
    S.selected.forEach(idx => {
      const d = S.allData[idx];
      if (d && d.tarifa_plena > 0) {
        tarifas.push({
          origen: d.origen_id,
          destino: d.destino_id,
          tipo_vehiculo: d.tipo_vehiculo,
          plena: d.tarifa_plena,
          multi_recogida: d.multi_recogida || 0,
          multi_origen: d.multi_origen || 0,
          multi_entrega: d.multi_entrega || 0,
          multi_destino: d.multi_destino || 0,
        });
      }
    });

    if (!tarifas.length) {
      _toast('Ninguna ruta seleccionada tiene tarifa plena registrada.', 'warning');
      return;
    }

    if (!confirm(`¿Actualizar ${tarifas.length} tarifas seleccionadas con sus valores actuales?`)) return;

    fetch(`${API()}/rutas-prioritarias/actualizar-masivo`, {
      method: 'POST', headers: HEADERS(),
      body: JSON.stringify({ empresa_id: EMPRESA(), usuario: USUARIO(), tarifas }),
    })
      .then(r => r.json())
      .then(res => {
        _toast(res.message || (res.success ? 'Completado.' : 'Error.'), res.success ? 'success' : 'error');
        if (res.success) { S.selected.clear(); _updateSelCount(); generarLista(); }
      })
      .catch(() => _toast('Error de red.', 'error'));
  };

  window.abrirMasivo = function () {
    _toast('Edición masiva: seleccione rutas en la tabla y use "Actualizar Seleccionadas".', 'info');
  };

  /* ══════════════════════════════════════════════════════════
   | [I] EXPORTAR EXCEL
   ══════════════════════════════════════════════════════════ */

  // window.exportarExcel = function () {
  //   const data = S.filteredData.length ? S.filteredData : S.allData;
  //   if (!data.length) { _toast('No hay datos para exportar.', 'warning'); return; }

  //   fetch(`${API()}/rutas-prioritarias/exportar`, {
  //     method: 'POST',
  //     headers: HEADERS(),
  //     body: JSON.stringify({
  //       data,
  //       ruta: 'para_actualizar'  // ← variable que identificará el tipo de exportación
  //     }),
  //   })
  //     .then(r => r.json())
  //     .then(res => {
  //       if (!res.success || !res.data?.length) { _toast('El servidor no retornó datos.', 'error'); return; }
  //       if (!window.XLSX) { _toast('SheetJS no disponible.', 'error'); return; }
  //       const ws = XLSX.utils.json_to_sheet(res.data);
  //       ws['!cols'] = Object.keys(res.data[0]).map(() => ({ wch: 18 }));
  //       const wb = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'Rutas Prioritarias');
  //       XLSX.writeFile(wb, `rutas_prioritarias_${new Date().toISOString().slice(0, 10)}.xlsx`);
  //       _toast('Archivo exportado.', 'success');
  //     })
  //     .catch(() => _toast('Error al exportar.', 'error'));
  // };

  //boton de excel
  document.getElementById('exportar_excel_ruta_prioritaria').addEventListener('click', function () {
    if (!window.XLSX) { alert('SheetJS no disponible'); return; }

    // Usar datos filtrados si hay, sino todos
    const data = (S.filteredData && S.filteredData.length) ? S.filteredData : S.allData;

    if (!data.length) { _toast('No hay datos para exportar.', 'warning'); return; }

    const headers = [
      '% Viajes', 'Estado', 'Semáforo',
      'Origen', 'Depto Origen', 'Zona Origen',
      'Destino', 'Depto Destino', 'Zona Destino',
      'Tipo Vehículo', 'Nro Viajes',
      'Tarifa Plena', 'Multi Recogida', 'Multi Origen', 'Multi Entrega', 'Multi Destino',
      'Tarifa SICETAC', 'Tarifa Mercado',
      'Fecha Tarifa', 'Días sin Actualizar', 'Motivo'
    ];

    // const rows = data.map(d => [
    //   //  const pct2 = Math.round((d.numero_viajes / S.resumen.total_viajes) * 100);// Porcentaje por total viajes

    //   (d.porcentaje_viajes || 0).toFixed(2) + '%',
    //   // (Math.round((d.numero_viajes / S.resumen.total_viajes) * 100) || 0).toFixed(2) + '%',
    //   d.estado ?? '',
    //   d.semaforo ?? '',
    //   d.nombre_origen ?? '',
    //   d.depto_origen ?? '',
    //   d.zona_origen ?? '',
    //   d.nombre_destino ?? '',
    //   d.depto_destino ?? '',
    //   d.zona_destino ?? '',
    //   d.tipo_vehiculo ?? '',
    //   d.numero_viajes ?? 0,
    //   d.tarifa_plena ?? 0,
    //   d.multi_recogida ?? 0,
    //   d.multi_origen ?? 0,
    //   d.multi_entrega ?? 0,
    //   d.multi_destino ?? 0,
    //   d.tarifa_sicetac ?? '',
    //   d.tarifa_mercado ?? '',
    //   d.fecha_tarifa ?? '',
    //   d.dias_sin_actualizar ?? '',
    //   d.motivo ?? ''
    // ]);

    const rows = data.map(d => {
      // Calculamos el porcentaje real basado en el total de viajes del resumen
      // Esto garantiza que la suma de esta columna en Excel sea consistente
      const porcentajeReal = (d.numero_viajes / S.resumen.total_viajes) * 100;

      return [
        (porcentajeReal || 0).toFixed(2) + '%', // Columna % Viajes
        d.estado ?? '',
        d.semaforo ?? '',
        d.nombre_origen ?? '',
        d.depto_origen ?? '',
        d.zona_origen ?? '',
        d.nombre_destino ?? '',
        d.depto_destino ?? '',
        d.zona_destino ?? '',
        d.tipo_vehiculo ?? '',
        d.numero_viajes ?? 0,
        d.tarifa_plena ?? 0,
        d.multi_recogida ?? 0,
        d.multi_origen ?? 0,
        d.multi_entrega ?? 0,
        d.multi_destino ?? 0,
        d.tarifa_sicetac ?? '',
        d.tarifa_mercado ?? '',
        d.fecha_tarifa ?? '',
        d.dias_sin_actualizar ?? '',
        d.motivo ?? ''
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws['!cols'] = headers.map(() => ({ wch: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rutas Prioritarias');

    const fecha = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `Informe Rutas Automaticas ${fecha}.xlsx`);
  });

  /* ══════════════════════════════════════════════════════════
   | SLIDER — funciones expuestas para el phtml
   ══════════════════════════════════════════════════════════ */
  window.updateSlider = function (val) { _setSlider(parseInt(val)); };
  window.syncInput = function (val) { _setSlider(Math.min(100, Math.max(1, parseInt(val) || 1))); };
  window.setPreset = function (val) { _setSlider(parseInt(val)); };

  function _setSlider(val) {
    val = parseInt(val);
    const slider = document.getElementById('top-slider');
    const display = document.getElementById('top-display-val');
    const input = document.getElementById('top-input');
    if (slider) { slider.value = val; slider.style.setProperty('--pct', val + '%'); }
    if (display) display.textContent = val;
    if (input) input.value = val;
    document.querySelectorAll('.preset-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.textContent) === val);
    });
  }

  /* ══════════════════════════════════════════════════════════
   | FILTRO POR ESTADO (clic en stat-cards)
   ══════════════════════════════════════════════════════════ */
  window.filterByEstado = function (estado) {
    S.currentEstado = estado;
    S.selected.clear();
    _applyFilters();
    _renderTabla();
    _updateSelCount();
  };

  /* ══════════════════════════════════════════════════════════
   | FILTRO TEXTO
   ══════════════════════════════════════════════════════════ */
  window.filterTable = function () {
    _applyFilters();
    _renderTabla();
  };

  function _applyFilters() {
    const txt = (document.getElementById('tbl-filter')?.value || '').toLowerCase().trim();
    let base = S.allData;

    if (S.currentEstado !== 'todas') {
      base = base.filter(d => d.estado === S.currentEstado);
    }
    if (txt) {
      base = base.filter(d =>
        (d.nombre_origen || '').toLowerCase().includes(txt) ||
        (d.nombre_destino || '').toLowerCase().includes(txt) ||
        (d.tipo_vehiculo || '').toLowerCase().includes(txt) ||
        (d.zona_origen || '').toLowerCase().includes(txt)
      );
    }
    S.filteredData = base;

    const el = document.getElementById('count-txt');
    if (el) el.textContent = base.length + ' rutas';
  }

  /* ══════════════════════════════════════════════════════════
   | SELECCIÓN
   ══════════════════════════════════════════════════════════ */
  window.toggleSelect = function (globalIdx) {
    if (S.selected.has(globalIdx)) S.selected.delete(globalIdx);
    else S.selected.add(globalIdx);
    _updateSelCount();
  };

  window.toggleSelectAll = function () {
    const visible = _getVisible();
    if (S.selected.size === visible.length) {
      S.selected.clear();
    } else {
      visible.forEach(d => {
        const i = S.allData.indexOf(d);
        if (i !== -1) S.selected.add(i);
      });
    }
    _renderTabla();
    _updateSelCount();
  };

  function _updateSelCount() {
    const el = document.getElementById('sel-count');
    if (el) el.textContent = `${S.selected.size} seleccionadas`;
    const bar = document.getElementById('actions-bar');
    if (bar) bar.style.display = S.selected.size > 0 ? 'flex' : 'none';
  }

  /* ══════════════════════════════════════════════════════════
   | RENDER TABLA
   ══════════════════════════════════════════════════════════ */
  // function _renderTabla() {
  //   const wrap = document.getElementById('table-wrap');
  //   if (!wrap) return;

  //   const data = _getVisible();
  //   const cnt = document.getElementById('count-txt');
  //   if (cnt) cnt.textContent = data.length + ' rutas';

  //   if (!data.length) {
  //     wrap.innerHTML = `
  //       <div class="empty-state">
  //         <div class="empty-icon"><i class="fas fa-${S.allData.length ? 'search' : 'bolt'}"></i></div>
  //         <div class="empty-text">${S.allData.length ? 'Sin resultados' : 'Lista no generada'}</div>
  //         <div class="empty-sub">${S.allData.length ? 'Cambie el filtro o el texto de búsqueda' : 'Configure el parámetro TOP y presione Generar Lista Priorizada'}</div>
  //       </div>`;
  //     return;
  //   }

  //   // Destruir DataTable existente antes de re-renderizar
  //   if ($.fn.DataTable.isDataTable('#tabla-prioritarias')) {
  //     $('#tabla-prioritarias').DataTable().destroy();
  //     $('#tabla-prioritarias').off();
  //   }

  //   const rows = data.map(d => {
  //     const gi = S.allData.indexOf(d);
  //     const sel = S.selected.has(gi);
  //     const pct = Math.round((d.numero_viajes / S.maxViajes) * 100);
  //     const pct1 = Math.round((d.numero_viajes / S.resumen.total_rutas) * 100); // Porcentaje por Rutas
  //     const pct2 = Math.round((d.numero_viajes / S.resumen.total_viajes) * 100);// Porcentaje por total viajes
  //     const TotalViajes = d.numero_viajes + d.numero_viajes;
  //     console.log("🚀 ~ _renderTabla ~ TotalViajes:", TotalViajes)

  //     const semCls = { verde: 'sem-verde', rojo: 'sem-rojo', amarillo: 'sem-amarillo' }[d.semaforo] || 'sem-rojo';
  //     const badgeMap = {
  //       SIN_TARIFA: ['badge-sin-tarifa', 'Sin Tarifa'],
  //       VENCIDA: ['badge-vencida', 'Vencida'],
  //       POR_VENCER: ['badge-por-vencer', 'Por Vencer'],
  //       VIGENTE: ['badge-vigente', 'Vigente'],
  //     };
  //     const [bCls, bTxt] = badgeMap[d.estado] || ['badge-sin-tarifa', d.estado];

  //     const fmtT = v => (v > 0)
  //       ? `<span class="tarifa-val">$${Number(v).toLocaleString('es-CO')}</span>`
  //       : `<span class="tarifa-none">—</span>`;

  //     // const diasEl = (d.dias_sin_actualizar !== null && d.dias_sin_actualizar !== undefined)
  //     //   ? `<span style="color:${d.dias_sin_actualizar > 30 ? 'var(--red)' : 'var(--muted)'};font-weight:${d.dias_sin_actualizar > 30 ? '700' : '400'}">${d.dias_sin_actualizar}d</span>`
  //     //   : `<span style="color:var(--muted)">—</span>`;

  //     // CÓDIGO CORREGIDO:
  //     const diasRedondeados = (d.dias_sin_actualizar !== null && d.dias_sin_actualizar !== undefined)
  //       ? Math.round(d.dias_sin_actualizar)
  //       : null;

  //     const diasEl = (diasRedondeados !== null)
  //       ? `<span style="color:${diasRedondeados > 30 ? 'var(--red)' : 'var(--muted)'};font-weight:${diasRedondeados > 30 ? '700' : '400'}">${diasRedondeados}d</span>`
  //       : `<span style="color:var(--muted)">—</span>`;

  //     const hasMulti = (d.multi_origen > 0 || d.multi_destino > 0)
  //       ? '<span style="background:#e0f2fe;color:#0369a1;font-size:.58rem;font-weight:700;padding:1px 5px;border-radius:4px;margin-left:4px">MO/MD</span>'
  //       : '';

  //     const motivoEl = d.motivo
  //       ? `<span title="${_esc(d.motivo)}" style="cursor:help;font-size:.67rem;color:var(--muted)">${_esc(d.estado)}</span>`
  //       : '<span style="color:var(--muted);font-size:.67rem">—</span>';

  //     return `
  //       <tr ${sel ? 'class="selected"' : ''}>
  //         <td class="check-col">
  //           <input type="checkbox" ${sel ? 'checked' : ''}
  //             onchange="toggleSelect(${gi})"
  //             style="accent-color:var(--navy);width:14px;height:14px;cursor:pointer;">
  //         </td>
  //         <!--<td style="font-family:'DM Mono',monospace;font-size:.68rem;color:var(--muted)">${(d.porcentaje_viajes || 0).toFixed(2)}%</td>-->
  //         <!--<td style="font-family:'DM Mono',monospace;font-size:.68rem;color:var(--muted)">${(pct1 || 0).toFixed(2)}%</td>-->
  //         <td style="font-family:'DM Mono',monospace;font-size:.68rem;color:var(--muted)">${(pct2 || 0).toFixed(2)}%</td>
  //         <td>
  //           <div style="display:flex;align-items:center;gap:5px">
  //             <span class="semaforo ${semCls}"></span>
  //             <span class="badge ${bCls}">${bTxt}</span>
  //           </div>
  //         </td>
  //         <!--<td>
  //           <div style="font-weight:700;color:var(--navy);font-size:.78rem">${_esc(d.nombre_origen + ' ' + d.depto_origen)}${hasMulti}</div>
  //           <div style="font-size:.63rem;color:var(--muted)">→ ${_esc(d.nombre_destino + ' ' + d.depto_destino)}</div>
  //         </td>-->
  //         <td>
  //           ${_esc(d.nombre_origen + ' ' + d.depto_origen)}${hasMulti}
  //         </td>
  //         <td>
  //           ${_esc(d.nombre_destino + ' ' + d.depto_destino)}
  //         </td>
  //         <td>
  //           <span style="background:rgba(15,31,61,.07);padding:2px 7px;border-radius:4px;font-size:.65rem;font-weight:700">
  //             ${_esc(d.tipo_vehiculo)}
  //           </span>
  //         </td>
  //         <td>
  //           <div class="viajes-cell">
  //             <span class="viajes-num">${d.numero_viajes.toLocaleString('es-CO')}</span>
  //             <div class="viajes-bar"><div class="viajes-fill" style="width:${pct}%"></div></div>
  //           </div>
  //         </td>
  //         <td>${fmtT(d.tarifa_plena)}</td>
  //         <td>${fmtT(d.multi_recogida)}</td>
  //         <td>${fmtT(d.multi_entrega)}</td>
  //         <td>${diasEl}</td>
  //         <td>${motivoEl}</td>
  //         <td>
  //           <button class="action-btn ab-edit" onclick="abrirEdicion(${gi})">
  //             <i class="fas fa-edit"></i> Editar
  //           </button>
  //         </td>
  //       </tr>`;
  //   }).join('');

  //   wrap.innerHTML = `
  //     <table id="tabla-prioritarias" class="display nowrap w-100">
  //       <thead>
  //         <tr>
  //           <th class="check-col">
  //             <input type="checkbox" id="check-all" onchange="toggleSelectAll()"
  //               style="accent-color:var(--accent);width:13px;height:13px;cursor:pointer;">
  //           </th>
  //           <th>% Viajes</th>
  //           <th>Estado</th>
  //           <!--<th>Ruta</th>-->
  //           <th>Origen</th>
  //           <th>Destino</th>
  //           <th>Vehículo</th>
  //           <th>Viajes</th>
  //           <th>Tarifa Plena</th>
  //           <th>M. Recogida</th>
  //           <th>M. Entrega</th>
  //           <th>Días ⚠</th>
  //           <th>Motivo</th>
  //           <th>Acciones</th>
  //         </tr>
  //       </thead>
  //       <tbody>${rows}</tbody>
  //     </table>`;

  //   setTimeout(() => {
  //     inicializarDataTablePrioritarias('#tabla-prioritarias');
  //   }, 100);
  // }

  /* ══════════════════════════════════════════════════════════
   | RENDER TABLA CON FOOTER (TOTALES)
   | ══════════════════════════════════════════════════════════ */
  function _renderTabla() {
    const wrap = document.getElementById('table-wrap');
    if (!wrap) return;

    const data = _getVisible();
    const cnt = document.getElementById('count-txt');
    if (cnt) cnt.textContent = data.length + ' rutas';

    if (!data.length) {
      wrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon"><i class="fas fa-${S.allData.length ? 'search' : 'bolt'}"></i></div>
          <div class="empty-text">${S.allData.length ? 'Sin resultados' : 'Lista no generada'}</div>
          <div class="empty-sub">${S.allData.length ? 'Cambie el filtro o el texto de búsqueda' : 'Configure el parámetro TOP y presione Generar Lista Priorizada'}</div>
        </div>`;
      return;
    }

    // --- CÁLCULO DE TOTALES PARA EL TFOOT ---
    const totalViajesPagina = data.reduce((acc, d) => acc + (parseInt(d.numero_viajes) || 0), 0);
    // Sumamos pct2 que es (d.numero_viajes / S.resumen.total_viajes) * 100
    // const totalPctPagina = data.reduce((acc, d) => {
    //   const p2 = (d.numero_viajes / S.resumen.total_viajes) * 100;
    //   return acc + p2;
    // }, 0);

    // --- CORRECCIÓN EN EL CÁLCULO DEL FOOTER ---
    const totalPctPagina = data.reduce((acc, d) => {
      // NO redondear aquí para mantener la precisión decimal en la suma
      const p2 = (d.numero_viajes / S.resumen.total_viajes) * 100;
      return acc + p2;
    }, 0);

    if ($.fn.DataTable.isDataTable('#tabla-prioritarias')) {
      $('#tabla-prioritarias').DataTable().destroy();
      $('#tabla-prioritarias').off();
    }

    const rows = data.map(d => {
      const gi = S.allData.indexOf(d);
      const sel = S.selected.has(gi);
      const pct = Math.round((d.numero_viajes / S.maxViajes) * 100);
      // const pct2 = Math.round((d.numero_viajes / S.resumen.total_viajes) * 100);
      // CORRECCIÓN: Quita el Math.round() de aquí para mostrar decimales reales
      const pct2 = (d.numero_viajes / S.resumen.total_viajes) * 100;

      const semCls = { verde: 'sem-verde', rojo: 'sem-rojo', amarillo: 'sem-amarillo' }[d.semaforo] || 'sem-rojo';
      const badgeMap = {
        SIN_TARIFA: ['badge-sin-tarifa', 'Sin Tarifa'],
        VENCIDA: ['badge-vencida', 'Vencida'],
        POR_VENCER: ['badge-por-vencer', 'Por Vencer'],
        VIGENTE: ['badge-vigente', 'Vigente'],
      };
      const [bCls, bTxt] = badgeMap[d.estado] || ['badge-sin-tarifa', d.estado];

      const fmtT = v => (v > 0)
        ? `<span class="tarifa-val">$${Number(v).toLocaleString('es-CO')}</span>`
        : `<span class="tarifa-none">—</span>`;

      const diasRedondeados = (d.dias_sin_actualizar !== null && d.dias_sin_actualizar !== undefined)
        ? Math.round(d.dias_sin_actualizar)
        : null;

      const diasEl = (diasRedondeados !== null)
        ? `<span style="color:${diasRedondeados > 30 ? 'var(--red)' : 'var(--muted)'};font-weight:${diasRedondeados > 30 ? '700' : '400'}">${diasRedondeados}d</span>`
        : `<span style="color:var(--muted)">—</span>`;

      const hasMulti = (d.multi_origen > 0 || d.multi_destino > 0)
        ? '<span style="background:#e0f2fe;color:#0369a1;font-size:.58rem;font-weight:700;padding:1px 5px;border-radius:4px;margin-left:4px">MO/MD</span>'
        : '';

      const motivoEl = d.motivo
        ? `<span title="${_esc(d.motivo)}" style="cursor:help;font-size:.67rem;color:var(--muted)">${_esc(d.estado)}</span>`
        : '<span style="color:var(--muted);font-size:.67rem">—</span>';

      return `
        <tr ${sel ? 'class="selected"' : ''}>
          <td class="check-col">
            <input type="checkbox" ${sel ? 'checked' : ''}
              onchange="toggleSelect(${gi})"
              style="accent-color:var(--navy);width:14px;height:14px;cursor:pointer;">
          </td>
          <!--<td style="font-family:'DM Mono',monospace;font-size:.68rem;color:var(--navy);font-weight:700">${(pct2 || 0).toFixed(2)}%</td>-->
          <td style="font-family:'DM Mono',monospace;font-size:.68rem;color:var(--navy);font-weight:700">${(pct2 || 0).toFixed(2)}%</td>
          <td>
            <div style="display:flex;align-items:center;gap:5px">
              <span class="semaforo ${semCls}"></span>
              <span class="badge ${bCls}">${bTxt}</span>
            </div>
          </td>
          <td>${_esc(d.nombre_origen + ' ' + d.depto_origen)}${hasMulti}</td>
          <td>${_esc(d.nombre_destino + ' ' + d.depto_destino)}</td>
          <td>
            <span style="background:rgba(15,31,61,.07);padding:2px 7px;border-radius:4px;font-size:.65rem;font-weight:700">
              ${_esc(d.tipo_vehiculo)}
            </span>
          </td>
          <td>
            <div class="viajes-cell">
              <span class="viajes-num">${d.numero_viajes.toLocaleString('es-CO')}</span>
              <div class="viajes-bar"><div class="viajes-fill" style="width:${pct}%"></div></div>
            </div>
          </td>
          <td>${fmtT(d.tarifa_plena)}</td>
          <td>${fmtT(d.multi_recogida)}</td>
          <td>${fmtT(d.multi_entrega)}</td>
          <td>${diasEl}</td>
          <td>${motivoEl}</td>
          <td>
            <button class="action-btn ab-edit" onclick="abrirEdicion(${gi})">
              <i class="fas fa-edit"></i> Editar
            </button>
          </td>
        </tr>`;
    }).join('');

    wrap.innerHTML = `
      <table id="tabla-prioritarias" class="display nowrap w-100">
        <thead>
          <tr>
            <th class="check-col">
              <input type="checkbox" id="check-all" onchange="toggleSelectAll()"
                style="accent-color:var(--accent);width:13px;height:13px;cursor:pointer;">
            </th>
            <th>% Viajes</th>
            <th>Estado</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Vehículo</th>
            <th>Viajes</th>
            <th>Tarifa Plena</th>
            <th>M. Recogida</th>
            <th>M. Entrega</th>
            <th>Días ⚠</th>
            <th>Motivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot style="background: #f8fafc; font-weight: 800; border-top: 2px solid #e2e8f0;">
          <tr>
            <td></td>
            <td style="font-family:'DM Mono',monospace; color:var(--navy);">${totalPctPagina.toFixed(2)}%</td>
            <td colspan="4" style="text-align:right; padding-right:15px;">TOTALES:</td>
            <td style="color:var(--navy);">${totalViajesPagina.toLocaleString('es-CO')}</td>
            <td colspan="6"></td>
          </tr>
        </tfoot>
      </table>`;

    setTimeout(() => {
      inicializarDataTablePrioritarias('#tabla-prioritarias');
    }, 100);
  }

  function inicializarDataTablePrioritarias(id) {
    const $tabla = $(id);
    if (!$tabla.length) return;

    if ($.fn.DataTable.isDataTable(id)) {
      $tabla.DataTable().destroy();
    }
    $tabla.find('thead tr.filters').remove();

    // Crear fila de filtros con th vacíos
    const $filterRow = $('<tr class="filters"></tr>');
    $tabla.find('thead tr:first th').each(function () {
      $filterRow.append('<th></th>');
    });
    $filterRow.appendTo($tabla.find('thead'));

    window.tablaPrioritarias = $tabla.DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      destroy: true,
      pageLength: 25,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
      },
      columnDefs: [
        { orderable: false, targets: [0, 11] },  // checkbox y acciones no ordenan
        { searchable: false, targets: [0, 11] },  // checkbox y acciones no filtran
      ],
      initComplete: function () {
        const api = this.api();

        api.columns().every(function (colIdx) {
          // Sin filtro en: checkbox (0) y acciones (11)
          if (colIdx === 0 || colIdx === 11) return;

          const cell = $tabla.find('thead tr.filters th').get(colIdx);
          if (!cell) return;

          const title = $(api.column(colIdx).header()).text().trim();

          $(cell).html(
            `<input type="text"
                    placeholder="${title}"
                    style="font-size:11px;height:24px;width:100%;box-sizing:border-box;
                           border:1px solid #ddd;border-radius:3px;padding:0 4px;"/>`
          );

          $('input', cell).on('keyup change', function (e) {
            e.stopPropagation();
            if (api.column(colIdx).search() !== this.value) {
              api.column(colIdx).search(this.value).draw();
            }
          });
        });
      },
    });
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
    _s('st-viajes', r.total_viajes || 0);
    S.resumen = r;
  }

  function _recalcStats() {
    if (!S.resumen) return;
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
    const top = r.parametro_top || 80;
    const wPct = Math.min(100, Math.round((r.semaforo_rojo + r.semaforo_amarillo) / total * 100));
    const fill = document.getElementById('pareto-fill');
    const label = document.getElementById('pareto-fill-label');
    const info = document.getElementById('pareto-info');
    const tot = document.getElementById('pareto-rutas-total');
    if (fill) fill.style.width = wPct + '%';
    if (label) label.textContent = `TOP ${top} · ${r.semaforo_rojo + r.semaforo_amarillo} requieren acción`;
    if (info) info.innerHTML = `<i class="fas fa-bolt"></i> TOP ${top}`;
    if (tot) tot.textContent = `${total} rutas priorizadas`;
  }

  /* ══════════════════════════════════════════════════════════
   | HELPERS
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

  function _getVisible() {
    return S.filteredData.length ? S.filteredData : S.allData;
  }

  function _showLoading(msg) {
    const w = document.getElementById('table-wrap');
    if (w) w.innerHTML = `
      <div class="loading-state">
        <div class="spinner"></div>
        <div style="font-size:.78rem;color:var(--muted);margin-top:8px">${msg}</div>
      </div>`;
  }

  function _showError(msg) {
    const w = document.getElementById('table-wrap');
    if (w) w.innerHTML = `
      <div class="empty-state">
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

  function _s(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
  function _t(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }
  function _v(id, val) { const el = document.getElementById(id); if (el) el.value = val; }
  function _esc(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ══════════════════════════════════════════════════════════
   | TOAST — usa SweetAlert2 si disponible
   ══════════════════════════════════════════════════════════ */
  function _toast(msg, type = 'info') {
    if (window.Swal) {
      Swal.fire({ toast: true, position: 'top-end', icon: type, title: msg, showConfirmButton: false, timer: 3500 });
    } else if (window.toastr) {
      toastr[type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : 'success'](msg);
    } else {
      console.log(`[GEN·${type.toUpperCase()}] ${msg}`);
    }
  }

  /* ============================================================
     AUTO-INICIO - INIT
     ============================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initFechas, _cargarParametro, _cargarClientes, _cargarZonas);
    // document.addEventListener('DOMContentLoaded', Municipios);
    document.getElementById('tbl-filter')
      ?.addEventListener('input', function () { _applyFilters(); _renderTabla(); });
  } else {
    _initFechas();
    _cargarParametro();   // [A]
    _cargarClientes();    // [C]
    _cargarZonas();       // [D]
  }

  // Exponer toast globalmente para otros scripts si hace falta
  window.rpToast = _toast;
  // window._cargarClientes = _cargarClientes;

})();