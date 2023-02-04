const regulateReq = require("../../config/regulateReq");
const Encryption = require("../../config/regulateReq/asyncs/encryption");

const Exist = require("../../config/exist");


module.exports = (COLLECTION, CLdoc, CLoptions, options) => {
    const { needEncryption } = CLoptions;
    const MToptions = { CLdoc, CLoptions }
    return {
        deleteMany: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel deleteMany reqBody 要为 对象");

                // /** 数据调整之前 */
                // if (_CLoptions.reqBodyCB) _CLoptions.reqBodyCB(reqBody, Koptions);

                /** 调整 reqBody */
                MToptions.regulates = ['filter'];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.payloadReq) _CLoptions.payloadReq(reqBody, Koptions.payload);


                /** 是否要加载 find */
                if (CLoptions.optFiles || _CLoptions.payloadObject || _CLoptions.execCB) {
                    const cursor = COLLECTION.find(reqBody.match, options);
                    const objects = await cursor.toArray();
                    Koptions.objects = objects;
                }

                /** 如果此集合中 有图片 则删除 */
                if (CLoptions.optFiles) {
                    Koptions.objects.forEach(object => {
                        /** 把图片放入待删除 */
                        for (let key in CLoptions.optFiles) {
                            if (CLoptions.optFiles[key] === 'string' && object[key]) {
                                Koptions.will_handleFiles.push(object[key]);
                            } else if (CLoptions.optFiles[key] === 'array' && object[key] instanceof Array) {
                                object[key].forEach(url => Koptions.will_handleFiles.push(url))
                            }
                        }
                    })
                }

                /** 根据 payload 限制访问 */
                if (_CLoptions.payloadObject) _CLoptions.payloadObject(Koptions);
                /**  execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(Koptions)

                let deletedObj = await COLLECTION.deleteMany(reqBody.match, options);
                if (deletedObj.deletedCount > 0) Koptions.handleFiles = Koptions.will_handleFiles;

                return resolve(deletedObj);
            } catch (e) {
                return reject(e);
            }
        }),


        deleteOne: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                let { filter = {} } = reqBody;

                if (!isObjectIdAbs(filter._id)) return reject("CLmodel deleteOne 需要在filter中 _id的类型为 ObjectId");

                // /** 数据调整之前 */
                // if (_CLoptions.reqBodyCB) _CLoptions.reqBodyCB(reqBody, Koptions);

                /** 调整 reqBody */
                MToptions.regulates = ["filter"];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.payloadReq) _CLoptions.payloadReq(reqBody, Koptions.payload);

                /**  是否要加载 findOne*/
                if (CLoptions.optFiles || _CLoptions.payloadObject || _CLoptions.execCB) {
                    const object = await COLLECTION.findOne(ctxObj.reqBody.match, options);
                    if (!object) return reject("DBmethod deleteOne 方法下 findOne:数据库中没有此 数据")
                    Koptions.object = object;
                }

                /** 如果此集合中 有图片 则删除 */
                if (CLoptions.optFiles) {
                    const { object } = Koptions;
                    /** 把图片放入待删除 */
                    for (let key in CLoptions.optFiles) {
                        if (CLoptions.optFiles[key] === 'string' && object[key]) {
                            Koptions.will_handleFiles.push(object[key]);
                        } else if (CLoptions.optFiles[key] === 'array' && object[key] instanceof Array) {
                            object[key].forEach(url => Koptions.will_handleFiles.push(url))
                        }
                    }
                }

                /** 根据 payload 限制访问 */
                if (_CLoptions.payloadObject) _CLoptions.payloadObject(Koptions);
                /**  execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(Koptions)


                let deletedObj = await COLLECTION.deleteOne(reqBody.match, options);
                if (deletedObj.deletedCount === 1) Koptions.handleFiles = Koptions.will_handleFiles;

                return resolve(deletedObj);
            } catch (e) {
                return reject(e);
            }
        }),


        insertMany: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {} } = ctxObj;
                const { documents } = reqBody;
                if (!(documents instanceof Array)) return reject("mgWrite: insertMany: ctx.reqBody.documents 必须是数组 [] ");

                // /** 数据调整之前 */
                // if (_CLoptions.reqBodyCB) _CLoptions.reqBodyCB(reqBody, Koptions);

                /** 调整 reqBody 中的 documents*/
                MToptions.regulates = ["insert"]
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.payloadReq) _CLoptions.payloadReq(reqBody, Koptions.payload);


                /** 是否能够批量添加 未写*/

                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (needEncryption) await Encryption(documents, needEncryption);
                /** 如果(被简化过的)CLoptions选项中 含有 execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(Koptions)

                let result = await COLLECTION.insertMany(documents, options);
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        }),


        insertOne: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                /** 根据前端数据 获取 [插入一个] 方法 所需要的document*/
                const { document } = reqBody;
                if (!isObject(document)) return reject("mgWrite: insertOne: ctx.reqBody.document 必须是： object对象 即 {} ");
                document._id = newObjectId();

                // /** 数据调整之前 */
                // if (_CLoptions.reqBodyCB) _CLoptions.reqBodyCB(reqBody, Koptions);

                /** 调整 reqBody 中的 document*/
                MToptions.regulates = ["insert"] // "insert" 调整 document
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.payloadReq) _CLoptions.payloadReq(reqBody, Koptions.payload);

                /** 是否能够添加 如果没有就通过 有就不通过 */
                MToptions.COLLECTION = COLLECTION;  // 加入 原生方法调用 以便在下游方法中调用
                MToptions.pass_exist = false;       // 如果没有找到相同数据 才通过 不然会报错
                await Exist(ctxObj, MToptions)

                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (needEncryption) await Encryption(document, needEncryption);
                /**  execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(Koptions)

                /** 原生数据库的 数据库操作 */
                let result = await COLLECTION.insertOne(document, options);

                if (result.acknowledged) {
                    Koptions.handleFiles = [];

                    document._id = result.insertedId;
                    return resolve(document);
                }
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        }),



        updateMany: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {} } = ctxObj;

                // /** 数据调整之前 */
                // if (_CLoptions.reqBodyCB) _CLoptions.reqBodyCB(reqBody, Koptions);

                /** 调整 reqBody 中的 filter, update*/
                MToptions.regulates = ["filter", "update"]
                regulateReq(ctxObj, MToptions);

                /** 如果 update 中存在 $set 如果update中没有$.. update方法 前面的 regulate 默改装成 $set方法*/
                if (reqBody.update["$set"]) {
                    /** 加密: 如果模型配置中有此相 则进行加密 */
                    if (needEncryption) await Encryption(reqBody.update["$set"], needEncryption);

                    /** 查看是否能 批量更新 还没有做 */
                    // if (!able_update) return reject()
                }

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.payloadReq) _CLoptions.payloadReq(reqBody, Koptions.payload);

                /** 如果(被简化过的)CLoptions选项中 含有 execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) {
                    const cursor = COLLECTION.find(reqBody.match, options);
                    const objects = await cursor.toArray();
                    Koptions.objects = objects;

                    await _CLoptions.execCB(Koptions);
                }

                let result = await COLLECTION.updateMany(reqBody.match, reqBody.update, options);
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        }),



        updateOne: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                const { filter = {}, update, rmArrFile } = reqBody;
                if (!isObjectIdAbs(filter._id)) return reject("CLmodel updateOne filter _id 必须为 ObjectId");
                if (!isObject(update)) return reject("CLmodel updateOne 请传递 update 对象参数");
                const updateSet = reqBody.update["$set"];
                if (!isObject(updateSet)) return reject("DBmethod updateOne 下的 update['$set'] 信息错误");

                // /** 数据调整之前 */
                // if (_CLoptions.reqBodyCB) _CLoptions.reqBodyCB(reqBody, Koptions);

                /** 调整 reqBody 中的 filter, update 如果update中没有$.. update方法 则默改装成 $set方法 */
                MToptions.regulates = ["filter", "update"]
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.payloadReq) _CLoptions.payloadReq(reqBody, Koptions.payload);

                /** 是否能更新 这些字段 */
                MToptions.COLLECTION = COLLECTION;
                MToptions.pass_exist = false;
                await Exist(ctxObj, MToptions);

                /** 应该做一个判断 再来找 object */
                const object = await COLLECTION.findOne(ctxObj.reqBody.match, options);
                if (!object) return reject("DBmethod 数据库中没有此 数据")
                // Koptions.object = object;

                const { optFiles } = CLoptions;
                /** 如果集合中 有文件字段 则需要进行下面图片的处理 */
                if (optFiles) {
                    /** 删除原数据库中存储的 数组图片
                     * 为了简化代码 如果做了删除图片 则不能进行其他修改操作
                    */
                    if (rmArrFile) {
                        for (let key in updateSet) { // 为了简化代码 如果做了删除图片 则不能进行其他修改操作
                            delete updateSet[key]
                        }
                        for (let key in rmArrFile) {
                            if (!(rmArrFile[key] instanceof Array)) return reject(`DBmethod updateOne 中 您要删除的 [${key}] 字段的值 为数组 请写成数组形式`)
                            if (!(object[key] instanceof Array)) return reject(`DBmethod updateOne 中 [${key}] 字段不为数组`)

                            let rmUrls = rmArrFile[key];  // 要删除的 字符串s
                            let fieldVals = object[key]; // 集合文件的数组对象的值
                            for (let i in rmUrls) {
                                let id = fieldVals.indexOf(rmUrls[i]);
                                if (id > -1) {
                                    Koptions.will_handleFiles.push(rmUrls[i]);
                                    fieldVals.splice(id, (id > -1) ? 1 : 0);
                                }
                            }
                            updateSet[key] = object[key];
                        }
                    } else {
                        /** 把要替换的 数据库图片放到 待处理图片缓存中 */
                        for (let key in optFiles) {
                            if (updateSet[key]) {
                                if (optFiles[key] === 'array') {
                                    updateSet[key] = [...object[key], ...updateSet[key]];
                                } else if (optFiles[key] === 'string') {
                                    if (object[key]) Koptions.will_handleFiles.push(object[key]);
                                }
                            }
                        }
                    }
                }

                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (needEncryption) await Encryption(updateSet, needEncryption);

                /** 根据 payload 控制访问 */
                if (_CLoptions.payloadObject) _CLoptions.payloadObject(reqBody, Koptions);
                /** 如果(被简化过的)CLoptions选项中 含有 execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(Koptions)

                let result = await COLLECTION.updateOne(reqBody.match, reqBody.update, options);
                if (result.acknowledged && result.modifiedCount > 0) {
                    Koptions.handleFiles = Koptions.will_handleFiles;
                    return resolve(updateSet);
                }
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        }),
    }
}