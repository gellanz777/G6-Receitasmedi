import axios from 'axios';
import cookie from 'js-cookie';

function setTokenApi() {
    const token = cookie.get('token');
    api.defaults.headers.common['token'] = token;
}

const api = axios.create({
    baseURL: "http://localhost:3006/"
});

export const get = async (rota) => {
    try {
        setTokenApi();
        const resposta = await api.get(rota);
        return resposta.data;
    }
    catch (erro) {
        throw erro;
    }
};

export const del = async (rota) => {
    try {
        setTokenApi();
        const resposta = await api.delete(rota);
        return resposta.data;
    }
    catch (erro) {
        throw erro;
    }
};

export const post = async (rota, objeto) => {
    try {
        setTokenApi();
        const resposta = await api.post(rota, objeto);
        return resposta.data;
    }
    catch (erro) {
        throw erro;
    }
};

export const put = async (rota, objeto) => {
    try {
        setTokenApi();
        const resposta = await api.put(rota, objeto);
        return resposta.data;
    }
    catch (erro) {
        throw erro;
    }
};
