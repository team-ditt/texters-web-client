export type SignInResponse = {
  responseType: "signIn" | "signUp";
  oauthId?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
};

export type SignUpForm = {
  oauthId: string;
  penName: string;
};
