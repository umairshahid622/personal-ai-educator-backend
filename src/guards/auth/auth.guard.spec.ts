import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthGuard', () => {
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      signAsync: jest.fn(),
      verify: jest.fn(),
      verifyAsync: jest.fn(),
    } as unknown as JwtService;
  });

  it('should be defined', () => {
    expect(new AuthGuard(jwtService)).toBeDefined();
  });
});
