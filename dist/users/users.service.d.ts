import { User } from "./entities/users.entity";
import { Repository } from "typeorm";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    getUserById(userId: string): Promise<User | null>;
    updateName(userId: string, newName: string): Promise<string>;
}
