import * as ed from './utils/noble-ed25519';
import { base64DecodeUrl, base64EncodeUrl, objectToSafeBase64 } from './utils/base64';

interface options {
  accessSecret: string;
  accessKey: string;
  cloudName: string;
}

interface getDocumentPayload {
  documentId: string;
  download?: boolean;
  search?: boolean;
  exp?: number;
}

interface uploadPayload {
  public?: boolean;
  exp?: number;
}

export class CloudPDF {
  accessSecret: string;
  accessKey: string;
  cloudName: string;

  constructor(options: options) {
    this.accessSecret = options.accessSecret;
    this.accessKey = options.accessKey;
    this.cloudName = options.cloudName;
  }

  private jwtHeader() {
    const jwtHeader = {
      kid: this.cloudName,
      alg: "EdDSA"
    };

    return objectToSafeBase64(jwtHeader)
  }

  private getPrivateKey() {
    return Buffer.from(base64DecodeUrl(this.accessSecret), 'base64');
  }

  private signPayload(payload: getDocumentPayload | uploadPayload) {
    const privateKey = this.getPrivateKey();

    const headerBase64 = this.jwtHeader();
    const payloadBase64 = objectToSafeBase64(payload);
    const jwtBody = headerBase64 + '.' + payloadBase64

    const signature = ed.sign(Buffer.from(jwtBody), privateKey);
    const safeSignature = base64EncodeUrl(Buffer.from(signature).toString('base64'));

    const signedJwt = jwtBody + '.' + safeSignature;

    return signedJwt;
  }

  signDocument(payload: getDocumentPayload) {
    return this.signPayload(payload);
  }

  uploadDocument(payload: uploadPayload) {
    return this.signPayload(payload);
  }
}