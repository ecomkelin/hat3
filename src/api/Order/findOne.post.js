let OrdertCL;
module.exports = async (ctx) => {
    try {
        if (!OrdertCL) OrdertCL = require("../../Models/order/Order.Model");

        const { reqBody: { _id }, Koptions: { payload } } = ctx;
        if(!isObjectIdAbs(payload._id)) throw "请先登录";
        if (!isObjectIdAbs(_id)) throw "body._id 为 ObjectId 类型";

        const match = {
            _id,
            Client: payload._id
        };

        /** 开始执行 */
        const object = await OrdertCL.COLLECTION.findOne(match);

        return ctx.success = { object };
    } catch (e) {
        return ctx.fail = e;
    }
}