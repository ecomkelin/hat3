/** 数据库连接 */
const { MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.DB_URL);
let DB = mongoClient.db(process.env.DBname);
const DBnames = [process.env.DBname];

/** 复制集配置 */
let replication = require("../config/replication") || {};


/** 加载连接的方法 */
const Aread = require("./method/A.read");
const Awrite = require("./method/A.write");
const Cindexes = require("./method/C.indexes");

module.exports = (CLname, CLdoc, CLoptions = {}) => {
    /** 如果 集合的复制集配置有特殊要求 则覆盖全局 */
    const options = {replication}

    if(CLoptions.replication) {
        options.replication = CLoptions.replication;
        delete CLoptions.replication;
    }

    /** 如果 有不是本数据库的 集合 则创建新的数据库 */
    if(CLoptions.DBname && !DBnames.includes(CLoptions.DBname))  {  
        DB = mongoClient.db(CLoptions.DBname);
        DBnames.push(CLoptions.DBname);
    }

    /** 创建 集合模型对象 */
    const COLLECTION = DB.collection(CLname);

    /** 一些数据库的 读方法 */
    const readMethod = Aread(COLLECTION, CLdoc, CLoptions, options);
    const writeMethod = Awrite(COLLECTION, CLdoc, CLoptions, options);
    const indexesMethod = Cindexes(COLLECTION, CLdoc, CLoptions, options);

    /** 暴露数据模型 */
    return {
        /** CLmodel 的配置信息 */
        mongoClient,    // 在做数据库事物时，会用到
        // DB,
        COLLECTION,      // 方便调用原生数据库方法
        CLname,          // 暴露此信息 以便知道在用哪个 Model
        CLdoc,           // 数据模型中的文档
        CLoptions,       // 方便通过 CLmodel 数据文档的一些配置

        /** 数据库的读写方法 */
        ...readMethod,
        ...writeMethod,

        /** 关于索引的方法 */
        ...indexesMethod,
    }
};