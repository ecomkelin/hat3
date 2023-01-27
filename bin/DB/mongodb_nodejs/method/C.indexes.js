module.exports = (COLLECTION, CLdoc, CLoptions) => ({

    createIndex: (req, MToptions) => new Promise(async (resolve, reject) => {
        try {
            Object.keys(req).forEach(key => delete req[key]);   // 用不到上游/前台 传递的数据

            const {options = {}, commitQuorum} = MToptions;

            const createObj = CLoptions.indexesObj;
            if(createObj) {
                let result = await COLLECTION.createIndex(createObj, options);
                return resolve(result);
            } else {
                return reject("此集合 不可创建 索引")
            }

        } catch (e) {
            return reject(e);
        }
        // finally { cursor.close(); }
    }),


    dropIndex: (req, MToptions) => new Promise(async (resolve, reject) => {
        try {
            Object.keys(req).forEach(key => delete req[key]);   // 用不到上游/前台 传递的数据

            const dropObj = CLoptions.indexesObj;
            if(dropObj) {
                let result = await COLLECTION.dropIndex(dropObj);
                return resolve(result);
            } else {
                return reject("此集合 不可删除 索引")
            }
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