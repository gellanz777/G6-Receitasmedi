import banco from "../Banco.js";
import { DataTypes } from "sequelize";

const ReceitaItem = banco.define(
    'receita_item',
    {
        idreceitaitem: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idreceita: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        medicamento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dosagem: {
            type: DataTypes.STRING,
            allowNull: false
        },
        posologia: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
);

export default ReceitaItem;
