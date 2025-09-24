import { Module } from '@nestjs/common';
import { QuartoTipoService } from './quarto_tipo.service';
import { QuartoTipoController } from './quarto_tipo.controller';

@Module({
  controllers: [QuartoTipoController],
  providers: [QuartoTipoService],
})
export class QuartoTipoModule {}
