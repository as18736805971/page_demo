import JSEncrypt from 'jsencrypt'
export function encryption(pwd, pubkey) {
	var encryptor = new JSEncrypt();  // 创建加密对象实例
	encryptor.setPublicKey(pubkey)   //设置公钥
	let rsaPassWord = encryptor.encrypt(pwd)  // 对内容进行加密
	return rsaPassWord;
}