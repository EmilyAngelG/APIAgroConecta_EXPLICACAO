// Aqui a gente puxa o Express, que é o bicho pra criar servidor e rotas
const express = require("express");

// Criou o roteador, tipo uma caixinha onde a gente coloca as rotas específicas desse módulo
const router = express.Router();

// Aqui tá puxando o controller, que é onde tá a lógica das paradas tipo criar, listar, atualizar, deletar
const cadastrosController = require("../controllers/cadastrosController");

// Rota GET raiz: quando alguém bater aqui, chama o listAll, que traz geral, tudo que tem cadastrado
router.get("/", cadastrosController.listAll);

// Rota GET com ID na URL: pra pegar só um cadastro específico, o controller busca pelo id que veio na URL
router.get("/:id", cadastrosController.getId);

// Rota POST raiz: chega dado novo, o create do controller cria um cadastro novo com o que veio no corpo da requisição
router.post("/", cadastrosController.create);

// Rota PUT com ID: atualizar um cadastro já existente, a parada identifica pelo id e troca o que precisar
router.put("/:id", cadastrosController.update);

// Rota DELETE com ID: quando quiser apagar o cadastro pelo id, chama a função que exclui
router.delete("/:id", cadastrosController.delete);

// Exporta essa caixinha de rotas, pra quem usar esse arquivo poder usar essas rotas aqui
module.exports = router;
