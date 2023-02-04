const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "User";

const CLdoc = {
    code: {
        type: String,
        unique: true,
        required: true,
        IS_fixed: true,
        MIN: 4,
        MAX: 10
    },
    pwd: {
        type: String,
        required: true,
        ENcryption: "md5", // 加密方式
        MIN: 6,
        MAX: 15
    },
    role: {
        type: Number
    },
    name: {type: String},
    at_crt: {
        type: Date,
        AUTO_Date: true,
        IS_fixed: true
    },
    at_upd: {
        type: Date,
        AUTO_Date: true
    },
    crt_User: {
        type: ObjectId,
        ref: 'User',
        AUTO_payload: "_id",
        IS_fixed: true
    },
    upd_User: {
        type: ObjectId,
        ref: 'User',
        AUTO_payload: "_id",
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
            // payloadCB: (reqBody, Koptions) => {
            //     const {match} = reqBody;
            //     const {payload} = Koptions;
            //     if(payload.role > 9) {
            //         match.Firm = payload.Firm;
            //     }
            //     match.role = {"gt": payload.role};
            // }
        },
        findOne: {},

        updateMany: { },
        updateOne: { },
        insertMany: { },
        insertOne: { },
        deleteOne: {},
        deleteMany: {},
        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    },
    customizeCB: {
        insertOne: async ctx => console.info("customizeCB 样本 暂时先不写 CLmodel 就是当前文件要暴露的对象"),
    },
}

module.exports = DB(CLname, CLdoc, CLoptions);;