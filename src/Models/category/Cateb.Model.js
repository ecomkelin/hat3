/** Category Back 后台类目 */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Cateb";

const CLdoc = {
    Cateb_parent: {
        type: ObjectId, ref: "Cateb",
        IS_fixed: true
    },
    code: {
        type: String,
        required: true,
        // unique: true,
        MIN: 1,
        MAX: 8
    },
    level: {
        type: Number,
        AUTO: true,
        CONF: {
            vals: [1, 2],
            desc: {
                1: "一级分类, find的时候 会默认为这个限制",
                2: "二级分类, 通过一级分类展示二级分类列表"
            }
        }
    },

    is_branch: {
        type: Boolean,
        default: true
    },

    desc: { type: String },

    poster: {
        type: String,
        ALLOW_upload: true
    },
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
        find: {
            parseAfter: async ({reqBody: {match = {}}}) => {
                if(!match.Cateb_parent) match.level = 1;
                if (!match.Cateb_parent) match.level = 1;
            },
            execCB: async ({reqBody, Koptions}) => {
                if (reqBody.find) {
                    const { objects } = Koptions;
                    for (let i in objects) {
                        let object = objects[i];
                        const cursor = CatebCL.COLLECTION.find({ Cateb_parent: object._id });
                        const Cateb_sons = await cursor.toArray();
                        await cursor.close();
                        object.Cateb_sons = Cateb_sons;
                    }
                }
            }
        },
        findOne: {
            execCB: async ({ reqBody, Koptions }) => {
                if (reqBody.find) {
                    const { object } = Koptions;

                    const cursor = CatebCL.COLLECTION.find({ Cateb_parent: object._id });
                    const Cateb_sons = await cursor.toArray();
                    await cursor.close();

                    object.Cateb_sons = Cateb_sons;
                }
            }
        },
        insertOne: {
            roles: role_pder,
            parseAfter: async({ reqBody = {} }) => {
                const { document = {} } = reqBody
                /** 如果 有父分类 则为二级分类， 否则为1级 */
                if(document.Cateb_parent) {
                    if(!isObjectIdAbs(document.Cateb_parent)) throw "Cateb Model insertOne execCB: Cateb_parent 必须是 ObjectId 类型";
                    const parentObj = await CatebCL.COLLECTION.findOne({_id: document.Cateb_parent});
                    if(!parentObj) throw "Cateb Model insertOne execCB: 数据库中没有父分类";

                    document.level = 2;
                    document.is_branch = false;
                } else {
                    document.level = 1;
                    document.is_branch = true;
                }
            }
        },
        // insertMany: { roles: role_pder },
        updateOne: { roles: role_pder },
        // updateMany: { roles: role_pder },
        deleteOne: { roles: role_pder },

        deleteMany: { roles: role_pder },
    }
}

const CatebCL = DB(CLname, CLdoc, CLoptions);;
module.exports = CatebCL;