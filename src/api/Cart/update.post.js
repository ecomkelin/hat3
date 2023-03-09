let CartCL;

module.exports = async(ctx) => {
    try {
        if (!CartCL) CartCL = require("../../Models/order/Cart.Model");

        let { reqBody: {_id, qty, is_checked}, Koptions: { payload } } = ctx;
        if(!isObjectIdAbs(_id)) throw "body._id 要为 ObjectId";
        
        const upd = {};
        if(!isNaN(qty)) {
            qty = parseInt(qty);
            if(qty < 1) throw "修改数量 不能小于1"
            upd.qty = qty;
        }
        /** 暂时先不用 */
        // else if(is_checked) {
        //     upd.qty = (is_checked === true || is_checked == 1 || is_checked === 'true') ? true : false;
        // }
        if(Object.keys(upd).length === 0) throw "更新购物车时 需要传入 qty 或 is_checked 字段";
 
        const resUpd = await CartCL.COLLECTION.updateOne({_id, Client: payload._id}, {"$set": upd});
        return ctx.success = resUpd;
    } catch (e) {
        return ctx.fail = e;
    }
}