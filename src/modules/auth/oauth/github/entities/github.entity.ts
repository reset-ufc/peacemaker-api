interface GitHubPlan {
  readonly name: string;
  readonly space: number;
  readonly private_repos: number;
  readonly collaborators: number;
}

export interface GithubUser {
  readonly login: string;
  readonly id: number;
  readonly node_id: string;
  readonly avatar_url: string;
  readonly gravatar_id: string;
  readonly url: string;
  readonly html_url: string;
  readonly followers_url: string;
  readonly following_url: string;
  readonly gists_url: string;
  readonly starred_url: string;
  readonly subscriptions_url: string;
  readonly organizations_url: string;
  readonly repos_url: string;
  readonly events_url: string;
  readonly received_events_url: string;
  readonly type: string;
  readonly site_admin: boolean;
  readonly name: string;
  readonly company: string;
  readonly blog: string;
  readonly location: string;
  readonly email: string;
  readonly hireable: boolean;
  readonly bio: string;
  readonly twitter_username: string;
  readonly public_repos: number;
  readonly public_gists: number;
  readonly followers: number;
  readonly following: number;
  readonly created_at: string;
  readonly updated_at: string;
  readonly private_gists: number;
  readonly total_private_repos: number;
  readonly owned_private_repos: number;
  readonly disk_usage: number;
  readonly collaborators: number;
  readonly two_factor_authentication: boolean;
  readonly plan: GitHubPlan;
}

export type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
};
