import { Sequelize } from "sequelize";
import 'dotenv/config';

const banco = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        define: {
            timestamps: false,
            freezeTableName: true
        }
    }
);

export default banco;