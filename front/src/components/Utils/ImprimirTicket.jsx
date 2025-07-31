import Swal from 'sweetalert2';

export const imprimirTicket = ({carrito, clientes, clienteSeleccionado, metodospago, metodopagoseleccionado, formatCurrency}) => {
  const logoUrl = 'LogoNobel.jpg'; // o la ruta correcta
  const cliente = clientes.find(c => c.Id_cliente === Number(clienteSeleccionado))?.nombre_cliente || 'Consumidor Final';
  const metodoPagoNombre = metodospago.find(m => m.Id_metodoPago === Number(metodopagoseleccionado))?.nombre_metodopago || '';
  const totalParaTodo = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  let ticketWindow = window.open('', 'PRINT', 'height=600,width=400');

  ticketWindow.document.write(`
     <html>
      <head>
        <title>Ticket</title>
       <style>
        body {
          font-family: monospace;
          font-size: 12px;
          color: black;
          background: white;
          margin: 10px;
        }
        .ticket-container {
          text-align: center;
        }
        .logo {
          width: 80px;
          margin: 0 auto 10px;
        }
        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: bold;
          text-transform: uppercase;
        }
        p {
          margin: 2px 0;
          font-size: 11px;
        }
        hr {
          border: none;
          border-top: 1px dashed black;
          margin: 8px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 5px;
        }
        th, td {
          padding: 3px 5px;
          font-size: 11px;
          text-align: left; /* por defecto todo a la izquierda */
        }
        th {
          border-bottom: 1px dashed black;
          text-transform: uppercase;
        }
        td.qty {
          width: 10%;
        }
        td.product {
          width: 55%;
        }
        th.price, th.total {
          text-align: left;
          padding-left: 10px;
        }
        td.price, td.total {
          text-align: left;
          padding-left: 10px;
          width: 17.5%;
          white-space: nowrap; /* evita quiebre de números */
        }
        td.total {
          font-weight: normal;
        }
        .total-final {
          font-size: 11px;
          font-weight: bold;
          text-align: right;
          margin-top: 10px;
          padding-top: 5px;
        }
        .thank-you {
          margin-top: 15px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .disclaimer {
          font-size: 9px;
          margin-top: 5px;
          color: #555;
        }
      </style>
      </head>
      <body>
        <div class="ticket-container">
          <img class="logo" src="${logoUrl}" alt="Logo Farmacia" />
          <h3>FARMACIA NOBEL</h3>
          <p>Cel: 3812000296</p>
          <p>Usuario: ${localStorage.getItem("nombreUsuario") || 'Cajero'}</p>
          <p>${new Date().toLocaleString()}</p>
          <hr />
          <p>Cliente: ${cliente}</p>
          <p>Método de Pago: ${metodoPagoNombre}</p>
          <hr />
          <table>
            <thead>
              <tr>
                <th class="qty">Cant</th>
                <th class="product">Artículo</th>
                <th class="price">Precio</th>
                <th class="total">Total</th>
              </tr>
            </thead>
            <tbody>
              ${carrito.map(item => {
                const nombreItem = item.nombre_producto || "Producto";
                const cantidad = item.cantidad || 1;
                const precioUnitario = parseFloat(item.precio || 0);
                const precioTotal = cantidad * precioUnitario;
                return `
                  <tr>
                    <td class="qty">${cantidad}</td>
                    <td class="product">${nombreItem}</td>
                    <td class="price">${formatCurrency(precioUnitario)}</td>
                    <td class="total">${formatCurrency(precioTotal)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
          <div class="total-final">TOTAL: ${formatCurrency(totalParaTodo)}</div>
          <div class="thank-you">¡Gracias por su compra!</div>
          <div class="disclaimer">NO VÁLIDO COMO FACTURA</div>
        </div>
      </body>
    </html>
  `);

  ticketWindow.document.close();
  ticketWindow.focus();

  ticketWindow.onload = () => {
    ticketWindow.print();
    ticketWindow.close();
    Swal.fire({
      icon: 'success',
      title: 'Ticket impreso',
      timer: 1500,
      showConfirmButton: false,
    });
  };
};
