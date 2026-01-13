import { Controller, Post, Body, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminLoginDto } from './dto/login.dto';
import { AdminAuthResponseDto } from './dto/auth-response.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin login with email and password' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: AdminAuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: AdminLoginDto) {
    return this.authService.login(loginDto);
  }
}

