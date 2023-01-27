let DB = null;
switch(process.env.USEDB) {
    case "mongoose":
        DB = require("./mongoose");
        break;
    default:
        DB = require("./mongodb_nodejs");
}

module.exports = DB;