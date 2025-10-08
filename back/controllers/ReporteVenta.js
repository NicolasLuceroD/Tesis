const {connection} = require('../database/config.js')

const verTotalVendido = (req,res) => {
    const {fechaInicio, fechaFin} = req.query
    connection.query(`SELECT 
                        SUM(precioTotal_Venta) AS total_vendido
                        FROM venta
                        WHERE DATE(fecha_registro) BETWEEN ? AND ?`,[fechaInicio, fechaFin],(error,results) => {
                            if(error) throw error
                            res.json(results)
                    })
}

const  verTotalVendidoClientes = (req,res) => {
    const {fechaInicio, fechaFin} = req.query
    connection.query(`SELECT 
                            c.nombre_cliente AS nombre_cliente,
                            SUM(v.precioTotal_Venta) AS total_vendido,
                            COUNT(v.Id_venta) AS cantidad_ventas
                        FROM venta v
                        INNER JOIN clientes c ON v.Id_cliente = c.Id_cliente
                        WHERE DATE(v.fecha_registro) BETWEEN ? AND ?
                        GROUP BY c.nombre_cliente
                        ORDER BY total_vendido DESC`,[fechaInicio,fechaFin],(error,results) => {
                            if(error) throw error
                            res.json(results)
                        })
}

const verTotalVendidoMetodos = (req,res) => {
    const {fechaInicio, fechaFin} = req.query
    connection.query(`SELECT 
                            m.nombre_metodopago AS metodo_pago,
                            SUM(v.precioTotal_Venta) AS total_vendido
                        FROM venta v
                        INNER JOIN metodopago m ON v.Id_metodoPago = m.Id_metodoPago
                        WHERE DATE(v.fecha_registro) BETWEEN ? AND ?
                        GROUP BY m.nombre_metodopago
                        ORDER BY total_vendido DESC`,[fechaInicio,fechaFin],(error,results) => {
                            if(error) throw error
                            res.json(results)
                        })
}

module.exports = {verTotalVendido,verTotalVendidoClientes,verTotalVendidoMetodos}