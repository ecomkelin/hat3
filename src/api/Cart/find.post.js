const getPiplines = require(path.resolve(process.cwd(), 'bin/DB/config/getPiplines'));

let CartCL;
module.exports = async (ctx) => {
    try {
        if (!CartCL) CartCL = require("../../Models/order/Cart.Model");

        const { reqBody, Koptions: { payload } } = ctx;

        if (!reqBody.match) reqBody.match = {};
        reqBody.match.Client = payload._id;

        reqBody.lookups = [{
            from: "Pd",
            localField: "Pd",
            foreignField: "_id",
            as: "Pd_as"
        }, {
            from: "Sku",
            localField: "Sku",
            foreignField: "_id",
            as: "Sku_as"
        }];

        /** 开始执行 */
        const pipelines = getPiplines(reqBody, { is_Many: true });
        const cursor = CartCL.COLLECTION.aggregate(pipelines);
        const objects = await cursor.toArray();
        await cursor.close();

        return ctx.success = { objects };
    } catch (e) {
        return ctx.fail = e;
    }
}