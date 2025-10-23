import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {IsBoolean,IsInt,IsNotEmpty,IsNumber,IsOptional,IsString,MaxLength,} from 'class-validator';

export class CreateDespesaDto {
  @ApiProperty({ example: 'Hospedagem equipe comercial' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  despesa_descricao: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  despesa_parcela: number ;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pessoa: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Type(() => Boolean)
  @IsNotEmpty()
  despesa_aberto: boolean;
  
  @ApiProperty({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  despesatipo_id: number;

  @ApiProperty({ example: 1250.75 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
  @IsNotEmpty()
  despesa_total: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  usuario_id: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  motel_id: number;
}
