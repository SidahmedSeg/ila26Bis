import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  siret: string;

  @IsString()
  @IsNotEmpty()
  kbis: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}

export class GoogleOAuthRegisterDto {
  @IsString()
  @IsNotEmpty()
  googleIdToken: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  siret: string;

  @IsString()
  @IsNotEmpty()
  kbis: string;
}

