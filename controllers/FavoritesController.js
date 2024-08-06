module.exports = {
  async addFavorite(req, res) {
    const { product_id } = req.body;
    const user_id = req.userId;
  
    try {
      const [result] = await req.dbConnection.query(
        "INSERT INTO favorites (user_id, product_id) VALUES (?, ?)",
        [user_id, product_id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(400).json({ error: "Não foi possível favoritar o produto" });
      }
  
      res.status(201).json({ message: "Produto favoritado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao favoritar produto!" });
    }
  },  

  async removeFavorite(req, res) {
    const { product_id } = req.body;
    const user_id = req.userId;
  
    try {
      const [result] = await req.dbConnection.query(
        "DELETE FROM favorites WHERE user_id = ? AND product_id = ?",
        [user_id, product_id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Favorito não encontrado" });
      }
  
      res.json({ message: "Produto desfavoritado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao desfavoritar produto" });
    }
  },  

  async getFavorites(req, res) {
    const user_id = req.userId;
  
    try {
      const [rows] = await req.dbConnection.query(
        "SELECT p.* FROM products p JOIN favorites f ON p.id = f.product_id WHERE f.user_id = ?",
        [user_id]
      );
      res.json({ favorites: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar favoritos" });
    }
  },  
};
