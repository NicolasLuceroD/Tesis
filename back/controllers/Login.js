const { connection } = require("../database/config");
const jwt = require("jsonwebtoken");

const login = (req, res) => {
    const nombre_usuario = req.body.nombre_usuario;
    const clave = req.body.clave;

    connection.query(
        'SELECT * FROM Usuarios WHERE nombre_usuario = ? AND clave = ?',
        [nombre_usuario, clave],
        (error, result) => {
            if (error) {
                console.error("Error al ejecutar la consulta SQL:", error);
                return res.status(500).send("Error interno del servidor");
            }

            if (result.length > 0) {
                const usuario = result[0];

                // Crear el token JWT
                const token = jwt.sign(
                    {
                        id: usuario.Id_usuario, 
                        nombre_usuario: usuario.nombre_usuario,
                        rol: usuario.rol_usuario
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_EXPIRES_IN}
                );

                res.json({
                    success: true,
                    token,
                    usuario: {
                        id: usuario.Id_usuario, 
                        nombre_usuario: usuario.nombre_usuario,
                        rol: usuario.rol_usuario
                    }
                });
            } else {
                res.json({ success: false, mensaje: "Credenciales inválidas" });
            }
        }
    );
};

module.exports = { login };
