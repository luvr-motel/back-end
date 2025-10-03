import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDespesaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @IsOptional()
  @IsInt()
  parcela?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  prestador?: string;

  @IsString()
  @IsNotEmpty()
  itens: string;

  @IsOptional()
  @IsInt()
  despesatipoId?: number;
}
