const OrderCL = require("../../Models/Os_online.Model");

module.exports = async ctx => {
    try {
        const OrderDoc = {
            code: "d002",
            User_id: "636aaa2cf67700dc5f28638c",
            itemSkus: [
                { Sku_id: "636a8e2b2477161a2ad41166", code: "003", name: "Sku_3", price: 5, qty: 10 },
                { Sku_id: "636a8e2b2477161a2ad41169", code: "005", name: "Sku_5", price: 5, qty: 5 },
            ]
        }
        const data = await insertOneSession(OrderDoc);

        return ctx.success = {data}
    } catch (e) {
        return ctx.fail = e;
    }
}



const UserCL = require("../../../authorization/Models/User.Model");
// const SkuCL = require("../../../production/Models/Sku.Model");


/** transactionOptions */
const trConf = {
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' },
    readPreference: 'primary'
}

const insertOneSession = (OrderDoc) => new Promise(async (resolve, reject) => {
    try {
        const Koptions = {};
        let session = null;
        if (IS_REPLICA) {
            session = OrderCL.mongoClient.startSession();
            session.startTransaction(trConf);
            Koptions.session = session;
        }

        const OrderResult = await OrderCL.insertOne(
            OrderDoc,
            Koptions
        );

        const UserResult = await UserCL.insertOne({
            code: "uu01",
            name: "user01",
            desp: "from order"
        }, Koptions)

        // let itemSkus = OrderDoc.itemSkus;
        // for (let i = 0; i < itemSkus.length; i++) {
        //     const itemSku = itemSkus[i];
        //     // Cancel the transaction when you have insufficient inventory
        //     let Sku_id = newObjectId(itemSku.Sku_id);
        //     // const SkuUpd = await SkuCL.updateOne(
        //     //     { _id: Sku_id, qty: { $gte: itemSku.qty } },
        //     //     { $inc: { 'qty': -itemSku.qty } },
        //     //     Koptions
        //     // );
        //     // const res_SkuUpd = await axios.post()
        //     if (SkuUpd.modifiedCount === 0) return reject("Sku 不符合条件");
        // }

        if (IS_REPLICA) {

            await session.commitTransaction();
            await session.endSession();
        }

        return resolve(OrderResult);
    } catch (e) {
        return reject(e)
    }
});

