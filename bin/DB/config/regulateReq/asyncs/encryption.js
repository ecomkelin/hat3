/** 
 * 存入数据库前 要异步做的事情 对string 加密成 hash
 */

const {stringToHash} = require(path.resolve(process.cwd(), 'core/crypto/Bcrypt'));

module.exports = (doc, needEncryption) =>
    new Promise(async (resolve, reject) => {
        try {
            let { fields } = needEncryption;
            if ((typeof fields) === 'string') fields = [fields];
            if (!(fields instanceof Array)) return reject("mgWrite asyncs bcrypt: CLoptions needEncryption 对象错误")

            /** 基本都是一个 pwd 加密 写成循环 只是防止有多个数据加密的 */
            for (let i = 0; i < fields.length; i++) {
                let key = fields[i];
                if (doc instanceof Array) {  // 如果是 documents 的话 就要给每个文档加密
                    for (let j = 0; j < doc.length; j++) {
                        if (doc[j][key]) doc[j][key] = await stringToHash(doc[j][key]);
                    }
                } else {                    // 单文档加密
                    if (doc[key]) doc[key] = await stringToHash(doc[key]);
                }
            }
            return resolve(null);
        } catch (e) {
            return reject(e);
        }
    })



