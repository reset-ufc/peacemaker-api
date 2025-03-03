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
    };
  };

  'auth.jwt.secret'?: string;
  'auth.jwt.expiresInSeconds'?: number;

  'auth.github.clientId'?: string;
  'auth.github.clientSecret'?: string;
  'auth.github.callbackURL'?: string;
  'auth.github.scope'?: string;
}
