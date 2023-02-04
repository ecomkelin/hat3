const {stringMatchHash} = require(path.resolve(process.cwd(), 'core/crypto/Bcrypt'));
const {genAcToken, getReToken, parsePayload, acTokenPayload} = require(path.resolve(process.cwd(), 'core/crypto/jwt'));

module.exports = (CLmodel, body) => new Promise(async (resolve, reject) => {
    try {
        const {code, pwd} = body;
        const object = await CLmodel.COLLECTION.findOne({code: { $regex: code, $options: 'i' }});
        if(!object) return reject("没有此账号")
        await stringMatchHash(pwd, object.pwd);

        const payload = parsePayload(object);
        const accessToken = genAcToken(payload);
        const refreshToken = getReToken(payload);

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
