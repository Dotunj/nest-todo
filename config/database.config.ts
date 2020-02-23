import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    type: process.env.DB_TYPE,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE_NAME
}))