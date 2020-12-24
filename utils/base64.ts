export function base64EncodeUrl(str: string){
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=+$/, '');
}

export function base64DecodeUrl(str: string){
  str = (str + '===').slice(0, str.length + (str.length % 4));
  return str.replace(/-/g, '+').replace(/_/g, '/');
}

export function objectToSafeBase64(object: any) {
  return base64EncodeUrl(
    Buffer.from(JSON.stringify(object)).toString('base64')
  )
}