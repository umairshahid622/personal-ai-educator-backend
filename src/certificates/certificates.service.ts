import { Injectable } from "@nestjs/common";
import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { UpdateCertificateDto } from "./dto/update-certificate.dto";
import { Certificate } from "./entities/certificate.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Certificate)
    private readonly certRepo: Repository<Certificate>
  ) {}

  async findForUser(userId: string): Promise<Certificate[]> {
    return this.certRepo.find({
      where: { userId },
      relations: ["subCategory"],
      order: { issuedAt: "DESC" },
    });
  }
}
