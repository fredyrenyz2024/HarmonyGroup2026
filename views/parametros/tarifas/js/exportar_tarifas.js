// /**
//  * ============================================================
//  * MÓDULO: ExportarTarifas
//  * ============================================================
//  * Maneja toda la lógica de la ventana de exportación de tarifas.
//  *
//  * RESPONSABILIDADES:
//  *  1. Cargar selectores (clientes, vehículos, municipios, zonas)
//  *  2. Gestionar filtros y chips visuales
//  *  3. Consultar API según tipo (ventas / costos)
//  *  4. Renderizar tabla de resultados
//  *  5. Exportar a Excel via API del servidor
//  * ============================================================
//  */
// /**
//  * ============================================================
//  * MÓDULO: ExportarTarifas
//  * ============================================================
//  * Maneja toda la lógica de la ventana de exportación de tarifas.
//  *
//  * RESPONSABILIDADES:
//  *  1. Cargar selectores (clientes, vehículos, municipios, zonas)
//  *  2. Gestionar filtros y chips visuales
//  *  3. Consultar API según tipo (ventas / costos)
//  *  4. Renderizar tabla de resultados
//  *  5. Exportar a Excel via API del servidor
//  * ============================================================
//  */

// /**
//  * ============================================================
//  * MÓDULO: ExportarTarifas
//  * ============================================================
//  * Maneja toda la lógica de la ventana de exportación de tarifas.
//  *
//  * RESPONSABILIDADES:
//  *  1. Cargar selectores (clientes, vehículos, municipios, zonas)
//  *  2. Gestionar filtros y chips visuales
//  *  3. Consultar API según tipo (ventas / costos)
//  *  4. Renderizar tabla de resultados
//  *  5. Exportar a Excel via API del servidor
//  * ============================================================
//  */
// (function () {
//   'use strict';

//   const ExportarTarifas = (() => {

//     /* ──────────────────────────────────────────────────────
//      | ESTADO INTERNO DEL MÓDULO
//      ────────────────────────────────────────────────────── */
//     const state = {
//       tipo: 'ventas', // 'ventas' | 'costos'
//       filtros: {}, // Filtros activos { clave: valor }
//       datos: [], // Datos cargados actualmente
//       cargando: false, // Flag de petición en curso
//     };

//     const empresaId = Number(document.getElementById('empresa_id')?.value || 0);
//     const params = {};
//     if (empresaId) params.empresa_id = empresaId;

//     /* ──────────────────────────────────────────────────────
//      | CONFIGURACIÓN DE RUTAS API
//      |
//      | Base: /api/nexos  (prefijo definido en api.php → parametros.php)
//      |
//      | VENTAS  → ParametroController        (parametros.php)
//      | COSTOS  → TarifaCostoController      (parametros.php)
//      | ZONAS   → ZonaDespachoController     (parametros.php)
//      | EXPORT  → GeneradorTarifaCostoController (POST exportar)
//      ────────────────────────────────────────────────────── */
//     const BASE = document.getElementById('base_url_api').value;

//     const API = {
//       // ── Tarifas de Ventas ──────────────────────────────────────
//       // GET  /api/nexos/tarifas                → ParametroController@index
//       ventas: `${BASE}tarifas`,

//       // ── Tarifas de Costos ─────────────────────────────────────
//       // GET  /api/nexos/tarifas-costos         → TarifaCostoController@index
//       costos: `${BASE}tarifas-costos`,

//       // ── Exportar Ventas ───────────────────────────────────────
//       // No existe ruta GET de exportar en ventas en parametros.php,
//       // se usa el mismo endpoint index con ?exportar=1 y se maneja
//       // en el frontend via SheetJS (descarga desde JSON).
//       exportVentas: `${BASE}tarifas`,

//       // ── Exportar Costos ───────────────────────────────────────
//       // POST /api/nexos/tarifas-costos/exportar → GeneradorTarifaCostoController@exportarExcel
//       exportCostos: `${BASE}tarifas-costos/exportar`,

//       // ── Municipios (Origen / Destino) ─────────────────────────
//       // GET  /api/nexos/tarifas/listar-municipios → ParametroController@listarMunicipios
//       municipios: `${BASE}tarifas/listar-municipios`,

//       // ── Clientes ──────────────────────────────────────────────
//       // Ruta filtros de clientes disponible en rutas prioritarias.
//       // GET  /api/nexos/rutas-prioritarias/filtros/clientes
//       clientes: `${BASE}rutas-prioritarias/filtros/clientes`,

//       // ── Tipos de Vehículo ─────────────────────────────────────
//       // No hay endpoint dedicado en parametros.php; se obtienen
//       // en línea extrayendo valores únicos del listado de tarifas.
//       vehiculos: null,

//       // ── Zonas de Despacho ─────────────────────────────────────
//       // GET  /api/nexos/zonas-despacho/         → ZonaDespachoController@index
//       zonas: `${BASE}zonas-despacho/`,

//       // ── Causales de aprobación (costos) ──────────────────────
//       // GET  /api/nexos/tarifas-costos/listar-causales
//       causalesCostos: `${BASE}tarifas-costos/listar-causales`,

//       // ── Causales de aprobación (ventas) ───────────────────────
//       // GET  /api/nexos/tarifas/listar-causales
//       causalesVentas: `${BASE}tarifas/listar-causales`,
//     };

//     /* ──────────────────────────────────────────────────────
//      | ETIQUETAS LEGIBLES PARA CHIPS DE FILTRO
//      ────────────────────────────────────────────────────── */
//     const ETIQUETAS_FILTRO = {
//       cliente_id: 'Cliente',
//       tipo_vehiculo: 'Vehículo',
//       origen: 'Origen',
//       destino: 'Destino',
//       estado_tarifa: 'Estado',
//       zona_id: 'Zona',
//       estado_aprobacion: 'Aprobación',
//       estado_vigencia: 'Vigencia',
//       vigencia: 'Año Vigencia',
//       fecha_desde: 'Fecha Desde',
//       fecha_hasta: 'Fecha Hasta',
//       semana_desde: 'Semana Desde',
//       semana_hasta: 'Semana Hasta',
//       mes_desde: 'Mes Desde',
//       mes_hasta: 'Mes Hasta',
//     };

//     /* ──────────────────────────────────────────────────────
//      | UTILIDADES: petición autenticada con CSRF de Laravel
//      ────────────────────────────────────────────────────── */
//     function getCsrfToken() {
//       return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
//     }

//     /**
//      * Realiza una petición GET a la API.
//      * @param {string} url    - Endpoint completo.
//      * @param {Object} params - Parámetros query-string.
//      * @returns {Promise<Object>} Respuesta JSON del servidor.
//      */
//     // async function apiGet(url, params = {}) {
//     //   // console.log("🚀 ~ apiGet ~ params:", params)
//     //   // Construir query string omitiendo valores vacíos
//     //   const qs = new URLSearchParams(
//     //     Object.fromEntries(
//     //       Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
//     //     )
//     //   ).toString();

//     //   const fullUrl = qs ? `${url}?${qs}` : url;

//     //   const resp = await fetch(fullUrl, {
//     //     method: 'GET',
//     //     headers: {
//     //       'Accept': 'application/json',
//     //       "X-API-KEY": "nexos_nacional2026@*",
//     //       'X-Requested-With': 'XMLHttpRequest',
//     //     },
//     //     // data: { empresa_id: Number(document.getElementById("empresa_id")?.value || 1) },
//     //   });

//     //   if (!resp.ok) {
//     //     const err = await resp.json().catch(() => ({}));
//     //     throw new Error(err.message ?? `Error ${resp.status}`);
//     //   }

//     //   return resp.json();
//     // }

//     // async function apiGet(url, params = {}) {
//     //   // Asegurar que empresa_id siempre vaya si existe en el DOM
//     //   const idEmpresa = document.getElementById('empresa_id')?.value;
//     //   if (idEmpresa && !params.empresa_id) {
//     //     params.empresa_id = idEmpresa;
//     //   }

//     //   // Limpiar parámetros: eliminar nulos, undefined o vacíos
//     //   const cleanedParams = Object.fromEntries(
//     //     Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
//     //   );

//     //   const qs = new URLSearchParams(cleanedParams).toString();
//     //   const fullUrl = qs ? `${url}?${qs}` : url;

//     //   // LOG para ver qué URL se está disparando exactamente en la consola
//     //   console.log("🔗 Petición a:", fullUrl);

//     //   const resp = await fetch(fullUrl, {
//     //     method: 'GET',
//     //     headers: {
//     //       'Accept': 'application/json',
//     //       "X-API-KEY": "nexos_nacional2026@*",
//     //       'X-Requested-With': 'XMLHttpRequest',
//     //     },
//     //   });

//     //   if (!resp.ok) {
//     //     const err = await resp.json().catch(() => ({}));
//     //     throw new Error(err.message ?? `Error ${resp.status}`);
//     //   }

//     //   return resp.json();
//     // }


//     async function apiGet(url, params = {}) {
//       // 1. Obtener empresa_id automáticamente del input hidden del phtml
//       const idEmpresa = document.getElementById('empresa_id')?.value;
//       if (idEmpresa) params.empresa_id = idEmpresa;

//       // 2. Limpiar parámetros para no enviar campos vacíos o nulos
//       const cleanedParams = Object.fromEntries(
//         Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
//       );

//       // 3. Construir Query String
//       const qs = new URLSearchParams(cleanedParams).toString();
//       const fullUrl = qs ? `${url}?${qs}` : url;

//       const resp = await fetch(fullUrl, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           "X-API-KEY": "nexos_nacional2026@*", // Tu llave de seguridad
//           'X-Requested-With': 'XMLHttpRequest',
//         },
//       });

//       if (!resp.ok) {
//         const err = await resp.json().catch(() => ({}));
//         throw new Error(err.message || `Error ${resp.status}`);
//       }

//       return resp.json();
//     }

//     /* ──────────────────────────────────────────────────────
//      | CARGA INICIAL DE SELECTORES
//      ────────────────────────────────────────────────────── */

//     /**
//      * Carga los municipios disponibles en los selectores de origen y destino.
//      */
//     async function cargarMunicipios() {
//       try {
//         const res = await apiGet(API.municipios);
//         const municipios = res.data ?? [];

//         const opts = municipios
//           .map(m => `<option value="${escHtml(m.id ?? m.municipio)}">${escHtml(m.municipio)}</option>`)
//           .join('');

//         document.getElementById('sel-origen-exportar').innerHTML = '<option value="">— Todos los orígenes —</option>' + opts;
//         document.getElementById('sel-destino-exportar').innerHTML = '<option value="">— Todos los destinos —</option>' + opts;
//       } catch (e) {
//         console.warn('[ExportarTarifas] No se pudieron cargar municipios:', e.message);
//       }
//     }

//     /**
//      * Carga los clientes para el filtro (solo visible en modo Ventas).
//      *
//      * RUTA: GET /api/nexos/rutas-prioritarias/filtros/clientes
//      *   → RutasPrioritariasController@filtrosClientes
//      *
//      * Respuesta esperada: { success: true, data: [{ id, nombre }, ...] }
//      *
//      * El parámetro empresa_id es requerido por el controlador.
//      * Se lee desde la variable global `empresaId` si está definida en el layout,
//      * o se omite para que el backend use la empresa del usuario autenticado.
//      */
//     async function cargarClientes() {
//       try {
//         // empresa_id viene del contexto global del layout si existe
//         const params = {};
//         if (typeof empresaId !== 'undefined' && empresaId) {
//           params.empresa_id = empresaId;
//         }

//         const res = await apiGet(API.clientes, params);
//         const clientes = res.data ?? [];

//         const opts = clientes
//           .map(c => `<option value="${escHtml(c.id)}">${escHtml(c.nombre ?? c.razon_social)}</option>`)
//           .join('');

//         document.getElementById('sel-cliente').innerHTML = opts;

//         // document.getElementById('sel-cliente').innerHTML =
//         //   '<option value="">— Todos los clientes —</option>' + opts;

//         new TomSelect('#sel-cliente', {
//           create: false, // Usualmente para tipos de vehículos no quieres que el usuario invente nuevos
//           placeholder: "Seleccione un cliente...",
//           allowEmptyOption: true,
//           sortField: {
//             field: "text",
//             direction: "asc",
//           },
//           onInitialize: function () {
//             // Aplicar clases de Bootstrap para mantener el diseño uniforme
//             this.control.classList.add("f-control");
//           },
//         });
//       } catch (e) {
//         console.warn('[ExportarTarifas] No se pudieron cargar clientes:', e.message);
//       }
//     }

