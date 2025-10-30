import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';
import { MotelStatus as Status } from '../entities/motel.entity';

export class CreateMotelDto {
  @ApiProperty({ example: 'Amantes Motel' })
  @IsString({ message: 'motel_descricao deve ser uma string' })
  @IsNotEmpty({ message: 'motel_descricao não pode ser vazio' })
  @MaxLength(255, { message: 'motel_descricao deve ter no máximo 255 caracteres' })
  motel_descricao: string;

  @ApiPropertyOptional({ example: 'Cidade Universitária, Rua das Palmeiras, nº 123' })
  @IsString({ message: 'motel_endereco deve ser uma string' })
  @IsNotEmpty({ message: 'motel_endereco não pode ser vazio' })
  @MaxLength(255, { message: 'motel_endereco deve ter no máximo 255 caracteres' })
  motel_endereco: string;

  @ApiPropertyOptional({ example: 'contato@motel.com.br' })
  @IsEmail({}, { message: 'motel_email deve ser um e-mail válido' })
  @MaxLength(255, { message: 'motel_email deve ter no máximo 255 caracteres' })
  motel_email: string;

  @ApiProperty({ example: '12.345.678/0001-99' })
  @IsString({ message: 'motel_cnpj deve ser uma string' })
  @IsNotEmpty({ message: 'motel_cnpj não pode ser vazio' })
  @Length(18, 18, { message: 'motel_cnpj deve ter entre 14 e 18 caracteres (incluindo pontuação)' })
  motel_cnpj: string;

  @ApiProperty({ enum: Status, default: Status.ATIVO })
  @IsEnum(Status, { message: 'motel_ativo deve ser ATIVO ou INATIVO' })
  motel_ativo: Status;
}
