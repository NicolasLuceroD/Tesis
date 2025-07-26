const { connection } = require("../database/config");

const verStock = (req, res) => {
  connection.query(
    `SELECT
        p.Id_producto,
        p.nombre_producto,
        l.nro_lote,
        l.fecha_vencimiento,
        l.cantidad_disponible,
        total_por_producto.total_disponible
      FROM lotes l
      JOIN productos p ON p.Id_producto = l.Id_producto
      JOIN (
        SELECT Id_producto, SUM(cantidad_disponible) AS total_disponible
        FROM lotes
        GROUP BY Id_producto
      ) total_por_producto ON total_por_producto.Id_producto = p.Id_producto
      WHERE l.cantidad_disponible > 0
      ORDER BY total_por_producto.total_disponible DESC, p.nombre_producto ASC, l.fecha_vencimiento ASC`,
    (error, results) => {
      if (error) throw error;

      const agrupado = {}; //creo un array vacio para AGRUPAR los productos

      //recorro cada fila que me llega de la consulta
      results.forEach(row => {
        const { Id_producto, nombre_producto, fecha_vencimiento, cantidad_disponible, nro_lote} = row;

        //valido si es la primera vez del producto lo agrego al array 
        if (!agrupado[nombre_producto]) {
          agrupado[nombre_producto] = {
            Id_producto,
            total: 0,
            detalle_fechas: []
          };
        }

        //sumo la cantidad al total general del producto
        agrupado[nombre_producto].total += cantidad_disponible;

        //agrego la fecha y cantidad al array detalle fechas
        agrupado[nombre_producto].detalle_fechas.push({
          nro_lote,
          fecha_vencimiento,
          cantidad: cantidad_disponible
        });
      });

      res.json(agrupado);
    }
  );
};


module.exports = {verStock}



