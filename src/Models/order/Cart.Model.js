/** 采购订单 Purchase Order */

const DB = require("../../../bin/DB");
const CLname = "Cart";

const CLdoc = {
    /** 唯一判定 */
    Client: { type: Object, def: 'Client' },
    Sku: { type: Object, def: 'Sku' },

    qty: {type: Number},

    /** 就当作是 排序 和产品信息吧 */
    Pd: { type: Object, def: 'Pd' },
    name: {type: String},

    /** 暂时先不用 */
    // is_checked: {type: Boolean},

    sort_Client: { type: Number, default: 0 },

    at_crt: {
        type: Date,
        AUTO_Date: true,
        IS_fixed: true
    },
    at_upd: {
        type: Date,
        AUTO_Date: true
    },
};

const CLoptions = {
    indexesObj: [{ "Client": 1 }, { "Pd": 1 }],

    Routes: {
        countDocuments: {},
        find: {
            roles: [10],
        },
        findOne: {
            roles: [10],
        },
        deleteOne: {
            roles: [10],
            parseAfter: ({ match }, payload) => {
                match.role = { "$gt": payload.role };
            }
        },

        deleteMany: {
            roles: [10],
            parseAfter: ({ match }, payload) => {
                match.role = { "$gt": payload.role };
            }
        },
        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    },
}


module.exports = DB(CLname, CLdoc, CLoptions);