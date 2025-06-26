const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ mensaje: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // el payload con id, nombre_usuario, rol_usuario, etc.
    next(); // continuar con la ruta
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado" });
  }
};

module.exports = verificarToken;
