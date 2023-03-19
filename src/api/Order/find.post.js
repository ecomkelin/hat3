let OrdertCL;
module.exports = async (ctx) => {
    try {
        if (!OrdertCL) OrdertCL = require("../../Models/order/Order.Model");

        const { reqBody: { step }, Koptions: { payload } } = ctx;
        if(!isObjectIdAbs(payload._id)) throw "请先登录";

        const match = {
            Client: payload._id
        };
        if(step && !isNaN(step)) match.step = parseInt(step);

        /** 开始执行 */
        const cursor = OrdertCL.COLLECTION.find(match).sort({at_crt: -1});
        const objects = await cursor.toArray();
        await cursor.close();

        return ctx.success = { objects };
    } catch (e) {
        return ctx.fail = e;
    }
}