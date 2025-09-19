import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, Matches, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePessoaDto {
  @ApiProperty({ example: 'Maria Souza', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  pessoaNome: string;

  @ApiPropertyOptional({ example: '12345678901', description: 'Somente dígitos (opcional), 11 dígitos' })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas dígitos' })
  pessoaCpf?: string;

  @ApiPropertyOptional({ example: '+5566998765432', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  pessoaTelefone?: string;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  pessoatipoId?: number;

  @ApiPropertyOptional({ example: 10, nullable: true })
  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  lojaId?: number;
}
