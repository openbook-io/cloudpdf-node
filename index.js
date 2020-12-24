"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudPDF = void 0;
const ed = require("./utils/noble-ed25519");
const base64_1 = require("./utils/base64");
class CloudPDF {
    constructor(options) {
        this.accessSecret = options.accessSecret;
        this.accessKey = options.accessKey;
        this.cloudName = options.cloudName;
    }
    jwtHeader() {
        const jwtHeader = {
            kid: this.cloudName,
            alg: "EdDSA"
        };
        return base64_1.objectToSafeBase64(jwtHeader);
    }
    getPrivateKey() {
        return Buffer.from(base64_1.base64DecodeUrl(this.accessSecret), 'base64');
    }
    signPayload(payload) {
        const privateKey = this.getPrivateKey();
        const headerBase64 = this.jwtHeader();
        const payloadBase64 = base64_1.objectToSafeBase64(payload);
        const jwtBody = headerBase64 + '.' + payloadBase64;
        const signature = ed.sign(Buffer.from(jwtBody), privateKey);
        const safeSignature = base64_1.base64EncodeUrl(Buffer.from(signature).toString('base64'));
        const signedJwt = jwtBody + '.' + safeSignature;
        return signedJwt;
    }
    signDocument(payload) {
        return this.signPayload(payload);
    }
}
exports.CloudPDF = CloudPDF;
