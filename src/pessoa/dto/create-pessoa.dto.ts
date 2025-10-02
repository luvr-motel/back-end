import { IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength, Matches, Length } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePessoaDto {
  @ApiProperty({ example: 'Max Verstappen', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  pessoaNome: string;

  @ApiPropertyOptional({
    example: '12345678901',
    description: 'Somente dígitos'
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value == null || value === '') return undefined;
    return typeof value === 'string' ? value.replace(/\D/g, '') : String(value);
  })
  @Length(11, 11, { message: 'CPF deve ter 11 dígitos' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter apenas dígitos' })
  pessoaCpf?: string;

  @ApiPropertyOptional({
    example: '66998765432',
    description: 'Somente dígitos; armazenado como varchar(20).'
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value == null || value === '') return undefined;
    const digits = String(value).replace(/\D/g, '');
    return digits || undefined;
  })
  @IsString()
  @MaxLength(20)
  @Matches(/^\d{8,20}$/, { message: 'Telefone deve conter de 8 a 20 dígitos' })
  pessoaTelefone?: string;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pessoatipoId?: number;
}
