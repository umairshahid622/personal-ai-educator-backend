import { Module } from "@nestjs/common";
import { EbookService } from "./ebook.service";
import { EbookController } from "./ebook.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ebook } from "./entities/ebook.entity";
import { AuthenticationModule } from "src/authentication/authentication.module";

@Module({
  imports: [TypeOrmModule.forFeature([Ebook]), AuthenticationModule],
  controllers: [EbookController],
  providers: [EbookService],
})
export class EbookModule {}
