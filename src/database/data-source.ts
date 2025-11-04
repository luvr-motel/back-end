// import 'reflect-metadata';
// import { DataSource } from 'typeorm';

// const isProd = process.env.NODE_ENV === 'production';
// const hasUrl = !!process.env.DATABASE_URL;

// const baseOptions = {
//   type: 'postgres' as const,
//   entities: [__dirname + '/../**/*.entity{.js,.ts}'],
//   migrations: [__dirname + '/migrations/*{.js,.ts}'],
//   logging: false,
// };

// export const AppDataSource = new DataSource(
//   hasUrl
//     ? {
//         ...baseOptions,
//         url: process.env.DATABASE_URL,
//         ssl: isProd ? { rejectUnauthorized: false } : false,
//         synchronize: false,
//       }
//     : {
//         ...baseOptions,
//         host: process.env.DB_HOST,
//         port: Number(process.env.DB_PORT),
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_DATABASE,
//         synchronize: false,
//       }
// );

// export default AppDataSource;

// src/database/data-source.ts
// import 'reflect-metadata';
// import { DataSource } from 'typeorm';

// const isProd = process.env.NODE_ENV === 'production';
// const hasUrl = !!process.env.DATABASE_URL;

// export const AppDataSource = new DataSource(
//   hasUrl
//     ? {
//         type: 'postgres',
//         url: process.env.DATABASE_URL,
//         ssl: isProd ? { rejectUnauthorized: false } : false,
//         synchronize: false,
//         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//         migrations: [__dirname + '/migrations/*{.ts,.js}'],
//         logging: false,
//       }
//     : {
//         type: 'postgres',
//         host: process.env.DB_HOST,
//         port: Number(process.env.DB_PORT),
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_DATABASE,
//         synchronize: false,
//         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//         migrations: [__dirname + '/migrations/*{.ts,.js}'],
//         logging: false,
//       }
// );

// export default AppDataSource;


import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Carrega variáveis do .env em ambiente local
dotenv.config();

const isProd = process.env.NODE_ENV === 'production';
const hasDatabaseUrl = !!process.env.DATABASE_URL;

export const AppDataSource = new DataSource(
  hasDatabaseUrl
    ? {
        type: 'postgres',
        url: process.env.DATABASE_URL,
        ssl: isProd ? { rejectUnauthorized: false } : false,
        synchronize: false,
        logging: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }
    : {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'meubanco',
        synchronize: false,
        logging: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      }
);

export default AppDataSource;
