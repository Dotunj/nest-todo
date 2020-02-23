require("dotenv").config();

const DB_TYPE: any = String(process.env.DB_TYPE);
const DB_PORT: number = Number(process.env.DB_PORT);
const DB_HOST: string = process.env.DB_HOST;
const DB_USERNAME: string = process.env.DB_USERNAME;
const DB_PASSWORD: string = process.env.DB_PASSWORD;
const DB_NAME: string = process.env.DB_DATABASE_NAME;

export const db = {
  DB_TYPE,
  DB_PORT,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME
};
