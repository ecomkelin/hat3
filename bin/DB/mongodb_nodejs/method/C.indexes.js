module.exports = (COLLECTION, CLdoc, CLoptions) => ({

    createIndex: (req, MToptions) => new Promise(async (resolve, reject) => {
        try {
            Object.keys(req).forEach(key => delete req[key]);   // 用不到上游/前台 传递的数据

            const {createIndex, options = {}, commitQuorum} = MToptions;

            let result = await COLLECTION.createIndex(createIndex, options);
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
        // finally { cursor.close(); }
    }),


    dropIndex: (req, MToptions) => new Promise(async (resolve, reject) => {
        try {
            Object.keys(req).forEach(key => delete req[key]);   // 用不到上游/前台 传递的数据

            const {dropIndex} = MToptions;
            let result = await COLLECTION.dropIndex(dropIndex);
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
        // finally { cursor.close(); }
    }),


    indexes: (req, MToptions) => new Promise(async (resolve, reject) => {
        try {
            Object.keys(req).forEach(key => delete req[key]);   // 用不到上游/前台 传递的数据

            let result = await COLLECTION.indexes();
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
        // finally { cursor.close(); }
    }),
})