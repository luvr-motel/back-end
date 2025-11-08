import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { RegistroPonto } from './entities/registro-ponto.entity';
import { RegistroPontoService } from './registro-ponto.service';
import { RegistroPontoController } from './registro-ponto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroPonto])],
  controllers: [RegistroPontoController],
  providers: [RegistroPontoService],
  exports: [TypeOrmModule],
})
export class RegistroPontoModule {}
