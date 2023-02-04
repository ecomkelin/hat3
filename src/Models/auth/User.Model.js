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
        type: Number,
        required: true,
        CONF: {
            vals: [10, 20, 30, 40, 100],
            desc: {
                10: "manager",
                20: "sfer",
                30: "pder",
                40: "designer",
                100: "Client"
            }
        }
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
            payloadReq: ({match}, payload) => {
                match.role = {"$gte": payload.role};
            }
        },
        findOne: {
            payloadReq: ({match}, payload) => {
                match.role = {"$gte": payload.role};
            }
        },
        insertOne: {
            permissionConf: { roles: [10] },
            payloadReq: ({document}, payload) => {
                if(document.role < payload.role) throw "您无权添加这个角色"
            }
        },
        deleteOne: {
            permissionConf: { roles: [10] },
            payloadObject: (reqBdoy, {object, payload}) => {
                if(object.role <= payload.role) throw "您无权删除这个角色"
            }
        },
        updateOne: { 

        },

        updateMany: { },
        insertMany: { },
        deleteMany: {
            payloadReq: ({}, payload) => {
                if(document.role < payload.role) throw "您无权添加这个角色"
            }
        },
        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    },
    customizeCB: {
        insertOne: async ctx => console.info("customizeCB 样本 暂时先不写 CLmodel 就是当前文件要暴露的对象"),
    },
}

module.exports = DB(CLname, CLdoc, CLoptions);;