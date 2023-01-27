const CLmodel_User = require("../../Models/auth/User.Model");
module.exports = async ctx => {
    try {
        const payload = ctx.request.payload;
        let data = await CLmodel_User.find(ctx.req, {payload});

        return resSUCCESS(ctx, {data});
    } catch(e) {
        return resERR(ctx, e)
    }
}