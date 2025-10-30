import { IsNotEmpty, IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UsuarioStatus } from '../entities/usuario.entity';
import { UsuarioRole } from '../entities/usuario-role.enum';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'LUVR.RODRIGO', description: 'Código único de login do usuário.' })
  @IsString({ message: 'usuarioCodigo deve ser uma string.' })
  @IsNotEmpty()
  usuarioCodigo: string;

  @ApiProperty({ example: 'luvr#123', description: 'Senha em texto plano ( será hasheada no servidor ).' })
  @IsString({ message: 'usuarioSenha deve ser uma string.' })
  @IsNotEmpty()
  usuarioSenha: string;

  @ApiPropertyOptional({ enum: UsuarioStatus, example: UsuarioStatus.ATIVO, description: 'Padrão ATIVO se omitido.' })
  @IsEnum(UsuarioStatus)
  usuarioAtivo?: UsuarioStatus;

  @ApiPropertyOptional({ example: 7, type: Number, description: 'ID da Pessoa vinculada.' })
  @IsOptional()
  @IsInt()
  pessoaId?: number;

  @ApiPropertyOptional({ example: 3, type: Number, description: 'ID do Motel (quando habilitado).' })
  @IsOptional() //tirar quando importar modulo motel
  @IsInt()
  motelId?: number;

  @ApiPropertyOptional({ enum: UsuarioRole, example: 'Recepcionista', description: 'Cargo usuário.' })
  @IsEnum(UsuarioRole)
  @IsOptional()
  usuarioRole?: UsuarioRole;
}
