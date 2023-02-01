关于 CLoptions 的配置项

    1 本集合中是否有字段需要加密
    needEncryption:{
        method: "md5",                  // 加密方法 默认用 md5 之后有机会再把 加密模块加进来
        fields: String / Array[String]  // 哪个字段需要加密 比如  fields: "pwd"     或者 fields: ["pwd", "token"]
    }

    2 关于集合的索引
    indexesObj:{} / [{}]                // 一般用于 createIndex / dropIndex

    3 自动生成路由
    Routes: {
        countDocuments: {},
        find: {
            restrict: { },      // 可以在此处 做限制
            api: { }            // api接口展示
        },
        findOne: {},

        deleteMany: {},
        deleteOne: {},
        insertMany: {},
        insertOne: {},
        updateMany: {},
        updateOne: {},

        indexes: {},
        createIndex:{},
        // dropIndex: {},
    }