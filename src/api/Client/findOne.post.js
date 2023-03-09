let ClientCL;
module.exports = async(ctx) => {
    try {
        if(!ClientCL) ClientCL = require("../../Models/auth/Client.Model");

        const {Koptions: {payload}} = ctx;
        if(!isObjectIdAbs(payload._id)) throw "登录信息错误";

        const object = await ClientCL.COLLECTION.findOne({_id: payload._id});
        if(!object) throw "数据库中找不到此用户"

        return ctx.success =  {object};
    } catch (e) {
        return ctx.fail = e;
    }
}