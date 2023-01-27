const reqRegulate = require("../../config/reqRegulate");

const Exist = require("../../config/exist");


module.exports = (COLLECTION, CLdoc, CLoptions) => ({

    deleteMany: (req, MToptions) => new Promise(async (resolve, reject) => {
        try {
            if (!isObject(req)) return reject("CLmodel find req 要为 对象");

            /** 调整 req */
            let errMsg = reqRegulate(req, {CLdoc, payload: MToptions.payload, regulates: ["filter"] });
            if(errMsg) return reject(errMsg);

            let deletedObj = await COLLECTION.deleteMany(req.match, MToptions);
            return resolve(deletedObj);
        } catch (e) {
            return reject(e);
        }
    }),


    deleteOne: (req = {}, MToptions) => new Promise(async (resolve, reject) => {
        try {
            let { filter ={} } = req;
            if (!isObjectIdAbs(filter._id)) return reject("CLmodel findOne 需要在filter中 _id的类型为 ObjectId");

            /** 调整 req */
            let errMsg = reqRegulate(req, {CLdoc, payload: MToptions.payload, regulates: ["filter"] });
            if(errMsg) return reject(errMsg);

            let deletedObj = await COLLECTION.deleteOne(req.match, MToptions);
            return resolve(deletedObj);
        } catch (e) {
            return reject(e);
        }
    }),


    insertMany: (req = {}, MToptions) => new Promise(async (resolve, reject) => {
        try {
            const { documents } = req;
            if (!(documents instanceof Array)) return reject({ errMsg: "insertMany 错误: 第一个参数documents 必须是： Array 即 [] ", errParam: documents });

            /** 调整 req 中的 documents*/
            let errMsg = reqRegulate(req, { CLdoc, payload: MToptions.payload, regulates: ["documents"] });
            if (errMsg) return reject(errMsg);

            /** 是否能够批量添加 未写*/
            // 

            let result = await COLLECTION.insertMany(documents, MToptions);
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),


    insertOne: (req={}, MToptions = {}) => new Promise(async (resolve, reject) => {
        try {
            const {document} = req;
            if (!isObject(document)) return reject({ errMsg: "insertOne 错误: 第一个参数document 必须是： object 即 {} ", errParam: document });

            /** 调整 req 中的 document*/
            let errMsg = reqRegulate(req, { CLdoc, payload: MToptions.payload, regulates: ["document"] });
            if (errMsg) return reject(errMsg);

            /** 是否能够添加 如果没有就通过 有就不通过 */
            await Exist(req, {CLdoc, COLLECTION, payload: MToptions.payload, pass_exist: false})

            let result = await COLLECTION.insertOne(document, MToptions);

            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),



    updateMany: (req = {}, documents, MToptions = {}) => new Promise(async (resolve, reject) => {
        try {
            const {filter = {}, update={}} = req;
            if (!isObject(update)) return reject("CLmodel updateOne set 参数必须是对象 ");

            /** 筛选过滤 */
            let errMsg = reqRegulate(req, {CLdoc, payload: MToptions.payload, regulates: ["filter"] });
            if(errMsg) return reject(errMsg);

            /** 查看是否能 批量更新 还没有做 */
            // if (!able_update) return reject()

            let result = await COLLECTION.updateMany(req.match, update, MToptions);
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),



    updateOne: (req = {}, MToptions = {}) => new Promise(async (resolve, reject) => {
        try {
            const {filter = {}, update={}} = req;
            if (!isObjectIdAbs(filter._id)) return reject("CLmodel updateOne filter _id 必须为 ObjectId");
            if (!isObject(update)) return reject("CLmodel updateOne set 参数必须是对象 ");

            /** 筛选过滤 */
            let errMsg = reqRegulate(req, {CLdoc, payload: MToptions.payload, regulates: ["filter", "update"] });
            if(errMsg) return reject(errMsg);

            /** 更新字段 */
            if(update["$set"]) await Exist(req, {CLdoc, COLLECTION, payload: MToptions.payload, pass_exist: false});

            let result = await COLLECTION.updateOne(req.match, update, MToptions);
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),
});