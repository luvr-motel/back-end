import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesatipoService } from './despesatipo.service';
import { DespesatipoController } from './despesatipo.controller';
import { Despesatipo } from './entities/despesatipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Despesatipo])],
  controllers: [DespesatipoController],
  providers: [DespesatipoService],
})
export class DespesatipoModule {}
