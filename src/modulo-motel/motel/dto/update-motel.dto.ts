import { PartialType } from '@nestjs/swagger';
import { CreateMotelDto } from './create-motel.dto';

export class UpdateMotelDto extends PartialType(CreateMotelDto) {}
