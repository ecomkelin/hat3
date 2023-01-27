const OrderCL = require("../../Models/Os_online.Model");

module.exports = async ctx => {
    try {
        let doc = await OrderCL.findById(999999,{});
        return resSUCCESS(ctx, {doc});
    } catch(e) {
        return resERR(ctx, e)
    }
}