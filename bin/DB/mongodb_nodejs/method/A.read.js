const regulateReq = require("../../config/regulateReq");

module.exports = (COLLECTION, CLdoc, CLoptions, CLname, options) => {
    const MToptions = { CLdoc };
    return {
        countDocuments: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel countDocuments reqBody 要为 对象");


                /** 调整 reqBody */
                MToptions.regulates = ['filter'];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /** 开始执行 */
                let count = await COLLECTION.countDocuments(reqBody.match, options);

                return resolve({ count });
            } catch (e) {
                return reject(e);
            }
        }),



        findOne: (ctxObj = {}, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel findOne 请传递 reqBdoy 参数对象")
                const { filter = {} } = reqBody;
                if (!isObjectIdAbs(filter._id)) return reject("CLmodel findOne 需要在filter中 _id的类型为 ObjectId");


                /** 调整 reqBody */
                MToptions.regulates = ["filter", "lookup", "projection"];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /** 转义为 aggregate */
                const pipelines = getPiplines(reqBody, {});
                /** 开始执行 */
                let cursor = COLLECTION.aggregate(pipelines)
                let docs = await cursor.toArray();
                await cursor.close();

                if (docs.length < 1) return reject("没有找到数据")
                let object = docs[0]
                Koptions.object = object;
                // reqBody.lookup
                // options.projection = reqBody.projection;
                // let doc = await COLLECTION.findOne(reqBody.match, options);

                /** 根据 payload 限制访问 比如说 User 访问自己 */
                if (_CLoptions.findAfter) _CLoptions.findAfter(Koptions);

                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj);
                return resolve({ object });
            } catch (e) {
                return reject(e);
            }
        }),


        find: (ctxObj, _CLoptions = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel find reqBody 要为 对象");

                /** 调整 reqBody */
                MToptions.regulates = ["filter", "lookup", "projection", "find"];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 / 文件限制 */
                if (_CLoptions.parseAfter) await _CLoptions.parseAfter(ctxObj);

                /** 开始执行 */
                const pipelines = getPiplines(reqBody, { is_Many: true });
                const cursor = COLLECTION.aggregate(pipelines);
                const objects = await cursor.toArray();
                await cursor.close();

                Koptions.objects = objects;

                // // reqBody.lookup
                // cursor = COLLECTION
                //     .find(reqBody.match, options)
                //     .project(reqBody.projection)
                //     .skip(reqBody.skip)
                //     .limit(reqBody.limit)
                //     .sort(reqBody.sort)

                /** 根据 payload 限制访问 比如说 User 访问自己 */
                if (_CLoptions.findAfter) _CLoptions.findAfter(Koptions);

                if (_CLoptions.execCB) await _CLoptions.execCB(ctxObj);
                return resolve({ objects });
            } catch (e) {
                return reject(e);
            }
            // finally { cursor.close(); }
        }),
    }
}

const getPiplines = (reqBody, { is_Many = false }) => {
    const { match, projection, skip, limit, sort, lookups, unwinds } = reqBody;
    /** project 要在 lookup 下面 */
    const pipelines = [];
    pipelines.push({ "$match": match })

    /** find元素   注意 limit：1 其实就是 findOne */
    if (is_Many) {
        if (skip) pipelines.push({ "$skip": skip })
        if (limit) pipelines.push({ "$limit": limit })
        if (sort) pipelines.push({ "$sort": sort })
    } else {
        pipelines.push({ "$limit": 1 })
    }

    if (lookups instanceof Array) {
        for (let i in lookups) {
            pipelines.push({ "$lookup": lookups[i] });
        }
    }

    /** 把数组编程对象 */
    if (unwinds instanceof Array) {
        for (let i in unwinds) {
            pipelines.push({ "$unwind": unwinds[i] });
        }
    }

    if (projection && Object.keys(projection).length > 0) pipelines.push({ "$project": projection })

    return pipelines;
}