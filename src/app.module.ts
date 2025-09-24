import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config'
import { PessoaModule } from './pessoa/pessoa.module';
import { PessoatipoModule } from './pessoatipo/pessoatipo.module';

@Module({
  imports: [ 
  ConfigModule.forRoot({
    envFilePath: '.env', 
    isGlobal: true  
  }),
  TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [  ],
      migrations: [__dirname + '/database/migrations/*{.js,.ts}'],
      synchronize: true,
      logging: ['query', 'error', 'schema'], 
      autoLoadEntities: true,
  }),
  PessoaModule,
  PessoatipoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
 