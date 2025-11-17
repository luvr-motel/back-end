import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { CreateItemlocacaoDto } from './create-itemlocacao.dto';

export class UpdateItemlocacaoDto extends PartialType(CreateItemlocacaoDto) {
  @ApiProperty({
    example: 4,
    description: 'Nova quantidade do item',
  })
  qtde: number;
}
