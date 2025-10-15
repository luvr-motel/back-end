// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

// export class CreateDespesaquartoDto {
//   @ApiProperty({ example: 'Manutenção do ar-condicionado', maxLength: 256 })
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(256)
//   despesaquarto_descricao: string;

//   @ApiPropertyOptional({ example: 2, minimum: 1 })
//   @IsOptional()
//   @IsInt()
//   @IsPositive()
//   despesaquarto_parcela?: number;

//   @ApiProperty({ example: 'Filtro, gás refrigerante', maxLength: 256 })
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(256)
//   despesaquarto_itens: string;

//   @ApiPropertyOptional({ example: 1, minimum: 1 })
//   @IsOptional()
//   @IsInt()
//   @IsPositive()
//   despesatipo_id?: number;

//   @ApiProperty({ example: 3, minimum: 1 })
//   @IsInt()
//   @IsPositive()
//   quarto_id: number;

//   @ApiPropertyOptional({ example: 12, minimum: 1 })
//   @IsOptional()
//   @IsInt()
//   @IsPositive()
//   pessoa_id?: number;

//   @ApiProperty({ example: 5, minimum: 1 })
//   @IsInt()
//   @IsPositive()
//   usuario_id: number;

//   @ApiProperty({ example: 1, minimum: 1 })
//   @IsInt()
//   @IsPositive()
//   motel_id: number;
// }
