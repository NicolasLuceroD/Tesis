const { connection } = require("../database/config");

const verCategoria = (req, res) => {
  connection.query("SELECT * FROM categoria WHERE Estado = 1", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};

const crearCategoria = (req, res) => {
  connection.query(
    "INSERT INTO categoria SET ?",
    {
      nombre_categoria: req.body.nombre_categoria
    },
    (error, results) => {
      if (error) throw error;
      res.json("Categoria creada con exito");
    }
  );
};

const editarCategoria = (req, res) => {
  const Id_categoria = req.params.Id_categoria;
  const { nombre_categoria } = req.body;
  connection.query(
    `UPDATE categoria SET  
                            nombre_categoria='${nombre_categoria}' 
                            WHERE Id_categoria = ${Id_categoria}`,
      (error, results) => {
      if (error) throw error;
      res.json("registro editado");
    }
  );
};



const eliminarCategoria = (req,res)=>{
    const Id_categoria = req.params.Id_categoria
    connection.query('UPDATE categoria SET Estado = 0 WHERE Id_categoria =' + Id_categoria,                                     
        (error,results)=>{
            if(error)throw error
            res.json(results)
        }
    )
}

module.exports = {verCategoria,crearCategoria,editarCategoria,eliminarCategoria}