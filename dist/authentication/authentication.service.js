"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const logFunctions_1 = require("../utilities/logFunctions");
const users_entity_1 = require("../users/entities/users.entity");
let AuthenticationService = class AuthenticationService {
    constructor(userRepository, dataSource, jwtService) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
        this.jwtService = jwtService;
    }
    async create(createAuthenticationDto) {
        if (!createAuthenticationDto?.email ||
            !createAuthenticationDto?.password ||
            !createAuthenticationDto.displayName ||
            !createAuthenticationDto.dateOfBirth) {
            throw new common_1.BadRequestException("Email, password, display name and date of birth are required");
        }
        const querryRunner = this.dataSource.createQueryRunner();
        await querryRunner.connect();
        await querryRunner.startTransaction();
        try {
            const hashedPassword = await bcrypt.hash(createAuthenticationDto.password, 10);
            const payLoad = this.userRepository.create({
                email: createAuthenticationDto.email,
                displayName: createAuthenticationDto.displayName,
                password: hashedPassword,
                dateOfBirth: createAuthenticationDto.dateOfBirth,
            });
            const user = await this.userRepository.save(payLoad);
            const userToken = this.jwtService.sign({ userId: user.uuid });
            await querryRunner.commitTransaction();
            return {
                accessToken: userToken,
                message: "account created sucessfully!",
            };
        }
        catch (error) {
            await querryRunner.rollbackTransaction();
            (0, logFunctions_1.consoleError)(error);
            if (error.code === "23505") {
                throw new common_1.ConflictException("Email already exists");
            }
            throw new common_1.InternalServerErrorException("Failed to create user");
        }
        finally {
            await querryRunner.release();
        }
    }
    async logIn(loginAuthenticationDto) {
        try {
            if (!loginAuthenticationDto?.email || !loginAuthenticationDto?.password) {
                throw new common_1.BadRequestException("Email and password are required");
            }
            const user = await this.userRepository.findOne({
                where: { email: loginAuthenticationDto.email },
                select: ["uuid", "password"],
            });
            if (!user) {
                throw new common_1.UnauthorizedException("Invalid credentials");
            }
            const isPasswordValid = await bcrypt.compare(loginAuthenticationDto.password, user.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException("Invalid credentials");
            }
            const payload = { userId: user.uuid };
            return {
                accessToken: this.jwtService.sign(payload),
                message: "logged in sucessfully!",
            };
        }
        catch (error) {
            (0, logFunctions_1.consoleError)(error);
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException("Login failed");
        }
    }
    async forgotPassword(email, newPassword) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException("No user found with this email");
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await this.userRepository.save(user);
        return { message: "Password updated successfully" };
    }
    generateRandomPassword(length = 10) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    }
    findAll() {
        return `This action returns all authentication`;
    }
    findOne(id) {
        return `This action returns a #${id} authentication`;
    }
    update(id, updateAuthenticationDto) {
        return `This action updates a #${id} authentication`;
    }
    remove(id) {
        return `This action removes a #${id} authentication`;
    }
};
exports.AuthenticationService = AuthenticationService;
exports.AuthenticationService = AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource,
        jwt_1.JwtService])
], AuthenticationService);
//# sourceMappingURL=authentication.service.js.map