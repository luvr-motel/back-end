import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesaService } from './despesa.service';
import { DespesaController } from './despesa.controller';
import { Despesa } from './entities/despesa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Despesa])],
  controllers: [DespesaController],
  providers: [DespesaService],
  exports:[TypeOrmModule]
})
export class DespesageralModule {}
