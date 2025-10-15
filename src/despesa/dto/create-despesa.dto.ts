import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateDespesaDto {
  @ApiProperty({ example: 'Hospedagem equipe comercial' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  despesa_descricao: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  despesa_parcela?: number | null;

  @ApiProperty({ example: true })
  @IsBoolean()
  despesa_aberto: boolean;

  @ApiProperty({ example: 1250.75 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  despesa_valortotal: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  despesatipo_id?: number;
}
