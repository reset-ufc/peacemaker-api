import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { AuthProvider } from '@/auth/jwt/entities/jwt.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  async createUser(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createUserDto: CreateUserDto,
  ): Promise<string | null> {
    const uuid = crypto.randomUUID();

    return String(uuid);
  }

  async findOrCreate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    userId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provider: AuthProvider,
  ): Promise<Partial<User>> {
    // TODO Perform database lookup to extract more information about the user
    // or to create the user if the UserId is unknown to us.
    // For now, we'll skip this and always return the same dummy user, regardless of the `userId`.
    return {
      id: '42195',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: 'https://avatars.githubusercontent.com/u/76269418?v=4',
      githubId: '99999999',
    };
  }
}
