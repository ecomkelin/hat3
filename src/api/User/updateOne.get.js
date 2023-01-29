const UserCL = require("../../Models/auth/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.updateOne(ctx.reqBody, {$set: {code: "hlt05", name: "User05"}}, {writeConcer: "majority"});
        return ctx.success = {data};
    } catch(e) {
        return ctx.fail = e;
    }
}