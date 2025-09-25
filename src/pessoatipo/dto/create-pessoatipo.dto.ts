import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePessoaTipoDto {
  @ApiProperty({ example: 'Fornecedor', maxLength: 120 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  descricao: string;
}
