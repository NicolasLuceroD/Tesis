const { connection } = require("../database/config");

const verDroguerias = (req, res) => {
  connection.query("SELECT * FROM droguerias WHERE Estado = 1 ", (error, results) => {
    if (error) throw error;
    res.json(results);
  });
};

const crearDroguerias = (req, res) => {
  connection.query("INSERT INTO droguerias SET ?",
    {
      nombre_drogueria: req.body.nombre_drogueria,
      Cuit_drogueria: req.body.Cuit_drogueria,
      telefono_drogueria: req.body.telefono_drogueria,
      direccion_drogueria: req.body.direccion_drogueria,
      correo_drogueria: req.body.correo_drogueria,
    },
    (error, results) => {
      if (error) throw error;
      res.json(results);
    }
  );
};

const editarDroguerias = (req, res) => {
  const Id_drogueria = req.params.Id_drogueria;
  const {nombre_drogueria,Cuit_drogueria,telefono_drogueria,correo_drogueria,direccion_drogueria} = req.body;
  connection.query(
    `UPDATE droguerias SET
                            nombre_drogueria='${nombre_drogueria}',
                            Cuit_drogueria='${Cuit_drogueria}',
                            telefono_drogueria='${telefono_drogueria}',
                            direccion_drogueria='${direccion_drogueria}',
                            correo_drogueria='${correo_drogueria}'
                            WHERE Id_drogueria=${Id_drogueria}
                            `,
    (error, results) => {
      if (error) throw error;
      res.json("registro editado");
    }
  );
};


const eliminarDroguerias = (req,res) => {
    const Id_drogueria = req.params.Id_drogueria
    connection.query('UPDATE droguerias SET Estado = 0 WHERE Id_drogueria=' + Id_drogueria,
        (error,results) => {
            if (error) throw error
            res.json(results)
        })
}

module.exports = {verDroguerias,editarDroguerias,crearDroguerias,eliminarDroguerias}
