/** 销售单 Sales Order: 销售员 */

const DB = require("../../../bin/DB");
const CLname = "Os_seller";

const CLdoc = {
    code: {type: String},
    name: {type: String}
}

module.exports = DB(CLname, CLdoc);