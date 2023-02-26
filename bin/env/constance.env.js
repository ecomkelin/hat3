/* ======================================== 系统 ======================================== */
/** 运行环境 */
IS_PRD = IS_DEV = IS_DEBUG = false;
switch(process.env.NODE_ENV) {
    case "production": IS_PRD = true; break;
    case "debug": IS_DEBUG = true; break;
    default: IS_DEV = true; 
}
if (IS_PRD) {
    console.log = () => { };
    console.debug = () => { };
} else if (IS_DEV) {
    console.debug = () => { };
}

/** mongodb是否为复制集 */
IS_REPLICA = (process.env.IS_REPLICA == 'true') ? true : false;

/** token */
ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "2195878fc68cd315b643ae9b7459689d4d1f352c91b47e382496093abfca01db99c0559823ead7ea41ca414369a737e348b9be1c253f9b193b8f09f03fcba710"
ACCESS_TOKEN_EX = process.env.ACCESS_TOKEN_EX || "30d";
REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "52e0be8a2ab783e1df725a778105388d2674ead419461d0f8fe13d211814e7658015bb4617824a380f01b5a7c118f8b8082e36e5035670c62541f0ea24bdd996"
REFRESH_TOKEN_EX = process.env.REFRESH_TOKEN_EX || "90d";
SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR) || 10;


/** 静态文件夹路径 */
DIR_PUBLIC = path.resolve(process.cwd(), "public/");
UPLOAD = "/upload"
ABBR = "/abbr"

/** ObjectId */
ObjectId = require("mongodb").ObjectId;


/** 关于 角色的分类 */
role_all = [10, 20, 30, 40, 100];
role_pder = [10, 20, 30]



/** 因为要在 初始值时用到 UserCL 如果引用 src文件夹下的文件的话 不好找 */
UserCL=null;


/** CLdoc 中大部分文档都需要的 */
docBasic = {
    is_usable: {type: Boolean, default: true},

    sort: {type: Number, default: 0},

    at_crt: {
        type: Date,
        AUTO_Date: true,
        IS_fixed: true
    },
    at_upd: {
        type: Date,
        AUTO_Date: true
    },
    crt_User: {
        type: ObjectId,
        ref: 'User',
        AUTO_payload: "_id",
        IS_fixed: true
    },
    upd_User: {
        type: ObjectId,
        ref: 'User',
        AUTO_payload: "_id",
    }
}
