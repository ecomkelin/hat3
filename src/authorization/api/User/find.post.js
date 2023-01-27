const UserCL = require("../../Models/User.Model");
module.exports = async ctx => {
    try {
        const payload = ctx.request.payload;
        let data = await UserCL.find(ctx.req,{payload, readPreference: "secondary"});

        return resSUCCESS(ctx, data);
    } catch(e) {
        return resERR(ctx, e)
    }
}