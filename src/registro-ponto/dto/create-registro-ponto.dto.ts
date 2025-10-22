import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class CreateRegistroPontoDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @Type(() => Number)
  @IsInt({ message: 'usuario_id deve ser um inteiro válido.' })
  usuario_id: number;

  @ApiPropertyOptional({ example: 10, description: 'ID do motel' })
  @Type(() => Number)
  @IsOptional()
  @IsInt({ message: 'motel_id deve ser um inteiro válido quando informado.' })
  motel_id?: number;

  @ApiProperty({ example: true, description: 'Define o tipo do registro' })
  @Type(() => Boolean)
  @IsBoolean({ message: 'registroponto_entrada deve ser booleano true/false.' })
  registroponto_entrada: boolean;
}
