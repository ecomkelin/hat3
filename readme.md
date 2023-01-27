Holartec 系统


待解决问题
    1 mongodb 新版本 6.0 
        - 复制集 链接访问问题
        - 事务 session 问题
    2 mongoose 与 mongodb_nodejs 两个数据库的引用优化


特色：
由文件夹及文件名称暴露接口
    接口文件必须有两个 . 拆分三个字符串 最后一个必须是 js
    中间的字符串 定义此文件接口：

    1 对外暴露的功能api 只读取以下5种结尾的文件 ['api', 'get', 'post', 'put', 'delete'].js
        以 XXX.api.js 结尾的文件
            函数必须以对象的方式暴露 才能生效 exports.XXXX 或者 module.exports = {xxx}
            对象的名称内至少包含一个下划线 '_' 才能生效
                下划线之前的字符为 ['get', 'post', 'put', 'delete'] 其中一个否则视为get
    2 对外暴露 数据模型 只读取 XXX.Model.js 结尾的文件
        自动暴露基础模型的基础api 
                GenRoute: {
                    countDocuments: {},
                    find: {
                        restrict: {},
                        api:{}
                    },
                    findOne: {},
                    deleteMany: {},
                    deleteOne: {},
                    insertMany: {},
                    insertOne: {},
                    updateMany: {},
                    updateOne: {},
                    indexes: {},
                }
    3 对外暴露 配置数据 只读取 XXX.conf.js 结尾的文件 建议只在 config文件夹下写

    不是两个 . 的文件 路由器一律不访问 也就是说 普通函数文件可以放置在文件夹内
    文件夹如果有下划线 则路由不访问里面的内容 这是为了代码方便



数据模型的包装方法参数 是两个对象
    设计思路 第一个参数[命名为req]接受前端传递的参数 第二个参数[命名为MToption]传递后端给的参数
    req:  {filter, projection, skip, limit, sort, lookup, document, documents, update}
        存储前端给的数据 并通过一些手段对这些数据进行筛选

        filter:  { _id, search, match = {}, includes = {}, excludes = {}, lte = {}, gte = {}, at_before = {}, at_after = {} }
            _id 作为一个过滤单个文档的简单写法 还可以作为判断是否为单个查询

            search: { fields, keywords};
                fields: String / Array[String],             // 必须为文档的某字段 如 ["code", "name"]
                keywords: String                            // 模糊匹配的关键词        如 "li"
                最终表达的类型为 query: {"$or": [{code: {"$regex": "li", $options: 'i'}}, {name: {"$regex": "li", $options: 'i'}}]}

            match: { }      // 精确匹配非ObjectId类型的 字段        如 ： "code": "002", 
                可以使用 {"addrs.via": "orsiera"}
                也可以使用 {"addrs": {"$elemMatch": {via: "orsiera}}}
                最终表达的类型为 query: {"code": "002"}

            includes: {}    // 精确匹配 ObjectId 类型的 字段    
                如      Firm: "63d0565b025022a0bfd8c6b8", 
                或者    Firm: ["63d0565b025022a0bfd8c6b8", "63d0565b025022a0bfd8c6b9"]
                其中的值 可以是对象 如果是对象的话 里面必须有 _id
                如      Firm: {_id: "63d0565b025022a0bfd8c6b8", code: "***"}
                最终表达的类型为 query: {"Firm": ObjectId("63d0565b025022a0bfd8c6b8"), "User": ObjectId("63d0565b025022a0bfd8c6b4")}
                或者 query: {"Firm": {"$in": [ObjectId("63d0565b025022a0bfd8c6b8"), ObjectId("63d0565b025022a0bfd8c6b9")]} }

            excludes: {}    // 暂时未开放

            lte: {}     // 如 age : 35, weight: 70
                最终表达的类型为 query: {"age": {"$lte": 35}, "weight": {"$lte": 70} }
            gte: {}     // 

            at_before: {} // 如 at_upd(字段): 2022/01/13(格式) 
                可以为以下几种格式 日期后的字段可以省略 因为是以天为单位
                "yyyy/MM/dd hh:mm:ss"
                "month dd,yyyy hh:mm:ss"
                也可以是时间戳
                最终表达的类型为 query: {"at_upd": {"$lte": 1674742936770} }

            at_after: {}    //

        project: {}     // 中不能同时存在 0 和 非0 的两种状态  如 code: 1, name: "姓名"  字段的映射
            // 可以使用 {"addrs.city": 1}

        update: {}
            可以有 {"$set": {}, "$mul": {}, "$inc": {}, /* "$unset": {}, "$rename": {} */ }
            如果直接就是 doc 对象 则相当于默认为 $set





    find:                   {filter, project={}, skip, limit, sort, lookup} = req
    findOne                 {filter, project={}, lookup} = req
    deleteMany / deleteOne: {filter} = req
    insertMany              { documents } = req;
    insertOne               {document} = req;
    updateMany / updateOne: {filter = {}, update={}} = req;

    关于 MToptions
    里面存储了 payload 身份 读写方式 等 一些必须由后端给的数据
缺点限制：
    1 限制写死了， 必须根据规则来