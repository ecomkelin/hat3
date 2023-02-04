const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const url = process.env.DB_URL + "/" + process.env.DBname;
const DB = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = (CLname, CLdoc, CLoptions = {versionKey: false }) => {
    /** mongoose.model(p1, new Schema(p2, p3), p4) 
     * p1 为collection的 nickname 方便使用
     * p2 为模型对象
     * p3 对象
     *      versionKey: false 则不会给集合 加入 _ _ v 这个mongoose 自动添加的字段
     * p4 让mongoose 生成的 集合名称 如果不给 mongoose 会把nickname小写再加s
    */
    const COLLECTION = DB.model(CLname, new Schema(CLdoc, CLoptions), CLname);

    return {
        COLLECTION,
        CLname,
        CLdoc,
        CLoptions,      // 这个option 是 Model模型给的 此Collection的总的 下面的options是每次操作数据时给的

        countDocuments: (query = {}, options = {}) => new Promise(async (resolve, reject) => {
            try {
                await readCheck(CLdoc, query, CLoptions, options);
                let count = await COLLECTION.countDocuments(query, options);

                return resolve(count);
            } catch (e) {
                return reject(e);
            }
        }),

        find: (query = {}, options = {}) => new Promise(async (resolve, reject) => {
            try {
                const { projection = {} } = options;
                let docs = await COLLECTION.find(query, projection);
                return resolve(docs);
            } catch (e) {
                return reject(e);
            }
        }),
        findOne: (query = {}, options = {}) => new Promise(async (resolve, reject) => {
            try {
                const { projection = {} } = options;
                let doc = await COLLECTION.findOne(query, projection);
                return resolve(doc);
            } catch (e) {
                return reject(e);
            }
        }),
        deleteMany: (query, options) => new Promise(async (resolve, reject) => {
            try {
                let result = await COLLECTION.deleteMany(query, options);
                return resolve(result);
            } catch (e) {
                return reject(e);
            }
        }),
        deleteOne: (query, options) => new Promise(async(resolve, reject) => {
            try {
                let result = await COLLECTION.deleteOne(query, options);
                return resolve(result);
            } catch (e) {
                return reject(e);
            } 
        }),

        insertMany: (documents, options) => new Promise(async(resolve, reject) => {
            try {
                let result = await COLLECTION.insertMany(documents);
                return resolve(result);
            } catch (e) {
                return reject(e);
            } 
        }),
        insertOne: (document, options={}) => new Promise(async(resolve, reject) => {
            try {
                if(!isObject(document)) return reject("insertOne 错误: 第一个参数document 必须是： object 即 {} ");
                let result = await COLLECTION.create(document);
                return resolve(result);
            } catch (e) {
                return reject(e);
            } 
        }),
        updateMany: (query={}, documents, options={}) => new Promise(async(resolve, reject) => {
            try {
                if(!isObject(query)) return reject("updateOne 错误: 第一个参数query 必须是： object 即 {} ");
                // if(!isObject(document)) return reject("updateOne 错误: 第一个参数document 必须是： object 即 {} ");
                if(!isObject(options)) return reject("updateOne 错误: 第一个参数options 必须是： object 即 {} ");
    
                let result = await COLLECTION.updateMany(query, documents, options);
                return resolve(result);
            } catch (e) {
                return reject(e);
            } 
        }),
        updateOne: (query={}, document, options={}) => new Promise(async(resolve, reject) => {
            try {
                if(!isObject(query)) return reject("updateOne 错误: 第一个参数query 必须是： object 即 {} ");
                if(!isObject(document)) return reject("updateOne 错误: 第一个参数document 必须是： object 即 {} ");
                if(!isObject(options)) return reject("updateOne 错误: 第一个参数options 必须是： object 即 {} ");
    
                let result = await COLLECTION.updateOne(query, document, options);
                return resolve(result);
            } catch (e) {
                return reject(e);
            } 
        }),

        // indexes: indexesJS(COLLECTION, CLdoc, CLoptions),
        // createIndex: createIndexJS(COLLECTION, CLdoc, CLoptions),
        // dropIndex: dropIndexJS(COLLECTION, CLdoc, CLoptions),

        // findSearch: findSearchJS(COLLECTION, CLdoc, CLoptions),
        // findById: findByIdJS(COLLECTION, CLdoc, CLoptions),


    }
};