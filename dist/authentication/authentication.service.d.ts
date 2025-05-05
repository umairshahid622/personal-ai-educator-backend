import { DataSource, Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { CreateAuthenticationDto, LoginAuthenticationDto } from "src/users/dto/create-users.dto";
import { User } from "src/users/entities/users.entity";
export declare class AuthenticationService {
    private readonly userRepository;
    private readonly dataSource;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, dataSource: DataSource, jwtService: JwtService);
    create(createAuthenticationDto: CreateAuthenticationDto): Promise<{
        accessToken: string;
        message: string;
    }>;
    logIn(loginAuthenticationDto: LoginAuthenticationDto): Promise<{
        accessToken: string;
        message: string;
    }>;
    forgotPassword(email: string, newPassword: string): Promise<{
        message: string;
    }>;
}
