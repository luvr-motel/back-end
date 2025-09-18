import { IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateQuartoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    quarto_descricao : string;

    @IsString()
    quarto_atributos;

    @IsBoolean()
    quarto_ativo

    @IsInt()
    quartotipo_id

}
// table quarto {
//   quarto_id        integer [primary key]
//   quarto_descricao varchar [not null]
//   quarto_atributos varchar [not null] // array
//   quarto_ativo     status
//   quartotipo_id    integer
//   quarto_inclusao  timestamp // default_timestamp
//   quarto_exclusao  timestamp
