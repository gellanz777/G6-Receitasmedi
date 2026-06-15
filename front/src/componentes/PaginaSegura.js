import cookie from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PaginaSegura({ children }) {
    const navegador = useNavigate();

    useEffect(() => {
        const token = cookie.get('token');
        if (!token) {
            navegador('/login');
        }

    }, []);

    return children;
}

export default PaginaSegura;
