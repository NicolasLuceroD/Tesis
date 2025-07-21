const {connection} = require('../database/config.js')

const verTotalDrogueria = (req,res) => {
    const { fechaInicio, fechaFin} = req.query
    connection.query(`SELECT 
                        d.nombre_drogueria,
                        COUNT(*) AS cantidad_compras,
                        SUM(c.Total) AS total_comprado
                        FROM compra c
                        JOIN droguerias d ON c.Id_drogueria = d.Id_drogueria
                        WHERE DATE (c.Fecha_registro) BETWEEN ? AND ?
                        AND c.Estado = 1
                        GROUP BY d.nombre_drogueria
                        ORDER BY total_comprado DESC`, 
                            [fechaInicio, fechaFin], (error,results) => {
                            if (error) throw error
                            res.json(results)
                        })
}

const verMontoTotalComprado = (req,res) => {
    const { fechaInicio, fechaFin } = req.query
    connection.query(`SELECT 
                        SUM(c.Total) AS total_comprado
                        FROM compra c
                        JOIN droguerias d ON c.Id_drogueria = d.Id_drogueria
                        WHERE DATE (c.Fecha_registro) BETWEEN ? AND ?
                        AND c.Estado = 1`,[fechaInicio,fechaFin],(error,results) => {
                            if (error) throw error
                            res.json(results)
                        })
}

const verTopProductosComprados  = (req,res) => {
    const { fechaInicio, fechaFin } = req.query
    connection.query(`SELECT 
                        p.nombre_producto,
                        SUM(dc.Cantidad) AS total_cantidad
                        FROM detallecompra dc
                        JOIN productos p ON dc.Id_producto = p.Id_producto
                        WHERE DATE (dc.Fecha_registro) BETWEEN ? AND ?
                        AND dc.Estado = 1
                        GROUP BY p.nombre_producto
                        ORDER BY total_cantidad DESC
                        LIMIT 5`, [fechaInicio, fechaFin], (error,results) => {
                            if (error) throw error
                            res.json(results)
                        })
}

const verPromedioGasto = (req,res) => {
    const { fechaInicio, fechaFin } = req.query
    connection.query(`SELECT 
                        AVG(c.Total) AS promedio_gasto
                        FROM compra c
                        WHERE DATE(c.Fecha_registro) BETWEEN ? AND ?
                        AND c.Estado = 1`, [fechaInicio, fechaFin], (error,results) => {
                            if (error) throw error
                            res.json(results)
                        })
}

module.exports = {verTotalDrogueria,verMontoTotalComprado,verTopProductosComprados,verPromedioGasto}