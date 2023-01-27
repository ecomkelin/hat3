const UserCL = require("../../Models/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.updateOne(ctx.req, {$set: {code: "hlt05", name: "User05"}}, {writeConcer: "majority"});
        return resSUCCESS(ctx, data);
    } catch(e) {
        return resERR(ctx, e)
    }
}