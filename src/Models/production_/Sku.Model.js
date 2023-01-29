const DB = require("../../../bin/DB");
const CLname = "Sku";

const CLdoc = {
    code: String,
    name: String,

    qty: Number,
}

module.exports = DB(CLname, CLdoc);