import { AuthenticationService } from "./authentication.service";
import { CreateAuthenticationDto, LoginAuthenticationDto } from "src/users/dto/create-users.dto";
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    create(createAuthenticationDto: CreateAuthenticationDto): Promise<{
        message: string;
    }>;
    login(loginAuthenticationDto: LoginAuthenticationDto): Promise<{
        accessToken: string;
        message: string;
    }>;
    verifyEmail(token: string): Promise<{
        message: string;
        accessToken?: string;
    }>;
}
