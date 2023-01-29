const UserCL = require("../../Models/auth/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.createIndex(ctx.reqBody, {createIndex: {"code": 1}});
        return ctx.success = {data};
    } catch(e) {
        return ctx.fail = e;
    }
}