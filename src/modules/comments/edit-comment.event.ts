import { AcceptCommentSuggestionDto } from './dto/accept-suggestion.dto';

export class EditCommentEvent {
  constructor(
    readonly repositoryOwner: string,
    readonly repositoryName: string,
    readonly commentId: string,
    readonly suggestionContent: string,
    readonly githubToken: string,
    readonly acceptCommentSuggestionDto: AcceptCommentSuggestionDto,
  ) {}
}
