import { AppConfig } from './interfaces/app-config';

export default (): AppConfig => ({
  server: {
    url: process.env.API_SERVER_URL!,
    port: parseInt(process.env.API_PORT!),
  },

  database: {
    name: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    url: process.env.DATABASE_URL!,
  },

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS!) || 900,
    },
    github: {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL!,
      scope: process.env.GITHUB_OAUTH_SCOPE!,
    },
  },
});
