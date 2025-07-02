const {connection} = require('../database/config.js')

const verProductos = (req,res) => {
    connection.query('SELECT p.*, c.nombre_categoria FROM productos p JOIN categoria c ON p.Id_categoria = c.Id_categoria WHERE p.Estado = 1',
        (error,results) => {
        if(error) throw error
        res.json(results)
    })
}

const crearProductos = (req,res) => {
    connection.query('INSERT INTO productos SET ?', {
        Id_producto: req.body.Id_producto,
        nombre_producto: req.body.nombre_producto,
        precio_costo: req.body.precio_costo,
        precio_unitario: req.body.precio_unitario,
        precio_tira: req.body.precio_tira,
        precio_caja: req.body.precio_caja,
        codigobarras_producto : req.body.codigobarras_producto,
        inventario_minimo: req.body.inventario_minimo,
        Id_categoria: req.body.Id_categoria,
        Estado : 1
    }, (error,results) => {
        if (error) throw error
        res.json(results)
    })
}

const editarProducto = (req, res) => {
    const Id_producto = req.params.Id_producto
    const {nombre_producto,precio_unitario,precio_costo,precio_tira,precio_caja,codigobarras_producto,inventario_minimo, Id_categoria} = req.body;
    connection.query(
      `UPDATE productos SET 
                          nombre_producto='${nombre_producto}',
                          precio_unitario='${precio_unitario}',
                          precio_costo='${precio_costo}',
                          precio_tira='${precio_tira}',
                          precio_caja='${precio_caja}',
                          codigobarras_producto='${codigobarras_producto}',
                          inventario_minimo='${inventario_minimo}',
                          Id_categoria='${Id_categoria}'
                          WHERE Id_producto = ${Id_producto}`
                          ,(error, results)=>{
                                 if(error)throw error
                                  res.json('producto editado')
                              }
                          )
  };
  

const eliminarProductos = (req,res) => {
    const Id_producto = req.params.Id_producto
    connection.query('UPDATE productos SET Estado = 0 WHERE Id_producto=' + Id_producto,
        (error,results) => {
            if(error) throw error
            res.json(results)
        }
    )
}

module.exports={verProductos,crearProductos,editarProducto,eliminarProductos}