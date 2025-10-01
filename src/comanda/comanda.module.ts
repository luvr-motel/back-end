import { Module } from '@nestjs/common';
import { ComandaService } from './comanda.service';
import { ComandaController } from './comanda.controller';
import { Comanda } from './entities/comanda.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:     [ TypeOrmModule.forFeature([ Comanda ])],
  controllers: [ComandaController],
  providers:   [ComandaService],
  exports:     [ TypeOrmModule ],
})
export class ComandaModule {}
