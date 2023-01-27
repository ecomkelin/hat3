const UserCL = require("../../Models/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.dropIndex(ctx.req, {dropIndex: {"code": 1}});
        return resSUCCESS(ctx, data);
    } catch(e) {
        return resERR(ctx, e)
    }
}