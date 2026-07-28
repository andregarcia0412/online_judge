import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { PasswordResetRequestDto } from '../dto/password-reset-request.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

export interface AuthServicePort {
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  refresh(refreshToken: RefreshTokenDto): Promise<AuthResponseDto>;
  register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
  requestPasswordReset(
    passwordResetDto: PasswordResetRequestDto,
  ): Promise<void>;
  resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void>;
}

export const AuthServicePort = Symbol('AuthServicePort');
