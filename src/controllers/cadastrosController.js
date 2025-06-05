// Importa a instância do Firestore do arquivo de configuração
const db = require("../config/firebase");

// Função para criar um novo cadastro
exports.create = async (req, res) => {
    try {
        // Extrai os dados enviados no corpo da requisição
        const { nomeUsuario, telefoneUsuario, enderecoUsuario, dataCadastroUsuario, tipoUsuario } = req.body;

        // Adiciona um novo documento na coleção "cadastros" com os dados extraídos
        const docRef = await db.collection("cadastros").add({ nomeUsuario, telefoneUsuario, enderecoUsuario, dataCadastroUsuario, tipoUsuario });

        // Retorna uma resposta de sucesso com o ID do novo documento
        res.json({ 
            "success": true,
            "message": "Usuário cadastrado com sucesso.", 
            "data": {
                "Id": docRef.id
            }
        });
    } catch (error) {
        // Retorna erro caso algo dê errado na criação
        res.status(500).json({ error: "Erro ao criar o cadastro" });
    }
};

// Função para listar todos os cadastros da coleção "cadastros"
exports.listAll = async (req, res) => {
    try {
        // Busca todos os documentos da coleção "cadastros"
        const snapshot = await db.collection("cadastros").get();

        // Mapeia cada documento para um objeto contendo seu ID e dados
        const cadastros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Retorna a lista dos cadastros com uma mensagem de sucesso
        res.json({ 
            "success": true,
            "message": "Lista de usuário cadastrados:", 
            "data": cadastros
        });
    } catch (error) {
        // Retorna erro caso a leitura falhe
        res.status(500).json({ error: "Erro ao buscar os cadastros" });
    }
};

// Função para buscar um cadastro específico pelo ID
exports.getId = async (req, res) => {
    try {
        // Busca o documento com o ID passado na URL (params.id)
        const doc = await db.collection("cadastros").doc(req.params.id).get();

        // Verifica se o documento existe
        if (!doc.exists) {
            return res.status(404).json({ 
                "success": false,
                "message": "Cadastro não encontrado" 
            });
        }

        // Retorna os dados do documento encontrado
        res.json({ 
            "success": true,
            "message": "Cadastro encontrado.",
            "data": { id: doc.id, ...doc.data() } // Corrigido: os dados devem estar dentro de um objeto
        });
    } catch (error) {
        // Em caso de erro na consulta, retorna erro e imprime no console
        res.status(500).json({ error: "Erro ao buscar o cadastro" });
        console.error(error);
    }
};

// Função para atualizar um cadastro específico
exports.update = async (req, res) => {
    try {
        // Extrai os novos dados do corpo da requisição
        const { nomeUsuario, telefoneUsuario, enderecoUsuario, dataCadastroUsuario, tipoUsuario } = req.body;

        // Atualiza o documento com o ID passado na URL
        await db.collection("cadastros").doc(req.params.id).update({ nomeUsuario, telefoneUsuario, enderecoUsuario, dataCadastroUsuario, tipoUsuario });

        // Retorna mensagem de sucesso
        res.json({
            "success": true,
            "message": "Cadastro atualizado com sucesso."
        });
    } catch (error) {
        // Retorna erro se a atualização falhar
        res.status(500).json({
            "success": false,
            "message": "Erro ao atualizar o cadastro."
        });
    }
};

// Função para deletar um cadastro específico
exports.delete = async (req, res) => {
    try {
        // Remove o documento com o ID passado na URL
        await db.collection("cadastros").doc(req.params.id).delete();

        // Retorna mensagem de sucesso
        res.json({
            "success": true,
            "message": "Cadastro excluído com sucesso."
        });
    } catch (error) {
        // Retorna erro se a exclusão falhar
        res.status(500).json({
            "success": false,
            "message": "Erro ao excluir o cadastro."
        });
    }
};
