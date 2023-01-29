const CLmodel_User = require("../../Models/auth/User.Model");
module.exports = async ctx => {
    try {
        const payload = ctx.payload;
        let data = await CLmodel_User.find(ctx.reqBody, {payload});
        return ctx.success = {data}
    } catch(e) {
        return ctx.fail = e;
    }
}