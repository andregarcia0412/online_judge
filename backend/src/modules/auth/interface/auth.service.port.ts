import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshResponseDto } from '../dto/refresh-response.dto';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';

export interface AuthServicePort {
  login(loginDto: LoginDto): Promise<AuthResponseDto>;
  refresh(refreshToken: RefreshTokenDto): Promise<RefreshResponseDto>;
  register(createUserDto: CreateUserDto): Promise<ReturnUserDto>;
}

export const AuthServicePort = Symbol('AuthServicePort');
