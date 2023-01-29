const CLmodel_User = require("../../Models/auth/User.Model");
module.exports = async ctx => {
    try {
        let data = await CLmodel_User.find(ctx);
        return ctx.success = {data}
    } catch(e) {
        return ctx.fail = e;
    }
}