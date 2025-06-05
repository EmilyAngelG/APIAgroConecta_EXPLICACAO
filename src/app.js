// Importa o Express, framework top pra criar servidor e rotas
const express = require("express");

// Importa e configura as variáveis de ambiente do arquivo .env (tipo senhas, portas, etc)
require("dotenv").config();

// Importa as rotas de cadastro, produtos e reservas que ficam organizadas em arquivos separados
const cadastroRoutes = require("./routes/cadastroRoutes");
const produtoRoutes = require("./routes/produtoRoutes");
const reservaRoutes = require("./routes/reservaRoutes");

// Cria a aplicação Express - o servidor em si
const app = express();

// Diz pro app usar um middleware que interpreta JSON no corpo das requisições, pra poder receber dados via POST/PUT etc
app.use(express.json());

// Configura as rotas pra quando o usuário acessar "/api/cadastros", usar as rotas definidas no arquivo cadastroRoutes
app.use("/api/cadastros", cadastroRoutes);

// Configura as rotas pra "/api/produtos" usar o produtoRoutes (rotas de produtos)
app.use("/api/produtos", produtoRoutes);

// Configura as rotas pra "/api/reservas" usar as rotas de reservas
app.use("/api/reservas", reservaRoutes);

// Exporta o app pra poder ser usado em outro arquivo (ex: o arquivo que vai rodar o servidor mesmo)
module.exports = app;