//     /**
//      * Carga los tipos de vehículo para el filtro de configuración.
//      *
//      * No existe endpoint dedicado en parametros.php para tipos de vehículo.
//      * Se extraen los valores únicos de tipo_vehiculo consultando ambos listados
//      * (ventas y costos con límite pequeño) y mergeando los distintos valores.
//      */
//     async function cargarVehiculos() {
//       try {
//         const [resVentas, resCostos] = await Promise.allSettled([
//           apiGet(API.ventas, {
//             limit: 200,
//             sort_by: 'tipo_vehiculo'
//           }),
//           apiGet(API.costos, {
//             limit: 200,
//             sort_by: 'tipo_vehiculo'
//           }),
//         ]);

//         const dataV = resVentas.status === 'fulfilled' ? (resVentas.value.data ?? []) : [];
//         const dataC = resCostos.status === 'fulfilled' ? (resCostos.value.data ?? []) : [];

//         // Extraer valores únicos de tipo_vehiculo de ambas fuentes
//         const tiposSet = new Set(
//           [...dataV, ...dataC]
//             .map(t => t.tipo_vehiculo)
//             .filter(Boolean)
//         );
//         const tipos = [...tiposSet].sort();
//         if (!tipos.length) return;

//         const opts = tipos
//           .map(v => `<option value="${escHtml(v)}">${escHtml(v)}</option>`)
//           .join('');

//         document.getElementById('sel-vehiculo').innerHTML =
//           '<option value="">— Todos los vehículos —</option>' + opts;
//       } catch (e) {
//         console.warn('[ExportarTarifas] No se pudieron cargar vehículos:', e.message);
//       }
//     }

//     /**
//      * Carga las zonas de despacho para el filtro de zona.
//      *
//      * RUTA: GET /api/nexos/zonas-despacho/  → ZonaDespachoController@index
//      * El campo de nombre en la respuesta es `nombre_zona` (no `nombre`).
//      * Se filtra solo las que tienen activo = 1.
//      */
//     async function cargarZonas() {
//       try {
//         const empresaId = Number(document.getElementById('empresa_id')?.value || 0);
//         const params = {};
//         if (empresaId) params.empresa_id = empresaId;

//         const res = await apiGet(API.zonas, params);
//         // const zonas = (res.data ?? []).filter(z => z.activo == 1 || z.activo === true);
//         const zonas = (res.data ?? []).filter(z => z.activo == 1 || z.activo === true || z.activo === "Activo");
//         const opts = zonas.map(z => `<option value="${escHtml(z.id)}">${escHtml(z.nombre_zona ?? z.nombre)}</option>`).join('');

//         document.getElementById('sel-zona').innerHTML = '<option value="">— Todas las zonas —</option>' + opts;
//       } catch (e) {
//         console.warn('[ExportarTarifas] No se pudieron cargar zonas:', e.message);
//       }
//     }

//     /**
//      * Rellena el selector de año de vigencia con los últimos 5 años y el siguiente.
//      */
//     function cargarAniosVigencia() {
//       const anioActual = new Date().getFullYear();
//       let opts = '';
//       for (let a = anioActual + 1; a >= anioActual - 4; a--) {
//         opts += `<option value="${a}">${a}</option>`;
//       }
//       document.getElementById('inp-vigencia-anio').innerHTML =
//         '<option value="">— Todos los años —</option>' + opts;
//     }

//     /* ──────────────────────────────────────────────────────
//      | GESTIÓN DEL TIPO DE TARIFA (VENTAS / COSTOS)
//      ────────────────────────────────────────────────────── */

//     /**
//      * Cambia el tipo de tarifa activo y ajusta la UI acorde.
//      * - Ventas: muestra filtro de cliente.
//      * - Costos: oculta filtro de cliente (no aplica para fletes nacionales).
//      * @param {'ventas'|'costos'} tipo
//      */
//     function setTipo(tipo) {
//       state.tipo = tipo;

//       // Actualizar estilos de botones toggle
//       const btnVentas = document.getElementById('btn-tipo-ventas');
//       const btnCostos = document.getElementById('btn-tipo-costos');
//       btnVentas.className = 'tipo-btn' + (tipo === 'ventas' ? ' active-ventas' : '');
//       btnCostos.className = 'tipo-btn' + (tipo === 'costos' ? ' active-costos' : '');

//       // Actualizar badge del header
//       const badge = document.getElementById('badge-tipo-activo');
//       const labelBadge = document.getElementById('label-tipo-activo');
//       badge.className = `tipo-indicator ${tipo}`;
//       labelBadge.textContent = tipo === 'ventas' ? 'Ventas' : 'Costos';

//       // Mostrar/ocultar filtro de cliente
//       const filtroCliente = document.getElementById('filtro-cliente-wrap');
//       if (tipo === 'ventas') {
//         filtroCliente.style.display = '';
//       } else {
//         filtroCliente.style.display = 'none';
//         // Si había cliente seleccionado, limpiarlo
//         document.getElementById('sel-cliente').value = '';
//         delete state.filtros.cliente_id;
//       }

//       // Limpiar tabla al cambiar tipo para evitar datos cruzados
//       limpiarTabla();
//       renderChips();
//     }

//     /* ──────────────────────────────────────────────────────
//      | GESTIÓN DE FILTROS
//      ────────────────────────────────────────────────────── */

//     /**
//      * Actualiza un filtro en el estado interno.
//      * @param {string} clave  - Nombre del parámetro API.
//      * @param {string} valor  - Valor seleccionado (vacío = sin filtro).
//      */
//     function setFiltro(clave, valor) {
//       if (valor === '' || valor === null) {
//         delete state.filtros[clave];
//       } else {
//         state.filtros[clave] = valor;
//       }
//       renderChips();
//     }

//     /**
//      * Elimina todos los filtros aplicados y resetea los controles del formulario.
//      */
//     function limpiarFiltros() {
//       state.filtros = {};

//       // Resetear todos los controles de filtro
//       ['sel-cliente', 'sel-vehiculo', 'sel-origen-exportar', 'sel-destino-exportar',
//         'sel-estado', 'sel-zona', 'sel-aprobacion', 'sel-vigencia',
//         'inp-vigencia-anio', 'inp-fecha-desde', 'inp-fecha-hasta',
//         'inp-semana-desde', 'inp-semana-hasta', 'inp-mes-desde', 'inp-mes-hasta'
//       ]
//         .forEach(id => {
//           const el = document.getElementById(id);
//           if (el) el.value = '';
//         });

//       renderChips();
//       limpiarTabla();
//     }

//     /**
//      * Renderiza los chips de filtros activos en la UI.
//      * Cada chip permite eliminar el filtro de forma individual.
//      */
//     function renderChips() {
//       const contenedor = document.getElementById('chips-filtros-activos');
//       const esCostos = state.tipo === 'costos';

//       let html = '';

//       // Chip del tipo seleccionado (siempre visible)
//       html += `<span class="filter-chip ${esCostos ? 'chip-costos' : ''}">
//                     <i class="ti ti-${esCostos ? 'trending-down' : 'trending-up'} me-1"></i>
//                     ${esCostos ? 'Costos' : 'Ventas'}
//                  </span>`;

//       // Chips de filtros activos
//       Object.entries(state.filtros).forEach(([clave, valor]) => {
//         const label = ETIQUETAS_FILTRO[clave] ?? clave;
//         html += `<span class="filter-chip ${esCostos ? 'chip-costos' : ''}">
//                         ${escHtml(label)}: <strong>${escHtml(String(valor))}</strong>
//                         <button type="button" onclick="ExportarTarifas.removerFiltro('${clave}')"
//                                 title="Quitar filtro">
//                             <i class="ti ti-x"></i>
//                         </button>
//                      </span>`;
//       });

//       contenedor.innerHTML = html;
//     }

//     /**
//      * Quita un filtro individual desde el chip correspondiente.
//      * @param {string} clave - Clave del filtro a remover.
//      */
//     function removerFiltro(clave) {
//       delete state.filtros[clave];

//       // Resetear el control correspondiente
//       const mapaControl = {
//         cliente_id: 'sel-cliente',
//         tipo_vehiculo: 'sel-vehiculo',
//         origen: 'sel-origen-exportar',
//         destino: 'sel-destino-exportar',
//         estado_tarifa: 'sel-estado',
//         zona_id: 'sel-zona',
//         estado_aprobacion: 'sel-aprobacion',
//         estado_vigencia: 'sel-vigencia',
//         vigencia: 'inp-vigencia-anio',
//         fecha_desde: 'inp-fecha-desde',
//         fecha_hasta: 'inp-fecha-hasta',
//         semana_desde: 'inp-semana-desde',
//         semana_hasta: 'inp-semana-hasta',
//         mes_desde: 'inp-mes-desde',
//         mes_hasta: 'inp-mes-hasta',
//       };
//       const idControl = mapaControl[clave];
//       if (idControl) {
//         const el = document.getElementById(idControl);
//         if (el) el.value = '';
//       }

//       renderChips();
//     }

//     /* ──────────────────────────────────────────────────────
//      | TOGGLE DE FILTROS AVANZADOS
//      ────────────────────────────────────────────────────── */

//     /**
//      * Despliega o colapsa la sección de filtros avanzados.
//      */
//     function toggleAdvanced() {
//       const panel = document.getElementById('advanced-filters-panel');
//       const btn = document.getElementById('btn-toggle-advanced');
//       const abierto = panel.classList.toggle('show');
//       btn.classList.toggle('open', abierto);
//       btn.querySelector('.ti-icon').className =
//         `ti ${abierto ? 'ti-chevron-up' : 'ti-chevron-down'} ti-icon`;
//       btn.childNodes[1].nodeValue = ` ${abierto ? 'Ocultar filtros' : 'Mostrar más filtros'}`;
//     }

//     /* ──────────────────────────────────────────────────────
//      | CONSULTA A LA API
//      ────────────────────────────────────────────────────── */

//     /**
//      * Ejecuta la consulta al servidor con los filtros activos.
//      * Determina el endpoint según el tipo (ventas/costos).
//      */
//     // async function consultar() {
//     //   if (state.cargando) return;

//     //   state.cargando = true;
//     //   mostrarCargando();

//     //   const endpoint = state.tipo === 'ventas' ? API.ventas : API.costos;

//     //   try {
//     //     const res = await apiGet(endpoint, state.filtros);
//     //     // console.log("🚀 ~ consultar ~ res:", res)

//     //     state.datos = res.data ?? [];
//     //     renderTabla(state.datos);

//     //     // Actualizar badge de conteo
//     //     const badge = document.getElementById('badge-count');
//     //     badge.textContent = `${state.datos.length} reg.`;
//     //     badge.style.display = 'inline-flex';

//     //     // Actualizar paginación
//     //     const pagBar = document.getElementById('pagination-bar');
//     //     const pagInfo = document.getElementById('pag-info-text');
//     //     pagBar.style.display = '';
//     //     pagInfo.innerHTML = `Mostrando <strong>${state.datos.length}</strong> registros encontrados`;

//     //     // Habilitar botón de exportar solo si hay datos
//     //     document.getElementById('btn-exportar').disabled = state.datos.length === 0;

//     //   } catch (e) {
//     //     mostrarError(e.message);
//     //   } finally {
//     //     state.cargando = false;
//     //   }
//     // }

//     async function consultar() {
//       if (state.cargando) return;

//       try {
//         state.cargando = true;

//         // UI: Mostrar spinner o estado de carga en el botón
//         const btn = document.getElementById('btn-consultar');
//         if (btn) btn.innerHTML = '<i class="ti ti-loader-2 rotate"></i> Consultando...';

//         // Endpoint según el tipo seleccionado (Ventas o Costos)
//         const endpoint = state.tipo === 'ventas' ? API.ventas : API.costos;

//         // Realizar la petición con los filtros actuales
//         const response = await apiGet(endpoint, state.filtros);
//         console.log("🚀 ~ consultar ~ state.filtros:", state.filtros)

//         if (response.success) {
//           state.data = response.data;
//           renderTabla(response.data);
//           // actualizarResumenPaginacion(response.count);
//         } else {
//           throw new Error(response.message || 'Error desconocido');
//         }

