/** 采购订单 Purchase Order */

const DB = require("../../../bin/DB");
const CLname = "Op";

const CLdoc = {
    code: {type: String},
    name: {type: String}
}

module.exports = DB(CLname, CLdoc);