/**
 * ============================================================
 *  EXPORTAR TARIFAS DE VENTA A EXCEL
 *  Archivo: exportar_excel_tarifa_venta.js
 *
 *  Estrategia:
 *   1. Llama la API existente (GET /api/parametros/tarifas) con los
 *      mismos filtros activos en pantalla (empresa_id, fechas, etc.)
 *      y pide hasta 9999 registros para exportar todo.
 *   2. Con los datos que ya traen componentes + detalles, arma el
 *      Excel en el cliente usando SheetJS (sin tabla HTML intermedia).
 *   3. Genera un libro con 2 hojas:
 *      • "Resumen"   → una fila por tarifa (igual a la vista en pantalla)
 *      • "Detalle"   → filas expandidas: tarifa + componente + municipio
 *
 *  Dependencias: SheetJS (XLSX) — ya debe estar incluido en el proyecto.
 * ============================================================
 */

document
    .getElementById("exportar_excel_tarifa_venta")
    .addEventListener("click", async function () {

        /* ── 1. RECOLECTAR LOS FILTROS ACTIVOS ──────────────────── */
        const baseUrl   = $("#base_url_api").val();
        const empresaId = document.getElementById("empresa_id")?.value || "";

        const filtros = {
            empresa_id:    empresaId,
            fecha_desde:   document.getElementById("f_fecha_desde")?.value || "",
            fecha_hasta:   document.getElementById("f_fecha_hasta")?.value || "",
            // Descomenta los que tengas activos en tu formulario:
            // cliente_id:  document.getElementById("f_cliente")?.value || "",
            // origen:      document.getElementById("f_origen")?.value  || "",
            // destino:     document.getElementById("f_destino")?.value || "",
            // tipo_vehiculo: document.getElementById("f_vehiculo")?.value || "",
            // estado_tarifa: document.getElementById("f_estado")?.value || "",
            limit: 9999,   // exportar todos los resultados del filtro
        };

        const params = new URLSearchParams();
        Object.entries(filtros).forEach(([k, v]) => {
            if (v !== "" && v !== null && v !== undefined) params.append(k, v);
        });

        /* ── 2. FEEDBACK VISUAL: deshabilitar botón ──────────────── */
        const btnEl = document.getElementById("exportar_excel_tarifa_venta");
        const textoOriginal = btnEl.innerHTML;
        btnEl.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status"></span> Generando Excel...`;
        btnEl.style.pointerEvents = "none";

        try {

            /* ── 3. LLAMAR A LA API ───────────────────────────────── */
            const response = await fetch(`${baseUrl}tarifas?${params.toString()}`, {
                method: "GET",
                headers: {
                    "Accept":       "application/json",
                    "Content-Type": "application/json",
                    "X-API-KEY":    "nexos_nacional2026@*",
                },
            });

            if (!response.ok) throw new Error(`Error HTTP ${response.status}`);

            const result = await response.json();
            const tarifas = result.data || [];

            if (!tarifas.length) {
                Swal.fire("Sin datos", "No hay tarifas para exportar con los filtros actuales.", "warning");
                return;
            }

            /* ── 4. CONSTRUIR LAS DOS HOJAS ──────────────────────── */
            const wb = XLSX.utils.book_new();

            // ── Hoja 1: RESUMEN (una fila por tarifa) ──────────────
            const resumenHeaders = [
                "#",
                "ID Tarifa",
                "Cliente",
                "Fecha Solicitud",
                "Fecha Inicio",
                "Fecha Fin",
                "Origen",
                "Destino",
                "Tipo Vehículo",
                "Descripción Vehículo",
                "Tarifa Plena (COP)",
                "Multi Recogida (COP)",
                "Multi Entrega (COP)",
                "Multi Origen (COP)",
                "Multi Destino (COP)",
                "Estado",
                "Vigencia",
            ];

            const resumenRows = [resumenHeaders];

            tarifas.forEach((t, idx) => {
                // Extraer componentes escalares por tipo
                const comp = (tipo) =>
                    (t.componentes || []).find(c => c.tipo === tipo)?.valor ?? "";

                const origen  = t.municipio_origen
                    ? `${t.municipio_origen.municipio} - ${t.municipio_origen.depto}`
                    : t.origen ?? "";
                const destino = t.municipio_destino
                    ? `${t.municipio_destino.municipio} - ${t.municipio_destino.depto}`
                    : t.destino ?? "";

                resumenRows.push([
                    idx + 1,
                    t.id,
                    t.cliente_tarifa?.nombre ?? t.cliente_id ?? "",
                    fmtFecha(t.fecha),
                    fmtFecha(t.fecha_inicio),
                    fmtFecha(t.fecha_fin),
                    origen,
                    destino,
                    t.tipo_vehiculo ?? "",
                    obtenerTipoVehiculo(t.tipo_vehiculo),
                    numerico(t.tarifa),
                    numerico(comp("PLENA")),
                    numerico(comp("MULTI_RECOGIDA")),
                    numerico(comp("MULTI_ENTREGA")),
                    numerico(comp("MULTI_ORIGEN")),
                    numerico(comp("MULTI_DESTINO")),
                    t.estado_tarifa ?? "",
                    t.vigencia?.estado ?? "",
                ]);
            });

            const wsResumen = XLSX.utils.aoa_to_sheet(resumenRows);
            estilarHoja(wsResumen, resumenHeaders.length);
            XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen");

            // ── Hoja 2: DETALLE COMPONENTES Y MUNICIPIOS ───────────
            const detalleHeaders = [
                "ID Tarifa",
                "Cliente",
                "Origen",
                "Destino",
                "Tipo Vehículo",
                "Fecha Inicio",
                "Fecha Fin",
                "Estado Tarifa",
                "Tipo Componente",
                "Valor Componente (COP)",
                "Requiere Aprobación",
                "% Variación",
                "Municipio Detalle",
                "1ra Tarifa (COP)",
                "2da Tarifa (COP)",
                "Total Municipio (COP)",
            ];

            const detalleRows = [detalleHeaders];

            tarifas.forEach(t => {
                const cliente = t.cliente_tarifa?.nombre ?? t.cliente_id ?? "";
                const origen  = t.municipio_origen
                    ? `${t.municipio_origen.municipio} - ${t.municipio_origen.depto}`
                    : t.origen ?? "";
                const destino = t.municipio_destino
                    ? `${t.municipio_destino.municipio} - ${t.municipio_destino.depto}`
                    : t.destino ?? "";

                const comps = t.componentes || [];

                if (!comps.length) {
                    // Tarifa sin componentes: fila con datos generales
                    detalleRows.push([
                        t.id, cliente, origen, destino,
                        t.tipo_vehiculo ?? "",
                        fmtFecha(t.fecha_inicio), fmtFecha(t.fecha_fin),
                        t.estado_tarifa ?? "",
                        "—", "", "", "", "", "", "", "",
                    ]);
                    return;
                }

                comps.forEach(comp => {
                    const tipoLabel  = etiquetaComponente(comp.tipo);
                    const detalles   = comp.detalles || [];
                    const reqAprob   = comp.requiere_aprobacion ? "Sí" : "No";
                    const varPct     = comp.variacion_pct != null
                        ? parseFloat(comp.variacion_pct).toFixed(2) + "%"
                        : "";

                    if (detalles.length === 0) {
                        // Componente sin detalles de municipio (PLENA, MULTI_RECOGIDA, MULTI_ENTREGA)
                        detalleRows.push([
                            t.id, cliente, origen, destino,
                            t.tipo_vehiculo ?? "",
                            fmtFecha(t.fecha_inicio), fmtFecha(t.fecha_fin),
                            t.estado_tarifa ?? "",
                            tipoLabel,
                            numerico(comp.valor),
                            reqAprob, varPct,
                            "", "", "", "",
                        ]);
                    } else {
                        // Componente con detalles de municipio (MULTI_ORIGEN, MULTI_DESTINO)
                        detalles.forEach(det => {
                            const munNombre = det.municipio
                                ? `${det.municipio.municipio} - ${det.municipio.depto ?? ""}`
                                : det.municipio_id ?? "";
                            const r1    = numerico(det.rate_1);
                            const r2    = numerico(det.rate_2);
                            const total = r1 + r2;

                            detalleRows.push([
                                t.id, cliente, origen, destino,
                                t.tipo_vehiculo ?? "",
                                fmtFecha(t.fecha_inicio), fmtFecha(t.fecha_fin),
                                t.estado_tarifa ?? "",
                                tipoLabel,
                                numerico(comp.valor),
                                reqAprob, varPct,
                                munNombre, r1, r2, total,
                            ]);
                        });
                    }
                });
            });

            const wsDetalle = XLSX.utils.aoa_to_sheet(detalleRows);
            estilarHoja(wsDetalle, detalleHeaders.length);
            XLSX.utils.book_append_sheet(wb, wsDetalle, "Detalle Componentes");

            /* ── 5. DESCARGAR ────────────────────────────────────── */
            const fecha         = new Date().toISOString().slice(0, 10);
            const nombreArchivo = `Informe_Tarifas_Venta_${fecha}.xlsx`;
            XLSX.writeFile(wb, nombreArchivo);

            Swal.fire({
                icon:  "success",
                title: "Excel generado",
                text:  `${tarifas.length} tarifa(s) exportada(s) correctamente.`,
                timer: 2500,
                showConfirmButton: false,
            });

        } catch (err) {
            console.error("[Export] Error:", err);
            Swal.fire("Error", `No se pudo generar el Excel: ${err.message}`, "error");
        } finally {
            /* ── 6. RESTAURAR BOTÓN ──────────────────────────────── */
            btnEl.innerHTML       = textoOriginal;
            btnEl.style.pointerEvents = "";
        }
    });


