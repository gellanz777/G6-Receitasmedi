import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { get } from "../servicos/api";

function PaginaReceitaDetalhe() {
    const navegador = useNavigate();
    const { id } = useParams();

    const [receita, setReceita] = useState(null);

    const selecionar = async () => {
        try {
            const resposta = await get('receita/' + id);
            setReceita(resposta);
        } catch (error) {
            console.log("Erro ao buscar receita: " + error);
        }
    }

    useEffect(() => {
        selecionar();
    }, []);

    const formatarData = (data) => {
        if (!data) return '';
        return new Date(data).toLocaleDateString('pt-BR') + ' ' + new Date(data).toLocaleTimeString('pt-BR');
    }

    const corStatus = (status) => {
        if (status === 'ativa') return 'badge bg-success';
        if (status === 'substituida') return 'badge bg-warning text-dark';
        if (status === 'dispensada') return 'badge bg-secondary';
        return 'badge bg-light';
    }

    if (!receita) {
        return (
            <div className="container my-5 text-center">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <a onClick={() => navegador('/')} className="btn btn-link text-muted mb-3" style={{ cursor: 'pointer' }}>
                        <i className="bi bi-arrow-left me-1" />
                        Voltar para a lista
                    </a>

                    <div className="card shadow border-0">
                        <div className="card-header bg-success text-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">
                                <i className="bi bi-file-earmark-medical me-2" />
                                Receita #{receita.idreceita}
                            </h5>
                            <span className={corStatus(receita.status)}>{receita.status}</span>
                        </div>
                        <div className="card-body p-4">

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label text-muted small">Profissional</label>
                                    <p className="fw-bold mb-0">{receita.profissional}</p>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label text-muted small">CRM</label>
                                    <p className="fw-bold mb-0">{receita.crm}</p>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label text-muted small">Emitida em</label>
                                    <p className="fw-bold mb-0">{formatarData(receita.emitida_em)}</p>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">Paciente (ID)</label>
                                    <p className="fw-bold mb-0">#{receita.paciente_id}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">Prontuário (ID)</label>
                                    <p className="fw-bold mb-0">#{receita.prontuario_id}</p>
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label text-muted small">Código de Validação</label>
                                    <p className="mb-0"><code>{receita.codigo}</code></p>
                                </div>
                            </div>

                            <hr />

                            <h6 className="fw-bold mb-3">
                                <i className="bi bi-capsule me-1" />
                                Medicamentos Prescritos
                            </h6>

                            <table className="table table-bordered">
                                <thead className="table-light">
                                    <tr>
                                        <th>Medicamento</th>
                                        <th>Dosagem</th>
                                        <th>Posologia</th>
                                        <th>Qtd</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receita.itens && receita.itens.map((item, i) => (
                                        <tr key={i}>
                                            <td className="fw-bold">{item.medicamento}</td>
                                            <td>{item.dosagem}</td>
                                            <td>{item.posologia}</td>
                                            <td>{item.quantidade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {receita.orientacoes && (
                                <>
                                    <h6 className="fw-bold mt-3">Orientações</h6>
                                    <p>{receita.orientacoes}</p>
                                </>
                            )}

                            {receita.substituida_por && (
                                <div className="alert alert-warning mt-3">
                                    <i className="bi bi-exclamation-triangle me-1" />
                                    Esta receita foi substituída pela receita{' '}
                                    <a href={'/receita/' + receita.substituida_por}>#{receita.substituida_por}</a>.
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PaginaReceitaDetalhe;
