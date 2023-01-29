const DB = require(path.join(process.cwd(), "bin/DB"));

const CLname = "Picture";

const CLdoc = {
    categary: { type: String, CONF: {vals: ['image']} },
    name: { type: String },
    ext: { type: String },

    url: { type: String },
    size: { type: String },
    info: { type: String }
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
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);