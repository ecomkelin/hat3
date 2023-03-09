let SkuCL;
let LogSkuOrderCL;
let CartCL;
let OrderCL;
const moment = require("moment");
module.exports = async (ctx) => {
    try {
        if (!SkuCL) SkuCL = require("../../Models/production/Sku.Model");
        if (!LogSkuOrderCL) LogSkuOrderCL = require("../../Models/production/LogSkuOrder.Model");

        if (!CartCL) CartCL = require("../../Models/order/Cart.Model");
        if (!OrderCL) OrderCL = require("../../Models/order/Order.Model");

        const { reqBody: { Cart_ids }, Koptions: { payload } } = ctx;
        if (!isObjectIdAbs(payload._id)) throw "请先登录";
        if(!Cart_ids || !(Cart_ids instanceof Array) || Cart_ids.length < 1) throw "Cart_ids 必须为ObjectId 数组"
        for (let i in Cart_ids) {
            let id = Cart_ids[i];
            if (!isObjectIdAbs(id)) throw "传递的 Cart_ids 数组中的每个元素必须为 ObjectId"
        }

        const CartMatch = { _id: { "$in": Cart_ids }, Client: payload._id };
        /** 开始执行 */
        const pipelines = [
            { "$match": CartMatch },
            {
                "$lookup": {
                    from: "Sku",
                    localField: "Sku",
                    foreignField: "_id",
                    as: "Sku_as"
                }
            },
            {
                "$lookup": {
                    from: "Pd",
                    localField: "Pd",
                    foreignField: "_id",
                    as: "Pd_as"
                }
            },
        ]
        const cursor = CartCL.COLLECTION.aggregate(pipelines);
        const Carts = await cursor.toArray();
        await cursor.close();
        if(Cart_ids.length !== Carts.length) throw "购物车数据变动请刷新重试"

        const dateNow = Date.now();

        const object = {
            _id: newObjectId(),
            code: moment(dateNow).format("YYMMDDhhmmss"),
            Client: payload._id,
            source: 'weixin',
            step: 1,
            lines: [],
            goods_retail: 0,
            goods_sale: 0,
            at_crt: dateNow,
        };
        const docLogSkuOrders = [];

        for (let i in Carts) {
            const Cart = Carts[i];
            if (!Cart.Pd_as || !Cart.Pd_as[0]) throw `购物车中 ${Cart.name} 商品已经不存在`
            const Pd = Cart.Pd_as[0];
            if (!Pd.is_usable)`购物车中 ${Pd.name} 商品已经下架`

            if (!Cart.Sku_as || !Cart.Sku_as[0]) throw `购物车中 ${Cart.name} 商品Sku已经不存在`
            const Sku = Cart.Sku_as[0];
            if (!Sku.is_usable)`购物车中 ${Cart.name} 商品已经下架`

            object.lines.push({
                Pd: Pd._id,
                Sku: Sku._id,

                code: Pd.code,
                name: Pd.name,
                img: Pd.imgs[0],

                price_retail: Sku.price_retail,  // 产品标价
                price_sale: Sku.price_sale,     // 产品折扣价
                qty: Cart.qty,
            });
            object.goods_retail += Sku.price_retail * Cart.qty;
            object.goods_sale += Sku.price_sale * Cart.qty;
            docLogSkuOrders.push({
                Client: payload._id,
                Order: object._id,
                Sku: Sku._id,

                Pd: Pd._id,

                price_retail: Sku.price_retail,  // 产品标价
                price_sale: Sku.price_sale,     // 产品折扣价

                qty: Cart.qty,

                at_crt: dateNow,
                at_upd: dateNow,
            });
        }

        if(docLogSkuOrders.length > 0) {
            await LogSkuOrderCL.COLLECTION.insertMany(docLogSkuOrders);
            await OrderCL.COLLECTION.insertOne(object);
    
            await CartCL.COLLECTION.deleteMany(CartMatch);
        }

        return ctx.success = { object };
    } catch (e) {
        return ctx.fail = e;
    }
}