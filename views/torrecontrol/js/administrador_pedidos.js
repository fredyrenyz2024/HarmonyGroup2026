// window.VENTANA = null; // Variable global para almacenar el ID
// (function () {
//     "use strict";

//     // ═══════════════════════════════════════════════════════════════════
//     //  TiemposLogisticos — módulo interno para ETA · SLA · Horarios
//     //  Consume POST Calcular_tiempos_logisticos (nuevo endpoint)
//     // ═══════════════════════════════════════════════════════════════════
//     const TiemposLogisticos = (function () {
//         /* ── Helpers DOM ── */
//         const qs = (s) => document.querySelector(s);
//         const esc = (v) =>
//             v == null
//                 ? "—"
//                 : String(v)
//                     .replace(/&/g, "&amp;")
//                     .replace(/</g, "&lt;")
//                     .replace(/>/g, "&gt;")
//                     .replace(/"/g, "&quot;");

//         /* ── Llama a la API ── */
//         async function _api(pedidoId, duracionSeg, soloHorarios) {
//             const baseUrl = (
//                 document.getElementById("base_url_api")?.value ?? ""
//             ).replace(/\/$/, "");
//             const fd = new FormData();
//             fd.append("PedidoId", pedidoId);
//             fd.append("duracion_segundos", duracionSeg);
//             fd.append("solo_horarios", soloHorarios ? "1" : "0");
//             try {
//                 const r = await fetch(baseUrl + "/Calcular_tiempos_logisticos", {
//                     method: "POST",
//                     headers: { "X-API-KEY": "nexos_nacional2026@*" },
//                     body: fd,
//                 });
//                 if (!r.ok) throw new Error("HTTP " + r.status);
//                 const json = await r.json();
//                 return json.numero === 200 ? json.data : null;
//             } catch (e) {
//                 console.warn("[TiemposLogisticos] API error:", e.message);
//                 return null;
//             }
//         }

//         /* ── Carga solo horarios (sin cálculo de ETA, antes de tener Maps) ── */
//         async function cargarSoloHorarios(pedidoId) {
//             _showLoading();
//             const d = await _api(pedidoId, 0, true);
//             if (d) _renderHorarios(d);
//             else _showEmpty("Sin horarios disponibles para este pedido.");
//         }

//         /* ── Carga completo: ETA + SLA + horarios ── */
//         async function cargar(pedidoId, duracionSegundos) {
//             const d = await _api(pedidoId, duracionSegundos, false);
//             if (!d) return;
//             _renderHorarios(d);
//             _renderKpis(d);
//             // _renderEtaCarguePanel(d);
//             _renderTablasTiempos(d);
//         }

//         /* ── RENDER KPIs ── */
//         function _renderKpis(d) {
//             const colorMap = {
//                 "A TIEMPO": "#10b981",
//                 "EN RIESGO": "#f59e0b",
//                 ATRASADO: "#ef4444",
//                 CALCULANDO: "#94a3b8",
//                 "SIN DATOS": "#94a3b8",
//             };
//             const col = colorMap[d.estado_sla] ?? "#94a3b8";

//             // Función de cálculo integrada
//             function calcularTiempos(d) {
//                 function sumarMinutosAFecha(fechaStr, minutos) {
//                     if (!fechaStr || !minutos) return "—";

//                     const [fechaPart, horaPart] = fechaStr.split(" ");
//                     if (!fechaPart || !horaPart) return fechaStr;

//                     const [dia, mes, ano] = fechaPart.split("/");
//                     const [horas, minutosP] = horaPart.split(":");

//                     const date = new Date(ano, mes - 1, dia, horas, minutosP);
//                     date.setMinutes(date.getMinutes() + minutos);

//                     const dF = String(date.getDate()).padStart(2, "0");
//                     const mF = String(date.getMonth() + 1).padStart(2, "0");
//                     const aF = date.getFullYear();
//                     const hF = String(date.getHours()).padStart(2, "0");
//                     const minF = String(date.getMinutes()).padStart(2, "0");

//                     return `${dF}/${mF}/${aF} ${hF}:${minF}`;
//                 }

//                 function parseFecha(fechaStr) {
//                     if (!fechaStr || fechaStr === "—") return null;
//                     const [fechaPart, horaPart] = fechaStr.split(" ");
//                     if (!fechaPart || !horaPart) return null;
//                     const [dia, mes, ano] = fechaPart.split("/");
//                     const [horas, mins] = horaPart.split(":");
//                     return new Date(ano, mes - 1, dia, horas, mins);
//                 }

//                 function deltaTexto(minutos) {
//                     if (minutos === null) return "—";
//                     if (minutos === 0) return "En punto";
//                     const abs = Math.abs(minutos);
//                     const h = Math.floor(abs / 60);
//                     const m = abs % 60;
//                     const txt = (h > 0 ? `${h}h ` : "") + `${m}min`;
//                     return (minutos > 0 ? "+" : "-") + txt;
//                 }

//                 function deltaColor(minutos) {
//                     if (minutos === null) return "slate";
//                     if (minutos <= 0) return "green";
//                     if (minutos <= 30) return "amber";
//                     return "red";
//                 }

//                 const minutosActividad = d.minutos_planta_cargue || 0;
//                 // Calculamos el tiempo total de gestión usando la propiedad del objeto JSON
//                 const minutosActividadGestion =
//                     (d.tiempoRealMin || 0) + minutosActividad;

//                 // 1. Calculamos la salida real inicial y el cargue
//                 let salidaRealDate = parseFecha(
//                     sumarMinutosAFecha(
//                         d.fecha_ejecutada_posicionamiento,
//                         minutosActividadGestion,
//                     ),
//                 );
//                 const cargueReal = parseFecha(d.fecha_ejecutada_posicionamiento);

//                 // 2. Aplicamos la regla de la ventana del cliente de forma numérica
//                 if (salidaRealDate && d.ventana_cliente_inicio && d.ventana_cliente_fin) {
//                     const [hStart, mStart] = d.ventana_cliente_inicio.split(":").map(Number);
//                     const [hEnd, mEnd] = d.ventana_cliente_fin.split(":").map(Number);

//                     const hSalida = salidaRealDate.getHours();
//                     const mSalida = salidaRealDate.getMinutes();

//                     const superaFin = hSalida > hEnd || (hSalida === hEnd && mSalida > mEnd);
//                     const antesInicio = hSalida < hStart || (hSalida === hStart && mSalida < mStart);

//                     if (superaFin) {
//                         salidaRealDate.setDate(salidaRealDate.getDate() + 1);
//                         salidaRealDate.setHours(hStart, mStart, 0, 0);
//                     } else if (antesInicio) {
//                         salidaRealDate.setHours(hStart, mStart, 0, 0);
//                     }
//                 }

//                 // Función auxiliar para convertir fecha a String con formato
//                 function formatDateToString(dateObj) {
//                     const dF = String(dateObj.getDate()).padStart(2, "0");
//                     const mF = String(dateObj.getMonth() + 1).padStart(2, "0");
//                     const aF = dateObj.getFullYear();
//                     const hF = String(dateObj.getHours()).padStart(2, "0");
//                     const minF = String(dateObj.getMinutes()).padStart(2, "0");
//                     return `${dF}/${mF}/${aF} ${hF}:${minF}`;
//                 }

//                 let deltaMin = null;
//                 if (cargueReal && salidaRealDate) {
//                     deltaMin = Math.round((salidaRealDate - cargueReal) / 60000);
//                 }

//                 // Fecha real de llegada a cargue: hito 1 (Llega Vehículo a Punto de Cargue)
//                 const _hitoLlegada = window._hitosLineaTiempo?.[1];
//                 const _cargueReal = _hitoLlegada?.fecha_real || d.fecha_ejecutada_posicionamiento || null;

//                 return {
//                     cargue_estimado: d.sla_cargue,
//                     cargue_real: _cargueReal,
//                     salida_estimada: sumarMinutosAFecha(d.sla_cargue, minutosActividad),
//                     salida_real: salidaRealDate
//                         ? formatDateToString(salidaRealDate)
//                         : "—",
//                     delta_min: deltaMin,
//                     delta_texto: deltaTexto(deltaMin),
//                     delta_color: deltaColor(deltaMin),
//                 };
//             }

//             const tiempos = calcularTiempos(d);

//             // KPI 1: Estado SLA
//             const slaVal = qs("#kpi-sla-val");
//             const slaSub = qs("#kpi-sla-sub");
//             if (slaVal) {
//                 slaVal.textContent = d.estado_sla;
//                 slaVal.style.color = col;
//             }
//             if (slaSub) {
//                 slaSub.innerHTML = d.diferencia_texto
//                     ? `<i class="${d.sla_icono ?? "bi-clock"}"></i> ${esc(d.diferencia_texto)} vs SLA`
//                     : "Sin SLA registrado";
//             }

//             // KPI 2: Tiempo disponible
//             const tdis = qs("#kpi-tdis-val");
//             if (tdis) {
//                 tdis.textContent = d.tiempo_disponible ?? "—";
//                 tdis.style.color = col;
//             }

//             // KPI 3: ETA Cargue — llegada estimada, salida estimada, ejecutadas y deltas
//             const colorSemap = (c) =>
//                 ({
//                     green: "#10b981",
//                     amber: "#f59e0b",
//                     red: "#ef4444",
//                     slate: "#94a3b8",
//                 })[c] ?? "#94a3b8";
//             const cargueVal = qs("#kpi-cargue-val");
//             const cargueSub = qs("#kpi-cargue-sub");
//             const cargueEtSal = qs("#kpi-cargue-etm-sal");
//             const cargueSal = qs("#kpi-cargue-sal");
//             const cardCargue = qs("#kpi-card-cargue");
//             const colCargue = colorSemap(d.sla_color || "slate");

//             if (cargueVal) {
//                 cargueVal.innerHTML = `
//                     <div style="font-size: 11px; line-height: 1.4; margin-bottom: 4px;">
//                         <span style="color: #64748b;">Est. Llegada:</span> <strong>${tiempos.cargue_estimado || "—"}</strong>
//                     </div>
//                     <div style="font-size: 11px; line-height: 1.4;">
//                         <span style="color: #64748b;">Real Llegada:</span> <strong>${tiempos.cargue_real || "—"}</strong>
//                     </div>
//                 `;
//                 cargueVal.style.color = colCargue;
//             }

//             const colSalida = colorSemap(d.delta_salida_color);
//             const badge = (texto, color) =>
//                 texto
//                     ? `<span style="font-size:8px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 5px;border-radius:6px;margin-left:4px;background:${color}18;color:${color};border:1px solid ${color}30">${texto}</span>`
//                     : "";

//             if (cargueSub) {
//                 cargueSub.innerHTML = `
//                     <div style="font-size: 11px; line-height: 1.4; margin-bottom: 4px;">
//                         <span style="color: #64748b;">Est. Salida:</span> <strong>${tiempos.salida_estimada}</strong>
//                     </div>
//                     <div style="font-size: 11px; line-height: 1.4;">
//                         <span style="color: #64748b;">Real Salida:</span> <strong>${d.fecha_ejecutada_salida_planta ?? tiempos.salida_real}</strong>
//                     </div>
//                     ${tiempos.delta_min !== null
//                         ? `
//                     <div style="margin-top:.5rem;font-size:9px;color:#64748b;display:flex;align-items:center;gap:5px">
//                         <i class="bi bi-clock-history" style="font-size:10px;color:#94a3b8"></i>
//                         Delta planta: 
//                         <strong style="color:${{ green: "#10b981", amber: "#f59e0b", red: "#ef4444", slate: "#94a3b8" }[tiempos.delta_color]}">${tiempos.delta_texto}</strong>
//                     </div>`
//                         : ""
//                     }
//                 `;
//             }

//             // Limpieza de campos para evitar conflictos de maquetación en el DOM
//             if (cargueEtSal) {
//                 cargueEtSal.innerHTML = "";
//             }

//             if (cargueSal) {
//                 cargueSal.innerHTML = "";
//             }

//             if (cardCargue) cardCargue.style.borderTopColor = colCargue;

//             // Guardar salida_cargue_iso para la línea de tiempo
//             // window._salidaCargueProgramada = d.salida_cargue_iso ? new Date(d.salida_cargue_iso) : null;

//             window._salidaCargueProgramada = d.eta_salida_planta_iso
//                 ? new Date(d.eta_salida_planta_iso)
//                 : null;

//             // KPI 4: ETA Descargue

//             /*if (entregaVal) {
//               // entregaVal.textContent = d.eta_descargue ?? "—";
//               entregaVal.textContent = tiempos.salida_real ?? "—";
//               entregaVal.style.color = "#0891b2";
//             }*/

//             //const entregaVal = qs("#kpi-entrega-val");
//             //const entregaSub = qs("#kpi-entrega-sub");

//             // KPI 5: Porcentaje
//             const pctVal = qs("#kpi-pct-val");
//             const barFill = qs("#kpi-bar-fill");
//             if (pctVal) pctVal.textContent = `${d.porcentaje_avance ?? 0}%`;
//             if (barFill) barFill.style.width = `${d.porcentaje_avance ?? 0}%`;

//             // Badge mapa duración con buffer

//             /*const mapDur = qs("#ocMapDuracion");
//             if (mapDur && d.duracion_buffer_texto)
//               mapDur.textContent = d.duracion_buffer_texto + " (+28%)";

//             if (entregaVal) {
//               // entregaVal.textContent = d.eta_descargue ?? "—";
//               entregaVal.textContent = d.duracion_buffer_texto ?? "—";
//               entregaVal.style.color = "#0891b2";
//             }*/

//             /*const entregaVal = qs("#kpi-entrega-val");
//             const entregaSub = qs("#kpi-entrega-sub");
//             const mapDur = qs("#ocMapDuracion");

//             // Mostrar duración en el mapa
//             if (mapDur && d.duracion_buffer_texto) {
//               mapDur.textContent = d.duracion_buffer_texto;
//             }

//             if (entregaVal && d.duracion_buffer_texto) {
//               // 1️⃣ Extraer horas y minutos (ej: "21h 18min")
//               const match = d.duracion_buffer_texto.match(/(\d+)\s*h\s*(\d+)\s*min/i);

//               if (!match) {
//                 entregaVal.textContent = "—";
//               } else {
//                 const horas = parseInt(match[1], 10);
//                 const minutos = parseInt(match[2], 10);

//                 // 2️⃣ Convertir a minutos totales
//                 const totalMinutos = horas * 60 + minutos;

//                 // 3️⃣ Calcular ETA
//                 const ahora = new Date();
//                 const eta = new Date(ahora.getTime() + totalMinutos * 60000);

//                 // 4️⃣ Formatear ETA
//                 const etaFormateada = eta.toLocaleString("es-ES", {
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 });

//                 // 5️⃣ Mostrar ETA
//                 entregaVal.textContent = etaFormateada;
//                 entregaVal.style.color = "#0891b2";
//               }
//             }*/

//             const entregaVal = qs("#kpi-entrega-val");
//             const entregaSub = qs("#kpi-entrega-sub");
//             const mapDur = qs("#ocMapDuracion");

//             // Mostrar duración en el mapa
//             if (mapDur && d.duracion_buffer_texto) {
//                 mapDur.textContent = d.duracion_buffer_texto;
//             }

//             /* ================= HELPERS ================= */

//             // "21h 18min" -> { h:21, min:18 }
//             function parseDuracionHM(texto) {
//                 const t = String(texto || "")
//                     .trim()
//                     .toLowerCase();
//                 // Soporta: "21h 18min", "21h", "18min"
//                 const mh = t.match(/(\d+)\s*h/);
//                 const mm = t.match(/(\d+)\s*min/);
//                 const h = mh ? parseInt(mh[1], 10) : 0;
//                 const min = mm ? parseInt(mm[1], 10) : 0;
//                 if (h === 0 && min === 0) return null;
//                 return { h, min };
//             }

//             // Convierte "6:00am", "6:00 a.m.", "06:00 AM", "20:00", "20:00:00" -> minutos del día
//             function parseHoraToMin(hora) {
//                 if (!hora) return null;

//                 let s = String(hora).trim().toLowerCase();

//                 // Normaliza "a.m."/"p.m." -> "am"/"pm"
//                 s = s.replace(/\./g, ""); // quita puntos: a.m. -> am
//                 s = s.replace(/\s+/g, ""); // quita espacios: "6:00 am" -> "6:00am"
//                 s = s.replace(/a(m)?$/i, "am"); // por si llega raro
//                 s = s.replace(/p(m)?$/i, "pm");

//                 // Acepta HH:MM(:SS)? + opcional am/pm
//                 const m = s.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?(am|pm)?$/i);
//                 if (!m) return null;

//                 let hh = parseInt(m[1], 10);
//                 const mm = parseInt(m[2] ?? "0", 10);
//                 const ap = (m[4] || "").toLowerCase();

//                 if (
//                     Number.isNaN(hh) ||
//                     Number.isNaN(mm) ||
//                     hh < 0 ||
//                     hh > 23 ||
//                     mm < 0 ||
//                     mm > 59
//                 )
//                     return null;

//                 if (ap) {
//                     // 12h -> 24h
//                     if (hh === 12) hh = 0; // 12am -> 0
//                     if (ap === "pm") hh += 12; // pm suma 12
//                 }

//                 // Normaliza por si hh quedó 24 (no debería, pero por seguridad)
//                 hh = hh % 24;
//                 return hh * 60 + mm;
//             }

//             function setMinDia(date, minDia) {
//                 const d2 = new Date(date);
//                 d2.setHours(0, 0, 0, 0);
//                 d2.setMinutes(minDia);
//                 return d2;
//             }

//             function dentroVentana(dt, ini, fin) {
//                 const t = dt.getHours() * 60 + dt.getMinutes();
//                 if (ini === fin) return true; // interpreta como 24h permitido (evita bucles)
//                 return fin > ini
//                     ? t >= ini && t < fin // ventana normal
//                     : t >= ini || t < fin; // ventana cruza medianoche
//             }

//             function proxInicioVentana(dt, ini, fin) {
//                 if (dentroVentana(dt, ini, fin)) return new Date(dt);

//                 const hoyIni = setMinDia(dt, ini);
//                 if (dt < hoyIni) return hoyIni;

//                 const mananaIni = new Date(hoyIni);
//                 mananaIni.setDate(mananaIni.getDate() + 1);
//                 return mananaIni;
//             }

//             function finVentana(dt, ini, fin) {
//                 if (ini === fin) {
//                     // 24h permitido: fin = +1 día misma hora (en práctica no se usará)
//                     const f = new Date(dt);
//                     f.setDate(f.getDate() + 1);
//                     return f;
//                 }

//                 if (fin > ini) {
//                     // fin hoy a "fin"
//                     return setMinDia(dt, fin);
//                 } else {
//                     // cruza medianoche
//                     const t = dt.getHours() * 60 + dt.getMinutes();
//                     if (t >= ini) {
//                         // tramo noche: fin mañana a "fin"
//                         const f = setMinDia(dt, fin);
//                         f.setDate(f.getDate() + 1);
//                         return f;
//                     } else {
//                         // tramo madrugada: fin hoy a "fin"
//                         return setMinDia(dt, fin);
//                     }
//                 }
//             }

//             // AÑADE minutos respetando franja [ini, fin] diaria
//             function sumarMinConVentana(base, minTot, ini, fin) {
//                 let dt = proxInicioVentana(base, ini, fin);
//                 let faltan = minTot;

//                 while (faltan > 0) {
//                     // Por seguridad, si por algo quedamos fuera, saltamos a inicio
//                     if (!dentroVentana(dt, ini, fin)) {
//                         dt = proxInicioVentana(dt, ini, fin);
//                     }

//                     const fv = finVentana(dt, ini, fin);
//                     const disp = Math.max(
//                         0,
//                         Math.floor((fv.getTime() - dt.getTime()) / 60000),
//                     );

//                     // Si no hay minutos disponibles en esta ventana, saltamos a la siguiente
//                     if (disp === 0) {
//                         dt = proxInicioVentana(new Date(dt.getTime() + 60000), ini, fin);
//                         continue;
//                     }

//                     const usar = Math.min(disp, faltan);
//                     dt = new Date(dt.getTime() + usar * 60000);
//                     faltan -= usar;

//                     if (faltan > 0) {
//                         dt = proxInicioVentana(dt, ini, fin);
//                     }
//                 }
//                 return dt;
//             }

//             // Formato final: "DD/MM/YYYY HH:MM hrs" (sin coma, sin AM/PM)
//             function formatoFechaHora24(eta) {
//                 const fecha = eta.toLocaleDateString("es-ES", {
//                     day: "2-digit",
//                     month: "2-digit",
//                     year: "numeric",
//                 });
//                 const hora = eta.toLocaleTimeString("es-ES", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: false,
//                 });
//                 return `${fecha} ${hora} hrs`;
//             }

//             /* ================= LÓGICA PRINCIPAL ================= */

//             if (entregaVal && d.duracion_buffer_texto) {
//                 const dur = parseDuracionHM(d.duracion_buffer_texto);

//                 // 👇 AQUÍ se “incluyen” las dos variables para calcular la franja
//                 const winIni = parseHoraToMin(d.ventana_cliente_inicio);
//                 const winFin = parseHoraToMin(d.ventana_cliente_fin);

//                 // Debug para ver si realmente parsea bien (quítalo cuando ya funcione)
//                 console.debug(
//                     "[ETA] ventana raw:",
//                     d.ventana_cliente_inicio,
//                     d.ventana_cliente_fin,
//                 );
//                 console.debug("[ETA] ventana min:", {
//                     winIni,
//                     winFin,
//                     duracion: d.duracion_buffer_texto,
//                 });

//                 if (!dur) {
//                     entregaVal.textContent = "—";
//                     entregaVal.style.color = "#0891b2";
//                 } else {
//                     const totalMin = dur.h * 60 + dur.min;

//                     // Base: AHORA (si tu viaje inicia en otra fecha/hora, reemplaza esta línea)
//                     const base = new Date();

//                     // ✅ Cálculo correcto: si la ventana es válida, la ETA se calcula SOLO dentro de esa franja
//                     const eta =
//                         winIni != null && winFin != null
//                             ? sumarMinConVentana(base, totalMin, winIni, winFin)
//                             : new Date(base.getTime() + totalMin * 60000);

//                     entregaVal.textContent = formatoFechaHora24(eta);
//                     entregaVal.style.color = "#0891b2";

//                     if (entregaSub) {
//                         if (winIni != null && winFin != null) {
//                             const f = (m) =>
//                                 `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
//                             entregaSub.textContent = `Ventana: ${f(winIni)}–${f(winFin)} · Duración: ${d.duracion_buffer_texto}`;
//                         } else {
//                             entregaSub.textContent = `Duración: ${d.duracion_buffer_texto}`;
//                         }
//                     }
//                 }
//             }

//             if (entregaSub) {
//                 entregaSub.textContent = d.sla_entrega
//                     ? `SLA: ${d.sla_entrega}`
//                     : "Sin fecha compromiso";
//             }
//         }

//         /* ── RENDER Horarios operativos ── */
//         function _renderHorarios(d) {
//             _hide("#oc-horarios-loading");

//             const hayDatos =
//                 d.ventana_cliente_inicio ||
//                 (d.horarios_remitente && d.horarios_remitente.length > 0) ||
//                 (d.horarios_destinatario && d.horarios_destinatario.length > 0);

//             if (!hayDatos) {
//                 _showEmpty("Sin horarios registrados para este pedido.");
//                 return;
//             }

//             _hide("#oc-horarios-empty");
//             _show("#oc-horarios-content");

//             // Panel: ventana cliente externo
//             const panelCE = qs("#oc-panel-cliente-externo");
//             if (panelCE) panelCE.innerHTML = _htmlVentanaCliente(d);

//             // Panel: remitente
//             const panelRem = qs("#oc-panel-remitente");
//             if (panelRem) {
//                 const nombre = d.nombre_remitente
//                     ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Bodega / Planta</div>
//                        <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:.65rem">${esc(d.nombre_remitente)}</div>`
//                     : "";
//                 panelRem.innerHTML =
//                     nombre +
//                     (d.horarios_remitente?.length > 0
//                         ? _htmlListaHorarios(d.horarios_remitente, "#0369a1")
//                         : _htmlSinHorario("Sin horarios registrados para el remitente."));
//             }

//             // Panel: destinatario
//             const panelDes = qs("#oc-panel-destinatario");
//             if (panelDes) {
//                 const nombre = d.nombre_destinatario
//                     ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Bodega / Punto de Entrega</div>
//                        <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:.65rem">${esc(d.nombre_destinatario)}</div>`
//                     : "";
//                 panelDes.innerHTML =
//                     nombre +
//                     (d.horarios_destinatario?.length > 0
//                         ? _htmlListaHorarios(d.horarios_destinatario, "#0891b2")
//                         : _htmlSinHorario(
//                             "Sin horarios registrados para el destinatario.",
//                         ));
//             }

//             // Motivo ajuste
//             /* const wrapMotivo = qs("#oc-motivo-ajuste-wrap");
//             const textoMotivo = qs("#oc-motivo-ajuste-texto");
//             if (wrapMotivo && textoMotivo) {
//               if (d.motivo_ajuste && d.motivo_ajuste !== "Sin ajustes de horario") {
//                 textoMotivo.textContent = d.motivo_ajuste;
//                 wrapMotivo.style.display = "";
//               } else {
//                 wrapMotivo.style.display = "none";
//               }
//             }*/
//         }

//         /* ── HTML: ventana de tránsito del cliente externo ── */
//         function _htmlVentanaCliente(d) {
//             const nombreCI = d.nombre_cliente_interno
//                 ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Cliente</div>
//                    <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:.55rem">${esc(d.nombre_cliente_interno)}</div>`
//                 : "";
//             const nombreCE = d.nombre_cliente_externo
//                 ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Remitente</div>
//                    <div style="font-size:11px;font-weight:600;color:#1a3260;margin-bottom:.65rem">${esc(d.nombre_cliente_externo)}</div>`
//                 : "";

//             if (d.ventana_cliente_inicio && d.ventana_cliente_fin) {
//                 return `${nombreCI}${nombreCE}
//                     <div style="display:flex;align-items:center;gap:6px;margin-bottom:.4rem">
//                         <i class="bi bi-clock-fill" style="color:#f59e0b;font-size:11px"></i>
//                         <span style="font-size:9px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#94a3b8">Horario Permitido</span>
//                     </div>
//                     <div style="display:flex;align-items:center;gap:8px">
//                         ${_horaBadge(d.ventana_cliente_inicio, "#1a3260", "#fff")}
//                         <span style="color:#94a3b8;font-size:11px">→</span>
//                         ${_horaBadge(d.ventana_cliente_fin, "#1a3260", "#fff")}
//                     </div>
//                     <div style="margin-top:.6rem;font-size:10px;color:#64748b">
//                         <i class="bi bi-info-circle me-1"></i>Ventana en la que el vehículo puede circular con esta carga.
//                     </div>`;
//             }
//             return `${nombreCI}${nombreCE}${_htmlSinHorario("Sin restricción de tránsito registrada.")}`;
//         }

//         function _htmlListaHorarios(ventanas, color) {
//             const filas = ventanas
//                 .map((v, i) => {
//                     const ini = (v.inicio ?? "").substring(0, 5);
//                     const fin = (v.fin ?? "").substring(0, 5);
//                     return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;${i > 0 ? "border-top:1px solid #f1f5f9" : ""}">
//                     <i class="bi bi-clock" style="color:${color};font-size:11px;flex-shrink:0"></i>
//                     <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#0f172a">${ini}</span>
//                     <span style="color:#94a3b8;font-size:11px">–</span>
//                     <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#0f172a">${fin}</span>
//                     <span style="font-size:9px;background:rgba(0,0,0,.04);border-radius:5px;padding:1px 6px;color:#64748b;margin-left:auto">Turno ${i + 1}</span>
//                 </div>`;
//                 })
//                 .join("");
//             return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:.5rem">
//                 <i class="bi bi-calendar-check" style="color:#94a3b8;font-size:11px"></i>
//                 <span style="font-size:9px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#94a3b8">
//                     ${ventanas.length} turno${ventanas.length > 1 ? "s" : ""} registrado${ventanas.length > 1 ? "s" : ""}
//                 </span>
//             </div>${filas}`;
//         }

//         function _htmlSinHorario(msg) {
//             return `<div style="display:flex;align-items:center;gap:7px;color:#94a3b8;font-size:11px;padding:.2rem 0">
//                 <i class="bi bi-dash-circle" style="font-size:13px"></i><span>${esc(msg)}</span>
//             </div>`;
//         }

//         function _horaBadge(horaStr, bg, color) {
//             const hm = horaStr ? horaStr.substring(0, 5) : "—";
//             return `<span style="font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;
//                 color:${color};background:${bg};padding:4px 10px;border-radius:7px;letter-spacing:.5px">${hm}</span>`;
//         }

//         /* ── RENDER Tablas de tiempos en paneles expandibles ── */
//         function _renderTablasTiempos(d) {
//             // Escribe en kpi-tiempos-* (ETA/SLA/Duración)
//             // tabla-tiempos-* queda exclusivo para renderTablaResumen (actividades)
//             _renderTablaUno(
//                 "#kpi-tiempos-CARGUE",
//                 "CARGUE",
//                 d.eta_cargue,
//                 d.sla_cargue,
//                 d.minutos_cargue_texto,
//                 d,
//             );
//             _renderTablaUno(
//                 "#kpi-tiempos-DESCARGUE",
//                 "DESCARGUE",
//                 d.eta_descargue,
//                 d.sla_entrega,
//                 d.minutos_descargue_texto,
//                 d,
//             );
//         }

//         function _renderTablaUno(selector, tipo, eta, sla, minTexto, d) {
//             const el = qs(selector);
//             if (!el) return;
//             const esCargue = tipo === "CARGUE";
//             const filas = [
//                 {
//                     etiqueta: esCargue
//                         ? "ETA llegada a cargue"
//                         : "ETA llegada a descargue",
//                     valor: eta ?? "—",
//                     highlight: true,
//                 },
//                 {
//                     etiqueta: esCargue
//                         ? "SLA ventana cargue"
//                         : "SLA entrega comprometida",
//                     valor: sla ?? "—",
//                 },
//                 {
//                     etiqueta: esCargue
//                         ? "Tiempo estándar cargue"
//                         : "Tiempo estándar descargue",
//                     valor: minTexto ?? "—",
//                 },
//                 {
//                     etiqueta: "Duración tránsito (con buffer 28 %)",
//                     valor: d.duracion_buffer_texto ?? "—",
//                 },
//             ];

//             let margenHtml = "";
//             if (!esCargue && d.diferencia_min != null) {
//                 const abs = Math.abs(d.diferencia_min);
//                 const h = Math.floor(abs / 60);
//                 const m = abs % 60;
//                 const signo = d.diferencia_min >= 0 ? "+" : "−";
//                 const texto = `${signo}${h > 0 ? h + "h " : ""}${m}min`;
//                 const color = d.diferencia_min >= 0 ? "#16a34a" : "#dc2626";
//                 const bg =
//                     d.diferencia_min >= 0 ? "rgba(22,163,74,.08)" : "rgba(220,38,38,.08)";
//                 const icono =
//                     d.diferencia_min >= 0 ? "bi-check-circle-fill" : "bi-x-circle-fill";
//                 margenHtml = `
//                     <div style="margin-top:.6rem;padding:.5rem .7rem;border-radius:8px;background:${bg};border:1px solid ${color}40;display:flex;align-items:center;gap:8px">
//                         <i class="bi ${icono}" style="color:${color};font-size:13px"></i>
//                         <div>
//                             <div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${color}">${d.diferencia_min >= 0 ? "A TIEMPO" : "ATRASADO"}</div>
//                             <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${color}">${texto}</div>
//                             <div style="font-size:10px;color:#475569">${d.diferencia_min >= 0 ? "de margen respecto al SLA" : "de retraso sobre el SLA"}</div>
//                         </div>
//                     </div>`;
//             }

//             const htmlFilas = filas
//                 .map(
//                     (f) =>
//                         `<tr${f.highlight ? ' style="background:#f0f9ff"' : ""}>
//                     <td style="padding:5px 8px;color:#64748b;font-size:10px">${esc(f.etiqueta)}</td>
//                     <td class="v" style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:11px;color:#0f172a;font-weight:600">${esc(String(f.valor))}</td>
//                 </tr>`,
//                 )
//                 .join("");

//             el.innerHTML = `
//                 <table class="oc-table" style="width:100%">
//                     <thead><tr><th colspan="2" style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;background:#f1f5f9;padding:5px 8px">
//                         ${tipo} · Resumen de tiempos
//                     </th></tr></thead>
//                     <tbody>${htmlFilas}</tbody>
//                 </table>${margenHtml}`;
//         }

//         /* ── Estados UI ── */
//         function _showLoading() {
//             _show("#oc-horarios-loading");
//             _hide("#oc-horarios-empty");
//             _hide("#oc-horarios-content");
//         }

//         function _showEmpty(msg) {
//             _hide("#oc-horarios-loading");
//             _hide("#oc-horarios-content");
//             const el = qs("#oc-horarios-empty");
//             if (el) {
//                 el.innerHTML = `<i class="bi bi-exclamation-triangle me-1" style="color:#f59e0b"></i>${esc(msg)}`;
//                 el.style.display = "";
//             }
//         }

//         function _show(sel) {
//             const el = qs(sel);
//             if (el) el.style.display = "";
//         }

//         function _hide(sel) {
//             const el = qs(sel);
//             if (el) el.style.display = "none";
//         }

//         /* ── Box ETA cargue en panel Planta Origen ── */
//         // function _renderEtaCarguePanel(d) {
//         //     const container = qs('#resumen-CARGUE');
//         //     if (!container) return;

//         //     const colorSemap = (c) => ({ green: '#10b981', amber: '#f59e0b', red: '#ef4444', slate: '#94a3b8' })[c] ?? '#94a3b8';
//         //     const colLlegada = colorSemap(d.delta_llegada_color);
//         //     const colSalida = colorSemap(d.delta_salida_color);

//         //     const badge = (texto, color) => texto
//         //         ? `<span style="font-size:8px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 5px;border-radius:6px;margin-left:4px;background:${color}18;color:${color};border:1px solid ${color}30">${texto}</span>`
//         //         : '';

//         //     const fila = (icono, colIcono, etiqueta, valor, badgeHtml, ejecutado) => {
//         //         if (!valor) return '';
//         //         const estiloVal = ejecutado ? 'color:#0f172a;font-weight:700' : 'color:#475569;font-style:italic';
//         //         return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #f1f5f9">
//         //             <i class="bi ${icono}" style="font-size:10px;color:${colIcono};flex-shrink:0"></i>
//         //             <span style="font-size:10px;color:#64748b;flex:1">${etiqueta}</span>
//         //             <span style="font-family:'JetBrains Mono',monospace;font-size:11px;${estiloVal}">${valor}</span>${badgeHtml}
//         //         </div>`;
//         //     };

//         //     const previo = container.querySelector('.eta-cargue-box');
//         //     if (previo) previo.remove();

//         //     const box = document.createElement('div');
//         //     box.className = 'eta-cargue-box';
//         //     box.style.cssText = 'background:rgba(3,105,161,.04);border:1px solid rgba(3,105,161,.15);border-radius:9px;padding:.8rem;margin-bottom:.75rem';
//         //     box.innerHTML = `
//         //     <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#0369a1;margin-bottom:.6rem;display:flex;align-items:center;gap:6px">
//         //         <i class="bi bi-hourglass-split" style="font-size:11px"></i>Tiempos de Cargue
//         //     </div>
//         // ${fila('bi-clock', '#94a3b8', 'Llegada estimada', d.eta_posicionamiento, '', false)}
//         // ${fila('bi-box-arrow-right', '#64748b', 'Salida estimada', d.eta_salida_planta, '', false)}
//         // ${fila('bi-check-circle', '#10b981', 'Llegada real', d.fecha_ejecutada_posicionamiento, badge(d.delta_llegada_texto, colLlegada), true)}
//         // ${fila('bi-check-circle-fill', '#10b981', 'Salida real', d.fecha_ejecutada_salida_planta, badge(d.delta_salida_texto, colSalida), true)}
//         // ${d.minutos_planta_cargue_texto ? `<div style="margin-top:.5rem;font-size:9px;color:#64748b;display:flex;align-items:center;gap:5px"><i class="bi bi-clock-history" style="font-size:10px;color:#94a3b8"></i>Tiempo estándar en planta: <strong style="color:#0f172a">${d.minutos_planta_cargue_texto}</strong></div>` : ''}`;

//         //     container.insertAdjacentElement('afterbegin', box);
//         // }

//         return { cargar, cargarSoloHorarios };
//     })();

//     // Definir la función initScript globalmente
//     window.initScript = function (id) {
//         window.VENTANA = id; // Asigna el ID recibido a la variable global

