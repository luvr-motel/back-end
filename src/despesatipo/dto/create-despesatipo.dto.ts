import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDespesatipoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  descricao: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
}
