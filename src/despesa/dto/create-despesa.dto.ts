import { ApiProperty } from '@nestjs/swagger';
import {IsBoolean,IsInt,IsNotEmpty,IsNumber,IsOptional,IsString,MaxLength,} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDespesaDto {
  @ApiProperty( {example:'vitor gotoototot'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  despesa_descricao: string;

  @IsOptional()
  @IsInt()
  despesa_parcela?: number | null;

  @ApiProperty( {example:'true'})
  @IsBoolean()
  despesa_aberto: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  despesa_valortotal: number;
}
