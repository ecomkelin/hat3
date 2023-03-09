/** Sku的销售记录 */

const DB = require("../../../bin/DB");
const CLname = "LogSkuOrder";

const CLdoc = {
    Client: { type: Object, ref: "Client" },
    Order: { type: Object, ref: "Order" },
    Sku: { type: Object, ref: "Sku" },

    Pd: { type: Object, ref: "Pd" },

    price_retail: { type: Number },  // 产品标价
    price_sale: { type: Number },     // 产品折扣价

    qty: { type: Number },

    at_crt: { type: Date },
    at_upd: { type: Date },
}

module.exports = DB(CLname, CLdoc);