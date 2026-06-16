import Receita from "../models/Receita.js";
import ReceitaItem from "../models/ReceitaItem.js";


// FEATURE 1 — Emissão de receita

async function inserir(req, res) {
    const prontuario_id = req.body.prontuario_id;
    const paciente_id = req.body.paciente_id;
    const profissional = req.body.profissional;
    const crm = req.body.crm;
    const orientacoes = req.body.orientacoes;
    const itens = req.body.itens;

    // Validação básica
    if (!prontuario_id || !paciente_id || !profissional || !crm) {
        return res.status(400).json({ erro: true, mensagem: "prontuario_id, paciente_id, profissional e crm são obrigatórios." });
    }

    if (!itens || itens.length === 0) {
        return res.status(400).json({ erro: true, mensagem: "A receita deve conter ao menos 1 medicamento." });
    }

   // Validação com o Prontuário (G5) — consome API externa
    try {
        const resposta = await fetch(
            `http://localhost:3005/prontuario/paciente/${paciente_id}`
        );
        if (!resposta.ok) {
            return res.status(422).json({ erro: true, mensagem: "Prontuário não encontrado no G5 para este paciente." });
        }
    } catch (error) {
        return res.status(502).json({ erro: true, mensagem: "G5 indisponível. Não é possível emitir receita sem validação." });
    }

    // Criar a receita (cabeçalho)
    const agora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

    const receita = await Receita.create({
        prontuario_id: prontuario_id,
        paciente_id: paciente_id,
        profissional: profissional,
        crm: crm,
        orientacoes: orientacoes,
        emitida_em: agora
    });

    // Criar os itens (medicamentos)
    for (const item of itens) {
        await ReceitaItem.create({
            idreceita: receita.idreceita,
            medicamento: item.medicamento,
            dosagem: item.dosagem,
            posologia: item.posologia,
            quantidade: item.quantidade
        });
    }

    return res.json(receita);
}


// FEATURE 3 — Consulta de receitas

async function listar(req, res) {
    const dados = await Receita.findAll({ order: [['emitida_em', 'DESC']] });
    return res.json(dados);
}

async function listarPorPaciente(req, res) {
    const paciente_id = req.params.paciente_id;
    const dados = await Receita.findAll({
        where: { paciente_id: paciente_id },
        order: [['emitida_em', 'DESC']]
    });
    return res.json(dados);
}

async function selecionar(req, res) {
    const idreceita = req.params.idreceita;
    const receita = await Receita.findByPk(idreceita);

    if (!receita) {
        return res.status(404).json({ erro: true, mensagem: "Receita não encontrada." });
    }

    const itens = await ReceitaItem.findAll({ where: { idreceita: idreceita } });

    return res.json({ ...receita.dataValues, itens: itens });
}

// FEATURE 2 — Imutabilidade (substituição em vez de edição)
// Não existe PUT/DELETE. Para corrigir, cria-se uma nova receita.

async function substituir(req, res) {
    const idreceita = req.params.idreceita;
    const antiga = await Receita.findByPk(idreceita);

    if (!antiga) {
        return res.status(404).json({ erro: true, mensagem: "Receita não encontrada." });
    }

    if (antiga.status !== 'ativa') {
        return res.status(400).json({ erro: true, mensagem: "Apenas receitas ativas podem ser substituídas." });
    }

    const profissional = req.body.profissional || antiga.profissional;
    const crm = req.body.crm || antiga.crm;
    const orientacoes = req.body.orientacoes;
    const itens = req.body.itens;

    if (!itens || itens.length === 0) {
        return res.status(400).json({ erro: true, mensagem: "Informe os itens da nova receita." });
    }

    // Criar a nova receita
    const agora = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

    const nova = await Receita.create({
        prontuario_id: antiga.prontuario_id,
        paciente_id: antiga.paciente_id,
        profissional: profissional,
        crm: crm,
        orientacoes: orientacoes,
        emitida_em: agora
    });

    // Criar os itens da nova receita
    for (const item of itens) {
        await ReceitaItem.create({
            idreceita: nova.idreceita,
            medicamento: item.medicamento,
            dosagem: item.dosagem,
            posologia: item.posologia,
            quantidade: item.quantidade
        });
    }

    // Marcar a antiga como substituída
    await antiga.update({
        status: 'substituida',
        substituida_por: nova.idreceita
    });

    return res.json(nova);
}


// INTEGRAÇÃO — Fornece para Farmácia (G8)


// GET /receita/validar/:codigo
// A farmácia envia o UUID impresso na receita e verifica se é válida
async function validar(req, res) {
    const codigo = req.params.codigo;
    const receita = await Receita.findOne({ where: { codigo: codigo } });

    if (!receita) {
        return res.json({ valida: false, motivo: "Receita inexistente." });
    }

    if (receita.status === 'substituida') {
        return res.json({ valida: false, motivo: "Receita substituída por outra." });
    }

    if (receita.status === 'dispensada') {
        return res.json({ valida: false, motivo: "Receita já utilizada." });
    }

    const itens = await ReceitaItem.findAll({ where: { idreceita: receita.idreceita } });

    return res.json({
        valida: true,
        receita: {
            codigo: receita.codigo,
            paciente_id: receita.paciente_id,
            profissional: receita.profissional,
            crm: receita.crm,
            emitida_em: receita.emitida_em,
            itens: itens
        }
    });
}

// POST /receita/dispensar/:codigo
// Chamado pela Farmácia após entregar os medicamentos — marca como usada
async function dispensar(req, res) {
    const codigo = req.params.codigo;
    const receita = await Receita.findOne({ where: { codigo: codigo } });

    if (!receita) {
        return res.status(404).json({ erro: true, mensagem: "Receita não encontrada." });
    }

    if (receita.status !== 'ativa') {
        return res.status(400).json({ erro: true, mensagem: "Receita não está ativa." });
    }

    await receita.update({ status: 'dispensada' });

    return res.json({ erro: false, mensagem: "Receita dispensada com sucesso.", receita: receita });
}


// INTEGRAÇÃO — Consome do Prontuário (G5)


// Buscar prontuário do paciente no G5
async function buscarProntuario(req, res) {
    const paciente_id = req.params.paciente_id;

    try {
        const resposta = await fetch(
            `http://localhost:3005/prontuario/paciente/${paciente_id}`,
            { headers: { 'token': req.headers.token } }
        );

        if (resposta.status === 404) {
            return res.status(404).json({ erro: true, mensagem: "Prontuário não encontrado no G5." });
        }

        const dados = await resposta.json();
        return res.json(dados);
    } catch (error) {
        return res.status(502).json({ erro: true, mensagem: "G5 indisponível." });
    }
}

// Buscar registros clínicos do paciente no G5
async function buscarRegistros(req, res) {
    const paciente_id = req.params.paciente_id;

    try {
        const resposta = await fetch(
            `http://localhost:3005/prontuario/paciente/${paciente_id}`,
            { headers: { 'token': req.headers.token } }
        );

        if (resposta.status === 404) {
            return res.status(404).json({ erro: true, mensagem: "Registros não encontrados no G5." });
        }

        const dados = await resposta.json();
        return res.json(dados);
    } catch (error) {
        return res.status(502).json({ erro: true, mensagem: "G5 indisponível." });
    }
}

export default { inserir, listar, listarPorPaciente, selecionar, substituir, validar, dispensar };
