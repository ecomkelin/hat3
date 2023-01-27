const bcrypt = require('bcryptjs');

/**
 * 生成加密 密码
 * @param {String} str_bcrypt 
 * @returns [String] 加密后的密码
 */
exports.encryptHash_Pstr = (str_bcrypt) => new Promise((resolve, reject) => {
	str_bcrypt=String(str_bcrypt);
	bcrypt.genSalt(parseInt(SALT_WORK_FACTOR), function(err, salt) {
		if(err) return reject(err);
		bcrypt.hash(str_bcrypt, salt, function(err, hash_bcrypt) {
			if(err) return reject(err);
			return resolve(hash_bcrypt);
		});
	});
});

/**
 * 匹配密码
 * @param {String} str_bcrypt 加密前的密码
 * @param {String} hash_bcrypt 加密后的密码
 * @returns [null] 如果成功 则返回空 否则返回错误
 */
exports.matchBcrypt_Pnull = (str_bcrypt, hash_bcrypt) => new Promise(async(resolve, reject) => {
	try {
		if(!str_bcrypt) return reject({errMsg: "[密码错误]: 匹配时, 加密字符串不能为空" });
		let isMatch = await bcrypt.compare(str_bcrypt, hash_bcrypt);
		if(!isMatch) return reject({errMsg: "[密码错误]: 字符串加密与 hash_bcrypt 不符合" });
		return resolve(null);
	} catch (e) {
		return reject(e);
	}
});