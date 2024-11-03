import { userSchema } from '../entities/user.entity';
import { createZodDto } from 'nestjs-zod';

export class CreateUserDto extends createZodDto(userSchema) {}
