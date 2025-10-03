import { Module } from '@nestjs/common';
import { LocacaoTipoService } from './locacao-tipo.service';
import { LocacaoTipoController } from './locacao-tipo.controller';

@Module({
  controllers: [LocacaoTipoController],
  providers: [LocacaoTipoService],
})
export class LocacaoTipoModule {}
