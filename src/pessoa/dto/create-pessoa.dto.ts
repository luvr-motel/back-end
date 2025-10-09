import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePessoaDto {
  @ApiProperty({
    example: 'Maria da Silva',
    maxLength: 255,
    description: 'Nome completo da pessoa.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  pessoa_nome: string;

  @ApiPropertyOptional({
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
    pattern: '^\\d+$',
    description: 'CPF somente com dígitos (11 caracteres).',
  })
  @IsOptional()
  @IsString()
  @Length(11, 11)
  @Matches(/^\d+$/, { message: 'CPF deve conter apenas dígitos' })
  pessoa_cpf?: string;

  @ApiPropertyOptional({
    example: '44999998888',
    maxLength: 20,
    pattern: '^\\d+$',
    description: 'Telefone somente com dígitos (até 20).',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^\d+$/, { message: 'Telefone deve conter apenas dígitos' })
  pessoa_telefone?: string;

  @ApiProperty({
    example: 1,
    type: Number,
    description: 'ID do tipo de pessoa (FK de pessoatipo).',
  })
  @IsInt()
  pessoatipo_id: number;
}
