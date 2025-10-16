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

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsInt()
  despesa_parcela: number ;

  @ApiProperty({ example: true })
  @IsBoolean()
  despesa_aberto: boolean;

  @ApiProperty({ example: 1250.75 })
  // @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
  @IsNotEmpty()
  despesa_valortotal: number;

  @ApiProperty({ example: 2 })
  @IsOptional()
  // @Type(() => Number)
  @IsInt()
  despesatipo_id: number;
}
