const UserCL = require("../../Models/User.Model");

module.exports = async ctx => {
    try {
        let data = await UserCL.indexes();
        return resSUCCESS(ctx, data);
    } catch(e) {
        return resERR(ctx, e)
    }
}