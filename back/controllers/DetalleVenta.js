const { connection } = require("../database/config");

const registrarDetalleVenta = (req,res) => {
    connection.query('INSERT INTO detalleventa SET ?',
        {
            
        }
    )
}


module.exports = {registrarDetalleVenta}