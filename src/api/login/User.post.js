const login = require("./index");
module.exports = async ctx => {
    try {
        const data = await login(UserCL, ctx.reqBody);

        ctx.success = data
    } catch(e) {
        ctx.fail = e;
    }
}