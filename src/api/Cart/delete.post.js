let CartCL;

module.exports = async(ctx) => {
    try {
        if (!CartCL) CartCL = require("../../Models/order/Cart.Model");

        const { reqBody: {_id}, Koptions: { payload } } = ctx;
        const resDel = await CartCL.COLLECTION.deleteOne({_id, Client: payload._id});
        return ctx.success = resDel;
    } catch (e) {
        return ctx.fail = e;
    }
}