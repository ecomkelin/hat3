const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Firm";

const CLdoc = {
    code: {
        type: String,
        // unique: true,
        MIN: 2,
        MAX: 4
    }
}

const CLoptions = {
    AutoRoute: {
        find: { },
        deleteMany: {},
        deleteOne: {},
        insertOne: {},
        updateOne: {},
        // indexes: {},
        // createIndex:{},
        // dropIndex: {},
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);