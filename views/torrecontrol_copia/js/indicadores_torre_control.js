window.VENTANA = null; // Variable global para almacenar el ID
// Definir la función initScript globalmente
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID recibido a la variable global

    document.getElementById(`campo-${window.VENTANA}-year`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-mes`).style.display = 'none';
    document.getElementById(`campo-${window.VENTANA}-proveedor`).style.display = 'none';

    document.addEventListener('change', async (event) => {
        if (event.target.matches(`#campo-${window.VENTANA}-filtro_indicadores`)) { // mostrara el select de año
            const filtro = event.target.value;
            /* if (filtro === 'Año') {
                document.getElementById(`campo-${window.VENTANA}-year`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-mes`).style.display = 'none';
                document.getElementById(`campo-${window.VENTANA}-proveedor`).style.display = 'none';
                let select = document.getElementById(`campo-${window.VENTANA}-year`);
                select.innerHTML = ''; // Limpiar opciones anteriores
                select.innerHTML = '<option value="" seleted>Seleccione un año</option>'; // Opción por defecto
                let currentYear = new Date().getFullYear();
                for (let i = currentYear; i >= 2000; i--) {
                    let option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    select.appendChild(option);
                }
                select.style.display = '';
                select.value = ''; // Limpiar el valor seleccionado
                select.dispatchEvent(new Event('change')); // Disparar el evento de cambio para cargar los datos
            } else  */if (filtro === 'Proveedor') {
                // document.getElementById(`campo-${window.VENTANA}-year`).style.display = 'none';
                // document.getElementById(`campo-${window.VENTANA}-mes`).style.display = 'none';
                // document.getElementById(`campo-${window.VENTANA}-proveedor`).style.display = '';
                // // Llamar a la función para cargar los datos
                // await loadData(filtro);
 
                document.getElementById(`campo-${window.VENTANA}-year`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-mes`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-proveedor`).style.display = '';
                let select = document.getElementById(`campo-${window.VENTANA}-year`);
                select.innerHTML = ''; // Limpiar opciones anteriores
                select.innerHTML = '<option value="" seleted>Seleccione un año</option>'; // Opción por defecto
                let currentYear = new Date().getFullYear();
                for (let i = currentYear; i >= 2025; i--) {
                    let option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    select.appendChild(option);
                }
                select.style.display = '';
                select.value = ''; // Limpiar el valor seleccionado
                select.dispatchEvent(new Event('change')); // Disparar el evento de cambio para cargar los datos
                let Meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                let selectMes = document.getElementById(`campo-${window.VENTANA}-mes`);
                selectMes.innerHTML = ''; // Limpiar opciones anteriores
                selectMes.innerHTML = '<option value="" seleted>Seleccione un mes</option>'; // Opción por defecto
                Meses.forEach(element => {
                    let option = document.createElement('option');
                    option.value = element;
                    option.textContent = element;
                    selectMes.appendChild(option);
                });
                selectMes.style.display = '';
                selectMes.value = ''; // Limpiar el valor seleccionado
                selectMes.dispatchEvent(new Event('change')); // Disparar el evento de cambio para cargar los datos
                await loadData('Proveedor');

            } /* else if (filtro === 'Mes') {
                document.getElementById(`campo-${window.VENTANA}-mes`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-year`).style.display = 'none';
                document.getElementById(`campo-${window.VENTANA}-proveedor`).style.display = 'none';
                let Meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                let select = document.getElementById(`campo-${window.VENTANA}-mes`);
                select.innerHTML = ''; // Limpiar opciones anteriores
                select.innerHTML = '<option value="" seleted>Seleccione un mes</option>'; // Opción por defecto
                Meses.forEach(element => {
                    let option = document.createElement('option');
                    option.value = element;
                    option.textContent = element;
                    select.appendChild(option);
                });
                select.style.display = '';
                select.value = ''; // Limpiar el valor seleccionado
                select.dispatchEvent(new Event('change')); // Disparar el evento de cambio para cargar los datos
            }  */else {
                document.getElementById(`campo-${window.VENTANA}-year`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-mes`).style.display = '';
                document.getElementById(`campo-${window.VENTANA}-proveedor`).style.display = '';
                let select = document.getElementById(`campo-${window.VENTANA}-year`);
                select.innerHTML = ''; // Limpiar opciones anteriores
                select.innerHTML = '<option value="" seleted>Seleccione un año</option>'; // Opción por defecto
                let currentYear = new Date().getFullYear();
                for (let i = currentYear; i >= 2025; i--) {
                    let option = document.createElement('option');
                    option.value = i;
                    option.textContent = i;
                    select.appendChild(option);
                }
                select.style.display = '';
                select.value = ''; // Limpiar el valor seleccionado
                select.dispatchEvent(new Event('change')); // Disparar el evento de cambio para cargar los datos
                let Meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                let selectMes = document.getElementById(`campo-${window.VENTANA}-mes`);
                selectMes.innerHTML = ''; // Limpiar opciones anteriores
                selectMes.innerHTML = '<option value="" seleted>Seleccione un mes</option>'; // Opción por defecto
                Meses.forEach(element => {
                    let option = document.createElement('option');
                    option.value = element;
                    option.textContent = element;
                    selectMes.appendChild(option);
                });
                selectMes.style.display = '';
                selectMes.value = ''; // Limpiar el valor seleccionado
                selectMes.dispatchEvent(new Event('change')); // Disparar el evento de cambio para cargar los datos
                await loadData(filtro, 'Proveedor');
            }

        }
    });

    // document.addEventListener('click', async (event) => {
    //     if (event.target.matches(`#campo-${window.VENTANA}-aplicar`)) { // mostrara el select de año
    //         const filtro = document.getElementById(`campo-${window.VENTANA}-filtro_indicadores`).value;
    //         const year = document.getElementById(`campo-${window.VENTANA}-year`).value;
    //         const mes = document.getElementById(`campo-${window.VENTANA}-mes`).value;
    //         const proveedor = document.getElementById(`campo-${window.VENTANA}-proveedor`).value;

    //         let formData = new FormData();
    //         formData.append("Filtro", filtro);
    //         formData.append("Year", year);
    //         formData.append("Mes", mes);
    //         formData.append("Proveedor", proveedor);
    //         // formData.append("VentanaId", window.VENTANA);

    //         let response = await fetch($('#base_url').val() + 'torrecontrol/Aplicar_filtro_indicadores', {
    //             method: "POST",
    //             body: formData
    //         });
    //         let data = await response.json();

    //         if (data) {
    //             console.log("🚀 ~ document.addEventListener ~ data:", data)

    //         } else {

    //         }
    //     }
    // });

    // document.addEventListener('click', async (event) => {
    //     if (event.target.matches(`#campo-${window.VENTANA}-aplicar`)) {
    //         const filtro = document.getElementById(`campo-${window.VENTANA}-filtro_indicadores`).value;
    //         const year = document.getElementById(`campo-${window.VENTANA}-year`).value;
    //         const mes = document.getElementById(`campo-${window.VENTANA}-mes`).value;
    //         const proveedor = document.getElementById(`campo-${window.VENTANA}-proveedor`).value;

    //         let formData = new FormData();
    //         formData.append("Filtro", filtro);
    //         formData.append("Year", year);
    //         formData.append("Mes", mes);
    //         formData.append("Proveedor", proveedor);

    //         try {
    //             let response = await fetch($('#base_url').val() + 'torrecontrol/Aplicar_filtro_indicadores', {
    //                 method: "POST",
    //                 body: formData
    //             });
    //             let data = await response.json();

    //             if (data.data && data.data.length > 0) {
    //                 // Limpiar contenedor de gráficos antes de renderizar nuevos
    //                 const container = document.getElementById('indicadores_graficos');
    //                 container.innerHTML = '';

    //                 // Agrupar datos por indicador para gráficos más completos
    //                 // const groupedData = groupDataByIndicator(data.data);

    //                 data.data.forEach(element => {
    //                     if (element.indicador_id === 1) { //Calidad de la información por transportador cargada a la herramienta

    //                     } else if (element.indicador_id === 2) {
    //                         renderBarchar(data.data);
    //                     } else if (element.indicador_id === 3) {

    //                     } else if (element.indicador_id === 4) {

    //                     } else if (element.indicador_id === 5) {

    //                     } else if (element.indicador_id === 6) {

    //                     } else if (element.indicador_id === 7) {

    //                     } else if (element.indicador_id === 8) {

    //                     } else if (element.indicador_id === 9) {

    //                     } else if (element.indicador_id === 10) {

    //                     }
    //                 });
    //             } else {
    //                 showNoDataMessage();
    //             }

    //             if (data.porcentuales.length > 0) {
    //                 // console.log("🚀 ~ document.addEventListener ~ data.porcentuales:", data.porcentuales)
    //                 let template = ``;
    //                 data.porcentuales.forEach(element => {
    //                     template += `
    //                         <div class="col-6 col-md-4 col-xxl-1 text-center border-translucent border-start-xxl border-end-xxl-0 border-bottom-xxl-0 border-end border-bottom pb-4 pb-xxl-0">
    //                             <span class="uil uil-check fs-1"></span>
    //                             <h1 class="fs-8 pt-1">${element.SUM_TOTAL}%</h1>
    //                             <p class="fs-9 mb-0">${element.nombre_indicador}</p>
    //                         </div>
    //                     `;
    //                 });
    //                 document.getElementById('indicadores_porcentuales').innerHTML = template;
    //             }

    //         } catch (error) {
    //             console.error("Error al cargar datos:", error);
    //             alert("Error al cargar los datos. Por favor intente nuevamente.");
    //         }
    //     }
    // });

    document.addEventListener('click', async (event) => {
        if (event.target.matches(`#campo-${window.VENTANA}-aplicar`)) {
            const filtro = document.getElementById(`campo-${window.VENTANA}-filtro_indicadores`).value;
            const year = document.getElementById(`campo-${window.VENTANA}-year`).value;
            const mes = document.getElementById(`campo-${window.VENTANA}-mes`).value;
            const proveedor = document.getElementById(`campo-${window.VENTANA}-proveedor`).value;

            let formData = new FormData();
            formData.append("Filtro", filtro);
            formData.append("Year", year);
            formData.append("Mes", mes);
            formData.append("Proveedor", proveedor);

            try {
                let response = await fetch($('#base_url').val() + 'torrecontrol/Aplicar_filtro_indicadores', {
                    method: "POST",
                    body: formData
                });
                let data = await response.json();

                if (data.data && data.data.length > 0) {
                    // Limpiar contenedor de gráficos antes de renderizar nuevos
                    const container = document.getElementById('indicadores_graficos');
                    container.innerHTML = '';

                     const groupedData = groupDataByIndicator(data.data);
                     renderProviderCharts(groupedData);
                    // Separar datos por indicador
                    // const indicador1Data = data.data.filter(item => item.indicador_id === 1);
                    // const indicador2Data = data.data.filter(item => item.indicador_id === 2);
                    // const indicador3Data = data.data.filter(item => item.indicador_id === 3);
                    // const indicador4Data = data.data.filter(item => item.indicador_id === 4);
                    // const indicador5Data = data.data.filter(item => item.indicador_id === 5);
                    // const indicador6Data = data.data.filter(item => item.indicador_id === 6);
                    // const indicador7Data = data.data.filter(item => item.indicador_id === 7);
                    // const indicador8Data = data.data.filter(item => item.indicador_id === 8);
 
                    // if (indicador1Data.length > 0) {
                    //     // lógica para indicador 1
                    // }

                    // if (indicador2Data.length > 0) {
                    //     // Crear contenedor para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.className = 'echart-basic-bar-chart-example';
                    //     chartDiv.style.minHeight = '300px';
                    //     container.appendChild(chartDiv);

                    //     // Renderizar el gráfico
                    //     renderBarchar(indicador2Data);
                    // }


                    if (indicador1Data.length > 0) {
                        // Obtener el contenedor principal
                        const container = document.getElementById('indicadores_graficos');

                        // Crear estructura de tarjeta para el gráfico
                        const colDiv = document.createElement('div');
                        colDiv.className = 'col-12 col-md-6 mb-2';

                        const cardDiv = document.createElement('div');
                        cardDiv.className = 'card h-100';

                        const cardBody = document.createElement('div');
                        cardBody.className = 'card-body';

                        // Crear el contenedor específico para el gráfico
                        const chartDiv = document.createElement('div');
                        chartDiv.id = 'barchar-indicador-1'; // ID único
                        chartDiv.style.minHeight = '300px';

                        // Armar estructura
                        cardBody.appendChild(chartDiv);
                        cardDiv.appendChild(cardBody);
                        colDiv.appendChild(cardDiv);
                        container.appendChild(colDiv);

                        // Renderizar gráfico en el div recién creado
                        renderBarchar(indicador1Data, 'barchar-indicador-1');
                    }

                    // if (indicador2Data.length > 0) {
                    //     // Obtener el contenedor principal
                    //     const container = document.getElementById('indicadores_graficos');

                    //     // Crear estructura de tarjeta para el gráfico
                    //     const colDiv = document.createElement('div');
                    //     colDiv.className = 'col-12 col-md-6 mb-2';

                    //     const cardDiv = document.createElement('div');
                    //     cardDiv.className = 'card h-100';

                    //     const cardBody = document.createElement('div');
                    //     cardBody.className = 'card-body';

                    //     // Crear el contenedor específico para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.id = 'barchar-indicador-2'; // ID único
                    //     chartDiv.style.minHeight = '300px';

                    //     // Armar estructura
                    //     cardBody.appendChild(chartDiv);
                    //     cardDiv.appendChild(cardBody);
                    //     colDiv.appendChild(cardDiv);
                    //     container.appendChild(colDiv);

                    //     // Renderizar gráfico en el div recién creado
                    //     renderBarchar(indicador2Data, 'barchar-indicador-2');

                    // }


                    // if (indicador3Data.length > 0) {
                    //     // Obtener el contenedor principal
                    //     const container = document.getElementById('indicadores_graficos');

                    //     // Crear estructura de tarjeta para el gráfico
                    //     const colDiv = document.createElement('div');
                    //     colDiv.className = 'col-12 col-md-6 mb-2';

                    //     const cardDiv = document.createElement('div');
                    //     cardDiv.className = 'card h-100';

                    //     const cardBody = document.createElement('div');
                    //     cardBody.className = 'card-body';

                    //     // Crear el contenedor específico para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.id = 'barchar-indicador-3'; // ID único
                    //     chartDiv.style.minHeight = '300px';

                    //     // Armar estructura
                    //     cardBody.appendChild(chartDiv);
                    //     cardDiv.appendChild(cardBody);
                    //     colDiv.appendChild(cardDiv);
                    //     container.appendChild(colDiv);

                    //     // Renderizar gráfico en el div recién creado
                    //     renderDoughnutChart(indicador3Data, 'barchar-indicador-3');

                    // }

                    // if (indicador4Data.length > 0) {
                    //     // Obtener el contenedor principal
                    //     const container = document.getElementById('indicadores_graficos');

                    //     // Crear estructura de tarjeta para el gráfico
                    //     const colDiv = document.createElement('div');
                    //     colDiv.className = 'col-12 col-md-6 mb-2';

                    //     const cardDiv = document.createElement('div');
                    //     cardDiv.className = 'card h-100';

                    //     const cardBody = document.createElement('div');
                    //     cardBody.className = 'card-body';

                    //     // Crear el contenedor específico para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.id = 'barchar-indicador-4'; // ID único
                    //     chartDiv.style.minHeight = '300px';

                    //     // Armar estructura
                    //     cardBody.appendChild(chartDiv);
                    //     cardDiv.appendChild(cardBody);
                    //     colDiv.appendChild(cardDiv);
                    //     container.appendChild(colDiv);

                    //     // Renderizar gráfico en el div recién creado
                    //     renderHorizontalBarChart(indicador4Data, 'barchar-indicador-4');

                    // }


                    // if (indicador5Data.length > 0) {
                    //     // Obtener el contenedor principal
                    //     const container = document.getElementById('indicadores_graficos');

                    //     // Crear estructura de tarjeta para el gráfico
                    //     const colDiv = document.createElement('div');
                    //     colDiv.className = 'col-12 col-md-6 mb-2';

                    //     const cardDiv = document.createElement('div');
                    //     cardDiv.className = 'card h-100';

                    //     const cardBody = document.createElement('div');
                    //     cardBody.className = 'card-body';

                    //     // Crear el contenedor específico para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.id = 'barchar-indicador-5'; // ID único
                    //     chartDiv.style.minHeight = '300px';

                    //     // Armar estructura
                    //     cardBody.appendChild(chartDiv);
                    //     cardDiv.appendChild(cardBody);
                    //     colDiv.appendChild(cardDiv);
                    //     container.appendChild(colDiv);

                    //     // Renderizar gráfico en el div recién creado
                    //     renderLineMarkerChart(indicador5Data, 'barchar-indicador-5');
                    // }

                    // if (indicador6Data.length > 0) {
                    //     // Obtener el contenedor principal
                    //     const container = document.getElementById('indicadores_graficos');

                    //     // Crear estructura de tarjeta para el gráfico
                    //     const colDiv = document.createElement('div');
                    //     colDiv.className = 'col-12 col-md-6 mb-2';

                    //     const cardDiv = document.createElement('div');
                    //     cardDiv.className = 'card h-100';

                    //     const cardBody = document.createElement('div');
                    //     cardBody.className = 'card-body';

                    //     // Crear el contenedor específico para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.id = 'barchar-indicador-6'; // ID único
                    //     chartDiv.style.minHeight = '320px';

                    //     // Armar estructura
                    //     cardBody.appendChild(chartDiv);
                    //     cardDiv.appendChild(cardBody);
                    //     colDiv.appendChild(cardDiv);
                    //     container.appendChild(colDiv);

                    //     // Renderizar gráfico en el div recién creado
                    //     renderBarchar(indicador6Data, 'barchar-indicador-6');

                    // }


                    // if (indicador7Data.length > 0) {
                    //     // Obtener el contenedor principal
                    //     const container = document.getElementById('indicadores_graficos');

                    //     // Crear estructura de tarjeta para el gráfico
                    //     const colDiv = document.createElement('div');
                    //     colDiv.className = 'col-12 col-md-6 mb-2';

                    //     const cardDiv = document.createElement('div');
                    //     cardDiv.className = 'card h-100';

                    //     const cardBody = document.createElement('div');
                    //     cardBody.className = 'card-body';

                    //     // Crear el contenedor específico para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.id = 'barchar-indicador-7'; // ID único
                    //     chartDiv.style.minHeight = '320px';

                    //     // Armar estructura
                    //     cardBody.appendChild(chartDiv);
                    //     cardDiv.appendChild(cardBody);
                    //     colDiv.appendChild(cardDiv);
                    //     container.appendChild(colDiv);

                    //     // Renderizar gráfico en el div recién creado
                    //     renderDoughnutRoundedChart(indicador7Data, 'barchar-indicador-7');

                    // }

                    // if (indicador8Data.length > 0) {
                    //     // Obtener el contenedor principal
                    //     const container = document.getElementById('indicadores_graficos');

                    //     // Crear estructura de tarjeta para el gráfico
                    //     const colDiv = document.createElement('div');
                    //     colDiv.className = 'col-12 col-md-6 mb-2';

                    //     const cardDiv = document.createElement('div');
                    //     cardDiv.className = 'card h-100';

                    //     const cardBody = document.createElement('div');
                    //     cardBody.className = 'card-body';

                    //     // Crear el contenedor específico para el gráfico
                    //     const chartDiv = document.createElement('div');
                    //     chartDiv.id = 'barchar-indicador-8'; // ID único
                    //     chartDiv.style.minHeight = '320px';

                    //     // Armar estructura
                    //     cardBody.appendChild(chartDiv);
                    //     cardDiv.appendChild(cardBody);
                    //     colDiv.appendChild(cardDiv);
                    //     container.appendChild(colDiv);

                    //     // Renderizar gráfico en el div recién creado
                    //    // renderLineChart(indicador8Data, 'barchar-indicador-8');
                    //    renderProviderCharts(groupedData);
                    // }






                    // Agrega lógica para otros indicadores si es necesario...

                } else {
                    showNoDataMessage();
                }

                if (data.porcentuales.length > 0) {
                    let template = ``;
                    data.porcentuales.forEach(element => {
                        template += `
                            <div class="col-6 col-md-4 col-xxl-1 text-center border-translucent border-start-xxl border-end-xxl-0 border-bottom-xxl-0 border-end border-bottom pb-4 pb-xxl-0">
                                <span class="uil uil-check fs-1"></span>
                                <h1 class="fs-8 pt-1">${element.SUM_TOTAL ? element.SUM_TOTAL : element.valor_indicador}</h1>
                                <p class="fs-9 mb-0">${element.nombre_indicador}</p>
                            </div>
                        `;
                    });
                    // document.getElementById('indicadores_porcentuales').innerHTML = template;
                }

            } catch (error) {
                console.error("Error al cargar datos:", error);
                alert("Error al cargar los datos. Por favor intente nuevamente.");
            }
        }
    });


    // // Función para agrupar datos por indicador
    function groupDataByIndicator(data) {
        const grouped = {};

        data.forEach(item => {
            if (!grouped[item.indicador_id]) {
                grouped[item.indicador_id] = {
                    nombre_indicador: item.nombre_indicador,
                    forma_calculo: item.forma_calculo,
                    frecuencia: item.frecuencia,
                    data: []
                };
            }
            grouped[item.indicador_id].data.push(item);
        });

        return grouped;
    }

    // // Función para renderizar gráficos cuando el filtro es por año
    // function renderYearCharts(groupedData) {
    //     const container = document.getElementById('indicadores_graficos');

    //     Object.keys(groupedData).forEach(indicatorId => {
    //         const indicator = groupedData[indicatorId];

    //         // Crear contenedor para el gráfico
    //         const chartBox = document.createElement('div');
    //         chartBox.className = 'chart-box';
    //         chartBox.id = `chart-box-${indicatorId}`;

    //         const chartTitle = document.createElement('div');
    //         chartTitle.className = 'chart-title';
    //         chartTitle.textContent = indicator.nombre_indicador;

    //         const chartDiv = document.createElement('div');
    //         chartDiv.className = 'chart';
    //         chartDiv.id = `chart-${indicatorId}`;

    //         chartBox.appendChild(chartTitle);
    //         chartBox.appendChild(chartDiv);
    //         container.appendChild(chartBox);

    //         // Preparar datos para el gráfico de líneas (evolución mensual)
    //         const months = indicator.data.map(item => item.mes);
    //         const values = indicator.data.map(item => item.porcentaje_cumplimiento);

    //         // Inicializar gráfico
    //         const chart = echarts.init(chartDiv);

    //         const option = {
    //             tooltip: {
    //                 trigger: 'axis',
    //                 formatter: '{b}<br/>{a}: {c}%'
    //             },
    //             legend: {
    //                 data: [indicator.nombre_indicador]
    //             },
    //             xAxis: {
    //                 type: 'category',
    //                 data: months,
    //                 axisLabel: {
    //                     rotate: 45
    //                 }
    //             },
    //             yAxis: {
    //                 type: 'value',
    //                 min: 0,
    //                 max: 100,
    //                 axisLabel: {
    //                     formatter: '{value}%'
    //                 }
    //             },
    //             series: [{
    //                 name: indicator.nombre_indicador,
    //                 type: 'line',
    //                 data: values,
    //                 markPoint: {
    //                     data: [
    //                         { type: 'max', name: 'Máximo' },
    //                         { type: 'min', name: 'Mínimo' }
    //                     ]
    //                 },
    //                 markLine: {
    //                     data: [{ type: 'average', name: 'Promedio' }]
    //                 }
    //             }],
    //             title: {
    //                 subtext: `Fórmula: ${indicator.forma_calculo}`,
    //                 subtextStyle: {
    //                     fontSize: 12,
    //                     color: '#666'
    //                 },
    //                 left: 'center',
    //                 bottom: 0
    //             }
    //         };

    //         chart.setOption(option);

    //         // Redimensionar gráfico cuando cambie el tamaño de la ventana
    //         window.addEventListener('resize', function () {
    //             chart.resize();
    //         });
    //     });
    // }

    // // Función para renderizar gráficos cuando el filtro es por proveedor
    //remplazo de power by
    // function renderProviderCharts(groupedData) {
    //     const container = document.getElementById('indicadores_graficos');

    //         Object.keys(groupedData).forEach(indicatorId => {
    //         const indicator = groupedData[indicatorId];

    //         // Crear contenedor para el gráfico
    //         const chartBox = document.createElement('div');
    //         chartBox.className = 'chart-box';
    //         chartBox.id = `chart-box-${indicatorId}`;

    //         const chartTitle = document.createElement('div');
    //         chartTitle.className = 'chart-title';
    //         chartTitle.textContent = indicator.nombre_indicador;

    //         const chartDiv = document.createElement('div');
    //         chartDiv.className = 'chart';
    //         chartDiv.id = `chart-${indicatorId}`;

    //         chartBox.appendChild(chartTitle);
    //         chartBox.appendChild(chartDiv);
    //         container.appendChild(chartBox);

    //         // Inicializar gráfico de tipo gauge (velocímetro)
    //         const chart = echarts.init(chartDiv);

    //         // Obtener el último valor (más reciente)
    //         const lastDataPoint = indicator.data[indicator.data.length - 1];

    //         const option = {
    //             tooltip: {
    //                 trigger: 'item',
    //                 formatter: '{a} <br/>{b}: {c}%'
    //             },
    //             series: [{
    //                 name: indicator.nombre_indicador,
    //                 type: 'gauge',
    //                 min: 0,
    //                 max: 100,
    //                 axisLine: {
    //                     lineStyle: {
    //                         width: 30,
    //                         color: [
    //                             [0.6, '#67e0e3'],  // Verde para valores altos
    //                             [0.8, '#37a2da'],  // Azul para valores medios
    //                             [1, '#fd666d']     // Rojo para valores bajos
    //                         ]
    //                     }
    //                 },
    //                 detail: {
    //                     formatter: '{value}%',
    //                     fontSize: 24,
    //                     fontWeight: 'bold'
    //                 },
    //                 data: [{
    //                     value: lastDataPoint.porcentaje_cumplimiento,
    //                     name: 'Cumplimiento'
    //                 }]
    //             }],
    //             title: {
    //                 subtext: `Último mes: ${lastDataPoint.mes} ${lastDataPoint.year}\nFórmula: ${indicator.forma_calculo}`,
    //                 subtextStyle: {
    //                     fontSize: 12,
    //                     lineHeight: 16,
    //                     color: '#666'
    //                 },
    //                 left: 'center',
    //                 bottom: 0
    //             }
    //         };

    //         chart.setOption(option);

    //         window.addEventListener('resize', function () {
    //             chart.resize();
    //         });
    //     });
    // }

    // function renderMonthCharts(groupedData) {
    //     const container = document.getElementById('indicadores_graficos');
    //     container.innerHTML = '';

    //     // Verificar si hay datos para mostrar
    //     if (Object.keys(groupedData).length === 0) {
    //         showNoDataMessage();
    //         return;
    //     }

    //     Object.keys(groupedData).forEach(indicatorId => {
    //         const indicator = groupedData[indicatorId];

    //         // Crear contenedor para el gráfico
    //         const chartBox = document.createElement('div');
    //         chartBox.className = 'chart-box';
    //         chartBox.id = `chart-box-${indicatorId}`;

    //         const chartTitle = document.createElement('div');
    //         chartTitle.className = 'chart-title';
    //         chartTitle.textContent = indicator.nombre_indicador;

    //         const chartDiv = document.createElement('div');
    //         chartDiv.className = 'chart';
    //         chartDiv.id = `chart-${indicatorId}`;

    //         chartBox.appendChild(chartTitle);
    //         chartBox.appendChild(chartDiv);
    //         container.appendChild(chartBox);

    //         // Preparar datos para el gráfico
    //         // Agrupar por día/semana si los datos lo permiten
    //         const timeData = indicator.data.reduce((acc, item) => {
    //             // Asumimos que hay un campo 'dia' o 'semana' en los datos
    //             // Si no existe, usamos el mes como agrupador
    //             const timeKey = item.dia ? `Día ${item.dia}` : item.semana ? `Sem ${item.semana}` : item.mes_calculo;

    //             if (!acc[timeKey]) {
    //                 acc[timeKey] = {
    //                     value: 0,
    //                     count: 0
    //                 };
    //             }
    //             acc[timeKey].value += item.porcentaje_cumplimiento;
    //             acc[timeKey].count++;
    //             return acc;
    //         }, {});

    //         const timeLabels = Object.keys(timeData);
    //         const averageValues = timeLabels.map(key => (timeData[key].value / timeData[key].count).toFixed(2));

    //         // Inicializar gráfico
    //         const chart = echarts.init(chartDiv);

    //         const option = {
    //             tooltip: {
    //                 trigger: 'axis',
    //                 formatter: params => {
    //                     const data = params[0];
    //                     return `${data.name}<br/>${data.seriesName}: ${data.value}%`;
    //                 }
    //             },
    //             legend: {
    //                 data: [indicator.nombre_indicador]
    //             },
    //             grid: {
    //                 left: '3%',
    //                 right: '4%',
    //                 bottom: '15%',
    //                 containLabel: true
    //             },
    //             xAxis: {
    //                 type: 'category',
    //                 data: timeLabels,
    //                 axisLabel: {
    //                     rotate: 45,
    //                     interval: 0
    //                 }
    //             },
    //             yAxis: {
    //                 type: 'value',
    //                 min: 0,
    //                 max: 100,
    //                 axisLabel: {
    //                     formatter: '{value}%'
    //                 }
    //             },
    //             series: [{
    //                 name: indicator.nombre_indicador,
    //                 type: 'bar',
    //                 barWidth: '60%',
    //                 data: averageValues,
    //                 itemStyle: {
    //                     color: function (params) {
    //                         // Colores según el valor
    //                         const value = params.value;
    //                         if (value >= 80) return '#52c41a'; // Verde
    //                         if (value >= 60) return '#faad14'; // Amarillo
    //                         return '#f5222d'; // Rojo
    //                     }
    //                 },
    //                 markLine: {
    //                     data: [{
    //                         type: 'average',
    //                         name: 'Promedio',
    //                         lineStyle: {
    //                             color: '#1890ff'
    //                         },
    //                         label: {
    //                             position: 'end',
    //                             formatter: 'Promedio: {c}%'
    //                         }
    //                     }]
    //                 }
    //             }],
    //             title: {
    //                 subtext: `Fórmula: ${indicator.forma_calculo} | Frecuencia: ${indicator.frecuencia}`,
    //                 subtextStyle: {
    //                     fontSize: 12,
    //                     color: '#666'
    //                 },
    //                 left: 'center',
    //                 bottom: 0
    //             }
    //         };

    //         chart.setOption(option);

    //         // Redimensionar gráfico cuando cambie el tamaño de la ventana
    //         window.addEventListener('resize', function () {
    //             chart.resize();
    //         });
    //     });
    // }

    // function renderDefaultCharts(groupedData) {
    //     const container = document.getElementById('indicadores_graficos');
    //     container.innerHTML = '';

    //     // Verificar si hay datos para mostrar
    //     if (Object.keys(groupedData).length === 0) {
    //         showNoDataMessage();
    //         return;
    //     }

    //     // Primero, crear un resumen general
    //     renderSummaryChart(groupedData);

    //     // Luego, mostrar gráficos individuales para cada indicador
    //     Object.keys(groupedData).forEach(indicatorId => {
    //         const indicator = groupedData[indicatorId];

    //         // Crear contenedor para el gráfico
    //         const chartBox = document.createElement('div');
    //         chartBox.className = 'chart-box';
    //         chartBox.id = `chart-box-${indicatorId}`;

    //         const chartTitle = document.createElement('div');
    //         chartTitle.className = 'chart-title';
    //         chartTitle.textContent = indicator.nombre_indicador;

    //         const chartDiv = document.createElement('div');
    //         chartDiv.className = 'chart';
    //         chartDiv.id = `chart-${indicatorId}`;

    //         chartBox.appendChild(chartTitle);
    //         chartBox.appendChild(chartDiv);
    //         container.appendChild(chartBox);

    //         // Determinar el tipo de gráfico según la cantidad de datos
    //         if (indicator.data.length > 1) {
    //             // Si hay múltiples puntos de datos, mostrar gráfico de evolución
    //             renderEvolutionChart(chartDiv, indicator);
    //         } else {
    //             // Si solo hay un punto de datos, mostrar gráfico gauge
    //             renderGaugeChart(chartDiv, indicator.data[0], indicator);
    //         }
    //     });
    // }

    // // Función para renderizar el gráfico de resumen general
    // function renderSummaryChart(groupedData) {
    //     const summaryBox = document.createElement('div');
    //     summaryBox.className = 'summary-box';
    //     summaryBox.id = 'summary-chart';

    //     const summaryTitle = document.createElement('div');
    //     summaryTitle.className = 'summary-title';
    //     summaryTitle.textContent = 'Resumen General de Indicadores';

    //     const summaryDiv = document.createElement('div');
    //     summaryDiv.className = 'summary-chart';
    //     summaryDiv.id = 'summary-chart-container';

    //     summaryBox.appendChild(summaryTitle);
    //     summaryBox.appendChild(summaryDiv);
    //     document.getElementById('indicadores_graficos').appendChild(summaryBox);

    //     // Preparar datos para el resumen
    //     const indicators = [];
    //     const averages = [];
    //     const minValues = [];
    //     const maxValues = [];

    //     Object.keys(groupedData).forEach(indicatorId => {
    //         const indicator = groupedData[indicatorId];
    //         const values = indicator.data.map(item => item.porcentaje_cumplimiento);
    //         const avg = values.reduce((a, b) => a + b, 0) / values.length;

    //         indicators.push(indicator.nombre_indicador);
    //         averages.push(avg.toFixed(2));
    //         minValues.push(Math.min(...values).toFixed(2));
    //         maxValues.push(Math.max(...values).toFixed(2));
    //     });

    //     // Inicializar gráfico de resumen
    //     const chart = echarts.init(summaryDiv);

    //     const option = {
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: {
    //                 type: 'shadow'
    //             }
    //         },
    //         legend: {
    //             data: ['Promedio', 'Mínimo', 'Máximo']
    //         },
    //         grid: {
    //             left: '3%',
    //             right: '4%',
    //             bottom: '3%',
    //             containLabel: true
    //         },
    //         xAxis: {
    //             type: 'value',
    //             min: 0,
    //             max: 100,
    //             axisLabel: {
    //                 formatter: '{value}%'
    //             }
    //         },
    //         yAxis: {
    //             type: 'category',
    //             data: indicators,
    //             axisLabel: {
    //                 interval: 0,
    //                 rotate: 30
    //             }
    //         },
    //         series: [
    //             {
    //                 name: 'Promedio',
    //                 type: 'bar',
    //                 data: averages,
    //                 itemStyle: {
    //                     color: '#1890ff'
    //                 },
    //                 label: {
    //                     show: true,
    //                     position: 'right',
    //                     formatter: '{c}%'
    //                 }
    //             },
    //             {
    //                 name: 'Mínimo',
    //                 type: 'bar',
    //                 data: minValues,
    //                 itemStyle: {
    //                     color: '#faad14'
    //                 },
    //                 label: {
    //                     show: true,
    //                     position: 'right',
    //                     formatter: '{c}%'
    //                 }
    //             },
    //             {
    //                 name: 'Máximo',
    //                 type: 'bar',
    //                 data: maxValues,
    //                 itemStyle: {
    //                     color: '#52c41a'
    //                 },
    //                 label: {
    //                     show: true,
    //                     position: 'right',
    //                     formatter: '{c}%'
    //                 }
    //             }
    //         ]
    //     };

    //     chart.setOption(option);

    //     window.addEventListener('resize', function () {
    //         chart.resize();
    //     });
    // }

    // // Función para renderizar gráfico de evolución temporal
    // function renderEvolutionChart(chartDiv, indicator) {
    //     const chart = echarts.init(chartDiv);

    //     // Agrupar datos por periodo (mes-año)
    //     const periodData = {};
    //     indicator.data.forEach(item => {
    //         const period = `${item.mes}-${item.year}`;
    //         if (!periodData[period]) {
    //             periodData[period] = {
    //                 values: [],
    //                 proveedores: []
    //             };
    //         }
    //         periodData[period].values.push(item.porcentaje_cumplimiento);
    //         if (!periodData[period].proveedores.includes(item.razon_social)) {
    //             periodData[period].proveedores.push(item.razon_social);
    //         }
    //     });

    //     const periods = Object.keys(periodData).sort();
    //     const avgValues = periods.map(period => {
    //         const sum = periodData[period].values.reduce((a, b) => a + b, 0);
    //         return (sum / periodData[period].values.length).toFixed(2);
    //     });

    //     const proveedoresCount = periods.map(period => periodData[period].proveedores.length);

    //     const option = {
    //         tooltip: {
    //             trigger: 'axis',
    //             formatter: function (params) {
    //                 let result = params[0].axisValue + '<br/>';
    //                 params.forEach(param => {
    //                     result += `${param.seriesName}: ${param.value}`;
    //                     if (param.seriesName === 'Promedio') {
    //                         result += '%';
    //                     }
    //                     result += '<br/>';
    //                 });
    //                 return result;
    //             }
    //         },
    //         legend: {
    //             data: ['Promedio', 'Proveedores']
    //         },
    //         grid: {
    //             left: '3%',
    //             right: '4%',
    //             bottom: '3%',
    //             containLabel: true
    //         },
    //         xAxis: {
    //             type: 'category',
    //             data: periods,
    //             axisLabel: {
    //                 rotate: 45
    //             }
    //         },
    //         yAxis: [
    //             {
    //                 type: 'value',
    //                 name: 'Porcentaje',
    //                 min: 0,
    //                 max: 100,
    //                 axisLabel: {
    //                     formatter: '{value}%'
    //                 }
    //             },
    //             {
    //                 type: 'value',
    //                 name: 'Proveedores',
    //                 min: 0,
    //                 axisLabel: {
    //                     formatter: '{value}'
    //                 }
    //             }
    //         ],
    //         series: [
    //             {
    //                 name: 'Promedio',
    //                 type: 'line',
    //                 data: avgValues,
    //                 smooth: true,
    //                 itemStyle: {
    //                     color: '#1890ff'
    //                 },
    //                 markLine: {
    //                     data: [
    //                         { type: 'average', name: 'Promedio General' }
    //                     ]
    //                 }
    //             },
    //             {
    //                 name: 'Proveedores',
    //                 type: 'bar',
    //                 yAxisIndex: 1,
    //                 data: proveedoresCount,
    //                 itemStyle: {
    //                     color: '#a0d911'
    //                 }
    //             }
    //         ],
    //         title: {
    //             subtext: `Fórmula: ${indicator.forma_calculo}`,
    //             subtextStyle: {
    //                 fontSize: 12,
    //                 color: '#666'
    //             },
    //             left: 'center',
    //             bottom: 0
    //         }
    //     };

    //     chart.setOption(option);

    //     window.addEventListener('resize', function () {
    //         chart.resize();
    //     });
    // }

    // // Función para renderizar gráfico gauge (reutilizable)
    // function renderGaugeChart(chartDiv, dataPoint, indicator) {
    //     const chart = echarts.init(chartDiv);

    //     const option = {
    //         tooltip: {
    //             formatter: '{a} <br/>{b} : {c}%'
    //         },
    //         series: [{
    //             name: indicator.nombre_indicador,
    //             type: 'gauge',
    //             min: 0,
    //             max: 100,
    //             axisLine: {
    //                 lineStyle: {
    //                     width: 30,
    //                     color: [
    //                         [0.3, '#67e0e3'],
    //                         [0.7, '#37a2da'],
    //                         [1, '#fd666d']
    //                     ]
    //                 }
    //             },
    //             detail: {
    //                 formatter: '{value}%',
    //                 fontSize: 24,
    //                 fontWeight: 'bold',
    //                 color: 'auto'
    //             },
    //             data: [{
    //                 value: dataPoint.porcentaje_cumplimiento,
    //                 name: 'Cumplimiento'
    //             }],
    //             title: {
    //                 show: true,
    //                 offsetCenter: [0, '80%'],
    //                 text: dataPoint.razon_social,
    //                 textStyle: {
    //                     fontSize: 14,
    //                     color: '#333'
    //                 }
    //             }
    //         }],
    //         title: {
    //             subtext: `Fórmula: ${indicator.forma_calculo}`,
    //             subtextStyle: {
    //                 fontSize: 12,
    //                 color: '#666'
    //             },
    //             left: 'center',
    //             bottom: 0
    //         }
    //     };

    //     chart.setOption(option);

    //     window.addEventListener('resize', function () {
    //         chart.resize();
    //     });
    // }

    // // Función para mostrar mensaje cuando no hay datos
    // function showNoDataMessage() {
    //     const container = document.getElementById('indicadores_graficos');
    //     container.innerHTML = '<div class="no-data-message">No se encontraron datos con los filtros seleccionados</div>';
    // }

    // function renderBarchar(groupedData) {
    //     const chartDom = document.querySelector('.echart-basic-bar-chart-example');
    //     const myChart = echarts.init(chartDom);

    //     // Agrupar por proveedor y actividad
    //     const proveedores = [];
    //     const actividades = new Set();
    //     const seriesDataMap = {};

    //     groupedData.forEach(item => {
    //         const proveedor = item.razon_social;
    //         const actividad = item.nombre_indicador;
    //         const porcentaje = parseFloat(item.porcentaje_cumplimiento);

    //         if (!proveedores.includes(proveedor)) {
    //             proveedores.push(proveedor);
    //         }

    //         actividades.add(actividad);

    //         if (!seriesDataMap[actividad]) {
    //             seriesDataMap[actividad] = [];
    //         }

    //         // Asegurarse de que las posiciones coincidan por proveedor
    //         seriesDataMap[actividad][proveedores.indexOf(proveedor)] = porcentaje;
    //     });

    //     // Llenar vacíos con 0
    //     for (const actividad of actividades) {
    //         const data = seriesDataMap[actividad];
    //         for (let i = 0; i < proveedores.length; i++) {
    //             if (data[i] === undefined) {
    //                 data[i] = 0;
    //             }
    //         }
    //     }

    //     const option = {
    //         title: {
    //             text: 'Porcentaje de Cumplimiento por Proveedor',
    //             left: 'center'
    //         },
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: { type: 'shadow' }
    //         },
    //         legend: {
    //             top: 'bottom'
    //         },
    //         xAxis: {
    //             type: 'category',
    //             data: proveedores,
    //             axisLabel: { interval: 0, rotate: 30 }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name: '% Cumplimiento'
    //         },
    //         series: Array.from(actividades).map(actividad => ({
    //             name: actividad,
    //             type: 'bar',
    //             data: seriesDataMap[actividad]
    //         }))
    //     };

    //     myChart.setOption(option);
    // }

    // function renderBarchar(groupedData, chartId) {
    //     const chartDom = document.getElementById(chartId);
    //     const myChart = echarts.init(chartDom);

    //     const proveedores = [];
    //     const actividades = new Set();
    //     const seriesDataMap = {};

    //     groupedData.forEach(item => {
    //         const proveedor = item.razon_social;
    //         const actividad = item.nombre_indicador;
    //         const porcentaje = parseFloat(item.valor_indicador);

    //         if (!proveedores.includes(proveedor)) {
    //             proveedores.push(proveedor);
    //         }

    //         actividades.add(actividad);

    //         if (!seriesDataMap[actividad]) {
    //             seriesDataMap[actividad] = [];
    //         }

    //         seriesDataMap[actividad][proveedores.indexOf(proveedor)] = porcentaje;
    //     });

    //     for (const actividad of actividades) {
    //         const data = seriesDataMap[actividad];
    //         for (let i = 0; i < proveedores.length; i++) {
    //             if (data[i] === undefined) {
    //                 data[i] = 0;
    //             }
    //         }
    //     }

    //     const colorPalette = [
    //         '#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE',
    //         '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#FF9F7F'
    //     ];

    //     const option = {
    //         title: {
    //             text: groupedData[0].nombre_indicador,
    //             // subtext: groupedData[0].nombre_indicador,
    //             textStyle: {
    //                 fontSize: 14,
    //                 color: '#666'
    //             },
    //             left: 'center'
    //         },
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: { type: 'shadow' }
    //         },
    //         legend: {
    //             top: 'bottom'
    //         },
    //         xAxis: {
    //             type: 'category',
    //             data: proveedores,
    //             axisLabel: { interval: 0, rotate: 30 }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name: 'Valor del Indicador'
    //         },
    //         series: Array.from(actividades).map((actividad, index) => ({
    //             // name: actividad,
    //             type: 'bar',
    //             data: seriesDataMap[actividad],
    //             itemStyle: {
    //                 color: function (params) {
    //                     return colorPalette[params.dataIndex % colorPalette.length];
    //                 }
    //             }
    //         }))
    //     };

    //     myChart.setOption(option);
    // }


    // function renderBarchar(groupedData, chartId) {
    //     const chartDom = document.getElementById(chartId);
    //     const myChart = echarts.init(chartDom);

    //     const proveedores = [];
    //     const actividades = new Set();
    //     const seriesDataMap = {};
    //     const cumplimientoMap = {};

    //     // Preparar datos
    //     groupedData.forEach(item => {
    //         const proveedor = item.razon_social;
    //         const actividad = item.nombre_indicador;
    //         const valor = parseFloat(item.valor_indicador);
    //         const cumplimiento = parseFloat(item.porcentaje_cumplimiento);

    //         if (!proveedores.includes(proveedor)) {
    //             proveedores.push(proveedor);
    //         }

    //         actividades.add(actividad);

    //         const index = proveedores.indexOf(proveedor);
    //         if (!seriesDataMap[actividad]) {
    //             seriesDataMap[actividad] = [];
    //         }
    //         seriesDataMap[actividad][index] = valor;

    //         // Guardar cumplimiento para tooltip
    //         if (!cumplimientoMap[actividad]) {
    //             cumplimientoMap[actividad] = {};
    //         }
    //         cumplimientoMap[actividad][proveedor] = cumplimiento;
    //     });

    //     // Rellenar datos faltantes con 0
    //     for (const actividad of actividades) {
    //         const data = seriesDataMap[actividad];
    //         for (let i = 0; i < proveedores.length; i++) {
    //             if (data[i] === undefined) {
    //                 data[i] = 0;
    //             }
    //         }
    //     }

    //     const colorPalette = [
    //         '#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE',
    //         '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#FF9F7F'
    //     ];

    //     const option = {
    //         title: {
    //             text: groupedData[0].nombre_indicador,
    //             textStyle: {
    //                 fontSize: 14,
    //                 color: '#666'
    //             },
    //             left: 'center'
    //         },
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: { type: 'shadow' },
    //             formatter: function (params) {
    //                 let tooltip = '';
    //                 params.forEach(item => {
    //                     const actividad = item.seriesName;
    //                     const index = item.dataIndex;
    //                     const proveedor = proveedores[index]; // ← más fiable que item.name
    //                     const valor = item.value;
    //                     const cumplimiento = cumplimientoMap[actividad]?.[proveedor] ?? 0;

    //                     tooltip += `Proveedor: ${proveedor}<br/>
    //                                 Valor Indicador: ${valor}<br/>
    //                                 % Cumplimiento: ${cumplimiento.toFixed(2)}%<br/><br/>`;
    //                 });
    //                 return tooltip;
    //             }

    //         },
    //         legend: {
    //             top: 'bottom'
    //         },
    //         xAxis: {
    //             type: 'category',
    //             data: proveedores,
    //             axisLabel: { interval: 0, rotate: 30 }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name: 'Valor del Indicador'
    //         },
    //         series: Array.from(actividades).map((actividad, index) => ({
    //             // name: actividad,
    //             type: 'bar',
    //             data: seriesDataMap[actividad],
    //             itemStyle: {
    //                 color: function (params) {
    //                     return colorPalette[params.dataIndex % colorPalette.length];
    //                 }
    //             }
    //         }))
    //     };

    //     myChart.setOption(option);
    // }


    function renderBarchar(groupedData, chartId) {
        const chartDom = document.getElementById(chartId);
        const myChart = echarts.init(chartDom);

        const proveedores = [];
        const actividades = new Set();
        const seriesDataMap = {};
        const cumplimientoMap = {};

        // Preparar datos
        groupedData.forEach(item => {
            const proveedor = item.razon_social;
            const actividad = item.nombre_indicador;
            const valor = parseFloat(item.valor_indicador);
            const cumplimiento = parseFloat(item.porcentaje_cumplimiento);

            if (!proveedores.includes(proveedor)) {
                proveedores.push(proveedor);
            }

            actividades.add(actividad);

            const proveedorIndex = proveedores.indexOf(proveedor);

            // Inicializar estructuras
            if (!seriesDataMap[actividad]) {
                seriesDataMap[actividad] = [];
            }
            if (!cumplimientoMap[actividad]) {
                cumplimientoMap[actividad] = [];
            }

            seriesDataMap[actividad][proveedorIndex] = valor;
            cumplimientoMap[actividad][proveedorIndex] = cumplimiento;
        });

        // Rellenar datos faltantes
        for (const actividad of actividades) {
            const data = seriesDataMap[actividad];
            const cumplimiento = cumplimientoMap[actividad];
            for (let i = 0; i < proveedores.length; i++) {
                if (data[i] === undefined) data[i] = 0;
                if (cumplimiento[i] === undefined) cumplimiento[i] = 0;
            }
        }

        const colorPalette = [
            '#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE',
            '#3BA272', '#FC8452', '#9A60B4', '#EA7CCC', '#FF9F7F'
        ];

        const option = {
            title: {
                text: groupedData[0].nombre_indicador,
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                    let tooltip = '';
                    params.forEach(item => {
                        const actividad = item.seriesName;
                        const index = item.dataIndex;
                        const proveedor = proveedores[index];
                        const valor = item.value;
                        const cumplimiento = cumplimientoMap[actividad]?.[index] ?? 0;

                        tooltip += `Proveedor: ${proveedor}<br/>
                                    Actividad: ${actividad}<br/>
                                    Valor Indicador: ${valor}<br/>
                                    % Cumplimiento: ${cumplimiento.toFixed(2)}%<br/><br/>`;
                    });
                    return tooltip;
                }
            },
            legend: {
                top: 'bottom'
            },
            xAxis: {
                type: 'category',
                data: proveedores,
                axisLabel: { interval: 0, rotate: 30 }
            },
            yAxis: {
                type: 'value',
                name: 'Valor del Indicador'
            },
            series: Array.from(actividades).map((actividad, index) => ({
                name: actividad,
                type: 'bar',
                data: seriesDataMap[actividad],
                itemStyle: {
                    color: function (params) {
                        return colorPalette[params.dataIndex % colorPalette.length];
                    }
                }
            }))
        };

        myChart.setOption(option);
    }



    function renderChar(groupedData, chartId) {
        const chartDom = document.getElementById(chartId);
        const myChart = echarts.init(chartDom);

        // Agrupar datos por proveedor y sumar el porcentaje de cumplimiento
        const proveedorDataMap = {};

        groupedData.forEach(item => {
            const proveedor = item.razon_social;
            const porcentaje = parseFloat(item.valor_indicador);

            if (!proveedorDataMap[proveedor]) {
                proveedorDataMap[proveedor] = 0;
            }
            proveedorDataMap[proveedor] += porcentaje;
        });

        // Preparar datos para el gráfico
        const pieData = Object.keys(proveedorDataMap).map(proveedor => ({
            name: proveedor,
            value: proveedorDataMap[proveedor]
        }));

        // Configuración de la gráfica de pastel
        const option = {
            title: {
                text: 'Cumplimiento por Proveedor',
                subtext: groupedData[0].nombre_indicador,
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [
                {
                    name: 'Cumplimiento',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '50%'],
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {d}%'
                    }
                }
            ]
        };

        myChart.setOption(option);
    }

    function renderDoughnutChart(groupedData, chartId) {
        const chartDiv = document.getElementById(chartId);
        const myChart = echarts.init(chartDiv);

        const proveedorDataMap = {};

        groupedData.forEach(item => {
            const proveedor = item.razon_social;
            const porcentaje = parseFloat(item.porcentaje_cumplimiento);
            const valor = parseFloat(item.valor_indicador);

            if (!proveedorDataMap[proveedor]) {
                proveedorDataMap[proveedor] = { porcentaje: 0, valor: 0 };
            }

            proveedorDataMap[proveedor].porcentaje += porcentaje;
            proveedorDataMap[proveedor].valor += valor;
        });

        const pieData = Object.keys(proveedorDataMap).map(proveedor => ({
            name: proveedor,
            value: proveedorDataMap[proveedor].porcentaje, // Se usa como valor gráfico
            valor_indicador: proveedorDataMap[proveedor].valor,
            porcentaje_cumplimiento: proveedorDataMap[proveedor].porcentaje
        }));

        const option = {
            title: {
                text: groupedData[0].nombre_indicador,
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    return `${params.name}<br/>
                            Valor Indicador: ${pieData[params.dataIndex].valor_indicador.toFixed(2)}<br/>
                            % Cumplimiento: ${pieData[params.dataIndex].porcentaje_cumplimiento.toFixed(2)}%`;
                }
            },
            series: [
                {
                    name: 'Cumplimiento',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: params => {
                            const data = pieData[params.dataIndex];
                            return `${params.name}\n${data.porcentaje_cumplimiento.toFixed(1)}% / ${data.valor_indicador.toFixed(1)}`;
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
    }

    // function renderLineMarkerChart(groupedData, chartId) {
    //     const chartDiv = document.getElementById(chartId);
    //     const myChart = echarts.init(chartDiv);

    //     // Preparar los datos para el gráfico
    //     const proveedores = [];
    //     const porcentajeCumplimiento = [];

    //     groupedData.forEach(item => {
    //         proveedores.push(item.razon_social);  // Proveedor como eje X
    //         porcentajeCumplimiento.push(parseFloat(item.valor_indicador));  // Porcentaje de cumplimiento como eje Y
    //     });

    //     // Configuración del gráfico de líneas con marcadores
    //     const option = {
    //         title: {
    //             text: groupedData[0].nombre_indicador,
    //             textStyle: {
    //                 fontSize: 14,
    //                 color: '#666'
    //             },
    //             left: 'center'
    //         },
    //         tooltip: {
    //             trigger: 'axis'
    //         },
    //         xAxis: {
    //             type: 'category',
    //             data: proveedores,  // Eje X con los proveedores
    //             axisLabel: {
    //                 rotate: 45  // Rotar etiquetas si es necesario
    //             }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name: '% Cumplimiento'
    //         },
    //         series: [{
    //             name: 'Cumplimiento',
    //             type: 'line',
    //             data: porcentajeCumplimiento,  // Datos del porcentaje de cumplimiento
    //             markPoint: {
    //                 data: [
    //                     { type: 'max', name: 'Max', symbolSize: 20, itemStyle: { color: '#ff0000' } },  // Marcador en el valor máximo
    //                     { type: 'min', name: 'Min', symbolSize: 20, itemStyle: { color: '#00ff00' } }   // Marcador en el valor mínimo
    //                 ]
    //             },
    //             markLine: {
    //                 data: [
    //                     { type: 'average', name: 'Promedio' }  // Línea de promedio
    //                 ]
    //             }
    //         }]
    //     };

    //     myChart.setOption(option);
    // }

    function renderLineMarkerChart(groupedData, chartId) {
        const chartDiv = document.getElementById(chartId);
        const myChart = echarts.init(chartDiv);

        const proveedores = [];
        const valoresIndicador = [];
        const porcentajeCumplimiento = [];

        groupedData.forEach(item => {
            proveedores.push(item.razon_social);
            valoresIndicador.push(parseFloat(item.valor_indicador) || 0);
            porcentajeCumplimiento.push(parseFloat(item.porcentaje_cumplimiento) || 0);
        });

        const option = {
            title: {
                text: groupedData[0]?.nombre_indicador || 'Indicador',
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    let tooltip = `<strong>${params[0].axisValue}</strong><br/>`;
                    params.forEach(item => {
                        tooltip += `${item.seriesName}: ${item.data.toFixed(2)}${item.seriesName.includes('%') ? '%' : ''}<br/>`;
                    });
                    return tooltip;
                }
            },
            legend: {
                top: 'bottom',
                data: ['Valor Indicador', '% Cumplimiento']
            },
            xAxis: {
                type: 'category',
                data: proveedores,
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: {
                type: 'value',
                name: 'Valores'
            },
            series: [
                {
                    name: 'Valor Indicador',
                    type: 'line',
                    data: valoresIndicador,
                    smooth: true,
                    itemStyle: {
                        color: '#4CAF50'
                    },
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max' },
                            { type: 'min', name: 'Min' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: 'Promedio' }
                        ]
                    }
                },
                {
                    name: '% Cumplimiento',
                    type: 'line',
                    data: porcentajeCumplimiento,
                    smooth: true,
                    itemStyle: {
                        color: '#2196F3'
                    },
                    markPoint: {
                        data: [
                            { type: 'max', name: 'Max %' },
                            { type: 'min', name: 'Min %' }
                        ]
                    },
                    markLine: {
                        data: [
                            { type: 'average', name: 'Promedio %' }
                        ]
                    }
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }



    function renderAreaLineChart(groupedData, chartId) {
        const chartDiv = document.getElementById(chartId);
        const myChart = echarts.init(chartDiv);

        // Preparar los datos para la gráfica
        const xData = [];
        const yData = [];

        groupedData.forEach(item => {
            xData.push(item.fecha);  // Asegúrate de que `fecha` esté en tus datos
            yData.push(parseFloat(item.porcentaje_cumplimiento));
        });

        // Configuración de la gráfica de área
        const option = {
            title: {
                text: groupedData[0].nombre_indicador,
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: {
                    rotate: 45 // Para rotar las etiquetas de los ejes X si es necesario
                }
            },
            yAxis: {
                type: 'value',
                name: '% Cumplimiento'
            },
            series: [{
                name: 'Cumplimiento',
                type: 'line',
                data: yData,
                areaStyle: {}, // Esto crea el efecto de área
                smooth: true,  // Hace que la línea sea suave
                lineStyle: {
                    color: '#3388FF'  // Color de la línea
                },
                itemStyle: {
                    color: 'rgba(51, 136, 255, 0.3)'  // Color de fondo del área
                }
            }]
        };

        myChart.setOption(option);
    }

    function renderHorizontalBarChart(groupedData, chartId) {
        const chartDiv = document.getElementById(chartId);
        const myChart = echarts.init(chartDiv);

        const proveedores = [];
        const valoresIndicador = [];
        const cumplimientoMap = {};

        groupedData.forEach(item => {
            proveedores.push(item.razon_social);
            valoresIndicador.push(parseFloat(item.valor_indicador));
            cumplimientoMap[item.razon_social] = item.porcentaje_cumplimiento;
        });

        const colorPalette = [
            '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
            '#F44336', '#00BCD4', '#8BC34A', '#FFC107',
            '#E91E63', '#795548'
        ];

        const option = {
            title: {
                text: groupedData[0].nombre_indicador,
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: function (params) {
                    const data = params[0];
                    const proveedor = data.name;
                    const valor = data.value;
                    const porcentaje = cumplimientoMap[proveedor] || 0;

                    return `
                        <strong>${proveedor}</strong><br/>
                        Valor del Indicador: ${valor}<br/>
                        % Cumplimiento: ${porcentaje}%
                    `;
                }
            },
            xAxis: {
                type: 'value',
                name: 'Valor del Indicador',
                min: 0
            },
            yAxis: {
                type: 'category',
                data: proveedores,
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            series: [{
                name: 'Valor del Indicador',
                type: 'bar',
                data: valoresIndicador,
                itemStyle: {
                    color: function (params) {
                        return colorPalette[params.dataIndex % colorPalette.length];
                    }
                }
            }]
        };

        myChart.setOption(option);
    }

    function renderPieEdgeAlignChart(groupedData, chartId) {
        const chartDiv = document.getElementById(chartId);
        const myChart = echarts.init(chartDiv);

        // Preparar los datos para el gráfico
        const pieData = groupedData.map(item => ({
            name: item.razon_social,  // Nombre del proveedor
            value: parseFloat(item.valor_indicador)  // Valor del indicador como el valor del pie
        }));

        // Configuración del gráfico de pastel
        const option = {
            title: {
                text: groupedData[0].nombre_indicador,
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                },
                subtext: 'Distribución del Valor del Indicador',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            series: [
                {
                    name: 'Valor del Indicador',
                    type: 'pie',
                    radius: ['40%', '70%'],  // Esto hace que sea un gráfico de dona
                    center: ['50%', '50%'],
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'outside',
                            formatter: '{b}: {d}%'  // Muestra el nombre y el porcentaje
                        }
                    },
                    labelLine: {
                        normal: {
                            show: true,
                            length: 20,  // Longitud de la línea que conecta el texto con el gráfico
                            length2: 20  // Longitud de la línea final en el borde
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
    }

    // function renderDoughnutRoundedChart(groupedData, chartId) {
    //     const chartDiv = document.getElementById(chartId);
    //     const myChart = echarts.init(chartDiv);

    //     const pieData = groupedData.map(item => ({
    //         name: item.razon_social,
    //         value: parseFloat(item.valor_indicador)
    //     }));

    //     const option = {
    //         title: {
    //             text: groupedData[0].nombre_indicador,
    //             textStyle: {
    //                 fontSize: 14,
    //                 color: '#666'
    //             },
    //             subtext: 'Dona con Bordes Redondeados',
    //             left: 'center'
    //         },
    //         tooltip: {
    //             trigger: 'item',
    //             formatter: '{a} <br/>{b}: {c} ({d}%)'
    //         },
    //         series: [
    //             {
    //                 name: 'Valor del Indicador',
    //                 type: 'pie',
    //                 radius: ['50%', '70%'], // Dona
    //                 center: ['50%', '50%'],
    //                 avoidLabelOverlap: false,
    //                 itemStyle: {
    //                     borderRadius: 10, // Bordes redondeados
    //                     borderColor: '#fff',
    //                     borderWidth: 2
    //                 },
    //                 label: {
    //                     show: true,
    //                     position: 'outside',
    //                     formatter: '{b}: {d}%'
    //                 },
    //                 labelLine: {
    //                     show: true
    //                 },
    //                 data: pieData
    //             }
    //         ]
    //     };

    //     myChart.setOption(option);
    // }

    function renderDoughnutRoundedChart(groupedData, chartId) {
        const chartDiv = document.getElementById(chartId);
        const myChart = echarts.init(chartDiv);

        // Agrupar por proveedor y sumar ambos valores
        const proveedorDataMap = {};

        groupedData.forEach(item => {
            const proveedor = item.razon_social;
            const valor = parseFloat(item.valor_indicador) || 0;
            const cumplimiento = parseFloat(item.porcentaje_cumplimiento) || 0;

            if (!proveedorDataMap[proveedor]) {
                proveedorDataMap[proveedor] = {
                    valorTotal: 0,
                    cumplimientoTotal: 0
                };
            }

            proveedorDataMap[proveedor].valorTotal += valor;
            proveedorDataMap[proveedor].cumplimientoTotal += cumplimiento;
        });

        // Preparar datos para la gráfica
        const pieData = Object.keys(proveedorDataMap).map(proveedor => {
            const data = proveedorDataMap[proveedor];
            return {
                name: proveedor,
                value: data.valorTotal,
                cumplimiento: data.cumplimientoTotal
            };
        });

        const option = {
            title: {
                text: groupedData[0]?.nombre_indicador || 'Indicador',
                // subtext: 'Valores y Cumplimiento por Proveedor',
                left: 'center',
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: params => {
                    return `
                        <strong>${params.name}</strong><br/>
                        Valor Indicador: ${params.value.toFixed(2)}<br/>
                        % Cumplimiento: ${params.data.cumplimiento.toFixed(2)}%
                    `;
                }
            },
            series: [
                {
                    name: 'Indicadores',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    center: ['50%', '50%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: params => {
                            return `${params.name}\nValor: ${params.value.toFixed(1)}\nCumpl: ${params.data.cumplimiento.toFixed(1)}%`;
                        }
                    },
                    labelLine: {
                        show: true
                    },
                    data: pieData
                }
            ]
        };

        myChart.setOption(option);
        window.addEventListener('resize', () => myChart.resize());
    }






    // function renderLineChart(groupedData, chartId) {
    //     const chartDiv = document.getElementById(chartId);
    //     const myChart = echarts.init(chartDiv);

    //     // const proveedores = groupedData.map(item => item.razon_social);
    //     // const cumplimiento = groupedData.map(item => item.valor_indicador);

    //     const proveedores = [];
    //     const cumplimiento = [];

    //     groupedData.forEach(item => {
    //         proveedores.push(item.razon_social);
    //         cumplimiento.push(parseFloat(item.valor_indicador));
    //     });
    //     console.log("🚀 ~ renderLineChart ~ cumplimiento:", cumplimiento)

    //     const option = {
    //         title: {
    //             text: groupedData[0].nombre_indicador,
    //             textStyle: {
    //                 fontSize: 14,
    //                 color: '#666'
    //             },
    //             left: 'center'
    //         },
    //         tooltip: {
    //             trigger: 'axis'
    //         },
    //         xAxis: {
    //             type: 'category',
    //             data: proveedores,
    //             axisLabel: {
    //                 interval: 0,
    //                 rotate: 30
    //             }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name: '% Cumplimiento'
    //         },
    //         series: [
    //             {
    //                 data: cumplimiento,
    //                 type: 'line',
    //                 smooth: true,
    //                 symbol: 'circle',
    //                 symbolSize: 8,
    //                 lineStyle: {
    //                     width: 3
    //                 },
    //                 itemStyle: {
    //                     color: '#5470C6'
    //                 }
    //             }
    //         ]
    //     };

    //     myChart.setOption(option);
    // }


    function renderLineChart(groupedData, chartId) {
        const chartDiv = document.getElementById(chartId);
        const myChart = echarts.init(chartDiv);

        const proveedores = [];
        const valoresIndicador = [];
        const porcentajesCumplimiento = [];

        groupedData.forEach(item => {
            proveedores.push(item.razon_social);
            valoresIndicador.push(parseFloat(item.valor_indicador));
            porcentajesCumplimiento.push(parseFloat(item.porcentaje_cumplimiento));
        });

        const option = {
            title: {
                text: groupedData[0].nombre_indicador,
                textStyle: {
                    fontSize: 14,
                    color: '#666'
                },
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: 30,
                data: ['Valor Indicador', '% Cumplimiento']
            },
            xAxis: {
                type: 'category',
                data: proveedores,
                axisLabel: {
                    interval: 0,
                    rotate: 30
                }
            },
            yAxis: {
                type: 'value',
                name: 'Valores'
            },
            series: [
                {
                    name: 'Valor Indicador',
                    data: valoresIndicador,
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3
                    },
                    itemStyle: {
                        color: '#5470C6'
                    }
                },
                {
                    name: '% Cumplimiento',
                    data: porcentajesCumplimiento,
                    type: 'line',
                    smooth: true,
                    symbol: 'diamond',
                    symbolSize: 8,
                    lineStyle: {
                        width: 3,
                        type: 'dashed'
                    },
                    itemStyle: {
                        color: '#91CC75'
                    }
                }
            ]
        };

        myChart.setOption(option);
    }


    // Estilos CSS adicionales (pueden ir en tu archivo CSS)
    const style = document.createElement('style');
    style.textContent = `
        .no-data-message {
            text-align: center;
            padding: 20px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin: 20px;
            color: #666;
            font-size: 16px;
        }
        
        .chart-box {
            width: 48%;
            min-width: 400px;
            height: 400px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 15px;
            margin-bottom: 20px;
            display: inline-block;
        }
        
        .chart-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .chart {
            width: 100%;
            height: 350px;
        }
        
        @media (max-width: 768px) {
            .chart-box {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);

}

window.CampoId = null;
async function loadData(filtro) {
    // console.log('Cargando datos con:', year, mes, proveedor);
    try {
        let formData = new FormData();
        if (filtro === 'Año') {
            CampoId = 'year';
            formData.append("Filtro", filtro);
        } else if (filtro === 'Mes') {
            CampoId = 'mes';
            formData.append("Filtro", filtro);

        } else if (filtro === 'Proveedor') {
            CampoId = 'proveedor';
            formData.append("Filtro", filtro);
        }
        // formData.append("VentanaId", VentanaId);
        let response = await fetch($('#base_url').val() + 'torrecontrol/Filtro_indicadores', {
            method: "POST",
            body: formData
        });

        let data = await response.json();
        if (data) {
            let select = document.getElementById(`campo-${window.VENTANA}-${CampoId}`);
            select.innerHTML = ''; // Limpiar opciones anteriores
            select.innerHTML = '<option value="" selected>Seleccione un proveedor</option>'; // Opción por defecto

            data.forEach(item => {
                let option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.razon_social;
                select.appendChild(option);
            });

            // Agregar opción "Todos" al final
            let opcionTodos = document.createElement('option');
            opcionTodos.value = 'todos';
            opcionTodos.textContent = 'TODOS';
            select.appendChild(opcionTodos);

            select.style.display = '';
            select.value = ''; // Limpiar el valor seleccionado
        }

    } catch (error) {
        console.error("Error al obtener proveedores:", error);
    }
}