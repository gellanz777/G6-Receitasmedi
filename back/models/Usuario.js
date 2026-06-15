import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Usuario = banco.define(
    'usuario',
    {
        idusuario: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }
);

export default Usuario;
