/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Pd";

const CLdoc = {
    code: {
        type: String,
        required: true,
        // unique: true,
        MIN: 2, MAX: 20, REGEXP: '^[a-zA-Z0-9]*$'
    },
    name: { type: String },
    desc: { type: String },
    imgs: [{ type: String, ALLOW_upload: true }],

    price: { type: String },
    note: { type: String }, // 备注 后台人看的


    Brand: { type: ObjectId, ref: "Brand" },
    Cateb: { type: ObjectId, ref: "Cateb" },
    Catefs: [{ type: ObjectId, ref: "Catef" }],

    // kvs_attrs: [{
    //     Attk: { type: ObjectId, ref: "Attk" },
    //     Attvs: [{ type: ObjectId, ref: "Attv" }]
    // }],
    kvs_attrs: [{
        Attk: { type: String },
        Attvs: [{ type: String }]
    }],

    Skus: [{ type: ObjectId, ref: "Sku" }],

    // Supplier: { type: ObjectId, ref: "Supplier" },

    ...docBasic
}

let SkuCL;
let Pd_insertMany;
const CLoptions = {
    indexesObj: { "code": 1 },

    Routes: {
        countDocuments: {},
        find: {},
        findOne: {},
        insertOne: {
            roles: role_pder,
            parseCB: async ({ reqBody: { document }, Koptions }) => {
                let { price_retail, price_sale, price_cost } = document;
                delete document.price_retail
                delete document.price_sale
                delete document.price_cost
                document._id = newObjectId();
                if (isNaN(price_sale)) throw "price_sale 只能为数字";
                price_sale = parseFloat(price_sale);
                if (isNaN(price_retail)) price_retail = price_sale;
                price_retail = parseFloat(price_retail);

                if (price_cost) {
                    if (isNaN(price_cost)) throw "price_cost 必须为数字",
                        price_cost = parseFloat(price_cost);
                } else {
                    price_cost = undefined;
                }
                const Sku = {
                    _id: newObjectId(),
                    Pd: document._id,
                    price_retail,
                    price_sale,
                    price_cost,

                    kv_attrs: null,
                    at_crt: document.at_crt,
                    at_upd: document.at_upd,
                }
                document.Skus = [Sku._id]

                Koptions.Sku = Sku;
            },
            parseAfter: async ({ Koptions: { Sku } }) => {
                try {
                    /** 不能再上面添加 因为如果 parseDocument 出错 Sku 已经添加了 */
                    if (!SkuCL) SkuCL = require("./Sku.Model");
                    await SkuCL.COLLECTION.insertOne(Sku);
                } catch (e) {
                    throw e;
                }
            }
        },
        insertMany: {
            roles: role_pder,
            parseCB: async ({ reqBody: { documents }, Koptions }) => {
                try {
                    if(!Pd_insertMany) Pd_insertMany = require("./Pd_insertMany");
                    if (!(documents instanceof Array)) {throw " 批量添加 Pd documents 必须是数组"};
                    let Skus = [];
                    // let codes = [];
                    for (let i in documents) {
                        let document = documents[i]
                        document._id = newObjectId();

                        /** 查找新上传的产品 编号是否相同 */
                        // const code = document.code;
                        // let REGEXP = new RegExp(CLdoc.code.REGEXP);
                        // if (!REGEXP.test(code)) throw `code的值为: [${code}] 不符合规则`;
                        // if(codes.includes(code)) throw `新增产品编号有多个 [${code}]`;
                        // codes.push(code);

                        /** 制作缩略图 */
                        document.imgs = Pd_insertMany(document.number);
                        delete document.number;

                        let Sku = document.Skus[0];
                        if (isNaN(Sku.price_sale)) throw "Sku.price_sale 必须为数字"
                        if (isNaN(Sku.price_retail)) Sku.price_retail = Sku.price_sale;
                        if (Sku.price_cost) {
                            if (isNaN(Sku.price_cost)) throw "Sku.price_cost 必须为数字";
                        }
                        Sku.Pd = document._id;
                        if (!isObjectIdAbs(Sku.Pd)) throw "Sku.Pd 必须为 ObjectId";
                        Sku._id = newObjectId();
                        document.Skus = [Sku._id];

                        Skus.push(Sku);
                    }
                    // /** 查找数据库中 是否有相同的 code */
                    // const exist = await PdCL.COLLECTION.findOne({_id: {"$in": codes}});
                    // console.log(exist);
                    // if(exist) throw `数据库中存在相同的 编号 [${exist.code}]`

                    Koptions.Skus = Skus;
                } catch (e) {
                    throw e;
                }
            },
            parseAfter: async ({ Koptions: { Skus } }) => {
                try {
                    /** 不能再上面添加 因为如果 parseDocument 出错 Sku 已经添加了 */
                    if (!SkuCL) SkuCL = require("./Sku.Model");
                    const res = await SkuCL.COLLECTION.insertMany(Skus);
                } catch (e) {
                    throw e;
                }
            }
        },
        updateOne: { roles: role_pder },
        updateMany: {
            roles: role_pder,
        },
        deleteOne: {
            roles: role_pder,
            execCB: async ({ Koptions: { object } }) => {
                try {
                    let Sku_dels = [];
                    for (let j in object.Skus) {
                        Sku_dels.push(object.Skus[j]);
                    }
                    if (!SkuCL) SkuCL = require("./Sku.Model");
                    if (Sku_dels.length > 0) await SkuCL.COLLECTION.deleteMany({ _id: { "$in": Sku_dels } });
                } catch (e) {
                    throw e
                }
            }
        },

        deleteMany: {
            roles: role_pder,
            parseCB: async ({ reqBody: { filter } }) => {
                try {
                    const { includes: { _id } } = filter;
                    if (!_id) throw "批量删除的话 需要获取 body.filter.includes._id: 必须为数组[]"
                    /** 其他条件不判断 */
                    filter = { filter: { includes: { _id } } };
                } catch (e) {
                    throw e;
                }
            },
            execCB: async ({ Koptions: { objects } }) => {
                try {
                    if (!(objects instanceof Array)) throw "objects必须为数组"
                    let Sku_dels = [];
                    for (let i in objects) {
                        const object = objects[i];
                        for (let j in object.Skus) {
                            Sku_dels.push(object.Skus[j]);
                        }
                    }

                    if (!SkuCL) SkuCL = require("./Sku.Model");
                    if (Sku_dels.length > 0) await SkuCL.COLLECTION.deleteMany({ _id: { "$in": Sku_dels } });
                } catch (e) {
                    throw e
                }
            }
        },
    }
}

const PdCL = DB(CLname, CLdoc, CLoptions);;
module.exports = PdCL