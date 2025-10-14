import { PartialType } from '@nestjs/swagger';
import { CreatePagamentoFormaDto } from './create-pagamento-forma.dto';

export class UpdatePagamentoFormaDto extends PartialType(CreatePagamentoFormaDto) {}
