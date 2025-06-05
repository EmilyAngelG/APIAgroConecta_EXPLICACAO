// Importa o Express, que é o framework massa pra criar servidor e rotas
const express = require("express");

// Cria um router, que é tipo um grupo de rotas só pras reservas
const router = express.Router();

// Importa o controller de reservas, onde estão as funções que fazem o trabalho pesado (listar, criar, atualizar, etc)
const reservasController = require("../controllers/reservasController");

// Rota GET "/" - listar todas as reservas, chama o método listAll do controller
router.get("/", reservasController.listAll);

// Rota POST "/filtro" - filtrar reservas com base nos critérios que chegam no corpo da requisição
router.post("/filtro", reservasController.listFilter);

// Rota GET "/:id" - pegar uma reserva específica pelo id, passando o id na URL
router.get("/:id", reservasController.getId);

// Rota POST "/" - criar uma nova reserva, os dados vêm no corpo da requisição
router.post("/", reservasController.create);

// Rota PUT "/:id" - atualizar a reserva que tem o id passado na URL com os dados enviados no corpo
router.put("/:id", reservasController.update);

// Rota DELETE "/:id" - apagar a reserva que tem o id passado na URL
router.delete("/:id", reservasController.delete);

// Rota PUT "/addAvaliacao/:id" - rota especial pra adicionar uma avaliação na reserva pelo id
router.put("/addAvaliacao/:id", reservasController.addAvaliacao);

// Exporta o router com todas essas rotas configuradas pra usar em outro lugar (ex: no app principal)
module.exports = router;
