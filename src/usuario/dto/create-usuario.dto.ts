import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsEnum, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UsuarioRole } from '../entities/usuario-role.enum';

function normalizeRoles(value: unknown): string[] | undefined {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    const v = value.trim();
    if (!v) return undefined;
    return v.includes(',')
      ? v.split(',').map(s => s.trim()).filter(Boolean)
      : [v];
  }
  return [String(value)];
}

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  usuarioCodigo: string;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsOptional()
  @IsBoolean()
  usuarioAtivo?: boolean;

  @IsOptional()
  @IsEnum(UsuarioRole)
  usuarioRole?: UsuarioRole;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(UsuarioRole, { each: true })
  @Transform(({ value }) => normalizeRoles(value))
  roles?: UsuarioRole[];

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lojaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pessoaId?: number;
}
