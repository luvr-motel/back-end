import { IsNotEmpty, IsOptional, IsString, MaxLength, IsInt, IsPositive, IsEnum, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UsuarioStatus } from '../entities/usuario.entity'; 
import { UsuarioRole } from '../entities/usuario-role.enum';

function normalizeRoles(v:any){
  if (v == null) return undefined;
  if (Array.isArray(v)) return v;
  const s = String(v).trim();
  return s ? s.split(',').map(x=>x.trim()).filter(Boolean) : undefined;
}

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  usuarioCodigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  usuarioSenha: string;

  @IsOptional()
  @IsEnum(UsuarioStatus)
  usuarioAtivo?: UsuarioStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pessoaId?: number; 

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  motelId?: number; 

  @IsOptional()
  @IsArray() 
  @ArrayNotEmpty() 
  @ArrayUnique()
  @IsEnum(UsuarioRole, { each: true })
  @Transform(({ value }) => normalizeRoles(value))
  roles?: UsuarioRole[];           

  @IsOptional()
  @IsEnum(UsuarioRole)
  usuarioRole?: UsuarioRole;       
}
