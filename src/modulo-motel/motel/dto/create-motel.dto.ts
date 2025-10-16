import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { Status } from '../common/enums/status.enum';

export class CreateMotelDto {
  @ApiPropertyOptional({ example: 'LUVR Motel Centro', maxLength: 255 })
  @IsString() 
  @Length(1, 255)
  motel_descricao?: string;

  @ApiPropertyOptional({ example: 'Av. Brasil, 1000 - Centro', maxLength: 255 })
  @IsString() 
  @Length(1, 255)
  motel_endereco?: string;

  @ApiPropertyOptional({ example: 'contato@motel.com.br' })
  @IsEmail()
  motel_email?: string;

  @ApiProperty({ example: '12.345.678/0001-99', minLength: 11, maxLength: 18 })
  @IsString() 
  @Length(11, 18)
  motel_cnpj!: string;

  @ApiPropertyOptional({ enum: Status, default: Status.ATIVO })
  @IsEnum(Status)
  motel_ativo?: Status;
}
