import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { Status } from '../common/enums/status.enum';

export class CreateMotelDto {
  @ApiProperty({ example: 'LUVR Motel Centro'})
  @IsString() 
  @Length(255)
  @IsNotEmpty()
  motel_descricao: string;

  @ApiPropertyOptional({ example: 'Av. Brasil, 1000 - Centro' })
  @IsString() 
  @IsNotEmpty()
  @Length(255)
  motel_endereco?: string;

  @ApiProperty({ example: 'contato@motel.com.br' })
  @IsEmail()
  motel_email: string;

  @ApiProperty({ example: '12.345.678/0001-99'})
  @IsString() 
  @IsNotEmpty()
  motel_cnpj: string;

  @ApiProperty({ enum: Status, default: Status.ATIVO })
  @IsEnum(Status)
  motel_ativo: Status;
}
