(function () {
  'use strict';

  const API = () => document.getElementById('base_url_api')?.value?.replace(/\/$/, '') || '';
  const EMPRESA = () => parseInt(document.getElementById('empresa_id')?.value || 0);
  const HEADERS = () => ({
    'Content-Type': 'application/json',
    'X-API-KEY': 'nexos_nacional2026@*',
  });

  const AG = {
    modo: 'ruta',
    data: [],
    maxViajes: 1,
    totalViajes: 0,
    totalGrupos: 0,
  };

  document.addEventListener('DOMContentLoaded', function () {
    const sel = document.getElementById('f-agrupar');
    if (!sel) return;
    AG.modo = sel.value || 'ruta';
    sel.addEventListener('change', function () {
      AG.modo = this.value;
      rpAgruparCambio();
    });
    _cargarClientes();
  });

  window.rpAgruparCambio = function () {
    const wrap = document.getElementById('table-body-wrap');
    const tieneContenido = wrap && !wrap.querySelector('.empty-state');
    if (!tieneContenido) {
      _actualizarTituloTabla();
      return;
    }
    _fetchAgrupado();
  };

  window.rpHistoricoConsultar = function () {
    AG.modo = document.getElementById('f-agrupar')?.value || 'ruta';
    _fetchAgrupado();
  };

  /* ══════════════════════════════════════════════════════════
   | FUNCIÓN DE EXPORTACIÓN (NUEVA)
   ══════════════════════════════════════════════════════════ */
  window.rpAgruparExportar = function () {
    if (!AG.data.length) {
      rpToast('No hay datos para exportar.', 'warning');
      return;
    }

    _showLoading('Generando Excel...');

    fetch(`${API()}/rutas-prioritarias/exportar`, {
      method: 'POST',
      headers: HEADERS(),
      body: JSON.stringify({
        data: AG.data,
        modo: AG.modo // Opcional: para que el backend sepa cómo estructurar
      }),
    })
      .then(r => r.json())
      .then(res => {
        _renderTabla(); // Restaurar tabla

        if (!res.success || !res.data?.length) {
          rpToast('Error al generar el archivo.', 'error');
          return;
        }

        if (!window.XLSX) {
          rpToast('Librería SheetJS no disponible.', 'error');
          return;
        }
        const ws = XLSX.utils.json_to_sheet(res.data);
        ws['!cols'] = Object.keys(res.data[0]).map(() => ({ wch: 18 }));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Histórico Agrupado');
        const fecha = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `historico_${AG.modo}_${fecha}.xlsx`);
        rpToast('Archivo exportado.', 'success');
      })
      .catch(() => {
        _renderTabla();
        rpToast('Error de conexión al exportar.', 'error');
      });
  };

  function _fetchAgrupado() {
    const payload = _buildPayload();
    if (!payload) return;
    _showLoading('Agrupando datos...');
    _clearStats();

    fetch(`${API()}/rutas-prioritarias/historico-agrupado`, {
      method: 'POST',
      headers: HEADERS(),
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(res => {
        if (!res.success) {
          _showError(res.message || 'Error en el servidor.');
          return;
        }
        AG.data = res.data || [];
        AG.totalViajes = res.total_viajes || 0;
        AG.totalGrupos = res.total_grupos || 0;
        AG.maxViajes = AG.data.reduce((m, d) => Math.max(m, d.numero_viajes), 1);

        _renderStats(res);
        _renderTabla();
        _actualizarTituloTabla();

        document.getElementById('table-result-count').style.display = 'inline-flex';
        document.getElementById('count-display').textContent = AG.data.length;
        rpToast(`${AG.totalGrupos} grupos · ${AG.totalViajes.toLocaleString('es-CO')} viajes`, 'success');
      })
      .catch(err => {
        console.error('[AGRUPADO]', err);
        _showError('Error de conexión.');
      });
  }

  function _renderTabla() {
    switch (AG.modo) {
      case 'vehiculo': _renderTablaVehiculo(); break;
      case 'zona': _renderTablaZona(); break;
      default: _renderTablaRuta(); break;
    }
  }

  // function _renderTablaRuta() {
  //   const wrap = document.getElementById('table-body-wrap');
  //   if (!wrap) return;
  //   if (!AG.data.length) { _showVacioEnTabla(); return; }

  //   const rows = AG.data.map((d, i) => {
  //     const pct = Math.round((d.numero_viajes / AG.maxViajes) * 100);
  //     return `
  //               <tr>
  //                   <td style="padding-left:16px;color:var(--muted);font-size:.68rem">${i + 1}</td>
  //                   <td>
  //                       <div style="font-weight:700;color:var(--navy);font-size:.78rem">${_esc(d.nombre_origen)}</div>
  //                       <div style="font-size:.62rem;color:var(--muted)">${_esc(d.depto_origen || '')} · ${_esc(d.origen || '')}</div>
  //                   </td>
  //                   <td>
  //                       <div style="font-weight:700;color:var(--navy);font-size:.78rem">${_esc(d.nombre_destino)}</div>
  //                       <div style="font-size:.62rem;color:var(--muted)">${_esc(d.depto_destino || '')} · ${_esc(d.destino || '')}</div>
  //                   </td>
  //                   <td><span style="background:rgba(15,31,61,.07);padding:2px 8px;border-radius:5px;font-size:.65rem;font-weight:700">${_esc(d.tipo_vehiculo)}</span></td>
  //                   <td>
  //                       <div class="viajes-cell">
  //                           <span class="viajes-num">${d.numero_viajes.toLocaleString('es-CO')}</span>
  //                           <div class="viajes-bar"><div class="viajes-fill" style="width:${pct}%"></div></div>
  //                       </div>
  //                   </td>
  //                   <td style="font-family:var(--mono);font-size:.69rem;color:var(--muted)">${d.porcentaje_viajes.toFixed(2)}%</td>
  //                   <!--<td style="font-family:var(--mono);font-size:.7rem;font-weight:700;color:var(--navy)">${d.pct_acum.toFixed(1)}%</td>-->
  //                   <td style="font-size:.68rem;color:var(--muted)">${_esc(d.zona_origen || '—')}</td>
  //                   <td style="font-size:.68rem;color:var(--muted)">${_esc(d.zona_destino || '—')}</td>
  //                   <td style="font-size:.67rem;color:var(--muted)">${d.primera_fecha ? d.primera_fecha.slice(0, 7) : '—'}</td>
  //                   <td style="font-size:.67rem;color:var(--muted)">${d.ultima_fecha ? d.ultima_fecha.slice(0, 7) : '—'}</td>
  //               </tr>`;
  //   }).join('');

  //   wrap.innerHTML = `<table><thead><tr><th style="padding-left:16px">#</th><th>Origen</th><th>Destino</th><th>Vehículo</th><th>Viajes</th><th>% Indiv</th><!--<th>% Acum</th>--><th>Zona Orig</th><th>Zona Dest</th><th>1ra Fecha</th><th>Ult Fecha</th></tr></thead><tbody>${rows}</tbody></table>`;

  //   setTimeout(() => {
  //     inicializarDataTable(tableId);
  //   }, 100);
  // }

  // function inicializarDataTable(id) {
  //   const $tabla = $(id);

  //   // 1. Limpieza absoluta antes de empezar
  //   if ($.fn.DataTable.isDataTable(id)) {
  //     $tabla.DataTable().destroy();
  //   }
  //   $tabla.find("thead tr.filters").remove();

  //   // 2. Crear la fila de filtros clonando el header original
  //   const $headerRow = $tabla.find("thead tr:first");
  //   const $filterRow = $headerRow.clone(true).addClass("filters");
  //   $filterRow.appendTo($tabla.find("thead"));

  //   // 3. Inicializar DataTable
  //   window.tablaTarifas = $tabla.api = $tabla.DataTable({
  //     orderCellsTop: true,
  //     fixedHeader: true,
  //     destroy: true,
  //     search: false,
  //     language: {
  //       url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
  //     },
  //     initComplete: function () {
  //       const api = this.api();

  //       // Usamos el API de datatables para recorrer las columnas de forma segura
  //       api
  //         .columns()
  //         .eq(0)
  //         .each(function (colIdx) {
  //           // Seleccionamos la celda de filtro usando el contexto de la tabla actual
  //           // Esto evita el error de "reading property cell"
  //           const cell = $tabla.find(".filters th").get(colIdx);

  //           if (!cell) return; // Salvaguarda: si la celda no existe, saltar

  //           const title = $(api.column(colIdx).header()).text();

  //           // Columna 0 (ID/Número) se deja limpia
  //           if (colIdx === 0) {
  //             $(cell).html("");
  //             return;
  //           }

  //           // Inyectamos el input
  //           // $(cell).html(`<input type="text" class="form-control form-control-sm w-100" placeholder="${title}" style="font-size: 11px;"/>`);
  //           $(cell).html(
  //             `<input type="text" class="w-100" placeholder="${title}" style="font-size: 11px;height:24px;"/>`,
  //           );

  //           // Eventos de filtrado optimizados
  //           $("input", cell).on("keyup change", function (e) {
  //             e.stopPropagation(); // Evita que el click en el input active el ordenamiento de la columna
  //             if (api.column(colIdx).search() !== this.value) {
  //               api.column(colIdx).search(this.value).draw();
  //             }
  //           });
  //         });
  //     },
  //   });
  // }

  function _renderTablaRuta() {
    const wrap = document.getElementById('table-body-wrap');
    if (!wrap) return;
    if (!AG.data.length) { _showVacioEnTabla(); return; }

    // Destruir DataTable existente antes de re-renderizar
    if ($.fn.DataTable.isDataTable('#tabla-rutas-frecuentes')) {
      $('#tabla-rutas-frecuentes').DataTable().destroy();
      $('#tabla-rutas-frecuentes').remove();
    }

    const rows = AG.data.map((d, i) => {
      const pct = Math.round((d.numero_viajes / AG.maxViajes) * 100);
      return `
            <tr>
                <td style="padding-left:16px;color:var(--muted);font-size:.68rem">${i + 1}</td>
                <td>
                    <div style="font-weight:700;color:var(--navy);font-size:.78rem">${_esc(d.nombre_origen)}</div>
                    <div style="font-size:.62rem;color:var(--muted)">${_esc(d.depto_origen || '')} · ${_esc(d.origen || '')}</div>
                </td>
                <td>
                    <div style="font-weight:700;color:var(--navy);font-size:.78rem">${_esc(d.nombre_destino)}</div>
                    <div style="font-size:.62rem;color:var(--muted)">${_esc(d.depto_destino || '')} · ${_esc(d.destino || '')}</div>
                </td>
                <td><span style="background:rgba(15,31,61,.07);padding:2px 8px;border-radius:5px;font-size:.65rem;font-weight:700">${_esc(d.tipo_vehiculo)}</span></td>
                <td>
                    <div class="viajes-cell">
                        <span class="viajes-num">${d.numero_viajes.toLocaleString('es-CO')}</span>
                        <div class="viajes-bar"><div class="viajes-fill" style="width:${pct}%"></div></div>
                    </div>
                </td>
                <td style="font-family:var(--mono);font-size:.69rem;color:var(--muted)">${d.porcentaje_viajes.toFixed(2)}%</td>
                <td style="font-size:.68rem;color:var(--muted)">${_esc(d.zona_origen || '—')}</td>
                <td style="font-size:.68rem;color:var(--muted)">${_esc(d.zona_destino || '—')}</td>
                <td style="font-size:.67rem;color:var(--muted)">${d.primera_fecha ? d.primera_fecha.slice(0, 7) : '—'}</td>
                <td style="font-size:.67rem;color:var(--muted)">${d.ultima_fecha ? d.ultima_fecha.slice(0, 7) : '—'}</td>
            </tr>`;
    }).join('');

    // ⚠️ Tabla con ID fijo para que DataTable siempre la encuentre
    wrap.innerHTML = `
        <table id="tabla-rutas-frecuentes" class="display nowrap w-100">
            <thead>
                <tr>
                    <th style="padding-left:16px">#</th>
                    <th>Origen</th>
                    <th>Destino</th>
                    <th>Vehículo</th>
                    <th>Viajes</th>
                    <th>% Indiv</th>
                    <th>Zona Orig</th>
                    <th>Zona Dest</th>
                    <th>1ra Fecha</th>
                    <th>Ult Fecha</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;

    // Pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      inicializarDataTable('#tabla-rutas-frecuentes');
    }, 100);
  }


  function inicializarDataTable(id) {
    const $tabla = $(id);
    if (!$tabla.length) return;

    // 1. Limpieza absoluta antes de empezar
    if ($.fn.DataTable.isDataTable(id)) {
      $tabla.DataTable().destroy();
    }
    $tabla.find('thead tr.filters').remove();

    // 2. Crear fila de filtros
    const $headerRow = $tabla.find('thead tr:first');
    const $filterRow = $('<tr class="filters"></tr>');

    $headerRow.find('th').each(function () {
      $filterRow.append('<th></th>');
    });
    $filterRow.appendTo($tabla.find('thead'));

    // 3. Inicializar DataTable
    window.tablaRutas = $tabla.DataTable({
      orderCellsTop: true,
      fixedHeader: true,
      destroy: true,
      pageLength: 25,
      language: {
        url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json',
      },
      columnDefs: [
        { orderable: false, targets: 0 }, // columna # no ordena
      ],
      initComplete: function () {
        const api = this.api();

        api.columns().every(function (colIdx) {
          // Columna 0 (numeración) sin filtro
          if (colIdx === 0) return;

          const cell = $tabla.find('thead tr.filters th').get(colIdx);
          if (!cell) return;

          const title = $(api.column(colIdx).header()).text().trim();

          $(cell).html(
            `<input type="text" 
                            placeholder="${title}" 
                            style="font-size:11px;height:24px;width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:3px;padding:0 4px;"/>`
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

  function _renderTablaVehiculo() {
    const wrap = document.getElementById('table-body-wrap');
    if (!wrap) return;
    if (!AG.data.length) { _showVacioEnTabla(); return; }

    const rows = AG.data.map((d, i) => {
      const pct = Math.round((d.numero_viajes / AG.maxViajes) * 100);
      return `
                <tr>
                    <td style="padding-left:16px;color:var(--muted);font-size:.68rem">${i + 1}</td>
                    <td><span style="background:rgba(15,31,61,.07);padding:2px 8px;border-radius:5px;font-size:.65rem;font-weight:700">${_esc(d.tipo_vehiculo)}</span></td>
                    <td style="font-weight:700;color:var(--navy);font-size:.78rem;text-align:center">${d.numero_rutas_distintas}</td>
                    <td>
                        <div class="viajes-cell">
                            <span class="viajes-num">${d.numero_viajes.toLocaleString('es-CO')}</span>
                            <div class="viajes-bar"><div class="viajes-fill" style="width:${pct}%"></div></div>
                        </div>
                    </td>
                    <td style="font-family:var(--mono);font-size:.69rem;color:var(--muted)">${d.porcentaje_viajes.toFixed(2)}%</td>
                    <td style="font-size:.67rem;color:var(--muted)">${d.primera_fecha ? d.primera_fecha.slice(0, 7) : '—'}</td>
                    <td style="font-size:.67rem;color:var(--muted)">${d.ultima_fecha ? d.ultima_fecha.slice(0, 7) : '—'}</td>
                </tr>`;
    }).join('');

    wrap.innerHTML = `<table><thead><tr><th style="padding-left:16px">#</th><th>Vehículo</th><th>Rutas Distintas</th><th>Viajes</th><th>% Indiv</th><th>1ra Fecha</th><th>Ult Fecha</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function _renderTablaZona() {
    const wrap = document.getElementById('table-body-wrap');
    if (!wrap) return;
    if (!AG.data.length) { _showVacioEnTabla(); return; }

    const rows = AG.data.map((d, i) => {
      const pct = Math.round((d.numero_viajes / AG.maxViajes) * 100);
      return `
                <tr>
                    <td style="padding-left:16px;color:var(--muted);font-size:.68rem">${i + 1}</td>
                    <td style="font-weight:700;color:var(--navy);font-size:.78rem">${_esc(d.zona_origen)}</td>
                    <td style="font-weight:700;color:var(--navy);font-size:.78rem">${_esc(d.zona_destino)}</td>
                    <td style="font-weight:700;color:var(--navy);font-size:.78rem;text-align:center">${d.numero_rutas_distintas}</td>
                    <td>
                        <div class="viajes-cell">
                            <span class="viajes-num">${d.numero_viajes.toLocaleString('es-CO')}</span>
                            <div class="viajes-bar"><div class="viajes-fill" style="width:${pct}%"></div></div>
                        </div>
                    </td>
                    <td style="font-family:var(--mono);font-size:.69rem;color:var(--muted)">${d.porcentaje_viajes.toFixed(2)}%</td>
                    <td style="font-size:.67rem;color:var(--muted)">${d.primera_fecha ? d.primera_fecha.slice(0, 7) : '—'}</td>
                    <td style="font-size:.67rem;color:var(--muted)">${d.ultima_fecha ? d.ultima_fecha.slice(0, 7) : '—'}</td>
                </tr>`;
    }).join('');

    wrap.innerHTML = `<table><thead><tr><th style="padding-left:16px">#</th><th>Zona Origen</th><th>Zona Destino</th><th>Rutas Distintas</th><th>Viajes</th><th>% Indiv</th><th>1ra Fecha</th><th>Ult Fecha</th></tr></thead><tbody>${rows}</tbody></table>`;
  }

  function _buildPayload() {
    const desde = document.getElementById('f-desde')?.value;
    const hasta = document.getElementById('f-hasta')?.value;
    if (!desde || !hasta) { rpToast('Seleccione fechas.', 'warning'); return null; }

    return {
      empresa_id: EMPRESA(),
      fecha_desde: desde,
      fecha_hasta: hasta,
      agrupar_por: AG.modo,
      cliente_id: document.getElementById('f-cliente')?.value || null,
      zona_id: document.getElementById('f-zona')?.value || null,
    };
  }

  function _showLoading(msg) {
    const wrap = document.getElementById('table-body-wrap');
    if (wrap) wrap.innerHTML = `<div class="loading-state"><div class="spinner"></div><div style="font-size:.78rem;color:var(--muted);margin-top:6px">${msg}</div></div>`;
  }

  function _showError(msg) {
    const wrap = document.getElementById('table-body-wrap');
    if (wrap) wrap.innerHTML = `<div class="empty-state"><div class="empty-icon" style="color:var(--red)"><i class="fas fa-exclamation-triangle"></i></div><div class="empty-text" style="color:var(--red)">${_esc(msg)}</div></div>`;
  }

  function _showVacioEnTabla() {
    const wrap = document.getElementById('table-body-wrap');
    if (wrap) wrap.innerHTML = `<div class="empty-state"><div class="empty-icon"><i class="fas fa-search"></i></div><div class="empty-text">Sin resultados</div><div class="empty-sub">No hay datos para la agrupación seleccionada</div></div>`;
  }

  function _clearStats() {
    ['stat-rutas', 'stat-viajes', 'stat-top3', 'stat-pareto'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '—';
    });
  }

  function _renderStats(res) {
    const setStat = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    setStat('stat-rutas', res.total_grupos || 0);
    setStat('stat-viajes', (res.total_viajes || 0).toLocaleString('es-CO'));
    const top3 = AG.data.slice(0, 3).map(d => d.numero_viajes).join(' / ');
    setStat('stat-top3', top3 || '—');

    const umbral = (res.total_viajes || 0) * 0.8;
    let acum = 0;
    const cnt80 = AG.data.filter(d => { acum += d.numero_viajes; return acum <= umbral; }).length;
    setStat('stat-pareto', cnt80);
  }

  function _actualizarTituloTabla() {
    const titulo = document.getElementById('table-title');
    if (titulo) titulo.textContent = `Detalle por ${AG.modo.charAt(0).toUpperCase() + AG.modo.slice(1)}`;
  }

  function _esc(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  window.rpToast = window.rpToast || function (msg, type = 'info') {
    if (window.Swal) {
      Swal.fire({ toast: true, position: 'top-end', icon: type, title: msg, showConfirmButton: false, timer: 3500 });
    } else {
      console.log(`[${type.toUpperCase()}] ${msg}`);
    }
  };

  function _cargarClientes() {
    console.log("hola");

    const sel = document.getElementById('f-cliente');
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

  // if (document.readyState === 'loading') {
  //   document.addEventListener('DOMContentLoaded', _cargarClientes);
  //   // document.addEventListener('DOMContentLoaded', Municipios);
  // } else {
  //   _cargarClientes();    // [C]
  // }
})();
