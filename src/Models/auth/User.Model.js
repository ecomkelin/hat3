const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "User";

const CLdoc = {
    code: {
        type: String,
        // unique: true,
        MIN: 2,
        MAX: 4
    },
    pwd: {
        type: String,
        ENcryption: "md5", // 加密方式
    },
    at_crt: {
        type: String,
        AUTO_Date: true
    }
}

const CLoptions = {
    /** 对哪个字段加密 */
    // needEncryption: {
    //     method: "md5",
    //     fields: "pwd"
    // },
    /** 创建索引 */
    indexesObj: [{
        "code": 1
    }, {
        "name": 1
    }],

    Routes: {
        countDocuments: {},
        find: {
            // restrict: { },
        },
        findOne: {},

        deleteMany: {},
        deleteOne: {},
        insertMany: {},
        insertOne: {},
        updateMany: {},
        updateOne: {},

        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);