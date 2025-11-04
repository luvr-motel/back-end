import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecebimentoService } from './recebimento.service';
import { RecebimentoController } from './recebimento.controller';
import { Recebimento } from './entities/recebimento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recebimento])],
  controllers: [RecebimentoController],
  providers: [RecebimentoService],
  exports: [TypeOrmModule],
})
export class RecebimentoModule {}
