/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Attk";

const CLdoc = {
    code: {
        type: String,
        unique: true,
        required: true,
        MIN: 1,
        MAX: 8
    },
    desc: { type: String },
}

let AttvCL = require("./Attv.Model");
const CLoptions = {
    indexesObj: { "code": 1 },
    Routes: {
        countDocuments: {},
        find: {
            execCB: async ({reqBody, Koptions}) => {
                if(Object.keys(AttvCL).length < 1) AttvCL = require("./Attv.Model");
                if (reqBody.find) {
                    const { objects } = Koptions;
                    for (let i in objects) {
                        let object = objects[i];
                        const cursor = AttvCL.COLLECTION.find({ Attk: object._id });
                        const Attvs = await cursor.toArray();
                        await cursor.close();
                        object.Attvs = Attvs;
                    }
                }
            }
        },
        findOne: {
            execCB: async ({ reqBody, Koptions }) => {
                if (Object.keys(AttvCL).length < 1) AttvCL = require("./Attv.Model");
                if (reqBody.find) {
                    const { object } = Koptions;

                    const cursor = AttvCL.COLLECTION.find({ Attk: object._id });
                    const Attvs = await cursor.toArray();
                    await cursor.close();

                    object.Attvs = Attvs;
                }
            }
        },
        insertOne: { roles: role_pder },
        insertMany: { roles: role_pder },
        updateOne: { roles: role_pder },
        updateMany: { roles: role_pder },
        deleteOne: {
            roles: role_pder,
            execCB: async (ctxObj) => {

            }
        },

        deleteMany: {
            roles: role_pder,
            execCB: async (ctxObj) => {

            }
        },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);;