/* ============================================================
   HELPERS LOCALES
   ============================================================ */

/**
 * Formatea una fecha ISO a DD/MM/YYYY.
 * Acepta strings con o sin hora ("2025-03-01" y "2025-03-01T00:00:00").
 */
function fmtFecha(val) {
    if (!val) return "";
    const s = val.toString().split("T")[0];        // quitar hora si viene
    const [y, m, d] = s.split("-");
    if (!y || !m || !d) return s;
    return `${d}/${m}/${y}`;
}

/**
 * Devuelve un número limpio para celdas numéricas del Excel.
 * SheetJS guarda valores numéricos reales (no strings) para que
 * Excel les aplique formato de moneda/número.
 */
function numerico(val) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
}

/** Etiqueta legible por tipo de componente */
function etiquetaComponente(tipo) {
    const map = {
        PLENA:          "Tarifa Plena",
        MULTI_RECOGIDA: "Multi Recogida",
        MULTI_ENTREGA:  "Multi Entrega",
        MULTI_ORIGEN:   "Multi Origen",
        MULTI_DESTINO:  "Multi Destino",
    };
    return map[tipo] || tipo;
}

/**
 * Aplica estilos básicos a una hoja:
 *  - Encabezado: fondo verde oscuro, texto blanco, negrita.
 *  - Autoajuste de ancho de columnas.
 *  - Filtros automáticos en la fila de encabezado.
 */
