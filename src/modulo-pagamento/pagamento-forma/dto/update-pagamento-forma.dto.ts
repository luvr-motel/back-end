import { PartialType } from '@nestjs/mapped-types';
import { CreatePagamentoFormaDto } from './create-pagamento-forma.dto';

export class UpdatePagamentoFormaDto extends PartialType(CreatePagamentoFormaDto) {}
