let OrderCL;

module.exports = async (ctx) => {
    try {
        if (!OrderCL) OrderCL = require("../../Models/order/Order.Model");

        const { reqBody: { _id }, Koptions: { payload } } = ctx;
        if (!isObjectIdAbs(payload._id)) throw "请先登录";
        if (!isObjectIdAbs(_id)) throw "body._id 必须为 ObjectId";

        const match = {_id, Client: payload._id};
        const object = await OrderCL.COLLECTION.findOne(match);
        if(!object) throw "数据库中没有此 数据";
        if(object.step !== 1) throw "此订单的状态已经不为1"
        
        const updRes = await OrderCL.COLLECTION.updateOne(match, {"$set": {step: 5}});

        return ctx.success = { object, updRes };
    } catch (e) {
        return ctx.fail = e;
    }
}