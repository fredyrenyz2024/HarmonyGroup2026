window.VENTANA = null;
window.initScript = function (id) {
    window.VENTANA = id; // Asigna el ID de la ventana a la variable global
    // ListarContenedoresVacios();
    // alert("HOLA MUNDO DESDE ACA");
    // let campoFechaInicial = document.getElementById(`campo-${window.VENTANA}-fecha_inicial`);
    // let campoFechaFinal = document.getElementById(`campo-${window.VENTANA}-fecha_final`);

    // let hoy = new Date();
    // let anio = hoy.getFullYear();
    // let mes = hoy.getMonth() + 1; // Los meses van de 0 a 11
    // let dia = hoy.getDate();

    // // Formatear mes y día con dos dígitos
    // mes = mes < 10 ? `0${mes}` : mes;
    // let diaActual = dia < 10 ? `0${dia}` : dia;

    // // Establecer fechas en formato YYYY-MM-DD
    // let fechaInicio = `${anio}-${mes}-01`;
    // let fechaFin = `${anio}-${mes}-${diaActual}`;

    // // Asignar las fechas a los inputs
    // campoFechaInicial.value = fechaInicio;
    // campoFechaFinal.value = fechaFin;

    // // Obtener los valores de los inputs para enviar a la función
    // let fecha_inicial = campoFechaInicial.value;
    // let fecha_final = campoFechaFinal.value;

}