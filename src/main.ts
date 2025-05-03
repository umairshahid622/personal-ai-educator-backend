import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);

  app.use("/assets", express.static(join(__dirname, "..", "assets")));
  const config = new DocumentBuilder()
    .setTitle("Ai Educator")
    .setDescription("The Ai Educator API description")
    .setVersion("1.0")
    .addTag("Ai Education")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory);

  const dataSource = app.get(DataSource);
  if (!dataSource.isInitialized) {
    try {
      await dataSource.initialize();
      console.log("✅ Database connection successful!");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
    }
  } else {
    console.log("🤪 Database connection already established.");
  }

  const portNumber: number = configService.get<number>("PORT", 3000);
  await app.listen(portNumber);
  console.log(`🚀 Application is running on: http://localhost:${portNumber}`);
}

bootstrap();
