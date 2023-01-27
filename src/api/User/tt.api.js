const CLmodel_User = require("../../Models/auth/User.Model");
exports.get_find = async ctx => {
    try {
        const payload = ctx.request.payload;
        let data = await CLmodel_User.find(ctx.req, {payload});

        return resSUCCESS(ctx, {data});
    } catch(e) {
        return resERR(ctx, e)
    }
}

exports.post_find = async ctx => {
    try {
        const payload = ctx.request.payload;
        let data = await CLmodel_User.find(ctx.req, {payload});

        return resSUCCESS(ctx, {data});
    } catch(e) {
        return resERR(ctx, e)
    }
}