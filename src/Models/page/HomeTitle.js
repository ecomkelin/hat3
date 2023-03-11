const DB = require(path.join(process.cwd(), "bin/DB"));

const CLname = "HomeTitle";

const CLdoc = {
    /** 之后可以做优化如果不是唯一的 那说明 另一张图片被覆盖了 */
    code: {
        type: String,
        default: 'weixin',
        unique: true
    },
    img: {
        type: String,
        ALLOW_upload: true
    },
}

const CLoptions = {
    api: {

    },
    Routes: {
        find: { roles: [10], },
        findOne: { roles: [10], },

        deleteMany: { roles: [10], },
        deleteOne: { roles: [10], },

        insertMany: { roles: [10], },
        insertOne: { roles: [10], },
        updateMany: { roles: [10], },
        updateOne: { roles: [10], },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);