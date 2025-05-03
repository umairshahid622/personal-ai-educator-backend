import { AuthenticationService } from "./authentication.service";
import { CreateAuthenticationDto, LoginAuthenticationDto } from "src/users/dto/create-users.dto";
import { UpdateAuthenticationDto } from "src/users/dto/update-users.dto";
export declare class AuthenticationController {
    private readonly authenticationService;
    constructor(authenticationService: AuthenticationService);
    create(createAuthenticationDto: CreateAuthenticationDto): Promise<{
        accessToken: string;
        message: string;
    }>;
    login(loginAuthenticationDto: LoginAuthenticationDto): Promise<{
        accessToken: string;
        message: string;
    }>;
    forgotPassword(email: string, newPassword: string, confirmPassword: string): Promise<{
        message: string;
    }>;
    findOne(id: string): string;
    update(id: string, updateAuthenticationDto: UpdateAuthenticationDto): string;
    remove(id: string): string;
}
