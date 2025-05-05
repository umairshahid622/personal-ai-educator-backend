import { Module } from "@nestjs/common";
import { CertificatesService } from "./certificates.service";
import { CertificatesController } from "./certificates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Certificate } from "./entities/certificate.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificate]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "5h" },
      }),
    }),
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
})
export class CertificatesModule {}
