/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Pd";

const CLdoc = {
    code: {
        type: String,
        required: true,
        // unique: true,
        MIN: 2, MAX: 20, REGEXP: '^[a-zA-Z0-9]*$'
    },
    name: { type: String },
    desc: { type: String },
    note: { type: String }, // 备注 后台人看的
    imgs: [{ type: String, ALLOW_upload: true }],

    Cateb: { type: ObjectId, ref: "Cateb" },

    kvs_attrs: [{
        Attk: { type: ObjectId, ref: "Attk" },
        Attvs: [{type:ObjectId, ref: "Attv"}]
    }],

    Brand: { type: ObjectId, ref: "Brand" },

    // Supplier: { type: ObjectId, ref: "Supplier" },

    ...docBasic
}

let AttkPdCL;
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
        deleteOne: {
            roles: role_pder,
            execCB: async ({ Koptions = {} }) => {
                try {
                    if (!AttkPdCL) AttkPdCL = require("./AttkPd.Model");

                    let { object } = Koptions;
                    await AttkPdCL.COLLECTION.deleteMany({ _id: { "$in": object.AttrPds } });
                } catch (e) {
                    throw "Pd deleteOne: " + e;
                }
            }
        },

        deleteMany: { roles: role_pder },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);;