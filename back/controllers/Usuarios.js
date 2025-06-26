const { connection } = require("../database/config");

const verUsuarios = (req, res) => {
  connection.query("SELECT * FROM usuarios WHERE Estado = 1", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};

const verUsuariosBaja = (req,res) => {
  connection.query("SELECT * FROM usuarios WHERE Estado = 0", (error,results) => {
    if (error) throw error
    res.json(results)
  })
}

const crearUsuarios = (req, res) => {
  connection.query(
    "INSERT INTO usuarios set ?",
    {
      Id_usuario: req.body.Id_usuario,
      nombre_usuario: req.body.nombre_usuario,
      clave: req.body.clave,
      rol_usuario: req.body.rol_usuario,
    },
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const editarUsuarios = (req, res) => {
  const Id_usuario = req.params.Id_usuario;
  const { nombre_usuario, clave, rol_usuario } = req.body;
  connection.query(
    `UPDATE usuarios SET 
                        nombre_usuario='${nombre_usuario}',
                        clave='${clave}',
                        rol_usuario='${rol_usuario}'
                        WHERE Id_usuario= ${Id_usuario}`,
                        (error,results)=>{
                          if(error)throw error;
                           res.json('usuario editado')
                       }
                   );
};

const eliminarUsuarios = (req,res) => {
    const Id_usuario = req.params.Id_usuario
    connection.query('UPDATE usuarios SET Estado = 0 WHERE Id_usuario=' + Id_usuario,
        (error,results) => {
            if (error) throw error
            res.json(results)
        })
}

const altaUsuario = (req, res) => {
    const Id_usuario = req.params.Id_usuario; 
    connection.query('UPDATE usuarios SET Estado = 1 WHERE Id_usuario =' + Id_usuario,
       (error, results) => {
         if (error) throw error
            res.json(results)
        }
    );
}

module.exports = {verUsuarios,crearUsuarios,editarUsuarios,eliminarUsuarios,verUsuariosBaja,altaUsuario}