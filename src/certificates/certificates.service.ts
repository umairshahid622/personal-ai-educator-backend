import { Injectable } from "@nestjs/common";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { Certificates } from "./entities/certificate.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/entities/users.entity";
import * as path from "path";
import * as fs from "fs";
import * as PDFDocument from "pdfkit";

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificates)
    private readonly certificateRepo: Repository<Certificates>,

    @InjectRepository(User)
    private readonly usersRepo: Repository<User>
  ) {}

  // async generateCertificate(
  //   userId: string,
  //   dto: CreateCertificateDto
  // ): Promise<Certificates> {
  //   const existing = await this.certificateRepo.findOne({
  //     where: { userId, categoryId: dto.categoryId },
  //   });

  //   if (existing) return existing;

  //   const certificate = this.certificateRepo.create({
  //     userId,
  //     courseName: dto.courseName,
  //     categoryId: dto.categoryId,
  //   });

  //   return this.certificateRepo.save(certificate);
  // }

  async generateCertificate(
    userId: string,
    dto: CreateCertificateDto
  ): Promise<string> {
    const existing = await this.certificateRepo.findOne({
      where: { userId, categoryId: dto.categoryId },
    });

    if (existing) {
      console.log("Certificate already exists.");
      return `/assets/certificates/${existing.id}.pdf`; // Return existing file
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

    // Now create PDF
    const certificatesDir = path.join(
      __dirname,
      "..",
      "..",
      "assets",
      "certificates"
    );
    if (!fs.existsSync(certificatesDir)) {
      fs.mkdirSync(certificatesDir, { recursive: true });
    }

    const filePath = path.join(certificatesDir, `${newCertificate.id}.pdf`);
    await this.generateCertificatePdf(userName, dto.courseName, filePath);

    const pdfUrl = `http://localhost:3001/assets/certificates/${newCertificate.id}.pdf`;
    return pdfUrl;
  }

  private async generateCertificatePdf(
    userName: string,
    courseName: string,
    filePath: string
  ) {
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

    // Border
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .strokeColor(accent)
      .lineWidth(2)
      .stroke();

    // App logo (must be placed in /assets/logo.png)
    const logoPath = path.join(__dirname, "..", "..", "assets", "logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width / 2 - 50, 40, {
        width: 100,
        height: 100,
      });
    }

    doc.moveDown(6);

    // Title
    doc
      .fontSize(36)
      .fillColor(darkBlue)
      .font("Helvetica-Bold")
      .text("Certificate of Completion", { align: "center" })
      .moveDown(1.5);

    // Subtext
    doc
      .fontSize(20)
      .fillColor(gray)
      .font("Helvetica")
      .text("This is awarded to", { align: "center" })
      .moveDown(0.5);

    // Name
    doc
      .fontSize(28)
      .fillColor(darkBlue)
      .font("Helvetica-Bold")
      .text(userName, { align: "center", underline: true })
      .moveDown(1);

    // Course
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

    // Date
    doc
      .fontSize(14)
      .fillColor(gray)
      .text(`Issued on: ${new Date().toLocaleDateString()}`, {
        align: "center",
      });

    doc.end();

    await new Promise<void>((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });
  }

  async getUserCertificates(userId: string): Promise<Certificates[]> {
    return this.certificateRepo.find({
      where: { userId },
      order: { issuedAt: "DESC" },
    });
  }

  async userHasCertificateForThisCourse(
    userId: string,
    categoryId: string
  ): Promise<{ hasCertificate: boolean }> {
    const existing = await this.certificateRepo.findOne({
      where: { userId, categoryId: categoryId },
    });

    return { hasCertificate: existing !== null };
  }
}
