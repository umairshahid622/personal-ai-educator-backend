"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const express = require("express");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    const configService = app.get(config_1.ConfigService);
    app.use("/assets", express.static((0, path_1.join)(__dirname, "..", "assets")));
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Ai Educator")
        .setDescription("The Ai Educator API description")
        .setVersion("1.0")
        .addTag("Ai Education")
        .build();
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup("api", app, documentFactory);
    const dataSource = app.get(typeorm_1.DataSource);
    if (!dataSource.isInitialized) {
        try {
            await dataSource.initialize();
            console.log("✅ Database connection successful!");
        }
        catch (error) {
            console.error("❌ Database connection failed:", error);
        }
    }
    else {
        console.log("🤪 Database connection already established.");
    }
    const portNumber = configService.get("PORT", 3000);
    await app.listen(portNumber);
    console.log(`🚀 Application is running on: http://localhost:${portNumber}`);
}
bootstrap();
//# sourceMappingURL=main.js.map