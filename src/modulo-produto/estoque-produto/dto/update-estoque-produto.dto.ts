import { PartialType } from '@nestjs/swagger';
import { CreateEstoqueProdutoDto } from './create-estoque-produto.dto';

export class UpdateEstoqueProdutoDto extends PartialType(CreateEstoqueProdutoDto) {}
