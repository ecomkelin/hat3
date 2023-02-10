/** Category Back 后台类目 */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Cateb";

const CLdoc = {
    far_Cateb: {
        type: ObjectId, ref: "Cateb",
        IS_fixed: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
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

    is_leaf: {
        type: Boolean,
        default: false
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
            parseAfter: ({ match }) => {
                if (!match.level) match.level = 1;
            }
        },
        findOne: {},
        insertOne: {
            roles: role_pder,
            execCB: async({ reqBody = {} }) => {
                const { document = {} } = reqBody
                /** 如果 有父分类 则为二级分类， 否则为1级 */
                document.level = document.far_Cateb ? 2 : 1;
            }
        },
        insertMany: { roles: role_pder },
        updateOne: { roles: role_pder },
        updateMany: { roles: role_pder },
        deleteOne: { roles: role_pder },

        deleteMany: { roles: role_pder },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);;