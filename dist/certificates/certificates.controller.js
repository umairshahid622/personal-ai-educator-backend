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
exports.CertificatesController = void 0;
const common_1 = require("@nestjs/common");
const create_certificate_dto_1 = require("./dto/create-certificate.dto");
const certificates_service_1 = require("./certificates.service");
const auth_guard_1 = require("../guards/auth/auth.guard");
let CertificatesController = class CertificatesController {
    constructor(certificateService) {
        this.certificateService = certificateService;
    }
    async generate(createCertificateDto, req) {
        const userId = req.user.userId;
        return this.certificateService.generateCertificate(userId, createCertificateDto);
    }
    async getMyCertificates(req) {
        const userId = req.user.userId;
        return this.certificateService.getUserCertificates(userId);
    }
    async checkEligibility(req, categoryId) {
        const userId = req.user.userId;
        return this.certificateService.userHasCertificateForThisCourse(userId, categoryId);
    }
    async generateCertificate(dto, req) {
        const userId = req.user.userId;
        const pdfUrl = await this.certificateService.generateCertificate(userId, dto);
        return { message: "Certificate generated", url: pdfUrl };
    }
};
exports.CertificatesController = CertificatesController;
__decorate([
    (0, common_1.Post)("generate"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_certificate_dto_1.CreateCertificateDto, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "generate", null);
__decorate([
    (0, common_1.Get)("my"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "getMyCertificates", null);
__decorate([
    (0, common_1.Get)("eligibility/:categoryId"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)("categoryId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "checkEligibility", null);
__decorate([
    (0, common_1.Post)("generate"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_certificate_dto_1.CreateCertificateDto, Object]),
    __metadata("design:returntype", Promise)
], CertificatesController.prototype, "generateCertificate", null);
exports.CertificatesController = CertificatesController = __decorate([
    (0, common_1.Controller)("certificates"),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [certificates_service_1.CertificatesService])
], CertificatesController);
//# sourceMappingURL=certificates.controller.js.map