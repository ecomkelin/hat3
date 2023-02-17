/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Sku";

const CLdoc = {
    Pd: {
        type: ObjectId,
        ref: "Pd",
        IS_fixed: true
    },
    kv_attrs: [{
        Attk: { type: ObjectId, ref: "Attk" },
        Attvs: {type:ObjectId, ref: "Attv"}
    }],

    code: {
        type: String,
        required: true,
        unique: true,
        MIN: 1,
        MAX: 8
    },
    name: {
        type: String
    },
    desc: { type: String },
    imgs: [{
        type: String,
        ALLOW_upload: true
    }],

    ...docBasic
}

const CLoptions = {
    indexesObj: { "code": 1 },

    Routes: {
        countDocuments: {},
        find: {},
        findOne: {},
        insertOne: { roles: role_pder },
        insertMany: { roles: role_pder },
        updateOne: { roles: role_pder },
        updateMany: { roles: role_pder },
        deleteOne: { roles: role_pder },

        deleteMany: { roles: role_pder },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);;