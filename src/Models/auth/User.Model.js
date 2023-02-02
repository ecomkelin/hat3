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
    name: {type: String},
    at_upd: {
        type: String,
        AUTO_Date: true
    }
}

const CLoptions = {
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