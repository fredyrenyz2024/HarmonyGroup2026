document.addEventListener("DOMContentLoaded", async (e) => {
  e.preventDefault();
  document.addEventListener("change", async (e) => {
    if (e.target.matches("#fecha_final") || e.target.matches("#fecha_final *")) {
      try {
        let data = new FormData();
        data.append("fecha_inicial", d.getElementById("fecha_inicial").value);
        data.append("fecha_final", d.getElementById("fecha_final").value);
        await fetch($("#id_url_ajax").val() + "informe_internacional/Informe_Venta", {
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
            let tbody = d.getElementById("tbl_informe_venta");
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

                const columnaTipo_Operacion = d.createElement("td");
                columnaTipo_Operacion.innerHTML = element.tipo_operacion;
                columnaTipo_Operacion.style.borderBottom = "1px #F5F5F5 solid";
                columnaTipo_Operacion.style.borderRight = "1px #F5F5F5 solid";
                columnaTipo_Operacion.style.textAlign = "center";

                const columnaTipo_Transporte = d.createElement("td");
                columnaTipo_Transporte.innerHTML = element.tipo_transporte;
                columnaTipo_Transporte.style.borderBottom = "1px #F5F5F5 solid";
                columnaTipo_Transporte.style.borderRight = "1px #F5F5F5 solid";
                columnaTipo_Transporte.style.textAlign = "center";

                const columnaTipo_Carga = d.createElement("td");
                columnaTipo_Carga.innerHTML = element.tipo_carga;
                columnaTipo_Carga.style.borderBottom = "1px #F5F5F5 solid";
                columnaTipo_Carga.style.borderRight = "1px #F5F5F5 solid";
                columnaTipo_Carga.style.textAlign = "center";

                const columnaContenedor = d.createElement("td");
                columnaContenedor.innerHTML = element.contenedor;
                columnaContenedor.style.borderBottom = "1px #F5F5F5 solid";
                columnaContenedor.style.borderRight = "1px #F5F5F5 solid";
                columnaContenedor.style.textAlign = "center";

                const columnaTara = d.createElement("td");
                columnaTara.innerHTML = element.tara;
                columnaTara.style.borderBottom = "1px #F5F5F5 solid";
                columnaTara.style.borderRight = "1px #F5F5F5 solid";
                columnaTara.style.textAlign = "center";

                const columnaCantidad = d.createElement("td");
                columnaCantidad.innerHTML = element.cantidad;
                columnaCantidad.style.borderBottom = "1px #F5F5F5 solid";
                columnaCantidad.style.borderRight = "1px #F5F5F5 solid";
                columnaCantidad.style.textAlign = "center";

                const columnaPrefijo_Tipo_Transporte = d.createElement("td");
                columnaPrefijo_Tipo_Transporte.innerHTML = element.prefijo_tipo_transporte;
                columnaPrefijo_Tipo_Transporte.style.borderBottom = "1px #F5F5F5 solid";
                columnaPrefijo_Tipo_Transporte.style.borderRight = "1px #F5F5F5 solid";
                columnaPrefijo_Tipo_Transporte.style.textAlign = "center";

                const columnaMoneda = d.createElement("td");
                columnaMoneda.innerHTML = element.tipo_moneda;
                columnaMoneda.style.borderBottom = "1px #F5F5F5 solid";
                columnaMoneda.style.borderRight = "1px #F5F5F5 solid";
                columnaMoneda.style.textAlign = "center";

                const columnaTrm_Do = d.createElement("td");
                columnaTrm_Do.innerHTML = element.trm_do;
                columnaTrm_Do.style.borderBottom = "1px #F5F5F5 solid";
                columnaTrm_Do.style.borderRight = "1px #F5F5F5 solid";
                columnaTrm_Do.style.textAlign = "center";

                const columnaFecha_Oferta_Comercial = d.createElement("td");
                columnaFecha_Oferta_Comercial.innerHTML = element.fecha_oferta_comercial;
                columnaFecha_Oferta_Comercial.style.borderBottom = "1px #F5F5F5 solid";
                columnaFecha_Oferta_Comercial.style.borderRight = "1px #F5F5F5 solid";
                columnaFecha_Oferta_Comercial.style.textAlign = "center";

                const columnaValor_Oferta_Comercial = d.createElement("td");
                columnaValor_Oferta_Comercial.innerHTML = element.valor_oferta_comercial;
                columnaValor_Oferta_Comercial.style.borderBottom = "1px #F5F5F5 solid";
                columnaValor_Oferta_Comercial.style.borderRight = "1px #F5F5F5 solid";
                columnaValor_Oferta_Comercial.style.textAlign = "center";

                const columnaFactura_Trm = d.createElement("td");
                columnaFactura_Trm.innerHTML = element.factura_trm;
                columnaFactura_Trm.style.borderBottom = "1px #F5F5F5 solid";
                columnaFactura_Trm.style.borderRight = "1px #F5F5F5 solid";
                columnaFactura_Trm.style.textAlign = "center";

                const columnaNumero_Factura_Cliente = d.createElement("td");
                columnaNumero_Factura_Cliente.innerHTML = element.nro_factura_cliente;
                columnaNumero_Factura_Cliente.style.borderBottom = "1px #F5F5F5 solid";
                columnaNumero_Factura_Cliente.style.borderRight = "1px #F5F5F5 solid";
                columnaNumero_Factura_Cliente.style.textAlign = "center";

                const columnaFecha_Factura_Cliente = d.createElement("td");
                columnaFecha_Factura_Cliente.innerHTML = element.fecha_factura_cliente;
                columnaFecha_Factura_Cliente.style.borderBottom = "1px #F5F5F5 solid";
                columnaFecha_Factura_Cliente.style.borderRight = "1px #F5F5F5 solid";
                columnaFecha_Factura_Cliente.style.textAlign = "center";

                const columnaFactura_Preforma = d.createElement("td");
                columnaFactura_Preforma.innerHTML = element.factura_preforma;
                columnaFactura_Preforma.style.borderBottom = "1px #F5F5F5 solid";
                columnaFactura_Preforma.style.borderRight = "1px #F5F5F5 solid";
                columnaFactura_Preforma.style.textAlign = "center";

                const columnaFactura_Subtotal = d.createElement("td");
                columnaFactura_Subtotal.innerHTML = element.factura_subtotal;
                columnaFactura_Subtotal.style.borderBottom = "1px #F5F5F5 solid";
                columnaFactura_Subtotal.style.borderRight = "1px #F5F5F5 solid";
                columnaFactura_Subtotal.style.textAlign = "center";

                const columnaFactura_Iva = d.createElement("td");
                columnaFactura_Iva.innerHTML = element.factura_iva;
                columnaFactura_Iva.style.borderBottom = "1px #F5F5F5 solid";
                columnaFactura_Iva.style.borderRight = "1px #F5F5F5 solid";
                columnaFactura_Iva.style.textAlign = "center";

                const columnaFactura_Total = d.createElement("td");
                columnaFactura_Total.innerHTML = element.factura_total;
                columnaFactura_Total.style.borderBottom = "1px #F5F5F5 solid";
                columnaFactura_Total.style.borderRight = "1px #F5F5F5 solid";
                columnaFactura_Total.style.textAlign = "center";

                const columnaValor_SobreCosto = d.createElement("td");
                columnaValor_SobreCosto.innerHTML = element.valor_sobrecosto;
                columnaValor_SobreCosto.style.borderBottom = "1px #F5F5F5 solid";
                columnaValor_SobreCosto.style.borderRight = "1px #F5F5F5 solid";
                columnaValor_SobreCosto.style.textAlign = "center";

                fila.appendChild(columnaCliente);
                fila.appendChild(columnaNumeroDo);
                fila.appendChild(columnaFechaDo);
                fila.appendChild(columnaTipo_Operacion);
                fila.appendChild(columnaTipo_Transporte);
                fila.appendChild(columnaTipo_Carga);
                fila.appendChild(columnaContenedor);
                fila.appendChild(columnaTara);
                fila.appendChild(columnaCantidad);
                fila.appendChild(columnaPrefijo_Tipo_Transporte);
                fila.appendChild(columnaMoneda);
                fila.appendChild(columnaTrm_Do);
                fila.appendChild(columnaFecha_Oferta_Comercial);
                fila.appendChild(columnaValor_Oferta_Comercial);
                fila.appendChild(columnaFactura_Trm);
                fila.appendChild(columnaNumero_Factura_Cliente);
                fila.appendChild(columnaFecha_Factura_Cliente);
                fila.appendChild(columnaFactura_Preforma);
                fila.appendChild(columnaFactura_Subtotal);
                fila.appendChild(columnaFactura_Iva);
                fila.appendChild(columnaFactura_Total);
                fila.appendChild(columnaValor_SobreCosto);

                // Rendreizar la tabla
                tbody.appendChild(fila);
              });

              console.log(data);
            } else {
              tbody.innerHTML = "";
              const fila = d.createElement("tr");
              const columnaDatos = d.createElement("td");
              columnaDatos.setAttribute("colspan", "22");
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
