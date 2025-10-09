import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDespesaDto {
  @ApiProperty( {example:'vitor gotoototot'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  despesa_descricao: string;

  @IsOptional()
  @IsInt()
  despesa_parcela?: number;


  @IsOptional()
  @IsString()
  @MaxLength(255)
  despesa_prestador?: string;

  @IsString()
  @IsNotEmpty()
  despesa_itens: string;

  @IsOptional()
  @IsInt()
  despesatipoId?: number;
}
