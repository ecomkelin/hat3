
let OrderCL;
module.exports = async (ctx) => {
    try {
        if (!OrderCL) OrderCL = require("../../Models/order/Cart.Model");

        const { reqBody, Koptions: { payload } } = ctx;

        if (!reqBody.match) reqBody.match = {};
        reqBody.match.Client = payload._id;


        /** 开始执行 */
        const cursor = OrderCL.COLLECTION.find({});
        const objects = await cursor.toArray();
        await cursor.close();

        return ctx.success = { objects };
    } catch (e) {
        return ctx.fail = e;
    }
}