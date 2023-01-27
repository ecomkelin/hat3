const regulateReq = require("../../config/regulateReq");

module.exports = (COLLECTION, CLdoc, CLoptions) => ({
    countDocuments: (req, MToptions = {}) => new Promise(async (resolve, reject) => {
        try {
            if (!isObject(req)) return reject("CLmodel countDocuments req 要为 对象");

            /** 调整 req */
            let errMsg = regulateReq(req, { CLdoc, payload: MToptions.payload, regulates: ["filter"] });
            if (errMsg) return reject(errMsg);

            let count = await COLLECTION.countDocuments(req.match, MToptions);

            return resolve(count);
        } catch (e) {
            return reject(e);
        }
    }),


    find: (req, MToptions = {}) => new Promise(async (resolve, reject) => {
        try {
            if (!isObject(req)) return reject("CLmodel find req 要为 对象");

            /** 调整 req */
            let errMsg = regulateReq(req, { CLdoc, payload: MToptions.payload, regulates: ["filter", "projection", "find"] });
            if (errMsg) return reject(errMsg);
            // req.lookup

            let cursor = await COLLECTION
                .find(req.match)
                .project(req.projection)
                .skip(req.skip)
                .limit(req.limit)
                .sort(req.sort)

            let docs = await cursor.toArray();
            await cursor.close();
            return resolve(docs);
        } catch (e) {
            return reject(e);
        }
        // finally { cursor.close(); }
    }),


    findOne: (req = {}, MToptions) => new Promise(async (resolve, reject) => {
        try {
            const { filter = {} } = req;
            if (!isObjectIdAbs(filter._id)) return reject("CLmodel findOne 需要在filter中 _id的类型为 ObjectId");

            /** 调整 req */
            let errMsg = regulateReq(req, { CLdoc, payload: MToptions.payload, regulates: ["filter", "projection"] });
            if (errMsg) return reject(errMsg);

            MToptions.projection = req.projection;
            // req.lookup
            let doc = await COLLECTION.findOne(req.match, MToptions);
            return resolve(doc);
        } catch (e) {
            return reject(e);
        }
    })
})