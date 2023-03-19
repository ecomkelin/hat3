let OrderCL;

module.exports = async (ctx) => {
    try {
        if (!OrderCL) OrderCL = require("../../Models/order/Order.Model");

        const { reqBody: { _id, ship }, Koptions: { payload } } = ctx;
        if (!isObjectIdAbs(payload._id)) throw "请先登录";
        if (!isObjectIdAbs(_id)) throw "body._id 必须为 ObjectId";

        if(!ship.name) throw "请填写收货人姓名";
        if(!ship.tel) throw "请填写收货人电话";
        if(!ship.city) throw "请填写收货城市";
        if(!ship.addr) throw "请填写收货地址";
        delete ship._id;

        const match = {_id, Client: payload._id};
        const object = await OrderCL.COLLECTION.findOne(match);
        if(!object) throw "数据库中没有此 数据";
        if(object.step !== 1) throw "此订单的状态已经不为1"
        
        const updRes = await OrderCL.COLLECTION.updateOne(match, {"$set": {step: 5, ship}});

        return ctx.success = { object, updRes };
    } catch (e) {
        return ctx.fail = e;
    }
}