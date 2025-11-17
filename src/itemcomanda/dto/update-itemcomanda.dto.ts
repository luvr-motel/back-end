import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CreateItemcomandaDto } from './create-itemcomanda.dto';

export class UpdateItemcomandaDto extends PartialType(CreateItemcomandaDto) {
  @ApiProperty({
    example: 4,
    description: 'Nova quantidade do item',
  })
  qtde: number;
}
