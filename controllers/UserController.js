const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async createUser(req, res) {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await req.dbConnection.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [username, email, hashedPassword]
      );

      res.status(201).json({ message: "Conta criada com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar conta!" });
    }
  },

  async getUsers(req, res) {
    try {
      const [rows] = await req.dbConnection.query("SELECT * FROM users");
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao encontrar os usuários" });
    }
  },

  async getUserById(req, res) {
    const { user_id } = req.params;

    try {
      const [rows] = await req.dbConnection.query(
        "SELECT * FROM users WHERE id = ?",
        [user_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar usuário" });
    }
  },

  async updateUser(req, res) {
    const { user_id } = req.params;
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const [result] = await req.dbConnection.query(
        "UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?",
        [username, email, hashedPassword, user_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ message: "Conta atualizada com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error updating user" });
    }
  },

  async deleteUser(req, res) {
    const { user_id } = req.params;

    try {
      const [result] = await req.dbConnection.query(
        "DELETE FROM users WHERE id = ?",
        [user_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }

      res.json({ message: "Conta excluída com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao excluir a conta" });
    }
  },
};
