import { get } from "../servicos/api";
import { useEffect, useState } from "react";

function PaginaReceitaLista() {
    const [dados, setDados] = useState([]);

    const listar = async () => {
        try {
            const resposta = await get('receita');
            setDados(resposta);
        } catch (error) {
            console.log("Erro ao listar: " + error);
        }
    }

    useEffect(() => {
        listar();
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

    return (
        <div className="container my-5">
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 text-success">Receitas Emitidas</h4>
                    <a href="/receita" className="btn btn-success">
                        <i className="bi bi-plus-circle me-2" />
                        Nova Receita
                    </a>
                </div>
                <div className="card-body p-0">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th className="ps-4">ID</th>
                                <th>Código</th>
                                <th>Profissional</th>
                                <th>CRM</th>
                                <th>Paciente</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th className="text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dados.map((d, i) => (
                                <tr key={i}>
                                    <td className="ps-4">{d.idreceita}</td>
                                    <td><code>{d.codigo ? d.codigo.substring(0, 8) + '...' : ''}</code></td>
                                    <td>{d.profissional}</td>
                                    <td>{d.crm}</td>
                                    <td>#{d.paciente_id}</td>
                                    <td>{formatarData(d.emitida_em)}</td>
                                    <td><span className={corStatus(d.status)}>{d.status}</span></td>
                                    <td className="text-center">
                                        <a
                                            href={'/receita/' + d.idreceita}
                                            className="btn btn-sm btn-outline-success"
                                            title="Ver Receita"
                                        >
                                            <i className="bi bi-eye" /> Ver
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {dados.length === 0 && (
                        <div className="text-center text-muted py-5">
                            Nenhuma receita encontrada. Clique em "Nova Receita" para emitir a primeira.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaginaReceitaLista;
