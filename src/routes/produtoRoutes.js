// Puxando o Express, que é o framework top pra criar servidor e rotas
const express = require("express");

// Criando um roteador, que é tipo uma caixinha onde a gente coloca as rotas relacionadas a produtos
const router = express.Router();

// Importando o controller de produtos, que tem toda a lógica pra listar, criar, editar e apagar produtos
const produtosController = require("../controllers/produtosController");

// Rota GET na raiz: aqui o cara vai pedir pra listar todos os produtos, aí chama o método listAll do controller
router.get("/", produtosController.listAll);

// Rota POST na /filtro: pra quando quiser filtrar produtos com base em alguns critérios, tipo buscar só os que interessam
router.post("/filtro", produtosController.listFilter);

// Rota GET com ID na URL: quando quiser buscar um produto específico pelo ID, cai no método getId do controller
router.get("/:id", produtosController.getId);

// Rota POST na raiz: serve pra criar um produto novo, recebe os dados no corpo da requisição e chama o create
router.post("/", produtosController.create);

// Rota PUT com ID na URL: pra atualizar um produto existente, identifica pelo ID e atualiza os dados com o que vier no corpo
router.put("/:id", produtosController.update);

// Rota DELETE com ID na URL: pra apagar um produto, indica o ID na URL e chama o delete do controller
router.delete("/:id", produtosController.delete);

// Exporta o roteador com essas rotas configuradas, pra poder usar em outro lugar da aplicação (ex: no app principal)
module.exports = router;