function estilarHoja(ws, numCols) {
    if (!ws["!ref"]) return;

    const range    = XLSX.utils.decode_range(ws["!ref"]);
    const totalRows = range.e.r;

    /* ── Estilo de encabezado ─────────────────────────────── */
    const estiloHeader = {
        font:      { bold: true, color: { rgb: "FFFFFF" }, name: "Arial", sz: 10 },
        fill:      { fgColor: { rgb: "1A5276" }, patternType: "solid" },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
            top:    { style: "thin", color: { rgb: "AAAAAA" } },
            bottom: { style: "thin", color: { rgb: "AAAAAA" } },
            left:   { style: "thin", color: { rgb: "AAAAAA" } },
            right:  { style: "thin", color: { rgb: "AAAAAA" } },
        },
    };

    for (let c = 0; c < numCols; c++) {
        const addr = XLSX.utils.encode_cell({ r: 0, c });
        if (!ws[addr]) continue;
        ws[addr].s = estiloHeader;
    }

    /* ── Estilo de celdas de datos ───────────────────────── */
    const estiloMoneda = {
        numFmt: '"$"#,##0.00',
        font:   { name: "Arial", sz: 9 },
        border: {
            top:    { style: "hair", color: { rgb: "DDDDDD" } },
            bottom: { style: "hair", color: { rgb: "DDDDDD" } },
            left:   { style: "hair", color: { rgb: "DDDDDD" } },
            right:  { style: "hair", color: { rgb: "DDDDDD" } },
        },
    };
    const estiloTexto = {
        font:   { name: "Arial", sz: 9 },
        border: estiloMoneda.border,
    };

    // Columnas que contienen moneda (índice 0-based).
    // Hoja Resumen: cols 10–15 | Hoja Detalle: cols 9, 13, 14, 15
    const colsMoneda = new Set([9, 10, 11, 12, 13, 14, 15]);

    for (let r = 1; r <= totalRows; r++) {
        for (let c = 0; c < numCols; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            if (!ws[addr]) continue;
            ws[addr].s = colsMoneda.has(c) ? estiloMoneda : estiloTexto;
        }
    }

    /* ── Autoajuste ancho de columnas ────────────────────── */
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
    ws["!cols"] = Array.from({ length: numCols }, (_, ci) => {
        const maxLen = data.reduce((acc, row) => {
            const cell = row[ci];
            return Math.max(acc, cell ? cell.toString().length : 0);
        }, 10);
        return { wch: Math.min(maxLen + 4, 55) };   // máximo 55 chars
    });

    /* ── Filtros automáticos ─────────────────────────────── */
    ws["!autofilter"] = {
        ref: XLSX.utils.encode_range({
            s: { r: 0, c: 0 },
            e: { r: totalRows, c: numCols - 1 },
        }),
    };

    /* ── Fijar fila de encabezado (freeze pane) ──────────── */
    ws["!freeze"] = { xSplit: 0, ySplit: 1 };
}
