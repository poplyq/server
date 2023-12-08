export type RequestWithCookie = {
  readonly cookies: RefreshToken;
};

export type RefreshToken = {
  refreshToken: string;
};
