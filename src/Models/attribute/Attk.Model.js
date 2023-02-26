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
        updateOne: { roles: role_pder },
        deleteOne: {
            roles: role_pder,
            execCB: async ({Koptions: {object}}) => {
                if(Object.keys(AttvCL).length < 1) AttvCL = require("./Attv.Model");
                const existObj = await AttvCL.COLLECTION.findOne({Attk: object._id});
                if(existObj) throw "此属性下 还有属性值 不能被删除， 除非把所有属性值删除掉"
            }
        },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);;