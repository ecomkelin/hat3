const OrderCL = require("../../Models/Os_online.Model");

module.exports = async ctx => {
    try {
        let data = await OrderCL.find({},{});

        return ctx.success = {data}
    } catch(e) {
        return ctx.fail = e;
    }
}