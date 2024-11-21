export class CommentDto {
  repositoryId: string;
  userId: string;
  score: number;
  resolved: boolean;
  classification: string;
  moderation: string;
  likes?: number;
  dislikes?: number;
}
