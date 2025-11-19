const {connection} = require('../database/config.js')

const verMovimientosUsuarios = (req,res) => {
    const fechaSeleccionada = req.params.fechaSeleccionada
    connection.query(`SELECT 
                            u.nombre_usuario AS usuario,
                            a.Id_apertura,
                            a.fecha_apertura,
                            c.fecha_cierre,
                            a.monto_inicial,
                            c.monto_esperado,
                            c.monto_real,
                            c.diferencia
                        FROM aperturas_caja a
                        INNER JOIN cierres_caja c ON c.Id_apertura = a.Id_apertura
                        INNER JOIN usuarios u ON u.id_usuario = a.Id_usuario
                        WHERE DATE(a.fecha_apertura) = ?
                        ORDER BY a.fecha_apertura DESC`,[fechaSeleccionada],(error,results) => {
                            if (error) throw error
                            res.json(results)
                        })
}

module.exports = { verMovimientosUsuarios }