//       } catch (error) {
//         console.error("❌ Error en consulta:", error);
//         alert("No se pudo cargar la información: " + error.message);
//       } finally {
//         state.cargando = false;
//         const btn = document.getElementById('btn-consultar');
//         if (btn) btn.innerHTML = '<i class="ti ti-search"></i> Consultar';
//       }
//     }

//     /* ──────────────────────────────────────────────────────
//      | RENDERIZADO DE TABLA
//      ────────────────────────────────────────────────────── */

//     /**
//      * Renderiza las filas de la tabla con los datos recibidos del servidor.
//      * Columnas: Origen, Destino, Tipo Vehículo, Región/Zona,
//      *           Última Tarifa, SICE-TAC, Mercado, Semana, Mes, Año, Estado, Aprobación, Vigencia.
//      * @param {Array} datos - Arreglo de objetos tarifa.
//      */
//     function renderTabla(datos) {
//       const tbody = document.getElementById('tbody-tarifas');
//       const tableId = document.getElementById('tabla-tarifas');

//       if (!datos.length) {
//         tbody.innerHTML = `
//                 <tr>
//                     <td colspan="14">
//                         <div class="empty-state">
//                             <div class="es-icon"><i class="ti ti-database-off"></i></div>
//                             <div class="es-title">Sin resultados</div>
//                             <div class="es-sub">No se encontraron tarifas con los filtros aplicados.</div>
//                         </div>
//                     </td>
//                 </tr>`;
//         return;
//       }

//       tbody.innerHTML = '';
//       tbody.innerHTML = datos.map((t, idx) => {

//         const formatFecha = (fechaStr) =>
//           fechaStr ? fechaStr.split("T")[0] : "";

//         // ── Extraer campos comunes (ventas y costos comparten estructura) ──
//         const origen = t.municipio_origen?.municipio ?? t.origen ?? '—';
//         const destino = t.municipio_destino?.municipio ?? t.destino ?? '—';
//         const tipoVeh = t.tipo_vehiculo ?? '—';

//         // const region = t.zona?.nombre_zona ?? t.region ?? t.municipio_origen?.depto ?? '—';
//         const region = t.municipio_origen?.zona_municipio?.[0]?.zona?.nombre_zona
//           ?? t.municipio_destino?.zona_municipio?.[0]?.zona?.nombre_zona
//           // ?? t.municipio_origen?.depto
//           ?? '—'
//           ?? '—';

//         // Última tarifa: suma de componentes activos (valor_total o flete base)
//         const ultimaTarifa = obtenerUltimaTarifa(t);

//         // Tarifa SICE-TAC: campo directo del modelo
//         const sicetac = t.tarifa_sicetac != null ?
//           formatCOP(t.tarifa_sicetac) :
//           '—';

//         // Tarifa de Mercado: calculada o referencial (si existe)
//         const mercado = t.tarifa_mercado != null ?
//           formatCOP(t.tarifa_mercado) :
//           '—';

//         const semana = t.semana ?? '—';
//         const mes = t.mes != null ? nombreMes(t.mes) : '—';
//         const anio = state.tipo === 'ventas' ? formatFecha(t.fecha_inicio) + '-' + formatFecha(t.fecha_fin) : t.vigencia;

//         // Estado de la tarifa (Activa / Inactiva)
//         const estadoBadge = badgeEstado(t.estado ?? t.estado_tarifa);

//         // Estado de aprobación (Aprobado / Pendiente / Rechazado)
//         const aprBadge = badgeAprobacion(t.estado_aprobacion);

//         // Estado de vigencia (Vigente / Por Vencer / Vencida)
//         const vigBadge = badgeVigencia(t.estado_vigencia);

//         return `
//             <tr data-search="${escAttr([origen, destino, tipoVeh, region].join(' ').toLowerCase())}">
//                 <td class="td-muted">${idx + 1}</td>
//                 <td><strong>${escHtml(origen)}</strong></td>
//                 <td>${escHtml(destino)}</td>
//                 <td>${escHtml(obtenerTipoVehiculo(tipoVeh))}</td>
//                 <td class="td-muted">${escHtml(region)}</td>
//                 <td class="td-mono">${ultimaTarifa}</td>
//                 <td class="td-mono">${sicetac}</td>
//                 <td class="td-mono">${mercado}</td>
//                 <td class="td-muted" style="text-align:center;">${semana}</td>
//                 <td class="td-muted">${mes}</td>
//                 <td class="td-muted" style="text-align:center;">${anio}</td>
//                 <td>${estadoBadge}</td>
//                 <td>${aprBadge}</td>
//                 <td>${vigBadge}</td>
//             </tr>`;
//       }).join('');

//       // --- PASO C: Inicializar DataTables con Filtros Tipo Excel ---
//       // setTimeout(() => {
//       //   inicializarDataTable(tableId);
//       // }, 100);
//     }

//     /**
//      * Determina la última tarifa actualizada de un registro.
//      * Busca en componentes activos o en el campo valor_total.
//      * @param {Object} t - Objeto tarifa.
//      * @returns {string} Tarifa formateada en COP o '—'.
//      */
//     function obtenerUltimaTarifa(t) {
//       // Intentar obtener valor_total del modelo
//       // if (t.valor_total != null && t.valor_total > 0) {
//       //   return formatCOP(t.valor_total);
//       // }
//       if (t.tarifa != null && t.tarifa > 0) {
//         return formatCOP(t.tarifa);
//       }

//       // Calcular desde componentes activos (suma de valores)
//       if (Array.isArray(t.componentes) && t.componentes.length) {
//         const suma = t.componentes.reduce((acc, c) => acc + parseFloat(c.valor ?? 0), 0);
//         if (suma > 0) return formatCOP(suma);
//       }

//       return '—';
//     }

//     /**
//      * Muestra overlay de carga en la tabla mientras se espera respuesta.
//      */
//     function mostrarCargando() {
//       document.getElementById('tbody-tarifas').innerHTML = `
//             <tr class="loading-row">
//                 <td colspan="14">
//                     <span class="spinner-sm"></span>
//                     Consultando tarifas de ${state.tipo}…
//                 </td>
//             </tr>`;
//       document.getElementById('badge-count').style.display = 'none';
//       document.getElementById('btn-exportar').disabled = true;
//       // document.getElementById('btn-consultar').disabled = true;
//       document.getElementById('pagination-bar').style.display = 'none';
//     }

//     /**
//      * Muestra mensaje de error en la tabla cuando la petición falla.
//      * @param {string} msg - Mensaje de error.
//      */
//     function mostrarError(msg) {
//       document.getElementById('tbody-tarifas').innerHTML = `
//             <tr>
//                 <td colspan="14">
//                     <div class="empty-state">
//                         <div class="es-icon" style="color:var(--red);"><i class="ti ti-alert-triangle"></i></div>
//                         <div class="es-title" style="color:var(--red);">Error al consultar</div>
//                         <div class="es-sub">${escHtml(msg)}</div>
//                     </div>
//                 </td>
//             </tr>`;
//       document.getElementById('btn-consultar').disabled = false;
//     }

//     /**
//      * Limpia la tabla y vuelve al estado inicial.
//      */
//     function limpiarTabla() {
//       state.datos = [];
//       document.getElementById('tbody-tarifas').innerHTML = `
//             <tr>
//                 <td colspan="14">
//                     <div class="empty-state">
//                         <div class="es-icon"><i class="ti ti-file-search"></i></div>
//                         <div class="es-title">Sin datos cargados</div>
//                         <div class="es-sub">Aplica los filtros deseados y presiona <strong>Consultar</strong>.</div>
//                     </div>
//                 </td>
//             </tr>`;
//       document.getElementById('badge-count').style.display = 'none';
//       document.getElementById('btn-exportar').disabled = true;
//       document.getElementById('pagination-bar').style.display = 'none';
//     }

//     /* ──────────────────────────────────────────────────────
//      | BÚSQUEDA LOCAL EN TABLA (sin ir al servidor)
//      ────────────────────────────────────────────────────── */

//     /**
//      * Filtra visualmente las filas de la tabla con la cadena de búsqueda.
//      * No realiza nueva petición al servidor.
//      * @param {string} texto - Texto ingresado en el buscador de tabla.
//      */
//     function filtrarTablaLocal(texto) {
//       const filas = document.querySelectorAll('#tbody-tarifas tr[data-search]');
//       const term = texto.toLowerCase().trim();
//       let visibles = 0;

//       filas.forEach(tr => {
//         const coincide = !term || tr.dataset.search.includes(term);
//         tr.style.display = coincide ? '' : 'none';
//         if (coincide) visibles++;
//       });

//       // Actualizar conteo en paginación
//       const pagInfo = document.getElementById('pag-info-text');
//       if (term) {
//         pagInfo.innerHTML = `Mostrando <strong>${visibles}</strong> de <strong>${state.datos.length}</strong> registros`;
//       } else {
//         pagInfo.innerHTML = `Mostrando <strong>${state.datos.length}</strong> registros encontrados`;
//       }
//     }

//     /* ──────────────────────────────────────────────────────
//      | EXPORTAR A EXCEL — DETALLE COMPLETO DE COMPONENTES
//      |
//      | El Excel NO exporta lo que se ve en la tabla de vista previa.
//      | Hace una nueva consulta al servidor con los mismos filtros activos
//      | para obtener la estructura COMPLETA de cada tarifa:
//      |
//      |   Tarifa (cabecera)
//      |   └─ Componentes: PLENA, MULTI_RECOGIDA, MULTI_ENTREGA, MULTI_ORIGEN, MULTI_DESTINO
//      |       └─ Detalles por municipio (rate_1, rate_2) ← solo en MULTI_ORIGEN / MULTI_DESTINO
//      |
//      | ESTRATEGIA POR TIPO:
//      |   ■ VENTAS → GET /api/nexos/tarifas        (ParametroController@index)
//      |              Trae componentes con detalles y municipio relacionado.
//      |              El Excel se genera en el cliente con SheetJS.
//      |
//      |   ■ COSTOS → GET /api/nexos/tarifas-costos  (TarifaCostoController@index)
//      |              Trae componentes con detalles y municipio relacionado.
//      |              El Excel se genera en el cliente con SheetJS.
//      |
//      | ESTRUCTURA DEL EXCEL (una fila por componente/detalle):
//      |   Tarifa ID | Cliente | Origen | Destino | Vehículo | Región |
//      |   Tarifa Sicetac | Semana | Mes | Año | Estado | Aprobación | Vigencia |
//      |   Tipo Componente | Valor Componente |
//      |   Municipio Detalle | Rate 1 | Rate 2 | Total Detalle
//      ────────────────────────────────────────────────────── */

//     /**
//      * Punto de entrada del botón “Exportar Excel”.
//      *
//      * 1. Consulta al servidor con los filtros activos para obtener las tarifas
//      *    CON todos sus componentes y detalles por municipio (estructura completa).
//      * 2. Transforma esos datos en un arreglo de filas planas (una por componente/detalle).
//      * 3. Genera el archivo .xlsx en el cliente usando SheetJS y lo descarga.
//      *
//      * Si no hay filtros o la consulta falla, informa al usuario apropiadamente.
//      */
//     async function exportarExcel() {
//       if (state.cargando) return;

//       // Verificar disponibilidad de SheetJS
//       if (typeof XLSX === 'undefined') {
//         alert('La librería SheetJS (XLSX) no está disponible en el layout.\n' +
//           'Consulte con el administrador para incluirla.');
//         return;
//       }

//       const btn = document.getElementById('btn-exportar');
//       const textoOriginal = btn.innerHTML;
//       btn.disabled = true;
//       btn.innerHTML = '<span class="spinner-sm"></span> Consultando datos…';

//       try {
//         // ■ PASO 1: Consultar el servidor con los filtros activos
//         // Usa el mismo endpoint del listado (index) que ya trae componentes y detalles.
//         const endpoint = state.tipo === 'ventas' ? API.ventas : API.costos;
//         const res = await apiGet(endpoint, state.filtros);
//         const tarifas = res.data ?? [];

//         if (!tarifas.length) {
//           alert('No se encontraron tarifas con los filtros seleccionados. Ajuste los filtros e intente de nuevo.');
//           return;
//         }

//         btn.innerHTML = '<span class="spinner-sm"></span> Generando Excel…';

//         // ■ PASO 2: Aplanar la estructura jerárquica a filas del Excel
//         const filas = aplanarTarifasParaExcel(tarifas, state.tipo);

//         if (!filas.length) {
//           alert('Los datos no tienen el detalle suficiente para generar el Excel.');
//           return;
//         }

