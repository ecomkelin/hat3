/** Category Front 前台类目 */
const DB = require(path.join(process.cwd(), "bin/DB"));
const CLname = "Catef";

const CLdoc = {
    code: {
        type: String,
        required: true,
        unique: true,
        MIN: 1,
        MAX: 8
    },
    Pds: [{
        type: ObjectId,
        ref: 'Pd'
    }],
    icon: {
        type: String,
        ALLOW_upload: true
    },

    desc: { type: String },

    show_list: {type: Boolean},
    show_home: {type: Boolean},
    show_cart: {type: Boolean},
    show_profile: {type: Boolean},

    ...docBasic
}

const CLoptions = {
    indexesObj: { "code": 1 },

    Routes: {
        countDocuments: {},
        find: {
            parseAfter: ({reqBody, Koptions: {payload = {}}}) => {
                reqBody.sort = {sort: -1};
                if(!payload.role) {
                    if(reqBody.match)reqBody.match.is_usable = true;
                    else reqBody.match = {is_usable: true};

                    console.log(1111, reqBody)
                }
            },
        },
        findOne: {},
        insertOne: { roles: role_pder },
        insertMany: { roles: role_pder },
        updateOne: { roles: role_pder },
        updateMany: { roles: role_pder },
        deleteOne: { roles: role_pder },

        deleteMany: { roles: role_pder },
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);;