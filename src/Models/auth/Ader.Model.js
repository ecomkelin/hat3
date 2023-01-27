const DB = require(path.join(process.cwd(), "bin/DB"));

const CLname = "Ader";

const CLdoc = {
    code: {
        type: String
    },
    pwd: {
        type: String
    }
}

const CLoptions = {
    GenRoute: {
        find: {
            // restrict: {
            //     types: [],   // payload 类型 如 Ader User Supplier Client
            //     roles: [],   // payload 角色 如 
            //     vips: [],    // vip
            // }
        },
        findOne: {},
        deleteMany: {},
        deleteOne: {},
        insertMany: {},
        insertOne: {},
        updateMany: {},
        updateOne: {},
    }
}
let a = {a: 1, b: 2}

module.exports = DB(CLname, CLdoc, CLoptions);