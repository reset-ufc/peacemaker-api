export interface AppConfig {
  server: {
    url: string;
    port: number;
  };

  database: {
    mongodb: {
      name?: string;
      user?: string;
      password?: string;
      host?: string;
      url: string;
    };
  };

  auth: {
    jwt: {
      secret: string;
      expiresInSeconds: number;
    };

    github: {
      clientId: string;
      clientSecret: string;
      callbackURL: string;
      scope: string;
      personalAccessToken: string;
    };
  };

  'auth.jwt.secret'?: string;
  'auth.jwt.expiresInSeconds'?: number;

  'auth.github.clientId'?: string;
  'auth.github.clientSecret'?: string;
  'auth.github.callbackURL'?: string;
  'auth.github.scope'?: string;
  'auth.github.personalAccessToken'?: string;

  'database.mongodb.name'?: string;
  'database.mongodb.user'?: string;
  'database.mongodb.password'?: string;
  'database.mongodb.host'?: string;
  'database.mongodb.url'?: string;

  'server.url'?: string;
  'server.port'?: number;
}
