const OrderCL = require("../../Models/Os_online.Model");

module.exports = async ctx => {
    try {
        let docs = await OrderCL.find({},{});

        return resSUCCESS(ctx, {docs});
    } catch(e) {
        return resERR(ctx, e)
    }
}