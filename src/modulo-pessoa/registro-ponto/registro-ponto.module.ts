import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { RegistroPonto } from './entities/registro-ponto.entity';
import { RegistroPontoService } from './registro-ponto.service';
import { RegistroPontoController } from './registro-ponto.controller';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { MotelModule } from 'src/modulo-motel/motel/motel.module';

@Module({
    imports: [
    TypeOrmModule.forFeature([RegistroPonto, Usuario, Motel]),
    UsuarioModule,
    MotelModule,
  ],
  controllers: [RegistroPontoController],
  providers: [RegistroPontoService],
  exports: [TypeOrmModule],
})
export class RegistroPontoModule {}
