import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuartoTipoService } from './quarto_tipo.service';
import { QuartoTipoController } from './quarto_tipo.controller';
import { QuartoTipo } from './entities/quarto_tipo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuartoTipo])],
  controllers: [QuartoTipoController],
  providers: [QuartoTipoService],
})
export class QuartoTipoModule {}
