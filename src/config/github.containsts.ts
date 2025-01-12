export const GITHUB_AUTHORIZATION_URL = (
  githubClientId: string,
  githubState: string,
) =>
  `https://github.com/login/oauth/authorize?client_id=${githubClientId}&response_type=code&state=${githubState}`;

export const GITHUB_TOKEN_URL = () =>
  'https://github.com/login/oauth/access_token';

export const GITHUB_PROFILE_URL = () => 'https://api.github.com/user';
