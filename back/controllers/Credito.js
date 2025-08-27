const {connection} = require('../database/config.js')


const movimientosclientes = (req,res) =>{
   console.log('Body recibido movimiento:', req.body);
  connection.query("INSERT INTO movimientosclientes SET ?",{
    Id_cliente: req.body.Id_cliente,
    montoCredito: req.body.montoCredito,
    montoDebito: req.body.montoDebito,
    Saldo: req.body.Saldo,
    Id_venta: req.body.Id_venta
  },(error,results)=>{
    if(error) throw error
    res.json(results)
  })
}

module.exports = {movimientosclientes}