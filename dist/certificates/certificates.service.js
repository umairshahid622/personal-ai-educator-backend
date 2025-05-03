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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const certificate_entity_1 = require("./entities/certificate.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_entity_1 = require("../users/entities/users.entity");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
let CertificatesService = class CertificatesService {
    constructor(certificateRepo, usersRepo) {
        this.certificateRepo = certificateRepo;
        this.usersRepo = usersRepo;
    }
    async generateCertificate(userId, dto) {
        const existing = await this.certificateRepo.findOne({
            where: { userId, categoryId: dto.categoryId },
        });
        if (existing) {
            console.log("Certificate already exists.");
            return `/assets/certificates/${existing.id}.pdf`;
        }
        const user = await this.usersRepo.findOne({ where: { uuid: userId } });
        if (!user) {
            throw new Error("User not found");
        }
        const userName = user.displayName;
        let newCertificate = this.certificateRepo.create({
            userId,
            courseName: dto.courseName,
            categoryId: dto.categoryId,
        });
        newCertificate = await this.certificateRepo.save(newCertificate);
        newCertificate.certificateUrl = `/assets/certificates/${newCertificate.id}.pdf`;
        await this.certificateRepo.save(newCertificate);
        const certificatesDir = path.join(__dirname, "..", "..", "assets", "certificates");
        if (!fs.existsSync(certificatesDir)) {
            fs.mkdirSync(certificatesDir, { recursive: true });
        }
        const filePath = path.join(certificatesDir, `${newCertificate.id}.pdf`);
        await this.generateCertificatePdf(userName, dto.courseName, filePath);
        const pdfUrl = `http://localhost:3001/assets/certificates/${newCertificate.id}.pdf`;
        return pdfUrl;
    }
    async generateCertificatePdf(userName, courseName, filePath) {
        const doc = new PDFDocument({
            size: "A4",
            layout: "landscape",
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);
        const darkBlue = "#1B1F3B";
        const gray = "#555555";
        const accent = "#3D3CFF";
        doc
            .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .strokeColor(accent)
            .lineWidth(2)
            .stroke();
        const logoPath = path.join(__dirname, "..", "..", "assets", "logo.png");
        if (fs.existsSync(logoPath)) {
            doc.image(logoPath, doc.page.width / 2 - 50, 40, {
                width: 100,
                height: 100,
            });
        }
        doc.moveDown(6);
        doc
            .fontSize(36)
            .fillColor(darkBlue)
            .font("Helvetica-Bold")
            .text("Certificate of Completion", { align: "center" })
            .moveDown(1.5);
        doc
            .fontSize(20)
            .fillColor(gray)
            .font("Helvetica")
            .text("This is awarded to", { align: "center" })
            .moveDown(0.5);
        doc
            .fontSize(28)
            .fillColor(darkBlue)
            .font("Helvetica-Bold")
            .text(userName, { align: "center", underline: true })
            .moveDown(1);
        doc
            .fontSize(18)
            .fillColor(gray)
            .text("For successfully completing the course:", {
            align: "center",
        })
            .moveDown(0.5);
        doc
            .fontSize(24)
            .fillColor(accent)
            .font("Helvetica-Bold")
            .text(courseName, { align: "center" })
            .moveDown(2);
        doc
            .fontSize(14)
            .fillColor(gray)
            .text(`Issued on: ${new Date().toLocaleDateString()}`, {
            align: "center",
        });
        doc.end();
        await new Promise((resolve, reject) => {
            stream.on("finish", resolve);
            stream.on("error", reject);
        });
    }
    async getUserCertificates(userId) {
        return this.certificateRepo.find({
            where: { userId },
            order: { issuedAt: "DESC" },
        });
    }
    async userHasCertificateForThisCourse(userId, categoryId) {
        const existing = await this.certificateRepo.findOne({
            where: { userId, categoryId: categoryId },
        });
        return { hasCertificate: existing !== null };
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(certificate_entity_1.Certificates)),
    __param(1, (0, typeorm_1.InjectRepository)(users_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map