const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await req.dbConnection.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login feito com sucesso!", token });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
};
