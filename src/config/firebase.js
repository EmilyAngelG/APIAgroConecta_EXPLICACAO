// Carrega as variáveis de ambiente do arquivo .env localizado dois diretórios acima
require("dotenv").config({ path: '../../.env' });

// Importa as funções initializeApp (para iniciar o Firebase Admin) 
// e cert (para autenticar com a chave de serviço) do módulo firebase-admin/app
const { initializeApp, cert } = require("firebase-admin/app");

// Importa a função getFirestore para acessar o banco de dados Firestore do Firebase
const { getFirestore } = require("firebase-admin/firestore");

// Lê a variável de ambiente FIREBASE_CREDENTIALS (que é uma string JSON)
// e a converte para um objeto JavaScript contendo as credenciais de autenticação
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

// Inicializa o Firebase Admin SDK com as credenciais fornecidas
initializeApp({
  credential: cert(serviceAccount) // Usa a chave de serviço convertida para autenticar
});

// Cria uma instância do banco de dados Firestore associada ao app Firebase já inicializado
const db = getFirestore();

// Exporta a instância do Firestore para ser usada em outros arquivos do projeto
module.exports = db;
