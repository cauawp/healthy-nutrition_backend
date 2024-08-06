const { Router } = require("express");

const UserController = require("../controllers/UserController");
const SessionController = require("../controllers/Login");
const ProductsController = require("../controllers/ProductsController");
const FavoritesController = require("../controllers/FavoritesController");
const authMiddleware = require("../middlewares/auth");

const routes = Router();

routes.get("/", (req, res) => {
  res.send("Hello, World!");
});

routes.post("/users", UserController.createUser);
routes.post("/login", SessionController.loginUser);

// Rotas para usuários
routes.get("/users", authMiddleware, UserController.getUsers);
routes.get("/users/:user_id", authMiddleware, UserController.getUserById);
routes.patch("/users/:user_id", authMiddleware, UserController.updateUser);
routes.delete("/users/:user_id", authMiddleware, UserController.deleteUser);

// Rotas para produtos (receitas)
routes.post("/products", authMiddleware, ProductsController.createProduct);
routes.get("/products", ProductsController.getProducts); // pública
routes.get("/products/:product_id", ProductsController.getProductById); // pública
routes.patch("/products/:product_id", authMiddleware, ProductsController.updateProduct);
routes.delete("/products/:product_id", authMiddleware, ProductsController.deleteProduct);

// Rotas para favoritos 
routes.post("/favorites", authMiddleware, FavoritesController.addFavorite);
routes.delete("/favorites", authMiddleware, FavoritesController.removeFavorite);
routes.get("/favorites", authMiddleware, FavoritesController.getFavorites);

module.exports = routes;
