import { AppConfig } from './interfaces/app-config';

export default (): AppConfig => ({
  server: {
    url: process.env.NEST_API_SERVER_URL!,
    port: parseInt(process.env.NEST_API_PORT!, 10),
  },

  database: {
    mongodb: {
      name: process.env.MONGODB_NAME,
      user: process.env.MONGODB_USER,
      password: process.env.MONGODB_PASSWORD,
      host: process.env.MONGODB_HOST,
      url: process.env.MONGODB_DATABASE_URL!,
    },
  },

  auth: {
    jwt: {
      secret: process.env.AUTH_JWT_SECRET!,
      expiresInSeconds: parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS!, 10),
    },
    github: {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET!,
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL!,
      scope: process.env.GITHUB_OAUTH_SCOPE!,
      personalAccessToken: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
    },
  },
});
