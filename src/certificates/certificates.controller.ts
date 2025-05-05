import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { CertificatesService } from "./certificates.service";
import { Certificate } from "./entities/certificate.entity";
import { AuthGuard } from "src/guards/auth/auth.guard";

@Controller("certificates")
@UseGuards(AuthGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  async findAll(@Req() req: Request): Promise<Certificate[]> {
    const userId = req["user"]["userId"];
    return this.certificatesService.findForUser(userId);
  }
}
