import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DespesageralService } from './despesageral.service';
import { DespesageralController } from './despesageral.controller';
import { Despesageral } from './entities/despesageral.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Despesageral])],
  controllers: [DespesageralController],
  providers: [DespesageralService],
})
export class DespesageralModule {}
