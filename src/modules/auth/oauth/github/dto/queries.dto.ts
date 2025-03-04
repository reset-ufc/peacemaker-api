import { IsOptional, IsString } from 'class-validator';

export class AuthorizationQueryDto {
  @IsOptional()
  @IsString()
  client_type: 'web' | 'extension';

  @IsString()
  redirect_uri: string;
}

export class CallbackQueryDto {
  @IsString()
  code: string;

  @IsString()
  state: string;
}
