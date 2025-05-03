import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUser(req: Request): Promise<import("./entities/users.entity").User | null>;
    updateUserName(req: any, name: string): Promise<{
        message: string;
    }>;
}
