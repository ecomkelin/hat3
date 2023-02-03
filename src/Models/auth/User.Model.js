const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "User";

const CLdoc = {
    code: {
        type: String,
        // unique: true,
        MIN: 1,
        MAX: 4
    },
    pwd: {
        type: String,
        ENcryption: "md5", // 加密方式
    },
    categs: [{
        type: String,
        MIN: 2,
        MAX: 4
    }],
    name: {
        type: String,
        MAX: 3
    },
    at_upd: {
        type: String,
        AUTO_Date: true
    },
    at_crt: {
        type: String,
        AUTO_Date: true,
        IS_fixed: true,
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
        insertOne: {
            documentCB: (document, Koptions) => {
                // console.log("CB:", document)
            },
            semiCB: (Koptions) => new Promise(async (resolve, reject) => {
                try {
                    return resolve();
                } catch (e) {
                    return reject(e);
                }
            }),
        },
        updateMany: {},
        updateOne: {},

        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);