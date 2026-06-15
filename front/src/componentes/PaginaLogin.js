import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { put } from "../servicos/api";
import cookie from 'js-cookie';

function PaginaLogin() {
    const navegador = useNavigate();

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const login = async () => {
        const objeto = {
            "senha": senha,
            "email": email
        }

        try {
            const resposta = await put('usuario/login', objeto);
            const token = resposta.token;
            cookie.set('token', token);
            navegador('/');
        } catch (error) {
            alert(error.response.data.mensagem);
        }
    }

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-lg-5">
                    <div className="card shadow border-0">
                        <div className="card-header bg-success text-white py-3">
                            <h5 className="mb-0">
                                <i className="bi bi-capsule me-2" />
                                G6 - Receitas Médicas
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">E-mail</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        required=""
                                        placeholder="exemplo@gmail.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Senha</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        required=""
                                        placeholder=""
                                        onChange={(e) => setSenha(e.target.value)}
                                        value={senha}
                                    />
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <button onClick={(e) => login()} className="btn btn-success px-5">
                                        Entrar
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

export default PaginaLogin;
