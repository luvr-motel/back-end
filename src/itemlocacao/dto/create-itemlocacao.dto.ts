import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber } from 'class-validator';

export class CreateItemlocacaoDto {
  @ApiProperty({
    example: 12,
    description: 'ID da locação (checkin)',
  })
  @IsInt()
  locacao_id: number;

  @ApiProperty({
    example: 3,
    description: 'ID do produto consumido',
  })
  @IsInt()
  produto_id: number;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do item',
  })
  @IsInt()
  qtde: number;

  @ApiProperty({
    example: 15.9,
    description: 'Valor do item',
  })
  @IsNumber()
  valor: number;
}
*** End Patch ***!