//         // Crear instancia
//         if (!window.myOffcanvas) {
//             window.myOffcanvas = new DynamicOffcanvas({
//                 id: `customOffcanvas${id}`,
//                 title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
//                 content: "<p>Contenido inicial</p>",
//                 scroll: true,
//                 backdrop: false,
//             });
//         } else {
//             console.log("El offcanvas ya está creado.");
//         }

//         let campoFechaInicial = document.getElementById(`fecha_inicial`);
//         let campoFechaFinal = document.getElementById(`fecha_final`);

//         if (campoFechaInicial && campoFechaFinal) {
//             let hoy = new Date();
//             let anio = hoy.getFullYear();
//             let mes = hoy.getMonth() + 1;
//             let dia = hoy.getDate();
//             mes = mes < 10 ? `0${mes}` : mes;
//             let diaActual = dia < 10 ? `0${dia}` : dia;
//             let fechaInicio = `${anio}-${mes}-01`;
//             let fechaFin = `${anio}-${mes}-${diaActual}`;
//             campoFechaInicial.value = fechaInicio;
//             campoFechaFinal.value = fechaFin;
//             let fecha_inicial = campoFechaInicial.value;
//             let fecha_final = campoFechaFinal.value;
//             listar_pedidos_administrador(fecha_inicial, fecha_final);
//         }

//         document.addEventListener("click", async (e) => {
//             /* Botón buscar por fechas */
//             if (e.target.matches("#buscar") || e.target.matches("#buscar *")) {
//                 const fecha_inicial =
//                     document.getElementById("fecha_inicial")?.value ?? "";
//                 const fecha_final = document.getElementById("fecha_final")?.value ?? "";
//                 const _estPub = document.getElementById("f-estado-pub")?.value ?? "";
//                 const _estTraz = document.getElementById("f-estado-traz")?.value ?? "";
//                 const _modalidad = document.getElementById("f-modalidad")?.value ?? "";

//                 document
//                     .querySelectorAll(".kpi-resumen")
//                     .forEach((c) => c.classList.remove("active"));

//                 if (_estTraz && _modalidad) {
//                     listar_pedidos_administrador(
//                         fecha_inicial,
//                         fecha_final,
//                         "",
//                         _estTraz,
//                         _modalidad,
//                         "filt_traz_mod",
//                     );
//                 } else if (_estPub && _modalidad) {
//                     listar_pedidos_administrador(
//                         fecha_inicial,
//                         fecha_final,
//                         _estPub,
//                         _modalidad,
//                         "",
//                         "filt_mod",
//                     );
//                 } else if (_estTraz) {
//                     listar_pedidos_administrador(
//                         fecha_inicial,
//                         fecha_final,
//                         _estTraz,
//                         "",
//                         "",
//                         "trazabilidad",
//                     );
//                 } else if (_estPub) {
//                     listar_pedidos_administrador(
//                         fecha_inicial,
//                         fecha_final,
//                         _estPub,
//                         "",
//                         "",
//                         "filt",
//                     );
//                 } else if (_modalidad) {
//                     listar_pedidos_administrador(
//                         fecha_inicial,
//                         fecha_final,
//                         "",
//                         _modalidad,
//                         "",
//                         "mod",
//                     );
//                 } else {
//                     listar_pedidos_administrador(
//                         fecha_inicial,
//                         fecha_final,
//                         "",
//                         "",
//                         "",
//                         "",
//                     );
//                 }
//             }

//             if (e.target.matches("#btn-carrito-pedidos") || e.target.matches("#btn-carrito-pedidos *")) {
//                 let clienId = document
//                     .getElementById("btn-carrito-pedidos")
//                     .getAttribute("data-idCliente");
//                 let pedidoId = document
//                     .getElementById("btn-carrito-pedidos")
//                     .getAttribute("data-idPedido");
//                 let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

//                 if (carrito.length === 0) {
//                     myOffcanvas.updateContent(
//                         `<p class="text-center text-muted">No hay pedidos en el carrito.</p>`,
//                     );
//                 } else {
//                     let tablaHTML = `
//               <table class="table table-striped table-sm" data-page-length='100' style="font-size:11px;">
//                   <thead>
//                       <tr>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>N° Pedido</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Placa</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Cliente</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Producto</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Unidades</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Presentación</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Neto</th>
//                           <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Bruto</th>
//                       </tr>
//                   </thead>
//                   <tbody>`;

//                     carrito.forEach((item, index) => {
//                         tablaHTML += `
//                   <tr>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${index + 1}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.id}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId4}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId || "-"}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId12 || "-"}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId7 || "-"}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId13 || "-"}</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId10 || "-"} KG</td>
//                       <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId11 || "-"} KG</td>
//                   </tr>`;
//                     });

//                     tablaHTML += `
//                     </tbody>
//                     </table>
//                     <div class="d-flex align-items-center justify-content-between">
//                         <h5 id="titulo_opcion" class="mb-0 me-2 d-flex align-items-center justify-content-center">Título</h5>
//                         <div id="acciones_asignacion"></div>
//                     </div>
//                     <hr class="my-1 text-dark">
//                     <div class="container" id="contenido_opcion"></div>
//                 `;

//                     myOffcanvas.updateTitle(`
//                     <div class="d-flex align-items-center justify-content-between">
//                         <span class="text-primary-emphasis uil uil-file-alt"></span> Listado de Pedidos
//                         <div class="dropdown ms-2">
//                         <a class="btn btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Opciones</a>
//                         <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
//                             <a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${pedidoId}" data-id2="${clienId}" data-title="Asignar Proveedor"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>
//                             <a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${pedidoId}" data-id2="${clienId}" data-title="Publicar Pedidos"><span class="uil uil-feedback"></span> Publicar Pedido</a>
//                         </div>
//                         </div>
//                     </div>
//                 `);

//                     myOffcanvas.updateContent(tablaHTML);
//                     myOffcanvas.updateHeight("100vh");
//                     myOffcanvas.updateWidth("70%");
//                     myOffcanvas.updateClass("offcanvas-end");
//                 }
//                 myOffcanvas.show();
//             }

//             if (e.target.matches("#btn_detalle_trazabilidad_pedido") || e.target.matches("#btn_detalle_trazabilidad_pedido *")) {
//                 let Enlace = e.target.closest("#btn_detalle_trazabilidad_pedido");
//                 let PedidoId = Enlace.getAttribute("data-id");

//                 myOffcanvas.updateTitle(
//                     `<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad pedido`,
//                 );
//                 myOffcanvas.updateContent(`
//                     <div class="table-responsive scrollbar">
//                         <div class="timeline-wrapper bg-light rounded p-4">
//                             <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
//                             <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo"></div>
//                         </div>
//                         <div class="border-top border-translucent border-dashed pt-3"></div>
//                         <table class="table table-sm text-center" style="font-size: 11px;">
//                         <thead>
//                             <tr>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Observación</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Usuario</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha</th>
//                             <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
//                             </tr>
//                         </thead>
//                         <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
//                             <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                         </tbody>
//                         </table>
//                     </div>
//                 `);

//                 try {
//                     let formData = new FormData();
//                     formData.append("PedidoId", PedidoId);
//                     let response = await fetch(
//                         $("#base_url").val() + "torrecontrol/Listar_trazabilidad_pedido",
//                         { method: "POST", body: formData },
//                     );
//                     let data = await response.json();
//                     if (data) {
//                         let rows = "";
//                         data.forEach((servicio, index) => {
//                             rows += `<tr>
//                             <th scope="row">${index + 1}</th>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.observacion}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>
//                                 <a href="${$("#base_url").val()}${servicio.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
//                                     <i class="uil-file-download-alt"></i> Ver Documento
//                                 </a>
//                             </td>
//                             </tr>`;
//                         });
//                         document.getElementById(
//                             "tbody_detalle_trazabilidad_pedido",
//                         ).innerHTML = rows;
//                     }
//                 } catch (error) {
//                     console.error("Error al obtener trazabilidad:", error);
//                     document.getElementById(
//                         "tbody_detalle_trazabilidad_pedido",
//                     ).innerHTML =
//                         `<tr><td colspan="12" class="text-center text-danger">Error al cargar trazabilidad</td></tr>`;
//                 }

//                 // cargarLineaTiempo(PedidoId);
//                 myOffcanvas.show();
//             }

//             if (e.target.matches(`#btn-close-customOffcanvas${window.VENTANA}`) || e.target.matches(`#btn-close-customOffcanvas${window.VENTANA} *`)) {
//                 SatrackGPS.detener();
//                 sessionStorage.clear();
//                 actualizarContadorCarrito();
//                 const checkboxes = document.querySelectorAll(".servicioProveedor");
//                 checkboxes.forEach((element) => {
//                     element.checked = false;
//                 });
//                 window.ArrayDespachos = [];
//             }

//             if (e.target.matches("#btn_detalle_trazabilidad") || e.target.matches("#btn_detalle_trazabilidad *")) {
//                 let Enlace = e.target.closest("#btn_detalle_trazabilidad");
//                 let ServicioId = Enlace.getAttribute("data-ServicioId");
//                 let RecursoId = Enlace.getAttribute("data-RecursoId");

//                 myOffcanvas.updateTitle(
//                     `<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio`,
//                 );
//                 myOffcanvas.updateContent(`
//                 <div class="table-responsive scrollbar">
//                     <table class="table table-sm text-center" style="font-size: 11px;">
//                         <thead>
//                         <tr>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Ruta</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Sitio</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Latitud</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Longitud</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Fecha</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Nota</th>
//                             <th scope="col" style='width: auto; white-space: nowrap;'>Usuario</th>
//                         </tr>
//                         </thead>
//                         <tbody id="tbody_detalle_trazabilidad" class="text-center">
//                         <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
//                         </tbody>
//                     </table>
//                     </div>
//                     <div id="map" style="height: 600px; width: 100%;"></div>
//                 `);

//                 try {
//                     let formData = new FormData();
//                     formData.append("ServicioId", ServicioId);
//                     formData.append("RecursoId", RecursoId);
//                     let response = await fetch(
//                         $("#base_url").val() + "torrecontrol/detalle_trazabilidad_pedido",
//                         { method: "POST", body: formData },
//                     );
//                     let data = await response.json();
//                     if (data) {
//                         let rows = "";
//                         data.forEach((servicio, index) => {
//                             rows += `<tr>
//                             <th scope="row">${index + 1}</th>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ruta}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.latitud}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.longitud}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
//                             <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
//                             </tr>`;
//                         });
//                         document.getElementById("tbody_detalle_trazabilidad").innerHTML =
//                             rows;
//                         initMapTrazabilidad(data);
//                     }
//                 } catch (error) {
//                     console.error("Error al obtener trazabilidad recurso:", error);
//                     document.getElementById("tbody_detalle_trazabilidad").innerHTML =
//                         `<tr><td colspan="12" class="text-center text-danger">Error al cargar datos</td></tr>`;
//                 }
//                 myOffcanvas.show();
//             }

//             if (e.target.matches("#btn_cancelar_pedido") || e.target.matches("#btn_cancelar_pedido *")) {
//                 let boton = e.target.closest("#btn_cancelar_pedido");
//                 let SolicitudId = boton.getAttribute("data-id");
//                 try {
//                     const result = await Swal.fire({
//                         title: "¿Seguro?",
//                         text: "¿Desea cancelar la solicitud?",
//                         icon: "warning",
//                         showCancelButton: true,
//                         confirmButtonColor: "#3B71CA",
//                         cancelButtonColor: "#9FA6B2",
//                         confirmButtonText: "Aceptar",
//                         cancelButtonText: "Cancelar",
//                         customClass: { popup: "swal2-custom-font" },
//                     });
//                     if (result.isConfirmed) {
//                         let formData = new FormData();
//                         formData.append("SolicitudId", SolicitudId);
//                         let response = await fetch(
//                             $("#base_url").val() + "torrecontrol/cancelar_solicitud_pedido",
//                             { method: "POST", body: formData },
//                         );
//                         let data = await response.json();
//                         if (data && data.status === true) {
//                             await Swal.fire({
//                                 title: "Solicitud Cancelada",
//                                 text: data.message || "Cancelada exitosamente.",
//                                 icon: "success",
//                                 confirmButtonColor: "#3B71CA",
//                                 customClass: { popup: "swal2-custom-font" },
//                             });
//                             let fi =
//                                 document.getElementById(`campo-${window.VENTANA}-fecha_inicial`)
//                                     ?.value ?? "";
//                             let ff =
//                                 document.getElementById(`campo-${window.VENTANA}-fecha_final`)
//                                     ?.value ?? "";
//                             listar_pedidos_administrador(fi, ff);
//                         } else {
//                             await Swal.fire({
//                                 title: "Error",
//                                 text: data.message || "No se pudo cancelar.",
//                                 icon: "error",
//                                 confirmButtonColor: "#3B71CA",
//                                 customClass: { popup: "swal2-custom-font" },
//                             });
//                         }
//                     }
//                 } catch (error) {
//                     console.error("Error al cancelar solicitud:", error);
//                     await Swal.fire({
//                         title: "Error inesperado",
//                         text: "Ocurrió un error al cancelar.",
//                         icon: "error",
//                         confirmButtonColor: "#3B71CA",
//                         customClass: { popup: "swal2-custom-font" },
//                     });
//                 }
//             }

//             if (e.target.matches(`#btn_detalle`) || e.target.matches(`#btn_detalle *`)) {
//                 let Enlace = e.target.closest("#btn_detalle");
//                 let PedidoId = Enlace.getAttribute("data-SolicitudId");
//                 let ServicioId = Enlace.getAttribute("data-ServicioId");
//                 let RecursoId = Enlace.getAttribute("data-RecursoId");

//                 myOffcanvas.updateTitle(
//                     `<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad`,
//                 );
//                 myOffcanvas.updateContent(`
//                     <div class="table-responsive scrollbar">
//                         <div class="timeline-wrapper bg-light rounded p-4">
//                             <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
//                             <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo"></div>
//                         </div>
//                         <hr class="my-1 text-dark"><h6>Trazabilidad Pedido</h6><hr class="my-1 text-dark">
//                         <table class="table table-sm text-center" style="font-size: 11px;">
//                             <thead><tr>
//                                 <th>#</th><th>Tipo Trazabilidad</th><th>Observación</th><th>Usuario</th><th>Fecha</th><th>Soporte</th>
//                             </tr></thead>
//                             <tbody id="tbody_detalle_trazabilidad_pedido"><tr><td colspan="12" class="text-center">Cargando...</td></tr></tbody>
//                         </table>
//                     </div>
//                     <hr class="my-1 text-dark"><h6>Trazabilidad Recurso</h6><hr class="my-1 text-dark">
//                     <div class="table-responsive scrollbar">
//                         <table class="table table-sm text-center" style="font-size: 11px;">
//                             <thead><tr>
//                                 <th>#</th><th>Placa</th><th>Ruta</th><th>Sitio</th><th>Latitud</th><th>Longitud</th><th>Fecha</th><th>Nota</th><th>Usuario</th>
//                             </tr></thead>
//                             <tbody id="tbody_detalle_trazabilidad"><tr><td colspan="12" class="text-center">Cargando...</td></tr></tbody>
//                         </table>
//                     </div>
//                     <div id="map" style="height: 600px; width: 100%;"></div>
//                 `);

//                 try {
//                     let fd = new FormData();
//                     fd.append("PedidoId", PedidoId);
//                     let res = await fetch(
//                         $("#base_url").val() + "torrecontrol/Listar_trazabilidad_pedido",
//                         { method: "POST", body: fd },
//                     );
//                     let data = await res.json();
//                     if (data) {
//                         let rows = data
//                             .map(
//                                 (s, i) => `<tr>
//                             <th>${i + 1}</th>
//                             <td>${s.tipo_trazabilidad}</td><td>${s.observacion}</td><td>${s.usuario}</td><td>${s.fecha_registro}</td>
//                             <td><a href="${$("#base_url").val()}${s.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm px-1 py-0"><i class="uil-file-download-alt"></i> Ver</a></td>
//                         </tr>`,
//                             )
//                             .join("");
//                         document.getElementById(
//                             "tbody_detalle_trazabilidad_pedido",
//                         ).innerHTML = rows;
//                     }
//                 } catch (e) {
//                     document.getElementById(
//                         "tbody_detalle_trazabilidad_pedido",
//                     ).innerHTML =
//                         `<tr><td colspan="12" class="text-center text-danger">Error al cargar</td></tr>`;
//                 }

//                 try {
//                     let fd = new FormData();
//                     fd.append("ServicioId", ServicioId);
//                     fd.append("RecursoId", RecursoId);
//                     let res = await fetch(
//                         $("#base_url").val() + "torrecontrol/detalle_trazabilidad_pedido",
//                         { method: "POST", body: fd },
//                     );
//                     let data = await res.json();
//                     if (data) {
//                         let rows = data
//                             .map(
//                                 (s, i) => `<tr>
//                             <th>${i + 1}</th>
//                             <td>${s.placa_vehiculo}</td><td>${s.ruta}</td><td>${s.sitio_seguimiento}</td>
//                             <td>${s.latitud}</td><td>${s.longitud}</td><td>${s.fecha_hora_seguimiento}</td>
//                             <td>${s.nota_seguimiento}</td><td>${s.usuario_reporte}</td>
//                         </tr>`,
//                             )
//                             .join("");
//                         document.getElementById("tbody_detalle_trazabilidad").innerHTML =
//                             rows;
//                         initMapTrazabilidad(data);
//                     }
//                 } catch (e) {
//                     document.getElementById("tbody_detalle_trazabilidad").innerHTML =
//                         `<tr><td colspan="12" class="text-center text-danger">Error al cargar</td></tr>`;
//                 }

//                 // cargarLineaTiempo(PedidoId);
//                 myOffcanvas.show();
//             }

//             /* ══════════════════════════════════════════════════════════════
//                   |  HANDLER PRINCIPAL — btn_detalle_trazabilidad_pedidos
//                   |  Abre el offcanvas de detalle con ETA · SLA · Horarios · Mapa
//                   ══════════════════════════════════════════════════════════════ */
//             if (e.target.matches("#btn_detalle_trazabilidad_pedidos") || e.target.matches("#btn_detalle_trazabilidad_pedidos *")) {
//                 let BtnDetalle = e.target.closest("#btn_detalle_trazabilidad_pedidos");
//                 let SolicitudId = parseFloat(BtnDetalle.getAttribute("data-SolicitudId"));
//                 let LatitudOrigen = parseFloat(BtnDetalle.getAttribute("data-latitud_origen"));
//                 let LongitudOrigen = parseFloat(BtnDetalle.getAttribute("data-longitud_origen"));
//                 let LatitudDestino = parseFloat(BtnDetalle.getAttribute("data-latitud_destino"));
//                 let LongitudDestino = parseFloat(BtnDetalle.getAttribute("data-longitud_destino"));
//                 let ciudad_origen = BtnDetalle.getAttribute("data-ciudad_origen");
//                 let ciudad_destino = BtnDetalle.getAttribute("data-ciudad_destino");
//                 let fecha_creacion = BtnDetalle.getAttribute("data-fecha_creacion");
//                 let fecha_cargue = BtnDetalle.getAttribute("data-fecha_cargue");
//                 let fecha_entrega = BtnDetalle.getAttribute("data-fecha_entrega");
//                 let refPedido = BtnDetalle.getAttribute("data-refPedido");
//                 let tipoTrazabilidad = BtnDetalle.getAttribute("data-tipo_trazabilidad");

//                 document.getElementById("oc-estado-transito").innerHTML = tipoTrazabilidad;
//                 document.getElementById("oc-estado-transito-two").innerHTML = tipoTrazabilidad;

//                 const _placaRaw = BtnDetalle.getAttribute("data-placa");
//                 let placaVehiculo =
//                     _placaRaw && _placaRaw !== "null" ? _placaRaw : null;

//                 // Detener rastreo anterior
//                 SatrackGPS.detener();

//                 // Inyectar ID en paneles expandibles
//                 document.querySelectorAll(".oc-sec-panel").forEach((panel) => {
//                     panel.dataset.pedidoId = SolicitudId;
//                 });

//                 // Actualizar MAPA_CONFIG
//                 MAPA_CONFIG = window.MAPA_CONFIG = {
//                     origen: {
//                         lat: LatitudOrigen,
//                         lng: LongitudOrigen,
//                         label: ciudad_origen,
//                     },
//                     vehiculo: { label: placaVehiculo },
//                     destino: {
//                         lat: LatitudDestino,
//                         lng: LongitudDestino,
//                         label: ciudad_destino,
//                     },
//                     radioOrigen: 300,
//                     radioDestino: 250,
//                 };

//                 // Variables globales línea de tiempo
//                 window._tlSolicitudId = SolicitudId;
//                 window._tlFechaCreacion = fecha_creacion;
//                 window._tlFechaCargue = fecha_cargue;
//                 window._tlFechaEntrega = fecha_entrega;
//                 window._tlTipoTrazabilidad = tipoTrazabilidad;
//                 window._satrackPlacaActiva = placaVehiculo;
//                 window._salidaCargueProgramada = null;

//                 // Actualizar DOM cabecera
//                 const setEl = (id, val) => {
//                     const el = document.getElementById(id);
//                     if (el) el.innerHTML = val;
//                 };
//                 setEl("det-pedido", refPedido);
//                 setEl("det-pedido-hero", refPedido);
//                 setEl("ciudad-origen", ciudad_origen);
//                 setEl("ciudad-destino", ciudad_destino);

//                 // ── 1. Cargar horarios ANTES de que Maps responda ──
//                 TiemposLogisticos.cargarSoloHorarios(SolicitudId);

//                 // ── 2. Detalle proceso (conductor / placa) ──
//                 try {
//                     const fd = new FormData();
//                     fd.append("Solicitud", SolicitudId);
//                     const res = await fetch(
//                         $("#base_url").val() + "torrecontrol/detalle_proceso",
//                         { method: "POST", body: fd },
//                     );
//                     const data = await res.json();
//                     const sub = data.consulta_subasta[0];
//                     const safe = (v) => v ?? "";
//                     setEl("nc-conductor", safe(sub?.nombre_conductor));
//                     setEl("pc-placa", safe(sub?.referencia));
//                     setEl("pl-titulo", safe(sub?.referencia));
//                     setEl("mnc-conductor", safe(sub?.nombre_conductor));
//                     setEl("mpc-placa", safe(sub?.referencia));
//                     setEl(
//                         "fp-planta-origen",
//                         sub?.fecha_inicio && sub?.hora_inicio
//                             ? `${sub.fecha_inicio} ${sub.hora_inicio}`
//                             : "",
//                     );
//                 } catch (err) {
//                     console.error("Error detalle proceso:", err);
//                 }

//                 // ── 3. Trazabilidad real del pedido ──
//                 try {
//                     const fdTraz = new FormData();
//                     fdTraz.append("PedidoId", SolicitudId);
//                     const resTraz = await fetch(
//                         $("#base_url_api").val() + "Trazabilidad_pedidos",
//                         {
//                             method: "POST",
//                             headers: { "X-API-KEY": "nexos_nacional2026@*" },
//                             body: fdTraz,
//                         },
//                     );
//                     const jsonTraz = await resTraz.json();
//                     window._trazabilidadPedido =
//                         jsonTraz.numero === 200 && Array.isArray(jsonTraz.data)
//                             ? jsonTraz.data
//                             : [];
//                 } catch (e) {
//                     console.warn("Sin trazabilidad:", e);
//                     window._trazabilidadPedido = [];
//                 }

//                 // ── 4. Línea de tiempo ──
//                 actualizarLineaTiempo(
//                     SolicitudId,
//                     fecha_creacion,
//                     fecha_cargue,
//                     fecha_entrega,
//                     0,
//                     tipoTrazabilidad,
//                 );
//             }

//             // ══════════════════════════════════════════════════════════════
//             //  refrescarOffcanvas — re-ejecuta todo el flujo de datos del
//             //  offcanvas usando las variables window.* ya guardadas.
//             //  La llaman: btnActualizar y (si se necesita) cualquier otro.
//             // ══════════════════════════════════════════════════════════════
//             window.refrescarOffcanvas = async function refrescarOffcanvas() {
//                 const SolicitudId = window._tlSolicitudId;
//                 const fecha_creacion = window._tlFechaCreacion;
//                 const fecha_cargue = window._tlFechaCargue;
//                 const fecha_entrega = window._tlFechaEntrega;
//                 const tipoTrazabilidad = window._tlTipoTrazabilidad;
//                 const placaVehiculo = window._satrackPlacaActiva;

//                 if (!SolicitudId) return; // offcanvas no inicializado aún

//                 ocLoaderShow();

//                 const setEl = (id, val) => {
//                     const el = document.getElementById(id);
//                     if (el) el.innerHTML = val ?? '';
//                 };

//                 // ── 1. Horarios ──
//                 TiemposLogisticos.cargarSoloHorarios(SolicitudId);

//                 // ── 2. Detalle proceso (conductor / placa) ──
//                 try {
//                     const fd = new FormData();
//                     fd.append('Solicitud', SolicitudId);
//                     const res = await fetch($('#base_url').val() + 'torrecontrol/detalle_proceso', { method: 'POST', body: fd });
//                     const data = await res.json();
//                     const sub = data.consulta_subasta[0];
//                     const safe = (v) => v ?? '';
//                     setEl('nc-conductor', safe(sub?.nombre_conductor));
//                     setEl('pc-placa', safe(sub?.referencia));
//                     setEl('pl-titulo', safe(sub?.referencia));
//                     setEl('mnc-conductor', safe(sub?.nombre_conductor));
//                     setEl('mpc-placa', safe(sub?.referencia));
//                     setEl('fp-planta-origen',
//                         sub?.fecha_inicio && sub?.hora_inicio
//                             ? `${sub.fecha_inicio} ${sub.hora_inicio}` : '');
//                 } catch (err) {
//                     console.error('refrescarOffcanvas - detalle_proceso:', err);
//                 }

//                 // ── 3. Trazabilidad ──
//                 try {
//                     const fdTraz = new FormData();
//                     fdTraz.append('PedidoId', SolicitudId);
//                     const resTraz = await fetch($('#base_url_api').val() + 'Trazabilidad_pedidos', {
//                         method: 'POST',
//                         headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
//                         body: fdTraz,
//                     });
//                     const jsonTraz = await resTraz.json();
//                     window._trazabilidadPedido =
//                         jsonTraz.numero === 200 && Array.isArray(jsonTraz.data)
//                             ? jsonTraz.data : [];
//                 } catch (e) {
//                     console.warn('refrescarOffcanvas - trazabilidad:', e);
//                     window._trazabilidadPedido = [];
//                 }

//                 // ── 4. Línea de tiempo ──
//                 actualizarLineaTiempo(SolicitudId, fecha_creacion, fecha_cargue, fecha_entrega, 0, tipoTrazabilidad);

//                 // ── 5. Mapa: geocercas + ruta + Satrack ──
//                 if (ocMap) {
//                     google.maps.event.trigger(ocMap, 'resize');
//                     if (MAPA_CONFIG.origen) ocMap.setCenter(MAPA_CONFIG.origen);
//                     await cargarGeocercasPedido(SolicitudId);
//                     if (placaVehiculo) {
//                         SatrackGPS.detener();
//                         SatrackGPS.iniciar(placaVehiculo, ocMap, vehiculoMarker, directionsRenderer, infoWin);
//                     }
//                 }

//                 ocLoaderHide();
//             };

//             // ── actualizarInfoRuta: recibe legs de Google Maps ──
//             // Expuesta en window para que SatrackGPS._recalcularRuta pueda llamarla.
//             //
//             // @param {google.maps.DirectionsLeg[]} legs   - Tramos de la ruta calculada.
//             // @param {'gps'|'remitente'} fuente           - Origen del cálculo:
//             //   'gps'       → posición real del vehículo (Satrack)
//             //   'remitente' → coordenadas de origen del pedido (sin placa asignada)
//             window.actualizarInfoRuta = function actualizarInfoRuta(legs, fuente) {
//                 // fuente por defecto según si hay placa activa
//                 const _fuente = fuente ?? (window._satrackPlacaActiva ? 'gps' : 'remitente');

//                 let totalDistanciaM = 0;
//                 let totalDuracionS = 0;
//                 legs.forEach((leg) => {
//                     totalDistanciaM += leg.distance.value;
//                     totalDuracionS += leg.duration.value;
//                 });

//                 // Valores crudos de Maps (sin buffer) — se envian al backend tal cual.
//                 // El backend aplica su propio 28% internamente.
//                 const duracionCrudaS = totalDuracionS;
//                 const distanciaCrudaM = totalDistanciaM;

//                 // ── MÁRGEN DE CONTINGENCIA (28%) — solo para badges visuales ──
//                 // Google Maps nunca incluye buffer; se aplica aqui unicamente
//                 // para mostrar distancia/duracion en pantalla.
//                 totalDistanciaM = Math.round(distanciaCrudaM * 1.28);
//                 totalDuracionS = Math.round(duracionCrudaS * 1.28);

//                 // ── Distancia ──
//                 const km = (totalDistanciaM / 1000).toFixed(1);
//                 const distanciaText = km >= 1 ? `${km} km` : `${totalDistanciaM} m`;

//                 // ── Duración ──
//                 const horas = Math.floor(totalDuracionS / 3600);
//                 const minutos = Math.floor((totalDuracionS % 3600) / 60);
//                 let duracionText = "";
//                 if (horas > 0) duracionText += `${horas} h `;
//                 if (minutos > 0) duracionText += `${minutos} min`;
//                 if (!duracionText) duracionText = "< 1 min";

//                 // ── Etiqueta de origen según fuente ──
//                 // 'gps'       → 📡 Desde GPS  (posición real del vehículo)
//                 // 'remitente' → 📦 Desde Origen (coordenadas del remitente)
//                 const origenLabel = _fuente === 'gps'
//                     ? '📡 Desde GPS'
//                     : '📦 Desde Origen';

//                 // ── Actualizar badge Distancia ──
//                 const elDist = document.getElementById("ocMapDistancia");
//                 if (elDist) {
//                     elDist.innerHTML =
//                         `${distanciaText} <small style="font-weight:400;opacity:.75;font-size:.75em">${origenLabel}</small>`;
//                 }

//                 // ── Actualizar badge Duración ──
//                 const elDur = document.getElementById("ocMapDuracion");
//                 if (elDur) {
//                     elDur.innerHTML =
//                         `${duracionText} <small style="font-weight:400;opacity:.75;font-size:.75em">${origenLabel}</small>`;
//                 }

//                 // ── Actualizar timestamp de última actualización ──
//                 const elTs = document.getElementById("ocMapTs");
//                 if (elTs) {
//                     elTs.textContent = new Date().toLocaleTimeString("es-CO", {
//                         hour: "2-digit", minute: "2-digit", second: "2-digit",
//                     });
//                 }

//                 // ══ INTEGRACIÓN TIEMPOS LOGÍSTICOS ══
//                 // Cuando Maps responde, llamamos al endpoint con la duración total bruta.
//                 // El servicio aplica el buffer configurado, ajusta horarios y devuelve
//                 // ETA · SLA · estado de la operación.
//                 const pedidoId = window._tlSolicitudId;
//                 if (pedidoId) {
//                     TiemposLogisticos.cargar(pedidoId, duracionCrudaS);
//                 }
//             }

//             // ── cargarGeocercasPedido ──
//             async function cargarGeocercasPedido(pedidoId) {
//                 if (!ocMap) return;
//                 try {
//                     const baseUrl = document.getElementById("base_url_api").value;
//                     const formData = new FormData();
//                     formData.append("PedidoId", pedidoId);
//                     const res = await fetch(baseUrl + "Geocercas_pedido", {
//                         method: "POST",
//                         headers: { "X-API-KEY": "nexos_nacional2026@*" },
//                         body: formData,
//                     });
//                     const json = await res.json();
//                     if (json.numero !== 200) return;

//                     const { remitente, destinatario, todos_puntos } = json.data;
//                     const { AdvancedMarkerElement, PinElement } =
//                         await google.maps.importLibrary("marker");
//                     const { Circle } = await google.maps.importLibrary("maps");
//                     const { DirectionsService, TravelMode } =
//                         await google.maps.importLibrary("routes");

//                     if (remitente?.lat && remitente?.lng)
//                         MAPA_CONFIG.origen = {
//                             lat: remitente.lat,
//                             lng: remitente.lng,
//                             label: remitente.nombre,
//                         };
//                     if (destinatario?.lat && destinatario?.lng)
//                         MAPA_CONFIG.destino = {
//                             lat: destinatario.lat,
//                             lng: destinatario.lng,
//                             label: destinatario.nombre,
//                         };

//                     // Calcular ruta origen->destino SIEMPRE.
//                     // Con placa: pinta la ruta visual Y llama actualizarInfoRuta('remitente')
//                     //   como valor inicial. Satrack lo sobreescribe con 'gps' cuando
//                     //   obtenga la posicion real del vehiculo.
//                     // Sin placa: es el calculo definitivo.
//                     if (MAPA_CONFIG.origen?.lat && MAPA_CONFIG.destino?.lat && directionsRenderer) {
//                         await new Promise((resolve) => {
//                             new DirectionsService().route(
//                                 {
//                                     origin: {
//                                         lat: MAPA_CONFIG.origen.lat,
//                                         lng: MAPA_CONFIG.origen.lng,
//                                     },
//                                     destination: {
//                                         lat: MAPA_CONFIG.destino.lat,
//                                         lng: MAPA_CONFIG.destino.lng,
//                                     },
//                                     travelMode: TravelMode.DRIVING,
//                                 },
//                                 (result, status) => {
//                                     if (status === 'OK') {
//                                         directionsRenderer.setDirections(result);
//                                         // Siempre actualizar badges y tarjetas SLA.
//                                         // Con placa: Satrack sobreescribira con 'gps' cuando llegue.
//                                         actualizarInfoRuta(result.routes[0].legs, 'remitente');
//                                     } else {
//                                         console.warn('Directions error (origen->destino):', status);
//                                     }
//                                     resolve();
//                                 },
//                             );
//                         });
//                     }

//                     function animarCirculo(circle, radioBase) {
//                         let creciendo = true,
//                             radio = radioBase,
//                             opacidad = 0.7;
//                         setInterval(() => {
//                             if (creciendo) {
//                                 radio += radioBase * 0.08;
//                                 opacidad -= 0.04;
//                                 if (radio >= radioBase * 1.6) creciendo = false;
//                             } else {
//                                 radio -= radioBase * 0.08;
//                                 opacidad += 0.04;
//                                 if (radio <= radioBase) creciendo = true;
//                             }
//                             circle.setRadius(radio);
//                             circle.setOptions({ strokeOpacity: Math.max(0.1, opacidad) });
//                         }, 80);
//                     }

//                     if (remitente?.lat && remitente?.lng) {
//                         const pinRem = new PinElement({
//                             background: "#0369a1",
//                             borderColor: "#0c4a6e",
//                             glyphColor: "#fff",
//                             glyph: "🏭",
//                             scale: 1.2,
//                         });
//                         new AdvancedMarkerElement({
//                             map: ocMap,
//                             position: { lat: remitente.lat, lng: remitente.lng },
//                             title: `Remitente: ${remitente.nombre}`,
//                             content: pinRem.element,
//                         });
//                         remitente.geocercas.forEach((g) => {
//                             if (!g.lat || !g.lng) return;
//                             const c = new Circle({
//                                 map: ocMap,
//                                 center: { lat: g.lat, lng: g.lng },
//                                 radius: 25,
//                                 strokeColor: "#0369a1",
//                                 strokeOpacity: 0.7,
//                                 strokeWeight: 2,
//                                 fillColor: "#0369a1",
//                                 fillOpacity: 0.06,
//                             });
//                             animarCirculo(c, 25);
//                         });
//                     }

//                     if (destinatario?.lat && destinatario?.lng) {
//                         const pinDes = new PinElement({
//                             background: "#16a34a",
//                             borderColor: "#14532d",
//                             glyphColor: "#fff",
//                             glyph: "🏪",
//                             scale: 1.2,
//                         });
//                         new AdvancedMarkerElement({
//                             map: ocMap,
//                             position: { lat: destinatario.lat, lng: destinatario.lng },
//                             title: `Destinatario: ${destinatario.nombre}`,
//                             content: pinDes.element,
//                         });
//                         destinatario.geocercas.forEach((g) => {
//                             if (!g.lat || !g.lng) return;
//                             const c = new Circle({
//                                 map: ocMap,
//                                 center: { lat: g.lat, lng: g.lng },
//                                 radius: 1500,
//                                 strokeColor: "#16a34a",
//                                 strokeOpacity: 0.7,
//                                 strokeWeight: 2,
//                                 fillColor: "#16a34a",
//                                 fillOpacity: 0.06,
//                             });
//                             animarCirculo(c, 1500);
//                         });
//                     }

