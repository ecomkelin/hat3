/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Sku";

const CLdoc = {
    Pd: {
        type: ObjectId,
        ref: "Pd",
        required: true,
        IS_fixed: true
    },
    // kv_attrs: [{
    //     Attk: { type: ObjectId, ref: "Attk" },
    //     Attv: {type:ObjectId, ref: "Attv"}
    // }],
    kv_attrs: [{
        Attk: { type: String },
        Attv: { type: String }
    }],

    desc: { type: String },

    price_retail: { type: "Float" },    // 建议零售价
    price_sale: { type: "Float" },    // 手动折扣价
    price_cost: { type: "Float" },    // 手动折扣价

    ...docBasic
}

let PdCL;
const CLoptions = {
    indexesObj: { "code": 1 },

    Routes: {
        countDocuments: {},
        find: {},
        findOne: {},
        insertOne: {
            roles: role_pder,
            execCB: async ({ reqBody: { document: { _id, Pd } }, Koptions: { payload } }) => {
                try {
                    if (!isObjectIdAbs(Pd)) throw "添加 Sku 时 body.document.Pd 为 ObjectId "
                    if (!PdCL) PdCL = require("./Pd.Model");
                    const match = { _id: Pd }
                    const PdObj = await PdCL.COLLECTION.findOne(match);
                    if (!PdObj) throw "添加 Sku 时 数据库中 没有 相应产品"
                    PdObj.Skus.push(_id);
                    const update = {
                        "$set": {
                            Skus: PdObj.Skus,
                            at_upd: Date.now(),
                            upd_User: payload._id
                        }
                    }
                    const res_upd = await PdCL.COLLECTION.updateOne(match, update);
                    if (res_upd.modifiedCount === 0) throw "添加 Sku 时 更改 Pd 无变化"

                } catch (e) {
                    throw e;
                }
            }
        },
        insertMany: { roles: role_pder },
        updateOne: { roles: role_pder },
        updateMany: { roles: role_pder },
        deleteOne: {
            roles: role_pder,
            execCB: async ({ Koptions: { payload, object: { _id, Pd } } }) => {
                try {
                    if (!isObjectIdAbs(Pd)) throw "添加 Sku 时 body.document.Pd 为 ObjectId "
                    if (!PdCL) PdCL = require("./Pd.Model");
                    const match = { _id: Pd }
                    const PdObj = await PdCL.COLLECTION.findOne(match);
                    if (!PdObj) throw "删除 Sku 时 数据库中找不到相应 Pd";
                    if (PdObj.Skus.length < 2) throw "此产品已经是单一产品 不能再删除 Sku";
                    let index = 0;
                    for (; index < PdObj.Skus.length; index++) {
                        if (String(PdObj.Skus[index]) === String(_id)) break;
                    }
                    if (index === PdObj.Skus.length) throw "删除 Sku 时 数据库Pd中 没有此 Sku"
                    PdObj.Skus.splice(index, 1);
                    const update = {
                        "$set": {
                            Skus: PdObj.Skus,
                            at_upd: Date.now(),
                            upd_User: payload._id
                        }
                    }
                    const res_upd = await PdCL.COLLECTION.updateOne(match, update);
                    if (res_upd.modifiedCount === 0) throw "添加 Sku 时 更改 Pd 无变化"
                } catch (e) {
                    throw e;
                }
            }
        },

        // deleteMany: { roles: role_pder },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);;