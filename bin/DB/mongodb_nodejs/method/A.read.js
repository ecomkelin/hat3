const regulateReq = require("../../config/regulateReq");

module.exports = (COLLECTION, CLdoc, CLoptions, options) => {
    const MToptions = { CLdoc };
    return {
        countDocuments: (ctxObj) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel countDocuments reqBody 要为 对象");

                /** 调整 reqBody */
                MToptions.regulates = ['filter'];
                let errMsg = regulateReq(ctxObj, MToptions);
                if (errMsg) return reject(errMsg);

                let count = await COLLECTION.countDocuments(reqBody.match, options);

                return resolve(count);
            } catch (e) {
                return reject(e);
            }
        }),





        findOne: (ctxObj) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody } = ctxObj;

                const { filter = {} } = reqBody;
                if (!isObjectIdAbs(filter._id)) return reject("CLmodel findOne 需要在filter中 _id的类型为 ObjectId");

                /** 调整 reqBody */
                MToptions.regulates = ["filter", "projection"];

                let errMsg = regulateReq(ctxObj, MToptions);
                if (errMsg) return reject(errMsg);
                const piplines = getPiplines(reqBody, {});

                let cursor = COLLECTION.aggregate(piplines)
                let docs = await cursor.toArray();
                let doc = docs[0]
                // reqBody.lookup
                // options.projection = reqBody.projection;
                // let doc = await COLLECTION.findOne(reqBody.match, options);
                return resolve(doc);
            } catch (e) {
                return reject(e);
            }
        }),


        find: (ctxObj, _CLoptions) => new Promise(async (resolve, reject) => {
            try {
                const { reqBody } = ctxObj;
                if (!isObject(reqBody)) return reject("CLmodel find reqBody 要为 对象");

                /** 调整 reqBody */
                MToptions.regulates = ["filter", "lookup", "projection", "find"];

                let errMsg = regulateReq(ctxObj, MToptions);
                if (errMsg) return reject(errMsg);

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