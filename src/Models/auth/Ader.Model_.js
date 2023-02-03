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
    Routes: {
        find: {
            // restrict: {
            //     types: [],   // payload 类型 如 Ader User Supplier Client
            //     roles: [],   // payload 角色 如 
            //     vips: [],    // vip
            // }
        },
        deleteMany: {},
        deleteOne: {},
        insertOne: {},
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);