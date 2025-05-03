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
import { consoleError, consoleLog } from "src/utilities/logFunctions";
import {
  CreateAuthenticationDto,
  LoginAuthenticationDto,
} from "src/users/dto/create-users.dto";
import { UpdateAuthenticationDto } from "src/users/dto/update-users.dto";
import { User } from "src/users/entities/users.entity";

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService
  ) {}

  async create(
    createAuthenticationDto: CreateAuthenticationDto
  ): Promise<{ accessToken: string; message: string }> {
    if (
      !createAuthenticationDto?.email ||
      !createAuthenticationDto?.password ||
      !createAuthenticationDto.displayName ||
      !createAuthenticationDto.dateOfBirth
    ) {
      throw new BadRequestException(
        "Email, password, display name and date of birth are required"
      );
    }
    const querryRunner = this.dataSource.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction();

    try {
      const hashedPassword = await bcrypt.hash(
        createAuthenticationDto.password,
        10
      );

      const payLoad: User = this.userRepository.create({
        email: createAuthenticationDto.email,
        displayName: createAuthenticationDto.displayName,
        password: hashedPassword,
        dateOfBirth: createAuthenticationDto.dateOfBirth,
      });

      const user: User = await this.userRepository.save(payLoad);

      const userToken = this.jwtService.sign({ userId: user.uuid });
      await querryRunner.commitTransaction();

      return {
        accessToken: userToken,
        message: "account created sucessfully!",
      };
    } catch (error) {
      await querryRunner.rollbackTransaction();

      consoleError(error);

      if (error.code === "23505") {
        throw new ConflictException("Email already exists");
      }
      throw new InternalServerErrorException("Failed to create user");
    } finally {
      await querryRunner.release();
    }
  }

  async logIn(
    loginAuthenticationDto: LoginAuthenticationDto
  ): Promise<{ accessToken: string; message: string }> {
    try {
      if (!loginAuthenticationDto?.email || !loginAuthenticationDto?.password) {
        throw new BadRequestException("Email and password are required");
      }

      const user: User | null = await this.userRepository.findOne({
        where: { email: loginAuthenticationDto.email },
        select: ["uuid", "password"],
      });

      if (!user) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const isPasswordValid: boolean = await bcrypt.compare(
        loginAuthenticationDto.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException("Invalid credentials");
      }

      const payload = { userId: user.uuid };

      return {
        accessToken: this.jwtService.sign(payload),
        message: "logged in sucessfully!",
      };
    } catch (error) {
      consoleError(error);

      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException("Login failed");
    }
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

  private generateRandomPassword(length = 10) {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join("");
  }

  findAll() {
    return `This action returns all authentication`;
  }

  findOne(id: number) {
    return `This action returns a #${id} authentication`;
  }

  update(id: number, updateAuthenticationDto: UpdateAuthenticationDto) {
    return `This action updates a #${id} authentication`;
  }

  remove(id: number) {
    return `This action removes a #${id} authentication`;
  }
}
