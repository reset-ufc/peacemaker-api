export const GITHUB_AUTHORIZATION_URL = (
  githubClientId: string,
  redirectUri: string,
  githubState: string,
) =>
  `https://github.com/login/oauth/authorize?client_id=${githubClientId}&response_type=code&state=${githubState}&redirect_uri=${redirectUri}`;

export const GITHUB_TOKEN_URL = () =>
  'https://github.com/login/oauth/access_token';

export const GITHUB_PROFILE_URL = () => 'https://api.github.com/user';

export const GITHUB_USER_REPOSITORIES_URL = () =>
  'https://api.github.com/user/repos';
