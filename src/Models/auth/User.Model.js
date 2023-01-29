const DB = require(path.join(process.cwd(), "bin/DB"));
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
    role: {
        type: Number,
        required: true,
        CONF: {
            vals: [1, 2, 3],
            desp: {
                "1": "可以做什么",
                "2": "可以做什么",
                "3": "可以做什么"
            }
        }
    },
    name: { type: String, },
    Firm: {
        type: ObjectId,
        ref: "Firm"
    },
    at_crt: {
        type: Date,
        AUTO_Date: true,
        IS_fixed: true
    },
    at_upd: {
        type: Date,
        AUTO_Date: true
    }
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