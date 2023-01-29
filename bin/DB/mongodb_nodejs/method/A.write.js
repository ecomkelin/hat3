const regulateReq = require("../../config/regulateReq");
const Encryption = require("../../config/regulateReq/asyncs/encryption");

const Exist = require("../../config/exist");


module.exports = (COLLECTION, CLdoc, CLoptions, options) => ({

    deleteMany: (ctxObj ={}) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody ={} , Koptions ={}} = ctxObj;
            if (!isObject(reqBody)) return reject("CLmodel deleteMany reqBody 要为 对象");

            /** 调整 reqBody */
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["filter"];
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            let deletedObj = await COLLECTION.deleteMany(reqBody.match, options);
            return resolve(deletedObj);
        } catch (e) {
            return reject(e);
        }
    }),


    deleteOne: (ctxObj = {}) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody ={} , Koptions ={}} = ctxObj;
            let { filter = {} } = reqBody;
            if (!isObjectIdAbs(filter._id)) return reject("CLmodel deleteOne 需要在filter中 _id的类型为 ObjectId");

            /** 调整 reqBody */
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["filter"];
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            let deletedObj = await COLLECTION.deleteOne(reqBody.match, options);
            return resolve(deletedObj);
        } catch (e) {
            return reject(e);
        }
    }),


    insertMany: (ctxObj = {}) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody ={} , Koptions ={}} = ctxObj;
            const { documents } = reqBody;
            if (!(documents instanceof Array)) return reject({ errMsg: "insertMany 错误: 第一个参数documents 必须是： Array 即 [] ", errParam: documents });

            /** 调整 reqBody 中的 documents*/
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["documents"]
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            /** 加密: 如果模型配置中有此相 则进行加密 */
            if (CLoptions.needEncryption) await Encryption(documents, CLoptions.needEncryption);

            /** 是否能够批量添加 未写*/

            let result = await COLLECTION.insertMany(documents, options);
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),


    insertOne: (ctxObj = {}) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody ={} , Koptions ={}} = ctxObj;
            /** 根据前端数据 获取 [插入一个] 方法 所需要的document*/
            const { document } = reqBody;
            if (!isObject(document)) return reject({ errMsg: "insertOne 错误: 第一个参数document 必须是： object 即 {} ", errParam: document });

            /** 调整 reqBody 中的 document*/
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["document"]
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            /** 加密: 如果模型配置中有此相 则进行加密 */
            if (CLoptions.needEncryption) await Encryption(document, CLoptions.needEncryption);

            /** 是否能够添加 如果没有就通过 有就不通过 */
            Koptions.COLLECTION = COLLECTION;  // 加入 原生方法调用 以便在下游方法中调用
            Koptions.pass_exist = false;       // 如果没有找到相同数据 才通过 不然会报错
            await Exist(reqBody, Koptions)

            // if(CLoptions)
            /** 原生数据库的 数据库操作 */
            let result = await COLLECTION.insertOne(document, options);

            if(result.acknowledged) {
                result = await COLLECTION.findOne({_id: result.insertedId});
                return resolve(result);
            }
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),



    updateMany: (ctxObj = {}) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody ={} , Koptions ={}} = ctxObj;
            /** 调整 reqBody 中的 filter, update*/
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["filter", "update"]
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            /** 如果 update 中存在 $set 如果update中没有$.. update方法 前面的 regulate 默改装成 $set方法*/
            if (reqBody.update["$set"]) {
                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (CLoptions.needEncryption) await Encryption(reqBody.update["$set"], CLoptions.needEncryption);

                /** 查看是否能 批量更新 还没有做 */
                // if (!able_update) return reject()
            }


            let result = await COLLECTION.updateMany(reqBody.match, reqBody.update, options);
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),



    updateOne: (ctxObj = {}) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody ={} , Koptions ={}} = ctxObj;
            const { filter = {} } = reqBody;
            if (!isObjectIdAbs(filter._id)) return reject("CLmodel updateOne filter _id 必须为 ObjectId");

            /** 调整 reqBody 中的 filter, update 如果update中没有$.. update方法 则默改装成 $set方法 */
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["filter", "update"]
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            /** 如果 update 中存在 $set 如果update中没有$.. update方法 前面的 regulate 默改装成 $set方法*/
            if (reqBody.update["$set"]) {
                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (CLoptions.needEncryption) await Encryption(reqBody.update["$set"], CLoptions.needEncryption);

                /** 是否能更新 这些字段 */
                Koptions.COLLECTION = COLLECTION;
                Koptions.pass_exist = false;
                await Exist(reqBody, Koptions);
            }

            let result = await COLLECTION.updateOne(reqBody.match, reqBody.update, options);
            if(result.acknowledged && result.modifiedCount > 0) {
                return resolve(reqBody.update["$set"]);
            }
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
    }),
});