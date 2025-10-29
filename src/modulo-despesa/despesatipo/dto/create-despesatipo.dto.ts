import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDespesatipoDto {
  @ApiProperty({example: 'Manutenção'})
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  despesatipo_descricao: string;
}
