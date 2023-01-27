const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.DB_URL);



const Aread = require("./method/A.read");
const Awrite = require("./method/A.write");
const Cindexes = require("./method/C.indexes");

const findSearchJS = require("./method/HR.findSearch");
const findByIdJS = require("./method/HR.findById");

/** 复制集配置 */
let replicationOptions = require("../config/replication") || {};

/**
 * 这些参数 是 XXX.Model.js 传递过来的
 * @param {*} CLname  集合名称
 * @param {*} CLdoc 集合模型
 * @param {*} CLoptions 其他参数
 *          replicationOptions： 复制集参数
 *          // GenRoute: {'find': {}, 'findOne', 'deleteOne', 'insertOne', 'updateOne'} // 自动生成基础方法 在router那配置 还没想好 先不用 只让User通过
 * @returns 
 */

    /** 返回的 各种方法 find findOne insertMany .... 包含的参数
     * 这些参数是 执行的方法 method 传递过来的 
     * @param {*} query 
     * @param {*} MToptions 
     *          payload: 身份参数
     *          replicationOptions： 如果有复制集参数 则覆盖 CLoptions
     *          session: trasaction 事务 这个还有点问题
     * @returns 
     */
let DB = mongoClient.db(process.env.DBname);
const DBnames = [process.env.DBname];
module.exports = (CLname, CLdoc, CLoptions = {}) => {
    /** 如果 集合的复制集配置有特殊要求 则覆盖全局 */
    if(CLoptions.replicationOptions) replicationOptions = { ...replicationOptions, ...CLoptions.replicationOptions };
    CLoptions.replicationOptions = replicationOptions;

    /** 如果 有不是本数据库的 集合 则创建新的数据库 */
    if(CLoptions.DBname && !DBnames.includes(CLoptions.DBname))  {  
        DB = mongoClient.db(CLoptions.DBname);
        DBnames.push(CLoptions.DBname);
    }

    /** 创建 集合模型对象 */
    const COLLECTION = DB.collection(CLname);

    /** 一些数据库的 读方法 */
    const readMethod = Aread(COLLECTION, CLdoc, CLoptions);
    const writeMethod = Awrite(COLLECTION, CLdoc, CLoptions);
    const indexesMethod = Cindexes(COLLECTION, CLdoc, CLoptions);

    /** 暴露集合方法 */
    return {
        mongoClient,
        // DB,
        COLLECTION,      // 如果暴露此信息 则可以使用原生数据库方法
        CLname,             // 暴露此信息 以便知道在用哪个 Model
        CLdoc,
        CLoptions,

        ...readMethod,
        ...writeMethod,

        ...indexesMethod,

        findSearch: findSearchJS(COLLECTION, CLdoc, CLoptions),
        findById: findByIdJS(COLLECTION, CLdoc, CLoptions),
    }
};