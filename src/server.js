// Importa o app que você criou (geralmente o Express com todas as rotas e configs)
const app = require("./app");

// Define a porta que o servidor vai escutar:
// Primeiro tenta pegar a porta do ambiente (variável de ambiente PORT), 
// se não encontrar, usa a porta 8081 como padrão
const PORT = process.env.PORT || 8081;

// Inicia o servidor para escutar requisições na porta definida
// Quando o servidor começar a rodar, ele imprime no console a mensagem abaixo
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
