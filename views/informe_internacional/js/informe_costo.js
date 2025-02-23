document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  document.addEventListener("change", async (e) => {
    if (e.target.matches("#fecha_final") || e.target.matches("#fecha_final *")) {
      try {
        let data = new FormData();
        data.append("fecha_inicial", d.getElementById("fecha_inicial").value);
        data.append("fecha_final", d.getElementById("fecha_final").value);
        await fetch($("#id_url_ajax").val() + "informe_internacional/Informe_Costo", {
          method: "POST",
          cache: "no-cache",
          body: data,
        })
          .then((response) => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json();
          })
          .then(function (data) {
            console.log(data);
            cont = 0;
            let tbody = d.getElementById("tbl_informe_costo");
            tbody.innerHTML = "";
            if (data != "") {
              data.forEach((element) => {
                const fila = d.createElement("tr");
                const columnaCliente = d.createElement("td");
                columnaCliente.innerHTML = element.cliente_servicio;
                columnaCliente.style.borderBottom = "1px #F5F5F5 solid";
                columnaCliente.style.borderRight = "1px #F5F5F5 solid";
                columnaCliente.style.textAlign = "center";
                columnaCliente.style.fontWeight = "bold";

                const columnaNumeroDo = d.createElement("td");
                columnaNumeroDo.innerHTML = element.nro_do;
                columnaNumeroDo.style.borderBottom = "1px #F5F5F5 solid";
                columnaNumeroDo.style.borderRight = "1px #F5F5F5 solid";
                columnaNumeroDo.style.textAlign = "center";
                columnaNumeroDo.style.fontWeight = "bold";

                const columnaFechaDo = d.createElement("td");
                columnaFechaDo.innerHTML = element.fecha_do;
                columnaFechaDo.style.borderBottom = "1px #F5F5F5 solid";
                columnaFechaDo.style.borderRight = "1px #F5F5F5 solid";
                columnaFechaDo.style.textAlign = "center";

                const columnaFecha_Oferta_Comercial = d.createElement("td");
                columnaFecha_Oferta_Comercial.innerHTML = element.fecha_oferta_comercial;
                columnaFecha_Oferta_Comercial.style.borderBottom = "1px #F5F5F5 solid";
                columnaFecha_Oferta_Comercial.style.borderRight = "1px #F5F5F5 solid";
                columnaFecha_Oferta_Comercial.style.textAlign = "center";

                const columnaProveedor = d.createElement("td");
                columnaProveedor.innerHTML = element.proveedor;
                columnaProveedor.style.borderBottom = "1px #F5F5F5 solid";
                columnaProveedor.style.borderRight = "1px #F5F5F5 solid";
                columnaProveedor.style.textAlign = "center";

                const columnaConcepto = d.createElement("td");
                columnaConcepto.innerHTML = element.concepto;
                columnaConcepto.style.borderBottom = "1px #F5F5F5 solid";
                columnaConcepto.style.borderRight = "1px #F5F5F5 solid";
                columnaConcepto.style.textAlign = "center";

                const columnaMoneda = d.createElement("td");
                columnaMoneda.innerHTML = element.moneda;
                columnaMoneda.style.borderBottom = "1px #F5F5F5 solid";
                columnaMoneda.style.borderRight = "1px #F5F5F5 solid";
                columnaMoneda.style.textAlign = "center";

                const columnaCotizacion_Trm = d.createElement("td");
                columnaCotizacion_Trm.innerHTML = element.cotizacion_trm;
                columnaCotizacion_Trm.style.borderBottom = "1px #F5F5F5 solid";
                columnaCotizacion_Trm.style.borderRight = "1px #F5F5F5 solid";
                columnaCotizacion_Trm.style.textAlign = "center";

                const columnaValor_Cotizacion = d.createElement("td");
                columnaValor_Cotizacion.innerHTML = element.valor_cotizacion;
                columnaValor_Cotizacion.style.borderBottom = "1px #F5F5F5 solid";
                columnaValor_Cotizacion.style.borderRight = "1px #F5F5F5 solid";
                columnaValor_Cotizacion.style.textAlign = "center";

                const columnaNumero_Factura = d.createElement("td");
                columnaNumero_Factura.innerHTML = element.nro_factura;
                columnaNumero_Factura.style.borderBottom = "1px #F5F5F5 solid";
                columnaNumero_Factura.style.borderRight = "1px #F5F5F5 solid";
                columnaNumero_Factura.style.textAlign = "center";

                const columnaFecha_Factura_Cliente = d.createElement("td");
                columnaFecha_Factura_Cliente.innerHTML = element.fecha_factura;
                columnaFecha_Factura_Cliente.style.borderBottom = "1px #F5F5F5 solid";
                columnaFecha_Factura_Cliente.style.borderRight = "1px #F5F5F5 solid";
                columnaFecha_Factura_Cliente.style.textAlign = "center";

                const columnaValor = d.createElement("td");
                columnaValor.innerHTML = element.valor;
                columnaValor.style.borderBottom = "1px #F5F5F5 solid";
                columnaValor.style.borderRight = "1px #F5F5F5 solid";
                columnaValor.style.textAlign = "center";

                const columnaMoneda_Factura = d.createElement("td");
                columnaMoneda_Factura.innerHTML = element.moneda_factura;
                columnaMoneda_Factura.style.borderBottom = "1px #F5F5F5 solid";
                columnaMoneda_Factura.style.borderRight = "1px #F5F5F5 solid";
                columnaMoneda_Factura.style.textAlign = "center";

                const columnaObservacion = d.createElement("td");
                columnaObservacion.innerHTML = element.observaciones;
                columnaObservacion.style.borderBottom = "1px #F5F5F5 solid";
                columnaObservacion.style.borderRight = "1px #F5F5F5 solid";
                columnaObservacion.style.textAlign = "center";

                fila.appendChild(columnaCliente);
                fila.appendChild(columnaNumeroDo);
                fila.appendChild(columnaFechaDo);
                fila.appendChild(columnaFecha_Oferta_Comercial);
                fila.appendChild(columnaProveedor);
                fila.appendChild(columnaConcepto);
                fila.appendChild(columnaMoneda);
                fila.appendChild(columnaCotizacion_Trm);
                fila.appendChild(columnaValor_Cotizacion);
                fila.appendChild(columnaNumero_Factura);
                fila.appendChild(columnaFecha_Factura_Cliente);
                fila.appendChild(columnaValor);
                fila.appendChild(columnaMoneda_Factura);
                fila.appendChild(columnaObservacion);
                // Rendreizar la tabla
                tbody.appendChild(fila);
              });

              console.log(data);
            } else {
              tbody.innerHTML = "";
              const fila = d.createElement("tr");
              const columnaDatos = d.createElement("td");
              columnaDatos.setAttribute("colspan", "14");
              columnaDatos.classList.add("text-center");
              columnaDatos.textContent = "No hay resultados de la operación";
              fila.appendChild(columnaDatos);
              // Rendreizar la tabla
              tbody.appendChild(fila);
            }
          })
          .catch((error) => {
            alert(error);
          });
      } catch (error) {}
    }
  });
});
