import { AuthenticationModule } from "./../authentication/authentication.module";
import { Module } from "@nestjs/common";
import { CertificatesService } from "./certificates.service";
import { CertificatesController } from "./certificates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Certificate } from "./entities/certificate.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Certificate]), AuthenticationModule],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
