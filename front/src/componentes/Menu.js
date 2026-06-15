import cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function Menu() {
    const navegador = useNavigate();
    const logoff = () => {
        cookie.remove('token');
        navegador('/login');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
            <div className="container">
                <a className="navbar-brand fw-bold" href="/">
                    <i className="bi bi-capsule me-2" />
                    Receitas Médicas - G6
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link active" href="/">
                                Receitas
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/receita">
                                Nova Receita
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/login" onClick={() => logoff()}>
                                Sair
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Menu;
