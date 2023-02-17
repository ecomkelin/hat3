/** Attribute key Attk */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Attv";

const CLdoc = {
    Attk: {
        type: ObjectId,
        ref: 'Attk',
        required: true,
    },
    code: {
        type: String,
        unifd: 'Attk',
        required: true,
        MIN: 1,
        MAX: 8
    },
    desc: { type: String },
}

let AttkCL = require("./Attk.Model");
const CLoptions = {
    indexesObj: { "code": 1 },
    api: {
        insertMany: {
            Attk: "必须是数据中已经存在的 属性 Attk 的 _id ObjectId 类型",
            codes: "必须是数组 为此属性 新添加的属性值 数组元素是 字符串 不能是空字符串, 不能重复"
        }
    },
    Routes: {
        countDocuments: {},
        find: {},
        findOne: {},
        insertOne: {
            roles: role_pder,
            execCB: async ({ reqBody: { document } }) => {
                if (Object.keys(AttkCL).length < 1) AttkCL = require("./Attk.Model");

                const { Attk } = document;
                if (!isObjectIdAbs(Attk)) throw "Attv Model insertOne: Attk 必须是 ObjectId 类型"
                const AttkObj = await AttkCL.COLLECTION.findOne({ _id: Attk });
                if (!AttkObj) throw "Attv Model insertOne: 数据库中找不到 相应的 Attk"
            }
        },
        insertMany: {
            roles: role_pder,
            parseCB: async (ctx) => {
                const { Attk, codes } = ctx.reqBody;
                
                /** 检查 Attk 的合理性 */
                if (!isObjectIdAbs(Attk)) throw "Attv Model insertMany ParseCB: Attk 必须是 ObjectId 类型";
                /** 把 Attk 从数据库中找出来 */
                if (Object.keys(AttkCL).length < 1) AttkCL = require("./Attk.Model");
                const AttkObj = await AttkCL.COLLECTION.findOne({ _id: Attk });
                if (!AttkObj) throw "Attv Model insertMany ParseCB: 数据库中找不到 相应的 Attk"
                
                /** 检查 codes 的合理性 */
                if (!(codes instanceof Array)) throw "Attv Model insertMany ParseCB: codes 必须是 数组";
                /** 因为 在同一个 Attk 中 不能有相同的 Attv的code 所以要先把数据库中的所有 code 取出 */
                ctx.reqBody.filter = {includes: {Attk}}
                ctx.reqBody.projection = {code: 1}
                const {objects} = await AttvCL.find(ctx);
                /** 把所有名称放到 existCodes 内存中 */
                const existCodes = [];
                for(let i in objects) {
                    const obj = objects[i];
                    /** 自检查 如果出现错误 需要手动去删除相同的 Attv */
                    if(existCodes.includes(obj.code)) throw `在 Attk [${AttkObj.code}] 中 含有两个以上的 值为[${obj.code}]的 Attv 请去数据库检查`;
                    existCodes.push(obj.code);
                }
                /** 检查新的数据中 是否有相同的 */
                let documents = []
                for (let i in codes) {
                    const code = codes[i].replace(/^\s*/g, "");
                    if (code.length < 1) throw "Attv Model insertMany ParseCB: codes 元素 必须是 有长度的字符串";
                    if(existCodes.includes(code)) throw `在 Attk [${AttkObj.code}] 中 已经存在 值为[${code}]的 Attv 不能添加`;
                    documents.push({ Attk, code });
                }
                /** 给ctx document 赋值 添加 */
                ctx.reqBody.documents = documents;
            }
        },
        updateOne: { roles: role_pder },
        // updateMany: { roles: role_pder }, // 没有任何 可以批量修改的
        deleteOne: { roles: role_pder },

        deleteMany: { roles: role_pder },
    }
}

const AttvCL = DB(CLname, CLdoc, CLoptions);;
module.exports = AttvCL;