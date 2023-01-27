const bcrypt = require('bcryptjs');

/**
 * 生成加密 密码
 * @param {String} str_bcrypt 
 * @returns [String] 加密后的密码
 */
const encryptHash_Pstr = (str_bcrypt) => new Promise((resolve, reject) => {
	str_bcrypt=String(str_bcrypt);
	bcrypt.genSalt(parseInt(SALT_WORK_FACTOR), function(err, salt) {
		if(err) return reject(err);
		bcrypt.hash(str_bcrypt, salt, function(err, hash_bcrypt) {
			if(err) return reject(err);
			return resolve(hash_bcrypt);
		});
	});
});

module.exports = (doc, needEncryption) =>
    new Promise(async (resolve, reject) => {
        try {
            const {fields} = needEncryption;
            if (!(fields instanceof Array)) return reject({ errMsg: "DB regulate asyncs bcrypt: CLoptions needEncryption 对象错误" })

            for (let i = 0; i < fields.length; i++) {
                let key = fields[i];
                if(doc instanceof Array) {  // 批量加密
                    for(let j=0; j<doc.length; j++) {
                        if(doc[j][key]) doc[j][key] = await encryptHash_Pstr(doc[j][key]);
                    }
                } else {                    // 单文档加密
                    if(doc[key]) doc[key] = await encryptHash_Pstr(doc[key]);
                }
            }
            return resolve(null);
        } catch(e) {
            return reject(e);
        }
    })