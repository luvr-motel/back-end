import { Module } from '@nestjs/common';
import { RecebimentoService } from './recebimento.service';
import { RecebimentoController } from './recebimento.controller';

@Module({
  controllers: [RecebimentoController],
  providers: [RecebimentoService],
})
export class RecebimentoModule {}
