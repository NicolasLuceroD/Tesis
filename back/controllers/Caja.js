const { connection } = require("../database/config");


const registrarAperturaCaja  = (req,res) => {
    connection.query('INSERT INTO aperturas_caja SET ?',
        {
            Id_apertura: req.body.Id_apertura,
            Id_usuario: req.body.Id_usuario,
            monto_inicial: req.body.monto_inicial
        },(error,results) => {
            if (error) throw error
            res.json('Ingreso de plata registrado con exito')
        })
}

module.exports = {registrarAperturaCaja}