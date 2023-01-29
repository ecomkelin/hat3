const UserCL = require("../../Models/auth/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.findOne(ctx);
        return ctx.success = {data}
    } catch(e) {
        return ctx.fail = e;
    }
}