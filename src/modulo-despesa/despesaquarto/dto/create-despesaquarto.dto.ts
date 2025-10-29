import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateDespesaquartoDto {
  @ApiProperty({ example: 'Manutenção do ar-condicionado' })
  @IsString()
  @IsNotEmpty()
//   @MaxLength(256)
  despesaquarto_descricao: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  despesaquarto_parcela: number;

  @ApiProperty({ example: 'Filtro, gás refrigerante' })
  @IsString()
  @IsNotEmpty()
//   @MaxLength(256)
  despesaquarto_itens: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  despesatipo_id: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsPositive()
  quarto_id: number;

  @ApiProperty({ example: 12 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  pessoa_id: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  usuario_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  motel_id: number;
}
