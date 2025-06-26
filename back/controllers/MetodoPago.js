const {connection} = require('../database/config.js')

const verMetodoPago = (req, res) => {
  connection.query('SELECT * FROM metodopago WHERE Estado = 1', (error, results) =>{
    if(error) throw error
    res.json(results)
  })
}

const crearMetodo = (req,res) => {
  connection.query('INSERT INTO metodopago SET ?',
    {
      Id_metodoPago: req.body.Id_metodoPago,
      nombre_metodopago: req.body.nombre_metodopago,
    }, (error,results) => {
      if (error) throw error
      res.json(results)
    }
  )
}

const editarMetodo = (req,res) => {
  const Id_metodoPago = req.params.Id_metodoPago
  const { nombre_metodopago } = req.body
  connection.query(`UPDATE metodopago SET
                                          nombre_metodopago = '${nombre_metodopago}'
                                          WHERE Id_metodoPago = ${Id_metodoPago}`,
                                          (error,results) => {
                                          if (error) throw error
                                          res.json('Metodo de pago editado')
                                          }
  )
}

const eliminarMetodo = (req,res) => {
  const Id_metodoPago = req.params.Id_metodoPago
  connection.query('UPDATE metodopago SET Estado = 0 WHERE Id_metodoPago=' + Id_metodoPago, (error,results) => {
    if (error) throw error
    res.json('Metodo editado con exito')
  }
)
}


module.exports = {verMetodoPago, crearMetodo, editarMetodo, eliminarMetodo}