const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(403).json({ error: "Insira um token válido" });
  }
 
  const tokenWithoutBearer = token.split(" ")[1];

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Falha ao autenticar o token" });
    }

    req.userId = decoded.id;
    next();
  });
};
