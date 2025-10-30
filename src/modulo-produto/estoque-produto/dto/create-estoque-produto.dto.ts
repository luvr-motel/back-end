import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from "class-validator"

export class CreateEstoqueProdutoDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({example: 16})
    estoqueProduto_fisico: number

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: true })
    estoqueProduto_ativo: boolean

    @IsInt()
    @IsOptional()
    @ApiProperty({ example: 1 })
    produto_id?: number

    @IsInt()
    @IsOptional()
    @ApiProperty({ example: 1 })
    motel_id?: number
}

