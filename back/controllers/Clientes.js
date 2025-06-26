const {connection} = require('../database/config.js')

const verClientes = (req,res) => {
    connection.query('SELECT * FROM clientes WHERE Estado = 1', (error,results)=> {
        if (error) throw error
        res.json(results)
    })
}

const crearClientes = (req,res) => {
    connection.query('INSERT INTO clientes SET ?',{
        Id_cliente: req.body.Id_cliente,
        nombre_cliente: req.body.nombre_cliente,
        apellido_cliente: req.body.apellido_cliente,
        telefono_cliente: req.body.telefono_cliente,
        domicilio_cliente: req.body.domicilio_cliente,
        documento_cliente: req.body.documento_cliente,
        monto_credito: req.body.monto_credito,
        limite_credito: req.body.limite_credito,
    }, (error,results) => {
        if (error) throw error
        res.json(results)
    })
}


const editarClientes = (req,res) => {
    const Id_cliente = req.params.Id_cliente
    const {nombre_cliente,apellido_cliente,telefono_cliente,domicilio_cliente,documento_cliente,monto_credito,limite_credito}= req.body
    connection.query(`UPDATE clientes SET
                        nombre_cliente='${nombre_cliente}',
                        apellido_cliente= '${apellido_cliente}',
                        telefono_cliente= '${telefono_cliente}',
                        domicilio_cliente='${domicilio_cliente}',
                        documento_cliente ='${documento_cliente}',
                        monto_credito = '${monto_credito}',
                        limite_credito= '${limite_credito}'

                        WHERE Id_cliente = ${Id_cliente}`,(error,results) => {
                        if(error) throw error
                        res.json(results)
                    })
}


const eliminarCliente = (req,res) => {
    const Id_cliente = req.params.Id_cliente
    connection.query('UPDATE clientes SET Estado = 0 WHERE Id_cliente= ' + Id_cliente,
        (error,results) => {
            if(error) throw error
            res.json(results)
        })
}



module.exports={verClientes,crearClientes,editarClientes,eliminarCliente}