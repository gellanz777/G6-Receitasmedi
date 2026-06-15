import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const Receita = banco.define(
    'receita',
    {
        idreceita: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        codigo: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4
        },
        prontuario_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        paciente_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        profissional: {
            type: DataTypes.STRING,
            allowNull: false
        },
        crm: {
            type: DataTypes.STRING,
            allowNull: false
        },
        orientacoes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ativa'
        },
        substituida_por: {
            type: DataTypes.BIGINT,
            allowNull: true
        },
        emitida_em: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }
);

export default Receita;
