import { Module } from '@nestjs/common';
import { DespesageralService } from './despesageral.service';
import { DespesageralController } from './despesageral.controller';

@Module({
  controllers: [DespesageralController],
  providers: [DespesageralService],
})
export class DespesageralModule {}
