const regulateReq = require("../../config/regulateReq");
const Encryption = require("../../config/regulateReq/asyncs/encryption");

const Exist = require("../../config/exist");


module.exports = (COLLECTION, CLdoc, CLoptions, CLname, options) => {
    const { needEncryption } = CLoptions;
    const MToptions = { CLdoc, CLoptions }
    return {
        deleteMany: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel deleteMany reqBody 要为 对象");

                /** 调整 reqBody */
                MToptions.regulates = ['filter'];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /** 是否要加载 find */
                if (CLoptions.optFiles || _CLoptions.findAfter || _CLoptions.execCB) {
                    const cursor = COLLECTION.find(reqBody.match, options);
                    const objects = await cursor.toArray();
                    await cursor.close();

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
                if (_CLoptions.findAfter) _CLoptions.findAfter(Koptions);
                /**  execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj)

                let deletedResult = await COLLECTION.deleteMany(reqBody.match, options);
                if (deletedResult.deletedCount > 0) Koptions.handleFiles = Koptions.will_handleFiles;

                return resolve({ deletedResult });
            } catch (e) {
                return reject(e);
            }
        }),


        deleteOne: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                let { filter = {} } = reqBody;

                if (!isObjectIdAbs(filter._id)) return reject("CLmodel deleteOne 需要在filter中 _id的类型为 ObjectId");

                /** 调整 reqBody */
                MToptions.regulates = ["filter"];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /**  是否要加载 findOne*/
                if (CLoptions.optFiles || _CLoptions.findAfter || _CLoptions.execCB) {
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
                if (_CLoptions.findAfter) _CLoptions.findAfter(Koptions);
                /**  execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj)


                let deletedResult = await COLLECTION.deleteOne(reqBody.match, options);
                if (deletedResult.deletedCount === 1) Koptions.handleFiles = Koptions.will_handleFiles;

                return resolve({ deletedResult });
            } catch (e) {
                return reject(e);
            }
        }),


        insertMany: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions } = ctxObj;
                const { documents } = reqBody;
                if (!(documents instanceof Array)) return reject("mgWrite: insertMany: ctx.reqBody.documents 必须是数组 [] ");
                for (let i in documents) {
                    if(!documents[i]._id) documents[i]._id = newObjectId();
                    else break;
                }

                /** 调整 reqBody 中的 documents*/
                MToptions.regulates = ["insert"]
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /** 是否能够批量添加 000000
                 * 比如是否 有相同的 code 判断
                 * 未写*/


                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (needEncryption) await Encryption(documents, needEncryption);
                /** 如果(被简化过的)CLoptions选项中 含有 execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj)

                let insertResult = await COLLECTION.insertMany(documents, options);
                return resolve({ insertResult });
            } catch (e) {
                return reject(e);
            }
        }),


        insertOne: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;

                /** 根据前端数据 获取 [插入一个] 方法 所需要的document*/
                const { document } = reqBody;
                let errMsg = "mgWrite: insertOne: ctx.reqBody.document 必须是： object对象 即 {}, ";
                errMsg += "可能错误的原因 1: 如果您传输图片 忘记加 query.passUpload = 1. ";
                errMsg += "可能错误的原因 2: 传输body对象 要把document 打包成 req: {document: {}}";
                if (!isObject(document)) return reject(errMsg);
                /** 在这加入 _id 是因为 可能在数据调整的时候 要用的 _id
                 * 比如 添加 Pd 时 自动加入 Sku 要吧 Pd的_id 传给 Sku
                 */
                if(!document._id) document._id = newObjectId();

                /** 调整 reqBody 中的 document*/
                MToptions.regulates = ["insert"] // "insert" 调整 document
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /** 是否能够添加 如果没有就通过 有就不通过 */
                MToptions.COLLECTION = COLLECTION;  // 加入 原生方法调用 以便在下游方法中调用
                MToptions.pass_exist = false;       // 如果没有找到相同数据 才通过 不然会报错
                await Exist(ctxObj, MToptions)

                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (needEncryption) await Encryption(document, needEncryption);
                /**  execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj)

                /** 原生数据库的 数据库操作 */
                let insertResult = await COLLECTION.insertOne(document, options);

                if (insertResult.acknowledged) {
                    Koptions.handleFiles = [];

                    document._id = insertResult.insertedId;
                    return resolve({ document });
                }
                return resolve({ insertResult });
            } catch (e) {
                return reject(e);
            }
        }),



        updateMany: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions } = ctxObj;

                /** 调整 reqBody 中的 filter, update*/
                MToptions.regulates = ["filter", "update"]
                regulateReq(ctxObj, MToptions);

                /** 000000 弥补 regCLdoc的缺陷
                 * 把空的 数组和字符串删除掉， 但会随之带来另外一个缺陷 前端不能直接 set 空数组或空对象
                 */
                const { update = {} } = reqBody;
                if (update["$set"]) {
                    for (let key in update["$set"]) {
                        const setKey = update["$set"][key]
                        if (setKey instanceof Array) {
                            if (setKey.length === 0) delete update["$set"][key]
                        } else if (isObject(setKey)) {
                            if (Object.keys(setKey).length === 0) delete update["$set"][key]
                        }
                    }
                }

                /** 如果 update 中存在 $set 如果update中没有$.. update方法 前面的 regulate 默改装成 $set方法*/
                if (reqBody.update["$set"]) {
                    /** 加密: 如果模型配置中有此相 则进行加密 */
                    if (needEncryption) await Encryption(reqBody.update["$set"], needEncryption);

                    /** 查看是否能 批量更新 还没有做 */
                    // if (!able_update) return reject()
                }

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                if (_CLoptions.findAfter) {
                    const cursor = COLLECTION.find(reqBody.match, options);
                    const objects = await cursor.toArray();
                    await cursor.close();

                    Koptions.objects = objects;
                }

                /** 根据 payload 控制访问 */
                if (_CLoptions.findAfter) _CLoptions.findAfter(Koptions);
                /** 如果(被简化过的)CLoptions选项中 含有 execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj)

                // if(ctxObj.reqQuery.onlyUpdate) {
                if (true) {
                    let updateResult = await COLLECTION.updateMany(reqBody.match, reqBody.update, options);
                    return resolve({ updateResult });
                } else {
                    // let cursor = await COLLECTION.aggregate([
                    //     { "$match": {} },
                    //     { ...reqBody.update },
                    //     // { $lookup: {
                    //     //     from: CLname,
                    //     //     localField: "_id",
                    //     //     foreignField: "_id",
                    //     //     as: "updated_doc"
                    //     // } },
                    //     { $out: CLname }
                    // ])
                    // const objects = await cursor.toArray();
                    // await cursor.close();
                    // return resolve(objects);
                }
            } catch (e) {
                return reject(e);
            }
        }),



        updateOne: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                const { filter = {}, update } = reqBody;
                console.log("A.write: ", reqBody);
                if (!isObjectIdAbs(filter._id)) return reject("CLmodel updateOne filter _id 必须为 ObjectId");
                if (!isObject(update)) return reject("CLmodel updateOne 请传递 update 对象参数");
                if (!update["$set"]) update["$set"] = {};
                const updateSet = update["$set"];
                const updateRm = update["$remove"];
                const updatePush = update["$push"];

                /** 调整 reqBody 中的 filter, update 如果update中没有$.. update方法 则默改装成 $set方法 */
                MToptions.regulates = ["filter", "update"]
                regulateReq(ctxObj, MToptions);

                /** 000000 弥补 regCLdoc的缺陷
                 * 把空的 数组和字符串删除掉， 但会随之带来另外一个缺陷 前端不能直接 set 空数组或空对象
                 */
                if (updateSet) {
                    for (let key in updateSet) {
                        const setKey = updateSet[key]
                        if (setKey instanceof Array) {
                            if (setKey.length === 0) delete updateSet[key]
                        } else if (isObject(setKey)) {
                            if (Object.keys(setKey).length === 0) delete updateSet[key]
                        }
                    }
                }

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /** 是否能更新 这些字段 */
                MToptions.COLLECTION = COLLECTION;
                MToptions.pass_exist = false;
                await Exist(ctxObj, MToptions);

                /** 应该做一个判断 再来找 object */
                const object = await COLLECTION.findOne(ctxObj.reqBody.match, options);
                if (!object) return reject("DBmethod 数据库中没有此 数据")
                Koptions.object = object;

                /** 删除原数据库中存储的 数组图片 */
                const { optFiles = {} } = CLoptions;

                /** 为了简化代码 如果做了数组删除 则不能进行其他修改操作 */
                if (updateRm) {
                    /** 清除 set 内容 */
                    for (let key in updateSet) delete updateSet[key];

                    for (let key in updateRm) {
                        if (!(updateRm[key] instanceof Array)) updateRm[key] = [updateRm[key]];
                        if (!(object[key] instanceof Array)) return reject(`DBmethod updateOne 中 remove [${key}] 字段不为数组`)
                        let rmKey = updateRm[key];  // 要删除的 字符串s
                        let fieldVals = object[key]; // 集合文件的数组对象的值

                        for (let i in rmKey) {
                            /** 如果 集合中的数据为对象 那么就要按对象的方式处理 */
                            if (isObject(fieldVals[i])) {
                                /** 如果 remove 的关键词数组的值为 ObjectId 则要与集合的_id 相比较  */
                                if (isObjectId(rmKey[i])) {
                                    let index = 0;
                                    for (; index < fieldVals.length; index++) {
                                        if (String(fieldVals[index]._id) === String(rmKey[i])) break;
                                    }
                                    if (index < fieldVals.length) {
                                        fieldVals.splice(index, (index > -1) ? 1 : 0);
                                    }
                                }
                                /** 如果 remove 的关键词数组的值为 对象 则要与集合的_id 相比较  */
                                else if (isObject(rmKey[i])) {
                                    let field = rmKey[i].key;
                                    let fieldVal = rmKey[i].val;
                                    let index = 0;
                                    for (; index < fieldVals.length; index++) {
                                        if (String(fieldVals[index][field]) === String(fieldVal)) break;
                                    }
                                    if (index < fieldVals.length) {
                                        fieldVals.splice(index, (index > -1) ? 1 : 0);
                                    }
                                }
                            }
                            /** 如果 集合数据 为纯数组 */
                            else if (fieldVals[i]) {
                                let index = 0;
                                for (; index < fieldVals.length; index++) {
                                    if (String(fieldVals[index]) === String(rmKey[i])) break;
                                }
                                if (index < fieldVals.length) {
                                    /** 如果此字段为文件字段 则需要进行下面图片的处理 */
                                    if (optFiles && optFiles[key]) {
                                        Koptions.will_handleFiles.push(rmKey[i]);
                                    }
                                    fieldVals.splice(index, (index > -1) ? 1 : 0);
                                }
                            }
                        }

                        /** 通过 remove 重制 update["$set"] */
                        updateSet[key] = object[key];
                    }
                    delete update["$remove"]
                } else {
                    /** 如果此集合有文件相关的字段 要检查是否被修改 被替换的 集合字段的文件路径 放到待处理文件缓存中 */
                    for (let key in updateSet) {
                        if ((updateSet[key] instanceof Array) && updateSet[key].length > 0) {
                            for (let i in updateSet[key]) {
                                let j = 0;
                                if(!object[key]) object[key] = [];
                                for (; j < object[key].length; j++) {
                                    if (isObject(object[key][i])) {
                                        if (String(updateSet[key][i]._id) === String(object[key][j]._id)) break;
                                    } else {
                                        if (String(updateSet[key][i]) === String(object[key][j])) break;
                                    }
                                }
                                if (j === object[key].length) {
                                    object[key].push(updateSet[key][i])
                                }
                            }
                            updateSet[key] = object[key];

                        } else {
                            if (optFiles && optFiles[key] === 'string') {
                                if (object[key]) Koptions.will_handleFiles.push(object[key]);
                            }
                        }

                    }
                }

                /** 加密: 如果模型配置中有此相 则进行加密 */
                if (needEncryption) await Encryption(updateSet, needEncryption);

                /** 根据 payload 控制访问 */
                if (_CLoptions.findAfter) _CLoptions.findAfter(Koptions);
                /** 如果(被简化过的)CLoptions选项中 含有 execCB 回调 则执行 回调方法 */
                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj);

                let updateResult;
                /** 获取更新后的文档 */
                if (ctxObj.reqQuery.onlyUpdate) {
                    updateResult = await COLLECTION.updateOne(reqBody.match, reqBody.update, options);
                } else {
                    options.returnDocument = "after";
                    options.returnNewDocument = true;
                    updateResult = await COLLECTION.findOneAndUpdate(reqBody.match, reqBody.update, options);
                }
                /** findOneAndUpdate 成功后的结果 */
                if (updateResult.ok) {
                    Koptions.handleFiles = Koptions.will_handleFiles;
                    return resolve({ object: updateResult.value });
                }
                /** updateOne 成功后的结果 */
                else if (updateResult.acknowledged && updateResult.modifiedCount > 0) {
                    Koptions.handleFiles = Koptions.will_handleFiles;
                    return resolve({ updateSet });
                }
                return resolve(updateResult);
            } catch (e) {
                return reject(e);
            }
        }),
    }
}