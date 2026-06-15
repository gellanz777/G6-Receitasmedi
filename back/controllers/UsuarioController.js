import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

async function listar(req, res) {
    const dados = await Usuario.findAll();
    return res.json(dados);
}

async function selecionar(req, res) {
    const idusuario = req.params.idusuario;
    const dados = await Usuario.findByPk(idusuario);
    return res.json(dados);
}

async function inserir(req, res) {
    const nome = req.body.nome;
    const email = req.body.email;

    const dados = await Usuario.create({
        nome: nome,
        email: email
    });

    return res.json(dados);
}

async function definirsenha(req, res) {
    const idusuario = req.params.idusuario;

    const senha = req.body.senha;
    const confirmacao = req.body.confirmacao;

    if (senha !== confirmacao) {
        res.json({ erro: true, mensagem: "Senha e confirmação devem ser iguais." });
        return;
    }

    const senhacriptografada = await bcrypt.hash(senha, 10);

    const dados = await Usuario.update({
        senha: senhacriptografada,
        token: null
    }, {
        where: { idusuario: idusuario }
    });

    res.json(dados);
}

async function login(req, res) {
    const senha = req.body.senha;
    const email = req.body.email;

    const usuario = await Usuario.findOne({ where: { email: email } });

    if (!usuario) {
        res.status(404).json({ erro: true, mensagem: "Usuário não encontrado." });
        return;
    }

    const senhavalida = await bcrypt.compare(senha, usuario.senha);

    if (!senhavalida) {
        res.status(404).json({ erro: true, mensagem: "Senha incorreta." });
        return;
    }

    const token = await uuidv4();

    await usuario.update({ token: token });

    res.status(200).json({ erro: false, mensagem: "Usuário autenticado com sucesso.", token });
}

async function validartoken(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        res.status(404).json({ erro: true, mensagem: "Token é obrigatório." });
        return;
    }

    const usuario = await Usuario.findOne({ where: { token: token } });

    if (!usuario) {
        res.status(404).json({ erro: true, mensagem: "Token inválido." });
        return;
    }

    next();
}

export default { listar, selecionar, inserir, definirsenha, login, validartoken };
