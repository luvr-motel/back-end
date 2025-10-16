import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuartoService } from './quarto.service';
import { QuartoController } from './quarto.controller';
import { Quarto } from './entities/quarto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quarto])],
  controllers: [QuartoController],
  providers: [QuartoService],
  exports: [TypeOrmModule],
})
export class QuartoModule {}
