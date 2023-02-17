const { genAcToken, genReToken, reTokenPayload } = require(path.join(process.cwd(), "core/crypto/jwt"));

module.exports = async ctx => {
    try {
        console.log(1111, ctx.request.headers['authorization']);
        const payload = await reTokenPayload(ctx.request.headers['authorization']);
        console.log(2222, payload);
        // let object = await getObject(objectDB, {_id: payload._id});
        // if(!object) return MdFilter.jsonFailed(res, {message: "授权错误, 请重新登录"});

        const accessToken = genAcToken(payload);
        const refreshToken = genReToken(payload);

        // object.at_last_login = Date.now();
        // await object.update;

        return ctx.success = {
            accessToken,
            refreshToken,
            payload
        }

    } catch (e) {
        return ctx.fail = e;
    }
}