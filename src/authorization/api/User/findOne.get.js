const UserCL = require("../../Models/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.findOne(ctx.req,{});
        return resSUCCESS(ctx, data);
    } catch(e) {
        return resERR(ctx, e)
    }
}