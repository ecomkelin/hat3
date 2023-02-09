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
            vals: role_all,
            desc: {
                10: "manager",
                20: "sfer",
                30: "pder",
                40: "designer",
                100: "Client"
            }
        }
    },
    name: { type: String },

    ...docBasic
}

const {stringMatchHash} = require(path.resolve(process.cwd(), 'core/crypto/Bcrypt'));
const CLoptions = {
    indexesObj: { "code": 1 },

    Routes: {
        countDocuments: {},
        find: {
            roles: [10],
            parseAfter: ({ match }, payload) => {
                // match.role = { "$gt": payload.role };
            }
        },
        findOne: {
            roles: [10],
            parseAfter: ({ match }, payload) => {
                match.role = { "$gte": payload.role };
            },
            findAfter: ({ object, payload }) => {
                if ((object.role === payload.role) && (String(object._id) !== String(payload._id))) throw "您无权查看这个角色";
            }
        },
        insertOne: {
            roles: [10],
            parseAfter: ({ document }, payload) => {
                if (document.role <= payload.role) throw "您无权为用户添加 这个角色"
            }
        },
        deleteOne: {
            roles: [10],
            parseAfter: ({ match }, payload) => {
                match.role = { "$gt": payload.role };
            }
        },
        updateOne: {
            roles: [10],
            parseAfter: ({ match, update }, payload) => {
                if (update["$set"].role && (update["$set"].role <= payload.role)) throw "您无权为用户更新 这个角色";
                match.role = { "$gte": payload.role };
            },
            findAfter: ({ object, payload }) => {
                if ((object.role === payload.role) && (String(object._id) !== String(payload._id))) throw "您无权修改这个角色";
            },
            execCB: async({password}, {object, payload}) => {
                if(object.role === payload.role) {
                    if(!password) throw "请传递您现在的密码 reqBody.password";
                    await stringMatchHash(password, object.pwd);
                }
            }
        },

        deleteMany: {
            roles: [10],
            parseAfter: ({ match }, payload) => {
                match.role = { "$gt": payload.role };
            }
        },
        updateMany: {
            roles: [10],
            parseAfter: ({ update }, payload) => {
                if (update["$set"].role && (update["$set"].role <= payload.role)) throw "您无权为用户更新 这个角色"
            },
            findAfter: ({ objects, payload }) => {
                for (let i in objects) {
                    let object = objects[i]
                    if (object.role <= payload.role) throw "您无权修改这个角色"
                }
            }
        },
        insertMany: {
            roles: [10],
            parseAfter: ({ documents }, payload) => {
                for (let i in documents) {
                    let document = documents[i];
                    if (document.role <= payload.role) throw "您无权为用户添加 这个角色"
                }
            }
        },
        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    },
    customizeCB: {
        // insertOne: async ctx => console.info("customizeCB 样本 暂时先不写。 CLmodel 就是当前文件要暴露的对象"),
    },
}

const CLmodel = DB(CLname, CLdoc, CLoptions);
UserCL = CLmodel;
module.exports = CLmodel;
// module.exports = DB(CLname, CLdoc, CLoptions);;