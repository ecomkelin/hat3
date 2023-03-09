const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Client";

const CLdoc = {
    providerId: {
        type: String,
        unique: true,
        required: true,
        IS_fixed: true,
    },

    code: {
        type: String,
        unique: true,
        required: true,
        // IS_fixed: true,
        REGEXP: '^[a-z0-9]*$', MIN: 4, MAX: 10
    },
    pwd: {
        type: String,
        required: true,
        ENcryption: "md5", // 加密方式
        MIN: 6,
        MAX: 15
    },

    name: { type: String },
    tel: { type: String },
    city: { type: String },
    addr: { type: String },

    ships: [{
        name: { type: String },
        tel: { type: String },

        city: { type: String },
        addr: { type: String },
    }],
    // addrs: [{type: String}],


    is_usable: { type: Boolean, default: true },
    sort: { type: Number, default: 0 },
    at_crt: {
        type: Date,
        AUTO_Date: true,
        IS_fixed: true
    },
    at_upd: {
        type: Date,
        AUTO_Date: true
    },
}

const { stringMatchHash } = require(path.resolve(process.cwd(), 'core/crypto/Bcrypt'));
const CLoptions = {
    indexesObj: { "code": 1 },

    Routes: {
        countDocuments: {},
        find: {
            roles: [10],
        },
        findOne: {
            roles: [10],
        },
        updateOne: {
            roles: [10],
        },
        updateMany: {
            roles: [10],
        },
    },
}

const UserCL = DB(CLname, CLdoc, CLoptions);
module.exports = UserCL;
// module.exports = DB(CLname, CLdoc, CLoptions);;