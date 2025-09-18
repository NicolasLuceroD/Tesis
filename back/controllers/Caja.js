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
    const idApertura = req.params.idApertura; 

    //1) - Ventas del usuario: Suma todo lo que vendió ese usuario, siempre que no haya usado el metodo de pago con Id 5 (a credito),solo cuenta las ventas hechas desde la fecha de apertura de caja indicada
    //2) - Pagos de clientes: Suma todos los pagos de clientes, solo los que se hicieron desde la apertura de caja,
    //3) - Monto inicial de la caja: Toma el monto con el que se abrió la caja,
    //Resultado esperado: ventas + pagosclientes + monto_inicial
    connection.query(`
        SELECT
            IFNULL(
                (SELECT SUM(precioTotal_Venta)
                 FROM venta
                 WHERE Id_usuario = ?
                   AND Id_metodoPago != 5
                   AND fecha_registro >= (SELECT fecha_apertura 
                                          FROM aperturas_caja 
                                          WHERE Id_apertura = ?)), 0)
        +
            IFNULL(
                (SELECT SUM(monto)
                 FROM pagosclientes
                 WHERE fecha_pago >= (SELECT fecha_apertura 
                                      FROM aperturas_caja 
                                      WHERE Id_apertura = ?)), 0)
        +
            IFNULL(
                (SELECT monto_inicial
                 FROM aperturas_caja
                 WHERE Id_apertura = ?), 0) AS total_esperado`, [idUsuario, idApertura, idApertura, idApertura], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error al calcular total esperado' });
        }
        res.json({ total_esperado: results[0].total_esperado });
    });
};

module.exports = {registrarAperturaCaja,totalVentasDia,registrarCierreCaja}