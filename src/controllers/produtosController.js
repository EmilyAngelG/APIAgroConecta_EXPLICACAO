// Importa a instância do Firestore configurada
const db = require("../config/firebase");

// ---------------------
// Função para criar um novo produto
// ---------------------
exports.create = async (req, res) => {
    try {
        // Desestrutura os dados enviados pelo cliente no corpo da requisição
        const {
            idProdutor,           // ID de quem produziu o produto
            nomeProduto,          // Nome do produto
            precoProduto,         // Preço
            quantidadeProduto,    // Quantidade disponível
            undMedida,            // Unidade de medida (ex: kg, L, un)
            dataCriacaoProduto,   // Data de criação do produto
            modoProducao,         // Ex: orgânico, convencional
            categoriaProduto      // Ex: fruta, verdura, bebida
        } = req.body;

        // Adiciona um novo documento na coleção 'produtos'
        const docRef = await db.collection("produtos").add({
            idProdutor,
            nomeProduto,
            precoProduto,
            quantidadeProduto,
            undMedida,
            dataCriacaoProduto,
            modoProducao,
            categoriaProduto
        });

        // Retorna uma resposta de sucesso com o ID do novo documento
        res.json({ 
            success: true,
            message: "Produto cadastrado com sucesso.", 
            data: {
                Id: docRef.id
            }
        });
    } catch (error) {
        // Retorna erro interno caso algo falhe no processo
        res.status(500).json({ error: "Erro ao criar o produto" });
    }
};

// ---------------------
// Função para listar todos os produtos cadastrados
// ---------------------
exports.listAll = async (req, res) => {
    try {
        // Busca todos os documentos da coleção 'produtos'
        const snapshot = await db.collection("produtos").get();

        // Mapeia os documentos para incluir o ID junto com os dados
        const produtos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Retorna todos os produtos encontrados
        res.json({ 
            success: true,
            message: "Lista de produtos cadastrados:", 
            data: produtos
        });
    } catch (error) {
        // Retorna erro caso algo dê errado na consulta
        res.status(500).json({ error: "Erro ao buscar os produtos" });
    }
};

// ---------------------
// Função para filtrar produtos com base em critérios enviados no corpo da requisição
// ---------------------
exports.listFilter = async (req, res) => {
    try {
        const filtros = req.body; // Exemplo: { categoriaProduto: "fruta", modoProducao: "orgânico" }

        let query = db.collection("produtos"); // Inicia a query da coleção

        // Aplica os filtros dinamicamente com base nas chaves do objeto
        for (const key in filtros) {
            query = query.where(key, "==", filtros[key]);
        }

        const snapshot = await query.get(); // Executa a query

        // Constrói a lista com os dados dos produtos
        const produtos = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Retorna 404 caso nenhum produto seja encontrado
        if (produtos.length === 0) {
            return res.status(404).json({ message: "Nenhum produto encontrado com os filtros aplicados." });
        }

        // Retorna os produtos encontrados
        res.status(200).json({ 
            success: true,
            message: "Produtos encontrados.",
            data: produtos 
        });
    } catch (error) {
        // Retorna erro com detalhes em caso de falha
        res.status(500).json({
            error: "Erro ao buscar reservas", // Obs: a mensagem aqui está errada ("reservas" deveria ser "produtos")
            details: error.message
        });
    }
};

// ---------------------
// Função para buscar um produto pelo ID
// ---------------------
exports.getId = async (req, res) => {
    try {
        // Busca o documento na coleção com o ID passado na URL
        const doc = await db.collection("produtos").doc(req.params.id).get();

        // Se não existir, retorna 404
        if (!doc.exists) {
            return res.status(404).json({ 
                success: false,
                message: "Produto não encontrado" 
            });
        }

        // Retorna os dados do produto encontrado
        res.json({ 
            success: true,
            message: "Produto encontrado.",
            data: {
                id: doc.id,
                ...doc.data()
            }
        });
    } catch (error) {
        // Retorna erro em caso de falha
        res.status(500).json({ error: "Erro ao buscar o produto" });
    }
};

// ---------------------
// Função para atualizar um produto existente
// ---------------------
exports.update = async (req, res) => {
    try {
        // Coleta os dados do corpo da requisição
        const {
            idProdutor,
            nomeProduto,
            precoProduto,
            quantidadeProduto,
            undMedida,
            dataCriacaoProduto,
            modoProducao,
            categoriaProduto
        } = req.body;

        // Atualiza os campos do documento com ID fornecido na URL
        await db.collection("produtos").doc(req.params.id).update({
            idProdutor,
            nomeProduto,
            precoProduto,
            quantidadeProduto,
            undMedida,
            dataCriacaoProduto,
            modoProducao,
            categoriaProduto
        });

        // Retorna mensagem de sucesso
        res.json({
            success: true,
            message: "Produto atualizado com sucesso."
        });
    } catch (error) {
        // Retorna erro em caso de falha
        res.status(500).json({
            success: false,
            message: "Erro ao atualizar o produto."
        });
    }
};

// ---------------------
// Função para deletar um produto pelo ID
// ---------------------
exports.delete = async (req, res) => {
    try {
        // Remove o documento da coleção com o ID fornecido na URL
        await db.collection("produtos").doc(req.params.id).delete();

        // ⚠️ ERRO: Aqui está incorreto `res.json.json`, o correto é apenas `res.json`
        res.json({
            success: true,
            message: "Produto excluído com sucesso."
        });
    } catch (error) {
        // Retorna erro em caso de falha
        res.status(500).json({
            success: false,
            message: "Erro ao excluir o produto."
        });
    }
};
