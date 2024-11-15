import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(doc: User) {
    const result = await new this.userModel(doc).save();
    return result.id;
  }

  async findUserByGithubId(id: number) {
    try {
      const user = await this.userModel.findOne({ githubId: id }).exec();
      if (!user) {
        throw new Error(`Usuário com ID ${id} não encontrado.`);
      }
      return user;
    } catch (error) {
      console.error(`Erro ao buscar usuário pelo ID ${id}`, error.message);
      throw error;
    }
  }

  async updateUser(user: User) {
    // ...
  }
}

//import { CreateUserDto } from './dto/create-user.dto';
//import { AuthProvider } from '@/auth/jwt/entities/jwt.entity';
//import { User } from './entities/user.entity';

/*
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
      displayName: 'John Doe',
      profileUrl: 'https://avatars.githubusercontent.com/u/76269418?v=4',
      username: 'meiazero',
    };
  }
}
*/
