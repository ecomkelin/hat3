const CLmodelUser = modelsMap.User;
const login = require("./index");
module.exports = async ctx => {
    try {
        const data = await login(CLmodelUser, ctx.reqBody);

        ctx.success = data
    } catch(e) {
        ctx.fail = e;
    }
}