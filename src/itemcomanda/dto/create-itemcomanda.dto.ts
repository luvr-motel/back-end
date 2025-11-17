import { ApiProperty } from '@nestjs/swagger';

export class CreateItemcomandaDto {
  @ApiProperty({
    example: 12,
    description: 'ID da locação (checkin)',
  })
  locacao_id: number;

  @ApiProperty({
    example: 3,
    description: 'ID do produto consumido',
  })
  produto_id: number;

  @ApiProperty({
    example: 2,
    description: 'Quantidade do item',
  })
  qtde: number;

  @ApiProperty({
    example: 15.90,
    description: 'Valor do item',
  })
  valor: number;

  @ApiProperty({
    example: null,
    description: 'ID da comanda, caso já exista. Caso null, cria nova.',
    required: false,
  })
  comanda_id?: number;
}
