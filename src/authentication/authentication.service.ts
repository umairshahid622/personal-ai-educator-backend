import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

import { User } from 'src/users/entities/users.entity';
import {
  CreateAuthenticationDto,
  LoginAuthenticationDto,
} from 'src/users/dto/create-users.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {}

  // ─── Account Creation & Email Verification ───────────────────────────────────
  async create(
    dto: CreateAuthenticationDto,
  ): Promise<{ message: string }> {
    const { email, password, displayName, dateOfBirth } = dto;
    if (![email, password, displayName, dateOfBirth].every(Boolean)) {
      throw new BadRequestException(
        'Email, password, display name and date of birth are required',
      );
    }

    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      if (existing.emailVerified) {
        throw new ConflictException('Email already exists');
      }
      // resend if token still valid
      if (existing.emailTokenExpires && existing.emailTokenExpires > new Date()) {
        await this.sendVerificationEmail(existing);
        return {
          message: 'Verification email resent. Please check your inbox (and spam).',
        };
      }
      await this.userRepo.remove(existing);
    }

    const hashed = await bcrypt.hash(password, 10);
    const expires = this.generateExpiry(
      this.config.get<number>('EMAIL_TOKEN_TTL_HOURS', 24),
    );
    const user = this.userRepo.create({
      email,
      displayName,
      password: hashed,
      dateOfBirth,
      emailVerified: false,
      emailVerificationToken: uuidv4(),
      emailTokenExpires: expires,
    });
    await this.userRepo.save(user);
    await this.sendVerificationEmail(user);

    return {
      message: `Account created. A verification link has been sent to ${email}.`,
    };
  }

  async verifyEmailToken(
    token: string,
  ): Promise<{ message: string; accessToken?: string }> {
    const user = await this.findByToken(
      'emailVerificationToken',
      token,
      'Invalid verification token',
    );
    if (!user.emailTokenExpires || user.emailTokenExpires < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailTokenExpires = null;
    await this.userRepo.save(user);

    const accessToken = this.signJwt(user.uuid);
    return { message: 'Email successfully verified!', accessToken };
  }

  // ─── Authentication ─────────────────────────────────────────────────────────
  async logIn(
    dto: LoginAuthenticationDto,
  ): Promise<{ accessToken: string; message: string }> {
    const { email, password } = dto;
    if (![email, password].every(Boolean)) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userRepo.findOne({
      where: { email },
      select: ['uuid', 'password', 'emailVerified'],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'Email not verified. Please check your inbox for the verification link.',
      );
    }

    return { accessToken: this.signJwt(user.uuid), message: 'Logged in successfully!' };
  }

  // ─── Password Reset ──────────────────────────────────────────────────────────
  async requestPasswordReset(
    email: string,
  ): Promise<{ message: string }> {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('No user with that email');

    user.passwordResetToken = uuidv4();
    user.passwordResetExpires = this.generateExpiry(1); // 1 hour
    await this.userRepo.save(user);

    await this.mailer.sendMail({
      to: user.email,
      subject: 'Reset your password',
      template: 'forgot-password',
      context: {
        name: user.displayName,
        resetUrl: `${this.config.get<string>('FRONTEND_URL')}/auth/reset-password?token=${user.passwordResetToken}`,
        expires: user.passwordResetExpires,
      },
    });

    return { message: 'Password reset email sent. Check your inbox.' };
  }

  async validatePasswordResetToken(
    token: string,
  ): Promise<{ message: string }> {
    const user = await this.findByToken(
      'passwordResetToken',
      token,
      'Invalid reset token',
    );
    const expires = user.passwordResetExpires;
    if (!expires || expires < new Date()) {
      throw new BadRequestException('Reset token has expired');
    }
    return { message: 'Password Reset link is valid' };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.findByToken(
      'passwordResetToken',
      token,
      'Invalid or expired reset token',
    );
    const expires = user.passwordResetExpires;
    if (!expires || expires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepo.save(user);

    return { message: 'Password updated successfully.' };
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────
  private signJwt(userId: string): string {
    return this.jwtService.sign({ userId });
  }

  private generateExpiry(hours: number): Date {
    return new Date(Date.now() + hours * 3600 * 1000);
  }

  private async findByToken(
    field: 'emailVerificationToken' | 'passwordResetToken',
    token: string,
    errorMsg: string,
  ): Promise<User> {
    if (!token) throw new BadRequestException(errorMsg);
    const user = await this.userRepo.findOne({ where: { [field]: token } });
    if (!user) throw new BadRequestException(errorMsg);
    return user;
  }

  private async sendVerificationEmail(user: User) {
    const url = `${this.config.get<string>('FRONTEND_URL')}/auth/verify?token=${user.emailVerificationToken}`;
    await this.mailer.sendMail({
      to: user.email,
      subject: 'Confirm your email',
      template: 'verify_email',
      context: { name: user.displayName, verifyUrl: url, expires: user.emailTokenExpires },
    });
  }
}