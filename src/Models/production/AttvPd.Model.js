/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "AttkPd";

const CLdoc = {
    // Pd: {type: ObjectId, ref: "Pd", required: true, IS_fixed: true},
    AttrPd: {type: ObjectId, ref: "AttrPd", required: true, IS_fixed: true},
    code: {
        type: String,
        required: true,
        // unique: true,
        MIN: 2, MAX: 20, REGEXP: '^[a-zA-Z0-9]*$'
    },
    desc: { type: String },
    img: { type: String, ALLOW_upload: true },
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