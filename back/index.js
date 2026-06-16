import Express from "express";
import cors from "cors";
import banco from "./Banco.js";
import usuario from "./controllers/UsuarioController.js";
import receita from "./controllers/ReceitaController.js";

try {
    await banco.authenticate();
    console.log('Banco conectado com sucesso.');
} catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
}

const api = Express();
api.use(Express.json());
api.use(cors());

api.get('/teste', (req, res) => {
    res.send('G6 - Receitas Médicas funcionando');
});


// USUÁRIOS (autenticação)
// Login - único método que não valida o token
api.put('/usuario/login', usuario.login);

api.get('/usuario', usuario.validartoken, usuario.listar);
api.get('/usuario/:idusuario', usuario.validartoken, usuario.selecionar);
api.post('/usuario', usuario.validartoken, usuario.inserir);
api.put('/usuario/:idusuario/definirsenha', usuario.validartoken, usuario.definirsenha);

// RECEITAS

// Feature 1 - Emissão de receitas (POST)
api.post('/receita', usuario.validartoken, receita.inserir);

// Feature 3 - Consulta de receitas
api.get('/receita', usuario.validartoken, receita.listar);
api.get('/receita/:idreceita', usuario.validartoken, receita.selecionar);
api.get('/receita/paciente/:paciente_id', usuario.validartoken, receita.listarPorPaciente);

// Feature 2 - Imutabilidade (substituição — NÃO existe PUT nem DELETE)
api.post('/receita/:idreceita/substituir', usuario.validartoken, receita.substituir);


// INTEGRAÇÃO — Fornece para Farmácia (G8)

api.get('/receita/validar/:codigo', usuario.validartoken, receita.validar);
api.post('/receita/dispensar/:codigo', usuario.validartoken, receita.dispensar);

// INTEGRAÇÃO — Consome do Prontuário (G5)


api.listen(3006, () => { console.log('Receitas Médicas rodando na porta 3006...') });
