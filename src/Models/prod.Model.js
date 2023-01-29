const DB = require(path.join(process.cwd(), "bin/DB"));

const CLname = "Prod";

const CLdoc = {
    code: {
        type: String,
        unique: true,
        MAX: 3
    },
    name: {
        required: true,
        type: String
    },
    at_crt: {
        type: Date,
        AUTO_Date: true
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
        insertOne: {}
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);