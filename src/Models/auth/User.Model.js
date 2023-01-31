const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "User";

const CLdoc = {
    code: {
        type: String,
        // unique: true,
        MIN: 2,
        MAX: 4
    },
    Firm: {
        type: ObjectId,
        ref: 'Firm'  // 如果和 field 字段相同 可以省略不写
    },
    Firms: [{
        type: ObjectId,
        ref: 'Firm'
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

    AutoRoute: {
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

        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);