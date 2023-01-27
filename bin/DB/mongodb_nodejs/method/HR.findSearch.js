const { countDocuments, find, findOne } = require("./A.read");

module.exports = (COLLECTION, CLdoc, CLoptions) =>
    (query = {}, MToptions = {}) => new Promise(async (resolve, reject) => {
        try {
            let count = await countDocuments(COLLECTION, CLdoc, CLoptions)(query, MToptions);
            let docs = await find(COLLECTION, CLdoc, CLoptions)(query, MToptions);
            let doc = null;
            if (docs.length === 0) {
                doc = await findOne(COLLECTION, CLdoc, CLoptions)(query, MToptions);
            }
            return resolve({ count, docs, doc });
        } catch (e) {
            return reject(e);
        }
    });