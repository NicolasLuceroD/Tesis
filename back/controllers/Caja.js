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

module.exports = {registrarAperturaCaja}