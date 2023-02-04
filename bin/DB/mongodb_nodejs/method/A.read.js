const regulateReq = require("../../config/regulateReq");

module.exports = (COLLECTION, CLdoc, CLoptions, options) => {
    const MToptions = { CLdoc };
    return {
        countDocuments: (ctxObj, _CLoption = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel countDocuments reqBody 要为 对象");
                
                /** 数据调整之前 */
                if (_CLoption.regulateCB) _CLoption.regulateCB(reqBody, Koptions);
                
                /** 调整 reqBody */
                MToptions.regulates = ['filter'];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 */
                if (_CLoption.payloadCB) _CLoption.payloadCB(reqBody, Koptions);
                /* else match.Firm = payload.Firm  // 暂时不用这个功能 */

                /** 执行之前 */
                if (_CLoption.execCB) await _CLoption.execCB(reqBody, Koptions);

                /** 开始执行 */
                let count = await COLLECTION.countDocuments(reqBody.match, options);

                return resolve(count);
            } catch (e) {
                return reject(e);
            }
        }),





        findOne: (ctxObj, _CLoption = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel findOne 请传递 reqBdoy 参数对象")
                const { filter = {} } = reqBody;
                if (!isObjectIdAbs(filter._id)) return reject("CLmodel findOne 需要在filter中 _id的类型为 ObjectId");

                /** 数据调整之前 */
                if (_CLoption.regulateCB) _CLoption.regulateCB(reqBody, Koptions);

                /** 调整 reqBody */
                MToptions.regulates = ["filter", "projection"];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 */
                if (_CLoption.payloadCB) _CLoption.payloadCB(reqBody, Koptions);
                

                /** 执行之前 */
                if (_CLoption.execCB) await _CLoption.execCB(reqBody, Koptions);

                /** 转义为 aggregate */
                const piplines = getPiplines(reqBody, {});
                /** 开始执行 */
                let cursor = COLLECTION.aggregate(piplines)
                let docs = await cursor.toArray();
                if(docs.length < 1) return reject("没有找到数据")
                let doc = docs[0]
                // reqBody.lookup
                // options.projection = reqBody.projection;
                // let doc = await COLLECTION.findOne(reqBody.match, options);
                return resolve(doc);
            } catch (e) {
                return reject(e);
            }
        }),


        find: (ctxObj, _CLoption = {}) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody = {}, Koptions = {} } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel find reqBody 要为 对象");
                /** 数据调整之前 */
                if (_CLoption.regulateCB) _CLoption.regulateCB(reqBody, Koptions);

                /** 调整 reqBody */
                MToptions.regulates = ["filter", "lookup", "projection", "find"];
                regulateReq(ctxObj, MToptions);

                /** 根据 payload 限制访问 */
                if (_CLoption.payloadCB) _CLoption.payloadCB(reqBody, Koptions);


                /** 执行之前 */
                if (_CLoption.execCB) await _CLoption.execCB(reqBody, Koptions);
                /** 开始执行 */
                let cursor;
                const piplines = getPiplines(reqBody, { is_Many: true });
                cursor = COLLECTION.aggregate(piplines);

                // // reqBody.lookup
                // cursor = COLLECTION
                //     .find(reqBody.match, options)
                //     .project(reqBody.projection)
                //     .skip(reqBody.skip)
                //     .limit(reqBody.limit)
                //     .sort(reqBody.sort)

                let docs = await cursor.toArray();
                // await cursor.close();
                return resolve(docs);
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
    const piplines = [];
    piplines.push({ "$match": match })

    /** find元素   注意 limit：1 其实就是 findOne */
    if (is_Many) {
        if (skip) piplines.push({ "$skip": skip })
        if (limit) piplines.push({ "$limit": limit })
        if (sort) piplines.push({ "$sort": sort })
    } else {
        piplines.push({ "$limit": 1 })
    }

    if (lookups instanceof Array) {
        for (let i in lookups) {
            piplines.push({ "$lookup": lookups[i] });
        }
    }

    if (unwinds instanceof Array) {
        for (let i in unwinds) {
            piplines.push({ "$unwind": unwinds[i] });
        }
    }

    if (projection && Object.keys(projection).length > 0) piplines.push({ "$project": projection })

    return piplines;
}