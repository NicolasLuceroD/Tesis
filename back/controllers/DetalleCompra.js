const { connection } = require("../database/config");

const registrarDetalleCompra = (req,res) => {
    const { Id_compra, Id_producto, Cantidad, Precio_costo} = req.body
    connection.query('INSERT INTO detallecompra SET ?',
    {
        Id_compra: Id_compra,
        Id_producto: Id_producto,
        Cantidad : Cantidad,
        Precio_costo: Precio_costo,
    }, (error,results) => {
        if (error) throw error
        res.json(results)
    }
)} 


const verDetalleCompraCompletoAgrupado = (req, res) => {
  connection.query(`
   SELECT 
      c.Id_compra,
      c.fecha_registro,
      c.Total,
      dc.Id_detalleCompra,
      dc.Id_producto,
      dc.Cantidad,
      dc.Precio_costo,
      dc.Fecha_registro AS Fecha_registro,
      p.nombre_producto
    FROM detallecompra dc
    INNER JOIN compra c ON c.Id_compra = dc.Id_compra
    INNER JOIN productos p ON p.Id_producto = dc.Id_producto
    ORDER BY c.Id_compra DESC, dc.Id_detalleCompra;
  `, (error, results) => {
    if (error) {
      console.error('Error al traer los detalles de compra:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    const comprasAgrupadas = results.reduce((acc, item) => {
      if (!acc[item.Id_compra]) {
        acc[item.Id_compra] = {
          Id_compra: item.Id_compra,
          fecha_registro: item.fecha_registro,
          precio_total: item.Total,
          productos: []
        };
      }

      acc[item.Id_compra].productos.push({
        Id_detalleCompra: item.Id_detalleCompra,
        Id_producto: item.Id_producto,
        nombre_producto: item.nombre_producto,
        Cantidad: item.Cantidad,
        Precio_costo: item.Precio_costo,
        Fecha_registro: item.Fecha_registro
      });

      return acc;
    }, {});

    const compras = Object.values(comprasAgrupadas);
    res.json(compras);
  });
};

const verTotalCompras = (req,res) => {
  connection.query(`SELECT SUM(c.Total) AS total_compras FROM compra c`,(error,results) => {
    if (error) throw error
    res.json(results)
  })
}

// const verDetalleCompraCompleto = (req,res) => {
//     connection.query('SELECT dc.*, p.nombre_producto FROM detallecompra dc INNER JOIN productos p ON dc.Id_producto = p.Id_producto ORDER BY dc.Id_compra;', (error,results) => {
//         if (error) throw error
//         res.json(results)
//     })
// }

module.exports = {registrarDetalleCompra,verDetalleCompraCompletoAgrupado,verTotalCompras}