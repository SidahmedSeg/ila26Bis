import { Controller, Post, Get, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, RegisterDto, GoogleOAuthRegisterDto } from './dto/register.dto';
import { LoginDto, GoogleOAuthLoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to email for registration' })
  @ApiBody({ type: SendOtpDto })
  @ApiResponse({ status: 200, description: 'OTP sent successfully', schema: { type: 'object', properties: { message: { type: 'string', example: 'OTP sent to your email' } } } })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.authService.sendOtp(sendOtpDto.email);
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({ status: 200, description: 'OTP verified successfully', schema: { type: 'object', properties: { verified: { type: 'boolean', example: true } } } })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto.email, verifyOtpDto.code);
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user with email' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or invalid OTP' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('google/register')
  @HttpCode(HttpStatus.CREATED)
  async googleOAuthRegister(@Body() googleOAuthRegisterDto: GoogleOAuthRegisterDto) {
    return this.authService.googleOAuthRegister(googleOAuthRegisterDto);
  }

  @Public()
  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  async googleOAuthLogin(@Body() googleOAuthLoginDto: GoogleOAuthLoginDto) {
    // TODO: Implement Google OAuth login
    throw new Error('Google OAuth login not yet implemented');
  }

  @Get('tenants')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user tenants list' })
  @ApiResponse({ status: 200, description: 'Tenants retrieved successfully' })
  async getTenants(@CurrentUser() user: any) {
    return this.authService.getUserTenants(user.id);
  }
}

