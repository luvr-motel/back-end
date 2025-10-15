import { Module } from '@nestjs/common';
import { LocacaoTipoService } from './locacao-tipo.service';
import { LocacaoTipoController } from './locacao-tipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocacaoTipo } from './entities/locacao-tipo.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ LocacaoTipo ])],  
  controllers: [LocacaoTipoController],
  providers: [LocacaoTipoService],
  exports: [ TypeOrmModule],
})
export class LocacaoTipoModule {}
