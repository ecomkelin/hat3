const { stringMatchHash } = require(path.resolve(process.cwd(), 'core/crypto/Bcrypt'));
const { genAcToken, genReToken, parsePayload } = require(path.resolve(process.cwd(), 'core/crypto/jwt'));

module.exports = (CLmodel, body) => new Promise(async (resolve, reject) => {
    try {
        let { code = "", pwd = "" } = body;
        code = code.replace(/^\s*/g, "").toLowerCase();
        pwd = pwd.replace(/^\s*/g, "");
        // console.log("1111", CLmodel);
        const object = await CLmodel.COLLECTION.findOne({ code });
        if (!object) return reject("没有此账号")
        /** 对比密码Hash 是否相符 */
        await stringMatchHash(pwd, object.pwd);

        const payload = parsePayload(object);
        const accessToken = genAcToken(payload);
        const refreshToken = genReToken(payload);

        const data = {
            accessToken,
            refreshToken,
            payload
        }

        return resolve(data)
    } catch (e) {
        return reject(e);
    }
})
