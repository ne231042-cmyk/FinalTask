import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// データベースへの接続設定
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // ログをすっきりさせるために非表示
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Renderのデータベース接続に必要な設定です
    },
  },
});

export default sequelize;