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
const users_entity_1 = require("../users/entities/users.entity");
const uuid_1 = require("uuid");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
let AuthenticationService = class AuthenticationService {
    constructor(userRepository, jwtService, mailerService, config) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.mailerService = mailerService;
        this.config = config;
    }
    async create(dto) {
        const { email, password, displayName, dateOfBirth } = dto;
        if (!email || !password || !displayName || !dateOfBirth) {
            throw new common_1.BadRequestException("Email, password, display name and date of birth are required");
        }
        const existing = await this.userRepository.findOne({
            where: { email },
        });
        if (existing) {
            if (existing.emailVerified) {
                throw new common_1.ConflictException("Email already exists");
            }
            if (existing.emailTokenExpires > new Date()) {
                await this.sendVerificationEmail(existing);
                return {
                    message: "Verification email resent. Please check your inbox (and spam).",
                };
            }
            await this.userRepository.remove(existing);
        }
        const ttlHours = this.config.get("EMAIL_TOKEN_TTL_HOURS", 24);
        const expires = new Date(Date.now() + ttlHours * 60 * 60 * 1000);
        const hashed = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            email,
            displayName,
            password: hashed,
            dateOfBirth,
            emailVerificationToken: (0, uuid_1.v4)(),
            emailTokenExpires: expires,
            emailVerified: false,
        });
        await this.userRepository.save(user);
        await this.sendVerificationEmail(user);
        return {
            message: `Account created. A verification link has been sent to ${email}.`,
        };
    }
    async logIn(loginDto) {
        const { email, password } = loginDto;
        if (!email || !password) {
            throw new common_1.BadRequestException("Email and password are required");
        }
        const user = await this.userRepository.findOne({
            where: { email },
            select: ["uuid", "password", "emailVerified"],
        });
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        if (!user.emailVerified) {
            throw new common_1.UnauthorizedException("Email not verified. Please check your inbox for the verification link.");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        const payload = { userId: user.uuid };
        const accessToken = this.jwtService.sign(payload);
        return {
            accessToken,
            message: "Logged in successfully!",
        };
    }
    async verifyEmailToken(token) {
        const user = await this.userRepository.findOne({
            where: { emailVerificationToken: token },
        });
        if (!user) {
            throw new common_1.BadRequestException("Invalid verification token");
        }
        if (!user.emailTokenExpires || user.emailTokenExpires < new Date()) {
            throw new common_1.BadRequestException("Token has expired");
        }
        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailTokenExpires = null;
        await this.userRepository.save(user);
        const payload = { userId: user.uuid };
        const accessToken = this.jwtService.sign(payload);
        return {
            message: "Email successfully verified!",
            accessToken: accessToken,
        };
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
    async sendVerificationEmail(user) {
        const frontendUrl = this.config.get("FRONTEND_URL");
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
    async requestPasswordReset(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException("No user with that email");
        const token = (0, uuid_1.v4)();
        user.passwordResetToken = token;
        user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 60);
        await this.userRepository.save(user);
        const frontend = this.config.get("FRONTEND_URL");
        const resetUrl = `${frontend}/auth/reset-password?token=${token}`;
        console.log(resetUrl);
        await this.mailerService.sendMail({
            to: user.email,
            subject: "Reset your password",
            template: "forgot-password",
            context: {
                name: user.displayName,
                resetUrl,
                expires: user.passwordResetExpires,
            },
        });
        return { message: "Password reset email sent. Check your inbox." };
    }
    async resetPassword(token, newPassword) {
        const user = await this.userRepository.findOne({
            where: { passwordResetToken: token },
        });
        if (!user ||
            !user.passwordResetExpires ||
            user.passwordResetExpires < new Date()) {
            throw new common_1.BadRequestException("Invalid or expired reset token");
        }
        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await this.userRepository.save(user);
        return { message: "Password updated successfully." };
    }
    async validatePasswordResetToken(token) {
        console.log(token);
        if (!token) {
            throw new common_1.BadRequestException("Reset token is required");
        }
        const user = await this.userRepository.findOne({
            where: { passwordResetToken: token },
        });
        if (!user) {
            throw new common_1.BadRequestException("Invalid reset token");
        }
        if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
            throw new common_1.BadRequestException("Reset token has expired");
        }
        return { message: "Password Reset link is valid" };
    }
};
exports.AuthenticationService = AuthenticationService;
exports.AuthenticationService = AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        mailer_1.MailerService,
        config_1.ConfigService])
], AuthenticationService);
//# sourceMappingURL=authentication.service.js.map