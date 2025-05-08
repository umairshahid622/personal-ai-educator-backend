import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { consoleError } from "src/utilities/logFunctions";
import {
  CreateAuthenticationDto,
  LoginAuthenticationDto,
} from "src/users/dto/create-users.dto";
import { UpdateAuthenticationDto } from "src/users/dto/update-users.dto";
import { User } from "src/users/entities/users.entity";
import { v4 as uuidv4 } from "uuid";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly config: ConfigService
  ) {}

  async create(dto: CreateAuthenticationDto): Promise<{ message: string }> {
    const { email, password, displayName, dateOfBirth } = dto;
    if (!email || !password || !displayName || !dateOfBirth) {
      throw new BadRequestException(
        "Email, password, display name and date of birth are required"
      );
    }

    const existing = await this.userRepository.findOne({
      where: { email },
    });

    if (existing) {
      if (existing.emailVerified) {
        throw new ConflictException("Email already exists");
      }

      if (existing.emailTokenExpires! > new Date()) {
        await this.sendVerificationEmail(existing);
        return {
          message:
            "Verification email resent. Please check your inbox (and spam).",
        };
      }

      await this.userRepository.remove(existing);
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      email,
      displayName,
      password: hashed,
      dateOfBirth,
      emailVerificationToken: uuidv4(),
      emailTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      emailVerified: false,
    });

    await this.userRepository.save(user);

    await this.sendVerificationEmail(user);

    return {
      message: `Account created. A verification link has been sent to ${email}.`,
    };
  }

  async logIn(
    loginDto: LoginAuthenticationDto
  ): Promise<{ accessToken: string; message: string }> {
    const { email, password } = loginDto;
  
    if (!email || !password) {
      throw new BadRequestException("Email and password are required");
    }
  
    const user = await this.userRepository.findOne({
      where: { email },
      select: ["uuid", "password", "emailVerified"],
    });
  
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }
  
    if (!user.emailVerified) {
      throw new UnauthorizedException(
        "Email not verified. Please check your inbox for the verification link."
      );
    }
  

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }
  
    const payload = { userId: user.uuid };
    const accessToken = this.jwtService.sign(payload);
  
    return {
      accessToken,
      message: "Logged in successfully!",
    };
  }
  

  async verifyEmailToken(
    token: string
  ): Promise<{ message: string; accessToken?: string }> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException("Invalid verification token");
    }
    if (!user.emailTokenExpires || user.emailTokenExpires < new Date()) {
      throw new BadRequestException("Token has expired");
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailTokenExpires = null;
    await this.userRepository.save(user);

    // Optionally sign and return a JWT so the user is automatically logged in:
    const payload = { userId: user.uuid };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: "Email successfully verified!",
      accessToken: accessToken,
    };
  }

  async forgotPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException("No user found with this email");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: "Password updated successfully" };
  }

  private async sendVerificationEmail(user: User) {
    const frontendUrl = this.config.get<string>("FRONTEND_URL");
    const verifyUrl = `${frontendUrl}/auth/verify?token=${user.emailVerificationToken}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Confirm your email",
      template: "verify_email",
      context: {
        name: user.displayName,
        verifyUrl,
        expires: user.emailTokenExpires,
      },
    });
  }
}
