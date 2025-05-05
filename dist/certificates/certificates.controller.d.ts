import { CertificatesService } from "./certificates.service";
import { Certificate } from "./entities/certificate.entity";
export declare class CertificatesController {
    private readonly certificatesService;
    constructor(certificatesService: CertificatesService);
    findAll(req: Request): Promise<Certificate[]>;
}
