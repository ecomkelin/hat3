let SkuCL;
let PdCL;
let CartCL;

module.exports = async (ctx) => {
    try {
        if (!SkuCL) SkuCL = require("../../Models/production/Sku.Model");
        if (!PdCL) PdCL = require("../../Models/production/Pd.Model");
        if (!CartCL) CartCL = require("../../Models/order/Cart.Model");

        const { reqBody: { Sku_id }, Koptions: { payload } } = ctx;
        if(!isObjectIdAbs(payload._id)) throw "请先登录";
        if (!isObjectIdAbs(Sku_id)) throw "body.Sku 为 ObjectId 类型";
        const Sku = await SkuCL.COLLECTION.findOne({ _id: Sku_id });
        if(!Sku) throw "数据库中没有此数据 Sku";
        if(!Sku.is_usable) throw "此产品已经下架 Sku";

        const Pd = await PdCL.COLLECTION.findOne({_id: Sku.Pd});
        if(!Pd) throw "数据库中没有此数据 Pd";
        if(!Pd.is_usable) throw "此产品已经下架 Pd"

        const Cart = await CartCL.COLLECTION.findOne({Client: payload._id, Sku: Sku._id});
        let object;
        if(Cart) {
            Cart.qty++;
            const qty = parseInt(Cart.qty);
            if(isNaN(qty)) throw "数量信息错误 请联系 程序员";
            await CartCL.COLLECTION.updateOne({_id: Cart._id}, {"$set": {qty}});
        } else {
            const at_crt = at_upd = Date.now;
            object = {
                _id: newObjectId(),
                Client: payload._id,
                Sku: Sku_id,
                qty: 1,
                is_checked: false,
                Pd: Pd._id,
                name: Pd.name,
                sort_Client: 0,
                at_crt,
                at_upd
            }
            await CartCL.COLLECTION.insertOne(object);
            object.Pd_as = [Pd];
            object.Sku_as = [Sku];
        }
        return ctx.success = {object, Cart, message: "成功添加到购物车"};
    } catch (e) {
        return ctx.fail = e;
    }
}