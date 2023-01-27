module.exports = (COLLECTION, CLdoc, CLoptions, options) => ({

    createIndex: (req, MToptions) => new Promise(async (resolve, reject) => {
        try {
            Object.keys(req).forEach(key => delete req[key]);   // 用不到上游/前台 传递的数据

            // const {commitQuorum} = options;  // createIndex 中的options 独有的参数 现在还不知道什么作用 也不知道放在什么地方

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
                let result = await COLLECTION.dropIndex(dropObj, options);
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
            // 这里没有options
            let result = await COLLECTION.indexes();
            return resolve(result);
        } catch (e) {
            return reject(e);
        }
        // finally { cursor.close(); }
    }),
})