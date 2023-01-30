const DB = require(path.join(process.cwd(), "bin/DB"));

const CLname = "Image";

const CLdoc = {
    /** 之后可以做优化如果不是唯一的 那说明 另一张图片被覆盖了 */
    relFile: { type: String },     // 相对路径+名称                         // 无对应

    filepath: { type: String },   // 本机的绝对位置 绝对路径
    name: { type: String },  // 图片名称 出去文件夹后的 名称                // 对应 formParse中的    newFilename
    ext: { type: String },   // 后缀名 不重要                             // 无对应

    nameOrg: { type: String },    // 上传文件时 原文件名                     //  对应 formParse中的    originalFilename
    mimetype: { type: String },     // 文件类型 image/png pdf 等
    size: { type: String },     // 文件大小

    url: { type: String },      // 之后可以做优化 加入主机名的 url 可以直接访问   // 无对应  如果其他集合引用此media 那么就传递这个值给其文件赋路径
    desc: { type: String },       // 前端给的 对此的描述
    tags: [{ type: String }],  // 前端给的 搜索用的
}

const CLoptions = {
    semiAutoCB: {
        deleteOne: (ctxObj, MToptions) => new Promise(async (resolve, reject) => {
            try {
                const {COLLECTION, options} = MToptions;
                const { Koptions = {} } = ctxObj;

                const doc = await COLLECTION.findOne(ctxObj.reqBody.match, options);
                if (!doc) return reject("数据库中没有此 数据")

                /** 把图片放入待删除 */
                if (!Koptions.will_delFiles) Koptions.will_delFiles = [];
                if (doc.relFile) Koptions.will_delFiles.push(doc.relFile);
                return resolve();
            } catch (e) {
                return reject(e);
            }
        }),
        deleteMany: (ctxObj, CLmodel) => new Promise(async (resolve, reject) => {
            try {
                const { Koptions = {} } = ctxObj;
                if (!Koptions.will_delFiles) Koptions.will_delFiles = [];
                const docs = await CLmodel.find(ctxObj);
                docs.forEach(doc => {
                    if (doc.relFile) Koptions.will_delFiles.push(doc.relFile);
                });

                return resolve();
            } catch (e) {
                return reject(e);
            }
        })
    },
    AutoRoute: {
        find: {
            // restrict: {
            //     types: [],   // payload 类型 如 Ader User Supplier Client
            //     roles: [],   // payload 角色 如 
            //     vips: [],    // vip
            // }

        },
        findOne: {},

        deleteMany: {
            customizeCB: ctx => new Promise(async(resolve, reject) => {
                try {
                    return resolve();
                } catch(e) {
                    return reject(e);
                }
            })
        },
        deleteOne: {
            customizeCB: ctx => new Promise(async(resolve, reject) => {
                try {
                    return resolve();
                } catch(e) {
                    return reject(e);
                }
            })
        },

        insertMany: {},
        insertOne: {},
        updateMany: {},
        updateOne: {},
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);