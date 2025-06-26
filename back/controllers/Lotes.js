const { connection } = require("../database/config");

const registrarLote = (req,res) => {
connection.query('INSERT INTO lotes SET ?', 
    {
       Id_producto : req.body.Id_producto,
       Id_compra : req.body.Id_compra,
       cantidad: req.body.cantidad,
       cantidad_disponible: req.body.cantidad_disponible,
       fecha_vencimiento: req.body.fecha_vencimiento || null,
    }, (error,results) => {
        if (error) throw error
        const insertId = results.insertId
        const nrolote = insertId.toString().padStart(5,'0');

        connection.query('UPDATE lotes SET nro_lote = ? WHERE Id_lote = ?',
            [nrolote, insertId], (error) => {
                if (error) throw error
                res.json({insertId})
            }
        )
    })
}



module.exports = {registrarLote}