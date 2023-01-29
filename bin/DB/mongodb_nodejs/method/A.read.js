const regulateReq = require("../../config/regulateReq");

module.exports = (COLLECTION, CLdoc, CLoptions, options) => ({
    countDocuments: (ctxObj) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody, Koptions} = ctxObj;
            if (!isObject(reqBody)) return reject("CLmodel countDocuments reqBody 要为 对象");

            /** 调整 reqBody */
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["filter"];
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            let count = await COLLECTION.countDocuments(reqBody.match, options);

            return resolve(count);
        } catch (e) {
            return reject(e);
        }
    }),


    find: (ctxObj) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody, Koptions} = ctxObj;
            if (!isObject(reqBody)) return reject("CLmodel find reqBody 要为 对象");

            /** 调整 reqBody */
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["filter", "projection", "find"];
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);
            // reqBody.lookup
            let cursor = await COLLECTION
                .find(reqBody.match, options)
                .project(reqBody.projection)
                .skip(reqBody.skip)
                .limit(reqBody.limit)
                .sort(reqBody.sort)

            let docs = await cursor.toArray();
            await cursor.close();
            return resolve(docs);
        } catch (e) {
            return reject(e);
        }
        // finally { cursor.close(); }
    }),


    findOne: (ctxObj) => new Promise(async (resolve, reject) => {
        try {
            const {reqBody, Koptions} = ctxObj;

            const { filter = {} } = reqBody;
            if (!isObjectIdAbs(filter._id)) return reject("CLmodel findOne 需要在filter中 _id的类型为 ObjectId");

            /** 调整 reqBody */
            Koptions.CLdoc = CLdoc;
            Koptions.regulates = ["filter", "projection"];
            let errMsg = regulateReq(reqBody, Koptions);
            if (errMsg) return reject(errMsg);

            options.projection = reqBody.projection;
            // reqBody.lookup
            let doc = await COLLECTION.findOne(reqBody.match, options);
            return resolve(doc);
        } catch (e) {
            return reject(e);
        }
    })
})