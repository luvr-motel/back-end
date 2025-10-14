import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsInt, IsNotEmpty } from "class-validator"

export class CreateEstoqueProdutoDto {

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({example: 16})
    estoqueProduto_fisico: number

    @IsBoolean()
    estoqueProduto_ativo: boolean

    // produto_id
    // motel_id
}

