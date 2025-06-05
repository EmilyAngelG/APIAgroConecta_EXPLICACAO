// Importa a instância do Firestore configurada no arquivo config/firebase.js
const db = require("../config/firebase");

// ===============================
// CREATE - Cria uma nova reserva
// ===============================
exports.create = async (req, res) => {
    try {
        // Extrai dados do corpo da requisição (enviados pelo cliente)
        const { idConsumidor, idProduto, quantidadeReserva, dataReserva, statusReserva } = req.body;

        // Adiciona um novo documento na coleção "reservas" com os dados recebidos
        const docRef = await db.collection("reservas").add({ idConsumidor, idProduto, quantidadeReserva, dataReserva, statusReserva });

        // Retorna sucesso com o ID do documento criado
        res.json({ 
            "success": true,
            "message": "Reserva realizada com sucesso.", 
            "data": {
                "Id": docRef.id
            }
        });
    } catch (error) {
        // Em caso de erro, retorna status 500 com mensagem de erro
        res.status(500).json({ error: "Erro ao criar a reserva" });
    }
};

// ========================================
// LISTALL - Lista todas as reservas
// ========================================
exports.listAll = async (req, res) => {
    try {
        // Busca todos os documentos da coleção "reservas"
        const snapshot = await db.collection("reservas").get();

        // Mapeia os documentos em um array com id + dados
        const reservas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Retorna o array de reservas
        res.json({ 
            "success": true,
            "message": "Lista de reservas:", 
            "data": reservas
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar os reservas" });
    }
};

// ========================================
// LISTFILTER - Lista reservas com filtros
// ========================================
exports.listFilter = async (req, res) => {
    try {
        // Define campos que pertencem a cada tipo de filtro
        const produtoCampos = [
            "idProdutor", "nomeProduto", "precoProduto", "quantidadeProduto", 
            "undMedida", "dataCriacaoProduto", "modoProducao", "categoriaProduto"
        ];

        const usuarioCampos = [
            "nomeUsuario", "telefoneUsuario", "enderecoUsuario", 
            "dataCadastroUsuario", "tipoUsuario"
        ]

        // Objetos para armazenar filtros separados por categoria
        const produtoFiltros = {};
        const reservaFiltros = {};
        const usuarioFiltros = {};

        // Separa os campos recebidos conforme sua categoria
        for (const key in req.body) {
            if (produtoCampos.includes(key)) {
                produtoFiltros[key] = req.body[key];
            } else if (usuarioCampos.includes(key)) {
                usuarioFiltros[key] = req.body[key];
            } else {
                reservaFiltros[key] = req.body[key];
            }
        }

        // Logs de depuração no terminal (opcional)
        console.log("produtoFiltros recebido:", JSON.stringify(produtoFiltros, null, 2));
        console.log("reservaFiltros recebido:", JSON.stringify(reservaFiltros, null, 2));
        console.log("usuarioFiltros recebido:", JSON.stringify(usuarioFiltros, null, 2));

        // ===============================
        // FILTRA PRODUTOS
        let queryProdutos = db.collection("produtos");

        if (Object.keys(produtoFiltros).length > 0) {
            for (const key in produtoFiltros) {
                if (produtoFiltros[key] !== undefined) {
                    queryProdutos = queryProdutos.where(key, "==", produtoFiltros[key]);
                }
            }
        }

        const snapshotProdutos = await queryProdutos.get();
        const produtosFiltrados = snapshotProdutos.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Se filtros de produto foram usados mas não há resultados, retorna erro
        if (Object.keys(produtoFiltros).length > 0 && produtosFiltrados.length === 0) {
            return res.status(404).json({ 
                "success": false,
                "message": "Nenhuma reserva encontrada com os filtros aplicados."
            });
        }

        // ===============================
        // FILTRA USUÁRIOS
        let queryUsuarios = db.collection("usuarios");

        if (Object.keys(usuarioFiltros).length > 0) {
            for (const key in usuarioFiltros) {
                if (usuarioFiltros[key] !== undefined) {
                    queryUsuarios = queryUsuarios.where(key, "==", usuarioFiltros[key]);
                }
            }
        }

        const snapshotUsuarios = await queryUsuarios.get();
        const usuariosFiltrados = snapshotUsuarios.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (Object.keys(usuarioFiltros).length > 0 && usuariosFiltrados.length === 0) {
            return res.status(404).json({ 
                "success": false,
                "message": "Nenhuma reserva encontrada com os filtros aplicados."
            });
        }

        // ===============================
        // FILTRA RESERVAS
        let queryReservas = db.collection("reservas");

        if (Object.keys(reservaFiltros).length > 0) {
            for (const key in reservaFiltros) {
                if (reservaFiltros[key] !== undefined) {
                    queryReservas = queryReservas.where(key, "==", reservaFiltros[key]);
                }
            }
        }

        // ===============================
        // UNE FILTROS DE PRODUTOS E USUÁRIOS COM AS RESERVAS

        // Se produtos foram filtrados, restringe as reservas por idProduto
        if (produtosFiltrados.length > 0) {
            const produtoIds = produtosFiltrados.map(produto => produto.id);
            queryReservas = queryReservas.where("idProduto", "in", produtoIds);
        }

        // Se usuários foram filtrados, restringe as reservas por idUsuario
        if (usuariosFiltrados.length > 0) {
            const usuarioIds = usuariosFiltrados.map(usuario => usuario.id);
            queryReservas = queryReservas.where("idUsuario", "in", usuarioIds);
        }

        const snapshotReservas = await queryReservas.get();
        const reservasFiltradas = snapshotReservas.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (reservasFiltradas.length === 0) {
            return res.status(404).json({ 
                success: false,
                message: "Nenhuma reserva encontrada com os filtros aplicados."
            });
        }

        // Sucesso: retorna as reservas filtradas
        return res.status(200).json({ 
            success: true,
            message: "Reservas encontradas.",
            data: reservasFiltradas
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Erro ao buscar reservas", 
            details: error.message 
        });
    }
};

// ====================================
// GETID - Busca uma reserva por ID
// ====================================
exports.getId = async (req, res) => {
    try {
        // Busca documento de reserva pelo ID fornecido na rota
        const doc = await db.collection("reservas").doc(req.params.id).get();

        if (!doc.exists) {
            return res.status(404).json({ 
                "success": false,
                "message": "Cadastro não encontrado" 
            });
        }

        // Retorna os dados da reserva encontrada
        res.json({ 
            "success": true,
            "message": "Cadastro encontrado.",
            "data": doc.id, ...doc.data() 
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o cadastro" });
        console.error(error);
    }
};

// ====================================
// UPDATE - Atualiza uma reserva por ID
// ====================================
exports.update = async (req, res) => {
    try {
        const { idConsumidor, idProduto, quantidadeReserva, dataReserva, statusReserva } = req.body;

        // Atualiza o documento na coleção "reservas" com os novos dados
        await db.collection("reservas").doc(req.params.id).update({ idConsumidor, idProduto, quantidadeReserva, dataReserva, statusReserva });

        res.json({
            "success": true,
            "message": "Cadastro atualizado com sucesso."
        });
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Erro ao atualizar o cadastro."
        });
    }
};

// ====================================
// DELETE - Exclui uma reserva por ID
// ====================================
exports.delete = async (req, res) => {
    try {
        // Remove o documento pelo ID
        await db.collection("reservas").doc(req.params.id).delete();

        res.json({
            "success": true,
            "message": "Cadastro excluído com sucesso."
        });
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Erro ao excluir o cadastro."
        });
    }
};

// ====================================
// ADDAVALIACAO - Adiciona avaliação à reserva
// ====================================
exports.addAvaliacao = async (req, res) => {
    try {
        const { avaliacaoReserva, estrelasReserva, fotosUrlReserva } = req.body;

        // Aqui há um erro: "Reserva" não foi importado nem definido.
        // Além disso, está usando Mongoose (MongoDB) e não Firestore.
        const reservaAvaliada = await Reserva.findByIdAndUpdate(
            idReserva,
            {
                $set: { avaliacaoReserva, estrelasReserva, fotosUrlReserva },
            },
            { new: true }
        );

        if (!reservaAvaliada) {
            return res.status(404).json({
                "success": false,
                "message": "Reserva não encontrada."
            });
        }

        return res.status(200).json({
            "success": true,
            "message": "Avaliação adicionada com sucesso.",
            "data": reservaAvaliada
        });
    } catch (error) {
        res.status(500).json({
            "success": false,
            "message": "Erro ao realizar avaliação."
        });
    }
};
