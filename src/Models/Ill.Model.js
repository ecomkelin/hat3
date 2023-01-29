const DB = require(path.join(process.cwd(), "bin/DB"));

const CLname = "Ill";

const CLdoc = {
    name: {
        type: String,
    },
    info: {
        type: String
    },
    symptom: {
        type: Date,
    },
    cause: {
        type: String
    },
    prevent: {
        type: String
    },
    treat: {
        type: String
    },
    img: {
        type: String
    },
    video: {
        type: String
    },
    music: {
        type: String
    },

    cat_one: {
        type: ObjectId,
        ref: "Cat"
    },

    cat_two: {
        type: ObjectId,
        ref: "Cat"
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
        insertOne: {}
    }
}

module.exports = DB(CLname, CLdoc, CLoptions);