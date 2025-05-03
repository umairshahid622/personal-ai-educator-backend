import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { CertificatesService } from "./certificates.service";
import { AuthGuard } from "src/guards/auth/auth.guard";

@Controller("certificates")
@UseGuards(AuthGuard)
export class CertificatesController {
  constructor(private readonly certificateService: CertificatesService) {}
  @Post("generate")
  async generate(
    @Body() createCertificateDto: CreateCertificateDto,
    @Req() req: any
  ) {
    const userId = req.user.userId;
    return this.certificateService.generateCertificate(
      userId,
      createCertificateDto
    );
  }

  @Get("my")
  async getMyCertificates(@Req() req: any) {
    const userId = req.user.userId;
    return this.certificateService.getUserCertificates(userId);
  }

  @Get("eligibility/:categoryId")
  @UseGuards(AuthGuard)
  async checkEligibility(@Req() req, @Param("categoryId") categoryId: string) {
    const userId = req.user.userId;
    return this.certificateService.userHasCertificateForThisCourse(
      userId,
      categoryId
    );
  }

  @Post("generate")
  async generateCertificate(@Body() dto: CreateCertificateDto, @Req() req) {
    const userId = req.user.userId;

    const pdfUrl = await this.certificateService.generateCertificate(
      userId,
      dto
    );

    return { message: "Certificate generated", url: pdfUrl };
  }
}