//         // ■ PASO 3: Generar el archivo .xlsx con SheetJS y descargarlo
//         const ws = XLSX.utils.json_to_sheet(filas);

//         // Definir anchos de columna para que sea legible
//         ws['!cols'] = [{
//           wch: 8
//         }, // ID
//         {
//           wch: 25
//         }, // Cliente
//         {
//           wch: 22
//         }, // Origen
//         {
//           wch: 22
//         }, // Destino
//         {
//           wch: 22
//         }, // Tipo Vehículo
//         {
//           wch: 18
//         }, // Región
//         {
//           wch: 16
//         }, // Última Tarifa
//         {
//           wch: 16
//         }, // Tarifa SICE-TAC
//         {
//           wch: 16
//         }, // Tarifa Mercado
//         {
//           wch: 8
//         }, // Semana
//         {
//           wch: 12
//         }, // Mes
//         {
//           wch: 8
//         }, // Año
//         {
//           wch: 12
//         }, // Estado
//         {
//           wch: 22
//         }, // Aprobación
//         {
//           wch: 14
//         }, // Vigencia
//         {
//           wch: 20
//         }, // Tipo Componente
//         {
//           wch: 16
//         }, // Valor Componente
//         {
//           wch: 25
//         }, // Municipio Detalle
//         {
//           wch: 14
//         }, // Rate 1
//         {
//           wch: 14
//         }, // Rate 2
//         {
//           wch: 16
//         }, // Total Detalle
//         ];

//         // Aplicar estilos básicos al encabezado si SheetJS Pro no está disponible
//         // (La Community Edition no soporta estilos de celda directamente)

//         const wb = XLSX.utils.book_new();
//         const nombreHoja = state.tipo === 'ventas' ? 'Tarifas Ventas' : 'Tarifas Costos';
//         XLSX.utils.book_append_sheet(wb, ws, nombreHoja);

//         // Nombre del archivo con fecha y tipo
//         const fechaHoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
//         const fileName = `tarifas_${state.tipo}_detalle_${fechaHoy}.xlsx`;
//         XLSX.writeFile(wb, fileName);

//       } catch (e) {
//         alert(`Error al generar el Excel: ${e.message}`);
//       } finally {
//         btn.disabled = false;
//         btn.innerHTML = textoOriginal;
//       }
//     }

//     /**
//      * Transforma la respuesta jerárquica del servidor en filas planas para el Excel.
//      *
//      * ESTRUCTURA DE ENTRADA (por tarifa):
//      *   tarifa {
//      *     id, origen, destino, tipo_vehiculo, tarifa, tarifa_sicetac,
//      *     semana, mes, vigencia, estado_tarifa, estado_aprobacion, estado_vigencia,
//      *     municipioOrigen { municipio, departamento },
//      *     municipioDestino { municipio },
//      *     clienteTarifa   { nombre }              ← solo ventas
//      *     componentes: [
//      *       {
//      *         tipo,   // 'PLENA' | 'MULTI_RECOGIDA' | 'MULTI_ENTREGA' | 'MULTI_ORIGEN' | 'MULTI_DESTINO'
//      *         valor,
//      *         detalles: [
//      *           {
//      *             municipio_id, rate_1, rate_2,
//      *             municipio: { municipio, departamento }
//      *           }
//      *         ]
//      *       }
//      *     ]
//      *   }
//      *
//      * ESTRUCTURA DE SALIDA (una fila por cada componente o detalle):
//      *   - Componentes SIN detalles (PLENA, MULTI_RECOGIDA, MULTI_ENTREGA):
//      *       → 1 fila por componente, sin datos de municipio de detalle.
//      *   - Componentes CON detalles (MULTI_ORIGEN, MULTI_DESTINO):
//      *       → 1 fila por cada municipio del detalle.
//      *       → Si no tiene detalles, igual genera 1 fila con el valor global.
//      *
//      * @param {Array}  tarifas - Array de objetos tarifa con relaciones cargadas.
//      * @param {string} tipo    - 'ventas' | 'costos'
//      * @returns {Array} Arreglo de objetos planos listos para XLSX.utils.json_to_sheet()
//      */
//     function aplanarTarifasParaExcel(tarifas, tipo) {
//       const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
//         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
//       ];

//       // Mapa de tipo de componente a etiqueta legible (igual que el backend)
//       const TIPO_COMP_LABEL = {
//         'PLENA': 'Tarifa Plena',
//         'MULTI_RECOGIDA': 'Multi Recogida',
//         'MULTI_ENTREGA': 'Multi Entrega',
//         'MULTI_ORIGEN': 'Multi Origen',
//         'MULTI_DESTINO': 'Multi Destino',
//       };

//       // Componentes que llevan desglose por municipio en `detalles`
//       const TIPOS_CON_DETALLE = new Set(['MULTI_ORIGEN', 'MULTI_DESTINO']);

//       const filas = [];

//       for (const t of tarifas) {
//         const region = t.municipio_origen?.zona_municipio?.[0]?.zona?.nombre_zona
//           ?? t.municipio_destino?.zona_municipio?.[0]?.zona?.nombre_zona
//           // ?? t.municipio_origen?.depto
//           ?? '—'
//           ?? '—';
//         // — Datos cabecera de la tarifa (repetidos en cada fila) —
//         const cabecera = {
//           'ID Tarifa': t.id ?? '',
//           'Cliente': tipo === 'ventas' ?
//             (t.clienteTarifa?.nombre ?? t.clienteTarifa?.razon_social ?? '') :
//             'N/A – Costo',
//           'Origen': t.municipio_origen?.municipio ?? t.origen ?? '',
//           'Destino': t.municipio_destino?.municipio ?? t.destino ?? '',
//           'Tipo Vehículo': obtenerTipoVehiculo(t.tipo_vehiculo) ?? '',
//           // 'Región / Zona': t.zona?.nombre ?? t.region ?? t.municipio_origen?.departamento ?? '',
//           'Región / Zona': region ?? t.region ?? t.municipio_origen?.departamento ?? '',
//           'Últ. Tarifa (COP)': t.tarifa != null ? Number(t.tarifa) : '',
//           'SICE-TAC (COP)': t.tarifa_sicetac != null ? Number(t.tarifa_sicetac) : '',
//           'Mercado (COP)': t.tarifa_mercado != null ? Number(t.tarifa_mercado) : '',
//           'Semana': t.semana ?? '',
//           'Mes': t.mes != null ? MESES[t.mes] : '',
//           'Año Vigencia': t.vigencia ?? t.anio ?? '',
//           'Estado': t.estado_tarifa ?? t.estado ?? '',
//           'Aprobación': t.estado_aprobacion ?? '',
//           'Estado Vigencia': t.estado_vigencia ?? '',
//         };

//         const componentes = Array.isArray(t.componentes) ? t.componentes : [];

//         if (!componentes.length) {
//           // Si no vienen componentes, igual genera una fila con la cabecera
//           filas.push({
//             ...cabecera,
//             'Tipo Componente': '',
//             'Valor Comp. (COP)': '',
//             'Municipio Detalle': '',
//             'Rate 1 (COP)': '',
//             'Rate 2 (COP)': '',
//             'Total Det. (COP)': '',
//           });
//           continue;
//         }

//         for (const comp of componentes) {
//           const tipoLabel = TIPO_COMP_LABEL[comp.tipo] ?? comp.tipo ?? '';
//           const valorComp = comp.valor != null ? Number(comp.valor) : '';

//           const detalles = Array.isArray(comp.detalles) ? comp.detalles : [];
//           const tieneDetalle = TIPOS_CON_DETALLE.has(comp.tipo) && detalles.length > 0;

//           if (tieneDetalle) {
//             // Una fila por cada municipio del detalle
//             for (const det of detalles) {
//               const nomMun = det.municipio?.municipio ?? det.municipio_id ?? '';
//               const deptoMun = det.municipio?.departamento ? ` – ${det.municipio.departamento}` : '';
//               const r1 = det.rate_1 != null ? Number(det.rate_1) : '';
//               const r2 = det.rate_2 != null ? Number(det.rate_2) : '';
//               const total = (r1 !== '' && r2 !== '') ?
//                 (Number(r1) + Number(r2)) :
//                 (r1 !== '' ? r1 : r2);

//               filas.push({
//                 ...cabecera,
//                 'Tipo Componente': tipoLabel,
//                 'Valor Comp. (COP)': valorComp,
//                 'Municipio Detalle': `${nomMun}${deptoMun}`,
//                 'Rate 1 (COP)': r1,
//                 'Rate 2 (COP)': r2,
//                 'Total Det. (COP)': total,
//               });
//             }
//           } else {
//             // Una fila por componente sin detalle por municipio
//             filas.push({
//               ...cabecera,
//               'Tipo Componente': tipoLabel,
//               'Valor Comp. (COP)': valorComp,
//               'Municipio Detalle': TIPOS_CON_DETALLE.has(comp.tipo) ?
//                 '(sin detalles por municipio)' :
//                 '',
//               'Rate 1 (COP)': '',
//               'Rate 2 (COP)': '',
//               'Total Det. (COP)': '',
//             });
//           }
//         }
//       }

//       return filas;
//     }
//     /* ──────────────────────────────────────────────────────
//      | HELPERS: FORMATOS Y BADGES
//      ────────────────────────────────────────────────────── */

//     /** Formatea número como moneda COP */
//     function formatCOP(valor) {
//       if (valor == null || isNaN(valor)) return '—';
//       return new Intl.NumberFormat('es-CO', {
//         style: 'currency',
//         currency: 'COP',
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       }).format(valor);
//     }

//     /** Retorna nombre del mes dado su número (1-12) */
//     function nombreMes(num) {
//       const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
//         'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
//       ];
//       return meses[num] ?? num;
//     }

//     /** Genera badge HTML para estado de tarifa */
//     function badgeEstado(estado) {
//       if (!estado) return '<span class="badge-status bs-inactive">—</span>';
//       const map = {
//         'Activa': 'bs-active',
//         'Inactiva': 'bs-inactive',
//       };
//       const cls = map[estado] ?? 'bs-inactive';
//       return `<span class="badge-status ${cls}">${escHtml(estado)}</span>`;
//     }

//     /** Genera badge HTML para estado de aprobación */
//     function badgeAprobacion(estado) {
//       if (!estado) return '<span class="badge-status bs-inactive">—</span>';
//       const map = {
//         'Aprobado': 'bs-approved',
//         'Pendiente Aprobacion': 'bs-pending',
//         'Rechazado': 'bs-rejected',
//       };
//       const cls = map[estado] ?? 'bs-inactive';
//       return `<span class="badge-status ${cls}">${escHtml(estado)}</span>`;
//     }

//     /** Genera badge HTML para estado de vigencia */
//     function badgeVigencia(estado) {
//       if (!estado) return '<span class="badge-status bs-inactive">—</span>';
//       const map = {
//         'Vigente': 'bs-active',
//         'Por Vencer': 'bs-pending',
//         'Vencida': 'bs-expired',
//       };
//       const cls = map[estado] ?? 'bs-inactive';
//       return `<span class="badge-status ${cls}">${escHtml(estado)}</span>`;
//     }

//     /** Escapa caracteres HTML para prevenir XSS */
//     function escHtml(str) {
//       if (str == null) return '';
//       return String(str)
//         .replace(/&/g, '&amp;')
//         .replace(/</g, '&lt;')
//         .replace(/>/g, '&gt;')
//         .replace(/"/g, '&quot;')
//         .replace(/'/g, '&#39;');
//     }

//     /** Escapa para usar en atributos HTML */
//     function escAttr(str) {
//       return escHtml(str);
//     }

//     function obtenerTipoVehiculo(value) {
//       switch (value) {
//         case "NHR_2":
//           return "NHR — Sencillo >2500 Kg";
//         case "2":
//           return "Camión dos ejes - Sencillo PBV mas de 10500 Kg";
//         case "2_7_8":
//           return "Camion dos ejes - Sencillo PBV 7500-8000 Kg";
//         case "2_8_9":
//           return "Camion dos ejes - Sencillo PBV 8001-9000 Kg";
//         case "2_9_105":
//           return "Camion dos ejes - Sencillo PBV 9001-10500 Kg";
//         case "2S2":
//           return "Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes";
//         case "2S3":
//           return "Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes";
//         case "3":
//           return "Camión tres ejes - Dobletroque";
//         case "3S2":
//           return "Tractocamión tres ejes - Tractomula con semiremolque de dos ejes";
//         case "3S3":
//           return "Tractocamión tres ejes - Tractomula con semiremolque de tres ejes";
//         case "V2":
//           return "Volqueta dos ejes - Sencillo";
//         case "V3":
//           return "Volqueta tres ejes - Dobletroque";
//         case "V4":
//           return "Volqueta cuatro ejes - Cuatromanos";
//         default:
//           return "No especificado";
//       }
//     }

