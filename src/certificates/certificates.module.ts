import { Module } from "@nestjs/common";
import { CertificatesService } from "./certificates.service";
import { CertificatesController } from "./certificates.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Certificates } from "./entities/certificate.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config/dist/config.module";
import { ConfigService } from "@nestjs/config/dist/config.service";
import { User } from "src/users/entities/users.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Certificates, User]),
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
