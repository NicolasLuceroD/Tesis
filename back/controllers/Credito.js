const {connection} = require('../database/config.js')


const movimientosclientes = (req,res) =>{
   console.log('Body recibido movimiento:', req.body);
  connection.query("INSERT INTO movimientosclientes SET ?",{
    Id_cliente: req.body.Id_cliente,
    montoCredito: req.body.montoCredito,
    montoDebito: req.body.montoDebito,
    Saldo: req.body.Saldo,
    Id_venta: req.body.Id_venta
  },(error,results)=>{
    if(error) throw error
    res.json(results)
  })
}

const verElCreditoCompleto = (req, res) => {
  const Id_cliente = req.params.Id_cliente;
  connection.query(
    `SELECT v.Id_venta, v.precioTotal_Venta, v.fecha_registro, v.faltaPagar, 
            c.Id_cliente, c.nombre_cliente, c.monto_credito, 
            mp.nombre_metodopago, c.telefono_cliente, c.domicilio_cliente,
            p.Id_producto, p.nombre_producto, p.precio_caja, 
            dv.cantidadVendida, dv.Id_detalleventa, dv.tipoVenta, dv.precioAplicado,
                    u.nombre_usuario
            FROM venta v
            JOIN clientes c ON v.Id_cliente = c.Id_cliente
            JOIN detalleventa dv ON v.Id_venta = dv.Id_venta
            JOIN productos p ON dv.Id_producto = p.Id_producto
            JOIN metodopago mp ON v.Id_metodoPago = mp.Id_metodoPago
            JOIN usuarios u ON v.Id_usuario = u.Id_usuario
            WHERE mp.nombre_metodopago = 'A CREDITO'
              AND c.Id_cliente = ?
              AND v.faltaPagar > 0`,
    [Id_cliente],
    (error, results) => {
      if (error) {
        console.error('Error al obtener las ventas del cliente', error);
        res.status(500).send('Error interno del servidor al obtener las ventas');
        return;
      }

      // Agrupar productos por Id_venta
      const ventasAgrupadas = results.reduce((acc, item) => {
        if (!acc[item.Id_venta]) {
          acc[item.Id_venta] = {
            Id_venta: item.Id_venta,
            precioTotal_Venta: item.precioTotal_Venta,
            fecha_registro: item.fecha_registro,
            faltaPagar: item.faltaPagar,
            cliente: {
              Id_cliente: item.Id_cliente,
              nombre_cliente: item.nombre_cliente,
              monto_credito: item.monto_credito,
              domicilio_cliente: item.domicilio_cliente,
              telefono_cliente: item.telefono_cliente,
            },
            metodoPago: {
              nombre_metodopago: item.nombre_metodopago,
            },
            usuario: {
              nombre_usuario: item.nombre_usuario,
            },
            productos: [],
          };
        }

        // Verificar si el producto ya está agregado
        const productoExistente = acc[item.Id_venta].productos.find(
          (producto) => producto.Id_producto === item.Id_producto
        );
        if (productoExistente) {
          // Si ya existe, sumar cantidad
          productoExistente.cantidadVendida += item.cantidadVendida;
        } else {
          // Si no existe, lo agregamos
          acc[item.Id_venta].productos.push({
            Id_producto: item.Id_producto,
            nombre_producto: item.nombre_producto,
            precio_caja: item.precio_caja,
            cantidadVendida: item.cantidadVendida,
            Id_detalleventa: item.Id_detalleventa,
            precioAplicado: item.precioAplicado,
            tipoVenta: item.tipoVenta
          });
        }
        return acc;
      }, {});

      // Convertir el objeto agrupado en array
      const ventas = Object.values(ventasAgrupadas);
      res.json(ventas);
    }
  );
};

const registrarPago = (req,res) => {
  connection.query('INSERT INTO pagosclientes SET ?',   
  {
    Id_pago: req.body.Id_pago,
    Id_cliente: req.body.Id_cliente,
    Id_venta: req.body.Id_venta,
    Id_metodoPago: req.body.Id_metodoPago,
    Id_usuario: req.body.Id_usuario,
    monto: req.body.monto,
    observacion: 'test'
  }, (error,results) => {
    if (error) throw error
    res.json(results)
  })
} 


module.exports = {movimientosclientes, verElCreditoCompleto,registrarPago}