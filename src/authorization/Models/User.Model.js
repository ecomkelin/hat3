const DB = require("../../../bin/DB");
const CLname = "User";

const CLdoc = {
    code: {
        type: String,
        unique: true,
        MIN: 2,
        MAX: 4
    },
    name: {
        type: String,
        // IS_fixed: true,
        // unique: true,
    },
    addrs: [{
        city: { type: String },
        via: { type: String }
    }]
}

const CLoptions = {
    GenRoute: {
        countDocuments: {},
        find: {
            // restrict: { },
            api: { }
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
}

module.exports = DB(CLname, CLdoc, CLoptions);