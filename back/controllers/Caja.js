const { connection } = require("../database/config");


const registrarAperturaCaja  = (req,res) => {
    connection.query('INSERT INTO aperturas_caja SET ?',
        {
            Id_usuario: req.body.id_usuario,
            monto_inicial: req.body.monto_inicial
        },(error,results) => {
            if (error)  {
                console.error(error)
                return res.status(500).json({error: 'Error  al registrar apertura de caja'})
            }
            res.json({message: 'Ingreso de plata registrado con exito', Id_apertura: results.insertId})
        })
}

const registrarCierreCaja = (req,res)  => {

    const { Id_apertura, monto_esperado, monto_ventas, monto_real, diferencia } = req.body;
    connection.query('INSERT INTO cierres_caja SET ?',
        {
            Id_apertura: Id_apertura,
            monto_ventas,
            monto_esperado: monto_esperado,
            monto_real: monto_real,
            diferencia
        },(error,results) => {
            if(error)  {
                console.error(error)
                return res.status(500).json({ error: 'Error al registrar el cierre de turno' });
            }
            res.json({ message: 'Cierre de turno registrado con éxito', Id_cierre: results.insertId })
        }
    )
}

const totalVentasDia = (req, res) => {
    const idUsuario = req.params.idUsuario;
    connection.query( `SELECT
                                IFNULL((SELECT SUM(precioTotal_Venta)
                                        FROM venta
                                        WHERE DATE(fecha_registro) = CURDATE()
                                        AND Id_usuario = ?
                                        AND Id_metodoPago != 5), 0)
                            +
                                IFNULL((SELECT SUM(monto)
                                        FROM pagosclientes
                                        WHERE DATE(fecha_pago) = CURDATE()), 0)
                            +
                                IFNULL((SELECT monto_inicial
                                        FROM aperturas_caja
                                        WHERE Id_usuario = ?
                                        AND DATE(fecha_apertura) = CURDATE()), 0) AS total_esperado`, [idUsuario,idUsuario], (error, results) => {
                        if (error) {
                            console.error(error);
                            return res.status(500).json({ error: 'Error al calcular total esperado' });
                        }
                        res.json({ total_esperado: results[0].total_esperado });
    });
};

module.exports = {registrarAperturaCaja,totalVentasDia,registrarCierreCaja}