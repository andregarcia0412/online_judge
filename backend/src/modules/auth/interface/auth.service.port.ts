import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export interface AuthServicePort {
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  refresh(refreshToken: RefreshTokenDto): Promise<AuthResponseDto>;
  register(createUserDto: CreateUserDto): Promise<AuthResponseDto>;
}

export const AuthServicePort = Symbol('AuthServicePort');
