export class AuthResponseDto {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    emailVerified: boolean;
  };
  tenant?: {
    id: string;
    name: string;
    role: string;
  };
}

