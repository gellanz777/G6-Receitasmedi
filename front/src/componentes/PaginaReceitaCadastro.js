import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { post } from "../servicos/api";

function PaginaReceitaCadastro() {
    const navegador = useNavigate();

    const [prontuario_id, setProntuarioId] = useState('');
    const [paciente_id, setPacienteId] = useState('');
    const [profissional, setProfissional] = useState('');
    const [crm, setCrm] = useState('');
    const [orientacoes, setOrientacoes] = useState('');
    const [itens, setItens] = useState([{ medicamento: '', dosagem: '', posologia: '', quantidade: 1 }]);

    const voltar = () => {
        navegador('/');
    }

    const adicionarItem = () => {
        setItens([...itens, { medicamento: '', dosagem: '', posologia: '', quantidade: 1 }]);
    }

    const removerItem = (indice) => {
        if (itens.length === 1) {
            alert('A receita deve ter ao menos 1 medicamento.');
            return;
        }
        setItens(itens.filter((item, i) => i !== indice));
    }

    const atualizarItem = (indice, campo, valor) => {
        const novosItens = itens.map((item, i) => {
            if (i === indice) {
                return { ...item, [campo]: valor };
            }
            return item;
        });
        setItens(novosItens);
    }

    const salvar = async () => {
        const objeto = {
            "prontuario_id": prontuario_id,
            "paciente_id": paciente_id,
            "profissional": profissional,
            "crm": crm,
            "orientacoes": orientacoes,
            "itens": itens.map(item => ({
                ...item,
                quantidade: Number(item.quantidade)
            }))
        }

        try {
            const resposta = await post('receita', objeto);
            alert('Receita emitida com sucesso!');
            navegador('/receita/' + resposta.idreceita);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.mensagem) {
                alert(error.response.data.mensagem);
            } else {
                console.log('Erro ao inserir: ' + error);
            }
        }
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow border-0">
                        <div className="card-header bg-success text-white py-3">
                            <h5 className="mb-0">Emitir Nova Receita</h5>
                        </div>
                        <div className="card-body p-4">
                            <>
                                <p className="text-muted mb-4">
                                    A receita será validada contra o registro clínico do Prontuário (G5). Após emitida, não poderá ser alterada.
                                </p>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">ID do Prontuário (G5)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            required=""
                                            placeholder="Ex: 1"
                                            onChange={(e) => setProntuarioId(e.target.value)}
                                            value={prontuario_id}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">ID do Paciente (G1)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            required=""
                                            placeholder="Ex: 7"
                                            onChange={(e) => setPacienteId(e.target.value)}
                                            value={paciente_id}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Profissional</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required=""
                                            placeholder="Dra. Ana Souza"
                                            onChange={(e) => setProfissional(e.target.value)}
                                            value={profissional}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">CRM</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            required=""
                                            placeholder="SC-12345"
                                            onChange={(e) => setCrm(e.target.value)}
                                            value={crm}
                                        />
                                    </div>
                                </div>

                                <hr />
                                <h6 className="fw-bold mb-3">
                                    <i className="bi bi-capsule me-1" />
                                    Medicamentos
                                </h6>

                                {itens.map((item, i) => (
                                    <div key={i} className="card bg-light mb-3">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <strong>Medicamento #{i + 1}</strong>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removerItem(i)}
                                                >
                                                    <i className="bi bi-trash" /> Remover
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label">Medicamento</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Amoxicilina"
                                                        onChange={(e) => atualizarItem(i, 'medicamento', e.target.value)}
                                                        value={item.medicamento}
                                                    />
                                                </div>
                                                <div className="col-md-6 mb-2">
                                                    <label className="form-label">Dosagem</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="500mg"
                                                        onChange={(e) => atualizarItem(i, 'dosagem', e.target.value)}
                                                        value={item.dosagem}
                                                    />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-8 mb-2">
                                                    <label className="form-label">Posologia</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="1 cápsula a cada 8h por 7 dias"
                                                        onChange={(e) => atualizarItem(i, 'posologia', e.target.value)}
                                                        value={item.posologia}
                                                    />
                                                </div>
                                                <div className="col-md-4 mb-2">
                                                    <label className="form-label">Quantidade</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="1"
                                                        onChange={(e) => atualizarItem(i, 'quantidade', e.target.value)}
                                                        value={item.quantidade}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button className="btn btn-outline-success mb-3" onClick={adicionarItem}>
                                    <i className="bi bi-plus-circle me-1" />
                                    Adicionar Medicamento
                                </button>

                                <hr />

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Orientações Gerais (opcional)</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Tomar com alimentos, evitar álcool..."
                                        onChange={(e) => setOrientacoes(e.target.value)}
                                        value={orientacoes}
                                    />
                                </div>

                                <hr />
                                <div className="d-flex justify-content-between">
                                    <a onClick={(e) => voltar()} className="btn btn-link text-muted">
                                        Voltar para a lista
                                    </a>
                                    <button onClick={(e) => salvar()} className="btn btn-success px-5">
                                        Emitir Receita
                                    </button>
                                </div>
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaginaReceitaCadastro;
