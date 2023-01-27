const { findOne } = require("./A.read");

module.exports = (COLLECTION, CLdoc, CLoptions) =>
    (_id, MToptions) => new Promise(async (resolve, reject) => {
        try {
            _id = newObjectId(_id);

            let doc = await findOne(COLLECTION, CLdoc, CLoptions)({ _id }, MToptions);

            return resolve(doc);
        } catch (e) {
            return reject(e);
        }
    })