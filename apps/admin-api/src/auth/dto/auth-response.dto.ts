export class AdminAuthResponseDto {
  access_token: string;
  refresh_token?: string;
  admin: {
    id: string;
    email: string;
    role: string;
  };
}