//     /* ──────────────────────────────────────────────────────
//      | INICIALIZACIÓN DEL MÓDULO
//      ────────────────────────────────────────────────────── */

//     /**
//      * Inicializa el módulo:
//      * 1. Carga selectores.
//      * 2. Establece el tipo inicial (ventas).
//      * 3. Renderiza chips vacíos.
//      */
//     async function init() {
//       // Cargar los selectores de forma paralela para mayor velocidad
//       await Promise.allSettled([
//         cargarMunicipios(),
//         cargarClientes(),
//         // cargarVehiculos(),
//         cargarZonas(),
//       ]);

//       cargarAniosVigencia();

//       // Establecer estado inicial UI
//       setTipo('ventas');
//       renderChips();

//       // Habilitar botón de consultar (puede haber sido deshabilitado durante carga)
//       document.getElementById('btn-consultar').disabled = false;
//     }

//     // Arrancar cuando el DOM esté listo
//     if (document.readyState === 'loading') {
//       document.addEventListener('DOMContentLoaded', init);
//     } else {
//       init();
//     }

//     /* ── API PÚBLICA DEL MÓDULO ── */
//     return {
//       setTipo,
//       setFiltro,
//       removerFiltro,
//       limpiarFiltros,
//       consultar,
//       exportarExcel,
//       toggleAdvanced,
//       filtrarTablaLocal,
//     };

//   })();

//   window.ExportarTarifas = ExportarTarifas;
// })();


/**
 * ============================================================
 * MÓDULO: ExportarTarifas
 * ============================================================
 * Maneja toda la lógica de la ventana de exportación de tarifas.
 *
 * RESPONSABILIDADES:
 *  1. Cargar selectores (clientes, vehículos, municipios, zonas)
 *  2. Gestionar filtros y chips visuales
 *  3. Consultar API según tipo (ventas / costos)
 *  4. Renderizar tabla de resultados
 *  5. Exportar a Excel via API del servidor
 * ============================================================
 */
/**
 * ============================================================
 * MÓDULO: ExportarTarifas
 * ============================================================
 * Maneja toda la lógica de la ventana de exportación de tarifas.
 *
 * RESPONSABILIDADES:
 *  1. Cargar selectores (clientes, vehículos, municipios, zonas)
 *  2. Gestionar filtros y chips visuales
 *  3. Consultar API según tipo (ventas / costos)
 *  4. Renderizar tabla de resultados
 *  5. Exportar a Excel via API del servidor
 * ============================================================
 */

/**
 * ============================================================
 * MÓDULO: ExportarTarifas
 * ============================================================
 * Maneja toda la lógica de la ventana de exportación de tarifas.
 *
 * RESPONSABILIDADES:
 *  1. Cargar selectores (clientes, vehículos, municipios, zonas)
 *  2. Gestionar filtros y chips visuales
 *  3. Consultar API según tipo (ventas / costos)
 *  4. Renderizar tabla de resultados
 *  5. Exportar a Excel via API del servidor
 * ============================================================
 */
