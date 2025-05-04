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
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("./authentication.service");
const create_users_dto_1 = require("../users/dto/create-users.dto");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    create(createAuthenticationDto) {
        return this.authenticationService.create(createAuthenticationDto);
    }
    login(loginAuthenticationDto) {
        return this.authenticationService.logIn(loginAuthenticationDto);
    }
    async forgotPassword(email, newPassword, confirmPassword) {
        if (!email || !newPassword || !confirmPassword) {
            throw new common_1.BadRequestException("Email, New Password and Confirm Password are required");
        }
        if (newPassword !== confirmPassword) {
            throw new common_1.BadRequestException("New Password and Confirm Password do not match");
        }
        return this.authenticationService.forgotPassword(email, newPassword);
    }
};
exports.AuthenticationController = AuthenticationController;
__decorate([
    (0, common_1.Post)("register"),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_users_dto_1.CreateAuthenticationDto]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_users_dto_1.LoginAuthenticationDto]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)("email")),
    __param(1, (0, common_1.Body)("newPassword")),
    __param(2, (0, common_1.Body)("confirmPassword")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "forgotPassword", null);
exports.AuthenticationController = AuthenticationController = __decorate([
    (0, common_1.Controller)("authentication"),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
//# sourceMappingURL=authentication.controller.js.map