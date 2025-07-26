const { connection } = require("../database/config");

const registrarVenta = (req, res) => {
  console.log("Body recibido en registrarVenta:", req.body);

  const { precioTotal_Venta, Id_cliente, Id_usuario, Id_metodoPago, productos} = req.body;

  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: 'No se recibieron productos para la venta' });
  }

  const ventaData = { precioTotal_Venta, Id_cliente, Id_usuario, Id_metodoPago};

  connection.query('INSERT INTO venta SET ?', ventaData, (error, results) => {
    if (error) { console.error('Error al registrar venta:', error);
      return res.status(500).json({ error: 'Error al registrar la venta' });
    }

    const Id_venta = results.insertId;

    const tareas = productos.map(producto => {
      const { Id_producto, Id_lote, cantidad} = producto;

      if (!Id_producto || !Id_lote || !cantidad) {
        return Promise.reject(new Error('Faltan datos en producto'));
      }

      const detalle = { Id_venta, Id_producto, cantidadVendida: cantidad};

      return new Promise((resolve, reject) => {
        connection.query('INSERT INTO detalleventa SET ?', detalle, (error) => {
          if (error) {
            console.error('Error insertando detalleventa:', error);
            return reject(error);
          }

          connection.query(
            'UPDATE lotes SET cantidad_disponible = cantidad_disponible - ? WHERE Id_lote = ?',
            [cantidad, Id_lote],
            (error2) => {
              if (error2) {
                console.error('Error actualizando lote:', error2);
                return reject(error2);
              }
              resolve();
            }
          );
        });
      });
    });

    Promise.all(tareas)
      .then(() => {
        res.status(200).json({
          mensaje: 'Venta realizada con éxito',
          Id_venta
        });
      })
      .catch((err) => {
        console.error('Error al registrar detalle o restar stock:', err);
        res.status(500).json({ error: 'Error al registrar detalle o actualizar stock' });
      });
  });
};

module.exports = { registrarVenta };
