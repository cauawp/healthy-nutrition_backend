module.exports = {
  async createProduct(req, res) {
    const { title, description, image, kcal, link } = req.body;
  
    try {
      const [result] = await req.dbConnection.query(
        "INSERT INTO products (title, description, image, kcal, link) VALUES (?, ?, ?, ?, ?)",
        [title, description, image, kcal, link]
      );
  
      res.status(201).json({ message: "Produto criado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar produto!" });
    }
  },

  async getProducts(req, res) {
    try {
      const [rows] = await req.dbConnection.query("SELECT * FROM products");
      res.json({ products: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  },

  async getProductById(req, res) {
    const { product_id } = req.params;

    try {
      const [rows] = await req.dbConnection.query(
        "SELECT * FROM products WHERE id = ?",
        [product_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar produto" });
    }
  },

  async updateProduct(req, res) {
    const { product_id } = req.params;
    const { title, description, kcal, link } = req.body;

    try {
      const [result] = await req.dbConnection.query(
        "UPDATE products SET title = ?, description = ?, kcal = ?, link = ? WHERE id = ?",
        [title, description, kcal, link, product_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      res.json({ message: "Produto atualizado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao atualizar produto" });
    }
  },

  async deleteProduct(req, res) {
    const { product_id } = req.params;
  
    try {
      // Remover todas as referências ao produto na tabela de favoritos
      await req.dbConnection.query('DELETE FROM favorites WHERE product_id = ?', [product_id]);
  
      // Agora, deletar o produto
      const [result] = await req.dbConnection.query(
        'DELETE FROM products WHERE id = ?',
        [product_id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }
  
      res.json({ message: 'Produto excluído com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }
};