//                     todos_puntos.forEach((punto) => {
//                         if (punto.esPedido || !punto.lat || !punto.lng) return;
//                         const pin = new PinElement({
//                             background: "#94a3b8",
//                             borderColor: "#475569",
//                             glyphColor: "#fff",
//                             glyph: "📍",
//                             scale: 0.8,
//                         });
//                         new AdvancedMarkerElement({
//                             map: ocMap,
//                             position: { lat: punto.lat, lng: punto.lng },
//                             title: punto.nombre,
//                             content: pin.element,
//                         });
//                     });
//                 } catch (ex) {
//                     console.warn("Error cargando geocercas:", ex);
//                 }
//             }

//             // ── initOcMap ──
//             async function initOcMap() {
//                 if (!MAPA_CONFIG.origen || !MAPA_CONFIG.destino) {
//                     setTimeout(initOcMap, 200);
//                     return;
//                 }
//                 const { Map, InfoWindow } = await google.maps.importLibrary("maps");
//                 const { AdvancedMarkerElement, PinElement } =
//                     await google.maps.importLibrary("marker");
//                 const { DirectionsRenderer } =
//                     await google.maps.importLibrary("routes");
//                 const mapDiv = document.getElementById("ocMap");
//                 if (!mapDiv) return;

//                 ocMap = new Map(mapDiv, {
//                     center: MAPA_CONFIG.origen,
//                     zoom: 6,
//                     mapId: "DEMO_MAP_ID",
//                     mapTypeId: "roadmap",
//                     disableDefaultUI: false,
//                     zoomControl: true,
//                     streetViewControl: false,
//                     mapTypeControl: false,
//                     fullscreenControl: true,
//                 });

//                 const pinVehiculo = new PinElement({
//                     background: "#ea580c",
//                     borderColor: "#9a3412",
//                     glyphColor: "#fff",
//                     glyph: "🚛",
//                     scale: 1.3,
//                 });
//                 vehiculoMarker = new AdvancedMarkerElement({
//                     map: ocMap,
//                     position: null,
//                     title: MAPA_CONFIG.vehiculo?.label ?? "",
//                     content: pinVehiculo.element,
//                 });

//                 directionsRenderer = new DirectionsRenderer({
//                     map: ocMap,
//                     suppressMarkers: true,
//                     polylineOptions: {
//                         strokeColor: "#0369a1",
//                         strokeWeight: 4,
//                         strokeOpacity: 0.75,
//                     },
//                 });

//                 infoWin = new InfoWindow({
//                     content: `<div style="font-family:sans-serif;font-size:12px;min-width:180px;"><div style="font-weight:700;color:#0f172a;margin-bottom:6px">🚛 Cargando…</div></div>`,
//                 });
//                 vehiculoMarker.addListener("click", () =>
//                     infoWin.open({ anchor: vehiculoMarker, map: ocMap }),
//                 );

//                 await cargarGeocercasPedido(window._tlSolicitudId);

//                 const placa = window._satrackPlacaActiva;
//                 if (placa)
//                     SatrackGPS.iniciar(
//                         placa,
//                         ocMap,
//                         vehiculoMarker,
//                         directionsRenderer,
//                         infoWin,
//                     );

//                 ocLoaderHide();
//             }

//             // ── Helpers loader ──
//             function ocLoaderShow() {
//                 const el = document.getElementById('ocLoader');
//                 if (el) el.classList.remove('oc-loader-hidden');
//             }

//             function ocLoaderHide() {
//                 const el = document.getElementById('ocLoader');
//                 if (el) el.classList.add('oc-loader-hidden');
//             }

//             // ── Listener offcanvas ──
//             const offcanvasEl = document.getElementById("offcanvasPedido");
//             if (offcanvasEl) {
//                 // Mostrar loader cada vez que se abre el offcanvas
//                 offcanvasEl.addEventListener("show.bs.offcanvas", () => {
//                     ocLoaderShow();
//                 });

//                 // ── btnActualizar: re-ejecuta todo el flujo ──
//                 const btnActualizar = document.getElementById('btnActualizar');
//                 if (btnActualizar) {
//                     btnActualizar.addEventListener('click', () => {
//                         window.refrescarOffcanvas();
//                     });
//                 }


//                 offcanvasEl.addEventListener("shown.bs.offcanvas", () => {
//                     if (!mapLoaded) {
//                         mapLoaded = true;
//                         setTimeout(initOcMap, 100);
//                     } else if (ocMap) {
//                         setTimeout(async () => {
//                             google.maps.event.trigger(ocMap, "resize");
//                             ocMap.setCenter(MAPA_CONFIG.vehiculo ?? MAPA_CONFIG.origen);
//                             await cargarGeocercasPedido(window._tlSolicitudId);
//                             const placa = window._satrackPlacaActiva;
//                             if (placa) {
//                                 SatrackGPS.detener();
//                                 SatrackGPS.iniciar(
//                                     placa,
//                                     ocMap,
//                                     vehiculoMarker,
//                                     directionsRenderer,
//                                     infoWin,
//                                 );
//                             }
//                             ocLoaderHide();
//                         }, 100);
//                     }
//                 });
//             }
//         }); // cierre document.addEventListener('click')

//         // ══ VARIABLES DEL MAPA — scope de initScript ══
//         let ocMap = null;
//         let vehiculoMarker = null;
//         let directionsRenderer = null;
//         let infoWin = null;
//         let mapLoaded = false;
//         window.MAPA_CONFIG = {};
//         let MAPA_CONFIG = window.MAPA_CONFIG;

//         // Timestamp live
//         const ocMapTs = document.getElementById("ocMapTs");
//         function ocTick() {
//             if (ocMapTs)
//                 ocMapTs.textContent = new Date().toLocaleTimeString("es-CO", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                 });
//         }
//         ocTick();
//         setInterval(ocTick, 1000);

//         // ══ KPI CARDS — clic para filtrar ══
//         document.querySelectorAll(".kpi-resumen").forEach(function (card) {
//             card.addEventListener("click", function () {
//                 document.querySelectorAll(".kpi-resumen").forEach(function (c) {
//                     c.classList.remove("active");
//                 });
//                 this.classList.add("active");
//                 const filtro = this.dataset.filtro;
//                 const fi = document.getElementById("fecha_inicial")?.value ?? "";
//                 const ff = document.getElementById("fecha_final")?.value ?? "";
//                 if (filtro === "todos") {
//                     listar_pedidos_administrador(fi, ff, "", "", "", "");
//                 } else {
//                     listar_pedidos_administrador(
//                         fi,
//                         ff,
//                         filtro,
//                         "",
//                         "",
//                         "estado_publicacion",
//                     );
//                 }
//             });
//         });

//         // ── Botón Limpiar filtros ──
//         const btnLimpiar = document.getElementById("btn-limpiar");
//         if (btnLimpiar) {
//             btnLimpiar.addEventListener("click", function () {
//                 ["f-modalidad", "f-estado-pub", "f-estado-traz"].forEach((id) => {
//                     const el = document.getElementById(id);
//                     if (el) el.value = "";
//                 });
//                 const fi = document.getElementById("fecha_inicial");
//                 const ff = document.getElementById("fecha_final");
//                 if (fi) fi.value = "";
//                 if (ff) ff.value = "";
//                 document
//                     .querySelectorAll(".kpi-resumen")
//                     .forEach((c) => c.classList.remove("active"));
//                 const tbody = document.getElementById("tbl_administrar_pedidos");
//                 if (tbody)
//                     tbody.innerHTML = `<tr><td colspan="25" class="text-center" style="padding:50px;color:var(--slate-400);">
//                     <i class="bi bi-inbox" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
//                     Filtros limpiados — realice una nueva consulta</td></tr>`;
//                 const badge = document.getElementById("badge-total-tabla");
//                 if (badge) badge.textContent = "0 registros";
//                 const pagBar = document.getElementById("pagination-bar");
//                 if (pagBar) pagBar.style.display = "none";
//                 sessionStorage.removeItem("carrito");
//                 actualizarContadorCarrito();
//                 [
//                     "kpi-total",
//                     "kpi-pendiente",
//                     "kpi-publicado",
//                     "kpi-asignado",
//                     "kpi-cancelado",
//                 ].forEach((id) => {
//                     const el = document.getElementById(id);
//                     if (el) el.textContent = "0";
//                 });
//             });
//         }

//         // ── Select All checkboxes ──
//         $("#selectAll").on("change", function () {
//             let isChecked = $(this).prop("checked");
//             $(".pedido-checkbox").prop("checked", isChecked);
//             let carrito = isChecked ? obtenerTodosLosPedidos() : [];
//             sessionStorage.setItem("carrito", JSON.stringify(carrito));
//             actualizarContadorCarrito();
//         });

//         $(document).on("change", ".pedido-checkbox", function () {
//             let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
//             let modalidadActual = $(this).data("id15");
//             let modalidadesEnCarrito = carrito.map((item) => item.dataId15);
//             let modalidadesUnicas = [...new Set(modalidadesEnCarrito)];

//             if (
//                 $(this).prop("checked") &&
//                 modalidadesUnicas.length > 0 &&
//                 !modalidadesUnicas.includes(modalidadActual)
//             ) {
//                 Swal.fire({
//                     icon: "warning",
//                     title: "Modalidades diferentes",
//                     text: "No puedes seleccionar pedidos con diferentes modalidades.",
//                 });
//                 $(this).prop("checked", false);
//                 return;
//             }

//             let pedido = {
//                 id: $(this).val(),
//                 dataId: $(this).data("id"),
//                 dataId2: $(this).data("id2"),
//                 dataId3: $(this).data("id3"),
//                 dataId4: $(this).data("id4"),
//                 dataId5: $(this).data("id5"),
//                 dataId6: $(this).data("id6"),
//                 dataId7: $(this).data("id7"),
//                 dataId8: $(this).data("id8"),
//                 dataId9: $(this).data("id9"),
//                 dataId10: $(this).data("id10"),
//                 dataId11: $(this).data("id11"),
//                 dataId12: $(this).data("id12"),
//                 dataId13: $(this).data("id13"),
//                 dataId14: $(this).data("id14"),
//                 dataId15: modalidadActual,
//             };

//             if ($(this).prop("checked")) {
//                 if (!carrito.some((item) => item.id === pedido.id))
//                     carrito.push(pedido);
//             } else {
//                 carrito = carrito.filter((item) => item.id !== pedido.id);
//             }

//             let rowId = $(this).data("row");
//             let row = document.getElementById(rowId);
//             if (row)
//                 row.style.backgroundColor = $(this).is(":checked") ? "#d8ddf9" : "";

//             $("#selectAll").prop(
//                 "checked",
//                 $(".pedido-checkbox:checked").length === $(".pedido-checkbox").length,
//             );
//             sessionStorage.setItem("carrito", JSON.stringify(carrito));

//             let btnCarrito = document.getElementById("btn-carrito-pedidos");
//             if (btnCarrito) {
//                 btnCarrito.style.display = carrito.length > 0 ? "" : "none";
//                 btnCarrito.setAttribute("data-idPedido", pedido.id);
//                 btnCarrito.setAttribute("data-idCliente", pedido.dataId14);
//             }
//             actualizarContadorCarrito();
//         });

//         document.addEventListener("input", async (e) => {
//             if (
//                 e.target.matches(`#campo-${window.VENTANA}-filtro`) ||
//                 e.target.matches(`#campo-${window.VENTANA}-filtro *`)
//             ) {
//                 let filtro = document
//                     .getElementById(`campo-${window.VENTANA}-filtro`)
//                     .value.trim();
//                 let fi =
//                     document.getElementById(`campo-${window.VENTANA}-fecha_inicial`)
//                         ?.value ?? "";
//                 let ff =
//                     document.getElementById(`campo-${window.VENTANA}-fecha_final`)
//                         ?.value ?? "";
//                 listar_pedidos_administrador(fi, ff, filtro, "", "", "");
//             }
//         });

//         // ── Botón Excel ──
//         document.getElementById("exportar_excel").addEventListener("click", function () {
//             var table = document.getElementById("table1");
//             var wb = XLSX.utils.table_to_book(table);
//             Array.from(table.getElementsByTagName("td")).forEach(function (td) {
//                 const text = td.innerText.trim();
//                 if (/^\d{4}-\d{2}-\d{2}$/.test(text)) td.setAttribute("data-t", "s");
//             });
//             const fechaActual = new Date().toISOString().slice(0, 10);
//             XLSX.writeFile(wb, `Informe de Pedidos ${fechaActual}.xlsx`);
//         });
//     };

//     /* ─────────────────────────────────────────────────────────────────
//          ocToggle — abre/cierra paneles del offcanvas
//       ───────────────────────────────────────────────────────────────── */
//     function ocToggle(panelId, btnId, operacion) {
//         const panel = document.getElementById(panelId);
//         const btn = document.getElementById(btnId);
//         const isOpen = panel.classList.contains("open");
//         document
//             .querySelectorAll(".oc-sec-panel")
//             .forEach((p) => p.classList.remove("open"));
//         document
//             .querySelectorAll(".oc-tl-expand-btn")
//             .forEach(
//                 (b) => (b.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Detalle'),
//             );
//         if (!isOpen) {
//             panel.classList.add("open");
//             btn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Ocultar';
//             const pedidoId = panel.dataset.pedidoId;
//             if (pedidoId) cargarTareasOC(pedidoId, operacion, panelId);
//             else console.warn("⚠️ ocToggle: el panel no tiene data-pedido-id");
//             setTimeout(
//                 () => panel.scrollIntoView({ behavior: "smooth", block: "nearest" }),
//                 60,
//             );
//         }
//     }

//     /* ─────────────────────────────────────────────────────────────────
//          cargarTareasOC — carga tareas del panel expandible
//       ───────────────────────────────────────────────────────────────── */
//     async function cargarTareasOC(pedidoId, operacion, panelId) {
//         const panel = document.getElementById(panelId);
//         if (!panel) return;
//         const subtlEl = panel.querySelector(".col-lg-7 .oc-sub-tl");
//         const contenedorTabla = document.getElementById(
//             `tabla-tiempos-${operacion}`,
//         );
//         if (subtlEl)
//             subtlEl.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px"><i class="bi bi-arrow-repeat me-1"></i>Cargando tareas…</div>`;

//         try {
//             const baseUrl = document.getElementById("base_url_api").value;
//             const formData = new FormData();
//             formData.append("PedidoId", pedidoId);
//             formData.append("Operacion", operacion);
//             const response = await fetch(baseUrl + "Listar_tareas_oc", {
//                 method: "POST",
//                 headers: { "X-API-KEY": "nexos_nacional2026@*" },
//                 body: formData,
//             });
//             if (!response.ok) throw new Error(`HTTP ${response.status}`);
//             const json = await response.json();
//             if (json.numero !== 200) {
//                 if (subtlEl)
//                     subtlEl.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px">${json.mensaje}</div>`;
//                 return;
//             }
//             const tareas = json.data;
//             if (Array.isArray(tareas) && tareas.length > 0) {
//                 const tareasConTiempos = calcularTiempos(tareas, window._tlFechaCargue);
//                 renderTareasOC(panel, tareasConTiempos, pedidoId, operacion);
//                 const tituloMapa = {
//                     CARGUE: "Planta Origen",
//                     DESCARGUE: "Planta Destino",
//                     TRANSITO: "Tránsito",
//                 };
//                 renderTablaResumen(
//                     contenedorTabla,
//                     tareasConTiempos,
//                     tituloMapa[operacion] ?? operacion,
//                 );
//             } else {
//                 if (subtlEl)
//                     subtlEl.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px"><i class="bi bi-inbox me-1"></i>Sin tareas registradas.</div>`;
//                 if (contenedorTabla)
//                     contenedorTabla.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px">Sin datos disponibles</div>`;
//             }
//         } catch (error) {
//             console.error("❌ cargarTareasOC:", error);
//             if (subtlEl)
//                 subtlEl.innerHTML = `<div style="padding:.8rem;color:#ef4444;font-size:12px"><i class="bi bi-exclamation-triangle me-1"></i>Error al cargar tareas: ${error.message}</div>`;
//         }
//     }

//     function renderTareasOC(panel, tareas, pedidoId, operacion) {
//         const micropasos = tareas
//             .map(
//                 (t) => `
//             <div class="oc-micro-step ${t.estado === "COMPLETADO" ? "oc-ms-done" : t.estado === "EN GESTION" ? "oc-ms-active" : ""}">${t.nombre.split(" ")[0]}</div>
//         `,
//             )
//             .join("");
//         const subItems = tareas
//             .map((t) => _buildSubItem(t, pedidoId, operacion))
//             .join("");
//         const microEl = panel.querySelector(".oc-micro");
//         const subtlEl = panel.querySelector(".col-lg-7 .oc-sub-tl");
//         if (microEl) microEl.innerHTML = micropasos;
//         if (subtlEl) subtlEl.innerHTML = subItems;
//     }

//     async function completarTareaOC(
//         tareaId,
//         pedidoId,
//         nuevoEstado,
//         operacion,
//         panelId,
//     ) {
//         try {
//             const baseUrl = document.getElementById("base_url_api").value;
//             const formData = new FormData();
//             formData.append("TareaId", tareaId);
//             formData.append("PedidoId", pedidoId);
//             formData.append("Estado", nuevoEstado);
//             formData.append("Operacion", operacion);
//             const response = await fetch(
//                 baseUrl + "torrecontrol/Completar_tarea_oc",
//                 { method: "POST", body: formData },
//             );
//             if (!response.ok) throw new Error(`HTTP ${response.status}`);
//             const data = await response.json();
//             if (data.success) {
//                 await cargarTareasOC(pedidoId, operacion, panelId);
//             } else {
//                 alert(
//                     "No se pudo actualizar la tarea: " +
//                     (data.message || "Error desconocido"),
//                 );
//             }
//         } catch (error) {
//             console.error("❌ completarTareaOC:", error);
//             alert("Error al completar tarea: " + error.message);
//         }
//     }

//     function _buildSubItem(t, pedidoId, operacion) {
//         const iconMap = {
//             "EN GESTION": "bi-arrow-repeat",
//             "SIN INICIAR": "bi-clock",
//             COMPLETADO: "bi-check-lg",
//             CANCELADO: "bi-x-lg",
//             PAUSADO: "bi-pause-circle",
//         };
//         const badgeMap = {
//             "EN GESTION": "oc-sub-badge-active",
//             "SIN INICIAR": "oc-sub-badge-pending",
//             COMPLETADO: "oc-sub-badge-done",
//             CANCELADO: "oc-sub-badge-pending",
//             PAUSADO: "oc-sub-badge-pending",
//         };
//         const badgeLabel = {
//             "EN GESTION": "EN GESTIÓN",
//             "SIN INICIAR": "SIN INICIAR",
//             COMPLETADO: "COMPLETADO",
//             CANCELADO: "CANCELADO",
//             PAUSADO: "PAUSADO",
//         };
//         const nodoClase =
//             {
//                 "EN GESTION": "active",
//                 "SIN INICIAR": "pending",
//                 COMPLETADO: "done",
//                 CANCELADO: "risk",
//                 PAUSADO: "pending",
//             }[t.estado] ?? "pending";

//         let tiempos = "";
//         if (t._tiempos) {
//             const {
//                 fechaInicioCalc,
//                 fechaReal,
//                 textoAsignado,
//                 textoTranscurrido,
//                 alDia,
//                 pct,
//                 realMinutos,
//             } = t._tiempos;
//             let badgeColor, badgeText;
//             if (t.estado === "COMPLETADO") {
//                 //badgeColor = "#16a34a";
//                 badgeColor = realMinutos > 1 ? "#16a34a" : "#dc2626";
//                 badgeText = realMinutos;
//             } else if (!alDia) {
//                 badgeColor = "#dc2626";
//                 badgeText = textoTranscurrido;
//             } else if (pct >= 80) {
//                 badgeColor = "#f59e0b";
//                 badgeText = textoTranscurrido;
//             } else {
//                 badgeColor = "#0369a1";
//                 badgeText = textoAsignado;
//             }
//             const badgeHtml = `<span style="font-size:8px;font-weight:700;letter-spacing:.5px;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:8px;background:${badgeColor}18;color:${badgeColor};border:1px solid ${badgeColor}40;white-space:nowrap">⏱ ${badgeText}</span>`;
//             const progHtml = fechaInicioCalc
//                 ? `<span class="oc-sub-time">Prog: ${fechaInicioCalc}</span>`
//                 : "";
//             const realHtml = fechaReal
//                 ? `<span class="oc-sub-time">Real: ${fechaReal}</span>`
//                 : "";
//             tiempos = [progHtml, realHtml, badgeHtml].filter(Boolean).join("");
//         } else {
//             const parts = [
//                 t.tiempo_programado
//                     ? `<span class="oc-sub-time">Prog: ${t.tiempo_programado}</span>`
//                     : "",
//                 t.tiempo_real
//                     ? `<span class="oc-sub-time">Real: ${t.tiempo_real}</span>`
//                     : "",
//                 t.delta
//                     ? `<span class="d ${t.delta_pos ? "d-pos" : "d-neg"}">${t.delta}</span>`
//                     : "",
//             ].filter(Boolean);
//             tiempos = parts.join("");
//         }

//         let gestionesHtml = "";
//         if (Array.isArray(t.gestiones) && t.gestiones.length > 0) {
//             const dotColorMap = {
//                 ACTIVO: "#0369a1",
//                 "EN GESTION": "#ea580c",
//                 "SIN INICIAR": "#94a3b8",
//                 COMPLETADO: "#16a34a",
//                 CANCELADO: "#dc2626",
//                 PAUSADO: "#f59e0b",
//             };
//             const items = t.gestiones
//                 .map((g) => {
//                     const dotColor = dotColorMap[g.estado] ?? "#94a3b8";
//                     const estadoBadge = `<span style="font-size:8px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:1px 5px;border-radius:5px;margin-left:4px;background:${dotColor}18;color:${dotColor};border:1px solid ${dotColor}40">${g.estado ?? ""}</span>`;
//                     const docHtml =
//                         g.documento &&
//                             g.nombre_archivo &&
//                             g.nombre_archivo !== "Sin_evidencia"
//                             ? `<a href="${$("#base_url").val()}${g.documento}${g.nombre_archivo}" target="_blank" class="oc-gestion-doc"><i class="bi bi-file-earmark-arrow-down"></i>${g.nombre_archivo}</a>`
//                             : "";
//                     return `<div class="oc-ev">
//                     <div class="oc-ev-dot" style="background:${dotColor}"></div>
//                     <div style="min-width:0">
//                         <div class="oc-ev-time">${g.fecha ?? "—"} · ${g.usuario ?? "—"}</div>
//                         <div class="oc-ev-label">${g.observacion ?? "—"}</div>
//                         ${docHtml}
//                     </div>
//                 </div>`;
//                 })
//                 .join("");
//             gestionesHtml = `<div class="oc-gestion-wrap"><div class="oc-gestion-header"><i class="bi bi-journal-text me-1"></i>Gestiones (${t.gestiones.length})</div>${items}</div>`;
//         }
//         // ${estadoBadge}

//         return `
//             <div class="oc-sub-item">
//                 <div class="oc-sub-node ${nodoClase}"><i class="bi ${iconMap[t.estado] || "bi-clock"}"></i></div>
//                 <div class="flex-grow-1">
//                     <div class="d-flex justify-content-between align-items-start gap-1 flex-wrap">
//                         <span class="oc-sub-label">${t.nombre}</span>
//                         <span class="oc-sub-badge ${badgeMap[t.estado] ?? "oc-sub-badge-pending"}">${badgeLabel[t.estado] ?? t.estado}</span>
//                     </div>
//                     ${t.meta ? `<div class="oc-sub-meta">${t.meta}</div>` : ""}
//                     ${tiempos ? `<div class="d-flex gap-2 mt-1 flex-wrap">${tiempos}</div>` : ""}
//                     ${gestionesHtml}
//                 </div>
//             </div>`;
//     }

//     function _panelIdDesdeOperacion(operacion) {
//         return (
//             {
//                 CARGUE: "ocPanelOrigen",
//                 TRANSITO: "ocPanelTransito",
//                 DESCARGUE: "ocPanelDestino",
//             }[operacion] || "ocPanelOrigen"
//         );
//     }

//     function ocMapMode(mode, el) {
//         document
//             .querySelectorAll(".oc-map-btn")
//             .forEach((b) => b.classList.remove("active"));
//         el.classList.add("active");
//     }

//     function ocCenter() {
//         const btn = document.getElementById("ocBtnCenter");
//         btn.innerHTML = '<i class="bi bi-check-lg"></i> Centrado';
//         setTimeout(() => {
//             btn.innerHTML = '<i class="bi bi-crosshair"></i> Centrar';
//         }, 1500);
//     }

//     /* ─────────────────────────────────────────────────────────────────
//          initMapTrazabilidad — mapa para el offcanvas de trazabilidad
//       ───────────────────────────────────────────────────────────────── */
//     async function initMapTrazabilidad(data) {
//         const { Map } = await google.maps.importLibrary("maps");
//         const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
//         const { DirectionsService, DirectionsRenderer } =
//             await google.maps.importLibrary("routes");
//         const { Geocoder } = await google.maps.importLibrary("geocoding");
//         const map = new Map(document.getElementById("map"), {
//             center: { lat: 4.5709, lng: -74.2973 },
//             zoom: 5.5,
//             gestureHandling: "greedy",
//             mapId: "db5350020424d6c4",
//         });
//         const geocoder = new Geocoder();
//         const obtenerNombreLugar = (lat, lng) =>
//             new Promise((res) => {
//                 geocoder.geocode({ location: { lat, lng } }, (results, status) =>
//                     res(
//                         status === "OK" && results[0]
//                             ? results[0].formatted_address
//                             : "Lugar desconocido",
//                     ),
//                 );
//             });
//         for (const punto of data) {
//             const lat = parseFloat(punto.latitud),
//                 lng = parseFloat(punto.longitud);
//             const nombreLugar = await obtenerNombreLugar(lat, lng);
//             new AdvancedMarkerElement({
//                 map,
//                 position: { lat, lng },
//                 title: `${nombreLugar}\n${punto.fecha_hora}`,
//             });
//         }
//         const directionsService = new DirectionsService();
//         const directionsRenderer = new DirectionsRenderer({ map });
//         const waypoints = data.slice(1, data.length - 1).map((p) => ({
//             location: { lat: parseFloat(p.latitud), lng: parseFloat(p.longitud) },
//             stopover: true,
//         }));
//         directionsService.route(
//             {
//                 origin: {
//                     lat: parseFloat(data[0].latitud),
//                     lng: parseFloat(data[0].longitud),
//                 },
//                 destination: {
//                     lat: parseFloat(data[data.length - 1].latitud),
//                     lng: parseFloat(data[data.length - 1].longitud),
//                 },
//                 waypoints,
//                 travelMode: google.maps.TravelMode.DRIVING,
//                 optimizeWaypoints: false,
//             },
//             (result, status) => {
//                 if (status === "OK") directionsRenderer.setDirections(result);
//             },
//         );
//     }

//     /* ─────────────────────────────────────────────────────────────────
//          listar_pedidos_administrador
//       ───────────────────────────────────────────────────────────────── */
//     async function listar_pedidos_administrador(
//         fecha_inicial,
//         fecha_final,
//         filtro,
//         valor,
//         trazabilidad,
//         identificador,
//     ) {
//         let dato = new FormData();
//         dato.append("fecha_inicial", fecha_inicial);
//         dato.append("fecha_final", fecha_final);
//         dato.append("filtro", filtro ?? "");
//         dato.append("valor", valor ?? "");
//         dato.append("trazabilidad", trazabilidad ?? "");
//         dato.append("identificador", identificador ?? "");
//         dato.append("filtros", "");
//         try {
//             const response = await fetch(
//                 $("#base_url").val() + "torrecontrol/listar_administracion_pedidos",
//                 { method: "POST", body: dato, cache: "no-cache" },
//             );
//             const data = await response.json();
//             if (data) {
//                 let tbody = document.getElementById("tbl_administrar_pedidos");
//                 tbody.innerHTML = "";
//                 let col_estatus_publicacion = "",
//                     col_estatus_asignacion = "",
//                     btn_publicacion = "",
//                     btn_cancelacion = "",
//                     col_prioridad = "";
//                 let btn_removeAsignacion = "",
//                     checkbox_carrito = "",
//                     col_estatus_proceso = "",
//                     col_estatus_trazabilidad = "";
//                 let btn_detalle_proceso = "",
//                     btn_detalle_trazabilidad = "",
//                     btn_trazabilidad_pedido = "",
//                     btn_prioridad = "";

//                 data.forEach((element) => {
//                     const fila = document.createElement("tr");
//                     fila.id = `fila_${element.numdoc_solicitud}`;

//                     if (estadosPublicacion[element.estado_publicaion])
//                         col_estatus_publicacion = createBadge(
//                             element.estado_publicaion,
//                             estadosPublicacion[element.estado_publicaion],
//                         );
//                     if (estadosAsignacion[element.estado_asignacion])
//                         col_estatus_asignacion = createBadge(
//                             element.estado_asignacion,
//                             estadosAsignacion[element.estado_asignacion],
//                         );
//                     if (estadosPrioridad[element.estado_prioridad])
//                         col_prioridad = createBadge(
//                             element.estado_prioridad,
//                             estadosPrioridad[element.estado_prioridad],
//                         );

//                     const estadoPublicacion = element.estado_publicaion;
//                     const estadoAsignacion = element.estado_asignacion;

