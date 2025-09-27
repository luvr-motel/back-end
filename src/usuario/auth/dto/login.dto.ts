import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'rodrigo' })
  @IsString() @IsNotEmpty()
  usuarioCodigo: string;

  @ApiProperty({ example: 'senhadificildemaiscorinthians' })
  @IsString() @MinLength(8)
  senha: string;
}
