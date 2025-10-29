import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Motel } from './entities/motel.entity';
import { MotelService } from './motel.service';
import { MotelController } from './motel.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Motel])],   
  providers: [MotelService],
  controllers: [MotelController],
  exports: [TypeOrmModule],          
})
export class MotelModule {}
