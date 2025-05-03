import { PartialType } from '@nestjs/swagger';
import { CreateAuthenticationDto } from './create-users.dto';

export class UpdateAuthenticationDto extends PartialType(CreateAuthenticationDto) {}
