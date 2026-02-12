import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair



// const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAPdb9Ymy3Tr45tqIPT2nEXuCeruMPKZ8\n' +
//   'a/CqqHJbwzUhrEy2pjfGkW63ScnCG7PKZMYPQ1ihVC4NQjM0r66gtmUCAwEAAQ=='

//   const privateKey = 'MIIBVAIBADANBgkqhkiG9w0BAQEFAASCAT4wggE6AgEAAkEA91v1ibLdOvjm2og9\n' +
//   'PacRe4J6u4w8pnxr8KqoclvDNSGsTLamN8aRbrdJycIbs8pkxg9DWKFULg1CMzSv\n' +
//   'rqC2ZQIDAQABAkEA6aO0goGtsNwUwWlZ3vgE7VJLNwa46tAu7D1lqc6+zVjLkGz8\n' +
//   'hPdv7HwTBjv4Zr0ONzaL9YSXdF/F6fdL3ZJDgQIhAP1nhGm+JjCj09BLmLoNKaV6\n' +
//   'IEerwTI0762gp7ryDRxVAiEA+eSXFRJUErrXstGdAmOmhltjnit4pgJy1otM0oHP\n' +
//   'QdECIHJlkx9xmigHLY4xMod7fbuYgI4aeaNCxpjpmA8LSuPpAiBMKTU6wNlK1BNF\n' +
//   'dslJnyFztYrI/CrLPdfON6p0Rgfq4QIgPQzza2Em2vTGBBreDW7EQE2VMI3+0NVF\n' +
//   '2/Lsg25F6j4='



// // 加密
// export function encrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPublicKey(publicKey) // 设置公钥
//   return encryptor.encrypt(txt) // 对数据进行加密
// }

// // 解密
// export function decrypt(txt) {
//   const encryptor = new JSEncrypt()
//   encryptor.setPrivateKey(privateKey) // 设置私钥
//   return encryptor.decrypt(txt) // 对数据进行解密
// }


// 目前使用的是下面这个，小程序也是 密码错误会出现 Decryption Error 



const passWordPublicKey ="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAy+LOjVi5jUg+vLnnx7Jv\n" +
"7d8qynVjo1AW2NyVixqJkzU9ulKBhBr1+toOLtxWogqClRBXTz+lc5qWYB7DYz8k\n" +
"aONhVcMMpUw9YemVo4hUYe8byp1JXlJiat7mbAkH4+dBuwvR8UW/qhq0VSKN+14x\n" +
"6sxjq4j3NER5wmT7FnamCjdGHGt7C+XytAXDB5r6UIH/6mGQ24dIu5GMmRNw/dVf\n" +
"eekvTYZbD0XkT3PRFH1LRecv4eWZmc0G+oc1d95FuH2SgUVCAGcM8aXX8uyHQ65U\n" +
"+d7Qzjr5c59ayTxBWfqJ8+B+Mmwf/YumMFhCTkgShKrBKELVaIG+ioeXDnVQkzNi\n" +
"fQIDAQAB";
// 加密
export function passWordEncrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(passWordPublicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
