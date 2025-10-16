import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Despesaquarto } from './entities/despesaquarto.entity';
import { DespesaquartoController } from './despesaquarto.controller';
import { DespesaquartoService } from './despesaquarto.service';


@Module({
  imports: [TypeOrmModule.forFeature([ Despesaquarto ])],
  controllers: [ DespesaquartoController ],
  providers: [ DespesaquartoService ],
  exports: [TypeOrmModule],
})
export class DespesaquartoModule {}
