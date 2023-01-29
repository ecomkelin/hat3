const UserCL = require("../../Models/auth/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.dropIndex(ctx.reqBody, {dropIndexObj: {"code": 1}});
        return ctx.success = {data};
    } catch(e) {
        return ctx.fail = e;
    }
}