const {connection} = require('../database/config.js')

const verClientes = (req,res) => {
    connection.query('SELECT * FROM clientes WHERE Estado = 1', (error,results)=> {
        if (error) throw error
        res.json(results)
    })
}

const crearClientes = (req,res) => {
    connection.query('INSERT INTO clientes SET ?',{
        Id_cliente: req.body.Id_cliente,
        nombre_cliente: req.body.nombre_cliente,
        apellido_cliente: req.body.apellido_cliente,
        telefono_cliente: req.body.telefono_cliente,
        domicilio_cliente: req.body.domicilio_cliente,
        documento_cliente: req.body.documento_cliente,
        monto_credito: req.body.monto_credito,
        limite_credito: req.body.limite_credito,
    }, (error,results) => {
        if (error) throw error
        res.json(results)
    })
}


const editarClientes = (req,res) => {
    const Id_cliente = req.params.Id_cliente
    const {nombre_cliente,apellido_cliente,telefono_cliente,domicilio_cliente,documento_cliente,monto_credito,limite_credito}= req.body
    connection.query(`UPDATE clientes SET
                        nombre_cliente='${nombre_cliente}',
                        apellido_cliente= '${apellido_cliente}',
                        telefono_cliente= '${telefono_cliente}',
                        domicilio_cliente='${domicilio_cliente}',
                        documento_cliente ='${documento_cliente}',
                        monto_credito = '${monto_credito}',
                        limite_credito= '${limite_credito}'

                        WHERE Id_cliente = ${Id_cliente}`,(error,results) => {
                        if(error) throw error
                        res.json(results)
                    })
}


const eliminarCliente = (req,res) => {
    const Id_cliente = req.params.Id_cliente
    connection.query('UPDATE clientes SET Estado = 0 WHERE Id_cliente= ' + Id_cliente,
        (error,results) => {
            if(error) throw error
            res.json(results)
        })
}

//PARA CREDITOS

const aumentarCredito = (req,res) => {
    console.log('Body recibido:', req.body);
    const Id_cliente = req.body.Id_cliente
    const monto_credito = req.body.monto_credito

    connection.query("UPDATE clientes SET monto_credito = monto_credito + ? WHERE Id_cliente = ?", [monto_credito, Id_cliente], (error,results) => {
        if (error) throw error
        res.json(results)
    })
}

const actualizarCredito = (req,res) => {
    const { id } = req.params
    const { monto_credito } = req.body

    connection.query(`UPDATE clientes SET monto_credito = ? WHERE Id_cliente = ?`, [monto_credito, id], (err,results) => {
        if (err) throw err
        res.json(results)
    })
}

const registrarmovimiento = (req,res) => {
    connection.query('INSERT INTO movimientosclientes SET ?', 
        {
            Id_cliente: req.body.Id_cliente,
            montoCredito: req.body.montoCredito,
            montoDebito: req.body.montoDebito,
            Saldo: req.body.Saldo,
            Id_venta: req.body.Id_venta
        },(error,results) => {
            if (error) throw error
            res.json(results)
        })
}

const verMovimientosClientes = (req, res) => {
  const Id_cliente = req.params.Id_cliente;
  const fechaSeleccionada = req.params.fechaSeleccionada;

  const query = `
   SELECT 
      mc.Id_movimientoCliente,
      mc.Id_cliente,
      mc.montoCredito AS Credito,
      mc.montoDebito AS Debito,
      mc.Saldo,
      mc.fechaRegistro,
      mc.Id_venta,
      p.nombre_producto,
      dv.cantidadVendida,
      dv.tipoVenta
    FROM movimientosclientes mc
    LEFT JOIN detalleventa dv ON dv.Id_venta = mc.Id_venta
    LEFT JOIN productos p ON p.Id_producto = dv.Id_producto
    WHERE mc.Id_cliente = ?
    AND DATE(mc.fechaRegistro) = ?
    ORDER BY mc.fechaRegistro ASC;
  `;

  connection.query(query, [Id_cliente,fechaSeleccionada], (error, results) => {
    if (error) throw error;

    // Agrupar productos por movimiento
    const movimientosMap = {};
    results.forEach(row => {
      if (!movimientosMap[row.Id_movimientoCliente]) {
        movimientosMap[row.Id_movimientoCliente] = {
          Id_movimientoCliente: row.Id_movimientoCliente,
          Id_cliente: row.Id_cliente,
          Credito: row.Credito,
          Debito: row.Debito,
          Saldo: row.Saldo,
          fechaRegistro: row.fechaRegistro,
          Id_venta: row.Id_venta,
          productos: []
        };
      }
      if (row.nombre_producto) {
        movimientosMap[row.Id_movimientoCliente].productos.push({
          nombre_producto: row.nombre_producto,
          cantidadVendida: row.cantidadVendida,
          tipoVenta: row.tipoVenta
        });
      }
    });

    // Convertir de objeto a array
    const movimientos = Object.values(movimientosMap);
    res.json(movimientos);
  });
};


module.exports={verClientes,crearClientes,editarClientes,eliminarCliente,aumentarCredito,actualizarCredito,registrarmovimiento,verMovimientosClientes}