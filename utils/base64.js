"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToSafeBase64 = exports.base64DecodeUrl = exports.base64EncodeUrl = void 0;
function base64EncodeUrl(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}
exports.base64EncodeUrl = base64EncodeUrl;
function base64DecodeUrl(str) {
    str = (str + '===').slice(0, str.length + (str.length % 4));
    return str.replace(/-/g, '+').replace(/_/g, '/');
}
exports.base64DecodeUrl = base64DecodeUrl;
function objectToSafeBase64(object) {
    return base64EncodeUrl(Buffer.from(JSON.stringify(object)).toString('base64'));
}
exports.objectToSafeBase64 = objectToSafeBase64;