//                     if (
//                         estadoPublicacion === "Publicado" &&
//                         estadoAsignacion === "Asignado"
//                     ) {
//                         checkbox_carrito = ``;
//                         btn_removeAsignacion = ``;
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                         btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
//                     } else if (
//                         estadoPublicacion === "Publicado" &&
//                         estadoAsignacion === "Pendiente"
//                     ) {
//                         checkbox_carrito = ``;
//                         btn_removeAsignacion = ``;
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                         btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
//                     } else if (
//                         (estadoPublicacion === "Pendiente Respuesta" &&
//                             estadoAsignacion === "Pendiente") ||
//                         (estadoPublicacion === "Aceptado" &&
//                             estadoAsignacion === "Ganador") ||
//                         (estadoPublicacion === "Completado" &&
//                             estadoAsignacion === "Completado")
//                     ) {
//                         checkbox_carrito = ``;
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                     } else {
//                         btn_detalle_proceso = ``;
//                         btn_removeAsignacion = ``;
//                         btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
//                         if (
//                             element.estado_publicaion === "Cancelado" &&
//                             element.estado_asignacion === "Cancelado"
//                         ) {
//                             btn_cancelacion = ``;
//                         } else {
//                             btn_cancelacion = `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-x"></span> Cancelar Pedido</a>`;
//                         }
//                         checkbox_carrito = `
//                         <input class="form-check-input pedido-checkbox" id="check_pedido_${element.numdoc_solicitud}"
//                             type="checkbox" value="${element.numdoc_solicitud}"
//                             data-id="${element.nombre_cliente}" data-id2="${element.ciudad_origen}" data-id3="${element.ciudad_destino}"
//                             data-id4="${element.referencia_pedido}" data-id5="${element.fecha_cargue}" data-id6="${element.fecha_entrega}"
//                             data-id7="${element.unidades}" data-id8="${element.lote}" data-id9="${element.num_estibas}"
//                             data-id10="${element.peso_neto_kg}" data-id11="${element.peso_bruto_kg}"
//                             data-id12="${element.producto}" data-id13="${element.presentacion}" data-id14="${element.cliente}" data-id15="${element.modalidad}"
//                             style="scale: 1.2;" data-row="fila_${element.numdoc_solicitud}">`;
//                     }

//                     if (estadosProceso[element.estado_proceso]) {
//                         if (
//                             element.estado_publicaion === "Cancelado" &&
//                             element.estado_asignacion === "Cancelado"
//                         ) {
//                             col_estatus_proceso = createBadge("Cancelado", "danger");
//                             checkbox_carrito = ``;
//                             btn_prioridad = ``;
//                             btn_detalle_proceso = ``;
//                             btn_removeAsignacion = ``;
//                             btn_publicacion = ``;
//                         } else {
//                             col_estatus_proceso = createBadge(
//                                 element.estado_proceso,
//                                 estadosProceso[element.estado_proceso],
//                             );
//                         }
//                     }

//                     if (
//                         element.tipo_trazabilidad === "Completado" ||
//                         (element.tipo_trazabilidad === "Iniciado" &&
//                             element.estado_proceso_pedido === "Completado")
//                     ) {
//                         btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
//                     } else if (
//                         element.tipo_trazabilidad === "Pendiente Iniciar" ||
//                         element.tipo_trazabilidad === "Sin Asignar"
//                     ) {
//                         btn_detalle_trazabilidad = ``;
//                     }

//                     if (
//                         element.tipo_trazabilidad === "Iniciado" &&
//                         element.estado_proceso_pedido === "Postulado"
//                     ) {
//                         const estado = obtenerEstadoTrazabilidad(
//                             element.estado_proceso_pedido,
//                         );
//                         col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
//                     } else {
//                         const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
//                         col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
//                     }

//                     const columnaNundocSolicitud = document.createElement("td");
//                     columnaNundocSolicitud.innerHTML = `
//                         <div class="dropdown">
//                             <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none menu_tabla" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-row-id="${fila.id}"> N°${element.referencia_pedido}</a>
//                             <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
//                             ${btn_detalle_proceso}
//                             ${btn_removeAsignacion}
//                             <div class="dropdown-divider"></div>
//                             <a class="dropdown-item fw-bold" href="#" id="btn_detalle" data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Trazabilidad</a>
//                             <a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedidos" data-bs-toggle="offcanvas"
//                                 data-bs-target="#offcanvasPedido" style="font-family:'Space Grotesk',sans-serif;font-weight:600"
//                                 data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"
//                                 data-latitud_origen="${element.latitud_origen}" data-longitud_origen="${element.longitud_origen}"
//                                 data-latitud_destino="${element.latitud_destino}" data-longitud_destino="${element.longitud_destino}"
//                                 data-ciudad_origen="${element.ciudad_origen}" data-ciudad_destino="${element.ciudad_destino}"
//                                 data-refPedido="${element.referencia_pedido}" data-fecha_creacion="${element.fecha} ${element.hora}"
//                                 data-fecha_cargue="${element.fecha_cargue}" data-fecha_entrega="${element.fecha_entrega}"
//                                 data-placa="${element.referencia}" data-tipo_trazabilidad="${element.tipo_trazabilidad}">
//                                 <span class="uil uil-transaction"></span> Trazabilidad Pedidos
//                             </a>
//                             ${btn_cancelacion}
//                             ${btn_prioridad}
//                             </div>
//                         </div>
//                     `;

//                     const mkTd = (html, extra = "") => {
//                         const td = document.createElement("td");
//                         td.innerHTML = html;
//                         td.style.cssText = `width:auto;white-space:nowrap;${extra}`;
//                         return td;
//                     };
//                     const mkTdC = (html) => {
//                         const td = mkTd(html);
//                         td.style.textAlign = "center";
//                         return td;
//                     };

//                     fila.appendChild(mkTdC(checkbox_carrito));
//                     fila.appendChild(mkTd(element.modalidad));
//                     fila.appendChild(columnaNundocSolicitud);
//                     fila.appendChild(mkTd(col_estatus_trazabilidad));
//                     fila.appendChild(mkTd(element.ciudad_origen));
//                     fila.appendChild(mkTd(element.remitente));
//                     fila.appendChild(mkTd(element.ciudad_destino));
//                     fila.appendChild(mkTd(element.destinatario));
//                     fila.appendChild(mkTd(element.cod_producto));
//                     fila.appendChild(mkTd(element.producto));
//                     fila.appendChild(mkTd(element.peso_neto_kg + " KG"));
//                     fila.appendChild(mkTd(element.peso_bruto_kg + " KG"));
//                     fila.appendChild(mkTd(element.presentacion));
//                     fila.appendChild(mkTd(element.unidades));
//                     fila.appendChild(mkTd(element.lote));
//                     fila.appendChild(mkTd(element.num_estibas));
//                     fila.appendChild(mkTd(element.fecha_cargue));
//                     fila.appendChild(mkTd(element.fecha_entrega));
//                     fila.appendChild(mkTd(element.tipo_vehiculo ?? "-"));
//                     fila.appendChild(mkTd(element.costo ?? "-"));
//                     fila.appendChild(mkTd(element.tarifa ?? "-"));
//                     fila.appendChild(mkTd(element.fecha_retiro_contenedor ?? "-"));
//                     fila.appendChild(mkTd(element.booking ?? "-"));
//                     fila.appendChild(mkTd(element.unidad_transporte ?? "-"));
//                     fila.appendChild(mkTd(element.observaciones ?? "-"));

//                     tbody.appendChild(fila);
//                 });

//                 document.querySelectorAll(".menu_tabla").forEach((toggle) => {
//                     toggle.addEventListener("click", function () {
//                         const rowId = this.getAttribute("data-row-id");
//                         const row = document.getElementById(rowId);
//                         document
//                             .querySelectorAll("tr")
//                             .forEach((r) => r.classList.remove("selected-row"));
//                         if (row) row.classList.add("selected-row");
//                     });
//                 });

//                 actualizarKpis(data);
//                 const badgeTabla = document.getElementById("badge-total-tabla");
//                 if (badgeTabla) badgeTabla.textContent = data.length + " registros";
//                 const pagBar = document.getElementById("pagination-bar");
//                 if (pagBar) {
//                     pagBar.style.display = "";
//                     const setEl = (id, v) => {
//                         const n = document.getElementById(id);
//                         if (n) n.textContent = v;
//                     };
//                     setEl("pag-total", data.length);
//                     setEl("pag-desde", data.length > 0 ? 1 : 0);
//                     setEl("pag-hasta", data.length);
//                 }
//             }
//         } catch (error) {
//             console.error("Error en listar_pedidos_administrador:", error);
//         }
//     }

//     /* ─────────────────────────────────────────────────────────────────
//          Helpers generales
//       ───────────────────────────────────────────────────────────────── */
//     function createBadge(text, type) {
//         return `<span class="badge badge-phoenix fs-10 badge-phoenix-${type}"><span class="badge-label">${text}</span></span>`;
//     }

//     window.estadosPublicacion = {
//         Pendiente: "secondary",
//         Publicado: "info",
//         Cancelado: "secondary",
//         Aceptado: "success",
//         "Pendiente Respuesta": "warning",
//         Completado: "success",
//     };

//     window.estadosAsignacion = {
//         Pendiente: "secondary",
//         Asignado: "info",
//         Cancelado: "secondary",
//         Aceptado: "success",
//         Ganador: "success",
//         Completado: "success",
//     };

//     window.estadosPrioridad = { Prioritaria: "warning", "No Marcada": "info" };
//     window.estadosProceso = {
//         Pendiente: "secondary",
//         Asignación: "warning",
//         Publicación: "danger",
//         Completado: "success",
//     };

//     function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
//         let textoTrazabilidad = tipoTrazabilidad;
//         if (tipoTrazabilidad === "Completado") textoTrazabilidad = "Asignado";
//         else if (
//             tipoTrazabilidad === "Cancelado" ||
//             tipoTrazabilidad === "Rechzado"
//         )
//             textoTrazabilidad = "Sin Asignar";
//         return {
//             texto: textoTrazabilidad,
//             color: window.estadosTrazabilidad[textoTrazabilidad] || "secondary",
//         };
//     }

//     window.estadosTrazabilidad = {
//         "Llegada Cargue": "info",
//         Cargue: "info",
//         "Salida Cargue": "info",
//         "Inicio Ruta": "primary",
//         Transito: "primary",
//         "Llegada Descargue": "info",
//         Descargue: "info",
//         "Salida Descargue": "info",
//         "Pendiente Iniciar": "danger",
//         "Sin Asignar": "secondary",
//         Iniciado: "primary",
//         Asignado: "success",
//         Postulado: "warning",
//         Cancelado: "danger",
//     };

//     window.style = document.createElement("style");
//     style.textContent = `.selected-row { background-color: #d8ddf9 !important; }`;
//     document.head.appendChild(style);

//     /* ─────────────────────────────────────────────────────────────────
//          cargarLineaTiempo (offcanvas clásico de trazabilidad)
//       ───────────────────────────────────────────────────────────────── */
//     // async function cargarLineaTiempo(PedidoId) {
//     //     try {
//     //         let formData = new FormData();
//     //         formData.append("PedidoId", PedidoId);
//     //         let response = await fetch(
//     //             $("#base_url").val() + "torrecontrol/Linea_Tiempo_pedidos",
//     //             { method: "POST", body: formData },
//     //         );
//     //         let data = await response.json();
//     //         const etapasOrdenadas = [
//     //             "Asignado",
//     //             "Llega vehículo",
//     //             "En cargue",
//     //             "En ruta",
//     //             "Entregado",
//     //         ];
//     //         const contenedor = document.getElementById("lineaTiempo");
//     //         contenedor.innerHTML = "";
//     //         contenedor.className = "d-flex justify-content-between position-relative";
//     //         let ultimaIndex = -1;
//     //         const etapas = data.etapas;
//     //         const etapaConFecha = Object.values(etapas).find(
//     //             (e) => e.fecha_entrega_estimada,
//     //         );
//     //         const fechaEstimada = etapaConFecha?.fecha_entrega_estimada || null;
//     //         document.getElementById("FechaEstimada").textContent =
//     //             `Fecha estimada entrega: ${fechaEstimada ?? "No disponible"}`;

//     //         etapasOrdenadas.forEach((etapa, index) => {
//     //             const info = data.etapas[etapa];
//     //             const step = document.createElement("div");
//     //             step.className = "step";
//     //             step.dataset.etapa = etapa;
//     //             const circle = document.createElement("div");
//     //             circle.className = "circle";
//     //             if (info) {
//     //                 circle.classList.add("completed");
//     //                 ultimaIndex = index;
//     //                 circle.setAttribute("data-bs-toggle", "tooltip");
//     //                 circle.setAttribute("data-bs-placement", "bottom");
//     //                 circle.setAttribute(
//     //                     "title",
//     //                     `📅 ${info.fecha_trazabilidad}\n📝 ${info.observacion}`,
//     //                 );
//     //             }
//     //             step.appendChild(circle);
//     //             const small = document.createElement("small");
//     //             small.textContent = etapa;
//     //             step.appendChild(small);
//     //             if (info) {
//     //                 const fecha = document.createElement("div");
//     //                 fecha.className = "info-extra";
//     //                 fecha.textContent = info.fecha_trazabilidad;
//     //                 step.appendChild(fecha);
//     //             }
//     //             contenedor.appendChild(step);
//     //         });

//     //         const steps = contenedor.querySelectorAll(".step");
//     //         if (steps.length && ultimaIndex >= 0) {
//     //             const primer = steps[0].offsetLeft + steps[0].offsetWidth / 2;
//     //             const ultimo =
//     //                 steps[ultimaIndex].offsetLeft + steps[ultimaIndex].offsetWidth / 2;
//     //             const linea = document.createElement("div");
//     //             linea.className = "progreso-linea";
//     //             linea.style.left = `${primer}px`;
//     //             linea.style.width = `${ultimo - primer}px`;
//     //             contenedor.appendChild(linea);
//     //             if (ultimaIndex + 1 < steps.length) {
//     //                 const siguiente =
//     //                     steps[ultimaIndex + 1].offsetLeft +
//     //                     steps[ultimaIndex + 1].offsetWidth / 2;
//     //                 const lineaActual = document.createElement("div");
//     //                 lineaActual.className = "progreso-linea-actual";
//     //                 lineaActual.style.left = `${ultimo}px`;
//     //                 lineaActual.style.width = `${siguiente - ultimo}px`;
//     //                 contenedor.appendChild(lineaActual);
//     //             }
//     //             steps[ultimaIndex]
//     //                 .querySelector(".circle")
//     //                 .classList.remove("completed");
//     //             steps[ultimaIndex].querySelector(".circle").classList.add("current");
//     //         }
//     //         const tooltipTriggerList = document.querySelectorAll(
//     //             '[data-bs-toggle="tooltip"]',
//     //         );
//     //         tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
//     //     } catch (error) {
//     //         console.error("Error en línea de tiempo:", error);
//     //     }
//     // }

//     function actualizarContadorCarrito() {
//         let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
//         let btn = document.getElementById("btn-carrito-pedidos");
//         let contador = document.getElementById("carrito-contador");
//         if (!btn) return;
//         btn.style.display = carrito.length > 0 ? "" : "none";
//         if (contador) contador.textContent = carrito.length;
//     }

//     // function actualizarKpis(data) {
//     //     if (!Array.isArray(data)) return;
//     //     const c = {
//     //         todos: data.length,
//     //         Pendiente: 0,
//     //         Publicado: 0,
//     //         Asignado: 0,
//     //         Cancelado: 0,
//     //     };
//     //     data.forEach((el) => {
//     //         if (el.estado_publicaion === "Pendiente") c.Pendiente++;
//     //         if (
//     //             ["Publicado", "Pendiente Respuesta", "Aceptado"].includes(
//     //                 el.estado_publicaion,
//     //             )
//     //         )
//     //             c.Publicado++;
//     //         if (["Asignado", "Ganador"].includes(el.estado_asignacion)) c.Asignado++;
//     //         if (el.estado_publicaion === "Cancelado") c.Cancelado++;
//     //     });
//     //     const set = (id, v) => {
//     //         const el = document.getElementById(id);
//     //         if (el) el.textContent = v;
//     //     };
//     //     set("kpi-total", c.todos);
//     //     set("kpi-pendiente", c.Pendiente);
//     //     set("kpi-publicado", c.Publicado);
//     //     set("kpi-asignado", c.Asignado);
//     //     set("kpi-cancelado", c.Cancelado);
//     // }

//     // ── Instancia del donut chart (singleton) ──
//     let _donutChart = null;

//     function actualizarKpis(data) {
//         if (!Array.isArray(data)) return;

//         const c = {
//             todos: data.length,
//             Pendiente: 0,
//             Publicado: 0,
//             Asignado: 0,
//             Cancelado: 0,
//         };

//         data.forEach((el) => {
//             if (el.estado_publicaion === 'Pendiente') c.Pendiente++;
//             if (['Publicado', 'Pendiente Respuesta', 'Aceptado'].includes(el.estado_publicaion)) c.Publicado++;
//             if (['Asignado', 'Ganador'].includes(el.estado_asignacion)) c.Asignado++;
//             if (el.estado_publicaion === 'Cancelado') c.Cancelado++;
//         });

//         // ── Actualizar badges de las cards ──
//         const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
//         set('kpi-total', c.todos);
//         set('kpi-pendiente', c.Pendiente);
//         set('kpi-publicado', c.Publicado);
//         set('kpi-asignado', c.Asignado);
//         set('kpi-cancelado', c.Cancelado);

//         // ── Donut chart ──
//         const canvas = document.getElementById('kpi-donut-chart');
//         if (!canvas) return;

//         const labels = ['Pendientes', 'Publicados', 'Asignados', 'Cancelados'];
//         const values = [c.Pendiente, c.Publicado, c.Asignado, c.Cancelado];
//         const colors = ['#f59e0b', '#06b6d4', '#22c55e', '#ef4444'];
//         const borders = ['#d97706', '#0891b2', '#16a34a', '#dc2626'];

//         if (_donutChart) {
//             // Actualizar datos sin re-crear el chart
//             _donutChart.data.datasets[0].data = values;
//             _donutChart.update('active');
//             return;
//         }

//         // Primera vez: cargar Chart.js desde CDN si no está disponible
//         const initChart = () => {
//             _donutChart = new Chart(canvas, {
//                 type: 'doughnut',
//                 data: {
//                     labels,
//                     datasets: [{
//                         data: values,
//                         backgroundColor: colors,
//                         borderColor: borders,
//                         borderWidth: 2,
//                         hoverOffset: 8,
//                     }],
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: true,
//                     cutout: '68%',
//                     plugins: {
//                         legend: {
//                             position: 'right',
//                             labels: {
//                                 font: { size: 12, family: "'Inter', sans-serif" },
//                                 color: '#475569',
//                                 padding: 16,
//                                 usePointStyle: true,
//                                 pointStyle: 'circle',
//                                 generateLabels: (chart) => {
//                                     const ds = chart.data.datasets[0];
//                                     const tot = ds.data.reduce((a, b) => a + b, 0);
//                                     return chart.data.labels.map((lbl, i) => ({
//                                         text: `${lbl}  ${ds.data[i]}  (${tot ? Math.round(ds.data[i] / tot * 100) : 0}%)`,
//                                         fillStyle: ds.backgroundColor[i],
//                                         strokeStyle: ds.borderColor[i],
//                                         lineWidth: 1,
//                                         pointStyle: 'circle',
//                                         hidden: false,
//                                         index: i,
//                                     }));
//                                 },
//                             },
//                         },
//                         tooltip: {
//                             callbacks: {
//                                 label: (ctx) => {
//                                     const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
//                                     const pct = tot ? Math.round(ctx.parsed / tot * 100) : 0;
//                                     return `  ${ctx.label}: ${ctx.parsed} pedidos (${pct}%)`;
//                                 },
//                             },
//                         },
//                     },
//                     // Texto central: total
//                     animation: { animateRotate: true, duration: 600 },
//                 },
//                 plugins: [{
//                     id: 'centerText',
//                     beforeDraw(chart) {
//                         const { ctx, chartArea } = chart;
//                         if (!chartArea) return;
//                         const cx = (chartArea.left + chartArea.right) / 2;
//                         const cy = (chartArea.top + chartArea.bottom) / 2;
//                         const tot = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
//                         ctx.save();
//                         ctx.textAlign = 'center';
//                         ctx.textBaseline = 'middle';
//                         ctx.font = `700 28px 'JetBrains Mono', monospace`;
//                         ctx.fillStyle = '#0f172a';
//                         ctx.fillText(tot, cx, cy - 8);
//                         ctx.font = `500 11px 'Inter', sans-serif`;
//                         ctx.fillStyle = '#94a3b8';
//                         ctx.fillText('pedidos', cx, cy + 14);
//                         ctx.restore();
//                     },
//                 }],
//             });
//         };

//         if (typeof Chart !== 'undefined') {
//             initChart();
//         } else {
//             const s = document.createElement('script');
//             s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
//             s.onload = initChart;
//             document.head.appendChild(s);
//         }
//     }

//     /* ─────────────────────────────────────────────────────────────────
//          parsearFecha — normaliza string de fecha a Date
//       ───────────────────────────────────────────────────────────────── */
//     const parsearFecha = (f) => {
//         if (!f) return null;
//         const normalizada = f.replace(
//             /^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/,
//             "$1T$2",
//         );
//         const dt = new Date(normalizada);
//         return isNaN(dt.getTime()) ? null : dt;
//     };

//     /* ─────────────────────────────────────────────────────────────────
//          actualizarLineaTiempo — línea de tiempo del offcanvas principal
//       ───────────────────────────────────────────────────────────────── */
//     async function actualizarLineaTiempo(
//         solicitudId,
//         fechaCreacion,
//         fechaCargue,
//         fechaEntrega,
//         etaSegundos,
//         tipoTrazabilidad = "",
//     ) {
//         const ahora = new Date();

//         // IDs de las actividades clave que controlan los nodos
//         const ID_LLEGADA_CARGUE = 1;
//         const ID_PLANTA_ORIGEN = 4;
//         const ID_TRANSITO = 121;
//         const ID_PLANTA_DESTINO = 11;
//         const ID_ENTREGA_FINAL = 122;

//         // ── Consultar hitos de la línea de tiempo ──
//         // Endpoint dedicado: solo devuelve los 5 hitos clave con su estado
//         // y fecha real (última gestión) + fecha estimada (fecha_base_calc).
//         // No depende de Listar_tareas_oc ni de ocToggle.
//         let hitos = {};
//         try {
//             const baseUrl = (document.getElementById('base_url_api')?.value ?? '').replace(/\/$/, '');
//             const fd = new FormData();
//             fd.append('PedidoId', solicitudId);
//             const r = await fetch(baseUrl + '/Hitos_linea_tiempo', {
//                 method: 'POST',
//                 headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
//                 body: fd,
//             });
//             const j = await r.json();
//             if (j.numero === 200 && j.data) hitos = j.data;
//             window._hitosLineaTiempo = hitos;
//         } catch (e) {
//             console.warn('actualizarLineaTiempo - hitos:', e);
//         }

//         // parseFecha debe declararse antes de los helpers que la usan
//         const parseFecha = (f) => {
//             if (!f) return null;
//             const n = f.replace(
//                 /^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/,
//                 "$1T$2",
//             );
//             const d = new Date(n);
//             return isNaN(d.getTime()) ? null : d;
//         };

//         // Helpers de hitos
//         const completado = (id) => hitos[id]?.completado === true;
//         const fechaHitoReal = (id) => hitos[id]?.fecha_real ? parseFecha(hitos[id].fecha_real) : null;
//         const fechaHitoEst = (id) => hitos[id]?.fecha_est ? parseFecha(hitos[id].fecha_est) : null;

//         const fmt = (d) =>
//             d
//                 ? d.toLocaleString("es-CO", {
//                     day: "2-digit",
//                     month: "short",
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     hour12: false,
//                 })
//                 : "—";
//         const fmtDelta = (ms) => {
//             const min = Math.round(ms / 60000);
//             const abs = Math.abs(min);
//             const str =
//                 abs >= 60 ? `${Math.floor(abs / 60)}h ${abs % 60}m` : `${abs} min`;
//             return { str: (min >= 0 ? "+" : "-") + str, tarde: min > 0 };
//         };
//         const setNodo = (n, estado) => {
//             const el = document.getElementById(`tl-node-${n}`);
//             if (!el) return;
//             el.classList.remove(
//                 "oc-node-done",
//                 "oc-node-active",
//                 "oc-node-pending",
//                 "oc-node-risk",
//             );
//             el.classList.add(
//                 {
//                     done: "oc-node-done",
//                     active: "oc-node-active",
//                     pending: "oc-node-pending",
//                     risk: "oc-node-risk",
//                 }[estado] ?? "oc-node-pending",
//             );
//         };
//         const setTime = (n, txt) => {
//             const el = document.getElementById(`tl-time-${n}`);
//             if (el) el.textContent = txt;
//         };
//         const setDelta = (n, ms) => {
//             const el = document.getElementById(`tl-delta-${n}`);
//             if (!el) return;
//             if (ms === null) {
//                 el.style.display = "none";
//                 return;
//             }
//             const { str, tarde } = fmtDelta(ms);
//             el.textContent = str;
//             el.className = `d ${tarde ? "d-neg" : "d-pos"}`;
//             el.style.display = "";
//         };

//         const dtCargue = parseFecha(fechaCargue);
//         const dtEntrega = parseFecha(fechaEntrega);


//         // Fechas REALES de cada hito (última gestión cuando COMPLETADO)
//         const dtLlegadaCargue = completado(ID_LLEGADA_CARGUE) ? fechaHitoReal(ID_LLEGADA_CARGUE) : null;
//         const dtSalidaCargue = completado(ID_PLANTA_ORIGEN) ? fechaHitoReal(ID_PLANTA_ORIGEN) : null;
//         const dtInicioRuta = completado(ID_TRANSITO) ? fechaHitoReal(ID_TRANSITO) : null;
//         const dtLlegadaDes = completado(ID_PLANTA_DESTINO) ? fechaHitoReal(ID_PLANTA_DESTINO) : null;
//         const dtSalidaDes = completado(ID_ENTREGA_FINAL) ? fechaHitoReal(ID_ENTREGA_FINAL) : null;
//         // Alias compatibilidad
//         const dtCargueReal = dtLlegadaCargue;
//         const dtTransito = dtInicioRuta;
//         const dtDescargueReal = dtLlegadaDes;

//         // Fechas ESTIMADAS de cada hito (fecha_base_calc de la actividad)
//         const estLlegadaCargue = fechaHitoEst(ID_LLEGADA_CARGUE) ?? dtCargue;
//         const estSalidaCargue = fechaHitoEst(ID_PLANTA_ORIGEN) ?? window._salidaCargueProgramada;
//         const estTransito = fechaHitoEst(ID_TRANSITO) ?? null;
//         const estLlegadaDes = fechaHitoEst(ID_PLANTA_DESTINO) ?? dtEntrega;
//         const estSalidaDes = fechaHitoEst(ID_ENTREGA_FINAL) ?? dtEntrega;

//         setNodo(1, "done");
//         setTime(1, fmt(parseFecha(fechaCreacion)));

//         let dtAsignacion = null;
//         try {
//             const baseUrl = document.getElementById("base_url_api").value;
//             const fd2 = new FormData();
//             fd2.append("PedidoId", solicitudId);
//             const r2 = await fetch(baseUrl + "Fecha_asignacion_vehiculo", {
//                 method: "POST",
//                 headers: { "X-API-KEY": "nexos_nacional2026@*" },
//                 body: fd2,
//             });
//             const j2 = await r2.json();
//             if (j2.numero === 200 && j2.data?.fecha_asignacion)
//                 dtAsignacion = parseFecha(j2.data.fecha_asignacion);
//         } catch (e) {
//             console.warn("Error nodo 2:", e);
//         }

//         if (dtAsignacion) {
//             setNodo(2, "done");
//             setTime(2, fmt(dtAsignacion));
//         } else {
//             setNodo(2, "pending");
//             setTime(2, "Sin asignar");
//         }

//         // esSoloAsignado: solo bloquear nodos operativos si NO hay ninguna
//         // actividad clave completada. Si ya hay actividades, siempre renderizar.
//         const esSoloAsignado =
//             Object.keys(hitos).every(k => !hitos[k]?.completado) &&
//             (tipoTrazabilidad === "Sin Asignar" ||
//                 (tipoTrazabilidad !== "" &&
//                     tipoTrazabilidad !== null &&
//                     tipoTrazabilidad !== "Completado" &&
//                     ![
//                         "Llegada Cargue", "Cargue", "Salida Cargue", "Inicio Ruta",
//                         "Transito", "Llegada Descargue", "Descargue", "Salida Descargue",
//                     ].includes(tipoTrazabilidad)));

//         if (esSoloAsignado) {
//             [3, 4, 5, 6, 7].forEach((n) => {
//                 setNodo(n, "pending");
//                 setTime(n, "—");
//                 setDelta(n, null);
//             });
//             const pct = Math.round(((1 + (dtAsignacion ? 1 : 0)) / 7) * 100);
//             const barFill = document.getElementById("kpi-bar-fill");
//             const barVal = document.getElementById("kpi-pct-val");
//             if (barFill) {
//                 barFill.style.width = `${pct}%`;
//                 barFill.style.background = "linear-gradient(90deg,#ea580c,#f97316)";
//             }
//             if (barVal) barVal.textContent = `${pct}%`;
//             const tlBar = document.getElementById("tl-progress-bar");
//             if (tlBar) tlBar.style.width = `${pct}%`;
//             return;
//         }

//         // Nodo 3
//         if (dtLlegadaCargue) {
//             setNodo(3, "done");
//             if (estLlegadaCargue) {
//                 const dms = dtLlegadaCargue - estLlegadaCargue;
//                 setTime(3, `Prog: ${fmt(estLlegadaCargue)} | Real: ${fmt(dtLlegadaCargue)}`);
//                 setDelta(3, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(3, `Real: ${fmt(dtLlegadaCargue)}`);
//                 setDelta(3, null);
//             }
//         } else if (estLlegadaCargue) {
//             setTime(3, `Prog: ${fmt(estLlegadaCargue)}`);
//             if (ahora >= estLlegadaCargue) {
//                 const dms = ahora - estLlegadaCargue;
//                 setNodo(3, dms > 30 * 60000 ? "risk" : "active");
//                 setDelta(3, dms > 60000 ? dms : null);
//             } else {
//                 setNodo(3, dtAsignacion ? "active" : "pending");
//                 setDelta(3, null);
//             }
//         } else {
//             setNodo(3, "pending");
//             setTime(3, "—");
//         }

//         // Nodo 4 — Planta Origen: usa salida_cargue_iso del backend cuando está disponible
//         if (dtSalidaCargue) {
//             setNodo(4, "done");
//             if (estSalidaCargue) {
//                 const dms = dtSalidaCargue - estSalidaCargue;
//                 setTime(4, `Prog: ${fmt(estSalidaCargue)} | Real: ${fmt(dtSalidaCargue)}`);
//                 setDelta(4, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(4, `Real: ${fmt(dtSalidaCargue)}`);
//             }
//         } else if (dtCargueReal) {
//             setNodo(4, "active");
//             if (estSalidaCargue) {
//                 setTime(4, `Llegada: ${fmt(dtCargueReal)} | Salida est.: ${fmt(estSalidaCargue)}`);
//             } else {
//                 setTime(4, `Llegada: ${fmt(dtCargueReal)}`);
//             }
//             setDelta(4, null);
//         } else if (dtLlegadaCargue) {
//             setNodo(4, "active");
//             setTime(4, estSalidaCargue
//                 ? `Llegada: ${fmt(dtLlegadaCargue)} | Salida est.: ${fmt(estSalidaCargue)}`
//                 : `Llegada: ${fmt(dtLlegadaCargue)}`);
//             setDelta(4, null);
//         } else {
//             setNodo(4, "pending");
//             setTime(4, estSalidaCargue ? `Prog: ${fmt(estSalidaCargue)}` : "—");
//         }

//         // Nodo 5: Tránsito en Ruta
//         // Solo activo/done cuando ID 121 (Salida vehículo punto cargue) está COMPLETADO.
//         // Mientras ID 4 esté completo pero 121 no → nodo 4 active, nodo 5 pending.
//         if (dtInicioRuta) {
//             // ID 121 completado → en tránsito
//             setNodo(5, "done");
//             if (estTransito) {
//                 const dms = dtInicioRuta - estTransito;
//                 setTime(5, `Prog: ${fmt(estTransito)} | Real: ${fmt(dtInicioRuta)}`);
//                 setDelta(5, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(5, `Real: ${fmt(dtInicioRuta)}`);
//                 setDelta(5, null);
//             }
//         } else {
//             // ID 121 no completado → pending, mostrar estimado si existe
//             setNodo(5, "pending");
//             setTime(5, estTransito ? `Prog: ${fmt(estTransito)}` : "—");
//             setDelta(5, null);
//         }

//         // Nodo 6: Planta Destino
//         if (dtSalidaDes) {
//             setNodo(6, "done");
//             if (estSalidaDes) {
//                 const dms = dtSalidaDes - estSalidaDes;
//                 setTime(6, `Prog: ${fmt(estSalidaDes)} | Real: ${fmt(dtSalidaDes)}`);
//                 setDelta(6, Math.abs(dms) > 60000 ? dms : null);
//             } else setTime(6, `Real: ${fmt(dtSalidaDes)}`);
//         } else if (dtDescargueReal) {
//             setNodo(6, "done");
//             if (estLlegadaDes) {
//                 const dms = dtDescargueReal - estLlegadaDes;
//                 setTime(6, `Prog: ${fmt(estLlegadaDes)} | Real: ${fmt(dtDescargueReal)}`);
//                 setDelta(6, Math.abs(dms) > 60000 ? dms : null);
//             } else setTime(6, `Real: ${fmt(dtDescargueReal)}`);
//         } else if (dtLlegadaDes) {
//             setNodo(6, "active");
//             if (estLlegadaDes) {
//                 const dms = dtLlegadaDes - estLlegadaDes;
//                 setTime(6, `Prog: ${fmt(estLlegadaDes)} | Real: ${fmt(dtLlegadaDes)}`);
//                 setDelta(6, Math.abs(dms) > 60000 ? dms : null);
//             } else setTime(6, `Real: ${fmt(dtLlegadaDes)}`);
//         } else {
//             setNodo(6, "pending");
//             setTime(6, estLlegadaDes ? `Prog: ${fmt(estLlegadaDes)}` : "—");
//             if (estLlegadaDes && ahora >= estLlegadaDes) setNodo(6, "risk");
//             setDelta(6, null);
//         }

//         // Nodo 7: Entrega Final
//         if (dtSalidaDes) {
//             setNodo(7, "done");
//             if (estSalidaDes) {
//                 const dms = dtSalidaDes - estSalidaDes;
//                 setTime(7, `Prog: ${fmt(estSalidaDes)} | Real: ${fmt(dtSalidaDes)}`);
//                 setDelta(7, Math.abs(dms) > 60000 ? dms : null);
//             } else {
//                 setTime(7, `Real: ${fmt(dtSalidaDes)}`);
//                 setDelta(7, null);
//             }
//         } else if (dtDescargueReal || dtLlegadaDes) {
//             setNodo(7, "active");
//             const dtRef = dtDescargueReal || dtLlegadaDes;
//             if (estSalidaDes) {
//                 const dms = dtRef - estSalidaDes;
//                 setTime(7, `Prog: ${fmt(estSalidaDes)} | Llegada: ${fmt(dtRef)}`);
//                 setDelta(7, Math.abs(dms) > 60000 ? dms : null);
//             } else setTime(7, `Real: ${fmt(dtRef)}`);
//         } else {
//             setNodo(7, "pending");
//             if (estSalidaDes) {
//                 setTime(7, `SLA: ${fmt(estSalidaDes)}`);
//                 if (ahora >= estSalidaDes) {
//                     setNodo(7, "risk");
//                     const dms = ahora - estSalidaDes;
//                     setDelta(7, dms > 60000 ? dms : null);
//                 } else if (etaSegundos > 0) {
//                     const eta = new Date(ahora.getTime() + etaSegundos * 1000);
//                     const dms = eta - estSalidaDes;
//                     setDelta(7, dms > 0 ? dms : null);
//                 }
//             } else setTime(7, "—");
//         }

//         // Barra de progreso
//         const pesos = [
//             { pct: 100 },
//             { pct: dtAsignacion ? 100 : 0 },
//             { pct: dtLlegadaCargue ? 100 : dtCargue && ahora >= dtCargue ? 60 : 0 },
//             {
//                 pct: dtSalidaCargue
//                     ? 100
//                     : dtCargueReal
//                         ? 70
//                         : dtLlegadaCargue
//                             ? 30
//                             : 0,
//             },
//             {
//                 pct: dtLlegadaDes
//                     ? 100
//                     : dtInicioRuta
//                         ? 50
//                         : 0,
//             },
//             { pct: dtDescargueReal || dtSalidaDes ? 100 : dtLlegadaDes ? 50 : 0 },
//             { pct: dtSalidaDes ? 100 : 0 },
//         ];
//         const cumplidos = pesos.reduce((a, p) => a + p.pct / 100, 0);
//         const porcentaje = Math.round((cumplidos / pesos.length) * 100);
//         const barFill = document.getElementById("kpi-bar-fill");
//         const barVal = document.getElementById("kpi-pct-val");
//         if (barFill) {
//             barFill.style.width = `${porcentaje}%`;
//             barFill.style.transition = "width .6s ease";
//             barFill.style.background =
//                 porcentaje >= 80
//                     ? "linear-gradient(90deg,#16a34a,#22c55e)"
//                     : porcentaje >= 40
//                         ? "linear-gradient(90deg,#0369a1,#0891b2)"
//                         : "linear-gradient(90deg,#ea580c,#f97316)";
//         }
//         if (barVal) barVal.textContent = `${porcentaje}%`;
//         const tlBar = document.getElementById("tl-progress-bar");
//         if (tlBar) tlBar.style.width = `${porcentaje}%`;
//     }

//     /* ─────────────────────────────────────────────────────────────────
//          calcularTiempos — enriquece tareas con _tiempos calculados
//       ───────────────────────────────────────────────────────────────── */
//     function calcularTiempos(tareas, fechaCargue) {
//         const parseFecha = (f) => {
//             if (!f) return null;
//             const n = f.replace(
//                 /^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/,
//                 "$1T$2",
//             );
//             const d = new Date(n);
//             return isNaN(d.getTime()) ? null : d;
//         };
//         const aMinutos = (valor, medida) => {
//             if (!valor) return null;
//             const m = Number(medida) || 1;
//             if (m === 1) return Number(valor);
//             if (m === 2) return Number(valor) * 60;
//             if (m === 3) return Number(valor) * 1440;
//             return Number(valor);
//         };
//         const fmtMin = (m) => {
//             const abs = Math.abs(m);
//             if (abs >= 1440)
//                 return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
//             if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
//             return `${abs} min`;
//         };
//         const fmtFecha = (d) => {
//             if (!d) return null;
//             return d.toLocaleString("es-CO", {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: false,
//             });
//         };

//         const dtCargue = parseFecha(fechaCargue);
//         const ahora = new Date();
//         const mapaId = {};
//         tareas.forEach((t) => {
//             mapaId[t.id] = t;
//         });
//         const dtInicioCalc = {};
//         const resolverDtInicio = (t) => {
//             if (dtInicioCalc[t.id] !== undefined) return dtInicioCalc[t.id];
//             let dt = null;
//             const sinDep =
//                 !t.actividad_prerequisito || t.actividad_prerequisito === 0;
//             if (t.criterio_calculo === 4) {
//                 dt = parseFecha(t.fecha_base_calc) ?? dtCargue;
//             } else if (t.orden === 1 || sinDep) {
//                 dt = dtCargue;
//             } else if (t.actividad_prerequisito && mapaId[t.actividad_prerequisito]) {
//                 const pre = mapaId[t.actividad_prerequisito];
//                 const dtPre = resolverDtInicio(pre);
//                 const minPre = aMinutos(pre.valor_tiempo, pre.medida_tiempo);
//                 dt =
//                     dtPre && minPre
//                         ? new Date(dtPre.getTime() + minPre * 60 * 1000)
//                         : dtCargue;
//             }
//             dtInicioCalc[t.id] = dt;
//             return dt;
//         };
//         tareas.forEach((t) => resolverDtInicio(t));

//         return tareas.map((t) => {
//             const minAsignados = aMinutos(t.valor_tiempo, t.medida_tiempo);
//             const realMinutos = aMinutos(t.tiempo_real_min);
//             // console.log("🚀 ~ calcularTiempos ~ minAsignados:", minAsignados)
//             if (!minAsignados) return { ...t, _tiempos: null };
//             const dtInicio = dtInicioCalc[t.id];
//             if (!dtInicio) return { ...t, _tiempos: null };
//             const dtReal = parseFecha(t.fecha_inicio_real);
//             const dtLimite = new Date(dtInicio.getTime() + minAsignados * 60 * 1000);
//             const baseTranscurrido = dtReal || dtInicio;
//             const minTranscurridos = Math.max(
//                 0,
//                 Math.floor((ahora - baseTranscurrido) / 60000),
//             );
//             const minRestantes = Math.floor((dtLimite - ahora) / 60000);
//             const alDia = t.estado === "COMPLETADO" || minRestantes >= 0;
//             const pct = Math.min(
//                 Math.round((minTranscurridos / minAsignados) * 100),
//                 999,
//             );
//             const minTransMostrar =
//                 t.estado === "COMPLETADO" && dtReal
//                     ? Math.max(0, Math.floor((dtReal - dtInicio) / 60000))
//                     : t.estado === "COMPLETADO"
//                         ? minAsignados
//                         : minTranscurridos;
//             return {
//                 ...t,
//                 _tiempos: {
//                     minAsignados,
//                     minTranscurridos: minTransMostrar,
//                     minRestantes,
//                     alDia,
//                     pct: t.estado === "COMPLETADO" ? 100 : pct,
//                     textoAsignado: fmtMin(minAsignados),
//                     textoTranscurrido: fmtMin(minTransMostrar),
//                     textoRestante:
//                         t.estado === "COMPLETADO"
//                             ? "0 min"
//                             : (minRestantes < 0 ? "-" : "+") + fmtMin(Math.abs(minRestantes)),
//                     fechaInicioCalc: fmtFecha(dtInicio),
//                     fechaReal: fmtFecha(dtReal),
//                     fechaLimite: fmtFecha(dtLimite),
//                     realMinutos: realMinutos,
//                 },
//             };
//         });
//     }

//     /* ─────────────────────────────────────────────────────────────────
//          renderTablaResumen — tabla de tiempos en panel expandible
//       ───────────────────────────────────────────────────────────────── */
//     function renderTablaResumen(container, tareas, titulo) {
//         if (!container) return;
//         const fmtMin = (m) => {
//             const abs = Math.abs(m);
//             if (abs >= 1440)
//                 return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
//             if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
//             return `${abs} min`;
//         };
//         const filas = tareas
//             .map((t) => {
//                 const estandar = t._tiempos ? t._tiempos.textoAsignado : "—";
//                 let realHtml = `<span style="color:#94a3b8">${estandar}</span>`;
//                 if (t.estado === "COMPLETADO" && t.tiempo_real_gestion != null)
//                     realHtml = `<span style="color:#16a34a;font-weight:600">${fmtMin(t.tiempo_real_gestion)}</span>`;
//                 else if (t.estado === "EN GESTION" && t._tiempos)
//                     realHtml = `<span style="color:#ea580c;font-weight:600">${t._tiempos.textoTranscurrido}</span>`;
//                 let deltaHtml = '<span style="color:#94a3b8">—</span>';
//                 if (t.estado === "COMPLETADO" && t.tiempo_real_min != null) {
//                     const diff = t.tiempo_real_min;
//                     const color =
//                         diff === 0 ? "#0369a1" : diff > 0 ? "#16a34a" : "#dc2626";
//                     const signo = diff > 0 ? "+" : diff < 0 ? "-" : "=";
//                     deltaHtml = `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:7px;white-space:nowrap;background:${color}12;color:${color};border:1px solid ${color}30">${signo}${fmtMin(Math.abs(diff))}</span>`;
//                 }
//                 return `<tr>
//                 <td style="font-size:10px;color:#0f172a;max-width:110px;white-space:normal;line-height:1.3">${t.nombre}</td>
//                 <td class="v" style="font-size:10px;color:#475569;text-align:center">${estandar}</td>
//                 <td class="v" style="font-size:10px;text-align:center">${realHtml}</td>
//                 <td class="v" style="text-align:center">${deltaHtml}</td>
//             </tr>`;
//             })
//             .join("");

//         // ── Totales fila TOTAL ──
//         // Estándar: suma de minAsignados de todas las tareas
//         const totalAsig = tareas.reduce((a, t) => a + (t._tiempos?.minAsignados || 0), 0);

//         // Real: suma de tiempo_real_gestion de las COMPLETADAS
//         //       + minAsignados de las NO completadas (proyección)
//         const totalEstandarCompletadas = tareas.reduce(
//             (a, t) => t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null
//                 ? a + (t._tiempos?.minAsignados || 0) : a, 0
//         );
//         const totalRealCompletadas = tareas.reduce(
//             (a, t) => t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null
//                 ? a + t.tiempo_real_gestion : a, 0
//         );
//         const hayCompletadas = totalRealCompletadas > 0;
//         // Real total = estándar pendientes + real completadas
//         const totalReal = (totalAsig - totalEstandarCompletadas) + totalRealCompletadas;

//         // Delta: suma de tiempo_real_min de completadas
//         // negativo = ganó tiempo (verde), positivo = perdió tiempo (rojo)
//         const totalDelta = tareas.reduce(
//             (a, t) => t.estado === 'COMPLETADO' && t.tiempo_real_min != null
//                 ? a + t.tiempo_real_min : a, 0
//         );
//         const totalCompletadas = tareas.filter(
//             (t) => t.estado === 'COMPLETADO' && t.tiempo_real_min != null
//         ).length;
//         const totalColorD = totalDelta === 0 ? '#0369a1' : totalDelta < 0 ? '#16a34a' : '#dc2626';
//         const totalDeltaHtml = totalCompletadas > 0
//             ? `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:7px;background:${totalColorD}12;color:${totalColorD};border:1px solid ${totalColorD}30">`
//             + `${totalDelta > 0 ? '+' : totalDelta < 0 ? '-' : '='}${fmtMin(Math.abs(totalDelta))}</span>`
//             : '—';
//         const eventos = tareas.filter(
//             (t) =>
//                 t.estado === "COMPLETADO" &&
//                 t.tiempo_real_min != null &&
//                 t.tiempo_real_min !== 0,
//         );
//         const eventosHtml =
//             eventos.length === 0
//                 ? `<div style="font-size:10px;color:#94a3b8;padding:8px 0">Sin diferencias de tiempo registradas.</div>`
//                 : eventos
//                     .map((t) => {
//                         const diff = t.tiempo_real_min;
//                         const color = diff > 0 ? "#16a34a" : "#dc2626";
//                         const texto =
//                             diff > 0
//                                 ? `Ganó ${fmtMin(Math.abs(diff))} en "${t.nombre}"`
//                                 : `Perdió ${fmtMin(Math.abs(diff))} en "${t.nombre}"`;
//                         return `<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid #f1f5f9"><span style="font-size:7px;color:${color};margin-top:3px;flex-shrink:0">●</span><div><div style="font-size:10px;color:#0f172a">${texto}</div><div style="font-size:9px;color:#94a3b8">Est: ${t._tiempos?.textoAsignado ?? "—"} · Real: ${fmtMin(t.tiempo_real_gestion ?? 0)}</div></div><span style="margin-left:auto;font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:7px;white-space:nowrap;background:${color}12;color:${color};border:1px solid ${color}30">${diff > 0 ? "+" : ""}${fmtMin(diff)}</span></div>`;
//                     })
//                     .join("");

//         container.innerHTML = `
//             <table class="oc-table" style="margin-bottom:.8rem">
//                 <thead><tr><th>Actividad</th><th style="text-align:center">Estándar</th><th style="text-align:center">Real</th><th style="text-align:center">Δ</th></tr></thead>
//                 <tbody>${filas}</tbody>
//                 <tfoot>
//                     <tr class="total">
//                         <td>TOTAL ${titulo?.toUpperCase() ?? ""}</td>
//                         <td class="v" style="text-align:center">${fmtMin(totalAsig)}</td>
//                         <td class="v" style="text-align:center">${hayCompletadas ? fmtMin(totalReal) : fmtMin(totalAsig)}</td>
//                         <td class="v" style="text-align:center">${totalDeltaHtml}</td>
//                     </tr>
//                 </tfoot>
//             </table>
//             <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;margin-bottom:.5rem;margin-top:.2rem">Registro de Eventos</div>
//             <div style="max-height:180px;overflow-y:auto">${eventosHtml}</div>`;
//     }

//     // Exponer al scope global
//     window.ocToggle = ocToggle;
//     window.completarTareaOC = completarTareaOC;
// })();


window.VENTANA = null; // Variable global para almacenar el ID
(function () {
    "use strict";

    // ═══════════════════════════════════════════════════════════════════
    //  TiemposLogisticos — módulo interno para ETA · SLA · Horarios
    //  Consume POST Calcular_tiempos_logisticos (nuevo endpoint)
    // ═══════════════════════════════════════════════════════════════════
    const TiemposLogisticos = (function () {
        /* ── Helpers DOM ── */
        const qs = (s) => document.querySelector(s);
        const esc = (v) =>
            v == null
                ? "—"
                : String(v)
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;");

        /* ── Llama a la API ── */
        async function _api(pedidoId, duracionSeg, soloHorarios) {
            const baseUrl = (
                document.getElementById("base_url_api")?.value ?? ""
            ).replace(/\/$/, "");
            const fd = new FormData();
            fd.append("PedidoId", pedidoId);
            fd.append("duracion_segundos", duracionSeg);
            fd.append("solo_horarios", soloHorarios ? "1" : "0");
            try {
                const r = await fetch(baseUrl + "/Calcular_tiempos_logisticos", {
                    method: "POST",
                    headers: { "X-API-KEY": "nexos_nacional2026@*" },
                    body: fd,
                });
                if (!r.ok) throw new Error("HTTP " + r.status);
                const json = await r.json();
                return json.numero === 200 ? json.data : null;
            } catch (e) {
                console.warn("[TiemposLogisticos] API error:", e.message);
                return null;
            }
        }

        /* ── Carga solo horarios (sin cálculo de ETA, antes de tener Maps) ── */
        async function cargarSoloHorarios(pedidoId) {
            _showLoading();
            const d = await _api(pedidoId, 0, true);
            if (d) _renderHorarios(d);
            else _showEmpty("Sin horarios disponibles para este pedido.");
        }

        /* ── Carga completo: ETA + SLA + horarios ── */
        async function cargar(pedidoId, duracionSegundos) {
            const d = await _api(pedidoId, duracionSegundos, false);
            if (!d) return;
            _renderHorarios(d);
            _renderKpis(d);
            // _renderEtaCarguePanel(d);
            _renderTablasTiempos(d);
        }

        /* ── RENDER KPIs ── */
        function _renderKpis(d) {
            const colorMap = {
                "A TIEMPO": "#10b981",
                "EN RIESGO": "#f59e0b",
                ATRASADO: "#ef4444",
                CALCULANDO: "#94a3b8",
                "SIN DATOS": "#94a3b8",
            };
            const col = colorMap[d.estado_sla] ?? "#94a3b8";

            // Función de cálculo integrada
            function calcularTiempos(d) {
                function sumarMinutosAFecha(fechaStr, minutos) {
                    if (!fechaStr || !minutos) return "—";

                    const [fechaPart, horaPart] = fechaStr.split(" ");
                    if (!fechaPart || !horaPart) return fechaStr;

                    const [dia, mes, ano] = fechaPart.split("/");
                    const [horas, minutosP] = horaPart.split(":");

                    const date = new Date(ano, mes - 1, dia, horas, minutosP);
                    date.setMinutes(date.getMinutes() + minutos);

                    const dF = String(date.getDate()).padStart(2, "0");
                    const mF = String(date.getMonth() + 1).padStart(2, "0");
                    const aF = date.getFullYear();
                    const hF = String(date.getHours()).padStart(2, "0");
                    const minF = String(date.getMinutes()).padStart(2, "0");

                    return `${dF}/${mF}/${aF} ${hF}:${minF}`;
                }

                function parseFecha(fechaStr) {
                    if (!fechaStr || fechaStr === "—") return null;
                    const [fechaPart, horaPart] = fechaStr.split(" ");
                    if (!fechaPart || !horaPart) return null;
                    const [dia, mes, ano] = fechaPart.split("/");
                    const [horas, mins] = horaPart.split(":");
                    return new Date(ano, mes - 1, dia, horas, mins);
                }

                function deltaTexto(minutos) {
                    if (minutos === null) return "—";
                    if (minutos === 0) return "En punto";
                    const abs = Math.abs(minutos);
                    const h = Math.floor(abs / 60);
                    const m = abs % 60;
                    const txt = (h > 0 ? `${h}h ` : "") + `${m}min`;
                    return (minutos > 0 ? "+" : "-") + txt;
                }

                function deltaColor(minutos) {
                    if (minutos === null) return "slate";
                    if (minutos <= 0) return "green";
                    if (minutos <= 30) return "amber";
                    return "red";
                }

                const minutosActividad = d.minutos_planta_cargue || 0;
                // Calculamos el tiempo total de gestión usando la propiedad del objeto JSON
                const minutosActividadGestion =
                    (d.tiempoRealMin || 0) + minutosActividad;

                // 1. Calculamos la salida real inicial y el cargue
                let salidaRealDate = parseFecha(
                    sumarMinutosAFecha(
                        d.fecha_ejecutada_posicionamiento,
                        minutosActividadGestion,
                    ),
                );
                const cargueReal = parseFecha(d.fecha_ejecutada_posicionamiento);

                // 2. Aplicamos la regla de la ventana del cliente de forma numérica
                if (salidaRealDate && d.ventana_cliente_inicio && d.ventana_cliente_fin) {
                    const [hStart, mStart] = d.ventana_cliente_inicio.split(":").map(Number);
                    const [hEnd, mEnd] = d.ventana_cliente_fin.split(":").map(Number);

                    const hSalida = salidaRealDate.getHours();
                    const mSalida = salidaRealDate.getMinutes();

                    const superaFin = hSalida > hEnd || (hSalida === hEnd && mSalida > mEnd);
                    const antesInicio = hSalida < hStart || (hSalida === hStart && mSalida < mStart);

                    if (superaFin) {
                        salidaRealDate.setDate(salidaRealDate.getDate() + 1);
                        salidaRealDate.setHours(hStart, mStart, 0, 0);
                    } else if (antesInicio) {
                        salidaRealDate.setHours(hStart, mStart, 0, 0);
                    }
                }

                // Función auxiliar para convertir fecha a String con formato
                function formatDateToString(dateObj) {
                    const dF = String(dateObj.getDate()).padStart(2, "0");
                    const mF = String(dateObj.getMonth() + 1).padStart(2, "0");
                    const aF = dateObj.getFullYear();
                    const hF = String(dateObj.getHours()).padStart(2, "0");
                    const minF = String(dateObj.getMinutes()).padStart(2, "0");
                    return `${dF}/${mF}/${aF} ${hF}:${minF}`;
                }

                let deltaMin = null;
                if (cargueReal && salidaRealDate) {
                    deltaMin = Math.round((salidaRealDate - cargueReal) / 60000);
                }

                // Fecha real de llegada a cargue: hito 1 (Llega Vehículo a Punto de Cargue)
                const _hitoLlegada = window._hitosLineaTiempo?.[1];
                const _cargueReal = _hitoLlegada?.fecha_real || d.fecha_ejecutada_posicionamiento || null;

                return {
                    cargue_estimado: d.sla_cargue,
                    cargue_real: _cargueReal,
                    salida_estimada: sumarMinutosAFecha(d.sla_cargue, minutosActividad),
                    salida_real: salidaRealDate
                        ? formatDateToString(salidaRealDate)
                        : "—",
                    delta_min: deltaMin,
                    delta_texto: deltaTexto(deltaMin),
                    delta_color: deltaColor(deltaMin),
                };
            }

            const tiempos = calcularTiempos(d);

            // KPI 1: Estado SLA
            const slaVal = qs("#kpi-sla-val");
            const slaSub = qs("#kpi-sla-sub");
            if (slaVal) {
                slaVal.textContent = d.estado_sla;
                slaVal.style.color = col;
            }
            if (slaSub) {
                slaSub.innerHTML = d.diferencia_texto
                    ? `<i class="${d.sla_icono ?? "bi-clock"}"></i> ${esc(d.diferencia_texto)} vs SLA`
                    : "Sin SLA registrado";
            }

            // KPI 2: Tiempo disponible
            const tdis = qs("#kpi-tdis-val");
            if (tdis) {
                tdis.textContent = d.tiempo_disponible ?? "—";
                tdis.style.color = col;
            }

            // KPI 3: ETA Cargue — llegada estimada, salida estimada, ejecutadas y deltas
            const colorSemap = (c) =>
                ({
                    green: "#10b981",
                    amber: "#f59e0b",
                    red: "#ef4444",
                    slate: "#94a3b8",
                })[c] ?? "#94a3b8";
            const cargueVal = qs("#kpi-cargue-val");
            const cargueSub = qs("#kpi-cargue-sub");
            const cargueEtSal = qs("#kpi-cargue-etm-sal");
            const cargueSal = qs("#kpi-cargue-sal");
            const cardCargue = qs("#kpi-card-cargue");
            const colCargue = colorSemap(d.sla_color || "slate");

            if (cargueVal) {
                cargueVal.innerHTML = `
                    <div style="font-size: 11px; line-height: 1.4; margin-bottom: 4px;">
                        <span style="color: #64748b;">Est. Llegada:</span> <strong>${tiempos.cargue_estimado || "—"}</strong>
                    </div>
                    <div style="font-size: 11px; line-height: 1.4;">
                        <span style="color: #64748b;">Real Llegada:</span> <strong>${tiempos.cargue_real || "—"}</strong>
                    </div>
                `;
                cargueVal.style.color = colCargue;
            }

            const colSalida = colorSemap(d.delta_salida_color);
            const badge = (texto, color) =>
                texto
                    ? `<span style="font-size:8px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 5px;border-radius:6px;margin-left:4px;background:${color}18;color:${color};border:1px solid ${color}30">${texto}</span>`
                    : "";

            if (cargueSub) {
                cargueSub.innerHTML = `
                    <div style="font-size: 11px; line-height: 1.4; margin-bottom: 4px;">
                        <span style="color: #64748b;">Est. Salida:</span> <strong>${tiempos.salida_estimada}</strong>
                    </div>
                    <div style="font-size: 11px; line-height: 1.4;">
                        <span style="color: #64748b;">Real Salida:</span> <strong>${d.fecha_ejecutada_salida_planta ?? tiempos.salida_real}</strong>
                    </div>
                    ${tiempos.delta_min !== null
                        ? `
                    <div style="margin-top:.5rem;font-size:9px;color:#64748b;display:flex;align-items:center;gap:5px">
                        <i class="bi bi-clock-history" style="font-size:10px;color:#94a3b8"></i>
                        Delta planta: 
                        <strong style="color:${{ green: "#10b981", amber: "#f59e0b", red: "#ef4444", slate: "#94a3b8" }[tiempos.delta_color]}">${tiempos.delta_texto}</strong>
                    </div>`
                        : ""
                    }
                `;
            }

            // Limpieza de campos para evitar conflictos de maquetación en el DOM
            if (cargueEtSal) {
                cargueEtSal.innerHTML = "";
            }

            if (cargueSal) {
                cargueSal.innerHTML = "";
            }

            if (cardCargue) cardCargue.style.borderTopColor = colCargue;

            // Guardar salida_cargue_iso para la línea de tiempo
            // window._salidaCargueProgramada = d.salida_cargue_iso ? new Date(d.salida_cargue_iso) : null;

            window._salidaCargueProgramada = d.eta_salida_planta_iso
                ? new Date(d.eta_salida_planta_iso)
                : null;

            // KPI 4: ETA Descargue

            /*if (entregaVal) {
              // entregaVal.textContent = d.eta_descargue ?? "—";
              entregaVal.textContent = tiempos.salida_real ?? "—";
              entregaVal.style.color = "#0891b2";
            }*/

            //const entregaVal = qs("#kpi-entrega-val");
            //const entregaSub = qs("#kpi-entrega-sub");

            // KPI 5: Porcentaje
            const pctVal = qs("#kpi-pct-val");
            const barFill = qs("#kpi-bar-fill");
            if (pctVal) pctVal.textContent = `${d.porcentaje_avance ?? 0}%`;
            if (barFill) barFill.style.width = `${d.porcentaje_avance ?? 0}%`;

            // Badge mapa duración con buffer

            /*const mapDur = qs("#ocMapDuracion");
            if (mapDur && d.duracion_buffer_texto)
              mapDur.textContent = d.duracion_buffer_texto + " (+28%)";
      
            if (entregaVal) {
              // entregaVal.textContent = d.eta_descargue ?? "—";
              entregaVal.textContent = d.duracion_buffer_texto ?? "—";
              entregaVal.style.color = "#0891b2";
            }*/

            /*const entregaVal = qs("#kpi-entrega-val");
            const entregaSub = qs("#kpi-entrega-sub");
            const mapDur = qs("#ocMapDuracion");
      
            // Mostrar duración en el mapa
            if (mapDur && d.duracion_buffer_texto) {
              mapDur.textContent = d.duracion_buffer_texto;
            }
      
            if (entregaVal && d.duracion_buffer_texto) {
              // 1️⃣ Extraer horas y minutos (ej: "21h 18min")
              const match = d.duracion_buffer_texto.match(/(\d+)\s*h\s*(\d+)\s*min/i);
      
              if (!match) {
                entregaVal.textContent = "—";
              } else {
                const horas = parseInt(match[1], 10);
                const minutos = parseInt(match[2], 10);
      
                // 2️⃣ Convertir a minutos totales
                const totalMinutos = horas * 60 + minutos;
      
                // 3️⃣ Calcular ETA
                const ahora = new Date();
                const eta = new Date(ahora.getTime() + totalMinutos * 60000);
      
                // 4️⃣ Formatear ETA
                const etaFormateada = eta.toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
      
                // 5️⃣ Mostrar ETA
                entregaVal.textContent = etaFormateada;
                entregaVal.style.color = "#0891b2";
              }
            }*/

            const entregaVal = qs("#kpi-entrega-val");
            const entregaSub = qs("#kpi-entrega-sub");
            const mapDur = qs("#ocMapDuracion");

            // Mostrar duración en el mapa
            if (mapDur && d.duracion_buffer_texto) {
                mapDur.textContent = d.duracion_buffer_texto;
            }

            /* ================= HELPERS ================= */

            // "21h 18min" -> { h:21, min:18 }
            function parseDuracionHM(texto) {
                const t = String(texto || "")
                    .trim()
                    .toLowerCase();
                // Soporta: "21h 18min", "21h", "18min"
                const mh = t.match(/(\d+)\s*h/);
                const mm = t.match(/(\d+)\s*min/);
                const h = mh ? parseInt(mh[1], 10) : 0;
                const min = mm ? parseInt(mm[1], 10) : 0;
                if (h === 0 && min === 0) return null;
                return { h, min };
            }

            // Convierte "6:00am", "6:00 a.m.", "06:00 AM", "20:00", "20:00:00" -> minutos del día
            function parseHoraToMin(hora) {
                if (!hora) return null;

                let s = String(hora).trim().toLowerCase();

                // Normaliza "a.m."/"p.m." -> "am"/"pm"
                s = s.replace(/\./g, ""); // quita puntos: a.m. -> am
                s = s.replace(/\s+/g, ""); // quita espacios: "6:00 am" -> "6:00am"
                s = s.replace(/a(m)?$/i, "am"); // por si llega raro
                s = s.replace(/p(m)?$/i, "pm");

                // Acepta HH:MM(:SS)? + opcional am/pm
                const m = s.match(/^(\d{1,2})(?::(\d{2}))?(?::(\d{2}))?(am|pm)?$/i);
                if (!m) return null;

                let hh = parseInt(m[1], 10);
                const mm = parseInt(m[2] ?? "0", 10);
                const ap = (m[4] || "").toLowerCase();

                if (
                    Number.isNaN(hh) ||
                    Number.isNaN(mm) ||
                    hh < 0 ||
                    hh > 23 ||
                    mm < 0 ||
                    mm > 59
                )
                    return null;

                if (ap) {
                    // 12h -> 24h
                    if (hh === 12) hh = 0; // 12am -> 0
                    if (ap === "pm") hh += 12; // pm suma 12
                }

                // Normaliza por si hh quedó 24 (no debería, pero por seguridad)
                hh = hh % 24;
                return hh * 60 + mm;
            }

            function setMinDia(date, minDia) {
                const d2 = new Date(date);
                d2.setHours(0, 0, 0, 0);
                d2.setMinutes(minDia);
                return d2;
            }

            function dentroVentana(dt, ini, fin) {
                const t = dt.getHours() * 60 + dt.getMinutes();
                if (ini === fin) return true; // interpreta como 24h permitido (evita bucles)
                return fin > ini
                    ? t >= ini && t < fin // ventana normal
                    : t >= ini || t < fin; // ventana cruza medianoche
            }

            function proxInicioVentana(dt, ini, fin) {
                if (dentroVentana(dt, ini, fin)) return new Date(dt);

                const hoyIni = setMinDia(dt, ini);
                if (dt < hoyIni) return hoyIni;

                const mananaIni = new Date(hoyIni);
                mananaIni.setDate(mananaIni.getDate() + 1);
                return mananaIni;
            }

            function finVentana(dt, ini, fin) {
                if (ini === fin) {
                    // 24h permitido: fin = +1 día misma hora (en práctica no se usará)
                    const f = new Date(dt);
                    f.setDate(f.getDate() + 1);
                    return f;
                }

                if (fin > ini) {
                    // fin hoy a "fin"
                    return setMinDia(dt, fin);
                } else {
                    // cruza medianoche
                    const t = dt.getHours() * 60 + dt.getMinutes();
                    if (t >= ini) {
                        // tramo noche: fin mañana a "fin"
                        const f = setMinDia(dt, fin);
                        f.setDate(f.getDate() + 1);
                        return f;
                    } else {
                        // tramo madrugada: fin hoy a "fin"
                        return setMinDia(dt, fin);
                    }
                }
            }

            // AÑADE minutos respetando franja [ini, fin] diaria
            function sumarMinConVentana(base, minTot, ini, fin) {
                let dt = proxInicioVentana(base, ini, fin);
                let faltan = minTot;

                while (faltan > 0) {
                    // Por seguridad, si por algo quedamos fuera, saltamos a inicio
                    if (!dentroVentana(dt, ini, fin)) {
                        dt = proxInicioVentana(dt, ini, fin);
                    }

                    const fv = finVentana(dt, ini, fin);
                    const disp = Math.max(
                        0,
                        Math.floor((fv.getTime() - dt.getTime()) / 60000),
                    );

                    // Si no hay minutos disponibles en esta ventana, saltamos a la siguiente
                    if (disp === 0) {
                        dt = proxInicioVentana(new Date(dt.getTime() + 60000), ini, fin);
                        continue;
                    }

                    const usar = Math.min(disp, faltan);
                    dt = new Date(dt.getTime() + usar * 60000);
                    faltan -= usar;

                    if (faltan > 0) {
                        dt = proxInicioVentana(dt, ini, fin);
                    }
                }
                return dt;
            }

            // Formato final: "DD/MM/YYYY HH:MM hrs" (sin coma, sin AM/PM)
            function formatoFechaHora24(eta) {
                const fecha = eta.toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                const hora = eta.toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });
                return `${fecha} ${hora} hrs`;
            }

            /* ================= LÓGICA PRINCIPAL ================= */

            if (entregaVal && d.duracion_buffer_texto) {
                const dur = parseDuracionHM(d.duracion_buffer_texto);

                // 👇 AQUÍ se “incluyen” las dos variables para calcular la franja
                const winIni = parseHoraToMin(d.ventana_cliente_inicio);
                const winFin = parseHoraToMin(d.ventana_cliente_fin);

                // Debug para ver si realmente parsea bien (quítalo cuando ya funcione)
                console.debug(
                    "[ETA] ventana raw:",
                    d.ventana_cliente_inicio,
                    d.ventana_cliente_fin,
                );
                console.debug("[ETA] ventana min:", {
                    winIni,
                    winFin,
                    duracion: d.duracion_buffer_texto,
                });

                if (!dur) {
                    entregaVal.textContent = "—";
                    entregaVal.style.color = "#0891b2";
                } else {
                    const totalMin = dur.h * 60 + dur.min;

                    // Base: AHORA (si tu viaje inicia en otra fecha/hora, reemplaza esta línea)
                    const base = new Date();

                    // ✅ Cálculo correcto: si la ventana es válida, la ETA se calcula SOLO dentro de esa franja
                    const eta =
                        winIni != null && winFin != null
                            ? sumarMinConVentana(base, totalMin, winIni, winFin)
                            : new Date(base.getTime() + totalMin * 60000);

                    entregaVal.textContent = formatoFechaHora24(eta);
                    entregaVal.style.color = "#0891b2";

                    if (entregaSub) {
                        if (winIni != null && winFin != null) {
                            const f = (m) =>
                                `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
                            entregaSub.textContent = `Ventana: ${f(winIni)}–${f(winFin)} · Duración: ${d.duracion_buffer_texto}`;
                        } else {
                            entregaSub.textContent = `Duración: ${d.duracion_buffer_texto}`;
                        }
                    }
                }
            }

            if (entregaSub) {
                entregaSub.textContent = d.sla_entrega
                    ? `SLA: ${d.sla_entrega}`
                    : "Sin fecha compromiso";
            }
        }

        /* ── RENDER Horarios operativos ── */
        function _renderHorarios(d) {
            _hide("#oc-horarios-loading");

            const hayDatos =
                d.ventana_cliente_inicio ||
                (d.horarios_remitente && d.horarios_remitente.length > 0) ||
                (d.horarios_destinatario && d.horarios_destinatario.length > 0);

            if (!hayDatos) {
                _showEmpty("Sin horarios registrados para este pedido.");
                return;
            }

            _hide("#oc-horarios-empty");
            _show("#oc-horarios-content");

            // Panel: ventana cliente externo
            const panelCE = qs("#oc-panel-cliente-externo");
            if (panelCE) panelCE.innerHTML = _htmlVentanaCliente(d);

            // Panel: remitente
            const panelRem = qs("#oc-panel-remitente");
            if (panelRem) {
                const nombre = d.nombre_remitente
                    ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Bodega / Planta</div>
                       <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:.65rem">${esc(d.nombre_remitente)}</div>`
                    : "";
                panelRem.innerHTML =
                    nombre +
                    (d.horarios_remitente?.length > 0
                        ? _htmlListaHorarios(d.horarios_remitente, "#0369a1")
                        : _htmlSinHorario("Sin horarios registrados para el remitente."));
            }

            // Panel: destinatario
            const panelDes = qs("#oc-panel-destinatario");
            if (panelDes) {
                const nombre = d.nombre_destinatario
                    ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Bodega / Punto de Entrega</div>
                       <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:.65rem">${esc(d.nombre_destinatario)}</div>`
                    : "";
                panelDes.innerHTML =
                    nombre +
                    (d.horarios_destinatario?.length > 0
                        ? _htmlListaHorarios(d.horarios_destinatario, "#0891b2")
                        : _htmlSinHorario(
                            "Sin horarios registrados para el destinatario.",
                        ));
            }

            // Motivo ajuste
            /* const wrapMotivo = qs("#oc-motivo-ajuste-wrap");
            const textoMotivo = qs("#oc-motivo-ajuste-texto");
            if (wrapMotivo && textoMotivo) {
              if (d.motivo_ajuste && d.motivo_ajuste !== "Sin ajustes de horario") {
                textoMotivo.textContent = d.motivo_ajuste;
                wrapMotivo.style.display = "";
              } else {
                wrapMotivo.style.display = "none";
              }
            }*/
        }

        /* ── HTML: ventana de tránsito del cliente externo ── */
        function _htmlVentanaCliente(d) {
            const nombreCI = d.nombre_cliente_interno
                ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Cliente</div>
                   <div style="font-size:12px;font-weight:700;color:#0f172a;margin-bottom:.55rem">${esc(d.nombre_cliente_interno)}</div>`
                : "";
            const nombreCE = d.nombre_cliente_externo
                ? `<div style="font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:#94a3b8;margin-bottom:2px">Remitente</div>
                   <div style="font-size:11px;font-weight:600;color:#1a3260;margin-bottom:.65rem">${esc(d.nombre_cliente_externo)}</div>`
                : "";

            if (d.ventana_cliente_inicio && d.ventana_cliente_fin) {
                return `${nombreCI}${nombreCE}
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:.4rem">
                        <i class="bi bi-clock-fill" style="color:#f59e0b;font-size:11px"></i>
                        <span style="font-size:9px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#94a3b8">Horario Permitido</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px">
                        ${_horaBadge(d.ventana_cliente_inicio, "#1a3260", "#fff")}
                        <span style="color:#94a3b8;font-size:11px">→</span>
                        ${_horaBadge(d.ventana_cliente_fin, "#1a3260", "#fff")}
                    </div>
                    <div style="margin-top:.6rem;font-size:10px;color:#64748b">
                        <i class="bi bi-info-circle me-1"></i>Ventana en la que el vehículo puede circular con esta carga.
                    </div>`;
            }
            return `${nombreCI}${nombreCE}${_htmlSinHorario("Sin restricción de tránsito registrada.")}`;
        }

        function _htmlListaHorarios(ventanas, color) {
            const filas = ventanas
                .map((v, i) => {
                    const ini = (v.inicio ?? "").substring(0, 5);
                    const fin = (v.fin ?? "").substring(0, 5);
                    return `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;${i > 0 ? "border-top:1px solid #f1f5f9" : ""}">
                    <i class="bi bi-clock" style="color:${color};font-size:11px;flex-shrink:0"></i>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#0f172a">${ini}</span>
                    <span style="color:#94a3b8;font-size:11px">–</span>
                    <span style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:#0f172a">${fin}</span>
                    <span style="font-size:9px;background:rgba(0,0,0,.04);border-radius:5px;padding:1px 6px;color:#64748b;margin-left:auto">Turno ${i + 1}</span>
                </div>`;
                })
                .join("");
            return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:.5rem">
                <i class="bi bi-calendar-check" style="color:#94a3b8;font-size:11px"></i>
                <span style="font-size:9px;font-weight:700;letter-spacing:.7px;text-transform:uppercase;color:#94a3b8">
                    ${ventanas.length} turno${ventanas.length > 1 ? "s" : ""} registrado${ventanas.length > 1 ? "s" : ""}
                </span>
            </div>${filas}`;
        }

        function _htmlSinHorario(msg) {
            return `<div style="display:flex;align-items:center;gap:7px;color:#94a3b8;font-size:11px;padding:.2rem 0">
                <i class="bi bi-dash-circle" style="font-size:13px"></i><span>${esc(msg)}</span>
            </div>`;
        }

        function _horaBadge(horaStr, bg, color) {
            const hm = horaStr ? horaStr.substring(0, 5) : "—";
            return `<span style="font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;
                color:${color};background:${bg};padding:4px 10px;border-radius:7px;letter-spacing:.5px">${hm}</span>`;
        }

        /* ── RENDER Tablas de tiempos en paneles expandibles ── */
        function _renderTablasTiempos(d) {
            // Escribe en kpi-tiempos-* (ETA/SLA/Duración)
            // tabla-tiempos-* queda exclusivo para renderTablaResumen (actividades)
            _renderTablaUno(
                "#kpi-tiempos-CARGUE",
                "CARGUE",
                d.eta_cargue,
                d.sla_cargue,
                d.minutos_cargue_texto,
                d,
            );
            _renderTablaUno(
                "#kpi-tiempos-DESCARGUE",
                "DESCARGUE",
                d.eta_descargue,
                d.sla_entrega,
                d.minutos_descargue_texto,
                d,
            );
        }

        function _renderTablaUno(selector, tipo, eta, sla, minTexto, d) {
            const el = qs(selector);
            if (!el) return;
            const esCargue = tipo === "CARGUE";
            const filas = [
                {
                    etiqueta: esCargue
                        ? "ETA llegada a cargue"
                        : "ETA llegada a descargue",
                    valor: eta ?? "—",
                    highlight: true,
                },
                {
                    etiqueta: esCargue
                        ? "SLA ventana cargue"
                        : "SLA entrega comprometida",
                    valor: sla ?? "—",
                },
                {
                    etiqueta: esCargue
                        ? "Tiempo estándar cargue"
                        : "Tiempo estándar descargue",
                    valor: minTexto ?? "—",
                },
                {
                    etiqueta: "Duración tránsito (con buffer 28 %)",
                    valor: d.duracion_buffer_texto ?? "—",
                },
            ];

            let margenHtml = "";
            if (!esCargue && d.diferencia_min != null) {
                const abs = Math.abs(d.diferencia_min);
                const h = Math.floor(abs / 60);
                const m = abs % 60;
                const signo = d.diferencia_min >= 0 ? "+" : "−";
                const texto = `${signo}${h > 0 ? h + "h " : ""}${m}min`;
                const color = d.diferencia_min >= 0 ? "#16a34a" : "#dc2626";
                const bg =
                    d.diferencia_min >= 0 ? "rgba(22,163,74,.08)" : "rgba(220,38,38,.08)";
                const icono =
                    d.diferencia_min >= 0 ? "bi-check-circle-fill" : "bi-x-circle-fill";
                margenHtml = `
                    <div style="margin-top:.6rem;padding:.5rem .7rem;border-radius:8px;background:${bg};border:1px solid ${color}40;display:flex;align-items:center;gap:8px">
                        <i class="bi ${icono}" style="color:${color};font-size:13px"></i>
                        <div>
                            <div style="font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:${color}">${d.diferencia_min >= 0 ? "A TIEMPO" : "ATRASADO"}</div>
                            <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:${color}">${texto}</div>
                            <div style="font-size:10px;color:#475569">${d.diferencia_min >= 0 ? "de margen respecto al SLA" : "de retraso sobre el SLA"}</div>
                        </div>
                    </div>`;
            }

            const htmlFilas = filas
                .map(
                    (f) =>
                        `<tr${f.highlight ? ' style="background:#f0f9ff"' : ""}>
                    <td style="padding:5px 8px;color:#64748b;font-size:10px">${esc(f.etiqueta)}</td>
                    <td class="v" style="padding:5px 8px;text-align:right;font-family:'JetBrains Mono',monospace;font-size:11px;color:#0f172a;font-weight:600">${esc(String(f.valor))}</td>
                </tr>`,
                )
                .join("");

            el.innerHTML = `
                <table class="oc-table" style="width:100%">
                    <thead><tr><th colspan="2" style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;background:#f1f5f9;padding:5px 8px">
                        ${tipo} · Resumen de tiempos
                    </th></tr></thead>
                    <tbody>${htmlFilas}</tbody>
                </table>${margenHtml}`;
        }

        /* ── Estados UI ── */
        function _showLoading() {
            _show("#oc-horarios-loading");
            _hide("#oc-horarios-empty");
            _hide("#oc-horarios-content");
        }

        function _showEmpty(msg) {
            _hide("#oc-horarios-loading");
            _hide("#oc-horarios-content");
            const el = qs("#oc-horarios-empty");
            if (el) {
                el.innerHTML = `<i class="bi bi-exclamation-triangle me-1" style="color:#f59e0b"></i>${esc(msg)}`;
                el.style.display = "";
            }
        }

        function _show(sel) {
            const el = qs(sel);
            if (el) el.style.display = "";
        }

        function _hide(sel) {
            const el = qs(sel);
            if (el) el.style.display = "none";
        }

        /* ── Box ETA cargue en panel Planta Origen ── */
        // function _renderEtaCarguePanel(d) {
        //     const container = qs('#resumen-CARGUE');
        //     if (!container) return;

        //     const colorSemap = (c) => ({ green: '#10b981', amber: '#f59e0b', red: '#ef4444', slate: '#94a3b8' })[c] ?? '#94a3b8';
        //     const colLlegada = colorSemap(d.delta_llegada_color);
        //     const colSalida = colorSemap(d.delta_salida_color);

        //     const badge = (texto, color) => texto
        //         ? `<span style="font-size:8px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 5px;border-radius:6px;margin-left:4px;background:${color}18;color:${color};border:1px solid ${color}30">${texto}</span>`
        //         : '';

        //     const fila = (icono, colIcono, etiqueta, valor, badgeHtml, ejecutado) => {
        //         if (!valor) return '';
        //         const estiloVal = ejecutado ? 'color:#0f172a;font-weight:700' : 'color:#475569;font-style:italic';
        //         return `<div style="display:flex;align-items:center;gap:6px;padding:4px 0;border-bottom:1px solid #f1f5f9">
        //             <i class="bi ${icono}" style="font-size:10px;color:${colIcono};flex-shrink:0"></i>
        //             <span style="font-size:10px;color:#64748b;flex:1">${etiqueta}</span>
        //             <span style="font-family:'JetBrains Mono',monospace;font-size:11px;${estiloVal}">${valor}</span>${badgeHtml}
        //         </div>`;
        //     };

        //     const previo = container.querySelector('.eta-cargue-box');
        //     if (previo) previo.remove();

        //     const box = document.createElement('div');
        //     box.className = 'eta-cargue-box';
        //     box.style.cssText = 'background:rgba(3,105,161,.04);border:1px solid rgba(3,105,161,.15);border-radius:9px;padding:.8rem;margin-bottom:.75rem';
        //     box.innerHTML = `
        //     <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#0369a1;margin-bottom:.6rem;display:flex;align-items:center;gap:6px">
        //         <i class="bi bi-hourglass-split" style="font-size:11px"></i>Tiempos de Cargue
        //     </div>
        // ${fila('bi-clock', '#94a3b8', 'Llegada estimada', d.eta_posicionamiento, '', false)}
        // ${fila('bi-box-arrow-right', '#64748b', 'Salida estimada', d.eta_salida_planta, '', false)}
        // ${fila('bi-check-circle', '#10b981', 'Llegada real', d.fecha_ejecutada_posicionamiento, badge(d.delta_llegada_texto, colLlegada), true)}
        // ${fila('bi-check-circle-fill', '#10b981', 'Salida real', d.fecha_ejecutada_salida_planta, badge(d.delta_salida_texto, colSalida), true)}
        // ${d.minutos_planta_cargue_texto ? `<div style="margin-top:.5rem;font-size:9px;color:#64748b;display:flex;align-items:center;gap:5px"><i class="bi bi-clock-history" style="font-size:10px;color:#94a3b8"></i>Tiempo estándar en planta: <strong style="color:#0f172a">${d.minutos_planta_cargue_texto}</strong></div>` : ''}`;

        //     container.insertAdjacentElement('afterbegin', box);
        // }

        return { cargar, cargarSoloHorarios };
    })();

    // Definir la función initScript globalmente
    window.initScript = function (id) {
        window.VENTANA = id; // Asigna el ID recibido a la variable global

        // Crear instancia
        if (!window.myOffcanvas) {
            window.myOffcanvas = new DynamicOffcanvas({
                id: `customOffcanvas${id}`,
                title: '<span class="text-dark uil uil-car"></span> Consultar vehículo',
                content: "<p>Contenido inicial</p>",
                scroll: true,
                backdrop: false,
            });
        } else {
            console.log("El offcanvas ya está creado.");
        }

        let campoFechaInicial = document.getElementById(`fecha_inicial`);
        let campoFechaFinal = document.getElementById(`fecha_final`);

        if (campoFechaInicial && campoFechaFinal) {
            let hoy = new Date();
            let anio = hoy.getFullYear();
            let mes = hoy.getMonth() + 1;
            let dia = hoy.getDate();
            mes = mes < 10 ? `0${mes}` : mes;
            let diaActual = dia < 10 ? `0${dia}` : dia;
            let fechaInicio = `${anio}-${mes}-01`;
            let fechaFin = `${anio}-${mes}-${diaActual}`;
            campoFechaInicial.value = fechaInicio;
            campoFechaFinal.value = fechaFin;
            let fecha_inicial = campoFechaInicial.value;
            let fecha_final = campoFechaFinal.value;
            listar_pedidos_administrador(fecha_inicial, fecha_final);
        }

        document.addEventListener("click", async (e) => {
            /* Botón buscar por fechas */
            if (e.target.matches("#buscar") || e.target.matches("#buscar *")) {
                const fecha_inicial =
                    document.getElementById("fecha_inicial")?.value ?? "";
                const fecha_final = document.getElementById("fecha_final")?.value ?? "";
                const _estPub = document.getElementById("f-estado-pub")?.value ?? "";
                const _estTraz = document.getElementById("f-estado-traz")?.value ?? "";
                const _modalidad = document.getElementById("f-modalidad")?.value ?? "";

                document
                    .querySelectorAll(".kpi-resumen")
                    .forEach((c) => c.classList.remove("active"));

                if (_estTraz && _modalidad) {
                    listar_pedidos_administrador(
                        fecha_inicial,
                        fecha_final,
                        "",
                        _estTraz,
                        _modalidad,
                        "filt_traz_mod",
                    );
                } else if (_estPub && _modalidad) {
                    listar_pedidos_administrador(
                        fecha_inicial,
                        fecha_final,
                        _estPub,
                        _modalidad,
                        "",
                        "filt_mod",
                    );
                } else if (_estTraz) {
                    listar_pedidos_administrador(
                        fecha_inicial,
                        fecha_final,
                        _estTraz,
                        "",
                        "",
                        "trazabilidad",
                    );
                } else if (_estPub) {
                    listar_pedidos_administrador(
                        fecha_inicial,
                        fecha_final,
                        _estPub,
                        "",
                        "",
                        "filt",
                    );
                } else if (_modalidad) {
                    listar_pedidos_administrador(
                        fecha_inicial,
                        fecha_final,
                        "",
                        _modalidad,
                        "",
                        "mod",
                    );
                } else {
                    listar_pedidos_administrador(
                        fecha_inicial,
                        fecha_final,
                        "",
                        "",
                        "",
                        "",
                    );
                }
            }

            if (e.target.matches("#btn-carrito-pedidos") || e.target.matches("#btn-carrito-pedidos *")) {
                let clienId = document
                    .getElementById("btn-carrito-pedidos")
                    .getAttribute("data-idCliente");
                let pedidoId = document
                    .getElementById("btn-carrito-pedidos")
                    .getAttribute("data-idPedido");
                let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];

                if (carrito.length === 0) {
                    myOffcanvas.updateContent(
                        `<p class="text-center text-muted">No hay pedidos en el carrito.</p>`,
                    );
                } else {
                    let tablaHTML = `
              <table class="table table-striped table-sm" data-page-length='100' style="font-size:11px;">
                  <thead>
                      <tr>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>N° Pedido</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Placa</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Cliente</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Producto</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Unidades</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Presentación</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Neto</th>
                          <th class='text-center' style='width: auto; white-space: nowrap;'>Peso Bruto</th>
                      </tr>
                  </thead>
                  <tbody>`;

                    carrito.forEach((item, index) => {
                        tablaHTML += `
                  <tr>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${index + 1}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.id}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId4}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId || "-"}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId12 || "-"}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId7 || "-"}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId13 || "-"}</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId10 || "-"} KG</td>
                      <td class='text-center' style='width: auto; white-space: nowrap;'>${item.dataId11 || "-"} KG</td>
                  </tr>`;
                    });

                    tablaHTML += `
                    </tbody>
                    </table>
                    <div class="d-flex align-items-center justify-content-between">
                        <h5 id="titulo_opcion" class="mb-0 me-2 d-flex align-items-center justify-content-center">Título</h5>
                        <div id="acciones_asignacion"></div>
                    </div>
                    <hr class="my-1 text-dark">
                    <div class="container" id="contenido_opcion"></div>
                `;

                    myOffcanvas.updateTitle(`
                    <div class="d-flex align-items-center justify-content-between">
                        <span class="text-primary-emphasis uil uil-file-alt"></span> Listado de Pedidos
                        <div class="dropdown ms-2">
                        <a class="btn btn-link dropdown-toggle py-0 text-decoration-none" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Opciones</a>
                        <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                            <a class="dropdown-item fw-bold" href="#" id="btn_asignar_proveedor" data-id="${pedidoId}" data-id2="${clienId}" data-title="Asignar Proveedor"><span class="uil uil-file-search-alt"></span> Asignar Proveedor</a>
                            <a class="dropdown-item fw-bold" href="#" id="btn_publicar_pedido" data-id="${pedidoId}" data-id2="${clienId}" data-title="Publicar Pedidos"><span class="uil uil-feedback"></span> Publicar Pedido</a>
                        </div>
                        </div>
                    </div>
                `);

                    myOffcanvas.updateContent(tablaHTML);
                    myOffcanvas.updateHeight("100vh");
                    myOffcanvas.updateWidth("70%");
                    myOffcanvas.updateClass("offcanvas-end");
                }
                myOffcanvas.show();
            }

            if (e.target.matches("#btn_detalle_trazabilidad_pedido") || e.target.matches("#btn_detalle_trazabilidad_pedido *")) {
                let Enlace = e.target.closest("#btn_detalle_trazabilidad_pedido");
                let PedidoId = Enlace.getAttribute("data-id");

                myOffcanvas.updateTitle(
                    `<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad pedido`,
                );
                myOffcanvas.updateContent(`
                    <div class="table-responsive scrollbar">
                        <div class="timeline-wrapper bg-light rounded p-4">
                            <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
                            <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo"></div>
                        </div>
                        <div class="border-top border-translucent border-dashed pt-3"></div>
                        <table class="table table-sm text-center" style="font-size: 11px;">
                        <thead>
                            <tr>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>#</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Tipo Trazabilidad</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Observación</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Usuario</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Fecha</th>
                            <th class='text-center' style='width: auto; white-space: nowrap;'>Soporte</th>
                            </tr>
                        </thead>
                        <tbody id="tbody_detalle_trazabilidad_pedido" class="text-center">
                            <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                        </tbody>
                        </table>
                    </div>
                `);

                try {
                    let formData = new FormData();
                    formData.append("PedidoId", PedidoId);
                    let response = await fetch(
                        $("#base_url").val() + "torrecontrol/Listar_trazabilidad_pedido",
                        { method: "POST", body: formData },
                    );
                    let data = await response.json();
                    if (data) {
                        let rows = "";
                        data.forEach((servicio, index) => {
                            rows += `<tr>
                            <th scope="row">${index + 1}</th>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.tipo_trazabilidad}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.observacion}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_registro}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>
                                <a href="${$("#base_url").val()}${servicio.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm me-1 px-1 py-0">
                                    <i class="uil-file-download-alt"></i> Ver Documento
                                </a>
                            </td>
                            </tr>`;
                        });
                        document.getElementById(
                            "tbody_detalle_trazabilidad_pedido",
                        ).innerHTML = rows;
                    }
                } catch (error) {
                    console.error("Error al obtener trazabilidad:", error);
                    document.getElementById(
                        "tbody_detalle_trazabilidad_pedido",
                    ).innerHTML =
                        `<tr><td colspan="12" class="text-center text-danger">Error al cargar trazabilidad</td></tr>`;
                }

                // cargarLineaTiempo(PedidoId);
                myOffcanvas.show();
            }

            if (e.target.matches(`#btn-close-customOffcanvas${window.VENTANA}`) || e.target.matches(`#btn-close-customOffcanvas${window.VENTANA} *`)) {
                SatrackGPS.detener();
                sessionStorage.clear();
                actualizarContadorCarrito();
                const checkboxes = document.querySelectorAll(".servicioProveedor");
                checkboxes.forEach((element) => {
                    element.checked = false;
                });
                window.ArrayDespachos = [];
            }

            if (e.target.matches("#btn_detalle_trazabilidad") || e.target.matches("#btn_detalle_trazabilidad *")) {
                let Enlace = e.target.closest("#btn_detalle_trazabilidad");
                let ServicioId = Enlace.getAttribute("data-ServicioId");
                let RecursoId = Enlace.getAttribute("data-RecursoId");

                myOffcanvas.updateTitle(
                    `<span class="text-primary-emphasis uil uil-file-alt"></span> Detalle de solicitud de servicio`,
                );
                myOffcanvas.updateContent(`
                <div class="table-responsive scrollbar">
                    <table class="table table-sm text-center" style="font-size: 11px;">
                        <thead>
                        <tr>
                            <th scope="col" style='width: auto; white-space: nowrap;'>#</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Placa</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Ruta</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Sitio</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Latitud</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Longitud</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Fecha</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Nota</th>
                            <th scope="col" style='width: auto; white-space: nowrap;'>Usuario</th>
                        </tr>
                        </thead>
                        <tbody id="tbody_detalle_trazabilidad" class="text-center">
                        <tr><td colspan="12" class="text-center">Cargando servicios...</td></tr>
                        </tbody>
                    </table>
                    </div>
                    <div id="map" style="height: 600px; width: 100%;"></div>
                `);

                try {
                    let formData = new FormData();
                    formData.append("ServicioId", ServicioId);
                    formData.append("RecursoId", RecursoId);
                    let response = await fetch(
                        $("#base_url").val() + "torrecontrol/detalle_trazabilidad_pedido",
                        { method: "POST", body: formData },
                    );
                    let data = await response.json();
                    if (data) {
                        let rows = "";
                        data.forEach((servicio, index) => {
                            rows += `<tr>
                            <th scope="row">${index + 1}</th>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.placa_vehiculo}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.ruta}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.sitio_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.latitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.longitud}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.fecha_hora_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.nota_seguimiento}</td>
                            <td class='text-center' style='width: auto; white-space: nowrap;'>${servicio.usuario_reporte}</td>
                            </tr>`;
                        });
                        document.getElementById("tbody_detalle_trazabilidad").innerHTML =
                            rows;
                        initMapTrazabilidad(data);
                    }
                } catch (error) {
                    console.error("Error al obtener trazabilidad recurso:", error);
                    document.getElementById("tbody_detalle_trazabilidad").innerHTML =
                        `<tr><td colspan="12" class="text-center text-danger">Error al cargar datos</td></tr>`;
                }
                myOffcanvas.show();
            }

            if (e.target.matches("#btn_cancelar_pedido") || e.target.matches("#btn_cancelar_pedido *")) {
                let boton = e.target.closest("#btn_cancelar_pedido");
                let SolicitudId = boton.getAttribute("data-id");
                try {
                    const result = await Swal.fire({
                        title: "¿Seguro?",
                        text: "¿Desea cancelar la solicitud?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3B71CA",
                        cancelButtonColor: "#9FA6B2",
                        confirmButtonText: "Aceptar",
                        cancelButtonText: "Cancelar",
                        customClass: { popup: "swal2-custom-font" },
                    });
                    if (result.isConfirmed) {
                        let formData = new FormData();
                        formData.append("SolicitudId", SolicitudId);
                        let response = await fetch(
                            $("#base_url").val() + "torrecontrol/cancelar_solicitud_pedido",
                            { method: "POST", body: formData },
                        );
                        let data = await response.json();
                        if (data && data.status === true) {
                            await Swal.fire({
                                title: "Solicitud Cancelada",
                                text: data.message || "Cancelada exitosamente.",
                                icon: "success",
                                confirmButtonColor: "#3B71CA",
                                customClass: { popup: "swal2-custom-font" },
                            });
                            let fi =
                                document.getElementById(`campo-${window.VENTANA}-fecha_inicial`)
                                    ?.value ?? "";
                            let ff =
                                document.getElementById(`campo-${window.VENTANA}-fecha_final`)
                                    ?.value ?? "";
                            listar_pedidos_administrador(fi, ff);
                        } else {
                            await Swal.fire({
                                title: "Error",
                                text: data.message || "No se pudo cancelar.",
                                icon: "error",
                                confirmButtonColor: "#3B71CA",
                                customClass: { popup: "swal2-custom-font" },
                            });
                        }
                    }
                } catch (error) {
                    console.error("Error al cancelar solicitud:", error);
                    await Swal.fire({
                        title: "Error inesperado",
                        text: "Ocurrió un error al cancelar.",
                        icon: "error",
                        confirmButtonColor: "#3B71CA",
                        customClass: { popup: "swal2-custom-font" },
                    });
                }
            }

            if (e.target.matches(`#btn_detalle`) || e.target.matches(`#btn_detalle *`)) {
                let Enlace = e.target.closest("#btn_detalle");
                let PedidoId = Enlace.getAttribute("data-SolicitudId");
                let ServicioId = Enlace.getAttribute("data-ServicioId");
                let RecursoId = Enlace.getAttribute("data-RecursoId");

                myOffcanvas.updateTitle(
                    `<span class="text-primary-emphasis uil uil-file-alt"></span> Trazabilidad`,
                );
                myOffcanvas.updateContent(`
                    <div class="table-responsive scrollbar">
                        <div class="timeline-wrapper bg-light rounded p-4">
                            <h1 class="h6 mb-3 text-end"><span id='FechaEstimada'></span></h1>
                            <div class="d-flex justify-content-between position-relative timeline-line" id="lineaTiempo"></div>
                        </div>
                        <hr class="my-1 text-dark"><h6>Trazabilidad Pedido</h6><hr class="my-1 text-dark">
                        <table class="table table-sm text-center" style="font-size: 11px;">
                            <thead><tr>
                                <th>#</th><th>Tipo Trazabilidad</th><th>Observación</th><th>Usuario</th><th>Fecha</th><th>Soporte</th>
                            </tr></thead>
                            <tbody id="tbody_detalle_trazabilidad_pedido"><tr><td colspan="12" class="text-center">Cargando...</td></tr></tbody>
                        </table>
                    </div>
                    <hr class="my-1 text-dark"><h6>Trazabilidad Recurso</h6><hr class="my-1 text-dark">
                    <div class="table-responsive scrollbar">
                        <table class="table table-sm text-center" style="font-size: 11px;">
                            <thead><tr>
                                <th>#</th><th>Placa</th><th>Ruta</th><th>Sitio</th><th>Latitud</th><th>Longitud</th><th>Fecha</th><th>Nota</th><th>Usuario</th>
                            </tr></thead>
                            <tbody id="tbody_detalle_trazabilidad"><tr><td colspan="12" class="text-center">Cargando...</td></tr></tbody>
                        </table>
                    </div>
                    <div id="map" style="height: 600px; width: 100%;"></div>
                `);

                try {
                    let fd = new FormData();
                    fd.append("PedidoId", PedidoId);
                    let res = await fetch(
                        $("#base_url").val() + "torrecontrol/Listar_trazabilidad_pedido",
                        { method: "POST", body: fd },
                    );
                    let data = await res.json();
                    if (data) {
                        let rows = data
                            .map(
                                (s, i) => `<tr>
                            <th>${i + 1}</th>
                            <td>${s.tipo_trazabilidad}</td><td>${s.observacion}</td><td>${s.usuario}</td><td>${s.fecha_registro}</td>
                            <td><a href="${$("#base_url").val()}${s.evidencia}" target="_blank" class="btn btn-outline-primary btn-sm px-1 py-0"><i class="uil-file-download-alt"></i> Ver</a></td>
                        </tr>`,
                            )
                            .join("");
                        document.getElementById(
                            "tbody_detalle_trazabilidad_pedido",
                        ).innerHTML = rows;
                    }
                } catch (e) {
                    document.getElementById(
                        "tbody_detalle_trazabilidad_pedido",
                    ).innerHTML =
                        `<tr><td colspan="12" class="text-center text-danger">Error al cargar</td></tr>`;
                }

                try {
                    let fd = new FormData();
                    fd.append("ServicioId", ServicioId);
                    fd.append("RecursoId", RecursoId);
                    let res = await fetch(
                        $("#base_url").val() + "torrecontrol/detalle_trazabilidad_pedido",
                        { method: "POST", body: fd },
                    );
                    let data = await res.json();
                    if (data) {
                        let rows = data
                            .map(
                                (s, i) => `<tr>
                            <th>${i + 1}</th>
                            <td>${s.placa_vehiculo}</td><td>${s.ruta}</td><td>${s.sitio_seguimiento}</td>
                            <td>${s.latitud}</td><td>${s.longitud}</td><td>${s.fecha_hora_seguimiento}</td>
                            <td>${s.nota_seguimiento}</td><td>${s.usuario_reporte}</td>
                        </tr>`,
                            )
                            .join("");
                        document.getElementById("tbody_detalle_trazabilidad").innerHTML =
                            rows;
                        initMapTrazabilidad(data);
                    }
                } catch (e) {
                    document.getElementById("tbody_detalle_trazabilidad").innerHTML =
                        `<tr><td colspan="12" class="text-center text-danger">Error al cargar</td></tr>`;
                }

                // cargarLineaTiempo(PedidoId);
                myOffcanvas.show();
            }

            /* ══════════════════════════════════════════════════════════════
                  |  HANDLER PRINCIPAL — btn_detalle_trazabilidad_pedidos
                  |  Abre el offcanvas de detalle con ETA · SLA · Horarios · Mapa
                  ══════════════════════════════════════════════════════════════ */
            if (e.target.matches("#btn_detalle_trazabilidad_pedidos") || e.target.matches("#btn_detalle_trazabilidad_pedidos *")) {
                let BtnDetalle = e.target.closest("#btn_detalle_trazabilidad_pedidos");
                let SolicitudId = parseFloat(BtnDetalle.getAttribute("data-SolicitudId"));
                let LatitudOrigen = parseFloat(BtnDetalle.getAttribute("data-latitud_origen"));
                let LongitudOrigen = parseFloat(BtnDetalle.getAttribute("data-longitud_origen"));
                let LatitudDestino = parseFloat(BtnDetalle.getAttribute("data-latitud_destino"));
                let LongitudDestino = parseFloat(BtnDetalle.getAttribute("data-longitud_destino"));
                let ciudad_origen = BtnDetalle.getAttribute("data-ciudad_origen");
                let ciudad_destino = BtnDetalle.getAttribute("data-ciudad_destino");
                let fecha_creacion = BtnDetalle.getAttribute("data-fecha_creacion");
                let fecha_cargue = BtnDetalle.getAttribute("data-fecha_cargue");
                let fecha_entrega = BtnDetalle.getAttribute("data-fecha_entrega");
                let refPedido = BtnDetalle.getAttribute("data-refPedido");
                let tipoTrazabilidad = BtnDetalle.getAttribute("data-tipo_trazabilidad");

                document.getElementById("oc-estado-transito").innerHTML = tipoTrazabilidad;
                document.getElementById("oc-estado-transito-two").innerHTML = tipoTrazabilidad;

                const _placaRaw = BtnDetalle.getAttribute("data-placa");
                let placaVehiculo =
                    _placaRaw && _placaRaw !== "null" ? _placaRaw : null;

                // Detener rastreo anterior
                SatrackGPS.detener();

                // Inyectar ID en paneles expandibles
                document.querySelectorAll(".oc-sec-panel").forEach((panel) => {
                    panel.dataset.pedidoId = SolicitudId;
                });

                // Actualizar MAPA_CONFIG
                MAPA_CONFIG = window.MAPA_CONFIG = {
                    origen: {
                        lat: LatitudOrigen,
                        lng: LongitudOrigen,
                        label: ciudad_origen,
                    },
                    vehiculo: { label: placaVehiculo },
                    destino: {
                        lat: LatitudDestino,
                        lng: LongitudDestino,
                        label: ciudad_destino,
                    },
                    radioOrigen: 300,
                    radioDestino: 250,
                };

                // Variables globales línea de tiempo
                window._tlSolicitudId = SolicitudId;
                window._tlFechaCreacion = fecha_creacion;
                window._tlFechaCargue = fecha_cargue;
                window._tlFechaEntrega = fecha_entrega;
                window._tlTipoTrazabilidad = tipoTrazabilidad;
                window._satrackPlacaActiva = placaVehiculo;
                window._salidaCargueProgramada = null;

                // Actualizar DOM cabecera
                const setEl = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.innerHTML = val;
                };
                setEl("det-pedido", refPedido);
                setEl("det-pedido-hero", refPedido);
                setEl("ciudad-origen", ciudad_origen);
                setEl("ciudad-destino", ciudad_destino);

                // ── 1. Cargar horarios ANTES de que Maps responda ──
                TiemposLogisticos.cargarSoloHorarios(SolicitudId);

                // ── 2. Detalle proceso (conductor / placa) ──
                try {
                    const fd = new FormData();
                    fd.append("Solicitud", SolicitudId);
                    const res = await fetch(
                        $("#base_url").val() + "torrecontrol/detalle_proceso",
                        { method: "POST", body: fd },
                    );
                    const data = await res.json();
                    const sub = data.consulta_subasta[0];
                    const safe = (v) => v ?? "";
                    setEl("nc-conductor", safe(sub?.nombre_conductor));
                    setEl("pc-placa", safe(sub?.referencia));
                    setEl("pl-titulo", safe(sub?.referencia));
                    setEl("mnc-conductor", safe(sub?.nombre_conductor));
                    setEl("mpc-placa", safe(sub?.referencia));
                    setEl(
                        "fp-planta-origen",
                        sub?.fecha_inicio && sub?.hora_inicio
                            ? `${sub.fecha_inicio} ${sub.hora_inicio}`
                            : "",
                    );
                } catch (err) {
                    console.error("Error detalle proceso:", err);
                }

                // ── 3. Trazabilidad real del pedido ──
                try {
                    const fdTraz = new FormData();
                    fdTraz.append("PedidoId", SolicitudId);
                    const resTraz = await fetch(
                        $("#base_url_api").val() + "Trazabilidad_pedidos",
                        {
                            method: "POST",
                            headers: { "X-API-KEY": "nexos_nacional2026@*" },
                            body: fdTraz,
                        },
                    );
                    const jsonTraz = await resTraz.json();
                    window._trazabilidadPedido =
                        jsonTraz.numero === 200 && Array.isArray(jsonTraz.data)
                            ? jsonTraz.data
                            : [];
                } catch (e) {
                    console.warn("Sin trazabilidad:", e);
                    window._trazabilidadPedido = [];
                }

                // ── 4. Línea de tiempo ──
                actualizarLineaTiempo(
                    SolicitudId,
                    fecha_creacion,
                    fecha_cargue,
                    fecha_entrega,
                    0,
                    tipoTrazabilidad,
                );
            }

            // ══════════════════════════════════════════════════════════════
            //  refrescarOffcanvas — re-ejecuta todo el flujo de datos del
            //  offcanvas usando las variables window.* ya guardadas.
            //  La llaman: btnActualizar y (si se necesita) cualquier otro.
            // ══════════════════════════════════════════════════════════════
            window.refrescarOffcanvas = async function refrescarOffcanvas() {
                const SolicitudId = window._tlSolicitudId;
                const fecha_creacion = window._tlFechaCreacion;
                const fecha_cargue = window._tlFechaCargue;
                const fecha_entrega = window._tlFechaEntrega;
                const tipoTrazabilidad = window._tlTipoTrazabilidad;
                const placaVehiculo = window._satrackPlacaActiva;

                if (!SolicitudId) return; // offcanvas no inicializado aún

                ocLoaderShow();

                const setEl = (id, val) => {
                    const el = document.getElementById(id);
                    if (el) el.innerHTML = val ?? '';
                };

                // ── 1. Horarios ──
                TiemposLogisticos.cargarSoloHorarios(SolicitudId);

                // ── 2. Detalle proceso (conductor / placa) ──
                try {
                    const fd = new FormData();
                    fd.append('Solicitud', SolicitudId);
                    const res = await fetch($('#base_url').val() + 'torrecontrol/detalle_proceso', { method: 'POST', body: fd });
                    const data = await res.json();
                    const sub = data.consulta_subasta[0];
                    const safe = (v) => v ?? '';
                    setEl('nc-conductor', safe(sub?.nombre_conductor));
                    setEl('pc-placa', safe(sub?.referencia));
                    setEl('pl-titulo', safe(sub?.referencia));
                    setEl('mnc-conductor', safe(sub?.nombre_conductor));
                    setEl('mpc-placa', safe(sub?.referencia));
                    setEl('fp-planta-origen',
                        sub?.fecha_inicio && sub?.hora_inicio
                            ? `${sub.fecha_inicio} ${sub.hora_inicio}` : '');
                } catch (err) {
                    console.error('refrescarOffcanvas - detalle_proceso:', err);
                }

                // ── 3. Trazabilidad ──
                try {
                    const fdTraz = new FormData();
                    fdTraz.append('PedidoId', SolicitudId);
                    const resTraz = await fetch($('#base_url_api').val() + 'Trazabilidad_pedidos', {
                        method: 'POST',
                        headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
                        body: fdTraz,
                    });
                    const jsonTraz = await resTraz.json();
                    window._trazabilidadPedido =
                        jsonTraz.numero === 200 && Array.isArray(jsonTraz.data)
                            ? jsonTraz.data : [];
                } catch (e) {
                    console.warn('refrescarOffcanvas - trazabilidad:', e);
                    window._trazabilidadPedido = [];
                }

                // ── 4. Línea de tiempo ──
                actualizarLineaTiempo(SolicitudId, fecha_creacion, fecha_cargue, fecha_entrega, 0, tipoTrazabilidad);

                // ── 5. Mapa: geocercas + ruta + Satrack ──
                if (ocMap) {
                    google.maps.event.trigger(ocMap, 'resize');
                    if (MAPA_CONFIG.origen) ocMap.setCenter(MAPA_CONFIG.origen);
                    await cargarGeocercasPedido(SolicitudId);
                    if (placaVehiculo) {
                        SatrackGPS.detener();
                        SatrackGPS.iniciar(placaVehiculo, ocMap, vehiculoMarker, directionsRenderer, infoWin);
                    }
                }

                ocLoaderHide();
            };

            // ── actualizarInfoRuta: recibe legs de Google Maps ──
            // Expuesta en window para que SatrackGPS._recalcularRuta pueda llamarla.
            //
            // @param {google.maps.DirectionsLeg[]} legs   - Tramos de la ruta calculada.
            // @param {'gps'|'remitente'} fuente           - Origen del cálculo:
            //   'gps'       → posición real del vehículo (Satrack)
            //   'remitente' → coordenadas de origen del pedido (sin placa asignada)
            window.actualizarInfoRuta = function actualizarInfoRuta(legs, fuente) {
                // fuente por defecto según si hay placa activa
                const _fuente = fuente ?? (window._satrackPlacaActiva ? 'gps' : 'remitente');

                let totalDistanciaM = 0;
                let totalDuracionS = 0;
                legs.forEach((leg) => {
                    totalDistanciaM += leg.distance.value;
                    totalDuracionS += leg.duration.value;
                });

                // Valores crudos de Maps (sin buffer) — se envian al backend tal cual.
                // El backend aplica su propio 28% internamente.
                const duracionCrudaS = totalDuracionS;
                const distanciaCrudaM = totalDistanciaM;

                // ── MÁRGEN DE CONTINGENCIA (28%) — solo para badges visuales ──
                // Google Maps nunca incluye buffer; se aplica aqui unicamente
                // para mostrar distancia/duracion en pantalla.
                totalDistanciaM = Math.round(distanciaCrudaM * 1.28);
                totalDuracionS = Math.round(duracionCrudaS * 1.28);

                // ── Distancia ──
                const km = (totalDistanciaM / 1000).toFixed(1);
                const distanciaText = km >= 1 ? `${km} km` : `${totalDistanciaM} m`;

                // ── Duración ──
                const horas = Math.floor(totalDuracionS / 3600);
                const minutos = Math.floor((totalDuracionS % 3600) / 60);
                let duracionText = "";
                if (horas > 0) duracionText += `${horas} h `;
                if (minutos > 0) duracionText += `${minutos} min`;
                if (!duracionText) duracionText = "< 1 min";

                // ── Etiqueta de origen según fuente ──
                // 'gps'       → 📡 Desde GPS  (posición real del vehículo)
                // 'remitente' → 📦 Desde Origen (coordenadas del remitente)
                const origenLabel = _fuente === 'gps'
                    ? '📡 Desde GPS'
                    : '📦 Desde Origen';

                // ── Actualizar badge Distancia ──
                const elDist = document.getElementById("ocMapDistancia");
                if (elDist) {
                    elDist.innerHTML =
                        `${distanciaText} <small style="font-weight:400;opacity:.75;font-size:.75em">${origenLabel}</small>`;
                }

                // ── Actualizar badge Duración ──
                const elDur = document.getElementById("ocMapDuracion");
                if (elDur) {
                    elDur.innerHTML =
                        `${duracionText} <small style="font-weight:400;opacity:.75;font-size:.75em">${origenLabel}</small>`;
                }

                // ── Actualizar timestamp de última actualización ──
                const elTs = document.getElementById("ocMapTs");
                if (elTs) {
                    elTs.textContent = new Date().toLocaleTimeString("es-CO", {
                        hour: "2-digit", minute: "2-digit", second: "2-digit",
                    });
                }

                // ══ INTEGRACIÓN TIEMPOS LOGÍSTICOS ══
                // Cuando Maps responde, llamamos al endpoint con la duración total bruta.
                // El servicio aplica el buffer configurado, ajusta horarios y devuelve
                // ETA · SLA · estado de la operación.
                const pedidoId = window._tlSolicitudId;
                if (pedidoId) {
                    TiemposLogisticos.cargar(pedidoId, duracionCrudaS);
                }
            }

            // ── cargarGeocercasPedido ──
            async function cargarGeocercasPedido(pedidoId) {
                if (!ocMap) return;
                try {
                    const baseUrl = document.getElementById("base_url_api").value;
                    const formData = new FormData();
                    formData.append("PedidoId", pedidoId);
                    const res = await fetch(baseUrl + "Geocercas_pedido", {
                        method: "POST",
                        headers: { "X-API-KEY": "nexos_nacional2026@*" },
                        body: formData,
                    });
                    const json = await res.json();
                    if (json.numero !== 200) return;

                    const { remitente, destinatario, todos_puntos } = json.data;
                    const { AdvancedMarkerElement, PinElement } =
                        await google.maps.importLibrary("marker");
                    const { Circle } = await google.maps.importLibrary("maps");
                    const { DirectionsService, TravelMode } =
                        await google.maps.importLibrary("routes");

                    if (remitente?.lat && remitente?.lng)
                        MAPA_CONFIG.origen = {
                            lat: remitente.lat,
                            lng: remitente.lng,
                            label: remitente.nombre,
                        };
                    if (destinatario?.lat && destinatario?.lng)
                        MAPA_CONFIG.destino = {
                            lat: destinatario.lat,
                            lng: destinatario.lng,
                            label: destinatario.nombre,
                        };

                    // Calcular ruta origen->destino SIEMPRE.
                    // Con placa: pinta la ruta visual Y llama actualizarInfoRuta('remitente')
                    //   como valor inicial. Satrack lo sobreescribe con 'gps' cuando
                    //   obtenga la posicion real del vehiculo.
                    // Sin placa: es el calculo definitivo.
                    if (MAPA_CONFIG.origen?.lat && MAPA_CONFIG.destino?.lat && directionsRenderer) {
                        await new Promise((resolve) => {
                            new DirectionsService().route(
                                {
                                    origin: {
                                        lat: MAPA_CONFIG.origen.lat,
                                        lng: MAPA_CONFIG.origen.lng,
                                    },
                                    destination: {
                                        lat: MAPA_CONFIG.destino.lat,
                                        lng: MAPA_CONFIG.destino.lng,
                                    },
                                    travelMode: TravelMode.DRIVING,
                                },
                                (result, status) => {
                                    if (status === 'OK') {
                                        directionsRenderer.setDirections(result);
                                        // Siempre actualizar badges y tarjetas SLA.
                                        // Con placa: Satrack sobreescribira con 'gps' cuando llegue.
                                        actualizarInfoRuta(result.routes[0].legs, 'remitente');
                                    } else {
                                        console.warn('Directions error (origen->destino):', status);
                                    }
                                    resolve();
                                },
                            );
                        });
                    }

                    function animarCirculo(circle, radioBase) {
                        let creciendo = true,
                            radio = radioBase,
                            opacidad = 0.7;
                        setInterval(() => {
                            if (creciendo) {
                                radio += radioBase * 0.08;
                                opacidad -= 0.04;
                                if (radio >= radioBase * 1.6) creciendo = false;
                            } else {
                                radio -= radioBase * 0.08;
                                opacidad += 0.04;
                                if (radio <= radioBase) creciendo = true;
                            }
                            circle.setRadius(radio);
                            circle.setOptions({ strokeOpacity: Math.max(0.1, opacidad) });
                        }, 80);
                    }

                    if (remitente?.lat && remitente?.lng) {
                        const pinRem = new PinElement({
                            background: "#0369a1",
                            borderColor: "#0c4a6e",
                            glyphColor: "#fff",
                            glyph: "🏭",
                            scale: 1.2,
                        });
                        new AdvancedMarkerElement({
                            map: ocMap,
                            position: { lat: remitente.lat, lng: remitente.lng },
                            title: `Remitente: ${remitente.nombre}`,
                            content: pinRem.element,
                        });
                        remitente.geocercas.forEach((g) => {
                            if (!g.lat || !g.lng) return;
                            const c = new Circle({
                                map: ocMap,
                                center: { lat: g.lat, lng: g.lng },
                                radius: 25,
                                strokeColor: "#0369a1",
                                strokeOpacity: 0.7,
                                strokeWeight: 2,
                                fillColor: "#0369a1",
                                fillOpacity: 0.06,
                            });
                            animarCirculo(c, 25);
                        });
                    }

                    if (destinatario?.lat && destinatario?.lng) {
                        const pinDes = new PinElement({
                            background: "#16a34a",
                            borderColor: "#14532d",
                            glyphColor: "#fff",
                            glyph: "🏪",
                            scale: 1.2,
                        });
                        new AdvancedMarkerElement({
                            map: ocMap,
                            position: { lat: destinatario.lat, lng: destinatario.lng },
                            title: `Destinatario: ${destinatario.nombre}`,
                            content: pinDes.element,
                        });
                        destinatario.geocercas.forEach((g) => {
                            if (!g.lat || !g.lng) return;
                            const c = new Circle({
                                map: ocMap,
                                center: { lat: g.lat, lng: g.lng },
                                radius: 1500,
                                strokeColor: "#16a34a",
                                strokeOpacity: 0.7,
                                strokeWeight: 2,
                                fillColor: "#16a34a",
                                fillOpacity: 0.06,
                            });
                            animarCirculo(c, 1500);
                        });
                    }

                    todos_puntos.forEach((punto) => {
                        if (punto.esPedido || !punto.lat || !punto.lng) return;
                        const pin = new PinElement({
                            background: "#94a3b8",
                            borderColor: "#475569",
                            glyphColor: "#fff",
                            glyph: "📍",
                            scale: 0.8,
                        });
                        new AdvancedMarkerElement({
                            map: ocMap,
                            position: { lat: punto.lat, lng: punto.lng },
                            title: punto.nombre,
                            content: pin.element,
                        });
                    });
                } catch (ex) {
                    console.warn("Error cargando geocercas:", ex);
                }
            }

            // ── initOcMap ──
            async function initOcMap() {
                if (!MAPA_CONFIG.origen || !MAPA_CONFIG.destino) {
                    setTimeout(initOcMap, 200);
                    return;
                }
                const { Map, InfoWindow } = await google.maps.importLibrary("maps");
                const { AdvancedMarkerElement, PinElement } =
                    await google.maps.importLibrary("marker");
                const { DirectionsRenderer } =
                    await google.maps.importLibrary("routes");
                const mapDiv = document.getElementById("ocMap");
                if (!mapDiv) return;

                ocMap = new Map(mapDiv, {
                    center: MAPA_CONFIG.origen,
                    zoom: 6,
                    mapId: "DEMO_MAP_ID",
                    mapTypeId: "roadmap",
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                });

                const pinVehiculo = new PinElement({
                    background: "#ea580c",
                    borderColor: "#9a3412",
                    glyphColor: "#fff",
                    glyph: "🚛",
                    scale: 1.3,
                });
                vehiculoMarker = new AdvancedMarkerElement({
                    map: ocMap,
                    position: null,
                    title: MAPA_CONFIG.vehiculo?.label ?? "",
                    content: pinVehiculo.element,
                });

                directionsRenderer = new DirectionsRenderer({
                    map: ocMap,
                    suppressMarkers: true,
                    polylineOptions: {
                        strokeColor: "#0369a1",
                        strokeWeight: 4,
                        strokeOpacity: 0.75,
                    },
                });

                infoWin = new InfoWindow({
                    content: `<div style="font-family:sans-serif;font-size:12px;min-width:180px;"><div style="font-weight:700;color:#0f172a;margin-bottom:6px">🚛 Cargando…</div></div>`,
                });
                vehiculoMarker.addListener("click", () =>
                    infoWin.open({ anchor: vehiculoMarker, map: ocMap }),
                );

                await cargarGeocercasPedido(window._tlSolicitudId);

                const placa = window._satrackPlacaActiva;
                if (placa)
                    SatrackGPS.iniciar(
                        placa,
                        ocMap,
                        vehiculoMarker,
                        directionsRenderer,
                        infoWin,
                    );

                ocLoaderHide();
            }

            // ── Helpers loader ──
            function ocLoaderShow() {
                const el = document.getElementById('ocLoader');
                if (el) el.classList.remove('oc-loader-hidden');
            }

            function ocLoaderHide() {
                const el = document.getElementById('ocLoader');
                if (el) el.classList.add('oc-loader-hidden');
            }

            // ── Listener offcanvas ──
            const offcanvasEl = document.getElementById("offcanvasPedido");
            if (offcanvasEl) {
                // Mostrar loader cada vez que se abre el offcanvas
                offcanvasEl.addEventListener("show.bs.offcanvas", () => {
                    ocLoaderShow();
                });

                // ── btnActualizar: re-ejecuta todo el flujo ──
                const btnActualizar = document.getElementById('btnActualizar');
                if (btnActualizar) {
                    btnActualizar.addEventListener('click', () => {
                        window.refrescarOffcanvas();
                    });
                }


                offcanvasEl.addEventListener("shown.bs.offcanvas", () => {
                    if (!mapLoaded) {
                        mapLoaded = true;
                        setTimeout(initOcMap, 100);
                    } else if (ocMap) {
                        setTimeout(async () => {
                            google.maps.event.trigger(ocMap, "resize");
                            ocMap.setCenter(MAPA_CONFIG.vehiculo ?? MAPA_CONFIG.origen);
                            await cargarGeocercasPedido(window._tlSolicitudId);
                            const placa = window._satrackPlacaActiva;
                            if (placa) {
                                SatrackGPS.detener();
                                SatrackGPS.iniciar(
                                    placa,
                                    ocMap,
                                    vehiculoMarker,
                                    directionsRenderer,
                                    infoWin,
                                );
                            }
                            ocLoaderHide();
                        }, 100);
                    }
                });
            }
        }); // cierre document.addEventListener('click')

        // ══ VARIABLES DEL MAPA — scope de initScript ══
        let ocMap = null;
        let vehiculoMarker = null;
        let directionsRenderer = null;
        let infoWin = null;
        let mapLoaded = false;
        window.MAPA_CONFIG = {};
        let MAPA_CONFIG = window.MAPA_CONFIG;

        // Timestamp live
        const ocMapTs = document.getElementById("ocMapTs");
        function ocTick() {
            if (ocMapTs)
                ocMapTs.textContent = new Date().toLocaleTimeString("es-CO", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                });
        }
        ocTick();
        setInterval(ocTick, 1000);

        // ══ KPI CARDS — clic para filtrar ══
        document.querySelectorAll(".kpi-resumen").forEach(function (card) {
            card.addEventListener("click", function () {
                document.querySelectorAll(".kpi-resumen").forEach(function (c) {
                    c.classList.remove("active");
                });
                this.classList.add("active");
                const filtro = this.dataset.filtro;
                const fi = document.getElementById("fecha_inicial")?.value ?? "";
                const ff = document.getElementById("fecha_final")?.value ?? "";
                if (filtro === "todos") {
                    listar_pedidos_administrador(fi, ff, "", "", "", "");
                } else {
                    listar_pedidos_administrador(
                        fi,
                        ff,
                        filtro,
                        "",
                        "",
                        "estado_publicacion",
                    );
                }
            });
        });

        // ── Botón Limpiar filtros ──
        const btnLimpiar = document.getElementById("btn-limpiar");
        if (btnLimpiar) {
            btnLimpiar.addEventListener("click", function () {
                ["f-modalidad", "f-estado-pub", "f-estado-traz"].forEach((id) => {
                    const el = document.getElementById(id);
                    if (el) el.value = "";
                });
                const fi = document.getElementById("fecha_inicial");
                const ff = document.getElementById("fecha_final");
                if (fi) fi.value = "";
                if (ff) ff.value = "";
                document
                    .querySelectorAll(".kpi-resumen")
                    .forEach((c) => c.classList.remove("active"));
                const tbody = document.getElementById("tbl_administrar_pedidos");
                if (tbody)
                    tbody.innerHTML = `<tr><td colspan="25" class="text-center" style="padding:50px;color:var(--slate-400);">
                    <i class="bi bi-inbox" style="font-size:2rem;display:block;margin-bottom:8px;"></i>
                    Filtros limpiados — realice una nueva consulta</td></tr>`;
                const badge = document.getElementById("badge-total-tabla");
                if (badge) badge.textContent = "0 registros";
                const pagBar = document.getElementById("pagination-bar");
                if (pagBar) pagBar.style.display = "none";
                sessionStorage.removeItem("carrito");
                actualizarContadorCarrito();
                [
                    "kpi-total",
                    "kpi-pendiente",
                    "kpi-publicado",
                    "kpi-asignado",
                    "kpi-cancelado",
                ].forEach((id) => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = "0";
                });
            });
        }

        // ── Select All checkboxes ──
        $("#selectAll").on("change", function () {
            let isChecked = $(this).prop("checked");
            $(".pedido-checkbox").prop("checked", isChecked);
            let carrito = isChecked ? obtenerTodosLosPedidos() : [];
            sessionStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContadorCarrito();
        });

        $(document).on("change", ".pedido-checkbox", function () {
            let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
            let modalidadActual = $(this).data("id15");
            let modalidadesEnCarrito = carrito.map((item) => item.dataId15);
            let modalidadesUnicas = [...new Set(modalidadesEnCarrito)];

            if (
                $(this).prop("checked") &&
                modalidadesUnicas.length > 0 &&
                !modalidadesUnicas.includes(modalidadActual)
            ) {
                Swal.fire({
                    icon: "warning",
                    title: "Modalidades diferentes",
                    text: "No puedes seleccionar pedidos con diferentes modalidades.",
                });
                $(this).prop("checked", false);
                return;
            }

            let pedido = {
                id: $(this).val(),
                dataId: $(this).data("id"),
                dataId2: $(this).data("id2"),
                dataId3: $(this).data("id3"),
                dataId4: $(this).data("id4"),
                dataId5: $(this).data("id5"),
                dataId6: $(this).data("id6"),
                dataId7: $(this).data("id7"),
                dataId8: $(this).data("id8"),
                dataId9: $(this).data("id9"),
                dataId10: $(this).data("id10"),
                dataId11: $(this).data("id11"),
                dataId12: $(this).data("id12"),
                dataId13: $(this).data("id13"),
                dataId14: $(this).data("id14"),
                dataId15: modalidadActual,
            };

            if ($(this).prop("checked")) {
                if (!carrito.some((item) => item.id === pedido.id))
                    carrito.push(pedido);
            } else {
                carrito = carrito.filter((item) => item.id !== pedido.id);
            }

            let rowId = $(this).data("row");
            let row = document.getElementById(rowId);
            if (row)
                row.style.backgroundColor = $(this).is(":checked") ? "#d8ddf9" : "";

            $("#selectAll").prop(
                "checked",
                $(".pedido-checkbox:checked").length === $(".pedido-checkbox").length,
            );
            sessionStorage.setItem("carrito", JSON.stringify(carrito));

            let btnCarrito = document.getElementById("btn-carrito-pedidos");
            if (btnCarrito) {
                btnCarrito.style.display = carrito.length > 0 ? "" : "none";
                btnCarrito.setAttribute("data-idPedido", pedido.id);
                btnCarrito.setAttribute("data-idCliente", pedido.dataId14);
            }
            actualizarContadorCarrito();
        });

        document.addEventListener("input", async (e) => {
            if (
                e.target.matches(`#campo-${window.VENTANA}-filtro`) ||
                e.target.matches(`#campo-${window.VENTANA}-filtro *`)
            ) {
                let filtro = document
                    .getElementById(`campo-${window.VENTANA}-filtro`)
                    .value.trim();
                let fi =
                    document.getElementById(`campo-${window.VENTANA}-fecha_inicial`)
                        ?.value ?? "";
                let ff =
                    document.getElementById(`campo-${window.VENTANA}-fecha_final`)
                        ?.value ?? "";
                listar_pedidos_administrador(fi, ff, filtro, "", "", "");
            }
        });

        // ── Botón Excel ──
        document.getElementById("exportar_excel").addEventListener("click", function () {
            var table = document.getElementById("table1");
            var wb = XLSX.utils.table_to_book(table);
            Array.from(table.getElementsByTagName("td")).forEach(function (td) {
                const text = td.innerText.trim();
                if (/^\d{4}-\d{2}-\d{2}$/.test(text)) td.setAttribute("data-t", "s");
            });
            const fechaActual = new Date().toISOString().slice(0, 10);
            XLSX.writeFile(wb, `Informe de Pedidos ${fechaActual}.xlsx`);
        });
    };

    /* ─────────────────────────────────────────────────────────────────
         ocToggle — abre/cierra paneles del offcanvas
      ───────────────────────────────────────────────────────────────── */
    function ocToggle(panelId, btnId, operacion) {
        const panel = document.getElementById(panelId);
        const btn = document.getElementById(btnId);
        const isOpen = panel.classList.contains("open");
        document
            .querySelectorAll(".oc-sec-panel")
            .forEach((p) => p.classList.remove("open"));
        document
            .querySelectorAll(".oc-tl-expand-btn")
            .forEach(
                (b) => (b.innerHTML = '<i class="bi bi-chevron-down me-1"></i>Detalle'),
            );
        if (!isOpen) {
            panel.classList.add("open");
            btn.innerHTML = '<i class="bi bi-chevron-up me-1"></i>Ocultar';
            const pedidoId = panel.dataset.pedidoId;
            if (pedidoId) cargarTareasOC(pedidoId, operacion, panelId);
            else console.warn("⚠️ ocToggle: el panel no tiene data-pedido-id");
            setTimeout(
                () => panel.scrollIntoView({ behavior: "smooth", block: "nearest" }),
                60,
            );
        }
    }

    /* ─────────────────────────────────────────────────────────────────
         cargarTareasOC — carga tareas del panel expandible
      ───────────────────────────────────────────────────────────────── */
    async function cargarTareasOC(pedidoId, operacion, panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        const subtlEl = panel.querySelector(".col-lg-7 .oc-sub-tl");
        const contenedorTabla = document.getElementById(
            `tabla-tiempos-${operacion}`,
        );
        if (subtlEl)
            subtlEl.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px"><i class="bi bi-arrow-repeat me-1"></i>Cargando tareas…</div>`;

        try {
            const baseUrl = document.getElementById("base_url_api").value;
            const formData = new FormData();
            formData.append("PedidoId", pedidoId);
            formData.append("Operacion", operacion);
            const response = await fetch(baseUrl + "Listar_tareas_oc", {
                method: "POST",
                headers: { "X-API-KEY": "nexos_nacional2026@*" },
                body: formData,
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const json = await response.json();
            if (json.numero !== 200) {
                if (subtlEl)
                    subtlEl.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px">${json.mensaje}</div>`;
                return;
            }
            const tareas = json.data;
            if (Array.isArray(tareas) && tareas.length > 0) {
                const tareasConTiempos = calcularTiempos(tareas, window._tlFechaCargue);
                renderTareasOC(panel, tareasConTiempos, pedidoId, operacion);
                const tituloMapa = {
                    CARGUE: "Planta Origen",
                    DESCARGUE: "Planta Destino",
                    TRANSITO: "Tránsito",
                };
                renderTablaResumen(
                    contenedorTabla,
                    tareasConTiempos,
                    tituloMapa[operacion] ?? operacion,
                );
            } else {
                if (subtlEl)
                    subtlEl.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px"><i class="bi bi-inbox me-1"></i>Sin tareas registradas.</div>`;
                if (contenedorTabla)
                    contenedorTabla.innerHTML = `<div class="text-center py-3" style="color:#94a3b8;font-size:12px">Sin datos disponibles</div>`;
            }
        } catch (error) {
            console.error("❌ cargarTareasOC:", error);
            if (subtlEl)
                subtlEl.innerHTML = `<div style="padding:.8rem;color:#ef4444;font-size:12px"><i class="bi bi-exclamation-triangle me-1"></i>Error al cargar tareas: ${error.message}</div>`;
        }
    }

    function renderTareasOC(panel, tareas, pedidoId, operacion) {
        const micropasos = tareas
            .map(
                (t) => `
            <div class="oc-micro-step ${t.estado === "COMPLETADO" ? "oc-ms-done" : t.estado === "EN GESTION" ? "oc-ms-active" : ""}">${t.nombre.split(" ")[0]}</div>
        `,
            )
            .join("");
        const subItems = tareas
            .map((t) => _buildSubItem(t, pedidoId, operacion))
            .join("");
        const microEl = panel.querySelector(".oc-micro");
        const subtlEl = panel.querySelector(".col-lg-7 .oc-sub-tl");
        if (microEl) microEl.innerHTML = micropasos;
        if (subtlEl) subtlEl.innerHTML = subItems;
    }

    async function completarTareaOC(
        tareaId,
        pedidoId,
        nuevoEstado,
        operacion,
        panelId,
    ) {
        try {
            const baseUrl = document.getElementById("base_url_api").value;
            const formData = new FormData();
            formData.append("TareaId", tareaId);
            formData.append("PedidoId", pedidoId);
            formData.append("Estado", nuevoEstado);
            formData.append("Operacion", operacion);
            const response = await fetch(
                baseUrl + "torrecontrol/Completar_tarea_oc",
                { method: "POST", body: formData },
            );
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (data.success) {
                await cargarTareasOC(pedidoId, operacion, panelId);
            } else {
                alert(
                    "No se pudo actualizar la tarea: " +
                    (data.message || "Error desconocido"),
                );
            }
        } catch (error) {
            console.error("❌ completarTareaOC:", error);
            alert("Error al completar tarea: " + error.message);
        }
    }

    function _buildSubItem(t, pedidoId, operacion) {
        const iconMap = {
            "EN GESTION": "bi-arrow-repeat",
            "SIN INICIAR": "bi-clock",
            COMPLETADO: "bi-check-lg",
            CANCELADO: "bi-x-lg",
            PAUSADO: "bi-pause-circle",
        };
        const badgeMap = {
            "EN GESTION": "oc-sub-badge-active",
            "SIN INICIAR": "oc-sub-badge-pending",
            COMPLETADO: "oc-sub-badge-done",
            CANCELADO: "oc-sub-badge-pending",
            PAUSADO: "oc-sub-badge-pending",
        };
        const badgeLabel = {
            "EN GESTION": "EN GESTIÓN",
            "SIN INICIAR": "SIN INICIAR",
            COMPLETADO: "COMPLETADO",
            CANCELADO: "CANCELADO",
            PAUSADO: "PAUSADO",
        };
        const nodoClase =
            {
                "EN GESTION": "active",
                "SIN INICIAR": "pending",
                COMPLETADO: "done",
                CANCELADO: "risk",
                PAUSADO: "pending",
            }[t.estado] ?? "pending";

        let tiempos = "";
        if (t._tiempos) {
            const {
                fechaInicioCalc,
                fechaReal,
                textoAsignado,
                textoTranscurrido,
                alDia,
                pct,
                realMinutos,
            } = t._tiempos;
            let badgeColor, badgeText;
            if (t.estado === "COMPLETADO") {
                //badgeColor = "#16a34a";
                badgeColor = realMinutos > 1 ? "#16a34a" : "#dc2626";
                badgeText = realMinutos;
            } else if (!alDia) {
                badgeColor = "#dc2626";
                badgeText = textoTranscurrido;
            } else if (pct >= 80) {
                badgeColor = "#f59e0b";
                badgeText = textoTranscurrido;
            } else {
                badgeColor = "#0369a1";
                badgeText = textoAsignado;
            }
            const badgeHtml = `<span style="font-size:8px;font-weight:700;letter-spacing:.5px;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:8px;background:${badgeColor}18;color:${badgeColor};border:1px solid ${badgeColor}40;white-space:nowrap">⏱ ${badgeText}</span>`;
            const progHtml = fechaInicioCalc
                ? `<span class="oc-sub-time">Prog: ${fechaInicioCalc}</span>`
                : "";
            const realHtml = fechaReal
                ? `<span class="oc-sub-time">Real: ${fechaReal}</span>`
                : "";
            tiempos = [progHtml, realHtml, badgeHtml].filter(Boolean).join("");
        } else {
            const parts = [
                t.tiempo_programado
                    ? `<span class="oc-sub-time">Prog: ${t.tiempo_programado}</span>`
                    : "",
                t.tiempo_real
                    ? `<span class="oc-sub-time">Real: ${t.tiempo_real}</span>`
                    : "",
                t.delta
                    ? `<span class="d ${t.delta_pos ? "d-pos" : "d-neg"}">${t.delta}</span>`
                    : "",
            ].filter(Boolean);
            tiempos = parts.join("");
        }

        let gestionesHtml = "";
        if (Array.isArray(t.gestiones) && t.gestiones.length > 0) {
            const dotColorMap = {
                ACTIVO: "#0369a1",
                "EN GESTION": "#ea580c",
                "SIN INICIAR": "#94a3b8",
                COMPLETADO: "#16a34a",
                CANCELADO: "#dc2626",
                PAUSADO: "#f59e0b",
            };
            const items = t.gestiones
                .map((g) => {
                    const dotColor = dotColorMap[g.estado] ?? "#94a3b8";
                    const estadoBadge = `<span style="font-size:8px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;padding:1px 5px;border-radius:5px;margin-left:4px;background:${dotColor}18;color:${dotColor};border:1px solid ${dotColor}40">${g.estado ?? ""}</span>`;
                    const docHtml =
                        g.documento &&
                            g.nombre_archivo &&
                            g.nombre_archivo !== "Sin_evidencia"
                            ? `<a href="${$("#base_url").val()}${g.documento}${g.nombre_archivo}" target="_blank" class="oc-gestion-doc"><i class="bi bi-file-earmark-arrow-down"></i>${g.nombre_archivo}</a>`
                            : "";
                    return `<div class="oc-ev">
                    <div class="oc-ev-dot" style="background:${dotColor}"></div>
                    <div style="min-width:0">
                        <div class="oc-ev-time">${g.fecha ?? "—"} · ${g.usuario ?? "—"}</div>
                        <div class="oc-ev-label">${g.observacion ?? "—"}</div>
                        ${docHtml}
                    </div>
                </div>`;
                })
                .join("");
            gestionesHtml = `<div class="oc-gestion-wrap"><div class="oc-gestion-header"><i class="bi bi-journal-text me-1"></i>Gestiones (${t.gestiones.length})</div>${items}</div>`;
        }
        // ${estadoBadge}

        return `
            <div class="oc-sub-item">
                <div class="oc-sub-node ${nodoClase}"><i class="bi ${iconMap[t.estado] || "bi-clock"}"></i></div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between align-items-start gap-1 flex-wrap">
                        <span class="oc-sub-label">${t.nombre}</span>
                        <span class="oc-sub-badge ${badgeMap[t.estado] ?? "oc-sub-badge-pending"}">${badgeLabel[t.estado] ?? t.estado}</span>
                    </div>
                    ${t.meta ? `<div class="oc-sub-meta">${t.meta}</div>` : ""}
                    ${tiempos ? `<div class="d-flex gap-2 mt-1 flex-wrap">${tiempos}</div>` : ""}
                    ${gestionesHtml}
                </div>
            </div>`;
    }

    function _panelIdDesdeOperacion(operacion) {
        return (
            {
                CARGUE: "ocPanelOrigen",
                TRANSITO: "ocPanelTransito",
                DESCARGUE: "ocPanelDestino",
            }[operacion] || "ocPanelOrigen"
        );
    }

    function ocMapMode(mode, el) {
        document
            .querySelectorAll(".oc-map-btn")
            .forEach((b) => b.classList.remove("active"));
        el.classList.add("active");
    }

    function ocCenter() {
        const btn = document.getElementById("ocBtnCenter");
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Centrado';
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-crosshair"></i> Centrar';
        }, 1500);
    }

    /* ─────────────────────────────────────────────────────────────────
         initMapTrazabilidad — mapa para el offcanvas de trazabilidad
      ───────────────────────────────────────────────────────────────── */
    async function initMapTrazabilidad(data) {
        const { Map } = await google.maps.importLibrary("maps");
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
        const { DirectionsService, DirectionsRenderer } =
            await google.maps.importLibrary("routes");
        const { Geocoder } = await google.maps.importLibrary("geocoding");
        const map = new Map(document.getElementById("map"), {
            center: { lat: 4.5709, lng: -74.2973 },
            zoom: 5.5,
            gestureHandling: "greedy",
            mapId: "db5350020424d6c4",
        });
        const geocoder = new Geocoder();
        const obtenerNombreLugar = (lat, lng) =>
            new Promise((res) => {
                geocoder.geocode({ location: { lat, lng } }, (results, status) =>
                    res(
                        status === "OK" && results[0]
                            ? results[0].formatted_address
                            : "Lugar desconocido",
                    ),
                );
            });
        for (const punto of data) {
            const lat = parseFloat(punto.latitud),
                lng = parseFloat(punto.longitud);
            const nombreLugar = await obtenerNombreLugar(lat, lng);
            new AdvancedMarkerElement({
                map,
                position: { lat, lng },
                title: `${nombreLugar}\n${punto.fecha_hora}`,
            });
        }
        const directionsService = new DirectionsService();
        const directionsRenderer = new DirectionsRenderer({ map });
        const waypoints = data.slice(1, data.length - 1).map((p) => ({
            location: { lat: parseFloat(p.latitud), lng: parseFloat(p.longitud) },
            stopover: true,
        }));
        directionsService.route(
            {
                origin: {
                    lat: parseFloat(data[0].latitud),
                    lng: parseFloat(data[0].longitud),
                },
                destination: {
                    lat: parseFloat(data[data.length - 1].latitud),
                    lng: parseFloat(data[data.length - 1].longitud),
                },
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
                optimizeWaypoints: false,
            },
            (result, status) => {
                if (status === "OK") directionsRenderer.setDirections(result);
            },
        );
    }

    /* ─────────────────────────────────────────────────────────────────
         listar_pedidos_administrador
      ───────────────────────────────────────────────────────────────── */
    async function listar_pedidos_administrador(
        fecha_inicial,
        fecha_final,
        filtro,
        valor,
        trazabilidad,
        identificador,
    ) {
        let dato = new FormData();
        dato.append("fecha_inicial", fecha_inicial);
        dato.append("fecha_final", fecha_final);
        dato.append("filtro", filtro ?? "");
        dato.append("valor", valor ?? "");
        dato.append("trazabilidad", trazabilidad ?? "");
        dato.append("identificador", identificador ?? "");
        dato.append("filtros", "");
        try {
            const response = await fetch(
                $("#base_url").val() + "torrecontrol/listar_administracion_pedidos",
                { method: "POST", body: dato, cache: "no-cache" },
            );
            const data = await response.json();
            if (data) {
                let tbody = document.getElementById("tbl_administrar_pedidos");
                tbody.innerHTML = "";
                let col_estatus_publicacion = "",
                    col_estatus_asignacion = "",
                    btn_publicacion = "",
                    btn_cancelacion = "",
                    col_prioridad = "";
                let btn_removeAsignacion = "",
                    checkbox_carrito = "",
                    col_estatus_proceso = "",
                    col_estatus_trazabilidad = "";
                let btn_detalle_proceso = "",
                    btn_detalle_trazabilidad = "",
                    btn_trazabilidad_pedido = "",
                    btn_prioridad = "";

                data.forEach((element) => {
                    const fila = document.createElement("tr");
                    fila.id = `fila_${element.numdoc_solicitud}`;

                    if (estadosPublicacion[element.estado_publicaion])
                        col_estatus_publicacion = createBadge(
                            element.estado_publicaion,
                            estadosPublicacion[element.estado_publicaion],
                        );
                    if (estadosAsignacion[element.estado_asignacion])
                        col_estatus_asignacion = createBadge(
                            element.estado_asignacion,
                            estadosAsignacion[element.estado_asignacion],
                        );
                    if (estadosPrioridad[element.estado_prioridad])
                        col_prioridad = createBadge(
                            element.estado_prioridad,
                            estadosPrioridad[element.estado_prioridad],
                        );

                    const estadoPublicacion = element.estado_publicaion;
                    const estadoAsignacion = element.estado_asignacion;

                    if (
                        estadoPublicacion === "Publicado" &&
                        estadoAsignacion === "Asignado"
                    ) {
                        checkbox_carrito = ``;
                        btn_removeAsignacion = ``;
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                        btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
                    } else if (
                        estadoPublicacion === "Publicado" &&
                        estadoAsignacion === "Pendiente"
                    ) {
                        checkbox_carrito = ``;
                        btn_removeAsignacion = ``;
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                        btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
                    } else if (
                        (estadoPublicacion === "Pendiente Respuesta" &&
                            estadoAsignacion === "Pendiente") ||
                        (estadoPublicacion === "Aceptado" &&
                            estadoAsignacion === "Ganador") ||
                        (estadoPublicacion === "Completado" &&
                            estadoAsignacion === "Completado")
                    ) {
                        checkbox_carrito = ``;
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                    } else {
                        btn_detalle_proceso = ``;
                        btn_removeAsignacion = ``;
                        btn_prioridad = `<a class="dropdown-item fw-bold" id="btn_marcar_prioridad" href="#" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-bell"></span> Marcar como Prioridad</a>`;
                        if (
                            element.estado_publicaion === "Cancelado" &&
                            element.estado_asignacion === "Cancelado"
                        ) {
                            btn_cancelacion = ``;
                        } else {
                            btn_cancelacion = `<a class="dropdown-item fw-bold" href="#" id="btn_cancelar_pedido" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-x"></span> Cancelar Pedido</a>`;
                        }
                        checkbox_carrito = `
                        <input class="form-check-input pedido-checkbox" id="check_pedido_${element.numdoc_solicitud}"
                            type="checkbox" value="${element.numdoc_solicitud}"
                            data-id="${element.nombre_cliente}" data-id2="${element.ciudad_origen}" data-id3="${element.ciudad_destino}"
                            data-id4="${element.referencia_pedido}" data-id5="${element.fecha_cargue}" data-id6="${element.fecha_entrega}"
                            data-id7="${element.unidades}" data-id8="${element.lote}" data-id9="${element.num_estibas}"
                            data-id10="${element.peso_neto_kg}" data-id11="${element.peso_bruto_kg}"
                            data-id12="${element.producto}" data-id13="${element.presentacion}" data-id14="${element.cliente}" data-id15="${element.modalidad}"
                            style="scale: 1.2;" data-row="fila_${element.numdoc_solicitud}">`;
                    }

                    if (estadosProceso[element.estado_proceso]) {
                        if (
                            element.estado_publicaion === "Cancelado" &&
                            element.estado_asignacion === "Cancelado"
                        ) {
                            col_estatus_proceso = createBadge("Cancelado", "danger");
                            checkbox_carrito = ``;
                            btn_prioridad = ``;
                            btn_detalle_proceso = ``;
                            btn_removeAsignacion = ``;
                            btn_publicacion = ``;
                        } else {
                            col_estatus_proceso = createBadge(
                                element.estado_proceso,
                                estadosProceso[element.estado_proceso],
                            );
                        }
                    }

                    if (
                        element.tipo_trazabilidad === "Completado" ||
                        (element.tipo_trazabilidad === "Iniciado" &&
                            element.estado_proceso_pedido === "Completado")
                    ) {
                        btn_detalle_proceso = `<a class="dropdown-item fw-bold" href="#" id="btn_detalle_proceso" data-proceso="${element.proceso}" data-id="${element.numdoc_solicitud}" data-id2="${element.cliente}"><span class="uil uil-transaction"></span> Detalle Proceso</a>`;
                    } else if (
                        element.tipo_trazabilidad === "Pendiente Iniciar" ||
                        element.tipo_trazabilidad === "Sin Asignar"
                    ) {
                        btn_detalle_trazabilidad = ``;
                    }

                    if (
                        element.tipo_trazabilidad === "Iniciado" &&
                        element.estado_proceso_pedido === "Postulado"
                    ) {
                        const estado = obtenerEstadoTrazabilidad(
                            element.estado_proceso_pedido,
                        );
                        col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    } else {
                        const estado = obtenerEstadoTrazabilidad(element.tipo_trazabilidad);
                        col_estatus_trazabilidad = createBadge(estado.texto, estado.color);
                    }

                    const columnaNundocSolicitud = document.createElement("td");
                    columnaNundocSolicitud.innerHTML = `
                        <div class="dropdown">
                            <a class="btn btn-sm btn-link dropdown-toggle py-0 text-decoration-none menu_tabla" id="dropdownMenuLink" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-row-id="${fila.id}"> N°${element.referencia_pedido}</a>
                            <div class="dropdown-menu dropdown-menu-end py-0" aria-labelledby="dropdownMenuLink">
                            ${btn_detalle_proceso}
                            ${btn_removeAsignacion}
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item fw-bold" href="#" id="btn_detalle" data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"><span class="uil uil-transaction"></span> Trazabilidad</a>
                            <a class="dropdown-item fw-bold" href="#" id="btn_detalle_trazabilidad_pedidos" data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasPedido" style="font-family:'Space Grotesk',sans-serif;font-weight:600"
                                data-SolicitudId="${element.numdoc_solicitud}" data-RecursoId="${element.recurso_id}" data-ServicioId="${element.serivicio_id}"
                                data-latitud_origen="${element.latitud_origen}" data-longitud_origen="${element.longitud_origen}"
                                data-latitud_destino="${element.latitud_destino}" data-longitud_destino="${element.longitud_destino}"
                                data-ciudad_origen="${element.ciudad_origen}" data-ciudad_destino="${element.ciudad_destino}"
                                data-refPedido="${element.referencia_pedido}" data-fecha_creacion="${element.fecha} ${element.hora}"
                                data-fecha_cargue="${element.fecha_cargue}" data-fecha_entrega="${element.fecha_entrega}"
                                data-placa="${element.referencia}" data-tipo_trazabilidad="${element.tipo_trazabilidad}">
                                <span class="uil uil-transaction"></span> Trazabilidad Pedidos
                            </a>
                            ${btn_cancelacion}
                            ${btn_prioridad}
                            </div>
                        </div>
                    `;

                    const mkTd = (html, extra = "") => {
                        const td = document.createElement("td");
                        td.innerHTML = html;
                        td.style.cssText = `width:auto;white-space:nowrap;${extra}`;
                        return td;
                    };
                    const mkTdC = (html) => {
                        const td = mkTd(html);
                        td.style.textAlign = "center";
                        return td;
                    };

                    fila.appendChild(mkTdC(checkbox_carrito));
                    fila.appendChild(mkTd(element.modalidad));
                    fila.appendChild(columnaNundocSolicitud);
                    fila.appendChild(mkTd(col_estatus_trazabilidad));
                    fila.appendChild(mkTd(element.ciudad_origen));
                    fila.appendChild(mkTd(element.remitente));
                    fila.appendChild(mkTd(element.ciudad_destino));
                    fila.appendChild(mkTd(element.destinatario));
                    fila.appendChild(mkTd(element.cod_producto));
                    fila.appendChild(mkTd(element.producto));
                    fila.appendChild(mkTd(element.peso_neto_kg + " KG"));
                    fila.appendChild(mkTd(element.peso_bruto_kg + " KG"));
                    fila.appendChild(mkTd(element.presentacion));
                    fila.appendChild(mkTd(element.unidades));
                    fila.appendChild(mkTd(element.lote));
                    fila.appendChild(mkTd(element.num_estibas));
                    fila.appendChild(mkTd(element.fecha_cargue));
                    fila.appendChild(mkTd(element.fecha_entrega));
                    fila.appendChild(mkTd(element.tipo_vehiculo ?? "-"));
                    fila.appendChild(mkTd(element.costo ?? "-"));
                    fila.appendChild(mkTd(element.tarifa ?? "-"));
                    fila.appendChild(mkTd(element.fecha_retiro_contenedor ?? "-"));
                    fila.appendChild(mkTd(element.booking ?? "-"));
                    fila.appendChild(mkTd(element.unidad_transporte ?? "-"));
                    fila.appendChild(mkTd(element.observaciones ?? "-"));

                    tbody.appendChild(fila);
                });

                document.querySelectorAll(".menu_tabla").forEach((toggle) => {
                    toggle.addEventListener("click", function () {
                        const rowId = this.getAttribute("data-row-id");
                        const row = document.getElementById(rowId);
                        document
                            .querySelectorAll("tr")
                            .forEach((r) => r.classList.remove("selected-row"));
                        if (row) row.classList.add("selected-row");
                    });
                });

                actualizarKpis(data);
                const badgeTabla = document.getElementById("badge-total-tabla");
                if (badgeTabla) badgeTabla.textContent = data.length + " registros";
                const pagBar = document.getElementById("pagination-bar");
                if (pagBar) {
                    pagBar.style.display = "";
                    const setEl = (id, v) => {
                        const n = document.getElementById(id);
                        if (n) n.textContent = v;
                    };
                    setEl("pag-total", data.length);
                    setEl("pag-desde", data.length > 0 ? 1 : 0);
                    setEl("pag-hasta", data.length);
                }
            }
        } catch (error) {
            console.error("Error en listar_pedidos_administrador:", error);
        }
    }

    /* ─────────────────────────────────────────────────────────────────
         Helpers generales
      ───────────────────────────────────────────────────────────────── */
    function createBadge(text, type) {
        return `<span class="badge badge-phoenix fs-10 badge-phoenix-${type}"><span class="badge-label">${text}</span></span>`;
    }

    window.estadosPublicacion = {
        Pendiente: "secondary",
        Publicado: "info",
        Cancelado: "secondary",
        Aceptado: "success",
        "Pendiente Respuesta": "warning",
        Completado: "success",
    };

    window.estadosAsignacion = {
        Pendiente: "secondary",
        Asignado: "info",
        Cancelado: "secondary",
        Aceptado: "success",
        Ganador: "success",
        Completado: "success",
    };

    window.estadosPrioridad = { Prioritaria: "warning", "No Marcada": "info" };
    window.estadosProceso = {
        Pendiente: "secondary",
        Asignación: "warning",
        Publicación: "danger",
        Completado: "success",
    };

    function obtenerEstadoTrazabilidad(tipoTrazabilidad) {
        let textoTrazabilidad = tipoTrazabilidad;
        if (tipoTrazabilidad === "Completado") textoTrazabilidad = "Asignado";
        else if (
            tipoTrazabilidad === "Cancelado" ||
            tipoTrazabilidad === "Rechzado"
        )
            textoTrazabilidad = "Sin Asignar";
        return {
            texto: textoTrazabilidad,
            color: window.estadosTrazabilidad[textoTrazabilidad] || "secondary",
        };
    }

    window.estadosTrazabilidad = {
        "Llegada Cargue": "info",
        Cargue: "info",
        "Salida Cargue": "info",
        "Inicio Ruta": "primary",
        Transito: "primary",
        "Llegada Descargue": "info",
        Descargue: "info",
        "Salida Descargue": "info",
        "Pendiente Iniciar": "danger",
        "Sin Asignar": "secondary",
        Iniciado: "primary",
        Asignado: "success",
        Postulado: "warning",
        Cancelado: "danger",
    };

    window.style = document.createElement("style");
    style.textContent = `.selected-row { background-color: #d8ddf9 !important; }`;
    document.head.appendChild(style);

    /* ─────────────────────────────────────────────────────────────────
         cargarLineaTiempo (offcanvas clásico de trazabilidad)
      ───────────────────────────────────────────────────────────────── */
    // async function cargarLineaTiempo(PedidoId) {
    //     try {
    //         let formData = new FormData();
    //         formData.append("PedidoId", PedidoId);
    //         let response = await fetch(
    //             $("#base_url").val() + "torrecontrol/Linea_Tiempo_pedidos",
    //             { method: "POST", body: formData },
    //         );
    //         let data = await response.json();
    //         const etapasOrdenadas = [
    //             "Asignado",
    //             "Llega vehículo",
    //             "En cargue",
    //             "En ruta",
    //             "Entregado",
    //         ];
    //         const contenedor = document.getElementById("lineaTiempo");
    //         contenedor.innerHTML = "";
    //         contenedor.className = "d-flex justify-content-between position-relative";
    //         let ultimaIndex = -1;
    //         const etapas = data.etapas;
    //         const etapaConFecha = Object.values(etapas).find(
    //             (e) => e.fecha_entrega_estimada,
    //         );
    //         const fechaEstimada = etapaConFecha?.fecha_entrega_estimada || null;
    //         document.getElementById("FechaEstimada").textContent =
    //             `Fecha estimada entrega: ${fechaEstimada ?? "No disponible"}`;

    //         etapasOrdenadas.forEach((etapa, index) => {
    //             const info = data.etapas[etapa];
    //             const step = document.createElement("div");
    //             step.className = "step";
    //             step.dataset.etapa = etapa;
    //             const circle = document.createElement("div");
    //             circle.className = "circle";
    //             if (info) {
    //                 circle.classList.add("completed");
    //                 ultimaIndex = index;
    //                 circle.setAttribute("data-bs-toggle", "tooltip");
    //                 circle.setAttribute("data-bs-placement", "bottom");
    //                 circle.setAttribute(
    //                     "title",
    //                     `📅 ${info.fecha_trazabilidad}\n📝 ${info.observacion}`,
    //                 );
    //             }
    //             step.appendChild(circle);
    //             const small = document.createElement("small");
    //             small.textContent = etapa;
    //             step.appendChild(small);
    //             if (info) {
    //                 const fecha = document.createElement("div");
    //                 fecha.className = "info-extra";
    //                 fecha.textContent = info.fecha_trazabilidad;
    //                 step.appendChild(fecha);
    //             }
    //             contenedor.appendChild(step);
    //         });

    //         const steps = contenedor.querySelectorAll(".step");
    //         if (steps.length && ultimaIndex >= 0) {
    //             const primer = steps[0].offsetLeft + steps[0].offsetWidth / 2;
    //             const ultimo =
    //                 steps[ultimaIndex].offsetLeft + steps[ultimaIndex].offsetWidth / 2;
    //             const linea = document.createElement("div");
    //             linea.className = "progreso-linea";
    //             linea.style.left = `${primer}px`;
    //             linea.style.width = `${ultimo - primer}px`;
    //             contenedor.appendChild(linea);
    //             if (ultimaIndex + 1 < steps.length) {
    //                 const siguiente =
    //                     steps[ultimaIndex + 1].offsetLeft +
    //                     steps[ultimaIndex + 1].offsetWidth / 2;
    //                 const lineaActual = document.createElement("div");
    //                 lineaActual.className = "progreso-linea-actual";
    //                 lineaActual.style.left = `${ultimo}px`;
    //                 lineaActual.style.width = `${siguiente - ultimo}px`;
    //                 contenedor.appendChild(lineaActual);
    //             }
    //             steps[ultimaIndex]
    //                 .querySelector(".circle")
    //                 .classList.remove("completed");
    //             steps[ultimaIndex].querySelector(".circle").classList.add("current");
    //         }
    //         const tooltipTriggerList = document.querySelectorAll(
    //             '[data-bs-toggle="tooltip"]',
    //         );
    //         tooltipTriggerList.forEach((el) => new bootstrap.Tooltip(el));
    //     } catch (error) {
    //         console.error("Error en línea de tiempo:", error);
    //     }
    // }

    function actualizarContadorCarrito() {
        let carrito = JSON.parse(sessionStorage.getItem("carrito")) || [];
        let btn = document.getElementById("btn-carrito-pedidos");
        let contador = document.getElementById("carrito-contador");
        if (!btn) return;
        btn.style.display = carrito.length > 0 ? "" : "none";
        if (contador) contador.textContent = carrito.length;
    }

    // ── Instancia del donut chart (singleton) ──
    let _donutChart = null;

    function actualizarKpis(data) {
        if (!Array.isArray(data)) return;

        const c = {
            todos: data.length,
            Pendiente: 0,
            Publicado: 0,
            Asignado: 0,
            Cancelado: 0,
        };

        data.forEach((el) => {
            if (el.estado_publicaion === 'Pendiente') c.Pendiente++;
            if (['Publicado', 'Pendiente Respuesta', 'Aceptado'].includes(el.estado_publicaion)) c.Publicado++;
            if (['Asignado', 'Ganador'].includes(el.estado_asignacion)) c.Asignado++;
            if (el.estado_publicaion === 'Cancelado') c.Cancelado++;
        });

        // ── Actualizar badges de las cards ──
        const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
        set('kpi-total', c.todos);
        set('kpi-pendiente', c.Pendiente);
        set('kpi-publicado', c.Publicado);
        set('kpi-asignado', c.Asignado);
        set('kpi-cancelado', c.Cancelado);

        // ── Donut chart ──
        const canvas = document.getElementById('kpi-donut-chart');
        if (!canvas) return;

        const labels = ['Pendientes', 'Publicados', 'Asignados', 'Cancelados'];
        const values = [c.Pendiente, c.Publicado, c.Asignado, c.Cancelado];
        const colors = ['#f59e0b', '#06b6d4', '#22c55e', '#ef4444'];
        const borders = ['#d97706', '#0891b2', '#16a34a', '#dc2626'];

        if (_donutChart) {
            // Actualizar datos sin re-crear el chart
            _donutChart.data.datasets[0].data = values;
            _donutChart.update('active');
            return;
        }

        // Primera vez: cargar Chart.js desde CDN si no está disponible
        const initChart = () => {
            _donutChart = new Chart(canvas, {
                type: 'doughnut',
                data: {
                    labels,
                    datasets: [{
                        data: values,
                        backgroundColor: colors,
                        borderColor: borders,
                        borderWidth: 2,
                        hoverOffset: 8,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    cutout: '68%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                font: { size: 12, family: "'Inter', sans-serif" },
                                color: '#475569',
                                padding: 16,
                                usePointStyle: true,
                                pointStyle: 'circle',
                                generateLabels: (chart) => {
                                    const ds = chart.data.datasets[0];
                                    const tot = ds.data.reduce((a, b) => a + b, 0);
                                    return chart.data.labels.map((lbl, i) => ({
                                        text: `${lbl}  ${ds.data[i]}  (${tot ? Math.round(ds.data[i] / tot * 100) : 0}%)`,
                                        fillStyle: ds.backgroundColor[i],
                                        strokeStyle: ds.borderColor[i],
                                        lineWidth: 1,
                                        pointStyle: 'circle',
                                        hidden: false,
                                        index: i,
                                    }));
                                },
                            },
                        },
                        tooltip: {
                            callbacks: {
                                label: (ctx) => {
                                    const tot = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                    const pct = tot ? Math.round(ctx.parsed / tot * 100) : 0;
                                    return `  ${ctx.label}: ${ctx.parsed} pedidos (${pct}%)`;
                                },
                            },
                        },
                    },
                    // Texto central: total
                    animation: { animateRotate: true, duration: 600 },
                },
                plugins: [{
                    id: 'centerText',
                    beforeDraw(chart) {
                        const { ctx, chartArea } = chart;
                        if (!chartArea) return;
                        const cx = (chartArea.left + chartArea.right) / 2;
                        const cy = (chartArea.top + chartArea.bottom) / 2;
                        const tot = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        ctx.save();
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.font = `700 28px 'JetBrains Mono', monospace`;
                        ctx.fillStyle = '#0f172a';
                        ctx.fillText(tot, cx, cy - 8);
                        ctx.font = `500 11px 'Inter', sans-serif`;
                        ctx.fillStyle = '#94a3b8';
                        ctx.fillText('pedidos', cx, cy + 14);
                        ctx.restore();
                    },
                }],
            });
        };

        if (typeof Chart !== 'undefined') {
            initChart();
        } else {
            const s = document.createElement('script');
            s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
            s.onload = initChart;
            document.head.appendChild(s);
        }
    }

    /* ─────────────────────────────────────────────────────────────────
         parsearFecha — normaliza string de fecha a Date
      ───────────────────────────────────────────────────────────────── */
    const parsearFecha = (f) => {
        if (!f) return null;
        const normalizada = f.replace(
            /^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/,
            "$1T$2",
        );
        const dt = new Date(normalizada);
        return isNaN(dt.getTime()) ? null : dt;
    };

    /* ─────────────────────────────────────────────────────────────────
         actualizarLineaTiempo — línea de tiempo del offcanvas principal
      ───────────────────────────────────────────────────────────────── */
    async function actualizarLineaTiempo(
        solicitudId,
        fechaCreacion,
        fechaCargue,
        fechaEntrega,
        etaSegundos,
        tipoTrazabilidad = "",
    ) {
        const ahora = new Date();

        // IDs de las actividades clave que controlan los nodos
        const ID_LLEGADA_CARGUE = 1;
        const ID_PLANTA_ORIGEN = 4;
        const ID_TRANSITO = 121;
        const ID_PLANTA_DESTINO = 11;
        const ID_ENTREGA_FINAL = 122;

        // ── Consultar hitos de la línea de tiempo ──
        // Endpoint dedicado: solo devuelve los 5 hitos clave con su estado
        // y fecha real (última gestión) + fecha estimada (fecha_base_calc).
        // No depende de Listar_tareas_oc ni de ocToggle.
        let hitos = {};
        try {
            const baseUrl = (document.getElementById('base_url_api')?.value ?? '').replace(/\/$/, '');
            const fd = new FormData();
            fd.append('PedidoId', solicitudId);
            const r = await fetch(baseUrl + '/Hitos_linea_tiempo', {
                method: 'POST',
                headers: { 'X-API-KEY': 'nexos_nacional2026@*' },
                body: fd,
            });
            const j = await r.json();
            if (j.numero === 200 && j.data) hitos = j.data;
            window._hitosLineaTiempo = hitos;
        } catch (e) {
            console.warn('actualizarLineaTiempo - hitos:', e);
        }

        // parseFecha debe declararse antes de los helpers que la usan
        const parseFecha = (f) => {
            if (!f) return null;
            const n = f.replace(
                /^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/,
                "$1T$2",
            );
            const d = new Date(n);
            return isNaN(d.getTime()) ? null : d;
        };

        // Helpers de hitos
        const completado = (id) => hitos[id]?.completado === true;
        const fechaHitoReal = (id) => hitos[id]?.fecha_real ? parseFecha(hitos[id].fecha_real) : null;
        const fechaHitoEst = (id) => hitos[id]?.fecha_est ? parseFecha(hitos[id].fecha_est) : null;

        const fmt = (d) =>
            d
                ? d.toLocaleString("es-CO", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
                : "—";
        const fmtDelta = (ms) => {
            const min = Math.round(ms / 60000);
            const abs = Math.abs(min);
            const str =
                abs >= 60 ? `${Math.floor(abs / 60)}h ${abs % 60}m` : `${abs} min`;
            return { str: (min >= 0 ? "+" : "-") + str, tarde: min > 0 };
        };
        const setNodo = (n, estado) => {
            const el = document.getElementById(`tl-node-${n}`);
            if (!el) return;
            el.classList.remove(
                "oc-node-done",
                "oc-node-active",
                "oc-node-pending",
                "oc-node-risk",
            );
            el.classList.add(
                {
                    done: "oc-node-done",
                    active: "oc-node-active",
                    pending: "oc-node-pending",
                    risk: "oc-node-risk",
                }[estado] ?? "oc-node-pending",
            );
        };
        const setTime = (n, txt) => {
            const el = document.getElementById(`tl-time-${n}`);
            if (el) el.textContent = txt;
        };
        const setDelta = (n, ms) => {
            const el = document.getElementById(`tl-delta-${n}`);
            if (!el) return;
            if (ms === null) {
                el.style.display = "none";
                return;
            }
            const { str, tarde } = fmtDelta(ms);
            el.textContent = str;
            el.className = `d ${tarde ? "d-neg" : "d-pos"}`;
            el.style.display = "";
        };

        const dtCargue = parseFecha(fechaCargue);
        const dtEntrega = parseFecha(fechaEntrega);


        // Fechas REALES de cada hito (última gestión cuando COMPLETADO)
        const dtLlegadaCargue = completado(ID_LLEGADA_CARGUE) ? fechaHitoReal(ID_LLEGADA_CARGUE) : null;
        const dtSalidaCargue = completado(ID_PLANTA_ORIGEN) ? fechaHitoReal(ID_PLANTA_ORIGEN) : null;
        const dtInicioRuta = completado(ID_TRANSITO) ? fechaHitoReal(ID_TRANSITO) : null;
        const dtLlegadaDes = completado(ID_PLANTA_DESTINO) ? fechaHitoReal(ID_PLANTA_DESTINO) : null;
        const dtSalidaDes = completado(ID_ENTREGA_FINAL) ? fechaHitoReal(ID_ENTREGA_FINAL) : null;
        // Alias compatibilidad
        const dtCargueReal = dtLlegadaCargue;
        const dtTransito = dtInicioRuta;
        const dtDescargueReal = dtLlegadaDes;

        // Fechas ESTIMADAS de cada hito (fecha_base_calc de la actividad)
        const estLlegadaCargue = fechaHitoEst(ID_LLEGADA_CARGUE) ?? dtCargue;
        const estSalidaCargue = fechaHitoEst(ID_PLANTA_ORIGEN) ?? window._salidaCargueProgramada;
        const estTransito = fechaHitoEst(ID_TRANSITO) ?? null;
        const estLlegadaDes = fechaHitoEst(ID_PLANTA_DESTINO) ?? dtEntrega;
        const estSalidaDes = fechaHitoEst(ID_ENTREGA_FINAL) ?? dtEntrega;

        setNodo(1, "done");
        setTime(1, fmt(parseFecha(fechaCreacion)));

        let dtAsignacion = null;
        try {
            const baseUrl = document.getElementById("base_url_api").value;
            const fd2 = new FormData();
            fd2.append("PedidoId", solicitudId);
            const r2 = await fetch(baseUrl + "Fecha_asignacion_vehiculo", {
                method: "POST",
                headers: { "X-API-KEY": "nexos_nacional2026@*" },
                body: fd2,
            });
            const j2 = await r2.json();
            if (j2.numero === 200 && j2.data?.fecha_asignacion)
                dtAsignacion = parseFecha(j2.data.fecha_asignacion);
        } catch (e) {
            console.warn("Error nodo 2:", e);
        }

        if (dtAsignacion) {
            setNodo(2, "done");
            setTime(2, fmt(dtAsignacion));
        } else {
            setNodo(2, "pending");
            setTime(2, "Sin asignar");
        }

        // esSoloAsignado: solo bloquear nodos operativos si NO hay ninguna
        // actividad clave completada. Si ya hay actividades, siempre renderizar.
        const esSoloAsignado =
            Object.keys(hitos).every(k => !hitos[k]?.completado) &&
            (tipoTrazabilidad === "Sin Asignar" ||
                (tipoTrazabilidad !== "" &&
                    tipoTrazabilidad !== null &&
                    tipoTrazabilidad !== "Completado" &&
                    ![
                        "Llegada Cargue", "Cargue", "Salida Cargue", "Inicio Ruta",
                        "Transito", "Llegada Descargue", "Descargue", "Salida Descargue",
                    ].includes(tipoTrazabilidad)));

        if (esSoloAsignado) {
            [3, 4, 5, 6, 7].forEach((n) => {
                setNodo(n, "pending");
                setTime(n, "—");
                setDelta(n, null);
            });
            const pct = Math.round(((1 + (dtAsignacion ? 1 : 0)) / 7) * 100);
            const barFill = document.getElementById("kpi-bar-fill");
            const barVal = document.getElementById("kpi-pct-val");
            if (barFill) {
                barFill.style.width = `${pct}%`;
                barFill.style.background = "linear-gradient(90deg,#ea580c,#f97316)";
            }
            if (barVal) barVal.textContent = `${pct}%`;
            const tlBar = document.getElementById("tl-progress-bar");
            if (tlBar) tlBar.style.width = `${pct}%`;
            return;
        }

        // Nodo 3
        if (dtLlegadaCargue) {
            setNodo(3, "done");
            if (estLlegadaCargue) {
                const dms = dtLlegadaCargue - estLlegadaCargue;
                setTime(3, `Prog: ${fmt(estLlegadaCargue)} | Real: ${fmt(dtLlegadaCargue)}`);
                setDelta(3, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(3, `Real: ${fmt(dtLlegadaCargue)}`);
                setDelta(3, null);
            }
        } else if (estLlegadaCargue) {
            setTime(3, `Prog: ${fmt(estLlegadaCargue)}`);
            if (ahora >= estLlegadaCargue) {
                const dms = ahora - estLlegadaCargue;
                setNodo(3, dms > 30 * 60000 ? "risk" : "active");
                setDelta(3, dms > 60000 ? dms : null);
            } else {
                setNodo(3, dtAsignacion ? "active" : "pending");
                setDelta(3, null);
            }
        } else {
            setNodo(3, "pending");
            setTime(3, "—");
        }

        // Nodo 4 — Planta Origen: usa salida_cargue_iso del backend cuando está disponible
        if (dtSalidaCargue) {
            setNodo(4, "done");
            if (estSalidaCargue) {
                const dms = dtSalidaCargue - estSalidaCargue;
                setTime(4, `Prog: ${fmt(estSalidaCargue)} | Real: ${fmt(dtSalidaCargue)}`);
                setDelta(4, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(4, `Real: ${fmt(dtSalidaCargue)}`);
            }
        } else if (dtCargueReal) {
            setNodo(4, "active");
            if (estSalidaCargue) {
                setTime(4, `Llegada: ${fmt(dtCargueReal)} | Salida est.: ${fmt(estSalidaCargue)}`);
            } else {
                setTime(4, `Llegada: ${fmt(dtCargueReal)}`);
            }
            setDelta(4, null);
        } else if (dtLlegadaCargue) {
            setNodo(4, "active");
            setTime(4, estSalidaCargue
                ? `Llegada: ${fmt(dtLlegadaCargue)} | Salida est.: ${fmt(estSalidaCargue)}`
                : `Llegada: ${fmt(dtLlegadaCargue)}`);
            setDelta(4, null);
        } else {
            setNodo(4, "pending");
            setTime(4, estSalidaCargue ? `Prog: ${fmt(estSalidaCargue)}` : "—");
        }

        // Nodo 5: Tránsito en Ruta
        // Solo activo/done cuando ID 121 (Salida vehículo punto cargue) está COMPLETADO.
        // Mientras ID 4 esté completo pero 121 no → nodo 4 active, nodo 5 pending.
        if (dtInicioRuta) {
            // ID 121 completado → en tránsito
            setNodo(5, "done");
            if (estTransito) {
                const dms = dtInicioRuta - estTransito;
                setTime(5, `Prog: ${fmt(estTransito)} | Real: ${fmt(dtInicioRuta)}`);
                setDelta(5, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(5, `Real: ${fmt(dtInicioRuta)}`);
                setDelta(5, null);
            }
        } else {
            // ID 121 no completado → pending, mostrar estimado si existe
            setNodo(5, "pending");
            setTime(5, estTransito ? `Prog: ${fmt(estTransito)}` : "—");
            setDelta(5, null);
        }

        // Nodo 6: Planta Destino
        if (dtSalidaDes) {
            setNodo(6, "done");
            if (estSalidaDes) {
                const dms = dtSalidaDes - estSalidaDes;
                setTime(6, `Prog: ${fmt(estSalidaDes)} | Real: ${fmt(dtSalidaDes)}`);
                setDelta(6, Math.abs(dms) > 60000 ? dms : null);
            } else setTime(6, `Real: ${fmt(dtSalidaDes)}`);
        } else if (dtDescargueReal) {
            setNodo(6, "done");
            if (estLlegadaDes) {
                const dms = dtDescargueReal - estLlegadaDes;
                setTime(6, `Prog: ${fmt(estLlegadaDes)} | Real: ${fmt(dtDescargueReal)}`);
                setDelta(6, Math.abs(dms) > 60000 ? dms : null);
            } else setTime(6, `Real: ${fmt(dtDescargueReal)}`);
        } else if (dtLlegadaDes) {
            setNodo(6, "active");
            if (estLlegadaDes) {
                const dms = dtLlegadaDes - estLlegadaDes;
                setTime(6, `Prog: ${fmt(estLlegadaDes)} | Real: ${fmt(dtLlegadaDes)}`);
                setDelta(6, Math.abs(dms) > 60000 ? dms : null);
            } else setTime(6, `Real: ${fmt(dtLlegadaDes)}`);
        } else {
            setNodo(6, "pending");
            setTime(6, estLlegadaDes ? `Prog: ${fmt(estLlegadaDes)}` : "—");
            if (estLlegadaDes && ahora >= estLlegadaDes) setNodo(6, "risk");
            setDelta(6, null);
        }

        // Nodo 7: Entrega Final
        if (dtSalidaDes) {
            setNodo(7, "done");
            if (estSalidaDes) {
                const dms = dtSalidaDes - estSalidaDes;
                setTime(7, `Prog: ${fmt(estSalidaDes)} | Real: ${fmt(dtSalidaDes)}`);
                setDelta(7, Math.abs(dms) > 60000 ? dms : null);
            } else {
                setTime(7, `Real: ${fmt(dtSalidaDes)}`);
                setDelta(7, null);
            }
        } else if (dtDescargueReal || dtLlegadaDes) {
            setNodo(7, "active");
            const dtRef = dtDescargueReal || dtLlegadaDes;
            if (estSalidaDes) {
                const dms = dtRef - estSalidaDes;
                setTime(7, `Prog: ${fmt(estSalidaDes)} | Llegada: ${fmt(dtRef)}`);
                setDelta(7, Math.abs(dms) > 60000 ? dms : null);
            } else setTime(7, `Real: ${fmt(dtRef)}`);
        } else {
            setNodo(7, "pending");
            if (estSalidaDes) {
                setTime(7, `SLA: ${fmt(estSalidaDes)}`);
                if (ahora >= estSalidaDes) {
                    setNodo(7, "risk");
                    const dms = ahora - estSalidaDes;
                    setDelta(7, dms > 60000 ? dms : null);
                } else if (etaSegundos > 0) {
                    const eta = new Date(ahora.getTime() + etaSegundos * 1000);
                    const dms = eta - estSalidaDes;
                    setDelta(7, dms > 0 ? dms : null);
                }
            } else setTime(7, "—");
        }

        // Barra de progreso
        const pesos = [
            { pct: 100 },
            { pct: dtAsignacion ? 100 : 0 },
            { pct: dtLlegadaCargue ? 100 : dtCargue && ahora >= dtCargue ? 60 : 0 },
            {
                pct: dtSalidaCargue
                    ? 100
                    : dtCargueReal
                        ? 70
                        : dtLlegadaCargue
                            ? 30
                            : 0,
            },
            {
                pct: dtLlegadaDes
                    ? 100
                    : dtInicioRuta
                        ? 50
                        : 0,
            },
            { pct: dtDescargueReal || dtSalidaDes ? 100 : dtLlegadaDes ? 50 : 0 },
            { pct: dtSalidaDes ? 100 : 0 },
        ];
        const cumplidos = pesos.reduce((a, p) => a + p.pct / 100, 0);
        const porcentaje = Math.round((cumplidos / pesos.length) * 100);
        const barFill = document.getElementById("kpi-bar-fill");
        const barVal = document.getElementById("kpi-pct-val");
        if (barFill) {
            barFill.style.width = `${porcentaje}%`;
            barFill.style.transition = "width .6s ease";
            barFill.style.background =
                porcentaje >= 80
                    ? "linear-gradient(90deg,#16a34a,#22c55e)"
                    : porcentaje >= 40
                        ? "linear-gradient(90deg,#0369a1,#0891b2)"
                        : "linear-gradient(90deg,#ea580c,#f97316)";
        }
        if (barVal) barVal.textContent = `${porcentaje}%`;
        const tlBar = document.getElementById("tl-progress-bar");
        if (tlBar) tlBar.style.width = `${porcentaje}%`;
    }

    /* ─────────────────────────────────────────────────────────────────
         calcularTiempos — enriquece tareas con _tiempos calculados
      ───────────────────────────────────────────────────────────────── */
    function calcularTiempos(tareas, fechaCargue) {
        const parseFecha = (f) => {
            if (!f) return null;
            const n = f.replace(
                /^(\d{4}-\d{2}-\d{2})[-\s](\d{2}:\d{2}:\d{2})$/,
                "$1T$2",
            );
            const d = new Date(n);
            return isNaN(d.getTime()) ? null : d;
        };
        const aMinutos = (valor, medida) => {
            if (!valor) return null;
            const m = Number(medida) || 1;
            if (m === 1) return Number(valor);
            if (m === 2) return Number(valor) * 60;
            if (m === 3) return Number(valor) * 1440;
            return Number(valor);
        };
        const fmtMin = (m) => {
            const abs = Math.abs(m);
            if (abs >= 1440)
                return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
            if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
            return `${abs} min`;
        };
        const fmtFecha = (d) => {
            if (!d) return null;
            return d.toLocaleString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        };

        const dtCargue = parseFecha(fechaCargue);
        const ahora = new Date();
        const mapaId = {};
        tareas.forEach((t) => {
            mapaId[t.id] = t;
        });
        const dtInicioCalc = {};
        const resolverDtInicio = (t) => {
            if (dtInicioCalc[t.id] !== undefined) return dtInicioCalc[t.id];
            let dt = null;
            const sinDep =
                !t.actividad_prerequisito || t.actividad_prerequisito === 0;
            if (t.criterio_calculo === 4) {
                dt = parseFecha(t.fecha_base_calc) ?? dtCargue;
            } else if (t.orden === 1 || sinDep) {
                dt = dtCargue;
            } else if (t.actividad_prerequisito && mapaId[t.actividad_prerequisito]) {
                const pre = mapaId[t.actividad_prerequisito];
                const dtPre = resolverDtInicio(pre);
                const minPre = aMinutos(pre.valor_tiempo, pre.medida_tiempo);
                dt =
                    dtPre && minPre
                        ? new Date(dtPre.getTime() + minPre * 60 * 1000)
                        : dtCargue;
            }
            dtInicioCalc[t.id] = dt;
            return dt;
        };
        tareas.forEach((t) => resolverDtInicio(t));

        return tareas.map((t) => {
            const minAsignados = aMinutos(t.valor_tiempo, t.medida_tiempo);
            const realMinutos = aMinutos(t.tiempo_real_min);
            // console.log("🚀 ~ calcularTiempos ~ minAsignados:", minAsignados)
            if (!minAsignados) return { ...t, _tiempos: null };
            const dtInicio = dtInicioCalc[t.id];
            if (!dtInicio) return { ...t, _tiempos: null };
            const dtReal = parseFecha(t.fecha_inicio_real);
            const dtLimite = new Date(dtInicio.getTime() + minAsignados * 60 * 1000);
            const baseTranscurrido = dtReal || dtInicio;
            const minTranscurridos = Math.max(
                0,
                Math.floor((ahora - baseTranscurrido) / 60000),
            );
            const minRestantes = Math.floor((dtLimite - ahora) / 60000);
            const alDia = t.estado === "COMPLETADO" || minRestantes >= 0;
            const pct = Math.min(
                Math.round((minTranscurridos / minAsignados) * 100),
                999,
            );
            const minTransMostrar =
                t.estado === "COMPLETADO" && dtReal
                    ? Math.max(0, Math.floor((dtReal - dtInicio) / 60000))
                    : t.estado === "COMPLETADO"
                        ? minAsignados
                        : minTranscurridos;
            return {
                ...t,
                _tiempos: {
                    minAsignados,
                    minTranscurridos: minTransMostrar,
                    minRestantes,
                    alDia,
                    pct: t.estado === "COMPLETADO" ? 100 : pct,
                    textoAsignado: fmtMin(minAsignados),
                    textoTranscurrido: fmtMin(minTransMostrar),
                    textoRestante:
                        t.estado === "COMPLETADO"
                            ? "0 min"
                            : (minRestantes < 0 ? "-" : "+") + fmtMin(Math.abs(minRestantes)),
                    fechaInicioCalc: fmtFecha(dtInicio),
                    fechaReal: fmtFecha(dtReal),
                    fechaLimite: fmtFecha(dtLimite),
                    realMinutos: realMinutos,
                },
            };
        });
    }

    /* ─────────────────────────────────────────────────────────────────
         renderTablaResumen — tabla de tiempos en panel expandible
      ───────────────────────────────────────────────────────────────── */
    function renderTablaResumen(container, tareas, titulo) {
        if (!container) return;
        const fmtMin = (m) => {
            const abs = Math.abs(m);
            if (abs >= 1440)
                return `${Math.floor(abs / 1440)}d ${Math.floor((abs % 1440) / 60)}h`;
            if (abs >= 60) return `${Math.floor(abs / 60)}h ${abs % 60}m`;
            return `${abs} min`;
        };
        const filas = tareas
            .map((t) => {
                const estandar = t._tiempos ? t._tiempos.textoAsignado : "—";
                let realHtml = `<span style="color:#94a3b8">${estandar}</span>`;
                if (t.estado === "COMPLETADO" && t.tiempo_real_gestion != null)
                    realHtml = `<span style="color:#16a34a;font-weight:600">${fmtMin(t.tiempo_real_gestion)}</span>`;
                else if (t.estado === "EN GESTION" && t._tiempos)
                    realHtml = `<span style="color:#ea580c;font-weight:600">${t._tiempos.textoTranscurrido}</span>`;
                let deltaHtml = '<span style="color:#94a3b8">—</span>';
                if (t.estado === "COMPLETADO" && t.tiempo_real_min != null) {
                    const diff = t.tiempo_real_min;
                    const color =
                        diff === 0 ? "#0369a1" : diff > 0 ? "#16a34a" : "#dc2626";
                    const signo = diff > 0 ? "+" : diff < 0 ? "-" : "=";
                    deltaHtml = `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:7px;white-space:nowrap;background:${color}12;color:${color};border:1px solid ${color}30">${signo}${fmtMin(Math.abs(diff))}</span>`;
                }
                return `<tr>
                <td style="font-size:10px;color:#0f172a;max-width:110px;white-space:normal;line-height:1.3">${t.nombre}</td>
                <td class="v" style="font-size:10px;color:#475569;text-align:center">${estandar}</td>
                <td class="v" style="font-size:10px;text-align:center">${realHtml}</td>
                <td class="v" style="text-align:center">${deltaHtml}</td>
            </tr>`;
            })
            .join("");

        // ── Totales fila TOTAL ──
        // Estándar: suma de minAsignados de todas las tareas
        const totalAsig = tareas.reduce((a, t) => a + (t._tiempos?.minAsignados || 0), 0);

        // Real: suma de tiempo_real_gestion de las COMPLETADAS
        //       + minAsignados de las NO completadas (proyección)
        const totalEstandarCompletadas = tareas.reduce(
            (a, t) => t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null
                ? a + (t._tiempos?.minAsignados || 0) : a, 0
        );
        const totalRealCompletadas = tareas.reduce(
            (a, t) => t.estado === 'COMPLETADO' && t.tiempo_real_gestion != null
                ? a + t.tiempo_real_gestion : a, 0
        );
        const hayCompletadas = totalRealCompletadas > 0;
        // Real total = estándar pendientes + real completadas
        const totalReal = (totalAsig - totalEstandarCompletadas) + totalRealCompletadas;

        // Delta: suma de tiempo_real_min de completadas
        // negativo = ganó tiempo (verde), positivo = perdió tiempo (rojo)
        const totalDelta = tareas.reduce(
            (a, t) => t.estado === 'COMPLETADO' && t.tiempo_real_min != null
                ? a + t.tiempo_real_min : a, 0
        );
        const totalCompletadas = tareas.filter(
            (t) => t.estado === 'COMPLETADO' && t.tiempo_real_min != null
        ).length;
        const totalColorD = totalDelta === 0 ? '#0369a1' : totalDelta < 0 ? '#16a34a' : '#dc2626';
        const totalDeltaHtml = totalCompletadas > 0
            ? `<span style="font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:7px;background:${totalColorD}12;color:${totalColorD};border:1px solid ${totalColorD}30">`
            + `${totalDelta > 0 ? '+' : totalDelta < 0 ? '-' : '='}${fmtMin(Math.abs(totalDelta))}</span>`
            : '—';
        const eventos = tareas.filter(
            (t) =>
                t.estado === "COMPLETADO" &&
                t.tiempo_real_min != null &&
                t.tiempo_real_min !== 0,
        );
        const eventosHtml =
            eventos.length === 0
                ? `<div style="font-size:10px;color:#94a3b8;padding:8px 0">Sin diferencias de tiempo registradas.</div>`
                : eventos
                    .map((t) => {
                        const diff = t.tiempo_real_min;
                        const color = diff > 0 ? "#16a34a" : "#dc2626";
                        const texto =
                            diff > 0
                                ? `Ganó ${fmtMin(Math.abs(diff))} en "${t.nombre}"`
                                : `Perdió ${fmtMin(Math.abs(diff))} en "${t.nombre}"`;
                        return `<div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid #f1f5f9"><span style="font-size:7px;color:${color};margin-top:3px;flex-shrink:0">●</span><div><div style="font-size:10px;color:#0f172a">${texto}</div><div style="font-size:9px;color:#94a3b8">Est: ${t._tiempos?.textoAsignado ?? "—"} · Real: ${fmtMin(t.tiempo_real_gestion ?? 0)}</div></div><span style="margin-left:auto;font-size:9px;font-weight:700;font-family:'JetBrains Mono',monospace;padding:1px 6px;border-radius:7px;white-space:nowrap;background:${color}12;color:${color};border:1px solid ${color}30">${diff > 0 ? "+" : ""}${fmtMin(diff)}</span></div>`;
                    })
                    .join("");

        container.innerHTML = `
            <table class="oc-table" style="margin-bottom:.8rem">
                <thead><tr><th>Actividad</th><th style="text-align:center">Estándar</th><th style="text-align:center">Real</th><th style="text-align:center">Δ</th></tr></thead>
                <tbody>${filas}</tbody>
                <tfoot>
                    <tr class="total">
                        <td>TOTAL ${titulo?.toUpperCase() ?? ""}</td>
                        <td class="v" style="text-align:center">${fmtMin(totalAsig)}</td>
                        <td class="v" style="text-align:center">${hayCompletadas ? fmtMin(totalReal) : fmtMin(totalAsig)}</td>
                        <td class="v" style="text-align:center">${totalDeltaHtml}</td>
                    </tr>
                </tfoot>
            </table>
            <div style="font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;margin-bottom:.5rem;margin-top:.2rem">Registro de Eventos</div>
            <div style="max-height:180px;overflow-y:auto">${eventosHtml}</div>`;
    }

    // Exponer al scope global
    window.ocToggle = ocToggle;
    window.completarTareaOC = completarTareaOC;
})();