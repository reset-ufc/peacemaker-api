import { IsString } from 'class-validator';

export class UpdateGithubTokenDto {
  @IsString()
  github_token: string;
}
