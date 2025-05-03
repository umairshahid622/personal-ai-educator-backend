import { CreateCertificateDto } from "./dto/create-certificate.dto";
import { CertificatesService } from "./certificates.service";
export declare class CertificatesController {
    private readonly certificateService;
    constructor(certificateService: CertificatesService);
    generate(createCertificateDto: CreateCertificateDto, req: any): Promise<string>;
    getMyCertificates(req: any): Promise<import("./entities/certificate.entity").Certificates[]>;
    checkEligibility(req: any, categoryId: string): Promise<{
        hasCertificate: boolean;
    }>;
    generateCertificate(dto: CreateCertificateDto, req: any): Promise<{
        message: string;
        url: string;
    }>;
}
