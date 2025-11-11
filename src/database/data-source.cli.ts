import 'reflect-metadata';
import { DataSource, type DataSourceOptions } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';
const hasUrl = !!process.env.DATABASE_URL;

const options: DataSourceOptions = hasUrl
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: isProd ? { rejectUnauthorized: false } : false,
      synchronize: true,
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
      ],
      migrations: [
        __dirname + '/migrations/*{.ts,.js}',
      ],
      logging: false,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: true,
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}',
      ],
      migrations: [
        __dirname + '/migrations/*{.ts,.js}',
      ],
      logging: false,
    };

const CliDataSource = new DataSource(options);
export default CliDataSource;

