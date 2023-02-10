/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Supplier";

const CLdoc = {
    code: {
        type: String,
        required: true,
        unique: true,
        MIN: 1,
        MAX: 8
    },
    desc: { type: String },
    icon: {
        type: String,
        ALLOW_upload: true
    },

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