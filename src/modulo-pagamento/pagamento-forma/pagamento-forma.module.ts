import { Module } from '@nestjs/common';
import { PagamentoFormaService } from './pagamento-forma.service';
import { PagamentoFormaController } from './pagamento-forma.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentoForma } from './entities/pagamento-forma.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ PagamentoForma ])],
  controllers: [PagamentoFormaController],
  providers: [PagamentoFormaService],
  exports: [ TypeOrmModule ],
})
export class PagamentoFormaModule {}
