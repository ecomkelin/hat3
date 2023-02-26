const login = require("./index");
const UserCL = require("../../Models/auth/User.Model")
module.exports = async ctx => {
    try {
        const data = await login(UserCL, ctx.reqBody);
        ctx.success = data
    } catch(e) {
        ctx.fail = e;
    }
}