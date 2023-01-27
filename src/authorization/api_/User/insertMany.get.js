const UserCL = require("../../Models/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.insertMany(ctx.req, {writeConcer: "majority"} );
        return resSUCCESS(ctx, data);
    } catch(e) {
        return resERR(ctx, e)
    }
}