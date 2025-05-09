import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { CreateAuthenticationDto, LoginAuthenticationDto } from "src/users/dto/create-users.dto";
import { User } from "src/users/entities/users.entity";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
export declare class AuthenticationService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly mailerService;
    private readonly config;
    constructor(userRepository: Repository<User>, jwtService: JwtService, mailerService: MailerService, config: ConfigService);
    create(dto: CreateAuthenticationDto): Promise<{
        message: string;
    }>;
    logIn(loginDto: LoginAuthenticationDto): Promise<{
        accessToken: string;
        message: string;
    }>;
    verifyEmailToken(token: string): Promise<{
        message: string;
        accessToken?: string;
    }>;
    forgotPassword(email: string, newPassword: string): Promise<{
        message: string;
    }>;
    private sendVerificationEmail;
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
