import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, Matches } from 'class-validator';
import { MotelStatus as Status } from '../entities/motel.entity';

export class CreateMotelDto {
  @ApiProperty({ example: 'Amantes Motel' })
  @IsString({ message: 'motel_descricao deve ser uma string' })
  @IsNotEmpty()
  motel_descricao: string;

  @ApiPropertyOptional({ example: 'Cidade Universitaria' })
  @IsString({ message: 'motel_endereco deve ser uma string' })
  @IsNotEmpty()
  motel_endereco: string;

  @ApiPropertyOptional({ example: 'contato@motel.com.br' })
  @IsEmail({}, { message: 'motel_email deve ser um e-mail válido' })
  motel_email: string;

  @ApiProperty({ example: '12.345.678/0001-99' })
  @IsString({ message: 'motel_cnpj deve ser uma string' })
  @IsNotEmpty()
  motel_cnpj: string;

  @ApiProperty({ enum: Status, default: Status.ATIVO })
  @IsEnum(Status, { message: 'motel_ativo deve ser ATIVO ou INATIVO' })
  motel_ativo: Status;
}
