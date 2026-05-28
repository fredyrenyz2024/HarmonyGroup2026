(function () {
  'use strict';

  /* =========================================================
  |  ESTADO DEL MÓDULO
  | =========================================================*/
  let API = '';
  let EMPRESA_ID = '';
  let USUARIO = '';

  /** Cache de datos en memoria para filtrar sin re-fetch */
  let _DATA = [];

  const HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-API-KEY": "nexos_nacional2026@*",
  };

  /* =========================================================
  |  HELPERS
  | =========================================================*/

  /** Muestra u oculta el spinner de la tabla */
  function _setLoading(show) {
    const tr = document.getElementById('load_info');
    if (tr) tr.style.display = show ? 'table-row' : 'none';
  }

  /** Anima un contador desde 0 hasta un valor */
  function _animarContador(id, valor) {
    const el = document.getElementById(id);
    if (!el) return;
    let v = 0;
    const step = Math.max(1, Math.ceil(valor / 20));
    const iv = setInterval(() => {
      v = Math.min(v + step, valor);
      el.textContent = v;
      if (v >= valor) clearInterval(iv);
    }, 30);
  }

  /** Genera el badge HTML según tipo_causal */
  function _badgeTipo(tipo) {
    const map = {
      VENTA: `<span class="badge-venta"><i class="bi bi-receipt"></i> Venta</span>`,
      COSTO: `<span class="badge-costo"><i class="bi bi-truck-flatbed"></i> Costo</span>`,
      AMBOS: `<span class="badge-ambos"><i class="bi bi-arrow-left-right"></i> Ambos</span>`,
    };
    return map[tipo?.toUpperCase()] ?? `<span class="badge-inactivo">—</span>`;
  }

  /** Genera el badge HTML según estado */
  function _badgeEstado(estado) {
    if (estado === 'Activo' || estado === 'Activa') {
      return `<span class="badge-activo"><i class="bi bi-check-circle-fill"></i> Activo</span>`;
    }
    return `<span class="badge-inactivo"><i class="bi bi-dash-circle-fill"></i> Inactivo</span>`;
  }

  /** Actualiza los KPI cards con los datos actuales en _DATA */
  function _actualizarKPIs(data) {
    const total = data.length;
    const activos = data.filter(d => d.estado === 'Activo' || d.estado === 'Activa').length;
    const venta = data.filter(d => (d.tipo_causal ?? '').toUpperCase() === 'VENTA').length;
    const costo = data.filter(d => (d.tipo_causal ?? '').toUpperCase() === 'COSTO').length;

    _animarContador('kpi_total', total);
    _animarContador('kpi_activos', activos);
    _animarContador('kpi_venta', venta);
    _animarContador('kpi_costo', costo);

    const label = document.getElementById('ca-count-label');
    if (label) label.textContent = `(${total} registros)`;

    const footer = document.getElementById('ca-footer-info');
    if (footer) footer.innerHTML = `Total: <strong>${total}</strong> causales · <strong>${activos}</strong> activas`;
  }

  /** Renderiza filas en la tabla */
  function _renderTabla(data) {
    const tbody = document.getElementById('porcentajes_body');
    tbody.innerHTML = '';

    if (!data || data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5">
            <div class="ca-empty">
              <div class="ce-icon"><i class="bi bi-inbox"></i></div>
              <div class="ce-title">No hay causales para mostrar</div>
            </div>
          </td>
        </tr>`;
      return;
    }

    data.forEach((item, index) => {
      const esActivo = item.estado === 'Activo' || item.estado === 'Activa';

      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td style="width:60px; color:var(--ca-slate-400); font-size:.75rem;">${item.id}</td>
          <td style="text-align:left; padding-left:14px; font-weight:500;">${item.causal_aprobacion ?? '—'}</td>
          <td>${_badgeTipo(item.tipo_causal)}</td>
          <td>${_badgeEstado(item.estado)}</td>
          <td>
            <div class="d-flex justify-content-center gap-1">
              <!-- Editar -->
              <button class="ca-action-btn ca-ab-edit"
                onclick="editar(${item.id})"
                title="Editar">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <!-- Activar / Inactivar -->
              ${esActivo
          ? `<button class="ca-action-btn ca-ab-inactive"
                    onclick="toggleEstado(${item.id}, 'Inactivo')"
                    title="Inactivar">
                    <i class="bi bi-pause-circle-fill"></i>
                  </button>`
          : `<button class="ca-action-btn ca-ab-toggle"
                    onclick="toggleEstado(${item.id}, 'Activo')"
                    title="Activar">
                    <i class="bi bi-play-circle-fill"></i>
                  </button>`
        }
            </div>
          </td>
        </tr>
      `);
    });
  }

  /* =========================================================
  |  LISTAR — GET /causales-aprobacion
  | =========================================================*/
  function listar() {
    _setLoading(true);

    fetch(API + 'causales-aprobacion?empresa_id=' + EMPRESA_ID, {
      method: 'GET',
      headers: HEADERS,
    })
      .then(r => {
        if (!r.ok) throw new Error('Error HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        _setLoading(false);
        _DATA = Array.isArray(data) ? data : (data.data ?? []);
        _renderTabla(_DATA);
        _actualizarKPIs(_DATA);
      })
      .catch(err => {
        _setLoading(false);
        console.error('Error al listar causales:', err);
        document.getElementById('porcentajes_body').innerHTML = `
          <tr><td colspan="5" class="text-danger text-center py-3">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Error al cargar los datos. Intenta de nuevo.
          </td></tr>`;
      });
  }

  /* =========================================================
  |  EDITAR — GET /causales-aprobacion/:id  → llena el form
  | =========================================================*/
  window.editar = function (id) {
    fetch(API + 'causales-aprobacion/' + id, {
      method: 'GET',
      headers: HEADERS,
    })
      .then(r => {
        if (!r.ok) throw new Error('Error HTTP ' + r.status);
        return r.json();
      })
      .then(data => {
        // Adapta si el backend envuelve en { data: {...} }
        const item = data.data ?? data;

        document.getElementById('parametro-id-edit').value = item.id;
        document.getElementById('nombre-parametro').value = item.causal_aprobacion ?? '';
        document.getElementById('estado-parametro').value = item.estado ?? 'Activo';
        document.getElementById('tipo-causal').value = item.tipo_causal ?? '';

        // Actualizar pills
        seleccionarTipoCausal(item.tipo_causal ?? '', null, /* silencioso */ true);

        // Actualizar título del offcanvas
        document.getElementById('offcanvasImporteMasivoLabel').textContent = 'Editar Causal';
        document.getElementById('ca-offcanvas-sub').textContent = `ID: ${item.id} · ${item.causal_aprobacion}`;
        document.getElementById('btn-accion-texto').textContent = 'Actualizar';

        // Abrir offcanvas
        bootstrap.Offcanvas.getOrCreateInstance(
          document.getElementById('offcanvasImporteMasivo')
        ).show();
      })
      .catch(err => {
        console.error('Error al cargar causal:', err);
        Swal.fire('Error', 'No se pudo cargar la causal para editar.', 'error');
      });
  };

  /* =========================================================
  |  GUARDAR — POST (crear) / PUT (actualizar)
  | =========================================================*/
  function guardar() {
    const id = document.getElementById('parametro-id-edit').value.trim();
    const nombre = document.getElementById('nombre-parametro').value.trim();
    const estado = document.getElementById('estado-parametro').value;
    const tipo = document.getElementById('tipo-causal').value;

    // ── Validaciones básicas ──
    if (!nombre) {
      _marcarError('nombre-parametro', 'El nombre de la causal es obligatorio.');
      return;
    }

    if (!tipo) {
      Swal.fire({
        icon: 'warning',
        title: 'Tipo de causal requerido',
        text: 'Selecciona si la causal aplica a Venta, Costo o Ambos.',
        confirmButtonText: 'Entendido',
      });
      return;
    }

    const payload = {
      causal_aprobacion: nombre,
      tipo_causal: tipo,
      estado: estado,
      usuario: USUARIO,
      empresa_id: EMPRESA_ID,
    };

    const isUpdate = !!id;
    const method = isUpdate ? 'PUT' : 'POST';
    const url = isUpdate
      ? API + 'causales-aprobacion/' + id
      : API + 'causales-aprobacion';

    // Feedback visual: deshabilitar botón
    const btn = document.getElementById('btn-accion-parametro');
    const textoOriginal = btn.querySelector('#btn-accion-texto').textContent;
    btn.disabled = true;
    btn.querySelector('#btn-accion-texto').textContent = 'Guardando...';

    fetch(url, {
      method: method,
      headers: HEADERS,
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) return r.json().then(e => { throw e; });
        return r.json();
      })
      .then(() => {
        bootstrap.Offcanvas.getOrCreateInstance(
          document.getElementById('offcanvasImporteMasivo')
        ).hide();

        Swal.fire({
          icon: 'success',
          title: isUpdate ? 'Causal actualizada' : 'Causal creada',
          text: isUpdate
            ? 'Los cambios se guardaron correctamente.'
            : 'La nueva causal fue registrada exitosamente.',
          timer: 2000,
          showConfirmButton: false,
        });

        listar();
      })
      .catch(err => {
        console.error('Error al guardar causal:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: err.message ?? JSON.stringify(err),
        });
      })
      .finally(() => {
        btn.disabled = false;
        btn.querySelector('#btn-accion-texto').textContent = textoOriginal;
      });
  }

  /* =========================================================
  |  TOGGLE ESTADO — Activar / Inactivar sin eliminar
  |  PATCH o PUT /causales-aprobacion/:id/estado  (ajusta
  |  el endpoint según tu backend)
  | =========================================================*/
  window.toggleEstado = function (id, nuevoEstado) {
    const accion = nuevoEstado === 'Inactivo' ? 'inactivar' : 'activar';

    Swal.fire({
      title: `¿${nuevoEstado === 'Inactivo' ? 'Inactivar' : 'Activar'} causal?`,
      text: `La causal quedará en estado "${nuevoEstado}".`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: nuevoEstado === 'Inactivo' ? '#ef4444' : '#10b981',
      reverseButtons: true,
    }).then(result => {
      if (!result.isConfirmed) return;

      fetch(API + 'causales-aprobacion/' + id, {
        method: 'PUT',
        headers: HEADERS,
        body: JSON.stringify({
          estado: nuevoEstado,
          usuario: USUARIO,
          empresa_id: EMPRESA_ID,
        }),
      })
        .then(r => {
          if (!r.ok) throw new Error('Error HTTP ' + r.status);
          return r.json();
        })
        .then(() => {
          Swal.fire({
            icon: 'success',
            title: `Causal ${nuevoEstado === 'Inactivo' ? 'inactivada' : 'activada'}`,
            timer: 1800,
            showConfirmButton: false,
          });
          listar();
        })
        .catch(err => {
          console.error('Error al cambiar estado:', err);
          Swal.fire('Error', 'No se pudo cambiar el estado de la causal.', 'error');
        });
    });
  };

  /* =========================================================
  |  SELECCIONAR TIPO CAUSAL (pills visuales)
  |  Llamado desde onclick del HTML y desde editar()
  | =========================================================*/
  window.seleccionarTipoCausal = function (valor, elementoClickado, silencioso = false) {
    // Limpiar selección anterior
    document.querySelectorAll('.ca-tipo-pill').forEach(p => {
      p.classList.remove('selected-venta', 'selected-costo', 'selected-ambos');
    });

    // Aplicar clase al pill correspondiente
    const claseMap = { VENTA: 'selected-venta', COSTO: 'selected-costo', AMBOS: 'selected-ambos' };
    const clase = claseMap[valor?.toUpperCase()];

    if (clase) {
      // Si llega desde editar() busca por data-value; si llega desde onclick usa el elemento
      const target = elementoClickado
        ?? document.querySelector(`.ca-tipo-pill[data-value="${valor?.toUpperCase()}"]`);
      if (target) target.classList.add(clase);
    }

    document.getElementById('tipo-causal').value = valor?.toUpperCase() ?? '';
  };

  /* =========================================================
  |  FILTRO LOCAL DE TABLA (sin nueva petición al servidor)
  | =========================================================*/
  window.filtrarTablaLocal = function (texto) {
    const busqueda = texto.toLowerCase().trim();
    const tipo = document.getElementById('ca_filter_tipo')?.value.toUpperCase() ?? '';

    const filtrados = _DATA.filter(item => {
      const coincideTexto = !busqueda
        || (item.causal_aprobacion ?? '').toLowerCase().includes(busqueda)
        || String(item.id).includes(busqueda);

      const coincideTipo = !tipo
        || (item.tipo_causal ?? '').toUpperCase() === tipo;

      return coincideTexto && coincideTipo;
    });

    _renderTabla(filtrados);

    const footer = document.getElementById('ca-footer-info');
    if (footer) {
      footer.innerHTML = filtrados.length < _DATA.length
        ? `Mostrando <strong>${filtrados.length}</strong> de <strong>${_DATA.length}</strong> causales`
        : `Total: <strong>${_DATA.length}</strong> causales`;
    }
  };

  /* =========================================================
  |  HELPERS DE VALIDACIÓN
  | =========================================================*/
  function _marcarError(idInput, mensaje) {
    const el = document.getElementById(idInput);
    if (!el) return;
    el.style.borderColor = '#ef4444';
    el.style.boxShadow = '0 0 0 3px rgba(239,68,68,.15)';
    el.focus();

    const prev = el.nextElementSibling;
    if (prev && prev.classList.contains('ca-error-msg')) prev.remove();

    const msg = document.createElement('div');
    msg.className = 'ca-error-msg';
    msg.style.cssText = 'font-size:.72rem;color:#ef4444;margin-top:4px;';
    msg.textContent = mensaje;
    el.insertAdjacentElement('afterend', msg);

    el.addEventListener('input', function limpiar() {
      el.style.borderColor = '';
      el.style.boxShadow = '';
      msg.remove();
      el.removeEventListener('input', limpiar);
    }, { once: true });
  }

  /* =========================================================
  |  RESET DE FORMULARIO
  | =========================================================*/
  function _resetForm() {
    document.getElementById('parametro-id-edit').value = '';
    document.getElementById('nombre-parametro').value = '';
    document.getElementById('estado-parametro').value = 'Activo';
    document.getElementById('tipo-causal').value = '';

    document.querySelectorAll('.ca-tipo-pill').forEach(p => {
      p.classList.remove('selected-venta', 'selected-costo', 'selected-ambos');
    });

    document.getElementById('offcanvasImporteMasivoLabel').textContent = 'Nueva Causal';
    document.getElementById('ca-offcanvas-sub').textContent = 'Completa los campos requeridos';
    document.getElementById('btn-accion-texto').textContent = 'Guardar';
  }

  /* =========================================================
  |  INIT
  | =========================================================*/
  window.initScript = function (id) {
    window.VENTANA = id;

    API = document.getElementById('base_url_api').value;
    EMPRESA_ID = document.getElementById('empresa_id').value ?? 1;
    USUARIO = document.getElementById('ssn_nombre').value;

    // Botón guardar
    document.getElementById('btn-accion-parametro')
      ?.addEventListener('click', guardar);

    // Limpiar form al cerrar offcanvas
    document.getElementById('offcanvasImporteMasivo')
      ?.addEventListener('hidden.bs.offcanvas', _resetForm);

    // Listar al iniciar
    listar();
  };

  // Exponer listar para el botón de refrescar en el HTML
  window.listar = listar;

})();