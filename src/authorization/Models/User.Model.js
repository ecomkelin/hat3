const DB = require("../../../bin/DB");
const CLname = "User";

const CLdoc = {
    code: {
        type: String,
        unique: true,
        MIN: 2,
        MAX: 4
    },
    pwd: {
        required: true,
        type: String,
        MIN: 2,
        MAX: 4
    },
    name: {
        type: String,
        // IS_fixed: true,
        // unique: true,
    },
    addrs: [{
        city: { type: String },
        via: { type: String }
    }]
}

const CLoptions = {
    /** 对哪个字段加密 */
    needEncryption: {
        method: "md5",
        fields: "pwd"
    },
    /** 创建索引 */
    indexesObj: [{
        "code": 1
    }, {
        "name": 1
    }],

    GenRoute: {
        countDocuments: {},
        find: {
            // restrict: { },
            api: { }
        },
        findOne: {},

        deleteMany: {},
        deleteOne: {},
        insertMany: {},
        insertOne: {},
        updateMany: {},
        updateOne: {},

        indexes: {},
        createIndex:{},
        // dropIndex: {},
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);