(function () {
  'use strict';

  const ExportarTarifas = (() => {

    /* ──────────────────────────────────────────────────────
     | ESTADO INTERNO DEL MÓDULO
     ────────────────────────────────────────────────────── */
    const state = {
      tipo: 'ventas', // 'ventas' | 'costos'
      filtros: {}, // Filtros activos { clave: valor }
      datos: [], // Datos cargados actualmente
      cargando: false, // Flag de petición en curso
    };


    /* ──────────────────────────────────────────────────────
     | CONFIGURACIÓN DE RUTAS API
     |
     | Base: /api/nexos  (prefijo definido en api.php → parametros.php)
     |
     | VENTAS  → ParametroController        (parametros.php)
     | COSTOS  → TarifaCostoController      (parametros.php)
     | ZONAS   → ZonaDespachoController     (parametros.php)
     | EXPORT  → GeneradorTarifaCostoController (POST exportar)
     ────────────────────────────────────────────────────── */
    const BASE = document.getElementById('base_url_api').value;

    const API = {
      // ── Tarifas de Ventas ──────────────────────────────────────
      // GET  /api/nexos/tarifas                → ParametroController@index
      ventas: `${BASE}tarifas`,

      // ── Tarifas de Costos ─────────────────────────────────────
      // GET  /api/nexos/tarifas-costos         → TarifaCostoController@index
      costos: `${BASE}tarifas-costos`,

      // ── Exportar Ventas ───────────────────────────────────────
      // No existe ruta GET de exportar en ventas en parametros.php,
      // se usa el mismo endpoint index con ?exportar=1 y se maneja
      // en el frontend via SheetJS (descarga desde JSON).
      exportVentas: `${BASE}tarifas`,

      // ── Exportar Costos ───────────────────────────────────────
      // POST /api/nexos/tarifas-costos/exportar → GeneradorTarifaCostoController@exportarExcel
      exportCostos: `${BASE}tarifas-costos/exportar`,

      // ── Municipios (Origen / Destino) ─────────────────────────
      // GET  /api/nexos/tarifas/listar-municipios → ParametroController@listarMunicipios
      municipios: `${BASE}tarifas/listar-municipios`,

      // ── Clientes ──────────────────────────────────────────────
      // Ruta filtros de clientes disponible en rutas prioritarias.
      // GET  /api/nexos/rutas-prioritarias/filtros/clientes
      clientes: `${BASE}rutas-prioritarias/filtros/clientes`,

      // ── Tipos de Vehículo ─────────────────────────────────────
      // No hay endpoint dedicado en parametros.php; se obtienen
      // en línea extrayendo valores únicos del listado de tarifas.
      vehiculos: null,

      // ── Zonas de Despacho ─────────────────────────────────────
      // GET  /api/nexos/zonas-despacho/         → ZonaDespachoController@index
      zonas: `${BASE}zonas-despacho/`,

      // ── Causales de aprobación (costos) ──────────────────────
      // GET  /api/nexos/tarifas-costos/listar-causales
      causalesCostos: `${BASE}tarifas-costos/listar-causales`,

      // ── Causales de aprobación (ventas) ───────────────────────
      // GET  /api/nexos/tarifas/listar-causales
      causalesVentas: `${BASE}tarifas/listar-causales`,
    };

    /* ──────────────────────────────────────────────────────
     | ETIQUETAS LEGIBLES PARA CHIPS DE FILTRO
     ────────────────────────────────────────────────────── */
    const ETIQUETAS_FILTRO = {
      cliente_id: 'Cliente',
      tipo_vehiculo: 'Vehículo',
      origen: 'Origen',
      destino: 'Destino',
      estado_tarifa: 'Estado',
      zona_id: 'Zona',
      estado_aprobacion: 'Aprobación',
      estado_vigencia: 'Vigencia',
      vigencia: 'Año Vigencia',
      fecha_desde: 'Fecha Desde',
      fecha_hasta: 'Fecha Hasta',
      semana_desde: 'Semana Desde',
      semana_hasta: 'Semana Hasta',
      mes_desde: 'Mes Desde',
      mes_hasta: 'Mes Hasta',
    };

    /* ──────────────────────────────────────────────────────
     | UTILIDADES: petición autenticada con CSRF de Laravel
     ────────────────────────────────────────────────────── */
    function getCsrfToken() {
      return document.querySelector('meta[name="csrf-token"]')?.content ?? '';
    }

    /**
     * Realiza una petición GET a la API.
     * @param {string} url    - Endpoint completo.
     * @param {Object} params - Parámetros query-string.
     * @returns {Promise<Object>} Respuesta JSON del servidor.
     */
    // async function apiGet(url, params = {}) {
    //   // console.log("🚀 ~ apiGet ~ params:", params)
    //   // Construir query string omitiendo valores vacíos
    //   const qs = new URLSearchParams(
    //     Object.fromEntries(
    //       Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
    //     )
    //   ).toString();

    //   const fullUrl = qs ? `${url}?${qs}` : url;

    //   const resp = await fetch(fullUrl, {
    //     method: 'GET',
    //     headers: {
    //       'Accept': 'application/json',
    //       "X-API-KEY": "nexos_nacional2026@*",
    //       'X-Requested-With': 'XMLHttpRequest',
    //     },
    //     // data: { empresa_id: Number(document.getElementById("empresa_id")?.value || 1) },
    //   });

    //   if (!resp.ok) {
    //     const err = await resp.json().catch(() => ({}));
    //     throw new Error(err.message ?? `Error ${resp.status}`);
    //   }

    //   return resp.json();
    // }

    // async function apiGet(url, params = {}) {
    //   // Asegurar que empresa_id siempre vaya si existe en el DOM
    //   const idEmpresa = document.getElementById('empresa_id')?.value;
    //   if (idEmpresa && !params.empresa_id) {
    //     params.empresa_id = idEmpresa;
    //   }

    //   // Limpiar parámetros: eliminar nulos, undefined o vacíos
    //   const cleanedParams = Object.fromEntries(
    //     Object.entries(params).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
    //   );

    //   const qs = new URLSearchParams(cleanedParams).toString();
    //   const fullUrl = qs ? `${url}?${qs}` : url;

    //   // LOG para ver qué URL se está disparando exactamente en la consola
    //   console.log("🔗 Petición a:", fullUrl);

    //   const resp = await fetch(fullUrl, {
    //     method: 'GET',
    //     headers: {
    //       'Accept': 'application/json',
    //       "X-API-KEY": "nexos_nacional2026@*",
    //       'X-Requested-With': 'XMLHttpRequest',
    //     },
    //   });

    //   if (!resp.ok) {
    //     const err = await resp.json().catch(() => ({}));
    //     throw new Error(err.message ?? `Error ${resp.status}`);
    //   }

    //   return resp.json();
    // }


    async function apiGet(url, params = {}) {
      // 1. Copiar params para NO mutar state.filtros ni ningún objeto externo
      const safeParams = { ...params };

      // 2. Inyectar empresa_id en tiempo de llamada (lectura fresca del DOM)
      const idEmpresa = document.getElementById('empresa_id')?.value;
      if (idEmpresa) safeParams.empresa_id = idEmpresa;

      // 3. Limpiar parámetros: no enviar vacíos, nulos ni undefined
      const cleanedParams = Object.fromEntries(
        Object.entries(safeParams).filter(([_, v]) => v !== '' && v !== null && v !== undefined)
      );

      // 4. Construir Query String
      const qs = new URLSearchParams(cleanedParams).toString();
      const fullUrl = qs ? `${url}?${qs}` : url;

      const resp = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          "X-API-KEY": "nexos_nacional2026@*", // Tu llave de seguridad
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `Error ${resp.status}`);
      }

      return resp.json();
    }

    /* ──────────────────────────────────────────────────────
     | CARGA INICIAL DE SELECTORES
     ────────────────────────────────────────────────────── */

    /**
     * Carga los municipios disponibles en los selectores de origen y destino.
     */
    async function cargarMunicipios() {
      try {
        const res = await apiGet(API.municipios);
        const municipios = res.data ?? [];

        const opts = municipios
          .map(m => `<option value="${escHtml(m.rndc_codigo_ciudad ?? m.municipio)}">${escHtml(m.municipio)} - ${escHtml(m.depto)}</option>`)
          .join('');

        document.getElementById('sel-origen-exportar').innerHTML = '<option value="">— Todos los orígenes —</option>' + opts;
        document.getElementById('sel-destino-exportar').innerHTML = '<option value="">— Todos los destinos —</option>' + opts;
      } catch (e) {
        console.warn('[ExportarTarifas] No se pudieron cargar municipios:', e.message);
      }
    }

    /**
     * Carga los clientes para el filtro (solo visible en modo Ventas).
     *
     * RUTA: GET /api/nexos/rutas-prioritarias/filtros/clientes
     *   → RutasPrioritariasController@filtrosClientes
     *
     * Respuesta esperada: { success: true, data: [{ id, nombre }, ...] }
     *
     * El parámetro empresa_id es requerido por el controlador.
     * Se lee desde la variable global `empresaId` si está definida en el layout,
     * o se omite para que el backend use la empresa del usuario autenticado.
     */
    async function cargarClientes() {
      try {
        // empresa_id viene del contexto global del layout si existe
        const params = {};
        if (typeof empresaId !== 'undefined' && empresaId) {
          params.empresa_id = empresaId;
        }

        const res = await apiGet(API.clientes, params);
        const clientes = res.data ?? [];

        const opts = clientes
          .map(c => `<option value="${escHtml(c.id)}">${escHtml(c.nombre ?? c.razon_social)}</option>`)
          .join('');

        document.getElementById('sel-cliente').innerHTML = opts;

        // document.getElementById('sel-cliente').innerHTML =
        //   '<option value="">— Todos los clientes —</option>' + opts;

        new TomSelect('#sel-cliente', {
          create: false, // Usualmente para tipos de vehículos no quieres que el usuario invente nuevos
          placeholder: "Seleccione un cliente...",
          allowEmptyOption: true,
          sortField: {
            field: "text",
            direction: "asc",
          },
          onInitialize: function () {
            // Aplicar clases de Bootstrap para mantener el diseño uniforme
            this.control.classList.add("f-control");
          },
        });
      } catch (e) {
        console.warn('[ExportarTarifas] No se pudieron cargar clientes:', e.message);
      }
    }

    /**
     * Carga los tipos de vehículo para el filtro de configuración.
     *
     * No existe endpoint dedicado en parametros.php para tipos de vehículo.
     * Se extraen los valores únicos de tipo_vehiculo consultando ambos listados
     * (ventas y costos con límite pequeño) y mergeando los distintos valores.
     */
    async function cargarVehiculos() {
      try {
        const [resVentas, resCostos] = await Promise.allSettled([
          apiGet(API.ventas, {
            limit: 200,
            sort_by: 'tipo_vehiculo'
          }),
          apiGet(API.costos, {
            limit: 200,
            sort_by: 'tipo_vehiculo'
          }),
        ]);

        const dataV = resVentas.status === 'fulfilled' ? (resVentas.value.data ?? []) : [];
        const dataC = resCostos.status === 'fulfilled' ? (resCostos.value.data ?? []) : [];

        // Extraer valores únicos de tipo_vehiculo de ambas fuentes
        const tiposSet = new Set(
          [...dataV, ...dataC]
            .map(t => t.tipo_vehiculo)
            .filter(Boolean)
        );
        const tipos = [...tiposSet].sort();
        if (!tipos.length) return;

        const opts = tipos
          .map(v => `<option value="${escHtml(v)}">${escHtml(v)}</option>`)
          .join('');

        document.getElementById('sel-vehiculo').innerHTML =
          '<option value="">— Todos los vehículos —</option>' + opts;
      } catch (e) {
        console.warn('[ExportarTarifas] No se pudieron cargar vehículos:', e.message);
      }
    }

    /**
     * Carga las zonas de despacho para el filtro de zona.
     *
     * RUTA: GET /api/nexos/zonas-despacho/  → ZonaDespachoController@index
     * El campo de nombre en la respuesta es `nombre_zona` (no `nombre`).
     * Se filtra solo las que tienen activo = 1.
     */
    async function cargarZonas() {
      try {
        const empresaId = Number(document.getElementById('empresa_id')?.value || 0);
        const params = {};
        if (empresaId) params.empresa_id = empresaId;

        const res = await apiGet(API.zonas, params);
        // const zonas = (res.data ?? []).filter(z => z.activo == 1 || z.activo === true);
        const zonas = (res.data ?? []).filter(z => z.activo == 1 || z.activo === true || z.activo === "Activo");
        const opts = zonas.map(z => `<option value="${escHtml(z.id)}">${escHtml(z.nombre_zona ?? z.nombre)}</option>`).join('');

        document.getElementById('sel-zona').innerHTML = '<option value="">— Todas las zonas —</option>' + opts;
      } catch (e) {
        console.warn('[ExportarTarifas] No se pudieron cargar zonas:', e.message);
      }
    }

    /**
     * Rellena el selector de año de vigencia con los últimos 5 años y el siguiente.
     */
    function cargarAniosVigencia() {
      const anioActual = new Date().getFullYear();
      let opts = '';
      for (let a = anioActual + 1; a >= anioActual - 4; a--) {
        opts += `<option value="${a}">${a}</option>`;
      }
      document.getElementById('inp-vigencia-anio').innerHTML =
        '<option value="">— Todos los años —</option>' + opts;
    }

    /* ──────────────────────────────────────────────────────
     | GESTIÓN DEL TIPO DE TARIFA (VENTAS / COSTOS)
     ────────────────────────────────────────────────────── */

    /**
     * Cambia el tipo de tarifa activo y ajusta la UI acorde.
     * - Ventas: muestra filtro de cliente.
     * - Costos: oculta filtro de cliente (no aplica para fletes nacionales).
     * @param {'ventas'|'costos'} tipo
     */
    function setTipo(tipo) {
      state.tipo = tipo;

      // Actualizar estilos de botones toggle
      const btnVentas = document.getElementById('btn-tipo-ventas');
      const btnCostos = document.getElementById('btn-tipo-costos');
      btnVentas.className = 'tipo-btn' + (tipo === 'ventas' ? ' active-ventas' : '');
      btnCostos.className = 'tipo-btn' + (tipo === 'costos' ? ' active-costos' : '');

      // Actualizar badge del header
      const badge = document.getElementById('badge-tipo-activo');
      const labelBadge = document.getElementById('label-tipo-activo');
      badge.className = `tipo-indicator ${tipo}`;
      labelBadge.textContent = tipo === 'ventas' ? 'Ventas' : 'Costos';

      // Mostrar/ocultar filtro de cliente
      const filtroCliente = document.getElementById('filtro-cliente-wrap');
      if (tipo === 'ventas') {
        filtroCliente.style.display = '';
      } else {
        filtroCliente.style.display = 'none';
        // Si había cliente seleccionado, limpiarlo
        document.getElementById('sel-cliente').value = '';
        delete state.filtros.cliente_id;
      }

      // Limpiar tabla al cambiar tipo para evitar datos cruzados
      limpiarTabla();
      renderChips();
    }

    /* ──────────────────────────────────────────────────────
     | GESTIÓN DE FILTROS
     ────────────────────────────────────────────────────── */

    /**
     * Actualiza un filtro en el estado interno.
     * @param {string} clave  - Nombre del parámetro API.
     * @param {string} valor  - Valor seleccionado (vacío = sin filtro).
     */
    function setFiltro(clave, valor) {
      if (valor === '' || valor === null) {
        delete state.filtros[clave];
      } else {
        state.filtros[clave] = valor;
      }
      renderChips();
    }

    /**
     * Elimina todos los filtros aplicados y resetea los controles del formulario.
     */
    function limpiarFiltros() {
      state.filtros = {};

      // Resetear todos los controles de filtro
      ['sel-cliente', 'sel-vehiculo', 'sel-origen-exportar', 'sel-destino-exportar',
        'sel-estado', 'sel-zona', 'sel-aprobacion', 'sel-vigencia',
        'inp-vigencia-anio', 'inp-fecha-desde', 'inp-fecha-hasta',
        'inp-semana-desde', 'inp-semana-hasta', 'inp-mes-desde', 'inp-mes-hasta'
      ]
        .forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });

      renderChips();
      limpiarTabla();
    }

    /**
     * Renderiza los chips de filtros activos en la UI.
     * Cada chip permite eliminar el filtro de forma individual.
     */
    function renderChips() {
      const contenedor = document.getElementById('chips-filtros-activos');
      const esCostos = state.tipo === 'costos';

      let html = '';

      // Chip del tipo seleccionado (siempre visible)
      html += `<span class="filter-chip ${esCostos ? 'chip-costos' : ''}">
                    <i class="ti ti-${esCostos ? 'trending-down' : 'trending-up'} me-1"></i>
                    ${esCostos ? 'Costos' : 'Ventas'}
                 </span>`;

      // Chips de filtros activos
      Object.entries(state.filtros).forEach(([clave, valor]) => {
        const label = ETIQUETAS_FILTRO[clave] ?? clave;
        html += `<span class="filter-chip ${esCostos ? 'chip-costos' : ''}">
                        ${escHtml(label)}: <strong>${escHtml(String(valor))}</strong>
                        <button type="button" onclick="ExportarTarifas.removerFiltro('${clave}')"
                                title="Quitar filtro">
                            <i class="ti ti-x"></i>
                        </button>
                     </span>`;
      });

      contenedor.innerHTML = html;
    }

    /**
     * Quita un filtro individual desde el chip correspondiente.
     * @param {string} clave - Clave del filtro a remover.
     */
    function removerFiltro(clave) {
      delete state.filtros[clave];

      // Resetear el control correspondiente
      const mapaControl = {
        cliente_id: 'sel-cliente',
        tipo_vehiculo: 'sel-vehiculo',
        origen: 'sel-origen-exportar',
        destino: 'sel-destino-exportar',
        estado_tarifa: 'sel-estado',
        zona_id: 'sel-zona',
        estado_aprobacion: 'sel-aprobacion',
        estado_vigencia: 'sel-vigencia',
        vigencia: 'inp-vigencia-anio',
        fecha_desde: 'inp-fecha-desde',
        fecha_hasta: 'inp-fecha-hasta',
        semana_desde: 'inp-semana-desde',
        semana_hasta: 'inp-semana-hasta',
        mes_desde: 'inp-mes-desde',
        mes_hasta: 'inp-mes-hasta',
      };
      const idControl = mapaControl[clave];
      if (idControl) {
        const el = document.getElementById(idControl);
        if (el) el.value = '';
      }

      renderChips();
    }

    /* ──────────────────────────────────────────────────────
     | TOGGLE DE FILTROS AVANZADOS
     ────────────────────────────────────────────────────── */

    /**
     * Despliega o colapsa la sección de filtros avanzados.
     */
    function toggleAdvanced() {
      const panel = document.getElementById('advanced-filters-panel');
      const btn = document.getElementById('btn-toggle-advanced');
      const abierto = panel.classList.toggle('show');
      btn.classList.toggle('open', abierto);
      btn.querySelector('.ti-icon').className =
        `ti ${abierto ? 'ti-chevron-up' : 'ti-chevron-down'} ti-icon`;
      btn.childNodes[1].nodeValue = ` ${abierto ? 'Ocultar filtros' : 'Mostrar más filtros'}`;
    }

    /* ──────────────────────────────────────────────────────
     | CONSULTA A LA API
     ────────────────────────────────────────────────────── */

    /**
     * Ejecuta la consulta al servidor con los filtros activos.
     * Determina el endpoint según el tipo (ventas/costos).
     */
    // async function consultar() {
    //   if (state.cargando) return;

    //   state.cargando = true;
    //   mostrarCargando();

    //   const endpoint = state.tipo === 'ventas' ? API.ventas : API.costos;

    //   try {
    //     const res = await apiGet(endpoint, state.filtros);
    //     // console.log("🚀 ~ consultar ~ res:", res)

    //     state.datos = res.data ?? [];
    //     renderTabla(state.datos);

    //     // Actualizar badge de conteo
    //     const badge = document.getElementById('badge-count');
    //     badge.textContent = `${state.datos.length} reg.`;
    //     badge.style.display = 'inline-flex';

    //     // Actualizar paginación
    //     const pagBar = document.getElementById('pagination-bar');
    //     const pagInfo = document.getElementById('pag-info-text');
    //     pagBar.style.display = '';
    //     pagInfo.innerHTML = `Mostrando <strong>${state.datos.length}</strong> registros encontrados`;

    //     // Habilitar botón de exportar solo si hay datos
    //     document.getElementById('btn-exportar').disabled = state.datos.length === 0;

    //   } catch (e) {
    //     mostrarError(e.message);
    //   } finally {
    //     state.cargando = false;
    //   }
    // }

    async function consultar() {
      if (state.cargando) return;

      try {
        state.cargando = true;

        // UI: Mostrar spinner o estado de carga en el botón
        const btn = document.getElementById('btn-consultar');
        if (btn) btn.innerHTML = '<i class="ti ti-loader-2 rotate"></i> Consultando...';

        // Endpoint según el tipo seleccionado (Ventas o Costos)
        const endpoint = state.tipo === 'ventas' ? API.ventas : API.costos;

        // Realizar la petición con los filtros actuales
        const response = await apiGet(endpoint, state.filtros);
        console.log("🚀 ~ consultar ~ state.filtros:", state.filtros)

        if (response.success) {
          state.data = response.data;
          renderTabla(response.data);
          // actualizarResumenPaginacion(response.count);
        } else {
          throw new Error(response.message || 'Error desconocido');
        }

      } catch (error) {
        console.error("❌ Error en consulta:", error);
        alert("No se pudo cargar la información: " + error.message);
      } finally {
        state.cargando = false;
        const btn = document.getElementById('btn-consultar');
        if (btn) btn.innerHTML = '<i class="ti ti-search"></i> Consultar';
      }
    }

    /* ──────────────────────────────────────────────────────
     | RENDERIZADO DE TABLA
     ────────────────────────────────────────────────────── */

    /**
     * Renderiza las filas de la tabla con los datos recibidos del servidor.
     * Columnas: Origen, Destino, Tipo Vehículo, Región/Zona,
     *           Última Tarifa, SICE-TAC, Mercado, Semana, Mes, Año, Estado, Aprobación, Vigencia.
     * @param {Array} datos - Arreglo de objetos tarifa.
     */
    function renderTabla(datos) {
      const tbody = document.getElementById('tbody-tarifas');
      const tableId = document.getElementById('tabla-tarifas');

      if (!datos.length) {
        tbody.innerHTML = `
                <tr>
                    <td colspan="14">
                        <div class="empty-state">
                            <div class="es-icon"><i class="ti ti-database-off"></i></div>
                            <div class="es-title">Sin resultados</div>
                            <div class="es-sub">No se encontraron tarifas con los filtros aplicados.</div>
                        </div>
                    </td>
                </tr>`;
        return;
      }

      tbody.innerHTML = '';
      tbody.innerHTML = datos.map((t, idx) => {

        const formatFecha = (fechaStr) =>
          fechaStr ? fechaStr.split("T")[0] : "";

        // ── Extraer campos comunes (ventas y costos comparten estructura) ──
        const origen = t.municipio_origen?.municipio ?? t.origen ?? '—';
        const destino = t.municipio_destino?.municipio ?? t.destino ?? '—';
        const tipoVeh = t.tipo_vehiculo ?? '—';

        // const region = t.zona?.nombre_zona ?? t.region ?? t.municipio_origen?.depto ?? '—';
        const region = t.municipio_origen?.zona_municipio?.[0]?.zona?.nombre_zona
          ?? t.municipio_destino?.zona_municipio?.[0]?.zona?.nombre_zona
          // ?? t.municipio_origen?.depto
          ?? '—'
          ?? '—';

        // Última tarifa: suma de componentes activos (valor_total o flete base)
        const ultimaTarifa = obtenerUltimaTarifa(t);

        // Tarifa SICE-TAC: campo directo del modelo
        const sicetac = t.tarifa_sicetac != null ?
          formatCOP(t.tarifa_sicetac) :
          '—';

        // Tarifa de Mercado: calculada o referencial (si existe)
        const mercado = t.tarifa_mercado != null ?
          formatCOP(t.tarifa_mercado) :
          '—';

        const semana = t.semana ?? '—';
        const mes = t.mes != null ? nombreMes(t.mes) : '—';
        const anio = state.tipo === 'ventas' ? formatFecha(t.fecha_inicio) + '-' + formatFecha(t.fecha_fin) : t.vigencia;

        // Estado de la tarifa (Activa / Inactiva)
        const estadoBadge = badgeEstado(t.estado ?? t.estado_tarifa);

        // Estado de aprobación (Aprobado / Pendiente / Rechazado)
        const aprBadge = badgeAprobacion(t.estado_aprobacion);

        // Estado de vigencia (Vigente / Por Vencer / Vencida)
        const vigBadge = badgeVigencia(t.estado_vigencia);

        return `
            <tr data-search="${escAttr([origen, destino, tipoVeh, region].join(' ').toLowerCase())}">
                <td class="td-muted">${idx + 1}</td>
                <td><strong>${escHtml(origen)}</strong></td>
                <td>${escHtml(destino)}</td>
                <td>${escHtml(obtenerTipoVehiculo(tipoVeh))}</td>
                <td class="td-muted">${escHtml(region)}</td>
                <td class="td-mono">${ultimaTarifa}</td>
                <td class="td-mono">${sicetac}</td>
                <td class="td-mono">${mercado}</td>
                <td class="td-muted" style="text-align:center;">${semana}</td>
                <td class="td-muted">${mes}</td>
                <td class="td-muted" style="text-align:center;">${anio}</td>
                <td>${estadoBadge}</td>
                <td>${aprBadge}</td>
                <td>${vigBadge}</td>
            </tr>`;
      }).join('');

      // --- PASO C: Inicializar DataTables con Filtros Tipo Excel ---
      // setTimeout(() => {
      //   inicializarDataTable(tableId);
      // }, 100);
    }

    /**
     * Determina la última tarifa actualizada de un registro.
     * Busca en componentes activos o en el campo valor_total.
     * @param {Object} t - Objeto tarifa.
     * @returns {string} Tarifa formateada en COP o '—'.
     */
    function obtenerUltimaTarifa(t) {
      // Intentar obtener valor_total del modelo
      // if (t.valor_total != null && t.valor_total > 0) {
      //   return formatCOP(t.valor_total);
      // }
      if (t.tarifa != null && t.tarifa > 0) {
        return formatCOP(t.tarifa);
      }

      // Calcular desde componentes activos (suma de valores)
      if (Array.isArray(t.componentes) && t.componentes.length) {
        const suma = t.componentes.reduce((acc, c) => acc + parseFloat(c.valor ?? 0), 0);
        if (suma > 0) return formatCOP(suma);
      }

      return '—';
    }

    /**
     * Muestra overlay de carga en la tabla mientras se espera respuesta.
     */
    function mostrarCargando() {
      document.getElementById('tbody-tarifas').innerHTML = `
            <tr class="loading-row">
                <td colspan="14">
                    <span class="spinner-sm"></span>
                    Consultando tarifas de ${state.tipo}…
                </td>
            </tr>`;
      document.getElementById('badge-count').style.display = 'none';
      // document.getElementById('btn-exportar').disabled = true;
      // document.getElementById('btn-consultar').disabled = true;
      document.getElementById('pagination-bar').style.display = 'none';
    }

    /**
     * Muestra mensaje de error en la tabla cuando la petición falla.
     * @param {string} msg - Mensaje de error.
     */
    function mostrarError(msg) {
      document.getElementById('tbody-tarifas').innerHTML = `
            <tr>
                <td colspan="14">
                    <div class="empty-state">
                        <div class="es-icon" style="color:var(--red);"><i class="ti ti-alert-triangle"></i></div>
                        <div class="es-title" style="color:var(--red);">Error al consultar</div>
                        <div class="es-sub">${escHtml(msg)}</div>
                    </div>
                </td>
            </tr>`;
      document.getElementById('btn-consultar').disabled = false;
    }

    /**
     * Limpia la tabla y vuelve al estado inicial.
     */
    function limpiarTabla() {
      state.datos = [];
      document.getElementById('tbody-tarifas').innerHTML = `
            <tr>
                <td colspan="14">
                    <div class="empty-state">
                        <div class="es-icon"><i class="ti ti-file-search"></i></div>
                        <div class="es-title">Sin datos cargados</div>
                        <div class="es-sub">Aplica los filtros deseados y presiona <strong>Consultar</strong>.</div>
                    </div>
                </td>
            </tr>`;
      document.getElementById('badge-count').style.display = 'none';
      // document.getElementById('btn-exportar').disabled = true;
      document.getElementById('pagination-bar').style.display = 'none';
    }

    /* ──────────────────────────────────────────────────────
     | BÚSQUEDA LOCAL EN TABLA (sin ir al servidor)
     ────────────────────────────────────────────────────── */

    /**
     * Filtra visualmente las filas de la tabla con la cadena de búsqueda.
     * No realiza nueva petición al servidor.
     * @param {string} texto - Texto ingresado en el buscador de tabla.
     */
    function filtrarTablaLocal(texto) {
      const filas = document.querySelectorAll('#tbody-tarifas tr[data-search]');
      const term = texto.toLowerCase().trim();
      let visibles = 0;

      filas.forEach(tr => {
        const coincide = !term || tr.dataset.search.includes(term);
        tr.style.display = coincide ? '' : 'none';
        if (coincide) visibles++;
      });

      // Actualizar conteo en paginación
      const pagInfo = document.getElementById('pag-info-text');
      if (term) {
        pagInfo.innerHTML = `Mostrando <strong>${visibles}</strong> de <strong>${state.datos.length}</strong> registros`;
      } else {
        pagInfo.innerHTML = `Mostrando <strong>${state.datos.length}</strong> registros encontrados`;
      }
    }

    /* ──────────────────────────────────────────────────────
     | EXPORTAR A EXCEL — DETALLE COMPLETO DE COMPONENTES
     |
     | El Excel NO exporta lo que se ve en la tabla de vista previa.
     | Hace una nueva consulta al servidor con los mismos filtros activos
     | para obtener la estructura COMPLETA de cada tarifa:
     |
     |   Tarifa (cabecera)
     |   └─ Componentes: PLENA, MULTI_RECOGIDA, MULTI_ENTREGA, MULTI_ORIGEN, MULTI_DESTINO
     |       └─ Detalles por municipio (rate_1, rate_2) ← solo en MULTI_ORIGEN / MULTI_DESTINO
     |
     | ESTRATEGIA POR TIPO:
     |   ■ VENTAS → GET /api/nexos/tarifas        (ParametroController@index)
     |              Trae componentes con detalles y municipio relacionado.
     |              El Excel se genera en el cliente con SheetJS.
     |
     |   ■ COSTOS → GET /api/nexos/tarifas-costos  (TarifaCostoController@index)
     |              Trae componentes con detalles y municipio relacionado.
     |              El Excel se genera en el cliente con SheetJS.
     |
     | ESTRUCTURA DEL EXCEL (una fila por componente/detalle):
     |   Tarifa ID | Cliente | Origen | Destino | Vehículo | Región |
     |   Tarifa Sicetac | Semana | Mes | Año | Estado | Aprobación | Vigencia |
     |   Tipo Componente | Valor Componente |
     |   Municipio Detalle | Rate 1 | Rate 2 | Total Detalle
     ────────────────────────────────────────────────────── */

    /**
     * Punto de entrada del botón “Exportar Excel”.
     *
     * 1. Consulta al servidor con los filtros activos para obtener las tarifas
     *    CON todos sus componentes y detalles por municipio (estructura completa).
     * 2. Transforma esos datos en un arreglo de filas planas (una por componente/detalle).
     * 3. Genera el archivo .xlsx en el cliente usando SheetJS y lo descarga.
     *
     * Si no hay filtros o la consulta falla, informa al usuario apropiadamente.
     */
    async function exportarExcel() {
      if (state.cargando) return;

      // Verificar disponibilidad de SheetJS
      if (typeof XLSX === 'undefined') {
        alert('La librería SheetJS (XLSX) no está disponible en el layout.\n' +
          'Consulte con el administrador para incluirla.');
        return;
      }

      const btn = document.getElementById('btn-exportar');
      const textoOriginal = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner-sm"></span> Consultando datos…';

      try {
        // ■ PASO 1: Consultar el servidor con los filtros activos
        // Usa el mismo endpoint del listado (index) que ya trae componentes y detalles.
        const endpoint = state.tipo === 'ventas' ? API.ventas : API.costos;
        const res = await apiGet(endpoint, state.filtros);
        const tarifas = res.data ?? [];

        if (!tarifas.length) {
          alert('No se encontraron tarifas con los filtros seleccionados. Ajuste los filtros e intente de nuevo.');
          return;
        }

        btn.innerHTML = '<span class="spinner-sm"></span> Generando Excel…';

        // ■ PASO 2: Aplanar la estructura jerárquica a filas del Excel
        const filas = aplanarTarifasParaExcel(tarifas, state.tipo);

        if (!filas.length) {
          alert('Los datos no tienen el detalle suficiente para generar el Excel.');
          return;
        }

        // ■ PASO 3: Generar el archivo .xlsx con SheetJS y descargarlo
        const ws = XLSX.utils.json_to_sheet(filas);

        // Definir anchos de columna para que sea legible
        ws['!cols'] = [{
          wch: 8
        }, // ID
        {
          wch: 25
        }, // Cliente
        {
          wch: 22
        }, // Origen
        {
          wch: 22
        }, // Destino
        {
          wch: 22
        }, // Tipo Vehículo
        {
          wch: 18
        }, // Región
        {
          wch: 16
        }, // Última Tarifa
        {
          wch: 16
        }, // Tarifa SICE-TAC
        {
          wch: 16
        }, // Tarifa Mercado
        {
          wch: 8
        }, // Semana
        {
          wch: 12
        }, // Mes
        {
          wch: 8
        }, // Año
        {
          wch: 12
        }, // Estado
        {
          wch: 22
        }, // Aprobación
        {
          wch: 14
        }, // Vigencia
        {
          wch: 20
        }, // Tipo Componente
        {
          wch: 16
        }, // Valor Componente
        {
          wch: 25
        }, // Municipio Detalle
        {
          wch: 14
        }, // Rate 1
        {
          wch: 14
        }, // Rate 2
        {
          wch: 16
        }, // Total Detalle
        ];

        // Aplicar estilos básicos al encabezado si SheetJS Pro no está disponible
        // (La Community Edition no soporta estilos de celda directamente)

        const wb = XLSX.utils.book_new();
        const nombreHoja = state.tipo === 'ventas' ? 'Tarifas Ventas' : 'Tarifas Costos';
        XLSX.utils.book_append_sheet(wb, ws, nombreHoja);

        // Nombre del archivo con fecha y tipo
        const fechaHoy = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const fileName = `tarifas_${state.tipo}_detalle_${fechaHoy}.xlsx`;
        XLSX.writeFile(wb, fileName);

      } catch (e) {
        alert(`Error al generar el Excel: ${e.message}`);
      } finally {
        btn.disabled = false;
        btn.innerHTML = textoOriginal;
      }
    }

    /**
     * Transforma la respuesta jerárquica del servidor en filas planas para el Excel.
     *
     * ESTRUCTURA DE ENTRADA (por tarifa):
     *   tarifa {
     *     id, origen, destino, tipo_vehiculo, tarifa, tarifa_sicetac,
     *     semana, mes, vigencia, estado_tarifa, estado_aprobacion, estado_vigencia,
     *     municipioOrigen { municipio, departamento },
     *     municipioDestino { municipio },
     *     clienteTarifa   { nombre }              ← solo ventas
     *     componentes: [
     *       {
     *         tipo,   // 'PLENA' | 'MULTI_RECOGIDA' | 'MULTI_ENTREGA' | 'MULTI_ORIGEN' | 'MULTI_DESTINO'
     *         valor,
     *         detalles: [
     *           {
     *             municipio_id, rate_1, rate_2,
     *             municipio: { municipio, departamento }
     *           }
     *         ]
     *       }
     *     ]
     *   }
     *
     * ESTRUCTURA DE SALIDA (una fila por cada componente o detalle):
     *   - Componentes SIN detalles (PLENA, MULTI_RECOGIDA, MULTI_ENTREGA):
     *       → 1 fila por componente, sin datos de municipio de detalle.
     *   - Componentes CON detalles (MULTI_ORIGEN, MULTI_DESTINO):
     *       → 1 fila por cada municipio del detalle.
     *       → Si no tiene detalles, igual genera 1 fila con el valor global.
     *
     * @param {Array}  tarifas - Array de objetos tarifa con relaciones cargadas.
     * @param {string} tipo    - 'ventas' | 'costos'
     * @returns {Array} Arreglo de objetos planos listos para XLSX.utils.json_to_sheet()
     */
    function aplanarTarifasParaExcel(tarifas, tipo) {
      const MESES = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];

      // Mapa de tipo de componente a etiqueta legible (igual que el backend)
      const TIPO_COMP_LABEL = {
        'PLENA': 'Tarifa Plena',
        'MULTI_RECOGIDA': 'Multi Recogida',
        'MULTI_ENTREGA': 'Multi Entrega',
        'MULTI_ORIGEN': 'Multi Origen',
        'MULTI_DESTINO': 'Multi Destino',
      };

      // Componentes que llevan desglose por municipio en `detalles`
      const TIPOS_CON_DETALLE = new Set(['MULTI_ORIGEN', 'MULTI_DESTINO']);

      const filas = [];

      for (const t of tarifas) {
        const region = t.municipio_origen?.zona_municipio?.[0]?.zona?.nombre_zona
          ?? t.municipio_destino?.zona_municipio?.[0]?.zona?.nombre_zona
          // ?? t.municipio_origen?.depto
          ?? '—'
          ?? '—';
        // — Datos cabecera de la tarifa (repetidos en cada fila) —
        const cabecera = {
          'ID Tarifa': t.id ?? '',
          'Cliente': tipo === 'ventas' ?
            (t.clienteTarifa?.nombre ?? t.clienteTarifa?.razon_social ?? '') :
            'N/A – Costo',
          'Origen': t.municipio_origen?.municipio ?? t.origen ?? '',
          'Destino': t.municipio_destino?.municipio ?? t.destino ?? '',
          'Tipo Vehículo': obtenerTipoVehiculo(t.tipo_vehiculo) ?? '',
          // 'Región / Zona': t.zona?.nombre ?? t.region ?? t.municipio_origen?.departamento ?? '',
          'Región / Zona': region ?? t.region ?? t.municipio_origen?.departamento ?? '',
          'Últ. Tarifa (COP)': t.tarifa != null ? Number(t.tarifa) : '',
          'SICE-TAC (COP)': t.tarifa_sicetac != null ? Number(t.tarifa_sicetac) : '',
          'Mercado (COP)': t.tarifa_mercado != null ? Number(t.tarifa_mercado) : '',
          'Semana': t.semana ?? '',
          'Mes': t.mes != null ? MESES[t.mes] : '',
          'Año Vigencia': t.vigencia ?? t.anio ?? '',
          'Estado': t.estado_tarifa ?? t.estado ?? '',
          'Aprobación': t.estado_aprobacion ?? '',
          'Estado Vigencia': t.estado_vigencia ?? '',
        };

        const componentes = Array.isArray(t.componentes) ? t.componentes : [];

        if (!componentes.length) {
          // Si no vienen componentes, igual genera una fila con la cabecera
          filas.push({
            ...cabecera,
            'Tipo Componente': '',
            'Valor Comp. (COP)': '',
            'Municipio Detalle': '',
            'Rate 1 (COP)': '',
            'Rate 2 (COP)': '',
            'Total Det. (COP)': '',
          });
          continue;
        }

        for (const comp of componentes) {
          const tipoLabel = TIPO_COMP_LABEL[comp.tipo] ?? comp.tipo ?? '';
          const valorComp = comp.valor != null ? Number(comp.valor) : '';

          const detalles = Array.isArray(comp.detalles) ? comp.detalles : [];
          const tieneDetalle = TIPOS_CON_DETALLE.has(comp.tipo) && detalles.length > 0;

          if (tieneDetalle) {
            // Una fila por cada municipio del detalle
            for (const det of detalles) {
              const nomMun = det.municipio?.municipio ?? det.municipio_id ?? '';
              const deptoMun = det.municipio?.departamento ? ` – ${det.municipio.departamento}` : '';
              const r1 = det.rate_1 != null ? Number(det.rate_1) : '';
              const r2 = det.rate_2 != null ? Number(det.rate_2) : '';
              const total = (r1 !== '' && r2 !== '') ?
                (Number(r1) + Number(r2)) :
                (r1 !== '' ? r1 : r2);

              filas.push({
                ...cabecera,
                'Tipo Componente': tipoLabel,
                'Valor Comp. (COP)': valorComp,
                'Municipio Detalle': `${nomMun}${deptoMun}`,
                'Rate 1 (COP)': r1,
                'Rate 2 (COP)': r2,
                'Total Det. (COP)': total,
              });
            }
          } else {
            // Una fila por componente sin detalle por municipio
            filas.push({
              ...cabecera,
              'Tipo Componente': tipoLabel,
              'Valor Comp. (COP)': valorComp,
              'Municipio Detalle': TIPOS_CON_DETALLE.has(comp.tipo) ?
                '(sin detalles por municipio)' :
                '',
              'Rate 1 (COP)': '',
              'Rate 2 (COP)': '',
              'Total Det. (COP)': '',
            });
          }
        }
      }

      return filas;
    }
    /* ──────────────────────────────────────────────────────
     | HELPERS: FORMATOS Y BADGES
     ────────────────────────────────────────────────────── */

    /** Formatea número como moneda COP */
    function formatCOP(valor) {
      if (valor == null || isNaN(valor)) return '—';
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(valor);
    }

    /** Retorna nombre del mes dado su número (1-12) */
    function nombreMes(num) {
      const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      return meses[num] ?? num;
    }

    /** Genera badge HTML para estado de tarifa */
    function badgeEstado(estado) {
      if (!estado) return '<span class="badge-status bs-inactive">—</span>';
      const map = {
        'Activa': 'bs-active',
        'Inactiva': 'bs-inactive',
      };
      const cls = map[estado] ?? 'bs-inactive';
      return `<span class="badge-status ${cls}">${escHtml(estado)}</span>`;
    }

    /** Genera badge HTML para estado de aprobación */
    function badgeAprobacion(estado) {
      if (!estado) return '<span class="badge-status bs-inactive">—</span>';
      const map = {
        'Aprobado': 'bs-approved',
        'Pendiente Aprobacion': 'bs-pending',
        'Rechazado': 'bs-rejected',
      };
      const cls = map[estado] ?? 'bs-inactive';
      return `<span class="badge-status ${cls}">${escHtml(estado)}</span>`;
    }

    /** Genera badge HTML para estado de vigencia */
    function badgeVigencia(estado) {
      if (!estado) return '<span class="badge-status bs-inactive">—</span>';
      const map = {
        'Vigente': 'bs-active',
        'Por Vencer': 'bs-pending',
        'Vencida': 'bs-expired',
      };
      const cls = map[estado] ?? 'bs-inactive';
      return `<span class="badge-status ${cls}">${escHtml(estado)}</span>`;
    }

    /** Escapa caracteres HTML para prevenir XSS */
    function escHtml(str) {
      if (str == null) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    /** Escapa para usar en atributos HTML */
    function escAttr(str) {
      return escHtml(str);
    }

    function obtenerTipoVehiculo(value) {
      switch (value) {
        case "NHR_2":
          return "NHR — Sencillo >2500 Kg";
        case "2":
          return "Camión dos ejes - Sencillo PBV mas de 10500 Kg";
        case "2_7_8":
          return "Camion dos ejes - Sencillo PBV 7500-8000 Kg";
        case "2_8_9":
          return "Camion dos ejes - Sencillo PBV 8001-9000 Kg";
        case "2_9_105":
          return "Camion dos ejes - Sencillo PBV 9001-10500 Kg";
        case "2S2":
          return "Tractocamión dos ejes - Patineta - Minimula con semiremolque de dos ejes";
        case "2S3":
          return "Tractocamión dos ejes - Patineta - Minimula con semiremolque de tres ejes";
        case "3":
          return "Camión tres ejes - Dobletroque";
        case "3S2":
          return "Tractocamión tres ejes - Tractomula con semiremolque de dos ejes";
        case "3S3":
          return "Tractocamión tres ejes - Tractomula con semiremolque de tres ejes";
        case "V2":
          return "Volqueta dos ejes - Sencillo";
        case "V3":
          return "Volqueta tres ejes - Dobletroque";
        case "V4":
          return "Volqueta cuatro ejes - Cuatromanos";
        default:
          return "No especificado";
      }
    }

    /* ──────────────────────────────────────────────────────
     | INICIALIZACIÓN DEL MÓDULO
     ────────────────────────────────────────────────────── */

    /**
     * Inicializa el módulo:
     * 1. Carga selectores.
     * 2. Establece el tipo inicial (ventas).
     * 3. Renderiza chips vacíos.
     */
    async function init() {
      // Cargar los selectores de forma paralela para mayor velocidad
      await Promise.allSettled([
        cargarMunicipios(),
        cargarClientes(),
        // cargarVehiculos(),
        cargarZonas(),
      ]);

      cargarAniosVigencia();

      // Establecer estado inicial UI
      setTipo('ventas');
      renderChips();

      // Habilitar botón de consultar (puede haber sido deshabilitado durante carga)
      document.getElementById('btn-consultar').disabled = false;
    }

    // Arrancar cuando el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    /* ── API PÚBLICA DEL MÓDULO ── */
    return {
      setTipo,
      setFiltro,
      removerFiltro,
      limpiarFiltros,
      consultar,
      exportarExcel,
      toggleAdvanced,
      filtrarTablaLocal,
    };

  })();

  window.ExportarTarifas = ExportarTarifas;
})();